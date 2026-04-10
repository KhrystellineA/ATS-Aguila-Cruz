import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import api from '../../api/axios';
import Background3D from '../../components/Background3D';

export default function Profile() {
  const location = useLocation();
  const { client, points_history, referrals, available_rewards } = location.state?.data || {};
  const [copied, setCopied] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [msg, setMsg] = useState('');

  if (!client) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center relative">
        <Background3D />
        <div className="text-center relative z-10">
          <p className="text-xl mb-4 text-gray-300">No profile data found.</p>
          <Link to="/" className="text-purple-400 hover:underline tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>[ GO BACK TO SEARCH ]</Link>
        </div>
      </div>
    );
  }

  const copyCode = () => {
    navigator.clipboard.writeText(client.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const contactInfo = {};
      if (contactEmail) contactInfo.email = contactEmail;
      if (contactPhone) contactInfo.phone = contactPhone;
      if (!contactEmail && !contactPhone) {
        setMsg('Please provide at least an email or phone number.');
        return;
      }
      await api.post('/public/redeem', {
        client_id: client.id,
        reward_id: selectedReward.id,
        contact_info: contactInfo,
      });
      setMsg('Redemption request submitted! Admin will review it.');
      setShowRedeem(false);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen text-white p-6 relative">
      {/* 3D Background */}
      <Background3D />

      <div className="relative max-w-4xl mx-auto z-10">
        <Link to="/" className="text-gray-500 hover:text-purple-400 text-sm tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>[← BACK TO HOME]</Link>

        {/* Profile Header */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mt-4 mb-6 border-2 border-purple-800 glow-purple">
          <h1 className="text-5xl font-bold mb-2 glow-text tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>{client.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg font-mono bg-gray-800 px-3 py-1 rounded border border-purple-700 text-purple-300">{client.referral_code}</span>
            <button onClick={copyCode} className="text-gray-400 hover:text-purple-400 transition-colors">
              {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800/50 p-3 rounded border border-purple-900">
              <p className="text-4xl font-bold text-purple-400" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>{client.total_points}</p>
              <p className="text-xs text-gray-400 mt-1 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>CURRENT POINTS</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded border border-purple-900">
              <p className="text-4xl font-bold text-green-400" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>{client.points_earned}</p>
              <p className="text-xs text-gray-400 mt-1 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TOTAL EARNED</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded border border-purple-900">
              <p className="text-4xl font-bold text-yellow-400" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>{client.points_redeemed}</p>
              <p className="text-xs text-gray-400 mt-1 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TOTAL REDEEMED</p>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-800">
          <h2 className="text-2xl font-bold mb-4 text-gradient tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>REFERRAL HISTORY ({referrals?.length || 0})</h2>
          {referrals && referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-800 text-left text-purple-400">
                    <th className="pb-2 pr-4 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NAME</th>
                    <th className="pb-2 pr-4 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TATTOO SIZE</th>
                    <th className="pb-2 pr-4 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>POINTS</th>
                    <th className="pb-2 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-2 pr-4">{r.referred_client?.name || 'N/A'}</td>
                      <td className="py-2 pr-4 capitalize">{r.tattoo_size}</td>
                      <td className="py-2 pr-4 text-purple-300 font-bold">{r.points_awarded_to_referrer}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs border ${
                          r.status === 'completed' 
                            ? 'bg-green-900/30 text-green-400 border-green-800' 
                            : 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
                        }`}>
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm tracking-wider">No referrals yet. Share your code to earn!</p>
          )}
        </div>

        {/* Points History */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-800">
          <h2 className="text-2xl font-bold mb-4 text-gradient tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>POINTS HISTORY</h2>
          {points_history && points_history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-800 text-left text-purple-400">
                    <th className="pb-2 pr-4 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>DATE</th>
                    <th className="pb-2 pr-4 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TYPE</th>
                    <th className="pb-2 pr-4 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>DESCRIPTION</th>
                    <th className="pb-2 tracking-wider text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>POINTS</th>
                  </tr>
                </thead>
                <tbody>
                  {points_history.map((t, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-2 pr-4">{new Date(t.created_at).toLocaleDateString()}</td>
                      <td className="py-2 pr-4 capitalize text-purple-300">{t.type}</td>
                      <td className="py-2 pr-4 text-gray-300">{t.description}</td>
                      <td className={`py-2 font-bold ${t.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {t.points > 0 ? '+' : ''}{t.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm tracking-wider">No transactions yet.</p>
          )}
        </div>

        {/* Available Rewards */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-800">
          <h2 className="text-2xl font-bold mb-4 text-gradient tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>AVAILABLE REWARDS</h2>
          {available_rewards && available_rewards.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {available_rewards.map(r => (
                <div key={r.id} className="bg-gray-800/70 rounded-lg p-4 border border-purple-900 hover:border-purple-600 transition-all hover:glow-purple">
                  <h3 className="font-bold text-purple-300" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>{r.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{r.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-purple-400 font-bold border border-purple-700 px-2 py-1 rounded bg-gray-900/50" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{r.points_required} PTS</span>
                    <button
                      onClick={() => { setSelectedReward(r); setShowRedeem(true); }}
                      className="px-3 py-1 bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 rounded text-sm font-medium border border-purple-600 transition-all"
                    >
                      REDEEM
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm tracking-wider">No rewards available for your points balance yet.</p>
          )}
        </div>

        {/* Redemption Modal */}
        {showRedeem && selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowRedeem(false)} />
            <div className="relative bg-gray-900 rounded-lg p-6 w-full max-w-md border-2 border-purple-700 glow-purple">
              <h2 className="text-2xl font-bold mb-2 text-gradient tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>REDEEM: {selectedReward.name.toUpperCase()}</h2>
              <p className="text-purple-400 mb-4 border border-purple-800 bg-purple-900/20 p-2 rounded inline-block" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>COST: {selectedReward.points_required} POINTS</p>
              <form onSubmit={handleRedeem} className="space-y-3">
                <input
                  className="w-full p-3 rounded bg-gray-800 border border-purple-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  placeholder="YOUR EMAIL (OPTIONAL)"
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                />
                <input
                  className="w-full p-3 rounded bg-gray-800 border border-purple-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  placeholder="YOUR PHONE (OPTIONAL)"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                />
                {msg && <p className="text-sm text-yellow-400 border border-yellow-800 bg-yellow-900/30 p-2 rounded">{msg}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowRedeem(false)} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium border border-gray-700 transition-all tracking-wider">CANCEL</button>
                  <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 rounded-lg font-bold border border-purple-600 transition-all tracking-wider">SUBMIT</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
