import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as L from 'leaflet';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import {
  Accessibility,
  ArrowLeft,
  Bell,
  Bookmark,
  Building2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileCheck2,
  Flag,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Lightbulb,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  Minus,
  PenLine,
  Phone,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Stethoscope,
  Syringe,
  TimerReset,
  UserRound,
  UsersRound,
  Utensils,
  X,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SuggestUpdateModal } from '../components/modals/SuggestUpdateModal';
import { ReportModal } from '../components/modals/ReportModal';
import { CommunityReportsModal } from '../components/community/CommunityReportsModal';
import { TaymPersBrand } from '../components/branding/TaymPersBrand';
import { formatReportDate, formatReportTime, getCommunityExperiences, ratingLabel } from '../data/communityExperiences';
import { morongPrototypeServices } from '../data/morongPrototypeServices';
import { loadSerbisYOExploreStyle, type SerbisYOMapStyleMode } from '../map/serbisyoExploreMapTheme';
import { loadMorongRealMapPois, nativePoiPinAsset } from '../map/morongRealMapPois';
import type { ServiceSummary } from '../types/service';


const PROFILE_ROUTE_ALIASES: Record<string, string> = {
  'morong-health-center': 'morong-rural-health-unit',
};

const categories = [
  { id: 'All', label: 'All', icon: House, tone: 'text-blue-600' },
  { id: 'Government', label: 'Government', icon: Landmark, tone: 'text-emerald-600' },
  { id: 'Healthcare', label: 'Healthcare', icon: HeartPulse, tone: 'text-rose-500' },
  { id: 'Education', label: 'Education', icon: GraduationCap, tone: 'text-indigo-600' },
  { id: 'Pharmacy', label: 'Pharmacy', icon: Building2, tone: 'text-teal-600' },
  { id: 'Commerce', label: 'Commerce', icon: Utensils, tone: 'text-amber-600' },
  { id: 'Open Now', label: 'Open Now', icon: Clock3, tone: 'text-emerald-600' },
  { id: 'Shortest Wait', label: 'Shortest Wait', icon: TimerReset, tone: 'text-blue-600' },
  { id: 'Highest Reliability', label: 'Highest Reliability', icon: ShieldCheck, tone: 'text-blue-600' },
  { id: 'Accessible', label: 'Accessible', icon: Accessibility, tone: 'text-blue-600' },
] as const;

const communityMetrics = [
  { label: 'Service Quality', value: 88, icon: UsersRound, bar: 'bg-blue-500' },
  { label: 'Reliability / Consistency', value: 91, icon: ShieldCheck, bar: 'bg-cyan-600' },
  { label: 'Time & Efficiency', value: 82, icon: Clock3, bar: 'bg-violet-500' },
  { label: 'Information Accuracy', value: 94, icon: FileCheck2, bar: 'bg-emerald-500' },
  { label: 'Accessibility', value: 76, icon: Accessibility, bar: 'bg-amber-400' },
];

const busyBars = [5, 7, 10, 14, 18, 24, 29, 27, 24, 20, 17, 14, 10, 7, 5];
const busyLabels = ['7AM', '', '9AM', '', '11AM', '', '1PM', '', '3PM', '', '5PM'];

const servicesOffered = [
  { title: 'General Consultation', note: 'Medical check-ups and consultations.', icon: Stethoscope },
  { title: 'Vaccination', note: 'Routine and seasonal immunizations.', icon: Syringe },
  { title: 'Medical Records Request', note: 'Request and claiming of medical records.', icon: FileCheck2 },
  { title: 'Laboratory Services', note: 'Basic laboratory and diagnostic tests.', icon: FlaskConical },
];

function servicesFor(service: ServiceSummary) {
  const category = service.category.toLowerCase();
  if (category.includes('health') || category.includes('clinic') || category.includes('hospital')) return servicesOffered;
  if (category.includes('education')) return [
    { title: 'Student Assistance', note: 'General school or campus assistance.', icon: UsersRound },
    { title: 'Records Request', note: 'Academic-record request and claiming assistance.', icon: FileCheck2 },
    { title: 'Enrollment Support', note: 'Enrollment information and office assistance.', icon: GraduationCap },
    { title: 'General Inquiry', note: 'Information and service-window guidance.', icon: Search },
  ];
  if (category.includes('transportation')) return [
    { title: 'Application Processing', note: 'Transaction processing and application assistance.', icon: FileCheck2 },
    { title: 'Document Verification', note: 'Document checking and requirements verification.', icon: ShieldCheck },
    { title: 'Public Assistance', note: 'General service-window assistance.', icon: UsersRound },
    { title: 'General Inquiry', note: 'Information and requirements guidance.', icon: Search },
  ];
  return [
    { title: 'Public Assistance', note: 'General front-desk assistance.', icon: UsersRound },
    { title: 'Document Request', note: 'Records or document request assistance.', icon: FileCheck2 },
    { title: 'Service Inquiry', note: 'Information and requirements guidance.', icon: Search },
    { title: 'Request Processing', note: 'General service-processing assistance.', icon: Clock3 },
  ];
}

