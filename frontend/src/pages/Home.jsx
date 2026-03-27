import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Star, Wrench, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();
  }, [search, category, minPrice, maxPrice]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = { search, category, limit: 20 };
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      
      const { data } = await api.get('/services', { params });
      setServices(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookModal = (serviceId) => {
    if (!user) return alert('Please login to book a service');
    if (user.role === 'provider' || user.role === 'admin') return alert('Only user accounts can book services.');
    setSelectedServiceId(serviceId);
  };

  const handleConfirmBook = async () => {
    if (!bookingDate) return alert('Please select a valid date and time!');
    try {
      await api.post('/bookings', { service_id: selectedServiceId, booking_date: new Date(bookingDate).toISOString() });
      alert('Service Booked successfully for your requested time!');
      setSelectedServiceId(null);
      setBookingDate('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error booking service');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-600 rounded-[2rem] p-12 mb-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Wrench className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Professional services,<br/>on demand.
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-lg">
            Connect with top-rated experts for home cleaning, repairs, and maintenance in seconds.
          </p>
          
          <div className="flex bg-white rounded-full p-2 shadow-lg max-w-xl focus-within:ring-4 focus-within:ring-indigo-500/30 transition-all">
            <div className="flex-grow flex items-center pl-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="What do you need help with?" 
                className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 text-gray-700 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="bg-gray-50 border-none rounded-full py-3 px-6 text-gray-600 font-medium focus:ring-0 outline-none cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Repair">Repair</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          
          <div className="flex gap-4 max-w-xl mt-4 bg-white/10 p-2 text-white rounded-2xl border border-white/20 items-center justify-center backdrop-blur-md">
             <span className="text-sm font-bold opacity-80 pl-2">Price Filter:</span>
             <input type="number" placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-24 bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 text-white placeholder-white/50 outline-none text-sm font-medium focus:bg-white/30 transition-all"/>
             <span className="opacity-70">-</span>
             <input type="number" placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-24 bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 text-white placeholder-white/50 outline-none text-sm font-medium focus:bg-white/30 transition-all"/>
          </div>

        </div>
      </div>

      {/* Services Grid */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl font-bold text-gray-900">Featured Services</h2>
        <span className="text-indigo-600 font-semibold text-sm bg-indigo-50 px-4 py-1.5 rounded-full">{services.length} providers available</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl h-80 shadow-sm border border-gray-100"></div>)}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">No services found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img 
                  src={service.image || `https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80`} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  4.8
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{service.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{service.description || 'Professional service by certified experts.'}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-gray-900">${service.price}</span>
                    <span className="text-gray-500 text-sm ml-1">/ session</span>
                  </div>
                  <button 
                    onClick={() => handleOpenBookModal(service.id)}
                    className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors group/btn shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedServiceId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Service</h2>
            <p className="text-gray-500 mb-6 text-sm">When would you like the professional to arrive?</p>
            
            <input 
              type="datetime-local" 
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 mb-6 font-medium text-gray-700" 
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedServiceId(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >Cancel</button>
              <button 
                onClick={() => handleConfirmBook()}
                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-colors"
              >Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
