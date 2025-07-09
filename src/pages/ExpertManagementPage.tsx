import { useNavigate } from "react-router-dom";
const ExpertManagementPage = () => {
    const navigate = useNavigate(); // 2. 获取 navigate 函数
  
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>鉴定人管理</h1> 
      <button onClick={() => navigate(-1)}>返回</button>
    </div>
  );
};

export default ExpertManagementPage;