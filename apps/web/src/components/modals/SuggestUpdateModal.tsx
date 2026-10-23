import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Accessibility,
  Ban,
  CheckCircle2,
  Clock3,
  FileText,
  ImagePlus,
  MapPin,
  MoreHorizontal,
  PenLine,
  Phone,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { ServiceSummary } from '../../types/service';

interface SuggestUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceSummary;
}

const updateTopics = [
  { id: 'Operating hours', icon: Clock3 },
  { id: 'Address / Location', icon: MapPin },
  { id: 'Service no longer available', icon: Ban },
  { id: 'Contact information', icon: Phone },
  { id: 'Accessibility information', icon: Accessibility },
  { id: 'Service details', icon: FileText },
  { id: 'Other', icon: MoreHorizontal },
] as const;

export function SuggestUpdateModal({ isOpen, onClose, service }: SuggestUpdateModalProps) {
  const [selectedTopic, setSelectedTopic] = useState('Operating hours');
  const [openingTime, setOpeningTime] = useState('08:30');
  const [closingTime, setClosingTime] = useState('16:30');
  const [details, setDetails] = useState('The health center now closes at 4:30 PM based on the posted schedule at the entrance.');
  const [photoName, setPhotoName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const closeModal = () => {
    setSubmitted(false);
    onClose();
  };

  return createPortal((
    <div className="fixed inset-0 z-[1500] bg-slate-900/50 backdrop-blur-[1px] lg:flex lg:items-center lg:justify-center lg:p-4">
      <button type="button" aria-label="Close suggest update" onClick={closeModal} className="absolute inset-0 cursor-default" />

      <section className="absolute inset-x-0 bottom-0 z-10 flex max-h-[72vh] flex-col overflow-hidden rounded-t-[24px] border border-slate-200 bg-white shadow-[0_-16px_46px_rgba(15,23,42,.22)] lg:relative lg:inset-auto lg:max-h-[92vh] lg:w-full lg:max-w-[580px] lg:rounded-[16px] lg:shadow-[0_24px_70px_rgba(15,23,42,.24)]">
        <span className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-slate-300 lg:hidden" />

        <header className="flex shrink-0 items-start gap-3 px-5 pb-3 pt-5 lg:px-5 lg:pt-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600"><PenLine size={21} /></span>
          <div className="min-w-0 flex-1">
            <h2 className="sy-h3">Suggest an update</h2>
            <p className="sy-caption mt-0.5 text-slate-500">Help keep service information accurate for everyone.</p>
          </div>
          <button type="button" onClick={closeModal} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100"><X size={19} /></button>
        </header>

        <form onSubmit={(event) => event.preventDefault()} className="min-h-0 flex-1 overflow-y-auto px-5 pb-3 [scrollbar-width:thin]">
          <section className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <img src={service.image} alt="" className="h-[66px] w-[88px] rounded-lg object-cover" />
            <div className="min-w-0 self-center">
              <h3 className="sy-small sy-semibold truncate text-slate-900">{service.name}</h3>
              <p className="sy-small mt-0.5 flex items-center gap-1.5 text-slate-500"><span className="text-emerald-500">◆</span>{service.category}</p>
              <p className="sy-small mt-0.5 flex min-w-0 items-center gap-1.5 text-slate-500"><MapPin size={13} className="shrink-0 text-blue-600" /><span className="truncate">{service.address}</span></p>
            </div>
          </section>

          <fieldset className="mt-3">
            <legend className="sy-h4 mb-2">What information should be corrected?</legend>
            <div className="grid grid-cols-2 gap-2">
              {updateTopics.map((item) => {
                const Icon = item.icon;
                const active = selectedTopic === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTopic(item.id)}
                    className={`sy-small sy-semibold flex min-h-10 items-center gap-2 rounded-lg border px-3 text-left transition ${active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    <Icon size={17} className={active ? 'text-blue-600' : 'text-slate-500'} />
                    <span className="min-w-0 flex-1">{item.id}</span>
                    <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${active ? 'border-blue-600' : 'border-slate-400'}`}>{active ? <span className="h-2 w-2 rounded-full bg-blue-600" /> : null}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <section className="mt-3 rounded-xl bg-blue-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-blue-600"><Clock3 size={18} /></span>
              <div><div className="sy-small sy-semibold text-slate-900">Current operating hours</div><div className="sy-caption mt-0.5 text-slate-700">8:00 AM – 5:00 PM</div><p className="sy-small mt-0.5 text-slate-500">This is the information currently shown on TaymPers.</p></div>
            </div>
          </section>

          <section className="mt-3">
            <h3 className="sy-h4 mb-1.5">What should it say instead?</h3>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="sy-small mb-1 block text-slate-600">Opening time</span>
                <span className="relative flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3"><Clock3 size={16} className="text-blue-600" /><strong className="sy-small flex-1 text-slate-900">{openingTime === '08:30' ? '8:30 AM' : openingTime}</strong><span className="text-blue-600">⌄</span><input type="time" value={openingTime} onChange={(event) => setOpeningTime(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0" /></span>
              </label>
              <label>
                <span className="sy-small mb-1 block text-slate-600">Closing time</span>
                <span className="relative flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3"><Clock3 size={16} className="text-blue-600" /><strong className="sy-small flex-1 text-slate-900">{closingTime === '16:30' ? '4:30 PM' : closingTime}</strong><span className="text-blue-600">⌄</span><input type="time" value={closingTime} onChange={(event) => setClosingTime(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0" /></span>
              </label>
            </div>
          </section>

          <label className="mt-3 block">
            <span className="sy-small sy-semibold mb-1.5 block text-slate-900">Why are you suggesting this update? <span className="font-normal text-blue-600">(Optional)</span></span>
            <span className="relative block">
              <textarea value={details} maxLength={500} onChange={(event) => setDetails(event.target.value)} className="sy-small h-[64px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-14 outline-none focus:border-blue-400" />
              <span className="sy-small absolute bottom-2 right-3 text-slate-400">{details.length}/500</span>
            </span>
          </label>

          <label className="mt-3 flex min-h-[54px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"><ImagePlus size={18} /></span>
            <span className="min-w-0 flex-1"><span className="sy-small sy-semibold block text-slate-900">Add supporting photo <span className="font-normal text-slate-500">(Optional)</span></span><span className="sy-small block truncate text-slate-500">{photoName || 'Upload a photo of the new schedule or relevant information.'}</span></span>
            <span className="sy-small sy-semibold rounded-lg border border-blue-300 bg-white px-3 py-2 text-blue-600">Upload Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? '')} />
          </label>

          <div className="mt-3 flex items-start gap-3 rounded-xl bg-blue-50 px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-600 text-white"><ShieldCheck size={16} /></span>
            <div><div className="sy-small sy-semibold text-slate-800">Community updates are reviewed before they affect service information.</div><p className="sy-small mt-0.5 text-slate-500">Your suggestion will be checked by our team and may take some time to appear.</p></div>
          </div>

          {submitted ? <div className="sy-small sy-semibold mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700"><CheckCircle2 size={16} /> Update sent for review.</div> : null}
        </form>

        <footer className="grid shrink-0 grid-cols-2 gap-2 border-t border-slate-100 bg-white px-5 py-3">
          <button type="button" onClick={closeModal} className="sy-small sy-semibold h-10 rounded-lg border border-blue-500 bg-white text-blue-600">Cancel</button>
          <button type="button" onClick={() => setSubmitted(true)} className="sy-small sy-semibold flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 text-white shadow-[0_7px_18px_rgba(0,102,255,.18)]"><Send size={16} /> {submitted ? 'Update Sent' : 'Send Update'}</button>
        </footer>
      </section>
    </div>
  ), document.body);
}
