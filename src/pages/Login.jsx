import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-900 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-brand-400 text-center mb-8">CoreInventory AI</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-surface-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-surface-200"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="mt-6 w-full py-3 bg-brand-600 text-white font-medium rounded-lg disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="mt-4 text-center text-sm text-slate-500">
            No account? <Link to="/register" className="text-brand-600 hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
