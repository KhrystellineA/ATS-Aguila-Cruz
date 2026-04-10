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

  if (loading) return <div className="p-8 text-purple-400">LOADING...</div>;

  const statusBadge = (s) => {
    const map = { pending: 'warning', approved: 'info', rejected: 'danger', used: 'success' };
    return <Badge variant={map[s]}>{s.toUpperCase()}</Badge>;
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gradient tracking-wider">REDEMPTIONS</h1>
        <div className="flex gap-2 flex-wrap">
          {['all', ...statusOrder].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all border tracking-wider ${
                filter === s 
                  ? 'bg-purple-800 text-white border-purple-600' 
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-700'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-purple-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-purple-400 border-b-2 border-purple-800">
              <th className="p-3 tracking-wider text-xs">CLIENT</th>
              <th className="p-3 tracking-wider text-xs">REWARD</th>
              <th className="p-3 tracking-wider text-xs">POINTS USED</th>
              <th className="p-3 tracking-wider text-xs">CONTACT</th>
              <th className="p-3 tracking-wider text-xs">STATUS</th>
              <th className="p-3 tracking-wider text-xs">DATE</th>
              <th className="p-3 tracking-wider text-xs">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                <td className="p-3 font-medium text-white">{r.client?.name || 'Unknown'}</td>
                <td className="p-3 text-gray-300">{r.reward?.name || 'Unknown'}</td>
                <td className="p-3 font-bold text-purple-400">{r.points_used}</td>
                <td className="p-3 text-gray-400 text-xs">
                  {r.contact_info?.email || ''} {r.contact_info?.phone && <br />} {r.contact_info?.phone || ''}
                </td>
                <td className="p-3">{statusBadge(r.status)}</td>
                <td className="p-3 text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={() => handleAction(r.id, 'approve')} className="text-xs py-1 px-2">APPROVE</Button>
                      <Button variant="danger" onClick={() => handleAction(r.id, 'reject')} className="text-xs py-1 px-2">REJECT</Button>
                    </div>
                  )}
                  {r.status === 'approved' && (
                    <Button variant="secondary" onClick={() => handleAction(r.id, 'used')} className="text-xs py-1 px-2">MARK USED</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-gray-500 text-sm p-4 text-center tracking-wider">NO REDEMPTIONS FOUND</p>}
      </div>
    </div>
  );
}
