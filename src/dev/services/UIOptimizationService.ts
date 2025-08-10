import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';
import { executeCmdCommand, executePowerShellScript } from './CommandHelper';

export class UIOptimizationService {
  
  // Lưu cài đặt tối ưu vào file
  private settingsFile = path.join(process.env.APPDATA || '', 'unity_win', 'optimization_settings.json');
  
  constructor() {
    this.ensureSettingsDirectory();
  }

  private ensureSettingsDirectory() {
    const dir = path.dirname(this.settingsFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadSettings(): Record<string, boolean> {
    try {
      if (fs.existsSync(this.settingsFile)) {
        const data = fs.readFileSync(this.settingsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Lỗi khi đọc cài đặt:', error);
    }
    return {};
  }

  private saveSettings(settings: Record<string, boolean>) {
    try {
      fs.writeFileSync(this.settingsFile, JSON.stringify(settings, null, 2));
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt:', error);
    }
  }

  async getOptimizationSettings(): Promise<Record<string, boolean>> {
    return this.loadSettings();
  }

  getNetworkOptimizationOptions(): { id: string; name: string; description: string }[] {
    return [
      { id: 'network_disable_widgets', name: 'Tắt Widgets', description: 'Tắt Windows 11 Widgets (bảng tin, thời tiết, tin tức) để giảm nền' },
      { id: 'network_disable_news', name: 'Tắt News and Interests', description: 'Tắt nguồn tin tức/feeds để giảm tiêu thụ mạng' },
      { id: 'network_disable_weather', name: 'Tắt Thời tiết', description: 'Ẩn/tắt module thời tiết trong Widgets/Taskbar' },
      { id: 'network_disable_background_apps', name: 'Tắt ứng dụng chạy nền', description: 'Tắt toàn bộ app nền UWP/Store' },
      { id: 'network_disable_telemetry', name: 'Tắt Telemetry', description: 'Giảm thu thập dữ liệu chẩn đoán' },
      { id: 'network_disable_feedback', name: 'Tắt Feedback', description: 'Tắt phản hồi tự động gửi về Microsoft' },
      { id: 'network_disable_diagtrack', name: 'Tắt DiagTrack', description: 'Tắt Connected User Experiences and Telemetry' },
      { id: 'network_disable_dmwappushservice', name: 'Tắt dmwappushservice', description: 'Tắt dịch vụ push dữ liệu' },
      { id: 'network_disable_rss_tasks', name: 'Tắt nhiệm vụ RSS', description: 'Vô hiệu hóa các Scheduled Tasks liên quan đến RSS/Feeds' },
    ];
  }

  async applyOptimization(optionId: string, enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const settings = this.loadSettings();
      settings[optionId] = enabled;
      this.saveSettings(settings);

      switch (optionId) {
        case 'taskbar_combine_buttons':
          await this.setTaskbarCombineButtons(enabled);
          break;
        case 'taskbar_show_labels':
          await this.setTaskbarShowLabels(enabled);
          break;
        case 'taskbar_small_icons':
          await this.setTaskbarSmallIcons(enabled);
          break;
        case 'taskbar_show_desktop':
          await this.setTaskbarShowDesktop(enabled);
          break;
        case 'explorer_show_extensions':
          await this.setExplorerShowExtensions(enabled);
          break;
        case 'explorer_show_hidden':
          await this.setExplorerShowHidden(enabled);
          break;
        case 'explorer_compact_mode':
          await this.setExplorerCompactMode(enabled);
          break;
        case 'explorer_quick_access':
          await this.setExplorerQuickAccess(enabled);
          break;
        case 'contextmenu_copy_path':
          await this.setContextMenuCopyPath(enabled);
          break;
        case 'contextmenu_take_ownership':
          await this.setContextMenuTakeOwnership(enabled);
          break;
        case 'contextmenu_compact':
          await this.setContextMenuCompact(enabled);
          break;
        case 'contextmenu_advanced':
          await this.setContextMenuAdvanced(enabled);
          break;
        case 'contextmenu_win10_style':
          await this.setContextMenuWin10Style(enabled);
          break;
        case 'contextmenu_win11_style':
          await this.setContextMenuWin11Style(enabled);
          break;
        case 'contextmenu_copy_filename':
          await this.setContextMenuCopyFilename(enabled);
          break;
        case 'contextmenu_open_cmd_here':
          await this.setContextMenuOpenCmdHere(enabled);
          break;
        case 'contextmenu_open_powershell':
          await this.setContextMenuOpenPowerShell(enabled);
          break;
        case 'system_fast_startup':
          await this.setSystemFastStartup(enabled);
          break;
        case 'system_services_optimization':
          await this.setSystemServicesOptimization(enabled);
          break;
        case 'system_indexing':
          await this.setSystemIndexing(enabled);
          break;
        case 'system_network_optimization':
          await this.setSystemNetworkOptimization(enabled);
          break;
        case 'system_disk_optimization':
          await this.setSystemDiskOptimization(enabled);
          break;
        case 'system_game_mode':
          await this.setSystemGameMode(enabled);
          break;
        case 'performance_visual_effects':
          await this.setPerformanceVisualEffects(enabled);
          break;
        case 'performance_power_plan':
          await this.setPerformancePowerPlan(enabled);
          break;
        case 'performance_gaming_mode':
          await this.setPerformanceGamingMode(enabled);
          break;
        case 'appearance_dark_mode':
          await this.setAppearanceDarkMode(enabled);
          break;
        case 'appearance_transparency':
          await this.setAppearanceTransparency(enabled);
          break;
        case 'appearance_animations':
          await this.setAppearanceAnimations(enabled);
          break;
        case 'appearance_accent_color':
          await this.setAppearanceAccentColor(enabled);
          break;
        case 'appearance_custom_cursor':
          await this.setAppearanceCustomCursor(enabled);
          break;
        case 'appearance_desktop_icons':
          await this.setAppearanceDesktopIcons(enabled);
          break;

        // Network optimizations
        case 'network_disable_widgets':
          await this.setDisableWidgets(enabled);
          break;
        case 'network_disable_news':
          await this.setDisableNewsFeeds(enabled);
          break;
        case 'network_disable_weather':
          await this.setDisableWeather(enabled);
          break;
        case 'network_disable_background_apps':
          await this.setDisableBackgroundApps(enabled);
          break;
        case 'network_disable_telemetry':
          await this.setDisableTelemetry(enabled);
          break;
        case 'network_disable_feedback':
          await this.setDisableFeedback(enabled);
          break;
        case 'network_disable_diagtrack':
          await this.setDisableService('DiagTrack', enabled);
          break;
        case 'network_disable_dmwappushservice':
          await this.setDisableService('dmwappushservice', enabled);
          break;
        case 'network_disable_rss_tasks':
          await this.setDisableRSSTasks(enabled);
          break;

        case 'taskbar_win11_style':
          await this.setTaskbarWin11Style(enabled);
          break;
        case 'taskbar_center_icons':
          await this.setTaskbarCenterIcons(enabled);
          break;
        case 'explorer_win11_ribbon':
          await this.setExplorerWin11Ribbon(enabled);
          break;
        case 'explorer_preview_pane':
          await this.setExplorerPreviewPane(enabled);
          break;

        default:
          return { success: false, message: `Tùy chọn tối ưu không được hỗ trợ: ${optionId}` };
      }

      return { success: true, message: `Đã áp dụng tối ưu ${optionId}` };
    } catch (error) {
      console.error(`Lỗi khi áp dụng tối ưu ${optionId}:`, error);
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async applyAllOptimizations(options: any[]): Promise<{ success: boolean; message: string }> {
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const option of options) {
        if (option.enabled) {
          const result = await this.applyOptimization(option.id, true);
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
            errors.push(`${option.name}: ${result.message}`);
          }
        }
      }

      if (errorCount === 0) {
        return { success: true, message: `Đã áp dụng thành công ${successCount} tối ưu` };
      } else {
        return {
            success: false, 
            message: `Thành công: ${successCount}, Lỗi: ${errorCount}. Chi tiết: ${errors.join('; ')}` 
        };
      }
    } catch (error) {
      return { success: false, message: `Lỗi khi áp dụng tối ưu: ${error}` };
    }
  }

  async resetOptimizations(): Promise<{ success: boolean; message: string }> {
    try {
      // Xóa file cài đặt
      if (fs.existsSync(this.settingsFile)) {
        fs.unlinkSync(this.settingsFile);
      }

      // Reset các cài đặt về mặc định
      await this.resetTaskbarSettings();
      await this.resetExplorerSettings();
      await this.resetContextMenuSettings();

      return { success: true, message: 'Đã đặt lại tất cả cài đặt về mặc định' };
    } catch (error) {
      console.error('Lỗi khi đặt lại cài đặt:', error);
      return { success: false, message: 'Lỗi khi đặt lại cài đặt' };
    }
  }

  async exportOptimizationSettings(data: any): Promise<{ success: boolean; message: string }> {
    try {
      const { dialog } = require('electron');
      
      const result = await dialog.showSaveDialog({
        title: 'Xuất cài đặt tối ưu',
        defaultPath: 'optimization-settings.json',
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePath) {
        await fs.writeJson(result.filePath, data, { spaces: 2 });
        return { success: true, message: `Đã xuất cài đặt vào: ${result.filePath}` };
      } else {
        return { success: false, message: 'Hủy xuất cài đặt' };
      }
    } catch (error) {
      console.error('Lỗi khi xuất cài đặt:', error);
      return { success: false, message: 'Lỗi khi xuất cài đặt' };
    }
  }

  async importOptimizationSettings(): Promise<{ success: boolean; message: string }> {
    try {
      const { dialog } = require('electron');
      
      const result = await dialog.showOpenDialog({
        title: 'Nhập cài đặt tối ưu',
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const importedData = await fs.readJson(filePath);
        
        if (importedData.optimizations) {
          // Apply all imported optimizations
          for (const option of importedData.optimizations) {
            await this.applyOptimization(option.id, option.enabled);
          }
          return { success: true, message: `Đã nhập và áp dụng cài đặt từ: ${filePath}` };
        } else {
          return { success: false, message: 'File không đúng định dạng' };
        }
      } else {
        return { success: false, message: 'Hủy nhập cài đặt' };
      }
    } catch (error) {
      console.error('Lỗi khi nhập cài đặt:', error);
      return { success: false, message: 'Lỗi khi nhập cài đặt' };
    }
  }

  private async getContextMenuSettings(): Promise<Record<string, boolean>> {
    const contextMenuSettings: Record<string, boolean> = {};
    
    try {
      // Copy filename - check HKCU path
      try {
        await executeCmdCommand('reg query "HKCU\\Software\\Classes\\*\\shell\\copyfilename"');
        contextMenuSettings.contextmenu_copy_filename = true;
      } catch {
        contextMenuSettings.contextmenu_copy_filename = false;
      }
      
      // CMD here - check both paths
      try {
        try {
          await executeCmdCommand('reg query "HKCU\\Software\\Classes\\Directory\\Background\\shell\\cmd"');
          contextMenuSettings.contextmenu_open_cmd_here = true;
        } catch {
          await executeCmdCommand('reg query "HKCU\\Software\\Classes\\Directory\\shell\\cmd"');
          contextMenuSettings.contextmenu_open_cmd_here = true;
        }
      } catch {
        contextMenuSettings.contextmenu_open_cmd_here = false;
      }
      
      // PowerShell here - check both paths
      try {
        try {
          await executeCmdCommand('reg query "HKCU\\Software\\Classes\\Directory\\Background\\shell\\powershell"');
          contextMenuSettings.contextmenu_open_powershell = true;
        } catch {
          await executeCmdCommand('reg query "HKCU\\Software\\Classes\\Directory\\shell\\powershell"');
          contextMenuSettings.contextmenu_open_powershell = true;
        }
      } catch {
        contextMenuSettings.contextmenu_open_powershell = false;
      }
      
      // Copy path - check Windows 11 built-in
      try {
        await executeCmdCommand('reg query "HKCU\\Software\\Classes\\*\\shell\\pintohome"');
        contextMenuSettings.contextmenu_copy_path = true;
      } catch {
        contextMenuSettings.contextmenu_copy_path = false;
      }
      
      // Take ownership - check runas
      try {
        await executeCmdCommand('reg query "HKCU\\Software\\Classes\\*\\shell\\runas"');
        contextMenuSettings.contextmenu_take_ownership = true;
      } catch {
        contextMenuSettings.contextmenu_take_ownership = false;
      }
      
      // Windows 11 vs 10 context menu override (key exists => Win10 style)
      try {
        await executeCmdCommand('reg query "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32"');
        contextMenuSettings.contextmenu_win10_style = true;
        contextMenuSettings.contextmenu_win11_style = false;
      } catch {
        contextMenuSettings.contextmenu_win10_style = false;
        contextMenuSettings.contextmenu_win11_style = true;
      }
      
      // Set defaults for other contextmenu options
      contextMenuSettings.contextmenu_compact = false;
      contextMenuSettings.contextmenu_advanced = false;
      
      console.log('✅ Context menu settings loaded:', contextMenuSettings);
      return contextMenuSettings;
      
    } catch (error) {
      console.error('❌ Error getting context menu settings:', error);
      // Return defaults if error
      return {
        contextmenu_copy_filename: false,
        contextmenu_open_cmd_here: false,
        contextmenu_open_powershell: false,
        contextmenu_copy_path: false,
        contextmenu_take_ownership: false,
        contextmenu_win11_style: false,
        contextmenu_win10_style: true,
        contextmenu_compact: false,
        contextmenu_advanced: false
      };
    }
  }

  async getCurrentWindowsSettings(): Promise<Record<string, boolean>> {
    try {
      console.log('🔄 Starting getCurrentWindowsSettings (simplified)...');
      
      // Get context menu settings separately to avoid PowerShell timeout
      const contextMenuSettings = await this.getContextMenuSettings();
      
      // Sử dụng script đơn giản hơn cho basic settings
      const script = `
        $settings = @{}
        
        # Basic taskbar settings
        try {
          $combine = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "TaskbarGlomLevel" -ErrorAction SilentlyContinue
          $settings['taskbar_combine_buttons'] = if ($combine) { $combine.TaskbarGlomLevel -eq 1 } else { $true }
        } catch { $settings['taskbar_combine_buttons'] = $true }
        
        try {
          $smallIcons = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "TaskbarSmallIcons" -ErrorAction SilentlyContinue
          $settings['taskbar_small_icons'] = if ($smallIcons) { $smallIcons.TaskbarSmallIcons -eq 1 } else { $false }
          $settings['taskbar_show_labels'] = if ($smallIcons) { $smallIcons.TaskbarSmallIcons -eq 0 } else { $true }
        } catch { 
          $settings['taskbar_small_icons'] = $false
          $settings['taskbar_show_labels'] = $true 
        }
        
        # Basic explorer settings
        try {
          $extensions = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "HideFileExt" -ErrorAction SilentlyContinue
          $settings['explorer_show_extensions'] = if ($extensions) { $extensions.HideFileExt -eq 0 } else { $false }
        } catch { $settings['explorer_show_extensions'] = $false }
        
        # Check other Explorer settings
        try {
          $hidden = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "Hidden" -ErrorAction SilentlyContinue
          $settings['explorer_show_hidden'] = if ($hidden -and $hidden.Hidden -eq 1) { $true } else { $false }
        } catch { $settings['explorer_show_hidden'] = $false }
        
        try {
          $quickAccess = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer" -Name "ShowFrequent" -ErrorAction SilentlyContinue
          $settings['explorer_quick_access'] = if ($quickAccess -and $quickAccess.ShowFrequent -eq 0) { $false } else { $true }
        } catch { $settings['explorer_quick_access'] = $true }
        
        try {
          $gameMode = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AllowAutoGameMode" -ErrorAction SilentlyContinue
          if ($gameMode) {
            $settings['system_game_mode'] = if ($gameMode.AllowAutoGameMode -eq 1) { $true } else { $false }
          } else {
            # Try alternative path
            $gameMode2 = Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\PolicyManager\\default\\ApplicationManagement\\AllowGameDVR" -Name "value" -ErrorAction SilentlyContinue
            $settings['system_game_mode'] = if ($gameMode2 -and $gameMode2.value -eq 1) { $true } else { $true }
          }
        } catch { $settings['system_game_mode'] = $true }
        
        # Set defaults for taskbar
        $settings['taskbar_show_desktop'] = $true
        
        # Network optimization settings - check actual Windows state
        try {
          # Check if widgets are disabled
          $widgetsDisabled = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "TaskbarDa" -ErrorAction SilentlyContinue
          $settings['network_disable_widgets'] = if ($widgetsDisabled -and $widgetsDisabled.TaskbarDa -eq 0) { $true } else { $false }
        } catch { $settings['network_disable_widgets'] = $false }
        
        try {
          # Check if news and interests are disabled  
          $newsDisabled = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds" -Name "ShellFeedsTaskbarViewMode" -ErrorAction SilentlyContinue
          $settings['network_disable_news'] = if ($newsDisabled -and $newsDisabled.ShellFeedsTaskbarViewMode -eq 2) { $true } else { $false }
        } catch { $settings['network_disable_news'] = $false }
        
        try {
          # Check if weather is disabled (part of news/widgets)
          $weatherDisabled = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds" -Name "ShellFeedsTaskbarOpenOnHover" -ErrorAction SilentlyContinue
          $settings['network_disable_weather'] = if ($weatherDisabled -and $weatherDisabled.ShellFeedsTaskbarOpenOnHover -eq 0) { $true } else { $false }
        } catch { $settings['network_disable_weather'] = $false }
        
        try {
          # Check if background apps are disabled
          $backgroundApps = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" -Name "GlobalUserDisabled" -ErrorAction SilentlyContinue
          $settings['network_disable_background_apps'] = if ($backgroundApps -and $backgroundApps.GlobalUserDisabled -eq 1) { $true } else { $false }
        } catch { $settings['network_disable_background_apps'] = $false }
        
        try {
          # Check if telemetry is disabled
          $telemetry = Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -ErrorAction SilentlyContinue
          $settings['network_disable_telemetry'] = if ($telemetry -and $telemetry.AllowTelemetry -eq 0) { $true } else { $false }
        } catch { $settings['network_disable_telemetry'] = $false }
        
                try {
          # Check if feedback is disabled
          $feedback = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Siuf\\Rules" -Name "NumberOfSIUFInPeriod" -ErrorAction SilentlyContinue
          $settings['network_disable_feedback'] = if ($feedback -and $feedback.NumberOfSIUFInPeriod -eq 0) { $true } else { $false }
        } catch { $settings['network_disable_feedback'] = $false }
        
        try {
          # Check if DiagTrack service is disabled
          $diagtrack = Get-Service -Name "DiagTrack" -ErrorAction SilentlyContinue
          $settings['network_disable_diagtrack'] = if ($diagtrack -and $diagtrack.StartType -eq 'Disabled') { $true } else { $false }
        } catch { $settings['network_disable_diagtrack'] = $false }
        
        try {
          # Check if dmwappushservice is disabled
          $dmwappush = Get-Service -Name "dmwappushservice" -ErrorAction SilentlyContinue
          $settings['network_disable_dmwappushservice'] = if ($dmwappush -and $dmwappush.StartType -eq 'Disabled') { $true } else { $false }
        } catch { $settings['network_disable_dmwappushservice'] = $false }
        
        # RSS tasks - default to false for now (complex to check)
        $settings['network_disable_rss_tasks'] = $false
        
        # Appearance settings
        try {
          # Dark mode
          $darkMode = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "AppsUseLightTheme" -ErrorAction SilentlyContinue
          $settings['appearance_dark_mode'] = if ($darkMode -and $darkMode.AppsUseLightTheme -eq 0) { $true } else { $false }
        } catch { $settings['appearance_dark_mode'] = $false }
        
        try {
          # Transparency
          $transparency = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "EnableTransparency" -ErrorAction SilentlyContinue
          $settings['appearance_transparency'] = if ($transparency -and $transparency.EnableTransparency -eq 1) { $true } else { $true }
        } catch { $settings['appearance_transparency'] = $true }
        
        try {
          # Animations
          $animations = Get-ItemProperty -Path "HKCU:\\Control Panel\\Desktop\\WindowMetrics" -Name "MinAnimate" -ErrorAction SilentlyContinue
          if ($animations) {
            $settings['appearance_animations'] = if ($animations.MinAnimate -eq 1) { $true } else { $false }
          } else {
            $animations2 = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -ErrorAction SilentlyContinue
            $settings['appearance_animations'] = if ($animations2 -and $animations2.VisualFXSetting -eq 2) { $false } else { $true }
          }
        } catch { $settings['appearance_animations'] = $true }
        
        try {
          # Desktop icons
          $hideIcons = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" -Name "NoDesktop" -ErrorAction SilentlyContinue
          $settings['appearance_desktop_icons'] = if ($hideIcons -and $hideIcons.NoDesktop -eq 1) { $false } else { $true }
        } catch { $settings['appearance_desktop_icons'] = $true }
        
        # Context menu settings
        try {
          # Copy path - Windows 11 built-in feature, check if disabled via policy
          $copyPathDisabled = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" -Name "NoCopyAsPath" -ErrorAction SilentlyContinue
          $settings['contextmenu_copy_path'] = if ($copyPathDisabled -and $copyPathDisabled.NoCopyAsPath -eq 1) { $false } else { $true }
        } catch { $settings['contextmenu_copy_path'] = $true }
        
        try {
          # Take ownership - check both HKCR and HKCU paths
          $takeOwnership1 = Test-Path "HKCR:\\*\\shell\\runas" -ErrorAction SilentlyContinue
          $takeOwnership2 = Test-Path "HKCU:\\Software\\Classes\\*\\shell\\takeownership" -ErrorAction SilentlyContinue
          $settings['contextmenu_take_ownership'] = if ($takeOwnership1 -or $takeOwnership2) { $true } else { $false }
        } catch { $settings['contextmenu_take_ownership'] = $false }
        
        try {
          # Windows 11 vs 10 context menu
          $win11Override = Get-ItemProperty -Path "HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" -ErrorAction SilentlyContinue
          if ($win11Override) {
            $settings['contextmenu_win10_style'] = $true
            $settings['contextmenu_win11_style'] = $false
          } else {
            $settings['contextmenu_win10_style'] = $false
            $settings['contextmenu_win11_style'] = $true
          }
        } catch { 
          $settings['contextmenu_win10_style'] = $false
          $settings['contextmenu_win11_style'] = $true 
        }
        
        # Performance settings
        try {
          # Visual effects - check if performance mode is enabled
          $visualEffects = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -ErrorAction SilentlyContinue
          if ($visualEffects) {
            # VisualFXSetting: 0=Let Windows decide, 1=Best appearance, 2=Best performance
            $settings['performance_visual_effects'] = if ($visualEffects.VisualFXSetting -eq 2) { $true } else { $false }
          } else {
            # Check alternative path for visual effects
            $visualEffects2 = Get-ItemProperty -Path "HKCU:\\Control Panel\\Desktop\\WindowMetrics" -Name "MinAnimate" -ErrorAction SilentlyContinue
            $settings['performance_visual_effects'] = if ($visualEffects2 -and $visualEffects2.MinAnimate -eq 0) { $true } else { $false }
          }
        } catch { $settings['performance_visual_effects'] = $false }
        
        try {
          # Power plan - check active power scheme
          $powerPlan = powercfg /getactivescheme 2>$null | Out-String
          if ($powerPlan -match "High performance|Ultimate Performance|Gaming") {
            $settings['performance_power_plan'] = $true
          } else {
            $settings['performance_power_plan'] = $false
          }
        } catch { $settings['performance_power_plan'] = $false }
        
        try {
          # Gaming mode - check Windows Game Mode settings
          $gameMode = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AllowAutoGameMode" -ErrorAction SilentlyContinue
          if ($gameMode) {
            $settings['performance_gaming_mode'] = if ($gameMode.AllowAutoGameMode -eq 1) { $true } else { $false }
          } else {
            # Try alternative Game Mode registry paths
            $gameMode2 = Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\PolicyManager\\default\\ApplicationManagement\\AllowGameDVR" -Name "value" -ErrorAction SilentlyContinue
            $gameMode3 = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" -Name "AppCaptureEnabled" -ErrorAction SilentlyContinue
            if ($gameMode2 -and $gameMode2.value -eq 1) {
              $settings['performance_gaming_mode'] = $true
            } elseif ($gameMode3 -and $gameMode3.AppCaptureEnabled -eq 1) {
              $settings['performance_gaming_mode'] = $true
            } else {
              $settings['performance_gaming_mode'] = $false
            }
          }
        } catch { $settings['performance_gaming_mode'] = $false }
        
        try {
          # Check if system services optimization is enabled (SysMain disabled => optimized)
          $servicesOpt = Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\SysMain" -Name "Start" -ErrorAction SilentlyContinue
          $settings['system_services_optimization'] = if ($servicesOpt -and $servicesOpt.Start -eq 4) { $true } else { $false }
        } catch { $settings['system_services_optimization'] = $false }
        
        try {
          # Check if system indexing is enabled
          $indexing = Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows Search" -Name "SetupCompletedSuccessfully" -ErrorAction SilentlyContinue
          $settings['system_indexing'] = if ($indexing -and $indexing.SetupCompletedSuccessfully -eq 1) { $true } else { $false }
        } catch { $settings['system_indexing'] = $false }
        
        try {
          # Check if system network optimization is enabled by inspecting autotuning level
          $netshOutput = netsh int tcp show global | Out-String
          if ($netshOutput -match "Receive Window Auto-Tuning Level\s*:\s*normal") {
            $settings['system_network_optimization'] = $true
          } else {
            $settings['system_network_optimization'] = $false
          }
        } catch { $settings['system_network_optimization'] = $false }
        
        try {
          # Check if system disk optimization is enabled
          $diskOpt = Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Dfrg\\BootOptimizeFunction" -Name "Enable" -ErrorAction SilentlyContinue
          $settings['system_disk_optimization'] = if ($diskOpt -and $diskOpt.Enable -eq 'Y') { $true } else { $false }
        } catch { $settings['system_disk_optimization'] = $false }
        
        try {
          # Check if system fast startup is enabled
          $fastStartup = Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" -Name "HiberbootEnabled" -ErrorAction SilentlyContinue
          $settings['system_fast_startup'] = if ($fastStartup -and $fastStartup.HiberbootEnabled -eq 1) { $true } else { $false }
        } catch { $settings['system_fast_startup'] = $false }
        
        # Set defaults for other appearance/contextmenu/performance settings
        $settings['appearance_accent_color'] = $false
        $settings['appearance_custom_cursor'] = $false
        $settings['contextmenu_compact'] = $false
        $settings['contextmenu_advanced'] = $false
        # NOTE: contextmenu_copy_path, contextmenu_take_ownership, contextmenu_win10_style, contextmenu_win11_style
        # are already set above with proper detection logic
        
        ConvertTo-Json $settings`;
      
      console.log('📝 Executing PowerShell script for Windows settings...');
      const result = await executePowerShellScript(script, 20000); // 20 second timeout for extended script
      const settingsJson = result.stdout?.trim() || '{}';
      
      if (!settingsJson || settingsJson === '') {
        console.warn('⚠️ Empty PowerShell output, using defaults');
        const defaultSettings = this.getDefaultSettings();
        return { ...defaultSettings, ...contextMenuSettings };
      }
      
      const settings = JSON.parse(settingsJson);
      
      // Merge with context menu settings
      const mergedSettings = { ...settings, ...contextMenuSettings };
      
      console.log('✅ getCurrentWindowsSettings completed successfully');
      console.log('📊 Settings loaded:', Object.keys(mergedSettings).length);
      return mergedSettings;
    } catch (error) {
      console.error('❌ Lỗi khi lấy Windows settings:', error);
      console.log('⚠️ Using default settings due to error');
      const defaultSettings = this.getDefaultSettings();
      const contextMenuSettings = await this.getContextMenuSettings();
      return { ...defaultSettings, ...contextMenuSettings };
    }
  }

  private getDefaultSettings(): Record<string, boolean> {
    return {
      // Taskbar defaults
      taskbar_combine_buttons: false,
      taskbar_small_icons: false,
      taskbar_show_labels: true,
      taskbar_show_desktop: true,
      
      // Explorer defaults (based on actual system state)
      explorer_show_extensions: true,
      explorer_show_hidden: true, // Updated to match actual system
      explorer_quick_access: true,
      
      // System defaults
      system_game_mode: true,
      system_fast_startup: true, // Default enabled
      system_services_optimization: true, // Default enabled
      system_indexing: false, // Default disabled for performance
      system_network_optimization: false, // Default disabled
      system_disk_optimization: false, // Default disabled
      
      // Network optimization defaults (based on actual system state)
      network_disable_widgets: true, // TaskbarDa = 0 (disabled)
      network_disable_news: false, // No registry entry found
      network_disable_weather: false, // No registry entry found
      network_disable_background_apps: true, // GlobalUserDisabled = 1
      network_disable_telemetry: true, // AllowTelemetry = 0 (disabled)
      network_disable_feedback: true, // NumberOfSIUFInPeriod = 0 (disabled)
      network_disable_diagtrack: true, // Service disabled
      network_disable_dmwappushservice: true, // Service disabled
      network_disable_rss_tasks: false, // Default
      
      // Appearance defaults (based on actual system state)
      appearance_dark_mode: true, // AppsUseLightTheme = 0 (dark mode)
      appearance_transparency: true, // EnableTransparency = 1
      appearance_animations: true, // MinAnimate = 1
      appearance_accent_color: false, // Default
      appearance_custom_cursor: false, // Default
      appearance_desktop_icons: true, // Icons visible
      
      // Context menu defaults (based on actual system state)
      contextmenu_copy_path: true, // Windows 11 built-in
      contextmenu_take_ownership: false, // Not found
      contextmenu_compact: false, // Default
      contextmenu_advanced: false, // Default
      contextmenu_win10_style: true, // Win11 override found
      contextmenu_win11_style: false, // Win11 override found
      contextmenu_copy_filename: false, // Default
      contextmenu_open_cmd_here: false, // Default
      contextmenu_open_powershell: false, // Default
      
      // Performance defaults (based on actual system state)
      performance_visual_effects: false, // VisualFXSetting = 1 (not performance)
      performance_power_plan: false, // Balanced plan active
      performance_gaming_mode: false // Default
    };
  }

  // Taskbar optimizations
  private async setTaskbarCombineButtons(enabled: boolean): Promise<void> {
    const value = enabled ? 1 : 0;
    await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarGlomLevel /t REG_DWORD /d ${value} /f`);
  }

  private async setTaskbarShowLabels(enabled: boolean): Promise<void> {
    const value = enabled ? 0 : 1;
    await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarSmallIcons /t REG_DWORD /d ${value} /f`);
  }

  private async setTaskbarSmallIcons(enabled: boolean): Promise<void> {
    const value = enabled ? 1 : 0;
    await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarSmallIcons /t REG_DWORD /d ${value} /f`);
  }

  private async setTaskbarShowDesktop(enabled: boolean): Promise<void> {
    const value = enabled ? 0 : 1;
    await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v DisablePreviewDesktop /t REG_DWORD /d ${value} /f`);
  }

  // Explorer optimizations
  private async setExplorerShowExtensions(enabled: boolean): Promise<void> {
    const value = enabled ? 0 : 1;
    await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideFileExt /t REG_DWORD /d ${value} /f`);
  }

  private async setExplorerShowHidden(enabled: boolean): Promise<void> {
    const value = enabled ? 1 : 0;
    await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v Hidden /t REG_DWORD /d ${value} /f`);
  }

  private async setExplorerCompactMode(enabled: boolean): Promise<void> {
    const value = enabled ? 1 : 0;
    await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v UseCompactMode /t REG_DWORD /d ${value} /f`);
  }

  private async setExplorerQuickAccess(enabled: boolean): Promise<void> {
    const value = enabled ? 1 : 0;
    await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v LaunchTo /t REG_DWORD /d ${value} /f`);
  }

