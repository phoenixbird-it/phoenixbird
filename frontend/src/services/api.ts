import { apiClient } from './apiClient';
import type {
  ApiMessageResponse,
  CompanySettings,
  ContactPayload,
  EnquiryPayload,
  Industry,
  Location,
  Service,
} from '../types';

export const getServices = (category?: string) =>
  apiClient.get<Service[]>(`/services/${category ? `?category=${category}` : ''}`);

export const getServiceBySlug = (slug: string) => apiClient.get<Service>(`/services/${slug}/`);

export const getIndustries = () => apiClient.get<Industry[]>('/industries/');

export const getLocations = () => apiClient.get<Location[]>('/locations/');

export const getCompanySettings = () => apiClient.get<CompanySettings>('/company-settings/');

export const submitEnquiry = (payload: EnquiryPayload) =>
  apiClient.post<ApiMessageResponse>('/enquiries/', payload);

export const submitContactMessage = (payload: ContactPayload) =>
  apiClient.post<ApiMessageResponse>('/contact/', payload);
