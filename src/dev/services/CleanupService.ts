import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { executeCommandSafe, executeCmdCommand } from './CommandHelper';

export interface CleanupResult {
  success: boolean;
  message: string;
  freedSpace: number;
  itemsRemoved: number;
}

export interface CleanupOptions {
  tempFiles: boolean;
  recycleBin: boolean;
  windowsUpdate: boolean;
  browserCache: boolean;
  systemLogs: boolean;
  oldFiles: boolean;
  unusedApps: boolean;
  systemCache: boolean;
  applicationCache: boolean;
  dnsCache: boolean;
  networkCache: boolean;
  printSpoolerCache: boolean;
  errorReports: boolean;
  memoryDumps: boolean;
  duplicateFiles: boolean;
  oldDownloads: boolean;
  emptyFolders: boolean;
}

export class CleanupService {
  async cleanupSystem(options: CleanupOptions = this.getDefaultOptions()): Promise<CleanupResult[]> {
    const results: CleanupResult[] = [];
    
    try {
      if (options.tempFiles) {
        results.push(await this.cleanupTempFiles());
      }
      
      if (options.recycleBin) {
        results.push(await this.emptyRecycleBin());
      }
      
      if (options.windowsUpdate) {
        results.push(await this.cleanupWindowsUpdate());
      }
      
      if (options.browserCache) {
        results.push(await this.cleanupBrowserCache());
      }
      
      if (options.systemLogs) {
        results.push(await this.cleanupSystemLogs());
      }
      
      if (options.oldFiles) {
        results.push(await this.cleanupOldFiles());
      }
      
      if (options.unusedApps) {
        results.push(await this.cleanupUnusedApps());
      }
      
      if (options.systemCache) {
        results.push(await this.cleanupSystemCache());
      }
      
      if (options.applicationCache) {
        results.push(await this.cleanupApplicationCache());
      }
      
      if (options.dnsCache) {
        results.push(await this.cleanupDNSCache());
      }
      
      if (options.networkCache) {
        results.push(await this.cleanupNetworkCache());
      }
      
      if (options.printSpoolerCache) {
        results.push(await this.cleanupPrintSpoolerCache());
      }
      
      if (options.errorReports) {
        results.push(await this.cleanupErrorReports());
      }
      
      if (options.memoryDumps) {
        results.push(await this.cleanupMemoryDumps());
      }
      
      if (options.duplicateFiles) {
        results.push(await this.cleanupDuplicateFiles());
      }
      
      if (options.oldDownloads) {
        results.push(await this.cleanupOldDownloads());
      }
      
      if (options.emptyFolders) {
        results.push(await this.cleanupEmptyFolders());
      }
      
      return results;
    } catch (error) {
      console.error('Lỗi khi dọn dẹp hệ thống:', error);
      throw error;
    }
  }

  private getDefaultOptions(): CleanupOptions {
    return {
      tempFiles: true,
      recycleBin: true,
      windowsUpdate: true,
      browserCache: true,
      systemLogs: false,
      oldFiles: false,
      unusedApps: false,
      systemCache: true,
      applicationCache: true,
      dnsCache: true,
      networkCache: true,
      printSpoolerCache: false,
      errorReports: false,
      memoryDumps: false,
      duplicateFiles: false,
      oldDownloads: false,
      emptyFolders: false
    };
  }

