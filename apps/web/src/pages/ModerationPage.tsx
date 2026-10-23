import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Flag,
  Info,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ModeratorWorkspaceShell } from '../components/layout/RoleWorkspaceShell';
import { morongPrototypeServices } from '../data/morongPrototypeServices';
import type { ServiceSummary } from '../types/service';

type ModerationTab = 'pending' | 'reported' | 'corrections';

type ReportSeed = {
  id: string;
  providerId: string;
  reason: string;
  tone: 'error' | 'warning' | 'info' | 'correction';
  submitted: string;
  submittedBy: string;
  contributionBy: string;
  contributionDate: string;
  contributionTime: string;
  contributionText: string;
  wait: string;
  serviceType: string;
  explanation: string;
};

const reportSeeds: ReportSeed[] = [
  {
    id: 'RPT-2026-00124',
    providerId: 'morong-rural-health-unit',
    reason: 'Fake or misleading information',
    tone: 'error',
    submitted: 'Oct 18, 2026 · 2:34 PM',
    submittedBy: 'Anonymous User',
    contributionBy: 'Anonymous User',
    contributionDate: 'Oct 17, 2026',
    contributionTime: '4:12 PM',
    contributionText: 'The staff here are rude and don’t do their job. I waited for 3 hours and they still didn’t assist me. This place is always like this and the service is really terrible.',
    wait: '3 hours',
    serviceType: 'General Consultation',
    explanation: 'This information is not accurate. I visited last week and the waiting time was around 20 minutes. This might mislead others.',
  },
  {
    id: 'RPT-2026-00123',
    providerId: 'mercury-drug-morong-t-claudio',
    reason: 'Inaccurate wait time',
    tone: 'warning',
    submitted: 'Oct 17, 2026 · 6:15 PM',
    submittedBy: 'Juan D.',
    contributionBy: 'Juan D.',
    contributionDate: 'Oct 17, 2026',
    contributionTime: '5:20 PM',
    contributionText: 'The line took much longer than the posted estimate and the pharmacy was very crowded.',
    wait: '45 minutes',
    serviceType: 'Medicine Purchase',
    explanation: 'Recent visits suggest the average wait is closer to 15 minutes outside peak hours.',
  },
  {
    id: 'RPT-2026-00122',
    providerId: 'morong-municipal-hall',
    reason: 'Needs correction',
    tone: 'info',
    submitted: 'Oct 16, 2026 · 11:20 AM',
    submittedBy: 'Maria S.',
    contributionBy: 'Maria S.',
    contributionDate: 'Oct 16, 2026',
    contributionTime: '10:45 AM',
    contributionText: 'The process was smooth but I think the listed processing time needs to be updated.',
    wait: '22 minutes',
    serviceType: 'Public Assistance',
    explanation: 'The report is useful but the timing should be checked against other recent submissions.',
  },
  {
    id: 'RPT-2026-00121',
    providerId: 'urs-morong-campus',
    reason: 'Inappropriate content',
    tone: 'error',
    submitted: 'Oct 16, 2026 · 9:14 AM',
    submittedBy: 'Anonymous User',
    contributionBy: 'Anonymous User',
    contributionDate: 'Oct 15, 2026',
    contributionTime: '3:18 PM',
    contributionText: 'The service note includes language that does not help other users plan their visit.',
    wait: '35 minutes',
    serviceType: 'Document Request',
    explanation: 'The contribution may need editing or removal before it should remain public.',
  },
  {
    id: 'RPT-2026-00120',
    providerId: 'lto-morong-district-office',
    reason: 'Outdated information',
    tone: 'info',
    submitted: 'Oct 15, 2026 · 4:28 PM',
    submittedBy: 'Carlo M.',
    contributionBy: 'Carlo M.',
    contributionDate: 'Oct 15, 2026',
    contributionTime: '2:05 PM',
    contributionText: 'The posted information appears to reflect an older service process.',
    wait: '28 minutes',
    serviceType: 'Application Processing',
    explanation: 'The provider may have updated its public process since the original contribution.',
  },
  {
    id: 'RPT-2026-00119',
    providerId: 'morong-public-market',
    reason: 'Spam',
    tone: 'error',
    submitted: 'Oct 14, 2026 · 1:11 PM',
    submittedBy: 'Anonymous User',
    contributionBy: 'Anonymous User',
    contributionDate: 'Oct 14, 2026',
    contributionTime: '12:40 PM',
    contributionText: 'Repeated promotional content was added instead of an actual service experience.',
    wait: '12 minutes',
    serviceType: 'Public Market Visit',
    explanation: 'This contribution does not appear to provide useful first-hand service information.',
  },
  {
    id: 'RPT-2026-00118',
    providerId: 'morong-national-high-school',
    reason: 'Suggested edit',
    tone: 'correction',
    submitted: 'Oct 14, 2026 · 10:02 AM',
    submittedBy: 'Liza T.',
    contributionBy: 'Liza T.',
    contributionDate: 'Oct 14, 2026',
    contributionTime: '9:28 AM',
    contributionText: 'The service details could be clearer for parents and visitors.',
    wait: '18 minutes',
    serviceType: 'General Inquiry',
    explanation: 'This is a suggested correction rather than a harmful contribution.',
  },
];

