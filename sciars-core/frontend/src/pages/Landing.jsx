import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default function Landing() {
  useRevealOnScroll();

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      title: 'Easy Issue Reporting',
      description: 'Submit issues with photos, GPS location, and detailed descriptions using our intuitive form.',
    },
    {
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      title: 'Real-Time Tracking',
      description: 'Monitor your reports from submission to resolution with live status updates and notifications.',
    },
    {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      title: 'Role-Based Access',
      description: 'Tailored dashboards for students, supervisors, and administrators with appropriate permissions.',
    },
    {
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      title: 'Interactive Maps',
      description: 'Visualize all reported issues on an interactive campus map with color-coded status markers.',
    },
    {
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      title: 'Smart Notifications',
      description: 'Get instant alerts when your issues are reviewed, assigned, or resolved automatically.',
    },
    {
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: 'Analytics Dashboard',
      description: 'Comprehensive charts and statistics for administrators to identify trends and hotspots.',
    },
  ];

  const roles = [
    {
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      title: 'Student / Staff',
      color: 'from-primary-400 to-primary-500',
      bgColor: 'bg-primary-400/10',
      textColor: 'text-primary-400',
      borderColor: 'border-primary-400/20',
      capabilities: ['Report issues with photos', 'Track issue status in real-time', 'View issues on interactive map', 'Receive notifications on updates'],
    },
    {
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      title: 'Supervisor',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
      textColor: 'text-primary-300',
      borderColor: 'border-primary-500/20',
      capabilities: ['View assigned tasks', 'Start work on issues', 'Mark issues as resolved', 'Upload proof of resolution'],
    },
    {
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      title: 'Administrator',
      color: 'from-primary-600 to-primary-700',
      bgColor: 'bg-primary-600/10',
      textColor: 'text-primary-200',
      borderColor: 'border-primary-600/20',
      capabilities: ['View all campus issues', 'Verify and prioritize reports', 'Access analytics dashboard', 'Manage users, supervisors and areas'],
    },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07162B] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#00A6E2]/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2760A3]/5 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#103463]/50 backdrop-blur-xl rounded-full border border-[#2760A3]/20 mb-8">
              <span className="w-2 h-2 bg-[#00A6E2] rounded-full" />
              <span className="text-sm text-[#AEE0F1]">Smart Campus Issue & Resolution System</span>
            </div>
          </div>

          <h1 className="animate-fade-in-up text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            Report. Track.{' '}
            <span className="bg-gradient-to-r from-[#00A6E2] to-[#2760A3] bg-clip-text text-transparent animate-gradient">
              Resolve.
            </span>
          </h1>

          <p className="animate-fade-in-up text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            A unified platform for students and staff to report campus issues, track their status in real-time, and ensure nothing falls through the cracks.
          </p>

          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Link
              to="/login"
              className="group px-8 py-4 bg-gradient-to-r from-[#00A6E2] to-[#2760A3] hover:from-[#00A6E2]/90 hover:to-[#2760A3]/90 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              Sign In
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button
              onClick={() => scrollTo('features')}
              className="px-8 py-4 bg-[#103463]/50 hover:bg-[#103463]/70 border border-[#2760A3]/30 rounded-xl text-[#AEE0F1] hover:text-white font-medium transition-all duration-200"
            >
              Learn More
            </button>
          </div>

          <div className="animate-fade-in mt-16 flex flex-col items-center gap-2" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-[#2760A3]/40 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-[#2760A3] rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="reveal text-center mb-16">
            <span className="text-sm font-semibold text-[#00A6E2] uppercase tracking-widest">Features</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Everything You Need</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Built from the ground up to make campus issue management seamless and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`reveal stagger-${index + 1} group p-6 bg-[#103463]/30 backdrop-blur-xl rounded-2xl border border-[#2760A3]/20 hover:border-[#00A6E2]/40 hover:bg-[#103463]/50 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="w-12 h-12 bg-[#00A6E2]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00A6E2]/20 transition-colors">
                  <svg className="w-6 h-6 text-[#00A6E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#103463]/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div className="reveal text-center mb-16">
            <span className="text-sm font-semibold text-[#2760A3] uppercase tracking-widest">Process</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Three simple steps from reporting to resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
                title: 'Report',
                description: 'Submit an issue with a description, photo, and location. Our system automatically captures GPS coordinates.',
                color: 'from-primary-400 to-primary-500',
              },
              {
                step: '02',
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
                title: 'Assign',
                description: 'Administrators review and assign the issue to the appropriate supervisor or department for action.',
                color: 'from-primary-500 to-primary-600',
              },
              {
                step: '03',
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Resolve',
                description: 'Supervisors address the issue and mark it resolved with proof. You get notified when it is done.',
                color: 'from-primary-600 to-primary-700',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`reveal stagger-${index + 2} relative group`}
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#2760A3]/30 to-transparent z-0" />
                )}

                <div className="relative bg-[#103463]/30 backdrop-blur-xl rounded-2xl border border-[#2760A3]/20 p-8 hover:border-[#2760A3]/40 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div className="text-xs font-bold text-[#2760A3] mb-2">STEP {item.step}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#103463]/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div className="reveal text-center mb-16">
            <span className="text-sm font-semibold text-[#AEE0F1] uppercase tracking-widest">Roles</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Built for Everyone</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Purpose-built interfaces for each role in the campus ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {roles.map((role, index) => (
              <div
                key={index}
                className={`reveal stagger-${index + 2} bg-[#103463]/30 backdrop-blur-xl rounded-2xl border ${role.borderColor} p-8 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`w-14 h-14 ${role.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <svg className={`w-7 h-7 ${role.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={role.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">{role.title}</h3>
                <ul className="space-y-3">
                  {role.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <svg className={`w-5 h-5 ${role.textColor} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#103463] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00A6E2] to-[#2760A3] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">SCIARS</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Smart Campus Issue & Resolution System — making campuses better, one report at a time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button onClick={() => scrollTo('features')} className="block text-sm text-slate-400 hover:text-white transition-colors">Features</button>
                <button onClick={() => scrollTo('how-it-works')} className="block text-sm text-slate-400 hover:text-white transition-colors">How It Works</button>
                <button onClick={() => scrollTo('roles')} className="block text-sm text-slate-400 hover:text-white transition-colors">Roles</button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-sm text-slate-400 hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#103463] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} SCIARS. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">
              Built by <a href="https://github.com/rhishabh01/">P.R Rhishabh</a>.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-10 h-10 bg-[#103463]/80 backdrop-blur-xl border border-[#2760A3]/40 rounded-lg hover:bg-[#103463] hover:border-[#2760A3]/60 transition-all duration-200 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5 text-[#AEE0F1] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
