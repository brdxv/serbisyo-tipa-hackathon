import React, { useMemo, useState } from 'react';
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  FileText,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  House,
  Info,
  Landmark,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  Store,
  Syringe,
  ThumbsUp,
  TimerReset,
  UserRound,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TaymPersBrand } from '../components/branding/TaymPersBrand';
import { AccountMenu } from '../components/account/AccountMenu';
import { saveCommunityExperience } from '../data/communityExperiences';
import { morongPrototypeServices } from '../data/morongPrototypeServices';
import type { ServiceSummary } from '../types/service';


const chips = [
  ['All', 'All', House, 'text-blue-600'],
  ['Government', 'Government', Landmark, 'text-emerald-600'],
  ['Healthcare', 'Clinics', HeartPulse, 'text-rose-500'],
  ['Commerce', 'Food', Store, 'text-amber-500'],
  ['Education', 'Education', GraduationCap, 'text-indigo-600'],
  ['Open Now', 'Open Now', Clock3, 'text-emerald-600'],
  ['Shortest Wait', 'Shortest Wait', TimerReset, 'text-blue-600'],
  ['Highest Reliability', 'Highest Reliability', ShieldCheck, 'text-blue-600'],
] as const;

const steps = [
  { id: 'service', number: 1, label: 'Service', helper: 'Choose the service you used' },
  { id: 'visit', number: 2, label: 'Visit', helper: 'Report what happened during the visit' },
  { id: 'experience', number: 3, label: 'Experience', helper: 'Rate the actual service experience' },
  { id: 'review', number: 4, label: 'Review', helper: 'Check and submit your experience' },
] as const;

type StageId = (typeof steps)[number]['id'];

const serviceOptions = [
  { id: 'general-consultation', title: 'General Consultation', note: 'Medical check-ups and consultations.', icon: Stethoscope },
  { id: 'medical-records', title: 'Medical Records Request', note: 'Request and claiming of medical records.', icon: FileText },
  { id: 'vaccination', title: 'Vaccination', note: 'Routine and seasonal immunizations.', icon: Syringe },
  { id: 'laboratory', title: 'Laboratory Services', note: 'Basic laboratory and diagnostic tests.', icon: FlaskConical },
] as const;

const timeOptions = ['< 5 min', '5 – 15 min', '15 – 30 min', '30 – 60 min', '> 1 hr'] as const;
const ratingOptions = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] as const;

function timeBandMinutes(value: string) {
  if (value === '< 5 min') return 4;
  if (value === '5 – 15 min') return 10;
  if (value === '15 – 30 min') return 22;
  if (value === '30 – 60 min') return 45;
  return 70;
}

