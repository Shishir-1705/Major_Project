import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#080D18] text-[#F5F7FB] overflow-hidden font-sans">
      {/* Top Application Header & Route Navigation */}
      <Header />

      {/* Main Route Content Viewport */}
      <div className="flex-1 h-[calc(100vh-3.5rem)] w-full overflow-hidden relative">
        <Outlet />
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
