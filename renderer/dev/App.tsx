import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Button, Typography, Space, Modal, message, Spin, Descriptions, Table, Tag, Progress, Divider, Statistic } from 'antd';
import {
  DashboardOutlined,
  DesktopOutlined,
  WifiOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  ToolOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WindowsOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  ThunderboltFilled
} from '@ant-design/icons';
import SystemInfo from './components/SystemInfo';
import NetworkManager from './components/NetworkManager';
import BackupManager from './components/BackupManager';
import CleanupManager from './components/CleanupManager';
import WindowsOptimization from './components/WindowsOptimization';
import ToolsManager from './components/ToolsManager';
import QuickApps from './components/QuickApps';
 
import HardwareIcon from './components/HardwareIcon';

import { gradientStyles, customStyles } from './styles/theme';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface SystemData {
  system: any;
  cpu: any;
  memory: any;
  disk: any;
  gpu: any;
}

const App: React.FC = () => {

  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadSystemInfo();
    checkScreenSize();
    
    // Listen for window resize
    const handleResize = () => {
      checkScreenSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkScreenSize = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      setIsMobile(true);
      setCollapsed(true);
    } else {
      setIsMobile(false);
      // Keep collapsed by default on all screen sizes
      setCollapsed(true);
    }
  };

  const loadSystemInfo = async () => {

    setLoading(true);
    try {

      const systemInfo = await window.electronAPI.getSystemInfo();

      setSystemData(systemInfo);
    } catch (error) {
      console.error('❌ [RENDERER] Error loading system info:', error);
      message.error('Không thể tải thông tin hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'system',
      icon: <DesktopOutlined />,
      label: 'Thông tin hệ thống',
    },
    {
      key: 'network',
      icon: <WifiOutlined />,
      label: 'Quản lý mạng',
    },
    {
      key: 'backup',
      icon: <CloudUploadOutlined />,
      label: 'Sao lưu',
    },
    {
      key: 'cleanup',
      icon: <DeleteOutlined />,
      label: 'Dọn dẹp hệ thống',
    },
    {
      key: 'optimization',
      icon: <WindowsOutlined />,
      label: 'Tối ưu Windows',
    },
    {
      key: 'tools',
      icon: <ToolOutlined />,
      label: 'Công cụ hệ thống',
    },
    {
      key: 'quickapps',
      icon: <AppstoreOutlined />,
      label: 'Tải nhanh ứng dụng',
    },
    

  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard systemData={systemData} />;
      case 'system':
        return <SystemInfo systemData={systemData} onRefresh={loadSystemInfo} />;
      case 'network':
        return <NetworkManager />;
      case 'backup':
        return <BackupManager />;
      case 'cleanup':
        return <CleanupManager />;
      case 'optimization':
        return <WindowsOptimization />;
      case 'tools':
        return <ToolsManager />;
      case 'quickapps':
        return <QuickApps />;
      

      default:
        return <Dashboard systemData={systemData} />;
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        collapsedWidth={80}
        style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
      >
        <div style={{ padding: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            fontWeight: 700,
            fontSize: 18
          }}>
            <AppstoreOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
            {!collapsed && <span>System Manager</span>}
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          style={{ borderRight: 'none' }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{ fontSize: 16, width: 48, height: 48, background: 'transparent', border: 'none' }}
            />
            <span style={{ 
              fontSize: 18, 
              fontWeight: 700
            }}>
              {menuItems.find(item => item.key === selectedKey)?.label || 'Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              System Manager v1.0
            </span>
          </div>
        </Header>
        <Content style={{ margin: 0, overflow: 'auto', background: '#f5f7fb' }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              color: gradientStyles.textColor
            }}>
              <Spin size="large" />
            </div>
          ) : (
            renderContent()
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

const Dashboard: React.FC<{ systemData: SystemData | null }> = ({ systemData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string>('');

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    setLoadingAction(action);
    try {
      switch (action) {
        case 'system-check':
          await window.electronAPI.getSystemInfo();
          message.success('Kiểm tra hệ thống hoàn tất');
          break;
        case 'wifi-backup':
          await window.electronAPI.backupWifi();
          message.success('Sao lưu WiFi thành công');
          break;
        case 'driver-backup':
          const drives = await window.electronAPI.getAvailableDrives();
          const nonWindowsDrive = drives.find((d: any) => !d.isWindowsDrive);
          if (nonWindowsDrive) {
            await window.electronAPI.backupDrivers(nonWindowsDrive.drive);
            message.success('Sao lưu Driver thành công');
          } else {
            message.warning('Không tìm thấy ổ cứng phù hợp để sao lưu');
          }
          break;
        case 'system-cleanup':
          await window.electronAPI.cleanupSystem({
            tempFiles: true,
            recycleBin: true,
            windowsUpdate: true,
            browserCache: true,
            systemLogs: true,
            oldFiles: true,
            systemCache: true,
            applicationCache: true,
            dnsCache: true,
            networkCache: true,
            printSpoolerCache: true,
            errorReports: true,
            memoryDumps: true,
            duplicateFiles: true,
            oldDownloads: true,
            emptyFolders: true,
          });
          message.success('Dọn dẹp hệ thống thành công');
          break;
        case 'performance-optimize':
          await window.electronAPI.getSystemPerformance();
          message.success('Tối ưu hiệu suất thành công');
          break;
        case 'remove-default-apps':
          await window.electronAPI.getSystemInfo();
          message.success('Gỡ bỏ ứng dụng mặc định thành công');
          break;
        case 'disable-services':
          await window.electronAPI.getServicesInfo();
          message.success('Tắt dịch vụ không cần thiết thành công');
          break;
        case 'backup-user-folders':
          const availableDrives = await window.electronAPI.getAvailableDrives();
          const backupDrive = availableDrives.find((d: any) => !d.isWindowsDrive);
          if (backupDrive) {
            await window.electronAPI.backupUserFolders(['Desktop', 'Documents', 'Pictures'], backupDrive.drive);
            message.success('Sao lưu thư mục người dùng thành công');
          } else {
            message.warning('Không tìm thấy ổ cứng phù hợp để sao lưu');
          }
          break;
        default:
          message.info('Chức năng đang được phát triển');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi thực hiện thao tác');
      console.error('Quick action error:', error);
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  const quickActions = [
    { 
      title: 'Kiểm tra hệ thống', 
      icon: <InfoCircleOutlined />, 
      color: '#3b82f6',
      action: 'system-check',
      description: 'Kiểm tra thông tin hệ thống'
    },
    { 
      title: 'Sao lưu WiFi', 
      icon: <WifiOutlined />, 
      color: '#10b981',
      action: 'wifi-backup',
      description: 'Sao lưu cấu hình WiFi'
    },
    { 
      title: 'Sao lưu Driver', 
      icon: <CloudUploadOutlined />, 
      color: '#8b5cf6',
      action: 'driver-backup',
      description: 'Sao lưu drivers hệ thống'
    },
    { 
      title: 'Dọn dẹp hệ thống', 
      icon: <DeleteOutlined />, 
      color: '#f59e0b',
      action: 'system-cleanup',
      description: 'Xóa cache và file tạm'
    },
    { 
      title: 'Tối ưu hiệu suất', 
      icon: <ToolOutlined />, 
      color: '#ef4444',
      action: 'performance-optimize',
      description: 'Tối ưu hệ thống'
    },
    { 
      title: 'Gỡ ứng dụng mặc định', 
      icon: <AppstoreOutlined />, 
      color: '#8b5cf6',
      action: 'remove-default-apps',
      description: 'Gỡ bỏ ứng dụng không cần thiết'
    },
    { 
      title: 'Tắt dịch vụ', 
      icon: <SettingOutlined />, 
      color: '#f59e0b',
      action: 'disable-services',
      description: 'Tắt dịch vụ không cần thiết'
    },
    { 
      title: 'Sao lưu thư mục', 
      icon: <CloudUploadOutlined />, 
      color: '#10b981',
      action: 'backup-user-folders',
      description: 'Sao lưu thư mục người dùng'
    },
  ];

  // Tính toán usage percentages
  const memoryUsage = systemData?.memory ? 
    ((systemData.memory.used / systemData.memory.total) * 100).toFixed(1) : 0;
  
  const diskUsage = systemData?.disk && systemData.disk.length > 0 ? 
    ((systemData.disk[0].used / systemData.disk[0].size) * 100).toFixed(1) : 0;

  return (
    <div style={customStyles.mainContainer}>
      <Title level={2} style={{ 
        color: gradientStyles.textColor, 
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        marginBottom: '24px'
      }}>Dashboard</Title>
      
      {isLoading && (
        <Card style={{ ...customStyles.card, marginBottom: 16, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6' }}>
          <Space>
            <Spin size="small" />
            <Text style={{ color: '#3b82f6', fontWeight: '600' }}>
              Đang thực hiện: {quickActions.find(a => a.action === loadingAction)?.title || 'Thao tác'}
            </Text>
          </Space>
        </Card>
      )}
      
      <Row gutter={[16, 16]} style={{ display: 'flex', alignItems: 'stretch' }}>
        <Col span={6} style={{ display: 'flex' }}>
          <Card style={{ width: '100%', display: 'flex', flexDirection: 'column', ...customStyles.card }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', flex: 1 }}>
              <HardwareIcon type="cpu" size={20} color="#10b981" />
              <div style={{ marginLeft: '12px', flex: 1 }}>
                <Statistic
                  title={<span style={{ color: gradientStyles.textColorSecondary, fontWeight: '600' }}>CPU</span>}
                  value={systemData?.cpu?.brand || 'N/A'}
                  valueStyle={{ fontSize: '14px', color: '#10b981', fontWeight: '700' }}
                />
              </div>
            </div>
            <Text type="secondary" style={{ 
              marginTop: 'auto', 
              color: gradientStyles.textColorSecondary,
              fontWeight: '500'
            }}>
              {systemData?.cpu?.cores || 0} cores @ {systemData?.cpu?.speed || 0} GHz
            </Text>
          </Card>
        </Col>
        <Col span={6} style={{ display: 'flex' }}>
          <Card style={{ width: '100%', display: 'flex', flexDirection: 'column', ...customStyles.card }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', flex: 1 }}>
              <HardwareIcon type="ram" size={20} color="#ef4444" />
              <div style={{ marginLeft: '12px', flex: 1 }}>
                <Statistic
                  title={<span style={{ color: gradientStyles.textColorSecondary, fontWeight: '600' }}>Memory Usage</span>}
                  value={memoryUsage}
                  suffix="%"
                  valueStyle={{ color: '#ef4444', fontWeight: '700' }}
                />
              </div>
            </div>
            <Text type="secondary" style={{ 
              marginTop: 'auto', 
              color: gradientStyles.textColorSecondary,
              fontWeight: '500'
            }}>
              {systemData?.memory ? 
                `${(systemData.memory.used / 1024 / 1024 / 1024).toFixed(1)} / ${(systemData.memory.total / 1024 / 1024 / 1024).toFixed(1)} GB` 
                : 'N/A'
              }
            </Text>
          </Card>
        </Col>
        <Col span={6} style={{ display: 'flex' }}>
          <Card style={{ width: '100%', display: 'flex', flexDirection: 'column', ...customStyles.card }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', flex: 1 }}>
              <HardwareIcon type="ssd" size={20} color="#3b82f6" />
              <div style={{ marginLeft: '12px', flex: 1 }}>
                <Statistic
                  title={<span style={{ color: gradientStyles.textColorSecondary, fontWeight: '600' }}>Disk Usage</span>}
                  value={diskUsage}
                  suffix="%"
                  valueStyle={{ color: '#3b82f6', fontWeight: '700' }}
                />
              </div>
            </div>
            <Text type="secondary" style={{ 
              marginTop: 'auto', 
              color: gradientStyles.textColorSecondary,
              fontWeight: '500'
            }}>
              {systemData?.disk && systemData.disk.length > 0 ? 
                `${(systemData.disk[0].used / 1024 / 1024 / 1024).toFixed(1)} / ${(systemData.disk[0].size / 1024 / 1024 / 1024).toFixed(1)} GB` 
                : 'N/A'
              }
            </Text>
          </Card>
        </Col>
        <Col span={6} style={{ display: 'flex' }}>
          <Card style={{ width: '100%', display: 'flex', flexDirection: 'column', ...customStyles.card }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', flex: 1 }}>
              <HardwareIcon type="gpu" size={20} color="#10b981" />
              <div style={{ marginLeft: '12px', flex: 1 }}>
                <Statistic
                  title={<span style={{ color: gradientStyles.textColorSecondary, fontWeight: '600' }}>GPU</span>}
                  value={systemData?.gpu && systemData.gpu.length > 0 ? systemData.gpu[0].model : 'N/A'}
                  valueStyle={{ fontSize: '12px', color: '#10b981', fontWeight: '700' }}
                />
              </div>
            </div>
            <Text type="secondary" style={{ 
              marginTop: 'auto', 
              color: gradientStyles.textColorSecondary,
              fontWeight: '500'
            }}>
              {systemData?.gpu && systemData.gpu.length > 0 ? 
                `${systemData.gpu[0].vram} MB VRAM` : 'N/A'
              }
            </Text>
          </Card>
        </Col>
      </Row>

      <Divider style={{ borderColor: gradientStyles.borderColor, margin: '32px 0' }} />

      <Title level={3} style={{ 
        color: gradientStyles.textColor,
        fontWeight: '700',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        marginBottom: '24px'
      }}>Thông tin hệ thống</Title>
      <Row gutter={[16, 16]} style={{ display: 'flex', alignItems: 'stretch' }}>
        <Col span={12} style={{ display: 'flex' }}>
          <Card title={<span style={{ color: gradientStyles.textColor, fontWeight: '700' }}>System Info</span>} style={{ width: '100%', display: 'flex', flexDirection: 'column', ...customStyles.card }}>
            <div style={{ flex: 1 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary, fontWeight: '600' }}>Hostname</span>}>
                  <span style={{ color: gradientStyles.textColor, fontWeight: '500' }}>{systemData?.system?.hostname || 'N/A'}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary, fontWeight: '600' }}>Manufacturer</span>}>
                  <span style={{ color: gradientStyles.textColor, fontWeight: '500' }}>{systemData?.system?.manufacturer || 'N/A'}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary, fontWeight: '600' }}>Model</span>}>
                  <span style={{ color: gradientStyles.textColor, fontWeight: '500' }}>{systemData?.system?.model || 'N/A'}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary, fontWeight: '600' }}>OS</span>}>
                  <span style={{ color: gradientStyles.textColor, fontWeight: '500' }}>{systemData?.system?.os?.distro || 'N/A'}</span>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>
        <Col span={12} style={{ display: 'flex' }}>
          <Card title={<span style={{ color: gradientStyles.textColor, fontWeight: '700' }}>Memory Modules</span>} style={{ width: '100%', display: 'flex', flexDirection: 'column', ...customStyles.card }}>
            <div style={{ flex: 1 }}>
              {systemData?.memory?.modules && systemData.memory.modules.length > 0 ? (
                <div>
                  {systemData.memory.modules.map((module: any, index: number) => (
                    <div key={index} style={{ marginBottom: 8 }}>
                      <Text strong style={{ color: gradientStyles.textColor, fontWeight: '700' }}>Slot {index + 1}:</Text> <span style={{ color: gradientStyles.textColor, fontWeight: '500' }}>{module.manufacturer} {module.partNum}</span>
                      <br />
                      <Text type="secondary" style={{ color: gradientStyles.textColorSecondary, fontWeight: '500' }}>
                        {(module.size / 1024 / 1024 / 1024).toFixed(1)} GB @ {module.clockSpeed} MHz
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <Text type="secondary" style={{ color: gradientStyles.textColorSecondary, fontWeight: '500' }}>No memory modules found</Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Divider style={{ borderColor: gradientStyles.borderColor, margin: '32px 0' }} />

      <Title level={3} style={{ 
        color: gradientStyles.textColor,
        fontWeight: '700',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        marginBottom: '24px'
      }}>
        Thao tác nhanh
        <Text style={{ 
          color: gradientStyles.textColorSecondary, 
          fontSize: '14px', 
          fontWeight: '400',
          marginLeft: '12px'
        }}>
          - Click vào các thẻ để thực hiện thao tác nhanh
        </Text>
      </Title>
      <Row gutter={[16, 16]} style={{ display: 'flex', alignItems: 'stretch' }}>
        {quickActions.map((action, index) => (
          <Col span={6} key={index} style={{ display: 'flex' }}>
            <Card 
              hoverable 
              style={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                ...customStyles.card,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleQuickAction(action.action)}
              loading={isLoading && loadingAction === action.action}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <Space direction="vertical" align="center" style={{ width: '100%', flex: 1, justifyContent: 'center' }}>
                <div style={{ fontSize: '32px', color: action.color, marginBottom: '8px' }}>
                  {action.icon}
                </div>
                <Text strong style={{ color: gradientStyles.textColor, fontWeight: '700', fontSize: '14px', textAlign: 'center' }}>
                  {action.title}
                </Text>
                <Text style={{ 
                  color: gradientStyles.textColorSecondary, 
                  fontSize: '12px', 
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {action.description}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default App; 