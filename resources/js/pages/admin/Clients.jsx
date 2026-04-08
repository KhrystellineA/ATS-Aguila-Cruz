import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPoints, setShowPoints] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', tattoo_size: 'minimalist' });
  const [pointsForm, setPointsForm] = useState({ points: 0, reason: '' });
  const [error, setError] = useState('');

  const fetchClients = () => {
    api.get('/clients').then(r => setClients(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.put(`/clients/${editing.id}`, form);
      } else {
        await api.post('/clients', form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', email: '', phone: '', tattoo_size: 'minimalist' });
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save client');
    }
  };

  const handleDelete = async (client) => {
    if (!confirm(`Delete ${client.name}? This cannot be undone.`)) return;
    await api.delete(`/clients/${client.id}`);
    fetchClients();
  };

  const handlePointsAdjust = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/clients/${showPoints.id}/adjust-points`, pointsForm);
      setShowPoints(null);
      setPointsForm({ points: 0, reason: '' });
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to adjust points');
    }
  };

  const handleApproveCode = async (client) => {
    if (!confirm(`Approve code change to ${client.pending_referral_code} for ${client.name}?`)) return;
    await api.post(`/clients/${client.id}/approve-code-change`);
    fetchClients();
  };

  const handleRejectCode = async (client) => {
    if (!confirm(`Reject code change for ${client.name}?`)) return;
    await api.post(`/clients/${client.id}/reject-code-change`);
    fetchClients();
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', tattoo_size: 'minimalist' }); setShowForm(true); }}>
          + Add Client
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Code</th>
              <th className="p-3">Points</th>
              <th className="p-3">Earned</th>
              <th className="p-3">Redeemed</th>
              <th className="p-3">Pending Code</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-gray-500">{c.email || '—'}</td>
                <td className="p-3 font-mono">{c.referral_code}</td>
                <td className="p-3 font-bold">{c.total_points}</td>
                <td className="p-3">{c.points_earned}</td>
                <td className="p-3">{c.points_redeemed}</td>
                <td className="p-3">
                  {c.pending_referral_code ? (
                    <div className="flex gap-1">
                      <span className="font-mono text-blue-600">{c.pending_referral_code}</span>
                      <button onClick={() => handleApproveCode(c)} className="text-green-600 hover:text-green-800 text-xs">✓</button>
                      <button onClick={() => handleRejectCode(c)} className="text-red-600 hover:text-red-800 text-xs">✗</button>
                    </div>
                  ) : '—'}
                </td>
                <td className="p-3">
                  {c.is_expired ? <Badge variant="danger">Expired</Badge> : <Badge variant="success">Active</Badge>}
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(c); setForm({ name: c.name, email: c.email || '', phone: c.phone || '', tattoo_size: 'minimalist' }); setShowForm(true); }} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => { setShowPoints(c); setPointsForm({ points: 0, reason: '' }); }} className="text-green-600 hover:underline text-xs">Pts</button>
                    <button onClick={() => handleDelete(c)} className="text-red-600 hover:underline text-xs">Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Edit Client' : 'Add Client'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tattoo Size</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.tattoo_size} onChange={e => setForm({ ...form, tattoo_size: e.target.value })}>
                <option value="minimalist">Minimalist</option>
                <option value="medium">Medium</option>
                <option value="big">Big</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Points Adjustment Modal */}
      <Modal open={!!showPoints} onClose={() => setShowPoints(null)} title={`Adjust Points — ${showPoints?.name}`}>
        <form onSubmit={handlePointsAdjust} className="space-y-3">
          <Input label="Points (positive to add, negative to deduct)" type="number" value={pointsForm.points} onChange={e => setPointsForm({ ...pointsForm, points: parseInt(e.target.value) })} required />
          <Input label="Reason" value={pointsForm.reason} onChange={e => setPointsForm({ ...pointsForm, reason: e.target.value })} required />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowPoints(null)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Adjust</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
