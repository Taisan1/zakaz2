import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectsList } from './components/projects/ProjectsList';
import { UploadArea } from './components/upload/UploadArea';
import { AddEmployee } from './components/admin/AddEmployee';
import { EmployeesList } from './components/admin/EmployeesList';
import { SalaryManagement } from './components/admin/SalaryManagement';
import { Calendar } from './components/calendar/Calendar';
import { Script } from './components/script/Script';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectsList />;
      case 'add-employee':
        return <AddEmployee />;
      case 'employees':
        return <EmployeesList />;
      case 'salary':
        return <SalaryManagement />;
      case 'upload':
      case 'gallery':
      case 'design':
      case 'templates':
        return <UploadArea />;
      case 'calendar':
        return <Calendar />;
      case 'script':
        return <Script />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;