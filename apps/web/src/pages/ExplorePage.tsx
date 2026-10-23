import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as L from 'leaflet';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import {
  Accessibility,
  Bell,
  Bookmark,
  BookmarkCheck,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crosshair,
  GraduationCap,
  Grid2X2,
  HeartPulse,
  History,
  House,
  Landmark,
  Lightbulb,
  List,
  Map as MapIcon,
  MapPin,
  Minus,
  Navigation,
  Pill,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Store,
  TimerReset,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FilterModal } from '../components/modals/FilterModal';
import { TaymPersBrand } from '../components/branding/TaymPersBrand';
import { AccountMenu } from '../components/account/AccountMenu';
import { morongPrototypeServices, morongPrototypeZone } from '../data/morongPrototypeServices';
import { loadSerbisYOExploreStyle, type SerbisYOMapStyleMode } from '../map/serbisyoExploreMapTheme';
import { loadMorongRealMapPois, nativePoiPinAsset, type MorongRealMapPoi } from '../map/morongRealMapPois';
import { getCommunityExperiences } from '../data/communityExperiences';
import { ServiceProfilePage } from './ServiceProfilePage';
import type { FilterOptions, ServiceSummary } from '../types/service';

const DEFAULT_SELECTED_SERVICE = morongPrototypeServices.find((service) => service.id === 'morong-municipal-hall')
  ?? morongPrototypeServices[0];

const accessibleServiceIds = new Set([
  'morong-municipal-hall',
  'morong-rural-health-unit',
  'rizal-provincial-hospital-system-morong',
  'urs-morong-campus',
  'morong-national-high-school',
]);

const categoryChips = [
  { id: 'All', label: 'All', icon: House, iconClass: 'text-blue-600' },
  { id: 'Government', label: 'Government', icon: Landmark, iconClass: 'text-emerald-600' },
  { id: 'Healthcare', label: 'Healthcare', icon: HeartPulse, iconClass: 'text-rose-500' },
  { id: 'Education', label: 'Education', icon: GraduationCap, iconClass: 'text-indigo-600' },
  { id: 'Pharmacy', label: 'Pharmacy', icon: Pill, iconClass: 'text-teal-600' },
  { id: 'Commerce', label: 'Commerce', icon: Store, iconClass: 'text-amber-600' },
] as const;

const decisionChips = [
  { id: 'Open Now', label: 'Open Now', icon: Clock3 },
  { id: 'Shortest Wait', label: 'Shortest Wait', icon: TimerReset },
  { id: 'Highest Reliability', label: 'Highest Reliability', icon: ShieldCheck },
  { id: 'Accessible', label: 'Accessible', icon: Accessibility },
] as const;

const mobileCategoryChips = [
  { id: 'All', label: 'All', icon: House },
  { id: 'Government', label: 'Government', icon: Landmark },
  { id: 'Healthcare', label: 'Clinics', icon: HeartPulse },
  { id: 'Open Now', label: 'Open Now', icon: Clock3 },
  { id: 'Accessible', label: 'Accessible', icon: Accessibility },
] as const;

type NearbySearchSuggestion = {
  title: string;
  note: string;
  query: string;
  category?: 'Open Now' | 'Accessible';
  sort?: 'Shortest Wait';
};

const nearbySearchSuggestions: readonly NearbySearchSuggestion[] = [
  { title: 'Clinics near Morong', note: 'Find clinics around your current location', query: 'clinic' },
  { title: 'Open clinics', note: 'Show clinics that are currently open', query: 'clinic', category: 'Open Now' },
  { title: 'Shortest wait nearby', note: 'Clinics with the shortest average wait time', query: 'clinic', sort: 'Shortest Wait' },
  { title: 'Accessible clinics', note: 'Clinics with PWD-friendly facilities', query: 'clinic', category: 'Accessible' },
] as const;

function searchCategorySuggestion(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  if (['clinic', 'health', 'doctor', 'hospital', 'medical'].some((term) => normalized.includes(term))) {
    return { id: 'Healthcare', label: 'Clinic / Healthcare', note: 'Search for all clinics and healthcare services', icon: HeartPulse, tone: 'text-rose-500', bg: 'bg-rose-50' };
  }
  if (['government', 'municipal', 'office', 'lto', 'registry'].some((term) => normalized.includes(term))) {
    return { id: 'Government', label: 'Government Services', note: 'Search public offices and government services', icon: Landmark, tone: 'text-emerald-600', bg: 'bg-emerald-50' };
  }
  if (['school', 'education', 'university', 'college'].some((term) => normalized.includes(term))) {
    return { id: 'Education', label: 'Education', note: 'Search schools and education services', icon: GraduationCap, tone: 'text-indigo-600', bg: 'bg-indigo-50' };
  }
  if (['pharmacy', 'drug', 'medicine'].some((term) => normalized.includes(term))) {
    return { id: 'Pharmacy', label: 'Pharmacy', note: 'Search nearby pharmacies and medicine providers', icon: Pill, tone: 'text-teal-600', bg: 'bg-teal-50' };
  }
  if (['market', 'store', 'commerce', 'shop'].some((term) => normalized.includes(term))) {
    return { id: 'Commerce', label: 'Commerce', note: 'Search markets, stores, and public commerce services', icon: Store, tone: 'text-amber-600', bg: 'bg-amber-50' };
  }
  return null;
}

function SearchAutocompletePanel({
  query,
  matches,
  recentSearches,
  mobile = false,
  onProvider,
  onCategory,
  onSuggestion,
  onRecent,
  onClearRecent,
}: {
  query: string;
  matches: ServiceSummary[];
  recentSearches: string[];
  mobile?: boolean;
  onProvider: (service: ServiceSummary) => void;
  onCategory: (category: string) => void;
  onSuggestion: (suggestion: NearbySearchSuggestion) => void;
  onRecent: (term: string) => void;
  onClearRecent: () => void;
}) {
  const category = searchCategorySuggestion(query);

  const categorySection = category ? (
    <section>
      <h3 className={mobile ? 'sy-h4 mb-1' : 'sy-h4 mb-2'}>Matching Category</h3>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onCategory(category.id)}
        className={`flex w-full items-center gap-3 border border-slate-200 bg-white text-left transition hover:border-blue-200 hover:bg-blue-50/40 ${mobile ? 'rounded-lg px-2.5 py-2' : 'rounded-xl px-3 py-2.5'}`}
      >
        <span className={`grid shrink-0 place-items-center rounded-lg ${category.bg} ${category.tone} ${mobile ? 'h-9 w-9' : 'h-11 w-11'}`}>
          <category.icon size={mobile ? 20 : 23} strokeWidth={2.4} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="sy-h4 block truncate">{category.label}</span>
          <span className="sy-small mt-0.5 block truncate">{category.note}</span>
        </span>
        <ChevronRight size={mobile ? 15 : 17} className="shrink-0 text-slate-600" />
      </button>
    </section>
  ) : null;

  const providerSection = (
    <section>
      <h3 className={mobile ? 'sy-h4 mb-1' : 'sy-h4 mb-2'}>Matching Providers</h3>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {matches.length > 0 ? matches.map((service, index) => (
          <button
            type="button"
            key={service.id}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onProvider(service)}
            className={`flex w-full items-center gap-3 text-left transition hover:bg-blue-50/50 ${mobile ? 'px-2.5 py-1.5' : 'px-3 py-2.5'} ${index ? 'border-t border-slate-100' : ''}`}
          >
            <img src={service.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/assets/vectors/no-results-map-illustration.png'; }} className={`shrink-0 rounded-lg bg-slate-100 object-cover ${mobile ? 'h-10 w-12' : 'h-12 w-14'}`} />
            <span className="min-w-0 flex-1">
              <span className="sy-h4 block truncate">{service.name}</span>
              <span className="sy-small mt-0.5 block truncate">{service.category}</span>
              <span className="sy-small mt-0.5 flex items-center gap-1 truncate"><MapPin size={12} /> Morong, Rizal</span>
            </span>
            <span className="sy-small sy-semibold shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{service.isOpen ? 'Open' : 'Closed'}</span>
            <span className="sy-small sy-semibold hidden shrink-0 items-center gap-1 sm:flex"><Clock3 size={13} /> {service.averageWaitMinutes} min wait</span>
            <ChevronRight size={mobile ? 15 : 17} className="shrink-0 text-slate-600" />
          </button>
        )) : (
          <div className="sy-small px-4 py-5 text-center">No matching providers in the Morong prototype dataset.</div>
        )}
      </div>
    </section>
  );

  const recentSection = recentSearches.length > 0 ? (
    <section>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="sy-h4">Recent Searches</h3>
      </div>
      <div className="overflow-hidden border-y border-slate-100 bg-white">
        {recentSearches.map((term) => (
          <button key={term} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onRecent(term)} className={`flex w-full items-center gap-3 border-b border-slate-100 text-left last:border-b-0 hover:bg-slate-50 ${mobile ? 'px-2 py-1' : 'px-3 py-2.5'}`}>
            <History size={mobile ? 15 : 17} className="shrink-0 text-slate-500" />
            <span className="sy-small flex-1">{term}</span>
            <ChevronRight size={mobile ? 14 : 16} className="text-slate-500" />
          </button>
        ))}
      </div>
      {!mobile ? <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={onClearRecent} className="sy-small sy-semibold ml-auto mt-2 flex items-center gap-1 text-blue-600"><Trash2 size={13} /> Clear Recent Searches</button> : null}
    </section>
  ) : null;

  const nearbySection = (
    <section>
      <h3 className={mobile ? 'sy-h4 mb-1' : 'sy-h4 mb-2'}>Nearby Suggestions</h3>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {nearbySearchSuggestions.map((suggestion, index) => (
          <button key={suggestion.title} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onSuggestion(suggestion)} className={`flex w-full items-center gap-3 text-left hover:bg-blue-50/40 ${mobile ? 'px-2.5 py-1' : 'px-3 py-2.5'} ${index ? 'border-t border-slate-100' : ''}`}>
            <Search size={mobile ? 15 : 17} className="shrink-0 text-slate-500" />
            <span className="min-w-0 flex-1">
              <span className="sy-small sy-semibold block">{suggestion.title}</span>
              <span className="sy-small mt-0.5 block truncate">{suggestion.note}</span>
            </span>
            <ChevronRight size={mobile ? 14 : 16} className="shrink-0 text-slate-500" />
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div className={`${mobile ? 'space-y-2 pb-1' : 'space-y-3 p-4'}`}>
      {categorySection}
      {providerSection}
      {mobile ? recentSection : nearbySection}
      {mobile ? nearbySection : recentSection}
    </div>
  );
}

function categoryMatches(service: ServiceSummary, category: string) {
  const value = service.category.toLowerCase();
  if (category === 'Government') return value.includes('government');
  if (category === 'Healthcare' || category === 'Clinics') return value.includes('health') || value.includes('clinic') || value.includes('hospital');
  if (category === 'Education') return value.includes('education');
  if (category === 'Pharmacy') return value.includes('pharmacy');
  if (category === 'Commerce') return value.includes('commerce');
  if (category === 'Food') return value.includes('food') || value.includes('market') || value.includes('restaurant');
  if (category === 'Banks') return value.includes('bank') || value.includes('financial');
  if (category === 'Utilities') return value.includes('utilit') || value.includes('water');
  return true;
}

function confidenceLabel(value: ServiceSummary['confidence']) {
  return value === 'High' ? 'High community confidence' : `${value} confidence`;
}

function scoreTone(score: number) {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 80) return 'bg-blue-600';
  return 'bg-amber-500';
}

