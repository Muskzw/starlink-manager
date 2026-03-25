import { useState, useEffect } from 'react';
import { Save, Bell, Globe, User, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [saving, setSaving] = useState(false);

  // Load user data
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin User","email":"admin@starops.com"}');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSave = () => {
    setSaving(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 800)),
      {
        loading: 'Saving preferences...',
        success: 'Settings saved successfully!',
        error: 'Error saving settings.',
      }
    ).finally(() => setSaving(false));
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    toast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, { icon: theme === 'light' ? '🌙' : '☀️' });
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Settings</h1>
          <p className="text-muted">Manage your account preferences and system parameters.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2.5rem', maxWidth: '850px' }}>
        
        {/* Notification Preferences */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="btn-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <Bell size={20} />
            </div>
            <h2 className="card-title" style={{ margin: 0, fontSize: '1.25rem' }}>Notification Preferences</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-4" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', transition: 'var(--transition)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>3-Day Built-in Reminder</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Receive an alert 3 days before standard billing cycle.</div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="flex justify-between items-center p-4" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', transition: 'var(--transition)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>1-Day Urgent Reminder</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Final warning before card is drafted.</div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="flex justify-between items-center p-4" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', transition: 'var(--transition)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>Same-Day Alert</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Immediate notification when payment succeeds or fails.</div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="btn-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <Globe size={20} />
            </div>
            <h2 className="card-title" style={{ margin: 0, fontSize: '1.25rem' }}>System Preferences</h2>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center p-4" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex items-center gap-4">
                <div style={{ padding: '0.5rem', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <Moon size={20} className="text-muted" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>Dark Mode Experience</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Toggle the global interface between High-Contrast Dark and Clean Light modes.</div>
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={theme === 'dark'} onChange={handleToggleTheme} />
                <span className="slider round"></span>
              </label>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label" style={{ marginBottom: '0.25rem' }}>Default Currency</label>
                <select className="input-field" defaultValue="USD ($)" style={{ width: '100%', cursor: 'pointer' }}>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>CAD ($)</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label" style={{ marginBottom: '0.25rem' }}>Date Format</label>
                <select className="input-field" defaultValue="MM/DD/YYYY" style={{ width: '100%', cursor: 'pointer' }}>
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="btn-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <User size={20} />
            </div>
            <h2 className="card-title" style={{ margin: 0, fontSize: '1.25rem' }}>Profile Information</h2>
          </div>
          
          <div className="flex flex-col gap-5">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" className="input-field" defaultValue={user.name} />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" className="input-field" defaultValue={user.email} />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  const promise = new Promise(resolve => setTimeout(resolve, 1000));
                  toast.promise(promise, { loading: 'Requesting link...', success: 'Password reset link sent to your email! 📧', error: 'Failed' });
                }}
              >
                Request Password Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .switch { position: relative; display: inline-block; width: 56px; height: 32px; flex-shrink: 0; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border-color); transition: .4s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 34px; border: 1px solid rgba(0,0,0,0.1); }
        .slider:before { position: absolute; content: ""; height: 24px; width: 24px; left: 3px; bottom: 3px; background-color: white; transition: .4s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        input:checked + .slider { background-color: var(--primary-color); border-color: var(--primary-color); }
        input:checked + .slider:before { transform: translateX(24px); }
        input:focus + .slider { box-shadow: 0 0 0 3px var(--primary-light); }
      `}</style>
    </div>
  );
}
