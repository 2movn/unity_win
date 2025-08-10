import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Table, Modal, message, Progress, Alert, Tag, Descriptions, Divider, Tabs, Statistic, List, Tooltip, Select, Checkbox } from 'antd';
import { CloudUploadOutlined, CloudDownloadOutlined, ReloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, FolderOutlined, FileOutlined, ClockCircleOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined, HddOutlined, InfoCircleOutlined, RollbackOutlined, HistoryOutlined, SearchOutlined, WifiOutlined } from '@ant-design/icons';
import { gradientStyles, customStyles, tableStyles, modalStyles } from '../styles/theme';

const { Title, Text } = Typography;
const { Option } = Select;


interface BackupItem {
  name: string;
  path: string;
  size: string;
  status: 'pending' | 'backing' | 'completed' | 'failed';
  progress: number;
}

interface DriveInfo {
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

interface BackupResult {
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

interface BackupInfo {
  path: string;
  createdDate: Date;
  size: number;
  hasZalo: boolean;
  hasUserFolders: boolean;
  hasDrivers: boolean;
  hasBrowserProfiles: boolean;
}

const BackupManager: React.FC = () => {
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [backupItems, setBackupItems] = useState<BackupItem[]>([]);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [availableDrives, setAvailableDrives] = useState<DriveInfo[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string>('C:');
  const [selectedDriveInfo, setSelectedDriveInfo] = useState<DriveInfo | null>(null);
  const [backupResults, setBackupResults] = useState<BackupResult[]>([]);
  
  // Restore states
  const [isRestoring, setIsRestoring] = useState(false);
  const [latestBackupPath, setLatestBackupPath] = useState<string | null>(null);
  const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);
  const [restoreResults, setRestoreResults] = useState<any[]>([]);
  const [selectedBackupFile, setSelectedBackupFile] = useState<string | null>(null);
  const [wifiBackupFiles, setWifiBackupFiles] = useState<string[]>([]);
  const [backupLogs, setBackupLogs] = useState<string[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    loadAvailableDrives();
  }, []);

  useEffect(() => {
    if (selectedDrive) {
      findLatestBackup();
      findWifiBackupFiles();
    }
  }, [selectedDrive]);

  const loadAvailableDrives = async () => {
    try {
      const drives = await window.electronAPI.getAvailableDrives();
      setAvailableDrives(drives);
      
      if (drives.length > 0) {
        // Tìm ổ cứng đầu tiên không phải Windows
        const nonWindowsDrive = drives.find(d => !d.isWindowsDrive);
        const defaultDrive = nonWindowsDrive || drives[0];
        
        setSelectedDrive(defaultDrive.drive);
        setSelectedDriveInfo(defaultDrive);
      }
    } catch (error) {
      console.error('Error loading drives:', error);
      message.error('Không thể tải danh sách ổ cứng');
    }
  };

  const findLatestBackup = async () => {
    try {
      const latestBackup = await window.electronAPI.findLatestBackup(selectedDrive);
      setLatestBackupPath(latestBackup);
      
      if (latestBackup) {
        const info = await window.electronAPI.getBackupInfo(latestBackup);
        setBackupInfo(info);
      }
    } catch (error) {
      console.error('Error finding latest backup:', error);
    }
  };

  const findWifiBackupFiles = async () => {
    try {
      const wifiFiles = await window.electronAPI.findWifiBackupFiles(selectedDrive);
      setWifiBackupFiles(wifiFiles);
      if (wifiFiles.length > 0) {
        setSelectedBackupFile(wifiFiles[0]); // Chọn file đầu tiên làm mặc định
      }
    } catch (error) {
      console.error('Error finding WiFi backup files:', error);
    }
  };

  const handleDriveChange = (drive: string) => {
    setSelectedDrive(drive);
    const driveInfo = availableDrives.find(d => d.drive === drive);
    setSelectedDriveInfo(driveInfo || null);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('vi-VN');
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    const logEntry = `[${timestamp}] ${message}`;
    setBackupLogs(prev => [...prev, logEntry]);
    console.log(logEntry);
  };

