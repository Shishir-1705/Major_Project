import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen space-cinematic-bg text-[#F5F7FB] overflow-hidden font-sans relative selection:bg-[#19D3C5]/20 selection:text-[#19D3C5]">
      {/* Global Atmospheric Cyan & Amber Cosmic Lighting (Visible behind all translucent glass surfaces) */}
      <div
        className="absolute top-0 right-10 w-[600px] h-[600px] lg:w-[900px] lg:h-[900px] pointer-events-none opacity-30 blur-3xl rounded-full z-0"
        style={{
          background: 'radial-gradient(circle at 65% 35%, rgba(6, 182, 212, 0.45) 0%, rgba(20, 184, 166, 0.2) 35%, rgba(249, 115, 22, 0.12) 60%, transparent 80%)'
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -left-20 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] pointer-events-none opacity-25 blur-3xl rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.35) 0%, rgba(249, 115, 22, 0.12) 50%, transparent 75%)'
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/3 w-[400px] h-[400px] pointer-events-none opacity-15 blur-3xl rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%)'
        }}
        aria-hidden="true"
      />

      {/* Top Application Header & Route Navigation */}
      <Header />

      {/* Main Route Content Viewport */}
      <div className="flex-1 h-[calc(100vh-3.5rem)] w-full overflow-hidden relative z-10">
        <Outlet />
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
