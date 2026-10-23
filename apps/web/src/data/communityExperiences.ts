export type CommunityExperience = {
  id: string;
  providerId: string;
  author: string;
  serviceType: string;
  visitDate: string;
  visitTime: string;
  waitMinutes: number;
  processingMinutes: number;
  available: 'Yes' | 'No' | 'Partially available';
  informationAccurate: 'Yes' | 'No' | 'Somewhat accurate';
  serviceQuality: number;
  accessibility: number;
  overallExperience: number;
  note: string;
  sentiment: 'Positive' | 'Neutral' | 'Needs attention';
  source: 'prototype-seed' | 'local-submission';
};

const STORAGE_KEY = 'serbisyo-community-experiences-v1';

const notes = [
  'The process was smooth and the staff explained the next steps clearly.',
  'I waited a little longer near lunch, but the service itself was organized.',
  'Requirements were clear and I was able to finish the transaction in one visit.',
  'The queue moved steadily. Going earlier would probably be faster.',
  'Staff were accommodating and the posted information matched what I needed.',
  'The waiting area was busy, but the service window handled people consistently.',
  'Bring the complete requirements before lining up to avoid a second trip.',
  'The service was available and the staff gave useful instructions.',
];

const serviceTypes = ['General Inquiry', 'Document Request', 'Public Assistance', 'Application Processing'];

function seedFor(providerId: string) {
  let value = 0;
  for (const char of providerId) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

function makeSeedReports(providerId: string): CommunityExperience[] {
  const seed = seedFor(providerId);
  const count = 24 + (seed % 7);
  return Array.from({ length: count }, (_, index) => {
    const day = 21 - index;
    const hour = 8 + ((seed + index * 3) % 9);
    const minute = (seed + index * 17) % 60;
    const waitMinutes = 8 + ((seed + index * 11) % 38);
    const processingMinutes = 9 + ((seed + index * 7) % 28);
    const overallExperience = waitMinutes > 35 ? 3 : index % 4 === 0 ? 4 : 5;
    return {
      id: `seed-${providerId}-${index + 1}`,
      providerId,
      author: index % 3 === 0 ? 'Anonymous resident' : ['Liza T.', 'Rafael C.', 'Mika P.', 'Juan D.'][index % 4],
      serviceType: serviceTypes[(seed + index) % serviceTypes.length],
      visitDate: `2026-10-${String(day).padStart(2, '0')}`,
      visitTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      waitMinutes,
      processingMinutes,
      available: index % 9 === 0 ? 'Partially available' : 'Yes',
      informationAccurate: index % 7 === 0 ? 'Somewhat accurate' : 'Yes',
      serviceQuality: overallExperience,
      accessibility: index % 5 === 0 ? 4 : 5,
      overallExperience,
      note: notes[(seed + index) % notes.length],
      sentiment: overallExperience >= 4 ? 'Positive' : waitMinutes > 35 ? 'Needs attention' : 'Neutral',
      source: 'prototype-seed',
    };
  });
}

function readLocalReports(): CommunityExperience[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCommunityExperiences(providerId: string) {
  return [
    ...readLocalReports().filter((report) => report.providerId === providerId),
    ...makeSeedReports(providerId),
  ].sort((a, b) => `${b.visitDate}T${b.visitTime}`.localeCompare(`${a.visitDate}T${a.visitTime}`));
}

export function saveCommunityExperience(report: Omit<CommunityExperience, 'id' | 'source'>) {
  if (typeof window === 'undefined') return null;
  const record: CommunityExperience = {
    ...report,
    id: `local-${Date.now()}`,
    source: 'local-submission',
  };
  const current = readLocalReports();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...current].slice(0, 120)));
  return record;
}

export function ratingLabel(value: number) {
  if (value >= 5) return 'Excellent';
  if (value >= 4) return 'Very Good';
  if (value >= 3) return 'Good';
  if (value >= 2) return 'Fair';
  return 'Poor';
}

export function formatReportTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export function formatReportDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
