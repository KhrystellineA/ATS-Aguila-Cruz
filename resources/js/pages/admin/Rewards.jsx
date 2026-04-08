import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', points_required: 0, type: 'discount_percent', value: 0, is_active: true });
  const [error, setError] = useState('');

  const fetchRewards = () => {
    api.get('/rewards').then(r => setRewards(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRewards(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, points_required: parseInt(form.points_required), value: parseFloat(form.value) };
      if (editing) {
        await api.put(`/rewards/${editing.id}`, payload);
      } else {
        await api.post('/rewards', payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', points_required: 0, type: 'discount_percent', value: 0, is_active: true });
      fetchRewards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save reward');
    }
  };

  const handleDelete = async (reward) => {
    if (!confirm(`Delete "${reward.name}"?`)) return;
    await api.delete(`/rewards/${reward.id}`);
    fetchRewards();
  };

  const handleToggle = async (reward) => {
    await api.put(`/rewards/${reward.id}`, { ...reward, is_active: !reward.is_active });
    fetchRewards();
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
        <Button onClick={() => { setEditing(null); setForm({ name: '', description: '', points_required: 0, type: 'discount_percent', value: 0, is_active: true }); setShowForm(true); }}>
          + Add Reward
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map(r => (
          <div key={r.id} className={`bg-white rounded-xl shadow p-5 ${!r.is_active ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900">{r.name}</h3>
              <span className={`px-2 py-0.5 rounded text-xs ${r.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                {r.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">{r.description || 'No description'}</p>
            <div className="flex items-center justify-between">
              <span className="text-red-600 font-bold">{r.points_required} pts</span>
              <div className="flex gap-1">
                <button onClick={() => handleToggle(r)} className="text-xs text-gray-500 hover:text-gray-700">
                  {r.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => { setEditing(r); setForm(r); setShowForm(true); }} className="text-xs text-blue-600 hover:underline ml-2">Edit</button>
                <button onClick={() => handleDelete(r)} className="text-xs text-red-600 hover:underline ml-2">Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Edit Reward' : 'Add Reward'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Input label="Points Required" type="number" value={form.points_required} onChange={e => setForm({ ...form, points_required: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="discount_percent">Discount Percent</option>
              <option value="discount_fixed">Discount Fixed</option>
              <option value="product">Product</option>
              <option value="upgrade">Upgrade</option>
            </select>
          </div>
          <Input label="Value (₱ or %)" type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
            <span className="text-sm">Active</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
