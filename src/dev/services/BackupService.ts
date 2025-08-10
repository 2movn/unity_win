import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { writeFile } from 'fs/promises';
import { executeCommandSafe, executeCmdCommand, executePowerShellScript } from './CommandHelper';

export interface BackupOptions {
  includeDrivers: boolean;
  includeZalo: boolean;
  includeBrowserProfiles: boolean;
  includeUserFolders: boolean;
  includeCustomFolders: boolean;
  customFolders: string[];
  backupLocation: string;
  selectedDrive: string;
}

export interface BackupResult {
  success: boolean;
  message: string;
  backupPath: string;
  size: number;
  filesCount: number;
  driveInfo?: {
    drive: string;
    freeSpace: number;
    totalSpace: number;
  };
}

export interface DriveInfo {
  drive: string;
  label: string;
  freeSpace: number;
  totalSpace: number;
  fileSystem: string;
  isWindowsDrive: boolean;
  isRemovable: boolean;
  isNetwork: boolean;
  volumeSerialNumber?: string;
}

export class BackupService {
  // Lấy danh sách các ổ cứng có sẵn với thông tin chi tiết
  async getAvailableDrives(): Promise<DriveInfo[]> {
    try {
      // Lấy thông tin cơ bản từ WMIC
      const { stdout: wmicOutput } = await executeCmdCommand('wmic logicaldisk get deviceid,volumename,freespace,size,filesystem,drivetype,volumeserialnumber /format:csv');
      
      // Lấy thông tin Windows drive
      const { stdout: systemDriveOutput } = await executeCmdCommand('echo %SYSTEMDRIVE%');
      const systemDrive = systemDriveOutput.trim().replace('%SYSTEMDRIVE%', 'C:');
      
      // Parse WMIC output
      const lines = wmicOutput.trim().split('\n');
      const drives: DriveInfo[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && line !== 'Node,DeviceID,DriveType,FileSystem,FreeSpace,Size,VolumeName,VolumeSerialNumber') {
          const parts = line.split(',');
          if (parts.length >= 8) {
            // Thứ tự: Node,DeviceID,DriveType,FileSystem,FreeSpace,Size,VolumeName,VolumeSerialNumber
            const drive = parts[1]; // DeviceID
            const driveType = parseInt(parts[2]) || 3; // DriveType
            const fileSystem = parts[3] || 'NTFS'; // FileSystem
            const freeSpace = parseInt(parts[4]) || 0; // FreeSpace
            const totalSpace = parseInt(parts[5]) || 0; // Size
            const label = parts[6] || 'Local Disk'; // VolumeName
            const volumeSerial = parts[7] || ''; // VolumeSerialNumber
            
            const isWindowsDrive = drive === systemDrive;
            const isRemovable = driveType === 2;
            const isNetwork = driveType === 4;
            
            drives.push({
              drive,
              label,
              freeSpace,
              totalSpace,
              fileSystem,
              isWindowsDrive,
              isRemovable,
              isNetwork,
              volumeSerialNumber: volumeSerial
            });
          }
        }
      }
      
      // Sắp xếp: ổ Windows cuối cùng, ổ local trước, removable sau
      drives.sort((a, b) => {
        if (a.isWindowsDrive && !b.isWindowsDrive) return 1;
        if (!a.isWindowsDrive && b.isWindowsDrive) return -1;
        if (a.isRemovable && !b.isRemovable) return 1;
        if (!a.isRemovable && b.isRemovable) return -1;
        return a.drive.localeCompare(b.drive);
      });
      
      return drives;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ổ cứng:', error);
      return [];
    }
  }

  // Tạo tên folder backup theo ngày tháng năm
  private generateBackupFolderName(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${day}_${month}_${year}`;
  }

  // Tạo cấu trúc folder backup
  private async createBackupStructure(basePath: string): Promise<string> {
    const backupFolderName = this.generateBackupFolderName();
    const backupPath = path.join(basePath, 'Backup', backupFolderName);
    
    // Tạo thư mục chính
    await fs.ensureDir(backupPath);
    
    // Tạo các thư mục con
    const subFolders = [
      '01_Drivers',
      '02_Zalo_Data',
      '03_Browser_Profiles', 
      '04_User_Folders',
      '05_Custom_Folders',
      '06_System_Info',
      '07_Backup_Logs'
    ];
    
    for (const folder of subFolders) {
      await fs.ensureDir(path.join(backupPath, folder));
    }
    
    return backupPath;
  }

  // Kiểm tra dung lượng ổ cứng
  private async checkDriveSpace(drive: string, requiredSpace: number): Promise<boolean> {
    try {
      const drives = await this.getAvailableDrives();
      const targetDrive = drives.find(d => d.drive === drive);
      
      if (!targetDrive) {
        throw new Error(`Không tìm thấy ổ cứng ${drive}`);
      }
      
      return targetDrive.freeSpace >= requiredSpace;
    } catch (error) {
      console.error('Lỗi khi kiểm tra dung lượng ổ cứng:', error);
      return false;
    }
  }

  async backupDrivers(backupPath?: string): Promise<BackupResult> {
    try {
      const basePath = backupPath || path.join(os.homedir(), 'Desktop');
      const fullBackupPath = await this.createBackupStructure(basePath);
      const driversPath = path.join(fullBackupPath, '01_Drivers');
      
      // Export drivers using DISM
      const { stdout } = await executeCmdCommand('dism /online /export-driver /destination:"' + driversPath + '"');
      
      // Get backup size
      const size = await this.getDirectorySize(driversPath);
      const filesCount = await this.getFileCount(driversPath);
      
      // Get drive info
      const driveInfo = await this.getDriveInfo(basePath);
      
      return {
        success: true,
        message: 'Sao lưu drivers thành công',
        backupPath: fullBackupPath,
        size,
        filesCount,
        driveInfo
      };
    } catch (error) {
      console.error('Lỗi khi sao lưu drivers:', error);
      throw error;
    }
  }

  async backupZaloData(backupPath?: string): Promise<BackupResult> {
    try {
      const basePath = backupPath || path.join(os.homedir(), 'Desktop');
      const fullBackupPath = await this.createBackupStructure(basePath);
      const zaloBackupPath = path.join(fullBackupPath, '02_Zalo_Data');
      
      const zaloPath = path.join(os.homedir(), 'AppData', 'Local', 'ZaloPC');
      
      if (!await fs.pathExists(zaloPath)) {
        throw new Error('Không tìm thấy thư mục Zalo');
      }
      
      await fs.copy(zaloPath, path.join(zaloBackupPath, 'Zalo_Data'));
      
      const size = await this.getDirectorySize(zaloBackupPath);
      const filesCount = await this.getFileCount(zaloBackupPath);
      
      const driveInfo = await this.getDriveInfo(basePath);
      
      return {
        success: true,
        message: 'Sao lưu dữ liệu Zalo thành công',
        backupPath: fullBackupPath,
        size,
        filesCount,
        driveInfo
      };
    } catch (error) {
      console.error('Lỗi khi sao lưu Zalo:', error);
      throw error;
    }
  }

    // Backup profile trình duyệt thông minh
  async backupBrowserProfiles(backupPath?: string): Promise<BackupResult> {
    try {
      const basePath = backupPath || path.join(os.homedir(), 'Desktop');
      const fullBackupPath = await this.createBackupStructure(basePath);
      const browserBackupPath = path.join(fullBackupPath, '03_Browser_Profiles');
      
      const userProfile = os.homedir();
      const appDataLocal = path.join(userProfile, 'AppData', 'Local');
      const appDataRoaming = path.join(userProfile, 'AppData', 'Roaming');
      
      let totalSize = 0;
      let totalFiles = 0;
      const browserProfiles: string[] = [];
      const errors: string[] = [];
      
      // Danh sách các trình duyệt phổ biến
      const browsers = [
        {
          name: 'Chrome',
          paths: [
            path.join(appDataLocal, 'Google', 'Chrome', 'User Data'),
            path.join(appDataLocal, 'Google', 'Chrome Beta', 'User Data'),
            path.join(appDataLocal, 'Google', 'Chrome SxS', 'User Data')
          ]
        },
        {
          name: 'Edge',
          paths: [
            path.join(appDataLocal, 'Microsoft', 'Edge', 'User Data'),
            path.join(appDataLocal, 'Microsoft', 'Edge Beta', 'User Data'),
            path.join(appDataLocal, 'Microsoft', 'Edge Dev', 'User Data')
          ]
        },
        {
          name: 'Firefox',
          paths: [
            path.join(appDataRoaming, 'Mozilla', 'Firefox', 'Profiles'),
            path.join(appDataLocal, 'Mozilla', 'Firefox', 'Profiles')
          ]
        },
        {
          name: 'Opera',
          paths: [
            path.join(appDataRoaming, 'Opera Software', 'Opera Stable'),
            path.join(appDataRoaming, 'Opera Software', 'Opera GX')
          ]
        },
        {
          name: 'Brave',
          paths: [
            path.join(appDataLocal, 'BraveSoftware', 'Brave-Browser', 'User Data')
          ]
        },
        {
          name: 'Vivaldi',
          paths: [
            path.join(appDataLocal, 'Vivaldi', 'User Data')
          ]
        }
      ];
      
      for (const browser of browsers) {
        for (const browserPath of browser.paths) {
          try {
            if (await fs.pathExists(browserPath)) {
              console.log(`Tìm thấy ${browser.name} tại: ${browserPath}`);
              
              // Tạo thư mục backup cho trình duyệt này
              const browserBackupDir = path.join(browserBackupPath, browser.name);
              await fs.ensureDir(browserBackupDir);
              
              // Kill trình duyệt trước khi copy
              console.log(`Đang kill ${browser.name} processes...`);
              await this.killBrowserProcesses(browser.name);
              
              // Đợi một chút để đảm bảo processes đã tắt hoàn toàn
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              // Backup thông minh - chỉ copy những file quan trọng
              try {
                await this.smartBackupBrowser(browserPath, browserBackupDir, browser.name);
                console.log(`Đã backup ${browser.name} profile thông minh`);
                
                // Tính kích thước và số file
                const backupSize = await this.getDirectorySize(browserBackupDir);
                const backupFiles = await this.getFileCount(browserBackupDir);
                totalSize += backupSize;
                totalFiles += backupFiles;
                browserProfiles.push(`${browser.name}: ${this.formatBytes(backupSize)}`);
                
              } catch (backupError) {
                console.log(`Không thể backup ${browser.name} profile:`, backupError);
                errors.push(`${browser.name}: Không thể backup profile`);
              }
            }
          } catch (browserError) {
            console.error(`Lỗi khi xử lý ${browser.name}:`, browserError);
            errors.push(`${browser.name}: ${browserError instanceof Error ? browserError.message : 'Unknown error'}`);
          }
        }
      }
      
      const driveInfo = await this.getDriveInfo(basePath);
      
      // Tạo message với thông tin chi tiết
      let message = `Sao lưu profile trình duyệt thành công: ${browserProfiles.join(', ')}`;
      if (errors.length > 0) {
        message += `\nLỗi: ${errors.join(', ')}`;
      }
      
      console.log('=== BACKUP BROWSER PROFILES SUMMARY ===');
      console.log('Thành công:', browserProfiles);
      console.log('Lỗi:', errors);
      console.log('Tổng kích thước:', this.formatBytes(totalSize));
      console.log('Tổng số file:', totalFiles);
      
      return {
        success: browserProfiles.length > 0,
        message: message,
        backupPath: fullBackupPath,
        size: totalSize,
        filesCount: totalFiles,
        driveInfo
      };
    } catch (error) {
      console.error('Lỗi khi sao lưu profile trình duyệt:', error);
      throw error;
    }
  }

  async backupUserFolders(folders: string[], backupPath?: string): Promise<BackupResult> {
    try {
      const basePath = backupPath || path.join(os.homedir(), 'Desktop');
      const fullBackupPath = await this.createBackupStructure(basePath);
      const userFoldersPath = path.join(fullBackupPath, '04_User_Folders');
      
      let totalSize = 0;
      let totalFiles = 0;
      const backupResults: string[] = [];
      
      for (const folder of folders) {
        const sourcePath = path.join(os.homedir(), folder);
        const destPath = path.join(userFoldersPath, folder);
        
        if (await fs.pathExists(sourcePath)) {
          try {
            // Kiểm tra xem có phải symlink không
            const stats = await fs.lstat(sourcePath);
            
            if (stats.isSymbolicLink()) {
              // Nếu là symlink, lấy đường dẫn thực
              const realPath = await fs.realpath(sourcePath);
              console.log(`Thư mục ${folder} là symlink, đường dẫn thực: ${realPath}`);
              
              // Copy nội dung từ đường dẫn thực
              if (await fs.pathExists(realPath)) {
                await fs.copy(realPath, destPath);
                backupResults.push(`${folder} (symlink -> ${realPath})`);
              } else {
                console.warn(`Đường dẫn thực không tồn tại: ${realPath}`);
                backupResults.push(`${folder} (symlink broken)`);
              }
            } else {
              // Copy bình thường nếu không phải symlink
              await fs.copy(sourcePath, destPath);
              backupResults.push(folder);
            }
            
            // Tính kích thước và số file
            const folderSize = await this.getDirectorySize(destPath);
            const folderFiles = await this.getFileCount(destPath);
            totalSize += folderSize;
            totalFiles += folderFiles;
            
            console.log(`Đã backup ${folder}: ${this.formatBytes(folderSize)}, ${folderFiles} files`);
            
          } catch (folderError) {
            console.error(`Lỗi khi backup thư mục ${folder}:`, folderError);
            
            // Thử tạo thư mục trống nếu không copy được
            try {
              await fs.ensureDir(destPath);
              backupResults.push(`${folder} (empty - error: ${folderError.message})`);
            } catch (ensureError) {
              console.error(`Không thể tạo thư mục ${folder}:`, ensureError);
              backupResults.push(`${folder} (failed)`);
            }
          }
        } else {
          console.warn(`Thư mục ${folder} không tồn tại: ${sourcePath}`);
          backupResults.push(`${folder} (not found)`);
        }
      }
      
      const driveInfo = await this.getDriveInfo(basePath);
      
      return {
        success: true,
        message: `Sao lưu thư mục người dùng thành công: ${backupResults.join(', ')}`,
        backupPath: fullBackupPath,
        size: totalSize,
        filesCount: totalFiles,
        driveInfo
      };
    } catch (error) {
      console.error('Lỗi khi sao lưu thư mục người dùng:', error);
      throw error;
    }
  }

  async backupCustomFolders(folders: string[], backupPath?: string): Promise<BackupResult> {
    try {
      const basePath = backupPath || path.join(os.homedir(), 'Desktop');
      const fullBackupPath = await this.createBackupStructure(basePath);
      const customFoldersPath = path.join(fullBackupPath, '05_Custom_Folders');
      
      let totalSize = 0;
      let totalFiles = 0;
      
      for (const folder of folders) {
        if (await fs.pathExists(folder)) {
          const folderName = path.basename(folder);
          const destPath = path.join(customFoldersPath, folderName);
          
          await fs.copy(folder, destPath);
          totalSize += await this.getDirectorySize(destPath);
          totalFiles += await this.getFileCount(destPath);
        }
      }
      
      const driveInfo = await this.getDriveInfo(basePath);
      
      return {
        success: true,
        message: 'Sao lưu thư mục tùy chọn thành công',
        backupPath: fullBackupPath,
        size: totalSize,
        filesCount: totalFiles,
        driveInfo
      };
    } catch (error) {
      console.error('Lỗi khi sao lưu thư mục tùy chọn:', error);
      throw error;
    }
  }

  async createFullBackup(options: BackupOptions): Promise<BackupResult[]> {
    const results: BackupResult[] = [];
    
    try {
      // Kiểm tra dung lượng ổ cứng
      const estimatedSize = 1024 * 1024 * 1024 * 10; // Ước tính 10GB
      const hasSpace = await this.checkDriveSpace(options.selectedDrive, estimatedSize);
      
      if (!hasSpace) {
        throw new Error(`Ổ cứng ${options.selectedDrive} không đủ dung lượng trống`);
      }
      
      const backupBasePath = options.selectedDrive;
      
      if (options.includeDrivers) {
        results.push(await this.backupDrivers(backupBasePath));
      }
      
      if (options.includeZalo) {
        results.push(await this.backupZaloData(backupBasePath));
      }

      if (options.includeBrowserProfiles) {
        results.push(await this.backupBrowserProfiles(backupBasePath));
      }
      
      if (options.includeUserFolders) {
        const userFolders = ['Desktop', 'Documents', 'Pictures', 'Videos', 'Downloads', 'OneDrive'];
        results.push(await this.backupUserFolders(userFolders, backupBasePath));
      }
      
      if (options.includeCustomFolders && options.customFolders.length > 0) {
        results.push(await this.backupCustomFolders(options.customFolders, backupBasePath));
      }
      
      return results;
    } catch (error) {
      console.error('Lỗi khi tạo backup đầy đủ:', error);
      throw error;
    }
  }

  private async getDriveInfo(basePath: string): Promise<{ drive: string; freeSpace: number; totalSpace: number }> {
    try {
      const drives = await this.getAvailableDrives();
      const driveLetter = path.parse(basePath).root.replace('\\', '');
      const drive = drives.find(d => d.drive === driveLetter);
      
      if (drive) {
        return {
          drive: drive.drive,
          freeSpace: drive.freeSpace,
          totalSpace: drive.totalSpace
        };
      }
      
      return { drive: 'C:', freeSpace: 0, totalSpace: 0 };
    } catch (error) {
      return { drive: 'C:', freeSpace: 0, totalSpace: 0 };
    }
  }

  async restoreBackup(backupPath: string, restorePath: string): Promise<boolean> {
    try {
      if (!await fs.pathExists(backupPath)) {
        throw new Error('Đường dẫn backup không tồn tại');
      }
      
      await fs.ensureDir(restorePath);
      await fs.copy(backupPath, restorePath);
      
      return true;
    } catch (error) {
      console.error('Lỗi khi khôi phục backup:', error);
      throw error;
    }
  }

  // Restore Zalo data
  async restoreZaloData(backupPath: string): Promise<{ success: boolean; message: string }> {
    try {
      const zaloBackupPath = path.join(backupPath, '02_Zalo_Data', 'Zalo_Data');
      
      if (!await fs.pathExists(zaloBackupPath)) {
        throw new Error('Không tìm thấy dữ liệu Zalo trong backup');
      }
      
      const zaloOriginalPath = path.join(os.homedir(), 'AppData', 'Local', 'ZaloPC');
      
      // Tạo backup của Zalo hiện tại trước khi restore
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const currentZaloBackup = path.join(os.homedir(), 'AppData', 'Local', `ZaloPC_backup_${timestamp}`);
      
      if (await fs.pathExists(zaloOriginalPath)) {
        await fs.move(zaloOriginalPath, currentZaloBackup);
        console.log(`Đã backup Zalo hiện tại: ${currentZaloBackup}`);
      }
      
      // Restore Zalo data
      await fs.copy(zaloBackupPath, zaloOriginalPath);
      
      return {
        success: true,
        message: `Khôi phục dữ liệu Zalo thành công. Backup hiện tại: ${currentZaloBackup}`
      };
    } catch (error) {
      console.error('Lỗi khi khôi phục Zalo:', error);
      return { success: false, message: `Lỗi khi khôi phục Zalo: ${error.message}` };
    }
  }

  // Restore user folders with path redirection
  async restoreUserFolders(backupPath: string): Promise<{ success: boolean; message: string; restoredFolders: string[] }> {
    try {
      const userFoldersBackupPath = path.join(backupPath, '04_User_Folders');
      
      if (!await fs.pathExists(userFoldersBackupPath)) {
        throw new Error('Không tìm thấy thư mục người dùng trong backup');
      }
      
      const userFolders = ['Desktop', 'Documents', 'OneDrive', 'Pictures', 'Videos', 'Downloads'];
      const restoredFolders: string[] = [];
      const errors: string[] = [];
      
      for (const folder of userFolders) {
        const sourcePath = path.join(userFoldersBackupPath, folder);
        const targetPath = path.join(os.homedir(), folder);
        
        if (await fs.pathExists(sourcePath)) {
          try {
            // Tạo backup của thư mục hiện tại
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentFolderBackup = path.join(os.homedir(), `${folder}_backup_${timestamp}`);
            
            if (await fs.pathExists(targetPath)) {
              try {
                // Kiểm tra xem có phải symlink không
                const stats = await fs.lstat(targetPath);
                if (stats.isSymbolicLink()) {
                  // Nếu là symlink, chỉ backup thông tin symlink
                  const realPath = await fs.realpath(targetPath);
                  await writeFile(path.join(os.homedir(), `${folder}_symlink_backup_${timestamp}.txt`), 
                    `Original symlink: ${targetPath}\nTarget: ${realPath}`);
                  console.log(`Đã backup symlink ${folder}: ${targetPath} -> ${realPath}`);
                } else {
                  // Backup thư mục bình thường
                  await fs.move(targetPath, currentFolderBackup);
                  console.log(`Đã backup ${folder} hiện tại: ${currentFolderBackup}`);
                }
              } catch (backupError) {
                console.warn(`Không thể backup ${folder} hiện tại:`, backupError);
              }
            }
            
            // Restore thư mục
            await fs.copy(sourcePath, targetPath);
            restoredFolders.push(folder);
            
            console.log(`Đã khôi phục ${folder}: ${targetPath}`);
            
          } catch (restoreError) {
            console.error(`Lỗi khi khôi phục ${folder}:`, restoreError);
            errors.push(`${folder}: ${restoreError.message}`);
          }
        } else {
          console.warn(`Không tìm thấy backup cho ${folder}: ${sourcePath}`);
        }
      }
      
      const message = errors.length > 0 
        ? `Khôi phục ${restoredFolders.length} thư mục thành công, ${errors.length} lỗi: ${errors.join('; ')}`
        : `Khôi phục ${restoredFolders.length} thư mục người dùng thành công`;
      
      return {
        success: restoredFolders.length > 0,
        message,
        restoredFolders
      };
    } catch (error) {
      console.error('Lỗi khi khôi phục thư mục người dùng:', error);
      return { 
        success: false, 
        message: `Lỗi khi khôi phục thư mục người dùng: ${error.message}`,
        restoredFolders: []
      };
    }
  }

  // Find latest backup
  async findLatestBackup(baseDrive: string): Promise<string | null> {
    try {
      const drives = await this.getAvailableDrives();
      const targetDrive = drives.find(d => d.drive === baseDrive);
      
      if (!targetDrive) {
        throw new Error(`Không tìm thấy ổ cứng ${baseDrive}`);
      }
      
      // Tìm thư mục Backup
      const backupRootPath = path.join(baseDrive, 'Backup');
      
      if (!await fs.pathExists(backupRootPath)) {
        return null;
      }
      
      // Tìm tất cả các folder backup theo ngày
      const backupFolders: string[] = [];
      
      try {
        const items = await fs.readdir(backupRootPath);
        for (const item of items) {
          // Kiểm tra format DD_MM_YYYY
          if (/^\d{2}_\d{2}_\d{4}$/.test(item) && await fs.pathExists(path.join(backupRootPath, item))) {
            backupFolders.push(item);
          }
        }
      } catch (error) {
        console.error('Lỗi khi đọc thư mục Backup:', error);
        return null;
      }
      
      if (backupFolders.length === 0) {
        return null;
      }
      
      // Sắp xếp theo thời gian tạo (mới nhất trước)
      backupFolders.sort((a, b) => {
        const aPath = path.join(backupRootPath, a);
        const bPath = path.join(backupRootPath, b);
        const aStats = fs.statSync(aPath);
        const bStats = fs.statSync(bPath);
        return bStats.mtime.getTime() - aStats.mtime.getTime();
      });
      
      return path.join(backupRootPath, backupFolders[0]);
    } catch (error) {
      console.error('Lỗi khi tìm backup mới nhất:', error);
      return null;
    }
  }

  // Get backup info
  async getBackupInfo(backupPath: string): Promise<{
    path: string;
    createdDate: Date;
    size: number;
    hasZalo: boolean;
    hasUserFolders: boolean;
    hasDrivers: boolean;
    hasBrowserProfiles: boolean;
  }> {
    try {
      const stats = await fs.stat(backupPath);
      const size = await this.getDirectorySize(backupPath);
      
      const hasZalo = await fs.pathExists(path.join(backupPath, '02_Zalo_Data'));
      const hasUserFolders = await fs.pathExists(path.join(backupPath, '04_User_Folders'));
      const hasDrivers = await fs.pathExists(path.join(backupPath, '01_Drivers'));
      const hasBrowserProfiles = await fs.pathExists(path.join(backupPath, '03_Browser_Profiles'));
      
      return {
        path: backupPath,
        createdDate: stats.mtime,
        size,
        hasZalo,
        hasUserFolders,
        hasDrivers,
        hasBrowserProfiles
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin backup:', error);
      throw error;
    }
  }

  private async getDirectorySize(dirPath: string): Promise<number> {
    try {
      const files = await fs.readdir(dirPath);
      let size = 0;
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isDirectory()) {
          size += await this.getDirectorySize(filePath);
        } else {
          size += stats.size;
        }
      }
      
      return size;
    } catch (error) {
      return 0;
    }
  }

  private async getFileCount(dirPath: string): Promise<number> {
    try {
      const files = await fs.readdir(dirPath);
      let count = 0;
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isDirectory()) {
          count += await this.getFileCount(filePath);
        } else {
          count++;
        }
      }
      
      return count;
    } catch (error) {
      return 0;
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Tìm các file backup WiFi trên ổ cứng
  async findWifiBackupFiles(drive: string): Promise<string[]> {
    try {
      const wifiFiles: string[] = [];
      
      // Tìm thư mục Backup
      const backupRootPath = path.join(drive, 'Backup');
      
      if (!await fs.pathExists(backupRootPath)) {
        return [];
      }
      
      // Tìm tất cả các thư mục backup theo ngày
      const backupDirs = await fs.readdir(backupRootPath);
      
      for (const dir of backupDirs) {
        // Kiểm tra format DD_MM_YYYY
        if (/^\d{2}_\d{2}_\d{4}$/.test(dir)) {
          const backupPath = path.join(backupRootPath, dir);
          const wifiConfigPath = path.join(backupPath, '06_System_Info', 'WiFi_Config.json');
          
          if (await fs.pathExists(wifiConfigPath)) {
            wifiFiles.push(wifiConfigPath);
          }
        }
      }
      
      // Sắp xếp theo thời gian tạo (mới nhất trước)
      wifiFiles.sort((a, b) => {
        const statsA = fs.statSync(a);
        const statsB = fs.statSync(b);
        return statsB.mtime.getTime() - statsA.mtime.getTime();
      });
      
      return wifiFiles;
    } catch (error) {
      console.error('Lỗi khi tìm file backup WiFi:', error);
      return [];
    }
  }

  // Khôi phục cấu hình WiFi từ file backup
  async restoreWifiConfig(backupFile: string): Promise<{ success: boolean; message: string; restoredNetworks: string[] }> {
    try {
      if (!await fs.pathExists(backupFile)) {
        return {
          success: false,
          message: 'File backup không tồn tại',
          restoredNetworks: []
        };
      }

      // Đọc file backup
      const backupData = await fs.readJson(backupFile);
      
      if (!backupData.networks || !Array.isArray(backupData.networks)) {
        return {
          success: false,
          message: 'File backup không hợp lệ hoặc không có dữ liệu WiFi',
          restoredNetworks: []
        };
      }

      // Backup WiFi hiện tại trước khi restore
      await this.backupWifiProfiles();
      
      const restoredNetworks: string[] = [];
      let successCount = 0;
      let totalCount = backupData.networks.length;

      for (const network of backupData.networks) {
        try {
          // Tạo profile XML cho từng mạng
          const profileXml = this.createWifiProfileXml(network);
          const tempProfilePath = path.join(os.tmpdir(), `${network.ssid}_profile.xml`);
          
          await fs.writeFile(tempProfilePath, profileXml);
          
          // Thêm profile vào hệ thống
          const { stdout, stderr } = await executeCmdCommand(
            `netsh wlan add profile filename="${tempProfilePath}" user=all`
          );
          
          if (stderr) {
            console.error(`Lỗi khi thêm profile ${network.ssid}:`, stderr);
          } else {
            restoredNetworks.push(network.ssid);
            successCount++;
          }
          
          // Xóa file tạm
          await fs.remove(tempProfilePath);
          
        } catch (error) {
          console.error(`Lỗi khi khôi phục mạng ${network.ssid}:`, error);
        }
      }

      const message = `Khôi phục thành công ${successCount}/${totalCount} mạng WiFi.`;
      
      return {
        success: successCount > 0,
        message,
        restoredNetworks
      };
      
    } catch (error) {
      console.error('Lỗi khi khôi phục cấu hình WiFi:', error);
      return {
        success: false,
        message: `Lỗi khi khôi phục cấu hình WiFi: ${error}`,
        restoredNetworks: []
      };
    }
  }

  // Backup WiFi profiles hiện tại
  private async backupWifiProfiles(): Promise<{ success: boolean; message: string }> {
    try {
      const { stdout } = await executeCmdCommand('netsh wlan export profile key=clear folder="%TEMP%"');
      return {
        success: true,
        message: 'Backup WiFi hiện tại thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: `Lỗi backup WiFi hiện tại: ${error}`
      };
    }
  }

  // Backup WiFi config vào thư mục System Info
  async backupWifiConfig(backupPath?: string): Promise<BackupResult> {
    try {
      const basePath = backupPath || path.join(os.homedir(), 'Desktop');
      const fullBackupPath = await this.createBackupStructure(basePath);
      const systemInfoPath = path.join(fullBackupPath, '06_System_Info');
      
      // Tạo thư mục System Info nếu chưa có
      await fs.ensureDir(systemInfoPath);
      
      // Export WiFi profiles
      const { stdout } = await executeCmdCommand('netsh wlan export profile key=clear folder="' + systemInfoPath + '"');
      
      // Lấy danh sách mạng WiFi hiện tại
      const { stdout: networksOutput } = await executeCmdCommand('netsh wlan show profiles');
      
      // Tạo file config JSON
      const wifiConfig = {
        exportDate: new Date().toISOString(),
        networks: [],
        profiles: []
      };
      
      // Parse networks output để lấy danh sách mạng
      const lines = networksOutput.split('\n');
      for (const line of lines) {
        if (line.includes('All User Profile')) {
          const profileName = line.split(':')[1]?.trim();
          if (profileName) {
            wifiConfig.profiles.push(profileName);
          }
        }
      }
      
      // Lưu config vào file
      const configPath = path.join(systemInfoPath, 'WiFi_Config.json');
      await fs.writeJson(configPath, wifiConfig, { spaces: 2 });
      
      const size = await this.getDirectorySize(systemInfoPath);
      const filesCount = await this.getFileCount(systemInfoPath);
      
      const driveInfo = await this.getDriveInfo(basePath);
      
      return {
        success: true,
        message: `Sao lưu cấu hình WiFi thành công: ${wifiConfig.profiles.length} profiles`,
        backupPath: fullBackupPath,
        size,
        filesCount,
        driveInfo
      };
    } catch (error) {
      console.error('Lỗi khi sao lưu cấu hình WiFi:', error);
      throw error;
    }
  }

  // Tạo XML profile cho WiFi
  private createWifiProfileXml(network: any): string {
    const securityType = network.security || 'WPA2PSK';
    const encryptionType = network.encryption || 'AES';
    
    return `<?xml version="1.0"?>
<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
  <name>${network.ssid}</name>
  <SSIDConfig>
    <SSID>
      <name>${network.ssid}</name>
    </SSID>
  </SSIDConfig>
  <connectionType>ESS</connectionType>
  <connectionMode>auto</connectionMode>
  <MSM>
    <security>
      <authEncryption>
        <authentication>${securityType}</authentication>
        <encryption>${encryptionType}</encryption>
        <useOneX>false</useOneX>
      </authEncryption>
      <sharedKey>
        <keyType>passPhrase</keyType>
        <protected>false</protected>
        <keyMaterial>${network.password}</keyMaterial>
      </sharedKey>
    </security>
  </MSM>
</WLANProfile>`;
  }

  // Kill trình duyệt nếu đang chạy
  private async killBrowserProcesses(browserName: string): Promise<void> {
    const processNames = {
      'Chrome': ['chrome.exe', 'chromedriver.exe'],
      'Edge': ['msedge.exe', 'msedgedriver.exe'],
      'Firefox': ['firefox.exe', 'geckodriver.exe'],
      'Opera': ['opera.exe', 'operadriver.exe'],
      'Brave': ['brave.exe', 'bravedriver.exe'],
      'Vivaldi': ['vivaldi.exe', 'vivaldidriver.exe']
    };

    const processes = processNames[browserName] || [];
    
    for (const processName of processes) {
      try {
        const psCommand = `
          try {
            $processes = Get-Process -Name "${processName}" -ErrorAction SilentlyContinue
            if ($processes) {
              Write-Host "Killing ${processName} processes..."
              $processes | Stop-Process -Force
              Start-Sleep -Seconds 2
              Write-Host "SUCCESS: Killed ${processName} processes"
            } else {
              Write-Host "INFO: No ${processName} processes found"
            }
          } catch {
            Write-Host "ERROR: Failed to kill ${processName} - $($_.Exception.Message)"
          }
        `;
        
        await executePowerShellScript(psCommand);
        console.log(`Đã kill ${processName} processes`);
      } catch (error) {
        console.log(`Không thể kill ${processName}:`, error);
      }
    }
  }

  // Copy directory bỏ qua các file bị khóa
  private async copyDirectorySkippingLockedFiles(source: string, destination: string): Promise<void> {
    const items = await fs.readdir(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      
      try {
        const stats = await fs.stat(sourcePath);
        
        if (stats.isDirectory()) {
          await fs.ensureDir(destPath);
          await this.copyDirectorySkippingLockedFiles(sourcePath, destPath);
        } else {
          try {
            await fs.copyFile(sourcePath, destPath);
          } catch (copyError) {
            // Bỏ qua file bị khóa
            console.log(`Bỏ qua file bị khóa: ${sourcePath}`);
          }
        }
      } catch (error) {
        // Bỏ qua file/thư mục không thể truy cập
        console.log(`Bỏ qua item không thể truy cập: ${sourcePath}`);
      }
    }
  }

  // Backup thông minh trình duyệt - chỉ copy những file quan trọng
  private async smartBackupBrowser(sourcePath: string, destPath: string, browserName: string): Promise<void> {
    const items = await fs.readdir(sourcePath);
    
    for (const item of items) {
      const sourceItemPath = path.join(sourcePath, item);
      const destItemPath = path.join(destPath, item);
      
      try {
        const stats = await fs.stat(sourceItemPath);
        
        if (stats.isDirectory()) {
          // Xử lý thư mục theo loại trình duyệt
          if (browserName === 'Firefox') {
            await this.backupFirefoxProfile(sourceItemPath, destItemPath);
          } else {
            // Chrome, Edge, Opera, Brave, Vivaldi
            await this.backupChromiumProfile(sourceItemPath, destItemPath, item);
          }
        } else {
          // Copy file cấu hình quan trọng
          if (this.isImportantFile(item)) {
            await fs.copyFile(sourceItemPath, destItemPath);
          }
        }
      } catch (error) {
        console.log(`Bỏ qua item không thể truy cập: ${sourceItemPath}`);
      }
    }
  }

  // Backup Firefox profile
  private async backupFirefoxProfile(sourcePath: string, destPath: string): Promise<void> {
    await fs.ensureDir(destPath);
    
    const importantFiles = [
      'prefs.js',
      'places.sqlite',
      'cookies.sqlite',
      'formhistory.sqlite',
      'key3.db',
      'key4.db',
      'logins.json',
      'extensions.json',
      'extensions.sqlite',
      'storage.sqlite',
      'webappsstore.sqlite',
      'permissions.sqlite',
      'content-prefs.sqlite',
      'handlers.json',
      'mimeTypes.rdf',
      'bookmarks.html',
      'user.js',
      'chrome'
    ];
    
    const items = await fs.readdir(sourcePath);
    
    for (const item of items) {
      if (importantFiles.includes(item)) {
        const sourceItemPath = path.join(sourcePath, item);
        const destItemPath = path.join(destPath, item);
        
        try {
          const stats = await fs.stat(sourceItemPath);
          
          if (stats.isDirectory()) {
            await fs.copy(sourceItemPath, destItemPath);
          } else {
            await fs.copyFile(sourceItemPath, destItemPath);
          }
        } catch (error) {
          console.log(`Không thể copy Firefox file: ${item}`);
        }
      }
    }
  }

  // Backup Chromium-based browser profile (Chrome, Edge, Opera, Brave, Vivaldi)
  private async backupChromiumProfile(sourcePath: string, destPath: string, profileName: string): Promise<void> {
    // Chỉ backup profile Default và các profile khác nếu có
    if (profileName === 'Default' || profileName.startsWith('Profile ')) {
      await fs.ensureDir(destPath);
      
      const importantFiles = [
        'Preferences',
        'Bookmarks',
        'Bookmarks.bak',
        'Favicons',
        'History',
        'History-journal',
        'Login Data',
        'Login Data-journal',
        'Network Action Predictor',
        'Network Action Predictor-journal',
        'Network Persistent State',
        'Network Persistent State-journal',
        'Origin Bound Certs',
        'Origin Bound Certs-journal',
        'QuotaManager',
        'QuotaManager-journal',
        'Shortcuts',
        'Shortcuts-journal',
        'Top Sites',
        'Top Sites-journal',
        'Web Data',
        'Web Data-journal',
        'Cookies',
        'Cookies-journal',
        'Extension State',
        'Extension State-journal',
        'Local State',
        'Secure Preferences',
        'Last Session',
        'Last Tabs',
        'Current Session',
        'Current Tabs',
        'Sessions',
        'TransportSecurity',
        'TransportSecurity-journal',
        'Visited Links',
        'WebRTCIdentityStore',
        'WebRTCIdentityStore-journal',
        'Local Storage',
        'Session Storage',
        'IndexedDB',
        'databases',
        'Extensions',
        'Local Extension Settings',
        'Sync Data',
        'Storage',
        'GPUCache',
        'Code Cache',
        'Service Worker',
        'WebStorage',
        'Network',
        'Cache',
        'Sessions',
        'User Data'
      ];
      
      const items = await fs.readdir(sourcePath);
      
      for (const item of items) {
        if (importantFiles.includes(item)) {
          const sourceItemPath = path.join(sourcePath, item);
          const destItemPath = path.join(destPath, item);
          
          try {
            const stats = await fs.stat(sourceItemPath);
            
            if (stats.isDirectory()) {
              // Bỏ qua các thư mục cache không cần thiết
              if (!this.isCacheFolder(item)) {
                await fs.copy(sourceItemPath, destItemPath);
              }
            } else {
              await fs.copyFile(sourceItemPath, destItemPath);
            }
          } catch (error) {
            console.log(`Không thể copy Chromium file: ${item}`);
          }
        }
      }
    }
  }

  // Kiểm tra file có quan trọng không
  private isImportantFile(filename: string): boolean {
    const importantFiles = [
      'Local State',
      'Secure Preferences',
      'Preferences',
      'Bookmarks',
      'History',
      'Cookies',
      'Login Data',
      'Web Data',
      'Favicons',
      'Shortcuts',
      'Top Sites',
      'Last Session',
      'Last Tabs',
      'Current Session',
      'Current Tabs',
      'Sessions',
      'Visited Links',
      'TransportSecurity',
      'WebRTCIdentityStore',
      'Origin Bound Certs',
      'Network Action Predictor',
      'Network Persistent State',
      'QuotaManager',
      'Extension State',
      'Local Extension Settings',
      'Sync Data',
      'Storage',
      'IndexedDB',
      'databases',
      'Local Storage',
      'Session Storage',
      'Extensions',
      'User Data'
    ];
    
    return importantFiles.includes(filename);
  }

  // Kiểm tra thư mục có phải cache không
  private isCacheFolder(folderName: string): boolean {
    const cacheFolders = [
      'Cache',
      'Code Cache',
      'GPUCache',
      'Service Worker',
      'WebStorage',
      'Network',
      'QuotaManager',
      'QuotaManager-journal',
      'TransportSecurity',
      'TransportSecurity-journal',
      'cache2',
      'startupCache',
      'thumbnails',
      'CacheStorage',
      'IndexedDB',
      'databases',
      'Local Storage',
      'Session Storage'
    ];
    
    return cacheFolders.includes(folderName);
  }

  // Tạo ZIP file bằng Node.js native method
  private async createZipWithNode(sourceDir: string, zipPath: string): Promise<void> {
    const archiver = require('archiver');
    const output = require('fs').createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log(`ZIP created: ${archive.pointer()} total bytes`);
        resolve();
      });

      archive.on('error', (err: any) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }
} 