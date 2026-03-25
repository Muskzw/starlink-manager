import { useState, useEffect } from 'react';
import { Plus, CreditCard, Edit2 } from 'lucide-react';

export default function PaymentMethods() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Visa',
    last4: '',
    balance: '',
    currency: 'USD',
  });

  const fetchCards = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payment-methods');
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSave = async () => {
    // Basic validation
    if (!formData.name || !formData.balance) return alert("Please fill out required fields.");
    
    setSaving(true);
    // Auto-generate random last 4 digits if not provided
    const last4 = formData.last4 || Math.floor(1000 + Math.random() * 9000).toString();
    const color = formData.type === 'Visa' 
        ? 'linear-gradient(135deg, #1A1F3C 0%, #2b3674 100%)' 
        : 'linear-gradient(135deg, #FF5F00 0%, #FF9900 100%)';

    try {
      await fetch('http://localhost:5000/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          last4,
          balance: parseFloat(formData.balance) || 0,
          currency: formData.currency,
          color,
        })
      });
      setModalOpen(false);
      await fetchCards();
      setFormData({ name: '', type: 'Visa', last4: '', balance: '', currency: 'USD' });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Payment Methods</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} />
          Add Card
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem' }}>Loading payment methods...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {cards.map(card => (
            <div key={card.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ background: card.color, padding: '2rem', color: 'white' }}>
                <div className="flex justify-between items-center mb-8">
                  <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{card.name}</span>
                  <CreditCard size={28} />
                </div>
                <div style={{ fontSize: '1.5rem', letterSpacing: '2px', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <span>****</span><span>****</span><span>****</span><span>{card.last4}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>AVAILABLE BALANCE</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, fontStyle: 'italic' }}>{card.type}</div>
                </div>
              </div>
              <div className="flex justify-between items-center" style={{ padding: '1rem 1.5rem', background: 'var(--card-bg)' }}>
                <span className="text-muted">Managed via Dashboard</span>
                <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="card-title">Add Payment Method</h2>
              <button className="btn-icon" onClick={() => setModalOpen(false)} style={{ width: 32, height: 32 }}>×</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Card Name / Alias (e.g., Main Corporate Card)</label>
                <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="input-group w-full">
                  <label className="input-label">Card Type</label>
                  <select className="input-field" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option>Visa</option>
                    <option>Mastercard</option>
                  </select>
                </div>
                <div className="input-group w-full">
                  <label className="input-label">Last 4 Digits (Optional)</label>
                  <input type="text" maxLength="4" className="input-field" value={formData.last4} onChange={(e) => setFormData({...formData, last4: e.target.value})} placeholder="e.g., 4242" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="input-group w-full">
                  <label className="input-label">Initial Balance</label>
                  <input type="number" className="input-field" value={formData.balance} onChange={(e) => setFormData({...formData, balance: e.target.value})} placeholder="0.00" />
                </div>
                <div className="input-group w-full">
                  <label className="input-label">Currency</label>
                  <select className="input-field" value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})}>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Adding...' : 'Add Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
