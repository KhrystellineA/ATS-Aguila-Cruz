import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import api from '../../api/axios';

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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No profile data found.</p>
          <Link to="/" className="text-red-400 hover:underline">Go back to search</Link>
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

  const statusColor = (s) => {
    const map = { pending: 'warning', completed: 'success' };
    return map[s] || 'default';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-gray-400 hover:text-white text-sm">&larr; Back to Home</Link>

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-6 mt-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">{client.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg font-mono bg-gray-700 px-3 py-1 rounded">{client.referral_code}</span>
            <button onClick={copyCode} className="text-gray-400 hover:text-white">
              {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-red-400">{client.total_points}</p>
              <p className="text-sm text-gray-400">Current Points</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">{client.points_earned}</p>
              <p className="text-sm text-gray-400">Total Earned</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">{client.points_redeemed}</p>
              <p className="text-sm text-gray-400">Total Redeemed</p>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">People You Referred ({referrals?.length || 0})</h2>
          {referrals && referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-left text-gray-400">
                    <th className="pb-2 pr-4">Name</th>
                    <th className="pb-2 pr-4">Tattoo Size</th>
                    <th className="pb-2 pr-4">Points Earned</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-2 pr-4">{r.referred_client?.name || 'N/A'}</td>
                      <td className="py-2 pr-4 capitalize">{r.tattoo_size}</td>
                      <td className="py-2 pr-4">{r.points_awarded_to_referrer}</td>
                      <td className="py-2"><span className={`px-2 py-1 rounded text-xs ${r.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No referrals yet. Share your code to earn!</p>
          )}
        </div>

        {/* Points History */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Points History</h2>
          {points_history && points_history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-left text-gray-400">
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2 pr-4">Description</th>
                    <th className="pb-2">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {points_history.map((t, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-2 pr-4">{new Date(t.created_at).toLocaleDateString()}</td>
                      <td className="py-2 pr-4 capitalize">{t.type}</td>
                      <td className="py-2 pr-4">{t.description}</td>
                      <td className={`py-2 font-bold ${t.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {t.points > 0 ? '+' : ''}{t.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No transactions yet.</p>
          )}
        </div>

        {/* Available Rewards */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Available Rewards</h2>
          {available_rewards && available_rewards.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {available_rewards.map(r => (
                <div key={r.id} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-bold">{r.name}</h3>
                  <p className="text-sm text-gray-400">{r.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-red-400 font-bold">{r.points_required} pts</span>
                    <button
                      onClick={() => { setSelectedReward(r); setShowRedeem(true); }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No rewards available for your points balance yet.</p>
          )}
        </div>

        {/* Redemption Modal */}
        {showRedeem && selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={() => setShowRedeem(false)} />
            <div className="relative bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Redeem: {selectedReward.name}</h2>
              <p className="text-gray-400 mb-4">Cost: {selectedReward.points_required} points</p>
              <form onSubmit={handleRedeem} className="space-y-3">
                <input
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                  placeholder="Your Email (optional)"
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                />
                <input
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                  placeholder="Your Phone (optional)"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                />
                {msg && <p className="text-sm text-yellow-400">{msg}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowRedeem(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
