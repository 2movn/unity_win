import React from 'react';
import { 
  DesktopOutlined, 
  HddOutlined, 
  ThunderboltOutlined, 
  VideoCameraOutlined 
} from '@ant-design/icons';
import { gradientStyles } from '../styles/theme';

interface HardwareIconProps {
  type: 'cpu' | 'ram' | 'ssd' | 'gpu';
  size?: number;
  color?: string;
  className?: string;
}

const HardwareIcon: React.FC<HardwareIconProps> = ({ 
  type, 
  size = 32, 
  color = '#1890ff',
  className 
}) => {

  const getIconComponent = () => {
    switch (type) {
      case 'cpu':
        return <DesktopOutlined />;
      case 'ram':
        return <ThunderboltOutlined />;
      case 'ssd':
        return <HddOutlined />;
      case 'gpu':
        return <VideoCameraOutlined />;
      default:
        return <DesktopOutlined />;
    }
  };

  return (
    <div 
      style={{ 
        fontSize: `${size}px`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        background: gradientStyles.primaryGradient,
        borderRadius: '8px',
        padding: '8px',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      }}
      className={className}
    >
      {getIconComponent()}
    </div>
  );
};

export default HardwareIcon;
