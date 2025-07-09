import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Modal, Space, Table, Form, Radio, DatePicker, Select } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';//导入图标
import dayjs from 'dayjs';

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
  { key: '1', id: 1, name: '张三', expert: '李医生', gender: '男', idCard: '110101199003071234', injuryTime: '2025-07-10 10:00', assessmentTime: '2025-07-11 14:30' },
  { key: '2', id: 2, name: '李四', expert: '王医生', gender: '女', idCard: '220202198805154321', injuryTime: '2025-07-12 09:00', assessmentTime: '2025-07-12 11:00' },
];

const InjuryManagementPage = () => {

  const [form] = Form.useForm()

  const [tableData, setTableData] = useState<InjuryRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  // 添加搜索关键词state
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  // 控制模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  // 添加state 来追踪key的身份证是否可见
  const [visibleIdCardKey, setVisibleIdCardKey] = useState<string | null>(null)

  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id' },
    { title: '被鉴伤人姓名', dataIndex: 'name', key: 'name' },
    { title: '鉴定人姓名', dataIndex: 'expert', key: 'expert' },
    { title: '性别', dataIndex: 'gender', key: 'gender' },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
      className: styles.idCardCell,
      render: (text: string, record: InjuryRecord) => {
        // 判断当前行的身份证是否应该可见
        const isVisible = visibleIdCardKey === record.key

        // 脱敏逻辑
        const maskedText = `${text.substring(0, 6)}************`

        const toggleVisibility = () => {
          // 如果已经可见，在点击就隐藏：否则就显示
          setVisibleIdCardKey(isVisible ? null : record.key)
        }

        return (
          <Space>
            <span>{isVisible ? text : maskedText}</span>
            <Button
              type='text'
              icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={toggleVisibility}
              className={styles.toggleVisibilityButton}
            />
          </Space>
        )
      }
    },
    { title: '受伤时间', dataIndex: 'injuryTime', key: 'injuryTime' },
    { title: '鉴伤时间', dataIndex: 'assessmentTime', key: 'assessmentTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: InjuryRecord) => (
        <Space size="middle">
          <a>查看</a>
          <a>编辑</a>
          <a
            style={{ color: 'red' }}
            onClick={() => handleDelete(record.key)} //绑定onClick事件
          >
            删除
          </a>
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
          scroll={{ x: 'max-content' }}
        />
      </div>

      <Modal
        title='新增被鉴伤人'
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        style={{top:30}}
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
              const newRecord: InjuryRecord = {
                // 模拟生成唯一 ID ，后续真实场景中由后端生成
                key: `new_${Date.now()}`,
                id: Date.now(),
                // antd 的 DataPicker 返回的是  Day.js 对象，需要格式化
                injuryTime: values.injuryTime.format('YYYY-MM-DD HH:mm:ss'),
                // 模拟鉴伤时间为当前时间
                assessmentTime: new Date().toLocaleString(),
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
            <DatePicker
              showTime
              style={{ width: '100%' }}
              disabledDate={(current) => {
                return current && current > dayjs().endOf('day')
              }}
            />
          </Form.Item>

          <Form.Item label='鉴定人' name="expertId">
            <Select placeholder="请选择鉴定人">
              <Select.Option value="1">李医生</Select.Option>
              <Select.Option value="2">王医生</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="案件描述" name="caseDescription">
            <Input.TextArea rows={1} placeholder="请输入案件描述" />
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