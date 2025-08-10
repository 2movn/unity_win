import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { executeCommandSafe, executePowerShellScript } from './CommandHelper';

const execAsync = promisify(exec);

interface AnalysisItem {
  name: string;
  size: number;
  category: string;
  details?: {
    folders: string[];
    fileCount: number;
    largestFiles: Array<{name: string, size: number}>;
    lastModified: Date;
  };
}

export class SystemAnalysisService {
  
  async analyzeSystemForCleanup(): Promise<AnalysisItem[]> {
    const results: AnalysisItem[] = [];
    
    try {
      // Phân tích Temporary Files
      const tempPath = process.env.TEMP || os.tmpdir();
      const tempAnalysis = await this.analyzeDirectory(tempPath, 'Temporary Files', 'cache');
      results.push(tempAnalysis);

      // Phân tích Windows Update Cache
      const windowsUpdatePath = path.join(process.env.SYSTEMROOT || 'C:\\Windows', 'SoftwareDistribution', 'Download');
      const windowsUpdateAnalysis = await this.analyzeDirectory(windowsUpdatePath, 'Windows Update Cache', 'cache');
      results.push(windowsUpdateAnalysis);

      // Phân tích Browser Cache
      const browserAnalysis = await this.analyzeBrowserCache();
      results.push(browserAnalysis);

      // Phân tích System Cache
      const systemCacheAnalysis = await this.analyzeSystemCache();
      results.push(systemCacheAnalysis);

      // Phân tích Application Cache
      const appCacheSize = await this.getApplicationCacheSize();
      results.push({
        name: 'Application Cache',
        size: Math.round(appCacheSize / (1024 * 1024)),
        category: 'cache'
      });

      // Phân tích Recycle Bin
      const recycleBinSize = await this.getRecycleBinSize();
      results.push({
        name: 'Recycle Bin',
        size: Math.round(recycleBinSize / (1024 * 1024)),
        category: 'trash'
      });

      // Phân tích System Logs
      const systemLogsSize = await this.getSystemLogsSize();
      results.push({
        name: 'System Logs',
        size: Math.round(systemLogsSize / (1024 * 1024)),
        category: 'system'
      });

      // Phân tích DNS Cache
      results.push({
        name: 'DNS Cache',
        size: 1, // Thường rất nhỏ
        category: 'network'
      });

      // Phân tích Network Cache
      const networkCacheSize = await this.getNetworkCacheSize();
      results.push({
        name: 'Network Cache',
        size: Math.round(networkCacheSize / (1024 * 1024)),
        category: 'network'
      });

      // Phân tích Print Spooler Cache
      const printSpoolerSize = await this.getPrintSpoolerSize();
      results.push({
        name: 'Print Spooler Cache',
        size: Math.round(printSpoolerSize / (1024 * 1024)),
        category: 'system'
      });

      // Phân tích Windows Error Reports
      const errorReportsSize = await this.getErrorReportsSize();
      results.push({
        name: 'Windows Error Reports',
        size: Math.round(errorReportsSize / (1024 * 1024)),
        category: 'system'
      });

      // Phân tích Memory Dumps
      const memoryDumpsSize = await this.getMemoryDumpsSize();
      results.push({
        name: 'Memory Dumps',
        size: Math.round(memoryDumpsSize / (1024 * 1024)),
        category: 'system'
      });

      // Phân tích Old Files
      const oldFilesSize = await this.getOldFilesSize();
      results.push({
        name: 'Old Files',
        size: Math.round(oldFilesSize / (1024 * 1024)),
        category: 'trash'
      });

      // Phân tích Old Downloads
      const oldDownloadsSize = await this.getOldDownloadsSize();
      results.push({
        name: 'Old Downloads',
        size: Math.round(oldDownloadsSize / (1024 * 1024)),
        category: 'trash'
      });

      return results;
    } catch (error) {
      console.error('Lỗi khi phân tích hệ thống:', error);
      return [];
    }
  }

