import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Modal, Space, Table, Form, App } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// 1. 导入我们创建的自定义 Hook
import { useCrudTable } from '../../hooks/useCrudTables';
import { useExperts } from '@/contexts/ExpertContext';
import styles from './ExpertManagementPage.module.css';

import { mockApiData,type ExpertData as ExpertRecord } from '@/data/expertData';

const { Search } = Input;

const ExpertManagementPage = () => {
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
  const { addExpert, experts, setExperts } = useExperts()

  // 2. 核心改动：用一行 useCrudTable 调用替换掉所有旧的 state 和 effect
  const {
    tableData,
    loading,
    searchKeyword,
    setTableData,
    setLoading,
    handleSearch,
    handleReset,
    setSearchKeyword,
  } = useCrudTable<ExpertRecord>({
    initialData: mockApiData,
    getKey: (record) => record.key,
    filterFn: (record, keyword) =>
      record.name.includes(keyword) ||
      record.badgeNumber.includes(keyword) ||
      record.unitName.includes(keyword),
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ExpertRecord | null>(null);
  const [visibleContact, setVisibleContact] = useState<string | null>(null);

  const handelToggleStatus = (recordToToggle: ExpertRecord) => {
    const isEnabling = recordToToggle.status === 'disabled'
    const actionText = isEnabling ? '已启用' : '已禁用'

    modal.confirm({
      title: ` 确认${actionText}`,
      content: `您确定要${actionText}鉴定人 "${recordToToggle.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setLoading(true)
        setTimeout(() => {

          const newStatus: 'enabled' | 'disabled' = isEnabling ? 'enabled' : 'disabled'

          const newData = tableData.map(item =>
            item.key === recordToToggle.key
              ? { ...item, status: newStatus }
              : item
          )
          setTableData(newData)

          const contextData = experts.map(item =>
            item.key === recordToToggle.key
              ? { ...item, status: newStatus }
              : item
          );
          setExperts(contextData);

          setLoading(false);
          message.success(`${actionText}成功`);
        }, 500);
      }
    })
  }

  // 4. columns 定义中的 handleDelete 直接使用从 Hook 获取的函数
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 80 },
    { title: '鉴定人姓名', dataIndex: 'name', key: 'name' },
    { title: '警号', dataIndex: 'badgeNumber', key: 'badgeNumber' },
    { title: '单位名称', dataIndex: 'unitName', key: 'unitName' },
    {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact',
      className: styles.idContact,
      render: (text: string, record: ExpertRecord) => {
        const isVisible = visibleContact === record.key;
        const maskedText = `${text.substring(0, 3)}****${text.substring(7, 11)}`;
        const toggleVisibility = () => {
          setVisibleContact(isVisible ? null : record.key);
        };
        return (
          <Space>
            <span>{isVisible ? text : maskedText}</span>
            <Button
              type='text'
              icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={toggleVisibility}
              className={styles.toggleVisibilityButton}
            ></Button>
          </Space>
        );
      }
    },
    { title: '地址', dataIndex: 'address', key: 'address' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: ExpertRecord) => (
        <Space size="middle">
          <a onClick={() => showEditModal(record)}>编辑</a>
          <a
            style={{ color: record.status === 'enabled' ? 'blue' : 'red' }}
            onClick={() => handelToggleStatus(record)}
          >
            {record.status === 'enabled' ? '已启用' : '已禁用'}
          </a>
        </Space>
      ),
    },
  ];

  // 5. fetchData, useEffect 等函数已被移除，因为它们的逻辑都在 Hook 里了

  // --- 组件特有的方法 ---
  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsFormModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsFormModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const showEditModal = (record: ExpertRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsFormModalOpen(true);
  };

  // 6. 更新表单提交函数，使用从 Hook 获取的 setLoading 和 setTableData
  const handleFormSubmit = (values: Omit<ExpertRecord, 'key' | 'id' |'status'>) => {
    setLoading(true); // <-- 使用 Hook 的 setLoading

    setTimeout(() => {
      if (editingRecord) {
        setTableData(prevData =>
          prevData.map(item =>
            item.key === editingRecord.key ? { ...item, ...values } : item
          )
        );
        message.success('修改成功');
      } else {
        const newRecord: ExpertRecord = {
          key: `new_${Date.now()}`,
          id: tableData.length >0 ? Math.max(...tableData.map(i => i.id), 0) + 1 : 1,
          ...values,
          status:'enabled'
        };
        setTableData(prevData => [newRecord, ...prevData]);
        message.success('新增成功');

        addExpert(newRecord)
      }
      setLoading(false); // <-- 使用 Hook 的 setLoading
      setIsFormModalOpen(false);
      setEditingRecord(null);
    }, 500);
  };

  // 7. JSX 渲染部分几乎没有变化，因为它只关心状态和函数，不关心它们来自哪里
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          {'< 鉴定人管理'}
        </Link>
      </div>

      <div className={styles.actionBar}>
        <Button type="primary" onClick={showAddModal}>+ 新增鉴定人</Button>
        <Space>
          <span>关键词搜索:</span>
          <Search
            placeholder="请输入关键词"
            style={{ width: 200 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
          />
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </div>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['2', '10', '20', '50'],
            showTotal: (total) => `共 ${total} 条记录`,
            defaultPageSize: 2,
          }}
        />
      </div>

      <Modal
        title={editingRecord ? '编辑鉴定人' : '新增鉴定人'} // 动态标题
        open={isFormModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        style={{ top: 30 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
          }
        }}
      >
        <Form
          className={styles.compactForm}
          form={form}
          layout='vertical'
          onFinish={handleFormSubmit}
        >
          {/* 表单项保持不变 */}
          <Form.Item label="鉴定人姓名" name="name" rules={[{ required: true, message: '请输入鉴定人姓名' }]}>
            <Input placeholder='请输入鉴定人姓名' />
          </Form.Item>
          <Form.Item label="警号" name="badgeNumber" rules={[{ required: true, message: '请输入警号' }]}>
            <Input placeholder='请输入警号' />
          </Form.Item>
          <Form.Item label="单位名称" name="unitName" rules={[{ required: true, message: '请输入单位名称' }]}>
            <Input placeholder="请输入单位名称" />
          </Form.Item>
          <Form.Item label="联系方式" name="contact" rules={[{ required: true, message: '请输入联系方式' }]}>
            <Input placeholder="请输入联系方式" />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input placeholder="请输入地址" />
          </Form.Item>
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