import React, { useState } from 'react';
import { PageView } from '../types';

interface TopNavBarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onOpenUpload: () => void;
  onOpenAbout: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  onOpenAbout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#c1c6d7] fixed top-0 left-0 w-full z-50 h-16 shadow-xs">
      <div className="max-w-[1200px] h-full mx-auto px-6 flex justify-between items-center">
        {/* Brand Zone */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0059bb] rounded-md px-1 py-1"
        >
          <span
            className="material-symbols-outlined text-[#0059bb] text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            medical_services
          </span>
          <span className="text-xl font-bold tracking-tight text-[#0059bb]">
            EasyReport
          </span>
        </button>

        {/* Navigation Zone */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <button
            onClick={() => onNavigate('home')}
            className={`text-sm font-semibold transition-colors h-full flex items-center border-b-2 cursor-pointer ${
              currentView === 'home'
                ? 'text-[#0059bb] border-[#0059bb]'
                : 'text-[#414754] border-transparent hover:text-[#0059bb]'
            }`}
          >
            How it Works
          </button>
          <button
            onClick={() => onNavigate('privacy')}
            className={`text-sm font-semibold transition-colors h-full flex items-center border-b-2 cursor-pointer ${
              currentView === 'privacy'
                ? 'text-[#0059bb] border-[#0059bb]'
                : 'text-[#414754] border-transparent hover:text-[#0059bb]'
            }`}
          >
            Privacy
          </button>
          <button
            onClick={onOpenAbout}
            className={`text-sm font-semibold transition-colors h-full flex items-center border-b-2 cursor-pointer ${
              currentView === 'about'
                ? 'text-[#0059bb] border-[#0059bb]'
                : 'text-[#414754] border-transparent hover:text-[#0059bb]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Primary Action Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUpload}
            className="bg-[#007BFF] hover:bg-[#0059bb] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>Upload Report</span>
          </button>

          {/* User Profile Avatar */}
          <div
            className="w-8 h-8 rounded-full bg-[#e5eeff] overflow-hidden border border-[#c1c6d7] flex items-center justify-center shrink-0 cursor-pointer"
            title="ClarifyHealth Secure Session"
          >
            <span className="material-symbols-outlined text-[#0059bb] text-lg">
              person
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#414754] hover:text-[#0059bb] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#c1c6d7] px-6 py-4 space-y-3 shadow-md">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 text-sm font-semibold ${
              currentView === 'home' ? 'text-[#0059bb]' : 'text-[#414754]'
            }`}
          >
            How it Works
          </button>
          <button
            onClick={() => {
              onNavigate('privacy');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 text-sm font-semibold ${
              currentView === 'privacy' ? 'text-[#0059bb]' : 'text-[#414754]'
            }`}
          >
            Privacy &amp; Security
          </button>
          <button
            onClick={() => {
              onOpenAbout();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#414754]"
          >
            About ClarifyHealth
          </button>
        </div>
      )}
    </header>
  );
};
