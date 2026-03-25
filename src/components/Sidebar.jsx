import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, History, Settings, Users, Wifi } from 'lucide-react';

export default function Sidebar({ isOpen }) {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/subscriptions', label: 'Subscriptions', icon: Wifi },
    { path: '/payment-methods', label: 'Payment Methods', icon: CreditCard },
    { path: '/payment-history', label: 'Payment History', icon: History },
    { path: '/admin', label: 'Admin Panel', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <div className="logo-container">
        <Wifi size={28} />
        <span className="logo-text">Starlink Manager</span>
      </div>
      <nav className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span className="nav-text">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