function ratingNumber(value: string) {
  return Math.max(1, ratingOptions.indexOf(value as (typeof ratingOptions)[number]) + 1);
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function markerAssetFor(service: ServiceSummary) {
  const category = service.category.toLowerCase();
  if (category.includes('health') || category.includes('clinic') || category.includes('hospital')) return '/assets/pinpoints/clinic-marker-selected.png';
  if (category.includes('education')) return '/assets/pinpoints/education-marker-selected.png';
  if (category.includes('pharmacy') || category.includes('commerce')) return '/assets/pinpoints/commerce-marker-selected.png';
  if (category.includes('government')) return '/assets/pinpoints/selected-government-marker.png';
  return '/assets/pinpoints/active-open-location-marker.png';
}

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

function WorkflowStepper({ current }: { current: number }) {
  return (
    <div className="grid min-w-0 flex-1 grid-cols-4">
      {steps.map((step, index) => {
        const complete = step.number < current;
        const active = step.number === current;
        return (
          <div key={step.id} className="relative min-w-0">
            {index < steps.length - 1 ? (
              <span className={cx(
                'absolute left-[54%] right-[-46%] top-[13px] h-[2px] rounded-full',
                step.number < current ? 'bg-blue-600' : 'bg-slate-200',
              )} />
            ) : null}
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className={cx(
                'sy-small sy-semibold grid h-[26px] w-[26px] place-items-center rounded-full border-2',
                complete || active
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-blue-50 bg-blue-50 text-slate-500',
              )}>
                {complete ? <Check size={14} strokeWidth={3} /> : step.number}
              </span>
              <span className={cx('sy-small sy-semibold mt-1', active ? 'text-slate-900' : 'text-slate-600')}>{step.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StageHeading({ current }: { current: number }) {
  const step = steps[current - 1];
  const heading = current === 1
    ? 'Confirm the service you used'
    : current === 2
      ? 'How was your visit?'
      : current === 3
        ? 'How was the service?'
        : 'Review your experience';
  const subtitle = current === 1
    ? 'Tell us which service you availed and when you visited.'
    : current === 2
      ? 'Tell us more about your visit experience.'
      : current === 3
        ? 'Share your experience with the service you received.'
        : 'Please review the details below before sharing your experience.';

  return (
    <div className="mt-2 lg:mt-0">
      <div className="hidden items-center gap-3 lg:flex">
        <span className="sy-h3 grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">{current}</span>
        <span className="sy-h3">{step.label}</span>
      </div>
      <h1 className="sy-h2 mt-1 lg:mt-1.5">{heading}</h1>
      <p className="sy-caption mt-0.5 text-slate-500">{subtitle}</p>
    </div>
  );
}

function ProviderCard({ service, onViewMap }: { service: ServiceSummary; onViewMap: () => void }) {
  return (
    <section className="mt-2.5 grid grid-cols-[92px_minmax(0,1fr)] gap-2.5 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_4px_14px_rgba(15,23,42,.035)] lg:mt-3 lg:grid-cols-[170px_minmax(0,1fr)_220px] lg:gap-4 lg:p-3">
      <img src={service.image} alt="" className="h-[70px] w-[92px] rounded-lg bg-slate-100 object-cover lg:h-[96px] lg:w-[170px] lg:rounded-xl" />
      <div className="min-w-0 self-center">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="sy-h4 truncate">{service.name}</h2>
          <span className="sy-small sy-semibold shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Open</span>
        </div>
        <p className="sy-small mt-0.5 flex items-center gap-1.5 text-slate-500"><Landmark size={12} className="shrink-0 text-blue-600" /> {service.category}</p>
        <p className="sy-small mt-0.5 flex min-w-0 items-center gap-1.5 text-slate-500"><MapPin size={12} className="shrink-0 text-blue-600" /><span className="truncate">{service.address} · {service.distanceKm.toFixed(1)} km from center</span></p>
        <p className="sy-small mt-0.5 flex items-center gap-1.5 text-slate-500"><Clock3 size={12} className="shrink-0 text-blue-600" /><span className="sy-semibold text-emerald-600">Open</span><span>· 8:00 AM – 5:00 PM</span><span className="hidden xl:inline">(Closes in 2h 15m)</span></p>
        <p className="sy-small mt-0.5 hidden items-center gap-1.5 text-slate-500 lg:flex"><span className="text-blue-600">⌕</span>{service.phone ?? '(02) 8654 1234'}</p>
      </div>

      <div className="relative col-span-2 hidden overflow-hidden rounded-xl border border-slate-100 bg-emerald-50 lg:block lg:col-span-1">
        <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(25deg,transparent_47%,rgba(255,255,255,.95)_48%,rgba(255,255,255,.95)_51%,transparent_52%),linear-gradient(115deg,transparent_48%,rgba(96,165,250,.28)_49%,rgba(96,165,250,.28)_52%,transparent_53%)] [background-size:62px_62px,88px_88px]" />
        <span className="sy-caption absolute right-10 top-1/2 -translate-y-1/2 text-slate-700">Morong</span>
        <img src={markerAssetFor(service)} alt="" className="absolute left-[44%] top-[44%] h-11 w-11 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-lg" />
        <button type="button" onClick={onViewMap} className="sy-small sy-semibold absolute bottom-2 right-2 flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-blue-600 shadow-sm"><MapIcon size={13} /> View on Map</button>
      </div>
    </section>
  );
}

function SelectionButton({ active, children, onClick, soft = false }: { active: boolean; children: React.ReactNode; onClick: () => void; soft?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'sy-small sy-semibold relative flex h-9 min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border px-1 transition lg:h-10 lg:rounded-xl lg:px-1.5',
        active
          ? soft
            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_3px_10px_rgba(0,102,255,.08)]'
            : 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_3px_10px_rgba(0,102,255,.08)] lg:bg-blue-600 lg:text-white lg:shadow-[0_5px_14px_rgba(0,102,255,.18)]'
          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50',
      )}
    >
      {active ? <CheckCircle2 size={13} className="hidden shrink-0 min-[420px]:block" /> : null}
      {children}
    </button>
  );
}

function RatingRow({
  icon,
  title,
  subtitle,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-100 bg-white px-2.5 py-2 shadow-[0_4px_12px_rgba(15,23,42,.025)] lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:items-center lg:gap-4 lg:border-0 lg:px-0 lg:py-1.5 lg:shadow-none">
      <div className="flex items-start gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 lg:h-9 lg:w-9">{icon}</span>
        <div className="min-w-0">
          <h3 className="sy-small sy-semibold text-slate-900">{title}</h3>
          <p className="sy-small mt-0.5 text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5 lg:mt-0 lg:gap-2">
        {ratingOptions.map((option) => (
          <SelectionButton key={option} active={value === option} onClick={() => onChange(option)} soft>{option}</SelectionButton>
        ))}
      </div>
    </section>
  );
}

function ReviewRow({
  icon,
  label,
  value,
  onEdit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="grid min-h-9 grid-cols-[22px_112px_minmax(0,1fr)_44px] items-center gap-2 border-b border-slate-100 px-1 last:border-b-0 lg:grid-cols-[22px_116px_minmax(0,1fr)_48px]">
      <span className="text-blue-600">{icon}</span>
      <span className="sy-small text-slate-500">{label}</span>
      <span className="sy-small sy-semibold truncate text-slate-900">{value}</span>
      <button type="button" onClick={onEdit} className="sy-small sy-semibold flex items-center justify-end gap-1 text-blue-600"><Pencil size={12} /> Edit</button>
    </div>
  );
}

export function ContributePage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const requestedProvider = params.get('provider');
  const requestedStage = params.get('stage') as StageId | null;
  const stage: StageId = steps.some((step) => step.id === requestedStage) ? requestedStage! : 'service';
  const currentStep = steps.find((step) => step.id === stage)?.number ?? 1;

  const service = useMemo(
    () => morongPrototypeServices.find((item) => item.id === requestedProvider)
      ?? morongPrototypeServices.find((item) => item.id === 'morong-rural-health-unit')
      ?? morongPrototypeServices[0],
    [requestedProvider],
  );

  const [selectedService, setSelectedService] = useState('general-consultation');
  const [visitDate, setVisitDate] = useState('2026-10-18');
  const [visitTime, setVisitTime] = useState('10:30');
  const [waitTime, setWaitTime] = useState('15 – 30 min');
  const [processingTime, setProcessingTime] = useState('5 – 15 min');
  const [available, setAvailable] = useState('Yes');
  const [accurate, setAccurate] = useState('Yes');
  const [details, setDetails] = useState('');
  const [serviceQuality, setServiceQuality] = useState('Very Good');
  const [accessibilityRating, setAccessibilityRating] = useState('Good');
  const [overallExperience, setOverallExperience] = useState('Very Good');
  const [accessibilityNote, setAccessibilityNote] = useState('Priority lane was available and the entrance was wheelchair accessible.');

  const selectedServiceOption = serviceOptions.find((option) => option.id === selectedService) ?? serviceOptions[0];
  const serviceRoute = '/services/' + service.id;

  const goToStage = (nextStage: StageId) => {
    const next = new URLSearchParams(params);
    next.set('provider', service.id);
    next.set('stage', nextStage);
    setParams(next);
  };

  const goPrevious = () => {
    if (currentStep <= 1) {
      navigate(serviceRoute);
      return;
    }
    goToStage(steps[currentStep - 2].id);
  };

  const goNext = () => {
    const nextStep = steps.find((step) => step.number === currentStep + 1);
    if (nextStep) goToStage(nextStep.id);
  };

  return (
    <div className="sy-bg-page relative h-screen w-full overflow-hidden font-sans text-slate-900">
      <header className="absolute inset-x-3 top-2 z-[900] hidden h-[56px] rounded-[14px] border border-slate-200/80 bg-white/97 px-7 py-2 shadow-[0_10px_28px_rgba(15,23,42,.08)] backdrop-blur-xl lg:block">
        <div className="flex h-10 items-center gap-5">
          <button type="button" onClick={() => navigate('/explore')} className="flex w-[205px] shrink-0 items-center">
            <TaymPersBrand className="h-[36px] w-auto max-w-[174px] object-contain" />
          </button>
          <div className="relative min-w-0 max-w-[580px] flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search a service or place..." className="sy-small h-9 w-full rounded-full border border-slate-100 bg-slate-100 pl-10 pr-4 outline-none placeholder:text-slate-400" />
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <button type="button" className="sy-small sy-semibold flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4"><MapPin size={15} className="text-blue-600" /> Morong, Rizal <ChevronDown size={13} className="text-slate-400" /></button>
            <button type="button" aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white"><Bell size={16} /><span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /></button>
            <AccountMenu size="sm" />
          </div>
        </div>
      </header>

      <header className="absolute inset-x-0 top-0 z-[900] flex h-[76px] items-center gap-3 bg-white/98 px-5 shadow-[0_6px_22px_rgba(15,23,42,.08)] backdrop-blur lg:hidden">
        <button type="button" onClick={() => navigate('/explore')} className="flex min-w-0 items-center">
          <TaymPersBrand className="h-[34px] w-auto max-w-[145px] object-contain" />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="sy-small sy-semibold flex h-9 items-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-3 shadow-sm"><MapPin size={13} className="text-blue-600" /> Morong, Rizal <ChevronDown size={11} /></button>
          <button type="button" aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-100 bg-white shadow-sm"><Bell size={16} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /></button>
          <AccountMenu size="sm" />
        </div>
      </header>

      <main className="absolute inset-x-0 bottom-[60px] top-[76px] overflow-y-auto bg-white px-3 pb-4 pt-2 lg:bottom-3 lg:left-3 lg:right-3 lg:top-[72px] lg:rounded-[14px] lg:border lg:border-slate-200 lg:px-6 lg:pb-5 lg:pt-4 lg:shadow-[0_12px_32px_rgba(15,23,42,.06)] [scrollbar-width:thin]">
        <div className="mx-auto flex min-h-full w-full max-w-[1460px] flex-col">
          <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-7">
            <div>
              {currentStep === 1 ? (
                <button type="button" onClick={goPrevious} className="sy-small sy-semibold mb-2 hidden h-9 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 text-blue-700 shadow-sm hover:bg-blue-100 lg:inline-flex">
                  <ArrowLeft size={14} /> Cancel contribution
                </button>
              ) : null}
              <StageHeading current={currentStep} />
            </div>
            <div className="mt-1 rounded-xl bg-slate-50 px-3 py-2 lg:mt-1 lg:bg-transparent lg:px-0 lg:py-0">
              <WorkflowStepper current={currentStep} />
            </div>
          </div>

          <div key={stage} className="contribution-stage-enter flex min-h-0 flex-1 flex-col">
            <ProviderCard service={service} onViewMap={() => navigate(serviceRoute)} />

            {stage === 'service' ? (
              <div className="mt-3 flex flex-1 flex-col">
                <h2 className="sy-h4 mb-2">What service did you use?</h2>
                <div className="grid gap-2 lg:grid-cols-4 lg:gap-3">
                  {serviceOptions.map((option) => {
                    const Icon = option.icon;
                    const active = option.id === selectedService;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedService(option.id)}
                        className={cx(
                          'grid min-h-[62px] grid-cols-[34px_minmax(0,1fr)_24px] items-start gap-2 rounded-xl border p-2.5 text-left transition lg:min-h-[78px] lg:grid-cols-[40px_minmax(0,1fr)] lg:p-3',
                          active ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30',
                        )}
                      >
                        <span className={cx('grid h-8 w-8 place-items-center rounded-full lg:h-10 lg:w-10', active ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-600')}><Icon size={17} /></span>
                        <span className="min-w-0">
                          <span className="sy-small sy-semibold block text-slate-900">{option.title}</span>
                          <span className="sy-small mt-0.5 block text-slate-500">{option.note}</span>
                        </span>
                        <span className={cx('grid h-5 w-5 place-items-center rounded-full border lg:hidden', active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent')}>{active ? <Check size={12} /> : null}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2.5 lg:gap-4">
                  <label className="relative rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                    <span className="sy-small block text-slate-500">Visit Date</span>
                    <span className="mt-1 flex items-center justify-between gap-2"><span className="flex items-center gap-2"><CalendarDays size={16} className="text-blue-600" /><strong className="sy-small text-slate-900">{formatDate(visitDate)}</strong></span><ChevronDown size={14} className="text-blue-600" /></span>
                    <input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Visit date" />
                  </label>
                  <label className="relative rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                    <span className="sy-small block text-slate-500">Visit Time</span>
                    <span className="mt-1 flex items-center justify-between gap-2"><span className="flex items-center gap-2"><Clock3 size={16} className="text-blue-600" /><strong className="sy-small text-slate-900">{formatTime(visitTime)}</strong></span><ChevronDown size={14} className="text-blue-600" /></span>
                    <input type="time" value={visitTime} onChange={(event) => setVisitTime(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Visit time" />
                  </label>
                </div>

                <div className="sy-small sy-semibold mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700"><CheckCircle2 size={16} /> <span>This is the correct place.<span className="ml-1 hidden font-normal text-emerald-600 sm:inline">{service.name}, {service.address}</span></span></div>
              </div>
            ) : null}

            {stage === 'visit' ? (
              <div className="mt-3 flex flex-1 flex-col">
                <div className="grid gap-x-7 gap-y-3 lg:grid-cols-2">
                  <section>
                    <div className="mb-2 flex items-center gap-2"><Clock3 size={18} className="text-blue-600" /><h2 className="sy-small sy-semibold text-slate-900">What was the waiting time?</h2></div>
                    <div className="grid grid-cols-5 gap-1.5">{timeOptions.map((option) => <SelectionButton key={option} active={waitTime === option} onClick={() => setWaitTime(option)}>{option}</SelectionButton>)}</div>
                  </section>
                  <section>
                    <div className="mb-2 flex items-center gap-2"><FileCheck2 size={18} className="text-blue-600" /><h2 className="sy-small sy-semibold text-slate-900">Was the service available?</h2></div>
                    <div className="grid grid-cols-3 gap-2">{['Yes', 'No', 'Partially available'].map((option) => <SelectionButton key={option} active={available === option} onClick={() => setAvailable(option)}>{option}</SelectionButton>)}</div>
                  </section>
                  <section>
                    <div className="mb-2 flex items-center gap-2"><TimerReset size={18} className="text-blue-600" /><h2 className="sy-small sy-semibold text-slate-900">What was the processing time?</h2></div>
                    <div className="grid grid-cols-5 gap-1.5">{timeOptions.map((option) => <SelectionButton key={option} active={processingTime === option} onClick={() => setProcessingTime(option)}>{option}</SelectionButton>)}</div>
                  </section>
                  <section>
                    <div className="mb-2 flex items-center gap-2"><Info size={18} className="text-blue-600" /><h2 className="sy-small sy-semibold text-slate-900">Was the posted information accurate?</h2></div>
                    <div className="grid grid-cols-3 gap-2">{['Yes', 'No', 'Somewhat accurate'].map((option) => <SelectionButton key={option} active={accurate === option} onClick={() => setAccurate(option)}>{option}</SelectionButton>)}</div>
                  </section>
                </div>

                <section className="mt-3">
                  <div className="mb-2 flex items-center gap-2"><MessageSquare size={18} className="text-blue-600" /><h2 className="sy-small sy-semibold text-slate-900">Anything others should know? <span className="font-normal text-blue-600">(Optional)</span></h2></div>
                  <div className="relative">
                    <textarea value={details} maxLength={500} onChange={(event) => setDetails(event.target.value)} placeholder="e.g. process was smooth, bring valid ID, long line during lunch..." className="sy-small h-[74px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-14 outline-none placeholder:text-slate-400 focus:border-blue-400 lg:h-[72px]" />
                    <span className="sy-small absolute bottom-2 right-3 text-slate-400">{details.length}/500</span>
                  </div>
                </section>
              </div>
            ) : null}

            {stage === 'experience' ? (
              <div className="mt-3 flex flex-1 flex-col">
                <div className="space-y-2 lg:space-y-1.5">
                  <RatingRow icon={<Star size={18} />} title="Service Quality" subtitle="How would you rate the quality of service you received?" value={serviceQuality} onChange={setServiceQuality} />
                  <RatingRow icon={<Accessibility size={18} />} title="Accessibility" subtitle="How would you rate the accessibility of the facility and services?" value={accessibilityRating} onChange={setAccessibilityRating} />
                  <RatingRow icon={<ThumbsUp size={18} />} title="Overall Experience" subtitle="Overall, how would you rate your experience?" value={overallExperience} onChange={setOverallExperience} />
                </div>

                <section className="mt-3 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-4">
                  <div className="flex items-start gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 lg:h-9 lg:w-9"><MessageSquare size={17} /></span>
                    <div><h2 className="sy-small sy-semibold text-slate-900">Anything important about accessibility? <span className="font-normal text-blue-600">(Optional)</span></h2></div>
                  </div>
                  <div className="relative mt-2 lg:mt-0">
                    <textarea value={accessibilityNote} maxLength={500} onChange={(event) => setAccessibilityNote(event.target.value)} className="sy-small h-[70px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-14 outline-none focus:border-blue-400" />
                    <span className="sy-small absolute bottom-2 right-3 text-slate-400">{accessibilityNote.length}/500</span>
                  </div>
                </section>
              </div>
            ) : null}

            {stage === 'review' ? (
              <div className="mt-3 flex flex-1 flex-col">
                <h2 className="sy-h4 mb-2">Experience Summary</h2>
                <div className="grid gap-x-6 rounded-xl border border-slate-100 bg-white px-2 shadow-[0_4px_14px_rgba(15,23,42,.025)] lg:grid-cols-2 lg:px-3">
                  <div>
                    <ReviewRow icon={<UserRound size={14} />} label="Service" value={selectedServiceOption.title} onEdit={() => goToStage('service')} />
                    <ReviewRow icon={<CalendarDays size={14} />} label="Visit" value={`${formatDate(visitDate)} · ${formatTime(visitTime)}`} onEdit={() => goToStage('service')} />
                    <ReviewRow icon={<Clock3 size={14} />} label="Waiting Time" value={waitTime} onEdit={() => goToStage('visit')} />
                    <ReviewRow icon={<TimerReset size={14} />} label="Processing Time" value={processingTime} onEdit={() => goToStage('visit')} />
                    <ReviewRow icon={<CheckCircle2 size={14} />} label="Service Availability" value={available} onEdit={() => goToStage('visit')} />
                    <ReviewRow icon={<Info size={14} />} label="Information Accuracy" value={accurate} onEdit={() => goToStage('visit')} />
                  </div>
                  <div>
                    <ReviewRow icon={<Star size={14} />} label="Service Quality" value={serviceQuality} onEdit={() => goToStage('experience')} />
                    <ReviewRow icon={<Accessibility size={14} />} label="Accessibility" value={accessibilityRating} onEdit={() => goToStage('experience')} />
                    <ReviewRow icon={<ThumbsUp size={14} />} label="Overall Experience" value={overallExperience} onEdit={() => goToStage('experience')} />
                    <ReviewRow icon={<MessageSquare size={14} />} label="Community Note" value={details || 'Process was smooth. Bring a valid ID.'} onEdit={() => goToStage('visit')} />
                  </div>
                </div>
                <div className="sy-small mt-3 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-blue-700"><Info size={16} className="mt-0.5 shrink-0" /> Your contribution helps others know what to expect and improves community service information.</div>
              </div>
            ) : null}

            <div className="mt-auto flex items-center justify-between gap-3 pt-3">
              <button type="button" onClick={goPrevious} className={`sy-small sy-semibold h-10 min-w-[96px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-blue-600 hover:bg-slate-50 lg:min-w-[120px] ${currentStep === 1 ? 'flex lg:hidden' : 'flex'}`}>
                <ArrowLeft size={15} /> {currentStep === 1 ? 'Cancel' : currentStep === 4 ? 'Back' : 'Previous'}
              </button>
              {currentStep < 4 ? (
                <button type="button" onClick={goNext} className="sy-small sy-semibold flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-white shadow-[0_8px_20px_rgba(0,102,255,.18)] sm:flex-none sm:min-w-[220px] lg:h-11 lg:min-w-[270px]">
                  {currentStep === 1 ? 'Next: Visit Details' : currentStep === 2 ? 'Next: Rate Your Experience' : 'Next: Review Your Experience'} <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    saveCommunityExperience({
                      providerId: service.id,
                      author: 'You',
                      serviceType: selectedServiceOption.title,
                      visitDate,
                      visitTime,
                      waitMinutes: timeBandMinutes(waitTime),
                      processingMinutes: timeBandMinutes(processingTime),
                      available: available as 'Yes' | 'No' | 'Partially available',
                      informationAccurate: accurate as 'Yes' | 'No' | 'Somewhat accurate',
                      serviceQuality: ratingNumber(serviceQuality),
                      accessibility: ratingNumber(accessibilityRating),
                      overallExperience: ratingNumber(overallExperience),
                      note: details || accessibilityNote || 'Shared a service experience.',
                      sentiment: ratingNumber(overallExperience) >= 4 ? 'Positive' : ratingNumber(overallExperience) === 3 ? 'Neutral' : 'Needs attention',
                    });
                    navigate(`/contribute/success?provider=${encodeURIComponent(service.id)}`, {
                      state: {
                        serviceType: selectedServiceOption.title,
                        visitDate,
                        visitTime,
                        waitTime,
                        processingTime,
                        available,
                        accurate,
                        details,
                        serviceQuality,
                        accessibilityRating,
                        overallExperience,
                      },
                    });
                  }}
                  className="sy-small sy-semibold flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-white shadow-[0_8px_20px_rgba(0,102,255,.18)] sm:flex-none sm:min-w-[220px] lg:h-11"
                >
                  Share Experience <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <nav className="absolute inset-x-0 bottom-0 z-[1000] grid h-[60px] grid-cols-4 border-t border-slate-200 bg-white px-4 shadow-[0_-4px_18px_rgba(15,23,42,.06)] lg:hidden">
        <button type="button" onClick={() => navigate('/explore')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><MapIcon size={22} /><span className="sy-small sy-semibold">Explore</span></button>
        <button type="button" className="relative flex flex-col items-center justify-center gap-1 text-blue-600"><Plus size={24} /><span className="sy-small sy-semibold">Contribute</span><span className="absolute bottom-1 h-1 w-7 rounded-full bg-blue-600" /></button>
        <button type="button" onClick={() => navigate('/saved')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><Bookmark size={21} /><span className="sy-small sy-semibold">Saved</span></button>
        <button type="button" onClick={() => navigate('/profile')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><UserRound size={22} /><span className="sy-small sy-semibold">Profile</span></button>
      </nav>
    </div>
  );
}
