import React, { useMemo } from 'react';
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Bookmark,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  FileCheck2,
  FileText,
  GraduationCap,
  Grid2X2,
  HeartPulse,
  Info,
  Landmark,
  Lightbulb,
  Map as MapIcon,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Store,
  TimerReset,
  Train,
  UserRound,
  UsersRound,
  Zap,
} from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { TaymPersBrand } from '../components/branding/TaymPersBrand';
import { AccountMenu } from '../components/account/AccountMenu';
import { morongPrototypeServices } from '../data/morongPrototypeServices';

interface ContributionSuccessState {
  serviceType?: string;
  visitDate?: string;
  visitTime?: string;
  waitTime?: string;
  processingTime?: string;
  available?: string;
  accurate?: string;
  details?: string;
  serviceQuality?: string;
  accessibilityRating?: string;
  overallExperience?: string;
}

const desktopCategories = [
  { label: 'All Services', icon: Grid2X2 },
  { label: 'Healthcare', icon: Plus },
  { label: 'Government', icon: Landmark },
  { label: 'Education', icon: GraduationCap },
  { label: 'Transportation', icon: Train },
  { label: 'Social Welfare', icon: UsersRound },
  { label: 'Utilities', icon: Zap },
  { label: 'More', icon: MoreHorizontal },
] as const;

function formatDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(year, month - 1, day));
}

function formatTime(value: string) {
  const [hourValue, minuteValue] = value.split(':').map(Number);
  if (Number.isNaN(hourValue) || Number.isNaN(minuteValue)) return value;
  const suffix = hourValue >= 12 ? 'PM' : 'AM';
  const hour = hourValue % 12 || 12;
  return `${hour}:${String(minuteValue).padStart(2, '0')} ${suffix}`;
}

function SummaryMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[24px_minmax(0,1fr)] items-center gap-1 border-slate-100 px-1 py-0.5 lg:grid-cols-[34px_minmax(0,1fr)] lg:gap-2 lg:border-l lg:px-4 lg:py-2 first:lg:border-l-0">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-50 text-blue-600 lg:h-9 lg:w-9">{icon}</span>
      <div className="min-w-0">
        <div className="sy-small sy-semibold truncate leading-tight text-slate-900">{label}</div>
        <div className="sy-small truncate leading-tight text-slate-600 lg:text-[14px]">{value}</div>
      </div>
    </div>
  );
}

