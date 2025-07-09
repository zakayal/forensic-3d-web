import { useNavigate } from "react-router-dom";

const SystemSettingsPage = () => {
  const navigate = useNavigate()
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>系统设置页面</h1>
      {/* 我们可以加一个返回按钮 */}
      <button onClick={() => navigate(-1)}>返回</button>
    </div>
  );
};

export default SystemSettingsPage;