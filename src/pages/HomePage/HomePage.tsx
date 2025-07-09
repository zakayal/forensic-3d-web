import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

import StaticModelDisplay from '../../components/StaticModelDisplay/StaticModelDisplay';
import GlassButton from '../../components/GlassButton/GlassButton';

// 1. 导入你的 SVG 图标作为组件
import InjuryIcon from '@/assets/icons/injury-Management.svg?react';
import ExpertIcon from '@/assets/icons/appraiser-Management.svg?react';
import SettingsIcon from '@/assets/icons/system-Settings.svg?react';
import EvidenceIcon from '@/assets/icons/evidence-Management.svg?react';
import ShortcutsIcon from '@/assets/icons/operation-Hotkeys.svg?react';

// 2. 定义菜单项的数据类型
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

// 3. 创建菜单配置数组


const HomePage = () => {

  const navigate = useNavigate()

  const menuItems: MenuItem[] = [
    {
      id: 'injury',
      label: '鉴伤管理',
      icon: <InjuryIcon />,
      path: '/injury-management',
    },
    {
      id: 'expert',
      label: '鉴定人管理',
      icon: <ExpertIcon />,
      path: '/expert-management'
    },
    {
      id: 'settings',
      label: '系统设置',
      icon: <SettingsIcon />,
      path: '/system-settings',
    },
    {
      id: 'evidence',
      label: '物证管理',
      icon: <EvidenceIcon />,
      path: '/evidence-management',
    },
    {
      id: 'shortcuts',
      label: '操作快捷键',
      icon: <ShortcutsIcon />,
      path: '/shortcuts',
    },
  ];
  return (
    <div className={styles.container}>
      {/* 1. 我们不再需要 .menuArea 这个 div 了 */}
      <div className={styles.menuGrid}>
        {menuItems.map((item) => (
          <GlassButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            onClick={()=> navigate(item.path)}
          />
        ))}
      </div>

      {/* 2. 我们也不再需要 .modelArea 这个 div 了 */}
      {/* 3. 我们需要给模型组件一个新的包裹 div，以便于定位 */}
      <div className={styles.modelWrapper}>
        <StaticModelDisplay />
      </div>
    </div>
  );
};

export default HomePage;