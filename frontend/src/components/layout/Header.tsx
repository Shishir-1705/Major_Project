import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  Flame,
  ShieldCheck,
  MapPin,
  Info,
  Layers,
  BarChart2,
  Activity,
  GitCommit,
  Cpu,
  Menu,
  X,
  Home,
  Compass
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    backendConnected,
    fetchInitialData,
    checkServerRecovery
  } = useAppStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!backendConnected) {
      intervalId = setInterval(() => {
        checkServerRecovery();
      }, 10000);
    }
    return () => clearInterval(intervalId);
  }, [backendConnected, checkServerRecovery]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isLandingPage = location.pathname === '/';

  // Landing page has clean, compact navigation
  const landingNavLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/lst', label: 'Explore Map', icon: Compass },
    { to: '/methodology', label: 'Methodology', icon: Info },
  ] as const;

  // Dedicated analytical routes preserve access when inside analytical workspace
  const analyticalNavLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/overview', label: 'Overview', icon: Layers },
    { to: '/lst', label: 'LST Explorer', icon: Flame },
    { to: '/hotspots', label: 'ML Hotspots', icon: ShieldCheck },
    { to: '/indices', label: 'NDVI / NDBI', icon: Activity },
    { to: '/persistence', label: 'Persistence', icon: GitCommit },
    { to: '/clusters', label: 'Gi* Clusters', icon: BarChart2 },
    { to: '/model', label: 'Model Spec', icon: Cpu },
    { to: '/methodology', label: 'Methodology', icon: Info },
  ] as const;

  const currentNavLinks = isLandingPage ? landingNavLinks : analyticalNavLinks;

  return (
    <>
      <header
        className={
          isLandingPage
            ? 'h-14 bg-[#080D18]/95 backdrop-blur-md border-b border-[#26354A] px-3 md:px-4 flex items-center justify-between z-40 shrink-0 select-none shadow-xs relative'
            : 'h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 md:px-4 flex items-center justify-between z-40 shrink-0 select-none shadow-xs relative'
        }
      >
        {/* Brand & Left Identity */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div
              className={
                isLandingPage
                  ? 'w-8 h-8 rounded-lg bg-[#111C2E] border border-[#26354A] flex items-center justify-center text-[#19D3C5] shadow-xs group-hover:bg-[#162238] transition-colors'
                  : 'w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shadow-xs group-hover:bg-teal-100 transition-colors'
              }
            >
              <Flame className={`w-4.5 h-4.5 ${isLandingPage ? 'text-[#19D3C5]' : 'text-teal-600'}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1
                  className={
                    isLandingPage
                      ? 'text-xs sm:text-sm font-bold tracking-tight text-[#F5F7FB] group-hover:text-[#19D3C5] transition-colors'
                      : 'text-xs sm:text-sm font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors'
                  }
                >
                  THERMAL INTELLIGENCE
                </h1>
                <span
                  className={
                    isLandingPage
                      ? 'hidden xs:inline-block text-[10px] font-mono font-semibold uppercase px-1.5 py-0.2 rounded-md bg-[#111C2E] text-[#19D3C5] border border-[#26354A]'
                      : 'hidden xs:inline-block text-[10px] font-mono font-semibold uppercase px-1.5 py-0.2 rounded-md bg-teal-50 text-teal-700 border border-teal-200/80'
                  }
                >
                  LOCKED
                </span>
              </div>
              <p className="text-[11px] hidden sm:flex items-center space-x-1.5">
                <MapPin className={`w-3 h-3 ${isLandingPage ? 'text-[#19D3C5]' : 'text-teal-600'} inline`} />
                <span className={isLandingPage ? 'text-[#A8B5C9] font-medium' : 'text-slate-700 font-medium'}>
                  Mysuru, Karnataka
                </span>
                <span className={isLandingPage ? 'text-[#26354A]' : 'text-slate-300'}>•</span>
                <span className={`font-mono text-[10px] ${isLandingPage ? 'text-[#8291A8]' : 'text-slate-500'}`}>
                  EPSG:32643 UTM 43N
                </span>
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className={
            isLandingPage
              ? 'hidden sm:flex items-center space-x-1 bg-[#0D1525]/90 p-1 rounded-xl border border-[#26354A]'
              : 'hidden xl:flex items-center space-x-0.5 2xl:space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80'
          }
        >
          {currentNavLinks.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === '/'}
                className={({ isActive }) => {
                  if (isLandingPage) {
                    return `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#162238] text-[#19D3C5] border border-[#26354A] font-semibold shadow-xs'
                        : 'text-[#A8B5C9] hover:text-[#F5F7FB] hover:bg-[#111C2E]/60 border border-transparent'
                    }`;
                  }
                  return `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-teal-700 shadow-xs border border-slate-200/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                  }`;
                }}
                title={tab.label}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isLandingPage
                          ? isActive
                            ? 'text-[#19D3C5]'
                            : 'text-[#8291A8]'
                          : isActive
                          ? 'text-teal-600'
                          : 'text-slate-500'
                      }`}
                    />
                    <span>{tab.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Status & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Server Status Pill */}
          <div
            className={
              isLandingPage
                ? 'flex items-center space-x-1.5 text-xs bg-[#0D1525] border border-[#26354A] px-2.5 py-1 rounded-lg'
                : 'flex items-center space-x-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg'
            }
          >
            {backendConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#19D3C5] animate-pulse shadow-[0_0_6px_#19D3C5]" />
                <span className={`font-medium hidden md:inline ${isLandingPage ? 'text-[#8291A8]' : 'text-slate-500'}`}>
                  SERVER
                </span>
                <span className={`font-mono font-bold text-[11px] ${isLandingPage ? 'text-[#19D3C5]' : 'text-emerald-700'}`}>
                  ONLINE
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className={`font-medium hidden md:inline ${isLandingPage ? 'text-[#8291A8]' : 'text-slate-500'}`}>
                  SERVER
                </span>
                <span className="font-mono font-bold text-amber-500 text-[11px]">OFFLINE</span>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={
              isLandingPage
                ? 'sm:hidden p-1.5 rounded-lg text-[#A8B5C9] hover:text-[#F5F7FB] hover:bg-[#111C2E] border border-[#26354A] transition-colors'
                : `${isLandingPage ? 'sm:hidden' : 'xl:hidden'} p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors`
            }
            title={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? (
              <X className={`w-5 h-5 ${isLandingPage ? 'text-[#19D3C5]' : 'text-teal-600'}`} />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className={
            isLandingPage
              ? 'fixed inset-x-0 top-14 z-50 bg-[#080D18]/98 backdrop-blur-md border-b border-[#26354A] shadow-2xl p-4 transition-all animate-in slide-in-from-top-2'
              : 'fixed inset-x-0 top-14 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xl p-4 transition-all animate-in slide-in-from-top-2'
          }
        >
          <div
            className={`text-[10.5px] font-bold uppercase tracking-wider mb-2 px-1 ${
              isLandingPage ? 'text-[#8291A8]' : 'text-slate-400'
            }`}
          >
            {isLandingPage ? 'Navigation' : 'Geospatial Analysis Views'}
          </div>
          <div className={isLandingPage ? 'grid grid-cols-1 sm:grid-cols-3 gap-2' : 'grid grid-cols-2 sm:grid-cols-3 gap-2'}>
            {currentNavLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.to;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => {
                    if (isLandingPage) {
                      return `flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#162238] text-[#19D3C5] border-[#26354A] font-semibold shadow-xs'
                          : 'bg-[#0D1525] border-[#26354A] text-[#A8B5C9] hover:bg-[#111C2E]'
                      }`;
                    }
                    return `flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 border-teal-200 font-semibold shadow-xs'
                        : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`;
                  }}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isLandingPage
                        ? isActive
                          ? 'text-[#19D3C5]'
                          : 'text-[#8291A8]'
                        : isActive
                        ? 'text-teal-600'
                        : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{tab.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
