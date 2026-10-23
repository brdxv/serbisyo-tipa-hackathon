import React from 'react';
import {
  Accessibility,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Info,
  Lightbulb,
  MapPin,
  MessageSquare,
  PenLine,
  Scale,
  ShieldCheck,
  Star,
  TrendingDown,
  TrendingUp,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProviderWorkspaceShell } from '../components/layout/RoleWorkspaceShell';
import { morongPrototypeServices } from '../data/morongPrototypeServices';

const provider = morongPrototypeServices.find((service) => service.id === 'morong-rural-health-unit') ?? morongPrototypeServices[0];

function ProviderIdentity({ backToDashboard = false }: { backToDashboard?: boolean }) {
  const navigate = useNavigate();
  return (
    <section>
      {backToDashboard ? <button type="button" onClick={() => navigate('/provider')} className="sy-small sy-semibold mb-2 flex items-center gap-1.5 text-blue-600"><ArrowLeft size={15} /> Back to Dashboard</button> : null}
      <div className="rounded-xl bg-white lg:bg-transparent">
        <div className="grid grid-cols-[132px_minmax(0,1fr)] gap-3 p-2 lg:grid-cols-[212px_minmax(0,1fr)_180px] lg:items-center lg:p-0">
          <img src={provider.image} alt="" className="h-[104px] w-[132px] rounded-xl object-cover lg:h-[126px] lg:w-[212px]" />
          <div className="min-w-0">
            <h1 className="sy-h2 flex items-start gap-2 lg:text-[30px]"><span>{provider.name}</span><CheckCircle2 size={19} className="mt-1 shrink-0 fill-blue-600 text-white lg:h-6 lg:w-6" /></h1>
            <p className="sy-caption mt-1 flex flex-wrap items-center gap-2 text-slate-500"><span className="flex items-center gap-1.5"><FileText size={14} className="text-indigo-500" />{provider.category}</span><span>•</span><span>{provider.address}</span></p>
            <p className="sy-caption mt-2 hidden max-w-[620px] text-slate-600 sm:block">Providing accessible and quality healthcare services for the Morong community.</p>
            <button type="button" onClick={() => navigate(`/services/${provider.id}`)} className="sy-small sy-semibold mt-2 flex h-9 items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 text-blue-600 lg:hidden"><ExternalLink size={14} /> View Public Profile</button>
          </div>
          <button type="button" onClick={() => navigate(`/services/${provider.id}`)} className="sy-small sy-semibold hidden h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 text-blue-600 lg:flex"><ExternalLink size={15} /> View Public Profile</button>
        </div>
      </div>
    </section>
  );
}

function ProviderTabs({ active, hideMobile = false }: { active: 'overview' | 'official-community'; hideMobile?: boolean }) {
  const navigate = useNavigate();
  const items = [
    { id: 'overview', label: 'Overview', icon: BarChart3, action: () => navigate('/provider') },
    { id: 'reviews', label: 'Reviews & Feedback', icon: MessageSquare, action: () => undefined },
    ...(active === 'official-community' ? [{ id: 'official-community', label: 'Official vs Community', icon: Scale, action: () => navigate('/provider/official-vs-community') }] : []),
    { id: 'manage', label: 'Manage Information', icon: UsersRound, action: () => undefined },
  ];
  return (
    <nav className={`mt-3 overflow-x-auto border-b border-slate-200 bg-white [scrollbar-width:none] lg:flex lg:bg-transparent ${hideMobile ? 'hidden' : 'flex'}`}>
      {items.map((item) => {
        const Icon = item.icon;
        const selected = item.id === active;
        return (
          <button key={item.id} type="button" onClick={item.action} className={`sy-small sy-semibold relative flex h-11 shrink-0 items-center gap-2 px-4 ${selected ? 'text-blue-600' : 'text-slate-600'}`}>
            <Icon size={17} />{item.label}
            {selected ? <span className="absolute inset-x-1 bottom-0 h-0.5 bg-blue-600" /> : null}
          </button>
        );
      })}
    </nav>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  suffix,
  status,
  accent = 'blue',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  suffix?: string;
  status?: string;
  accent?: 'blue' | 'green' | 'indigo';
}) {
  const iconTone = accent === 'green' ? 'bg-emerald-50 text-emerald-600' : accent === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600';
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2"><span className={`grid h-9 w-9 place-items-center rounded-full ${iconTone}`}><Icon size={19} /></span><span className="sy-small text-slate-700">{label}</span></div>
      <div className="mt-1 pl-11"><span className="sy-h3">{value}</span>{suffix ? <span className="sy-caption ml-1 text-slate-500">{suffix}</span> : null}</div>
      {status ? <div className="sy-small sy-semibold mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{status}</div> : null}
    </article>
  );
}

