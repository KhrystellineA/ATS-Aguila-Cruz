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

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <Button onClick={() => setShowForm(true)}>+ Add Referral</Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-3">Referrer</th>
              <th className="p-3">Referred Client</th>
              <th className="p-3">Code Used</th>
              <th className="p-3">Tattoo Size</th>
              <th className="p-3">Pts to Referrer</th>
              <th className="p-3">Pts to Referred</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{r.referrer?.name || clientName(r.referrer_id)}</td>
                <td className="p-3">{r.referred_client?.name || clientName(r.referred_client_id)}</td>
                <td className="p-3 font-mono">{r.referral_code_used}</td>
                <td className="p-3 capitalize">{r.tattoo_size}</td>
                <td className="p-3">{r.points_awarded_to_referrer}</td>
                <td className="p-3">{r.points_awarded_to_referred}</td>
                <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${r.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {r.status}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Referrer</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.referrer_id} onChange={e => setForm({ ...form, referrer_id: e.target.value })} required>
              <option value="">Select referrer</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.referral_code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referred Client</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.referred_client_id} onChange={e => setForm({ ...form, referred_client_id: e.target.value })} required>
              <option value="">Select referred client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.referral_code})</option>)}
            </select>
          </div>
          <Input label="Referral Code Used" value={form.referral_code_used} onChange={e => setForm({ ...form, referral_code_used: e.target.value.toUpperCase() })} required placeholder="e.g. ABC123" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tattoo Size</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.tattoo_size} onChange={e => setForm({ ...form, tattoo_size: e.target.value })} required>
              <option value="minimalist">Minimalist</option>
              <option value="medium">Medium</option>
              <option value="big">Big</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add Referral</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
