export interface Service {
  id: number;
  title: string;
  slug: string;
  category: string;
  category_display: string;
  short_description: string;
  long_description?: string;
  image: string | null;
  icon: string;
  display_order?: number;
}

export interface Industry {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image: string | null;
  icon: string;
  display_order?: number;
}

export interface Location {
  id: number;
  name: string;
  slug: string;
  state: string;
  is_primary: boolean;
}

export interface CompanySettings {
  company_name: string;
  tagline: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp_number: string;
  email_primary: string;
  email_enquiries: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  google_maps_url: string;
  office_hours: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  twitter_url: string;
  logo: string | null;
}

export type IndustryChoice =
  | 'hotel_hospitality'
  | 'hospital_healthcare'
  | 'industrial'
  | 'manufacturing'
  | 'corporate'
  | 'commercial'
  | 'resort'
  | 'residency'
  | 'other';

export interface EnquiryPayload {
  name: string;
  company_name?: string;
  mobile_number: string;
  whatsapp_number?: string;
  industry: IndustryChoice;
  service?: number;
  service_name_freeform?: string;
  manpower_required?: number;
  location?: number;
  location_freeform?: string;
  preferred_start_date?: string;
  message?: string;
}

export interface ContactPayload {
  name: string;
  mobile_number: string;
  subject?: string;
  message: string;
}

export interface ApiMessageResponse {
  detail: string;
}
