import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Background3D from '../../components/Background3D';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, password_confirmation);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* 3D Background */}
      <Background3D />

      <div className="relative w-full max-w-sm bg-gray-900/90 backdrop-blur-sm p-8 rounded-lg border-2 border-purple-800 glow-purple">
        <h1 className="text-5xl font-bold text-white text-center mb-2 glow-text tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em' }}>REGISTER</h1>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent mb-4 mx-auto"></div>
        <p className="text-center text-purple-400 text-sm mb-6 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}>CREATE ACCOUNT</p>
        
        {error && <p className="text-red-400 text-sm mb-4 border border-red-800 bg-red-900/30 p-2 rounded">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-400 text-xs mb-1 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NAME</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-800 border border-purple-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Your Name"
            />
          </div>
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
              minLength="8"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="block text-purple-400 text-xs mb-1 tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>CONFIRM PASSWORD</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-gray-800 border border-purple-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              value={password_confirmation}
              onChange={e => setPasswordConfirmation(e.target.value)}
              required
              placeholder="Confirm Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}
          >
            {loading ? 'REGISTERING...' : 'REGISTER'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/admin/login" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}