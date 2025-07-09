import React from 'react';
import styles from './GlassButton.module.css';

// 定义组件所需的 Props 类型
interface GlassButtonProps {
  icon: React.ReactNode; // 使用 React.ReactNode 类型，可以接受 JSX 元素，非常灵活
  label: string;
  onClick: () => void; // 一个不带参数、无返回值的函数
}

const GlassButton: React.FC<GlassButtonProps> = ({ icon, label, onClick }) => {
  return (
    <button className={styles.glassButton} onClick={onClick}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default GlassButton;