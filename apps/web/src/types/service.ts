export interface ServiceSummary {
  id: string;
  name: string;
  category: string;
  address: string;
  isOpen: boolean;
  averageWaitMinutes: number;
  reliability: number;
  score: number;
  insight: string;
}
