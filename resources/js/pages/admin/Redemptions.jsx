import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const statusOrder = ['pending', 'approved', 'rejected', 'used'];

export default function Redemptions() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchRedemptions = () => {
    api.get('/redemptions').then(r => setRedemptions(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRedemptions(); }, []);

  const handleAction = async (id, action) => {
    await api.patch(`/redemptions/${id}/${action}`);
    fetchRedemptions();
  };

  const filtered = filter === 'all' ? redemptions : redemptions.filter(r => r.status === filter);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  const statusBadge = (s) => {
    const map = { pending: 'warning', approved: 'info', rejected: 'danger', used: 'success' };
    return <Badge variant={map[s]}>{s}</Badge>;
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Redemptions</h1>
        <div className="flex gap-2">
          {['all', ...statusOrder].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === s ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-3">Client</th>
              <th className="p-3">Reward</th>
              <th className="p-3">Points Used</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{r.client?.name || 'Unknown'}</td>
                <td className="p-3">{r.reward?.name || 'Unknown'}</td>
                <td className="p-3 font-bold">{r.points_used}</td>
                <td className="p-3 text-gray-500 text-xs">
                  {r.contact_info?.email || ''} {r.contact_info?.phone && <br />} {r.contact_info?.phone || ''}
                </td>
                <td className="p-3">{statusBadge(r.status)}</td>
                <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={() => handleAction(r.id, 'approve')} className="text-xs py-1 px-2">Approve</Button>
                      <Button variant="danger" onClick={() => handleAction(r.id, 'reject')} className="text-xs py-1 px-2">Reject</Button>
                    </div>
                  )}
                  {r.status === 'approved' && (
                    <Button variant="secondary" onClick={() => handleAction(r.id, 'used')} className="text-xs py-1 px-2">Mark Used</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-400 text-sm p-4 text-center">No redemptions found.</p>}
      </div>
    </div>
  );
}
