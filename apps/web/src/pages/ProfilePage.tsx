import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Camera,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  Mail,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReferenceProductShell } from '../components/layout/ReferenceProductShell';
import { morongPrototypeServices } from '../data/morongPrototypeServices';
import { getCurrentAccount, signOutPrototypeAccount, updateCurrentAccount } from '../auth/taympersAuth';

const contributionSeeds = [
  { providerId: 'morong-rural-health-unit', type: 'Document Request', date: 'Sep 28, 2026', wait: 'Waited 28 min', comment: 'Staff was helpful but the line was long near lunch.', status: 'Published' },
  { providerId: 'morong-municipal-hall', type: 'Business Permit', date: 'Sep 20, 2026', wait: 'Waited 15 min', comment: 'The process was faster than expected. Staff were accommodating.', status: 'Published' },
  { providerId: 'mercury-drug-morong-t-claudio', type: 'Medicine Purchase', date: 'Sep 12, 2026', wait: 'Waited 10 min', comment: 'Most medicines are available. Short line in the afternoon.', status: 'Published' },
  { providerId: 'urs-morong-campus', type: 'Document Request', date: 'Sep 5, 2026', wait: 'Waited 35 min', comment: 'Bring all requirements to avoid multiple trips.', status: 'Under Review' },
] as const;

const savedIds = ['morong-rural-health-unit', 'morong-municipal-hall', 'urs-morong-campus', 'mercury-drug-morong-t-claudio', 'lto-morong-district-office'];

