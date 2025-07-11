import { createContext, useState,useMemo, useContext} from 'react';
import {type ReactNode} from 'react'

import { mockApiData, type ExpertData } from '@/data/expertData';

// 定义在Context中共享的数据结构
interface Expert extends ExpertData{}

interface ExpertContextType {
  experts: Expert[];
  enabledExperts: Expert[];
  addExpert: (expert: Expert) => void;
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>
}
// 创建Context
const ExpertContext = createContext<ExpertContextType | undefined>(undefined);

// 创建 Provider 组件
export const ExpertProvider = ({ children }: { children: ReactNode }) => {
  const [experts, setExperts] = useState<Expert[]>(mockApiData);

  const addExpert = (newExpert: Expert) => {
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