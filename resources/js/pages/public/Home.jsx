import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <h1 className="text-5xl font-bold mb-3">TATS by TATS</h1>
        <p className="text-gray-400 text-lg mb-2">Affiliate & Loyalty Program</p>
        <p className="text-gray-500 text-center max-w-md mb-10">
          Get inked, earn points, and share your referral code with friends. 
          Every time someone uses your code, you BOTH earn points!
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-center mb-4">Find Your Profile</h2>
          <input
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
            placeholder="Your Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
            placeholder="Referral Code (e.g. YSE888)"
            value={form.referral_code}
            onChange={e => setForm({ ...form, referral_code: e.target.value.toUpperCase() })}
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find My Profile'}
          </button>
        </form>
      </div>

      {/* How It Works */}
      <div className="max-w-3xl mx-auto p-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2">Get Inked</h3>
            <p className="text-gray-400 text-sm">Every tattoo earns you points based on size — minimalist, medium, or big.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="font-bold text-lg mb-2">Share Your Code</h3>
            <p className="text-gray-400 text-sm">Tell your friends your referral code. When they use it, you BOTH earn points.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="font-bold text-lg mb-2">Redeem Rewards</h3>
            <p className="text-gray-400 text-sm">Use your points for discounts, merch, upgrades, and more.</p>
          </div>
        </div>
      </div>

      {/* Admin link */}
      <div className="text-center pb-8">
        <a href="/admin/login" className="text-gray-600 text-sm hover:text-gray-400">Admin Login</a>
      </div>
    </div>
  );
}