export function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const account = getCurrentAccount();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullName, setFullName] = useState(account?.fullName ?? 'Ian Kurt G. Valencia');
  const [location, setLocation] = useState(account?.location ?? 'Morong, Rizal');

  useEffect(() => {
    if (searchParams.get('settings') === '1') setSettingsOpen(true);
  }, [searchParams]);

  const contributions = useMemo(() => contributionSeeds.map((item) => ({
    ...item,
    service: morongPrototypeServices.find((service) => service.id === item.providerId),
  })).filter((item): item is typeof item & { service: NonNullable<typeof item.service> } => Boolean(item.service)), []);

  const saved = useMemo(() => savedIds
    .map((id) => morongPrototypeServices.find((service) => service.id === id))
    .filter((service): service is NonNullable<typeof service> => Boolean(service)), []);

  return (
    <ReferenceProductShell active="profile">
      <div className="mx-auto min-h-full max-w-[1460px] px-3 py-3 lg:px-5 lg:py-4">
        <button type="button" onClick={() => navigate('/explore')} className="sy-small sy-semibold mb-3 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-blue-700 shadow-sm hover:bg-blue-50">
          <ArrowLeft size={15} /> Back to Explore
        </button>
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-blue-100 p-3 shadow-sm lg:min-h-[270px] lg:p-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] bg-[radial-gradient(circle_at_65%_50%,rgba(59,130,246,.17),transparent_55%)] lg:block" />
          <div className="relative lg:grid lg:grid-cols-[150px_minmax(0,1fr)_180px] lg:gap-5">
            <div className="flex items-start gap-4 lg:block">
              <div className="relative shrink-0">
                <img src="/assets/avatars/community-avatar-placeholder-1.png" alt={fullName} className="h-[82px] w-[82px] rounded-full border-4 border-white object-cover shadow-md lg:h-[142px] lg:w-[142px]" />
                <button type="button" aria-label="Change profile photo" className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm"><Camera size={15} /></button>
              </div>
              <div className="min-w-0 pt-1 lg:hidden">
                <h1 className="sy-h2 truncate">{fullName}</h1>
                <p className="sy-small mt-1 flex items-center gap-1.5 text-slate-500"><MapPin size={13} className="text-blue-600" /> {location}</p>
                {account?.email ? <p className="sy-small mt-1 flex items-center gap-1.5 truncate text-slate-500"><Mail size={13} className="text-blue-600" /> {account.email}</p> : null}
                <p className="sy-small mt-2 text-slate-500">Helping improve service information in your community.</p>
              </div>
            </div>

            <div className="hidden min-w-0 pt-2 lg:block">
              <h1 className="sy-h2">{fullName}</h1>
              <p className="sy-caption mt-1 flex items-center gap-1.5 text-slate-500"><MapPin size={15} className="text-blue-600" /> {location}</p>
              {account?.email ? <p className="sy-caption mt-1 flex items-center gap-1.5 text-slate-500"><Mail size={15} className="text-blue-600" /> {account.email}</p> : null}
              <p className="sy-caption mt-2 text-slate-500">Helping improve service information in your community.</p>
            </div>

            <button type="button" onClick={() => setSettingsOpen(true)} className="sy-small sy-semibold absolute right-0 top-0 flex h-9 items-center gap-2 rounded-lg border border-blue-300 bg-white px-3 text-blue-600 shadow-sm lg:static lg:justify-self-end"><Settings size={16} /> Account Settings</button>
          </div>

          <div className="relative mt-3 grid grid-cols-3 gap-2 lg:ml-[170px] lg:mt-[-54px] lg:max-w-[800px] lg:gap-3">
            {[
              { icon: MessageSquare, value: '12', label: 'Experiences shared', note: 'Helped other residents with real service insights.' },
              { icon: Bookmark, value: '5', label: 'Saved services', note: 'Services you saved to revisit or compare.' },
              { icon: UsersRound, value: '0', label: 'Updates suggested', note: 'Thank you for helping keep information accurate.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-white/90 p-2 shadow-sm lg:flex lg:min-h-[124px] lg:items-start lg:gap-3 lg:p-4">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-blue-600 lg:h-10 lg:w-10"><Icon size={17} /></span>
                  <div className="mt-1 lg:mt-0">
                    <div className="sy-h3">{item.value}</div>
                    <div className="sy-small sy-semibold text-slate-900">{item.label}</div>
                    <p className="sy-small mt-1 hidden text-slate-500 sm:block">{item.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-1 lg:hidden">
          {[
            { icon: MessageSquare, title: 'My Contributions', note: 'View and manage your service experiences.', onClick: () => document.getElementById('recent-contributions')?.scrollIntoView({ behavior: 'smooth' }) },
            { icon: Bookmark, title: 'Saved Services', note: 'See the services you saved for later.', onClick: () => navigate('/saved') },
            { icon: Clock3, title: 'Recent Activity', note: 'A quick view of your latest actions.', onClick: () => document.getElementById('recent-contributions')?.scrollIntoView({ behavior: 'smooth' }) },
            { icon: Settings, title: 'Account Settings', note: 'Manage your profile and preferences.', onClick: () => setSettingsOpen(true) },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.title} type="button" onClick={item.onClick} className="flex w-full items-center gap-3 border-b border-slate-100 py-2.5 text-left last:border-b-0">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon size={17} /></span>
                <span className="min-w-0 flex-1"><span className="sy-small sy-semibold block text-slate-900">{item.title}</span><span className="sy-small block text-slate-500">{item.note}</span></span>
                <ChevronRight size={17} className="text-blue-600" />
              </button>
            );
          })}
        </section>

        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.8fr)_minmax(360px,.9fr)]">
          <section id="recent-contributions" className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div><h2 className="sy-h3">Recent Contributions</h2><p className="sy-caption hidden text-slate-500 sm:block">Your latest service experiences and contributions.</p></div>
              <button type="button" className="sy-small sy-semibold flex items-center gap-1 text-blue-600">See all <ChevronRight size={14} /></button>
            </div>
            <div className="space-y-2">
              {contributions.map((item, index) => (
                <article key={item.providerId} className={`relative grid grid-cols-[100px_minmax(0,1fr)] gap-2 rounded-xl border border-slate-200 p-2 lg:grid-cols-[165px_minmax(0,1fr)_190px] lg:gap-4 lg:p-3 ${index > 1 ? 'hidden lg:grid' : ''}`}>
                  <img src={item.service.image} alt="" className="h-[78px] w-[100px] rounded-lg object-cover lg:h-[92px] lg:w-[165px]" />
                  <div className="min-w-0 self-center">
                    <div className="flex min-w-0 items-start gap-2"><h3 className="sy-small sy-semibold min-w-0 flex-1 truncate text-slate-900 lg:text-[16px]">{item.service.name}</h3><span className={`sy-small sy-semibold shrink-0 rounded-full px-2 py-0.5 lg:hidden ${item.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.status}</span></div>
                    <p className="sy-small mt-0.5 flex items-center gap-1.5 text-slate-500"><FileText size={13} className="text-blue-600" /> {item.type}</p>
                    <p className="sy-small mt-1 flex flex-wrap items-center gap-2 text-slate-500"><span className="flex items-center gap-1"><CalendarDays size={12} /> {item.date}</span><span className="flex items-center gap-1"><Clock3 size={12} /> {item.wait}</span></p>
                    <p className="sy-small mt-1 line-clamp-1 text-slate-600 lg:line-clamp-2">“{item.comment}”</p>
                  </div>
                  <div className="hidden lg:col-span-1 lg:flex lg:flex-col lg:items-start lg:justify-center">
                    <span className={`sy-small sy-semibold flex items-center gap-1.5 rounded-full px-3 py-1 ${item.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}><ShieldCheck size={14} /> {item.status}</span>
                    <span className="sy-small hidden max-w-[160px] text-slate-500 lg:block">{item.status === 'Published' ? 'Helps other residents plan their visit.' : 'Our team is checking this contribution.'}</span>
                    <ChevronRight size={17} className="text-blue-600" />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
            <div className="mb-2 flex items-center justify-between"><div><h2 className="sy-h3">Saved Services</h2><p className="sy-caption text-slate-500">Services you saved to revisit or compare.</p></div><button type="button" onClick={() => navigate('/saved')} className="sy-small sy-semibold flex items-center gap-1 text-blue-600">See all <ChevronRight size={14} /></button></div>
            <div className="divide-y divide-slate-100">
              {saved.map((service) => (
                <button key={service.id} type="button" onClick={() => navigate(`/services/${service.id}`)} className="grid w-full grid-cols-[92px_minmax(0,1fr)_22px] items-center gap-3 py-2.5 text-left">
                  <img src={service.image} alt="" className="h-[62px] w-[92px] rounded-lg object-cover" />
                  <div className="min-w-0"><h3 className="sy-small sy-semibold truncate text-slate-900">{service.name}</h3><p className="sy-small mt-0.5 truncate text-slate-500">{service.category}</p><div className="sy-small mt-1 flex items-center gap-2"><span className="sy-semibold rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Open</span><span className="text-slate-500">8:00 AM – 5:00 PM</span></div></div>
                  <Bookmark size={19} fill="currentColor" className="text-blue-600" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {settingsOpen ? (
        <div className="fixed inset-0 z-[1600] grid place-items-center bg-slate-900/45 p-4">
          <button type="button" aria-label="Close settings" onClick={() => setSettingsOpen(false)} className="absolute inset-0" />
          <form onSubmit={(event) => { event.preventDefault(); updateCurrentAccount({ fullName, location }); setSettingsOpen(false); }} className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="sy-h3">Account Settings</h2><button type="button" onClick={() => setSettingsOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"><X size={17} /></button></div>
            {account ? (
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                <div className="sy-small sy-semibold text-slate-900">{account.role}</div>
                <div className="sy-small mt-1 text-slate-600">{account.email}</div>
              </div>
            ) : null}
            <label className="mt-4 block"><span className="sy-small sy-semibold mb-1 block">Full Name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} className="sy-small h-10 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-blue-400" /></label>
            <label className="mt-3 block"><span className="sy-small sy-semibold mb-1 block">Primary Location</span><input value={location} onChange={(event) => setLocation(event.target.value)} className="sy-small h-10 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-blue-400" /></label>
            <button type="submit" className="sy-small sy-semibold mt-4 h-10 w-full rounded-lg bg-blue-600 text-white">Save Changes</button>
            {account ? <button type="button" onClick={() => { signOutPrototypeAccount(); navigate('/login'); }} className="sy-small sy-semibold mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-red-600"><LogOut size={15} /> Log out</button> : null}
          </form>
        </div>
      ) : null}
    </ReferenceProductShell>
  );
}