  // Context menu optimizations
  private async setContextMenuCopyPath(enabled: boolean): Promise<void> {
    if (enabled) {
      const script = `
        New-Item -Path "HKCU:\\Software\\Classes\\*\\shell\\copypath" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\*\\shell\\copypath" -Name "(Default)" -Value "Copy as path"
        New-Item -Path "HKCU:\\Software\\Classes\\*\\shell\\copypath\\command" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\*\\shell\\copypath\\command" -Name "(Default)" -Value 'cmd.exe /c echo "%1" | clip'
      `;
      await executePowerShellScript(script);
    } else {
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\*\\shell\\copypath" /f`);
    }
  }

  private async setContextMenuTakeOwnership(enabled: boolean): Promise<void> {
    if (enabled) {
      const script = `
        New-Item -Path "HKCU:\\Software\\Classes\\*\\shell\\takeownership" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\*\\shell\\takeownership" -Name "(Default)" -Value "Take ownership"
        New-Item -Path "HKCU:\\Software\\Classes\\*\\shell\\takeownership\\command" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\*\\shell\\takeownership\\command" -Name "(Default)" -Value 'powershell.exe -Command "& {takeown /f \\"%1\\" /r /d y; icacls \\"%1\\" /grant administrators:F /t}"'
      `;
      await executePowerShellScript(script);
    } else {
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\*\\shell\\takeownership" /f`);
    }
  }

