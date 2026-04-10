import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Background3D from '../../components/Background3D';

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-5 border border-purple-800 hover:border-purple-600 transition-all hover:glow-purple relative">
      <p className="text-purple-400 text-xs tracking-widest mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}>{label.toUpperCase()}</p>
      <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>{value ?? '—'}</p>
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

  if (loading) return <div className="p-8 text-purple-400">LOADING...</div>;
  if (!stats) return <div className="p-8 text-red-400 border border-red-800 bg-red-900/20">FAILED TO LOAD DASHBOARD DATA</div>;

  return (
    <div className="p-6 lg:p-8 relative">
      {/* 3D Background */}
      <Background3D />
      
      <h1 className="text-4xl font-bold text-gradient mb-6 tracking-wider relative z-10" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>DASHBOARD</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
        <StatCard label="Total Clients" value={stats.total_clients} />
        <StatCard label="Points Awarded" value={stats.total_points_awarded} />
        <StatCard label="Points Redeemed" value={stats.total_points_redeemed} />
        <StatCard label="Top Referrer" value={stats.top_referrers?.[0]?.name ?? 'N/A'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        {/* Recent Referrals */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-purple-800 p-5">
          <h2 className="font-bold text-white mb-3 text-gradient tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>RECENT REFERRALS</h2>
          {stats.recent_referrals?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-purple-400 border-b-2 border-purple-800">
                  <th className="pb-2 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>REFERRER</th>
                  <th className="pb-2 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>REFERRED</th>
                  <th className="pb-2 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SIZE</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_referrals.map(r => (
                  <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-2 text-gray-300">{r.referrer?.name}</td>
                    <td className="py-2 text-gray-300">{r.referred_client?.name}</td>
                    <td className="py-2 capitalize text-purple-300">{r.tattoo_size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm tracking-wider">No referrals yet.</p>
          )}
        </div>

        {/* Recent Redemptions */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-purple-800 p-5">
          <h2 className="font-bold text-white mb-3 text-gradient tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>RECENT REDEMPTIONS</h2>
          {stats.recent_redemptions?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-purple-400 border-b-2 border-purple-800">
                  <th className="pb-2 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>CLIENT</th>
                  <th className="pb-2 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>REWARD</th>
                  <th className="pb-2 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_redemptions.map(r => (
                  <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-2 text-gray-300">{r.client?.name}</td>
                    <td className="py-2 text-gray-300">{r.reward?.name}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-xs border ${
                        r.status === 'approved' ? 'bg-green-900/30 text-green-400 border-green-800' :
                        r.status === 'rejected' ? 'bg-red-900/30 text-red-400 border-red-800' :
                        r.status === 'used' ? 'bg-gray-800 text-gray-400 border-gray-700' :
                        'bg-yellow-900/30 text-yellow-400 border-yellow-800'
                      }`}>{r.status.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm tracking-wider">No redemptions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
