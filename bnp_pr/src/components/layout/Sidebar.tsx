import React from 'react';
import { Activity, AlertTriangle, FileUp, Home, Settings, PieChart, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'trades', label: 'Trade Explorer', icon: <Activity size={20} /> },
    { id: 'upload', label: 'Upload Events', icon: <FileUp size={20} /> },
    { id: 'sla', label: 'SLA Monitoring', icon: <AlertTriangle size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <ShieldCheck className="logo-icon" size={28} />
          <span>TradeTrace</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};
