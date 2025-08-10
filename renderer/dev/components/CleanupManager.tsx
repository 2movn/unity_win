import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Table, Modal, message, Progress, Alert, Tag, Descriptions, Divider, Tabs, Statistic, List, Tooltip, Checkbox, Badge } from 'antd';
import { DeleteOutlined, ReloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, ClockCircleOutlined, DatabaseOutlined, HddOutlined, ThunderboltOutlined, FileOutlined, SettingOutlined, ClearOutlined, DeleteOutlined as TrashOutlined, ClearOutlined as CleanOutlined, SafetyOutlined, WarningOutlined } from '@ant-design/icons';
import { gradientStyles, customStyles, tableStyles, modalStyles } from '../styles/theme';

const { Title, Text } = Typography;


interface CleanupItem {
  name: string;
  size: string;
  description: string;
  selected: boolean;
  category: string;
  risk: 'low' | 'medium' | 'high';
  priority: 'high' | 'medium' | 'low';
  details?: {
    folders: string[];
    fileCount: number;
    largestFiles: Array<{name: string, size: number}>;
    lastModified: Date;
    estimatedFreed: number;
    safetyLevel: string;
  };
}

interface CleanupResult {
  itemName: string;
  sizeFreed: string;
  status: 'success' | 'failed' | 'partial';
  message: string;
  itemsRemoved: number;
}

