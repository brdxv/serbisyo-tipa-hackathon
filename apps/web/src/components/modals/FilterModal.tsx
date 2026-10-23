import React, { useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  BarChart3,
  Building2,
  GraduationCap,
  HeartPulse,
  Landmark,
  PersonStanding,
  Pill,
  SlidersHorizontal,
  Store,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';
import type { FilterOptions, ServiceCategory } from '../../types/service';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  resultCount?: number;
}

const categories: { name: ServiceCategory; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { name: 'Government', label: 'Government', icon: Building2 },
  { name: 'Clinics', label: 'Clinics', icon: HeartPulse },
  { name: 'Food', label: 'Food', icon: Store },
  { name: 'Banks', label: 'Banks', icon: Landmark },
  { name: 'Education', label: 'Education', icon: GraduationCap },
  { name: 'Pharmacy', label: 'Pharmacy', icon: Pill },
  { name: 'Utilities', label: 'Utilities', icon: Zap },
];

const accessibilityOptions = [
  { label: 'PWD accessible', icon: Accessibility },
  { label: 'Wheelchair accessible', icon: Accessibility },
  { label: 'Priority lane', icon: UsersRound },
  { label: 'Accessible restroom', icon: PersonStanding },
];

const sortOptions: { id: FilterOptions['sortBy']; label: string; desc: string }[] = [
  { id: 'Nearest', label: 'Nearest', desc: 'Closest to your location' },
  { id: 'Shortest Wait', label: 'Shortest Wait', desc: 'Least waiting time' },
  { id: 'Highest Reliability', label: 'Highest Reliability', desc: 'Most consistent service' },
  { id: 'Highest TaymPers Score', label: 'Highest TaymPers Score', desc: 'Best overall rating' },
  { id: 'Most Community Data', label: 'Most Community Data', desc: 'More recent community reports' },
];

