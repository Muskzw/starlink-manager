import { Bell, Search, Menu } from 'lucide-react';

export default function Topbar({ toggleSidebar }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  return (
    <header className="topbar">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="btn-icon">
          <Menu size={20} />
        </button>
        <div className="search-bar flex items-center">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search subscriptions, customers..." className="search-input" />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div style={{ position: 'relative' }}>
          <button className="btn-icon">
            <Bell size={20} />
          </button>
          <span style={{ 
            position: 'absolute', 
            top: -2, right: -2, 
            background: 'var(--danger-color)', 
            width: 10, height: 10, 
            borderRadius: '50%',
            border: '2px solid white' 
          }}></span>
        </div>
        
        <div className="user-profile" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name || 'Admin User'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.email || 'admin@starops.com'}</span>
          </div>
          <img src={`https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+') || 'Admin+User'}&background=4318FF&color=fff`} alt="Profile" className="avatar" />
        </div>
      </div>
    </header>
  );
}
