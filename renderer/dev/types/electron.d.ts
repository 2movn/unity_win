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
      selectWiFiFile: () => Promise<{ canceled: boolean; filePath?: string }>;
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
      executePowerShellCommand: (command: string) => Promise<any>;
      applyAdvancedRAMOptimization: () => Promise<any>;
      applyAdvancedCPUOptimization: () => Promise<any>;
      installSilentApps: () => Promise<any>;
      getServicesInfo: () => Promise<any>;
      getWindowsDefenderStatus: () => Promise<any>;
      getWindowsUpdateStatus: () => Promise<any>;
      
      // New Windows Optimization methods
      moveZaloToDrive: (drive: string) => Promise<any>;
      optimizeSelectedServices: (services: string[]) => Promise<any>;
      setVirtualMemory: (sizeGB: number) => Promise<any>;
      resetVirtualMemory: () => Promise<any>;
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
      downloadFile: (url: string, suggestedName?: string) => Promise<{ success: boolean; path?: string; message?: string }>;
      openDownloadsFolder: () => Promise<{ success: boolean; path?: string; message?: string }>;
    };
  }
}

export {}; 