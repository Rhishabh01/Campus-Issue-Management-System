import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { getIssues } from '../services/api';

const NavbarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [usersDropdown, setUsersDropdown] = useState(false);
  const [userStats, setUserStats] = useState({ totalUsers: 0, topUsers: [], areaBreakdown: [] });
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getIssues({ role: "admin" });
        const issues = Array.isArray(res.data) ? res.data : [];
        
        const userCount = {};
        const areaCount = {};
        
        issues.forEach(issue => {
          if (issue.reportedBy) {
            userCount[issue.reportedBy] = (userCount[issue.reportedBy] || 0) + 1;
          }
          if (issue.area) {
            areaCount[issue.area] = (areaCount[issue.area] || 0) + 1;
          }
        });

        const topUsers = Object.entries(userCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        const areaBreakdown = Object.entries(areaCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([area, count]) => ({ area, count }));

        setUserStats({ totalUsers: Object.keys(userCount).length, topUsers, areaBreakdown });
      } catch {
        setUserStats({ totalUsers: 0, topUsers: [], areaBreakdown: [] });
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUsersDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    {
      to: '/admin',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      to: '/admin/issues',
      label: 'All Issues',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Brand */}
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              SCIARS
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Bell + Users Dropdown + Logout */}
          <div className="flex items-center gap-3">
            <NotificationBell userId="admin@sciars.edu" />

            {/* Users Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUsersDropdown(!usersDropdown)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  usersDropdown
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Users ({userStats.totalUsers})
                <svg className={`w-4 h-4 transition-transform ${usersDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {usersDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">User Statistics</p>
                  </div>
                  
                  <div className="px-4 py-2">
                    <p className="text-2xl font-bold text-indigo-600">{userStats.totalUsers}</p>
                    <p className="text-xs text-gray-500">Total Users</p>
                  </div>

                  <div className="px-4 py-2 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Top Complainants</p>
                    {userStats.topUsers.length > 0 ? (
                      <ul className="space-y-1">
                        {userStats.topUsers.map((user, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 truncate">{user.name}</span>
                            <span className="font-semibold text-indigo-600 ml-2">{user.count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400">No data</p>
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Top Areas</p>
                    {userStats.areaBreakdown.length > 0 ? (
                      <ul className="space-y-1">
                        {userStats.areaBreakdown.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 truncate">{item.area}</span>
                            <span className="font-semibold text-indigo-600 ml-2">{item.count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400">No data</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setUsersDropdown(!usersDropdown);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                usersDropdown
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Users ({userStats.totalUsers})
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarAdmin;
