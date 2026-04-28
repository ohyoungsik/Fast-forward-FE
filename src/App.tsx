import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';

import DashboardPage from './pages/DashboardPage';
import InfrastructureMonitoringPage from './pages/InfrastructureMonitoringPage';
import AccessSecurityLogsPage from './pages/AccessSecurityLogsPage';
import WebApplicationLogsPage from './pages/WebApplicationLogsPage';
import NginxLogsPage from './pages/NginxLogsPage';
import KernelLogsPage from './pages/KernelLogsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/infra" element={<InfrastructureMonitoringPage />} />
        <Route path="/access-security-logs" element={<AccessSecurityLogsPage />} />
        <Route path="/webapp-logs" element={<WebApplicationLogsPage />} />
        <Route path="/nginx-logs" element={<NginxLogsPage />} />
        <Route path="/kernel-logs" element={<KernelLogsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}