export function ContributionSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const providerId = params.get('provider') ?? 'morong-rural-health-unit';
  const service = useMemo(
    () => morongPrototypeServices.find((item) => item.id === providerId)
      ?? morongPrototypeServices.find((item) => item.id === 'morong-rural-health-unit')
      ?? morongPrototypeServices[0],
    [providerId],
  );
  const state = (location.state ?? {}) as ContributionSuccessState;

  const serviceType = state.serviceType ?? 'General Consultation';
  const visitDate = state.visitDate ?? '2026-10-18';
  const visitTime = state.visitTime ?? '10:30';
  const waitTime = state.waitTime ?? '15 – 30 min';
  const processingTime = state.processingTime ?? '5 – 15 min';
  const serviceQuality = state.serviceQuality ?? 'Very Good';
  const accurate = state.accurate ?? 'Yes';
  const contributionCount = service.reports + 1;
  const serviceRoute = `/services/${service.id}`;
  const insightsRoute = `/services/${service.id}/community-intelligence`;

  return (
    <div className="sy-bg-page relative h-screen w-full overflow-hidden font-sans text-slate-900">
      <header className="absolute inset-x-0 top-0 z-[900] hidden h-[126px] border-b border-slate-200/80 bg-white/98 shadow-[0_8px_24px_rgba(15,23,42,.05)] lg:block">
        <div className="mx-auto flex h-[70px] max-w-[1360px] items-center gap-7 px-6">
          <button type="button" onClick={() => navigate('/explore')} className="flex w-[220px] shrink-0 items-center">
            <TaymPersBrand className="h-[42px] w-auto max-w-[184px] object-contain" />
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
          <div className="mx-auto flex h-[56px] max-w-[1360px] items-center justify-between px-6">
            {desktopCategories.map((item) => {
              const Icon = item.icon;
              return <button key={item.label} type="button" className="sy-caption sy-semibold flex items-center gap-2.5 text-slate-600 hover:text-blue-600"><Icon size={20} className="text-blue-700" /> {item.label}</button>;
            })}
          </div>
        </div>
      </header>

      <header className="absolute inset-x-0 top-0 z-[900] flex h-[76px] items-center gap-3 bg-white/98 px-5 shadow-[0_6px_22px_rgba(15,23,42,.08)] backdrop-blur lg:hidden">
        <button type="button" onClick={() => navigate('/explore')} className="flex min-w-0 items-center">
          <TaymPersBrand className="h-[34px] w-auto max-w-[145px] object-contain" />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="sy-small sy-semibold flex h-9 items-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-3 shadow-sm"><MapPin size={13} className="text-blue-600" /> Morong, Rizal</button>
          <button type="button" aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-100 bg-white shadow-sm"><Bell size={16} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /></button>
          <AccountMenu size="sm" />
        </div>
      </header>

      <main className="absolute inset-x-0 bottom-[60px] top-[76px] overflow-y-auto px-3 pb-1 pt-1 lg:bottom-0 lg:top-[126px] lg:px-0 lg:pb-5 lg:pt-4 [scrollbar-width:thin]">
        <div className="mx-auto flex min-h-full w-full max-w-[1360px] flex-col gap-1.5 lg:gap-3">
          <section className="relative overflow-hidden rounded-2xl bg-emerald-50 px-3 py-2 lg:min-h-[198px] lg:px-[210px] lg:py-8">
            <div className="absolute left-[180px] top-1/2 hidden h-[118px] w-[118px] -translate-y-1/2 rounded-full bg-emerald-100 lg:block" />
            <div className="relative grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 lg:block">
              <span className="grid h-16 w-16 place-items-center justify-self-center rounded-full bg-emerald-100 text-emerald-600 lg:absolute lg:left-[10px] lg:top-1/2 lg:h-20 lg:w-20 lg:-translate-y-1/2"><Check size={34} strokeWidth={4} /></span>
              <div className="min-w-0 lg:ml-[160px]">
                <h1 className="text-[22px] font-bold leading-tight lg:text-[32px]">Experience added.</h1>
                <h2 className="sy-h4 mt-0.5 lg:mt-1 lg:text-[20px]">You just helped the next person know what to expect.</h2>
                <p className="sy-small mt-1 max-w-[680px] text-slate-600 lg:mt-2 lg:text-[16px]">Your contribution has been successfully recorded and is now part of TaymPers’ community data.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm lg:p-4">
            <div className="mb-1 flex items-start gap-2 lg:mb-2 lg:gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 lg:h-10 lg:w-10"><FileCheck2 size={17} /></span>
              <div><h2 className="sy-h4 lg:text-[20px]">Your submitted experience</h2><p className="sy-small hidden text-slate-500 sm:block lg:text-[14px]">Here’s a summary of what you shared.</p></div>
            </div>
            <div className="grid gap-2 lg:grid-cols-[690px_minmax(0,1fr)] lg:items-center lg:gap-3">
              <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2.5 lg:grid-cols-[126px_minmax(0,1fr)] lg:gap-3">
                <img src={service.image} alt="" className="h-[72px] w-[110px] rounded-lg object-cover lg:h-[116px] lg:w-[186px] lg:rounded-xl" />
                <div className="min-w-0 self-center lg:ml-[60px]">
                  <h3 className="sy-h4 truncate lg:text-[20px]">{service.name}</h3>
                  <p className="sy-small mt-0.5 flex items-center gap-1.5 text-slate-500 lg:mt-1 lg:text-[14px]"><HeartPulse size={13} className="text-emerald-500" /> {service.category}</p>
                  <p className="sy-small mt-0.5 flex items-center gap-1.5 text-slate-500 lg:mt-1 lg:text-[14px]"><MapPin size={13} className="text-blue-600" /> Morong, Rizal</p>
                  <p className="sy-small mt-1 flex items-center gap-2 lg:mt-2 lg:text-[14px]"><span className="sy-semibold rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 lg:px-3 lg:py-1">Open</span><span className="truncate text-slate-500">8:00 AM – 5:00 PM</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white lg:rounded-xl">
                <SummaryMetric icon={<FileText size={17} />} label="Service" value={serviceType} />
                <SummaryMetric icon={<CalendarDays size={17} />} label="Visit Date & Time" value={`${formatDate(visitDate)} · ${formatTime(visitTime)}`} />
                <SummaryMetric icon={<Clock3 size={17} />} label="Waiting Time" value={waitTime} />
                <SummaryMetric icon={<TimerReset size={17} />} label="Processing Time" value={processingTime} />
              </div>
            </div>
          </section>

          <div className="grid gap-1.5 lg:grid-cols-[1.3fr_1fr] lg:gap-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:p-4">
              <div className="mb-1.5 flex items-start gap-2.5 lg:mb-2 lg:gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 lg:h-10 lg:w-10"><BarChart3 size={18} /></span>
                <div><h2 className="sy-h4 lg:text-[20px]">Community data updated</h2><p className="sy-small hidden text-slate-500 sm:block">Your report is now included in the community intelligence for this service.</p></div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-emerald-100 rounded-xl bg-emerald-50 p-2 lg:p-3">
                <div className="flex items-start gap-2 pr-2 lg:gap-3 lg:pr-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 lg:h-11 lg:w-11"><UsersRound size={19} /></span><div><div className="sy-small text-slate-600 lg:text-[14px]">Community contributions</div><div className="sy-h4 mt-0.5 text-emerald-600 lg:mt-1 lg:text-[24px]">{service.reports} → {contributionCount}</div><p className="sy-small mt-1 hidden text-slate-500 lg:block">Your experience is now part of TaymPers’ community data.</p></div></div>
                <div className="flex items-start gap-2 pl-2 lg:gap-3 lg:pl-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 lg:h-11 lg:w-11"><ShieldCheck size={19} /></span><div><div className="sy-small text-slate-600 lg:text-[14px]">Community Confidence</div><div className="sy-h4 mt-0.5 text-emerald-600 lg:mt-1 lg:text-[24px]">{service.confidence}</div><p className="sy-small mt-1 hidden text-slate-500 lg:block">Based on {contributionCount} recent community contributions</p></div></div>
              </div>
              <div className="mt-2 lg:mt-3">
                <div className="mb-1 flex items-center gap-2 lg:mb-1.5"><FileCheck2 size={17} className="text-blue-600" /><h3 className="sy-small sy-semibold lg:text-[16px]">Key details from your contribution</h3></div>
                <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-200">
                  <div className="px-2 py-1 lg:px-3 lg:py-2"><div className="sy-small truncate leading-tight text-slate-500">Reported wait time</div><div className="sy-small sy-semibold mt-0.5 leading-tight text-blue-600 lg:mt-1 lg:text-[16px]">{waitTime}</div></div>
                  <div className="px-2 py-1 lg:px-3 lg:py-2"><div className="sy-small truncate leading-tight text-slate-500">Service Quality</div><div className="sy-small sy-semibold mt-0.5 leading-tight text-blue-600 lg:mt-1 lg:text-[16px]">{serviceQuality}</div></div>
                  <div className="px-2 py-1 lg:px-3 lg:py-2"><div className="sy-small truncate leading-tight text-slate-500">Information Accurate</div><div className="sy-small sy-semibold mt-0.5 leading-tight text-blue-600 lg:mt-1 lg:text-[16px]">{accurate}</div></div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:p-4">
              <div className="flex items-start gap-2.5 lg:gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 lg:h-10 lg:w-10"><Lightbulb size={18} /></span>
                <div><h2 className="sy-small sy-semibold lg:text-[20px]">What your contribution helps improve</h2><p className="sy-small mt-0.5 hidden text-slate-500 lg:block">Real experiences from the community help make public services more transparent and easier to use.</p></div>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1 lg:mt-3 lg:grid-cols-1 lg:gap-2">
                {[
                  { icon: Clock3, title: 'Waiting-time estimates', shortTitle: 'Wait estimates', note: 'Helps others know when to visit and what to expect.' },
                  { icon: CalendarDays, title: 'Service availability information', shortTitle: 'Availability', note: 'Helps the community know if services are available.' },
                  { icon: FileCheck2, title: 'Information accuracy', shortTitle: 'Accuracy', note: 'Helps keep posted requirements and details up to date.' },
                  { icon: UsersRound, title: 'Community service expectations', shortTitle: 'Expectations', note: 'Builds a clearer and more realistic picture of the service experience.' },
                ].map((item) => {
                  const Icon = item.icon;
                  return <div key={item.title} className="min-w-0 rounded-lg border border-slate-100 px-1 py-1 lg:flex lg:items-start lg:gap-3 lg:border-0 lg:px-0 lg:py-1"><span className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-blue-600 lg:mx-0 lg:h-9 lg:w-9"><Icon size={15} /></span><div className="mt-1 min-w-0 text-center lg:mt-0 lg:text-left"><div className="sy-small sy-semibold leading-tight text-slate-900"><span className="lg:hidden">{item.shortTitle}</span><span className="hidden lg:inline">{item.title}</span></div><p className="sy-small mt-0.5 hidden text-slate-500 lg:block">{item.note}</p></div></div>;
                })}
              </div>
            </section>
          </div>

          <div className="mt-auto grid gap-1.5 pt-0.5 lg:grid-cols-2 lg:gap-2 lg:pt-1">
            <button type="button" onClick={() => navigate(serviceRoute)} className="sy-small sy-semibold order-2 flex h-8 items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white text-blue-600 lg:order-1 lg:h-12 lg:rounded-xl lg:text-[14px]"><ArrowLeft size={15} /> Back to Service</button>
            <button type="button" onClick={() => navigate(insightsRoute)} className="sy-small sy-semibold order-1 flex h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 text-white shadow-[0_8px_22px_rgba(0,102,255,.18)] lg:order-2 lg:h-12 lg:rounded-xl lg:text-[14px]"><BarChart3 size={17} /> View Updated Insights <ArrowRight size={15} /></button>
          </div>
        </div>
      </main>

      <nav className="absolute inset-x-0 bottom-0 z-[1000] grid h-[60px] grid-cols-4 border-t border-slate-200 bg-white px-4 shadow-[0_-4px_18px_rgba(15,23,42,.06)] lg:hidden">
        <button type="button" onClick={() => navigate('/explore')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><MapIcon size={22} /><span className="sy-small sy-semibold">Explore</span></button>
        <button type="button" onClick={() => navigate('/contribute')} className="relative flex flex-col items-center justify-center gap-1 text-blue-600"><Plus size={24} /><span className="sy-small sy-semibold">Contribute</span><span className="absolute bottom-1 h-1 w-7 rounded-full bg-blue-600" /></button>
        <button type="button" onClick={() => navigate('/saved')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><Bookmark size={21} /><span className="sy-small sy-semibold">Saved</span></button>
        <button type="button" onClick={() => navigate('/profile')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><UserRound size={22} /><span className="sy-small sy-semibold">Profile</span></button>
      </nav>
    </div>
  );
}
