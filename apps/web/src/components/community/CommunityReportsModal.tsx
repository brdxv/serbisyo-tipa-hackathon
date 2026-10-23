import React, { useMemo, useState } from 'react';
import { Clock3, FileCheck2, TimerReset, UserRound, X } from 'lucide-react';
import { formatReportDate, formatReportTime, ratingLabel, type CommunityExperience } from '../../data/communityExperiences';

export function CommunityReportsModal({
  open,
  onClose,
  serviceName,
  reports,
  heading = 'Community Reports',
}: {
  open: boolean;
  onClose: () => void;
  serviceName: string;
  reports: CommunityExperience[];
  heading?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => reports.find((item) => item.id === selectedId) ?? reports[0], [reports, selectedId]);
  if (!open || !selected) return null;

  return (
    <div className="fixed inset-0 z-[1600] grid place-items-end bg-slate-950/30 backdrop-blur-[2px] lg:place-items-center" onMouseDown={onClose}>
      <section onMouseDown={(event) => event.stopPropagation()} className="flex h-[82vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl lg:h-[680px] lg:w-[880px] lg:rounded-[22px]">
        <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 lg:px-5">
          <div className="min-w-0 flex-1"><h2 className="sy-h3">{heading}</h2><p className="sy-small mt-0.5 truncate text-slate-500">{serviceName} · {reports.length} reports available</p></div>
          <button type="button" aria-label="Close reports" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600"><X size={18} /></button>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[330px_minmax(0,1fr)]">
          <div className="max-h-[39%] overflow-y-auto border-b border-slate-200 p-2 [scrollbar-width:thin] lg:max-h-none lg:border-b-0 lg:border-r">
            {reports.map((report) => (
              <button key={report.id} type="button" onClick={() => setSelectedId(report.id)} className={`mb-1.5 w-full rounded-xl border p-3 text-left transition ${selected.id === report.id ? 'border-blue-300 bg-blue-50' : 'border-slate-100 bg-white hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-2"><span className="sy-small sy-semibold truncate text-slate-900">{report.serviceType}</span><span className="sy-small shrink-0 text-slate-500">{report.waitMinutes} min wait</span></div>
                <p className="sy-small mt-1 line-clamp-2 text-slate-600">“{report.note}”</p>
                <div className="sy-small mt-2 text-slate-400">{formatReportDate(report.visitDate)} · {formatReportTime(report.visitTime)}</div>
              </button>
            ))}
          </div>

          <article className="min-h-0 overflow-y-auto p-4 [scrollbar-width:thin] lg:p-5">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-600"><UserRound size={19} /></span><div><div className="sy-small sy-semibold text-slate-900">{selected.author}</div><div className="sy-small text-slate-500">{formatReportDate(selected.visitDate)} · {formatReportTime(selected.visitTime)}</div></div></div>
            <p className="sy-caption mt-4 rounded-xl bg-slate-50 p-4 text-slate-700">“{selected.note}”</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 p-3"><Clock3 size={16} className="text-blue-600" /><div className="sy-small mt-2 text-slate-500">Waiting time</div><div className="sy-h4">{selected.waitMinutes} min</div></div>
              <div className="rounded-xl border border-slate-100 p-3"><TimerReset size={16} className="text-blue-600" /><div className="sy-small mt-2 text-slate-500">Processing</div><div className="sy-h4">{selected.processingMinutes} min</div></div>
              <div className="rounded-xl border border-slate-100 p-3"><FileCheck2 size={16} className="text-blue-600" /><div className="sy-small mt-2 text-slate-500">Information</div><div className="sy-h4">{selected.informationAccurate}</div></div>
            </div>
            <dl className="sy-small mt-4 grid grid-cols-[150px_minmax(0,1fr)] gap-x-3 gap-y-2 border-t border-slate-200 pt-4">
              <dt className="text-slate-500">Service</dt><dd className="sy-semibold text-slate-900">{selected.serviceType}</dd>
              <dt className="text-slate-500">Service available</dt><dd className="sy-semibold text-slate-900">{selected.available}</dd>
              <dt className="text-slate-500">Service quality</dt><dd className="sy-semibold text-slate-900">{ratingLabel(selected.serviceQuality)}</dd>
              <dt className="text-slate-500">Accessibility</dt><dd className="sy-semibold text-slate-900">{ratingLabel(selected.accessibility)}</dd>
              <dt className="text-slate-500">Overall experience</dt><dd className="sy-semibold text-slate-900">{ratingLabel(selected.overallExperience)}</dd>
            </dl>
          </article>
        </div>
      </section>
    </div>
  );
}
