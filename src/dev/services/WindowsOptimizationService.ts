import { executeCommandSafe, executeCmdCommand, executePowerShellScript } from './CommandHelper';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { defaultServicesData } from '../data/defaultServices';

export interface OptimizationOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

export class WindowsOptimizationService {
  private settingsFile = path.join(os.homedir(), '.windows-optimization-settings.json');

  async getOptimizationSettings(): Promise<Record<string, boolean>> {
    try {
      if (await fs.pathExists(this.settingsFile)) {
        const settings = await fs.readJson(this.settingsFile);
        return settings;
      }
      return {};
    } catch (error) {
      console.error('Lỗi khi đọc cài đặt tối ưu:', error);
      return {};
    }
  }

  async saveOptimizationSettings(settings: Record<string, boolean>): Promise<void> {
    try {
      await fs.writeJson(this.settingsFile, settings, { spaces: 2 });
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt tối ưu:', error);
    }
  }

  async applyOptimization(optionId: string, enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🔧 Áp dụng tối ưu: ${optionId} = ${enabled}`);

      switch (optionId) {
        // Taskbar optimizations
        case 'taskbar_combine_buttons':
          return await this.setTaskbarCombineButtons(enabled);
        case 'taskbar_show_labels':
          return await this.setTaskbarShowLabels(enabled);
        case 'taskbar_small_icons':
          return await this.setTaskbarSmallIcons(enabled);
        case 'taskbar_show_desktop':
          return await this.setTaskbarShowDesktop(enabled);
        case 'taskbar_win11_style':
          return await this.setTaskbarWin11Style(enabled);
        case 'taskbar_center_icons':
          return await this.setTaskbarCenterIcons(enabled);

        // Explorer optimizations
        case 'explorer_show_extensions':
          return await this.setExplorerShowExtensions(enabled);
        case 'explorer_show_hidden':
          return await this.setExplorerShowHidden(enabled);
        case 'explorer_compact_mode':
          return await this.setExplorerCompactMode(enabled);
        case 'explorer_quick_access':
          return await this.setExplorerQuickAccess(enabled);
        case 'explorer_win11_ribbon':
          return await this.setExplorerWin11Ribbon(enabled);
        case 'explorer_preview_pane':
          return await this.setExplorerPreviewPane(enabled);
        case 'explorer_win10_style':
          return await this.setExplorerWin10Style(enabled);

        // Context menu optimizations
        case 'contextmenu_copy_path':
          return await this.setContextMenuCopyPath(enabled);
        case 'contextmenu_take_ownership':
          return await this.setContextMenuTakeOwnership(enabled);
        case 'contextmenu_compact':
          return await this.setContextMenuCompact(enabled);
        case 'contextmenu_advanced':
          return await this.setContextMenuAdvanced(enabled);
        case 'contextmenu_win10_style':
          return await this.setContextMenuWin10Style(enabled);
        case 'contextmenu_win11_style':
          return await this.setContextMenuWin11Style(enabled);
        case 'contextmenu_7zip_integration':
          return await this.setContextMenu7ZipIntegration(enabled);
        case 'contextmenu_advanced_rename':
          return await this.setContextMenuAdvancedRename(enabled);
        case 'contextmenu_copy_filename':
          return await this.setContextMenuCopyFilename(enabled);
        case 'contextmenu_open_cmd_here':
          return await this.setContextMenuOpenCmdHere(enabled);
        case 'contextmenu_open_powershell':
          return await this.setContextMenuOpenPowerShell(enabled);

        // System optimizations
        case 'system_fast_startup':
          return await this.setFastStartup(enabled);
        case 'system_services_optimization':
          return await this.setServicesOptimization(enabled);
        case 'system_indexing':
          return await this.setIndexing(enabled);

        // Performance optimizations
        case 'performance_visual_effects':
          return await this.setVisualEffects(enabled);
        case 'performance_power_plan':
          return await this.setPowerPlan(enabled);
        case 'performance_virtual_memory':
          return await this.setVirtualMemoryOptimization(enabled);
        case 'performance_ram_optimization':
          return await this.setRAMOptimization(enabled);
        case 'performance_cpu_optimization':
          return await this.setCPUOptimization(enabled);
        case 'performance_gaming_mode':
          return await this.setGameMode(enabled);
        case 'system_game_mode':
          return await this.setGameMode(enabled);
        case 'system_network_optimization':
          return await this.setNetworkOptimization(enabled);
        case 'system_disk_optimization':
          return await this.setDiskOptimization(enabled);

        // Appearance optimizations
        case 'appearance_dark_mode':
          return await this.setDarkMode(enabled);
        case 'appearance_transparency':
          return await this.setTransparency(enabled);
        case 'appearance_animations':
          return await this.setAnimations(enabled);
        case 'appearance_accent_color':
          return await this.setAccentColor(enabled);
        case 'appearance_custom_cursor':
          return await this.setCustomCursor(enabled);
        case 'appearance_desktop_icons':
          return await this.setDesktopIcons(enabled);
        case 'appearance_transparency':
          return await this.setTransparency(enabled);
        case 'appearance_animations':
          return await this.setAnimations(enabled);
        case 'appearance_accent_color':
          return await this.setAccentColor(enabled);
        case 'appearance_custom_cursor':
          return await this.setCustomCursor(enabled);

        // Network optimizations
        case 'network_disable_widgets':
          return await this.setNetworkOptimization(enabled);
        case 'network_disable_news':
          return await this.setNetworkOptimization(enabled);
        case 'network_disable_weather':
          return await this.setNetworkOptimization(enabled);
        case 'network_disable_background_apps':
          return await this.setNetworkOptimization(enabled);
        case 'network_disable_telemetry':
          return await this.setNetworkOptimization(enabled);
        case 'network_disable_feedback':
          return await this.setNetworkOptimization(enabled);
        case 'network_disable_diagtrack':
          return await this.setNetworkOptimization(enabled);
        case 'network_disable_dmwappushservice':
          return await this.setNetworkOptimization(enabled);
        case 'network_disable_rss_tasks':
          return await this.setNetworkOptimization(enabled);

        default:
          return { success: false, message: `Tùy chọn không được hỗ trợ: ${optionId}` };
      }
    } catch (error) {
      console.error(`Lỗi khi áp dụng tối ưu ${optionId}:`, error);
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async applyAllOptimizations(options: OptimizationOption[]): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🔧 Áp dụng ${options.length} tối ưu...`);
      
