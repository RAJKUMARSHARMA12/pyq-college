import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Search by Trade ID, Client..." />
      </div>
      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <div className="avatar">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};
