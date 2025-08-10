import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Table, Modal, Form, Input, Select, message, Tag, Descriptions, Divider, Tabs, Statistic, Progress, Alert, Switch, Tooltip } from 'antd';
import { WifiOutlined, SettingOutlined, CloudUploadOutlined, ReloadOutlined, CheckCircleOutlined, GlobalOutlined, ThunderboltOutlined, EnvironmentOutlined, ClockCircleOutlined, HomeOutlined, RocketOutlined, SafetyOutlined, ThunderboltFilled, DatabaseOutlined } from '@ant-design/icons';
import { gradientStyles, customStyles, tableStyles, modalStyles } from '../styles/theme';
import SpeedTestManager from './SpeedTestManager';

const { Title, Text } = Typography;
const { Option } = Select;


interface NetworkInterface {
  name: string;
  description: string;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns: string;
  status: string;
  type: string;
  macAddress?: string;
  speed?: string;
  duplex?: string;
  mtu?: number;
  dhcpEnabled?: boolean;
  dnsServers?: string[];
  ipv6Address?: string;
  defaultGateway?: string;
  broadcastAddress?: string;
  networkAddress?: string;
  interfaceType?: string;
  physicalAddress?: string;
  adapterName?: string;
  mediaType?: string;
  physicalMediaType?: string;
  adminStatus?: string;
  linkSpeed?: string;
  interfaceIndex?: number;
  interfaceGuid?: string;
  interfaceDescription?: string;
  macAddressFormatted?: string;
  ipAddressFormatted?: string;
  gatewayFormatted?: string;
  dnsFormatted?: string;
}

interface NetworkConfig {
  interface: string;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns: string;
  dns2?: string;
  type: 'dhcp' | 'static';
  mtu?: number;
}

interface NetworkConnectionInfo {
  isConnected: boolean;
  publicIP?: string;
  publicIPv6?: string;
  localIP?: string;
  status?: string;
  message?: string;
  continent?: string;
  continentCode?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  district?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  timezoneOffset?: number;
  currency?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  reverse?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
  query?: string;
  responseTime?: number;
  error?: string;
}

interface DnsConfig {
  primary: string;
  secondary?: string;
  ipv6?: {
    primary: string;
    secondary?: string;
  };
}

interface ProxyConfig {
  enabled: boolean;
  server: string;
  port: number;
  username?: string;
  password?: string;
  bypass?: string[];
}

interface NetworkOptimization {
  disableIPv6: boolean;
  optimizeTCP: boolean;
  increaseBufferSize: boolean;
  disableNagle: boolean;
  optimizeDNS: boolean;
}

interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
}

