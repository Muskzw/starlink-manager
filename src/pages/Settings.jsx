import { Save, Bell, Globe, User } from 'lucide-react';

export default function Settings() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Settings</h1>
        <button className="btn btn-primary">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px' }}>
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} color="var(--primary-color)" />
            <h2 className="card-title" style={{ margin: 0 }}>Notification Preferences</h2>
          </div>
          <div style={{ borderBottom: '1px solid var(--border-color)', margin: '1rem -1.5rem', opacity: 0.5 }}></div>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-3" style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>3-Day Built-in Reminder</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Receive an alert 3 days before standard billing cycle.</div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="flex justify-between items-center p-3" style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>1-Day Urgent Reminder</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Final warning before card is drafted.</div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="flex justify-between items-center p-3" style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Same-Day Alert</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Immediate notification when payment succeeds or fails.</div>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={20} color="var(--primary-color)" />
            <h2 className="card-title" style={{ margin: 0 }}>System Preferences</h2>
          </div>
          <div style={{ borderBottom: '1px solid var(--border-color)', margin: '1rem -1.5rem', opacity: 0.5 }}></div>
          
          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label">Default Currency</label>
              <select className="input-field">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>CAD ($)</option>
              </select>
            </div>
            <div className="input-group w-full">
              <label className="input-label">Date Format</label>
              <select className="input-field">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} color="var(--primary-color)" />
            <h2 className="card-title" style={{ margin: 0 }}>Profile Settings</h2>
          </div>
          <div style={{ borderBottom: '1px solid var(--border-color)', margin: '1rem -1.5rem', opacity: 0.5 }}></div>
          
          <div className="flex flex-col gap-4">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" className="input-field" defaultValue="Admin User" />
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input type="email" className="input-field" defaultValue="admin@starops.com" />
            </div>
            <button className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>Change Password</button>
          </div>
        </div>
      </div>

      <style>{`
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        input:checked + .slider { background-color: var(--primary-color); }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>
    </div>
  );
}
