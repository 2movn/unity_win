import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Progress, Statistic, Alert, Modal, Descriptions, Tag, Divider } from 'antd';
import { ThunderboltFilled, RocketOutlined, SettingOutlined, InfoCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { gradientStyles, customStyles } from '../styles/theme';

const { Title, Text } = Typography;

interface PerformanceInfo {
  cpu: {
    name: string;
    cores: number;
    maxClock: number;
    currentClock: number;
  };
  ram: {
    total: number;
    used: number;
    available: number;
  };
  power: {
    currentPlan: string;
    availablePlans: string[];
  };
}

const PerformanceOptimization: React.FC = () => {
  const [performanceInfo, setPerformanceInfo] = useState<PerformanceInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimizationStatus, setOptimizationStatus] = useState<{
    ram: boolean;
    cpu: boolean;
  }>({ ram: false, cpu: false });

  useEffect(() => {
    loadPerformanceInfo();
  }, []);

  const loadPerformanceInfo = async () => {
    try {
      setLoading(true);
      
      // Get CPU info using WMI
      const cpuResult = await window.electronAPI.executePowerShellCommand(
        'Get-WmiObject -Class Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed, CurrentClockSpeed | ConvertTo-Json'
      );
      
      // Get RAM info using WMI
      const ramResult = await window.electronAPI.executePowerShellCommand(
        'Get-WmiObject -Class Win32_ComputerSystem | Select-Object TotalPhysicalMemory | ConvertTo-Json'
      );
      
      // Get RAM usage info
      const ramUsageResult = await window.electronAPI.executePowerShellCommand(
        'Get-WmiObject -Class Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory | ConvertTo-Json'
      );
      
      // Get current power plan
      const powerResult = await window.electronAPI.executePowerShellCommand(
        'powercfg /getactivescheme'
      );
      
      // Parse CPU data
      let cpuData = null;
      try {
        const cpuJson = cpuResult.stdout || '';
        cpuData = JSON.parse(cpuJson);
        if (Array.isArray(cpuData)) {
          cpuData = cpuData[0]; // Get first CPU if multiple
        }
      } catch (e) {
        console.error('Lỗi parse CPU data:', e);
      }
      
      // Parse RAM data
      let ramData = null;
      try {
        const ramJson = ramResult.stdout || '';
        ramData = JSON.parse(ramJson);
        if (Array.isArray(ramData)) {
          ramData = ramData[0];
        }
      } catch (e) {
        console.error('Lỗi parse RAM data:', e);
      }
      
      // Parse RAM usage data
      let ramUsageData = null;
      try {
        const ramUsageJson = ramUsageResult.stdout || '';
        ramUsageData = JSON.parse(ramUsageJson);
        if (Array.isArray(ramUsageData)) {
          ramUsageData = ramUsageData[0];
        }
      } catch (e) {
        console.error('Lỗi parse RAM usage data:', e);
      }
      
      // Parse power plan
      const powerInfo = powerResult.stdout || '';
      const powerMatch = powerInfo.match(/Power Scheme GUID: ([^\s]+)/);
      const currentPlan = powerMatch ? powerMatch[1] : 'High Performance';
      
      // Calculate RAM values (in MB)
      const totalRAM = ramData?.TotalPhysicalMemory ? Math.round(ramData.TotalPhysicalMemory / (1024 * 1024)) : 0;
      const totalVisibleRAM = ramUsageData?.TotalVisibleMemorySize || 0;
      const freeRAM = ramUsageData?.FreePhysicalMemory || 0;
      const usedRAM = totalVisibleRAM - freeRAM;
      
      setPerformanceInfo({
        cpu: {
          name: cpuData?.Name || 'Unknown CPU',
          cores: cpuData?.NumberOfCores || 0,
          maxClock: cpuData?.MaxClockSpeed || 0,
          currentClock: cpuData?.CurrentClockSpeed || 0,
        },
        ram: {
          total: totalRAM,
          used: Math.round(usedRAM),
          available: Math.round(freeRAM),
        },
        power: {
          currentPlan: currentPlan,
          availablePlans: ['Balanced', 'High Performance', 'Power Saver'],
        },
      });
      
      console.log('CPU Data:', cpuData);
      console.log('RAM Data:', ramData);
      console.log('RAM Usage Data:', ramUsageData);
      
    } catch (error) {
      console.error('Lỗi khi load thông tin hiệu suất:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedRAMOptimization = async () => {
    Modal.confirm({
      title: 'Tối ưu RAM nâng cao',
      content: (
        <div>
          <p>Bạn có muốn áp dụng tối ưu RAM nâng cao?</p>
                     <Alert
             message="Các tối ưu sẽ được áp dụng:"
             description={
               <ul>
                 <li>✅ Tối ưu pagefile cố định (8-16GB)</li>
                 <li>✅ Tối ưu game networking</li>
                 <li>✅ Tăng priority cho game</li>
                 <li>✅ Tối ưu session management</li>
                 <li>✅ An toàn cho đa số máy</li>
               </ul>
             }
             type="info"
             showIcon
           />
        </div>
      ),
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.applyAdvancedRAMOptimization();
          if (result.success) {
            setOptimizationStatus(prev => ({ ...prev, ram: true }));
            Modal.success({
              title: 'Tối ưu RAM thành công',
              content: result.message,
            });
          } else {
            Modal.error({
              title: 'Lỗi tối ưu RAM',
              content: result.message,
            });
          }
        } catch (error) {
          Modal.error({
            title: 'Lỗi',
            content: 'Không thể áp dụng tối ưu RAM',
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleAdvancedCPUOptimization = async () => {
    Modal.confirm({
      title: 'Tối ưu CPU nâng cao',
      content: (
        <div>
          <p>Bạn có muốn áp dụng tối ưu CPU nâng cao?</p>
          <Alert
            message="Các tối ưu sẽ được áp dụng:"
            description={
              <ul>
                <li>🚀 Tăng xung CPU tối đa</li>
                <li>⚡ Tăng nguồn điện cho CPU</li>
                <li>🔥 Tối ưu power plan hiệu suất cao</li>
                <li>🎯 Tối ưu cài đặt registry</li>
                <li>💪 Tăng hiệu năng tối đa</li>
              </ul>
            }
            type="warning"
            showIcon
          />
          <Alert
            message="⚠️ Cảnh báo"
            description="Tối ưu này sẽ tăng nhiệt độ và tiêu thụ điện năng. Đảm bảo hệ thống tản nhiệt tốt."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      ),
      onOk: async () => {
        setLoading(true);
        try {
          const result = await window.electronAPI.applyAdvancedCPUOptimization();
          if (result.success) {
            setOptimizationStatus(prev => ({ ...prev, cpu: true }));
            Modal.success({
              title: 'Tối ưu CPU thành công',
              content: result.message,
            });
          } else {
            Modal.error({
              title: 'Lỗi tối ưu CPU',
              content: result.message,
            });
          }
        } catch (error) {
          Modal.error({
            title: 'Lỗi',
            content: 'Không thể áp dụng tối ưu CPU',
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const formatBytes = (mb: number): string => {
    if (mb === 0) return '0 MB';
    if (mb >= 1024) {
      const gb = mb / 1024;
      return `${gb.toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const formatClockSpeed = (mhz: number): string => {
    if (mhz === 0) return 'Unknown';
    const ghz = mhz / 1000;
    return `${ghz.toFixed(1)} GHz`;
  };

  const getCPUUsagePercentage = (): number => {
    if (!performanceInfo) return 0;
    return Math.round((performanceInfo.cpu.currentClock / performanceInfo.cpu.maxClock) * 100);
  };

  const getRAMUsagePercentage = (): number => {
    if (!performanceInfo || performanceInfo.ram.total === 0) return 0;
    return Math.round((performanceInfo.ram.used / performanceInfo.ram.total) * 100);
  };

  return (
    <div style={customStyles.mainContainer}>
      <Title level={2} style={{ 
        color: gradientStyles.textColor,
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        marginBottom: 24
      }}>
        <ThunderboltFilled style={{ marginRight: 8 }} />
        Tối ưu hiệu suất hệ thống
      </Title>

      <Alert
        message="💡 Thông tin quan trọng"
        description="Các tối ưu nâng cao sẽ tăng hiệu suất tối đa nhưng cũng tăng nhiệt độ và tiêu thụ điện năng. Đảm bảo hệ thống có tản nhiệt tốt và nguồn điện ổn định."
        type="info"
        showIcon
        style={{ marginBottom: 24, background: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}
      />

      {/* System Performance Info */}
      {performanceInfo && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card style={customStyles.card}>
              <Statistic
                title={<span style={{ color: gradientStyles.textColorSecondary }}>CPU</span>}
                value={performanceInfo.cpu.name}
                valueStyle={{ color: gradientStyles.textColor, fontSize: '14px' }}
                prefix={<ThunderboltFilled style={{ color: '#3b82f6' }} />}
              />
              <Descriptions size="small" column={1} style={{ marginTop: 16 }}>
                <Descriptions.Item label="Cores" style={{ color: gradientStyles.textColorSecondary }}>
                  {performanceInfo.cpu.cores} cores
                </Descriptions.Item>
                <Descriptions.Item label="Max Clock" style={{ color: gradientStyles.textColorSecondary }}>
                  {formatClockSpeed(performanceInfo.cpu.maxClock)}
                </Descriptions.Item>
                <Descriptions.Item label="Current Clock" style={{ color: gradientStyles.textColorSecondary }}>
                  {formatClockSpeed(performanceInfo.cpu.currentClock)}
                </Descriptions.Item>
              </Descriptions>
              <Progress 
                percent={getCPUUsagePercentage()} 
                size="small" 
                strokeColor="#3b82f6"
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card style={customStyles.card}>
              <Statistic
                title={<span style={{ color: gradientStyles.textColorSecondary }}>RAM</span>}
                value={formatBytes(performanceInfo.ram.total)}
                valueStyle={{ color: gradientStyles.textColor }}
                prefix={<RocketOutlined style={{ color: '#10b981' }} />}
              />
              <Descriptions size="small" column={1} style={{ marginTop: 16 }}>
                <Descriptions.Item label="Total" style={{ color: gradientStyles.textColorSecondary }}>
                  {formatBytes(performanceInfo.ram.total)}
                </Descriptions.Item>
                <Descriptions.Item label="Used" style={{ color: gradientStyles.textColorSecondary }}>
                  {formatBytes(performanceInfo.ram.used)}
                </Descriptions.Item>
                <Descriptions.Item label="Available" style={{ color: gradientStyles.textColorSecondary }}>
                  {formatBytes(performanceInfo.ram.available)}
                </Descriptions.Item>
              </Descriptions>
              <Progress 
                percent={getRAMUsagePercentage()} 
                size="small" 
                strokeColor="#10b981"
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card style={customStyles.card}>
              <Statistic
                title={<span style={{ color: gradientStyles.textColorSecondary }}>Power Plan</span>}
                value={performanceInfo.power.currentPlan}
                valueStyle={{ color: gradientStyles.textColor, fontSize: '14px' }}
                prefix={<SettingOutlined style={{ color: '#f59e0b' }} />}
              />
              <div style={{ marginTop: 16 }}>
                <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                  Available Plans:
                </Text>
                <div style={{ marginTop: 8 }}>
                  {performanceInfo.power.availablePlans.map((plan, index) => (
                    <Tag 
                      key={index} 
                      color={plan === performanceInfo.power.currentPlan ? 'green' : 'default'}
                      style={{ marginBottom: 4 }}
                    >
                      {plan}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Optimization Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card 
            title={
              <span style={{ color: gradientStyles.textColor }}>
                <RocketOutlined style={{ marginRight: 8 }} />
                Tối ưu RAM nâng cao
              </span>
            }
            style={customStyles.card}
            extra={
              optimizationStatus.ram ? (
                <CheckCircleOutlined style={{ color: '#10b981' }} />
              ) : (
                <ExclamationCircleOutlined style={{ color: '#f59e0b' }} />
              )
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: gradientStyles.textColorSecondary }}>
                Tối ưu RAM cho hiệu suất tối đa, đặc biệt cho game và ứng dụng nặng
              </Text>
                             <ul style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                 <li>• Tối ưu pagefile cố định (8-16GB)</li>
                 <li>• Tối ưu game networking</li>
                 <li>• Tăng priority cho game</li>
                 <li>• Tối ưu session management</li>
                 <li>• An toàn cho đa số máy</li>
               </ul>
              <Button 
                type="primary" 
                onClick={handleAdvancedRAMOptimization}
                loading={loading}
                icon={<RocketOutlined />}
                style={customStyles.button}
                disabled={optimizationStatus.ram}
              >
                {optimizationStatus.ram ? 'Đã tối ưu' : 'Tối ưu RAM nâng cao'}
              </Button>
            </Space>
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title={
              <span style={{ color: gradientStyles.textColor }}>
                <ThunderboltFilled style={{ marginRight: 8 }} />
                Tối ưu CPU nâng cao
              </span>
            }
            style={customStyles.card}
            extra={
              optimizationStatus.cpu ? (
                <CheckCircleOutlined style={{ color: '#10b981' }} />
              ) : (
                <ExclamationCircleOutlined style={{ color: '#f59e0b' }} />
              )
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text style={{ color: gradientStyles.textColorSecondary }}>
                Tối ưu CPU cho hiệu suất tối đa với tăng xung và nguồn điện
              </Text>
              <ul style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                <li>• Tăng xung CPU tối đa</li>
                <li>• Tăng nguồn điện cho CPU</li>
                <li>• Tối ưu power plan hiệu suất cao</li>
                <li>• Tối ưu cài đặt registry</li>
                <li>• Tăng hiệu năng tối đa</li>
              </ul>
              <Alert
                message="⚠️ Cảnh báo"
                description="Tối ưu này sẽ tăng nhiệt độ và tiêu thụ điện năng"
                type="warning"
                showIcon
                style={{ fontSize: '11px' }}
              />
              <Button 
                type="primary" 
                danger
                onClick={handleAdvancedCPUOptimization}
                loading={loading}
                icon={<ThunderboltFilled />}
                style={customStyles.button}
                disabled={optimizationStatus.cpu}
              >
                {optimizationStatus.cpu ? 'Đã tối ưu' : 'Tối ưu CPU nâng cao'}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Performance Tips */}
      <Card 
        title={
          <span style={{ color: gradientStyles.textColor }}>
            <InfoCircleOutlined style={{ marginRight: 8 }} />
            Mẹo tối ưu hiệu suất
          </span>
        }
        style={customStyles.card}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <Text strong style={{ color: gradientStyles.textColor }}>🔥 Nhiệt độ</Text>
              <br />
              <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                Theo dõi nhiệt độ CPU và GPU. Nhiệt độ cao có thể làm giảm hiệu suất.
              </Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Text strong style={{ color: gradientStyles.textColor }}>⚡ Nguồn điện</Text>
              <br />
              <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                Đảm bảo nguồn điện ổn định và đủ công suất cho hệ thống.
              </Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <Text strong style={{ color: gradientStyles.textColor }}>🎮 Game Mode</Text>
              <br />
              <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                Bật Game Mode để tối ưu hiệu suất cho game và ứng dụng.
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PerformanceOptimization;
