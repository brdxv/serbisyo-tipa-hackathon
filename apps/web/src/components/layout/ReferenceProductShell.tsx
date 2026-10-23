import React from 'react';
import {
  Bell,
  Bookmark,
  Building2,
  GraduationCap,
  Grid2X2,
  HeartPulse,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Train,
  UserRound,
  UsersRound,
  Zap,
  Map as MapIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TaymPersBrand } from '../branding/TaymPersBrand';
import { AccountMenu } from '../account/AccountMenu';

const categories = [
  { label: 'All Services', icon: Grid2X2 },
  { label: 'Healthcare', icon: Plus },
  { label: 'Government', icon: Building2 },
  { label: 'Education', icon: GraduationCap },
  { label: 'Transportation', icon: Train },
  { label: 'Social Welfare', icon: UsersRound },
  { label: 'Utilities', icon: Zap },
  { label: 'More', icon: MoreHorizontal },
] as const;

interface ReferenceProductShellProps {
  children: React.ReactNode;
  active: 'explore' | 'contribute' | 'saved' | 'profile';
}

export function ReferenceProductShell({ children, active }: ReferenceProductShellProps) {
  const navigate = useNavigate();
  const navItems = [
    { id: 'explore', label: 'Explore', path: '/explore', icon: MapIcon },
    { id: 'contribute', label: 'Contribute', path: '/contribute', icon: Plus },
    { id: 'saved', label: 'Saved', path: '/saved', icon: Bookmark },
    { id: 'profile', label: 'Profile', path: '/profile', icon: UserRound },
  ] as const;

  return (
    <div className="sy-bg-page relative h-screen w-full overflow-hidden font-sans text-slate-900">
      <header className="absolute inset-x-0 top-0 z-[900] hidden h-[118px] border-b border-slate-200 bg-white/98 lg:block">
        <div className="mx-auto flex h-[67px] max-w-[1420px] items-center gap-7 px-5">
          <button type="button" onClick={() => navigate('/explore')} className="flex w-[250px] shrink-0 items-center">
            <TaymPersBrand className="h-[43px] w-auto object-contain" />
          </button>
          <div className="relative min-w-0 flex-1">
            <Search size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input placeholder="Search a service or place..." className="sy-caption h-12 w-full rounded-full border border-slate-100 bg-slate-100 pl-12 pr-5 outline-none placeholder:text-slate-400" />
          </div>
          <button type="button" className="sy-caption sy-semibold flex h-12 shrink-0 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-5 shadow-sm"><MapPin size={18} className="text-blue-600" /> Morong, Rizal <span className="text-blue-600">⌄</span></button>
          <button type="button" aria-label="Notifications" className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-white shadow-sm"><Bell size={20} /><span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" /></button>
          <AccountMenu size="lg" />
        </div>
        <div className="border-t border-slate-100">
          <div className="mx-auto flex h-[51px] max-w-[1420px] items-center justify-between px-5">
            {categories.map((item) => {
              const Icon = item.icon;
              return <button key={item.label} type="button" className="sy-caption sy-semibold flex items-center gap-2.5 text-slate-600 hover:text-blue-600"><Icon size={20} className="text-blue-700" /> {item.label}</button>;
            })}
          </div>
        </div>
      </header>

      <header className="absolute inset-x-0 top-0 z-[900] flex h-[68px] items-center gap-3 border-b border-slate-200 bg-white/98 px-5 lg:hidden">
        <button type="button" onClick={() => navigate('/explore')} className="flex min-w-0 items-center">
          <TaymPersBrand className="h-[36px] w-auto max-w-[142px] object-contain" />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="sy-small sy-semibold flex h-9 items-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-3 shadow-sm"><MapPin size={13} className="text-blue-600" /> Morong, Rizal</button>
          <button type="button" aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-100 bg-white shadow-sm"><Bell size={16} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /></button>
          <AccountMenu size="sm" />
        </div>
      </header>

      <main className="absolute inset-x-0 bottom-[60px] top-[68px] overflow-y-auto lg:bottom-0 lg:top-[118px]">
        {children}
      </main>

      <nav className="absolute inset-x-0 bottom-0 z-[1000] grid h-[60px] grid-cols-4 border-t border-slate-200 bg-white px-4 shadow-[0_-4px_18px_rgba(15,23,42,.06)] lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = item.id === active;
          return (
            <button key={item.id} type="button" onClick={() => navigate(item.path)} className={`relative flex flex-col items-center justify-center gap-1 ${selected ? 'text-blue-600' : 'text-slate-500'}`}>
              <Icon size={item.id === 'contribute' ? 23 : 21} fill={item.id === 'saved' && selected ? 'currentColor' : 'none'} />
              <span className="sy-small sy-semibold">{item.label}</span>
              {selected ? <span className="absolute bottom-1 h-1 w-7 rounded-full bg-blue-600" /> : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