function serviceFor(report: ReportSeed) {
  return morongPrototypeServices.find((service) => service.id === report.providerId) ?? morongPrototypeServices[0];
}

function reasonTone(report: ReportSeed) {
  if (report.tone === 'error') return 'bg-red-50 text-red-600';
  if (report.tone === 'warning') return 'bg-amber-50 text-amber-700';
  if (report.tone === 'correction') return 'bg-violet-50 text-violet-600';
  return 'bg-blue-50 text-blue-600';
}

function QueueCard({
  report,
  selected,
  onSelect,
  onOpen,
}: {
  report: ReportSeed;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const service = serviceFor(report);
  return (
    <article
      onClick={onSelect}
      className={`group relative grid cursor-pointer grid-cols-[106px_minmax(0,1fr)] gap-3 rounded-xl border bg-white p-2.5 transition ${selected ? 'border-blue-500 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}
    >
      <img src={service.image} alt="" className="h-[82px] w-[106px] rounded-lg object-cover" />
      <div className="min-w-0 pr-16">
        <h3 className="sy-h4 truncate">{service.name}</h3>
        <p className="sy-small mt-0.5 text-slate-500">{service.category}</p>
        <span className={`sy-small sy-semibold mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-1 ${reasonTone(report)}`}><Flag size={13} /> <span className="truncate">{report.reason}</span></span>
        <p className="sy-small mt-1.5 truncate text-slate-500">Submitted {report.submitted} by {report.submittedBy}</p>
      </div>
      <span className="sy-small sy-semibold absolute right-3 top-3 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">Pending</span>
      <button type="button" aria-label="Open report review" onClick={(event) => { event.stopPropagation(); onOpen(); }} className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full text-blue-600 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"><ChevronRight size={18} /></button>
    </article>
  );
}

function OfficialInformationCard({ service }: { service: ServiceSummary }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-2 bg-blue-50/70 px-3 py-2">
        <h3 className="sy-h4">Official Information <span className="font-normal">(for reference)</span></h3>
        <span className="sy-small sy-semibold flex items-center gap-1 text-emerald-700"><ShieldCheck size={15} className="text-emerald-500" /> From official sources</span>
      </div>
      <div className="sy-small grid gap-3 p-3 text-slate-600 lg:grid-cols-2">
        <div className="flex gap-2"><Clock3 size={16} className="shrink-0 text-indigo-500" /><span>8:00 AM – 5:00 PM<br /><span className="text-slate-500">Closes in 2h 15m</span></span></div>
        <div className="flex gap-2"><MapPin size={16} className="shrink-0 text-indigo-500" /><span>{service.address}<br /><span className="text-slate-500">{service.distanceKm.toFixed(1)} km from center</span></span></div>
        <div className="flex gap-2"><MessageSquare size={16} className="shrink-0 text-indigo-500" /><span>(02) 1234 5678</span></div>
        <div className="flex gap-2"><FileText size={16} className="shrink-0 text-indigo-500" /><span>General Consultation, public assistance, and more</span></div>
      </div>
    </section>
  );
}

function RecentContext({ compact = false }: { compact?: boolean }) {
  const rows = [
    ['Process was smooth. I only waited around 20 minutes.', 'Oct 14, 2026', 'Liza T.', '15 – 30 min'],
    ['Staff were accommodating and helpful with my documents.', 'Oct 10, 2026', 'Rafael C.', '5 – 15 min'],
    ['The queue moves steadily. Overall, a good experience.', 'Oct 8, 2026', 'Mika P.', '15 – 30 min'],
  ];
  return (
    <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'lg:grid-cols-3'}`}>
      {rows.slice(0, compact ? 2 : 3).map(([quote, date, author, wait]) => (
        <article key={quote} className="grid grid-cols-[36px_minmax(0,1fr)] gap-2 rounded-xl border border-slate-200 bg-white p-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-blue-600"><UserRound size={18} /></span>
          <div className="min-w-0">
            <p className="sy-small text-slate-700">“{quote}”</p>
            <div className="sy-small mt-2 flex flex-wrap items-center justify-between gap-1 text-slate-500"><span>{date} · by {author}</span><span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">{wait}</span></div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ModerationDecisionBar({
  onDecision,
  compact = false,
}: {
  onDecision: (decision: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`${compact ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-3 gap-3'}`}>
      <button type="button" onClick={() => onDecision('Kept contribution')} className="sy-small sy-semibold flex min-h-14 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 text-white"><CheckCircle2 size={22} /><span>{compact ? 'Keep Contribution' : 'Approve'}<small className="block font-normal opacity-90">{compact ? 'Mark as valid' : 'Keep this contribution'}</small></span></button>
      <button type="button" onClick={() => onDecision('Removed contribution')} className="sy-small sy-semibold flex min-h-14 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 text-red-600"><X size={22} /><span>{compact ? 'Remove Contribution' : 'Reject'}<small className="block font-normal opacity-90">{compact ? 'Remove this content' : 'Remove this contribution'}</small></span></button>
      <button type="button" onClick={() => onDecision('Requested another review')} className="sy-small sy-semibold flex min-h-14 items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-3 text-blue-600"><Clock3 size={22} /><span>{compact ? 'Request Review' : 'Request Review'}<small className="block font-normal opacity-90">Send to another moderator</small></span></button>
    </div>
  );
}

function InlineReviewPanel({
  report,
  onOpenDetail,
}: {
  report: ReportSeed;
  onOpenDetail: () => void;
}) {
  const navigate = useNavigate();
  const service = serviceFor(report);
  const [decision, setDecision] = useState('');
  return (
    <section className="min-h-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm [scrollbar-width:thin]">
      <div className="flex items-start gap-4">
        <img src={service.image} alt="" className="h-[92px] w-[130px] rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <h2 className="sy-h3">{service.name}</h2>
          <p className="sy-caption mt-1 text-slate-500">{service.category}</p>
          <p className="sy-caption mt-1 flex items-center gap-1.5 text-slate-500"><MapPin size={15} /> {service.address}</p>
        </div>
        <button type="button" onClick={() => navigate(`/services/${service.id}`)} className="sy-small sy-semibold flex h-10 items-center gap-2 rounded-lg border border-blue-200 px-3 text-blue-600"><MapIcon size={16} /> View Service Profile</button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-red-50 px-4 py-3 text-red-600">
        <div className="flex items-center gap-3"><Flag size={24} /><div><div className="sy-h4">Reported Contribution</div><div className="sy-small">Reason: {report.reason}</div></div></div>
        <div className="sy-small text-slate-600">Submitted<br />{report.submitted}<br />by {report.submittedBy}</div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_.9fr]">
        <section className="rounded-xl border border-slate-200 p-3">
          <h3 className="sy-h4">Original Contribution</h3>
          <div className="mt-2 flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-blue-600"><UserRound size={16} /></span><span className="sy-small sy-semibold">{report.contributionBy}</span><span className="sy-small text-slate-500">{report.contributionDate} · {report.contributionTime}</span></div>
          <p className="sy-caption mt-2 text-slate-700">“{report.contributionText}”</p>
          <div className="sy-small mt-3 flex flex-wrap gap-2 text-slate-600"><span className="rounded-lg bg-slate-100 px-2 py-1">Wait time: {report.wait}</span><span className="rounded-lg bg-slate-100 px-2 py-1">Visited: {report.contributionDate}</span><span className="rounded-lg bg-slate-100 px-2 py-1">Service: {report.serviceType}</span></div>
        </section>
        <OfficialInformationCard service={service} />
      </div>

      <div className="mt-3 flex items-center justify-between"><h3 className="sy-h4">Other Recent Contributions <span className="font-normal">(for context)</span></h3><button type="button" className="sy-small sy-semibold text-blue-600">View all <ChevronRight size={13} className="inline" /></button></div>
      <div className="mt-2"><RecentContext compact /></div>

      <label className="sy-small mt-3 block text-slate-700">Moderator Notes <span className="text-slate-400">(optional)</span>
        <textarea rows={2} placeholder="Add notes about your decision..." className="mt-1 w-full resize-none rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-400" />
      </label>
      {decision ? <div className="sy-small sy-semibold mt-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700">{decision}</div> : null}
      <div className="mt-3"><ModerationDecisionBar onDecision={setDecision} /></div>
      <button type="button" onClick={onOpenDetail} className="sy-small sy-semibold mt-3 flex items-center gap-1 text-blue-600">Open full report review <ChevronRight size={14} /></button>
    </section>
  );
}

export function ModerationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ModerationTab>('pending');
  const [selectedId, setSelectedId] = useState(reportSeeds[0].id);
  const selectedReport = reportSeeds.find((report) => report.id === selectedId) ?? reportSeeds[0];

  return (
    <ModeratorWorkspaceShell active="queue">
      <div className="mx-auto flex min-h-full max-w-[1360px] flex-col px-4 py-4 lg:h-full lg:px-5 lg:py-5">
        <header className="flex shrink-0 items-start justify-between gap-4">
          <div><h1 className="sy-h1">Moderation Queue</h1><p className="sy-caption mt-1 text-slate-500">Review community contributions, suggested corrections, and reported content.</p></div>
          <button type="button" className="sy-small sy-semibold flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-700">Newest First <ChevronDown size={15} className="text-blue-600" /></button>
        </header>

        <div className="mt-3 grid shrink-0 grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-white lg:w-[720px]">
          {[
            ['pending', FileText, 'Pending Review', '12'],
            ['reported', Flag, 'Reported Contributions', '5'],
            ['corrections', Check, 'Suggested Corrections', '7'],
          ].map(([id, Icon, label, count]) => {
            const selected = id === activeTab;
            return <button key={String(id)} type="button" onClick={() => setActiveTab(id as ModerationTab)} className={`sy-small sy-semibold relative flex h-12 items-center justify-center gap-2 px-2 ${selected ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}><Icon size={17} /><span className="truncate">{String(label)}</span><span className="grid h-6 min-w-6 place-items-center rounded-full bg-blue-50 px-1 text-blue-700">{String(count)}</span>{selected ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" /> : null}</button>;
          })}
        </div>

        <div className="mt-3 min-h-0 flex-1 lg:grid lg:grid-cols-[500px_minmax(0,1fr)] lg:gap-3">
          <div className="space-y-2.5 overflow-y-auto pb-2 [scrollbar-width:thin]">
            {reportSeeds.map((report) => (
              <QueueCard
                key={report.id}
                report={report}
                selected={selectedId === report.id}
                onSelect={() => setSelectedId(report.id)}
                onOpen={() => navigate(`/moderation/${report.id}`)}
              />
            ))}
          </div>
          <div className="hidden min-h-0 lg:block">
            <InlineReviewPanel report={selectedReport} onOpenDetail={() => navigate(`/moderation/${selectedReport.id}`)} />
          </div>
        </div>
      </div>
    </ModeratorWorkspaceShell>
  );
}

export function ModeratorDetailPage() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const report = useMemo(() => reportSeeds.find((item) => item.id === reportId) ?? reportSeeds[0], [reportId]);
  const service = serviceFor(report);
  const [decision, setDecision] = useState('');
  const evidenceImages = service.images?.slice(0, 3) ?? [service.image];
  const mobileDecisionFooter = (
    <div className="grid h-full grid-cols-3 gap-2">
      <button type="button" onClick={() => setDecision('Kept contribution')} className="sy-small sy-semibold flex items-center justify-center gap-1 rounded-lg bg-emerald-500 px-2 text-white"><CheckCircle2 size={18} /><span>Keep<br />Contribution</span></button>
      <button type="button" onClick={() => setDecision('Removed contribution')} className="sy-small sy-semibold flex items-center justify-center gap-1 rounded-lg bg-red-50 px-2 text-red-600"><X size={18} /><span>Remove<br />Contribution</span></button>
      <button type="button" onClick={() => setDecision('Requested another review')} className="sy-small sy-semibold flex items-center justify-center gap-1 rounded-lg border border-blue-300 bg-white px-2 text-blue-600"><Clock3 size={18} /><span>Request<br />Review</span></button>
    </div>
  );

  return (
    <ModeratorWorkspaceShell active="queue" mobileFooter={mobileDecisionFooter}>
      <div className="mx-auto min-h-full max-w-[1360px] px-4 py-4 lg:px-5 lg:py-4">
        <button type="button" onClick={() => navigate('/moderation')} className="sy-small sy-semibold flex items-center gap-1.5 text-blue-600"><ArrowLeft size={16} /> Back to Queue</button>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div><h1 className="sy-h2 lg:sy-h1">Review Report</h1><p className="sy-caption mt-1 text-slate-500">Assess the reported contribution and take appropriate action.</p></div>
          <div className="hidden items-center gap-2 lg:flex"><button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-400"><ChevronLeft size={18} /></button><span className="sy-caption text-slate-500">1 of 12</span><button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-blue-600"><ChevronRight size={18} /></button></div>
          <span className="sy-small sy-semibold rounded-full bg-amber-50 px-3 py-1.5 text-amber-700 lg:hidden">Pending Review</span>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[520px_minmax(0,1fr)]">
          <section className="rounded-xl border border-slate-200 bg-white p-3 lg:p-4">
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 lg:grid-cols-[126px_minmax(0,1fr)]">
              <img src={service.image} alt="" className="h-[86px] w-[120px] rounded-lg object-cover lg:h-[92px] lg:w-[126px]" />
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2"><div><h2 className="sy-h4 lg:sy-h3">{service.name}</h2><p className="sy-small mt-1 text-slate-500">{service.category}</p><p className="sy-small mt-1 flex items-center gap-1.5 text-slate-500"><MapPin size={13} />{service.address}</p></div><button type="button" onClick={() => navigate(`/services/${service.id}`)} className="sy-small sy-semibold hidden h-10 items-center gap-2 rounded-lg border border-blue-200 px-3 text-blue-600 sm:flex"><MapIcon size={15} /> View Service Profile</button></div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-red-50 px-3 py-3 text-red-600">
              <div className="flex items-center gap-3"><Flag size={23} /><div><div className="sy-h4">Reported Contribution</div><div className="sy-small">Reason: {report.reason}</div></div></div>
              <div className="sy-small text-right text-slate-600 lg:hidden">Reported on<br />{report.submitted}<br />by {report.submittedBy}</div>
            </div>

            <div className="sy-caption mt-4 hidden space-y-4 text-slate-600 lg:block">
              <div className="flex gap-3"><CalendarDays size={20} className="text-indigo-500" /><span>Submitted<br />{report.submitted}</span></div>
              <div className="flex gap-3"><UserRound size={20} className="text-indigo-500" /><span>Submitted by<br />{report.submittedBy}</span></div>
              <div className="flex gap-3"><Info size={20} className="text-indigo-500" /><span>Report ID<br />#{report.id}</span></div>
            </div>

            <section className="mt-4 hidden overflow-hidden rounded-xl border border-red-100 bg-red-50/50 lg:block">
              <div className="px-3 py-3"><h3 className="sy-h4">Report Details</h3><p className="sy-caption mt-2 text-slate-600">{report.explanation}</p></div>
              <div className="border-t border-red-100 bg-white p-3">
                <div className="sy-small sy-semibold">Reported by</div>
                <div className="mt-2 flex gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-blue-600"><UserRound size={19} /></span><div><div className="sy-small sy-semibold">Concerned Citizen</div><div className="sy-small text-slate-500">Oct 18, 2026 · 3:10 PM</div><p className="sy-small mt-2 rounded-lg bg-slate-50 p-2 text-slate-600">“{report.explanation}”</p></div></div>
              </div>
            </section>

            <section className="sy-small mt-3 hidden rounded-xl border border-slate-200 p-3 text-slate-500 lg:block">
              <div className="flex items-center gap-2 text-slate-900"><Clock3 size={18} className="text-indigo-500" /><span className="sy-semibold">Previous Moderation Status</span></div>
              <p className="mt-1 pl-6">No previous reports or actions for this contribution.</p>
            </section>
          </section>

          <div className="space-y-3">
            <section className="rounded-xl border border-slate-200 bg-white p-3 lg:p-4">
              <h2 className="sy-h4">Original Contribution</h2>
              <div className="mt-2 flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-blue-600"><UserRound size={16} /></span><span className="sy-small sy-semibold">{report.contributionBy}</span><span className="sy-small text-slate-500">{report.contributionDate} · {report.contributionTime}</span></div>
              <p className="sy-caption mt-2 text-slate-700">“{report.contributionText}”</p>
              <div className="mt-3 hidden grid-cols-4 gap-2 sm:grid">
                {evidenceImages.map((image, index) => <img key={image} src={image} alt="" className="h-[126px] w-full rounded-lg object-cover" />)}
                <div className="grid h-[126px] place-items-center rounded-lg bg-slate-100 text-center text-indigo-500"><div><FileText size={24} className="mx-auto" /><div className="sy-caption mt-2">+2 more</div></div></div>
              </div>
              <div className="sy-small mt-3 flex flex-wrap gap-2 text-slate-600"><span className="rounded-lg bg-slate-100 px-2 py-1">Reported wait time: {report.wait}</span><span className="rounded-lg bg-slate-100 px-2 py-1">Visit date: {report.contributionDate}</span><span className="rounded-lg bg-slate-100 px-2 py-1">Service: {report.serviceType}</span></div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-3 lg:hidden">
              <h3 className="sy-h4">Reporter’s Explanation</h3>
              <div className="mt-2 flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-blue-600"><UserRound size={16} /></span><span className="sy-small sy-semibold">Anonymous User</span><span className="sy-small text-slate-500">Oct 18, 2026 · 2:34 PM</span></div>
              <p className="sy-small mt-2 text-slate-600">“{report.explanation}”</p>
            </section>

            <div className="lg:hidden"><OfficialInformationCard service={service} /></div>

            <section className="rounded-xl border border-slate-200 bg-white p-3 lg:p-4">
              <div className="flex items-center justify-between"><h3 className="sy-h4">Related Information</h3><button className="sy-small sy-semibold text-blue-600">View all <ChevronRight size={13} className="inline" /></button></div>
              <div className="mt-2 hidden items-center gap-4 border-b border-slate-200 lg:flex"><span className="sy-small sy-semibold border-b-2 border-blue-600 px-3 py-2 text-blue-600">Other Recent Contributions (3)</span><span className="sy-small px-3 py-2 text-slate-500">Official Information</span></div>
              <div className="mt-2"><RecentContext /></div>
            </section>

            <section className="sy-small rounded-xl border border-slate-200 bg-white p-3 text-slate-500 lg:hidden">
              <div className="flex items-center gap-2 text-slate-900"><Clock3 size={18} className="text-indigo-500" /><span className="sy-semibold">Previous Moderation Status</span></div>
              <p className="mt-1">No previous moderation actions for this contribution.</p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-3 lg:p-4">
              <div><h3 className="sy-h4">Moderator Decision</h3><p className="sy-small text-slate-500">Review all information and choose the appropriate action.</p></div>
              <label className="sy-small mt-3 block text-slate-700">Moderator Notes <span className="text-slate-400">(optional)</span>
                <textarea rows={2} placeholder="Add notes about your decision..." className="mt-1 w-full resize-none rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-400" />
              </label>
              {decision ? <div className="sy-small sy-semibold mt-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700">{decision}</div> : null}
              <div className="mt-3 hidden lg:block"><ModerationDecisionBar compact onDecision={setDecision} /></div>
            </section>
          </div>
        </div>
      </div>
    </ModeratorWorkspaceShell>
  );
}
