import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as L from 'leaflet';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import {
  Accessibility,
  ArrowLeft,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudSun,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  House,
  Info,
  Landmark,
  Lightbulb,
  Map as MapIcon,
  MapPin,
  Minus,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Sun,
  TimerReset,
  TrendingDown,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CommunityReportsModal } from '../components/community/CommunityReportsModal';
import { EstablishmentPhotoGallery } from '../components/community/EstablishmentPhotoGallery';
import { TaymPersBrand } from '../components/branding/TaymPersBrand';
import { AccountMenu } from '../components/account/AccountMenu';
import { formatReportTime, getCommunityExperiences } from '../data/communityExperiences';
import { morongPrototypeServices } from '../data/morongPrototypeServices';
import { loadSerbisYOExploreStyle, type SerbisYOMapStyleMode } from '../map/serbisyoExploreMapTheme';
import { loadMorongRealMapPois, nativePoiPinAsset } from '../map/morongRealMapPois';
import type { ServiceSummary } from '../types/service';


const routeAliases: Record<string, string> = {
  'morong-health-center': 'morong-rural-health-unit',
};

const categories = [
  { label: 'All', icon: House, tone: 'text-blue-600' },
  { label: 'Government', icon: Landmark, tone: 'text-emerald-600' },
  { label: 'Healthcare', icon: HeartPulse, tone: 'text-rose-500' },
  { label: 'Education', icon: GraduationCap, tone: 'text-indigo-600' },
  { label: 'Pharmacy', icon: Pill, tone: 'text-teal-600' },
  { label: 'Commerce', icon: Store, tone: 'text-amber-600' },
  { label: 'Open Now', icon: Clock3, tone: 'text-emerald-600' },
  { label: 'Shortest Wait', icon: TimerReset, tone: 'text-blue-600' },
  { label: 'Highest Reliability', icon: ShieldCheck, tone: 'text-blue-600' },
  { label: 'Accessible', icon: Accessibility, tone: 'text-blue-600' },
] as const;

const mobileCategories = [
  { label: 'All', icon: House, tone: 'text-blue-600' },
  { label: 'Government', icon: Landmark, tone: 'text-emerald-600' },
  { label: 'Clinics', icon: HeartPulse, tone: 'text-rose-500' },
  { label: 'Open Now', icon: Clock3, tone: 'text-emerald-600' },
  { label: 'Accessible', icon: Accessibility, tone: 'text-blue-600' },
] as const;

const metrics = [
  { label: 'Service Quality', score: '4.3', percentage: 86, reports: 68, icon: UsersRound, bar: 'bg-emerald-500', iconBg: 'bg-blue-50 text-blue-600', note: 'Generally positive experiences with staff and service.' },
  { label: 'Reliability / Consistency', score: '4.1', percentage: 82, reports: 70, icon: ShieldCheck, bar: 'bg-blue-600', iconBg: 'bg-blue-50 text-blue-600', note: 'Service availability and operating hours are generally consistent.' },
  { label: 'Time & Efficiency', score: '3.9', percentage: 78, reports: 74, icon: Clock3, bar: 'bg-amber-400', iconBg: 'bg-amber-50 text-amber-500', note: 'Waiting and processing times are moderate.' },
  { label: 'Information Accuracy', score: '4.2', percentage: 84, reports: 62, icon: FileCheck2, bar: 'bg-blue-600', iconBg: 'bg-blue-50 text-blue-600', note: 'Posted requirements and information are mostly accurate.' },
  { label: 'Accessibility', score: '4.0', percentage: 70, reports: 48, icon: Accessibility, bar: 'bg-violet-500', iconBg: 'bg-violet-50 text-violet-600', note: 'Facilities are generally accessible and PWD-friendly.' },
] as const;

const busyAxisLabels = ['6AM', '9AM', '12PM', '3PM', '6PM', '8PM'];

