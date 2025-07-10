import { useState, useCallback } from 'react';
import { Modal } from 'antd';

// 1. 定义 Hook 的参数类型
interface UseCrudTableProps<T> {
  initialData: T[];
  // 我们需要一个方法来从项目 T 中获取唯一的 key
  getKey: (item: T) => string;
  filterFn?: (item: T, keyword: string) => boolean;
}

// 2. 使用泛型 <T> 定义我们的 Hook
// T 必须是一个对象，并且至少有一个 key 属性，所以我们使用 extends 约束它
export function useCrudTable<T extends { key: string }>({ initialData, getKey }: UseCrudTableProps<T>) {
  const [tableData, setTableData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // fetchData 现在是通用的了，但搜索逻辑需要调整
  // 思考：我们如何让搜索逻辑也变得通用？
  // 一个简单的（但不是最优的）方法是假设所有对象都能被转为字符串来搜索
  // 更高级的方法是传入一个自定义的搜索函数
  const fetchData = useCallback((keyword: string = '') => {
    setLoading(true);
    setTimeout(() => {
      const resultData = keyword
        ? initialData.filter(item => 
            // 将整个对象转换为字符串进行一个非常粗略的搜索
            JSON.stringify(item).toLowerCase().includes(keyword.toLowerCase())
          )
        : initialData;
      setTableData(resultData);
      setLoading(false);
    }, 500);
  }, [initialData]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    fetchData(value);
  };

  const handleReset = () => {
    setSearchKeyword('');
    fetchData('');
  };
  
  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这条记录吗？此操作不可撤销',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          // 注意这里我们使用了传入的 getKey 函数来做对比
          const newData = tableData.filter(item => getKey(item) !== key);
          setTableData(newData);
          setLoading(false);
          // 可以在这里加一个成功的回调函数，比如 message.success('删除成功')
        }, 500);
      },
    });
  };
  
  // 3. 返回所有组件需要的状态和方法
  return {
    tableData,
    loading,
    searchKeyword,
    setTableData, // 我们也需要返回 setTableData 用于新增/编辑
    setLoading,   // 同上
    handleSearch,
    handleReset,
    handleDelete,
    setSearchKeyword, // 让输入框能成为受控组件
  };
}