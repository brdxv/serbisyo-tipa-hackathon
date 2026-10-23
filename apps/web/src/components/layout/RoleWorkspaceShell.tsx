import React from 'react';
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardList,
  FileText,
  Flag,
  Gauge,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  XCircle,
  Scale,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TaymPersBrand } from '../branding/TaymPersBrand';

type ModeratorActive = 'queue' | 'approved' | 'rejected' | 'profile';
type ProviderActive = 'dashboard' | 'service' | 'insights' | 'official-community' | 'feedback' | 'reports' | 'settings';

interface ModeratorWorkspaceShellProps {
  children: React.ReactNode;
  active?: ModeratorActive;
  mobileFooter?: React.ReactNode;
}

interface ProviderWorkspaceShellProps {
  children: React.ReactNode;
  active?: ProviderActive;
}

function RoleHeader({
  provider = false,
}: {
  provider?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-[1000] hidden h-[68px] items-center border-b border-slate-200 bg-white px-8 lg:flex">
        <button type="button" onClick={() => navigate('/explore')} className="flex w-[320px] shrink-0 items-center">
          <TaymPersBrand className="h-[43px] w-auto object-contain" />
        </button>
        <div className="relative min-w-0 max-w-[690px] flex-1">
          <Search size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            aria-label={provider ? 'Search provider workspace' : 'Search moderation workspace'}
            placeholder={provider ? 'Search services, insights, or help...' : 'Search services, contributions, or users...'}
            className="sy-caption h-12 w-full rounded-full border border-slate-100 bg-slate-100 pl-12 pr-5 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
          />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <button type="button" className="sy-caption sy-semibold flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm"><MapPin size={17} className="text-blue-600" /> Morong, Rizal <span className="text-blue-600">⌄</span></button>
          <button type="button" aria-label="Notifications" className="relative grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white"><Bell size={19} /><span className="absolute right-1.5 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" /></button>
          {provider ? (
            <button type="button" onClick={() => navigate('/provider')} className="flex h-11 max-w-[190px] items-center gap-2 rounded-full bg-white pr-2 text-left">
              <img src="/assets/avatars/community-avatar-placeholder-1.png" alt="" className="h-10 w-10 rounded-full object-cover" />
              <span className="sy-small sy-semibold line-clamp-2 text-slate-900">Morong Rural<br />Health Unit</span>
              <span className="text-blue-600">⌄</span>
            </button>
          ) : (
            <button type="button" className="h-11 w-11 overflow-hidden rounded-full border-2 border-white shadow-sm"><img src="/assets/avatars/community-avatar-placeholder-1.png" alt="" className="h-full w-full object-cover" /></button>
          )}
        </div>
      </header>

      <header className="absolute inset-x-0 top-0 z-[1000] flex h-[68px] items-center border-b border-slate-200 bg-white px-4 lg:hidden">
        <button type="button" onClick={() => navigate('/explore')} className="flex min-w-0 items-center">
          <TaymPersBrand className="h-[36px] w-auto max-w-[142px] object-contain" />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="sy-small sy-semibold flex h-9 items-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-3 shadow-sm"><MapPin size={13} className="text-blue-600" /> Morong, Rizal</button>
          <button type="button" aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-100 bg-white shadow-sm"><Bell size={16} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /></button>
          <button type="button" className="h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-sm"><img src="/assets/avatars/community-avatar-placeholder-1.png" alt="" className="h-full w-full object-cover" /></button>
        </div>
      </header>
    </>
  );
}