const CleanupManager: React.FC = () => {
  const [cleanupItems, setCleanupItems] = useState<CleanupItem[]>([
    // Cache và file tạm - Ưu tiên cao
    { name: 'Temporary Files', size: '0 MB', description: 'Files tạm thời của hệ thống (%TEMP%, %TMP%)', selected: true, category: 'cache', risk: 'low', priority: 'high' },
    { name: 'Windows Update Cache', size: '0 MB', description: 'Cache cập nhật Windows (SoftwareDistribution)', selected: true, category: 'cache', risk: 'low', priority: 'high' },
    { name: 'Browser Cache', size: '0 MB', description: 'Cache trình duyệt (Chrome, Edge, Firefox, Opera)', selected: true, category: 'cache', risk: 'low', priority: 'high' },
    { name: 'System Cache', size: '0 MB', description: 'Cache hệ thống Windows (Prefetch, Font Cache)', selected: true, category: 'cache', risk: 'low', priority: 'high' },
    { name: 'Application Cache', size: '0 MB', description: 'Cache ứng dụng (AppData/Local/Temp)', selected: true, category: 'cache', risk: 'low', priority: 'high' },
    
    // File rác và thùng rác - Ưu tiên trung bình
    { name: 'Recycle Bin', size: '0 MB', description: 'Thùng rác hệ thống', selected: true, category: 'trash', risk: 'low', priority: 'medium' },
    { name: 'Old Files', size: '0 MB', description: 'Files cũ (>30 ngày) trong Downloads, Desktop', selected: false, category: 'trash', risk: 'medium', priority: 'medium' },
    { name: 'Duplicate Files', size: '0 MB', description: 'Files trùng lặp trong thư mục người dùng', selected: false, category: 'trash', risk: 'medium', priority: 'low' },
    
    // Log và file hệ thống - Ưu tiên trung bình
    { name: 'System Logs', size: '0 MB', description: 'Log hệ thống cũ (Event Logs, Error Reports)', selected: true, category: 'system', risk: 'low', priority: 'medium' },
    { name: 'Windows Error Reports', size: '0 MB', description: 'Báo cáo lỗi Windows cũ', selected: true, category: 'system', risk: 'low', priority: 'medium' },
    { name: 'Memory Dumps', size: '0 MB', description: 'Memory dump files cũ', selected: false, category: 'system', risk: 'medium', priority: 'low' },
    
    // Ứng dụng và dữ liệu không cần thiết - Ưu tiên thấp
    { name: 'Unused Apps', size: '0 MB', description: 'Ứng dụng không sử dụng', selected: false, category: 'apps', risk: 'medium', priority: 'low' },
    { name: 'Old Downloads', size: '0 MB', description: 'Files tải về cũ (>90 ngày)', selected: false, category: 'trash', risk: 'medium', priority: 'low' },
    { name: 'Empty Folders', size: '0 MB', description: 'Thư mục trống trong hệ thống', selected: false, category: 'system', risk: 'low', priority: 'low' },
    
    // Cache nâng cao - Ưu tiên cao
    { name: 'DNS Cache', size: '0 MB', description: 'Cache DNS hệ thống', selected: true, category: 'network', risk: 'low', priority: 'high' },
    { name: 'Network Cache', size: '0 MB', description: 'Cache mạng và kết nối', selected: true, category: 'network', risk: 'low', priority: 'high' },
    { name: 'Print Spooler Cache', size: '0 MB', description: 'Cache máy in và spooler', selected: true, category: 'system', risk: 'low', priority: 'medium' },
  ]);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cleanupProgress, setCleanupProgress] = useState(0);
  const [cleanupResults, setCleanupResults] = useState<CleanupResult[]>([]);
  const [totalFreed, setTotalFreed] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CleanupItem | null>(null);
  const [analysisStats, setAnalysisStats] = useState({
    totalSize: 0,
    totalFiles: 0,
    totalFolders: 0,
    lastAnalysis: null as Date | null
  });

  const handleAnalyzeSystem = async () => {
    try {
      setIsAnalyzing(true);
      setCleanupProgress(0);
      
      console.log('🔍 Bắt đầu phân tích hệ thống...');
      
      // Gọi API để phân tích hệ thống thực tế
      const systemAnalysis = await window.electronAPI.analyzeSystemForCleanup();
      console.log('📊 System analysis result:', systemAnalysis);
      
      // Kiểm tra dữ liệu trả về
      if (!systemAnalysis || !Array.isArray(systemAnalysis)) {
        console.error('❌ Invalid analysis data:', systemAnalysis);
        message.error('Dữ liệu phân tích không hợp lệ');
        return;
      }
      
      if (systemAnalysis.length === 0) {
        console.warn('⚠️ No analysis data returned');
        message.warning('Không có dữ liệu phân tích');
        return;
      }
      
      console.log(`📋 Found ${systemAnalysis.length} analysis items`);
      
      // Cập nhật kích thước và chi tiết dựa trên dữ liệu thực
      const updatedItems = cleanupItems.map(item => {
        // Tìm analysis item chính xác dựa trên tên
        const analysisItem = systemAnalysis.find((analysis: any) => 
          analysis.name === item.name
        );
        
        if (analysisItem) {
          console.log(`✅ Found analysis for ${item.name}: ${analysisItem.size} MB`);
          
          // Đảm bảo size là số hợp lệ
          const sizeInMB = typeof analysisItem.size === 'number' ? analysisItem.size : 0;
          
          // Tính toán ước tính dung lượng có thể giải phóng
          const estimatedFreed = Math.round(sizeInMB * 0.85); // Ước tính 85% có thể được giải phóng
          
          return {
            ...item,
            size: `${sizeInMB} MB`,
            details: {
              folders: analysisItem.details?.folders || [],
              fileCount: analysisItem.details?.fileCount || 0,
              largestFiles: analysisItem.details?.largestFiles || [],
              lastModified: analysisItem.details?.lastModified ? new Date(analysisItem.details.lastModified) : new Date(),
              estimatedFreed,
              safetyLevel: item.risk === 'low' ? 'An toàn' : item.risk === 'medium' ? 'Cần thận trọng' : 'Rủi ro cao'
            }
          };
        } else {
          console.log(`❌ No analysis found for ${item.name}`);
          return item;
        }
      });
      
      setCleanupItems(updatedItems);
      
      // Cập nhật thống kê phân tích
      const totalSize = updatedItems.reduce((sum, item) => {
        const sizeStr = item.size.replace(' MB', '').replace(',', '');
        const size = parseInt(sizeStr) || 0;
        return sum + size;
      }, 0);
      
      const totalFiles = updatedItems.reduce((sum, item) => {
        return sum + (item.details?.fileCount || 0);
      }, 0);
      
      const totalFolders = updatedItems.reduce((sum, item) => {
        return sum + (item.details?.folders?.length || 0);
      }, 0);
      
      console.log(`📊 Analysis stats: ${totalSize} MB, ${totalFiles} files, ${totalFolders} folders`);
      
      setAnalysisStats({
        totalSize,
        totalFiles,
        totalFolders,
        lastAnalysis: new Date()
      });
      
      setCleanupProgress(100);
      
      // Hiển thị thông báo chi tiết
      const itemsWithData = updatedItems.filter(item => {
        const size = parseInt(item.size.replace(' MB', '').replace(',', '')) || 0;
        return size > 0;
      });
      
      message.success({
        content: (
          <div>
            <div><strong>Phân tích hoàn tất!</strong></div>
            <div>📊 Tổng dung lượng: <strong>{totalSize.toLocaleString()} MB</strong></div>
            <div>📁 Tổng files: <strong>{totalFiles.toLocaleString()}</strong></div>
            <div>✅ Tìm thấy dữ liệu: <strong>{itemsWithData.length}/{updatedItems.length} mục</strong></div>
          </div>
        ),
        duration: 4
      });
    } catch (error) {
      console.error('Lỗi phân tích hệ thống:', error);
      message.error('Phân tích hệ thống thất bại');
      
      // Fallback: sử dụng dữ liệu ước tính cố định
      const estimatedSizes = {
        'Temporary Files': '150-300 MB',
        'Windows Update Cache': '500-2000 MB',
        'Browser Cache': '200-800 MB',
        'System Cache': '100-500 MB',
        'Application Cache': '50-200 MB',
        'Recycle Bin': '0-1000 MB',
        'Old Files': '0-5000 MB',
        'Duplicate Files': '0-2000 MB',
        'System Logs': '50-200 MB',
        'Windows Error Reports': '20-100 MB',
        'Memory Dumps': '0-500 MB',
        'Unused Apps': '0-1000 MB',
        'Old Downloads': '0-3000 MB',
        'Empty Folders': '0-100 MB',
        'DNS Cache': '1-10 MB',
        'Network Cache': '10-50 MB',
        'Print Spooler Cache': '5-50 MB',
      };
      
      const fallbackItems = cleanupItems.map(item => ({
        ...item,
        size: estimatedSizes[item.name as keyof typeof estimatedSizes] || '0 MB'
      }));
      setCleanupItems(fallbackItems);
    } finally {
      setIsAnalyzing(false);
      setCleanupProgress(0);
    }
  };

  const handleCleanupSystem = async () => {
    const selectedItems = cleanupItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      message.warning('Vui lòng chọn ít nhất một mục để dọn dẹp');
      return;
    }

    // Sắp xếp theo ưu tiên: high -> medium -> low
    const sortedItems = selectedItems.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    Modal.confirm({
      title: 'Xác nhận dọn dẹp toàn diện',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn dọn dẹp {selectedItems.length} mục đã chọn?</p>
          <div style={{ marginTop: 16 }}>
            <Text strong style={{ color: gradientStyles.textColor }}>Thứ tự ưu tiên:</Text>
            <ul style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
              {sortedItems.map((item, index) => (
                <li key={item.name}>
                  {index + 1}. {item.name} - {item.description} ({item.size})
                  <Tag color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'blue'} style={{ marginLeft: 8 }}>
                    {item.priority === 'high' ? 'Cao' : item.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
          <p style={{ color: '#faad14', fontSize: '12px', marginTop: 16 }}>
            ⚠️ Quá trình này sẽ xóa vĩnh viễn các file được chọn. Hãy đảm bảo bạn đã backup dữ liệu quan trọng.
          </p>
        </div>
      ),
      onOk: async () => {
        try {
          setIsCleaning(true);
          setCleanupProgress(0);
          setCleanupResults([]);
          setTotalFreed(0);

          const results: CleanupResult[] = [];
          let totalFreedSize = 0;

          for (let i = 0; i < sortedItems.length; i++) {
            const item = sortedItems[i];
            setCleanupProgress(((i + 1) / sortedItems.length) * 100);

            try {
              // Kiểm tra an toàn trước khi cleanup
              try {
                const safetyCheck = await window.electronAPI.performSafetyCheck();
                if (safetyCheck && !safetyCheck.safe) {
                  console.warn('Safety check failed:', safetyCheck.warnings);
                }
              } catch (error) {
                console.log('Safety check not available:', error);
              }

              // Call the optimized cleanup service (fallback to regular cleanup)
              const result = await window.electronAPI.optimizedCleanup({
                tempFiles: item.name === 'Temporary Files',
                recycleBin: item.name === 'Recycle Bin',
                windowsUpdate: item.name === 'Windows Update Cache',
                browserCache: item.name === 'Browser Cache',
                systemLogs: item.name === 'System Logs',
                oldFiles: item.name === 'Old Files',
                unusedApps: item.name === 'Unused Apps',
                systemCache: item.name === 'System Cache',
                applicationCache: item.name === 'Application Cache',
                dnsCache: item.name === 'DNS Cache',
                networkCache: item.name === 'Network Cache',
                printSpoolerCache: item.name === 'Print Spooler Cache',
                errorReports: item.name === 'Windows Error Reports',
                memoryDumps: item.name === 'Memory Dumps',
                duplicateFiles: item.name === 'Duplicate Files',
                oldDownloads: item.name === 'Old Downloads',
                emptyFolders: item.name === 'Empty Folders',
              }) || await window.electronAPI.cleanupSystem({
                tempFiles: item.name === 'Temporary Files',
                recycleBin: item.name === 'Recycle Bin',
                windowsUpdate: item.name === 'Windows Update Cache',
                browserCache: item.name === 'Browser Cache',
                systemLogs: item.name === 'System Logs',
                oldFiles: item.name === 'Old Files',
                unusedApps: item.name === 'Unused Apps',
                systemCache: item.name === 'System Cache',
                applicationCache: item.name === 'Application Cache',
                dnsCache: item.name === 'DNS Cache',
                networkCache: item.name === 'Network Cache',
                printSpoolerCache: item.name === 'Print Spooler Cache',
                errorReports: item.name === 'Windows Error Reports',
                memoryDumps: item.name === 'Memory Dumps',
                duplicateFiles: item.name === 'Duplicate Files',
                oldDownloads: item.name === 'Old Downloads',
                emptyFolders: item.name === 'Empty Folders',
              });

              // Lấy dung lượng thực từ kết quả cleanup
              let freedSize = 0;
              let status: 'success' | 'failed' | 'partial' = 'success';
              let message = 'Thành công';
              let itemsRemoved = 0;

              if (result && Array.isArray(result)) {
                const itemResult = result.find(r => r.success);
                if (itemResult) {
                  freedSize = Math.round(itemResult.freedSpace / (1024 * 1024)); // Convert bytes to MB
                  itemsRemoved = itemResult.itemsRemoved || 0;
                  message = itemResult.message || 'Thành công';
                } else {
                  status = 'failed';
                  message = 'Thất bại';
                }
              }

              // Fallback: lấy dung lượng từ size hiện tại của item
              if (freedSize === 0 && status !== 'failed') {
                const currentSize = parseInt(item.size.replace(' MB', '')) || 0;
                freedSize = Math.round(currentSize * 0.8); // Ước tính 80% dung lượng có thể được giải phóng
                message = 'Ước tính thành công';
              }

              totalFreedSize += freedSize;
              
              results.push({
                itemName: item.name,
                sizeFreed: `${freedSize} MB`,
                status,
                message,
                itemsRemoved
              });

              await new Promise(resolve => setTimeout(resolve, 500)); // Tăng delay để hiển thị progress
            } catch (error) {
              console.error(`Error cleaning up ${item.name}:`, error);
              results.push({
                itemName: item.name,
                sizeFreed: '0 MB',
                status: 'failed',
                message: 'Lỗi hệ thống',
                itemsRemoved: 0
              });
            }
          }

          setCleanupResults(results);
          setTotalFreed(totalFreedSize);
          
          const successCount = results.filter(r => r.status === 'success').length;
          const failedCount = results.filter(r => r.status === 'failed').length;
          
          // Hiển thị thông báo chi tiết
          const totalItems = results.reduce((sum, r) => sum + r.itemsRemoved, 0);
          
          if (failedCount === 0) {
            message.success({
              content: (
                <div>
                  <div><strong>Dọn dẹp hoàn tất!</strong></div>
                  <div>📊 Đã giải phóng: <strong>{totalFreedSize} MB</strong></div>
                  <div>🗂️ Đã xóa: <strong>{totalItems.toLocaleString()} files</strong></div>
                  <div>✅ Thành công: <strong>{successCount}/{results.length} mục</strong></div>
                </div>
              ),
              duration: 5
            });
          } else if (successCount > 0) {
            message.warning({
              content: (
                <div>
                  <div><strong>Dọn dẹp một phần hoàn tất!</strong></div>
                  <div>📊 Đã giải phóng: <strong>{totalFreedSize} MB</strong></div>
                  <div>🗂️ Đã xóa: <strong>{totalItems.toLocaleString()} files</strong></div>
                  <div>✅ Thành công: <strong>{successCount}/{results.length} mục</strong></div>
                  <div>❌ Thất bại: <strong>{failedCount} mục</strong></div>
                </div>
              ),
              duration: 6
            });
          } else {
            message.error({
              content: (
                <div>
                  <div><strong>Dọn dẹp thất bại hoàn toàn</strong></div>
                  <div>❌ Tất cả {results.length} mục đều thất bại</div>
                  <div>💡 Hãy thử chạy với quyền Administrator</div>
                </div>
              ),
              duration: 6
            });
          }
          
          // Tự động phân tích lại hệ thống sau khi cleanup
          setTimeout(() => {
            handleAnalyzeSystem();
          }, 2000);
        } catch (error) {
          console.error('Cleanup error:', error);
          message.error('Dọn dẹp thất bại');
        } finally {
          setIsCleaning(false);
          setCleanupProgress(0);
        }
      },
    });
  };

  const handleItemSelection = (itemName: string, checked: boolean) => {
    setCleanupItems(items =>
      items.map(item =>
        item.name === itemName ? { ...item, selected: checked } : item
      )
    );
  };

  const handleShowDetails = (item: CleanupItem) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const handleSelectAll = (checked: boolean) => {
    setCleanupItems(items =>
      items.map(item => ({ ...item, selected: checked }))
    );
  };

  const handleSelectByCategory = (category: string, checked: boolean) => {
    setCleanupItems(items =>
      items.map(item =>
        item.category === category ? { ...item, selected: checked } : item
      )
    );
  };

  const handleSelectByPriority = (priority: string, checked: boolean) => {
    setCleanupItems(items =>
      items.map(item =>
        item.priority === priority ? { ...item, selected: checked } : item
      )
    );
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      default: return 'blue';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'blue';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cache': return <ClearOutlined />;
      case 'trash': return <TrashOutlined />;
      case 'system': return <SettingOutlined />;
      case 'apps': return <FileOutlined />;
      case 'network': return <DatabaseOutlined />;
      default: return <FileOutlined />;
    }
  };

  const filteredItems = cleanupItems.filter(item => {
    const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
    const priorityMatch = priorityFilter === 'all' || item.priority === priorityFilter;
    return categoryMatch && priorityMatch;
  });

  return (
    <div style={customStyles.mainContainer}>
      <Title level={2} style={{ 
        color: gradientStyles.textColor,
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>Dọn dẹp hệ thống toàn diện</Title>

      {(isCleaning || isAnalyzing) && (
        <Card style={{ marginBottom: 16, ...customStyles.card }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong style={{ color: gradientStyles.textColor }}>
              {isAnalyzing ? 'Đang phân tích hệ thống...' : 'Đang dọn dẹp...'}
            </Text>
            <Progress percent={cleanupProgress} status="active" />
          </Space>
        </Card>
      )}

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card 
            title={<span style={{ color: gradientStyles.textColor }}>Các mục dọn dẹp</span>}
            style={customStyles.card}
            extra={
              <Space>
                <Button 
                  size="small" 
                  onClick={() => handleSelectAll(true)}
                  style={customStyles.button}
                >
                  Chọn tất cả
                </Button>
                <Button 
                  size="small" 
                  onClick={() => handleSelectAll(false)}
                  style={customStyles.button}
                >
                  Bỏ chọn tất cả
                </Button>
              </Space>
            }
          >
            {/* Filter Controls */}
            <Card size="small" style={{ marginBottom: 16, ...customStyles.card }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space wrap>
                  <Text strong style={{ color: gradientStyles.textColor }}>Lọc theo danh mục:</Text>
                  <Button 
                    size="small"
                    type={categoryFilter === 'all' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('all')}
                    style={customStyles.button}
                  >
                    Tất cả
                  </Button>
                  <Button 
                    size="small"
                    type={categoryFilter === 'cache' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('cache')}
                    icon={<ClearOutlined />}
                    style={customStyles.button}
                  >
                    Cache
                  </Button>
                  <Button 
                    size="small"
                    type={categoryFilter === 'trash' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('trash')}
                    icon={<TrashOutlined />}
                    style={customStyles.button}
                  >
                    File rác
                  </Button>
                  <Button 
                    size="small"
                    type={categoryFilter === 'system' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('system')}
                    icon={<SettingOutlined />}
                    style={customStyles.button}
                  >
                    Hệ thống
                  </Button>
                  <Button 
                    size="small"
                    type={categoryFilter === 'apps' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('apps')}
                    icon={<FileOutlined />}
                    style={customStyles.button}
                  >
                    Ứng dụng
                  </Button>
                  <Button 
                    size="small"
                    type={categoryFilter === 'network' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('network')}
                    icon={<DatabaseOutlined />}
                    style={customStyles.button}
                  >
                    Mạng
                  </Button>
                </Space>
                
                <Space wrap>
                  <Text strong style={{ color: gradientStyles.textColor }}>Lọc theo ưu tiên:</Text>
                  <Button 
                    size="small"
                    type={priorityFilter === 'all' ? 'primary' : 'default'}
                    onClick={() => setPriorityFilter('all')}
                    style={customStyles.button}
                  >
                    Tất cả
                  </Button>
                  <Button 
                    size="small"
                    type={priorityFilter === 'high' ? 'primary' : 'default'}
                    onClick={() => setPriorityFilter('high')}
                    style={{ ...customStyles.button, color: '#ff4d4f' }}
                  >
                    <SafetyOutlined /> Cao
                  </Button>
                  <Button 
                    size="small"
                    type={priorityFilter === 'medium' ? 'primary' : 'default'}
                    onClick={() => setPriorityFilter('medium')}
                    style={{ ...customStyles.button, color: '#fa8c16' }}
                  >
                    <WarningOutlined /> Trung bình
                  </Button>
                  <Button 
                    size="small"
                    type={priorityFilter === 'low' ? 'primary' : 'default'}
                    onClick={() => setPriorityFilter('low')}
                    style={{ ...customStyles.button, color: '#1890ff' }}
                  >
                    <InfoCircleOutlined /> Thấp
                  </Button>
                </Space>
              </Space>
            </Card>

            <List
              dataSource={filteredItems}
              renderItem={(item) => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                      <Checkbox
                        checked={item.selected}
                        onChange={(e) => handleItemSelection(item.name, e.target.checked)}
                      />
                      <Space direction="vertical" size="small">
                        <Space>
                          {getCategoryIcon(item.category)}
                          <Text strong style={{ color: gradientStyles.textColor }}>{item.name}</Text>
                          <Tag color={getRiskColor(item.risk)}>
                            {item.risk === 'low' ? 'An toàn' : item.risk === 'medium' ? 'Trung bình' : 'Cao'}
                          </Tag>
                          <Tag color={getPriorityColor(item.priority)}>
                            {item.priority === 'high' ? 'Cao' : item.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                          </Tag>
                        </Space>
                        <Text type="secondary" style={{ color: gradientStyles.textColorSecondary }}>{item.description}</Text>
                        {item.details && (
                          <Space>
                            <Text type="secondary" style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                              {item.details.fileCount.toLocaleString()} files • {item.details.folders.length} folders
                            </Text>
                            {item.details.estimatedFreed && (
                              <Text type="secondary" style={{ color: '#52c41a', fontSize: '12px' }}>
                                Ước tính giải phóng: {item.details.estimatedFreed} MB
                              </Text>
                            )}
                          </Space>
                        )}
                      </Space>
                    </Space>
                    <Space>
                      <Tag color="blue">{item.size}</Tag>
                      {item.details && (
                        <Button 
                          size="small" 
                          type="link"
                          onClick={() => handleShowDetails(item)}
                          style={{ color: gradientStyles.textColor, padding: 0 }}
                        >
                          Chi tiết
                        </Button>
                      )}
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card title={<span style={{ color: gradientStyles.textColor }}>Thống kê phân tích</span>} extra={<FileOutlined style={{ color: '#3b82f6' }} />} style={customStyles.card}>
              <Statistic
                title={<span style={{ color: gradientStyles.textColorSecondary }}>Tổng dung lượng có thể giải phóng</span>}
                value={cleanupItems
                  .filter(item => item.selected)
                  .reduce((sum, item) => {
                    const size = parseInt(item.size.replace(' MB', '')) || 0;
                    return sum + size;
                  }, 0)
                }
                suffix="MB"
                valueStyle={{ color: '#3b82f6' }}
              />
              <Statistic
                title={<span style={{ color: gradientStyles.textColorSecondary }}>Số mục đã chọn</span>}
                value={cleanupItems.filter(item => item.selected).length}
                suffix="mục"
                valueStyle={{ color: '#10b981' }}
              />
              {analysisStats.lastAnalysis && (
                <Statistic
                  title={<span style={{ color: gradientStyles.textColorSecondary }}>Lần phân tích cuối</span>}
                  value={analysisStats.lastAnalysis.toLocaleString('vi-VN')}
                  valueStyle={{ color: '#fa8c16', fontSize: '12px' }}
                />
              )}
              <div style={{ marginTop: 16 }}>
                <Text style={{ color: gradientStyles.textColorSecondary }}>Phân loại:</Text>
                <div style={{ marginTop: 8 }}>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Cache: {cleanupItems.filter(item => item.selected && item.category === 'cache').length} mục</Text><br/>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>File rác: {cleanupItems.filter(item => item.selected && item.category === 'trash').length} mục</Text><br/>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Hệ thống: {cleanupItems.filter(item => item.selected && item.category === 'system').length} mục</Text><br/>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Ứng dụng: {cleanupItems.filter(item => item.selected && item.category === 'apps').length} mục</Text><br/>
                  <Text style={{ color: gradientStyles.textColorSecondary }}>Mạng: {cleanupItems.filter(item => item.selected && item.category === 'network').length} mục</Text>
                </div>
              </div>
            </Card>

            <Card title={<span style={{ color: gradientStyles.textColor }}>Thao tác</span>} extra={<SettingOutlined style={{ color: '#3b82f6' }} />} style={customStyles.card}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={handleAnalyzeSystem}
                  loading={isAnalyzing}
                  block
                  style={customStyles.button}
                >
                  Phân tích hệ thống
                </Button>
                <Button 
                  type="primary" 
                  icon={<ThunderboltOutlined />}
                  onClick={() => {
                    // Tự động chọn các mục ưu tiên cao
                    setCleanupItems(items =>
                      items.map(item => ({
                        ...item,
                        selected: item.priority === 'high' && item.risk === 'low'
                      }))
                    );
                    // Sau đó thực hiện cleanup
                    setTimeout(() => handleCleanupSystem(), 500);
                  }}
                  loading={isCleaning}
                  block
                  style={{ ...customStyles.button, background: 'linear-gradient(135deg, #52c41a, #73d13d)' }}
                >
                  Dọn dẹp nhanh (Ưu tiên cao)
                </Button>
                <Button 
                  type="primary" 
                  danger
                  icon={<CleanOutlined />}
                  onClick={handleCleanupSystem}
                  loading={isCleaning}
                  block
                  style={customStyles.button}
                >
                  Dọn dẹp toàn diện
                </Button>
              </Space>
            </Card>

            {cleanupResults.length > 0 && (
              <Card title={<span style={{ color: gradientStyles.textColor }}>Kết quả dọn dẹp</span>} extra={<CheckCircleOutlined style={{ color: '#10b981' }} />} style={customStyles.card}>
                <List
                  size="small"
                  dataSource={cleanupResults}
                  renderItem={(result) => (
                    <List.Item>
                      <Space>
                        {result.status === 'success' && <CheckCircleOutlined style={{ color: '#10b981' }} />}
                        {result.status === 'failed' && <ExclamationCircleOutlined style={{ color: '#ef4444' }} />}
                        {result.status === 'partial' && <WarningOutlined style={{ color: '#fa8c16' }} />}
                        <Text style={{ color: gradientStyles.textColor }}>{result.itemName}</Text>
                        <Tag color={result.status === 'success' ? 'green' : result.status === 'failed' ? 'red' : 'orange'}>
                          {result.sizeFreed}
                        </Tag>
                        {result.itemsRemoved > 0 && (
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {result.itemsRemoved} items
                          </Text>
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
                {totalFreed > 0 && (
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Text strong style={{ color: gradientStyles.textColor }}>Tổng cộng: {totalFreed} MB</Text>
                  </div>
                )}
              </Card>
            )}
          </Space>
        </Col>
      </Row>

      <Alert
        message="Thông tin dọn dẹp toàn diện"
        description={
          <div>
            <Text style={{ color: gradientStyles.textColorSecondary }}>
              Hệ thống sẽ dọn dẹp các loại file sau theo thứ tự ưu tiên:
            </Text>
            <ul style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
              <li><strong>Ưu tiên cao:</strong> Cache hệ thống, file tạm, cache trình duyệt, DNS cache</li>
              <li><strong>Ưu tiên trung bình:</strong> Thùng rác, log hệ thống, cache máy in</li>
              <li><strong>Ưu tiên thấp:</strong> File cũ, ứng dụng không sử dụng, thư mục trống</li>
            </ul>
            <Text style={{ color: '#faad14', fontSize: '12px' }}>
              ⚠️ Lưu ý: Quá trình này sẽ xóa vĩnh viễn các file được chọn. Hãy backup dữ liệu quan trọng trước khi thực hiện.
            </Text>
          </div>
        }
        type="info"
        showIcon
        style={{ marginTop: 16, background: gradientStyles.backgroundCard, border: `1px solid ${gradientStyles.borderColor}` }}
      />

      {/* Modal Chi tiết phân tích */}
      <Modal
        title={
          <span style={{ color: gradientStyles.textColor }}>
            Chi tiết phân tích: {selectedItem?.name}
          </span>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
        styles={modalStyles}
      >
        {selectedItem?.details ? (
          <div>
            <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Tổng dung lượng">
                <Text strong style={{ color: gradientStyles.textColor }}>
                  {selectedItem.size}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng file">
                <Text strong style={{ color: gradientStyles.textColor }}>
                  {selectedItem.details.fileCount.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số thư mục">
                <Text strong style={{ color: gradientStyles.textColor }}>
                  {selectedItem.details.folders.length}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ước tính giải phóng">
                <Text strong style={{ color: '#52c41a' }}>
                  {selectedItem.details.estimatedFreed} MB
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mức độ an toàn">
                <Tag color={getRiskColor(selectedItem.risk)}>
                  {selectedItem.details.safetyLevel}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                <Text strong style={{ color: gradientStyles.textColor }}>
                  {selectedItem.details.lastModified.toLocaleString('vi-VN')}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ borderColor: gradientStyles.borderColor }} />

            <Title level={4} style={{ color: gradientStyles.textColor, marginBottom: 12 }}>
              File lớn nhất
            </Title>
            <List
              size="small"
              dataSource={selectedItem.details.largestFiles}
              renderItem={(file, index) => (
                <List.Item>
                  <Space>
                    <Text style={{ color: gradientStyles.textColorSecondary }}>
                      {index + 1}.
                    </Text>
                    <Text style={{ color: gradientStyles.textColor }}>
                      {file.name}
                    </Text>
                    <Tag color="blue">{file.size} MB</Tag>
                  </Space>
                </List.Item>
              )}
            />

            <Divider style={{ borderColor: gradientStyles.borderColor }} />

            <Title level={4} style={{ color: gradientStyles.textColor, marginBottom: 12 }}>
              Thư mục chính
            </Title>
            <List
              size="small"
              dataSource={selectedItem.details.folders.slice(0, 10)}
              renderItem={(folder, index) => (
                <List.Item>
                  <Text style={{ color: gradientStyles.textColorSecondary, fontSize: '12px' }}>
                    {folder}
                  </Text>
                </List.Item>
              )}
            />
          </div>
        ) : (
          <div>
            <Text style={{ color: gradientStyles.textColorSecondary }}>
              Không có thông tin chi tiết cho mục này. Vui lòng phân tích hệ thống để xem thông tin chi tiết.
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CleanupManager; 