  // Backup functions
  const handleBackupDrivers = async () => {
    try {
      setIsBackingUp(true);
      setBackupProgress(0);
      
      const result = await window.electronAPI.backupDrivers(selectedDrive);
      message.success(`Sao lưu drivers thành công: ${result.filesCount} files, ${formatBytes(result.size)}`);
      setBackupProgress(100);
      setBackupResults([...backupResults, result]);
    } catch (error) {
      message.error('Sao lưu drivers thất bại');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleBackupZalo = async () => {
    try {
      setIsBackingUp(true);
      setBackupProgress(0);
      
      const result = await window.electronAPI.backupZalo(selectedDrive);
      message.success(`Sao lưu Zalo thành công: ${result.filesCount} files, ${formatBytes(result.size)}`);
      setBackupProgress(100);
      setBackupResults([...backupResults, result]);
    } catch (error) {
      message.error('Sao lưu Zalo thất bại');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleBackupBrowserProfiles = async () => {
    try {
      setIsBackingUp(true);
      setBackupProgress(0);
      setBackupLogs([]);
      setShowLogModal(true);
      
      addLog('Bắt đầu sao lưu profile trình duyệt...');
      addLog(`Ổ cứng đích: ${selectedDrive}`);
      message.info('Đang sao lưu profile trình duyệt, vui lòng đợi...');
      
      const result = await window.electronAPI.backupBrowserProfiles(selectedDrive);
      
      addLog('Kết quả backup browser profiles:');
      addLog(`- Success: ${result.success}`);
      addLog(`- Files: ${result.filesCount}`);
      addLog(`- Size: ${formatBytes(result.size)}`);
      addLog(`- Message: ${result.message}`);
      
      if (result.success) {
        message.success(`Sao lưu profile trình duyệt thành công: ${result.filesCount} files, ${formatBytes(result.size)}`);
        addLog('✅ Backup thành công!');
      } else {
        message.warning(`Sao lưu một phần: ${result.message}`);
        addLog('⚠️ Backup một phần thành công');
      }
      
      setBackupProgress(100);
      setBackupResults([...backupResults, result]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ Lỗi: ${errorMessage}`);
      console.error('Lỗi backup browser profiles:', error);
      message.error(`Sao lưu profile trình duyệt thất bại: ${errorMessage}`);
    } finally {
      setIsBackingUp(false);
    }
  };


  const handleBackupUserFolders = async () => {
    if (selectedFolders.length === 0) {
      message.warning('Vui lòng chọn ít nhất một thư mục để sao lưu');
      return;
    }

    try {
      setIsBackingUp(true);
      setBackupProgress(0);
      
      const result = await window.electronAPI.backupUserFolders(selectedFolders, selectedDrive);
      message.success(`Sao lưu thư mục thành công: ${result.filesCount} files, ${formatBytes(result.size)}`);
      setBackupProgress(100);
      setBackupResults([...backupResults, result]);
    } catch (error) {
      message.error('Sao lưu thư mục thất bại');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleBackupWiFi = async () => {
    try {
      setIsBackingUp(true);
      setBackupProgress(0);
      
              const result = await window.electronAPI.backupWifi();
      message.success(`Sao lưu WiFi thành công: ${result.networksCount || 0} mạng, ${formatBytes(result.size || 0)}`);
      setBackupProgress(100);
      setBackupResults([...backupResults, result]);
    } catch (error) {
      message.error('Sao lưu WiFi thất bại');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleBackupCustomFolders = async () => {
    if (selectedFolders.length === 0) {
      message.warning('Vui lòng chọn ít nhất một thư mục để sao lưu');
      return;
    }

    try {
      const result = await window.electronAPI.backupCustomFolders(selectedFolders, selectedDrive);
      message.success(`Sao lưu tùy chọn thành công: ${result.filesCount} files, ${formatBytes(result.size)}`);
      setBackupResults([...backupResults, result]);
    } catch (error) {
      message.error('Sao lưu tùy chọn thất bại');
    }
  };

  const handleSelectDirectory = async () => {
    try {
      const result = await window.electronAPI.selectDirectory();
      if (result.canceled) {
        message.info('Đã hủy chọn thư mục');
      } else {
        // Kiểm tra xem thư mục đã được chọn chưa
        if (selectedFolders.includes(result.filePath)) {
          message.warning('Thư mục này đã được chọn');
        } else {
          setSelectedFolders([...selectedFolders, result.filePath]);
          message.success(`Đã chọn thư mục: ${result.filePath}`);
        }
      }
    } catch (error) {
      message.error('Không thể chọn thư mục');
    }
  };

  const handleFolderSelection = (folderPath: string, checked: boolean) => {
    if (checked) {
      setSelectedFolders([...selectedFolders, folderPath]);
    } else {
      setSelectedFolders(selectedFolders.filter(f => f !== folderPath));
    }
  };

  // Restore functions
  const handleRestoreZalo = async () => {
    if (!latestBackupPath) {
      message.warning('Không tìm thấy backup để khôi phục');
      return;
    }

    Modal.confirm({
      title: 'Khôi phục dữ liệu Zalo',
      content: `Bạn có chắc chắn muốn khôi phục dữ liệu Zalo từ backup?\n\nĐường dẫn backup: ${latestBackupPath}\n\n⚠️ Dữ liệu Zalo hiện tại sẽ được backup trước khi khôi phục.`,
      onOk: async () => {
        setIsRestoring(true);
        try {
          const result = await window.electronAPI.restoreZaloData(latestBackupPath);
          if (result.success) {
            message.success(result.message);
            setRestoreResults([...restoreResults, { type: 'Zalo', ...result }]);
          } else {
            message.error(result.message);
          }
        } catch (error) {
          message.error('Lỗi khi khôi phục Zalo');
        } finally {
          setIsRestoring(false);
        }
      }
    });
  };

  const handleRestoreUserFolders = async () => {
    if (!latestBackupPath) {
      message.warning('Không tìm thấy backup để khôi phục');
      return;
    }

    Modal.confirm({
      title: 'Khôi phục thư mục người dùng',
      content: `Bạn có chắc chắn muốn khôi phục các thư mục người dùng từ backup?\n\nĐường dẫn backup: ${latestBackupPath}\n\nCác thư mục sẽ được khôi phục:\n• Desktop\n• Documents\n• OneDrive\n• Pictures\n• Videos\n• Downloads\n\n⚠️ Các thư mục hiện tại sẽ được backup trước khi khôi phục.`,
      onOk: async () => {
        setIsRestoring(true);
        try {
          const result = await window.electronAPI.restoreUserFolders(latestBackupPath);
          if (result.success) {
            message.success(result.message);
            setRestoreResults([...restoreResults, { type: 'User Folders', ...result }]);
          } else {
            message.error(result.message);
          }
        } catch (error) {
          message.error('Lỗi khi khôi phục thư mục người dùng');
        } finally {
          setIsRestoring(false);
        }
      }
    });
  };

  const handleRestoreWiFi = async () => {
    if (!selectedBackupFile) {
      message.warning('Vui lòng chọn file backup WiFi để khôi phục');
      return;
    }

    Modal.confirm({
      title: 'Khôi phục cấu hình WiFi',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn khôi phục cấu hình WiFi từ file backup?</p>
          <p><strong>File backup:</strong> {selectedBackupFile}</p>
          <p style={{ color: '#faad14', fontSize: '12px' }}>
            ⚠️ Các mạng WiFi hiện tại sẽ được backup trước khi khôi phục
          </p>
          <p style={{ fontSize: '12px' }}>
            Các thông tin sẽ được khôi phục:
          </p>
          <ul style={{ fontSize: '12px', color: '#666' }}>
            <li>SSID (tên mạng WiFi)</li>
            <li>Mật khẩu WiFi</li>
            <li>Cấu hình bảo mật (WPA2, WPA3, etc.)</li>
            <li>Cài đặt kết nối</li>
          </ul>
        </div>
      ),
      onOk: async () => {
        setIsRestoring(true);
        try {
          const result = await window.electronAPI.restoreWifiConfig(selectedBackupFile);
          if (result.success) {
            message.success(result.message);
            setRestoreResults([...restoreResults, { type: 'WiFi Config', ...result }]);
          } else {
            message.error(result.message);
          }
        } catch (error) {
          message.error('Lỗi khi khôi phục cấu hình WiFi');
        } finally {
          setIsRestoring(false);
        }
      }
    });
  };

  const handleSelectWiFiFile = async () => {
    try {
      const result = await window.electronAPI.selectWiFiFile();
      if (result.canceled) {
        message.info('Đã hủy chọn file WiFi');
      } else {
        setSelectedBackupFile(result.filePath);
        message.success(`Đã chọn file WiFi: ${result.filePath.split('\\').pop()}`);
      }
    } catch (error) {
      message.error('Không thể chọn file WiFi');
    }
  };

  const defaultFolders = [
    { name: 'Desktop', path: 'Desktop', icon: <FolderOutlined /> },
    { name: 'Documents', path: 'Documents', icon: <FolderOutlined /> },
    { name: 'OneDrive', path: 'OneDrive', icon: <FolderOutlined /> },
    { name: 'Pictures', path: 'Pictures', icon: <FolderOutlined /> },
    { name: 'Videos', path: 'Videos', icon: <FolderOutlined /> },
    { name: 'Downloads', path: 'Downloads', icon: <FolderOutlined /> },
  ];

  return (
    <div style={customStyles.mainContainer}>
      <Title level={2} style={{ 
        color: gradientStyles.textColor,
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>Sao lưu và khôi phục</Title>

      {/* Drive Selection */}
      <Card 
        title={<span style={{ color: gradientStyles.textColor }}>Chọn ổ cứng backup</span>} 
        extra={<FolderOutlined style={{ color: gradientStyles.textColor }} />} 
        style={{ ...customStyles.card, marginBottom: 16 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong style={{ color: gradientStyles.textColor }}>Chọn ổ cứng:</Text>
              <Select
                value={selectedDrive}
                onChange={handleDriveChange}
                style={{ width: '100%' }}
                placeholder="Chọn ổ cứng"
              >
                {availableDrives.map(drive => {
                  const isDisabled = drive.isWindowsDrive;
                  const driveType = drive.isRemovable ? 'USB' : drive.isNetwork ? 'Network' : 'Local';
                  const status = drive.isWindowsDrive ? ' (Ổ Windows - Không thể chọn)' : '';
                  
                  return (
                    <Option 
                      key={drive.drive} 
                      value={drive.drive}
                      disabled={isDisabled}
                    >
                      {drive.drive} - {drive.label} ({formatBytes(drive.freeSpace)} free) - {driveType}{status}
                    </Option>
                  );
                })}
              </Select>
              <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                💡 Ổ đang cài đặt Windows sẽ bị disable để tránh xung đột
              </Text>
            </Space>
          </Col>
          <Col span={12}>
            {selectedDriveInfo && (
              <Descriptions 
                title={<span style={{ color: gradientStyles.textColor }}>Thông tin ổ cứng</span>} 
                column={1} 
                size="small"
              >
                <Descriptions.Item label="Ổ cứng">
                  {selectedDriveInfo.drive} - {selectedDriveInfo.label}
                  {selectedDriveInfo.isWindowsDrive && (
                    <Tag color="red" style={{ marginLeft: 8 }}>Ổ Windows</Tag>
                  )}
                  {selectedDriveInfo.isRemovable && (
                    <Tag color="blue" style={{ marginLeft: 8 }}>USB</Tag>
                  )}
                  {selectedDriveInfo.isNetwork && (
                    <Tag color="green" style={{ marginLeft: 8 }}>Network</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Dung lượng trống">
                  <Text style={{ color: '#52c41a' }}>{formatBytes(selectedDriveInfo.freeSpace)}</Text>
                  <Text style={{ color: gradientStyles.textColorSecondary, marginLeft: 8 }}>
                    ({((selectedDriveInfo.freeSpace / selectedDriveInfo.totalSpace) * 100).toFixed(1)}%)
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng dung lượng">
                  {formatBytes(selectedDriveInfo.totalSpace)}
                </Descriptions.Item>
                <Descriptions.Item label="Hệ thống file">
                  {selectedDriveInfo.fileSystem}
                </Descriptions.Item>
                {selectedDriveInfo.volumeSerialNumber && (
                  <Descriptions.Item label="Serial Number">
                    {selectedDriveInfo.volumeSerialNumber}
                  </Descriptions.Item>
                )}
              </Descriptions>
            )}
          </Col>
        </Row>
      </Card>

      {isBackingUp && (
        <Card style={{ ...customStyles.card, marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong style={{ color: gradientStyles.textColor }}>Đang sao lưu...</Text>
            <Progress percent={backupProgress} status="active" />
          </Space>
        </Card>
      )}

      <Tabs 
        defaultActiveKey="backup" 
        style={{
          marginTop: 16,
          '--ant-tabs-card-bg': 'rgba(255, 255, 255, 0.05)',
          '--ant-tabs-card-active-bg': gradientStyles.backgroundCard,
          '--ant-tabs-card-border-color': gradientStyles.borderColor,
          '--ant-tabs-card-border-radius': '8px',
          '--ant-tabs-card-margin': '0 0 8px 0'
        } as React.CSSProperties}
      >
        <Tabs.TabPane tab="Sao lưu" key="backup">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Sao lưu Drivers</span>} 
                extra={<FileOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sao lưu tất cả drivers hệ thống</Text>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sẽ tạo folder: backup_DD_MM_YYYY_HH_MM/01_Drivers</Text>
                  <Button 
                    type="primary" 
                    icon={<CloudUploadOutlined />}
                    onClick={handleBackupDrivers}
                    loading={isBackingUp}
                    style={customStyles.button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButtonHover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButton;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Sao lưu Drivers
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Sao lưu Zalo</span>} 
                extra={<FileOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sao lưu dữ liệu Zalo</Text>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sẽ tạo folder: backup_DD_MM_YYYY_HH_MM/02_Zalo_Data</Text>
                  <Button 
                    type="primary" 
                    icon={<CloudUploadOutlined />}
                    onClick={handleBackupZalo}
                    loading={isBackingUp}
                    style={customStyles.button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButtonHover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButton;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Sao lưu Zalo
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Sao lưu Profile Trình duyệt</span>} 
                extra={<FileOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sao lưu profile trình duyệt (Chrome, Edge, Firefox, Opera, Brave, Vivaldi)</Text>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sẽ tạo folder: backup_DD_MM_YYYY_HH_MM/02_Browser_Profiles</Text>
                  <Text style={{ color: '#faad14', fontSize: '12px' }}>
                    ⚠️ Tự động xóa cache và nén thành file ZIP
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<CloudUploadOutlined />}
                    onClick={handleBackupBrowserProfiles}
                    loading={isBackingUp}
                    style={customStyles.button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButtonHover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButton;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Sao lưu Profile Trình duyệt
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col span={24}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Sao lưu thư mục người dùng</span>} 
                extra={<FolderOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Chọn các thư mục cần sao lưu:</Text>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sẽ tạo folder: backup_DD_MM_YYYY_HH_MM/03_User_Folders</Text>
                  <Row gutter={[16, 16]}>
                    {defaultFolders.map(folder => (
                      <Col span={8} key={folder.path}>
                        <Checkbox
                          checked={selectedFolders.includes(folder.path)}
                          onChange={(e) => handleFolderSelection(folder.path, e.target.checked)}
                        >
                          <Space>
                            {folder.icon}
                            {folder.name}
                          </Space>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                  <Button 
                    type="primary" 
                    icon={<CloudUploadOutlined />}
                    onClick={handleBackupUserFolders}
                    loading={isBackingUp}
                    disabled={selectedFolders.length === 0}
                    style={customStyles.button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButtonHover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButton;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Sao lưu thư mục đã chọn
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Sao lưu WiFi</span>} 
                extra={<WifiOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sao lưu cấu hình WiFi và mật khẩu</Text>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sẽ tạo file: backup_DD_MM_YYYY_HH_MM/07_WiFi_Config.json</Text>
                  <Text style={{ color: '#faad14', fontSize: '12px' }}>
                    ⚠️ Bao gồm SSID, mật khẩu, cấu hình bảo mật
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<CloudUploadOutlined />}
                    onClick={handleBackupWiFi}
                    loading={isBackingUp}
                    style={customStyles.button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButtonHover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButton;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Sao lưu WiFi
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Sao lưu tùy chọn</span>} 
                extra={<FolderOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Chọn thư mục tùy ý để sao lưu</Text>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Sẽ tạo folder: D:\Backup\DD_MM_YYYY\05_Custom_Folders</Text>
                  
                  <Button 
                    icon={<DownloadOutlined />}
                    onClick={handleSelectDirectory}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: `1px solid ${gradientStyles.borderColor}`,
                      color: gradientStyles.textColor,
                      borderRadius: '8px'
                    }}
                  >
                    Chọn thư mục
                  </Button>

                  {selectedFolders.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <Text style={{ color: gradientStyles.textColor, fontSize: '12px' }}>Thư mục đã chọn:</Text>
                      <List
                        size="small"
                        dataSource={selectedFolders}
                        renderItem={(folder, index) => (
                          <List.Item
                            style={{ 
                              padding: '4px 8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '4px',
                              marginBottom: '4px'
                            }}
                          >
                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                              <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '11px' }}>
                                {folder}
                              </Text>
                              <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => setSelectedFolders(selectedFolders.filter((_, i) => i !== index))}
                                style={{ color: '#ff4d4f', padding: '0 4px' }}
                              >
                                Xóa
                              </Button>
                            </Space>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}

                  <Button 
                    type="primary" 
                    icon={<CloudUploadOutlined />}
                    onClick={handleBackupCustomFolders}
                    loading={isBackingUp}
                    disabled={selectedFolders.length === 0}
                    style={customStyles.button}
                    onMouseEnter={(e) => {
                      if (selectedFolders.length > 0) {
                        e.currentTarget.style.background = gradientStyles.backgroundButtonHover;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButton;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Sao lưu tùy chọn ({selectedFolders.length} thư mục)
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Kết quả sao lưu</span>} 
                extra={<CheckCircleOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                {backupResults.length > 0 ? (
                  <List
                    size="small"
                    dataSource={backupResults}
                    renderItem={(result, index) => (
                      <List.Item>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Space>
                            <CheckCircleOutlined style={{ color: 'green' }} />
                            <Text strong style={{ color: gradientStyles.textColor }}>Backup #{index + 1}</Text>
                            <Tag color="green">Thành công</Tag>
                          </Space>
                          <Text style={{ color: gradientStyles.textColorSecondary }}>{result.message}</Text>
                          <Text style={{ color: gradientStyles.textColorSecondary }}>
                            {result.filesCount} files, {formatBytes(result.size)}
                          </Text>
                          <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                            {result.backupPath}
                          </Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Chưa có kết quả sao lưu nào</Text>
                )}
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Khôi phục" key="restore">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Thông tin backup mới nhất</span>} 
                extra={<SearchOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                {backupInfo ? (
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="Đường dẫn">
                      <Text code style={{ color: gradientStyles.textColor }}>{backupInfo.path}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                      {formatDate(backupInfo.createdDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kích thước">
                      {formatBytes(backupInfo.size)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nội dung">
                      <Space direction="vertical" size="small">
                        {backupInfo.hasZalo && <Tag color="green">Zalo Data</Tag>}
                        {backupInfo.hasUserFolders && <Tag color="blue">User Folders</Tag>}
                        {backupInfo.hasDrivers && <Tag color="orange">Drivers</Tag>}
                        {backupInfo.hasBrowserProfiles && <Tag color="purple">Browser Profiles</Tag>}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Alert
                    message="Không tìm thấy backup"
                    description="Không có backup nào được tìm thấy trên ổ cứng đã chọn."
                    type="warning"
                    showIcon
                  />
                )}
              </Card>
            </Col>

            <Col span={12}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Khôi phục Zalo</span>} 
                extra={<RollbackOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Khôi phục dữ liệu Zalo từ backup</Text>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Dữ liệu Zalo hiện tại sẽ được backup trước khi khôi phục</Text>
                  <Text style={{ color: '#faad14', fontSize: '12px' }}>
                    ⚠️ Chỉ khôi phục khi Zalo đã được đóng hoàn toàn
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<RollbackOutlined />}
                    onClick={handleRestoreZalo}
                    loading={isRestoring}
                    disabled={!backupInfo?.hasZalo}
                    style={customStyles.button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButtonHover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButton;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Khôi phục Zalo
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Khôi phục thư mục người dùng</span>} 
                extra={<RollbackOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Khôi phục các thư mục người dùng từ backup</Text>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Desktop, Documents, OneDrive, Pictures, Videos, Downloads</Text>
                  <Text style={{ color: '#faad14', fontSize: '12px' }}>
                    ⚠️ Các thư mục hiện tại sẽ được backup trước khi khôi phục
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<RollbackOutlined />}
                    onClick={handleRestoreUserFolders}
                    loading={isRestoring}
                    disabled={!backupInfo?.hasUserFolders}
                    style={customStyles.button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButtonHover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = gradientStyles.backgroundButton;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Khôi phục thư mục người dùng
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Khôi phục cấu hình WiFi</span>} 
                extra={<WifiOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                                 <Space direction="vertical" style={{ width: '100%' }}>
                   <Text style={{ color: gradientStyles.textColorSecondary }}>Khôi phục cấu hình WiFi từ file JSON</Text>
                   <Text style={{ color: gradientStyles.textColorSecondary }}>SSID, mật khẩu, cấu hình bảo mật</Text>
                   
                   <Text style={{ color: gradientStyles.textColorSecondary }}>Chọn file WiFi:</Text>
                   
                   {/* File backup tự động */}
                   {wifiBackupFiles.length > 0 && (
                     <>
                       <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                         📁 File backup tự động:
                       </Text>
                       <Select
                         value={selectedBackupFile}
                         onChange={setSelectedBackupFile}
                         style={{ width: '100%' }}
                         placeholder="Chọn file backup WiFi"
                       >
                         {wifiBackupFiles.map((file, index) => (
                           <Option key={file} value={file}>
                             {file.split('\\').pop()} ({index + 1})
                           </Option>
                         ))}
                       </Select>
                     </>
                   )}
                   
                   {/* Chọn file tùy ý */}
                   <div style={{ textAlign: 'center', margin: '8px 0' }}>
                     <Text style={{ color: gradientStyles.textColorSecondary }}>hoặc</Text>
                   </div>
                   
                   <Button 
                     icon={<FileOutlined />}
                     onClick={handleSelectWiFiFile}
                     style={{
                       background: 'rgba(255, 255, 255, 0.1)',
                       border: `1px solid ${gradientStyles.borderColor}`,
                       color: gradientStyles.textColor,
                       borderRadius: '8px',
                       width: '100%'
                     }}
                   >
                     Chọn file JSON tùy ý
                   </Button>
                   
                   {selectedBackupFile && (
                     <>
                       <Text style={{ color: '#52c41a', fontSize: '12px' }}>
                         ✅ Đã chọn: {selectedBackupFile.split('\\').pop()}
                       </Text>
                       <Text style={{ color: '#faad14', fontSize: '12px' }}>
                         ⚠️ Các mạng WiFi hiện tại sẽ được backup trước khi khôi phục
                       </Text>
                       <Button 
                         type="primary" 
                         icon={<WifiOutlined />}
                         onClick={handleRestoreWiFi}
                         loading={isRestoring}
                         style={customStyles.button}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.background = gradientStyles.backgroundButtonHover;
                           e.currentTarget.style.transform = 'translateY(-2px)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.background = gradientStyles.backgroundButton;
                           e.currentTarget.style.transform = 'translateY(0)';
                         }}
                       >
                         Khôi phục WiFi
                       </Button>
                     </>
                   )}
                   
                   {!selectedBackupFile && wifiBackupFiles.length === 0 && (
                     <>
                       <Text style={{ color: gradientStyles.textColorSecondary }}>Không tìm thấy file backup WiFi</Text>
                       <Text style={{ color: '#faad14', fontSize: '12px' }}>
                         Hãy sao lưu WiFi trước hoặc chọn file JSON tùy ý
                       </Text>
                     </>
                   )}
                 </Space>
              </Card>
            </Col>

            <Col span={24}>
              <Card 
                title={<span style={{ color: gradientStyles.textColor }}>Kết quả khôi phục</span>} 
                extra={<HistoryOutlined style={{ color: gradientStyles.textColor }} />}
                style={customStyles.card}
              >
                {restoreResults.length > 0 ? (
                  <List
                    size="small"
                    dataSource={restoreResults}
                    renderItem={(result, index) => (
                      <List.Item>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Space>
                            <CheckCircleOutlined style={{ color: 'green' }} />
                            <Text strong style={{ color: gradientStyles.textColor }}>Restore #{index + 1}</Text>
                            <Tag color="green">{result.type}</Tag>
                          </Space>
                          <Text style={{ color: gradientStyles.textColorSecondary }}>{result.message}</Text>
                          {result.restoredFolders && (
                            <Text style={{ color: gradientStyles.textColorSecondary }}>
                              Thư mục đã khôi phục: {result.restoredFolders.join(', ')}
                            </Text>
                          )}
                        </Space>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Chưa có kết quả khôi phục nào</Text>
                )}
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>

      {/* Backup Structure Info */}
      <Card 
        title={<span style={{ color: gradientStyles.textColor }}>Cấu trúc folder backup</span>} 
        extra={<InfoCircleOutlined style={{ color: gradientStyles.textColor }} />} 
        style={{ ...customStyles.card, marginTop: 16 }}
      >
        <Alert
          message="Cấu trúc folder backup tự động"
          style={{ backgroundColor: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}
          description={
            <div>
              <Text style={{ color: 'blue' }}>Khi sao lưu, hệ thống sẽ tạo cấu trúc folder như sau:</Text>
              <ul>
                <li><Text code style={{ color: 'blue' }}>backup_DD_MM_YYYY_HH_MM/</Text> - Thư mục chính theo ngày giờ</li>
                <li><Text code style={{ color: 'blue' }}>01_Drivers/</Text> - Sao lưu drivers hệ thống</li>
                <li><Text code style={{ color: 'blue' }}>02_Zalo_Data/</Text> - Sao lưu dữ liệu Zalo</li>
                <li><Text code style={{ color: 'blue' }}>02_Browser_Profiles/</Text> - Sao lưu profile trình duyệt (đã xóa cache)</li>
                <li><Text code style={{ color: 'blue' }}>03_User_Folders/</Text> - Sao lưu thư mục người dùng</li>
                <li><Text code style={{ color: 'blue' }}>04_Custom_Folders/</Text> - Sao lưu thư mục tùy chọn</li>
                <li><Text code style={{ color: 'blue' }}>05_System_Info/</Text> - Thông tin hệ thống</li>
                <li><Text code style={{ color: 'blue' }}>06_Backup_Logs/</Text> - Log sao lưu</li>
                <li><Text code style={{ color: 'blue' }}>07_WiFi_Config.json</Text> - Cấu hình WiFi và mật khẩu</li>
              </ul>
              <Text style={{ color: '#faad14' }}>Lưu ý: Mỗi lần backup sẽ tạo folder mới để tránh ghi đè dữ liệu cũ.</Text>
            </div>
          }
          type="info"
          showIcon
        />
             </Card>
       
               {/* Log Modal */}
        <Modal
          title={
            <span style={{ color: gradientStyles.textColor }}>
              Log Sao lưu Profile Trình duyệt
            </span>
          }
          open={showLogModal}
          onCancel={() => setShowLogModal(false)}
          footer={[
            <Button 
              key="close" 
              onClick={() => setShowLogModal(false)}
              style={{
                background: gradientStyles.backgroundButton,
                border: `1px solid ${gradientStyles.borderColor}`,
                color: gradientStyles.textColor,
                borderRadius: '8px'
              }}
            >
              Đóng
            </Button>
          ]}
          width={800}
          style={{ 
            top: 20,
            '--ant-modal-bg': gradientStyles.backgroundCard,
            '--ant-modal-border-color': gradientStyles.borderColor,
            '--ant-modal-header-bg': gradientStyles.backgroundCard,
            '--ant-modal-footer-bg': gradientStyles.backgroundCard
          } as React.CSSProperties}
          bodyStyle={{
            backgroundColor: gradientStyles.backgroundCard,
            color: gradientStyles.textColor,
            borderTop: `1px solid ${gradientStyles.borderColor}`,
            borderBottom: `1px solid ${gradientStyles.borderColor}`
          }}
        >
          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            border: `1px solid ${gradientStyles.borderColor}`
          }}>
            {backupLogs.length > 0 ? (
              <List
                size="small"
                dataSource={backupLogs}
                renderItem={(log, index) => (
                  <List.Item
                    style={{
                      padding: '4px 8px',
                      marginBottom: '2px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <Text 
                      style={{ 
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: log.includes('❌') ? '#ff6b6b' : 
                               log.includes('⚠️') ? '#ffd93d' : 
                               log.includes('✅') ? '#6bcf7f' : 
                               log.includes('Bắt đầu') ? '#74b9ff' :
                               log.includes('Kết quả') ? '#a29bfe' :
                               log.includes('Ổ cứng') ? '#fd79a8' :
                               gradientStyles.textColorSecondary
                      }}
                    >
                      {log}
                    </Text>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px',
                color: gradientStyles.textColorSecondary 
              }}>
                <Text style={{ color: gradientStyles.textColorSecondary }}>
                  Chưa có log nào...
                </Text>
              </div>
            )}
          </div>
        </Modal>
     </div>
   );
 };

export default BackupManager; 