export function ModeratorWorkspaceShell({ children, active = 'queue', mobileFooter }: ModeratorWorkspaceShellProps) {
  const navigate = useNavigate();
  const desktopItems = [
    { label: 'Explore', icon: Gauge, action: () => navigate('/explore') },
    { label: 'Contributions', icon: FileText, action: () => navigate('/profile') },
  ];
  const moderationItems = [
    { id: 'queue', label: 'Review Queue', icon: UsersRound, badge: '12', action: () => navigate('/moderation') },
    { id: 'approved', label: 'Approved', icon: CheckCircle2, action: () => undefined },
    { id: 'rejected', label: 'Rejected', icon: XCircle, action: () => undefined },
  ] as const;
  const mobileItems = [
    { id: 'queue', label: 'Queue', icon: ClipboardList, action: () => navigate('/moderation') },
    { id: 'approved', label: 'Approved', icon: CheckCircle2, action: () => undefined },
    { id: 'rejected', label: 'Rejected', icon: XCircle, action: () => undefined },
    { id: 'profile', label: 'Profile', icon: UserRound, action: () => navigate('/profile') },
  ] as const;

  return (
    <div className="sy-bg-page relative h-screen w-full overflow-hidden font-sans text-slate-900">
      <RoleHeader />

      <aside className="absolute bottom-0 left-0 top-[68px] hidden w-[224px] flex-col border-r border-slate-200 bg-white px-3 py-4 lg:flex">
        <div className="space-y-1">
          {desktopItems.map((item) => {
            const Icon = item.icon;
              return <button key={item.label} type="button" onClick={item.action} className="sy-caption flex h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-600 hover:bg-slate-50"><Icon size={20} className="text-indigo-500" /> {item.label}</button>;
          })}
        </div>
        <div className="mt-2 border-t border-slate-200 pt-2">
          <div className="sy-caption sy-semibold flex items-center gap-3 rounded-xl px-3 py-2.5 text-blue-700"><Flag size={19} /> Moderation</div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-1">
            {moderationItems.map((item) => {
              const Icon = item.icon;
              const selected = item.id === active;
              return (
                <button key={item.id} type="button" onClick={item.action} className={`sy-caption sy-semibold flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left ${selected ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-white'}`}>
                  <Icon size={17} />
                  <span className="flex-1">{item.label}</span>
                  {'badge' in item ? <span className="sy-small grid h-6 min-w-6 place-items-center rounded-full bg-blue-600 px-1.5 text-white">{item.badge}</span> : null}
                </button>
              );
            })}
          </div>
        </div>
        <div className="sy-small mt-4 px-2 text-slate-500">Manage</div>
        <button type="button" className="sy-caption mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600"><FileText size={19} className="text-indigo-500" /> Service Information</button>
        <button type="button" className="sy-caption flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600"><UserRound size={19} className="text-indigo-500" /> Users</button>
        <button type="button" onClick={() => navigate('/explore')} className="sy-caption mt-auto flex items-center gap-3 px-3 py-2 text-blue-700">← <span>Back to TaymPers</span></button>
      </aside>

      <main className={`absolute inset-x-0 top-[68px] overflow-y-auto lg:bottom-0 lg:left-[224px] ${mobileFooter ? 'bottom-[68px]' : 'bottom-[60px]'}`}>
        {children}
      </main>

      {mobileFooter ? (
        <div className="absolute inset-x-0 bottom-0 z-[1000] h-[68px] border-t border-slate-200 bg-white p-2 shadow-[0_-4px_18px_rgba(15,23,42,.06)] lg:hidden">
          {mobileFooter}
        </div>
      ) : <nav className="absolute inset-x-0 bottom-0 z-[1000] grid h-[60px] grid-cols-4 border-t border-slate-200 bg-white px-2 shadow-[0_-4px_18px_rgba(15,23,42,.06)] lg:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const selected = item.id === active;
          return (
            <button key={item.id} type="button" onClick={item.action} className={`relative flex flex-col items-center justify-center gap-0.5 ${selected ? 'text-blue-600' : 'text-slate-500'}`}>
              <Icon size={21} />
              <span className="sy-small sy-semibold">{item.label}</span>
              {selected ? <span className="absolute bottom-1 h-1 w-7 rounded-full bg-blue-600" /> : null}
            </button>
          );
        })}
      </nav>}
    </div>
  );
}

export function ProviderWorkspaceShell({ children, active = 'dashboard' }: ProviderWorkspaceShellProps) {
  const navigate = useNavigate();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge, path: '/provider' },
    { id: 'service', label: 'Service Information', icon: FileText, path: '/provider' },
    { id: 'insights', label: 'Community Insights', icon: BarChart3, path: '/provider' },
    { id: 'official-community', label: 'Official vs Community', icon: Scale, path: '/provider/official-vs-community' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/provider' },
    { id: 'reports', label: 'Reports', icon: Flag, path: '/provider' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/provider' },
  ] as const;

  return (
    <div className="sy-bg-page relative h-screen w-full overflow-hidden font-sans text-slate-900">
      <RoleHeader provider />
      <aside className="absolute bottom-0 left-0 top-[68px] hidden w-[224px] border-r border-slate-200 bg-white px-3 py-4 lg:block">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = item.id === active;
            return (
              <button key={item.id} type="button" onClick={() => navigate(item.path)} className={`sy-caption sy-semibold flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left ${selected ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Icon size={20} className={selected ? 'text-blue-600' : 'text-indigo-500'} />
                <span className="flex-1">{item.label}</span>
                {item.id === 'feedback' ? <span className="sy-small grid h-6 min-w-6 place-items-center rounded-full bg-red-500 px-1 text-white">3</span> : null}
              </button>
            );
          })}
        </div>
      </aside>
      <main className="absolute inset-x-0 bottom-0 top-[68px] overflow-y-auto lg:left-[224px]">
        {children}
      </main>
    </div>
  );
}