  private async getDirectorySize(dirPath: string): Promise<number> {
    try {
      if (!fs.existsSync(dirPath)) {
        console.log(`Directory không tồn tại: ${dirPath}`);
        return 0;
      }
      
      // Sử dụng Node.js method trực tiếp vì PowerShell có vấn đề
      const size = await this.getDirectorySizeNode(dirPath);
      
      if (size > 0) {
        console.log(`✅ ${dirPath}: ${Math.round(size / (1024 * 1024))} MB`);
      }
      
      return size;
    } catch (error) {
      console.error(`Error getting directory size for ${dirPath}:`, error);
      return 0;
    }
  }

  private async getDirectorySizeNode(dirPath: string, maxDepth: number = 5, currentDepth: number = 0): Promise<number> {
    try {
      if (!fs.existsSync(dirPath) || currentDepth > maxDepth) return 0;
      
      let totalSize = 0;
      let files: string[] = [];
      
      try {
        files = fs.readdirSync(dirPath);
      } catch (readError) {
        // Không thể đọc thư mục (quyền truy cập)
        return 0;
      }
      
      const promises: Promise<number>[] = [];
      
      for (const file of files) {
        promises.push(this.processFileOrDirectory(dirPath, file, maxDepth, currentDepth));
      }
      
      // Xử lý song song để tăng tốc độ
      const results = await Promise.allSettled(promises);
      
      for (const result of results) {
        if (result.status === 'fulfilled') {
          totalSize += result.value;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error(`Error processing directory ${dirPath}:`, error);
      return 0;
    }
  }

  private async processFileOrDirectory(dirPath: string, file: string, maxDepth: number, currentDepth: number): Promise<number> {
    try {
      const filePath = path.join(dirPath, file);
      
      // Bỏ qua một số file/folder hệ thống
      const skipItems = [
        '$RECYCLE.BIN', 'System Volume Information', 'pagefile.sys', 'hiberfil.sys',
        'swapfile.sys', 'DumpStack.log.tmp', '$WinREAgent', '$Windows.~BT', '$Windows.~WS'
      ];
      
      if (skipItems.includes(file)) {
        return 0;
      }
      
      let stats: fs.Stats;
      try {
        stats = fs.statSync(filePath);
      } catch (statError) {
        // Không thể lấy thống kê file (quyền truy cập hoặc file không tồn tại)
        return 0;
      }
      
      if (stats.isDirectory()) {
        // Recursive call với giới hạn độ sâu
        return await this.getDirectorySizeNode(filePath, maxDepth, currentDepth + 1);
      } else if (stats.isFile()) {
        return stats.size;
      } else {
        // Symbolic link hoặc loại file khác
        return 0;
      }
    } catch (error) {
      // Bỏ qua lỗi file cụ thể
      return 0;
    }
  }

  private async getBrowserCacheSize(): Promise<number> {
    let totalSize = 0;
    const userProfile = process.env.USERPROFILE;
    
    if (userProfile) {
      const browserPaths = [
        { name: 'Chrome', path: path.join(userProfile, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Cache') },
        { name: 'Edge', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data', 'Default', 'Cache') },
        { name: 'Firefox', path: path.join(userProfile, 'AppData', 'Local', 'Mozilla', 'Firefox', 'Profiles') },
        { name: 'Opera', path: path.join(userProfile, 'AppData', 'Local', 'Opera Software', 'Opera Stable', 'Cache') },
        { name: 'Brave', path: path.join(userProfile, 'AppData', 'Local', 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default', 'Cache') },
        { name: 'Vivaldi', path: path.join(userProfile, 'AppData', 'Local', 'Vivaldi', 'User Data', 'Default', 'Cache') },
      ];
      
      for (const browser of browserPaths) {
        const size = await this.getDirectorySize(browser.path);
        if (size > 0) {
          console.log(`🌐 ${browser.name} Cache: ${Math.round(size / (1024 * 1024))} MB`);
        }
        totalSize += size;
      }
    }
    
    return totalSize;
  }

  private async getSystemCacheSize(): Promise<number> {
    let totalSize = 0;
    const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
    
    const systemCachePaths = [
      { name: 'Prefetch', path: path.join(systemRoot, 'Prefetch') },
      { name: 'FontCache', path: path.join(systemRoot, 'FontCache') },
      { name: 'System INetCache', path: path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'INetCache') },
      { name: 'System WebCache', path: path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'WebCache') },
      { name: 'System Temp', path: path.join(systemRoot, 'Temp') },
    ];
    
    for (const cache of systemCachePaths) {
      const size = await this.getDirectorySize(cache.path);
      if (size > 0) {
        console.log(`⚙️ ${cache.name}: ${Math.round(size / (1024 * 1024))} MB`);
      }
      totalSize += size;
    }
    
    return totalSize;
  }

  private async getSystemLogsSize(): Promise<number> {
    let totalSize = 0;
    const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
    
    const logPaths = [
      { name: 'Event Logs', path: path.join(systemRoot, 'System32', 'winevt', 'Logs') },
      { name: 'System WER', path: path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'WER') },
      { name: 'Windows Logs', path: path.join(systemRoot, 'Logs') },
      { name: 'System32 Logs', path: path.join(systemRoot, 'System32', 'LogFiles') },
    ];
    
    for (const log of logPaths) {
      const size = await this.getDirectorySize(log.path);
      if (size > 0) {
        console.log(`📋 ${log.name}: ${Math.round(size / (1024 * 1024))} MB`);
      }
      totalSize += size;
    }
    
    return totalSize;
  }

  private async getNetworkCacheSize(): Promise<number> {
    let totalSize = 0;
    const userProfile = process.env.USERPROFILE;
    
    if (userProfile) {
      const networkPaths = [
        { name: 'INetCache', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'INetCache') },
        { name: 'WebCache', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'WebCache') },
        { name: 'History', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'History') },
        { name: 'Cookies', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'Cookies') },
        { name: 'Temporary Internet Files', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'Temporary Internet Files') },
      ];
      
      for (const network of networkPaths) {
        const size = await this.getDirectorySize(network.path);
        if (size > 0) {
          console.log(`🌐 ${network.name}: ${Math.round(size / (1024 * 1024))} MB`);
        }
        totalSize += size;
      }
    }
    
