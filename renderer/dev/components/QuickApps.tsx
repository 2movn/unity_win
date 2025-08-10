import React, { useEffect, useMemo, useState } from 'react';
import { Card, Typography, Space, Button, Input, message, Avatar, Tag, Spin, Table, Select } from 'antd';
import { DownloadOutlined, LinkOutlined, ReloadOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface QuickAppItem {
  id?: string | number;
  name?: string;
  'app-name'?: string;
  link?: string;
  url?: string;
  version?: string;
  description?: string;
  icon?: string;
  category?: string;
}

const DATA_URL = 'https://raw.githubusercontent.com/2movn/unity_win/setup-app.json';

const QuickApps: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<QuickAppItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data?.app) ? data.app : [];
      // attach id if not present
      const normalized = list.map((item: QuickAppItem, idx: number) => ({
        ...item,
        id: item.id ?? idx + 1,
      }));
      setApps(normalized);
    } catch (e) {
      console.error('Tải danh sách ứng dụng lỗi:', e);
      message.error('Không thể tải danh sách ứng dụng');
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const openLink = async (url?: string) => {
    const target = url || undefined;
    if (!target) {
      message.warning('Link không hợp lệ');
      return;
    }
    try {
      await window.electronAPI.openExternal(target);
    } catch (e) {
      console.error('Mở link lỗi:', e);
      message.error('Không thể mở liên kết');
    }
  };

  const handleDownload = async (item: QuickAppItem) => {
    const url = item.url || item.link;
    if (!url) {
      message.warning('Không có link tải');
      return;
    }
    const suggested = `${(item.name || item['app-name'] || 'app').replace(/[^a-zA-Z0-9._-]+/g, '_')}${item.version ? '-' + item.version : ''}${url.endsWith('.exe') ? '.exe' : url.endsWith('.zip') ? '.zip' : ''}`;
    try {
      const res = await window.electronAPI.downloadFile(url, suggested);
      if (res?.success) {
        message.success('Đã tải về: ' + res.path);
      } else {
        message.error(res?.message || 'Tải xuống thất bại');
      }
    } catch (e) {
      console.error('Tải ứng dụng lỗi:', e);
      message.error('Không thể tải ứng dụng');
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    apps.forEach(a => { if (a.category) set.add(a.category); });
    return Array.from(set);
  }, [apps]);

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      const name = (a.name || a['app-name'] || '').toLowerCase();
      const matchKeyword = name.includes(keyword.toLowerCase());
      const matchCategory = category ? a.category === category : true;
      return matchKeyword && matchCategory;
    });
  }, [apps, keyword, category]);

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>
            Tải nhanh ứng dụng
          </Title>
          <Space>
            <Input.Search
              placeholder="Tìm ứng dụng..."
              allowClear
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 260 }}
            />
            <Select
              allowClear
              placeholder="Chọn danh mục"
              style={{ width: 200 }}
              value={category}
              onChange={setCategory}
              options={categories.map(c => ({ value: c, label: c }))}
            />
            <Button icon={<ReloadOutlined />} onClick={fetchApps} loading={loading}>
              Làm mới
            </Button>
          </Space>
        </div>
        <Table
          rowKey={(r) => String(r.id ?? (r.name || r['app-name']))}
          loading={loading}
          dataSource={filtered}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: loading ? <Spin /> : 'Không có dữ liệu' }}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              width: 80,
              render: (_: any, __: QuickAppItem, index: number) => <span>{index + 1}</span>
            },
            {
              title: 'Icon',
              dataIndex: 'icon',
              width: 80,
              render: (val: string) => <Avatar src={val} icon={<AppstoreOutlined />} />
            },
            {
              title: 'Tên ứng dụng',
              dataIndex: 'name',
              render: (_: any, item: QuickAppItem) => (
                <span>
                  {item.name || item['app-name']}
                  {item.version ? <Tag style={{ marginLeft: 8 }}>{item.version}</Tag> : null}
                </span>
              )
            },
            {
              title: 'Giới thiệu',
              dataIndex: 'description',
              ellipsis: true,
            },
            {
              title: 'Download',
              key: 'action',
              width: 150,
              render: (_: any, item: QuickAppItem) => (
                <Space>
                  <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleDownload(item)}>
                    Tải
                  </Button>
                  <Button icon={<LinkOutlined />} onClick={() => openLink(item.url || item.link)} />
                </Space>
              )
            }
          ]}
        />
      </Space>
    </Card>
  );
};

export default QuickApps;


