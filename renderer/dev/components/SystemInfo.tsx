import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Table, Modal, message, Progress, Alert, Tag, Descriptions, Divider, Tabs, Statistic, List, Tooltip } from 'antd';
import { DesktopOutlined, ReloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, ClockCircleOutlined, DatabaseOutlined, HddOutlined, ThunderboltOutlined, VideoCameraOutlined, SettingOutlined, BarsOutlined } from '@ant-design/icons';
import HardwareIcon from './HardwareIcon';
import { gradientStyles, customStyles, tableStyles, modalStyles } from '../styles/theme';

const { Title, Text } = Typography;


interface SystemInfoProps {
  systemData: any;
  onRefresh: () => void;
}

const SystemInfo: React.FC<SystemInfoProps> = ({ systemData, onRefresh }) => {
  console.log('🔄 [SystemInfo] Component rendered with systemData:', systemData);
  
  
  
  const systemColumns = [
    {
      title: 'Thuộc tính',
      dataIndex: 'property',
      key: 'property',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const memoryColumns = [
    {
      title: 'Slot',
      dataIndex: 'slot',
      key: 'slot',
      width: 80,
    },
    {
      title: 'Dung lượng',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`,
      width: 100,
    },
    {
      title: 'Bus Speed',
      dataIndex: 'clockSpeed',
      key: 'clockSpeed',
      render: (speed: number) => `${speed} MHz`,
      width: 100,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
    },
    {
      title: 'Form Factor',
      dataIndex: 'formFactor',
      key: 'formFactor',
      width: 100,
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 120,
    },
    {
      title: 'Part Number',
      dataIndex: 'partNum',
      key: 'partNum',
      width: 150,
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNum',
      key: 'serialNum',
      width: 120,
    },
    {
      title: 'Bank',
      dataIndex: 'bank',
      key: 'bank',
      width: 150,
    },
    {
      title: 'Voltage (V)',
      key: 'voltage',
      render: (record: any) => (
        <div>
          <div>Configured: {record.voltageConfigured}V</div>
          <div>Min: {record.voltageMin}V</div>
          <div>Max: {record.voltageMax}V</div>
        </div>
      ),
      width: 120,
    },
  ];

  const diskColumns = [
    {
      title: 'Drive',
      dataIndex: 'mount',
      key: 'mount',
    },
    {
      title: 'Dung lượng',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`,
    },
    {
      title: 'Đã sử dụng',
      dataIndex: 'used',
      key: 'used',
      render: (used: number) => `${(used / 1024 / 1024 / 1024).toFixed(1)} GB`,
    },
    {
      title: 'Còn lại',
      dataIndex: 'available',
      key: 'available',
      render: (available: number) => `${(available / 1024 / 1024 / 1024).toFixed(1)} GB`,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Usage %',
      key: 'usage',
      render: (record: any) => {
        const usage = ((record.used / record.size) * 100).toFixed(1);
        return (
          <Tag color={Number(usage) > 80 ? 'red' : Number(usage) > 60 ? 'orange' : 'green'}>
            {usage}%
          </Tag>
        );
      },
    },
  ];

  const systemInfo = systemData?.system ? [
    { key: '1', property: 'Tên máy tính', value: systemData.system.hostname },
    { key: '2', property: 'Hãng sản xuất', value: systemData.system.manufacturer },
    { key: '3', property: 'Model', value: systemData.system.model },
    { key: '4', property: 'Serial Number', value: systemData.system.serial || 'N/A' },
    { key: '5', property: 'UUID', value: systemData.system.uuid || 'N/A' },
    { key: '6', property: 'SKU', value: systemData.system.sku || 'N/A' },
    { key: '7', property: 'Hệ điều hành', value: `${systemData.system.os.platform} ${systemData.system.os.release}` },
    { key: '8', property: 'Architecture', value: systemData.system.os.arch },
    { key: '9', property: 'Kernel', value: systemData.system.os.kernel },
    { key: '10', property: 'Build', value: systemData.system.os.build },
    { key: '11', property: 'Service Pack', value: systemData.system.os.servicepack || 'N/A' },
    { key: '12', property: 'UEFI', value: systemData.system.os.uefi ? 'Yes' : 'No' },
    { key: '13', property: 'Service Tag', value: systemData.system.serviceTag || 'N/A' },
  ] : [];

  const biosInfo = systemData?.system?.bios ? [
    { key: '1', property: 'BIOS Vendor', value: systemData.system.bios.vendor },
    { key: '2', property: 'BIOS Version', value: systemData.system.bios.version },
    { key: '3', property: 'BIOS Release', value: systemData.system.bios.release },
    { key: '4', property: 'BIOS Revision', value: systemData.system.bios.revision },
  ] : [];

  const memoryInfo = systemData?.memory?.modules?.map((module: any, index: number) => ({
    key: index,
    slot: `Slot ${index + 1}`,
    size: module.size,
    clockSpeed: module.clockSpeed,
    type: module.type,
    formFactor: module.formFactor,
    manufacturer: module.manufacturer,
    partNum: module.partNum,
    serialNum: module.serialNum,
    bank: module.bank,
    voltageConfigured: module.voltageConfigured,
    voltageMin: module.voltageMin,
    voltageMax: module.voltageMax,
  })) || [];

  const diskInfo = systemData?.disk?.map((disk: any, index: number) => ({
    key: index,
    ...disk,
  })) || [];

  // Tính toán usage
  const memoryUsage = systemData?.memory ? 
    ((systemData.memory.used / systemData.memory.total) * 100).toFixed(1) : 0;
  
  const diskUsage = systemData?.disk && systemData.disk.length > 0 ? 
    ((systemData.disk[0].used / systemData.disk[0].size) * 100).toFixed(1) : 0;

  // System Overview Cards
  const SystemOverview = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>CPU</span>}
              value={systemData?.cpu?.brand || 'N/A'}
              valueStyle={{ fontSize: '14px', color: gradientStyles.textColor }}
              prefix={<ThunderboltOutlined style={{ color: '#3f8600' }} />}
            />
            <Text style={{ color: gradientStyles.textColorSecondary }}>
              {systemData?.cpu?.cores || 0} cores @ {systemData?.cpu?.speed || 0} GHz
            </Text>
            
          </Card>
        </Col>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>Memory</span>}
              value={memoryUsage}
              suffix="%"
              valueStyle={{ color: gradientStyles.textColor }}
              prefix={<DatabaseOutlined style={{ color: '#cf1322' }} />}
            />
            <Text style={{ color: gradientStyles.textColorSecondary }}>
              {systemData?.memory ? 
                `${(systemData.memory.used / 1024 / 1024 / 1024).toFixed(1)} / ${(systemData.memory.total / 1024 / 1024 / 1024).toFixed(1)} GB` 
                : 'N/A'
              }
            </Text>
            
          </Card>
        </Col>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>GPU</span>}
              value={(systemData?.gpu && systemData.gpu.length > 0 ? systemData.gpu[0].model : 'N/A')}
              valueStyle={{ fontSize: '12px', color: gradientStyles.textColor }}
              prefix={<VideoCameraOutlined style={{ color: '#52c41a' }} />}
            />
            <Text style={{ color: gradientStyles.textColorSecondary }}>
              {systemData?.gpu && systemData.gpu.length > 0 ? 
                  `${systemData.gpu[0].vram} MB VRAM` : 'N/A'}
            </Text>
            
          </Card>
        </Col>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>Disk Usage (C:)</span>}
              value={diskUsage}
              suffix="%"
              valueStyle={{ color: gradientStyles.textColor }}
              prefix={<HddOutlined style={{ color: '#1890ff' }} />}
            />
            <Text style={{ color: gradientStyles.textColorSecondary }}>
              {systemData?.disk && systemData.disk.length > 0 ? 
                `${(systemData.disk[0].used / 1024 / 1024 / 1024).toFixed(1)} / ${(systemData.disk[0].size / 1024 / 1024 / 1024).toFixed(1)} GB` 
                : 'N/A'
              }
            </Text>
          </Card>
        </Col>

      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card 
            title={<span style={{ color: gradientStyles.textColor }}>Thông tin cơ bản</span>} 
            extra={<DesktopOutlined style={{ color: gradientStyles.textColor }} />}
            style={customStyles.card}
          >
            <Descriptions bordered column={1} size="small">
              {systemInfo.map(item => (
                <Descriptions.Item key={item.key} label={<span style={{ color: gradientStyles.textColorSecondary }}>{item.property}</span>}>
                  <span style={{ color: gradientStyles.textColorSecondary }}>{item.value}</span>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title={<span style={{ color: gradientStyles.textColor }}>BIOS Information</span>} 
            extra={<InfoCircleOutlined style={{ color: gradientStyles.textColor }} />}
            style={customStyles.card}
          >
            <Descriptions bordered column={1} size="small">
              {biosInfo.map(item => (
                <Descriptions.Item key={item.key} label={<span style={{ color: gradientStyles.textColorSecondary }}>{item.property}</span>}>
                  <span style={{ color: gradientStyles.textColorSecondary }}>{item.value}</span>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // CPU Tab
  const CpuTab = () => (
    <div>
      <Card title={<span style={{ color: gradientStyles.textColor }}>CPU Details</span>}
       extra={<SettingOutlined
       style={{ color: gradientStyles.textColor }}  />}
       style={customStyles.card}>
        {systemData?.cpu && (
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <Text strong style={{ fontSize: '16px', color: gradientStyles.textColor }}>{systemData.cpu.brand}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Manufacturer: {systemData.cpu.manufacturer}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Cores: {systemData.cpu.cores} (Physical: {systemData.cpu.physicalCores})</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Speed: {systemData.cpu.speed} GHz (Max: {systemData.cpu.speedMax} GHz)</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Socket: {systemData.cpu.socket}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Family: {systemData.cpu.family}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Model: {systemData.cpu.model}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Stepping: {systemData.cpu.stepping}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Revision: {systemData.cpu.revision}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Virtualization: {systemData.cpu.virtualization ? 'Yes' : 'No'}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong style={{ color: gradientStyles.textColor }}>Cache Information:</Text>
                  <br />
                <Text style={{ color: gradientStyles.textColor }}>L1d: {systemData.cpu.cache.l1d} KB</Text>
                <br />
                <Text style={{ color: gradientStyles.textColor }}>L1i: {systemData.cpu.cache.l1i} KB</Text>
                <br />
                <Text style={{ color: gradientStyles.textColor }}>L2: {(systemData.cpu.cache.l2 / 1024).toFixed(1)} MB</Text>
                <br />
                <Text style={{ color: gradientStyles.textColor }}>L3: {(systemData.cpu.cache.l3 / 1024).toFixed(1)} MB</Text>
              </div>
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );

  // Memory Tab
  const MemoryTab = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>Total Memory</span>}
              value={systemData?.memory ? (systemData.memory.total / 1024 / 1024 / 1024).toFixed(1) : 0}
              suffix="GB"
              valueStyle={{ color: '#1890ff' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>Used Memory</span>}
              value={systemData?.memory ? (systemData.memory.used / 1024 / 1024 / 1024).toFixed(1) : 0}
              suffix="GB"
              valueStyle={{ color: '#cf1322' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>Available Memory</span>}
              value={systemData?.memory ? (systemData.memory.available / 1024 / 1024 / 1024).toFixed(1) : 0}
              suffix="GB"
              valueStyle={{ color: '#52c41a' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={customStyles.card}>
            <Statistic
              title={<span style={{ color: gradientStyles.textColorSecondary }}>Memory Usage</span>}
              value={memoryUsage}
              suffix="%"
              valueStyle={{ color: Number(memoryUsage) > 80 ? '#cf1322' : Number(memoryUsage) > 60 ? '#fa8c16' : '#52c41a' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title={<span style={{ color: gradientStyles.textColorSecondary }}>Memory Details</span>}
           extra={<SettingOutlined
           style={{ color: gradientStyles.textColor }}  />}
           style={customStyles.card}>
            {systemData?.memory && (
              <div>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Total Memory</span>}>
                    {(systemData.memory.total / 1024 / 1024 / 1024).toFixed(2)} GB
                  </Descriptions.Item>
                  <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Used Memory</span>}>
                    {(systemData.memory.used / 1024 / 1024 / 1024).toFixed(2)} GB
                  </Descriptions.Item>
                  <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Free Memory</span>}>
                    {(systemData.memory.free / 1024 / 1024 / 1024).toFixed(2)} GB
                  </Descriptions.Item>
                  <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Available Memory</span>}>
                    {(systemData.memory.available / 1024 / 1024 / 1024).toFixed(2)} GB
                  </Descriptions.Item>
                  <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Active Memory</span>}>
                    {(systemData.memory.active / 1024 / 1024 / 1024).toFixed(2)} GB
                  </Descriptions.Item>
                  <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Swap Total</span>}>
                    {(systemData.memory.swaptotal / 1024 / 1024 / 1024).toFixed(2)} GB
                  </Descriptions.Item>
                  <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Swap Used</span>}>
                    {(systemData.memory.swapused / 1024 / 1024 / 1024).toFixed(2)} GB
                  </Descriptions.Item>
                  <Descriptions.Item label={<span style={{ color: gradientStyles.textColorSecondary }}>Swap Free</span>}>
                    {(systemData.memory.swapfree / 1024 / 1024 / 1024).toFixed(2)} GB
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <Progress 
                  percent={Number(((systemData.memory.used / systemData.memory.total) * 100).toFixed(1))} 
                  status="active"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title={<span style={{ color: gradientStyles.textColorSecondary }}>Memory Summary</span>}
           extra={<InfoCircleOutlined
           style={{ color: gradientStyles.textColor }}  />}
           style={customStyles.card}>
            {systemData?.memory?.modules && systemData.memory.modules.length > 0 ? (
              <div>
                <Text strong style={{ color: gradientStyles.textColor }}>Memory Configuration:</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Modules: {systemData.memory.modules.length}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Type: {systemData.memory.modules[0]?.type || 'Unknown'}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Speed: {systemData.memory.modules[0]?.clockSpeed || 0} MHz</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Form Factor: {systemData.memory.modules[0]?.formFactor || 'Unknown'}</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Voltage: {systemData.memory.modules[0]?.voltageConfigured || 0}V</Text>
                <br />
                <Text style={{ color: gradientStyles.textColorSecondary }}>Manufacturer: {systemData.memory.modules[0]?.manufacturer || 'Unknown'}</Text>
                <Divider />
                <Text strong style={{ color: gradientStyles.textColor }}>Module Details:</Text>
                <br />
                {systemData.memory.modules.map((module: any, index: number) => (
                  <div key={index} style={{ marginBottom: 8, padding: '8px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                    <Text strong style={{ color: gradientStyles.textColor }}>Slot {index + 1}:</Text>
                    <br />
                    <Text style={{ color: gradientStyles.textColorSecondary }}>Size: {(module.size / 1024 / 1024 / 1024).toFixed(1)} GB</Text>
                    <br />
                    <Text style={{ color: gradientStyles.textColorSecondary }}>Speed: {module.clockSpeed} MHz</Text>
                    <br />
                    <Text style={{ color: gradientStyles.textColorSecondary }}>Part: {module.partNum}</Text>
                    <br />
                    <Text style={{ color: gradientStyles.textColorSecondary }}>Serial: {module.serialNum}</Text>
                    <br />
                    <Text style={{ color: gradientStyles.textColorSecondary }}>Bank: {module.bank}</Text>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">No memory modules found</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title={<span style={{ color: gradientStyles.textColor }}>Memory Modules Detailed</span>}
           extra={<DatabaseOutlined
           style={{ color: gradientStyles.textColor }}  />}
           style={customStyles.card}>
            <Table 
              columns={memoryColumns} 
              dataSource={memoryInfo}
              pagination={false}
              size="small"
              scroll={{ x: 1200 }}
              style={customStyles.table}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  // GPU Tab
  const GpuTab = () => (
    <div>
      {systemData?.gpu && systemData.gpu.length > 0 ? (
        systemData.gpu.map((gpu: any, index: number) => (
          <Card 
            key={index} 
            title={<span style={{ color: gradientStyles.textColor }}>GPU {index + 1}: {gpu.model}</span>} 
            extra={<VideoCameraOutlined
             style={{ color: gradientStyles.textColor }}  />}
            style={customStyles.card}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>
                  <Text strong style={{ color: gradientStyles.textColor }}>GPU Information:</Text>
                  <br />
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Vendor: {gpu.vendor}</Text>
                  <br />
                  <Text style={{ color: gradientStyles.textColorSecondary }}>VRAM: {gpu.vram} MB</Text>
                  <br />
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Driver Version: {gpu.driverVersion}</Text>
                  <br />
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Bus: {gpu.bus}</Text>
                  <br />
                  <Text style={{ color: gradientStyles.textColorSecondary }}>PCI Bus: {gpu.pciBus}</Text>
                  {gpu.subDeviceId && (
                    <>
                      <br />
                      <Text style={{ color: gradientStyles.textColorSecondary }}>Sub Device ID: {gpu.subDeviceId}</Text>
                    </>
                  )}
                  {gpu.vramDynamic !== undefined && (
                    <>
                      <br />
                      <Text style={{ color: gradientStyles.textColorSecondary }}>VRAM Dynamic: {gpu.vramDynamic ? 'Yes' : 'No'}</Text>
                    </>
                  )}
                  {gpu.cores > 0 && (
                    <>
                      <br />
                      <Text style={{ color: gradientStyles.textColorSecondary }}>Cores: {gpu.cores}</Text>
                    </>
                  )}
                </div>
              </Col>
              <Col span={12}>
                {gpu.displays && gpu.displays.length > 0 && (
                  <div>
                    <Text strong style={{ color: gradientStyles.textColor }}>Displays ({gpu.displays.length}):</Text>
                    <br />
                    {gpu.displays.map((display: any, displayIndex: number) => (
                      <div key={displayIndex} style={{ 
                        padding: '8px', 
                        border: '1px solid #a09000', 
                        borderRadius: '4px', 
                        marginBottom: 8,
                        backgroundColor: display.main ? '#00CC66' : '#FF9900',
                        color: gradientStyles.textColorSecondary,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        <Text strong style={{ color: gradientStyles.textColor }}>{display.model || 'Generic Monitor'} {display.main ? '(Main)' : ''}</Text>
                        <br />
                        <Text style={{ color: gradientStyles.textColorSecondary }}>Vendor: {display.vendor || 'Unknown'}</Text>
                        <br />
                        <Text style={{ color: gradientStyles.textColorSecondary }}>Device: {display.deviceName}</Text>
                        <br />
                        <Text style={{ color: gradientStyles.textColorSecondary }}>Connection: {display.connection}</Text>
                        <br />
                        <Text style={{ color: gradientStyles.textColorSecondary }}>Resolution: {display.currentResX} x {display.currentResY}</Text>
                        <br />
                        <Text style={{ color: gradientStyles.textColorSecondary }}>Refresh Rate: {display.currentRefreshRate} Hz</Text>
                        <br />
                          <Text style={{ color: gradientStyles.textColorSecondary }}>Size: {display.sizeX}" x {display.sizeY}"</Text>
                        <br />
                        <Text style={{ color: gradientStyles.textColorSecondary }}>Position: ({display.positionX}, {display.positionY})</Text>
                        <br />
                        <Text style={{ color: gradientStyles.textColorSecondary }}>Pixel Depth: {display.pixelDepth} bit</Text>  
                        {display.builtin && (
                          <>
                            <br />
                            <Text style={{ color: gradientStyles.textColorSecondary }}>Built-in Display</Text>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        ))
      ) : (
        <Card title={<span style={{ color: gradientStyles.textColor }}>GPU Information</span>}
         extra={<VideoCameraOutlined
         style={{ color: gradientStyles.textColor }}  />}
         style={customStyles.card}>
          <Text style={{ color: gradientStyles.textColorSecondary }}>Không có thông tin GPU</Text>
        </Card>
      )}
    </div>
  );

  // Storage Tab
  const StorageTab = () => (
    <div>
      <Card title={<span style={{ color: gradientStyles.textColor }}>Storage Information</span>}
       extra={<HddOutlined
       style={{ color: gradientStyles.textColor }}  />}
       style={customStyles.card}>
        <Table 
          columns={diskColumns} 
          dataSource={diskInfo}
          pagination={false}
          size="small"
          scroll={{ x: 800 }}
          style={customStyles.table}
        />
      </Card>
    </div>
  );

  

  return (
    <div style={customStyles.mainContainer}>
      <Space style={{ marginBottom: 16 }}>
        <Title level={2} style={{ 
          color: gradientStyles.textColor,
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>Thông tin hệ thống</Title>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={onRefresh}
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
        <Tabs.TabPane tab="Tổng quan" key="overview" icon={<DesktopOutlined />}>
          <SystemOverview />
        </Tabs.TabPane>
        <Tabs.TabPane tab="CPU" key="cpu" icon={<ThunderboltOutlined />}>
          <CpuTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Memory" key="memory" icon={<DatabaseOutlined />}>
          <MemoryTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="GPU" key="gpu" icon={<VideoCameraOutlined />}>
          <GpuTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Storage" key="storage" icon={<HddOutlined />}>
          <StorageTab />
        </Tabs.TabPane>
        
      </Tabs>
    </div>
  );
};

export default SystemInfo; 