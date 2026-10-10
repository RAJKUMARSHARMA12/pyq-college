import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './components/pages/DashboardPage';
import { CsvUpload } from './components/upload/CsvUpload';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'trades':
        return <DashboardPage />;
      case 'upload':
        return <CsvUpload />;
      default:
        return (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-secondary)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Module Under Construction</h2>
            <p>The {activeTab} module is being developed by the backend team.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header />
        <div className="page-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