function resolveService(providerId?: string) {
  const id = providerId ? (routeAliases[providerId] ?? providerId) : 'morong-rural-health-unit';
  return morongPrototypeServices.find((service) => service.id === id)
    ?? morongPrototypeServices.find((service) => service.id === 'morong-rural-health-unit')
    ?? morongPrototypeServices[0];
}

function markerAssetFor(service: ServiceSummary, selected = false) {
  if (!service.isOpen) return '/assets/pinpoints/closed-unavailable-marker.png';
  const category = service.category.toLowerCase();
  if (category.includes('health') || category.includes('clinic') || category.includes('hospital')) {
    return selected ? '/assets/pinpoints/clinic-marker-selected.png' : '/assets/pinpoints/clinic-marker-default.png';
  }
  if (category.includes('education')) return selected ? '/assets/pinpoints/education-marker-selected.png' : '/assets/pinpoints/education-marker-default.png';
  if (category.includes('pharmacy') || category.includes('commerce')) return selected ? '/assets/pinpoints/commerce-marker-selected.png' : '/assets/pinpoints/commerce-marker-default.png';
  if (category.includes('government')) return selected ? '/assets/pinpoints/selected-government-marker.png' : '/assets/pinpoints/default-government-marker.png';
  return selected ? '/assets/pinpoints/active-open-location-marker.png' : '/assets/pinpoints/neutral-place-marker.png';
}

function markerGlowFor(service: ServiceSummary) {
  const category = service.category.toLowerCase();
  if (category.includes('health') || category.includes('clinic') || category.includes('hospital')) return 'rgba(239,68,68,.55)';
  if (category.includes('education')) return 'rgba(124,58,237,.52)';
  if (category.includes('pharmacy') || category.includes('commerce')) return 'rgba(16,185,129,.52)';
  if (category.includes('government')) return 'rgba(0,102,255,.55)';
  return 'rgba(0,102,255,.50)';
}

