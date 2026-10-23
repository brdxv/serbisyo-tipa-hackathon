import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Bookmark, Compass, MapPin, PlusCircle, Search, UserRound } from 'lucide-react';
import { TaymPersBrand } from '../branding/TaymPersBrand';
import { AccountMenu } from '../account/AccountMenu';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const isExplorePage = location.pathname === '/explore' || location.pathname === '/';
  const isServiceProfilePage = location.pathname.startsWith('/services/');
  const isContributePage = location.pathname.startsWith('/contribute');
  const ownsProductShell = ['/saved', '/profile', '/compare', '/moderation', '/provider'].some((path) => location.pathname.startsWith(path));

  const navItems = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Contribute', path: '/contribute', icon: PlusCircle },
    { label: 'Saved', path: '/saved', icon: Bookmark },
    { label: 'Profile', path: '/profile', icon: UserRound },
  ];

  // Fullscreen canvas layout for Explore page (lets ExplorePage float header & sidebar over map)
  if (isExplorePage || isServiceProfilePage || isContributePage || ownsProductShell) {
    return (
      <div className="sy-bg-page h-screen w-screen overflow-hidden relative font-sans text-slate-900">
        <main className="h-full w-full relative">{children}</main>
      </div>
    );
  }

  // Standard layout for other pages (Contribute, Saved, Profile, etc.)
  return (
    <div className="sy-bg-page min-h-screen flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 lg:px-6 h-16 flex items-center justify-between shrink-0 shadow-xs">
        <div
          onClick={() => navigate('/explore')}
          className="flex items-center cursor-pointer shrink-0"
        >
          <TaymPersBrand className="h-[34px] w-auto object-contain" />
        </div>

        <div className="relative max-w-lg w-full mx-4 hidden sm:block">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, insights, or help..."
              className="w-full pl-10 pr-10 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
            <MapPin size={15} className="text-blue-600" />
            <span>Morong, Rizal</span>
          </button>
          <button className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 sm:flex">
            <Bell size={16} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <AccountMenu size="sm" />
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 relative pb-16 lg:pb-0">{children}</main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 lg:hidden flex items-center justify-around h-16 shadow-lg px-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 cursor-pointer transition ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
              <span className="sy-small">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
