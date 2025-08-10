import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Table, Tag, Progress, Spin, message, Row, Col, Statistic, Divider } from 'antd';
import { 
  ThunderboltOutlined, 
  GlobalOutlined, 
  DownloadOutlined, 
  UploadOutlined, 
  ClockCircleOutlined,
  WifiOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const { Option } = Select;

interface SpeedTestServer {
  count: number;
  serverID: number;
  serverName: string;
  latitude: string;
  longitude: string;
  download_url: string;
  upload_url: string;
  ping_url: string;
  country: string;
  distance: string;
  default: boolean;
}

interface SpeedTestResult {
  singleThread: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    jitter: number;
  };
  multiThread: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    jitter: number;
  };
  serverUsed?: string;
  testDuration: number;
}

const SpeedTestManager: React.FC = () => {
  const [servers, setServers] = useState<SpeedTestServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<SpeedTestServer | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingServers, setLoadingServers] = useState(true);
  const [testResult, setTestResult] = useState<SpeedTestResult | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [testPhase, setTestPhase] = useState<string>('');

  // Load servers on component mount
  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      setLoadingServers(true);
      const networkService = (window as any).electronAPI?.networkService;
      if (!networkService) {
        message.error('NetworkService không khả dụng');
        return;
      }

      const serverList = await networkService.getSpeedTestServers();
      setServers(serverList);
      
      // Auto select closest server (first in sorted list)
      if (serverList.length > 0) {
        setSelectedServer(serverList[0]);
        message.success(`Đã chọn server gần nhất: ${serverList[0].serverName}`);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách server:', error);
      message.error('Không thể tải danh sách server');
    } finally {
      setLoadingServers(false);
    }
  };

  const runSpeedTest = async () => {
    if (!selectedServer) {
      message.warning('Vui lòng chọn server để test');
      return;
    }

    try {
      setLoading(true);
      setTestProgress(0);
      setTestResult(null);
      
      const networkService = (window as any).electronAPI?.networkService;
      if (!networkService) {
        message.error('NetworkService không khả dụng');
        return;
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setTestProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 1000);

      setTestPhase('Đang test tốc độ mạng...');
      
      const result = await networkService.testNetworkSpeed(selectedServer.serverID);
      
      clearInterval(progressInterval);
      setTestProgress(100);
      setTestResult(result);
      setTestPhase('Hoàn thành');
      
      message.success('Test tốc độ mạng thành công!');
    } catch (error) {
      console.error('Lỗi khi test tốc độ:', error);
      message.error('Lỗi khi test tốc độ mạng');
    } finally {
      setLoading(false);
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'vn': '🇻🇳',
      'sg': '🇸🇬', 
      'hk': '🇭🇰',
      'id': '🇮🇩',
      'bd': '🇧🇩',
      'in': '🇮🇳',
      'kr': '🇰🇷',
      'jp': '🇯🇵',
      'us': '🇺🇸',
      'uk': '🇬🇧',
      'de': '🇩🇪',
      'fr': '🇫🇷',
      'au': '🇦🇺'
    };
    return flags[country] || '🌍';
  };

  const getDistanceColor = (distance: string) => {
    const distanceNum = parseFloat(distance.replace(/[^\d.]/g, ''));
    if (distanceNum < 1000) return 'green';
    if (distanceNum < 3000) return 'orange';
    return 'red';
  };

  const getSpeedColor = (speed: number) => {
    if (speed > 50) return '#52c41a';
    if (speed > 20) return '#faad14';
    return '#ff4d4f';
  };

  const columns = [
    {
      title: 'Server',
      dataIndex: 'serverName',
      key: 'serverName',
      render: (text: string, record: SpeedTestServer) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {getCountryFlag(record.country)} {text}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.serverID}
          </div>
        </div>
      ),
    },
    {
      title: 'Quốc gia',
      dataIndex: 'country',
      key: 'country',
      render: (country: string) => (
        <Tag color="blue">{country.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Khoảng cách',
      dataIndex: 'distance',
      key: 'distance',
      render: (distance: string) => (
        <Tag color={getDistanceColor(distance)}>{distance}</Tag>
      ),
    },
    {
      title: 'Tọa độ',
      key: 'coordinates',
      render: (record: SpeedTestServer) => (
        <div style={{ fontSize: '12px' }}>
          <div>Lat: {parseFloat(record.latitude).toFixed(2)}</div>
          <div>Lng: {parseFloat(record.longitude).toFixed(2)}</div>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: SpeedTestServer) => (
        <Button
          size="small"
          type={selectedServer?.serverID === record.serverID ? 'primary' : 'default'}
          onClick={() => {
            setSelectedServer(record);
            message.info(`Đã chọn server: ${record.serverName}`);
          }}
          icon={selectedServer?.serverID === record.serverID ? <CheckCircleOutlined /> : <GlobalOutlined />}
        >
          {selectedServer?.serverID === record.serverID ? 'Đã chọn' : 'Chọn'}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThunderboltOutlined style={{ color: '#1890ff' }} />
            <span>Speed Test Manager</span>
          </div>
        }
        extra={
          <Button 
            onClick={loadServers} 
            loading={loadingServers}
            icon={<WifiOutlined />}
          >
            Làm mới danh sách
          </Button>
        }
      >
        {/* Server Selection */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Card size="small" title="🎯 Server được chọn">
              {selectedServer ? (
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                    {getCountryFlag(selectedServer.country)} {selectedServer.serverName}
                  </div>
                  <div style={{ color: '#666', marginBottom: '4px' }}>
                    📍 Khoảng cách: <Tag color={getDistanceColor(selectedServer.distance)}>{selectedServer.distance}</Tag>
                  </div>
                  <div style={{ color: '#666', marginBottom: '4px' }}>
                    🌐 Quốc gia: <Tag color="blue">{selectedServer.country.toUpperCase()}</Tag>
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    📡 ID: {selectedServer.serverID} | 📊 Lat: {parseFloat(selectedServer.latitude).toFixed(2)}, Lng: {parseFloat(selectedServer.longitude).toFixed(2)}
                  </div>
                </div>
              ) : (
                <div style={{ color: '#999' }}>Chưa chọn server</div>
              )}
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="⚡ Thao tác nhanh">
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={runSpeedTest}
                  loading={loading}
                  disabled={!selectedServer}
                  icon={<ThunderboltOutlined />}
                  block
                >
                  {loading ? 'Đang test...' : 'Bắt đầu Speed Test'}
                </Button>
                
                {loading && (
                  <div>
                    <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
                      {testPhase}
                    </div>
                    <Progress 
                      percent={Math.round(testProgress)} 
                      size="small"
                      status="active"
                    />
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Test Results */}
        {testResult && (
          <Card 
            title="📊 Kết quả Speed Test" 
            style={{ marginBottom: '20px' }}
            extra={
              <div>
                <Tag color="green">Thành công</Tag>
                <Tag color="blue">⏱️ {testResult.testDuration}s</Tag>
              </div>
            }
          >
            {/* Single-Thread Results */}
            <Card 
              size="small" 
              title="🔄 Single-Thread (1 kết nối)" 
              style={{ marginBottom: '16px' }}
              extra={<Tag color="orange">Đơn luồng</Tag>}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="📥 Download"
                    value={testResult.singleThread.downloadSpeed}
                    precision={2}
                    suffix="Mbps"
                    valueStyle={{ color: getSpeedColor(testResult.singleThread.downloadSpeed) }}
                    prefix={<DownloadOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="📤 Upload"
                    value={testResult.singleThread.uploadSpeed}
                    precision={2}
                    suffix="Mbps"
                    valueStyle={{ color: getSpeedColor(testResult.singleThread.uploadSpeed) }}
                    prefix={<UploadOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="🏓 Latency"
                    value={testResult.singleThread.latency}
                    suffix="ms"
                    valueStyle={{ color: testResult.singleThread.latency < 50 ? '#52c41a' : testResult.singleThread.latency < 100 ? '#faad14' : '#ff4d4f' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="📊 Jitter"
                    value={testResult.singleThread.jitter}
                    precision={1}
                    suffix="ms"
                    valueStyle={{ color: testResult.singleThread.jitter < 5 ? '#52c41a' : testResult.singleThread.jitter < 10 ? '#faad14' : '#ff4d4f' }}
                    prefix={<WifiOutlined />}
                  />
                </Col>
              </Row>
            </Card>

            {/* Multi-Thread Results */}
            <Card 
              size="small" 
              title="⚡ Multi-Thread (10 kết nối song song)" 
              style={{ marginBottom: '16px' }}
              extra={<Tag color="red">Đa luồng</Tag>}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="📥 Download"
                    value={testResult.multiThread.downloadSpeed}
                    precision={2}
                    suffix="Mbps"
                    valueStyle={{ color: getSpeedColor(testResult.multiThread.downloadSpeed) }}
                    prefix={<DownloadOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="📤 Upload"
                    value={testResult.multiThread.uploadSpeed}
                    precision={2}
                    suffix="Mbps"
                    valueStyle={{ color: getSpeedColor(testResult.multiThread.uploadSpeed) }}
                    prefix={<UploadOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="🏓 Latency"
                    value={testResult.multiThread.latency}
                    suffix="ms"
                    valueStyle={{ color: testResult.multiThread.latency < 50 ? '#52c41a' : testResult.multiThread.latency < 100 ? '#faad14' : '#ff4d4f' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="📊 Jitter"
                    value={testResult.multiThread.jitter}
                    precision={1}
                    suffix="ms"
                    valueStyle={{ color: testResult.multiThread.jitter < 5 ? '#52c41a' : testResult.multiThread.jitter < 10 ? '#faad14' : '#ff4d4f' }}
                    prefix={<WifiOutlined />}
                  />
                </Col>
              </Row>
            </Card>

            {/* Comparison */}
            <Card size="small" title="📈 So sánh Single vs Multi-Thread" extra={<Tag color="purple">Phân tích</Tag>}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ textAlign: 'center', padding: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                      📥 Download Improvement
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: getSpeedColor(testResult.multiThread.downloadSpeed - testResult.singleThread.downloadSpeed) }}>
                      {testResult.singleThread.downloadSpeed > 0 ? 
                        `+${(testResult.multiThread.downloadSpeed - testResult.singleThread.downloadSpeed).toFixed(2)} Mbps` : 
                        'N/A'
                      }
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {testResult.singleThread.downloadSpeed > 0 ? 
                        `(${((testResult.multiThread.downloadSpeed / testResult.singleThread.downloadSpeed - 1) * 100).toFixed(1)}% faster)` : 
                        '(Chưa có dữ liệu)'
                      }
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'center', padding: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                      📤 Upload Improvement
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: getSpeedColor(testResult.multiThread.uploadSpeed - testResult.singleThread.uploadSpeed) }}>
                      {testResult.singleThread.uploadSpeed > 0 ? 
                        `+${(testResult.multiThread.uploadSpeed - testResult.singleThread.uploadSpeed).toFixed(2)} Mbps` : 
                        'N/A'
                      }
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {testResult.singleThread.uploadSpeed > 0 ? 
                        `(${((testResult.multiThread.uploadSpeed / testResult.singleThread.uploadSpeed - 1) * 100).toFixed(1)}% faster)` : 
                        '(Chưa có dữ liệu)'
                      }
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
            
            {testResult.serverUsed && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <Row>
                  <Col span={12}>
                    <strong>🎯 Server đã sử dụng:</strong> {testResult.serverUsed}
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <strong>⏱️ Thời gian test:</strong> {testResult.testDuration} giây
                  </Col>
                </Row>
              </div>
            )}
          </Card>
        )}

        <Divider>📋 Danh sách Server SpeedSmart</Divider>

        {/* Server List */}
        <Spin spinning={loadingServers} tip="Đang tải danh sách server...">
          <Table
            columns={columns}
            dataSource={servers}
            rowKey="serverID"
            size="small"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} server`,
            }}
            scroll={{ x: 800 }}
            rowClassName={(record) => 
              selectedServer?.serverID === record.serverID ? 'ant-table-row-selected' : ''
            }
          />
        </Spin>
      </Card>

      <style>{`
        .ant-table-row-selected {
          background-color: #e6f7ff !important;
        }
        .ant-table-row-selected:hover {
          background-color: #bae7ff !important;
        }
      `}</style>
    </div>
  );
};

export default SpeedTestManager;
