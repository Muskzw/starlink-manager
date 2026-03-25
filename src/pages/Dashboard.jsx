import { useState, useEffect } from 'react';
import { DollarSign, Wallet, CalendarClock, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalCost: 0, totalBalance: 0, upcoming: 0, atRisk: 0 });
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [riskAlerts, setRiskAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, subsRes, historyRes] = await Promise.all([
          fetch('http://localhost:5000/api/dashboard/stats'),
          fetch('http://localhost:5000/api/subscriptions'),
          fetch('http://localhost:5000/api/payment-history')
        ]);
        
        const statsData = await statsRes.json();
        const subsData = await subsRes.json();
        const historyData = await historyRes.json();

        setStats(statsData);
        
        const upcoming = subsData.slice(0, 4).map(sub => ({
          id: sub.id,
          name: `${sub.customer} - ${sub.location}`,
          amount: `$${sub.cost}`,
          date: `Current / ${sub.date}`,
          status: sub.status === 'Active' ? 'Upcoming' : 'Due'
        }));
        setUpcomingPayments(upcoming);

        const alerts = subsData.filter(s => s.status === 'Suspended' || !s.cardId).map(sub => ({
          id: sub.id,
          name: sub.location,
          issue: !sub.cardId ? 'Missing Card' : 'Suspended',
          type: 'danger'
        }));
        setRiskAlerts(alerts.length ? alerts : [{ id: 'mock1', name: 'Desert Facility B', issue: 'Card Expiring Soon', type: 'warning' }]);

        const history = historyData.slice(0, 3).map(h => ({
          id: h.id,
          date: new Date(h.date).toLocaleString(),
          name: `${h.subscription.customer} - ${h.subscription.location}`,
          amount: `$${h.amount}`,
          status: h.status
        }));
        setRecentActivity(history);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const summaryCards = [
    { title: 'Total Monthly Cost', value: `$${stats.totalCost.toLocaleString()}`, icon: DollarSign, trend: '+2.5%', isPositive: true },
    { title: 'Total Available Balance', value: `$${stats.totalBalance.toLocaleString()}`, icon: Wallet, trend: '-1.2%', isPositive: false },
    { title: 'Upcoming Payments', value: stats.upcoming.toString(), icon: CalendarClock, trend: 'Next 7 days', isNeutral: true },
    { title: 'At-Risk Subscriptions', value: stats.atRisk.toString(), icon: AlertTriangle, color: 'var(--danger-color)' },
  ];

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard data...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {summaryCards.map((card, i) => (
          <div key={i} className="card">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted">{card.title}</span>
              <div className="btn-icon" style={{ background: card.color ? 'var(--danger-bg)' : 'var(--primary-light)', color: card.color || 'var(--primary-color)' }}>
                <card.icon size={20} />
              </div>
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{card.value}</h2>
            {card.trend && (
              <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: card.isNeutral ? 'var(--text-secondary)' : (card.isPositive ? 'var(--success-color)' : 'var(--danger-color)') }}>
                {!card.isNeutral && (card.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />)}
                <span>{card.trend}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="middle-section">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Payments</h2>
            <button className="btn btn-secondary" onClick={() => navigate('/subscriptions')} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>View All</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingPayments.map(payment => (
                  <tr key={payment.id}>
                    <td style={{ fontWeight: 500 }}>{payment.name}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.date}</td>
                    <td>
                      <span className={`badge ${
                        payment.status === 'Paid' ? 'badge-success' : 
                        payment.status === 'Due' ? 'badge-warning' : 'badge-primary'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Risk Alerts</h2>
          </div>
          <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
            {riskAlerts.map(alert => (
              <div key={alert.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: alert.type === 'danger' ? 'var(--danger-bg)' : 'var(--warning-bg)' }}>
                <div className="flex items-center gap-4">
                  <div style={{ color: alert.type === 'danger' ? 'var(--danger-color)' : 'var(--warning-color)' }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{alert.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: alert.type === 'danger' ? 'var(--danger-color)' : 'var(--warning-color)', marginTop: '0.25rem' }}>{alert.issue}</p>
                  </div>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate(alert.issue === 'Missing Card' ? '/payment-methods' : '/subscriptions')}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map(activity => (
                <tr key={activity.id}>
                  <td className="text-muted">{activity.date}</td>
                  <td style={{ fontWeight: 500 }}>{activity.name}</td>
                  <td>{activity.amount}</td>
                  <td>
                    <span className={`badge ${activity.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
