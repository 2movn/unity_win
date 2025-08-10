import { contextBridge, ipcRenderer } from 'electron';

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      // App Environment
      getAppEnvironment: () => Promise<any>;
      
      // System Info
      getSystemInfo: () => Promise<any>;
      
      // Network
      getNetworkInterfaces: () => Promise<any>;
      configureNetwork: (config: any) => Promise<any>;
      backupWifi: () => Promise<any>;
      testNetworkConnection: () => Promise<any>;
      flushDns: () => Promise<any>;
      resetNetwork: () => Promise<any>;
      
      // NetworkService for SpeedTest
      networkService: {
        getSpeedTestServers: () => Promise<any>;
        testNetworkSpeed: (serverID?: number) => Promise<any>;
      };
      
      // Backup
      backupDrivers: (selectedDrive?: string) => Promise<any>;
      backupZalo: (selectedDrive?: string) => Promise<any>;
      backupUserFolders: (folders: string[], selectedDrive?: string) => Promise<any>;
      backupCustomFolders: (folders: string[], selectedDrive?: string) => Promise<any>;
      getAvailableDrives: () => Promise<any>;
      createFullBackup: (options: any) => Promise<any>;
      selectDirectory: () => Promise<any>;
      
      // Restore
      restoreZaloData: (backupPath: string) => Promise<any>;
      restoreUserFolders: (backupPath: string) => Promise<any>;
      findLatestBackup: (baseDrive: string) => Promise<any>;
      getBackupInfo: (backupPath: string) => Promise<any>;
      findWifiBackupFiles: (drive: string) => Promise<string[]>;
      restoreWifiConfig: (backupFile: string) => Promise<any>;
      selectWiFiFile: () => Promise<any>;
      backupBrowserProfiles: (selectedDrive?: string) => Promise<any>;
      
      // Cleanup
      cleanupSystem: (options: any) => Promise<any>;
      analyzeSystemForCleanup: () => Promise<any>;
      optimizedCleanup: (options: any) => Promise<any>;
      performSafetyCheck: () => Promise<{ safe: boolean; warnings: string[] }>;
      
      // Windows Optimization
      optimizeServices: () => Promise<any>;
      disableWindowsDefender: () => Promise<any>;
      disableWindowsUpdate: () => Promise<any>;
      enableWindowsUpdate: () => Promise<any>;
      activateWindows: () => Promise<any>;
      increaseVirtualMemory: (sizeGB: number) => Promise<any>;
      setVirtualMemory: (sizeGB: number) => Promise<any>;
      resetVirtualMemory: () => Promise<any>;
      getSystemPerformanceInfo: () => Promise<any>;
      getNetworkStatus: () => Promise<any>;
      executePowerShellCommand: (command: string) => Promise<any>;
      applyAdvancedRAMOptimization: () => Promise<any>;
      applyAdvancedCPUOptimization: () => Promise<any>;
      installSilentApps: () => Promise<any>;
      getServicesInfo: () => Promise<any>;
      getWindowsDefenderStatus: () => Promise<any>;
      getWindowsUpdateStatus: () => Promise<any>;
      optimizeSelectedServices: (services: string[]) => Promise<any>;
      
      // Tools Manager
      moveZaloToDrive: (drive: string) => Promise<any>;
      installSelectedApps: (apps: string[]) => Promise<any>;
      
      // UI Optimization
      getOptimizationSettings: () => Promise<any>;
      getNetworkOptimizationOptions: () => Promise<any>;
      getCurrentWindowsSettings: () => Promise<any>;
      applyOptimization: (optionId: string, enabled: boolean) => Promise<any>;
      applyAllOptimizations: (options: any[]) => Promise<any>;
      resetOptimizations: () => Promise<any>;
      exportOptimizationSettings: (data: any) => Promise<any>;
      importOptimizationSettings: () => Promise<any>;
      
      // DNS Management
      setCustomDNS: (interfaceName: string, dnsConfig: any) => Promise<any>;
      setPresetDNS: (interfaceName: string, preset: string) => Promise<any>;
      clearDNS: (interfaceName: string) => Promise<any>;
      getCurrentDNS: (interfaceName: string) => Promise<any>;
      
      // IPv6 Management
      disableIPv6: () => Promise<any>;
      enableIPv6: () => Promise<any>;
      getIPv6Status: () => Promise<any>;
      
      // Network Optimization
      optimizeNetwork: (optimization: any) => Promise<any>;
      
      // Proxy Management
      setProxy: (config: any) => Promise<any>;
      getProxyStatus: () => Promise<any>;
      
      // Network Speed Test
      testNetworkSpeed: () => Promise<any>;
      
      
      // Advanced System Info
      getProcessesInfo: () => Promise<any>;
      getNetworkConnections: () => Promise<any>;
      getInstalledApps: () => Promise<any>;
      getWindowsFeatures: () => Promise<any>;
      getSystemPerformance: () => Promise<any>;
      getDetailedHardwareInfo: () => Promise<any>;
      getRunningServices: () => Promise<any>;
      getDriversInfo: () => Promise<any>;
      getEventLogs: (level: string, count: number) => Promise<any>;
      getRegistryInfo: (path: string) => Promise<any>;
      
      // External
      openExternal: (url: string) => Promise<void>;
    };
  }
}

