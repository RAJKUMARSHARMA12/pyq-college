import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/trade/${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search by Trade ID (e.g., TRD_1000) and press Enter..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
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
