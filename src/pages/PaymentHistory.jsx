import { useState, useEffect } from 'react';
import { Filter, Download } from 'lucide-react';

export default function PaymentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/payment-history')
      .then(res => res.json())
      .then(data => {
        setHistory(data.map(item => ({
          id: item.id,
          date: new Date(item.date).toLocaleDateString(),
          time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          customer: `${item.subscription?.customer} - ${item.subscription?.location}`,
          amount: `$${item.amount}`,
          method: item.method ? `${item.method.type} **${item.method.last4}` : 'Unknown',
          status: item.status,
          receipt: item.receipt || '-'
        })));
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Payment History</h1>
        <div className="flex gap-4">
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filters
          </button>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="card mb-6 flex gap-4" style={{ alignItems: 'flex-end' }}>
        <div className="input-group w-full" style={{ marginBottom: 0 }}>
          <label className="input-label">Date Range</label>
          <input type="date" className="input-field" />
        </div>
        <div className="input-group w-full" style={{ marginBottom: 0 }}>
          <label className="input-label">Status</label>
          <select className="input-field">
            <option>All Statuses</option>
            <option>Success</option>
            <option>Failed</option>
          </select>
        </div>
        <div className="input-group w-full" style={{ marginBottom: 0 }}>
          <label className="input-label">Customer</label>
          <input type="text" className="input-field" placeholder="Search customer..." />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading payment history...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Subscription</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.date}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{item.time}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{item.customer}</td>
                    <td style={{ fontWeight: 600 }}>{item.amount}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <CreditCardIcon type={item.method.split(' ')[0]} />
                        <span className="text-muted">{item.method}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.receipt !== '-' ? (
                        <a href="#" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }}>{item.receipt}</a>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function CreditCardIcon({ type }) {
  const isVisa = type === 'Visa';
  return (
    <div style={{ 
      background: isVisa ? '#1434CB' : '#FF5F00', 
      color: 'white', 
      fontSize: '0.6rem', 
      fontWeight: 'bold', 
      padding: '2px 4px', 
      borderRadius: '4px' 
    }}>
      {isVisa ? 'VISA' : 'MC'}
    </div>
  );
}