export function CommunityIntelligencePage() {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const service = useMemo(() => resolveService(providerId), [providerId]);
  const communityReports = useMemo(() => getCommunityExperiences(service.id), [service.id]);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [mapStyle, setMapStyle] = useState<SerbisYOMapStyleMode>('serbisyo');
  const [mapStyleOpen, setMapStyleOpen] = useState(false);
  const [shellSearch, setShellSearch] = useState('');
  const [reportsHeading, setReportsHeading] = useState<string | null>(null);
  const [hoveredBusyIndex, setHoveredBusyIndex] = useState<number | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.Layer | null>(null);

  const busyPoints = useMemo(() => {
    const bins = Array.from({ length: 23 }, (_, index) => ({
      minuteOfDay: 6 * 60 + index * 30,
      count: 0,
      sampleTime: '',
    }));
    for (const report of communityReports) {
      const [hour, minute] = report.visitTime.split(':').map(Number);
      const total = hour * 60 + minute;
      const index = Math.round((total - 6 * 60) / 30);
      if (index < 0 || index >= bins.length) continue;
      bins[index].count += 1;
      bins[index].sampleTime ||= formatReportTime(report.visitTime);
    }
    const peak = Math.max(1, ...bins.map((bin) => bin.count));
    return bins.map((bin, index) => ({
      ...bin,
      height: Math.max(7, (bin.count / peak) * 100),
      sampleTime: bin.sampleTime || formatReportTime(`${String(Math.floor(bin.minuteOfDay / 60)).padStart(2, '0')}:${String(bin.minuteOfDay % 60).padStart(2, '0')}`),
      isPeak: bin.count >= Math.max(2, peak * 0.7),
      isModerate: bin.count >= Math.max(1, peak * 0.35),
      index,
    }));
  }, [communityReports]);

  useEffect(() => {
    const sync = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  useEffect(() => {
    if (!isDesktop || !mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: true, zoomSnap: 0.25 });
    map.attributionControl.setPrefix(false);
    map.setView(service.coords, 13.75);
    mapRef.current = map;
    L.control.scale({ imperial: false, maxWidth: 105, position: 'bottomleft' }).addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
    };
  }, [isDesktop, service]);

  useEffect(() => {
    const map = mapRef.current;
    if (!isDesktop || !map) return;
    let cancelled = false;
    const attribution = 'OpenFreeMap © OpenMapTiles · Data from OpenStreetMap';
    const load = async () => {
      if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
      if (mapStyle === 'satellite') {
        tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles © Esri', maxZoom: 19 }).addTo(map);
        return;
      }
      try {
        const style = await loadSerbisYOExploreStyle(mapStyle);
        if (cancelled || !mapRef.current) return;
        tileLayerRef.current = maplibreGL({ style, attributionControl: false, interactive: false, maxZoom: 19 }).addTo(map);
        map.attributionControl.addAttribution(attribution);
      } catch {
        if (cancelled || !mapRef.current) return;
        tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map);
      }
    };
    void load();
    return () => {
      cancelled = true;
      map.attributionControl.removeAttribution(attribution);
    };
  }, [isDesktop, mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!isDesktop || !map) return;
    const group = L.layerGroup().addTo(map);
    const createIcon = (src: string, size: number, selected = false, glow = 'transparent') => L.divIcon({
      className: 'serbisyo-leaflet-marker',
      html: `<span style="position:relative;width:${size}px;height:${size}px;display:block;"><span style="position:absolute;left:50%;top:55%;width:${selected ? size * 1.25 : 0}px;height:${selected ? size * 1.25 : 0}px;transform:translate(-50%,-50%);border-radius:999px;background:${glow};filter:blur(${selected ? 12 : 0}px);opacity:${selected ? .7 : 0};"></span><img src="${src}" alt="" style="position:relative;width:${size}px;height:${size}px;display:block;object-fit:contain;filter:drop-shadow(0 3px 5px rgba(15,23,42,.18)) ${selected ? `drop-shadow(0 0 9px ${glow})` : ''};" /></span>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
    });
    morongPrototypeServices.slice(0, 10).forEach((item) => {
      const selected = item.id === service.id;
      L.marker(item.coords, { icon: createIcon(markerAssetFor(item, selected), selected ? 62 : 40, selected, markerGlowFor(item)), zIndexOffset: selected ? 1000 : 0 }).addTo(group);
    });
    void loadMorongRealMapPois().then((pois) => {
      for (const poi of pois) {
        const nearPrototype = morongPrototypeServices.some((candidate) => {
          const dLat = candidate.coords[0] - poi.coords[0];
          const dLng = candidate.coords[1] - poi.coords[1];
          return dLat * dLat + dLng * dLng < 0.00000009;
        });
        if (nearPrototype) continue;
        const icon = L.divIcon({
          className: 'serbisyo-native-poi-marker',
          html: `<img src="${nativePoiPinAsset(poi.tags)}" alt="" style="width:24px;height:24px;display:block;object-fit:contain;opacity:.68;filter:grayscale(.18) drop-shadow(0 2px 3px rgba(15,23,42,.12));pointer-events:none;" />`,
          iconSize: [24, 24],
          iconAnchor: [12, 22],
        });
        L.marker(poi.coords, { icon, interactive: false, keyboard: false, zIndexOffset: -250 }).addTo(group);
      }
    });
    map.flyTo(service.coords, 13.75, { animate: false });
    return () => { map.removeLayer(group); };
  }, [isDesktop, service]);

  const serviceRoute = `/services/${service.id}`;

  return (
    <div className="sy-bg-page relative h-screen w-full overflow-hidden font-sans text-slate-900">
      <header className="absolute inset-x-3 top-3 z-[1000] hidden rounded-[20px] border border-slate-200/80 bg-white/97 px-9 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.10)] backdrop-blur-xl lg:block">
        <div className="flex items-center gap-8 max-[1500px]:gap-[22px]">
          <button type="button" onClick={() => navigate('/explore')} className="flex w-[174px] shrink-0 items-center rounded-xl text-left">
            <TaymPersBrand className="h-[40px] w-auto max-w-[166px] object-contain" />
          </button>
          <div className="relative w-full max-w-[min(735px,48vw)] flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={shellSearch}
              onChange={(event) => setShellSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && shellSearch.trim()) navigate(`/explore?q=${encodeURIComponent(shellSearch.trim())}`);
              }}
              placeholder="Search a service or place..."
              className="h-11 w-full rounded-full border border-slate-200 bg-slate-100 pl-11 pr-4 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <button type="button" className="hidden h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 shadow-sm md:flex"><MapPin size={17} className="text-blue-600" /><span>Morong, Rizal</span><ChevronDown size={14} className="text-slate-400" /></button>
            <button type="button" aria-label="Notifications" className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"><Bell size={18} /><span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /></button>
            <AccountMenu size="lg" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-2 max-[1500px]:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return <button key={category.label} type="button" onClick={() => navigate('/explore')} className={`flex h-10 shrink-0 items-center gap-2 rounded-xl px-[15px] text-[13px] font-semibold transition max-[1500px]:h-[38px] max-[1500px]:px-3 max-[1500px]:text-[12px] ${index === 0 ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><Icon size={18} className={index === 0 ? 'text-white' : category.tone} /> {category.label}</button>;
          })}
        </div>
      </header>

      <header className="absolute inset-x-0 top-0 z-[1000] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.94)_42%,rgba(255,255,255,0.82)_62%,rgba(255,255,255,0.56)_78%,rgba(255,255,255,0.24)_90%,rgba(255,255,255,0)_100%)] px-4 pb-7 pt-3 backdrop-blur-[1px] lg:hidden">
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => navigate('/explore')} className="flex min-w-0 items-center">
            <TaymPersBrand className="h-[34px] w-auto max-w-[146px] object-contain max-[390px]:max-w-[118px]" />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="sy-small sy-semibold flex h-10 items-center gap-1.5 rounded-2xl border border-white/80 bg-white/92 px-3 text-slate-900 shadow-[0_5px_18px_rgba(15,23,42,.10)] backdrop-blur max-[390px]:px-2"><MapPin size={15} className="text-blue-600" /><span>Morong, Rizal</span><ChevronDown size={13} className="text-slate-400" /></button>
            <button type="button" aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/92 text-slate-900 shadow-[0_5px_18px_rgba(15,23,42,.10)] backdrop-blur"><Bell size={18} /><span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /></button>
          <AccountMenu />
          </div>
        </div>
        <div className="relative mt-3">
          <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={shellSearch}
            onChange={(event) => setShellSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && shellSearch.trim()) navigate(`/explore?q=${encodeURIComponent(shellSearch.trim())}`);
            }}
            placeholder="Search services"
            className="h-12 w-full rounded-2xl border border-white/80 bg-white/94 pl-12 pr-14 text-[15px] font-normal text-slate-900 shadow-[0_5px_18px_rgba(15,23,42,.10)] outline-none placeholder:text-slate-400"
          />
          <button type="button" aria-label="Open filters" onClick={() => navigate('/explore')} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl bg-slate-100/90 text-slate-900"><SlidersHorizontal size={18} /></button>
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mobileCategories.map((category, index) => {
            const Icon = category.icon;
            return <button key={category.label} type="button" onClick={() => navigate('/explore')} className={`sy-small sy-semibold flex h-9 shrink-0 items-center gap-1 rounded-xl px-1.5 shadow-sm ${index === 0 ? 'bg-blue-600 text-white' : 'border border-white/80 bg-white/94 text-slate-900'}`}><Icon size={14} className={index === 0 ? 'text-white' : category.tone} />{category.label}</button>;
          })}
        </div>
      </header>

      <div className="absolute inset-x-0 bottom-[60px] top-[192px] lg:bottom-3 lg:left-3 lg:right-3 lg:top-[140px]">
        <main className="absolute inset-0 overflow-y-auto bg-white px-4 pb-6 pt-2 lg:right-auto lg:w-[61.5%] lg:rounded-l-[14px] lg:border lg:border-r-0 lg:border-slate-200 lg:px-6 lg:pb-5 lg:pt-3 [scrollbar-width:thin]">
          <button type="button" onClick={() => navigate(serviceRoute)} className="sy-small sy-semibold mb-2 inline-flex items-center gap-1.5 text-blue-600"><ArrowLeft size={15} /> Back to Service Profile</button>

          <section className="grid grid-cols-[96px_minmax(0,1fr)] gap-2.5 rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm lg:grid-cols-[236px_minmax(0,1fr)_198px] lg:gap-4 lg:border-0 lg:p-0 lg:shadow-none">
            <EstablishmentPhotoGallery images={service.images?.length ? service.images : [service.image]} name={service.name} compact />
            <div className="min-w-0 self-center">
              <div className="flex items-center gap-2">
                <h1 className="sy-h4 truncate lg:text-[24px] lg:font-bold">{service.name}</h1>
                <span className="sy-small sy-semibold shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Open</span>
              </div>
              <p className="sy-small mt-0.5 flex items-center gap-1.5"><Landmark size={13} className="text-blue-600" /> {service.category}</p>
              <p className="sy-small mt-0.5 flex min-w-0 items-center gap-1.5"><MapPin size={13} className="shrink-0 text-blue-600" /><span className="truncate">{service.address} · {service.distanceKm.toFixed(1)} km from center</span></p>
              <p className="sy-small mt-0.5 flex items-center gap-1.5"><Clock3 size={13} className="text-blue-600" /><span className="sy-semibold text-emerald-600">Open</span><span>· 8:00 AM – 5:00 PM</span></p>
              <p className="sy-caption mt-2 hidden text-slate-500 lg:block">Community-facing service location in Morong, Rizal, with practical service intelligence to help residents know what to expect before visiting.</p>
            </div>
            <div className="hidden grid-cols-1 gap-2 lg:grid">
              <button type="button" onClick={() => navigate(`/contribute?provider=${encodeURIComponent(service.id)}`)} className="sy-small sy-semibold h-9 rounded-lg bg-blue-600 px-3 text-white">Contribute Experience</button>
              <button type="button" onClick={() => navigate(serviceRoute)} className="sy-small sy-semibold h-9 rounded-lg border border-slate-200 bg-white px-3 text-left text-slate-700">Suggest an Update</button>
              <button type="button" onClick={() => navigate(serviceRoute)} className="sy-small sy-semibold h-9 rounded-lg border border-slate-200 bg-white px-3 text-left text-slate-700">Report Incorrect Information</button>
              <button type="button" onClick={() => mapRef.current?.flyTo(service.coords, 15)} className="sy-small sy-semibold h-9 rounded-lg border border-slate-200 bg-white px-3 text-left text-slate-700">View on Map</button>
            </div>
          </section>

          <section className="mt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="sy-h2">Community Intelligence</h2>
                <p className="sy-caption mt-0.5 text-slate-500">Real experiences from the community to help you know what to expect.</p>
              </div>
              <div className="hidden min-w-[258px] items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 lg:flex">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white"><Check size={22} /></span>
                <div><div className="sy-small text-slate-600">Community Confidence</div><div className="sy-h4 text-emerald-600">{service.confidence}</div><div className="sy-small text-slate-500">Based on {communityReports.length} recent community contributions</div></div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5 lg:hidden">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-600"><UsersRound size={20} /></span><div><div className="sy-small sy-semibold text-slate-900">Community Confidence: <span className="text-emerald-600">{service.confidence}</span></div><div className="sy-small text-slate-500">Based on {communityReports.length} recent community contributions</div></div></div>
              <ChevronRight size={18} className="text-emerald-600" />
            </div>

            <div className="mt-3 hidden grid-cols-5 gap-2 lg:grid">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <button type="button" aria-label={`View ${metric.label} reports`} key={metric.label} onClick={() => setReportsHeading(`${metric.label} Reports`)} className="rounded-xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                    <div className="flex items-center gap-2"><span className={`grid h-9 w-9 place-items-center rounded-xl ${metric.iconBg}`}><Icon size={18} /></span><div className="sy-small sy-semibold text-slate-900">{metric.label}</div></div>
                    <div className="mt-2 flex items-end gap-1"><span className="sy-h3">{metric.score}</span><span className="sy-small mb-0.5">/ 5</span></div>
                    <div className="mt-1.5 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${metric.bar}`} style={{ width: `${metric.percentage}%` }} /></div><span className="sy-small sy-semibold text-slate-700">{metric.percentage}%</span></div>
                    <div className="sy-small mt-1 text-slate-500">{communityReports.length} reports · View reports</div>
                    <p className="sy-small mt-2 text-slate-500">{metric.note}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 space-y-1.5 lg:hidden">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <button type="button" aria-label={`View ${metric.label} reports`} key={metric.label} onClick={() => setReportsHeading(`${metric.label} Reports`)} className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-2.5 py-2 text-left shadow-sm transition hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                    <span className={`grid h-10 w-10 place-items-center rounded-full ${metric.iconBg}`}><Icon size={19} /></span>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="sy-small sy-semibold truncate text-slate-900">{metric.label}</div>
                        <div className="flex shrink-0 items-end gap-1"><span className="sy-h4">{metric.score}</span><span className="sy-small">/ 5</span></div>
                      </div>
                      <div className="mt-1 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${metric.bar}`} style={{ width: `${metric.percentage}%` }} /></div><span className="sy-small shrink-0 text-slate-500">{communityReports.length} reports</span></div>
                      <p className="sy-small mt-0.5 hidden truncate text-slate-500 sm:block">{metric.note}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm lg:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"><Clock3 size={17} /></span>
                <div><h2 className="sy-h3">Busy Hours</h2><p className="sy-small text-slate-500">Based on {communityReports.length} recent visit reports</p></div>
              </div>
              <span className="sy-small sy-semibold rounded-full bg-red-50 px-3 py-1.5 text-red-600">Busiest from 11 AM to 1 PM</span>
            </div>

            <div className="mt-3">
              <div className="flex h-[96px] items-end gap-1 border-b border-slate-200 px-1 lg:h-[118px]">
                {busyPoints.map((point, index) => {
                  const distance = hoveredBusyIndex === null ? null : Math.abs(hoveredBusyIndex - index);
                  const curve = distance === null ? 0 : Math.max(0, 1 - distance / 5);
                  const displayHeight = hoveredBusyIndex === null
                    ? point.height
                    : Math.min(100, Math.max(7, point.height * 0.42 + curve * 66));
                  const displayOpacity = distance === null
                    ? 1
                    : distance === 0
                      ? 1
                      : Math.max(0.34, 0.94 - distance * 0.12);
                  return (
                    <button
                      type="button"
                      key={index}
                      aria-label={`${point.sampleTime}, ${point.count} visit reports`}
                      onMouseEnter={() => setHoveredBusyIndex(index)}
                      onMouseLeave={() => setHoveredBusyIndex(null)}
                      onFocus={() => setHoveredBusyIndex(index)}
                      onBlur={() => setHoveredBusyIndex(null)}
                      className="group relative flex h-full flex-1 items-end justify-center transition-all duration-150 focus:outline-none"
                      style={{ opacity: displayOpacity }}
                    >
                      <span
                        className={`w-full origin-bottom rounded-t-[3px] transition-[height,transform,opacity,box-shadow] duration-150 ease-out ${point.isPeak ? 'bg-red-400' : point.isModerate ? 'bg-amber-300' : 'bg-blue-300'} ${hoveredBusyIndex === index ? 'scale-x-[1.14] shadow-[0_0_0_2px_rgba(0,102,255,.14)]' : distance !== null && distance <= 2 ? 'scale-x-[1.04]' : ''}`}
                        style={{ height: `${displayHeight}%` }}
                      />
                      {hoveredBusyIndex === index ? (
                        <span className="sy-small sy-semibold pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-white shadow-lg">
                          {point.sampleTime} · {point.count} {point.count === 1 ? 'report' : 'reports'}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <div className="sy-small mt-1 grid grid-cols-6 text-center text-slate-500">
                {busyAxisLabels.map((label) => <span key={label}>{label}</span>)}
              </div>
              <div className="sy-small mt-2 flex items-center justify-center gap-5 text-slate-500"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-300" />Usually quiet</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-300" />Moderate</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-red-400" />Busiest</span></div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5 lg:gap-2">
              <div className="flex min-w-0 items-center gap-1.5 rounded-xl bg-blue-50 px-2 py-2 lg:gap-3 lg:px-3"><Sun size={20} className="shrink-0 text-blue-600 lg:h-[23px] lg:w-[23px]" /><div className="min-w-0"><div className="sy-small truncate text-blue-700">Morning wait</div><div className="sy-h4 whitespace-nowrap text-blue-700">5 – 15 min</div></div></div>
              <div className="flex min-w-0 items-center gap-1.5 rounded-xl bg-red-50 px-2 py-2 lg:gap-3 lg:px-3"><Sun size={20} className="shrink-0 text-red-500 lg:h-[23px] lg:w-[23px]" /><div className="min-w-0"><div className="sy-small truncate text-red-600">Midday wait</div><div className="sy-h4 whitespace-nowrap text-red-600">30 – 60 min</div></div></div>
              <div className="flex min-w-0 items-center gap-1.5 rounded-xl bg-blue-50 px-2 py-2 lg:gap-3 lg:px-3"><CloudSun size={20} className="shrink-0 text-blue-500 lg:h-[23px] lg:w-[23px]" /><div className="min-w-0"><div className="sy-small truncate text-blue-700">Afternoon wait</div><div className="sy-h4 whitespace-nowrap text-blue-700">15 – 30 min</div></div></div>
            </div>

            <div className="mt-2 flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600"><TrendingDown size={17} /></span>
              <p className="sy-small text-emerald-700">Average reported wait <span className="sy-semibold">improved by 6 minutes</span> compared with last week.</p>
            </div>
            <div className="sy-small mt-2 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700 lg:hidden"><Lightbulb size={15} /> Tip: Visit in the morning for shorter waiting times.</div>
          </section>

          <section className="mt-3 hidden lg:block">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><h2 className="sy-h3">Recent Trends</h2><span className="sy-small text-slate-500">Based on the latest community reports</span></div><span className="sy-small flex items-center gap-1 text-slate-500">vs. last week <Info size={13} /></span></div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[
                { label: 'Average Waiting Time', value: `${service.averageWaitMinutes} min`, change: '↓ 6 min', icon: Clock3 },
                { label: 'Processing Time', value: '18 min', change: '↓ 4 min', icon: TimerReset },
                { label: 'Service Availability', value: '91%', change: '↑ 3%', icon: Landmark },
                { label: 'Information Accuracy', value: '94%', change: '↑ 2%', icon: FileCheck2 },
              ].map((trend) => {
                const Icon = trend.icon;
                return <article key={trend.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon size={18} /></span><div className="min-w-0 flex-1"><div className="sy-small truncate text-slate-600">{trend.label}</div><div className="sy-h4 mt-0.5">{trend.value}</div></div><span className="sy-small sy-semibold rounded-lg bg-emerald-50 px-2 py-1 text-emerald-600">{trend.change}</span></article>;
              })}
            </div>
          </section>
        </main>

        <aside className="absolute bottom-0 right-0 top-0 hidden w-[38.5%] overflow-hidden rounded-r-[14px] border border-l-0 border-slate-200 bg-slate-100 lg:block">
          <div ref={mapContainerRef} className="absolute inset-0" />
          <div className="absolute right-3 top-3 z-[700] flex items-start gap-2">
            <button type="button" className="sy-small sy-semibold flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-4 shadow-lg"><Search size={15} className="text-blue-600" /> Search this area</button>
            <div className="grid gap-2">
              <div className="relative">
                <button type="button" aria-label="Change map style" onClick={() => setMapStyleOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white shadow-lg"><img src="/assets/icons/layers-map.png" alt="" className="h-6 w-6" /></button>
              {mapStyleOpen ? <div className="absolute right-12 top-0 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">{([['serbisyo', 'TaymPers'], ['liberty', 'Streets'], ['satellite', 'Satellite']] as const).map((entry) => <button key={entry[0]} type="button" onClick={() => { setMapStyle(entry[0]); setMapStyleOpen(false); }} className={`sy-small sy-semibold w-full rounded-lg px-3 py-2 text-left ${mapStyle === entry[0] ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}>{entry[1]}</button>)}</div> : null}
              </div>
              <button type="button" aria-label="Center map" onClick={() => mapRef.current?.flyTo(service.coords, 14.5)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white shadow-lg"><img src="/assets/icons/locate-crosshair.png" alt="" className="h-6 w-6" /></button>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"><button type="button" aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn()} className="grid h-10 w-10 place-items-center hover:bg-slate-50"><Plus size={18} /></button><div className="h-px bg-slate-200" /><button type="button" aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut()} className="grid h-10 w-10 place-items-center hover:bg-slate-50"><Minus size={18} /></button></div>
            </div>
          </div>
          <div className="absolute bottom-5 right-5 z-[700] flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/95 p-2.5 shadow-xl backdrop-blur"><img src={service.image} alt="" className="h-11 w-14 rounded-lg object-cover" /><div><div className="sy-small sy-semibold text-slate-900">Morong, Rizal</div><div className="sy-small text-slate-500">28°C Mostly Cloudy</div></div></div>
        </aside>
      </div>

      <nav className="absolute inset-x-0 bottom-0 z-[1000] grid h-[60px] grid-cols-4 border-t border-slate-200 bg-white px-4 shadow-[0_-4px_18px_rgba(15,23,42,.06)] lg:hidden">
        <button type="button" onClick={() => navigate('/explore')} className="relative flex flex-col items-center justify-center gap-1 text-blue-600"><MapIcon size={22} /><span className="sy-small sy-semibold">Explore</span><span className="absolute bottom-1 h-1 w-7 rounded-full bg-blue-600" /></button>
        <button type="button" onClick={() => navigate(`/contribute?provider=${encodeURIComponent(service.id)}`)} className="flex flex-col items-center justify-center gap-1 text-slate-500"><Plus size={23} /><span className="sy-small sy-semibold">Contribute</span></button>
        <button type="button" onClick={() => navigate('/saved')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><Bookmark size={21} /><span className="sy-small sy-semibold">Saved</span></button>
        <button type="button" onClick={() => navigate('/profile')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><UserRound size={22} /><span className="sy-small sy-semibold">Profile</span></button>
      </nav>

      <CommunityReportsModal
        open={Boolean(reportsHeading)}
        onClose={() => setReportsHeading(null)}
        serviceName={service.name}
        reports={communityReports}
        heading={reportsHeading ?? 'Community Reports'}
      />
    </div>
  );
}