export function FilterModal({ isOpen, onClose, onApply, resultCount = 15 }: FilterModalProps) {
  const [openNow, setOpenNow] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Clinics');
  const [accessibility, setAccessibility] = useState<string[]>(['PWD accessible']);
  const [waitTime, setWaitTime] = useState('Under 15 min');
  const [reliability, setReliability] = useState('90%+');
  const [confidence, setConfidence] = useState('Moderate or higher');
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('Nearest');

  if (!isOpen) return null;

  const toggleAccessibility = (item: string) => {
    setAccessibility((previous) => (
      previous.includes(item)
        ? previous.filter((value) => value !== item)
        : [...previous, item]
    ));
  };

  const handleReset = () => {
    setOpenNow(false);
    setSelectedCategory('All');
    setAccessibility([]);
    setWaitTime('Any');
    setReliability('Any');
    setConfidence('Any');
    setSortBy('Nearest');
  };

  const apply = () => {
    onApply({
      openNow,
      category: selectedCategory,
      accessibility,
      maxWaitTime: waitTime,
      minReliability: reliability,
      minConfidence: confidence,
      sortBy,
    });
    onClose();
  };

  const selectionButton = (active: boolean) => (
    active
      ? 'border-blue-600 bg-blue-50 text-blue-700'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[940] lg:z-[950]">
      <button type="button" aria-label="Close filters" onClick={onClose} className="pointer-events-auto absolute inset-0 bg-transparent" />

      <section className="pointer-events-auto absolute bottom-[76px] left-[38px] right-[38px] top-[232px] flex flex-col overflow-hidden rounded-t-[28px] border border-slate-200 bg-white shadow-[0_-14px_42px_rgba(15,23,42,.16)] lg:bottom-[116px] lg:left-[clamp(390px,26.2vw,405px)] lg:right-auto lg:top-[140px] lg:w-[728px] lg:rounded-[18px] lg:shadow-[0_20px_55px_rgba(15,23,42,.18)]">
        <div className="relative shrink-0 border-b border-slate-100 px-5 pb-3 pt-5 lg:px-5 lg:pb-3 lg:pt-4">
          <span className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-slate-300 lg:hidden" />
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <SlidersHorizontal size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="sy-h3">Filters &amp; Sorting</h2>
              <p className="sy-small mt-0.5 text-slate-500">Refine results to find the right services for you.</p>
            </div>
            <button type="button" onClick={handleReset} className="sy-small sy-semibold rounded-lg border border-slate-200 bg-white px-3 py-2 text-blue-600 lg:hidden">Reset</button>
            <button type="button" onClick={onClose} aria-label="Close filters" className="hidden h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 lg:grid">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[1.28fr_.84fr] lg:overflow-hidden">
          <div className="space-y-3 px-5 py-3 lg:overflow-y-auto lg:border-r lg:border-slate-100 lg:pr-4 [scrollbar-width:thin]">
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5">
              <button
                type="button"
                role="switch"
                aria-checked={openNow}
                onClick={() => setOpenNow((value) => !value)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${openNow ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${openNow ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <div>
                <div className="sy-small sy-semibold text-emerald-700">Open now</div>
                <div className="sy-small text-slate-500">Show only services currently operating.</div>
              </div>
            </div>

            <div>
              <h3 className="sy-small sy-semibold mb-2 text-slate-900">Service Category</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const active = selectedCategory === category.name;
                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => setSelectedCategory(category.name)}
                      className={`sy-small sy-semibold flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-2 transition ${selectionButton(active)}`}
                    >
                      <Icon size={15} className={active ? 'text-blue-600' : 'text-slate-500'} />
                      <span className="truncate">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="sy-small sy-semibold mb-2 text-slate-900">Accessibility</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {accessibilityOptions.map((item) => {
                  const active = accessibility.includes(item.label);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleAccessibility(item.label)}
                      className={`sy-small sy-semibold flex min-h-9 items-center gap-2 rounded-lg border px-3 text-left transition ${selectionButton(active)}`}
                    >
                      <Icon size={15} className={active ? 'text-blue-600' : 'text-slate-500'} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="sy-small sy-semibold mb-2 text-slate-900">Waiting Time</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {['Any', 'Under 15 min', 'Under 30 min', 'Under 1 hour'].map((value) => (
                  <button key={value} type="button" onClick={() => setWaitTime(value)} className={`sy-small sy-semibold min-h-9 rounded-lg border px-2 ${selectionButton(waitTime === value)}`}>{value}</button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="sy-small sy-semibold mb-2 text-slate-900">Reliability</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {['Any', '80%+', '90%+', 'Highest reliability'].map((value) => (
                  <button key={value} type="button" onClick={() => setReliability(value)} className={`sy-small sy-semibold min-h-9 rounded-lg border px-2 ${selectionButton(reliability === value)}`}>{value}</button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="sy-small sy-semibold mb-2 text-slate-900">Community Confidence</h3>
              <div className="grid grid-cols-[.65fr_1.3fr_1.15fr] gap-1.5">
                {['Any', 'Moderate or higher', 'High confidence only'].map((value) => (
                  <button key={value} type="button" onClick={() => setConfidence(value)} className={`sy-small sy-semibold min-h-9 rounded-lg border px-2 ${selectionButton(confidence === value)}`}>{value}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-5 py-3 lg:overflow-y-auto lg:border-t-0 lg:px-4 [scrollbar-width:thin]">
            <h3 className="sy-h4 mb-2 flex items-center gap-2"><SlidersHorizontal size={16} className="text-blue-600" /> Sort By</h3>
            <div className="divide-y divide-slate-100">
              {sortOptions.map((option) => {
                const active = sortBy === option.id;
                return (
                  <button key={option.id} type="button" onClick={() => setSortBy(option.id)} className={`flex w-full items-start gap-3 px-2 py-2.5 text-left transition ${active ? 'rounded-xl bg-blue-50' : 'hover:bg-slate-50'}`}>
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? 'border-blue-600' : 'border-slate-400'}`}>
                      {active ? <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
                    </span>
                    <span>
                      <span className="sy-small sy-semibold block text-slate-900">{option.label}</span>
                      <span className="sy-small block text-slate-500">{option.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <footer className="shrink-0 border-t border-slate-100 bg-white px-5 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <BarChart3 size={24} className="shrink-0 text-blue-600" />
              <div className="min-w-0">
                <div className="sy-small sy-semibold text-slate-900">{resultCount} services match</div>
                <div className="sy-small truncate text-slate-500">Based on your selected filters</div>
              </div>
            </div>
            <button type="button" onClick={handleReset} className="sy-small sy-semibold hidden h-10 min-w-24 rounded-xl border border-slate-200 bg-white px-4 text-blue-600 hover:bg-slate-50 lg:block">Reset</button>
            <button type="button" onClick={apply} className="sy-small sy-semibold flex h-10 min-w-[178px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-white shadow-[0_8px_20px_rgba(0,102,255,.18)] hover:bg-blue-700">
              Show {resultCount} Services <ArrowRight size={15} />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
