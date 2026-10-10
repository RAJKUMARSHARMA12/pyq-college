import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './components/pages/DashboardPage';
import { TradeDetailsPage } from './components/pages/TradeDetailsPage';
import { CsvUpload } from './components/upload/CsvUpload';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/trade/:tradeId" element={<TradeDetailsPage />} />
            
            {/* Fallback routes for sidebar tabs */}
            <Route path="/upload" element={<CsvUpload />} />
            <Route path="*" element={
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-secondary)' }}>
                <h2 style={{ marginBottom: '1rem' }}>Module Under Construction</h2>
                <p>This module is being developed by the backend team.</p>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
