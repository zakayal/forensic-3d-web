import { useNavigate } from 'react-router-dom'; // 1. 导入 useNavigate

const EvidenceManagementPage = () => {
  const navigate = useNavigate(); // 2. 获取 navigate 函数

  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>物证管理</h1> 
      <button onClick={() => navigate(-1)}>返回</button>
    </div>
  );
};

export default EvidenceManagementPage;