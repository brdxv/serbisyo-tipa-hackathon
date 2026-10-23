import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Clock3,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReferenceProductShell } from '../components/layout/ReferenceProductShell';
import { morongPrototypeServices } from '../data/morongPrototypeServices';

const savedIds = [
  'morong-rural-health-unit',
  'morong-municipal-hall',
  'urs-morong-campus',
  'mercury-drug-morong-t-claudio',
  'lto-morong-district-office',
];

function waitRange(minutes: number) {
  if (minutes <= 10) return '5 – 15 min';
  if (minutes <= 18) return '10 – 20 min';
  if (minutes <= 25) return '15 – 30 min';
  return '20 – 40 min';
}

export function SavedPage() {
  const navigate = useNavigate();
  const [removed, setRemoved] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const items = useMemo(() => {
    const data = savedIds
      .map((id) => morongPrototypeServices.find((service) => service.id === id))
      .filter((service): service is NonNullable<typeof service> => Boolean(service))
      .filter((service) => !removed.includes(service.id));
    if (sortBy === 'score') return [...data].sort((a, b) => b.score - a.score);
    if (sortBy === 'wait') return [...data].sort((a, b) => a.averageWaitMinutes - b.averageWaitMinutes);
    return data;
  }, [removed, sortBy]);

  return (
    <ReferenceProductShell active="saved">
      <div className="mx-auto h-full max-w-[1460px] px-3 py-3 lg:px-5 lg:py-5">
        <section className="flex items-start justify-between gap-3 lg:items-center">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 lg:h-12 lg:w-12"><Bookmark size={22} fill="currentColor" /></span>
            <div className="min-w-0">
              <h1 className="sy-h2">Saved Services</h1>
              <p className="sy-caption mt-0.5 text-slate-500">Services you saved to revisit, compare, or check before going.</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <span className="sy-caption text-slate-500">Sort by:</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="sy-caption sy-semibold h-11 rounded-xl border border-slate-200 bg-white px-4 outline-none">
              <option value="recent">Recently Saved</option>
              <option value="score">Highest Score</option>
              <option value="wait">Shortest Wait</option>
            </select>
            <button type="button" onClick={() => navigate('/explore')} className="sy-caption sy-semibold ml-8 flex h-11 items-center gap-2 rounded-xl border border-blue-500 bg-white px-5 text-blue-600"><MapIcon size={18} /> View Saved on Map</button>
          </div>
        </section>

        <div className="mt-3 flex items-center justify-between gap-3 lg:hidden">
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="sy-small sy-semibold h-9 min-w-[150px] rounded-lg border border-slate-200 bg-white px-3 outline-none">
            <option value="recent">Recently Saved</option>
            <option value="score">Highest Score</option>
            <option value="wait">Shortest Wait</option>
          </select>
          <button type="button" onClick={() => navigate('/explore')} className="sy-small sy-semibold flex h-9 items-center gap-2 rounded-lg border border-blue-500 bg-white px-3 text-blue-600"><MapIcon size={16} /> View on Map</button>
        </div>

        <div className="mt-3 grid min-h-0 gap-3 lg:h-[calc(100%-76px)] lg:grid-cols-[minmax(0,1fr)_430px]">
          <div className="space-y-2.5 lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin]">
            {items.map((service) => (
              <article
                key={service.id}
                onClick={() => navigate(`/services/${service.id}`)}
                className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-2 shadow-[0_3px_12px_rgba(15,23,42,.03)] transition hover:border-blue-200 hover:shadow-md lg:grid lg:grid-cols-[196px_minmax(0,1fr)_452px] lg:gap-4 lg:p-3"
              >
                <div className="grid grid-cols-[122px_minmax(0,1fr)] gap-2.5 lg:contents">
                  <img src={service.image} alt="" className="h-[92px] w-[122px] rounded-lg object-cover lg:h-[118px] lg:w-[196px] lg:rounded-xl" />
                  <div className="min-w-0 self-center pr-8 lg:pr-0">
                    <h2 className="sy-h4 truncate">{service.name}</h2>
                    <p className="sy-small mt-0.5 truncate text-slate-500">{service.category}</p>
                    <p className="sy-small mt-0.5 flex items-center gap-1.5 truncate text-slate-500"><MapPin size={13} className="shrink-0 text-blue-600" /> {service.address}</p>
                    <div className="sy-small mt-2 flex items-center gap-2">
                      <span className="sy-semibold rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Open</span>
                      <span className="truncate text-slate-500">8:00 AM – 5:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-1.5 lg:mt-0 lg:self-center">
                  <div className="rounded-lg bg-slate-50 px-2 py-2">
                    <div className="sy-small flex items-center gap-1.5 text-slate-500"><Clock3 size={15} className="text-blue-600" /> Average Wait</div>
                    <div className="sy-small sy-semibold mt-1 text-blue-600">{waitRange(service.averageWaitMinutes)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-2 py-2">
                    <div className="sy-small flex items-center gap-1.5 text-slate-500"><ShieldCheck size={15} className="text-emerald-600" /> Reliability</div>
                    <div className="sy-small sy-semibold mt-1 text-emerald-600">{service.reliability >= 90 ? 'High' : 'Good'}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-2 py-2">
                    <div className="sy-small text-slate-500">TaymPers Score</div>
                    <div className="mt-1 flex items-center gap-1"><span className="sy-h4 text-blue-700">{(service.score / 20).toFixed(1)}</span><span className="flex text-amber-400">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={12} fill="currentColor" className={index < Math.round(service.score / 20) ? '' : 'text-slate-200'} />)}</span></div>
                  </div>
                  <div className="col-span-3 flex items-start gap-2 rounded-lg px-2 py-1.5">
                    <MessageSquare size={15} className="mt-0.5 shrink-0 text-blue-600" />
                    <div className="min-w-0"><div className="sy-small sy-semibold truncate text-slate-900">{service.insight}</div><div className="sy-small text-slate-500">Based on {service.reports} community contributions</div></div>
                  </div>
                </div>

                <button type="button" onClick={(event) => { event.stopPropagation(); setRemoved((current) => [...current, service.id]); }} aria-label={`Remove ${service.name} from saved`} className="absolute right-3 top-3 text-blue-600 hover:text-red-500"><Bookmark size={21} fill="currentColor" /></button>
              </article>
            ))}
          </div>

          <aside className="hidden min-h-0 flex-col gap-3 lg:flex">
            <section className="relative h-[370px] overflow-hidden rounded-xl border border-slate-200 bg-[#eef5ef]">
              <div className="absolute inset-0 opacity-90 [background-image:linear-gradient(25deg,transparent_47%,rgba(255,255,255,.9)_48%,rgba(255,255,255,.9)_51%,transparent_52%),linear-gradient(115deg,transparent_48%,rgba(96,165,250,.22)_49%,rgba(96,165,250,.22)_52%,transparent_53%)] [background-size:72px_72px,94px_94px]" />
              {items.slice(0, 5).map((service, index) => {
                const positions = [[28, 28], [38, 48], [62, 34], [78, 58], [56, 75]][index] ?? [50, 50];
                return (
                  <div key={service.id} className="absolute" style={{ left: `${positions[0]}%`, top: `${positions[1]}%` }}>
                    <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 shadow-[0_5px_16px_rgba(0,102,255,.3)]" />
                    <Bookmark size={17} fill="white" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    <span className="sy-small sy-semibold absolute left-5 top-[-4px] whitespace-nowrap rounded-md bg-white px-2 py-1 shadow-sm">{service.name}</span>
                  </div>
                );
              })}
            </section>
            <section className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-blue-600"><Bookmark size={26} fill="currentColor" /></span>
              <h2 className="sy-h3 mt-6 max-w-[280px]">Save services to compare or revisit them later.</h2>
              <p className="sy-caption mt-3 max-w-[300px] text-slate-500">Keep important services on hand so you can easily check their information, see updated insights, and plan your visit.</p>
            </section>
          </aside>
        </div>
      </div>
    </ReferenceProductShell>
  );
}
