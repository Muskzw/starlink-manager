import { useState, useEffect } from 'react';
import { Users, BarChart3, Wifi, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ subsCount: 0, revenue: 0, failedPayments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, subsRes, historyRes] = await Promise.all([
          fetch('http://localhost:5000/api/users'),
          fetch('http://localhost:5000/api/subscriptions'),
          fetch('http://localhost:5000/api/payment-history')
        ]);
        
        const usersData = await usersRes.json();
        const subsData = await subsRes.json();
        const historyData = await historyRes.json();

        setUsers(usersData);
        
        const failedCount = historyData.filter(h => h.status === 'Failed').length;
        const totalRev = historyData.filter(h => h.status === 'Success').reduce((acc, h) => acc + h.amount, 0);

        setStats({
          subsCount: subsData.length,
          revenue: totalRev,
          failedPayments: failedCount
        });
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load admin data');
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleInvite = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Sending invite link...',
        success: <b>Invite sent successfully!</b>,
        error: <b>Could not send invite.</b>,
      }
    );
  };

  const handleManageUser = (user) => {
    toast(`Managing user: ${user.name} is currently not available offline.`, { icon: '⚙️' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Admin Panel</h1>
        <button className="btn btn-primary" onClick={handleInvite}>
          <Users size={18} />
          Invite User
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading admin data...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="btn-icon" style={{ width: 60, height: 60, background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                <Wifi size={24} />
              </div>
              <div>
                <div className="text-muted" style={{ fontWeight: 500 }}>Total Subscriptions</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.subsCount}</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="btn-icon" style={{ width: 60, height: 60, background: 'var(--success-bg)', color: 'var(--success-color)' }}>
                <BarChart3 size={24} />
              </div>
              <div>
                <div className="text-muted" style={{ fontWeight: 500 }}>Total Revenue (MTD)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${stats.revenue.toLocaleString()}</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="btn-icon" style={{ width: 60, height: 60, background: 'var(--danger-bg)', color: 'var(--danger-color)' }}>
                <AlertCircle size={24} />
              </div>
              <div>
                <div className="text-muted" style={{ fontWeight: 500 }}>Failed Payments</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.failedPayments}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">System Users</h2>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 500 }}>
                        <div className="flex items-center gap-2">
                          <img src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                          {user.name}
                        </div>
                      </td>
                      <td className="text-muted">{user.email}</td>
                      <td>
                        <span className="badge badge-primary">{user.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" onClick={() => handleManageUser(user)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
