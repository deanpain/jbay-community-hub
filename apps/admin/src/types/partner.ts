export type WorkshopStatus = 'not_started' | 'in_progress' | 'completed';

export interface Partner {
  id: string;
  name: string;
  type: string;
  contact_name: string;
  contact_email: string;
  website: string;
  workshop_status: WorkshopStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  listing_count?: number; // computed field
}

export type PartnerInput = Omit<Partner, 'id' | 'created_at' | 'updated_at' | 'listing_count'>;