function markerAssetFor(service: ServiceSummary, selected: boolean) {
  if (!service.isOpen) return '/assets/pinpoints/closed-unavailable-marker.png';

  const category = service.category.toLowerCase();
  if (category.includes('transportation')) {
    return selected ? '/assets/pinpoints/transportation-marker-selected.png' : '/assets/pinpoints/transportation-marker-default.png';
  }
  if (category.includes('health') || category.includes('clinic') || category.includes('hospital')) {
    return selected ? '/assets/pinpoints/clinic-marker-selected.png' : '/assets/pinpoints/clinic-marker-default.png';
  }
  if (category.includes('education')) {
    return selected ? '/assets/pinpoints/education-marker-selected.png' : '/assets/pinpoints/education-marker-default.png';
  }
  if (category.includes('pharmacy') || category.includes('commerce')) {
    return selected ? '/assets/pinpoints/commerce-marker-selected.png' : '/assets/pinpoints/commerce-marker-default.png';
  }
  if (category.includes('utilities') || category.includes('water')) {
    return selected ? '/assets/pinpoints/utilities-marker-selected.png' : '/assets/pinpoints/utilities-marker-default.png';
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
  if (category.includes('utilities') || category.includes('water')) return 'rgba(59,130,246,.52)';
  if (category.includes('government')) return 'rgba(0,102,255,.55)';
  return 'rgba(0,102,255,.50)';
}

function mapLabelFor(service: ServiceSummary) {
  const compactLabels: Record<string, string> = {
    'morong-municipal-hall': 'Morong Municipal Hall',
    'urs-morong-campus': 'URS Morong',
    'rizal-provincial-hospital-system-morong': 'Rizal Provincial Hospital',
    'morong-public-market': 'Morong Public Market',
    'savemore-market-morong': 'Savemore Morong',
  };
  return compactLabels[service.id] ?? service.name;
}

function ServiceCard({
  service,
  selected,
  saved,
  cardRef,
  onSelect,
  onToggleSave,
}: {
  service: ServiceSummary;
  selected: boolean;
  saved: boolean;
  cardRef?: (node: HTMLElement | null) => void;
  onSelect: (source: HTMLElement) => void;
  onToggleSave: (event: React.MouseEvent) => void;
}) {
  return (
    <article
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={(event) => onSelect(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(event.currentTarget);
        }
      }}
      className={`group min-h-[158px] cursor-pointer rounded-[14px] border bg-white p-[10px] transition duration-200 ${
        selected
          ? 'border-blue-500 shadow-[0_8px_24px_rgba(0,102,255,0.10)] ring-1 ring-blue-500/10'
          : 'border-slate-200/90 hover:border-blue-200 hover:shadow-sm'
      }`}
    >
      <div className="grid h-full grid-cols-[106px_minmax(0,1fr)] gap-3">
        <img
          src={service.image}
          alt=""
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/assets/vectors/no-results-map-illustration.png';
          }}
          className="h-[106px] w-[106px] self-start rounded-[12px] bg-slate-100 object-cover"
        />

        <div className="flex min-w-0 flex-col">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="sy-h4 min-w-0 flex-1 truncate">
                  {service.name}
                </h3>
                <span
                  className={`sy-small sy-semibold shrink-0 rounded-full px-2.5 py-1 ${
                    service.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {service.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="sy-small mt-0.5 truncate">{service.category}</p>
            </div>

            <button
              type="button"
              aria-label={saved ? `Remove ${service.name} from saved` : `Save ${service.name}`}
              onClick={onToggleSave}
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${saved ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              {saved ? <Bookmark size={18} strokeWidth={2} fill="currentColor" /> : <Bookmark size={18} strokeWidth={2} />}
            </button>
          </div>

          <div className="sy-small mt-1.5 flex min-w-0 items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-1.5 truncate">
              <MapPin size={13} className="shrink-0 text-slate-400" />
              <span className="truncate">{service.address}</span>
            </span>
            <span className="sy-semibold shrink-0 text-slate-700">{service.distanceKm.toFixed(1)} km</span>
          </div>
          <div className="mt-2.5 grid grid-cols-[1fr_1fr_auto] items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock3 size={19} className="text-blue-600" />
              <div className="leading-tight">
                <div className="sy-caption sy-semibold text-slate-900">{service.averageWaitMinutes} min</div>
                <div className="sy-small">avg. wait</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={19} className="text-blue-600" />
              <div className="leading-tight">
                <div className="sy-caption sy-semibold text-slate-900">{service.reliability}%</div>
                <div className="sy-small">reliability</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`sy-caption sy-bold grid h-8 min-w-9 place-items-center rounded-lg px-2 text-white ${scoreTone(service.score)}`}>
                {service.score}
              </span>
              <span className="sy-small leading-tight">TaymPers<br />Score</span>
            </div>
          </div>

          <div className="sy-small mt-auto grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg bg-slate-50/90 px-2.5 py-1.5">
            <span className="sy-semibold flex items-center gap-1.5 text-blue-600">
              <UsersRound size={14} />
              {confidenceLabel(service.confidence)}
            </span>
            <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
              <Lightbulb size={14} className="shrink-0 text-amber-500" />
              <span className="truncate">{service.insight}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptySearchState({
  query,
  mobile = false,
  onClear,
  onWiderArea,
  onCategory,
}: {
  query: string;
  mobile?: boolean;
  onClear: () => void;
  onWiderArea: () => void;
  onCategory: (category: string) => void;
}) {
  const actions = [
    { title: 'Clear filters', note: 'Remove current filters and show more results.', icon: RefreshCw, action: onClear },
    { title: 'Search a wider area', note: 'Try nearby locations or a different barangay.', icon: MapPin, action: onWiderArea },
    { title: 'Try another category', note: 'Explore related services or browse all categories.', icon: Grid2X2, action: () => onCategory('All') },
  ];

  return (
    <div className={mobile ? 'px-5 pb-2 pt-2' : 'flex h-full flex-col px-6 pb-5 pt-4'}>
      <div className={mobile ? 'text-center' : 'flex flex-1 flex-col items-center justify-center text-center'}>
        <img src="/assets/vectors/no-results-map-illustration.png" alt="" className={mobile ? 'mx-auto h-[88px] w-[170px] object-contain' : 'mx-auto h-[156px] w-[250px] object-contain'} />
        <h2 className={mobile ? 'sy-h3 mt-1' : 'sy-h2 mt-2'}>No matching services found<br />in this area.</h2>
        <p className={`${mobile ? 'sy-small' : 'sy-caption'} mx-auto mt-2 max-w-[440px] text-slate-500`}>We couldn’t find any services that match “{query}” near Morong, Rizal. Try adjusting your search or filters to see more results.</p>
      </div>

      <div className={mobile ? 'mt-2 space-y-1.5' : 'space-y-2'}>
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.title} type="button" onClick={item.action} className={mobile ? 'flex min-h-[48px] w-full items-center gap-2 rounded-lg bg-blue-50/70 px-2.5 py-1.5 text-left transition hover:bg-blue-50' : 'flex w-full items-center gap-3 rounded-xl bg-blue-50/70 px-3 py-2 text-left transition hover:bg-blue-50'}>
              <span className={mobile ? 'grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600' : 'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600'}><Icon size={mobile ? 17 : 20} /></span>
              <span className="min-w-0 flex-1"><span className="sy-small sy-semibold block text-slate-900">{item.title}</span><span className="sy-small block text-slate-500">{item.note}</span></span>
              <ChevronRight size={18} className="shrink-0 text-blue-600" />
            </button>
          );
        })}
      </div>

      <div className={mobile ? 'mt-1.5 border-t border-slate-200 pt-1.5' : 'mt-4 border-t border-slate-200 pt-4'}>
        <h3 className="sy-h4">Popular categories</h3>
        <p className="sy-small mt-0.5 text-slate-500">You can also browse these to discover other services.</p>
        <div className={mobile ? 'mt-1.5 grid grid-cols-3 gap-1.5' : 'mt-2 grid grid-cols-3 gap-2'}>
          {[
            ['Healthcare', HeartPulse],
            ['Government', Landmark],
            ['Education', GraduationCap],
          ].map(([label, Icon]) => (
            <button key={String(label)} type="button" onClick={() => onCategory(String(label))} className="sy-small sy-semibold flex h-10 items-center justify-center gap-1.5 rounded-full border border-blue-100 bg-white text-slate-800 shadow-sm">
              <Icon size={16} className="text-blue-600" /> {String(label)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileServiceFallbackCard({
  service,
  saved,
  onSelect,
  onToggleSave,
}: {
  service: ServiceSummary;
  saved: boolean;
  onSelect: () => void;
  onToggleSave: (event: React.MouseEvent) => void;
}) {
  return (
    <article onClick={onSelect} className="relative grid min-h-[104px] cursor-pointer grid-cols-[112px_minmax(0,1fr)] gap-2 rounded-xl border border-slate-200 bg-white p-2">
      <img src={service.image} alt="" className="h-[88px] w-[112px] rounded-lg object-cover" />
      <div className="min-w-0 pr-7">
        <h3 className="sy-small sy-semibold truncate text-slate-900">{service.name}</h3>
        <p className="sy-small mt-0.5 truncate text-slate-500">{service.category}</p>
        <div className="sy-small mt-1 flex items-center gap-2"><span className="sy-semibold rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Open</span><span className="truncate text-slate-500">8:00 AM – 5:00 PM</span></div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-slate-700">
          <span className="sy-small sy-semibold flex items-center gap-1"><Clock3 size={13} className="text-blue-600" /> {service.averageWaitMinutes} min</span>
          <span className="sy-small sy-semibold flex items-center gap-1"><ShieldCheck size={13} className="text-teal-600" /> {service.reliability}%</span>
          <span className="sy-small sy-semibold flex items-center gap-1"><Star size={13} fill="currentColor" className="text-indigo-600" /> {(service.score / 20).toFixed(1)}</span>
        </div>
      </div>
      <button type="button" aria-label={saved ? 'Remove saved service' : 'Save service'} onClick={onToggleSave} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-blue-600">{saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}</button>
    </article>
  );
}

function MapFailureState({
  mobile = false,
  onRetry,
  onUseList,
}: {
  mobile?: boolean;
  onRetry: () => void;
  onUseList: () => void;
}) {
  return (
    <div className={`flex h-full flex-col items-center justify-center text-center ${mobile ? 'rounded-xl bg-blue-50/40 px-5 py-4' : 'px-8 py-7'}`}>
      <div className={mobile ? 'relative grid h-[92px] w-[170px] place-items-center rounded-2xl bg-blue-50 text-blue-600' : 'relative grid h-[150px] w-[260px] place-items-center rounded-3xl bg-blue-50 text-blue-600'}>
        <MapIcon size={mobile ? 60 : 88} strokeWidth={1.5} />
        <span className="absolute grid h-10 w-10 place-items-center rounded-full bg-white text-blue-600 shadow-sm"><X size={22} strokeWidth={2.5} /></span>
      </div>
      <h2 className={mobile ? 'sy-h3 mt-1' : 'sy-h2 mt-3'}>Map unavailable right now</h2>
      <p className={`${mobile ? 'sy-small' : 'sy-caption'} mt-2 max-w-[520px] text-slate-500`}>You can still browse nearby services while we try to reconnect the map.</p>
      <div className={`mt-4 grid w-full max-w-[320px] gap-2 ${mobile ? '' : 'max-w-[360px]'}`}>
        <button type="button" onClick={onRetry} className="sy-small sy-semibold flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 text-white"><RefreshCw size={17} /> Retry Map</button>
        <button type="button" onClick={onUseList} className="sy-small sy-semibold flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white text-blue-600"><List size={17} /> Use Service List</button>
      </div>
      {!mobile ? (
        <div className="mt-8 w-full max-w-[650px] border-t border-slate-200 pt-5 text-left">
          <h3 className="sy-h4">You can still:</h3>
          <div className="mt-3 grid grid-cols-3 divide-x divide-slate-200">
            {[
              [Search, 'Search for services', 'Find what you need using the search bar.'],
              [SlidersHorizontal, 'Use filters', 'Narrow results by category, status, or distance.'],
              [List, 'Browse the list', 'All service information is still available.'],
            ].map(([Icon, title, note]) => (
              <div key={String(title)} className="px-5 text-center">
                <Icon size={27} className="mx-auto text-blue-600" />
                <div className="sy-small sy-semibold mt-2 text-slate-900">{String(title)}</div>
                <p className="sy-small mt-1 text-slate-500">{String(note)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ExplorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { providerId } = useParams();
  const isNoCommunityProfileRoute = Boolean(providerId) && new URLSearchParams(location.search).get('community') === 'empty';
  const [searchQuery, setSearchQuery] = useState(() => typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('q') ?? '') : '');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Government services', 'Pharmacy', 'Registrar', 'Health center']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Nearest');
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(['morong-municipal-hall']);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMapUnavailable, setIsMapUnavailable] = useState(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('map') === 'failed');
  const [mapStyle, setMapStyle] = useState<SerbisYOMapStyleMode>('serbisyo');
  const [isMapStyleMenuOpen, setIsMapStyleMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceSummary>(DEFAULT_SELECTED_SERVICE);
  const [isMapSelectionActive, setIsMapSelectionActive] = useState(true);
  const [contextPoiSelection, setContextPoiSelection] = useState<MorongRealMapPoi | null>(null);
  const [contextPreviewPosition, setContextPreviewPosition] = useState<{ left: number; top: number; ready: boolean }>({ left: 0, top: 0, ready: false });
  const [overlayService, setOverlayService] = useState<ServiceSummary | null>(null);
  const [isOverlayClosing, setIsOverlayClosing] = useState(false);
  const [isOverlayExpanded, setIsOverlayExpanded] = useState(false);
  const [isProfileContentReady, setIsProfileContentReady] = useState(false);
  const [isMapPaneAdjusted, setIsMapPaneAdjusted] = useState(false);
  const [isResizingProfilePane, setIsResizingProfilePane] = useState(false);
  const [profilePanePercent, setProfilePanePercent] = useState(61.5);
  const [mobileProfileOffset, setMobileProfileOffset] = useState(0);
  const [isMobileProfileDragging, setIsMobileProfileDragging] = useState(false);
  const [mapPreviewPosition, setMapPreviewPosition] = useState<{ left: number; top: number; placement: 'top' | 'right' | 'bottom' | 'left'; ready: boolean }>({ left: 0, top: 0, placement: 'top', ready: false });
  const [overlayMorphSource, setOverlayMorphSource] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    radius: number;
  } | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const nativePoiMarkersRef = useRef<L.LayerGroup | null>(null);
  const vectorPoiMarkersRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.Layer | null>(null);
  const serviceListPanelRef = useRef<HTMLElement>(null);
  const mapPreviewCardRef = useRef<HTMLDivElement>(null);
  const mobilePreviewSheetRef = useRef<HTMLElement>(null);
  const isResizingProfilePaneRef = useRef(false);
  const mobileProfileOffsetRef = useRef(0);
  const mobileProfileDragRef = useRef<{ startY: number; startOffset: number } | null>(null);

  useEffect(() => {
    const syncViewport = () => setIsMobileViewport(window.innerWidth < 1024);
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  useEffect(() => {
    const markMapUnavailable = () => setIsMapUnavailable(true);
    window.addEventListener('offline', markMapUnavailable);
    return () => window.removeEventListener('offline', markMapUnavailable);
  }, []);

  const filteredServices = useMemo(() => {
    let list = [...morongPrototypeServices];

    if (activeCategory === 'Open Now') list = list.filter((service) => service.isOpen);
    else if (activeCategory === 'Accessible') list = list.filter((service) => accessibleServiceIds.has(service.id));
    else if (activeCategory !== 'All') list = list.filter((service) => categoryMatches(service, activeCategory));

    if (appliedFilters) {
      if (appliedFilters.openNow) list = list.filter((service) => service.isOpen);
      if (appliedFilters.category !== 'All') list = list.filter((service) => categoryMatches(service, appliedFilters.category));
      if (appliedFilters.accessibility.length > 0) list = list.filter((service) => accessibleServiceIds.has(service.id));

      if (appliedFilters.maxWaitTime === 'Under 15 min') list = list.filter((service) => service.averageWaitMinutes < 15);
      else if (appliedFilters.maxWaitTime === 'Under 30 min') list = list.filter((service) => service.averageWaitMinutes < 30);
      else if (appliedFilters.maxWaitTime === 'Under 1 hour') list = list.filter((service) => service.averageWaitMinutes < 60);

      if (appliedFilters.minReliability === '80%+') list = list.filter((service) => service.reliability >= 80);
      else if (appliedFilters.minReliability === '90%+') list = list.filter((service) => service.reliability >= 90);

      if (appliedFilters.minConfidence === 'Moderate or higher') list = list.filter((service) => service.confidence !== 'Low');
      else if (appliedFilters.minConfidence === 'High confidence only') list = list.filter((service) => service.confidence === 'High');
    }

    const query = isSearchFocused ? '' : searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((service) => [service.name, service.category, service.address].some((value) => value.toLowerCase().includes(query)));
    }

    if (sortBy === 'Shortest Wait') list.sort((a, b) => a.averageWaitMinutes - b.averageWaitMinutes);
    else if (sortBy === 'Highest Reliability') list.sort((a, b) => b.reliability - a.reliability);
    else if (sortBy === 'Highest TaymPers Score') list.sort((a, b) => b.score - a.score);
    else list.sort((a, b) => a.distanceKm - b.distanceKm);

    return list;
  }, [activeCategory, appliedFilters, isSearchFocused, searchQuery, sortBy]);

  const hasEmptySearch = Boolean(searchQuery.trim()) && !isSearchFocused && filteredServices.length === 0;
  const contextualMapServices = useMemo(() => {
    if (!hasEmptySearch) return filteredServices;
    const contextIds = new Set(['morong-municipal-hall', 'morong-rural-health-unit', 'urs-morong-campus', 'mercury-drug-morong-t-claudio']);
    return morongPrototypeServices.filter((service) => contextIds.has(service.id));
  }, [filteredServices, hasEmptySearch]);
  const selectedCommunityReportCount = useMemo(() => getCommunityExperiences(selectedService.id).length, [selectedService.id]);
  const contextPoiType = useMemo(() => {
    if (!contextPoiSelection) return '';
    const raw = String(
      contextPoiSelection.tags.amenity
      ?? contextPoiSelection.tags.shop
      ?? contextPoiSelection.tags.tourism
      ?? contextPoiSelection.tags.leisure
      ?? contextPoiSelection.tags.subclass
      ?? contextPoiSelection.tags.class
      ?? contextPoiSelection.tags.type
      ?? 'Map place',
    );
    return raw.replaceAll('_', ' ').replace(/w/g, (letter) => letter.toUpperCase());
  }, [contextPoiSelection]);

  const matchingServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return morongPrototypeServices.slice(0, 2);
    return morongPrototypeServices
      .filter((service) => [service.name, service.category, service.address].some((value) => value.toLowerCase().includes(query)))
      .slice(0, 2);
  }, [searchQuery]);

  const commitSearchTerm = (term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    setRecentSearches((current) => [cleaned, ...current.filter((item) => item.toLowerCase() !== cleaned.toLowerCase())].slice(0, 6));
  };

  const selectSearchProvider = (service: ServiceSummary) => {
    mapToService(service);
    setSearchQuery(service.name);
    commitSearchTerm(service.name);
    setIsSearchFocused(false);
  };

  const selectSearchCategory = (category: string) => {
    setAppliedFilters(null);
    setActiveCategory(category);
    setSortBy('Nearest');
    setSearchQuery('');
    commitSearchTerm(category === 'Healthcare' ? 'Clinic / Healthcare' : category);
    setIsSearchFocused(false);
  };

  const selectSearchSuggestion = (suggestion: NearbySearchSuggestion) => {
    setAppliedFilters(null);
    setSearchQuery(suggestion.query);
    if (suggestion.category === 'Open Now') {
      setActiveCategory('Open Now');
      setSortBy('Nearest');
    } else if (suggestion.category === 'Accessible') {
      setActiveCategory('Accessible');
      setSortBy('Nearest');
    } else {
      setActiveCategory('Healthcare');
      setSortBy(suggestion.sort ?? 'Nearest');
    }
    commitSearchTerm(suggestion.title);
    setIsSearchFocused(false);
  };

  const selectRecentSearch = (term: string) => {
    setSearchQuery(term);
    commitSearchTerm(term);
    setIsSearchFocused(false);
  };

  const mapToService = (service: ServiceSummary) => {
    setSelectedService(service);
    setIsMapSelectionActive(true);
    setContextPoiSelection(null);
    const map = mapInstanceRef.current;
    if (map) {
      map.panTo(service.coords, { animate: true, duration: 0.35 });
    }
  };

  const openServiceOverlay = (service: ServiceSummary, source?: HTMLElement | null) => {
    const canonicalSource = isMobileViewport
      ? (mobilePreviewSheetRef.current ?? source)
      : (serviceListPanelRef.current ?? mapPreviewCardRef.current ?? source);

    if (canonicalSource) {
      const rect = canonicalSource.getBoundingClientRect();
      const radius = Number.parseFloat(window.getComputedStyle(canonicalSource).borderRadius) || 18;
      setOverlayMorphSource({ left: rect.left, top: rect.top, width: rect.width, height: rect.height, radius });
    } else {
      setOverlayMorphSource(null);
    }
    setIsOverlayClosing(false);
    setIsOverlayExpanded(false);
    setIsProfileContentReady(false);
    setIsMapPaneAdjusted(false);
    mobileProfileOffsetRef.current = 0;
    setMobileProfileOffset(0);
    setIsMobileProfileDragging(false);
    setOverlayService(service);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsOverlayExpanded(true));
    });
    window.setTimeout(() => setIsProfileContentReady(true), 390);
    window.setTimeout(() => setIsMapPaneAdjusted(true), 430);
  };

  const switchOpenServiceOverlay = (service: ServiceSummary) => {
    if (!overlayService || isOverlayClosing) {
      mapToService(service);
      return;
    }
    setSelectedService(service);
    setIsMapSelectionActive(true);
    setContextPoiSelection(null);
    setIsProfileContentReady(false);
    mapInstanceRef.current?.stop();
    setOverlayService(service);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsProfileContentReady(true));
    });
  };

  const closeServiceOverlay = () => {
    if (!overlayService || isOverlayClosing) return;
    setIsOverlayClosing(true);
    mobileProfileOffsetRef.current = 0;
    setMobileProfileOffset(0);
    setIsMobileProfileDragging(false);
    window.setTimeout(() => {
      setIsOverlayExpanded(false);
      setIsMapPaneAdjusted(false);
    }, 150);
    window.setTimeout(() => {
      setOverlayService(null);
      setIsOverlayClosing(false);
      setOverlayMorphSource(null);
      if (providerId) navigate('/explore', { replace: true });
    }, 560);
  };

  const handleServicePreviewClick = (service: ServiceSummary, source: HTMLElement) => {
    if (selectedService.id === service.id && isMapSelectionActive) {
      openServiceOverlay(service);
      return;
    }
    mapToService(service);
  };

  const overlayPanelStyle = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const mobile = isMobileViewport;
    const backdropLeft = mobile ? 0 : 12;
    const backdropTop = mobile ? (isNoCommunityProfileRoute ? 68 : 192) : 140;
    const targetTop = mobile ? (isNoCommunityProfileRoute ? 0 : 116) : 0;
    const contentWidth = Math.max(1, window.innerWidth - (mobile ? 0 : 24));
    const targetWidth = mobile ? contentWidth : contentWidth * (profilePanePercent / 100);
    const backdropHeight = Math.max(1, window.innerHeight - backdropTop - (mobile ? 76 : 12));
    const mobileOffset = mobile ? mobileProfileOffset : 0;
    const targetHeight = mobile ? Math.max(180, backdropHeight - targetTop - mobileOffset) : backdropHeight;

    if (!overlayMorphSource || isOverlayExpanded) {
      return {
        left: 0,
        top: targetTop + mobileOffset,
        width: targetWidth,
        height: targetHeight,
        borderRadius: mobile ? 24 : 18,
      } as React.CSSProperties;
    }

    return {
      left: overlayMorphSource.left - backdropLeft,
      top: overlayMorphSource.top - backdropTop,
      width: overlayMorphSource.width,
      height: overlayMorphSource.height,
      borderRadius: overlayMorphSource.radius,
    } as React.CSSProperties;
  }, [isMobileViewport, isNoCommunityProfileRoute, isOverlayExpanded, mobileProfileOffset, overlayMorphSource, profilePanePercent]);

  const mobileProfileMinimizedOffset = () => {
    if (typeof window === 'undefined') return 200;
    return Math.min(260, Math.max(150, window.innerHeight * 0.22));
  };

  const updateMobileProfileOffset = (next: number) => {
    mobileProfileOffsetRef.current = next;
    setMobileProfileOffset(next);
  };

  const finishMobileProfileDrag = () => {
    const current = mobileProfileOffsetRef.current;
    const minimized = mobileProfileMinimizedOffset();
    mobileProfileDragRef.current = null;
    setIsMobileProfileDragging(false);
    if (current > minimized + 72) {
      closeServiceOverlay();
      return;
    }
    updateMobileProfileOffset(current > minimized * 0.42 ? minimized : 0);
  };

  const resizeProfilePane = (clientX: number) => {
    if (typeof window === 'undefined') return;
    const contentLeft = 12;
    const contentWidth = Math.max(1, window.innerWidth - 24);
    const next = ((clientX - contentLeft) / contentWidth) * 100;
    setProfilePanePercent(Math.min(72, Math.max(61.5, next)));
  };

  useEffect(() => {
    if (!providerId) return;
    const service = morongPrototypeServices.find((candidate) => candidate.id === providerId)
      ?? (providerId === 'morong-health-center'
        ? morongPrototypeServices.find((candidate) => candidate.id === 'morong-rural-health-unit')
        : undefined);
    if (!service) {
      navigate('/explore', { replace: true });
      return;
    }
    setSelectedService(service);
    openServiceOverlay(service);
  }, [providerId]);

  useEffect(() => {
    if (!overlayService) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeServiceOverlay();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlayService, isOverlayClosing]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const container = mapContainerRef.current;
    if (!map || !container) return;
    let frame = 0;

    const syncMapGeometry = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const currentMap = mapInstanceRef.current;
        if (!currentMap) return;
        if (overlayService) currentMap.stop();
        currentMap.invalidateSize({ pan: false, animate: false });
        if (overlayService) {
          currentMap.setView(overlayService.coords, currentMap.getZoom(), { animate: false });
        }
      });
    };

    const observer = new ResizeObserver(syncMapGeometry);
    observer.observe(container);
    syncMapGeometry();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [overlayService?.id, isMapPaneAdjusted, isOverlayClosing, isMobileViewport]);

  const toggleSave = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  useEffect(() => {
    if (!mapContainerRef.current || isMapUnavailable || mapInstanceRef.current) return;

    try {
      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: true,
        zoomSnap: 0.25,
      });

      map.attributionControl.setPrefix(false);

      mapInstanceRef.current = map;
      if (window.innerWidth < 1024) {
        map.setView([14.52, 121.252], 14);
      } else {
        map.setView([14.522, 121.255], 14);
      }

      L.control.scale({ imperial: false, maxWidth: 115, position: 'bottomright' }).addTo(map);
      markersGroupRef.current = L.layerGroup().addTo(map);
      nativePoiMarkersRef.current = L.layerGroup().addTo(map);
      vectorPoiMarkersRef.current = L.layerGroup().addTo(map);
    } catch (error) {
      console.warn('Map initialization deferred:', error);
      setIsMapUnavailable(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // Leaflet can already be disposed during hot reload.
        }
      }
      mapInstanceRef.current = null;
      markersGroupRef.current = null;
      nativePoiMarkersRef.current = null;
      vectorPoiMarkersRef.current = null;
      tileLayerRef.current = null;
    };
  }, [isMapUnavailable]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    let cancelled = false;
    let vectorMap: any = null;
    let syncVectorPois: (() => void) | null = null;
    const attribution = 'OpenFreeMap © OpenMapTiles · Data from OpenStreetMap';

    const loadVectorBasemap = async () => {
      try {
        if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
        nativePoiMarkersRef.current?.clearLayers();

        if (mapStyle === 'satellite') {
          tileLayerRef.current = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
              attribution: 'Tiles © Esri',
              maxZoom: 19,
            },
          ).addTo(map);
          return;
        }

        const style = await loadSerbisYOExploreStyle(mapStyle);
        if (cancelled || !mapInstanceRef.current) return;

        const vectorLayer = maplibreGL({
          style,
          attributionControl: false,
          interactive: false,
          maxZoom: 19,
        }).addTo(map);

        tileLayerRef.current = vectorLayer;
        map.attributionControl.addAttribution(attribution);
        vectorMap = (vectorLayer as any).getMaplibreMap?.() ?? null;

        syncVectorPois = () => {
          const group = vectorPoiMarkersRef.current;
          if (!group || !vectorMap?.isStyleLoaded?.()) return;
          let features: any[] = [];
          try {
            features = vectorMap.querySourceFeatures('openmaptiles', { sourceLayer: 'poi' }) ?? [];
          } catch {
            return;
          }
          group.clearLayers();
          const seen = new Set<string>();
          let rendered = 0;
          for (const feature of features) {
            if (rendered >= 120 || feature?.geometry?.type !== 'Point') continue;
            const name = String(feature.properties?.name_en ?? feature.properties?.name ?? '').trim();
            const coordinates = feature.geometry.coordinates as [number, number];
            if (!name || !Array.isArray(coordinates) || coordinates.length < 2) continue;
            const coords: [number, number] = [Number(coordinates[1]), Number(coordinates[0])];
            if (!Number.isFinite(coords[0]) || !Number.isFinite(coords[1])) continue;
            const key = `${name.toLowerCase()}|${coords[0].toFixed(5)}|${coords[1].toFixed(5)}`;
            if (seen.has(key)) continue;
            seen.add(key);

            const nearPrototype = morongPrototypeServices.some((service) => {
              const dLat = service.coords[0] - coords[0];
              const dLng = service.coords[1] - coords[1];
              return dLat * dLat + dLng * dLng < 0.00000009;
            });
            if (nearPrototype) continue;

            const poi: MorongRealMapPoi = {
              id: `vector-poi-${feature.id ?? key}`,
              name,
              coords,
              tags: feature.properties ?? {},
            };
            const src = nativePoiPinAsset(poi.tags);
            const icon = L.divIcon({
              className: 'serbisyo-native-poi-marker serbisyo-native-poi-marker-live',
              html: `<img src="${src}" alt="" style="width:22px;height:22px;display:block;object-fit:contain;opacity:.66;filter:grayscale(.16) drop-shadow(0 2px 3px rgba(15,23,42,.12));" />`,
              iconSize: [22, 22],
              iconAnchor: [11, 20],
            });
            const marker = L.marker(coords, { icon, interactive: true, keyboard: true, zIndexOffset: -280 }).addTo(group);
            marker.bindTooltip(name, { direction: 'top', offset: [0, -16], className: 'serbisyo-map-tooltip' });
            marker.on('click', () => {
              setContextPoiSelection(poi);
              setIsMapSelectionActive(false);
            });
            rendered += 1;
          }
        };
        vectorMap?.on?.('idle', syncVectorPois);
        map.on('moveend zoomend', syncVectorPois);
        window.setTimeout(() => syncVectorPois?.(), 300);
      } catch (error) {
        console.warn('Vector basemap unavailable; using raster OpenStreetMap fallback.', error);
        if (cancelled || !mapInstanceRef.current) return;

        if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);
      }
    };

    void loadVectorBasemap();

    return () => {
      cancelled = true;
      if (syncVectorPois) {
        vectorMap?.off?.('idle', syncVectorPois);
        map.off('moveend zoomend', syncVectorPois);
      }
      map.attributionControl.removeAttribution(attribution);
    };
  }, [mapStyle, isMapUnavailable]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = nativePoiMarkersRef.current;
    if (!map || !group || isMapUnavailable) return;
    let cancelled = false;

    const render = async () => {
      const pois = await loadMorongRealMapPois();
      if (cancelled || !nativePoiMarkersRef.current) return;
      group.clearLayers();
      for (const poi of pois) {
        const nearPrototype = morongPrototypeServices.some((service) => {
          const dLat = service.coords[0] - poi.coords[0];
          const dLng = service.coords[1] - poi.coords[1];
          return dLat * dLat + dLng * dLng < 0.00000009;
        });
        if (nearPrototype) continue;
        const src = nativePoiPinAsset(poi.tags);
        const icon = L.divIcon({
          className: 'serbisyo-native-poi-marker',
          html: `<img src="${src}" alt="" style="width:26px;height:26px;display:block;object-fit:contain;opacity:.72;filter:grayscale(.18) drop-shadow(0 2px 3px rgba(15,23,42,.14));pointer-events:none;" />`,
          iconSize: [26, 26],
          iconAnchor: [13, 24],
        });
        const marker = L.marker(poi.coords, { icon, interactive: true, keyboard: true, zIndexOffset: -250 }).addTo(group);
        marker.bindTooltip(poi.name, { direction: 'top', offset: [0, -16], className: 'serbisyo-map-tooltip' });
        marker.on('click', () => {
          setContextPoiSelection(poi);
          setIsMapSelectionActive(false);
        });
      }
    };

    void render();
    return () => {
      cancelled = true;
      group.clearLayers();
    };
  }, [isMapUnavailable]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !contextPoiSelection || isMobileViewport) {
      setContextPreviewPosition((current) => current.ready ? { ...current, ready: false } : current);
      return;
    }
    const update = () => {
      const point = map.latLngToContainerPoint(contextPoiSelection.coords);
      const mapSize = map.getSize();
      const width = 386;
      const height = 126;
      const margin = 18;
      const preferRight = point.x + 34 + width <= mapSize.x - margin;
      const left = preferRight ? point.x + 28 : point.x - width - 28;
      const top = point.y - height / 2 - 10;
      setContextPreviewPosition({
        left: Math.min(mapSize.x - width - margin, Math.max(margin, left)),
        top: Math.min(mapSize.y - height - margin, Math.max(margin, top)),
        ready: true,
      });
    };
    update();
    map.on('move zoom resize', update);
    return () => {
      map.off('move zoom resize', update);
    };
  }, [contextPoiSelection, isMobileViewport]);

  useEffect(() => {
    const markerGroup = markersGroupRef.current;
    if (!markerGroup) return;

    markerGroup.clearLayers();

    contextualMapServices.forEach((service) => {
      const selected = isMapSelectionActive && service.id === selectedService?.id;
      const pinSrc = markerAssetFor(service, selected);

      const size = selected ? 60 : 44;
      const glow = selected ? markerGlowFor(service) : 'transparent';
      const icon = L.divIcon({
        className: 'serbisyo-leaflet-marker',
        html: `<span style="position:relative;width:${size}px;height:${size}px;display:block;"><span style="position:absolute;left:50%;top:55%;width:${selected ? size * 1.25 : 0}px;height:${selected ? size * 1.25 : 0}px;transform:translate(-50%,-50%);border-radius:999px;background:${glow};filter:blur(${selected ? 12 : 0}px);opacity:${selected ? .7 : 0};"></span><img src="${pinSrc}" alt="" style="position:relative;width:${size}px;height:${size}px;display:block;object-fit:contain;filter:drop-shadow(0 3px 5px rgba(15,23,42,.18)) ${selected ? `drop-shadow(0 0 9px ${glow})` : ''};" /></span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });

      const marker = L.marker(service.coords, { icon, zIndexOffset: selected ? 1000 : 0 }).addTo(markerGroup);
      const tooltipDirection = service.id === 'rizal-provincial-hospital-system-morong' ? 'top' : 'right';
      marker.bindTooltip(mapLabelFor(service), {
        direction: tooltipDirection,
        offset: tooltipDirection === 'top' ? [0, -12] : [12, -20],
        className: 'serbisyo-map-tooltip',
        permanent: isMobileViewport && (
          selected
          || service.id === 'urs-morong-campus'
        ),
      });
      marker.on('click', () => {
        if (selected) {
          setIsMapSelectionActive(false);
          if (overlayService) closeServiceOverlay();
          return;
        }
        if (overlayService) {
          switchOpenServiceOverlay(service);
          return;
        }
        mapToService(service);
      });
    });
  }, [contextualMapServices, selectedService, isMobileViewport, isMapSelectionActive, overlayService, isOverlayClosing]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || isMobileViewport || !selectedService) return;

    const update = () => {
      const card = mapPreviewCardRef.current;
      const point = map.latLngToContainerPoint(selectedService.coords);
      const mapSize = map.getSize();
      const cardWidth = card?.offsetWidth || 520;
      const cardHeight = card?.offsetHeight || 205;
      const anchorX = point.x;
      const anchorY = point.y - 30;
      const gap = 26;
      const margin = 18;
      const candidates = [
        { placement: 'top' as const, left: anchorX - cardWidth / 2, top: anchorY - cardHeight - gap },
        { placement: 'right' as const, left: anchorX + gap + 22, top: anchorY - cardHeight / 2 },
        { placement: 'left' as const, left: anchorX - cardWidth - gap - 22, top: anchorY - cardHeight / 2 },
        { placement: 'bottom' as const, left: anchorX - cardWidth / 2, top: anchorY + gap + 28 },
      ];
      const fitting = candidates.find((candidate) => (
        candidate.left >= margin
        && candidate.top >= margin
        && candidate.left + cardWidth <= mapSize.x - margin
        && candidate.top + cardHeight <= mapSize.y - margin
      )) ?? candidates[0];
      setMapPreviewPosition({
        left: Math.min(mapSize.x - cardWidth - margin, Math.max(margin, fitting.left)),
        top: Math.min(mapSize.y - cardHeight - margin, Math.max(margin, fitting.top)),
        placement: fitting.placement,
        ready: true,
      });
    };

    const frame = window.requestAnimationFrame(update);
    map.on('move zoom resize', update);
    window.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(frame);
      map.off('move zoom resize', update);
      window.removeEventListener('resize', update);
    };
  }, [selectedService, isMobileViewport, overlayService]);

  const fitVisibleServices = () => {
    const map = mapInstanceRef.current;
    if (!map || filteredServices.length === 0) return;
    const bounds = L.latLngBounds(filteredServices.map((service) => service.coords));
    map.fitBounds(bounds, { padding: [70, 70], maxZoom: 14 });
  };

  const selectDecisionChip = (id: string) => {
    setAppliedFilters(null);
    if (id === 'Shortest Wait' || id === 'Highest Reliability') {
      setSortBy(id);
      setActiveCategory('All');
      return;
    }
    if (id === 'Accessible') {
      setActiveCategory('Accessible');
      return;
    }
    setActiveCategory(id);
  };

  const currentDecisionActive = (id: string) => {
    if (id === 'Shortest Wait' || id === 'Highest Reliability') return sortBy === id;
    return activeCategory === id;
  };

  return (
    <div className="sy-bg-page relative h-screen w-full overflow-hidden font-sans text-slate-900">
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        resultCount={morongPrototypeServices.length}
        onApply={(filters) => {
          setAppliedFilters(filters);
          setSortBy(filters.sortBy);
          setActiveCategory('All');
        }}
      />

      <header className={`absolute z-[1000] lg:hidden ${isSearchFocused
        ? 'left-3 right-[52px] top-2 rounded-[22px] border border-slate-200/80 bg-white/98 px-3 pb-3 pt-3 shadow-[0_14px_40px_rgba(15,23,42,.16)] backdrop-blur-xl'
        : 'inset-x-0 top-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.94)_42%,rgba(255,255,255,0.82)_62%,rgba(255,255,255,0.56)_78%,rgba(255,255,255,0.24)_90%,rgba(255,255,255,0)_100%)] px-4 pb-7 pt-3 backdrop-blur-[1px]'
      }`}>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => navigate('/explore')} className="flex min-w-0 items-center">
            <TaymPersBrand className="h-[34px] w-auto max-w-[146px] object-contain max-[390px]:max-w-[118px]" />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="sy-small sy-semibold flex h-10 items-center gap-1.5 rounded-2xl border border-white/80 bg-white/92 px-3 text-slate-900 shadow-[0_5px_18px_rgba(15,23,42,.10)] backdrop-blur max-[390px]:px-2">
              <MapPin size={15} className="text-blue-600" />
              <span>Morong, Rizal</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            <button type="button" aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/92 text-slate-900 shadow-[0_5px_18px_rgba(15,23,42,.10)] backdrop-blur">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <AccountMenu />
          </div>
        </div>

        {!isNoCommunityProfileRoute ? (
          <>
        <div className="relative mt-3">
          <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 180)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                commitSearchTerm(searchQuery);
                setIsSearchFocused(false);
                event.currentTarget.blur();
              } else if (event.key === 'Escape') {
                setIsSearchFocused(false);
                event.currentTarget.blur();
              }
            }}
            placeholder="Search services"
            className={`h-12 w-full rounded-2xl bg-white/94 pl-12 pr-14 text-[15px] font-normal text-slate-900 outline-none placeholder:text-slate-400 ${isSearchFocused ? 'border border-blue-500 shadow-none ring-2 ring-blue-500/10' : 'border border-white/80 shadow-[0_5px_18px_rgba(15,23,42,.10)] focus:ring-4 focus:ring-blue-500/10'}`}
          />
          {isSearchFocused || searchQuery ? (
            <button
              type="button"
              aria-label="Clear search"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          ) : (
            <button type="button" aria-label="Open filters" onClick={() => setIsFilterModalOpen(true)} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl bg-slate-100/90 text-slate-900">
              <SlidersHorizontal size={18} />
            </button>
          )}
        </div>

        {isSearchFocused ? (
          <div className="mt-2 max-h-[515px] overflow-y-auto pr-0.5 [scrollbar-width:thin]">
            <SearchAutocompletePanel
              query={searchQuery}
              matches={matchingServices}
              recentSearches={recentSearches}
              mobile
              onProvider={selectSearchProvider}
              onCategory={selectSearchCategory}
              onSuggestion={selectSearchSuggestion}
              onRecent={selectRecentSearch}
              onClearRecent={() => setRecentSearches([])}
            />
          </div>
        ) : isMapUnavailable ? (
          <div className="mt-2 grid grid-cols-[1fr_1fr_1fr_1fr_40px] gap-1.5">
            {[
              ['Near me', Navigation],
              ['Category', ChevronDown],
              ['Open now', ChevronDown],
              ['Sort by', ChevronDown],
            ].map(([label, Icon], index) => (
              <button key={String(label)} type="button" className={index === 0 ? 'sy-small sy-semibold flex h-9 min-w-0 items-center justify-center gap-1 rounded-lg border border-blue-500 bg-white px-1.5 text-blue-600' : 'sy-small sy-semibold flex h-9 min-w-0 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 text-slate-700'}>
                <Icon size={13} className={index === 0 ? 'text-blue-600' : 'text-slate-500'} />
                <span className="truncate">{String(label)}</span>
              </button>
            ))}
            <button type="button" aria-label="Open filters" onClick={() => setIsFilterModalOpen(true)} className="grid h-9 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-blue-600"><SlidersHorizontal size={16} /></button>
          </div>
        ) : hasEmptySearch ? null : <div className="mt-3 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mobileCategoryChips.map((chip) => {
            const Icon = chip.icon;
            const active = chip.id === 'Open Now' || chip.id === 'Accessible'
              ? currentDecisionActive(chip.id)
              : activeCategory === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  if (chip.id === 'Open Now' || chip.id === 'Accessible') selectDecisionChip(chip.id);
                  else {
                    setAppliedFilters(null);
                    setActiveCategory(chip.id);
                  }
                }}
                className={`sy-small sy-semibold flex h-9 shrink-0 items-center gap-1 rounded-xl px-1.5 shadow-sm ${active ? 'bg-blue-600 text-white' : 'border border-white/80 bg-white/94 text-slate-900'}`}
              >
                <Icon size={14} className={active ? 'text-white' : chip.id === 'Healthcare' ? 'text-rose-500' : chip.id === 'Government' ? 'text-emerald-600' : 'text-blue-600'} />
                {chip.label}
              </button>
            );
          })}
        </div>}
          </>
        ) : null}
      </header>

      <header className="absolute inset-x-3 top-3 z-[1000] hidden rounded-[20px] border border-slate-200/80 bg-white/97 px-9 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.10)] backdrop-blur-xl lg:block">
        <div className="flex items-center gap-8 max-[1500px]:gap-[22px]">
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="flex w-[174px] shrink-0 items-center rounded-xl text-left"
          >
            <TaymPersBrand className="h-[40px] w-auto max-w-[166px] object-contain" />
          </button>

          <div className={`relative w-full flex-1 transition-[max-width,margin] duration-200 ${isSearchFocused ? 'ml-[clamp(0px,8vw,120px)] max-w-[580px]' : 'max-w-[min(735px,48vw)]'}`}>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 160)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  commitSearchTerm(searchQuery);
                  setIsSearchFocused(false);
                  event.currentTarget.blur();
                } else if (event.key === 'Escape') {
                  setIsSearchFocused(false);
                  event.currentTarget.blur();
                }
              }}
              placeholder="Search a service or place..."
              className="h-11 w-full rounded-full border border-slate-200 bg-slate-100 pl-11 pr-10 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            )}

            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[calc(100vh-96px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,.18)] [scrollbar-width:thin]">
                <SearchAutocompletePanel
                  query={searchQuery}
                  matches={matchingServices}
                  recentSearches={recentSearches}
                  onProvider={selectSearchProvider}
                  onCategory={selectSearchCategory}
                  onSuggestion={selectSearchSuggestion}
                  onRecent={selectRecentSearch}
                  onClearRecent={() => setRecentSearches([])}
                />
              </div>
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <button type="button" className="hidden h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 shadow-sm md:flex">
              <MapPin size={17} className="text-blue-600" />
              <span>Morong, Rizal</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            <button type="button" aria-label="Notifications" className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
              <Bell size={18} />
              <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <AccountMenu size="lg" />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-2 max-[1500px]:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryChips.map((chip) => {
            const Icon = chip.icon;
            const active = activeCategory === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setAppliedFilters(null);
                  setActiveCategory(chip.id);
                  if (chip.id !== 'All') setSortBy('Nearest');
                }}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-xl px-[15px] text-[13px] font-semibold transition max-[1500px]:h-[38px] max-[1500px]:px-3 max-[1500px]:text-[12px] ${
                  active ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} className={active ? 'text-white' : chip.iconClass} />
                {chip.label}
              </button>
            );
          })}

          <div className="mx-1 h-7 w-px shrink-0 bg-slate-200" />

          {decisionChips.map((chip) => {
            const Icon = chip.icon;
            const active = currentDecisionActive(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => selectDecisionChip(chip.id)}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-xl border px-[15px] text-[13px] font-semibold transition max-[1500px]:h-[38px] max-[1500px]:px-3 max-[1500px]:text-[12px] ${
                  active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-500'} />
                {chip.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="ml-auto hidden h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 min-[1680px]:flex"
          >
            <SlidersHorizontal size={16} /> More filters
          </button>
        </div>
      </header>

      <div className="absolute inset-x-0 bottom-[78px] top-0 lg:inset-x-3 lg:bottom-3 lg:top-[140px]">
        <section
          style={isMapPaneAdjusted && overlayService && !isMobileViewport ? { left: `${profilePanePercent}%` } : undefined}
          className={`explore-map-shell absolute inset-0 overflow-hidden border-0 bg-slate-100 shadow-none lg:left-[clamp(490px,34.9vw,536px)] lg:rounded-[18px] lg:rounded-l-none lg:border lg:border-slate-200 lg:shadow-[0_12px_32px_rgba(15,23,42,0.10)] ${isResizingProfilePane ? 'transition-none' : 'transition-[left] duration-[220ms] ease-[cubic-bezier(.2,.82,.2,1)]'}`}
        >
          {isMapUnavailable ? (
            <div className="absolute inset-0 z-10 hidden bg-slate-50 lg:block">
              <MapFailureState
                onRetry={() => setIsMapUnavailable(false)}
                onUseList={() => document.querySelector<HTMLElement>('[data-service-list] article')?.focus()}
              />
            </div>
          ) : (
            <div ref={mapContainerRef} className="explore-map absolute inset-0" />
          )}

          {!isMapUnavailable && (
            <>
              <div className="absolute right-4 top-3 z-[600] hidden items-start gap-2.5 lg:flex">
                <button type="button" onClick={fitVisibleServices} className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-4.5 text-[13px] font-semibold text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,.12)] backdrop-blur hover:bg-white">
                  <Search size={16} className="text-blue-600" /> Search this area
                </button>
                <div className="grid gap-2">
                  <div className="relative">
                    <button type="button" aria-label="Change map style" title="Choose map style" onClick={() => setIsMapStyleMenuOpen((open) => !open)} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white/95 text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,.12)] hover:text-blue-600">
                      <img src="/assets/icons/layers-map.png" alt="" className="h-6 w-6 object-contain" />
                    </button>
                    {isMapStyleMenuOpen ? (
                      <div className="absolute right-14 top-0 z-[710] w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_14px_36px_rgba(15,23,42,.18)]">
                        {([
                          ['serbisyo', 'TaymPers', 'Calm community map'],
                          ['liberty', 'Streets', 'Detailed street map'],
                          ['satellite', 'Satellite', 'Aerial imagery'],
                        ] as const).map(([id, label, note]) => (
                          <button key={id} type="button" onClick={() => { setMapStyle(id); setIsMapStyleMenuOpen(false); }} className={`w-full rounded-lg px-3 py-2 text-left transition ${mapStyle === id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                            <span className="sy-small sy-semibold block text-slate-900">{label}</span>
                            <span className="sy-small block">{note}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <button type="button" aria-label="Center on Morong" title="Center on Morong" onClick={() => mapInstanceRef.current?.setView([morongPrototypeZone.center.lat, morongPrototypeZone.center.lng], 14, { animate: true })} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white/95 text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,.12)] hover:text-blue-600">
                    <img src="/assets/icons/locate-crosshair.png" alt="" className="h-6 w-6 object-contain" />
                  </button>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-[0_6px_18px_rgba(15,23,42,.12)]">
                    <button type="button" aria-label="Zoom in" onClick={() => mapInstanceRef.current?.zoomIn()} className="grid h-11 w-11 place-items-center text-slate-700 hover:bg-slate-50 hover:text-blue-600">
                      <Plus size={20} />
                    </button>
                    <div className="h-px bg-slate-200" />
                    <button type="button" aria-label="Zoom out" onClick={() => mapInstanceRef.current?.zoomOut()} className="grid h-11 w-11 place-items-center text-slate-700 hover:bg-slate-50 hover:text-blue-600">
                      <Minus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {isSearchFocused ? (
                <>
                  <div className="absolute right-2 top-[120px] z-[650] grid gap-2 lg:hidden">
                    <div className="relative">
                      <button type="button" aria-label="Change map style" onMouseDown={(event) => event.preventDefault()} onClick={() => setIsMapStyleMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/96 shadow-[0_6px_18px_rgba(15,23,42,.14)]">
                        <img src="/assets/icons/layers-map.png" alt="" className="h-6 w-6 object-contain" />
                      </button>
                      {isMapStyleMenuOpen ? (
                        <div className="absolute right-12 top-0 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                          {([
                            ['serbisyo', 'TaymPers'],
                            ['liberty', 'Streets'],
                            ['satellite', 'Satellite'],
                          ] as const).map(([id, label]) => (
                            <button key={id} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setMapStyle(id); setIsMapStyleMenuOpen(false); }} className={`sy-small sy-semibold w-full rounded-lg px-2.5 py-2 text-left ${mapStyle === id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}>{label}</button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <button type="button" aria-label="Center on Morong" onMouseDown={(event) => event.preventDefault()} onClick={() => mapInstanceRef.current?.setView([morongPrototypeZone.center.lat, morongPrototypeZone.center.lng], 14, { animate: true })} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/96 shadow-[0_6px_18px_rgba(15,23,42,.14)]">
                      <img src="/assets/icons/locate-crosshair.png" alt="" className="h-6 w-6 object-contain" />
                    </button>
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/96 shadow-[0_6px_18px_rgba(15,23,42,.14)]">
                      <button type="button" aria-label="Zoom in" onMouseDown={(event) => event.preventDefault()} onClick={() => mapInstanceRef.current?.zoomIn()} className="grid h-10 w-10 place-items-center text-slate-700"><Plus size={18} /></button>
                      <div className="h-px bg-slate-200" />
                      <button type="button" aria-label="Zoom out" onMouseDown={(event) => event.preventDefault()} onClick={() => mapInstanceRef.current?.zoomOut()} className="grid h-10 w-10 place-items-center text-slate-700"><Minus size={18} /></button>
                    </div>
                  </div>
                  <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => mapInstanceRef.current?.setView([morongPrototypeZone.center.lat, morongPrototypeZone.center.lng], 15, { animate: true })} className="sy-small sy-semibold absolute bottom-[18px] left-3 z-[650] flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/96 px-4 text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,.14)] lg:hidden">
                    <Crosshair size={15} className="text-blue-600" /> My Location
                  </button>
                </>
              ) : null}

              <div
                ref={mapPreviewCardRef}
                role="button"
                tabIndex={0}
                style={hasEmptySearch || !isMapSelectionActive
                  ? { display: 'none' }
                  : mapPreviewPosition.ready
                    ? { left: mapPreviewPosition.left, top: mapPreviewPosition.top }
                    : { opacity: 0 }}
                onClick={(event) => openServiceOverlay(selectedService, event.currentTarget)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openServiceOverlay(selectedService, event.currentTarget);
                  }
                }}
                className={`absolute z-[550] hidden w-[520px] cursor-pointer rounded-[20px] border border-slate-200 bg-white p-3.5 shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-[opacity,transform,box-shadow] duration-200 hover:shadow-[0_20px_44px_rgba(15,23,42,0.22)] xl:block ${overlayService || hasEmptySearch ? 'pointer-events-none scale-[.98] opacity-0' : 'opacity-100'}`}
              >
                <div className="flex gap-3">
                  <img src={selectedService.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/assets/vectors/no-results-map-illustration.png'; }} className="h-[108px] w-[132px] shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="sy-h4 truncate pr-1">{selectedService.name}</h3>
                        <p className="sy-small mt-0.5 truncate">{selectedService.category}</p>
                        <p className="sy-small mt-1 flex items-center gap-1.5 whitespace-nowrap">
                          <span className="sy-semibold text-emerald-600">{selectedService.isOpen ? 'Open' : 'Closed'}</span>
                          <span>•</span>
                          <span>{selectedService.closesIn ?? 'Hours vary'}</span>
                        </p>
                      </div>
                      <button type="button" onClick={(event) => toggleSave(selectedService.id, event)} className={`grid h-8 w-8 place-items-center rounded-lg ${savedIds.includes(selectedService.id) ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}>
                        {savedIds.includes(selectedService.id) ? <Bookmark size={18} fill="currentColor" /> : <Bookmark size={18} />}
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-slate-50 px-2 py-2">
                        <div className="sy-h4 sy-bold flex items-center gap-1.5 text-blue-700"><Clock3 size={17} className="text-blue-600" /> {selectedService.averageWaitMinutes} min</div>
                        <div className="sy-small mt-0.5">avg. wait</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-2 py-2">
                        <div className="sy-h4 sy-bold flex items-center gap-1.5 text-blue-700"><ShieldCheck size={17} className="text-blue-600" /> {selectedService.reliability}%</div>
                        <div className="sy-small mt-0.5">reliability</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-2 py-2">
                        <div className="flex items-center gap-1.5"><span className={`sy-h4 sy-bold grid h-7 min-w-9 place-items-center rounded-md px-1.5 text-white ${scoreTone(selectedService.score)}`}>{selectedService.score}</span></div>
                        <div className="sy-small mt-0.5">TaymPers Score</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sy-small mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
                  <span className="flex min-w-0 items-center gap-2 text-slate-700">
                    <span className="flex shrink-0 -space-x-2">
                      {[1, 2, 3].map((avatar) => (
                        <img key={avatar} src={`/assets/avatars/community-avatar-placeholder-${avatar}.png`} alt="" className="h-6 w-6 rounded-full border-2 border-white object-cover" />
                      ))}
                    </span>
                    <span className="truncate">{selectedService.insight}</span>
                  </span>
                  <span className="shrink-0 text-slate-400">{selectedCommunityReportCount} reports</span>
                </div>
                <span
                  className={`absolute h-4 w-4 rotate-45 bg-white ${mapPreviewPosition.placement === 'top'
                    ? '-bottom-2 left-1/2 -translate-x-1/2 border-b border-r border-slate-200'
                    : mapPreviewPosition.placement === 'bottom'
                      ? '-top-2 left-1/2 -translate-x-1/2 border-l border-t border-slate-200'
                      : mapPreviewPosition.placement === 'left'
                        ? '-right-2 top-1/2 -translate-y-1/2 border-r border-t border-slate-200'
                        : '-left-2 top-1/2 -translate-y-1/2 border-b border-l border-slate-200'}`}
                />
              </div>

              {contextPoiSelection && contextPreviewPosition.ready ? (
                <div
                  style={{ left: contextPreviewPosition.left, top: contextPreviewPosition.top }}
                  className="absolute z-[548] hidden w-[386px] grid-cols-[92px_minmax(0,1fr)] gap-3 rounded-[18px] border border-slate-200 bg-white p-3 shadow-[0_16px_38px_rgba(15,23,42,.16)] xl:grid"
                >
                  <div className="grid h-[92px] w-[92px] place-items-center overflow-hidden rounded-xl bg-slate-50">
                    <img src="/assets/vectors/no-results-map-illustration.png" alt="" className="h-[74px] w-[74px] object-contain opacity-75" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="sy-h4 truncate">{contextPoiSelection.name}</h3>
                        <p className="sy-small mt-0.5 text-slate-500">{contextPoiType || 'Map place'}</p>
                      </div>
                      <button type="button" aria-label="Close map place details" onClick={() => setContextPoiSelection(null)} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={15} /></button>
                    </div>
                    <div className="sy-small sy-semibold mt-3 rounded-lg bg-slate-50 px-2.5 py-2 text-slate-600">Map place · No TaymPers community data yet</div>
                    <p className="sy-small mt-2 text-slate-400">Basic map context only. Full profiles are available for verified prototype providers.</p>
                  </div>
                </div>
              ) : null}

              <button type="button" aria-label="Center on Morong" onClick={() => mapInstanceRef.current?.setView([morongPrototypeZone.center.lat, morongPrototypeZone.center.lng], 14, { animate: true })} className={`absolute bottom-[238px] right-4 z-[600] h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,.16)] lg:hidden ${isSearchFocused ? 'hidden' : 'grid'}`}>
                <img src="/assets/icons/locate-crosshair.png" alt="" className="h-7 w-7 object-contain" />
              </button>
            </>
          )}
        </section>

        <aside ref={serviceListPanelRef} data-service-list className={`absolute z-20 hidden flex-col overflow-hidden border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.10)] transition duration-200 lg:inset-y-0 lg:left-0 lg:flex lg:h-auto lg:w-[clamp(490px,34.9vw,536px)] lg:rounded-l-[18px] lg:rounded-r-none ${overlayService && !isOverlayClosing ? 'pointer-events-none -translate-x-3 opacity-0' : 'translate-x-0 opacity-100'}`}>
          <div className="flex h-[68px] shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5">
            <div className="min-w-0 flex-1">
              <h1 className="sy-h2 whitespace-nowrap">Nearby Services</h1>
              <p className="sy-small mt-0.5 truncate">Showing {filteredServices.length} services around Morong, Rizal</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <label className="sr-only" htmlFor="explore-sort-services">Sort services</label>
                <select id="explore-sort-services" aria-label="Sort services" value={sortBy} onChange={(event) => { setAppliedFilters(null); setSortBy(event.target.value); }} className="sy-small sy-semibold h-10 w-[142px] rounded-xl border border-slate-200 bg-white px-3 text-slate-700 outline-none hover:bg-slate-50">
                  <option>Nearest</option>
                  <option>Shortest Wait</option>
                  <option>Highest Reliability</option>
                  <option>Highest TaymPers Score</option>
                </select>
              <button type="button" aria-label="Open filters and sorting" onClick={() => setIsFilterModalOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-blue-600 hover:bg-blue-50">
                <SlidersHorizontal size={17} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3.5 pb-3.5 pt-0 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={isMapSelectionActive && selectedService?.id === service.id}
                saved={savedIds.includes(service.id)}
                onSelect={(source) => handleServicePreviewClick(service, source)}
                onToggleSave={(event) => toggleSave(service.id, event)}
              />
            ))}
            {filteredServices.length === 0 && (
              <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <div>
                  <Search size={28} className="mx-auto text-blue-500" />
                  <h2 className="sy-h4 mt-3">No matching services</h2>
                  <p className="sy-small mt-1">Try another category or clear the current search.</p>
                  <button type="button" onClick={() => { setSearchQuery(''); setAppliedFilters(null); setActiveCategory('All'); setSortBy('Nearest'); }} className="sy-small sy-semibold mt-4 rounded-lg bg-blue-600 px-3 py-2 text-white">Clear filters</button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {hasEmptySearch ? (
          <aside className="absolute inset-y-0 left-0 z-30 hidden w-[clamp(490px,34.9vw,536px)] flex-col overflow-hidden rounded-l-[18px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,.10)] lg:flex">
            <div className="shrink-0 border-b border-slate-100 bg-white px-5 py-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="sy-caption h-11 w-full rounded-xl bg-slate-100 pl-11 pr-10 outline-none" />
                <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"><X size={17} /></button>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  ['Near me', Navigation],
                  ['Category', ChevronDown],
                  ['Open now', ChevronDown],
                  ['Sort by', ChevronDown],
                ].map(([label, Icon], index) => (
                  <button key={String(label)} type="button" className={index === 0 ? 'sy-small sy-semibold flex h-10 items-center justify-center gap-1 rounded-xl border border-blue-500 text-blue-600' : 'sy-small sy-semibold flex h-10 items-center justify-center gap-1 rounded-xl border border-slate-200 text-slate-700'}><Icon size={14} /> {String(label)}</button>
                ))}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
              <EmptySearchState
                query={searchQuery}
                onClear={() => { setSearchQuery(''); setAppliedFilters(null); setActiveCategory('All'); setSortBy('Nearest'); }}
                onWiderArea={() => { setSearchQuery(''); setAppliedFilters(null); setActiveCategory('All'); }}
                onCategory={(category) => { setSearchQuery(''); setAppliedFilters(null); setActiveCategory(category); setSortBy('Nearest'); }}
              />
            </div>
          </aside>
        ) : null}
      </div>

      {hasEmptySearch && !isMapUnavailable ? (
        <section className="absolute inset-x-0 bottom-[76px] top-[340px] z-[820] overflow-y-auto rounded-t-[28px] border-t border-slate-200 bg-white shadow-[0_-12px_34px_rgba(15,23,42,.12)] lg:hidden [scrollbar-width:thin]">
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-slate-300" />
          <EmptySearchState
            query={searchQuery}
            mobile
            onClear={() => { setSearchQuery(''); setAppliedFilters(null); setActiveCategory('All'); setSortBy('Nearest'); }}
            onWiderArea={() => { setSearchQuery(''); setAppliedFilters(null); setActiveCategory('All'); }}
            onCategory={(category) => { setSearchQuery(''); setAppliedFilters(null); setActiveCategory(category); setSortBy('Nearest'); }}
          />
        </section>
      ) : null}

      {isMapUnavailable ? (
        <section className="absolute inset-x-3 bottom-[76px] top-[160px] z-[820] overflow-y-auto lg:hidden [scrollbar-width:thin]">
          <div className="h-[238px]">
            <MapFailureState
              mobile
              onRetry={() => setIsMapUnavailable(false)}
              onUseList={() => document.getElementById('mobile-map-failure-list')?.scrollIntoView({ behavior: 'smooth' })}
            />
          </div>
          <div id="mobile-map-failure-list" className="mt-2 rounded-t-[22px] border border-slate-200 bg-white px-2 pb-3 pt-3 shadow-sm">
            <div className="sy-small sy-semibold mb-2 px-1">{filteredServices.length} services found for “{searchQuery || 'nearby'}”</div>
            <div className="space-y-2">
              {filteredServices.slice(0, 6).map((service) => (
                <MobileServiceFallbackCard
                  key={service.id}
                  service={service}
                  saved={savedIds.includes(service.id)}
                  onSelect={() => mapToService(service)}
                  onToggleSave={(event) => toggleSave(service.id, event)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {contextPoiSelection ? (
        <section className="absolute inset-x-4 bottom-[92px] z-[805] grid grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_12px_34px_rgba(15,23,42,.16)] lg:hidden">
          <div className="grid h-[76px] w-[76px] place-items-center rounded-xl bg-slate-50">
            <img src="/assets/vectors/no-results-map-illustration.png" alt="" className="h-16 w-16 object-contain opacity-75" />
          </div>
          <div className="min-w-0">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1"><h3 className="sy-h4 truncate">{contextPoiSelection.name}</h3><p className="sy-small mt-0.5 text-slate-500">{contextPoiType || 'Map place'}</p></div>
              <button type="button" aria-label="Close map place details" onClick={() => setContextPoiSelection(null)} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-500"><X size={15} /></button>
            </div>
            <p className="sy-small mt-2 text-slate-500">No TaymPers community data yet.</p>
          </div>
        </section>
      ) : null}

      <section ref={mobilePreviewSheetRef} onClick={(event) => openServiceOverlay(selectedService, event.currentTarget)} className={`absolute inset-x-0 bottom-[76px] z-[800] cursor-pointer rounded-t-[28px] border-t border-slate-200 bg-white px-5 pb-4 pt-3 shadow-[0_-12px_34px_rgba(15,23,42,.12)] transition duration-200 lg:hidden ${overlayService || isSearchFocused || hasEmptySearch || isMapUnavailable || !isMapSelectionActive ? 'pointer-events-none translate-y-5 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-300" />
        <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-4">
          <img src={selectedService.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/assets/vectors/no-results-map-illustration.png'; }} className="h-[110px] w-[110px] rounded-2xl bg-slate-100 object-cover" />
          <div className="min-w-0">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="sy-h3 max-h-[48px] overflow-hidden">{selectedService.name}</h2>
                  <span className={`sy-small sy-semibold shrink-0 rounded-full px-2.5 py-1 ${selectedService.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {selectedService.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <p className="sy-small sy-semibold mt-0.5 truncate">{selectedService.category} · {selectedService.distanceKm.toFixed(1)} km</p>
              </div>
              <button type="button" aria-label={`Open ${selectedService.name}`} onClick={(event) => { event.stopPropagation(); openServiceOverlay(selectedService, mobilePreviewSheetRef.current); }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100">
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200">
              <div className="pr-3">
                <div className="sy-h4 flex items-center gap-1.5"><Clock3 size={21} className="text-blue-600" /> {selectedService.averageWaitMinutes} min</div>
                <div className="sy-small ml-7 mt-0.5">avg. wait</div>
              </div>
              <div className="px-3">
                <div className="sy-h4 flex items-center gap-1.5"><ShieldCheck size={21} className="text-blue-600" /> {selectedService.reliability}%</div>
                <div className="sy-small ml-7 mt-0.5">reliability</div>
              </div>
              <div className="pl-3">
                <div className="flex items-center gap-2">
                  <span className={`sy-caption sy-bold grid h-8 min-w-9 place-items-center rounded-lg px-2 text-white ${scoreTone(selectedService.score)}`}>{selectedService.score}</span>
                  <span className="sy-small leading-tight">TaymPers<br />Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sy-small mt-3 grid grid-cols-[auto_1fr] items-center gap-3 rounded-xl bg-amber-50 px-3 py-2.5">
          <span className="sy-semibold flex items-center gap-1.5 text-slate-900"><UsersRound size={18} className="text-blue-600" /> {confidenceLabel(selectedService.confidence)}</span>
          <span className="flex min-w-0 items-center gap-1.5 border-l border-amber-200 pl-3 text-slate-600"><Lightbulb size={17} className="shrink-0 text-amber-500" /><span className="truncate">{selectedService.insight}</span></span>
        </div>
      </section>

      <nav className="absolute inset-x-0 bottom-0 z-[1000] grid h-[76px] grid-cols-4 border-t border-slate-200 bg-white px-4 shadow-[0_-4px_18px_rgba(15,23,42,.06)] lg:hidden">
        <button type="button" onClick={() => navigate('/explore')} className="relative flex flex-col items-center justify-center gap-1 text-blue-600">
          <MapIcon size={23} strokeWidth={2.3} />
          <span className="sy-small sy-semibold">Explore</span>
          <span className="absolute bottom-1.5 h-1 w-7 rounded-full bg-blue-600" />
        </button>
        <button type="button" onClick={() => navigate('/contribute')} className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <Plus size={24} />
          <span className="sy-small sy-semibold">Contribute</span>
        </button>
        <button type="button" onClick={() => navigate('/saved')} className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <Bookmark size={22} />
          <span className="sy-small sy-semibold">Saved</span>
        </button>
        <button type="button" onClick={() => navigate('/profile')} className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <UserRound size={23} />
          <span className="sy-small sy-semibold">Profile</span>
        </button>
      </nav>

      {overlayService ? (
        <div
          style={isMobileViewport && isNoCommunityProfileRoute ? { top: 68 } : undefined}
          className={`service-profile-overlay-backdrop pointer-events-none absolute inset-x-0 bottom-[76px] top-[192px] z-[850] p-0 lg:inset-x-3 lg:bottom-3 lg:top-[140px] lg:rounded-[18px] ${isOverlayClosing ? 'is-closing' : ''}`}
        >
          <button
            type="button"
            aria-label="Collapse service profile"
            title="Collapse service profile"
            onClick={closeServiceOverlay}
            style={!isMobileViewport ? { left: `${profilePanePercent}%` } : undefined}
            className={`service-profile-edge-collapse absolute left-0 top-1/2 z-[990] flex h-14 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-slate-200 bg-white/95 text-blue-700 shadow-[0_8px_24px_rgba(15,23,42,.14)] backdrop-blur transition hover:w-10 hover:bg-white max-lg:left-auto max-lg:right-0 max-lg:translate-x-0 max-lg:rounded-l-2xl max-lg:rounded-r-none ${isMapPaneAdjusted ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          {!isMobileViewport && isMapPaneAdjusted ? (
            <div
              role="separator"
              aria-label="Resize service profile information panel"
              aria-orientation="vertical"
              aria-valuemin={61.5}
              aria-valuemax={72}
              aria-valuenow={Math.round(profilePanePercent)}
              onPointerDown={(event) => {
                isResizingProfilePaneRef.current = true;
                setIsResizingProfilePane(true);
                event.currentTarget.setPointerCapture(event.pointerId);
                resizeProfilePane(event.clientX);
              }}
              onPointerMove={(event) => {
                if (isResizingProfilePaneRef.current) resizeProfilePane(event.clientX);
              }}
              onPointerUp={(event) => {
                isResizingProfilePaneRef.current = false;
                setIsResizingProfilePane(false);
                if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={() => {
                isResizingProfilePaneRef.current = false;
                setIsResizingProfilePane(false);
              }}
              className="pointer-events-auto absolute bottom-0 top-0 z-[980] hidden w-4 -translate-x-1/2 cursor-col-resize touch-none items-center justify-center lg:flex"
              style={{ left: `${profilePanePercent}%` }}
            >
              <span className="h-16 w-1 rounded-full bg-slate-300/80 shadow-sm transition hover:bg-blue-400" />
            </div>
          ) : null}

          <div
            style={overlayPanelStyle}
            className={`service-profile-overlay-panel service-profile-info-panel pointer-events-auto absolute overflow-hidden bg-white shadow-[0_24px_70px_rgba(15,23,42,.24)] ${isOverlayClosing ? 'is-closing' : ''} ${isMobileProfileDragging || isResizingProfilePane ? 'transition-none' : 'transition-[left,top,width,height,border-radius] duration-[360ms] ease-[cubic-bezier(.2,.82,.2,1)]'}`}
          >
            {isMobileViewport ? (
              <button
                type="button"
                aria-label="Drag service profile to minimize or close"
                title="Drag to minimize or close"
                onPointerDown={(event) => {
                  mobileProfileDragRef.current = { startY: event.clientY, startOffset: mobileProfileOffsetRef.current };
                  setIsMobileProfileDragging(true);
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  const drag = mobileProfileDragRef.current;
                  if (!drag) return;
                  const maxOffset = mobileProfileMinimizedOffset() + 130;
                  updateMobileProfileOffset(Math.min(maxOffset, Math.max(0, drag.startOffset + event.clientY - drag.startY)));
                }}
                onPointerUp={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                  finishMobileProfileDrag();
                }}
                onPointerCancel={() => {
                  mobileProfileDragRef.current = null;
                  setIsMobileProfileDragging(false);
                  updateMobileProfileOffset(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    updateMobileProfileOffset(mobileProfileOffsetRef.current > 0 ? 0 : mobileProfileMinimizedOffset());
                  }
                }}
                className="absolute inset-x-0 top-0 z-[1000] flex h-8 touch-none cursor-ns-resize items-start justify-center bg-gradient-to-b from-white via-white/95 to-transparent pt-2 lg:hidden"
              >
                <span className="h-1.5 w-14 rounded-full bg-slate-300 shadow-sm" />
              </button>
            ) : null}
            <div className={`service-profile-content-stage absolute inset-0 ${isProfileContentReady || !overlayMorphSource ? 'is-ready' : 'pointer-events-none'} ${isOverlayClosing ? 'is-closing' : ''}`}>
              <ServiceProfilePage
                providerIdOverride={overlayService.id}
                overlay
                externalMap
                onViewOnMap={() => mapInstanceRef.current?.flyTo(overlayService.coords, 16, { animate: true, duration: 0.35 })}
                onClose={closeServiceOverlay}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
