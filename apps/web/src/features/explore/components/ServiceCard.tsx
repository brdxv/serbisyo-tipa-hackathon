import type { ServiceSummary } from '../../../types/service';

interface ServiceCardProps {
  service: ServiceSummary;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950">{service.name}</h2>
          <p className="text-sm text-slate-500">{service.category}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          {service.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">{service.address}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Metric label="Avg. wait" value={`${service.averageWaitMinutes} min`} />
        <Metric label="Reliability" value={`${service.reliability}%`} />
        <Metric label="Score" value={String(service.score)} />
      </div>
      <p className="mt-3 text-sm text-slate-600">{service.insight}</p>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-semibold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
