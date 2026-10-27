export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type AvailabilityStatus = 'Available' | 'Not Available';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE';

export type RequestStatus = 'Active' | 'Fulfilled' | 'Closed';

export interface Donor {
  id: string;
  name: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Other';
  blood_group: BloodGroup;
  city: string;
  state: string;
  phone: string;
  email: string;
  availability_status: AvailabilityStatus;
  last_donation_date: string; // YYYY-MM-DD or empty string for first-time
  registered_on: string; // ISO date string
  verified?: boolean;
  total_donations?: number;
  weight_kg?: number;
  willing_emergency?: boolean;
  pincode?: string;
  notes?: string;
}

export interface EmergencyRequest {
  id: string;
  patient_name: string;
  blood_group: BloodGroup;
  units_needed: number;
  units_fulfilled?: number;
  hospital: string;
  city: string;
  state: string;
  contact_name: string;
  contact: string;
  urgency: UrgencyLevel;
  requested_on: string; // ISO date string
  status: RequestStatus;
  medical_reason?: string;
  attendant_relation?: string;
  verified?: boolean;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'moderator';
}

export interface DonationEligibility {
  isEligible: boolean;
  daysRemaining: number;
  eligibleDate: string;
  lastDonationFormatted: string;
  progressPercent: number;
  message: string;
}
