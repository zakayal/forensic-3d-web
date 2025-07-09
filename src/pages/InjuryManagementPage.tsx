import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Modal, Space, Table } from 'antd';
import styles from './InjuryManagementPage.module.css';

const { Search } = Input;

interface InjuryRecord {
  key: string;
  id: number;
  name: string;
  expert: string;
  gender: '男' | '女';
  idCard: string;
  injuryTime: string;
  assessmentTime: string;
}

// 模拟的api数据
const mockApiData: InjuryRecord[] = [
  { key: '1', id: 1, name: '张三', expert: '李医生', gender: '男', idCard: '110101...', injuryTime: '2025-07-10 10:00', assessmentTime: '2025-07-11 14:30' },
  { key: '2', id: 2, name: '李四', expert: '王医生', gender: '女', idCard: '220202...', injuryTime: '2025-07-12 09:00', assessmentTime: '2025-07-12 11:00' },
];

const InjuryManagementPage = () => {

  const [tableData, setTableData] = useState<InjuryRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  // 添加搜索关键词state
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  // 控制模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id' },
    { title: '被鉴伤人姓名', dataIndex: 'name', key: 'name' },
    { title: '鉴定人姓名', dataIndex: 'expert', key: 'expert' },
    { title: '性别', dataIndex: 'gender', key: 'gender' },
    { title: '身份证号', dataIndex: 'idCard', key: 'idCard' },
    { title: '受伤时间', dataIndex: 'injuryTime', key: 'injuryTime' },
    { title: '鉴伤时间', dataIndex: 'assessmentTime', key: 'assessmentTime' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看</a>
          <a>编辑</a>
          <a style={{ color: 'red' }}>删除</a>
        </Space>
      ),
    },
  ];

  const fetchData = (keyword: string = '') => {
    console.log('开始获取数据,关键词：', `${keyword}`);
    setLoading(true)

    setTimeout(() => {
      let resultData = mockApiData

      if (keyword) {
        resultData = mockApiData.filter(item =>
          item.name.includes(keyword) ||
          item.expert.includes(keyword) ||
          item.idCard.includes(keyword)
        )
      }
      console.log('数据获取成功', resultData);
      setTableData(resultData)
      setLoading(false)
    }, 500)
  }

  // 搜索函数
  const handleSearch = (value: string) => {
    setSearchKeyword(value)
    fetchData(value)
  }

  // 重置函数
  const handleReset = () => {
    setSearchKeyword('')
    fetchData('')
  }

  // 打开模态框
  const showModal = () => {
    setIsModalVisible(true)
  }

  // 关闭模态框
  const handleModalCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={styles.pageContainer}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          {'< 鉴伤管理'}
        </Link>
      </div>

      {/* 操作与过滤栏 */}
      <div className={styles.actionBar}>
        <Button type="primary" onClick={showModal}>新增被鉴伤人</Button>
        <Space>
          <span>关键词搜索:</span>
          <Search
            placeholder="请输入关键词"
            style={{ width: 200 }}
            value={searchKeyword} // 将input的值与state绑定
            onChange={(e) => setSearchKeyword(e.target.value)} //让输入框成为受控组件
            onSearch={handleSearch} //绑定搜索事件
          />
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </div>

      {/* 数据表格区 */}
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
        />
      </div>

      <Modal
        title='新增被鉴伤人'
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <p>未来的表单区域</p>
      </Modal>
    </div>
  );
};

export default InjuryManagementPage;