function AnimatedNumber({ value, suffix = '', duration = 720 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, value]);

  return <>{display}{suffix}</>;
}

const accessibilityNotes = [
  'Wheelchair-accessible entrance',
  'Priority lane available',
  'Accessible restroom',
  'Seating area available',
  'PWD and senior citizen assistance',
];

function resolveProfileService(providerId?: string) {
  const resolvedId = providerId ? (PROFILE_ROUTE_ALIASES[providerId] ?? providerId) : 'morong-rural-health-unit';
  return morongPrototypeServices.find((service) => service.id === resolvedId)
    ?? morongPrototypeServices.find((service) => service.id === 'morong-rural-health-unit')
    ?? morongPrototypeServices[0];
}

function coordinateDistanceSquared(a: [number, number], b: [number, number]) {
  const lat = a[0] - b[0];
  const lng = a[1] - b[1];
  return lat * lat + lng * lng;
}

function markerAssetFor(service: ServiceSummary, selected = false) {
  if (!service.isOpen) return '/assets/pinpoints/closed-unavailable-marker.png';
  const category = service.category.toLowerCase();
  if (category.includes('health') || category.includes('clinic') || category.includes('hospital')) {
    return selected ? '/assets/pinpoints/clinic-marker-selected.png' : '/assets/pinpoints/clinic-marker-default.png';
  }
  if (category.includes('education')) {
    return selected ? '/assets/pinpoints/education-marker-selected.png' : '/assets/pinpoints/education-marker-default.png';
  }
  if (category.includes('pharmacy') || category.includes('commerce')) {
    return selected ? '/assets/pinpoints/commerce-marker-selected.png' : '/assets/pinpoints/commerce-marker-default.png';
  }
  if (category.includes('transportation')) {
    return selected ? '/assets/pinpoints/transportation-marker-selected.png' : '/assets/pinpoints/transportation-marker-default.png';
  }
  if (category.includes('government')) {
    return selected ? '/assets/pinpoints/selected-government-marker.png' : '/assets/pinpoints/default-government-marker.png';
  }
  return selected ? '/assets/pinpoints/active-open-location-marker.png' : '/assets/pinpoints/neutral-place-marker.png';
}

function markerGlowFor(service: ServiceSummary) {
  const category = service.category.toLowerCase();
  if (category.includes('health') || category.includes('clinic') || category.includes('hospital')) return 'rgba(239,68,68,.55)';
  if (category.includes('education')) return 'rgba(124,58,237,.52)';
  if (category.includes('pharmacy') || category.includes('commerce')) return 'rgba(16,185,129,.52)';
  if (category.includes('transportation')) return 'rgba(37,99,235,.52)';
  if (category.includes('government')) return 'rgba(0,102,255,.55)';
  return 'rgba(0,102,255,.50)';
}

function compactMapLabel(service: ServiceSummary) {
  const labels: Record<string, string> = {
    'morong-municipal-hall': 'Morong Municipal Hall',
    'urs-morong-campus': 'URS Morong',
    'rizal-provincial-hospital-system-morong': 'Rizal Provincial Hospital',
    'morong-public-market': 'Morong Public Market',
    'savemore-market-morong': 'Savemore Morong',
  };
  return labels[service.id] ?? service.name;
}

function safeImageFallback(event: React.SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = '/assets/vectors/no-results-map-illustration.png';
}

function revealOrder(order: number) {
  return {
    '--profile-reveal-order': order,
    '--profile-hide-delay': `${Math.max(0, 18 - order) * 10}ms`,
  } as React.CSSProperties;
}