    return totalSize;
  }

  private async getPrintSpoolerSize(): Promise<number> {
    const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
    const spoolerPaths = [
      { name: 'Print Spooler', path: path.join(systemRoot, 'System32', 'spool', 'PRINTERS') },
      { name: 'Print Drivers', path: path.join(systemRoot, 'System32', 'spool', 'DRIVERS') },
      { name: 'Print Processors', path: path.join(systemRoot, 'System32', 'spool', 'PRTPROCS') },
    ];
    
    let totalSize = 0;
    for (const spooler of spoolerPaths) {
      const size = await this.getDirectorySize(spooler.path);
      if (size > 0) {
        console.log(`🖨️ ${spooler.name}: ${Math.round(size / (1024 * 1024))} MB`);
      }
      totalSize += size;
    }
    
    return totalSize;
  }

  private async getApplicationCacheSize(): Promise<number> {
    let totalSize = 0;
    const userProfile = process.env.USERPROFILE;
    
    if (userProfile) {
      const appCachePaths = [
        { name: 'AppData Local Temp', path: path.join(userProfile, 'AppData', 'Local', 'Temp') },
        { name: 'AppData Roaming Temp', path: path.join(userProfile, 'AppData', 'Roaming', 'Temp') },
        { name: 'Temporary Internet Files', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'Temporary Internet Files') },
        { name: 'Windows Temp', path: process.env.TEMP || os.tmpdir() },
      ];
      
      for (const appCache of appCachePaths) {
        const size = await this.getDirectorySize(appCache.path);
        if (size > 0) {
          console.log(`📱 ${appCache.name}: ${Math.round(size / (1024 * 1024))} MB`);
        }
        totalSize += size;
      }
    }
    
    return totalSize;
  }

  private async getErrorReportsSize(): Promise<number> {
    let totalSize = 0;
    const userProfile = process.env.USERPROFILE;
    
    if (userProfile) {
      const errorReportPaths = [
        { name: 'WER', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'WER') },
        { name: 'ErrorReports', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'ErrorReports') },
        { name: 'System WER', path: path.join(process.env.SYSTEMROOT || 'C:\\Windows', 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'WER') },
      ];
      
      for (const errorReport of errorReportPaths) {
        const size = await this.getDirectorySize(errorReport.path);
        if (size > 0) {
          console.log(`⚠️ ${errorReport.name}: ${Math.round(size / (1024 * 1024))} MB`);
        }
        totalSize += size;
      }
    }
    
    return totalSize;
  }

  private async getRecycleBinSize(): Promise<number> {
    try {
      let totalSize = 0;
      
      // Kiểm tra thùng rác trên các ổ đĩa phổ biến
      const drives = ['C:', 'D:', 'E:', 'F:'];
      
      for (const drive of drives) {
        try {
          const recycleBinPath = path.join(drive, '$Recycle.Bin');
          if (fs.existsSync(recycleBinPath)) {
            const size = await this.getDirectorySizeNode(recycleBinPath, 3);
            if (size > 0) {
              console.log(`🗑️ Recycle Bin on ${drive}: ${Math.round(size / (1024 * 1024))} MB`);
              totalSize += size;
            }
          }
        } catch (driveError) {
          // Bỏ qua ổ đĩa không thể truy cập
          continue;
        }
      }
      
      if (totalSize > 0) {
        console.log(`🗑️ Recycle Bin Total: ${Math.round(totalSize / (1024 * 1024))} MB`);
      }
      
      return totalSize;
    } catch (error) {
      console.error('Error getting recycle bin size:', error);
      return 0;
    }
  }

  private async getMemoryDumpsSize(): Promise<number> {
    const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
    const memoryDumpPaths = [
      { name: 'Minidump', path: path.join(systemRoot, 'Minidump') },
      { name: 'Memory Dumps', path: path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'WER', 'ReportQueue') },
      { name: 'Crash Dumps', path: path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'WER', 'ReportArchive') },
    ];
    
    let totalSize = 0;
    for (const dump of memoryDumpPaths) {
      const size = await this.getDirectorySize(dump.path);
      if (size > 0) {
        console.log(`💾 ${dump.name}: ${Math.round(size / (1024 * 1024))} MB`);
      }
      totalSize += size;
    }
    
    return totalSize;
  }

  private async getOldFilesSize(): Promise<number> {
    let totalSize = 0;
    const userProfile = process.env.USERPROFILE;
    
    if (userProfile) {
      const oldFilePaths = [
        { name: 'Desktop', path: path.join(userProfile, 'Desktop') },
        { name: 'Documents', path: path.join(userProfile, 'Documents') },
        { name: 'Pictures', path: path.join(userProfile, 'Pictures') },
        { name: 'Music', path: path.join(userProfile, 'Music') },
        { name: 'Videos', path: path.join(userProfile, 'Videos') },
      ];
      
      for (const oldFile of oldFilePaths) {
        const size = await this.getOldFilesInDirectory(oldFile.path);
        if (size > 0) {
          console.log(`📁 ${oldFile.name} (old files): ${Math.round(size / (1024 * 1024))} MB`);
        }
        totalSize += size;
      }
    }
    
    return totalSize;
  }

  private async getOldFilesInDirectory(dirPath: string): Promise<number> {
    try {
      if (!fs.existsSync(dirPath)) return 0;
      
      let totalSize = 0;
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < thirtyDaysAgo) {
          if (stats.isDirectory()) {
            totalSize += await this.getOldFilesInDirectory(filePath);
          } else {
            totalSize += stats.size;
          }
        }
      }
      
      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  private async getOldDownloadsSize(): Promise<number> {
    const downloadsPath = path.join(process.env.USERPROFILE || '', 'Downloads');
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    
    const size = await this.getOldFilesInDirectoryByDate(downloadsPath, ninetyDaysAgo);
    if (size > 0) {
      console.log(`📥 Downloads (old files): ${Math.round(size / (1024 * 1024))} MB`);
    }
    
    return size;
  }

  private async getOldFilesInDirectoryByDate(dirPath: string, cutoffDate: number): Promise<number> {
    try {
      if (!fs.existsSync(dirPath)) return 0;
      
      let totalSize = 0;
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffDate) {
          if (stats.isDirectory()) {
            totalSize += await this.getOldFilesInDirectoryByDate(filePath, cutoffDate);
          } else {
            totalSize += stats.size;
          }
        }
      }
      
             return totalSize;
     } catch (error) {
       return 0;
     }
   }

   private async analyzeDirectory(dirPath: string, name: string, category: string): Promise<AnalysisItem> {
     try {
       if (!fs.existsSync(dirPath)) {
         console.log(`Directory không tồn tại: ${dirPath}`);
         return {
           name,
           size: 0,
           category,
           details: {
             folders: [],
             fileCount: 0,
             largestFiles: [],
             lastModified: new Date()
           }
         };
       }

       const analysis = await this.getDetailedDirectoryAnalysis(dirPath);
       
       if (analysis.totalSize > 0) {
         console.log(`📊 ${name}: ${Math.round(analysis.totalSize / (1024 * 1024))} MB (${analysis.fileCount} files)`);
       }
       
       return {
         name,
         size: Math.round(analysis.totalSize / (1024 * 1024)),
         category,
         details: {
           folders: analysis.folders,
           fileCount: analysis.fileCount,
           largestFiles: analysis.largestFiles,
           lastModified: analysis.lastModified
         }
       };
     } catch (error) {
       console.error(`Lỗi phân tích thư mục ${dirPath}:`, error);
       return {
         name,
         size: 0,
         category
       };
     }
   }

   private async getDetailedDirectoryAnalysis(dirPath: string): Promise<{
     totalSize: number;
     folders: string[];
     fileCount: number;
     largestFiles: Array<{name: string, size: number}>;
     lastModified: Date;
   }> {
     let totalSize = 0;
     let fileCount = 0;
     const folders: string[] = [];
     const allFiles: Array<{name: string, size: number, path: string}> = [];
     let lastModified = new Date(0);

     const analyzeRecursive = async (currentPath: string): Promise<void> => {
       try {
         if (!fs.existsSync(currentPath)) return;

         const items = fs.readdirSync(currentPath);
         
         for (const item of items) {
           const itemPath = path.join(currentPath, item);
           const stats = fs.statSync(itemPath);
           
           if (stats.isDirectory()) {
             folders.push(itemPath);
             await analyzeRecursive(itemPath);
           } else {
             totalSize += stats.size;
             fileCount++;
             allFiles.push({
               name: item,
               size: stats.size,
               path: itemPath
             });
             
             if (stats.mtime > lastModified) {
               lastModified = stats.mtime;
             }
           }
         }
       } catch (error) {
         // Bỏ qua lỗi truy cập
       }
     };

     await analyzeRecursive(dirPath);

     // Sắp xếp file theo kích thước và lấy 5 file lớn nhất
     const largestFiles = allFiles
       .sort((a, b) => b.size - a.size)
       .slice(0, 5)
       .map(file => ({
         name: file.name,
         size: Math.round(file.size / (1024 * 1024))
       }));

     return {
       totalSize,
       folders: folders.slice(0, 10), // Giới hạn 10 folder
       fileCount,
       largestFiles,
       lastModified
     };
   }

   private async analyzeBrowserCache(): Promise<AnalysisItem> {
     let totalSize = 0;
     let fileCount = 0;
     const folders: string[] = [];
     const allFiles: Array<{name: string, size: number}> = [];
     let lastModified = new Date(0);

     const userProfile = process.env.USERPROFILE;
     
     if (userProfile) {
       const browserPaths = [
         { name: 'Chrome', path: path.join(userProfile, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Cache') },
         { name: 'Edge', path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data', 'Default', 'Cache') },
         { name: 'Firefox', path: path.join(userProfile, 'AppData', 'Local', 'Mozilla', 'Firefox', 'Profiles') },
         { name: 'Opera', path: path.join(userProfile, 'AppData', 'Local', 'Opera Software', 'Opera Stable', 'Cache') },
         { name: 'Brave', path: path.join(userProfile, 'AppData', 'Local', 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default', 'Cache') },
         { name: 'Vivaldi', path: path.join(userProfile, 'AppData', 'Local', 'Vivaldi', 'User Data', 'Default', 'Cache') },
       ];
       
       for (const browser of browserPaths) {
         try {
           if (fs.existsSync(browser.path)) {
             const analysis = await this.getDetailedDirectoryAnalysis(browser.path);
             totalSize += analysis.totalSize;
             fileCount += analysis.fileCount;
             folders.push(...analysis.folders);
             allFiles.push(...analysis.largestFiles);
             
             if (analysis.lastModified > lastModified) {
               lastModified = analysis.lastModified;
             }
             
             if (analysis.totalSize > 0) {
               console.log(`🌐 ${browser.name} Cache: ${Math.round(analysis.totalSize / (1024 * 1024))} MB (${analysis.fileCount} files)`);
             }
           }
         } catch (error) {
           // Bỏ qua lỗi
         }
       }
     }

     // Sắp xếp file theo kích thước và lấy 5 file lớn nhất
     const largestFiles = allFiles
       .sort((a, b) => b.size - a.size)
       .slice(0, 5);

     return {
       name: 'Browser Cache',
       size: Math.round(totalSize / (1024 * 1024)),
       category: 'cache',
       details: {
         folders: folders.slice(0, 10),
         fileCount,
         largestFiles,
         lastModified
       }
     };
   }

   private async analyzeSystemCache(): Promise<AnalysisItem> {
     let totalSize = 0;
     let fileCount = 0;
     const folders: string[] = [];
     const allFiles: Array<{name: string, size: number}> = [];
     let lastModified = new Date(0);

     const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
     
     const systemCachePaths = [
       { name: 'Prefetch', path: path.join(systemRoot, 'Prefetch') },
       { name: 'FontCache', path: path.join(systemRoot, 'FontCache') },
     ];
     
     for (const cache of systemCachePaths) {
       try {
         if (fs.existsSync(cache.path)) {
           const analysis = await this.getDetailedDirectoryAnalysis(cache.path);
           totalSize += analysis.totalSize;
           fileCount += analysis.fileCount;
           folders.push(...analysis.folders);
           allFiles.push(...analysis.largestFiles);
           
           if (analysis.lastModified > lastModified) {
             lastModified = analysis.lastModified;
           }
           
           if (analysis.totalSize > 0) {
             console.log(`⚙️ ${cache.name}: ${Math.round(analysis.totalSize / (1024 * 1024))} MB (${analysis.fileCount} files)`);
           }
         }
       } catch (error) {
         // Bỏ qua lỗi
       }
     }

     // Sắp xếp file theo kích thước và lấy 5 file lớn nhất
     const largestFiles = allFiles
       .sort((a, b) => b.size - a.size)
       .slice(0, 5);

     return {
       name: 'System Cache',
       size: Math.round(totalSize / (1024 * 1024)),
       category: 'cache',
       details: {
         folders: folders.slice(0, 10),
         fileCount,
         largestFiles,
         lastModified
       }
     };
   }
}