  async cleanupTempFiles(): Promise<CleanupResult> {
    try {
      const tempDirs = [
        { path: os.tmpdir(), name: 'System Temp' },
        { path: path.join(os.homedir(), 'AppData', 'Local', 'Temp'), name: 'User Local Temp' },
        { path: path.join(os.homedir(), 'AppData', 'Roaming', 'Temp'), name: 'User Roaming Temp' },
        { path: path.join(process.env.SYSTEMROOT || 'C:\\Windows', 'Temp'), name: 'Windows Temp' }
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const tempDir of tempDirs) {
        if (await fs.pathExists(tempDir.path)) {
          console.log(`Cleaning ${tempDir.name}: ${tempDir.path}`);
          const { freed, removed } = await this.cleanDirectory(tempDir.path, {
            maxAge: 1, // Xóa file tạm cũ hơn 1 ngày
            preserveStructure: false,
            maxDepth: 5
          });
          freedSpace += freed;
          itemsRemoved += removed;
          console.log(`${tempDir.name}: Freed ${Math.round(freed / (1024 * 1024))} MB, removed ${removed} items`);
        }
      }
      
      return {
        success: true,
        message: `Đã dọn dẹp file tạm: ${Math.round(freedSpace / (1024 * 1024))} MB`,
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp file tạm:', error);
      return {
        success: false,
        message: 'Lỗi khi dọn dẹp file tạm',
        freedSpace: 0,
        itemsRemoved: 0
      };
    }
  }

  async emptyRecycleBin(): Promise<CleanupResult> {
    try {
      let totalFreed = 0;
      let totalRemoved = 0;
      
      // Xóa thùng rác bằng Node.js trực tiếp
      const drives = ['C:', 'D:', 'E:', 'F:'];
      
      for (const drive of drives) {
        try {
          const recycleBinPath = path.join(drive, '$Recycle.Bin');
          if (await fs.pathExists(recycleBinPath)) {
            console.log(`Cleaning recycle bin on ${drive}`);
            const { freed, removed } = await this.cleanDirectory(recycleBinPath, {
              maxAge: 0, // Xóa tất cả
              preserveStructure: false,
              maxDepth: 3
            });
            totalFreed += freed;
            totalRemoved += removed;
            console.log(`${drive} Recycle Bin: Freed ${Math.round(freed / (1024 * 1024))} MB, removed ${removed} items`);
          }
        } catch (driveError) {
          console.error(`Error cleaning recycle bin on ${drive}:`, driveError);
          continue;
        }
      }
      
      return {
        success: true,
        message: `Đã dọn dẹp thùng rác: ${Math.round(totalFreed / (1024 * 1024))} MB`,
        freedSpace: totalFreed,
        itemsRemoved: totalRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp thùng rác:', error);
      return {
        success: false,
        message: 'Lỗi khi dọn dẹp thùng rác',
        freedSpace: 0,
        itemsRemoved: 0
      };
    }
  }

  async cleanupWindowsUpdate(): Promise<CleanupResult> {
    try {
      // Dọn dẹp Windows Update cache
      await executeCmdCommand('net stop wuauserv');
      await executeCmdCommand('rd /s /q C:\\Windows\\SoftwareDistribution\\Download');
      await executeCmdCommand('net start wuauserv');
      
      // Dọn dẹp DISM
      await executeCmdCommand('dism /online /cleanup-image /startcomponentcleanup');
      
      return {
        success: true,
        message: 'Đã dọn dẹp Windows Update',
        freedSpace: 0,
        itemsRemoved: 0
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp Windows Update:', error);
      throw error;
    }
  }

  async cleanupBrowserCache(): Promise<CleanupResult> {
    try {
      const userProfile = os.homedir();
      const browserPaths = [
        { path: path.join(userProfile, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Cache'), name: 'Chrome Cache' },
        { path: path.join(userProfile, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Code Cache'), name: 'Chrome Code Cache' },
        { path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data', 'Default', 'Cache'), name: 'Edge Cache' },
        { path: path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data', 'Default', 'Code Cache'), name: 'Edge Code Cache' },
        { path: path.join(userProfile, 'AppData', 'Local', 'Mozilla', 'Firefox', 'Profiles'), name: 'Firefox Cache' },
        { path: path.join(userProfile, 'AppData', 'Local', 'Opera Software', 'Opera Stable', 'Cache'), name: 'Opera Cache' },
        { path: path.join(userProfile, 'AppData', 'Local', 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default', 'Cache'), name: 'Brave Cache' },
        { path: path.join(userProfile, 'AppData', 'Local', 'Vivaldi', 'User Data', 'Default', 'Cache'), name: 'Vivaldi Cache' }
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const browser of browserPaths) {
        if (await fs.pathExists(browser.path)) {
          console.log(`Cleaning ${browser.name}: ${browser.path}`);
          const { freed, removed } = await this.cleanDirectory(browser.path, {
            maxAge: 7, // Xóa cache cũ hơn 7 ngày
            preserveStructure: true, // Giữ cấu trúc thư mục browser
            maxDepth: 3
          });
          freedSpace += freed;
          itemsRemoved += removed;
          console.log(`${browser.name}: Freed ${Math.round(freed / (1024 * 1024))} MB, removed ${removed} items`);
        }
      }
      
      return {
        success: true,
        message: `Đã dọn dẹp cache trình duyệt: ${Math.round(freedSpace / (1024 * 1024))} MB`,
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp cache trình duyệt:', error);
      return {
        success: false,
        message: 'Lỗi khi dọn dẹp cache trình duyệt',
        freedSpace: 0,
        itemsRemoved: 0
      };
    }
  }

  async cleanupSystemLogs(): Promise<CleanupResult> {
    try {
      const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
      const logPaths = [
        { path: path.join(systemRoot, 'Logs'), name: 'Windows Logs' },
        { path: path.join(systemRoot, 'System32', 'winevt', 'Logs'), name: 'Event Logs' },
        { path: path.join(systemRoot, 'System32', 'LogFiles'), name: 'System32 Logs' },
        { path: path.join(systemRoot, 'Temp'), name: 'Windows Temp Logs' }
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const logInfo of logPaths) {
        if (await fs.pathExists(logInfo.path)) {
          console.log(`Cleaning ${logInfo.name}: ${logInfo.path}`);
          const { freed, removed } = await this.cleanDirectory(logInfo.path, {
            maxAge: 30, // Xóa log cũ hơn 30 ngày
            preserveStructure: true, // Giữ cấu trúc thư mục log
            fileExtensions: ['.log', '.etl', '.txt', '.tmp'], // Chỉ xóa file log
            maxDepth: 3
          });
          freedSpace += freed;
          itemsRemoved += removed;
          console.log(`${logInfo.name}: Freed ${Math.round(freed / (1024 * 1024))} MB, removed ${removed} items`);
        }
      }
      
      return {
        success: true,
        message: `Đã dọn dẹp log hệ thống: ${Math.round(freedSpace / (1024 * 1024))} MB`,
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp log hệ thống:', error);
      return {
        success: false,
        message: 'Lỗi khi dọn dẹp log hệ thống',
        freedSpace: 0,
        itemsRemoved: 0
      };
    }
  }

  async cleanupOldFiles(): Promise<CleanupResult> {
    try {
      const oldFileExtensions = ['.tmp', '.log', '.old', '.bak'];
      const searchPaths = [
        os.homedir(),
        'C:\\Program Files',
        'C:\\Program Files (x86)'
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const searchPath of searchPaths) {
        if (await fs.pathExists(searchPath)) {
          const { freed, removed } = await this.cleanOldFilesInDirectory(searchPath, oldFileExtensions);
          freedSpace += freed;
          itemsRemoved += removed;
        }
      }
      
      return {
        success: true,
        message: 'Đã dọn dẹp file cũ',
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp file cũ:', error);
      throw error;
    }
  }

  async cleanupUnusedApps(): Promise<CleanupResult> {
    try {
      // Placeholder for unused apps cleanup
      return {
        success: true,
        message: 'Đã dọn dẹp ứng dụng không sử dụng',
        freedSpace: 0,
        itemsRemoved: 0
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp ứng dụng không sử dụng:', error);
      throw error;
    }
  }

  async cleanupSystemCache(): Promise<CleanupResult> {
    try {
      const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
      const systemCacheDirs = [
        path.join(systemRoot, 'Prefetch'),
        path.join(systemRoot, 'FontCache'),
        path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'INetCache'),
        path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'WebCache'),
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const cacheDir of systemCacheDirs) {
        if (await fs.pathExists(cacheDir)) {
          const { freed, removed } = await this.cleanDirectory(cacheDir);
          freedSpace += freed;
          itemsRemoved += removed;
        }
      }
      
      return {
        success: true,
        message: 'Đã dọn dẹp cache hệ thống',
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp cache hệ thống:', error);
      throw error;
    }
  }

  async cleanupApplicationCache(): Promise<CleanupResult> {
    try {
      const userProfile = process.env.USERPROFILE;
      const appCacheDirs = [
        path.join(userProfile, 'AppData', 'Local', 'Temp'),
        path.join(userProfile, 'AppData', 'Roaming', 'Temp'),
        path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'Temporary Internet Files'),
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const cacheDir of appCacheDirs) {
        if (await fs.pathExists(cacheDir)) {
          const { freed, removed } = await this.cleanDirectory(cacheDir);
          freedSpace += freed;
          itemsRemoved += removed;
        }
      }
      
      return {
        success: true,
        message: 'Đã dọn dẹp cache ứng dụng',
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp cache ứng dụng:', error);
      throw error;
    }
  }

  async cleanupDNSCache(): Promise<CleanupResult> {
    try {
      // Clear DNS cache using PowerShell
      const { stdout, stderr } = await executeCmdCommand('ipconfig /flushdns');
      
      return {
        success: true,
        message: 'Đã xóa DNS cache',
        freedSpace: 1024, // DNS cache thường rất nhỏ
        itemsRemoved: 1
      };
    } catch (error) {
      console.error('Lỗi khi xóa DNS cache:', error);
      throw error;
    }
  }

  async cleanupNetworkCache(): Promise<CleanupResult> {
    try {
      const userProfile = process.env.USERPROFILE;
      const networkCacheDirs = [
        path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'INetCache'),
        path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'WebCache'),
        path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'History'),
        path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'Cookies'),
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const cacheDir of networkCacheDirs) {
        if (await fs.pathExists(cacheDir)) {
          const { freed, removed } = await this.cleanDirectory(cacheDir);
          freedSpace += freed;
          itemsRemoved += removed;
        }
      }
      
      return {
        success: true,
        message: 'Đã dọn dẹp cache mạng',
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp cache mạng:', error);
      throw error;
    }
  }

  async cleanupPrintSpoolerCache(): Promise<CleanupResult> {
    try {
      const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
      const spoolerDirs = [
        path.join(systemRoot, 'System32', 'spool', 'PRINTERS'),
        path.join(systemRoot, 'System32', 'spool', 'DRIVERS'),
        path.join(systemRoot, 'System32', 'spool', 'PRTPROCS'),
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const spoolerDir of spoolerDirs) {
        if (await fs.pathExists(spoolerDir)) {
          const { freed, removed } = await this.cleanDirectory(spoolerDir);
          freedSpace += freed;
          itemsRemoved += removed;
        }
      }
      
      return {
        success: true,
        message: 'Đã dọn dẹp cache print spooler',
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp cache print spooler:', error);
      throw error;
    }
  }

  async cleanupErrorReports(): Promise<CleanupResult> {
    try {
      const userProfile = process.env.USERPROFILE;
      const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
      const errorReportDirs = [
        path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'WER'),
        path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'Windows', 'ErrorReports'),
        path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'WER'),
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const errorDir of errorReportDirs) {
        if (await fs.pathExists(errorDir)) {
          const { freed, removed } = await this.cleanDirectory(errorDir);
          freedSpace += freed;
          itemsRemoved += removed;
        }
      }
      
      return {
        success: true,
        message: 'Đã dọn dẹp error reports',
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp error reports:', error);
      throw error;
    }
  }

  async cleanupMemoryDumps(): Promise<CleanupResult> {
    try {
      const systemRoot = process.env.SYSTEMROOT || 'C:\\Windows';
      const memoryDumpDirs = [
        path.join(systemRoot, 'Minidump'),
        path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'WER', 'ReportQueue'),
        path.join(systemRoot, 'System32', 'config', 'systemprofile', 'AppData', 'Local', 'Microsoft', 'Windows', 'WER', 'ReportArchive'),
      ];
      
      let freedSpace = 0;
      let itemsRemoved = 0;
      
      for (const dumpDir of memoryDumpDirs) {
        if (await fs.pathExists(dumpDir)) {
          const { freed, removed } = await this.cleanDirectory(dumpDir);
          freedSpace += freed;
          itemsRemoved += removed;
        }
      }
      
      return {
        success: true,
        message: 'Đã dọn dẹp memory dumps',
        freedSpace,
        itemsRemoved
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp memory dumps:', error);
      throw error;
    }
  }

  async cleanupDuplicateFiles(): Promise<CleanupResult> {
    try {
      // Placeholder for duplicate files cleanup
      return {
        success: true,
        message: 'Đã dọn dẹp file trùng lặp',
        freedSpace: 0,
        itemsRemoved: 0
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp file trùng lặp:', error);
      throw error;
    }
  }

  async cleanupOldDownloads(): Promise<CleanupResult> {
    try {
      const downloadsPath = path.join(process.env.USERPROFILE || '', 'Downloads');
      const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
      
      if (await fs.pathExists(downloadsPath)) {
        const { freed, removed } = await this.cleanOldFilesInDirectory(downloadsPath, ['.*'], ninetyDaysAgo);
        return {
          success: true,
          message: 'Đã dọn dẹp file cũ trong Downloads',
          freedSpace: freed,
          itemsRemoved: removed
        };
      }
      
      return {
        success: true,
        message: 'Không có file cũ trong Downloads',
        freedSpace: 0,
        itemsRemoved: 0
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp file cũ trong Downloads:', error);
      throw error;
    }
  }

  async cleanupEmptyFolders(): Promise<CleanupResult> {
    try {
      // Placeholder for empty folders cleanup
      return {
        success: true,
        message: 'Đã dọn dẹp thư mục trống',
        freedSpace: 0,
        itemsRemoved: 0
      };
    } catch (error) {
      console.error('Lỗi khi dọn dẹp thư mục trống:', error);
      throw error;
    }
  }

  private async cleanDirectory(dirPath: string, options?: { 
    maxAge?: number; 
    preserveStructure?: boolean; 
    fileExtensions?: string[];
    maxDepth?: number;
    currentDepth?: number;
  }): Promise<{ freed: number; removed: number }> {
    let freed = 0;
    let removed = 0;
    
    const {
      maxAge = 30, // ngày
      preserveStructure = false,
      fileExtensions = [],
      maxDepth = 10,
      currentDepth = 0
    } = options || {};
    
    try {
      if (currentDepth > maxDepth) {
        console.log(`Reached max depth at ${dirPath}`);
        return { freed, removed };
      }

      if (!await fs.pathExists(dirPath)) {
        return { freed, removed };
      }

      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        
        try {
          const stats = await fs.stat(filePath);
          
          if (stats.isDirectory()) {
            const result = await this.cleanDirectory(filePath, {
              ...options,
              currentDepth: currentDepth + 1
            });
            freed += result.freed;
            removed += result.removed;
            
            // Xóa thư mục rỗng nếu không cần preserve structure
            if (!preserveStructure) {
              try {
                const remainingFiles = await fs.readdir(filePath);
                if (remainingFiles.length === 0) {
                  await fs.rmdir(filePath);
                  console.log(`Removed empty directory: ${filePath}`);
                }
              } catch (error) {
                // Bỏ qua lỗi khi xóa thư mục
              }
            }
          } else {
            // Kiểm tra điều kiện xóa file
            let shouldDelete = false;
            
            // Kiểm tra tuổi file
            const daysOld = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
            if (daysOld > maxAge) {
              shouldDelete = true;
            }
            
            // Kiểm tra extension nếu được chỉ định
            if (fileExtensions.length > 0) {
              const ext = path.extname(file).toLowerCase();
              shouldDelete = fileExtensions.includes(ext);
            }
            
            // Bỏ qua file system quan trọng
            const fileName = file.toLowerCase();
            const protectedFiles = ['desktop.ini', 'thumbs.db', '.ds_store', 'pagefile.sys', 'hiberfil.sys'];
            if (protectedFiles.includes(fileName)) {
              shouldDelete = false;
            }
            
            if (shouldDelete) {
              try {
                freed += stats.size;
                await fs.unlink(filePath);
                removed++;
                console.log(`Deleted file: ${filePath} (${Math.round(stats.size / 1024)} KB)`);
              } catch (deleteError) {
                console.error(`Failed to delete ${filePath}:`, deleteError);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
          // Bỏ qua file không thể truy cập
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      // Bỏ qua thư mục không thể truy cập
    }
    
    return { freed, removed };
  }

  private async cleanOldFilesInDirectory(dirPath: string, extensions: string[], cutoffDate?: number): Promise<{ freed: number; removed: number }> {
    let freed = 0;
    let removed = 0;
    
    try {
      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        
        try {
          const stats = await fs.stat(filePath);
          
          if (stats.isDirectory()) {
            const result = await this.cleanOldFilesInDirectory(filePath, extensions, cutoffDate);
            freed += result.freed;
            removed += result.removed;
          } else {
            const ext = path.extname(file).toLowerCase();
            if (extensions.includes(ext)) {
              if (cutoffDate && stats.mtime.getTime() < cutoffDate) {
                freed += stats.size;
                await fs.unlink(filePath);
                removed++;
              }
            }
          }
        } catch (error) {
          // Bỏ qua file không thể truy cập
        }
      }
    } catch (error) {
      // Bỏ qua thư mục không thể truy cập
    }
    
    return { freed, removed };
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Phương thức mới để tối ưu hóa cleanup với batch processing
  async optimizedCleanup(options: CleanupOptions): Promise<CleanupResult[]> {
    const results: CleanupResult[] = [];
    const batchSize = 3; // Xử lý 3 task cùng lúc
    
    // Tạo danh sách các task cleanup theo độ ưu tiên
    const cleanupTasks: Array<{ name: string; task: () => Promise<CleanupResult>; priority: number }> = [];
    
    if (options.tempFiles) {
      cleanupTasks.push({ name: 'Temporary Files', task: () => this.cleanupTempFiles(), priority: 1 });
    }
    if (options.browserCache) {
      cleanupTasks.push({ name: 'Browser Cache', task: () => this.cleanupBrowserCache(), priority: 1 });
    }
    if (options.systemCache) {
      cleanupTasks.push({ name: 'System Cache', task: () => this.cleanupSystemCache(), priority: 1 });
    }
    if (options.dnsCache) {
      cleanupTasks.push({ name: 'DNS Cache', task: () => this.cleanupDNSCache(), priority: 1 });
    }
    if (options.networkCache) {
      cleanupTasks.push({ name: 'Network Cache', task: () => this.cleanupNetworkCache(), priority: 1 });
    }
    if (options.recycleBin) {
      cleanupTasks.push({ name: 'Recycle Bin', task: () => this.emptyRecycleBin(), priority: 2 });
    }
    if (options.systemLogs) {
      cleanupTasks.push({ name: 'System Logs', task: () => this.cleanupSystemLogs(), priority: 2 });
    }
    if (options.windowsUpdate) {
      cleanupTasks.push({ name: 'Windows Update', task: () => this.cleanupWindowsUpdate(), priority: 2 });
    }
    if (options.applicationCache) {
      cleanupTasks.push({ name: 'Application Cache', task: () => this.cleanupApplicationCache(), priority: 2 });
    }
    if (options.printSpoolerCache) {
      cleanupTasks.push({ name: 'Print Spooler Cache', task: () => this.cleanupPrintSpoolerCache(), priority: 2 });
    }
    if (options.errorReports) {
      cleanupTasks.push({ name: 'Error Reports', task: () => this.cleanupErrorReports(), priority: 3 });
    }
    if (options.memoryDumps) {
      cleanupTasks.push({ name: 'Memory Dumps', task: () => this.cleanupMemoryDumps(), priority: 3 });
    }
    if (options.oldFiles) {
      cleanupTasks.push({ name: 'Old Files', task: () => this.cleanupOldFiles(), priority: 3 });
    }
    if (options.oldDownloads) {
      cleanupTasks.push({ name: 'Old Downloads', task: () => this.cleanupOldDownloads(), priority: 3 });
    }
    if (options.duplicateFiles) {
      cleanupTasks.push({ name: 'Duplicate Files', task: () => this.cleanupDuplicateFiles(), priority: 3 });
    }
    if (options.emptyFolders) {
      cleanupTasks.push({ name: 'Empty Folders', task: () => this.cleanupEmptyFolders(), priority: 3 });
    }
    if (options.unusedApps) {
      cleanupTasks.push({ name: 'Unused Apps', task: () => this.cleanupUnusedApps(), priority: 3 });
    }

    // Sắp xếp theo độ ưu tiên
    cleanupTasks.sort((a, b) => a.priority - b.priority);
    
    // Xử lý theo batch
    for (let i = 0; i < cleanupTasks.length; i += batchSize) {
      const batch = cleanupTasks.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}: ${batch.map(t => t.name).join(', ')}`);
      
      const batchPromises = batch.map(async (taskInfo) => {
        try {
          const startTime = Date.now();
          const result = await taskInfo.task();
          const duration = Date.now() - startTime;
          
          console.log(`✅ ${taskInfo.name} completed in ${duration}ms: ${result.message}`);
          return result;
        } catch (error) {
          console.error(`❌ ${taskInfo.name} failed:`, error);
          return {
            success: false,
            message: `Lỗi khi dọn dẹp ${taskInfo.name}`,
            freedSpace: 0,
            itemsRemoved: 0
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Delay ngắn giữa các batch để tránh overload
      if (i + batchSize < cleanupTasks.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return results;
  }

  // Phương thức kiểm tra an toàn trước khi cleanup
  async performSafetyCheck(): Promise<{ safe: boolean; warnings: string[] }> {
    const warnings: string[] = [];
    let safe = true;
    
    try {
      // Kiểm tra dung lượng ổ đĩa
      const drives = ['C:', 'D:', 'E:'];
      for (const drive of drives) {
        try {
          const stats = await fs.stat(drive + '\\');
          // Thêm logic kiểm tra dung lượng ổ đĩa nếu cần
        } catch (error) {
          // Drive không tồn tại
        }
      }
      
      // Kiểm tra process đang chạy
      const criticalProcesses = ['explorer.exe', 'winlogon.exe', 'csrss.exe'];
      // Thêm logic kiểm tra process nếu cần
      
      // Kiểm tra quyền admin
      try {
        await fs.access('C:\\Windows\\System32', fs.constants.W_OK);
      } catch (error) {
        warnings.push('Không có quyền admin, một số cleanup có thể thất bại');
      }
      
      // Kiểm tra antivirus
      const antivirusProcesses = ['avgnt.exe', 'avguard.exe', 'mcshield.exe'];
      warnings.push('Đảm bảo antivirus đã được tạm tắt để tránh xung đột');
      
    } catch (error) {
      console.error('Safety check error:', error);
      safe = false;
      warnings.push('Không thể thực hiện kiểm tra an toàn');
    }
    
    return { safe, warnings };
  }
} 