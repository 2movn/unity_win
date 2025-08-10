import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Modal, Spin, Select, message, Tag, Divider, Tabs, Alert, Switch } from 'antd';
import { ToolOutlined, SettingOutlined, ReloadOutlined, AppstoreOutlined, FolderOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, DesktopOutlined, MenuOutlined, RocketOutlined, BulbOutlined, EyeOutlined, DashboardOutlined, ControlOutlined, DownloadOutlined, UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import ZaloManager from './ZaloManager';
import { gradientStyles, customStyles } from '../styles/theme';

const { Title, Text } = Typography;
const { Option } = Select;

  // Removed drive and app types as Zalo & app installer are moved out

  interface OptimizationOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
    category: 'taskbar' | 'explorer' | 'contextmenu' | 'system' | 'performance' | 'appearance' | 'network';
}

const ToolsManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tools');
  const [optimizationOptions, setOptimizationOptions] = useState<OptimizationOption[]>([
    // Taskbar optimizations
    {
      id: 'taskbar_combine_buttons',
      name: 'Gộp các nút taskbar',
      description: 'Gộp các cửa sổ cùng ứng dụng thành một nút',
      enabled: false,
      category: 'taskbar'
    },
    {
      id: 'taskbar_show_labels',
      name: 'Hiển thị nhãn trên taskbar',
      description: 'Hiển thị tên ứng dụng trên taskbar',
      enabled: true,
      category: 'taskbar'
    },
    {
      id: 'taskbar_small_icons',
      name: 'Icon nhỏ trên taskbar',
      description: 'Sử dụng icon nhỏ để tiết kiệm không gian',
      enabled: false,
      category: 'taskbar'
    },
    {
      id: 'taskbar_show_desktop',
      name: 'Nút "Hiển thị desktop"',
      description: 'Thêm nút ẩn/hiện desktop vào taskbar',
      enabled: true,
      category: 'taskbar'
    },
    {
      id: 'taskbar_win11_style',
      name: 'Giao diện Windows 11',
      description: 'Sử dụng giao diện taskbar kiểu Windows 11',
      enabled: false,
      category: 'taskbar'
    },
    {
      id: 'taskbar_center_icons',
      name: 'Căn giữa icon taskbar',
      description: 'Căn giữa các icon trên taskbar',
      enabled: false,
      category: 'taskbar'
    },
    // Explorer optimizations
    {
      id: 'explorer_show_extensions',
      name: 'Hiển thị phần mở rộng file',
      description: 'Hiển thị đuôi file (.txt, .docx, ...)',
      enabled: true,
      category: 'explorer'
    },
    {
      id: 'explorer_show_hidden',
      name: 'Hiển thị file ẩn',
      description: 'Hiển thị các file và thư mục ẩn',
      enabled: false,
      category: 'explorer'
    },
    {
      id: 'explorer_compact_mode',
      name: 'Chế độ compact',
      description: 'Giảm khoảng cách giữa các item trong explorer',
      enabled: false,
      category: 'explorer'
    },
    {
      id: 'explorer_quick_access',
      name: 'Quick Access',
      description: 'Hiển thị Quick Access trong explorer',
      enabled: true,
      category: 'explorer'
    },
    {
      id: 'explorer_win11_ribbon',
      name: 'Ribbon Windows 11',
      description: 'Sử dụng ribbon kiểu Windows 11',
      enabled: false,
      category: 'explorer'
    },
    {
      id: 'explorer_preview_pane',
      name: 'Preview pane',
      description: 'Hiển thị preview pane trong explorer',
      enabled: false,
      category: 'explorer'
    },
    // Context menu optimizations
    {
      id: 'contextmenu_copy_path',
      name: 'Copy path',
      description: 'Thêm "Copy as path" vào menu chuột phải',
      enabled: true,
      category: 'contextmenu'
    },
    {
      id: 'contextmenu_take_ownership',
      name: 'Take ownership',
      description: 'Thêm "Take ownership" vào menu chuột phải',
      enabled: false,
      category: 'contextmenu'
    },
    {
      id: 'contextmenu_compact',
      name: 'Menu compact',
      description: 'Sử dụng menu chuột phải compact',
      enabled: false,
      category: 'contextmenu'
    },
    {
      id: 'contextmenu_advanced',
      name: 'Menu nâng cao',
      description: 'Hiển thị menu chuột phải nâng cao',
      enabled: false,
      category: 'contextmenu'
    },
    {
      id: 'contextmenu_win10_style',
      name: 'Kiểu Windows 10',
      description: 'Sử dụng menu chuột phải kiểu Windows 10',
      enabled: true,
      category: 'contextmenu'
    },
    {
      id: 'contextmenu_win11_style',
      name: 'Kiểu Windows 11',
      description: 'Sử dụng menu chuột phải kiểu Windows 11',
      enabled: false,
      category: 'contextmenu'
    },
    {
      id: 'contextmenu_copy_filename',
      name: 'Copy tên file',
      description: 'Thêm "Copy filename" vào menu chuột phải',
      enabled: false,
      category: 'contextmenu'
    },
    {
      id: 'contextmenu_open_cmd_here',
      name: 'Mở CMD tại đây',
      description: 'Thêm "Open command window here" vào menu chuột phải',
      enabled: false,
      category: 'contextmenu'
    },
    {
      id: 'contextmenu_open_powershell',
      name: 'Mở PowerShell tại đây',
      description: 'Thêm "Open PowerShell window here" vào menu chuột phải',
      enabled: false,
      category: 'contextmenu'
    },
    // System optimizations
    {
      id: 'system_fast_startup',
      name: 'Khởi động nhanh',
      description: 'Bật tính năng khởi động nhanh',
      enabled: true,
      category: 'system'
    },
    {
      id: 'system_services_optimization',
      name: 'Tối ưu dịch vụ',
      description: 'Tối ưu các dịch vụ Windows không cần thiết',
      enabled: false,
      category: 'system'
    },
    {
      id: 'system_indexing',
      name: 'Indexing',
      description: 'Tối ưu Windows Search indexing',
      enabled: true,
      category: 'system'
    },
    {
      id: 'system_game_mode',
      name: 'Game Mode',
      description: 'Bật Game Mode để tối ưu cho game',
      enabled: true,
      category: 'system'
    },
    // Performance optimizations
    {
      id: 'performance_visual_effects',
      name: 'Hiệu ứng hình ảnh',
      description: 'Tối ưu hiệu ứng hình ảnh cho hiệu suất',
      enabled: false,
      category: 'performance'
    },
    {
      id: 'performance_power_plan',
      name: 'Power Plan',
      description: 'Chuyển sang power plan hiệu suất cao',
      enabled: false,
      category: 'performance'
    },
    {
      id: 'performance_gaming_mode',
      name: 'Chế độ Gaming',
      description: 'Tối ưu hệ thống cho game',
      enabled: false,
      category: 'performance'
    },
    // (Loại bỏ trùng lặp các option hệ thống)
    {
      id: 'system_network_optimization',
      name: 'Tối ưu mạng',
      description: 'Tối ưu cài đặt mạng cho hiệu suất cao',
      enabled: false,
      category: 'system'
    },
    {
      id: 'system_disk_optimization',
      name: 'Tối ưu ổ cứng',
      description: 'Tối ưu cài đặt ổ cứng và defrag',
      enabled: false,
      category: 'system'
    },
    // Appearance optimizations
    {
      id: 'appearance_dark_mode',
      name: 'Dark Mode',
      description: 'Bật Dark Mode cho Windows',
      enabled: false,
      category: 'appearance'
    },
    {
      id: 'appearance_transparency',
      name: 'Transparency',
      description: 'Bật hiệu ứng trong suốt',
      enabled: true,
      category: 'appearance'
    },
    {
      id: 'appearance_animations',
      name: 'Animations',
      description: 'Bật hiệu ứng animation',
      enabled: true,
      category: 'appearance'
    },
    {
      id: 'appearance_accent_color',
      name: 'Accent Color',
      description: 'Tùy chỉnh màu accent',
      enabled: false,
      category: 'appearance'
    },
    {
      id: 'appearance_custom_cursor',
      name: 'Custom Cursor',
      description: 'Sử dụng con trỏ tùy chỉnh',
      enabled: false,
      category: 'appearance'
    },
    {
      id: 'appearance_desktop_icons',
      name: 'Desktop Icons',
      description: 'Hiển thị icon trên desktop',
      enabled: true,
      category: 'appearance'
    },
    // Network optimizations
    {
      id: 'network_disable_widgets',
      name: 'Tắt Widgets',
      description: 'Tắt Windows 11 Widgets (bảng tin, thời tiết, tin tức) để giảm sử dụng mạng',
      enabled: false,
      category: 'network'
    },
    {
      id: 'network_disable_news',
      name: 'Tắt News and Interests',
      description: 'Tắt nguồn tin tức/feeds để giảm tiêu thụ mạng',
      enabled: false,
      category: 'network'
    },
    {
      id: 'network_disable_weather',
      name: 'Tắt Thời tiết',
      description: 'Ẩn/tắt module thời tiết trong Widgets/Taskbar',
      enabled: false,
      category: 'network'
    },
    {
      id: 'network_disable_background_apps',
      name: 'Tắt ứng dụng chạy nền',
      description: 'Tắt toàn bộ app nền UWP/Store để giảm sử dụng mạng',
      enabled: false,
      category: 'network'
    },
    {
      id: 'network_disable_telemetry',
      name: 'Tắt Telemetry',
      description: 'Giảm thu thập dữ liệu chẩn đoán và gửi về Microsoft',
      enabled: false,
      category: 'network'
    },
    {
      id: 'network_disable_feedback',
      name: 'Tắt Feedback',
      description: 'Tắt phản hồi tự động gửi về Microsoft',
      enabled: false,
      category: 'network'
    },
    {
      id: 'network_disable_diagtrack',
      name: 'Tắt DiagTrack',
      description: 'Tắt Connected User Experiences and Telemetry service',
      enabled: false,
      category: 'network'
    },
    {
      id: 'network_disable_dmwappushservice',
      name: 'Tắt dmwappushservice',
      description: 'Tắt dịch vụ push dữ liệu WAP',
      enabled: false,
      category: 'network'
    },
    {
      id: 'network_disable_rss_tasks',
      name: 'Tắt nhiệm vụ RSS',
      description: 'Vô hiệu hóa các Scheduled Tasks liên quan đến RSS/Feeds',
      enabled: false,
      category: 'network'
    }
  ]);


  useEffect(() => {
    const initializeData = async () => {
      setInitialLoading(true);
      try {
        console.log('🚀 Bắt đầu khởi tạo dữ liệu...');
        
        // Chỉ tải trạng thái tối ưu
        const results = await Promise.allSettled([
          loadOptimizationSettings()
        ]);
        
        // Log results
        results.forEach((result, index) => {
          const taskName = 'loadOptimizationSettings';
          if (result.status === 'rejected') {
            console.error(`❌ ${taskName} failed:`, result.reason);
          } else {
            console.log(`✅ ${taskName} completed successfully`);
          }
        });
        
        // Check if any critical operations failed
        const failedTasks = results.filter(result => result.status === 'rejected');
        if (failedTasks.length > 0) {
          console.warn(`⚠️ ${failedTasks.length} task(s) failed during initialization`);
          message.warning('Một số chức năng không thể khởi tạo. Vui lòng kiểm tra console để biết chi tiết.');
        } else {
          console.log('🎉 Tất cả tasks khởi tạo thành công!');
        }
        
      } catch (error) {
        console.error('❌ Lỗi nghiêm trọng khi khởi tạo dữ liệu:', error);
        message.error('Lỗi nghiêm trọng khi khởi tạo. Vui lòng tải lại trang.');
      } finally {
        setInitialLoading(false);
        console.log('🏁 Hoàn thành khởi tạo dữ liệu');
      }
    };
    
    initializeData();
  }, []);

  // Log optimization options changes for debugging
  useEffect(() => {
    const networkOptions = optimizationOptions.filter(opt => opt.category === 'network');
    console.log('Network options updated:', networkOptions.filter(opt => opt.enabled).length + '/' + networkOptions.length + ' enabled');
  }, [optimizationOptions]);

  const loadOptimizationSettings = async () => {
    try {
      setLoading(true);
      
      // Get current Windows settings using PowerShell
      console.log('🔄 Loading Windows settings...');
      const currentSettings = await window.electronAPI.getCurrentWindowsSettings();
      console.log('✅ Current Windows Settings loaded:', Object.keys(currentSettings).length, 'settings');
      
      // Validate currentSettings
      if (!currentSettings || typeof currentSettings !== 'object') {
        throw new Error('Invalid response from Windows settings API');
      }
      
      // Update all options with current enabled status from Windows settings
      setOptimizationOptions(prev => {
        const updated = prev.map(option => ({
          ...option,
          enabled: !!currentSettings[option.id]
        }));
        return updated;
      });
      
      console.log('✅ Optimization options updated with current settings');
      message.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('❌ Lỗi khi load cài đặt tối ưu:', error);
      // Vẫn hiển thị UI với default settings nếu có lỗi
      console.log('⚠️ Sử dụng cài đặt mặc định do lỗi PowerShell');
      message.warning('Không thể cập nhật trạng thái từ Windows. Sử dụng cài đặt mặc định.');
      // Don't throw error, let UI show with default settings
    } finally {
      setLoading(false);
    }
  };

  // Đã loại bỏ chức năng Di chuyển Zalo và Cài đặt ứng dụng khỏi trang này

  const handleOptimizationToggle = async (optionId: string, enabled: boolean) => {
    // Validate option exists
    const optionExists = optimizationOptions.some(opt => opt.id === optionId);
    if (!optionExists) {
      message.error('Tùy chọn không tồn tại');
      return;
    }

    try {
      const result = await window.electronAPI.applyOptimization(optionId, enabled);
      if (result && result.success) {
        // Nếu chọn kiểu menu Win10/Win11, đảm bảo loại trừ lẫn nhau ngay lập tức
        if (enabled && (optionId === 'contextmenu_win10_style' || optionId === 'contextmenu_win11_style')) {
          const oppositeId = optionId === 'contextmenu_win10_style' ? 'contextmenu_win11_style' : 'contextmenu_win10_style';
          try {
            await window.electronAPI.applyOptimization(oppositeId, false);
          } catch (e) {
            console.warn('Không thể tắt option đối nghịch:', oppositeId, e);
          }
          setOptimizationOptions(prev =>
            prev.map(option =>
              option.id === optionId
                ? { ...option, enabled: true }
                : option.id === oppositeId
                ? { ...option, enabled: false }
                : option
            )
          );
        } else {
          setOptimizationOptions(prev =>
            prev.map(option => (option.id === optionId ? { ...option, enabled } : option))
          );
        }
        message.success(`${enabled ? 'Bật' : 'Tắt'} tối ưu "${optimizationOptions.find(opt => opt.id === optionId)?.name}" thành công!`);
      } else {
        message.error(result?.message || 'Lỗi khi thay đổi cài đặt');
      }
    } catch (error) {
      console.error(`Lỗi khi thay đổi option ${optionId}:`, error);
      message.error('Không thể thay đổi cài đặt. Vui lòng thử lại.');
    }
  };

  const handleApplyAllOptimizations = async () => {
    const enabledOptions = optimizationOptions.filter(opt => opt.enabled);
    if (enabledOptions.length === 0) {
      message.warning('Không có tùy chọn nào được bật để áp dụng');
      return;
    }

    setLoading(true);
    try {
      const result = await window.electronAPI.applyAllOptimizations(enabledOptions);
      if (result && result.success) {
        message.success(`Áp dụng ${enabledOptions.length} tối ưu thành công!`);
      } else {
        message.error(result?.message || 'Lỗi khi áp dụng tối ưu');
      }
    } catch (error) {
      console.error('Lỗi khi áp dụng tất cả tối ưu:', error);
      message.error('Không thể áp dụng tối ưu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetOptimizations = async () => {
    Modal.confirm({
      title: 'Đặt lại cài đặt',
      content: 'Bạn có chắc muốn đặt lại tất cả cài đặt tối ưu về mặc định?',
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.resetOptimizations();
          if (result && result.success) {
            setOptimizationOptions(prev => 
              prev.map(option => ({ ...option, enabled: false }))
            );
            message.success('Đặt lại cài đặt thành công!');
          } else {
            message.error(result?.message || 'Lỗi khi đặt lại cài đặt');
          }
        } catch (error) {
          console.error('Lỗi khi đặt lại cài đặt:', error);
          message.error('Không thể đặt lại cài đặt. Vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleExportOptimizations = async () => {
    try {
      const data = {
        optimizations: optimizationOptions,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      const result = await window.electronAPI.exportOptimizationSettings(data);
      if (result && result.success) {
        message.success('Xuất cài đặt thành công!');
      } else {
        message.error(result?.message || 'Lỗi khi xuất cài đặt');
      }
    } catch (error) {
      console.error('Lỗi khi xuất cài đặt:', error);
      message.error('Không thể xuất cài đặt. Vui lòng thử lại.');
    }
  };

  const handleImportOptimizations = async () => {
    try {
      const result = await window.electronAPI.importOptimizationSettings();
      if (result && result.success) {
        await loadOptimizationSettings();
        message.success('Nhập cài đặt thành công!');
      } else {
        message.error(result?.message || 'Lỗi khi nhập cài đặt');
      }
    } catch (error) {
      console.error('Lỗi khi nhập cài đặt:', error);
      message.error('Không thể nhập cài đặt. Vui lòng thử lại.');
    }
  };

  const handleCreateSampleFile = async () => {
    try {
      const sampleData = {
        optimizations: optimizationOptions,
        sample: true,
        createdDate: new Date().toISOString(),
        description: 'File mẫu cài đặt tối ưu Windows'
      };
      const result = await window.electronAPI.exportOptimizationSettings(sampleData);
      if (result && result.success) {
        message.success('Tạo file mẫu thành công!');
      } else {
        message.error(result?.message || 'Lỗi khi tạo file mẫu');
      }
    } catch (error) {
      console.error('Lỗi khi tạo file mẫu:', error);
      message.error('Không thể tạo file mẫu. Vui lòng thử lại.');
    }
  };

  const handleQuickPreset = async (preset: string) => {
    setLoading(true);
    try {
      let optionsToEnable: string[] = [];
      
      switch (preset) {
        case 'performance':
          optionsToEnable = [
            'performance_visual_effects',
            'performance_power_plan',
            'performance_gaming_mode',
            'system_game_mode',
            'system_fast_startup',
            'system_services_optimization',
            'system_network_optimization',
            'system_disk_optimization'
          ];
          break;
        case 'appearance':
          optionsToEnable = [
            'appearance_dark_mode',
            'appearance_transparency',
            'appearance_animations',
            'appearance_accent_color',
            'appearance_custom_cursor',
            'appearance_desktop_icons'
          ];
          break;
        case 'win10_style':
          // Sửa: Chỉ sử dụng các option thực sự tồn tại
          optionsToEnable = [
            'taskbar_show_labels',
            'explorer_show_extensions',
            'contextmenu_win10_style'
          ];
          break;
        case 'win11_style':
          // Sửa: Chỉ sử dụng các option thực sự tồn tại
          optionsToEnable = [
            'taskbar_win11_style',
            'explorer_win11_ribbon',
            'contextmenu_win11_style'
          ];
          break;
        default:
          message.warning('Preset không hợp lệ');
          setLoading(false);
          return;
      }

      // Kiểm tra xem các option có tồn tại không
      const validOptions = optionsToEnable.filter(optionId => 
        optimizationOptions.some(opt => opt.id === optionId)
      );

      if (validOptions.length === 0) {
        message.warning('Không có tùy chọn hợp lệ nào trong preset này');
        setLoading(false);
        return;
      }

      // Apply all optimizations in the preset
      for (const optionId of validOptions) {
        try {
          await window.electronAPI.applyOptimization(optionId, true);
        } catch (error) {
          console.error(`Lỗi khi áp dụng option ${optionId}:`, error);
        }
      }

      // Update local state
      setOptimizationOptions(prev => 
        prev.map(option => ({
          ...option,
          enabled: validOptions.includes(option.id) || option.enabled
        }))
      );

      message.success(`Áp dụng preset ${preset} thành công! (${validOptions.length} tùy chọn)`);
    } catch (error) {
      console.error('Lỗi khi áp dụng preset:', error);
      message.error('Lỗi khi áp dụng preset');
    } finally {
      setLoading(false);
    }
  };

  // Helper removed (không còn dùng ở trang này)

  const renderOptimizationSection = (category: string, title: string, icon: React.ReactNode) => {
    const categoryOptions = optimizationOptions.filter(option => option.category === category);
    const enabledCount = categoryOptions.filter(opt => opt.enabled).length;
    
    return (
      <Card 
        title={
          <span style={{ color: gradientStyles.textColor }}>
            {icon} {title}
          </span>
        }
        style={customStyles.card}
        extra={
          <Tag 
            color={enabledCount > 0 ? 'green' : 'default'}
            style={{ 
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            {enabledCount}/{categoryOptions.length}
          </Tag>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {categoryOptions.map(option => (
            <div 
              key={option.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px',
                borderRadius: '6px',
                background: option.enabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                border: option.enabled ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {option.enabled ? (
                    <CheckCircleOutlined style={{ color: '#10b981', fontSize: '14px' }} />
                  ) : (
                    <ExclamationCircleOutlined style={{ color: '#f59e0b', fontSize: '14px' }} />
                  )}
                  <Text 
                    strong 
                    style={{ 
                      color: option.enabled ? gradientStyles.textColor : gradientStyles.textColorSecondary 
                    }}
                  >
                    {option.name}
                  </Text>
                </div>
                <Text 
                  style={{ 
                    color: gradientStyles.textColorSecondary, 
                    fontSize: '12px',
                    marginLeft: 22
                  }}
                >
                  {option.description}
                </Text>
              </div>
              <Switch
                checked={option.enabled}
                onChange={(checked) => handleOptimizationToggle(option.id, checked)}
                size="small"
                style={{
                  marginLeft: 8
                }}
              />
            </div>
          ))}
        </Space>
      </Card>
    );
  };

  // Render a section by explicit option ids (same UI as category sections)
  const renderOptimizationIdsSection = (
    optionIds: string[],
    title: string,
    icon: React.ReactNode
  ) => {
    const options = optimizationOptions.filter((o) => optionIds.includes(o.id));
    const enabledCount = options.filter((opt) => opt.enabled).length;
    
    // Debug info for section rendering (only in development)
    if (process.env.NODE_ENV === 'development' && optionIds.some(id => id.startsWith('network_'))) {
      console.log(`Network section "${title}": ${enabledCount}/${options.length} enabled`);
    }

    return (
      <Card
        title={
          <span style={{ color: gradientStyles.textColor }}>
            {icon} {title}
          </span>
        }
        style={customStyles.card}
        extra={
          <Tag
            color={enabledCount > 0 ? 'green' : 'default'}
            style={{ fontWeight: 'bold', fontSize: '12px' }}
          >
            {enabledCount}/{options.length}
          </Tag>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {options.length === 0 ? (
            <div style={{ 
              padding: '16px', 
              textAlign: 'center', 
              color: gradientStyles.textColorSecondary,
              fontStyle: 'italic'
            }}>
              Không có tùy chọn nào được tìm thấy cho section này
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: '6px',
                  background: option.enabled
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: option.enabled
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {option.enabled ? (
                      <CheckCircleOutlined style={{ color: '#10b981', fontSize: '14px' }} />
                    ) : (
                      <ExclamationCircleOutlined style={{ color: '#f59e0b', fontSize: '14px' }} />
                    )}
                    <Text
                      strong
                      style={{
                        color: option.enabled ? gradientStyles.textColor : gradientStyles.textColorSecondary
                      }}
                    >
                      {option.name}
                    </Text>
                  </div>
                  <Text
                    style={{
                      color: gradientStyles.textColorSecondary,
                      fontSize: '12px',
                      marginLeft: 22
                    }}
                  >
                    {option.description}
                  </Text>
                </div>
                <Switch
                  checked={option.enabled}
                  onChange={(checked) => handleOptimizationToggle(option.id, checked)}
                  size="small"
                  style={{
                    marginLeft: 8
                  }}
                />
              </div>
            ))
          )}
        </Space>
      </Card>
    );
  };

  // Show loading screen while initializing
  if (initialLoading) {
    return (
      <div style={{
        ...customStyles.mainContainer,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Title level={3} style={{ color: gradientStyles.textColor }}>
            Đang tải dữ liệu hệ thống...
          </Title>
          <Text style={{ color: gradientStyles.textColorSecondary }}>
            Vui lòng đợi trong giây lát
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div style={customStyles.mainContainer}>
      <Title level={2} style={{ 
        color: gradientStyles.textColor,
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>Tiện ích hệ thống</Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginTop: 16 }}
        items={[
          {
            key: 'tools',
            label: (
              <span style={{ color: gradientStyles.textColor }}>
                <ToolOutlined style={{ marginRight: 8 }} />
                Công cụ hệ thống
              </span>
            ),
            children: (
              <div>
                {/* Đã loại bỏ Di chuyển Zalo và Cài đặt ứng dụng khỏi trang này */}

                <Divider style={{ borderColor: gradientStyles.borderColor }} />

                <div style={{ marginBottom: 24 }}>
                  <Button 
                    type="primary" 
                    onClick={loadOptimizationSettings}
                    loading={loading}
                    icon={<ReloadOutlined />}
                    style={{ ...customStyles.button, marginTop: 12 }}
                  >
                    Cập nhật trạng thái
                  </Button>
                  
                  
                  <Alert
                    message="📊 Trạng thái hiện tại"
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong style={{ color: gradientStyles.textColor }}>
                            Tổng quan hệ thống:
                          </Text>
                        </div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          <Tag color="blue" style={{ margin: 0 }}>
                            <CheckCircleOutlined style={{ marginRight: 4 }} />
                            {optimizationOptions.filter(opt => opt.enabled).length} tùy chọn đã bật
                          </Tag>
                          <Tag color="orange" style={{ margin: 0 }}>
                            <ExclamationCircleOutlined style={{ marginRight: 4 }} />
                            {optimizationOptions.filter(opt => !opt.enabled).length} tùy chọn chưa bật
                          </Tag>
                        </div>
                        <div style={{ marginTop: 8, fontSize: '12px', color: gradientStyles.textColorSecondary }}>
                          💡 Nhấn "Cập nhật trạng thái" để kiểm tra cài đặt thực tế của Windows
                        </div>
                      </div>
                    }
                    type="success"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                </div>
                
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    {renderOptimizationSection('taskbar', 'Tối ưu Taskbar', <DesktopOutlined />)}
                  </Col>
                  <Col span={8}>
                    {renderOptimizationSection('explorer', 'Tối ưu Explorer', <FolderOutlined />)}
                  </Col>
                  <Col span={8}>
                  {renderOptimizationSection('appearance', 'Tùy chỉnh Giao diện', <EyeOutlined />)}
                  </Col>
                </Row>

                                 <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                   <Col span={8}>
                     {renderOptimizationSection('system', 'Tối ưu Hệ thống', <ControlOutlined />)}
                   </Col>
                   <Col span={8}>
                     {renderOptimizationSection('contextmenu', 'Tối ưu Menu chuột phải', <MenuOutlined />)}
                   </Col>
                  <Col span={8}>
                    {renderOptimizationSection('performance', 'Tối ưu Hiệu suất', <RocketOutlined />)}
                  </Col>
                </Row>

                {/* Network optimization split into sub-groups */}
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    {renderOptimizationIdsSection(
                      [
                        'network_disable_widgets',
                        'network_disable_news',
                        'network_disable_weather',
                      ],
                      'Mạng: Widgets / News / Thời tiết',
                      <DashboardOutlined />
                    )}
                  </Col>
                  <Col span={12}>
                    {renderOptimizationIdsSection(
                      ['network_disable_background_apps'],
                      'Mạng: Ứng dụng chạy nền',
                      <AppstoreOutlined />
                    )}
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    {renderOptimizationIdsSection(
                      ['network_disable_telemetry', 'network_disable_feedback'],
                      'Mạng: Telemetry / Feedback',
                      <InfoCircleOutlined />
                    )}
                  </Col>
                  <Col span={12}>
                    {renderOptimizationIdsSection(
                      [
                        'network_disable_diagtrack',
                        'network_disable_dmwappushservice',
                        'network_disable_rss_tasks',
                      ],
                      'Mạng: Dịch vụ & Scheduled Tasks',
                      <ControlOutlined />
                    )}
                  </Col>
                </Row>

                <Row style={{ marginTop: 16 }}>
                  <Col span={24}>
                    <Card style={customStyles.card}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text strong style={{ color: gradientStyles.textColor, fontSize: '16px' }}>
                            Preset nhanh:
                          </Text>
                          <Space style={{ marginTop: 8 }}>
                            <Button 
                              size="small"
                              onClick={() => handleQuickPreset('performance')}
                              icon={<RocketOutlined />}
                              style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: '1px solid rgba(59, 130, 246, 0.5)',
                                color: gradientStyles.textColor
                              }}
                            >
                              Hiệu suất
                            </Button>
                            <Button 
                              size="small"
                              onClick={() => handleQuickPreset('appearance')}
                              icon={<EyeOutlined />}
                              style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '1px solid rgba(16, 185, 129, 0.5)',
                                color: gradientStyles.textColor
                              }}
                            >
                              Giao diện
                            </Button>
                            <Button 
                              size="small"
                              onClick={() => handleQuickPreset('win10_style')}
                              icon={<DesktopOutlined />}
                              style={{
                                background: 'rgba(245, 158, 11, 0.2)',
                                border: '1px solid rgba(245, 158, 11, 0.5)',
                                color: gradientStyles.textColor
                              }}
                            >
                              Windows 10
                            </Button>
                            <Button 
                              size="small"
                              onClick={() => handleQuickPreset('win11_style')}
                              icon={<BulbOutlined />}
                              style={{
                                background: 'rgba(139, 92, 246, 0.2)',
                                border: '1px solid rgba(139, 92, 246, 0.5)',
                                color: gradientStyles.textColor
                              }}
                            >
                              Windows 11
                            </Button>
                          </Space>
                        </div>
                        
                        <Divider style={{ borderColor: gradientStyles.borderColor, margin: '12px 0' }} />
                        
                        <Space>
                          <Button 
                            type="primary" 
                            onClick={handleApplyAllOptimizations}
                            loading={loading}
                            icon={<ToolOutlined />}
                            style={customStyles.button}
                          >
                            Áp dụng tất cả tối ưu
                          </Button>
                          <Button 
                            onClick={handleResetOptimizations}
                            loading={loading}
                            icon={<SettingOutlined />}
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: `1px solid ${gradientStyles.borderColor}`,
                              color: gradientStyles.textColor,
                              borderRadius: '8px'
                            }}
                          >
                            Đặt lại cài đặt
                          </Button>
                          <Button 
                            onClick={handleExportOptimizations}
                            icon={<DownloadOutlined />}
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              border: '1px solid rgba(16, 185, 129, 0.5)',
                              color: gradientStyles.textColor,
                              borderRadius: '8px'
                            }}
                          >
                            Xuất cài đặt
                          </Button>
                          <Button 
                            onClick={handleImportOptimizations}
                            icon={<UploadOutlined />}
                            style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              border: '1px solid rgba(59, 130, 246, 0.5)',
                              color: gradientStyles.textColor,
                              borderRadius: '8px'
                            }}
                          >
                            Nhập cài đặt
                          </Button>
                          <Button 
                            onClick={handleCreateSampleFile}
                            icon={<FileTextOutlined />}
                            style={{
                              background: 'rgba(168, 85, 247, 0.2)',
                              border: '1px solid rgba(168, 85, 247, 0.5)',
                              color: gradientStyles.textColor,
                              borderRadius: '8px'
                            }}
                          >
                            Tạo file mẫu
                          </Button>
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>
            )
          },
          {
            key: 'zalo',
            label: (
              <span style={{ color: gradientStyles.textColor }}>
                <FolderOutlined style={{ marginRight: 8 }} />
                Zalo
              </span>
            ),
            children: <ZaloManager />
          }
        ]}
      />
    </div>
  );
};

export default ToolsManager;
