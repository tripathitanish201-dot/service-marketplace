import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, Briefcase, CalendarCheck, ShieldAlert, CheckCircle, Clock, Trash2, Search, ChevronLeft, ChevronRight, Activity, LayoutList, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ total_users: 0, total_providers: 0, total_bookings: 0, gross_market_value: 0, platform_profit: 0 });
  const [activeTab, setActiveTab] = useState('users');
  
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error loading stats', err);
    }
  };

  const fetchTabData = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = `/admin/${activeTab}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const res = await api.get(endpoint);
      setData(res.data.data || res.data.logs || []);
      setTotalItems(res.data.total || 0);
    } catch (err) {
      console.error(err);
      alert('Error loading tab data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, limit, search]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  useEffect(() => {
    fetchTabData();
  }, [fetchTabData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  const toggleBlockUser = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/block`, { is_blocked: !currentStatus });
      fetchTabData();
    } catch (err) {
      alert('Failed to update user block status');
    }
  };

  const toggleApproveProvider = async (providerId, currentStatus) => {
    try {
      await api.patch(`/admin/providers/${providerId}/approve`, { is_approved: !currentStatus });
      fetchTabData();
    } catch (err) {
      alert('Failed to update provider approval status');
    }
  };

  const deleteService = async (serviceId) => {
    if (window.confirm('WARNING: Force delete this service from the platform permanently?')) {
      try {
        await api.delete(`/admin/services/${serviceId}`);
        fetchTabData();
      } catch (err) {
        alert('Failed to delete service');
      }
    }
  };

  const totalPages = Math.ceil(totalItems / limit) || 1;

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-10 h-10 text-red-600" />
            Admin Control Center
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Platform financial tracking and security auditing.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
            <DollarSign className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gross Market Value</p>
            <h3 className="text-2xl font-black text-gray-900">${parseFloat(stats.gross_market_value || 0).toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl shadow-lg border border-indigo-700 flex items-center gap-4 text-white">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Platform Profit (15%)</p>
            <h3 className="text-2xl font-black text-white">${parseFloat(stats.platform_profit || 0).toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Accounts</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.total_users}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
            <CalendarCheck className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bookings</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.total_bookings}</h3>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {['users', 'providers', 'services', 'logs'].map((tab) => (
            <button 
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-4 px-6 font-bold text-sm md:text-base uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {tab === 'logs' ? 'System Logs' : `Manage ${tab}`}
            </button>
          ))}
        </div>

        {/* Toolbar (Search & Pagination Info) */}
        <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-indigo-500 outline-none transition-colors shadow-sm text-sm"
            />
          </form>
          <div className="text-sm font-bold text-gray-500">
            Showing {data.length} of {totalItems} total records
          </div>
        </div>

        {/* Table Area */}
        <div className="p-0 overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-12 pl-6 text-center text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center h-full">
              Loading Data Sphere...
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 pl-6 text-center text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center h-full">
              No matching records found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100">
                  <th className="font-bold py-4 pl-6">ID</th>
                  
                  {activeTab === 'users' && (
                    <><th className="font-bold py-4">Name & Email</th><th className="font-bold py-4">Role</th><th className="font-bold py-4">Joined</th><th className="font-bold py-4 pr-6 text-right">Actions</th></>
                  )}
                  {activeTab === 'providers' && (
                    <><th className="font-bold py-4">Contact</th><th className="font-bold py-4">Category</th><th className="font-bold py-4">Status</th><th className="font-bold py-4 pr-6 text-right">Actions</th></>
                  )}
                  {activeTab === 'services' && (
                    <><th className="font-bold py-4">Service</th><th className="font-bold py-4">Provider</th><th className="font-bold py-4">Price / Cat</th><th className="font-bold py-4 pr-6 text-right">Moderation</th></>
                  )}
                  {activeTab === 'logs' && (
                    <><th className="font-bold py-4">Action</th><th className="font-bold py-4">Performed By</th><th className="font-bold py-4">Details</th><th className="font-bold py-4 pr-6 text-right">Timestamp</th></>
                  )}

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pl-6 text-gray-500 font-medium whitespace-nowrap">#{row.id}</td>

                    {/* Users Row */}
                    {activeTab === 'users' && (
                      <>
                        <td className="py-4"><p className="font-bold text-gray-900">{row.name}</p><p className="text-sm text-gray-500">{row.email}</p></td>
                        <td className="py-4 whitespace-nowrap"><span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${row.role === 'admin' ? 'bg-red-100 text-red-700' : row.role === 'provider' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{row.role}</span></td>
                        <td className="py-4 text-gray-500 text-sm font-medium whitespace-nowrap">{new Date(row.created_at).toLocaleDateString()}</td>
                        <td className="py-4 pr-6 text-right whitespace-nowrap">
                          {row.role !== 'admin' && (
                            <button onClick={() => toggleBlockUser(row.id, !!row.is_blocked)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${row.is_blocked ? 'bg-gray-900 text-white hover:bg-black shadow-md' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'}`}>
                              {row.is_blocked ? 'Unban' : 'Ban'}
                            </button>
                          )}
                        </td>
                      </>
                    )}

                    {/* Providers Row */}
                    {activeTab === 'providers' && (
                      <>
                        <td className="py-4"><p className="font-bold text-gray-900">{row.name}</p><p className="text-sm text-gray-500">{row.email}</p></td>
                        <td className="py-4 font-bold text-gray-700 whitespace-nowrap">{row.category}</td>
                        <td className="py-4 whitespace-nowrap">
                          <span className={`flex items-center gap-1.5 text-sm font-bold ${row.is_approved ? 'text-green-600' : 'text-amber-500'}`}>
                            {row.is_approved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            {row.is_approved ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 pr-6 text-right whitespace-nowrap">
                          <button onClick={() => toggleApproveProvider(row.id, !!row.is_approved)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${row.is_approved ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                            {row.is_approved ? 'Revoke' : 'Approve'}
                          </button>
                        </td>
                      </>
                    )}

                    {/* Services Row */}
                    {activeTab === 'services' && (
                      <>
                        <td className="py-4"><p className="font-bold text-gray-900">{row.title}</p></td>
                        <td className="py-4"><p className="text-sm font-bold text-gray-700">{row.provider_name}</p><p className="text-xs text-gray-400">{row.provider_email}</p></td>
                        <td className="py-4 font-bold text-gray-700 whitespace-nowrap">${row.price} <span className="text-xs text-gray-400 font-normal">/ {row.category}</span></td>
                        <td className="py-4 pr-6 text-right whitespace-nowrap">
                          <button onClick={() => deleteService(row.id)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-700 transition-colors flex items-center justify-end gap-2 ml-auto">
                            <Trash2 className="w-3.5 h-3.5" /> Force Delete
                          </button>
                        </td>
                      </>
                    )}

                    {/* Logs Row */}
                    {activeTab === 'logs' && (
                      <>
                        <td className="py-4 whitespace-nowrap"><span className="px-3 py-1 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg uppercase">{row.action}</span></td>
                        <td className="py-4 whitespace-nowrap"><p className="font-bold text-gray-900 text-sm">{row.user_name || 'System'}</p><p className="text-xs text-gray-500">{row.user_email || 'System'}</p></td>
                        <td className="py-4"><p className="text-sm text-gray-600">{row.details}</p></td>
                        <td className="py-4 pr-6 text-right text-xs text-gray-400 whitespace-nowrap font-medium">{new Date(row.created_at).toLocaleString()}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 md:p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 flex items-center gap-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest hidden md:block">
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 flex items-center gap-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
