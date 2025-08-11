import React, { useEffect, useState } from 'react';
import { Card, Space, Typography, Select, Button, message, Alert } from 'antd';
import { FolderOutlined, SwapOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ZaloManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [drives, setDrives] = useState<string[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadDrives = async () => {
      try {
        const res = await window.electronAPI.getAvailableDrives();
        if (Array.isArray(res) && res.length > 0) {
          // Chuẩn hóa: chấp nhận mảng string hoặc mảng object { drive: 'D:' }
          const letters = res
            .map((item: any) => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object') return item.drive || item.DeviceID || item.letter || '';
              return '';
            })
            .filter((d: string) => !!d)
            .map((d: string) => {
              // Thêm \\ nếu thiếu để thành dạng D:\
              if (/^[A-Za-z]:\\$/.test(d)) return d;
              if (/^[A-Za-z]:$/.test(d)) return d + '\\';
              return d;
            });
          setDrives(letters);
          setSelectedDrive(letters[0]);
        } else {
          setDrives([]);
        }
      } catch (e) {
        console.error('Lỗi khi lấy danh sách ổ:', e);
        message.error('Không thể lấy danh sách ổ đĩa');
      }
    };
    loadDrives();
  }, []);

  const handleMoveZalo = async () => {
    if (!selectedDrive) {
      message.warning('Vui lòng chọn ổ đích');
      return;
    }
    setLoading(true);
    try {
      const result = await window.electronAPI.moveZaloToDrive(selectedDrive);
      if (result?.success) {
        message.success(result.message || 'Di chuyển Zalo thành công');
      } else {
        message.error(result?.message || 'Không thể di chuyển Zalo');
      }
    } catch (e) {
      console.error('Di chuyển Zalo lỗi:', e);
      message.error('Có lỗi xảy ra khi di chuyển Zalo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>
          Quản lý Zalo
        </Title>
        <Text type="secondary">
          Di chuyển dữ liệu Zalo sang ổ đĩa khác để tiết kiệm dung lượng ổ hệ thống.
        </Text>

        <Alert
          type="info"
          showIcon
          message="Lưu ý"
          description="Đảm bảo Zalo đã thoát hoàn toàn trước khi di chuyển để tránh lỗi tệp đang sử dụng."
        />

        <Space>
          <Select
            style={{ minWidth: 200 }}
            placeholder="Chọn ổ đĩa"
            value={selectedDrive}
            onChange={setSelectedDrive}
            loading={loading}
          >
            {drives.map((d) => (
              <Option key={d} value={d}>{d}</Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            onClick={handleMoveZalo}
            loading={loading}
            disabled={!selectedDrive}
          >
            Di chuyển Zalo
          </Button>
        </Space>

        {drives.length === 0 && (
          <Alert
            style={{ marginTop: 12 }}
            type="warning"
            showIcon
            message="Không phát hiện ổ đĩa nào khả dụng"
            description="Vui lòng cắm thêm ổ ngoài hoặc kiểm tra quyền truy cập."
          />
        )}
      </Space>
    </Card>
  );
};

export default ZaloManager;


