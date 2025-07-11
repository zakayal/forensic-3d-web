import { createContext, useState,useMemo, useContext} from 'react';
import {type ReactNode} from 'react'

// 定义在Context中共享的数据结构
interface Expert {
  id: string; // 使用 string 类型的 key/id
  name: string;
  status: 'enabled' | 'disabled'
}

interface ExpertContextType {
  experts: Expert[];
  enabledExperts: Expert[];
  addExpert: (expert: Omit<Expert, 'id'>) => void;
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>
}
// 创建Context
const ExpertContext = createContext<ExpertContextType | undefined>(undefined);

// 模拟的鉴定人数据
const initialExpertsData: Expert[] = [
  { id: '1', name: '管理员', status: 'enabled' },
  { id: '2', name: '老师a', status: 'enabled' },
];

// 创建 Provider 组件
export const ExpertProvider = ({ children }: { children: ReactNode }) => {
  const [experts, setExperts] = useState<Expert[]>(initialExpertsData);

  // 定义添加鉴定人的逻辑
  const addExpert = (expertData: Omit<Expert, 'id'>) => {
    const newExpert: Expert = {
      id: `expert_${Date.now()}`, // 生成唯一 ID
      ...expertData,
    };
    // 使用函数式更新，保证状态更新的可靠性
    setExperts(prevExperts => [...prevExperts, newExpert]);
  };

  const enabledExperts = useMemo(() => {
    return experts.filter(expert => expert.status === 'enabled');
  }, [experts]);

  // value 属性就是要共享给所有子组件的数据和方法
  const value = { experts, enabledExperts, addExpert, setExperts };

  return (
    <ExpertContext.Provider value={value}>
      {children}
    </ExpertContext.Provider>
  );
};

// 创建一个自定义 Hook
export const useExperts = () => {
  const context = useContext(ExpertContext);
  if (context === undefined) {
    throw new Error('useExperts must be used within an ExpertProvider');
  }
  return context;
};