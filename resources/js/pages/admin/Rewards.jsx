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

  if (loading) return <div className="p-8 text-purple-400">LOADING...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gradient tracking-wider">REWARDS</h1>
        <Button onClick={() => { setEditing(null); setForm({ name: '', description: '', points_required: 0, type: 'discount_percent', value: 0, is_active: true }); setShowForm(true); }}>
          + ADD REWARD
        </Button>
      </div>

      {error && <div className="bg-red-900/30 text-red-400 border border-red-800 p-3 rounded-lg mb-4 tracking-wider">{error}</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map(r => (
          <div key={r.id} className={`bg-gray-900/90 backdrop-blur-sm rounded-lg border p-5 transition-all hover:glow-purple ${!r.is_active ? 'opacity-50 border-gray-700' : 'border-purple-800 hover:border-purple-600'}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-white text-gradient">{r.name}</h3>
              <span className={`px-2 py-0.5 rounded text-xs border ${r.is_active ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                {r.is_active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">{r.description || 'No description'}</p>
            <div className="flex items-center justify-between">
              <span className="text-purple-400 font-bold border border-purple-700 px-2 py-1 rounded bg-gray-800/50">{r.points_required} PTS</span>
              <div className="flex gap-2">
                <button onClick={() => handleToggle(r)} className="text-xs text-gray-400 hover:text-purple-400 tracking-wider">
                  {r.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
                </button>
                <button onClick={() => { setEditing(r); setForm(r); setShowForm(true); }} className="text-xs text-blue-400 hover:text-blue-300 tracking-wider">EDIT</button>
                <button onClick={() => handleDelete(r)} className="text-xs text-red-400 hover:text-red-300 tracking-wider">DEL</button>
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
            <label className="block text-xs font-medium text-purple-400 mb-1 tracking-wider">TYPE</label>
            <select className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white transition-all" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="discount_percent">Discount Percent</option>
              <option value="discount_fixed">Discount Fixed</option>
              <option value="product">Product</option>
              <option value="upgrade">Upgrade</option>
            </select>
          </div>
          <Input label="Value (₱ or %)" type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-purple-700 bg-gray-800 focus:ring-purple-600" />
            <span className="text-xs text-purple-400 tracking-wider">ACTIVE</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">CANCEL</Button>
            <Button type="submit" className="flex-1">{editing ? 'UPDATE' : 'CREATE'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
