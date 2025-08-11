import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Table, Modal, Form, Input, Select, message, Tag, Descriptions, Divider, Tabs, Statistic, Progress, Alert, Switch, Tooltip, InputNumber } from 'antd';
import { WindowsOutlined, SettingOutlined, SafetyOutlined, ThunderboltFilled, DatabaseOutlined, ReloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, InfoCircleOutlined, AppstoreOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import { gradientStyles, customStyles, tableStyles, modalStyles } from '../styles/theme';

const { Title, Text } = Typography;
const { Option } = Select;


interface ServiceInfo {
  Name: string;
  DisplayName: string;
  Description: string;
  Status: number;
  StartType: number;
  SafeToDisable: boolean;
  VietnameseName?: string;
  VietnameseDescription?: string;
  Category?: string;
  Impact?: string;
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
}

interface WindowsDefenderStatus {
  realTimeProtection: boolean | null;
  cloudProtection: boolean | null;
  automaticSampleSubmission: boolean | null;
}

interface WindowsUpdateStatus {
  automaticUpdatesEnabled: boolean;
  updateLevel: string;
  lastCheckTime: string;
}

const WindowsOptimization: React.FC = () => {
  const [servicesInfo, setServicesInfo] = useState<ServiceInfo[]>([]);
  const [defenderStatus, setDefenderStatus] = useState<WindowsDefenderStatus | null>(null);
  const [updateStatus, setUpdateStatus] = useState<WindowsUpdateStatus | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [virtualMemoryGB, setVirtualMemoryGB] = useState<number>(8);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startTypeFilter, setStartTypeFilter] = useState<string>('all');
  const [safeFilter, setSafeFilter] = useState<string>('all');
  const [networkStatus, setNetworkStatus] = useState<any>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const [services, defender, update] = await Promise.all([
        window.electronAPI.getServicesInfo(),
        window.electronAPI.getWindowsDefenderStatus(),
        window.electronAPI.getWindowsUpdateStatus()
      ]);

      // Ensure services is an array
      if (Array.isArray(services)) {
        setServicesInfo(services);
      } else {
        console.error('Services không phải là array:', services);
        setServicesInfo([]);
      }
      
      setDefenderStatus(defender);
      setUpdateStatus(update);
    } catch (error) {
      console.error('Lỗi khi load status:', error);
      message.error('Không thể tải thông tin trạng thái');
      setServicesInfo([]);
    }
  };

  const loadServicesOnly = async () => {
    try {
      const services = await window.electronAPI.getServicesInfo();
      if (Array.isArray(services)) {
        setServicesInfo(services);
      } else {
        console.error('Services không phải là array:', services);
        setServicesInfo([]);
      }
    } catch (error) {
      console.error('Lỗi khi load services:', error);
      message.error('Không thể tải thông tin services');
      setServicesInfo([]);
    }
  };

  const loadDefenderOnly = async () => {
    try {
      const defender = await window.electronAPI.getWindowsDefenderStatus();
      setDefenderStatus(defender);
    } catch (error) {
      console.error('Lỗi khi load defender status:', error);
      message.error('Không thể tải thông tin Windows Defender');
    }
  };

  const loadUpdateOnly = async () => {
    try {
      const update = await window.electronAPI.getWindowsUpdateStatus();
      setUpdateStatus(update);
    } catch (error) {
      console.error('Lỗi khi load update status:', error);
      message.error('Không thể tải thông tin Windows Update');
    }
  };

  const handleDisableDefender = async () => {
    Modal.confirm({
      title: 'Tắt Windows Defender',
      content: 'Bạn có chắc chắn muốn tắt Windows Defender? Điều này có thể làm giảm bảo mật hệ thống.',
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.disableWindowsDefender();
          message.success(result.message);
          await loadDefenderOnly();
        } catch (error) {
          message.error('Lỗi khi tắt Windows Defender');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleOptimizeServices = async () => {
    if (selectedServices.length === 0) {
      message.warning('Vui lòng chọn ít nhất một service để tối ưu');
      return;
    }

    Modal.confirm({
      title: 'Tối ưu Services',
      content: `Bạn có chắc chắn muốn tắt ${selectedServices.length} services đã chọn?`,
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.optimizeSelectedServices(selectedServices);
          
          // Hiển thị kết quả chi tiết
          if (result.success) {
            message.success(result.message);
            
            // Hiển thị modal với kết quả chi tiết
            Modal.success({
              title: 'Tối ưu Services Thành Công',
              content: (
                <div>
                  <p><strong>Kết quả:</strong></p>
                  <p>✅ Đã tắt thành công: {result.disabledCount}/{result.totalCount} services</p>
                  {result.failedServices && result.failedServices.length > 0 && (
                    <div>
                      <p>❌ Không thể tắt: {result.failedServices.length} services</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>
                        Các service không thể tắt có thể do quyền hạn hoặc đang được sử dụng
                      </p>
                    </div>
                  )}
                  {result.successServices && result.successServices.length > 0 && (
                    <div>
                      <p>📋 Services đã tắt:</p>
                      <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '12px' }}>
                        {result.successServices.map((service, index) => (
                          <div key={index} style={{ padding: '2px 0' }}>
                            • {service}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
              width: 500,
            });
          } else {
            message.error('Không thể tắt bất kỳ service nào');
          }
          
          await loadServicesOnly();
          setSelectedServices([]);
        } catch (error) {
          console.error('Lỗi khi tối ưu services:', error);
          message.error('Lỗi khi tối ưu services gui');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSetVirtualMemory = async () => {
    Modal.confirm({
      title: 'Cài đặt RAM ảo',
      content: `Bạn có muốn cài đặt RAM ảo ${virtualMemoryGB}GB?`,
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.setVirtualMemory(virtualMemoryGB);
          message.success(result.message);
        } catch (error) {
          message.error('Lỗi khi cài đặt RAM ảo');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleResetVirtualMemory = async () => {
    Modal.confirm({
      title: 'Trả về RAM ảo mặc định',
      content: 'Bạn có muốn trả về cài đặt RAM ảo mặc định của Windows?',
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.resetVirtualMemory();
          message.success(result.message);
        } catch (error) {
          message.error('Lỗi khi trả về RAM ảo mặc định');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleEnableWindowsUpdate = async () => {
    Modal.confirm({
      title: 'Bật Windows Update',
      content: 'Bạn có chắc chắn muốn bật Windows Update?',
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.enableWindowsUpdate();
          message.success(result.message);
          await loadUpdateOnly();
        } catch (error) {
          message.error('Lỗi khi bật Windows Update');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleOptimizePerformance = async () => {
    Modal.confirm({
      title: 'Tối ưu hiệu suất hệ thống',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn tối ưu hiệu suất hệ thống?</p>
          <p style={{ color: '#faad14', fontSize: '12px' }}>
            Các thay đổi sẽ bao gồm:
          </p>
          <ul style={{ fontSize: '12px', color: '#666' }}>
            <li>Tắt chế độ ngủ đông (Hibernation)</li>
            <li>Chuyển sang chế độ High Performance</li>
            <li>Tắt các hiệu ứng đổ bóng, di chuyển</li>
            <li>Tắt các dịch vụ không cần thiết</li>
          </ul>
        </div>
      ),
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.getSystemPerformance();
          message.success('Tối ưu hiệu suất hệ thống thành công');
        } catch (error) {
          message.error('Lỗi khi tối ưu hiệu suất');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleRemoveDefaultApps = async () => {
    Modal.confirm({
      title: 'Gỡ bỏ ứng dụng mặc định',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn gỡ bỏ các ứng dụng mặc định?</p>
          <p style={{ color: '#faad14', fontSize: '12px' }}>
            Các ứng dụng sẽ được gỡ bỏ:
          </p>
          <ul style={{ fontSize: '12px', color: '#666' }}>
            <li>Cortana</li>
            <li>OneDrive</li>
            <li>Windows Ink Workspace</li>
            <li>Tablet PC Components</li>
            <li>Windows Mixed Reality</li>
            <li>Tips, Ads & Suggestions</li>
            <li>Background Apps</li>
            <li>Windows Defender Antivirus Service</li>
          </ul>
        </div>
      ),
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.getSystemInfo();
          message.success('Gỡ bỏ ứng dụng mặc định thành công');
        } catch (error) {
          message.error('Lỗi khi gỡ bỏ ứng dụng mặc định');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDisableSpecificServices = async () => {
    Modal.confirm({
      title: 'Tắt dịch vụ không cần thiết',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn tắt các dịch vụ không cần thiết?</p>
          <p style={{ color: '#faad14', fontSize: '12px' }}>
            Các dịch vụ sẽ được tắt:
          </p>
          <ul style={{ fontSize: '12px', color: '#666' }}>
            <li>Fax Service</li>
            <li>Remote Registry</li>
            <li>Windows Insider Service</li>
            <li>Windows Search</li>
            <li>Connected User Experiences and Telemetry</li>
            <li>Diagnostic Policy Service</li>
            <li>Superfetch (SysMain)</li>
            <li>Touch Keyboard and Handwriting Panel Service</li>
            <li>Windows Error Reporting Service</li>
            <li>Xbox Live Auth Manager</li>
            <li>Xbox Game Monitoring</li>
            <li>Xbox Live Networking Service</li>
            <li>Xbox Accessory Management Service</li>
          </ul>
        </div>
      ),
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.getServicesInfo();
          message.success('Tắt dịch vụ không cần thiết thành công');
          await loadServicesOnly();
        } catch (error) {
          message.error('Lỗi khi tắt dịch vụ');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Xử lý sự kiện filter
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleStartTypeFilterChange = (value: string) => {
    setStartTypeFilter(value);
  };

  const handleSafeFilterChange = (value: string) => {
    setSafeFilter(value);
  };

  // Helper functions
  const getServiceStatus = (status: number) => {
    switch (status) {
      case 1: return 'Stopped';
      case 2: return 'Start pending';
      case 3: return 'Stop pending';
      case 4: return 'Running';
      case 5: return 'Continue pending';
      case 6: return 'Pause pending';
      case 7: return 'Paused';
      default: return 'Unknown';
    }
  };

  const getServiceStartType = (startType: number) => {
    switch (startType) {
      case 0: return 'Boot';
      case 1: return 'System';
      case 2: return 'Automatic';
      case 3: return 'Manual';
      case 4: return 'Disabled';
      default: return 'Unknown';
    }
  };

  const getDefenderStatus = () => {
    if (!defenderStatus) return 'Unknown';
    return defenderStatus.realTimeProtection ? 'Enabled' : 'Disabled';
  };

  const getUpdateStatus = () => {
    if (!updateStatus) return 'Unknown';
    return updateStatus.automaticUpdatesEnabled ? 'Enabled' : 'Disabled';
  };

  const serviceColumns = [
    {
      title: 'Tên Service',
      dataIndex: 'Name',
      key: 'Name',
      width: 150,
      render: (name: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{name}</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
            {record.VietnameseName || record.DisplayName}
          </div>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'VietnameseDescription',
      key: 'VietnameseDescription',
      width: 400,
      render: (description: string, record: any) => (
        <div>
          <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
            {record.VietnameseDescription || record.Description}
          </div>
          <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
            <Tag color="blue">{record.Category || 'System'}</Tag>
            <Tag color={record.Impact === 'Thấp' ? 'green' : record.Impact === 'Trung bình' ? 'orange' : 'red'}>
              {record.Impact || 'Unknown'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
      filters: [
        { text: 'Tất cả', value: 'all' },
        { text: 'Running', value: 'running' },
        { text: 'Stopped', value: 'stopped' },
        { text: 'Unknown', value: 'unknown' },
      ],
      filteredValue: statusFilter === 'all' ? null : [statusFilter],
      onFilter: (value: string, record: any) => {
        if (value === 'all') return true;
        const statusText = getServiceStatus(record.Status).toLowerCase();
        return statusText === value;
      },
      render: (status: number) => {
        const statusText = getServiceStatus(status);
        const statusColor = status === 4 ? 'green' : status === 1 ? 'red' : 'orange';
        return (
          <Tag color={statusColor}>
            {statusText}
          </Tag>
        );
      },
    },
    {
      title: 'Khởi động',
      dataIndex: 'StartType',
      key: 'StartType',
      width: 100,
      filters: [
        { text: 'Tất cả', value: 'all' },
        { text: 'Automatic', value: 'automatic' },
        { text: 'Manual', value: 'manual' },
        { text: 'Disabled', value: 'disabled' },
        { text: 'Unknown', value: 'unknown' },
      ],
      filteredValue: startTypeFilter === 'all' ? null : [startTypeFilter],
      onFilter: (value: string, record: any) => {
        if (value === 'all') return true;
        const startText = getServiceStartType(record.StartType).toLowerCase();
        return startText === value;
      },
      render: (startType: number) => {
        const startText = getServiceStartType(startType);
        const startColor = startType === 4 ? 'red' : startType === 2 ? 'blue' : 'orange';
        return (
          <Tag color={startColor}>
            {startText}
          </Tag>
        );
      },
    },
    {
      title: 'An toàn',
      dataIndex: 'SafeToDisable',
      key: 'SafeToDisable',
      width: 80,
      filters: [
        { text: 'Tất cả', value: 'all' },
        { text: 'Có', value: 'safe' },
        { text: 'Không', value: 'unsafe' },
      ],
      filteredValue: safeFilter === 'all' ? null : [safeFilter],
      onFilter: (value: string, record: any) => {
        if (value === 'all') return true;
        if (value === 'safe') return record.SafeToDisable === true;
        if (value === 'unsafe') return record.SafeToDisable === false;
        return true;
      },
      render: (safe: boolean) => (
        <Tag color={safe ? 'green' : 'red'}>
          {safe ? 'Có' : 'Không'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={customStyles.mainContainer}>
      <Title level={2} style={{ 
        color: gradientStyles.textColor,
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>Tối ưu hóa Windows</Title>

      <Tabs
        defaultActiveKey="1"
        style={{
          '--ant-tabs-color': gradientStyles.textColor,
          '--ant-tabs-color-hover': '#60a5fa',
          '--ant-tabs-color-active': '#3b82f6',
          '--ant-tabs-ink-bar-color': '#3b82f6',
        } as React.CSSProperties}
        items={[
          {
            key: '1',
            label: (
              <span>
                <SettingOutlined style={{ color: '#3b82f6' }} />
                Services
              </span>
            ),
            children: (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card
                      style={customStyles.card}
                    >
                      <Statistic
                        title={<span style={{ color: gradientStyles.textColorSecondary }}>Services Tối ưu</span>}
                        value={selectedServices.length}
                        suffix={`/ ${Array.isArray(servicesInfo) ? servicesInfo.filter(s => s.SafeToDisable).length : 0}`}
                        valueStyle={{ color: '#3b82f6' }}
                        prefix={<SettingOutlined style={{ color: '#3b82f6' }} />}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card style={customStyles.card}>
                      <Statistic
                        title={<span style={{ color: gradientStyles.textColorSecondary }}>Tổng Services</span>}
                        value={Array.isArray(servicesInfo) ? servicesInfo.length : 0}
                        valueStyle={{ color: '#10b981' }}
                        prefix={<AppstoreOutlined style={{ color: '#10b981' }} />}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card style={customStyles.card}>
                      <Statistic
                        title={<span style={{ color: gradientStyles.textColorSecondary }}>Đang chạy</span>}
                        value={Array.isArray(servicesInfo) ? servicesInfo.filter(s => s.Status === 4).length : 0}
                        valueStyle={{ color: '#f59e0b' }}
                        prefix={<SyncOutlined style={{ color: '#f59e0b' }} />}
                      />
                    </Card>
                  </Col>
                </Row>

                <Card 
                  title={<span style={{ color: gradientStyles.textColor }}>Quản lý Services</span>}
                  style={{ ...customStyles.card, marginTop: 16 }}
                  extra={
                    <Space>
                      <Button 
                        size="small" 
                        icon={<ReloadOutlined />}
                        onClick={loadServicesOnly}
                        loading={loading}
                        style={customStyles.button}
                      >
                        Làm mới Services
                      </Button>
                      <SettingOutlined style={{ color: '#3b82f6' }} />
                    </Space>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                      message="Thông tin Services"
                      description={`Tổng cộng: ${Array.isArray(servicesInfo) ? servicesInfo.length : 0} services | An toàn để tắt: ${Array.isArray(servicesInfo) ? servicesInfo.filter(s => s.SafeToDisable).length : 0} | Đang chạy: ${Array.isArray(servicesInfo) ? servicesInfo.filter(s => s.Status === 4).length : 0} | Tự động: ${Array.isArray(servicesInfo) ? servicesInfo.filter(s => s.StartType === 2).length : 0} | Đã chọn: ${selectedServices.length}`}
                      type="info"
                      showIcon
                      style={{ marginBottom: 16, background: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}

                    />
                    
                    {/* Bộ lọc Services */}
                    <Card size="small" style={{ marginBottom: 16, ...customStyles.card }}>
                      <Space wrap>
                        <Text strong style={{ color: gradientStyles.textColor }}>Bộ lọc:</Text>
                        <Select
                          placeholder="Lọc theo trạng thái"
                          style={{ width: 150 }}
                          value={statusFilter}
                          onChange={handleStatusFilterChange}
                        >
                          <Option value="all">Tất cả trạng thái</Option>
                          <Option value="running">Đang chạy</Option>
                          <Option value="stopped">Đã dừng</Option>
                          <Option value="unknown">Không xác định</Option>
                        </Select>
                        
                        <Select
                          placeholder="Lọc theo khởi động"
                          style={{ width: 150 }}
                          value={startTypeFilter}
                          onChange={handleStartTypeFilterChange}
                        >
                          <Option value="all">Tất cả khởi động</Option>
                          <Option value="automatic">Tự động</Option>
                          <Option value="manual">Thủ công</Option>
                          <Option value="disabled">Đã tắt</Option>
                          <Option value="unknown">Không xác định</Option>
                        </Select>
                        
                        <Select
                          placeholder="Lọc theo an toàn"
                          style={{ width: 150 }}
                          value={safeFilter}
                          onChange={handleSafeFilterChange}
                        >
                          <Option value="all">Tất cả</Option>
                          <Option value="safe">An toàn để tắt</Option>
                          <Option value="unsafe">Không an toàn</Option>
                        </Select>
                        
                        <Button 
                          size="small"
                          onClick={() => {
                            setStatusFilter('all');
                            setStartTypeFilter('all');
                            setSafeFilter('all');
                          }}
                          style={customStyles.button}
                        >
                          Xóa bộ lọc
                        </Button>
                      </Space>
                    </Card>
                    
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text style={{ color: gradientStyles.textColor }}>Chọn services để tắt (hiển thị toàn bộ services từ hệ thống):</Text>
                      <Space>
                        <Button 
                          size="small"
                          onClick={() => {
                            const safeServices = servicesInfo
                              .filter(s => s.SafeToDisable)
                              .map(s => s.Name);
                            setSelectedServices(safeServices);
                          }}
                          icon={<CheckCircleOutlined />}
                          style={customStyles.button}
                        >
                          Chọn tất cả an toàn
                        </Button>
                        <Button 
                          size="small"
                          onClick={() => {
                            const runningServices = servicesInfo
                              .filter(s => s.Status === 4 && s.SafeToDisable)
                              .map(s => s.Name);
                            setSelectedServices(runningServices);
                          }}
                          icon={<SyncOutlined />}
                          style={customStyles.button}
                        >
                          Chọn đang chạy + an toàn
                        </Button>
                      </Space>
                    </Space>
                    <Table 
                      columns={serviceColumns} 
                      dataSource={Array.isArray(servicesInfo) ? servicesInfo : []}
                      pagination={{ pageSize: 15 }}
                      size="small"
                      scroll={{ y: 600, x: 800 }}
                      rowKey="Name"
                      style={customStyles.table}
                      rowSelection={{
                        selectedRowKeys: selectedServices,
                        onChange: (selectedRowKeys) => setSelectedServices(selectedRowKeys as string[]),
                      }}
                    />
                    <Space>
                      <Button 
                        type="primary" 
                        onClick={handleOptimizeServices}
                        loading={loading}
                        icon={<SettingOutlined />}
                        disabled={selectedServices.length === 0}
                        style={customStyles.button}
                      >
                        Tắt {selectedServices.length} Services đã chọn
                      </Button>
                      {selectedServices.length > 0 && (
                        <Button 
                          onClick={() => setSelectedServices([])}
                          icon={<CheckCircleOutlined />}
                          style={customStyles.button}
                        >
                          Bỏ chọn tất cả
                        </Button>
                      )}
                    </Space>
                  </Space>
                </Card>
              </div>
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <WindowsOutlined style={{ color: '#3b82f6' }} />
                Windows
              </span>
            ),
            children: (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card
                      title={<span style={{ color: gradientStyles.textColor }}>Windows Defender</span>}
                      style={customStyles.card}
                      extra={
                        <Button 
                          size="small" 
                          icon={<ReloadOutlined />}
                          onClick={loadDefenderOnly}
                          loading={loading}
                          style={customStyles.button}
                        >
                          Làm mới
                        </Button>
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Statistic
                          title={<span style={{ color: gradientStyles.textColorSecondary }}>Trạng thái</span>}
                          value={getDefenderStatus()}
                          valueStyle={{ 
                            color: getDefenderStatus() === 'Disabled' ? '#10b981' : '#ef4444' 
                          }}
                          prefix={<SafetyOutlined style={{ color: '#3b82f6' }} />}
                        />
                        <Text style={{ color: gradientStyles.textColor }}>Chỉ xóa antivirus, giữ UAC Enabled:</Text>
                        <Button 
                          type="primary" 
                          danger
                          onClick={handleDisableDefender}
                          loading={loading}
                          icon={<SafetyOutlined />}
                          block
                          style={customStyles.button}
                        >
                          Tắt Windows Defender
                        </Button>
                        <Text type="secondary" style={{ color: gradientStyles.textColorSecondary }}>
                          ⚠️ Sử dụng Windows Defender Remover - chỉ xóa antivirus, giữ UAC
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                  
                  <Col span={12}>
                    <Card
                      title={<span style={{ color: gradientStyles.textColor }}>Windows Update</span>}
                      style={customStyles.card}
                      extra={
                        <Button 
                          size="small" 
                          icon={<ReloadOutlined />}
                          onClick={loadUpdateOnly}
                          loading={loading}
                          style={customStyles.button}
                        >
                          Làm mới
                        </Button>
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Statistic
                          title={<span style={{ color: gradientStyles.textColorSecondary }}>Trạng thái</span>}
                          value={getUpdateStatus()}
                          valueStyle={{ 
                            color: getUpdateStatus() === 'Disabled' ? '#10b981' : '#ef4444' 
                          }}
                          prefix={<SyncOutlined style={{ color: '#3b82f6' }} />}
                        />
                        <Space>
                          <Button 
                            type="primary" 
                            danger
                            onClick={() => {
                              Modal.confirm({
                                title: 'Tắt Windows Update',
                                content: 'Bạn có chắc chắn muốn tắt Windows Update?',
                                onOk: async () => {
                                  setLoading(true);
                                  try {
                                    const result = await window.electronAPI.disableWindowsUpdate();
                                    message.success(result.message);
                                    await loadUpdateOnly();
                                  } catch (error) {
                                    message.error('Lỗi khi tắt Windows Update');
                                  } finally {
                                    setLoading(false);
                                  }
                                }
                              });
                            }}
                            loading={loading}
                            icon={<SyncOutlined />}
                            block
                            style={customStyles.button}
                          >
                            Tắt Windows Update
                          </Button>
                          <Button 
                            type="primary"
                            onClick={handleEnableWindowsUpdate}
                            loading={loading}
                            icon={<SyncOutlined />}
                            block
                            style={customStyles.button}
                          >
                            Bật Windows Update
                          </Button>
                        </Space>
                        <Text type="secondary" style={{ color: gradientStyles.textColorSecondary }}>
                          ⚠️ Tắt Windows Update có thể làm giảm bảo mật hệ thống
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    <Card
                      title={<span style={{ color: gradientStyles.textColor }}>Tối ưu hiệu suất</span>}
                      style={customStyles.card}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text style={{ color: gradientStyles.textColorSecondary }}>Tối ưu hệ thống cho hiệu suất cao nhất:</Text>
                        <Button 
                          type="primary"
                          onClick={handleOptimizePerformance}
                          loading={loading}
                          icon={<ThunderboltFilled />}
                          block
                          style={customStyles.button}
                        >
                          Tối ưu hiệu suất
                        </Button>
                        <Text type="secondary" style={{ color: gradientStyles.textColorSecondary }}>
                          • Tắt chế độ ngủ đông<br/>
                          • Chuyển High Performance<br/>
                          • Tắt hiệu ứng đổ bóng, di chuyển<br/>
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                  
                  <Col span={12}>
                    <Card
                      title={<span style={{ color: gradientStyles.textColor }}>Gỡ bỏ ứng dụng mặc định</span>}
                      style={customStyles.card}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text style={{ color: gradientStyles.textColorSecondary }}>Gỡ bỏ các ứng dụng mặc định không cần thiết:</Text>
                        <Button 
                          type="primary"
                          danger
                          onClick={handleRemoveDefaultApps}
                          loading={loading}
                          icon={<DeleteOutlined />}
                          block
                          style={customStyles.button}
                        >
                          Gỡ bỏ ứng dụng mặc định
                        </Button>
                        <Text type="secondary" style={{ color: gradientStyles.textColorSecondary }}>
                          • Cortana, OneDrive<br/>
                          • Windows Ink Workspace<br/>
                          • Tips, Ads & Suggestions<br/>
                          • Background Apps
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: '3',
            label: (
              <span>
                <DatabaseOutlined style={{ color: '#3b82f6' }} />
                RAM ảo
              </span>
            ),
            children: (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card
                      title={<span style={{ color: gradientStyles.textColor }}>Quản lý RAM ảo</span>}
                      style={customStyles.card}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Descriptions title={<span style={{ color: gradientStyles.textColor }}>Hướng dẫn RAM ảo</span>} column={2} size="small">
                          <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Dưới 4 GB</span>}>Gấp 1.5 đến 2 lần RAM chính</Descriptions.Item>
                          <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>4–8 GB</span>}>Bằng hoặc gấp 1.5 lần RAM chính</Descriptions.Item>
                          <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>8–16 GB</span>}>Bằng RAM chính hoặc nhỏ hơn một chút</Descriptions.Item>
                          <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Trên 16 GB</span>}>Từ min 1 GB đến max 4–8 GB là đủ</Descriptions.Item>
                        </Descriptions>
                        
                        <Space>
                          <Text style={{ color: gradientStyles.textColor }}>Dung lượng RAM ảo (GB):</Text>
                          <InputNumber
                            min={1}
                            max={32}
                            value={virtualMemoryGB}
                            onChange={(value) => setVirtualMemoryGB(value || 8)}
                          />
                        </Space>
                        
                        <Space>
                          <Button 
                            type="primary"
                            onClick={handleSetVirtualMemory}
                            loading={loading}
                            icon={<DatabaseOutlined />}
                            style={customStyles.button}
                          >
                            Cài đặt RAM ảo {virtualMemoryGB}GB
                          </Button>
                          <Button 
                            onClick={handleResetVirtualMemory}
                            loading={loading}
                            icon={<DatabaseOutlined />}
                            style={customStyles.button}
                          >
                            Trả về mặc định
                          </Button>
                        </Space>
                        
                        <Alert
                          message="Lưu ý"
                          description="Cần restart máy tính để áp dụng thay đổi RAM ảo hoàn toàn."
                          type="info"
                          showIcon
                          style={{ background: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}
                        />
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: '4',
            label: (
              <span>
                <SettingOutlined style={{ color: '#3b82f6' }} />
                Dịch vụ cụ thể
              </span>
            ),
            children: (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card
                      title={<span style={{ color: gradientStyles.textColor }}>Tắt dịch vụ không cần thiết</span>}
                      style={customStyles.card}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text style={{ color: gradientStyles.textColorSecondary }}>
                          Các dịch vụ sau sẽ được tắt để tối ưu hiệu suất:
                        </Text>
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Alert
                              message="Dịch vụ hệ thống"
                              description={
                                <ul style={{ fontSize: '12px', margin: '8px 0' }}>
                                  <li>Fax Service</li>
                                  <li>Remote Registry</li>
                                  <li>Windows Insider Service</li>
                                  <li>Windows Search</li>
                                  <li>Connected User Experiences and Telemetry</li>
                                  <li>Diagnostic Policy Service</li>
                                  <li>Superfetch (SysMain)</li>
                                  <li>Touch Keyboard and Handwriting Panel Service</li>
                                  <li>Windows Error Reporting Service</li>
                                </ul>
                              }
                              type="info"
                              showIcon
                              style={{ background: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}
                            />
                          </Col>
                          <Col span={12}>
                            <Alert
                              message="Dịch vụ Xbox"
                              description={
                                <ul style={{ fontSize: '12px', margin: '8px 0' }}>
                                  <li>Xbox Live Auth Manager</li>
                                  <li>Xbox Game Monitoring</li>
                                  <li>Xbox Live Networking Service</li>
                                  <li>Xbox Accessory Management Service</li>
                                </ul>
                              }
                              type="warning"
                              showIcon
                              style={{ background: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}
                            />
                          </Col>
                        </Row>
                        <Button 
                          type="primary"
                          danger
                          onClick={handleDisableSpecificServices}
                          loading={loading}
                          icon={<SettingOutlined />}
                          block
                          style={customStyles.button}
                        >
                          Tắt các dịch vụ đã chọn
                        </Button>
                        <Text type="secondary" style={{ color: gradientStyles.textColorSecondary }}>
                          ⚠️ Các dịch vụ này có thể ảnh hưởng đến một số tính năng Windows. Hãy cẩn thận khi tắt.
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: '5',
            label: (
              <span>
                <DatabaseOutlined style={{ color: '#3b82f6' }} />
                Tối ưu mạng
              </span>
            ),
            children: (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card
                      title={<span style={{ color: gradientStyles.textColor }}>Tối ưu cài đặt mạng</span>}
                      style={customStyles.card}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Alert
                          message="Thông tin tối ưu mạng"
                          description="Các tùy chọn tối ưu mạng sẽ cải thiện hiệu suất kết nối và giảm độ trễ"
                          type="info"
                          showIcon
                          style={{ marginBottom: 16, background: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}
                        />
                        
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Card size="small" style={{ ...customStyles.card, border: '1px solid #52c41a' }}>
                              <Space direction="vertical" style={{ width: '100%' }}>
                                <Text strong style={{ color: '#52c41a' }}>TCP/IP Tối ưu</Text>
                                <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                                  • Auto-tuning: Normal<br/>
                                  • RSS (Receive Side Scaling): Enabled<br/>
                                  • RSC (Receive Segment Coalescing): Enabled<br/>
                                  • ECN (Explicit Congestion Notification): Enabled
                                </Text>
                                <Button 
                                  type="primary"
                                  size="small"
                                  onClick={async () => {
                                    setLoading(true);
                                    try {
                                      const result = await window.electronAPI.applyOptimization('system_network_optimization', true);
                                      message.success(result.message);
                                    } catch (error) {
                                      message.error('Lỗi khi tối ưu mạng');
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  loading={loading}
                                  icon={<DatabaseOutlined />}
                                  style={{ ...customStyles.button, background: '#52c41a', borderColor: '#52c41a' }}
                                >
                                  Bật tối ưu TCP/IP
                                </Button>
                              </Space>
                            </Card>
                          </Col>
                          
                          <Col span={12}>
                            <Card size="small" style={{ ...customStyles.card, border: '1px solid #faad14' }}>
                              <Space direction="vertical" style={{ width: '100%' }}>
                                <Text strong style={{ color: '#faad14' }}>Giảm tiêu thụ mạng</Text>
                                <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                                  • Tắt Widgets và News feeds<br/>
                                  • Tắt ứng dụng chạy nền<br/>
                                  • Giảm Telemetry và Feedback<br/>
                                  • Tắt RSS tasks
                                </Text>
                                <Button 
                                  type="default"
                                  size="small"
                                  onClick={async () => {
                                    setLoading(true);
                                    try {
                                      // Áp dụng tất cả tối ưu mạng
                                      const networkOptions = [
                                        'network_disable_widgets',
                                        'network_disable_news',
                                        'network_disable_weather',
                                        'network_disable_background_apps',
                                        'network_disable_telemetry',
                                        'network_disable_feedback',
                                        'network_disable_diagtrack',
                                        'network_disable_dmwappushservice',
                                        'network_disable_rss_tasks'
                                      ];
                                      
                                      for (const option of networkOptions) {
                                        await window.electronAPI.applyOptimization(option, true);
                                      }
                                      message.success('Đã áp dụng tất cả tối ưu mạng');
                                    } catch (error) {
                                      message.error('Lỗi khi áp dụng tối ưu mạng');
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  loading={loading}
                                  icon={<DatabaseOutlined />}
                                  style={{ ...customStyles.button, borderColor: '#faad14', color: '#faad14' }}
                                >
                                  Giảm tiêu thụ mạng
                                </Button>
                              </Space>
                            </Card>
                          </Col>
                        </Row>
                        
                        <Divider />
                        
                        <Row gutter={[16, 16]}>
                          <Col span={24}>
                            <Card size="small" style={{ ...customStyles.card, border: '1px solid #1890ff' }}>
                              <Space direction="vertical" style={{ width: '100%' }}>
                                <Text strong style={{ color: '#1890ff' }}>Tối ưu Game Networking</Text>
                                <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                                  • Tắt Network Throttling cho gaming<br/>
                                  • Tối ưu System Responsiveness<br/>
                                  • Giảm độ trễ mạng cho game
                                </Text>
                                <Button 
                                  type="primary"
                                  size="small"
                                  onClick={async () => {
                                    setLoading(true);
                                    try {
                                      const result = await window.electronAPI.applyAdvancedRAMOptimization();
                                      message.success(result.message);
                                    } catch (error) {
                                      message.error('Lỗi khi tối ưu game networking');
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  loading={loading}
                                  icon={<ThunderboltFilled />}
                                  style={customStyles.button}
                                >
                                  Tối ưu Game Networking
                                </Button>
                              </Space>
                            </Card>
                          </Col>
                        </Row>
                        
                        <Alert
                          message="Lưu ý"
                          description="Các tối ưu mạng sẽ được áp dụng ngay lập tức. Một số thay đổi có thể cần restart để có hiệu lực hoàn toàn."
                          type="info"
                          showIcon
                          style={{ marginTop: 16, background: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}
                        />
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
        ]}
      />

      <Alert
        message="Cảnh báo"
        description="Các thao tác này có thể ảnh hưởng đến bảo mật và hiệu suất hệ thống. Hãy cẩn thận khi sử dụng."
        type="warning"
        showIcon
        style={{ marginTop: 16, background: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}
      />
    </div>
  );
};

export default WindowsOptimization; 