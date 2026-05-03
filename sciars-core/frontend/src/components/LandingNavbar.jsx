import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-slate-700/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">SCIARS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Categories
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Roles
            </button>
            <Link
              to="/login"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 py-4 space-y-2">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="block w-full text-left px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Categories
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="block w-full text-left px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Roles
            </button>
            <Link
              to="/login"
              className="block mx-4 mt-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center font-medium rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
