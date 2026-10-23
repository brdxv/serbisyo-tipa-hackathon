import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Ban,
  FileText,
  Flag,
  Lock,
  Mail,
  MapPin,
  MoreHorizontal,
  Send,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import type { ServiceSummary } from '../../types/service';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceSummary;
}

const reportReasons = [
  { label: 'Spam', icon: Mail },
  { label: 'Fake or misleading contribution', icon: ShieldAlert },
  { label: 'Abusive or harmful content', icon: Ban },
  { label: 'Irrelevant content', icon: FileText },
  { label: 'Privacy concern', icon: Lock },
  { label: 'Other', icon: MoreHorizontal },
] as const;

export function ReportModal({ isOpen, onClose, service }: ReportModalProps) {
  const [reason, setReason] = useState('Fake or misleading contribution');
  const [details, setDetails] = useState('This contribution appears to describe a different office and may mislead users.');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const closeModal = () => {
    setSubmitted(false);
    onClose();
  };

  return createPortal((
    <div className="fixed inset-0 z-[1500] bg-slate-900/50 backdrop-blur-[1px] lg:flex lg:items-center lg:justify-center lg:p-4">
      <button type="button" aria-label="Close report information" onClick={closeModal} className="absolute inset-0 cursor-default" />

      <section className="absolute inset-x-2 bottom-[76px] z-10 flex max-h-[70vh] flex-col overflow-hidden rounded-t-[24px] border border-slate-200 bg-white shadow-[0_-16px_46px_rgba(15,23,42,.22)] lg:relative lg:inset-auto lg:max-h-[90vh] lg:w-full lg:max-w-[580px] lg:rounded-[16px] lg:shadow-[0_24px_70px_rgba(15,23,42,.24)]">
        <span className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-slate-300 lg:hidden" />

        <header className="flex shrink-0 items-start gap-3 px-5 pb-3 pt-5 lg:px-5 lg:pt-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600"><Flag size={21} /></span>
          <div className="min-w-0 flex-1">
            <h2 className="sy-h3">Report information</h2>
            <p className="sy-caption mt-0.5 text-slate-500">Help us keep community information useful, accurate, and respectful.</p>
          </div>
          <button type="button" onClick={closeModal} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100"><X size={19} /></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3 [scrollbar-width:thin]">
          <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <h3 className="sy-h4 mb-2">Contribution to report</h3>
            <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-violet-100 text-violet-600"><UserRound size={19} /></span>
              <div className="min-w-0">
                <div className="sy-small sy-semibold text-slate-900">Document Request</div>
                <div className="sy-small sy-semibold text-slate-900">Waited 28 min</div>
                <p className="sy-small mt-1 text-slate-500">“Staff was helpful but the line was long near lunch...”</p>
              </div>
              <img src={service.image} alt="" className="h-11 w-14 rounded-lg object-cover" />
              <div className="min-w-0 self-center">
                <p className="sy-small text-slate-500">Submitted for <span className="sy-semibold text-blue-600">{service.name}</span></p>
                <p className="sy-small mt-0.5 flex min-w-0 items-center gap-1.5 text-slate-500"><MapPin size={12} className="shrink-0 text-blue-600" /><span className="truncate">{service.category} · {service.address}</span></p>
              </div>
            </div>
          </section>

          <fieldset className="mt-3">
            <legend className="sy-h4 mb-2">Why are you reporting this?</legend>
            <div className="grid grid-cols-2 gap-2">
              {reportReasons.map((item) => {
                const Icon = item.icon;
                const active = reason === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setReason(item.label)}
                    className={`sy-small sy-semibold flex min-h-11 items-center gap-2 rounded-lg border px-3 text-left transition ${active ? 'border-blue-600 bg-blue-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-500'} />
                    <span className="min-w-0 flex-1">{item.label}</span>
                    <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${active ? 'border-blue-600' : 'border-slate-400'}`}>{active ? <span className="h-2 w-2 rounded-full bg-blue-600" /> : null}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-3 block">
            <span className="sy-h4 mb-1.5 block">Tell us more <span className="sy-small font-normal text-slate-500">(Optional)</span></span>
            <span className="relative block">
              <textarea value={details} maxLength={500} onChange={(event) => setDetails(event.target.value)} className="sy-small h-[78px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-14 outline-none focus:border-blue-400" />
              <span className="sy-small absolute bottom-2 right-3 text-slate-400">{details.length}/500</span>
            </span>
          </label>

          <div className="mt-3 flex items-start gap-3 rounded-xl bg-blue-50 px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-600 text-white"><ShieldCheck size={16} /></span>
            <div><div className="sy-small sy-semibold text-slate-800">Reports are reviewed before any community contribution is removed or changed.</div><p className="sy-small mt-0.5 text-slate-500">This does not automatically delete the contribution. Our team will check the report and take appropriate action if needed.</p></div>
          </div>

          {submitted ? <div className="sy-small sy-semibold mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">Report submitted for moderation review.</div> : null}
        </div>

        <footer className="grid shrink-0 grid-cols-2 gap-2 border-t border-slate-100 bg-white px-5 py-3">
          <button type="button" onClick={closeModal} className="sy-small sy-semibold h-10 rounded-lg border border-blue-500 bg-white text-blue-600">Cancel</button>
          <button type="button" onClick={() => setSubmitted(true)} className="sy-small sy-semibold flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 text-white shadow-[0_7px_18px_rgba(0,102,255,.18)]"><Send size={16} /> {submitted ? 'Report Submitted' : 'Submit Report'}</button>
        </footer>
      </section>
    </div>
  ), document.body);
}