  private async setContextMenuCompact(enabled: boolean): Promise<void> {
    // Implementation for compact context menu
    console.log(`Context menu compact: ${enabled}`);
  }

  private async setContextMenuAdvanced(enabled: boolean): Promise<void> {
    // Implementation for advanced context menu
    console.log(`Context menu advanced: ${enabled}`);
  }

  private async resetTaskbarSettings(): Promise<void> {
      await executeCmdCommand(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarGlomLevel /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarSmallIcons /f`);
    await executeCmdCommand(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v DisablePreviewDesktop /f`);
  }

  private async resetExplorerSettings(): Promise<void> {
      await executeCmdCommand(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideFileExt /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v Hidden /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v UseCompactMode /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v LaunchTo /f`);
  }

  private async resetContextMenuSettings(): Promise<void> {
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\*\\shell\\copypath" /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\*\\shell\\takeownership" /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\*\\shell\\copyfilename" /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\Directory\\Background\\shell\\cmd" /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\Directory\\shell\\cmd" /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\Directory\\Background\\shell\\powershell" /f`);
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\Directory\\shell\\powershell" /f`);
  }

  private async setContextMenuWin10Style(enabled: boolean): Promise<void> {
    // Enable Win10 style (classic) by creating the override key; disable by removing
    if (enabled) {
      const script = `
        New-Item -Path "HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" -Force | Out-Null
        New-Item -Path "HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" -Force | Out-Null
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" -Name "(default)" -Value "" -ErrorAction SilentlyContinue
      `;
      await executePowerShellScript(script);
    } else {
      await executeCmdCommand('reg delete "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f');
    }
  }