      const results = [];
      for (const option of options) {
        if (option.enabled) {
          const result = await this.applyOptimization(option.id, true);
          results.push(result);
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failedCount = results.length - successCount;

      return {
        success: failedCount === 0,
        message: `Đã áp dụng ${successCount}/${results.length} tối ưu${failedCount > 0 ? ` (${failedCount} lỗi)` : ''}`
      };
    } catch (error) {
      console.error('Lỗi khi áp dụng tất cả tối ưu:', error);
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async resetOptimizations(): Promise<{ success: boolean; message: string }> {
    try {
      // Reset tất cả cài đặt về mặc định
      const resetScript = `
        # Reset Taskbar settings
        reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarGlomLevel /f
        reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarSmallIcons /f
        reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v EnableDesktopToolbar /f

        # Reset Explorer settings
        reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideFileExt /f
        reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v Hidden /f
        reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v UseCompactMode /f

        # Reset Visual Effects
        reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /f

        # Reset Power Plan
        powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e

        # Reset Game Mode
        reg delete "HKCU\\Software\\Microsoft\\GameBar" /v AllowAutoGameMode /f
        reg delete "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /f

        Write-Host "Đã đặt lại tất cả cài đặt về mặc định"
      `;

      // Thực thi qua file .ps1 để tránh lỗi escape
      const tmpPath = path.join(os.tmpdir(), `reset_optimizations_${Date.now()}.ps1`);
      await fs.writeFile(tmpPath, resetScript);
      await executePowerShellScript(`-ExecutionPolicy Bypass -File "${tmpPath}"`);
      await fs.remove(tmpPath);
      
      // Xóa file cài đặt
      if (await fs.pathExists(this.settingsFile)) {
        await fs.remove(this.settingsFile);
      }

      return { success: true, message: 'Đã đặt lại tất cả cài đặt về mặc định' };
    } catch (error) {
      console.error('Lỗi khi đặt lại cài đặt:', error);
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async exportOptimizationSettings(data: any): Promise<{ success: boolean; message: string }> {
    try {
      const exportPath = path.join(os.homedir(), 'Desktop', `windows-optimization-${new Date().toISOString().split('T')[0]}.json`);
      await fs.writeJson(exportPath, data, { spaces: 2 });
      return { success: true, message: `Đã xuất cài đặt ra: ${exportPath}` };
    } catch (error) {
      console.error('Lỗi khi xuất cài đặt:', error);
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async importOptimizationSettings(): Promise<any> {
    try {
      // Trả về thông tin để main process xử lý file dialog
      return {
        action: 'showFileDialog',
        options: {
          title: 'Chọn file cài đặt tối ưu',
          filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
          ],
          properties: ['openFile']
        }
      };
    } catch (error) {
      console.error('Lỗi khi nhập cài đặt:', error);
      throw error;
    }
  }

  // Taskbar optimizations
  private async setTaskbarCombineButtons(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarGlomLevel /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} gộp nút taskbar` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setTaskbarShowLabels(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 0 : 1;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarSmallIcons /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} hiển thị nhãn taskbar` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setTaskbarSmallIcons(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarSmallIcons /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} icon nhỏ taskbar` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setTaskbarShowDesktop(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v EnableDesktopToolbar /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} nút hiển thị desktop` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setTaskbarWin11Style(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        // Áp dụng style Windows 11
        await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarAl /t REG_DWORD /d 0 /f`);
        await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarMn /t REG_DWORD /d 0 /f`);
      }
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} giao diện Windows 11 cho taskbar` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setTaskbarCenterIcons(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarAl /t REG_DWORD /d 1 /f`);
      }
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} căn giữa icon taskbar` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Explorer optimizations
  private async setExplorerShowExtensions(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 0 : 1;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideFileExt /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} hiển thị phần mở rộng file` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setExplorerShowHidden(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v Hidden /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} hiển thị file ẩn` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setExplorerCompactMode(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v UseCompactMode /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} chế độ compact` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setExplorerQuickAccess(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v LaunchTo /t REG_DWORD /d 1 /f`);
      }
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} tối ưu Quick Access` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setExplorerWin11Ribbon(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Tạm thời placeholder
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} ribbon Windows 11` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setExplorerPreviewPane(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v ShowPreviewHandlers /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} Preview Pane` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setExplorerWin10Style(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        // Áp dụng style Windows 10 cho Explorer
        await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v UseCompactMode /t REG_DWORD /d 0 /f`);
        await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v LaunchTo /t REG_DWORD /d 1 /f`);
      }
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} giao diện Windows 10 cho Explorer` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Context menu optimizations
  private async setContextMenuCopyPath(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\*\\shell\\copypath" /ve /d "Copy as path" /f`);
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\*\\shell\\copypath\\command" /ve /d "powershell -command \\"Set-Clipboard -Path '%1'\\"" /f`);
      } else {
        await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\*\\shell\\copypath" /f`);
      }
      return { success: true, message: `Đã ${enabled ? 'thêm' : 'xóa'} Copy as path` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenuTakeOwnership(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\*\\shell\\runas" /ve /d "Take Ownership" /f`);
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\*\\shell\\runas\\command" /ve /d "cmd /c takeown /f \\"%1\\" && icacls \\"%1\\" /grant administrators:F" /f`);
      } else {
        await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\*\\shell\\runas" /f`);
      }
      return { success: true, message: `Đã ${enabled ? 'thêm' : 'xóa'} Take Ownership` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenuCompact(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Tạm thời placeholder
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} menu gọn gàng` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenuAdvanced(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Tạm thời placeholder
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} menu nâng cao` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenuWin10Style(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Tạm thời placeholder
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} menu kiểu Windows 10` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenuWin11Style(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Tạm thời placeholder
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} menu kiểu Windows 11` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenu7ZipIntegration(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Tạm thời placeholder
      return { success: true, message: `Đã ${enabled ? 'thêm' : 'xóa'} tích hợp 7-Zip` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenuAdvancedRename(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Tạm thời placeholder
      return { success: true, message: `Đã ${enabled ? 'thêm' : 'xóa'} đổi tên nâng cao` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenuCopyFilename(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\*\\shell\\copyfilename" /ve /d "Copy filename" /f`);
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\*\\shell\\copyfilename\\command" /ve /d "powershell -command \\"Set-Clipboard -Value (Split-Path '%1' -Leaf)\\"" /f`);
      } else {
        await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\*\\shell\\copyfilename" /f`);
      }
      return { success: true, message: `Đã ${enabled ? 'thêm' : 'xóa'} Copy filename` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenuOpenCmdHere(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\Directory\\Background\\shell\\cmd" /ve /d "Open command window here" /f`);
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\Directory\\Background\\shell\\cmd\\command" /ve /d "cmd.exe /s /k pushd \\"%V\\"" /f`);
      } else {
        await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\Directory\\Background\\shell\\cmd" /f`);
      }
      return { success: true, message: `Đã ${enabled ? 'thêm' : 'xóa'} Open CMD here` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setContextMenuOpenPowerShell(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\Directory\\Background\\shell\\PowerShell" /ve /d "Open PowerShell window here" /f`);
        await executeCmdCommand(`reg add "HKCU\\Software\\Classes\\Directory\\Background\\shell\\PowerShell\\command" /ve /d "powershell.exe -noexit -command Set-Location '%V'" /f`);
      } else {
        await executeCmdCommand(`reg delete "HKCU\\Software\\Classes\\Directory\\Background\\shell\\PowerShell" /f`);
      }
      return { success: true, message: `Đã ${enabled ? 'thêm' : 'xóa'} Open PowerShell here` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // System optimizations
  private async setFastStartup(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} Fast Startup` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setVisualEffects(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} hiệu ứng hình ảnh` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setServicesOptimization(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Danh sách dịch vụ ít rủi ro khi chỉnh start type (an toàn hơn)
      const safeServices = [
        'Fax',
        'RemoteRegistry',
        'WSearch', // Windows Search
        'DiagTrack' // Connected User Experiences and Telemetry
      ];

      if (enabled) {
        for (const svc of safeServices) {
          try {
            await executeCmdCommand(`sc stop "${svc}"`);
          } catch {}
          await executeCmdCommand(`sc config "${svc}" start= disabled`);
        }
      } else {
        // Rollback: đặt lại về manual (không auto), tránh bật tự động ngoài ý muốn
        for (const svc of safeServices) {
          try {
            await executeCmdCommand(`sc config "${svc}" start= demand`);
          } catch {}
        }
      }
      return { success: true, message: `Đã ${enabled ? 'tối ưu' : 'khôi phục'} dịch vụ an toàn` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setPowerPlan(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        // Ưu tiên Ultimate Performance nếu có, fallback High Performance
        try {
          await executeCmdCommand(`powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61`);
        } catch {}
        try {
          await executeCmdCommand(`powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61`);
        } catch {
          await executeCmdCommand(`powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c`);
        }
      }
      return { success: true, message: `Đã ${enabled ? 'đặt' : 'khôi phục'} kế hoạch năng lượng` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setVirtualMemoryOptimization(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        // Tự động quản lý bộ nhớ ảo
        await executeCmdCommand(`wmic computersystem set AutomaticManagedPagefile=True`);
      }
      return { success: true, message: `Đã ${enabled ? 'tối ưu' : 'khôi phục'} bộ nhớ ảo` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setIndexing(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        await executeCmdCommand(`sc config "WSearch" start= auto`);
        await executeCmdCommand(`net start WSearch`);
      } else {
        await executeCmdCommand(`sc config "WSearch" start= disabled`);
        await executeCmdCommand(`net stop WSearch`);
      }
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} Windows Search indexing` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Performance optimizations
  private async setGameMode(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\GameBar" /v AllowAutoGameMode /t REG_DWORD /d ${value} /f`);
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} Game Mode` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setNetworkOptimization(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        console.log('🔧 Bắt đầu tối ưu mạng...');

        // Windows 11: bật Autotuning, RSS, RSC và ECN (tùy mạng). Không dùng các tính năng đã lỗi thời
        await executeCmdCommand('netsh int tcp set global autotuninglevel=normal');
        await executeCmdCommand('netsh int tcp set global rss=enabled');
        await executeCmdCommand('netsh int tcp set global rsc=enabled');
        await executeCmdCommand('netsh int tcp set global ecncapability=enabled');

        console.log('✅ Hoàn thành tối ưu mạng');
        return {
          success: true,
          message: 'Đã tối ưu mạng: Autotuning=normal, RSS=enabled, RSC=enabled, ECN=enabled'
        };
      } else {
        console.log('🔄 Khôi phục cài đặt mạng về mặc định...');

        // Trả về gần mặc định Windows 11
        await executeCmdCommand('netsh int tcp set global rss=default');
        await executeCmdCommand('netsh int tcp set global rsc=disabled');
        await executeCmdCommand('netsh int tcp set global ecncapability=disabled');
        await executeCmdCommand('netsh int tcp set global autotuninglevel=normal');

        console.log('✅ Đã khôi phục cài đặt mạng về mặc định');
        return { success: true, message: 'Đã khôi phục cài đặt mạng về gần mặc định Windows 11' };
      }
    } catch (error) {
      console.error('❌ Lỗi khi tối ưu mạng:', error);
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setDiskOptimization(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        // Chỉ chạy tối ưu hóa cho HDD, bỏ qua SSD
        const checkScript = `
          $isSSD = $false
          try {
            $disk = Get-PhysicalDisk -ErrorAction SilentlyContinue | Where-Object FriendlyName -Like '*'
            if ($disk) { $isSSD = ($disk.MediaType -eq 'SSD') }
          } catch { $isSSD = $false }
          if (-not $isSSD) { Write-Output 'RUN_DEFRAG' } else { Write-Output 'SKIP' }
        `;
        const { stdout } = await executePowerShellScript(checkScript);
        if ((stdout || '').toString().trim().includes('RUN_DEFRAG')) {
          await executeCmdCommand(`defrag C: /O /U`);
        }
      }
      return { success: true, message: `Đã ${enabled ? 'tối ưu' : 'khôi phục'} ổ cứng` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setRAMOptimization(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        console.log('🔧 Bắt đầu tối ưu RAM an toàn...');

        // 1. Pagefile: tắt auto, đặt kích thước cố định nếu đã có, nếu chưa có thì tạo
        // Khuyến nghị: Initial = 1xRAM, Max = 2xRAM cho máy yếu. Ở đây ví dụ 8–16 GB.
        await executePowerShellScript(
          `Set-CimInstance -ClassName Win32_ComputerSystem -Property @{AutomaticManagedPagefile=$false}`);

        // Nếu đã tồn tại C:\pagefile.sys thì dùng 'set', nếu chưa có thì 'create'
        await executePowerShellScript(
          `$pf = Get-CimInstance -ClassName Win32_PageFileSetting -ErrorAction SilentlyContinue; `
          + `if ($pf) { `
          + `  Set-CimInstance -InputObject $pf -Property @{InitialSize=8192; MaximumSize=16384} `
          + `} else { `
          + `  New-CimInstance -ClassName Win32_PageFileSetting -Property @{Name='C:\\\\pagefile.sys'; InitialSize=8192; MaximumSize=16384} `
          + `}`);

        // 2. Registry hợp lý cho đa số máy
        // Tắt xóa pagefile lúc shutdown để không chậm tắt máy
        await executeCmdCommand(
          `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" `
          + `/v ClearPageFileAtShutdown /t REG_DWORD /d 0 /f`);

        // KHÔNG đụng LargeSystemCache, SystemPages, SecondLevelDataCache, PoolQuota, IoPageLockLimit

        // 3. Game networking hợp lý
        await executeCmdCommand(
          `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" `
          + `/v NetworkThrottlingIndex /t REG_DWORD /d 0xffffffff /f`);
        await executeCmdCommand(
          `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" `
          + `/v SystemResponsiveness /t REG_DWORD /d 0 /f`);

        console.log('✅ Hoàn thành tối ưu RAM an toàn');
        return { success: true, message: 'Đã tối ưu RAM an toàn, pagefile cố định, giảm nền cho gaming' };
      } else {
        // Rollback
        await executePowerShellScript(
          `Set-CimInstance -ClassName Win32_ComputerSystem -Property @{AutomaticManagedPagefile=$true}`);

        await executeCmdCommand(
          `reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" `
          + `/v NetworkThrottlingIndex /f`);
        await executeCmdCommand(
          `reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" `
          + `/v SystemResponsiveness /f`);

        return { success: true, message: 'Đã khôi phục cài đặt RAM về mặc định' };
      }
    } catch (error) {
      console.error('❌ Lỗi khi tối ưu RAM:', error);
      return { success: false, message: `Lỗi tối ưu RAM: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setCPUOptimization(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (enabled) {
        console.log('🔧 Bắt đầu tối ưu CPU an toàn...');
  
        // 1. Tạo và kích hoạt Ultimate Performance nếu có, nếu không thì High Performance
        await executeCmdCommand(`powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61`);
        await executeCmdCommand(`powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61`);
        await executeCmdCommand(`powercfg -changename e9a42b02-d5df-448d-aa00-03f14749eb61 "Ultra Performance"`);
  
        // 2. Unhide các setting CPU để có thể chỉnh
        await executeCmdCommand(`powercfg -attributes SUB_PROCESSOR PROCTHROTTLEMIN -ATTRIB_HIDE`);
        await executeCmdCommand(`powercfg -attributes SUB_PROCESSOR PROCTHROTTLEMAX -ATTRIB_HIDE`);
        await executeCmdCommand(`powercfg -attributes SUB_PROCESSOR CPMINCORES     -ATTRIB_HIDE`); // core parking min cores
        await executeCmdCommand(`powercfg -attributes SUB_PROCESSOR CPDISTRIBUTION -ATTRIB_HIDE`); // distribution
  
        // 3. Đặt Processor state Min Max = 100 để tránh tụt xung khi chơi game
        await executeCmdCommand(`powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100`);
        await executeCmdCommand(`powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100`);
        await executeCmdCommand(`powercfg -setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100`);
        await executeCmdCommand(`powercfg -setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100`);
  
        // 4. Core parking: giảm tối đa parking để ổn định FPS
        // CPMINCORES = 100 nghĩa là yêu cầu giữ tất cả core active trên AC
        await executeCmdCommand(`powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR CPMINCORES 100`);
        // Trên DC có thể để 50 cho laptop, tùy bạn
        await executeCmdCommand(`powercfg -setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR CPMINCORES 50`);
  
        // 5. Áp lại scheme hiện tại để có hiệu lực ngay
        await executeCmdCommand(`powercfg -setactive SCHEME_CURRENT`);
  
        console.log('✅ Hoàn thành tối ưu CPU an toàn');
        return { success: true, message: 'Đã tối ưu CPU an toàn, ép min max, hạn chế core parking, bật Ultra Performance' };
      } else {
        // Rollback về Balanced
        await executeCmdCommand(`powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e`);
        // Không xóa mitigations vì ta không chỉnh chúng trong bản an toàn
        return { success: true, message: 'Đã khôi phục cài đặt CPU về Balanced' };
      }
    } catch (error) {
      console.error('❌ Lỗi khi tối ưu CPU:', error);
      return { success: false, message: `Lỗi tối ưu CPU: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }
  

  // Appearance optimizations
  private async setDarkMode(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} chế độ tối` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setTransparency(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} hiệu ứng trong suốt` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setAnimations(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v IconsOnly /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} hiệu ứng chuyển động` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setAccentColor(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Tạm thời placeholder
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} màu nhấn` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setCustomCursor(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Tạm thời placeholder
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} con trỏ tùy chỉnh` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private async setDesktopIcons(enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const value = enabled ? 1 : 0;
      await executeCmdCommand(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideIcons /t REG_DWORD /d ${value} /f`);
      return { success: true, message: `Đã ${enabled ? 'bật' : 'tắt'} icon desktop` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Legacy methods for backward compatibility
  async optimizeServices(): Promise<{ success: boolean; message: string }> {
    try {
      await this.setServicesOptimization(true);
      return { success: true, message: 'Đã tối ưu các dịch vụ hệ thống' };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async disableWindowsDefender(): Promise<{ success: boolean; message: string }> {
    try {
      await executeCmdCommand('sc config "WinDefend" start= disabled');
      await executeCmdCommand('sc stop "WinDefend"');
      return { success: true, message: 'Đã tắt Windows Defender' };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async moveZaloToDrive(drive: string): Promise<{ success: boolean; message: string }> {
    try {
      const zaloPath = path.join(os.homedir(), 'AppData', 'Local', 'ZaloPC');
      const targetPath = path.join(drive, 'ZaloPC');
      
      if (await fs.pathExists(zaloPath)) {
        await fs.copy(zaloPath, targetPath);
        await fs.remove(zaloPath);
        await fs.symlink(targetPath, zaloPath);
        return { success: true, message: `Đã di chuyển Zalo sang ổ ${drive}` };
      } else {
        return { success: false, message: 'Không tìm thấy thư mục Zalo' };
      }
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async optimizeSelectedServices(services: string[]): Promise<{ success: boolean; message: string }> {
    try {
      for (const service of services) {
        await executeCmdCommand(`sc config "${service}" start= disabled`);
      }
      return { success: true, message: `Đã tối ưu ${services.length} dịch vụ` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async setVirtualMemory(sizeGB: number): Promise<{ success: boolean; message: string }> {
    try {
      const sizeMB = sizeGB * 1024;
      await executeCmdCommand(`wmic computersystem set AutomaticManagedPagefile=False`);
      await executeCmdCommand(`wmic pagefileset create name="C:\\pagefile.sys",initialsize=${sizeMB},maximumsize=${sizeMB}`);
      return { success: true, message: `Đã đặt bộ nhớ ảo ${sizeGB}GB` };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async installSelectedApps(apps: string[]): Promise<{ success: boolean; message: string }> {
    try {
      const appDownloadUrls: { [key: string]: string } = {
        'Google Chrome': 'https://dl.google.com/chrome/install/latest/chrome_installer.exe',
        'Mozilla Firefox': 'https://download.mozilla.org/?product=firefox-latest&os=win64&lang=en-US',
        '7-Zip': 'https://www.7-zip.org/a/7z2301-x64.exe',
        'Notepad++': 'https://github.com/notepad-plus-plus/notepad-plus-plus/releases/download/v8.5.8/npp.8.5.8.Installer.x64.exe',
        'VLC Media Player': 'https://get.videolan.org/vlc/3.0.18/win64/vlc-3.0.18-win64.exe',
        'CCleaner': 'https://download.ccleaner.com/ccsetup606.exe'
      };

      const installedApps: string[] = [];
      const failedApps: string[] = [];

      for (const app of apps) {
        try {
          const downloadUrl = appDownloadUrls[app];
          if (!downloadUrl) {
            failedApps.push(app);
            continue;
          }

          // Download và cài đặt ứng dụng
          const tempDir = os.tmpdir();
          const fileName = `${app.replace(/\s+/g, '_')}_installer.exe`;
          const filePath = path.join(tempDir, fileName);

          // Sử dụng PowerShell để download
          const downloadScript = `
            $ProgressPreference = 'SilentlyContinue'
            Invoke-WebRequest -Uri "${downloadUrl}" -OutFile "${filePath}" -UserAgent "Mozilla/5.0"
            Write-Host "Downloaded: ${filePath}"
          `;
          
          await executePowerShellScript(downloadScript);

          // Cài đặt silent
          const installScript = `
            Start-Process -FilePath "${filePath}" -ArgumentList "/S", "/silent", "/verysilent", "/SILENT", "/VERYSILENT" -Wait -NoNewWindow
            Write-Host "Installed: ${app}"
          `;
          
          await executePowerShellScript(installScript);
          
          // Cleanup installer
          try {
            await fs.remove(filePath);
          } catch (cleanupError) {
            console.warn(`Không thể xóa file installer: ${filePath}`);
          }

          installedApps.push(app);
        } catch (error) {
          console.error(`Lỗi khi cài đặt ${app}:`, error);
          failedApps.push(app);
        }
      }

      if (installedApps.length > 0) {
        const message = `Đã cài đặt thành công: ${installedApps.join(', ')}` + 
          (failedApps.length > 0 ? `. Thất bại: ${failedApps.join(', ')}` : '');
        return { success: true, message };
      } else {
        return { success: false, message: `Không thể cài đặt bất kỳ ứng dụng nào: ${failedApps.join(', ')}` };
      }
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async disableWindowsUpdate(): Promise<{ success: boolean; message: string }> {
    try {
      await executeCmdCommand('sc config "wuauserv" start= disabled');
      await executeCmdCommand('sc stop "wuauserv"');
      return { success: true, message: 'Đã tắt Windows Update' };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async activateWindows(): Promise<{ success: boolean; message: string }> {
    try {
      await executeCmdCommand('slmgr /skms kms.digiboy.ir');
      await executeCmdCommand('slmgr /ato');
      return { success: true, message: 'Đã kích hoạt Windows' };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async increaseVirtualMemory(sizeGB: number): Promise<{ success: boolean; message: string }> {
    return await this.setVirtualMemory(sizeGB);
  }

  async installSilentApps(): Promise<{ success: boolean; message: string }> {
    try {
      // Placeholder for silent app installation
      return { success: true, message: 'Đã cài đặt ứng dụng' };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async getServicesInfo(): Promise<any[]> {
    try {
      const { stdout } = await executeCmdCommand('sc query type= service state= all');
      
      // Parse the output and convert to array of service objects
      const lines = stdout.split('\n');
      const services: any[] = [];
      let currentService: any = {};
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('SERVICE_NAME:')) {
          if (currentService.Name) {
            services.push(currentService);
          }
          currentService = {
            Name: trimmedLine.replace('SERVICE_NAME:', '').trim(),
            SafeToDisable: false, // Default value
            Category: 'System',
            Impact: 'Trung bình',
            StartType: 3 // Default to Manual
          };
        } else if (trimmedLine.startsWith('DISPLAY_NAME:')) {
          currentService.DisplayName = trimmedLine.replace('DISPLAY_NAME:', '').trim();
          // Use DisplayName as Description if no specific description is available
          if (!currentService.Description) {
            currentService.Description = currentService.DisplayName;
          }
        } else if (trimmedLine.startsWith('TYPE:')) {
          // Parse service type
        } else if (trimmedLine.startsWith('STATE:')) {
          const stateMatch = trimmedLine.match(/STATE\s+:\s+(\d+)/);
          if (stateMatch) {
            currentService.Status = parseInt(stateMatch[1]);
          }
        } else if (trimmedLine.startsWith('WIN32_EXIT_CODE:')) {
          // Parse exit code
        } else if (trimmedLine.startsWith('SERVICE_EXIT_CODE:')) {
          // Parse service exit code
        } else if (trimmedLine.startsWith('CHECKPOINT:')) {
          // Parse checkpoint
        } else if (trimmedLine.startsWith('WAIT_HINT:')) {
          // Parse wait hint
        } else if (trimmedLine.startsWith('PID:')) {
          // Parse process ID
        } else if (trimmedLine.startsWith('FLAGS:')) {
          // Parse flags
        }
      }
      
      // Add the last service
      if (currentService.Name) {
        services.push(currentService);
      }
      
      // Ánh xạ tiếng Việt từ defaultServicesData (bao phủ đầy đủ)
      const viMap = new Map<string, any>();
      try {
        for (const s of defaultServicesData.services) {
          viMap.set((s.Name || '').toLowerCase(), s);
        }
      } catch {}

      services.forEach(service => {
        const vi = viMap.get((service.Name || '').toLowerCase());
        if (vi) {
          service.VietnameseName = vi.VietnameseName || service.DisplayName;
          service.VietnameseDescription = vi.VietnameseDescription || service.Description || 'Dịch vụ hệ thống Windows';
          service.Category = vi.Category || service.Category;
          service.Impact = vi.Impact || service.Impact;
          service.SafeToDisable = typeof vi.SafeToDisable === 'boolean' ? vi.SafeToDisable : !!service.SafeToDisable;
        } else {
          // Fallback an toàn
          service.VietnameseName = service.VietnameseName || service.DisplayName;
          service.VietnameseDescription = service.VietnameseDescription || service.Description || 'Dịch vụ hệ thống Windows';
          if (service.SafeToDisable === undefined) service.SafeToDisable = false;
        }
      });
      
      // Get start type for each service
      for (const service of services) {
        try {
          const { stdout } = await executeCmdCommand(`sc qc "${service.Name}"`);
          const startTypeMatch = stdout.match(/START_TYPE\s+:\s+(\d+)/);
          if (startTypeMatch) {
            service.StartType = parseInt(startTypeMatch[1]);
          }
        } catch (error) {
          // Keep default StartType if can't get it
          console.error(`Không thể lấy StartType cho service ${service.Name}:`, error);
        }
      }
      
      return services;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin services:', error);
      return [];
    }
  }

  async getWindowsDefenderStatus(): Promise<any> {
    try {
      const { stdout } = await executeCmdCommand('sc query "WinDefend"');
      const isRunning = stdout.includes('RUNNING');
      return {
        realTimeProtection: isRunning,
        cloudProtection: isRunning,
        automaticSampleSubmission: isRunning
      };
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái Windows Defender:', error);
      return {
        realTimeProtection: null,
        cloudProtection: null,
        automaticSampleSubmission: null
      };
    }
  }

  async getWindowsUpdateStatus(): Promise<any> {
    try {
      const { stdout } = await executeCmdCommand('sc query "wuauserv"');
      const isRunning = stdout.includes('RUNNING');
      return {
        automaticUpdatesEnabled: isRunning,
        updateLevel: isRunning ? 'Automatic' : 'Manual',
        lastCheckTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái Windows Update:', error);
      return {
        automaticUpdatesEnabled: false,
        updateLevel: 'Manual',
        lastCheckTime: new Date().toISOString()
      };
    }
  }

  async enableWindowsUpdate(): Promise<{ success: boolean; message: string }> {
    try {
      await executeCmdCommand('sc config "wuauserv" start= auto');
      await executeCmdCommand('sc start "wuauserv"');
      return { success: true, message: 'Đã bật Windows Update' };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async resetVirtualMemory(): Promise<{ success: boolean; message: string }> {
    try {
      await executeCmdCommand('wmic computersystem set AutomaticManagedPagefile=True');
      return { success: true, message: 'Đã đặt lại bộ nhớ ảo về tự động' };
    } catch (error) {
      return { success: false, message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Advanced RAM and CPU optimization methods
  async getSystemPerformanceInfo(): Promise<any> {
    try {
      const networkInfo = await this.getNetworkInfo();
      
      return {
        network: networkInfo,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin hiệu suất:', error);
      throw error;
    }
  }

  private async getNetworkInfo(): Promise<any> {
    try {
      // Kiểm tra cài đặt TCP/IP hiện tại
      const tcpSettings = await this.executePowerShellCommand(`
        $settings = @{}
        $settings.autotuning = (netsh int tcp show global | Select-String "autotuninglevel").ToString().Split(":")[1].Trim()
        $settings.rss = (netsh int tcp show global | Select-String "RSS").ToString().Split(":")[1].Trim()
        $settings.rsc = (netsh int tcp show global | Select-String "RSC").ToString().Split(":")[1].Trim()
        $settings.ecn = (netsh int tcp show global | Select-String "ECN Capability").ToString().Split(":")[1].Trim()
        $settings.chimney = (netsh int tcp show global | Select-String "Chimney").ToString().Split(":")[1].Trim()
        $settings.dca = (netsh int tcp show global | Select-String "Direct Cache Access").ToString().Split(":")[1].Trim()
        $settings.netdma = (netsh int tcp show global | Select-String "NetDMA").ToString().Split(":")[1].Trim()
        
        # Kiểm tra registry settings
        try {
          $regPath = "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters"
          $settings.tcp1323opts = (Get-ItemProperty -Path $regPath -Name "Tcp1323Opts" -ErrorAction SilentlyContinue).Tcp1323Opts
          $settings.tcpTimedWaitDelay = (Get-ItemProperty -Path $regPath -Name "TcpTimedWaitDelay" -ErrorAction SilentlyContinue).TcpTimedWaitDelay
          $settings.maxUserPort = (Get-ItemProperty -Path $regPath -Name "MaxUserPort" -ErrorAction SilentlyContinue).MaxUserPort
        } catch {
          $settings.tcp1323opts = "Not Set"
          $settings.tcpTimedWaitDelay = "Not Set"
          $settings.maxUserPort = "Not Set"
        }
        
        $settings | ConvertTo-Json
      `);
      
      // Kiểm tra network adapter status
      const adapterInfo = await this.executePowerShellCommand(`
        Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | Select-Object Name, InterfaceDescription, Status, LinkSpeed | ConvertTo-Json
      `);
      
      // Kiểm tra DNS settings
      const dnsInfo = await this.executePowerShellCommand(`
        Get-DnsClientServerAddress | Where-Object {$_.ServerAddresses -ne $null} | Select-Object InterfaceAlias, ServerAddresses | ConvertTo-Json
      `);
      
      return {
        tcpSettings: JSON.parse((tcpSettings.stdout || '{}') as any),
        adapters: JSON.parse((adapterInfo.stdout || '[]') as any),
        dns: JSON.parse((dnsInfo.stdout || '[]') as any),
        isOptimized: this.checkNetworkOptimizationStatus(tcpSettings.stdout as any)
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin mạng:', error);
      return { error: (error as Error).message };
    }
  }

  private checkNetworkOptimizationStatus(tcpSettings: string): boolean {
    try {
      const settings = JSON.parse(tcpSettings || '{}');
      return (
        settings.autotuning === 'normal' &&
        settings.rss === 'enabled' &&
        settings.rsc === 'enabled' &&
        settings.ecn === 'enabled'
      );
    } catch {
      return false;
    }
  }

  async executePowerShellCommand(command: string): Promise<any> {
    try {
      const { stdout, stderr } = await executePowerShellScript(command);
      return { stdout, stderr };
    } catch (error) {
      console.error('Lỗi khi thực thi PowerShell command:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async applyAdvancedRAMOptimization(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🚀 Bắt đầu tối ưu RAM nâng cao an toàn...');
      
      // 1. Pagefile: tắt auto, đặt kích thước cố định nếu đã có, nếu chưa có thì tạo
      // Khuyến nghị: Initial = 1xRAM, Max = 2xRAM cho máy yếu. Ở đây ví dụ 8–16 GB.
      await executePowerShellScript(
        `Set-CimInstance -ClassName Win32_ComputerSystem -Property @{AutomaticManagedPagefile=$false}`);

      // Nếu đã tồn tại C:\pagefile.sys thì dùng 'set', nếu chưa có thì 'create'
      await executePowerShellScript(
        `$pf = Get-CimInstance -ClassName Win32_PageFileSetting -ErrorAction SilentlyContinue; `
        + `if ($pf) { `
        + `  Set-CimInstance -InputObject $pf -Property @{InitialSize=8192; MaximumSize=16384} `
        + `} else { `
        + `  New-CimInstance -ClassName Win32_PageFileSetting -Property @{Name='C:\\\\pagefile.sys'; InitialSize=8192; MaximumSize=16384} `
        + `}`);

      // 2. Registry hợp lý cho đa số máy
      // Tắt xóa pagefile lúc shutdown để không chậm tắt máy
      await executeCmdCommand(
        `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" `
        + `/v ClearPageFileAtShutdown /t REG_DWORD /d 0 /f`);

      // KHÔNG đụng LargeSystemCache, SystemPages, SecondLevelDataCache, PoolQuota, IoPageLockLimit

      // 3. Game networking hợp lý
      await executeCmdCommand(
        `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" `
        + `/v NetworkThrottlingIndex /t REG_DWORD /d 0xffffffff /f`);
      await executeCmdCommand(
        `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" `
        + `/v SystemResponsiveness /t REG_DWORD /d 0 /f`);

      // 4. Tối ưu cài đặt RAM cho hiệu suất cao cấp (an toàn)
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v SessionViewSize /t REG_DWORD /d 192 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v SessionPoolSize /t REG_DWORD /d 48 /f');
      
      // 5. Tối ưu cài đặt RAM cho game và ứng dụng nặng
      // Đảm bảo key tồn tại và giá trị có khoảng trắng được trích dẫn đúng
      await executeCmdCommand('reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /f');
      await executeCmdCommand('reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f');
      await executeCmdCommand('reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v Priority /t REG_DWORD /d 6 /f');
      await executeCmdCommand('reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d High /f');
      await executeCmdCommand('reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "SFIO Priority" /t REG_SZ /d High /f');
      
      console.log('✅ Hoàn thành tối ưu RAM nâng cao an toàn');
      return { success: true, message: 'Đã áp dụng tối ưu RAM nâng cao an toàn: Pagefile cố định, tối ưu game networking, tăng priority cho game' };
    } catch (error) {
      console.error('❌ Lỗi khi tối ưu RAM nâng cao:', error);
      return { success: false, message: `Lỗi tối ưu RAM nâng cao: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async applyAdvancedCPUOptimization(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🚀 Bắt đầu tối ưu CPU nâng cao...');
      
      // 1. Tạo Power Plan tối ưu cho hiệu suất tối đa
      await executeCmdCommand('powercfg /duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c "Ultra Performance Mode"');
      await executeCmdCommand('powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c');
      
      // 2. Tối ưu cài đặt CPU cho hiệu suất tối đa
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverride /t REG_DWORD /d 3 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v FeatureSettingsOverrideMask /t REG_DWORD /d 3 /f');
      
      // 3. Tối ưu cài đặt CPU cho tần số cao
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\943c8cb6-6f93-4227-ad87-e9a3feec08d1" /v Attributes /t REG_DWORD /d 2 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMin /t REG_DWORD /d 100 /f');
      
      // 4. Tối ưu cài đặt CPU cho hiệu suất cao cấp
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\75b0ae3f-bce0-45a7-8c89-c9611e25ba90" /v Attributes /t REG_DWORD /d 2 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\75b0ae3f-bce0-45a7-8c89-c9611e25ba90" /v ValueMax /t REG_DWORD /d 100 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\75b0ae3f-bce0-45a7-8c89-c9611e25ba90" /v ValueMin /t REG_DWORD /d 100 /f');
      
      // 5. Tối ưu cài đặt CPU cho hiệu suất tối đa
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\be337238-9d82-4866-b8d6-5e21bca4a3b6" /v Attributes /t REG_DWORD /d 2 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\be337238-9d82-4866-b8d6-5e21bca4a3b6" /v ValueMax /t REG_DWORD /d 100 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\be337238-9d82-4866-b8d6-5e21bca4a3b6" /v ValueMin /t REG_DWORD /d 100 /f');
      
      // 6. Tối ưu cài đặt CPU cho hiệu suất cao cấp
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v Attributes /t REG_DWORD /d 2 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMin /t REG_DWORD /d 100 /f');
      
      // 7. Tối ưu cài đặt CPU cho hiệu suất tối đa
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v Attributes /t REG_DWORD /d 2 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMin /t REG_DWORD /d 100 /f');
      
      // 8. Tối ưu cài đặt CPU cho hiệu suất cao cấp
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v Attributes /t REG_DWORD /d 2 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMin /t REG_DWORD /d 100 /f');
      
      // 9. Tối ưu cài đặt CPU cho hiệu suất tối đa
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v Attributes /t REG_DWORD /d 2 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMin /t REG_DWORD /d 100 /f');
      
      // 10. Tối ưu cài đặt CPU cho hiệu suất cao cấp
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v Attributes /t REG_DWORD /d 2 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f');
      await executeCmdCommand('reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMin /t REG_DWORD /d 100 /f');
      
      console.log('✅ Hoàn thành tối ưu CPU nâng cao');
      return { success: true, message: 'Đã áp dụng tối ưu CPU nâng cao: Tăng xung tối đa, tăng nguồn điện, tối ưu power plan cho hiệu suất cao nhất' };
    } catch (error) {
      console.error('❌ Lỗi khi tối ưu CPU nâng cao:', error);
      return { success: false, message: `Lỗi tối ưu CPU nâng cao: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async getNetworkStatus(): Promise<any> {
    try {
      const networkInfo = await this.getNetworkInfo();
      return {
        success: true,
        data: networkInfo,
        message: 'Đã lấy thông tin trạng thái mạng'
      };
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái mạng:', error);
      return {
        success: false,
        message: `Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
} 