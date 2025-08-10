import { app, BrowserWindow, ipcMain, dialog, shell, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as https from 'https';
import * as http from 'http';
import { SystemInfoService } from './services/SystemInfoService';
import { NetworkService } from './services/NetworkService';
import { BackupService } from './services/BackupService';
import { CleanupService } from './services/CleanupService';
import { WindowsOptimizationService } from './services/WindowsOptimizationService';
import { AdvancedSystemInfoService } from './services/AdvancedSystemInfoService';
import { UIOptimizationService } from './services/UIOptimizationService';
import { SystemAnalysisService } from './services/SystemAnalysisService';
 

class MainApp {
  private mainWindow: BrowserWindow | null = null;
  private systemInfoService: SystemInfoService;
  private networkService: NetworkService;
  private backupService: BackupService;
  private cleanupService: CleanupService;
  private windowsOptimizationService: WindowsOptimizationService;
  private advancedSystemInfoService: AdvancedSystemInfoService;
  private uiOptimizationService: UIOptimizationService;
  private systemAnalysisService: SystemAnalysisService;
  
  private isDevelopment: boolean;

  constructor() {
    this.systemInfoService = new SystemInfoService();
    this.networkService = new NetworkService();
    this.backupService = new BackupService();
    this.cleanupService = new CleanupService();
    this.windowsOptimizationService = new WindowsOptimizationService();
    this.advancedSystemInfoService = new AdvancedSystemInfoService();
    this.uiOptimizationService = new UIOptimizationService();
    this.systemAnalysisService = new SystemAnalysisService();
    this.isDevelopment = process.env.NODE_ENV === 'development' || !app.isPackaged;
  }

  // Kiểm tra quyền Administrator
  private checkAdminRights(): boolean {
    if (process.platform === 'win32') {
      try {
        // Kiểm tra quyền Administrator bằng cách thử truy cập thư mục system
        const systemDir = process.env.SYSTEMROOT || 'C:\\Windows';
        fs.accessSync(path.join(systemDir, 'System32'), fs.constants.R_OK);
        return true;
      } catch (error) {
        return false;
      }
    }
    return true; // Không phải Windows
  }

  // Yêu cầu quyền Administrator
  private requestAdminRights(): void {
    if (process.platform === 'win32' && !this.checkAdminRights()) {
      const { exec } = require('child_process');
      const { spawn } = require('child_process');
      
      console.log('🔒 Yêu cầu quyền Administrator...');
      
      // Tạo manifest để yêu cầu quyền Administrator
      const manifestPath = path.join(__dirname, 'app.manifest');
      const manifestContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
      <requestedPrivileges>
        <requestedExecutionLevel level="requireAdministrator" uiAccess="false"/>
      </requestedPrivileges>
    </security>
  </trustInfo>
</assembly>`;
      
      try {
        fs.writeFileSync(manifestPath, manifestContent);
        
        // Khởi động lại ứng dụng với quyền Administrator
        const electronPath = process.execPath;
        const appPath = app.getAppPath();
        
        spawn(electronPath, [appPath], {
          stdio: 'inherit',
          detached: true
        });
        
        app.quit();
      } catch (error) {
        console.error('❌ Không thể yêu cầu quyền Administrator:', error);
        dialog.showErrorBox(
          'Quyền Administrator cần thiết',
          'Ứng dụng này cần quyền Administrator để hoạt động đúng cách.\n\nVui lòng chạy lại ứng dụng với quyền Administrator.'
        );
        app.quit();
      }
    }
  }

  public async initialize(): Promise<void> {
    // Kiểm tra quyền Administrator trước khi khởi tạo
    this.requestAdminRights();
    
    await app.whenReady();
    this.createWindow();
    this.setupIpcHandlers();
    this.setupAppEvents();
    
    // Setup hot reload for development
    if (this.isDevelopment) {
      this.setupHotReload();
    }
  }

  private createWindow(): void {
    const iconPath = path.join(__dirname, '../assets/icon/icon.png');
    

    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 1000,
      minHeight: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      icon: iconPath,
      titleBarStyle: 'default',
      show: true
    });


    // Load the React app
          if (this.isDevelopment) {
        // Use webpack dev server in development
        this.mainWindow.loadURL('http://localhost:3000');
      } else {
      // Use built files in production
      this.mainWindow.loadFile(path.join(__dirname, '../build/renderer/index.html'));
    }

    
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  // Method để focus window khi có instance thứ 2
  public focusWindow(): void {
    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) this.mainWindow.restore();
      this.mainWindow.focus();
    }
  }

  private setupHotReload(): void {
    // Chỉ restart khi main process files thay đổi
    const mainPath = path.join(__dirname);
    let isRestarting = false;
    
    fs.watch(mainPath, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith('.js') && !filename.includes('node_modules') && !isRestarting) {

        
        isRestarting = true;
        
        // Đóng window trước
        if (this.mainWindow) {
          this.mainWindow.close();
        }
        
        // Restart app
        setTimeout(() => {
          app.relaunch();
          app.exit(0);
        }, 100);
      }
    });


  }

  private setupIpcHandlers(): void {
    // App Environment Info
    ipcMain.handle('get-app-environment', () => {
      return {
        isDevelopment: this.isDevelopment,
        isPackaged: app.isPackaged,
        appPath: app.getAppPath(),
        resourcePath: process.resourcesPath
      };
    });

    // System Information
    ipcMain.handle('get-system-info', async () => {

      try {

        const [system, cpu, memory, disk, gpu] = await Promise.all([
          this.systemInfoService.getSystemInfo(),
          this.systemInfoService.getCpuInfo(),
          this.systemInfoService.getMemoryInfo(),
          this.systemInfoService.getDiskInfo(),
          this.systemInfoService.getGpuInfo()
        ]);
        

        const result = {
          system,
          cpu,
          memory,
          disk,
          gpu
        };
        
        return result;
      } catch (error) {
        console.error('❌ [MAIN] Error getting system info:', error);
        throw error;
      }
    });

    ipcMain.handle('get-cpu-info', async () => {
      return await this.systemInfoService.getCpuInfo();
    });

    ipcMain.handle('get-memory-info', async () => {
      return await this.systemInfoService.getMemoryInfo();
    });

    ipcMain.handle('get-disk-info', async () => {
      return await this.systemInfoService.getDiskInfo();
    });

    ipcMain.handle('get-gpu-info', async () => {
      return await this.systemInfoService.getGpuInfo();
    });

    

    // Network
    ipcMain.handle('get-network-interfaces', async () => {
      return await this.advancedSystemInfoService.getNetworkInterfaces();
    });

    ipcMain.handle('configure-network', async (event: IpcMainInvokeEvent, config: any) => {
      return await this.networkService.configureNetwork(config);
    });

    ipcMain.handle('backup-wifi', async () => {
      return await this.networkService.backupWifiProfiles();
    });

    ipcMain.handle('test-network-connection', async () => {
      return await this.networkService.testNetworkConnection();
    });

    ipcMain.handle('flush-dns', async () => {
      return await this.networkService.flushDns();
    });

    ipcMain.handle('reset-network', async () => {
      return await this.networkService.resetNetwork();
    });

    // DNS Management
    ipcMain.handle('set-custom-dns', async (event: IpcMainInvokeEvent, interfaceName: string, dnsConfig: any) => {
      return await this.networkService.setCustomDNS(interfaceName, dnsConfig);
    });

    ipcMain.handle('set-preset-dns', async (event: IpcMainInvokeEvent, interfaceName: string, preset: string) => {
      return await this.networkService.setPresetDNS(interfaceName, preset);
    });

    ipcMain.handle('clear-dns', async (event: IpcMainInvokeEvent, interfaceName: string) => {
      return await this.networkService.clearDNS(interfaceName);
    });

    ipcMain.handle('get-current-dns', async (event: IpcMainInvokeEvent, interfaceName: string) => {
      return await this.networkService.getCurrentDNS(interfaceName);
    });

    // IPv6 Management
    ipcMain.handle('disable-ipv6', async () => {
      return await this.networkService.disableIPv6();
    });

    ipcMain.handle('enable-ipv6', async () => {
      return await this.networkService.enableIPv6();
    });

    ipcMain.handle('get-ipv6-status', async () => {
      return await this.networkService.getIPv6Status();
    });

    // Network Optimization
    ipcMain.handle('optimize-network', async (event: IpcMainInvokeEvent, optimization: any) => {
      return await this.networkService.optimizeNetwork(optimization);
    });

    // Proxy Management
    ipcMain.handle('set-proxy', async (event: IpcMainInvokeEvent, config: any) => {
      return await this.networkService.setProxy(config);
    });

    ipcMain.handle('get-proxy-status', async () => {
      return await this.networkService.getProxyStatus();
    });

    // Network Speed Test
    ipcMain.handle('test-network-speed', async (event: IpcMainInvokeEvent, serverID?: number) => {
      return await this.networkService.testNetworkSpeed(serverID);
    });

    // SpeedTest Servers
    ipcMain.handle('get-speedtest-servers', async () => {
      return await this.networkService.getSpeedTestServers();
    });

    // Backup
    ipcMain.handle('backup-drivers', async (event: IpcMainInvokeEvent, selectedDrive?: string) => {
      return await this.backupService.backupDrivers(selectedDrive);
    });

    ipcMain.handle('backup-zalo', async (event: IpcMainInvokeEvent, selectedDrive?: string) => {
      return await this.backupService.backupZaloData(selectedDrive);
    });

    ipcMain.handle('backup-browser-profiles', async (event: IpcMainInvokeEvent, selectedDrive?: string) => {
      return await this.backupService.backupBrowserProfiles(selectedDrive);
    });

    ipcMain.handle('backup-user-folders', async (event: IpcMainInvokeEvent, folders: string[], selectedDrive?: string) => {
      return await this.backupService.backupUserFolders(folders, selectedDrive);
    });

    ipcMain.handle('backup-custom-folders', async (event: IpcMainInvokeEvent, folders: string[], selectedDrive?: string) => {
      return await this.backupService.backupCustomFolders(folders, selectedDrive);
    });

    ipcMain.handle('get-available-drives', async () => {
      return await this.backupService.getAvailableDrives();
    });

    ipcMain.handle('create-full-backup', async (event: IpcMainInvokeEvent, options: any) => {
      return await this.backupService.createFullBackup(options);
    });

    // Restore functions
    ipcMain.handle('restore-zalo-data', async (event: IpcMainInvokeEvent, backupPath: string) => {
      return await this.backupService.restoreZaloData(backupPath);
    });

    ipcMain.handle('restore-user-folders', async (event: IpcMainInvokeEvent, backupPath: string) => {
      return await this.backupService.restoreUserFolders(backupPath);
    });

    ipcMain.handle('find-latest-backup', async (event: IpcMainInvokeEvent, baseDrive: string) => {
      return await this.backupService.findLatestBackup(baseDrive);
    });

    ipcMain.handle('get-backup-info', async (event: IpcMainInvokeEvent, backupPath: string) => {
      return await this.backupService.getBackupInfo(backupPath);
    });

    ipcMain.handle('find-wifi-backup-files', async (event: IpcMainInvokeEvent, drive: string) => {
      return await this.backupService.findWifiBackupFiles(drive);
    });

    ipcMain.handle('restore-wifi-config', async (event: IpcMainInvokeEvent, backupFile: string) => {
      return await this.backupService.restoreWifiConfig(backupFile);
    });

    ipcMain.handle('select-wifi-file', async () => {
      const result = await dialog.showOpenDialog(this.mainWindow!, {
        title: 'Chọn file WiFi JSON',
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });
      
      return {
        canceled: result.canceled,
        filePath: result.filePaths[0]
      };
    });

    // Cleanup
    ipcMain.handle('cleanup-system', async (event: IpcMainInvokeEvent, options: any) => {
      return await this.cleanupService.cleanupSystem(options);
    });

    ipcMain.handle('analyze-system-for-cleanup', async () => {
      try {
        const result = await this.systemAnalysisService.analyzeSystemForCleanup();
        console.log('Analysis result:', result);
        return result;
      } catch (error) {
        console.error('Analysis error:', error);
        throw error;
      }
    });

    ipcMain.handle('optimized-cleanup', async (event: IpcMainInvokeEvent, options: any) => {
      try {
        if (this.cleanupService.optimizedCleanup) {
          return await this.cleanupService.optimizedCleanup(options);
        } else {
          // Fallback to regular cleanup
          return await this.cleanupService.cleanupSystem(options);
        }
      } catch (error) {
        console.error('Optimized cleanup error:', error);
        throw error;
      }
    });

    ipcMain.handle('perform-safety-check', async () => {
      try {
        if (this.cleanupService.performSafetyCheck) {
          return await this.cleanupService.performSafetyCheck();
        } else {
          return { safe: true, warnings: [] };
        }
      } catch (error) {
        console.error('Safety check error:', error);
        return { safe: false, warnings: ['Không thể thực hiện kiểm tra an toàn'] };
      }
    });

    // Windows Optimization
    ipcMain.handle('optimize-services', async () => {
      return await this.windowsOptimizationService.optimizeServices();
    });

    ipcMain.handle('disable-windows-defender', async (event: IpcMainInvokeEvent) => {
      return await this.windowsOptimizationService.disableWindowsDefender();
    });

    ipcMain.handle('move-zalo-to-drive', async (event: IpcMainInvokeEvent, drive: string) => {
      return await this.windowsOptimizationService.moveZaloToDrive(drive);
    });

    ipcMain.handle('optimize-selected-services', async (event: IpcMainInvokeEvent, services: string[]) => {
      return await this.windowsOptimizationService.optimizeSelectedServices(services);
    });

    ipcMain.handle('set-virtual-memory', async (event: IpcMainInvokeEvent, sizeGB: number) => {
      return await this.windowsOptimizationService.setVirtualMemory(sizeGB);
    });

    ipcMain.handle('install-selected-apps', async (event: IpcMainInvokeEvent, apps: string[]) => {
      return await this.windowsOptimizationService.installSelectedApps(apps);
    });

    ipcMain.handle('disable-windows-update', async () => {
      return await this.windowsOptimizationService.disableWindowsUpdate();
    });

    ipcMain.handle('activate-windows', async () => {
      return await this.windowsOptimizationService.activateWindows();
    });

    ipcMain.handle('increase-virtual-memory', async (event: IpcMainInvokeEvent, sizeGB: number) => {
      return await this.windowsOptimizationService.increaseVirtualMemory(sizeGB);
    });

    ipcMain.handle('install-silent-apps', async () => {
      return await this.windowsOptimizationService.installSilentApps();
    });

    ipcMain.handle('get-services-info', async () => {
      return await this.windowsOptimizationService.getServicesInfo();
    });

    ipcMain.handle('get-windows-defender-status', async () => {
      return await this.windowsOptimizationService.getWindowsDefenderStatus();
    });

    ipcMain.handle('get-windows-update-status', async () => {
      return await this.windowsOptimizationService.getWindowsUpdateStatus();
    });

    ipcMain.handle('enable-windows-update', async () => {
      return await this.windowsOptimizationService.enableWindowsUpdate();
    });

    ipcMain.handle('reset-virtual-memory', async () => {
      return await this.windowsOptimizationService.resetVirtualMemory();
    });

    // Advanced RAM and CPU optimization
    ipcMain.handle('get-system-performance-info', async () => {
      return await this.windowsOptimizationService.getSystemPerformanceInfo();
    });

    ipcMain.handle('execute-powershell-command', async (event, command: string) => {
      return await this.windowsOptimizationService.executePowerShellCommand(command);
    });

    ipcMain.handle('apply-advanced-ram-optimization', async () => {
      return await this.windowsOptimizationService.applyAdvancedRAMOptimization();
    });

    ipcMain.handle('apply-advanced-cpu-optimization', async () => {
      return await this.windowsOptimizationService.applyAdvancedCPUOptimization();
    });

    // Advanced System Info
    ipcMain.handle('get-processes-info', async () => {
      return await this.advancedSystemInfoService.getProcessesInfo();
    });

    ipcMain.handle('get-network-connections', async () => {
      return await this.advancedSystemInfoService.getNetworkConnections();
    });

    ipcMain.handle('get-installed-apps', async () => {
      return await this.advancedSystemInfoService.getInstalledApps();
    });

    ipcMain.handle('get-windows-features', async () => {
      return await this.advancedSystemInfoService.getWindowsFeatures();
    });

    ipcMain.handle('get-system-performance', async () => {
      return await this.advancedSystemInfoService.getSystemPerformance();
    });

    ipcMain.handle('get-detailed-hardware-info', async () => {
      return await this.advancedSystemInfoService.getDetailedHardwareInfo();
    });

    ipcMain.handle('get-running-services', async () => {
      return await this.advancedSystemInfoService.getRunningServices();
    });

    ipcMain.handle('get-drivers-info', async () => {
      return await this.advancedSystemInfoService.getDriversInfo();
    });

    ipcMain.handle('get-event-logs', async (event: IpcMainInvokeEvent, level: string, count: number) => {
      return await this.advancedSystemInfoService.getEventLogs(level, count);
    });

    ipcMain.handle('get-registry-info', async (event: IpcMainInvokeEvent, path: string) => {
      return await this.advancedSystemInfoService.getRegistryInfo(path);
    });

    // File dialogs
    ipcMain.handle('select-directory', async () => {
      const result = await dialog.showOpenDialog(this.mainWindow!, {
        properties: ['openDirectory']
      });
      return {
        canceled: result.canceled,
        filePath: result.filePaths[0] || null
      };
    });

    ipcMain.handle('select-file', async (event: IpcMainInvokeEvent, options: any) => {
      const result = await dialog.showOpenDialog(this.mainWindow!, {
        properties: ['openFile'],
        filters: options?.filters || []
      });
      return {
        canceled: result.canceled,
        filePath: result.filePaths[0] || null
      };
    });

    // UI Optimization
    ipcMain.handle('get-optimization-settings', async () => {
      return await this.uiOptimizationService.getOptimizationSettings();
    });

    ipcMain.handle('get-network-optimization-options', async () => {
      return this.uiOptimizationService.getNetworkOptimizationOptions();
    });

    ipcMain.handle('get-network-status', async () => {
      return await this.windowsOptimizationService.getNetworkStatus();
    });

    ipcMain.handle('get-current-windows-settings', async () => {
      return await this.uiOptimizationService.getCurrentWindowsSettings();
    });

    ipcMain.handle('apply-optimization', async (event: IpcMainInvokeEvent, optionId: string, enabled: boolean) => {
      const result = await this.uiOptimizationService.applyOptimization(optionId, enabled);
      if (result.success) {
        // Lưu cài đặt
        const settings = await this.uiOptimizationService.getOptimizationSettings();
        settings[optionId] = enabled;
        // persist via WindowsOptimizationService to reuse storage
        await this.windowsOptimizationService.saveOptimizationSettings(settings);
      }
      return result;
    });

    ipcMain.handle('apply-all-optimizations', async (event: IpcMainInvokeEvent, options: any[]) => {
      const result = await this.uiOptimizationService.applyAllOptimizations(options);
      if (result.success) {
        // Lưu cài đặt
        const settings: Record<string, boolean> = {};
        options.forEach(option => {
          settings[option.id] = option.enabled;
        });
        await this.windowsOptimizationService.saveOptimizationSettings(settings);
      }
      return result;
    });

    ipcMain.handle('reset-optimizations', async () => {
      return await this.uiOptimizationService.resetOptimizations();
    });

    ipcMain.handle('export-optimization-settings', async (event: IpcMainInvokeEvent, data: any) => {
      return await this.uiOptimizationService.exportOptimizationSettings(data);
    });

    ipcMain.handle('import-optimization-settings', async () => {
      try {
        const result = await this.uiOptimizationService.importOptimizationSettings();
        
        if (result && (result as any).action === 'showFileDialog') {
          const dialogResult = await dialog.showOpenDialog(this.mainWindow!, (result as any).options);
          
          if (!dialogResult.canceled && dialogResult.filePaths.length > 0) {
            const filePath = dialogResult.filePaths[0];
            const fileContent = await fs.readFile(filePath, 'utf8');
            const importedData = JSON.parse(fileContent);
            
            // Validate imported data
            if (importedData && importedData.optimizations && Array.isArray(importedData.optimizations)) {
              // Save imported settings
              const settings: Record<string, boolean> = {};
              importedData.optimizations.forEach((opt: any) => {
                if (opt.id && typeof opt.enabled === 'boolean') {
                  settings[opt.id] = opt.enabled;
                }
              });
              
              await this.windowsOptimizationService.saveOptimizationSettings(settings);
              return importedData;
            } else {
              throw new Error('File không đúng định dạng. Vui lòng chọn file JSON có cấu trúc đúng.');
            }
          } else {
            // User cancelled the dialog
            return null;
          }
        }
        
        return null;
      } catch (error) {
        console.error('Lỗi khi nhập cài đặt:', error);
        throw error;
      }
    });

    // Open external
    ipcMain.handle('open-external', async (event: IpcMainInvokeEvent, url: string) => {
      await shell.openExternal(url);
    });

    // File download (QuickApps)
    ipcMain.handle('download-file', async (_event: IpcMainInvokeEvent, urlStr: string, suggestedName?: string) => {
      const doDownload = (targetUrl: string): Promise<{ success: boolean; path?: string; message?: string }> =>
        new Promise((resolve) => {
          try {
            const downloadsDir = app.getPath('downloads');
            const urlObj = new URL(targetUrl);
            const fallbackName = path.basename(urlObj.pathname) || 'download.bin';
            const fileName = suggestedName && suggestedName.trim() ? suggestedName.trim() : fallbackName;
            const targetPath = path.join(downloadsDir, fileName);
            const proto = urlObj.protocol === 'http:' ? http : https;
            const request = proto.get(targetUrl, (response) => {
              if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                const redirectUrl = response.headers.location.startsWith('http')
                  ? response.headers.location
                  : `${urlObj.protocol}//${urlObj.host}${response.headers.location}`;
                resolve(doDownload(redirectUrl));
                return;
              }
              if (response.statusCode !== 200) {
                resolve({ success: false, message: `HTTP ${response.statusCode}` });
                return;
              }
              fs.ensureDirSync(downloadsDir);
              const fileStream = fs.createWriteStream(targetPath);
              response.pipe(fileStream);
              fileStream.on('finish', () => {
                fileStream.close();
                resolve({ success: true, path: targetPath });
              });
              fileStream.on('error', (err: any) => {
                resolve({ success: false, message: err?.message || 'Lỗi ghi file' });
              });
            });
            request.on('error', (err: any) => {
              resolve({ success: false, message: err?.message || 'Lỗi mạng' });
            });
          } catch (error: any) {
            resolve({ success: false, message: error?.message || 'Lỗi không xác định' });
          }
        });

      if (!urlStr || typeof urlStr !== 'string') {
        return { success: false, message: 'URL không hợp lệ' };
      }
      return await doDownload(urlStr);
    });

    // Open Downloads folder in Explorer
    ipcMain.handle('open-downloads-folder', async () => {
      try {
        const downloadsDir = app.getPath('downloads');
        const result = await shell.openPath(downloadsDir);
        if (result) {
          // Electron returns non-empty string when error occurs
          return { success: false, message: result };
        }
        return { success: true, path: downloadsDir };
      } catch (error: any) {
        return { success: false, message: error?.message || 'Không thể mở thư mục Tải xuống' };
      }
    });
  }

  private setupAppEvents(): void {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }
}

const mainApp = new MainApp();

// Đảm bảo chỉ có một instance chạy
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log('🚫 Another instance is already running, exiting...');
  app.quit();
} else {
  // Setup single instance focus
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    console.log('🚫 Second instance detected, focusing existing window...');
    mainApp.focusWindow();
  });
}

mainApp.initialize().catch(console.error); 