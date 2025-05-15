
export type TenderStatus = 'open' | 'closed' | 'in_review' | 'awarded';
export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface Tender {
  id: string;
  user_id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  file_url?: string | null;
  status: TenderStatus;
  created_at: string;
}

export interface Offer {
  id: string;
  tender_id: string;
  user_id: string;
  price: number;
  delivery_time: number;
  message: string;
  file_url?: string | null;
  status: OfferStatus;
  created_at: string;
}
