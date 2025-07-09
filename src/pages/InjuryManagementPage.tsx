import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Modal, Space, Table, Form, Radio, DatePicker, Select } from 'antd';
import styles from './InjuryManagementPage.module.css';

const { Search } = Input;
// 获取表单实例

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

  const [form] = Form.useForm()

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
        <Form
          form={form} //将创建的form实例与Form组件关联
          layout='vertical' //标签在输入框上方
          onFinish={(values) => {
            // onFinish 只会在所有校验都通过后触发
            console.log('表单校验成功,得到的数据：', values);
            // 执行提交数据的逻辑
          }}
        >
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder='请输入姓名' />
          </Form.Item>

          <Form.Item label="性别" name="gender" rules={[{ required: true, message: '请输入性别' }]}>
            <Radio.Group>
              <Radio value='男'>男</Radio>
              <Radio value='女'>女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="年龄" name="age" rules={[{ required: true, message: '请输入年龄' }]}>
            <Input placeholder="请输入年龄" type="number" />
          </Form.Item>

          <Form.Item label="身高(cm)" name="height" rules={[{ required: true, message: '请输入身高' }]}>
            <Input placeholder="请输入身高" type="number" suffix="cm" />
          </Form.Item>

          <Form.Item label="体重(kg)" name="weight" rules={[{ required: true, message: '请输入体重' }]}>
            <Input placeholder="请输入体重" type="number" suffix="kg" />
          </Form.Item>
          <Form.Item
            label="身份证号"
            name="idCard"
            rules={[
              { required: true, message: '请输入身份证号' },
              { len: 18, message: '身份证号必须为18位' }
            ]}
          >
            <Input placeholder='请输入身份证号' />
          </Form.Item>

          <Form.Item label="户籍地址" name="address">
            <Input placeholder="请输入户籍地址" />
          </Form.Item>

          <Form.Item label="受伤时间" name="injuryTime" rules={[{ required: true, message: '请选择受伤时间' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label='鉴定人' name="expertId">
            <Select placeholder="请选择鉴定人">
              <Select.Option value="1">李医生</Select.Option>
              <Select.Option value="2">王医生</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="案件描述" name="caseDescription">
            <Input.TextArea rows={4} placeholder="请输入案件描述" />
          </Form.Item>

          <Form.Item label="委托单位" name="clientUnit">
            <Input placeholder="请输入委托单位" />
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

export default InjuryManagementPage;