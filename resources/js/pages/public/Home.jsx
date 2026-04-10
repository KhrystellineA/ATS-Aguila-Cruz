import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Background3D from '../../components/Background3D';

export default function Home() {
  const [form, setForm] = useState({ name: '', referral_code: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.get('/public/search', { params: form });
      navigate('/profile', { state: { data: res.data } });
    } catch (err) {
      setError('No matching profile found. Please check your name and referral code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative">
      {/* 3D Background */}
      <Background3D />

      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center min-h-[60vh] p-6">
        <h1 className="text-7xl font-bold mb-3 glow-text tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>TATS by TATS</h1>
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent mb-4"></div>
        <p className="text-purple-300 text-lg mb-2 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}>AFFILIATE & LOYALTY PROGRAM</p>
        <p className="text-gray-400 text-center max-w-md mb-10 leading-relaxed">
          Get inked, earn points, and share your referral code with friends.
          Every time someone uses your code, you BOTH earn points!
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-md space-y-4 bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border-2 border-purple-800 glow-purple">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gradient tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>FIND YOUR PROFILE</h2>
          <input
            className="w-full p-3 rounded bg-gray-800 border border-purple-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            placeholder="ENTER YOUR NAME"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full p-3 rounded bg-gray-800 border border-purple-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            placeholder="REFERRAL CODE (e.g. YSE888)"
            value={form.referral_code}
            onChange={e => setForm({ ...form, referral_code: e.target.value.toUpperCase() })}
            required
          />
          {error && <p className="text-red-400 text-sm border border-red-800 bg-red-900/30 p-2 rounded">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 rounded-lg font-bold disabled:opacity-50 transition-all tracking-wider border border-purple-600"
          >
            {loading ? 'SEARCHING...' : 'FIND MY PROFILE'}
          </button>
        </form>
      </div>

      {/* How It Works */}
      <div className="relative max-w-3xl mx-auto p-6 py-12">
        <h2 className="text-4xl font-bold text-center mb-8 text-gradient tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>HOW IT WORKS</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-purple-800 text-center hover:border-purple-600 transition-all hover:glow-purple">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2 text-purple-300" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>GET INKED</h3>
            <p className="text-gray-400 text-sm">Every tattoo earns you points based on size — minimalist, medium, or big.</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-purple-800 text-center hover:border-purple-600 transition-all hover:glow-purple">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="font-bold text-lg mb-2 text-purple-300" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>SHARE YOUR CODE</h3>
            <p className="text-gray-400 text-sm">Tell your friends your referral code. When they use it, you BOTH earn points.</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-purple-800 text-center hover:border-purple-600 transition-all hover:glow-purple">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="font-bold text-lg mb-2 text-purple-300" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>REDEEM REWARDS</h3>
            <p className="text-gray-400 text-sm">Use your points for discounts, merch, upgrades, and more.</p>
          </div>
        </div>
      </div>

      {/* Admin link */}
      <div className="relative text-center pb-8">
        <a href="/admin/login" className="text-gray-600 text-sm hover:text-purple-400 transition-colors tracking-widest">[ ADMIN ACCESS ]</a>
      </div>
    </div>
  );
}