  private async setContextMenuWin11Style(enabled: boolean): Promise<void> {
    // Enable Win11 style (modern) by removing the override key; disable by creating it
    if (enabled) {
      await executeCmdCommand('reg delete "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f');
    } else {
      const script = `
        New-Item -Path "HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" -Force | Out-Null
        New-Item -Path "HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" -Force | Out-Null
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" -Name "(default)" -Value "" -ErrorAction SilentlyContinue
      `;
      await executePowerShellScript(script);
    }
  }

  private async setContextMenu7ZipIntegration(enabled: boolean): Promise<void> {
    console.log(`7-Zip integration: ${enabled}`);
  }

  private async setContextMenuAdvancedRename(enabled: boolean): Promise<void> {
    console.log(`Advanced rename: ${enabled}`);
  }

  private async setContextMenuCopyFilename(enabled: boolean): Promise<void> {
    if (enabled) {
      const script = `
        New-Item -Path "HKCU:\\Software\\Classes\\*\\shell\\copyfilename" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\*\\shell\\copyfilename" -Name "(Default)" -Value "Copy filename"
        New-Item -Path "HKCU:\\Software\\Classes\\*\\shell\\copyfilename\\command" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\*\\shell\\copyfilename\\command" -Name "(Default)" -Value 'cmd /c echo %~n1%~x1 | clip'
      `;
      await executePowerShellScript(script);
    } else {
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\*\\shell\\copyfilename" /f`);
    }
  }