// Updated: Added WiFi restore methods to ensure TypeScript recognition
contextBridge.exposeInMainWorld('electronAPI', {
  // App Environment
  getAppEnvironment: () => ipcRenderer.invoke('get-app-environment'),
  
  // System Info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Network
  getNetworkInterfaces: () => ipcRenderer.invoke('get-network-interfaces'),
  configureNetwork: (config: any) => ipcRenderer.invoke('configure-network', config),
  backupWifi: () => ipcRenderer.invoke('backup-wifi'),
  testNetworkConnection: () => ipcRenderer.invoke('test-network-connection'),
  flushDns: () => ipcRenderer.invoke('flush-dns'),
  resetNetwork: () => ipcRenderer.invoke('reset-network'),
  
  // NetworkService for SpeedTest
  networkService: {
    getSpeedTestServers: () => ipcRenderer.invoke('get-speedtest-servers'),
    testNetworkSpeed: (serverID?: number) => ipcRenderer.invoke('test-network-speed', serverID),
  },
  
  // Backup
  backupDrivers: (selectedDrive?: string) => ipcRenderer.invoke('backup-drivers', selectedDrive),
  backupZalo: (selectedDrive?: string) => ipcRenderer.invoke('backup-zalo', selectedDrive),
  backupUserFolders: (folders: string[], selectedDrive?: string) => ipcRenderer.invoke('backup-user-folders', folders, selectedDrive),
  backupCustomFolders: (folders: string[], selectedDrive?: string) => ipcRenderer.invoke('backup-custom-folders', folders, selectedDrive),
  getAvailableDrives: () => ipcRenderer.invoke('get-available-drives'),
  createFullBackup: (options: any) => ipcRenderer.invoke('create-full-backup', options),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // Restore
  restoreZaloData: (backupPath: string) => ipcRenderer.invoke('restore-zalo-data', backupPath),
  restoreUserFolders: (backupPath: string) => ipcRenderer.invoke('restore-user-folders', backupPath),
  findLatestBackup: (baseDrive: string) => ipcRenderer.invoke('find-latest-backup', baseDrive),
  getBackupInfo: (backupPath: string) => ipcRenderer.invoke('get-backup-info', backupPath),
  findWifiBackupFiles: (drive: string) => ipcRenderer.invoke('find-wifi-backup-files', drive),
  restoreWifiConfig: (backupFile: string) => ipcRenderer.invoke('restore-wifi-config', backupFile),
  selectWiFiFile: () => ipcRenderer.invoke('select-wifi-file'),
  backupBrowserProfiles: (selectedDrive?: string) => ipcRenderer.invoke('backup-browser-profiles', selectedDrive),
  
  // Cleanup
  cleanupSystem: (options: any) => ipcRenderer.invoke('cleanup-system', options),
  analyzeSystemForCleanup: () => ipcRenderer.invoke('analyze-system-for-cleanup'),
  optimizedCleanup: (options: any) => ipcRenderer.invoke('optimized-cleanup', options),
  performSafetyCheck: () => ipcRenderer.invoke('perform-safety-check'),
  
  // Windows Optimization
  optimizeServices: () => ipcRenderer.invoke('optimize-services'),
  disableWindowsDefender: () => ipcRenderer.invoke('disable-windows-defender'),
  disableWindowsUpdate: () => ipcRenderer.invoke('disable-windows-update'),
  enableWindowsUpdate: () => ipcRenderer.invoke('enable-windows-update'),
  activateWindows: () => ipcRenderer.invoke('activate-windows'),
  increaseVirtualMemory: (sizeGB: number) => ipcRenderer.invoke('increase-virtual-memory', sizeGB),
  setVirtualMemory: (sizeGB: number) => ipcRenderer.invoke('set-virtual-memory', sizeGB),
      resetVirtualMemory: () => ipcRenderer.invoke('reset-virtual-memory'),
    getSystemPerformanceInfo: () => ipcRenderer.invoke('get-system-performance-info'),
    executePowerShellCommand: (command: string) => ipcRenderer.invoke('execute-powershell-command', command),
    applyAdvancedRAMOptimization: () => ipcRenderer.invoke('apply-advanced-ram-optimization'),
    applyAdvancedCPUOptimization: () => ipcRenderer.invoke('apply-advanced-cpu-optimization'),
  installSilentApps: () => ipcRenderer.invoke('install-silent-apps'),
  getServicesInfo: () => ipcRenderer.invoke('get-services-info'),
  getWindowsDefenderStatus: () => ipcRenderer.invoke('get-windows-defender-status'),
  getWindowsUpdateStatus: () => ipcRenderer.invoke('get-windows-update-status'),
  optimizeSelectedServices: (services: string[]) => ipcRenderer.invoke('optimize-selected-services', services),
  getNetworkStatus: () => ipcRenderer.invoke('get-network-status'),
  
  // Tools Manager
  moveZaloToDrive: (drive: string) => ipcRenderer.invoke('move-zalo-to-drive', drive),
  installSelectedApps: (apps: string[]) => ipcRenderer.invoke('install-selected-apps', apps),
  
  // UI Optimization
  getOptimizationSettings: () => ipcRenderer.invoke('get-optimization-settings'),
  getNetworkOptimizationOptions: () => ipcRenderer.invoke('get-network-optimization-options'),
  getCurrentWindowsSettings: () => ipcRenderer.invoke('get-current-windows-settings'),
  applyOptimization: (optionId: string, enabled: boolean) => ipcRenderer.invoke('apply-optimization', optionId, enabled),
  applyAllOptimizations: (options: any[]) => ipcRenderer.invoke('apply-all-optimizations', options),
  resetOptimizations: () => ipcRenderer.invoke('reset-optimizations'),
  exportOptimizationSettings: (data: any) => ipcRenderer.invoke('export-optimization-settings', data),
  importOptimizationSettings: () => ipcRenderer.invoke('import-optimization-settings'),
  
  // DNS Management
  setCustomDNS: (interfaceName: string, dnsConfig: any) => ipcRenderer.invoke('set-custom-dns', interfaceName, dnsConfig),
  setPresetDNS: (interfaceName: string, preset: string) => ipcRenderer.invoke('set-preset-dns', interfaceName, preset),
  clearDNS: (interfaceName: string) => ipcRenderer.invoke('clear-dns', interfaceName),
  getCurrentDNS: (interfaceName: string) => ipcRenderer.invoke('get-current-dns', interfaceName),
  
  // IPv6 Management
  disableIPv6: () => ipcRenderer.invoke('disable-ipv6'),
  enableIPv6: () => ipcRenderer.invoke('enable-ipv6'),
  getIPv6Status: () => ipcRenderer.invoke('get-ipv6-status'),
  
  // Network Optimization
  optimizeNetwork: (optimization: any) => ipcRenderer.invoke('optimize-network', optimization),
  
  // Proxy Management
  setProxy: (config: any) => ipcRenderer.invoke('set-proxy', config),
  getProxyStatus: () => ipcRenderer.invoke('get-proxy-status'),
  
  // Network Speed Test
  testNetworkSpeed: () => ipcRenderer.invoke('test-network-speed'),
  
  // Advanced System Info
  getProcessesInfo: () => ipcRenderer.invoke('get-processes-info'),
  getNetworkConnections: () => ipcRenderer.invoke('get-network-connections'),
  getInstalledApps: () => ipcRenderer.invoke('get-installed-apps'),
  getWindowsFeatures: () => ipcRenderer.invoke('get-windows-features'),
  getSystemPerformance: () => ipcRenderer.invoke('get-system-performance'),
        getDetailedHardwareInfo: () => ipcRenderer.invoke('get-detailed-hardware-info'),
      getRunningServices: () => ipcRenderer.invoke('get-running-services'),
  getDriversInfo: () => ipcRenderer.invoke('get-drivers-info'),
  getEventLogs: (level: string, count: number) => ipcRenderer.invoke('get-event-logs', level, count),
  getRegistryInfo: (path: string) => ipcRenderer.invoke('get-registry-info', path),
  
  // External
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
}); 