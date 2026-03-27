import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight hover:scale-105 transition-transform duration-200">
          <Wrench className="w-6 h-6" />
          <span>UrbanAssist</span>
        </Link>
        <div className="flex gap-4 items-center font-medium text-gray-600 text-sm">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Services</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-red-500 hover:text-red-700 font-bold transition-colors">Admin Panel</Link>
              )}
              <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
              <button onClick={logout} className="px-5 py-2 text-sm bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-full transition-all border border-transparent hover:border-red-100">
                Logout
              </button>
            </>
          ) : (
             <>
              <Link to="/login" className="px-2 hover:text-indigo-600 transition-colors">Log in</Link>
              <Link to="/register" className="px-5 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5">
                Join Now
              </Link>
             </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
