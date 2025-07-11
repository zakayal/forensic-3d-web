import { useState, useCallback } from 'react';
import { message, Modal } from 'antd';

// 1. 定义 Hook 的参数类型
interface UseCrudTableProps<T> {
  initialData: T[];
  // 我们需要一个方法来从项目 T 中获取唯一的 key
  getKey: (item: T) => string;
  filterFn?: (item: T, keyword: string) => boolean;
}

// 2. 使用泛型 <T> 定义我们的 Hook
export function useCrudTable<T extends { key: string }>({ initialData, getKey,filterFn }: UseCrudTableProps<T>) {
  const [tableData, setTableData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const fetchData = useCallback((keyword: string = '') => {
    setLoading(true);
    setTimeout(() => {
      let resultData = initialData;

      if (keyword && filterFn) {
        resultData = initialData.filter(item => filterFn(item, keyword));
      }
      
      setTableData(resultData);
      setLoading(false);
    }, 500);
  }, [initialData, filterFn]);

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
          const newData = tableData.filter(item => getKey(item) !== key);
          setTableData(newData);
          setLoading(false);
          message.success('删除成功')
        }, 500);
      },
    });
  };
  
  return {
    tableData,
    loading,
    searchKeyword,
    setTableData, 
    setLoading,   
    handleSearch,
    handleReset,
    handleDelete,
    setSearchKeyword, 
  };
}