export function ProviderDashboardPage() {
  const navigate = useNavigate();
  return (
    <ProviderWorkspaceShell active="dashboard">
      <div className="mx-auto min-h-full max-w-[1320px] px-3 py-3 lg:px-5 lg:py-5">
        <ProviderIdentity />
        <ProviderTabs active="overview" />

        <section className="mt-3 rounded-xl border border-slate-200 bg-white p-3 lg:p-4">
              <div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600"><UsersRound size={19} /></span><div><h2 className="sy-h3">Community Intelligence</h2><p className="sy-small text-slate-500">Based on recent community contributions from TaymPers users.</p></div></div>
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard icon={Clock3} label="Average Wait" value="20 – 30 min" status="↓ 15%" />
            <MetricCard icon={ShieldCheck} label="Reliability" value="4.2" suffix="/ 5" status="High" accent="green" />
            <MetricCard icon={FileText} label="Information Accuracy" value="4.5" suffix="/ 5" status="High" />
            <MetricCard icon={Accessibility} label="Accessibility" value="4.1" suffix="/ 5" status="Good" />
            <MetricCard icon={Star} label="Community Confidence" value="4.6" suffix="/ 5" status="Very High" accent="indigo" />
            <article className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="sy-small sy-semibold">Recent Trend</div>
              <div className="mt-3 flex h-[44px] items-end gap-1">{[10,18,24,19,29,35,40].map((value) => <span key={value} className="relative flex-1 border-t-2 border-blue-500" style={{ height: value }} />)}</div>
              <div className="sy-small sy-semibold mt-2 flex items-center gap-1 text-emerald-700"><TrendingUp size={14} /> Steady improvement</div>
              <div className="sy-small text-emerald-600">+0.3 from last 3 months</div>
            </article>
          </div>
        </section>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-3 lg:p-4">
            <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-amber-50 text-amber-600"><FileText size={19} /></span><div><h2 className="sy-h4">Update Official Information</h2><p className="sy-small text-slate-500">Keep your service information accurate and up to date.</p></div></div><button className="sy-small sy-semibold flex h-9 items-center gap-2 rounded-lg border border-blue-200 px-3 text-blue-600"><PenLine size={14} /> Edit Information</button></div>
            <div className="sy-small mt-3 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 p-3 text-slate-600 lg:grid-cols-4">
              <div><Clock3 size={16} className="mb-1 text-blue-600" /><b className="font-semibold">Operating Hours</b><br />8:00 AM – 5:00 PM<br />Mon – Fri</div>
              <div><MapPin size={16} className="mb-1 text-blue-600" /><b className="font-semibold">Location</b><br />Poblacion,<br />Morong, Rizal</div>
              <div><MessageSquare size={16} className="mb-1 text-blue-600" /><b className="font-semibold">Contact Number</b><br />(02) 1234 5678</div>
              <div><FileText size={16} className="mb-1 text-blue-600" /><b className="font-semibold">Services Offered</b><br />General Consultation, Immunization, Maternal Care, and more</div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-3 lg:p-4">
            <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600"><MessageSquare size={19} /></span><div><h2 className="sy-h4">Respond to Feedback</h2><p className="sy-small text-slate-500">Show the community that you are listening.</p></div></div><button className="sy-small sy-semibold h-9 rounded-lg border border-blue-200 px-3 text-blue-600">View All Feedback <ChevronRight size={13} className="inline" /></button></div>
            <div className="mt-3 space-y-2">
              {[
                'The process was smooth. Staff were accommodating and helpful with my documents.',
                'Waiting area could use more chairs, especially in the morning.',
              ].map((quote, index) => (
                <article key={quote} className="grid grid-cols-[38px_minmax(0,1fr)_80px] items-center gap-2 rounded-xl border border-slate-100 p-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-blue-600"><UserRound size={18} /></span>
                  <div><p className="sy-small text-slate-700">“{quote}”</p><p className="sy-small mt-1 text-slate-500">Oct {14 - index * 2}, 2026 · General Consultation</p></div>
                  <button className="sy-small sy-semibold h-8 rounded-lg border border-blue-200 text-blue-600">Reply</button>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-3 lg:p-4">
            <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-amber-50 text-amber-600"><Info size={19} /></span><div><h2 className="sy-h4">Recurring Issues</h2><p className="sy-small text-slate-500">Common concerns from recent contributions.</p></div></div><button className="sy-small sy-semibold h-9 rounded-lg border border-blue-200 px-3 text-blue-600">View All Issues <ChevronRight size={13} className="inline" /></button></div>
            <div className="mt-3 space-y-2">
              {[['Long waiting time during morning hours','Mentioned in 8 contributions'],['Limited seating in waiting area','Mentioned in 6 contributions'],['Difficulty in getting queue number','Mentioned in 4 contributions']].map(([issue,count]) => <div key={issue} className="sy-small flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 text-slate-700"><span>{issue}</span><span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{count}</span><ChevronRight size={15} className="text-indigo-500" /></div>)}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-3 lg:p-4">
            <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-amber-50 text-amber-600"><Lightbulb size={19} /></span><div><h2 className="sy-h4">Recent Community Insights</h2><p className="sy-small text-slate-500">Latest contributions from the community.</p></div></div><button className="sy-small sy-semibold h-9 rounded-lg border border-blue-200 px-3 text-blue-600">View All <ChevronRight size={13} className="inline" /></button></div>
            <div className="mt-3 space-y-2">
              {[
                ['The new queue system is much better. Waiting time was shorter compared to last month.', 'Oct 16, 2026 · 15 – 30 min wait · General Consultation'],
                ['Staff are still very helpful even when it’s crowded. The place is clean and organized.', 'Oct 14, 2026 · 30 – 45 min wait · Immunization'],
              ].map(([quote,meta]) => <article key={quote} className="grid grid-cols-[38px_minmax(0,1fr)_70px] gap-2 rounded-xl border border-slate-100 p-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-blue-600"><UserRound size={18} /></span><div><p className="sy-small text-slate-700">“{quote}”</p><p className="sy-small mt-1 text-slate-500">{meta}</p></div><span className="sy-small sy-semibold self-center rounded-full bg-emerald-50 px-2 py-1 text-center text-emerald-700">Positive</span></article>)}
            </div>
          </section>
        </div>

        <button type="button" onClick={() => navigate('/provider/official-vs-community')} className="sy-small sy-semibold mx-auto mt-4 flex items-center gap-2 text-blue-600 lg:hidden"><Scale size={16} /> Compare Official vs Community <ChevronRight size={14} /></button>
      </div>
    </ProviderWorkspaceShell>
  );
}

type ComparisonRow = {
  title: string;
  note: string;
  icon: React.ElementType;
  official: React.ReactNode;
  community: React.ReactNode;
  positive: boolean;
  insight: string;
  action: string;
};

const comparisonRows: ComparisonRow[] = [
  {
    title: 'Processing Time',
    note: 'How long the service usually takes to complete.',
    icon: Clock3,
    official: <><div className="sy-small sy-semibold">Official Information</div><div className="sy-h3 mt-1">20 min</div><div className="sy-small text-slate-500">Expected processing time</div></>,
    community: <><div className="sy-small sy-semibold">Community Experience</div><div className="sy-h3 mt-1">31 min</div><div className="sy-small text-slate-500">Average from 24 recent reports</div></>,
    positive: false,
    insight: 'Community reports show a longer processing time than posted.',
    action: 'Consider reviewing queue management or updating the posted processing time.',
  },
  {
    title: 'Operating Hours',
    note: 'Official service schedule and closing time.',
    icon: Clock3,
    official: <><div className="sy-small sy-semibold">Official Information</div><div className="sy-h3 mt-1">8:00 AM – 5:00 PM</div><div className="sy-small text-slate-500">Monday – Friday</div></>,
    community: <><div className="sy-small sy-semibold">Community Experience</div><div className="sy-h3 mt-1">Mostly accurate</div><div className="sy-small text-slate-500">Confirmed in 18 of 20 recent reports</div></>,
    positive: true,
    insight: 'Community reports are consistent with the posted schedule.',
    action: 'No immediate action needed.',
  },
  {
    title: 'Service Availability',
    note: 'Whether the service is open and operational.',
    icon: CalendarDays,
    official: <><div className="sy-small sy-semibold">Official Information</div><div className="sy-h3 mt-1 text-emerald-600">Open</div><div className="sy-small text-slate-500">Available during posted hours</div></>,
    community: <><div className="sy-small sy-semibold">Community Experience</div><div className="sy-h3 mt-1">Open (95% of reports)</div><div className="sy-small text-slate-500">Open in 19 of 20 recent reports</div></>,
    positive: true,
    insight: 'Most recent reports confirm the service is usually available.',
    action: 'Keep maintaining service availability.',
  },
  {
    title: 'Accessibility Features',
    note: 'Facilities and support for PWDs, senior citizens, and other sectors.',
    icon: Accessibility,
    official: <><div className="sy-small sy-semibold">Official Information</div><div className="sy-small mt-2 space-y-1 text-slate-700"><div>✓ Wheelchair accessible entrance</div><div>✓ Priority lane for senior citizens</div><div>✓ Accessible restroom</div><div>✓ Assistance from staff</div></div></>,
    community: <><div className="sy-small sy-semibold">Community Experience</div><div className="sy-small mt-2 space-y-1 text-slate-700"><div>✓ Accessible entrance (mentioned 12x)</div><div>✓ Priority lane (mentioned 9x)</div><div className="text-amber-700">! Limited seating in waiting area (6x)</div><div className="text-slate-500">− No clear signage (4x)</div></div></>,
    positive: false,
    insight: 'Some accessibility features are available, but the community mentions limited seating and unclear signage.',
    action: 'Consider adding clearer signage and improving seating in the waiting area.',
  },
  {
    title: 'Information Accuracy',
    note: 'How accurate and helpful the posted information is.',
    icon: FileText,
    official: <><div className="sy-small sy-semibold">Official Information</div><div className="sy-h3 mt-1">Complete information</div><div className="sy-small text-slate-500">Services, requirements, and process are posted on TaymPers.</div></>,
    community: <><div className="sy-small sy-semibold">Community Experience</div><div className="sy-h3 mt-1">4.3 / 5</div><div className="sy-small text-slate-500">Based on 21 ratings about information accuracy</div></>,
    positive: true,
    insight: 'Most users find the information helpful and accurate.',
    action: 'Keep your information updated.',
  },
];

function ComparisonRowCard({ row }: { row: ComparisonRow }) {
  const Icon = row.icon;
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3 lg:grid lg:grid-cols-[225px_minmax(0,1fr)_minmax(0,1.15fr)_300px] lg:items-stretch lg:gap-2 lg:p-1.5">
      <div className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 lg:block">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-blue-600 lg:mb-2"><Icon size={23} /></span>
        <div><h3 className="sy-h4">{row.title}</h3><p className="sy-small mt-1 text-slate-500">{row.note}</p></div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 lg:contents">
        <div className="rounded-xl border border-blue-100 bg-blue-50/45 p-3 lg:p-2">{row.official}</div>
        <div className={`rounded-xl border p-3 lg:p-2 ${row.positive ? 'border-emerald-100 bg-emerald-50/55' : 'border-orange-100 bg-orange-50/60'}`}>{row.community}</div>
      </div>
      <div className={`mt-2 rounded-xl px-3 py-2 lg:mt-0 lg:px-2.5 lg:py-1.5 ${row.positive ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
        <div className="sy-small sy-semibold flex items-center gap-1.5">{row.positive ? <CheckCircle2 size={15} /> : <Info size={15} />} Insight & Opportunity</div>
        <p className="sy-small mt-1 text-slate-600">{row.insight}</p>
        <p className="sy-small sy-semibold mt-2">{row.action}</p>
      </div>
    </article>
  );
}

export function OfficialVsCommunityPage() {
  return (
    <ProviderWorkspaceShell active="official-community">
      <div className="mx-auto min-h-full max-w-[1320px] px-3 py-3 lg:px-5 lg:pb-0 lg:pt-4">
        <ProviderIdentity backToDashboard />
        <ProviderTabs active="official-community" hideMobile />

        <div className="mt-3">
          <div className="flex items-start gap-3 lg:hidden"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Scale size={22} /></span><div><h1 className="sy-h2">Official vs Community</h1><p className="sy-caption mt-0.5 text-slate-500">See how posted information compares with recent community reports.</p></div></div>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5 lg:mt-0">
            <Info size={21} className="shrink-0 text-blue-600" />
            <div><h2 className="sy-h4 hidden lg:block">Why this matters</h2><p className="sy-small text-slate-600">This comparison helps you see how the community actually experiences your service and find areas for improvement.</p></div>
            <span className="sy-small ml-auto hidden max-w-[360px] rounded-lg bg-white/70 px-3 py-2 text-slate-600 lg:block">This information is based on recent TaymPers contributions from your community.</span>
          </div>
        </div>

        <div className="mt-3 space-y-2 lg:space-y-1.5">
          {comparisonRows.map((row) => <ComparisonRowCard key={row.title} row={row} />)}
        </div>
      </div>
    </ProviderWorkspaceShell>
  );
}
