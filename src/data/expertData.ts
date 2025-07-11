// 1. 定义可复用的接口
export interface ExpertData {
  key: string;
  id: number;
  name: string;
  badgeNumber: string;
  unitName: string;
  contact: string;
  address: string;
  status: 'enabled' | 'disabled';
}

// 2. 将模拟数据放在这里，并将其导出
export const mockApiData: ExpertData[] = [
  { key: '1', id: 1, name: '管理员', badgeNumber: '00001', unitName: '法医鉴定中心', contact: '13800138000', address: 'XX市公安局A栋501室', status: 'enabled' },
  { key: '2', id: 2, name: '老师a', badgeNumber: '00002', unitName: '法医鉴定中心', contact: '13800138001', address: 'XX市公安局A栋501室', status: 'enabled' },
];