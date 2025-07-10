import { createContext, useState, useContext,type ReactNode } from 'react';

// 1. 定义我们要在 Context 中共享的数据类型
// 我们需要鉴定人列表，以及添加新鉴定人的方法
interface Expert {
  id: string; // 使用 string 类型的 key/id
  name: string;
}

interface ExpertContextType {
  experts: Expert[];
  addExpert: (expert: Omit<Expert, 'id'>) => void;
}

// 2. 创建 Context，并提供一个默认值
// 默认值通常用于测试或在没有 Provider 的情况下防止应用崩溃
const ExpertContext = createContext<ExpertContextType | undefined>(undefined);

// 3. 创建 Provider 组件
// 这个组件将包裹我们的整个应用（或部分应用）
export const ExpertProvider = ({ children }: { children: ReactNode }) => {
  // 在 Provider 内部，我们使用 useState 来真正地存储和管理状态
  const [experts, setExperts] = useState<Expert[]>([
    // 提供一些初始数据，模拟从API获取
    { id: '1', name: '李医生' },
    { id: '2', name: '王医生' },
    { id: '3', name: '赵医生' },
    { id: '4', name: '孙医生' },
  ]);

  // 定义添加鉴定人的逻辑
  const addExpert = (expertData: Omit<Expert, 'id'>) => {
    const newExpert: Expert = {
      id: `expert_${Date.now()}`, // 生成唯一 ID
      ...expertData,
    };
    // 使用函数式更新，保证状态更新的可靠性
    setExperts(prevExperts => [...prevExperts, newExpert]);
    console.log('New expert added to context:', newExpert);
  };

  // value 属性就是要共享给所有子组件的数据和方法
  const value = { experts, addExpert };

  return (
    <ExpertContext.Provider value={value}>
      {children}
    </ExpertContext.Provider>
  );
};

// 4. 创建一个自定义 Hook，简化 Context 的使用
// 这样其他组件就不需要同时导入 useContext 和 ExpertContext 了
export const useExperts = () => {
  const context = useContext(ExpertContext);
  if (context === undefined) {
    throw new Error('useExperts must be used within an ExpertProvider');
  }
  return context;
};