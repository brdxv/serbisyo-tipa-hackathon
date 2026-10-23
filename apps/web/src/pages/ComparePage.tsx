import React, { useMemo } from 'react';
import {
  Accessibility,
  ArrowLeft,
  ChevronRight,
  Clock3,
  FileText,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Star,
  UsersRound,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReferenceProductShell } from '../components/layout/ReferenceProductShell';
import { morongPrototypeServices } from '../data/morongPrototypeServices';

const compareIds = [
  'morong-rural-health-unit',
  'mercury-drug-morong-t-claudio',
  'morong-municipal-hall',
];

function waitRange(minutes: number) {
  if (minutes <= 12) return '5 – 15 min';
  if (minutes <= 20) return '10 – 20 min';
  if (minutes <= 28) return '15 – 30 min';
  return '20 – 40 min';
}

function processingRange(index: number) {
  return ['30 – 45 min', '10 – 20 min', '20 – 30 min'][index] ?? '15 – 30 min';
}

function MetricRow({
  icon,
  label,
  children,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`grid min-h-[36px] min-w-0 grid-cols-[18px_72px_minmax(0,1fr)] items-center gap-1 border-t border-slate-100 py-0.5 lg:min-h-[48px] lg:grid-cols-[24px_130px_minmax(0,1fr)] lg:gap-3 lg:px-2 lg:py-1.5 ${highlight ? 'rounded-lg bg-emerald-50' : ''}`}>
      <span className="text-indigo-500">{icon}</span>
      <span className="sy-small leading-tight text-slate-500">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function ComparePage() {
  const navigate = useNavigate();
  const services = useMemo(() => compareIds
    .map((id) => morongPrototypeServices.find((service) => service.id === id))
    .filter((service): service is NonNullable<typeof service> => Boolean(service)), []);

  return (
    <ReferenceProductShell active="explore">
      <div className="mx-auto min-h-full max-w-[1460px] px-3 py-3 lg:px-5 lg:py-4">
        <button type="button" onClick={() => navigate('/explore')} className="sy-small sy-semibold flex items-center gap-2 text-blue-600"><ArrowLeft size={15} /> Back to Search</button>

        <section className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="sy-h1">Compare Services</h1>
            <p className="sy-caption mt-0.5 max-w-[560px] text-slate-500">Compare nearby providers to find the best option for your needs.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button type="button" onClick={() => navigate('/explore')} className="sy-small sy-semibold hidden h-11 items-center gap-2 rounded-xl border border-blue-500 bg-white px-5 text-blue-600 lg:flex"><MapIcon size={18} /> View on Map</button>
            <button type="button" onClick={() => navigate('/explore')} className="flex h-[56px] w-[116px] items-start gap-2 rounded-xl bg-blue-50 px-2.5 py-2 text-left lg:h-auto lg:min-h-[62px] lg:w-[250px] lg:px-3">
              <PlusCircle size={20} className="mt-0.5 shrink-0 text-indigo-500" />
              <span><span className="sy-small sy-semibold block text-slate-900">Add <span className="hidden lg:inline">{services.length > 2 ? 'Another ' : ''}</span>Service</span><span className="sy-small mt-0.5 hidden text-slate-500 sm:block lg:block">Search and add a provider to compare.</span></span>
            </button>
          </div>
        </section>

        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">
          {services.map((service, index) => {
            const score = (service.score / 20).toFixed(1);
            const fastestWait = index === 1;
            const nearest = index === 2;
            const fastestProcessing = index === 1;
            const confidence = Math.min(98, service.reliability + (index === 1 ? 0 : -2));
            return (
              <article key={service.id} className={`min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:p-3 ${index === 2 ? 'hidden lg:block' : ''}`}>
                <div className="relative">
                  <img src={service.image} alt="" className="h-[96px] w-full rounded-lg object-cover lg:h-[126px] lg:rounded-xl" />
                  <button type="button" aria-label={`Remove ${service.name} from comparison`} className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm"><X size={14} /></button>
                </div>

                <div className="mt-2">
                  <h2 className="sy-small sy-semibold min-h-[32px] leading-tight text-slate-900 lg:min-h-0 lg:text-[20px]">{service.name}</h2>
                  <p className="sy-small mt-1 flex items-center gap-1.5 text-slate-500"><MapPin size={13} className="text-blue-600" /> {service.category}</p>
                  <div className="mt-1 flex items-center gap-1.5"><Star size={17} fill="currentColor" className="text-amber-400" /><span className="sy-h4 text-blue-700">{score}</span><span className="sy-small text-slate-500">({service.reports})</span></div>
                </div>

                <div className="mt-2">
                  <MetricRow icon={<Clock3 size={16} />} label="Open Status">
                    <div className="flex items-center justify-between gap-2"><span className="sy-small sy-semibold rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Open</span><span className="sy-small hidden text-slate-500 lg:block">8:00 AM – 5:00 PM</span></div>
                  </MetricRow>
                  <MetricRow icon={<MapPin size={16} />} label="Distance" highlight={nearest}>
                    <div className="min-w-0"><div className="sy-small sy-semibold text-slate-900">{service.distanceKm.toFixed(1)} km {nearest ? <span className="ml-1 rounded-full bg-emerald-100 px-1 py-0.5 text-emerald-700 lg:px-2">Nearest</span> : null}</div><div className="sy-small truncate text-slate-500">{service.address}</div></div>
                  </MetricRow>
                  <MetricRow icon={<Clock3 size={16} />} label="Average Wait" highlight={fastestWait}>
                    <div className="sy-small sy-semibold text-slate-900">{waitRange(service.averageWaitMinutes)} {fastestWait ? <span className="ml-1 rounded-full bg-emerald-100 px-1 py-0.5 text-emerald-700 lg:px-2"><span className="lg:hidden">Shortest</span><span className="hidden lg:inline">Shortest wait</span></span> : null}</div>
                  </MetricRow>
                  <MetricRow icon={<FileText size={16} />} label="Processing Time" highlight={fastestProcessing}>
                    <div className="min-w-0"><div className="sy-small sy-semibold text-slate-900">{processingRange(index)} {fastestProcessing ? <span className="ml-1 rounded-full bg-emerald-100 px-1 py-0.5 text-emerald-700 lg:px-2">Fastest</span> : null}</div><div className="sy-small hidden text-slate-500 lg:block">For common requests</div></div>
                  </MetricRow>
                  <MetricRow icon={<ShieldCheck size={16} />} label="Reliability">
                    <div><div className="sy-small sy-semibold text-emerald-600">High</div><div className="sy-small hidden text-slate-500 lg:block">Based on {service.reports} contributions</div></div>
                  </MetricRow>
        <MetricRow icon={<Star size={16} />} label="TaymPers Score">
                    <div className="flex min-w-0 items-center gap-1">
                      <span className="sy-small sy-semibold text-blue-700 lg:text-[16px]">{score}</span>
                      <Star size={11} fill="currentColor" className="shrink-0 text-amber-400 min-[420px]:hidden" />
                      <span className="hidden shrink-0 text-amber-400 min-[420px]:flex">{Array.from({ length: 5 }).map((_, star) => <Star key={star} fill="currentColor" className={`h-2.5 w-2.5 lg:h-3 lg:w-3 ${star < Math.round(Number(score)) ? '' : 'text-slate-200'}`} />)}</span>
                    </div>
                  </MetricRow>
                  <MetricRow icon={<Accessibility size={16} />} label="Accessibility">
                    <div><div className="sy-small sy-semibold text-emerald-600">{nearest ? 'Excellent' : 'Good'}</div><div className="sy-small hidden text-slate-500 lg:block">{nearest ? 'Wheelchair ramp, priority lane' : 'Wheelchair ramp, accessible entrance'}</div></div>
                  </MetricRow>
                  <MetricRow icon={<UsersRound size={16} />} label="Community Confidence">
                    <div><div className="sy-small sy-semibold text-slate-900">{confidence}%</div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600" style={{ width: `${confidence}%` }} /></div></div>
                  </MetricRow>
                  <div className="hidden lg:block">
                    <MetricRow icon={<MessageSquare size={16} />} label="Recent Insight">
                      <div className="min-w-0"><div className="sy-small sy-semibold line-clamp-2 text-slate-900">{service.insight}</div><div className="sy-small text-slate-500">Based on {service.reports} community contributions</div></div>
                    </MetricRow>
                  </div>
                </div>

                <div className="mt-2 space-y-1.5">
                  <button type="button" onClick={() => navigate(`/services/${service.id}`)} className="sy-small sy-semibold flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-white lg:h-9">View Profile <ChevronRight size={15} /></button>
                  <button type="button" onClick={() => navigate(`/explore?provider=${service.id}`)} className="sy-small sy-semibold flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white text-blue-600 lg:h-9"><MapIcon size={16} /> View on Map</button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </ReferenceProductShell>
  );
}
