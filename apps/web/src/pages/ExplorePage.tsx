import { ServiceCard } from '../features/explore/components/ServiceCard';
import { ServiceMapPlaceholder } from '../features/explore/components/ServiceMapPlaceholder';
import type { ServiceSummary } from '../types/service';

const demoServices: ServiceSummary[] = [
  {
    id: 'morong-health-center',
    name: 'Morong Community Health Center',
    category: 'Clinic / Healthcare',
    address: 'Poblacion, Morong, Rizal',
    isOpen: true,
    averageWaitMinutes: 24,
    reliability: 91,
    score: 87,
    insight: 'Usually quieter after 3 PM.',
  },
  {
    id: 'bayanihan-pharmacy',
    name: 'Bayanihan Pharmacy',
    category: 'Pharmacy',
    address: 'Morong, Rizal',
    isOpen: true,
    averageWaitMinutes: 12,
    reliability: 96,
    score: 88,
    insight: 'Fast service and complete supplies.',
  },
];

export function ExplorePage() {
  return (
    <div className="grid gap-3 p-3 pb-20 lg:grid-cols-[36%_64%] lg:gap-0 lg:p-0">
      <aside className="space-y-3 lg:max-h-[calc(100vh-65px)] lg:overflow-y-auto lg:border-r lg:border-slate-200 lg:bg-white lg:p-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nearby Services</h1>
          <p className="text-sm text-slate-500">Services around Morong, Rizal</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Government', 'Clinics', 'Open Now', 'Shortest Wait'].map((filter) => (
            <button key={filter} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">
              {filter}
            </button>
          ))}
        </div>
        {demoServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </aside>
      <ServiceMapPlaceholder />
    </div>
  );
}