  private async setContextMenuOpenCmdHere(enabled: boolean): Promise<void> {
    if (enabled) {
      const script = `
        New-Item -Path "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\cmd" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\cmd" -Name "(Default)" -Value "Open command window here"
        New-Item -Path "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\cmd\\command" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\cmd\\command" -Name "(Default)" -Value 'cmd.exe /s /k pushd "%V"'
        
        New-Item -Path "HKCU:\\Software\\Classes\\Directory\\shell\\cmd" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\Directory\\shell\\cmd" -Name "(Default)" -Value "Open command window here"
        New-Item -Path "HKCU:\\Software\\Classes\\Directory\\shell\\cmd\\command" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\Directory\\shell\\cmd\\command" -Name "(Default)" -Value 'cmd.exe /s /k pushd "%1"'
      `;
      await executePowerShellScript(script);
    } else {
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\Directory\\Background\\shell\\cmd" /f`);
      await executeCmdCommand(`reg delete "HKCU:\\Software\\Classes\\Directory\\shell\\cmd" /f`);
    }
  }

  private async setContextMenuOpenPowerShell(enabled: boolean): Promise<void> {
    if (enabled) {
      const script = `
        New-Item -Path "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\powershell" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\powershell" -Name "(Default)" -Value "Open PowerShell window here"
        New-Item -Path "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\powershell\\command" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\powershell\\command" -Name "(Default)" -Value 'powershell.exe -noexit -command Set-Location "%V"'
        
        New-Item -Path "HKCU:\\Software\\Classes\\Directory\\shell\\powershell" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\Directory\\shell\\powershell" -Name "(Default)" -Value "Open PowerShell window here"
        New-Item -Path "HKCU:\\Software\\Classes\\Directory\\shell\\powershell\\command" -Force
        Set-ItemProperty -Path "HKCU:\\Software\\Classes\\Directory\\shell\\powershell\\command" -Name "(Default)" -Value 'powershell.exe -noexit -command Set-Location "%1"'
      `;
      await executePowerShellScript(script);
    } else {
      await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\Directory\\Background\\shell\\powershell" /f`);
      await executeCmdCommand(`reg delete "HKCU:\\Software\\Classes\\Directory\\shell\\powershell" /f`);
    }
  }

