import { useNavigate } from 'react-router-dom'; // 1. 导入 useNavigate

const OperationHotKeysPage = () => {
    const navigate = useNavigate()
    return (
        <div style={{ color: 'white', padding: '20px' }}>
            <h1>操作快捷键</h1>
            {/* 我们可以加一个返回按钮 */}
            <button onClick={() => navigate(-1)}>返回</button>
        </div>
    );
};

export default OperationHotKeysPage;