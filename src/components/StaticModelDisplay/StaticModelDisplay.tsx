import styles from './StaticModelDisplay.module.css';

const StaticModelDisplay = () => {
  return (
    <div className={styles.wrapper}>
      <img
        // 我们直接使用根路径，因为 Vite 会把 public 目录下的文件放到根目录
        src="/humanoid-wireframe.svg"
        alt="Humanoid Wireframe Model"
        className={styles.modelImage}
      />
    </div>
  );
};

export default StaticModelDisplay;