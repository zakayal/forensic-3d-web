// src/App.tsx
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { App as AntdApp, ConfigProvider } from 'antd'

import HomePage from './pages/HomePage/HomePage';
import InjuryManagementPage from './pages/InjuryManagementPage';
import ExpertManagementPage from './pages/ExpertManagementPage';
import SystemSettingsPage from './pages/SystemSettingsPage';
import EvidenceManagementPage from './pages/EvidenceManagementPage';
import OperationHotKeysPage from './pages/OperationHotKeysPage';

import './App.css';

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/injury-management" element={<InjuryManagementPage />} />
        <Route path="/expert-management" element={<ExpertManagementPage />} />
        <Route path="/system-settings" element={<SystemSettingsPage />} />
        <Route path='/evidence-management' element={<EvidenceManagementPage />}/>
        <Route path='/shortcuts' element={<OperationHotKeysPage />} />
      </Routes>
    </Router>
  );
}

function App(){
  return (
    <AntdApp>
      <AppContent/>
    </AntdApp>
  )
}

export default App;