  private async setTaskbarWin11Style(enabled: boolean): Promise<void> {
    console.log(`Taskbar Win11 style: ${enabled}`);
  }

  private async setTaskbarCenterIcons(enabled: boolean): Promise<void> {
    console.log(`Taskbar center icons: ${enabled}`);
  }

  private async setExplorerWin11Ribbon(enabled: boolean): Promise<void> {
    console.log(`Explorer Win11 ribbon: ${enabled}`);
  }

  private async setExplorerPreviewPane(enabled: boolean): Promise<void> {
    console.log(`Explorer preview pane: ${enabled}`);
  }

  // Network optimizations
  private async setDisableWidgets(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarDa /t REG_DWORD /d 0 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarDa /t REG_DWORD /d 1 /f');
    }
  }

  private async setDisableNewsFeeds(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds" /v ShellFeedsTaskbarViewMode /t REG_DWORD /d 2 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds" /v ShellFeedsTaskbarViewMode /t REG_DWORD /d 1 /f');
    }
  }

  private async setDisableWeather(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds" /v ShellFeedsTaskbarOpenOnHover /t REG_DWORD /d 0 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Feeds" /v ShellFeedsTaskbarOpenOnHover /t REG_DWORD /d 1 /f');
    }
  }

  private async setDisableBackgroundApps(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 0 /f');
    }
  }

  private async setDisableTelemetry(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f');
    } else {
      await executeCmdCommand('reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 1 /f');
    }
  }

  private async setDisableFeedback(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Siuf\\Rules" /v NumberOfSIUFInPeriod /t REG_DWORD /d 0 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Siuf\\Rules" /v NumberOfSIUFInPeriod /t REG_DWORD /d 1 /f');
    }
  }

  private async setDisableService(serviceName: string, enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand(`sc config "${serviceName}" start= disabled`);
    } else {
      await executeCmdCommand(`sc config "${serviceName}" start= auto`);
    }
  }

  private async setDisableRSSTasks(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('schtasks /change /tn "Microsoft\\Windows\\Maintenance\\WinSAT" /disable');
    } else {
      await executeCmdCommand('schtasks /change /tn "Microsoft\\Windows\\Maintenance\\WinSAT" /enable');
    }
  }

  // System optimizations
  private async setSystemFastStartup(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f');
    } else {
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f');
    }
  }

  private async setSystemServicesOptimization(enabled: boolean): Promise<void> {
    if (enabled) {
      await this.setDisableService('DiagTrack', true);
      await this.setDisableService('dmwappushservice', true);
    } else {
      await this.setDisableService('DiagTrack', false);
      await this.setDisableService('dmwappushservice', false);
    }
  }

  private async setSystemIndexing(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('sc config "WSearch" start= auto');
    } else {
      await executeCmdCommand('sc config "WSearch" start= disabled');
    }
  }

  private async setSystemGameMode(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 1 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 0 /f');
    }
  }

  private async setSystemNetworkOptimization(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('netsh int tcp set global autotuninglevel=normal');
    } else {
      await executeCmdCommand('netsh int tcp set global autotuninglevel=disabled');
    }
  }

  private async setSystemDiskOptimization(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKLM\\SOFTWARE\\Microsoft\\Dfrg\\BootOptimizeFunction" /v Enable /t REG_SZ /d Y /f');
      await executeCmdCommand('defrag C: /O');
    } else {
      await executeCmdCommand('reg add "HKLM\\SOFTWARE\\Microsoft\\Dfrg\\BootOptimizeFunction" /v Enable /t REG_SZ /d N /f');
    }
  }

  // Performance optimizations
  private async setPerformanceVisualEffects(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 1 /f');
    }
  }

  private async setPerformancePowerPlan(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c');
    } else {
      await executeCmdCommand('powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e');
    }
  }

  private async setPerformanceVirtualMemory(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('wmic computersystem set AutomaticManagedPagefile=False');
      await executeCmdCommand('wmic pagefileset create name="C:\\pagefile.sys",initialsize=4096,maximumsize=8192');
    } else {
      await executeCmdCommand('wmic computersystem set AutomaticManagedPagefile=True');
    }
  }

  private async setPerformanceRAMOptimization(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v LargeSystemCache /t REG_DWORD /d 1 /f');
    } else {
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v LargeSystemCache /t REG_DWORD /d 0 /f');
    }
  }

  private async setPerformanceCPUOptimization(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\943c8cc6-6e93-4227-ad87-e9a3feec08d1" /v Attributes /t REG_DWORD /d 2 /f');
    } else {
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\943c8cc6-6e93-4227-ad87-e9a3feec08d1" /v Attributes /t REG_DWORD /d 1 /f');
    }
  }

  private async setPerformanceGamingMode(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 1 /f');
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d 0 /f');
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 0 /f');
    }
  }

  // Appearance optimizations
  private async setAppearanceDarkMode(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 0 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 1 /f');
    }
  }

  private async setAppearanceTransparency(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 1 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 0 /f');
    }
  }

  private async setAppearanceAnimations(enabled: boolean): Promise<void> {
    // Use the same path/value as detection logic
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_DWORD /d 1 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Control Panel\\Desktop\\WindowMetrics" /v MinAnimate /t REG_DWORD /d 0 /f');
    }
  }

  private async setAppearanceAccentColor(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Accent" /v AccentColorSet /t REG_DWORD /d 1 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Accent" /v AccentColorSet /t REG_DWORD /d 0 /f');
    }
  }

  private async setAppearanceCustomCursor(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Control Panel\\Cursors" /v Scheme Source /t REG_DWORD /d 1 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Control Panel\\Cursors" /v Scheme Source /t REG_DWORD /d 0 /f');
    }
  }

  private async setAppearanceDesktopIcons(enabled: boolean): Promise<void> {
    if (enabled) {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideIcons /t REG_DWORD /d 0 /f');
    } else {
      await executeCmdCommand('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideIcons /t REG_DWORD /d 1 /f');
    }
  }
}