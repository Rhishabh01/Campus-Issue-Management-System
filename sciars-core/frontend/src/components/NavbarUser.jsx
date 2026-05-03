import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';

const NavbarUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user: authUser } = useAuth();

  const userEmail = authUser?.email || 'user@campus.edu';

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/user" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              SCIARS
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold bg-primary-100 text-primary-700 rounded uppercase tracking-wide">
              User
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/user"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/user')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/report"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/report')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Report Issue
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell userId={userEmail} />
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors" 
              aria-label="Logout"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-2">
            <Link
              to="/user"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive('/user')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive('/report')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Report Issue
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarUser;
