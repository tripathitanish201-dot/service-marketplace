import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, KeyRound, Briefcase } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create account</h2>
        <p className="text-gray-500 mt-2 text-sm">Join the marketplace today</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50/80 text-red-600 rounded-xl text-sm border border-red-100 font-medium">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
          <div className="relative flex items-center">
            <User className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input name="name" type="text" required onChange={handleChange} placeholder="John Doe" className="w-full pl-11 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400" />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input name="email" type="email" required onChange={handleChange} placeholder="you@email.com" className="w-full pl-11 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400" />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
          <div className="relative flex items-center">
            <KeyRound className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input name="password" type="password" required minLength="6" onChange={handleChange} placeholder="Create a strong password" className="w-full pl-11 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400" />
          </div>
        </div>

        <div className="relative group pt-1">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Account Type</label>
          <div className="relative flex items-center">
            <Briefcase className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors z-10" />
            <select name="role" onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none text-gray-700 font-medium">
              <option value="user">I want to book services & hire</option>
              <option value="provider">I want to offer my services</option>
              <option value="admin">System Administrator (Admin Panel)</option>
            </select>
            <div className="absolute right-4 pointer-events-none text-gray-400">▼</div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed mt-6 transform active:scale-[0.98]"
        >
          {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors hover:underline underline-offset-4">Sign in securely</Link>
      </p>
    </div>
  );
};

export default Register;
