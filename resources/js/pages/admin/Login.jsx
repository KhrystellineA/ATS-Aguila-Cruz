import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-800 p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <a href="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-gray-300">Back to Home</a>
      </form>
    </div>
  );
}
