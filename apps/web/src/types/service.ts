export type ServiceCategory =
  | 'All'
  | 'Government'
  | 'Healthcare'
  | 'Clinics'
  | 'Food'
  | 'Banks'
  | 'Education'
  | 'Pharmacy'
  | 'Transportation'
  | 'Social Welfare'
  | 'Utilities'
  | 'Open Now'
  | 'Shortest Wait'
  | 'Highest Reliability'
  | 'Accessible';

export interface ServiceSummary {
  id: string;
  name: string;
  category: string;
  address: string;
  isOpen: boolean;
  closesIn?: string;
  averageWaitMinutes: number;
  processingTimeText?: string;
  reliability: number;
  score: number;
  insight: string;
  distanceKm: number;
  coords: [number, number];
  image: string;
  images?: string[];
  confidence: 'High' | 'Moderate' | 'Low';
  reports: number;
  phone?: string;
}

export interface MetricDetail {
  score: number;
  reportsCount: number;
  percentage: number;
  description: string;
}

export interface BusyHourItem {
  hour: string;
  value: number;
  level: 'quiet' | 'moderate' | 'busiest';
}

export interface CommunityExperienceItem {
  id: string;
  userName: string;
  userAvatar?: string;
  date: string;
  serviceType: string;
  waitTime: string;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface ServiceDetail extends ServiceSummary {
  phone: string;
  description: string;
  operatingHoursText: string;
  images: string[];
  intelligence: {
    communityConfidence: 'High' | 'Moderate' | 'Low';
    confidenceReportsCount: number;
    serviceQuality: MetricDetail;
    reliability: MetricDetail;
    timeEfficiency: MetricDetail;
    informationAccuracy: MetricDetail;
    accessibility: MetricDetail;
  };
  busyHours: {
    peakNotice: string;
    hourly: BusyHourItem[];
    morningWait: string;
    middayWait: string;
    afternoonWait: string;
    trendSummary: string;
  };
  servicesOffered: { title: string; desc: string }[];
  accessibilityFeatures: string[];
  recentExperiences: CommunityExperienceItem[];
}

export interface FilterOptions {
  openNow: boolean;
  category: ServiceCategory;
  accessibility: string[];
  maxWaitTime: string;
  minReliability: string;
  minConfidence: string;
  sortBy: 'Nearest' | 'Shortest Wait' | 'Highest Reliability' | 'Highest TaymPers Score' | 'Most Community Data';
}

export interface ContributionData {
  serviceId: string;
  serviceName: string;
  serviceType: string;
  visitDate: string;
  visitTime: string;
  waitTime: string;
  processingTime: string;
  isAvailable: string;
  isAccuracyCorrect: string;
  additionalDetails: string;
  serviceQualityRating: string;
  accessibilityRating: string;
  overallRating: string;
  accessibilityNotes: string;
}
