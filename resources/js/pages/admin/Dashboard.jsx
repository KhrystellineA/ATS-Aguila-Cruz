import { useEffect, useState } from 'react';
import api from '../../api/axios';

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!stats) return <div className="p-8 text-red-500">Failed to load dashboard data.</div>;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Clients" value={stats.total_clients} />
        <StatCard label="Points Awarded" value={stats.total_points_awarded} />
        <StatCard label="Points Redeemed" value={stats.total_points_redeemed} />
        <StatCard label="Top Referrer" value={stats.top_referrers?.[0]?.name ?? 'N/A'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Referrals */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-bold text-gray-900 mb-3">Recent Referrals</h2>
          {stats.recent_referrals?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Referrer</th>
                  <th className="pb-2">Referred</th>
                  <th className="pb-2">Size</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_referrals.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="py-2">{r.referrer?.name}</td>
                    <td className="py-2">{r.referred_client?.name}</td>
                    <td className="py-2 capitalize">{r.tattoo_size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">No referrals yet.</p>
          )}
        </div>

        {/* Recent Redemptions */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-bold text-gray-900 mb-3">Recent Redemptions</h2>
          {stats.recent_redemptions?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Reward</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_redemptions.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="py-2">{r.client?.name}</td>
                    <td className="py-2">{r.reward?.name}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        r.status === 'approved' ? 'bg-green-100 text-green-800' :
                        r.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        r.status === 'used' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">No redemptions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