function NoCommunityDataContent({
  service,
  onContribute,
}: {
  service: ServiceSummary;
  onContribute: () => void;
}) {
  return (
    <div>
      <section className="grid gap-3 border-b border-slate-100 pb-3 lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-5">
        <div className="relative">
          <img src={service.image} onError={safeImageFallback} alt={service.name} className="h-[126px] w-full rounded-xl object-cover lg:h-[205px]" />
          <span className="sy-small sy-semibold absolute right-2 top-2 rounded-full bg-slate-900/60 px-2 py-1 text-white lg:hidden">1/4</span>
        </div>
        <div className="min-w-0 self-center">
          <div className="flex items-start gap-2">
            <h1 className="sy-h2 min-w-0">{service.name}</h1>
            <span className="sy-small sy-semibold shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Open</span>
          </div>
          <p className="sy-caption mt-1 flex items-center gap-2 text-slate-500"><Landmark size={15} className="text-blue-600" /> {service.category}</p>
          <div className="sy-caption mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-600">
            <span className="flex items-center gap-2"><Clock3 size={16} className="text-blue-600" /><span><b className="font-semibold text-emerald-600">Open</b> · 8:00 AM – 5:00 PM</span></span>
            <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-600" /> {service.address}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 lg:max-w-[280px]">
            <button type="button" className="sy-small sy-semibold flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white text-blue-600"><Bookmark size={16} /> Save</button>
            <button type="button" className="sy-small sy-semibold flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white text-blue-600"><Share2 size={16} /> Share</button>
          </div>
        </div>
      </section>

      <nav className="mt-2 grid grid-cols-4 border-b border-slate-200 lg:grid-cols-5">
        {['Overview', 'Services', 'Requirements', 'Location', 'Community'].map((label, index) => (
          <button key={label} type="button" className={`sy-small sy-semibold relative h-10 ${index === 0 ? 'text-blue-600' : 'text-slate-500'} ${index === 4 ? 'hidden lg:block' : ''}`}>
            {label}
            {index === 0 ? <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-600" /> : null}
          </button>
        ))}
      </nav>

      <section className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white lg:hidden">
        <img src="/assets/vectors/pinned-location-map-tile.png" alt="" className="h-[100px] w-full object-cover" />
      </section>

      <section className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:p-5">
        <div>
          <h2 className="sy-h3">Community Experience</h2>
          <p className="sy-caption mt-0.5 text-slate-500">Real experiences from people who visited this service.</p>
        </div>
        <div className="mt-3 rounded-xl border border-slate-100 px-4 py-4 text-center lg:min-h-[380px] lg:px-8 lg:py-7">
          <div className="mx-auto grid h-20 w-32 place-items-center rounded-2xl bg-blue-50 text-blue-500">
            <div className="relative flex items-end gap-1"><UsersRound size={46} /><MessageSquare size={30} className="absolute -left-5 -top-5 text-blue-200" /><span className="absolute -right-5 -top-4 text-[28px] text-blue-500">!</span></div>
          </div>
          <h3 className="sy-h3 mt-4">No community experience yet.</h3>
          <p className="sy-caption mt-1 text-slate-500">Be the first to help others know what to expect.</p>
          <button type="button" onClick={onContribute} className="sy-small sy-semibold mx-auto mt-4 flex h-11 min-w-[210px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-white shadow-[0_8px_18px_rgba(0,102,255,.18)]"><Plus size={17} /> Contribute Experience</button>

          <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-4">
            {[
              [MessageSquare, 'Share your experience', 'Tell others about your visit, wait time, and overall experience.'],
              [UsersRound, 'Help the community', 'Your input helps residents plan better and know what to expect.'],
              [ShieldCheck, 'Keep it accurate', 'We review all contributions to keep information helpful and reliable.'],
            ].map(([Icon, title, note]) => (
              <div key={String(title)} className="px-2 lg:px-5">
                <Icon size={23} className="mx-auto text-blue-600" />
                <div className="sy-small sy-semibold mt-2 text-slate-900">{String(title)}</div>
                <p className="sy-small mt-1 hidden text-slate-500 sm:block">{String(note)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-3 grid gap-2 rounded-xl border border-slate-200 bg-white p-3 lg:hidden">
        <h3 className="sy-h4">Quick Information</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="sy-small flex items-start gap-2"><Clock3 size={16} className="shrink-0 text-blue-600" /><span><b className="font-semibold">Operating Hours</b><br />8:00 AM – 5:00 PM</span></div>
          <div className="sy-small flex items-start gap-2"><Phone size={16} className="shrink-0 text-blue-600" /><span><b className="font-semibold">Contact Number</b><br />(02) 1234 5678</span></div>
        </div>
      </section>
    </div>
  );
}

interface ServiceProfilePageProps {
  providerIdOverride?: string;
  overlay?: boolean;
  externalMap?: boolean;
  onViewOnMap?: () => void;
  onClose?: () => void;
}

export function ServiceProfilePage({
  providerIdOverride,
  overlay = false,
  externalMap = false,
  onViewOnMap,
  onClose,
}: ServiceProfilePageProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { providerId } = useParams();
  const service = useMemo(() => resolveProfileService(providerIdOverride ?? providerId), [providerId, providerIdOverride]);
  const noCommunityData = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('community') === 'empty' || service.reports === 0;
  }, [location.search, service.reports]);
  const nearbyServices = useMemo(
    () => morongPrototypeServices
      .filter((candidate) => candidate.id !== service.id)
      .sort((a, b) => coordinateDistanceSquared(a.coords, service.coords) - coordinateDistanceSquared(b.coords, service.coords))
      .slice(0, 7),
    [service],
  );
  const communityReports = useMemo(() => getCommunityExperiences(service.id), [service.id]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [mapStyle, setMapStyle] = useState<SerbisYOMapStyleMode>('serbisyo');
  const [isMapStyleMenuOpen, setIsMapStyleMenuOpen] = useState(false);
  const [infoPanePercent, setInfoPanePercent] = useState(61.5);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const profileLayoutRef = useRef<HTMLDivElement>(null);
  const isResizingInfoPaneRef = useRef(false);

  useEffect(() => {
    const syncViewport = () => setIsMobileViewport(window.innerWidth < 1024);
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  useEffect(() => {
    if (externalMap) return;
    if (!mapContainerRef.current) return;
    let cancelled = false;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: !isMobileViewport,
      zoomSnap: 0.25,
    });
    mapInstanceRef.current = map;
    if (!isMobileViewport) map.attributionControl.setPrefix(false);
    map.setView(service.coords, isMobileViewport ? 14.25 : 13.95);

    const createPinIcon = (src: string, size: number, selected = false, glow = 'transparent') => L.divIcon({
      className: 'service-profile-pin',
      html: `<span style="position:relative;width:${size}px;height:${size}px;display:block;"><span style="position:absolute;left:50%;top:55%;width:${selected ? size * 1.25 : 0}px;height:${selected ? size * 1.25 : 0}px;transform:translate(-50%,-50%);border-radius:999px;background:${glow};filter:blur(${selected ? 12 : 0}px);opacity:${selected ? .7 : 0};"></span><img src="${src}" alt="" style="position:relative;width:${size}px;height:${size}px;display:block;object-fit:contain;filter:drop-shadow(0 3px 5px rgba(15,23,42,.18)) ${selected ? `drop-shadow(0 0 9px ${glow})` : ''};" /></span>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size + 4],
    });

    const initialize = async () => {
      try {
        if (mapStyle === 'satellite') {
          L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            { attribution: 'Tiles © Esri', maxZoom: 19 },
          ).addTo(map);
        } else {
        const style = await loadSerbisYOExploreStyle(mapStyle);
        if (cancelled) return;
        maplibreGL({ style, attributionControl: false, interactive: false, maxZoom: 19 }).addTo(map);
        if (!isMobileViewport) map.attributionControl.addAttribution('OpenFreeMap © OpenMapTiles · Data from OpenStreetMap');
        }
      } catch (error) {
        console.warn('Service profile vector map unavailable; using raster fallback.', error);
        if (cancelled) return;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);
      }

      nearbyServices.forEach((nearby) => {
        const marker = L.marker(nearby.coords, { icon: createPinIcon(markerAssetFor(nearby), isMobileViewport ? 30 : 40) }).addTo(map);
        const showLabel = ['morong-public-market', 'urs-morong-campus', 'morong-municipal-hall'].includes(nearby.id);
        if (showLabel) {
          marker.bindTooltip(compactMapLabel(nearby), {
            permanent: true,
            direction: 'right',
            offset: [10, -16],
            className: 'serbisyo-map-tooltip',
          });
        }
      });

      void loadMorongRealMapPois().then((pois) => {
        if (cancelled) return;
        for (const poi of pois) {
          const nearPrototype = morongPrototypeServices.some((candidate) => coordinateDistanceSquared(candidate.coords, poi.coords) < 0.00000009);
          if (nearPrototype) continue;
          const icon = L.divIcon({
            className: 'serbisyo-native-poi-marker',
            html: `<img src="${nativePoiPinAsset(poi.tags)}" alt="" style="width:24px;height:24px;display:block;object-fit:contain;opacity:.68;filter:grayscale(.18) drop-shadow(0 2px 3px rgba(15,23,42,.12));pointer-events:none;" />`,
            iconSize: [24, 24],
            iconAnchor: [12, 22],
          });
          L.marker(poi.coords, { icon, interactive: false, keyboard: false, zIndexOffset: -250 }).addTo(map);
        }
      });

      const selectedSize = isMobileViewport ? 48 : 58;
      const selectedMarker = L.marker(service.coords, {
        icon: createPinIcon(markerAssetFor(service, true), selectedSize, true, markerGlowFor(service)),
        zIndexOffset: 1000,
      }).addTo(map);

      if (!isMobileViewport) {
        selectedMarker.bindPopup(
          `<div style="display:flex;gap:10px;align-items:center;width:250px;font-family:Inter,system-ui,sans-serif;padding:2px;">
            <img src="${service.image}" onerror="this.onerror=null;this.src='/assets/vectors/no-results-map-illustration.png';" style="width:62px;height:58px;border-radius:10px;object-fit:cover;" />
            <div style="min-width:0;">
              <strong style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:16px;font-weight:600;color:#0f172a;">${service.name}</strong>
              <div style="font-size:12px;color:#475569;margin-top:2px;">${service.category}</div>
              <div style="font-size:12px;margin-top:5px;"><b style="font-weight:600;color:#10b981;">${service.isOpen ? 'Open' : 'Closed'}</b><span style="color:#475569;"> · Prototype hours</span></div>
            </div>
          </div>`,
          { autoClose: false, closeOnClick: false, closeButton: false, offset: [0, -4] },
        ).openPopup();
      }
    };

    void initialize();
    setTimeout(() => map.invalidateSize(), 80);

    return () => {
      cancelled = true;
      map.remove();
      if (mapInstanceRef.current === map) mapInstanceRef.current = null;
    };
  }, [externalMap, isMobileViewport, mapStyle, nearbyServices, service]);

  const score = service.score;
  const confidence = service.confidence;
  const profileServices = useMemo(() => servicesFor(service), [service]);

  const goBackToExplore = () => {
    if (overlay && onClose) onClose();
    else navigate('/explore');
  };

  const resizeInfoPane = (clientX: number) => {
    const rect = profileLayoutRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setInfoPanePercent(Math.min(72, Math.max(61.5, next)));
  };

  return (
    <div className={`sy-bg-page relative overflow-hidden font-sans text-slate-900 ${overlay ? 'h-full w-full rounded-[24px]' : 'h-screen w-screen'}`}>
      <SuggestUpdateModal isOpen={isSuggestOpen} onClose={() => setIsSuggestOpen(false)} service={service} />
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} service={service} />

      {!overlay ? <header className="absolute inset-x-3 top-3 z-[900] hidden h-[88px] rounded-[18px] border border-slate-200/80 bg-white/97 px-7 py-2 shadow-[0_10px_28px_rgba(15,23,42,.09)] backdrop-blur-xl lg:block">
        <div className="flex h-10 items-center gap-5">
          <button type="button" onClick={goBackToExplore} className="flex w-[205px] shrink-0 items-center">
            <TaymPersBrand className="h-[36px] w-auto max-w-[174px] object-contain" />
          </button>

          <div className="relative min-w-0 flex-1 max-w-[580px]">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search a service or place..." className="sy-small h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 outline-none placeholder:text-slate-400 focus:border-blue-400" />
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <button type="button" className="sy-small sy-semibold flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
              <MapPin size={15} className="text-blue-600" /> Morong, Rizal <ChevronDown size={13} className="text-slate-400" />
            </button>
            <button type="button" aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <Bell size={16} /><span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <button type="button" onClick={() => navigate('/profile')} className="h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-sm">
              <img src="/assets/avatars/community-avatar-placeholder-1.png" alt="" className="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-center gap-1.5 overflow-hidden border-t border-slate-100 pt-1.5">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = activeCategory === category.id;
            return (
              <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)} className={`sy-small sy-semibold flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-3 ${active ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>
                <Icon size={14} className={active ? 'text-white' : category.tone} /> {category.label}
              </button>
            );
          })}
        </div>
      </header> : null}

      {!overlay ? <header className="absolute inset-x-0 top-0 z-[900] flex h-[90px] items-center gap-3 bg-white/96 px-5 pt-4 shadow-[0_6px_22px_rgba(15,23,42,.08)] backdrop-blur lg:hidden">
        <button type="button" onClick={goBackToExplore} className="flex min-w-0 items-center">
          <TaymPersBrand className="h-[34px] w-auto max-w-[145px] object-contain" />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="sy-small sy-semibold flex h-10 items-center gap-1.5 rounded-2xl bg-white px-3 shadow-[0_4px_16px_rgba(15,23,42,.10)]">
            <MapPin size={14} className="text-blue-600" /> Morong, Rizal <ChevronDown size={12} />
          </button>
          <button type="button" aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full bg-white shadow-[0_4px_16px_rgba(15,23,42,.10)]">
            <Bell size={17} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <button type="button" onClick={() => navigate('/profile')} className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm">
            <img src="/assets/avatars/community-avatar-placeholder-1.png" alt="" className="h-full w-full object-cover" />
          </button>
        </div>
      </header> : null}

      {overlay ? (
        <button
          type="button"
          aria-label="Close service profile"
          onClick={onClose}
          className="absolute right-3 top-3 z-[980] grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/96 text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,.18)] backdrop-blur transition hover:scale-105 hover:bg-white hover:text-slate-900 lg:hidden"
        >
          <X size={18} />
        </button>
      ) : null}

      <div className={overlay ? 'absolute inset-0' : 'absolute inset-x-0 bottom-[68px] top-[90px] lg:bottom-3 lg:left-3 lg:right-3 lg:top-[104px]'}>
        <div
          ref={profileLayoutRef}
          style={!externalMap ? { gridTemplateColumns: `${infoPanePercent}% ${100 - infoPanePercent}%` } : undefined}
          className={`relative h-full min-h-0 overflow-y-auto bg-slate-50 lg:overflow-hidden lg:rounded-[18px] lg:bg-white ${externalMap ? '' : 'lg:grid lg:border lg:border-slate-200 lg:shadow-[0_12px_32px_rgba(15,23,42,.08)]'}`}
        >
          <main className={`h-full min-h-0 min-w-0 overflow-y-auto overscroll-contain bg-transparent pb-5 lg:bg-white lg:pb-8 ${externalMap ? 'service-profile-expanded-content' : ''}`}>
            {!externalMap ? (
              <div className="relative mx-5 h-[116px] overflow-hidden rounded-t-[20px] bg-slate-100 lg:hidden">
                <div ref={isMobileViewport ? mapContainerRef : undefined} className="absolute inset-0" />
                <button type="button" onClick={() => mapInstanceRef.current?.setView(service.coords, 14.5, { animate: true })} className="absolute right-4 top-7 z-[700] grid h-11 w-11 place-items-center rounded-full bg-white shadow-lg">
                  <img src="/assets/icons/locate-crosshair.png" alt="" className="h-7 w-7 object-contain" />
                </button>
              </div>
            ) : null}

            <div className="mx-5 -mt-px rounded-t-[18px] bg-white px-3 pb-3 pt-3 shadow-sm lg:mx-0 lg:rounded-none lg:px-6 lg:pt-3 lg:shadow-none">
              <button type="button" onClick={goBackToExplore} style={revealOrder(0)} className="service-profile-reveal-item sy-small sy-semibold mb-3 hidden items-center gap-1.5 text-blue-600 hover:underline lg:inline-flex">
                <ArrowLeft size={15} /> Back to Explore
              </button>

              {noCommunityData ? (
                <div style={revealOrder(1)} className="service-profile-reveal-item">
                  <NoCommunityDataContent
                    service={service}
                    onContribute={() => navigate(`/contribute?provider=${encodeURIComponent(service.id)}`)}
                  />
                </div>
              ) : (
                <>
              <section className="grid grid-cols-[158px_minmax(0,1fr)] gap-3 lg:grid-cols-[236px_minmax(0,1fr)_198px] lg:items-start lg:gap-4">
                <img src={service.image} onError={safeImageFallback} alt={service.name} style={revealOrder(1)} className="service-profile-reveal-item h-[112px] w-full rounded-2xl bg-slate-100 object-cover shadow-sm lg:h-[150px] lg:w-[236px]" />

                <div className="min-w-0">
                  <div style={revealOrder(2)} className="service-profile-reveal-item flex items-start gap-2">
                    <h1 className="sy-h2 min-w-0">{service.name}</h1>
                    <span className={`sy-small sy-semibold shrink-0 rounded-full px-2.5 py-1 ${service.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{service.isOpen ? 'Open' : 'Closed'}</span>
                  </div>

                  <div className="sy-small mt-2 space-y-1">
                    <p style={revealOrder(3)} className="service-profile-reveal-item flex items-center gap-2"><Landmark size={15} className="shrink-0 text-blue-600" /> {service.category}</p>
                    <p style={revealOrder(4)} className="service-profile-reveal-item flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-blue-600" /><span>{service.address} <span className="font-bold text-blue-600">· {service.distanceKm.toFixed(1)} km from center</span></span></p>
                    <p style={revealOrder(5)} className="service-profile-reveal-item flex items-center gap-2"><Clock3 size={15} className="shrink-0 text-blue-600" /><span className={service.isOpen ? 'font-bold text-emerald-600' : 'font-bold text-amber-600'}>{service.isOpen ? 'Open' : 'Closed'}</span><span>· Typical hours 8:00 AM – 5:00 PM</span></p>
                  </div>

                  <p style={revealOrder(6)} className="service-profile-reveal-item sy-caption mt-2 hidden sm:block">Community-facing service location in Morong, Rizal, with practical service intelligence to help residents know what to expect before visiting.</p>
                </div>

                <div style={revealOrder(7)} className="service-profile-reveal-item col-span-2 grid grid-cols-3 gap-2 lg:col-span-1 lg:grid-cols-1">
                  <button type="button" onClick={() => navigate(`/contribute?provider=${encodeURIComponent(service.id)}`)} className="sy-small sy-semibold col-span-3 flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2.5 text-white shadow-md shadow-blue-500/15 lg:col-span-1 lg:whitespace-nowrap">
                    <PenLine size={14} className="shrink-0" /> <span>Contribute Experience</span>
                  </button>
                  <button type="button" onClick={() => setIsSuggestOpen(true)} className="sy-small sy-semibold flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-slate-700 lg:justify-start lg:px-3">
                    <FileCheck2 size={14} className="text-blue-700" /> <span className="truncate">Suggest an Update</span>
                  </button>
                  <button type="button" onClick={() => setIsReportOpen(true)} className="sy-small sy-semibold flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-slate-700 lg:justify-start lg:px-3">
                    <Flag size={14} className="text-blue-700" /> <span className="truncate">Report Incorrect Info</span>
                  </button>
                  <button type="button" onClick={() => onViewOnMap ? onViewOnMap() : mapInstanceRef.current?.flyTo(service.coords, 16)} className="sy-small sy-semibold flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-slate-700 lg:justify-start lg:px-3">
                    <MapIcon size={14} className="text-blue-700" /> <span className="truncate">View on Map</span>
                  </button>
                </div>
              </section>

              <section style={revealOrder(8)} className="service-profile-reveal-item mt-4">
                <h2 className="sy-h3 mb-2">Service Intelligence Summary</h2>
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                  <div className="grid grid-cols-2 divide-x divide-slate-100 md:grid-cols-[1.05fr_.8fr_.85fr_.75fr_1.35fr]">
                    <div className="p-3.5 md:p-4">
                    <div className="sy-small sy-semibold">TaymPers Score</div>
                      <div className="mt-1 flex items-center gap-2"><span className="sy-h3 grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white"><AnimatedNumber value={score} /></span><span className="sy-small">/100</span></div>
                      <div className="sy-small mt-1">Based on {communityReports.length} community reports</div>
                    </div>
                    <div className="p-3.5 md:p-4"><div className="sy-small">Average Wait</div><div className="sy-h4 mt-2"><AnimatedNumber value={service.averageWaitMinutes} /> min</div></div>
                    <div className="p-3.5 md:p-4"><div className="sy-small">Processing Time</div><div className="sy-h4 mt-2">15 – 20 min</div></div>
                    <div className="p-3.5 md:p-4"><div className="sy-small">Reliability</div><div className="sy-h4 mt-2"><AnimatedNumber value={service.reliability} suffix="%" /></div></div>
                    <div className="col-span-2 p-3.5 md:col-span-1 md:p-4"><div className="sy-small">Community Confidence</div><div className="sy-h4 mt-2 flex items-center gap-2 text-emerald-600"><ShieldCheck size={20} /> {confidence}</div></div>
                  </div>
                  <div className="sy-small sy-semibold mx-3 mb-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-slate-700"><Lightbulb size={15} className="shrink-0 text-amber-500" /> {service.insight}</div>
                </div>
              </section>

              <div className="mt-3 grid gap-3 lg:grid-cols-[1.55fr_.75fr]">
                <section style={revealOrder(9)} role="button" tabIndex={0} onClick={() => navigate(`/services/${service.id}/community-intelligence`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/services/${service.id}/community-intelligence`); }} className="service-profile-reveal-item cursor-pointer rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                  <div className="mb-3 flex items-center justify-between"><h2 className="sy-h4">Community Intelligence</h2><ChevronRight size={17} className="text-blue-600" /></div>
                  <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                    {communityMetrics.map((metric, index) => {
                      const Icon = metric.icon;
                      return (
                        <div key={metric.label} className="grid grid-cols-[28px_1fr_32px] items-center gap-2">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon size={14} /></span>
                          <div>
                            <div className="sy-small sy-semibold mb-1">{metric.label}</div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200"><div className={`taympers-metric-fill h-full rounded-full ${metric.bar}`} style={{ width: `${metric.value}%`, animationDelay: `${160 + index * 70}ms` }} /></div>
                          </div>
                          <span className="sy-small sy-semibold text-right text-slate-900"><AnimatedNumber value={metric.value} suffix="%" duration={620 + index * 60} /></span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section style={revealOrder(10)} role="button" tabIndex={0} onClick={() => navigate(`/services/${service.id}/community-intelligence`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/services/${service.id}/community-intelligence`); }} className="service-profile-reveal-item cursor-pointer rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                  <div className="mb-2 flex items-center justify-between"><h2 className="sy-h4">Busy Hours</h2><ChevronRight size={17} className="text-blue-600" /></div>
                  <div className="flex h-[78px] items-end gap-1 border-b border-slate-200 px-1">
                    {busyBars.map((value, index) => <div key={index} className={`taympers-busy-bar flex-1 rounded-t-[3px] ${index >= 5 && index <= 8 ? 'bg-red-400' : 'bg-blue-300'}`} style={{ height: `${Math.max(14, value * 2.15)}%`, animationDelay: `${90 + index * 34}ms` }} />)}
                  </div>
                  <div className="sy-small mt-1 grid grid-cols-11 text-center">{busyLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>
                  <div className="sy-small mt-2 flex items-center justify-between"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-400" />Usually quiet</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-200" />Moderate</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" />Busiest</span></div>
                </section>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-[1.25fr_.7fr]">
                <section style={revealOrder(11)} className="service-profile-reveal-item rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2"><h2 className="sy-h4">Services Offered</h2></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {profileServices.map((item) => {
                      const Icon = item.icon;
                      return <div key={item.title} className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon size={19} /></span><div><div className="sy-small sy-semibold text-slate-900">{item.title}</div><div className="sy-small mt-1">{item.note}</div></div></div>;
                    })}
                  </div>
                </section>

                <section style={revealOrder(12)} className="service-profile-reveal-item rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
                  <h2 className="sy-h4 mb-2">Accessibility Notes</h2>
                  <div className="sy-small space-y-2">
                    {accessibilityNotes.map((note) => <div key={note} className="flex items-center gap-2"><Accessibility size={14} className="shrink-0 text-blue-600" /> {note}</div>)}
                  </div>
                </section>
              </div>

              <section className="mt-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <div style={revealOrder(13)} className="service-profile-reveal-item mb-2 flex items-center justify-between"><h2 className="sy-h4">Recent Community Experiences</h2><button type="button" onClick={() => setIsReportsOpen(true)} className="sy-small sy-semibold flex items-center gap-1 text-blue-600">View All {communityReports.length} Reports <ChevronRight size={13} /></button></div>
                <div className="space-y-2">
                  {communityReports.slice(0, 4).map((experience, index) => (
                    <button type="button" onClick={() => setIsReportsOpen(true)} key={experience.id} style={revealOrder(14 + index)} className={`service-profile-reveal-item ${index > 1 ? 'hidden md:grid' : 'grid'} w-full grid-cols-[34px_minmax(0,.85fr)_110px_minmax(0,1.6fr)_76px] items-center gap-3 rounded-xl border border-slate-100 px-2.5 py-2 text-left transition hover:border-blue-200 hover:bg-blue-50/30`}>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600"><UserRound size={16} /></span>
                      <div><div className="sy-small sy-semibold text-slate-900">{experience.serviceType}</div><div className="sy-small mt-0.5">{formatReportDate(experience.visitDate)} · {formatReportTime(experience.visitTime)}</div></div>
                      <div className="sy-small sy-semibold flex items-center gap-1 text-slate-900"><Clock3 size={13} className="text-blue-600" /> {experience.waitMinutes} min</div>
                      <p className="sy-small truncate italic">“{experience.note}”</p>
                      <span className={`sy-small sy-semibold rounded-full px-2 py-1 text-center ${experience.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{ratingLabel(experience.overallExperience)}</span>
                    </button>
                  ))}
                </div>
              </section>
                </>
              )}
            </div>
          </main>

          {!externalMap ? (
            <div
              role="separator"
              aria-label="Resize service profile information panel"
              aria-orientation="vertical"
              aria-valuemin={61.5}
              aria-valuemax={72}
              aria-valuenow={Math.round(infoPanePercent)}
              onPointerDown={(event) => {
                isResizingInfoPaneRef.current = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                resizeInfoPane(event.clientX);
              }}
              onPointerMove={(event) => {
                if (isResizingInfoPaneRef.current) resizeInfoPane(event.clientX);
              }}
              onPointerUp={(event) => {
                isResizingInfoPaneRef.current = false;
                if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={() => { isResizingInfoPaneRef.current = false; }}
              className="absolute bottom-0 top-0 z-[760] hidden w-4 -translate-x-1/2 cursor-col-resize touch-none items-center justify-center lg:flex"
              style={{ left: `${infoPanePercent}%` }}
            >
              <span className="h-16 w-1 rounded-full bg-slate-300/80 shadow-sm transition hover:bg-blue-400" />
            </div>
          ) : null}

          {!externalMap ? <aside className="relative hidden overflow-hidden bg-slate-100 lg:block">
            <div ref={!isMobileViewport ? mapContainerRef : undefined} className="absolute inset-0" />
            <div className="absolute right-4 top-4 z-[700] flex items-start gap-2.5">
              <button type="button" className="sy-small sy-semibold flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-4 shadow-lg"><Search size={15} className="text-blue-600" /> Search this area</button>
              <div className="grid gap-2">
                <div className="relative">
                  <button type="button" aria-label="Change map style" title="Choose map style" onClick={() => setIsMapStyleMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white shadow-lg"><img src="/assets/icons/layers-map.png" alt="" className="h-6 w-6 object-contain" /></button>
                  {isMapStyleMenuOpen ? (
                    <div className="absolute right-12 top-0 z-[760] w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                      {([
                        ['serbisyo', 'TaymPers'],
                        ['liberty', 'Streets'],
                        ['satellite', 'Satellite'],
                      ] as const).map(([id, label]) => (
                        <button key={id} type="button" onClick={() => { setMapStyle(id); setIsMapStyleMenuOpen(false); }} className={`sy-small sy-semibold w-full rounded-lg px-3 py-2 text-left ${mapStyle === id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}>{label}</button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button type="button" aria-label="Center map" onClick={() => mapInstanceRef.current?.flyTo(service.coords, 14.5)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white shadow-lg"><img src="/assets/icons/locate-crosshair.png" alt="" className="h-6 w-6 object-contain" /></button>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"><button type="button" aria-label="Zoom in" onClick={() => mapInstanceRef.current?.zoomIn()} className="grid h-10 w-10 place-items-center hover:bg-slate-50"><Plus size={19} /></button><div className="h-px bg-slate-200" /><button type="button" aria-label="Zoom out" onClick={() => mapInstanceRef.current?.zoomOut()} className="grid h-10 w-10 place-items-center hover:bg-slate-50"><Minus size={19} /></button></div>
              </div>
            </div>

            <div className="absolute bottom-5 right-5 z-[700] flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/95 p-2.5 shadow-xl backdrop-blur">
              <img src="/assets/vectors/cloud-medium.png" alt="" className="h-10 w-12 object-contain" />
            <div><div className="sy-small sy-semibold text-slate-900">Morong, Rizal</div><div className="sy-small">28°C Mostly Cloudy</div></div>
            </div>
          </aside> : null}
        </div>
      </div>

      {!overlay ? <nav className="absolute inset-x-0 bottom-0 z-[950] grid h-[68px] grid-cols-4 border-t border-slate-200 bg-white px-3 shadow-[0_-4px_18px_rgba(15,23,42,.06)] lg:hidden">
        <button type="button" onClick={() => navigate('/explore')} className="relative flex flex-col items-center justify-center gap-1 text-blue-600"><MapIcon size={21} /><span className="sy-small sy-semibold">Explore</span><span className="absolute bottom-1 h-1 w-7 rounded-full bg-blue-600" /></button>
        <button type="button" onClick={() => navigate('/contribute')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><Plus size={22} /><span className="sy-small sy-semibold">Contribute</span></button>
        <button type="button" onClick={() => navigate('/saved')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><Bookmark size={20} /><span className="sy-small sy-semibold">Saved</span></button>
        <button type="button" onClick={() => navigate('/profile')} className="flex flex-col items-center justify-center gap-1 text-slate-500"><UserRound size={21} /><span className="sy-small sy-semibold">Profile</span></button>
      </nav> : null}

      <CommunityReportsModal
        open={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        serviceName={service.name}
        reports={communityReports}
        heading="Recent Community Experiences"
      />
    </div>
  );
}
