import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  Flame,
  ShieldCheck,
  MapPin,
  Layers,
  BarChart2,
  Activity,
  GitCommit,
  Menu,
  X
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

  const isHome = location.pathname === '/' || location.pathname === '';

  // Six primary analytical destinations in prioritized order
  const primaryNavLinks = [
    { to: '/overview', label: 'Overview', icon: Layers },
    { to: '/lst', label: 'LST Explorer', icon: Flame },
    { to: '/hotspots', label: 'ML Hotspots', icon: ShieldCheck },
    { to: '/indices', label: 'NDVI / NDBI', icon: Activity },
    { to: '/persistence', label: 'Persistence', icon: GitCommit },
    { to: '/clusters', label: 'Gi* Clusters', icon: BarChart2 },
  ] as const;

  return (
    <>
      <header className="h-14 bg-[#030611]/80 backdrop-blur-2xl border-b border-white/12 px-3 md:px-5 flex items-center justify-between z-40 shrink-0 select-none shadow-[0_4px_30px_rgba(0,0,0,0.6)] relative">
        {/* Brand & Left Identity (Links to Home) */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <Link
            to="/"
            className="flex items-center space-x-2.5 group"
            title="Thermal Intelligence — Home"
            aria-label="Thermal Intelligence — Home"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-[#19D3C5]/30 flex items-center justify-center text-[#19D3C5] shadow-[0_0_12px_rgba(25,211,197,0.15)] group-hover:border-[#19D3C5]/60 group-hover:bg-white/[0.1] transition-all">
              <Flame className="w-4.5 h-4.5 text-[#19D3C5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xs sm:text-sm font-bold tracking-tight text-[#F5F7FB] group-hover:text-[#19D3C5] transition-colors">
                  THERMAL INTELLIGENCE
                </h1>
                <span className="hidden xs:inline-block text-[10px] font-mono font-semibold uppercase px-1.5 py-0.2 rounded-md bg-white/[0.06] text-[#19D3C5] border border-[#19D3C5]/30 shadow-2xs">
                  LOCKED
                </span>
              </div>
              <p className="text-[11px] hidden sm:flex items-center space-x-1.5">
                <MapPin className="w-3 h-3 text-[#19D3C5] inline" />
                <span className="text-[#A8B5C9] font-medium">
                  Mysuru, Karnataka
                </span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-[10px] text-[#8291A8]">
                  EPSG:32643 UTM 43N
                </span>
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Primary Navigation Links (Only on analytical pages) */}
        {!isHome && (
          <nav
            className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 liquid-glass-pill p-1 rounded-xl shadow-lg border border-white/15"
            aria-label="Primary Navigation"
          >
            {primaryNavLinks.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#19D3C5]/15 text-[#19D3C5] border border-[#19D3C5]/50 font-semibold shadow-[0_0_12px_rgba(25,211,197,0.2)]'
                        : 'text-[#A8B5C9] hover:text-[#F5F7FB] hover:bg-white/[0.06] border border-transparent'
                    }`
                  }
                  title={tab.label}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          isActive
                            ? 'text-[#19D3C5]'
                            : 'text-[#8291A8]'
                        }`}
                      />
                      <span>{tab.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        )}

        {/* Right Status & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Server Status Pill (Interactive Retry when Offline) */}
          <button
            onClick={() => {
              if (!backendConnected) {
                checkServerRecovery();
              }
            }}
            disabled={backendConnected}
            className={`flex items-center space-x-1.5 text-xs liquid-glass-chip px-2.5 py-1 rounded-lg focus-visible:ring-2 focus-visible:ring-[#19D3C5] focus-visible:outline-hidden transition-colors ${
              !backendConnected ? 'hover:bg-white/[0.1] hover:border-amber-500/50 cursor-pointer' : 'cursor-default'
            }`}
            title={backendConnected ? 'Analysis server connected' : 'Click to retry server connection'}
            aria-label={backendConnected ? 'Analysis server connected' : 'Click to retry server connection'}
          >
            {backendConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#19D3C5] animate-pulse shadow-[0_0_8px_#19D3C5]" />
                <span className="font-medium hidden md:inline text-[#8291A8]">
                  SERVER
                </span>
                <span className="font-mono font-bold text-[11px] text-[#19D3C5]">
                  ONLINE
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="font-medium hidden md:inline text-[#8291A8]">
                  SERVER
                </span>
                <span className="font-mono font-bold text-amber-500 text-[11px]">OFFLINE (RETRY)</span>
              </>
            )}
          </button>

          {/* Mobile Menu Hamburger (Only on analytical pages) */}
          {!isHome && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-[#A8B5C9] hover:text-[#F5F7FB] liquid-glass-chip focus-visible:ring-2 focus-visible:ring-[#19D3C5] focus-visible:outline-hidden transition-colors cursor-pointer"
              title={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#19D3C5]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Mobile / Tablet Navigation Drawer (Only on analytical pages) */}
      {!isHome && mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-50 liquid-glass-slab border-b border-white/15 shadow-2xl p-4 transition-all animate-in slide-in-from-top-2">
          <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2 px-1 text-[#8291A8]">
            Geospatial Analysis Navigation
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {primaryNavLinks.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white/[0.14] text-[#19D3C5] border-[#19D3C5]/40 font-semibold shadow-xs'
                        : 'liquid-glass-subtle text-[#A8B5C9] hover:bg-white/[0.08]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-[#19D3C5]'
                            : 'text-[#8291A8]'
                        }`}
                      />
                      <span className="truncate">{tab.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
