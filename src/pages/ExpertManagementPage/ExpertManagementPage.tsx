import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Modal, Space, Table, Form } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';//导入图标
import styles from './ExpertManagementPage.module.css';

const { Search } = Input;
// 获取表单实例

interface ExpertRecord {
  key: string;
  id: number;
  name: string;
  badgeNumber: string;
  unitName: string;
  contact: string;
  address: string;
}

// 模拟的api数据
const mockApiData: ExpertRecord[] = [
  { key: '1', id: 1, name: '管理员', badgeNumber: '00001', unitName: '法医鉴定中心', contact: '13800138000', address: 'XX市公安局A栋501室' },
  { key: '2', id: 1, name: '老师a', badgeNumber: '00002', unitName: '法医鉴定中心', contact: '13800138001', address: 'XX市公安局A栋501室' },
];

const ExpertManagementPage = () => {

  const [form] = Form.useForm()

  const [tableData, setTableData] = useState<ExpertRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  // 添加搜索关键词state
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  // 控制模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  // 添加state 来追踪key的身份证是否可见
  const [visibleContact, setVisibleContact] = useState<string | null>(null)

  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id' ,width: 80},
    { title: '鉴定人姓名', dataIndex: 'name', key: 'name' },
    { title: '警号', dataIndex: 'badgeNumber', key: 'badgeNumber' },
    { title: '单位名称', dataIndex: 'unitName', key: 'unitName' },
    { title: '联系方式', 
      dataIndex: 'contact', 
      key: 'contact', 
      className: styles.idContact,
      render:(text: string,record:ExpertRecord) =>{
        const isVisible = visibleContact === record.key

        const maskedText = `${text.substring(0,3)}****${text.substring(7,11)}`

        const toggleVisibility = () => {
          setVisibleContact(isVisible ? null : record.key)
        }

        return (
          <Space>
            <span>{isVisible ? text : maskedText}</span>
            <Button
              type='text'
              icon={isVisible ? <EyeInvisibleOutlined/> : <EyeOutlined/>}
              onClick={toggleVisibility}
              className={styles.toggleVisibilityButton}
            ></Button>
          </Space>
        )
      }

    },
    { title: '地址', dataIndex: 'address', key: 'address' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ExpertRecord) => (
        <Space size="middle">
          <a>编辑</a>
          <a
            style={{ color: 'blue' }}
            onClick={() => handleDelete(record.key)} //绑定onClick事件
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  const fetchData = (keyword: string = '') => {
    setLoading(true);
    setTimeout(() => {
      const resultData = keyword
        ? mockApiData.filter(item => item.name.includes(keyword) || item.badgeNumber.includes(keyword) || item.unitName.includes(keyword))
        : mockApiData;
      setTableData(resultData);
      setLoading(false);
    }, 500);
  };

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
    form.resetFields() //取消时也清空表单
  }

  // 删除函数，用于删除记录
  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这条记录吗？此操作不可撤销',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 用户点击了确认
        console.log(`准备删除 key 为 ${key}的记录`);

        setLoading(true)

        // 模拟异步删除
        setTimeout(() => {
          // 使用filter 创建一个不包含删除项的新数组
          const newData = tableData.filter(item => item.key !== key)
          setTableData(newData)

          setLoading(false)
          console.log('删除成功');
        }, 500)
      },
      onCancel: () => {
        // 用户点击了取消
        console.log('取消删除');
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={styles.pageContainer}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          {'< 鉴定人管理'}
        </Link>
      </div>

      {/* 操作与过滤栏 */}
      <div className={styles.actionBar}>
        <Button type="primary" onClick={showModal}>+ 新增鉴定人</Button>
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
          scroll={{ x: 'max-content' }}
          pagination={{
            showSizeChanger: true, // 显示每页条数切换器
            pageSizeOptions: ['2', '10', '20', '50'], // 自定义每页条数选项
            showTotal: (total) => `共 ${total} 条记录`, // 显示总条数
            defaultPageSize: 2, // 默认每页显示2条，方便查看效果
          }}
        />
      </div>

      <Modal
        title='新增鉴定人'
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        style={{ top: 30 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)', // 允许内容区最大高度为视窗高度减去200像素
            // 当内容超出时，自动显示垂直滚动条
            overflowY: 'auto',
          }
        }}
      >
        <Form
          className={styles.compactForm}
          form={form} //将创建的form实例与Form组件关联
          layout='vertical' //标签在输入框上方
          onFinish={(values) => {
            console.log('表单校验成功,得到的数据：', values);

            // 1.开始一个模拟的提交过程
            setLoading(true)

            // 2.模拟异步提交到服务器的延迟
            setTimeout(() => {
              // 3.创建一条新纪录
              const newRecord: ExpertRecord = {
                // 模拟生成唯一 ID ，后续真实场景中由后端生成
                key: `new_${Date.now()}`,
                id: Date.now(),
                // 从表单values中获取其他所有数据
                ...values
              }

              // 4.使用不可变的方式更新表格数据
              setTableData(prevData => [newRecord, ...prevData]) //将新纪录添加到数组的最前面

              // 5.收尾工作
              setLoading(false) //关闭加载状态
              setIsModalVisible(false) //关闭模态框
              form.resetFields() //清空表单字段，为下次新增做准备

              console.log('新增成功', newRecord);
            }, 500)
          }}
        >
          <Form.Item label="鉴定人姓名" name="name" rules={[{ required: true, message: '请输入鉴定人姓名' }]}>
            <Input placeholder='请输入鉴定人姓名' />
          </Form.Item>

          <Form.Item label="警号" name="badgeNumber" rules={[{ required: true, message: '请输入警号' }]}>
            <Input placeholder='请输入警号' />
          </Form.Item>

          <Form.Item label="单位名称" name="unitName" rules={[{ required: true, message: '请输入单位名称' }]}>
            <Input placeholder="请输入单位名称"/>
          </Form.Item>

          <Form.Item label="联系方式" name="contact" rules={[{ required: true, message: '请输入联系方式' }]}>
            <Input placeholder="请输入联系方式" />
          </Form.Item>

          <Form.Item label="地址" name="address">
            <Input placeholder="请输入地址" />
          </Form.Item>

          {/* 表单提交 */}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button onClick={handleModalCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpertManagementPage;