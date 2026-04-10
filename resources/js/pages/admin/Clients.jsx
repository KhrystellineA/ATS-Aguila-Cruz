import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Copy, Check } from 'lucide-react';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPoints, setShowPoints] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', tattoo_size: 'minimalist', referral_code: '' });
  const [pointsForm, setPointsForm] = useState({ points: 0, reason: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchClients = () => {
    api.get('/clients').then(r => setClients(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editing) {
        await api.put(`/clients/${editing.id}`, form);
        setSuccess('Client updated successfully!');
      } else {
        const payload = { ...form };
        if (!payload.referral_code.trim()) {
          delete payload.referral_code;
        }
        const res = await api.post('/clients', payload);
        setSuccess(`✓ Client "${res.data.name}" created! Referral code: ${res.data.referral_code}`);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', email: '', phone: '', tattoo_size: 'minimalist', referral_code: '' });
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save client');
    }
  };

  const copyToClipboard = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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

  if (loading) return <div className="p-8 text-purple-400">LOADING...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gradient tracking-wider">CLIENTS</h1>
        <Button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', tattoo_size: 'minimalist', referral_code: '' }); setShowForm(true); setSuccess(''); setError(''); }}>
          + ADD CLIENT
        </Button>
      </div>

      {success && (
        <div className="bg-green-900/30 text-green-400 border border-green-800 p-3 rounded-lg mb-4 tracking-wider flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-400 ml-4">×</button>
        </div>
      )}
      {error && <div className="bg-red-900/30 text-red-400 border border-red-800 p-3 rounded-lg mb-4 tracking-wider">{error}</div>}

      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-purple-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-purple-400 border-b-2 border-purple-800">
              <th className="p-3 tracking-wider text-xs">NAME</th>
              <th className="p-3 tracking-wider text-xs">EMAIL</th>
              <th className="p-3 tracking-wider text-xs">REFERRAL CODE</th>
              <th className="p-3 tracking-wider text-xs">POINTS</th>
              <th className="p-3 tracking-wider text-xs">EARNED</th>
              <th className="p-3 tracking-wider text-xs">REDEEMED</th>
              <th className="p-3 tracking-wider text-xs">PENDING CODE</th>
              <th className="p-3 tracking-wider text-xs">STATUS</th>
              <th className="p-3 tracking-wider text-xs">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                <td className="p-3 font-medium text-white">{c.name}</td>
                <td className="p-3 text-gray-400">{c.email || '—'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-purple-300 bg-purple-900/30 px-2 py-1 rounded border border-purple-800">{c.referral_code}</span>
                    <button 
                      onClick={() => copyToClipboard(c.referral_code, c.id)} 
                      className="text-gray-500 hover:text-purple-400 transition-colors"
                      title="Copy referral code"
                    >
                      {copiedId === c.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                </td>
                <td className="p-3 font-bold text-purple-400">{c.total_points}</td>
                <td className="p-3 text-green-400">{c.points_earned}</td>
                <td className="p-3 text-yellow-400">{c.points_redeemed}</td>
                <td className="p-3">
                  {c.pending_referral_code ? (
                    <div className="flex gap-1">
                      <span className="font-mono text-blue-400">{c.pending_referral_code}</span>
                      <button onClick={() => handleApproveCode(c)} className="text-green-400 hover:text-green-300 text-xs">✓</button>
                      <button onClick={() => handleRejectCode(c)} className="text-red-400 hover:text-red-300 text-xs">✗</button>
                    </div>
                  ) : '—'}
                </td>
                <td className="p-3">
                  {c.is_expired ? <Badge variant="danger">EXPIRED</Badge> : <Badge variant="success">ACTIVE</Badge>}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(c); setForm({ name: c.name, email: c.email || '', phone: c.phone || '', tattoo_size: 'minimalist' }); setShowForm(true); }} className="text-blue-400 hover:text-blue-300 text-xs tracking-wider">EDIT</button>
                    <button onClick={() => { setShowPoints(c); setPointsForm({ points: 0, reason: '' }); }} className="text-green-400 hover:text-green-300 text-xs tracking-wider">PTS</button>
                    <button onClick={() => handleDelete(c)} className="text-red-400 hover:text-red-300 text-xs tracking-wider">DEL</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); setSuccess(''); setError(''); }} title={editing ? 'Edit Client' : 'Add Client'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          {!editing && (
            <>
              <div>
                <label className="block text-xs font-medium text-purple-400 mb-1 tracking-wider">REFERRAL CODE (OPTIONAL)</label>
                <input
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-gray-500 font-mono uppercase transition-all"
                  placeholder="Leave blank to auto-generate (e.g. ABC123)"
                  value={form.referral_code}
                  onChange={e => setForm({ ...form, referral_code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                  maxLength={7}
                />
                <p className="text-xs text-gray-500 mt-1 tracking-wider">Format: 3-4 letters + 3 digits (e.g. ABC123, XYZW456). Leave blank to auto-generate.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-400 mb-1 tracking-wider">TATTOO SIZE</label>
                <select className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white transition-all" value={form.tattoo_size} onChange={e => setForm({ ...form, tattoo_size: e.target.value })}>
                  <option value="minimalist">Minimalist</option>
                  <option value="medium">Medium</option>
                  <option value="big">Big</option>
                </select>
              </div>
            </>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">CANCEL</Button>
            <Button type="submit" className="flex-1">{editing ? 'UPDATE' : 'CREATE'}</Button>
          </div>
        </form>
      </Modal>

      {/* Points Adjustment Modal */}
      <Modal open={!!showPoints} onClose={() => setShowPoints(null)} title={`Adjust Points — ${showPoints?.name}`}>
        <form onSubmit={handlePointsAdjust} className="space-y-3">
          <Input label="Points (positive to add, negative to deduct)" type="number" value={pointsForm.points} onChange={e => setPointsForm({ ...pointsForm, points: parseInt(e.target.value) })} required />
          <Input label="Reason" value={pointsForm.reason} onChange={e => setPointsForm({ ...pointsForm, reason: e.target.value })} required />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowPoints(null)} className="flex-1">CANCEL</Button>
            <Button type="submit" className="flex-1">ADJUST</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
