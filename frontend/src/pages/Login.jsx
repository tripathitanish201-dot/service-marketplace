import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to securely login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
        <p className="text-gray-500 mt-2 text-sm">Please sign in to your account</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50/80 text-red-600 rounded-xl text-sm border border-red-100 font-medium">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="email" 
              required 
              className="w-full pl-11 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
              placeholder="you@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
          <div className="relative flex items-center">
            <KeyRound className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="password" 
              required 
              className="w-full pl-11 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4 transform active:scale-[0.98]"
        >
          {loading ? 'Authenticating...' : 'Sign in securely'}
        </button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors hover:underline underline-offset-4">Create one</Link>
      </p>
    </div>
  );
};

export default Login;
