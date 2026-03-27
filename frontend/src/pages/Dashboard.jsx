import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, CheckCircle2, DollarSign, Clock, XCircle, Star, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [newService, setNewService] = useState({ title: '', category: 'Cleaning', price: '' });
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (user?.role === 'user' || user?.role === 'provider') {
        const res = await api.get('/bookings');
        setData(res.data.data || []);
      }
      
      if (user?.role === 'provider') {
        const earnRes = await api.get('/dashboard/provider/earnings');
        setEarnings(earnRes.data.total_earnings || 0);

        const mySvcRes = await api.get('/services', { params: { providerId: user.id, limit: 100 } });
        setMyServices(mySvcRes.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newService, price: parseFloat(newService.price) };
      if (editingServiceId) {
        await api.put(`/services/${editingServiceId}`, payload);
        alert('Service Updated Successfully!');
      } else {
        await api.post('/services', payload);
        alert('Service Published Successfully!');
      }
      setShowForm(false);
      setEditingServiceId(null);
      setNewService({ title: '', category: 'Cleaning', price: '' });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving service');
    }
  };

  const handleEditService = (svc) => {
    setEditingServiceId(svc.id);
    setNewService({ title: svc.title, category: svc.category, price: svc.price });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to permanently delete this service? This action cannot be undone.")) {
      try {
        await api.delete(`/services/${serviceId}`);
        alert('Service successfully deleted.');
        fetchDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting service');
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) return alert('Please select a valid rating (1-5).');
    try {
      await api.post('/reviews', { 
        provider_id: reviewBooking.provider_id, 
        rating: parseInt(reviewForm.rating), 
        comment: reviewForm.comment 
      });
      alert('Thank you! Your verified review has been published publicly!');
      setReviewBooking(null);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing review');
    }
  };

  const downloadInvoice = (booking) => {
    import('jspdf').then(({ jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.setTextColor(79, 70, 229);
        doc.text("SERVICE MARKETPLACE", 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Official Platform Receipt", 14, 28);
        doc.text(`Booking Reference: #${booking.id}`, 14, 34);
        doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 40);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Billed To:", 14, 55);
        doc.setFontSize(10);
        doc.text(`Name: ${user.name}`, 14, 62);
        doc.text(`Role: ${user.role.toUpperCase()}`, 14, 68);

        const tableColumn = ["Description", "Date of Service", "Status", "Commissionable"];
        const tableRows = [[
          `Service Reference #${booking.service_id}`,
          new Date(booking.booking_date).toLocaleDateString(),
          "Completed",
          "Yes"
        ]];

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 80,
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229] }
        });

        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for choosing our certified professionals.", 14, doc.lastAutoTable.finalY + 20);

        doc.save(`Invoice_Booking_${booking.id}.pdf`);
      });
    }).catch(err => {
      console.error(err);
      alert('Failed to load PDF engine. Ensure dependencies are installed.');
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your workspace...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Hello, {user?.name}
        </h1>
        <p className="text-gray-500 mt-2">Manage your {user?.role === 'provider' ? 'business and incoming bookings' : 'service appointments'} here.</p>
      </div>

      {user?.role === 'provider' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Earnings</p>
              <h3 className="text-3xl font-extrabold text-gray-900">${earnings}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center">
              <Calendar className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Jobs</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{data.filter(b => !['completed', 'cancelled'].includes(b.status)).length}</h3>
            </div>
          </div>
          <div 
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setEditingServiceId(null);
                setNewService({ title: '', category: 'Cleaning', price: '' });
              }
            }}
            className="bg-indigo-600 p-6 rounded-2xl shadow-sm border border-indigo-700 flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-700 transition-colors group"
          >
            <span className="text-white font-bold text-lg group-hover:scale-105 transition-transform">{showForm ? 'Cancel Form' : '+ Create New Service'}</span>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-10 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{editingServiceId ? 'Update Existing Service' : 'Publish a New Service'}</h2>
          <form onSubmit={handleSaveService} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service Title</label>
              <input type="text" required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} placeholder="e.g. Deep Home Cleaning" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-indigo-500">
                <option value="Cleaning">Cleaning</option>
                <option value="Repair">Repair</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
              <input type="number" required value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} placeholder="50.00" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">{editingServiceId ? 'Save Changes' : 'Publish to Marketplace'}</button>
            </div>
          </form>
        </div>
      )}

      {user?.role === 'provider' && myServices.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">My Active Services</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {myServices.map(svc => (
              <div key={svc.id} className="p-6 hover:bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{svc.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{svc.category} • ${svc.price}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditService(svc)} 
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Edit Information
                  </button>
                  <button 
                    onClick={() => handleDeleteService(svc.id)} 
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{user?.role === 'provider' ? 'Incoming Bookings' : 'My Bookings'}</h2>
        </div>
        
        {data.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No bookings found in your history.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {data.map(booking => (
              <div key={booking.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    booking.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {booking.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                     booking.status === 'cancelled' ? <XCircle className="w-5 h-5" /> :
                     <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Service Reference #{booking.service_id}</h4>
                    <p className="text-gray-500 text-sm mt-1">Booked for: {new Date(booking.booking_date).toLocaleDateString()}</p>
                    <span className={`inline-block px-3 py-1 mt-3 text-xs font-bold uppercase tracking-wider rounded-full ${
                      booking.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                      booking.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {user?.role === 'provider' && booking.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => updateStatus(booking.id, 'accepted')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 shadow-sm">Accept</button>
                    <button onClick={() => updateStatus(booking.id, 'cancelled')} className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100">Reject</button>
                  </div>
                )}

                {user?.role === 'user' && ['pending', 'accepted'].includes(booking.status) && (
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to cancel this booking?')) {
                        updateStatus(booking.id, 'cancelled')
                      }
                    }} 
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 shrink-0 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}

                {user?.role === 'user' && booking.status === 'completed' && (
                  <button 
                    onClick={() => setReviewBooking(booking)} 
                    className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 text-sm font-semibold rounded-lg hover:bg-yellow-100 shrink-0 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    Review Service
                  </button>
                )}

                {booking.status === 'completed' && (
                  <button 
                    onClick={() => downloadInvoice(booking)} 
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black shrink-0 transition-colors flex items-center gap-1.5 shadow-md ml-2"
                  >
                    <FileText className="w-4 h-4" />
                    Invoice (PDF)
                  </button>
                )}
                
                {user?.role === 'provider' && booking.status === 'accepted' && (
                  <button onClick={() => updateStatus(booking.id, 'in_progress')} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm shrink-0">Start Service</button>
                )}

                {user?.role === 'provider' && booking.status === 'in_progress' && (
                  <button onClick={() => updateStatus(booking.id, 'completed')} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 shadow-sm shrink-0">Mark Completed</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal Overlay */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-fade-in">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Rate Your Experience</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">Leave a public review for Service #{reviewBooking.service_id}. This helps the provider grow their local business!</p>
            
            <form onSubmit={handleSubmitReview}>
              <div className="mb-6 bg-gray-50 p-4 rounded-2xl flex justify-center">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <Star 
                      key={num} 
                      onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                      className={`w-10 h-10 cursor-pointer transition-all hover:scale-110 ${reviewForm.rating >= num ? 'text-yellow-400 fill-current' : 'text-gray-300'} drop-shadow-sm`} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Written Review (Optional)</label>
                <textarea 
                  rows="3" 
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="They did a fantastic job..." 
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none font-medium text-gray-700 transition-all" 
                ></textarea>
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => { setReviewBooking(null); setReviewForm({ rating: 5, comment: '' }); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >Cancel</button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-500 shadow-[0_4px_14px_rgba(250,204,21,0.4)] transition-colors"
                >Publish Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
