import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Background3D from '../../components/Background3D';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* 3D Background */}
      <Background3D />

      <div className="relative w-full max-w-sm bg-gray-900/90 backdrop-blur-sm p-8 rounded-lg border-2 border-purple-800 glow-purple">
        <h1 className="text-5xl font-bold text-white text-center mb-2 glow-text tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em' }}>ADMIN</h1>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent mb-4 mx-auto"></div>
        <p className="text-center text-purple-400 text-sm mb-6 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}>ACCESS TERMINAL</p>
        
        {error && <p className="text-red-400 text-sm mb-4 border border-red-800 bg-red-900/30 p-2 rounded">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-400 text-xs mb-1 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>EMAIL</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-gray-800 border border-purple-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@tats.com"
            />
          </div>
          
          <div>
            <label className="block text-purple-400 text-xs mb-1 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PASSWORD</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-gray-800 border border-purple-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg font-bold disabled:opacity-50 transition-all tracking-wider border border-purple-600"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
        
        <a href="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-purple-400 transition-colors tracking-widest">[ BACK TO HOME ]</a>
      </div>
    </div>
  );
}
