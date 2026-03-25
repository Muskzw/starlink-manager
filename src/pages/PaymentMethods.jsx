import { useState, useEffect } from 'react';
import { Plus, CreditCard, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentMethods() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: '', type: 'Visa', last4: '', balance: '', currency: 'USD'
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchCards = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payment-methods');
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (card) => {
    setEditingId(card.id);
    setFormData({
      name: card.name,
      type: card.type,
      last4: card.last4,
      balance: card.balance,
      currency: card.currency
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment method? It will suspend assigned subscriptions.")) return;
    try {
      toast.loading("Deleting...", { id: "delete-method" });
      const res = await fetch(`http://localhost:5000/api/payment-methods/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete card");
      toast.success("Card deleted successfully!", { id: "delete-method" });
      await fetchCards();
    } catch (err) {
      toast.error(err.message, { id: "delete-method" });
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.balance) return toast.error("Please fill required fields (Name & Balance)");
    
    setSaving(true);
    const last4 = formData.last4 || Math.floor(1000 + Math.random() * 9000).toString();
    const color = formData.type === 'Visa' 
        ? 'linear-gradient(135deg, #1A1F3C 0%, #2b3674 100%)' 
        : 'linear-gradient(135deg, #FF5F00 0%, #FF9900 100%)';

    const payload = {
      name: formData.name,
      type: formData.type,
      last4,
      balance: parseFloat(formData.balance) || 0,
      currency: formData.currency,
      color,
    };

    try {
      const url = editingId ? `http://localhost:5000/api/payment-methods/${editingId}` : 'http://localhost:5000/api/payment-methods';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save card");

      toast.success(editingId ? "Card updated!" : "Card added!");
      setModalOpen(false);
      await fetchCards();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Payment Methods</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
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
              <div className="flex justify-end gap-2 items-center" style={{ padding: '1rem 1.5rem', background: 'var(--card-bg)' }}>
                <button className="btn btn-secondary" onClick={() => openEditModal(card)} style={{ padding: '0.5rem', borderRadius: '50%' }}>
                  <Edit2 size={16} />
                </button>
                <button className="btn" onClick={() => handleDelete(card.id)} style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--danger-bg)', color: 'var(--danger-color)' }}>
                  <Trash2 size={16} />
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
              <h2 className="card-title">{editingId ? 'Edit Payment Method' : 'Add Payment Method'}</h2>
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
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
