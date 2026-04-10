import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ referrer_id: '', referred_client_id: '', referral_code_used: '', tattoo_size: 'minimalist' });
  const [error, setError] = useState('');

  const fetchData = () => {
    Promise.all([api.get('/referrals'), api.get('/clients')])
      .then(([r1, r2]) => { setReferrals(r1.data); setClients(r2.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/referrals', form);
      setShowForm(false);
      setForm({ referrer_id: '', referred_client_id: '', referral_code_used: '', tattoo_size: 'minimalist' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add referral');
    }
  };

  const clientName = (id) => clients.find(c => c.id === id)?.name || 'Unknown';

  if (loading) return <div className="p-8 text-purple-400">LOADING...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gradient tracking-wider">REFERRALS</h1>
        <Button onClick={() => setShowForm(true)}>+ ADD REFERRAL</Button>
      </div>

      {error && <div className="bg-red-900/30 text-red-400 border border-red-800 p-3 rounded-lg mb-4 tracking-wider">{error}</div>}

      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-purple-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-purple-400 border-b-2 border-purple-800">
              <th className="p-3 tracking-wider text-xs">REFERRER</th>
              <th className="p-3 tracking-wider text-xs">REFERRED CLIENT</th>
              <th className="p-3 tracking-wider text-xs">CODE USED</th>
              <th className="p-3 tracking-wider text-xs">TATTOO SIZE</th>
              <th className="p-3 tracking-wider text-xs">PTS TO REFERRER</th>
              <th className="p-3 tracking-wider text-xs">PTS TO REFERRED</th>
              <th className="p-3 tracking-wider text-xs">DATE</th>
              <th className="p-3 tracking-wider text-xs">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map(r => (
              <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                <td className="p-3 font-medium text-white">{r.referrer?.name || clientName(r.referrer_id)}</td>
                <td className="p-3 text-gray-300">{r.referred_client?.name || clientName(r.referred_client_id)}</td>
                <td className="p-3 font-mono text-purple-300">{r.referral_code_used}</td>
                <td className="p-3 capitalize text-gray-300">{r.tattoo_size}</td>
                <td className="p-3 text-purple-400 font-bold">{r.points_awarded_to_referrer}</td>
                <td className="p-3 text-green-400 font-bold">{r.points_awarded_to_referred}</td>
                <td className="p-3 text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs border ${r.status === 'completed' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-yellow-900/30 text-yellow-400 border-yellow-800'}`}>
                    {r.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Referral Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Referral">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-purple-400 mb-1 tracking-wider">REFERRER</label>
            <select className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white transition-all" value={form.referrer_id} onChange={e => setForm({ ...form, referrer_id: e.target.value })} required>
              <option value="">Select referrer</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.referral_code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-purple-400 mb-1 tracking-wider">REFERRED CLIENT</label>
            <select className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white transition-all" value={form.referred_client_id} onChange={e => setForm({ ...form, referred_client_id: e.target.value })} required>
              <option value="">Select referred client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.referral_code})</option>)}
            </select>
          </div>
          <Input label="Referral Code Used" value={form.referral_code_used} onChange={e => setForm({ ...form, referral_code_used: e.target.value.toUpperCase() })} required placeholder="e.g. ABC123" />
          <div>
            <label className="block text-xs font-medium text-purple-400 mb-1 tracking-wider">TATTOO SIZE</label>
            <select className="w-full px-3 py-2 rounded bg-gray-800 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white transition-all" value={form.tattoo_size} onChange={e => setForm({ ...form, tattoo_size: e.target.value })} required>
              <option value="minimalist">Minimalist</option>
              <option value="medium">Medium</option>
              <option value="big">Big</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">CANCEL</Button>
            <Button type="submit" className="flex-1">ADD REFERRAL</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
