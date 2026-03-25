import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const [modalOpen, setModalOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    customer: '', location: '', plan: 'Business',
    cost: '', date: '', cardId: '', status: 'Active'
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const [subsRes, cardsRes] = await Promise.all([
        fetch('http://localhost:5000/api/subscriptions'),
        fetch('http://localhost:5000/api/payment-methods')
      ]);
      const subsData = await subsRes.json();
      const cardsData = await cardsRes.json();
      
      setSubscriptions(subsData.map(sub => ({
        ...sub,
        costLabel: `$${sub.cost}`,
        cardLabel: sub.card ? `${sub.card.type} ending ${sub.card.last4}` : 'Unassigned',
      })));
      setCards(cardsData);
      
      if (cardsData.length > 0) {
        setFormData(prev => ({ ...prev, cardId: cardsData[0].id }));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load subscriptions');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, cardId: cards.length ? cards[0].id : '' });
    setModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingId(sub.id);
    setFormData({
      customer: sub.customer,
      location: sub.location,
      plan: sub.plan,
      cost: sub.cost,
      date: sub.date.replace(/[^0-9]/g, ''),
      cardId: sub.cardId || '',
      status: sub.status
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription?")) return;
    try {
      toast.loading("Deleting...", { id: "delete-toast" });
      const res = await fetch(`http://localhost:5000/api/subscriptions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Subscription deleted!", { id: "delete-toast" });
      await fetchData();
    } catch (err) {
      toast.error(err.message, { id: "delete-toast" });
    }
  };

  const handleSave = async () => {
    if (!formData.customer || !formData.location || !formData.cost || !formData.date) {
      return toast.error("Please fill all fields");
    }

    setSaving(true);
    const payload = {
      ...formData,
      cardId: formData.cardId || null,
      cost: parseFloat(formData.cost) || 0,
      date: formData.date.toString() + (formData.date === '1' ? 'st' : formData.date === '2' ? 'nd' : formData.date === '3' ? 'rd' : 'th')
    };

    try {
      const url = editingId ? `http://localhost:5000/api/subscriptions/${editingId}` : 'http://localhost:5000/api/subscriptions';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save");
      
      toast.success(editingId ? "Subscription updated!" : "Subscription created!");
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Subscriptions</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Add Subscription
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading subscriptions...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Location</th>
                  <th>Plan</th>
                  <th>Monthly Cost</th>
                  <th>Billing Date</th>
                  <th>Assigned Card</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 600 }}>{sub.customer}</td>
                    <td>{sub.location}</td>
                    <td>{sub.plan}</td>
                    <td>{sub.costLabel}</td>
                    <td>{sub.date}</td>
                    <td className="text-muted">{sub.cardLabel}</td>
                    <td>
                      <span className={`badge ${sub.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-icon" onClick={() => openEditModal(sub)} style={{ width: 32, height: 32 }}>
                          <Edit size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => handleDelete(sub.id)} style={{ width: 32, height: 32, color: 'var(--danger-color)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="card-title">{editingId ? 'Edit Subscription' : 'Add Subscription'}</h2>
              <button className="btn-icon" onClick={() => setModalOpen(false)} style={{ width: 32, height: 32 }}>×</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Customer Name</label>
                <input type="text" className="input-field" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} placeholder="E.g., John Doe" />
              </div>
              <div className="input-group">
                <label className="input-label">Location</label>
                <input type="text" className="input-field" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="E.g., HQ Business" />
              </div>
              <div className="flex gap-4">
                <div className="input-group w-full">
                  <label className="input-label">Plan Name</label>
                  <select className="input-field" value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})}>
                    <option>Business</option>
                    <option>Residential</option>
                    <option>Roam</option>
                  </select>
                </div>
                <div className="input-group w-full">
                  <label className="input-label">Monthly Cost</label>
                  <input type="number" className="input-field" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} placeholder="$" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="input-group w-full">
                  <label className="input-label">Billing Date (Day)</label>
                  <input type="number" className="input-field" min="1" max="31" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} placeholder="Day (1-31)" />
                </div>
                <div className="input-group w-full">
                  <label className="input-label">Assign Card</label>
                  <select className="input-field" value={formData.cardId} onChange={(e) => setFormData({...formData, cardId: e.target.value})}>
                    <option value="">None</option>
                    {cards.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type} **{c.last4})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', marginTop: '1rem' }}>
                <input type="checkbox" id="status-toggle" style={{ width: 18, height: 18 }} 
                  checked={formData.status === 'Active'} 
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'Active' : 'Suspended'})} 
                />
                <label htmlFor="status-toggle" className="input-label" style={{ marginBottom: 0 }}>Active Subscription</label>
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