const NetworkManager: React.FC = () => {
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState<NetworkInterface | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<NetworkConnectionInfo | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [form] = Form.useForm();
  const [dnsModalVisible, setDnsModalVisible] = useState(false);
  const [proxyModalVisible, setProxyModalVisible] = useState(false);
  const [optimizationModalVisible, setOptimizationModalVisible] = useState(false);
  const [selectedInterfaceForDNS, setSelectedInterfaceForDNS] = useState<string>('');
  const [currentDNS, setCurrentDNS] = useState<DnsConfig | null>(null);
  const [ipv6Status, setIpv6Status] = useState<boolean>(true);
  const [ipv6Toggling, setIpv6Toggling] = useState<boolean>(false);
  const [selectedInterfaceForIPv6, setSelectedInterfaceForIPv6] = useState<string>('');
  const [proxyStatus, setProxyStatus] = useState<{ enabled: boolean; server?: string }>({ enabled: false });
  const [speedTestResult, setSpeedTestResult] = useState<SpeedTestResult | null>(null);
  const [testingSpeed, setTestingSpeed] = useState(false);
  const [dnsForm] = Form.useForm();
  const [proxyForm] = Form.useForm();
  const [optimizationForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadNetworkInterfaces();
    loadIPv6Status();
    loadProxyStatus();
  }, []);

  const loadNetworkInterfaces = async () => {
    setLoading(true);
    try {
      const networkData = await window.electronAPI.getNetworkInterfaces();
      console.log('Network data:', networkData);
      
      // Map dữ liệu từ PowerShell sang interface
      const mappedData = networkData.map((iface: any) => ({
        name: iface.name || iface.Name,
        description: iface.description || iface.Description,
        ipAddress: iface.ipAddress || iface.IPAddress,
        subnetMask: iface.subnetMask || iface.SubnetMask,
        gateway: iface.gateway || iface.Gateway,
        dns: iface.dns || iface.PrimaryDNS,
        status: iface.status || iface.Status,
        type: iface.type || iface.InterfaceType,
        macAddress: iface.macAddress || iface.MacAddress,
        speed: iface.speed || iface.LinkSpeed,
        duplex: iface.duplex || iface.Duplex,
        mtu: iface.mtu || iface.MTU,
        dhcpEnabled: iface.dhcpEnabled || iface.DHCPEnabled,
        dnsServers: iface.dnsServers || (iface.DNSServers ? iface.DNSServers.split(',') : []),
        ipv6Address: iface.ipv6Address || iface.IPv6Address,
        adapterName: iface.adapterName || iface.InterfaceDescription,
        mediaType: iface.mediaType || iface.MediaType,
        physicalMediaType: iface.physicalMediaType || iface.PhysicalMediaType,
        adminStatus: iface.adminStatus || iface.AdminStatus,
        linkSpeed: iface.linkSpeed || iface.LinkSpeed,
        interfaceIndex: iface.interfaceIndex || iface.InterfaceIndex,
        interfaceGuid: iface.interfaceGuid || iface.InterfaceGuid,
        interfaceDescription: iface.interfaceDescription || iface.InterfaceDescription,
        // Format các trường để hiển thị
        macAddressFormatted: iface.macAddress || iface.MacAddress,
        ipAddressFormatted: iface.ipAddress || iface.IPAddress,
        gatewayFormatted: iface.gateway || iface.Gateway,
        dnsFormatted: iface.dns || iface.PrimaryDNS
      }));
      
      // Debug: kiểm tra thông tin DNS
      mappedData.forEach((iface: NetworkInterface) => {
        console.log(`Interface ${iface.name}:`, {
          dns: iface.dns,
          dnsServers: iface.dnsServers,
          adapterName: iface.adapterName,
          gateway: iface.gateway,
          ipAddress: iface.ipAddress,
          mediaType: iface.mediaType,
          physicalMediaType: iface.physicalMediaType,
          adminStatus: iface.adminStatus,
          linkSpeed: iface.linkSpeed,
          interfaceIndex: iface.interfaceIndex,
          interfaceGuid: iface.interfaceGuid
        });
      });
      
      setInterfaces(mappedData);

      // Auto-select first interface for IPv6 section if none selected
      if (!selectedInterfaceForIPv6 && mappedData.length > 0) {
        const first = mappedData[0];
        setSelectedInterfaceForIPv6(first.name);
        try {
          const st = await window.electronAPI.getIPv6Status(first.name);
          setIpv6Status(st);
        } catch {}
      }
    } catch (error) {
      console.error('Error loading network interfaces:', error);
      message.error('Không thể tải thông tin mạng');
    } finally {
      setLoading(false);
    }
  };

  const loadIPv6Status = async () => {
    try {
      const status = await window.electronAPI.getIPv6Status(selectedInterfaceForIPv6 || undefined);
      setIpv6Status(status);
    } catch (error) {
      console.error('Error loading IPv6 status:', error);
    }
  };

  const loadProxyStatus = async () => {
    try {
      const status = await window.electronAPI.getProxyStatus();
      setProxyStatus(status);
    } catch (error) {
      console.error('Error loading proxy status:', error);
    }
  };

  const handleConfigureNetwork = async (values: NetworkConfig) => {
    try {
      console.log('Configuring network with values:', values);
      await window.electronAPI.configureNetwork(values);
      message.success('Cấu hình mạng thành công');
      setConfigModalVisible(false);
      form.resetFields();
      loadNetworkInterfaces();
    } catch (error) {
      console.error('Error configuring network:', error);
      message.error('Cấu hình mạng thất bại');
    }
  };

  const handleBackupWifi = async () => {
    try {
      const result = await window.electronAPI.backupWifi();
      message.success(`Sao lưu WiFi thành công: ${result.profilesCount} profiles`);
    } catch (error) {
      message.error('Sao lưu WiFi thất bại');
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const result = await window.electronAPI.testNetworkConnection();
      console.log('Connection test result:', result);
      setConnectionInfo(result);
      
      if (result.isConnected) {
        message.success('Kết nối mạng ổn định');
      } else {
        message.error(`Kết nối mạng có vấn đề: ${result.error}`);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      message.error('Không thể kiểm tra kết nối mạng');
      setConnectionInfo({
        isConnected: false,
        error: 'Không thể kết nối đến server'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleFlushDNS = async () => {
    try {
      await window.electronAPI.flushDns();
      message.success('Đã xóa cache DNS');
    } catch (error) {
      message.error('Không thể xóa cache DNS');
    }
  };

  const handleResetNetwork = async () => {
    Modal.confirm({
      title: 'Đặt lại mạng',
      content: 'Bạn có chắc chắn muốn đặt lại cấu hình mạng?',
      onOk: async () => {
        try {
          await window.electronAPI.resetNetwork();
          message.success('Đã đặt lại mạng thành công');
          loadNetworkInterfaces();
        } catch (error) {
          message.error('Đặt lại mạng thất bại');
        }
      },
    });
  };

  const handleDnsModalOpen = async (interfaceName: string) => {
    setSelectedInterfaceForDNS(interfaceName);
    try {
      const dns = await window.electronAPI.getCurrentDNS(interfaceName);
      setCurrentDNS(dns);
      dnsForm.setFieldsValue({
        primary: dns.primary,
        secondary: dns.secondary,
        ipv6Primary: dns.ipv6?.primary,
        ipv6Secondary: dns.ipv6?.secondary
      });
    } catch (error) {
      console.error('Error loading DNS settings:', error);
    }
    setDnsModalVisible(true);
  };

  const handleSetPresetDNS = async (preset: string) => {
    try {
      await window.electronAPI.setPresetDNS(selectedInterfaceForDNS, preset);
      message.success(`Đã cài đặt DNS ${preset} thành công`);
      setDnsModalVisible(false);
      loadNetworkInterfaces();
    } catch (error) {
      message.error('Lỗi khi cài đặt DNS');
    }
  };

  const handleSetCustomDNS = async (values: any) => {
    try {
      const dnsConfig: DnsConfig = {
        primary: values.primary,
        secondary: values.secondary,
        ipv6: values.ipv6Primary ? {
          primary: values.ipv6Primary,
          secondary: values.ipv6Secondary
        } : undefined
      };
      
      await window.electronAPI.setCustomDNS(selectedInterfaceForDNS, dnsConfig);
      message.success('Đã cài đặt DNS tùy chỉnh thành công');
      setDnsModalVisible(false);
      loadNetworkInterfaces();
    } catch (error) {
      message.error('Lỗi khi cài đặt DNS tùy chỉnh');
    }
  };

  const handleClearDNS = async () => {
    try {
      await window.electronAPI.clearDNS(selectedInterfaceForDNS);
      message.success('Đã xóa cài đặt DNS');
      setDnsModalVisible(false);
      loadNetworkInterfaces();
    } catch (error) {
      message.error('Lỗi khi xóa DNS');
    }
  };

  const handleToggleIPv6 = async (enabled: boolean) => {
    try {
      setIpv6Toggling(true);
      if (enabled) {
        await window.electronAPI.enableIPv6(selectedInterfaceForIPv6 || undefined);
        message.success('Đã bật IPv6');
      } else {
        await window.electronAPI.disableIPv6(selectedInterfaceForIPv6 || undefined);
        message.success('Đã tắt IPv6');
      }
      // Verify final state from system
      const st = await window.electronAPI.getIPv6Status(selectedInterfaceForIPv6 || undefined);
      setIpv6Status(st);
    } catch (error) {
      message.error('Lỗi khi thay đổi trạng thái IPv6');
    }
    finally {
      setIpv6Toggling(false);
    }
  };

  const handleSetProxy = async (values: any) => {
    try {
      const config: ProxyConfig = {
        enabled: values.enabled,
        server: values.server,
        port: values.port,
        username: values.username,
        password: values.password,
        bypass: values.bypass ? values.bypass.split(';').map((s: string) => s.trim()) : []
      };
      
      await window.electronAPI.setProxy(config);
      message.success('Đã cài đặt proxy thành công');
      setProxyModalVisible(false);
      loadProxyStatus();
    } catch (error) {
      message.error('Lỗi khi cài đặt proxy');
    }
  };

  const handleOptimizeNetwork = async (values: any) => {
    try {
      const optimization: NetworkOptimization = {
        disableIPv6: values.disableIPv6,
        optimizeTCP: values.optimizeTCP,
        increaseBufferSize: values.increaseBufferSize,
        disableNagle: values.disableNagle,
        optimizeDNS: values.optimizeDNS
      };
      
      await window.electronAPI.optimizeNetwork(optimization);
      message.success('Đã tối ưu mạng thành công');
      setOptimizationModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi tối ưu mạng');
    }
  };



  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'connected':
      case 'up':
        return 'green';
      case 'disconnected':
      case 'down':
        return 'red';
      default:
        return 'orange';
    }
  };

  const getInterfaceTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'ethernet':
        return 'blue';
      case 'wifi':
      case 'wireless':
        return 'purple';
      case 'loopback':
        return 'orange';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Interface',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string, record: NetworkInterface) => (
        <div>
          <Text style={{ color: gradientStyles.textColor }} strong>{name}</Text>
          <br />
          <Text style={{ color: gradientStyles.textColorSecondary }} type="secondary" >
            {record.adapterName || record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 200,
      render: (ip: string, record: NetworkInterface) => (
        <div>
          <Text style={{ color: gradientStyles.textColor }} strong>{ip || 'N/A'}</Text>
          {record.gateway && record.gateway !== 'N/A' && (
            <>
              <br />
              <Text style={{ color: gradientStyles.textColorSecondary }} type="secondary" >
                GW: {record.gateway}
              </Text>
            </>
          )}
          {record.dns && record.dns !== 'N/A' && (
            <>
              <br />
              <Text style={{ color: gradientStyles.textColorSecondary }} type="secondary" >
                DNS: {record.dns}
              </Text>
            </>
          )}
          {record.dnsServers && record.dnsServers.length > 1 && (
            <>
              <br />
              <Text style={{ color: gradientStyles.textColorSecondary }} type="secondary" >
                DNS: {record.dnsServers.join(', ')}
              </Text>
            </>
          )}
          {record.ipv6Address && record.ipv6Address !== 'N/A' && (
            <>
              <br />
              <Text style={{ color: gradientStyles.textColorSecondary }} type="secondary" >
                IPv6: {record.ipv6Address}
              </Text>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: NetworkInterface) => (
        <div>
          <Tag color={getStatusColor(status)}>
            {status || 'Unknown'}
          </Tag>
          <br />
          <Tag color={getInterfaceTypeColor(record.type)}>
            {record.type || 'Unknown'}
          </Tag>
          {record.dhcpEnabled !== undefined && (
            <>
              <br />
              <Tag color={record.dhcpEnabled ? 'green' : 'red'}>
                {record.dhcpEnabled ? 'DHCP' : 'Static'}
              </Tag>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Speed',
      dataIndex: 'speed',
      key: 'speed',
      width: 120,
      render: (speed: string, record: NetworkInterface) => (
        <div>
          <Text style={{ color: gradientStyles.textColor }}>{speed || 'N/A'}</Text>
          {record.duplex && (
            <>
              <br />
              <Text style={{ color: gradientStyles.textColorSecondary }} >
                {record.duplex}
              </Text>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'View',
      key: 'view',
      width: 80,
      render: (text: string, record: NetworkInterface) => (
        <Button 
          type="primary" 
          size="small"
          icon={<SettingOutlined />}
          onClick={() => {
            setSelectedInterface(record);
            setDetailModalVisible(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const NetworkOverview = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>Total Interfaces</span>}
              value={interfaces.length}
              valueStyle={{ color: gradientStyles.textColor }}
              prefix={<GlobalOutlined style={{ color: '#4fc3f7' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>Connected</span>}
              value={interfaces.filter(i => i.status?.toLowerCase() === 'connected' || i.status?.toLowerCase() === 'up').length}
              valueStyle={{ color: gradientStyles.textColor }}
              prefix={<CheckCircleOutlined style={{ color: '#4caf50' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>Ethernet</span>}
              value={interfaces.filter(i => i.type?.toLowerCase() === 'ethernet').length}
              valueStyle={{ color: gradientStyles.textColor }}
              prefix={<ThunderboltOutlined style={{ color: '#9c27b0' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>WiFi</span>}
              value={interfaces.filter(i => i.type?.toLowerCase() === 'wifi' || i.type?.toLowerCase() === 'wireless').length}
              valueStyle={{ color: gradientStyles.textColor }}
              prefix={<WifiOutlined style={{ color: '#ff9800' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={<span style={{ color: gradientStyles.textColor }}>Network Interfaces</span>} 
        extra={<WifiOutlined style={{ color: gradientStyles.textColor }} />}
        style={customStyles.card}
      >
        <Table 
          columns={columns} 
          dataSource={interfaces}
          loading={loading}
          rowKey="name"
          scroll={{ x: 800 }}
          pagination={false}
          size="small"
          style={tableStyles.table}
          components={{
            header: {
              cell: (props: any) => (
                <th {...props} style={{ ...props.style, ...tableStyles.header }} />
              ),
            },
            body: {
              row: (props: any) => (
                <tr {...props} style={{ ...props.style, ...tableStyles.body }} />
              ),
              cell: (props: any) => (
                <td {...props} style={{ ...props.style, ...tableStyles.body }} />
              ),
            },
          }}
        />
      </Card>
    </div>
  );

  const NetworkTools = () => (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card 
            title={<span style={{ color: gradientStyles.textColor }}>Sao lưu WiFi</span>} 
            extra={<CloudUploadOutlined style={{ color: gradientStyles.textColor }} />}
            style={customStyles.card}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: gradientStyles.textColorSecondary }}>Backup tất cả WiFi profiles</Text>
              <Button 
                type="primary" 
                onClick={handleBackupWifi}
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
            title={<span style={{ color: gradientStyles.textColor }}>Kiểm tra mạng</span>} 
            extra={<CheckCircleOutlined style={{ color: gradientStyles.textColor }} />}
            style={customStyles.card}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                loading={testingConnection}
                onClick={handleTestConnection}
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
                Kiểm tra kết nối
              </Button>
              <Button 
                onClick={handleFlushDNS}
                style={{
                  ...customStyles.button,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${gradientStyles.borderColor}`
                }}
              >
                Xóa cache DNS
              </Button>
              <Button 
                danger 
                onClick={handleResetNetwork}
                style={{
                  background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
                }}
              >
                Đặt lại mạng
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card 
            title={<span style={{ color: gradientStyles.textColor }}>Cài đặt DNS</span>} 
            extra={<DatabaseOutlined style={{ color: gradientStyles.textColor }} />}
            style={customStyles.card}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: gradientStyles.textColorSecondary }}>Quản lý cài đặt DNS cho các interface</Text>
              <Button 
                type="primary" 
                onClick={() => {
                  if (interfaces.length > 0) {
                    handleDnsModalOpen(interfaces[0].name);
                  }
                }}
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
                Cài đặt DNS
              </Button>
            </Space>
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title={<span style={{ color: gradientStyles.textColor }}>Quản lý IPv6</span>} 
            extra={<GlobalOutlined style={{ color: gradientStyles.textColor }} />}
            style={customStyles.card}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={8}>
                <Col span={14}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn interface"
                    value={selectedInterfaceForIPv6 || undefined}
                    onChange={async (v) => { setSelectedInterfaceForIPv6(v); const st = await window.electronAPI.getIPv6Status(v); setIpv6Status(st); }}
                    options={interfaces.map(i => ({ value: i.name, label: `${i.name} (${i.type || ''})` }))}
                    allowClear
                  />
                </Col>
                <Col span={10}>
                  <div>
                    <Text style={{ color: gradientStyles.textColorSecondary }}>Trạng thái IPv6: </Text>
                    <Tag color={ipv6Status ? 'green' : 'red'}>
                      {ipv6Status ? 'Bật' : 'Tắt'}
                    </Tag>
                  </div>
                </Col>
              </Row>
              <Switch 
                checked={ipv6Status}
                onChange={handleToggleIPv6}
                checkedChildren="Bật"
                unCheckedChildren="Tắt"
                loading={ipv6Toggling}
              />
              <Space>
                <Button onClick={loadIPv6Status}>Làm mới trạng thái</Button>
                {/* Đã bỏ nút test/debug theo yêu cầu */}
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card 
            title={<span style={{ color: gradientStyles.textColor }}>Cài đặt Proxy</span>} 
            extra={<SafetyOutlined style={{ color: gradientStyles.textColor }} />}
            style={customStyles.card}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text style={{ color: gradientStyles.textColorSecondary }}>Trạng thái Proxy: </Text>
                <Tag color={proxyStatus.enabled ? 'green' : 'red'}>
                  {proxyStatus.enabled ? 'Bật' : 'Tắt'}
                </Tag>
              </div>
              {proxyStatus.server && (
                <Text style={{ color: gradientStyles.textColorSecondary }}>Server: {proxyStatus.server}</Text>
              )}
              <Button 
                type="primary" 
                onClick={() => setProxyModalVisible(true)}
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
                Cài đặt Proxy
              </Button>
            </Space>
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title={<span style={{ color: gradientStyles.textColor }}>Tối ưu mạng</span>} 
            extra={<RocketOutlined style={{ color: gradientStyles.textColor }} />}
            style={customStyles.card}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: gradientStyles.textColorSecondary }}>Tối ưu hiệu suất mạng</Text>
              <Button 
                type="primary" 
                onClick={() => setOptimizationModalVisible(true)}
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
                Tối ưu mạng
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>


      {/* Connection Info Display */}
      {connectionInfo && (
        <Card 
          title={<span style={{ color: gradientStyles.textColor }}>Thông tin kết nối</span>} 
          style={{ ...customStyles.card, marginTop: 16 }}
          extra={
            <Tag color={connectionInfo.isConnected ? 'green' : 'red'}>
              {connectionInfo.isConnected ? 'Kết nối thành công' : 'Kết nối thất bại'}
            </Tag>
          }
        >
          {connectionInfo.isConnected ? (
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Descriptions title="Thông tin IP" column={1} size="small">
                  <Descriptions.Item label="Public IPv4">
                    <Text strong style={{ color: '#1890ff' }}>
                      {connectionInfo.publicIP || 'N/A'}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Public IPv6">
                    <Text style={{ color: '#52c41a' }}>
                      {connectionInfo.publicIPv6 || 'N/A'}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Local IP">
                    <Text>{connectionInfo.localIP || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Response Time">
                    <Text>{connectionInfo.responseTime}ms</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={connectionInfo.status === 'success' ? 'green' : 'red'}>
                      {connectionInfo.status || 'N/A'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions title="Thông tin địa lý" style={{ color: gradientStyles.textColor }} column={1} size="small">
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Lục địa">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.continent} ({connectionInfo.continentCode})</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Quốc gia">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.country} ({connectionInfo.countryCode})</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Khu vực">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.regionName} ({connectionInfo.region})</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Thành phố">
                    <Text>{connectionInfo.city || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Quận/Huyện">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.district || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Mã bưu điện">
                    <Text>{connectionInfo.zip || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Múi giờ">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.timezone} (UTC{connectionInfo.timezoneOffset ? (connectionInfo.timezoneOffset > 0 ? '+' : '') + connectionInfo.timezoneOffset/3600 : ''})</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Tiền tệ">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.currency || 'N/A'}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={24}>
                <Descriptions title="Thông tin ISP & Mạng" style={{ color: gradientStyles.textColor }}  column={2} size="small">
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="ISP">
                    <Text strong style={{ color: gradientStyles.textColor }}>{connectionInfo.isp || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Tổ chức">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.org || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="AS">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.as || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="AS Name">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.asname || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Reverse DNS">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.reverse || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Query IP">
                    <Text style={{ color: gradientStyles.textColor }}>{connectionInfo.query || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Tọa độ">
                    <Text style={{ color: gradientStyles.textColor }}>
                      {connectionInfo.latitude && connectionInfo.longitude 
                        ? `${connectionInfo.latitude}, ${connectionInfo.longitude}`
                        : 'N/A'
                      }
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={{ color: gradientStyles.textColor }}  label="Loại kết nối">
                    <Space>
                      <Tag color={connectionInfo.mobile ? 'blue' : 'default'}>
                        {connectionInfo.mobile ? 'Mobile' : 'Desktop'}
                      </Tag>
                      <Tag color={connectionInfo.proxy ? 'orange' : 'default'}>
                        {connectionInfo.proxy ? 'Proxy' : 'Direct'}
                      </Tag>
                      <Tag color={connectionInfo.hosting ? 'purple' : 'default'}>
                        {connectionInfo.hosting ? 'Hosting' : 'Residential'}
                      </Tag>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          ) : (
            <Alert
              message="Kết nối thất bại"
              description={connectionInfo.error || 'Không thể kết nối đến internet'}
              type="error"
              showIcon
            />
          )}
        </Card>
      )}
    </div>
  );

  return (
    <div style={customStyles.mainContainer}>
      <Space style={{ marginBottom: 16 }}>
        <Title level={2} style={{ 
          color: gradientStyles.textColor,
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>Quản lý mạng</Title>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={loadNetworkInterfaces}
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
          Làm mới
        </Button>
      </Space>

      <Tabs 
        defaultActiveKey="overview" 
        type="card"
        style={{
          '--ant-tabs-card-bg': 'rgba(255, 255, 255, 0.05)',
          '--ant-tabs-card-active-bg': gradientStyles.backgroundCard,
          '--ant-tabs-card-border-color': gradientStyles.borderColor,
          '--ant-tabs-card-border-radius': '8px',
          '--ant-tabs-card-margin': '0 0 8px 0'
        } as React.CSSProperties}
      >
        <Tabs.TabPane tab="Tổng quan" key="overview" icon={<GlobalOutlined />}>
          <NetworkOverview />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Speed Test" key="speedtest" icon={<ThunderboltFilled />}>
          <SpeedTestManager />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Công cụ" key="tools" icon={<ThunderboltOutlined />}>
          <NetworkTools />
        </Tabs.TabPane>
      </Tabs>

      {/* DNS Configuration Modal */}
      <Modal
        title={<span style={modalStyles.title}>{`Cài đặt DNS - ${selectedInterfaceForDNS}`}</span>}
        open={dnsModalVisible}
        onCancel={() => setDnsModalVisible(false)}
        footer={null}
        width={800}
        styles={{
          content: modalStyles.content,
          header: modalStyles.header,
          body: modalStyles.body,
          footer: modalStyles.footer
        }}
      >
        <Tabs defaultActiveKey="preset">
          <Tabs.TabPane tab="DNS có sẵn" key="preset">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" style={customStyles.card}>
                    <Button 
                      block 
                      onClick={() => handleSetPresetDNS('cloudflare')}
                      style={customStyles.button}
                    >
                      Cloudflare (1.1.1.1)
                    </Button>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={customStyles.card}>
                    <Button 
                      block 
                      onClick={() => handleSetPresetDNS('google')}
                      style={customStyles.button}
                    >
                      Google (8.8.8.8)
                    </Button>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={customStyles.card}>
                    <Button 
                      block 
                      onClick={() => handleSetPresetDNS('opendns')}
                      style={customStyles.button}
                    >
                      OpenDNS (208.67.222.222)
                    </Button>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" style={customStyles.card}>
                    <Button 
                      block 
                      onClick={() => handleSetPresetDNS('adguard')}
                      style={customStyles.button}
                    >
                      AdGuard (94.140.14.14)
                    </Button>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={customStyles.card}>
                    <Button 
                      block 
                      onClick={() => handleSetPresetDNS('quad9')}
                      style={customStyles.button}
                    >
                      Quad9 (9.9.9.9)
                    </Button>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={customStyles.card}>
                    <Button 
                      block 
                      onClick={() => handleSetPresetDNS('norton')}
                      style={customStyles.button}
                    >
                      Norton (199.85.126.10)
                    </Button>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" style={customStyles.card}>
                    <Button 
                      block 
                      onClick={() => handleSetPresetDNS('cleanbrowsing')}
                      style={customStyles.button}
                    >
                      CleanBrowsing (185.228.168.9)
                    </Button>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={customStyles.card}>
                    <Button 
                      block 
                      onClick={() => handleSetPresetDNS('alternate')}
                      style={customStyles.button}
                    >
                      Alternate (76.76.19.19)
                    </Button>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={customStyles.card}>
                    <Button 
                      block 
                      danger
                      onClick={handleClearDNS}
                      style={{
                        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
                      }}
                    >
                      Xóa DNS (DHCP)
                    </Button>
                  </Card>
                </Col>
              </Row>
            </Space>
                      </Tabs.TabPane>
            
            <Tabs.TabPane tab="DNS tùy chỉnh" key="custom">
            <Form
              form={dnsForm}
              layout="vertical"
              onFinish={handleSetCustomDNS}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="primary"
                    label="Primary DNS (IPv4)"
                    rules={[
                      { required: true, message: 'Vui lòng nhập Primary DNS' },
                      { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'IP không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="8.8.8.8" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="secondary"
                    label="Secondary DNS (IPv4)"
                    rules={[
                      { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'IP không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="8.8.4.4" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="ipv6Primary"
                    label="Primary DNS (IPv6)"
                  >
                    <Input placeholder="2001:4860:4860::8888" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="ipv6Secondary"
                    label="Secondary DNS (IPv6)"
                  >
                    <Input placeholder="2001:4860:4860::8844" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    style={customStyles.button}
                  >
                    Áp dụng DNS
                  </Button>
                  <Button 
                    onClick={() => setDnsModalVisible(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: `1px solid ${gradientStyles.borderColor}`,
                      color: gradientStyles.textColor,
                      borderRadius: '8px'
                    }}
                  >
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
                          </Form>
            </Tabs.TabPane>
        </Tabs>
      </Modal>

      {/* Proxy Configuration Modal */}
      <Modal
        title={<span style={modalStyles.title}>Cài đặt Proxy</span>}
        open={proxyModalVisible}
        onCancel={() => setProxyModalVisible(false)}
        footer={null}
        width={600}
        styles={{
          content: modalStyles.content,
          header: modalStyles.header,
          body: modalStyles.body,
          footer: modalStyles.footer
        }}
      >
        <Form
          form={proxyForm}
          layout="vertical"
          onFinish={handleSetProxy}
          initialValues={{
            enabled: proxyStatus.enabled,
            server: proxyStatus.server || '',
            port: 8080,
            bypass: 'localhost;127.0.0.1'
          }}
        >
          <Form.Item
            name="enabled"
            label="Bật Proxy"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.enabled !== currentValues.enabled}
          >
            {({ getFieldValue }) => {
              const enabled = getFieldValue('enabled');
              return enabled ? (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="server"
                        label="Proxy Server"
                        rules={[
                          { required: true, message: 'Vui lòng nhập server' }
                        ]}
                      >
                        <Input placeholder="proxy.example.com" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="port"
                        label="Port"
                        rules={[
                          { required: true, message: 'Vui lòng nhập port' },
                          { type: 'number', min: 1, max: 65535, message: 'Port phải từ 1-65535' }
                        ]}
                      >
                        <Input type="number" placeholder="8080" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="username"
                        label="Username (tùy chọn)"
                      >
                        <Input placeholder="username" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="password"
                        label="Password (tùy chọn)"
                      >
                        <Input.Password placeholder="password" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="bypass"
                    label="Bypass List (phân cách bằng dấu ;)"
                  >
                    <Input.TextArea 
                      placeholder="localhost;127.0.0.1;*.local"
                      rows={3}
                    />
                  </Form.Item>
                </>
              ) : null;
            }}
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                style={customStyles.button}
              >
                Áp dụng Proxy
              </Button>
              <Button 
                onClick={() => setProxyModalVisible(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${gradientStyles.borderColor}`,
                  color: gradientStyles.textColor,
                  borderRadius: '8px'
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Network Optimization Modal */}
      <Modal
        title={<span style={modalStyles.title}>Tối ưu mạng</span>}
        open={optimizationModalVisible}
        onCancel={() => setOptimizationModalVisible(false)}
        footer={null}
        width={600}
        styles={{
          content: modalStyles.content,
          header: modalStyles.header,
          body: modalStyles.body,
          footer: modalStyles.footer
        }}
      >
        <Form
          form={optimizationForm}
          layout="vertical"
          onFinish={handleOptimizeNetwork}
          initialValues={{
            disableIPv6: false,
            optimizeTCP: true,
            increaseBufferSize: true,
            disableNagle: false,
            optimizeDNS: true
          }}
        >
          <Form.Item
            name="disableIPv6"
            label="Tắt IPv6"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name="optimizeTCP"
            label="Tối ưu TCP"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name="increaseBufferSize"
            label="Tăng kích thước buffer"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name="disableNagle"
            label="Tắt thuật toán Nagle"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name="optimizeDNS"
            label="Tối ưu DNS"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                style={customStyles.button}
              >
                Áp dụng tối ưu
              </Button>
              <Button 
                onClick={() => setOptimizationModalVisible(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${gradientStyles.borderColor}`,
                  color: gradientStyles.textColor,
                  borderRadius: '8px'
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Existing Network Configuration Modal */}
      <Modal
        title={<span style={modalStyles.title}>{`Cấu hình mạng - ${selectedInterface?.name}`}</span>}
        open={configModalVisible}
        onCancel={() => {
          setConfigModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
        styles={{
          content: modalStyles.content,
          header: modalStyles.header,
          body: modalStyles.body,
          footer: modalStyles.footer
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleConfigureNetwork}
          initialValues={{
            interface: selectedInterface?.name,
            type: selectedInterface?.dhcpEnabled ? 'dhcp' : 'static',
            ipAddress: selectedInterface?.ipAddress,
            subnetMask: selectedInterface?.subnetMask,
            gateway: selectedInterface?.gateway,
            dns: selectedInterface?.dns,
          }}
        >
          <Form.Item
            name="interface"
            label="Network Interface"
            rules={[{ required: true, message: 'Vui lòng chọn interface' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại cấu hình"
            rules={[{ required: true, message: 'Vui lòng chọn loại cấu hình' }]}
          >
            <Select>
              <Option value="dhcp">DHCP (Tự động lấy IP)</Option>
              <Option value="static">Static IP (Cấu hình thủ công)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              return type === 'static' ? (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="ipAddress"
                        label="IP Address"
                        rules={[
                          { required: true, message: 'Vui lòng nhập IP address' },
                          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'IP address không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="192.168.1.100" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="subnetMask"
                        label="Subnet Mask"
                        rules={[
                          { required: true, message: 'Vui lòng nhập subnet mask' },
                          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Subnet mask không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="255.255.255.0" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="gateway"
                        label="Gateway"
                        rules={[
                          { required: true, message: 'Vui lòng nhập gateway' },
                          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Gateway không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="192.168.1.1" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="dns"
                        label="Primary DNS"
                        rules={[
                          { required: true, message: 'Vui lòng nhập DNS' },
                          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'DNS không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="8.8.8.8" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="dns2"
                        label="Secondary DNS"
                        rules={[
                          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'DNS không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="8.8.4.4" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="mtu"
                        label="MTU"
                        rules={[
                          { type: 'number', min: 1280, max: 9000, message: 'MTU phải từ 1280-9000' }
                        ]}
                      >
                        <Input type="number" placeholder="1500" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : null;
            }}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                style={customStyles.button}
              >
                Áp dụng cấu hình
              </Button>
              <Button 
                onClick={() => {
                  setConfigModalVisible(false);
                  form.resetFields();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${gradientStyles.borderColor}`,
                  color: gradientStyles.textColor,
                  borderRadius: '8px'
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Network Details Modal */}
      <Modal
        title={<span style={modalStyles.title}>{`Chi tiết mạng - ${selectedInterface?.name}`}</span>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={900}
        styles={{
          content: modalStyles.content,
          header: modalStyles.header,
          body: modalStyles.body,
          footer: modalStyles.footer
        }}
        footer={[
          <Button 
            key="config" 
            type="primary" 
            onClick={() => {
              setDetailModalVisible(false);
              setConfigModalVisible(true);
            }}
            style={customStyles.button}
          >
            Cấu hình
          </Button>,
          <Button 
            key="close" 
            onClick={() => setDetailModalVisible(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${gradientStyles.borderColor}`,
              color: gradientStyles.textColor,
              borderRadius: '8px'
            }}
          >
            Đóng
          </Button>
        ]}
      >
        {selectedInterface && (
          <div>
            {/* Thông tin cơ bản */}
            <Card 
              title={<span style={{ color: gradientStyles.textColor }}>Thông tin cơ bản</span>} 
              size="small" 
              style={{ ...customStyles.card, marginBottom: 16 }}
            >
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Tên interface">
                      <Text strong style={{ color: gradientStyles.textColor }}>{selectedInterface.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Tên adapter">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.adapterName || selectedInterface.description}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Loại">
                      <Tag style={{ color: gradientStyles.textColor }} color={getInterfaceTypeColor(selectedInterface.type)}>
                        {selectedInterface.type || 'Unknown'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Trạng thái">
                      <Tag style={{ color: gradientStyles.textColor }} color={getStatusColor(selectedInterface.status)}>
                        {selectedInterface.status}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="MAC Address">
                      <Text copyable style={{ color: gradientStyles.textColor }}>{selectedInterface.macAddress || selectedInterface.physicalAddress || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Tốc độ">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.speed || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Duplex">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.duplex || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="MTU">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.mtu || 'N/A'}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            {/* Thông tin IP */}
            <Card 
              title={<span style={{ color: gradientStyles.textColor }}>Thông tin IP</span>} 
              size="small" 
              style={{ ...customStyles.card, marginBottom: 16 }}
            >
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="IP Address">
                      <Text copyable strong style={{ color: gradientStyles.textColor }}>{selectedInterface.ipAddress || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Subnet Mask">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.subnetMask || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Gateway">
                      <Text copyable style={{ color: gradientStyles.textColor }}>{selectedInterface.gateway || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Network Address">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.networkAddress || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Broadcast Address">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.broadcastAddress || 'N/A'}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="IPv6 Address">
                      <Text copyable style={{ color: gradientStyles.textColor }}>{selectedInterface.ipv6Address || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="DHCP">
                      <Tag color={selectedInterface.dhcpEnabled ? 'green' : 'red'}>
                        {selectedInterface.dhcpEnabled ? 'Enabled' : 'Disabled'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Interface Type">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.interfaceType || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Physical Address">
                      <Text copyable style={{ color: gradientStyles.textColor }}>{selectedInterface.physicalAddress || 'N/A'}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            {/* Thông tin DNS */}
            <Card 
              title={<span style={{ color: gradientStyles.textColor }}>Thông tin DNS</span>} 
              size="small" 
              style={{ ...customStyles.card, marginBottom: 16 }}
            >
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Primary DNS">
                      <Text copyable strong style={{ color: gradientStyles.textColor }}>{selectedInterface.dns || 'N/A'}</Text>
                    </Descriptions.Item>
                    {selectedInterface.dnsServers && selectedInterface.dnsServers.length > 1 && (
                      <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Secondary DNS">
                        <Text copyable style={{ color: gradientStyles.textColor }}>{selectedInterface.dnsServers[1] || 'N/A'}</Text>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    {selectedInterface.dnsServers && selectedInterface.dnsServers.length > 0 && (
                      <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Tất cả DNS Servers">
                        <div>
                          {selectedInterface.dnsServers.map((dns, index) => (
                            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                              {dns}
                            </Tag>
                          ))}
                        </div>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            {/* Thông tin bổ sung */}
            <Card 
              title={<span style={{ color: gradientStyles.textColor }}>Thông tin bổ sung</span>} 
              size="small"
              style={customStyles.card}
            >
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Media Type">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.mediaType || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Physical Media Type">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.physicalMediaType || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Admin Status">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.adminStatus || 'N/A'}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Link Speed">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.linkSpeed || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Interface Index">
                      <Text style={{ color: gradientStyles.textColor }}>{selectedInterface.interfaceIndex || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item style={{ color: gradientStyles.textColor }} label="Interface GUID">
                      <Text copyable style={{ color: gradientStyles.textColor }}>{selectedInterface.interfaceGuid || 'N/A'}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NetworkManager; 