import { BloodGroup, DonationEligibility } from '../types';

export const COOLING_DAYS_INTERVAL = 90; // Standard 90 days interval between whole blood donations

/**
 * Computes eligibility status based on last donation date
 */
export function calculateEligibility(lastDonationDate?: string): DonationEligibility {
  if (!lastDonationDate || lastDonationDate.trim() === '') {
    return {
      isEligible: true,
      daysRemaining: 0,
      eligibleDate: 'Immediately (First-Time / Ready)',
      lastDonationFormatted: 'No previous record / First-time donor',
      progressPercent: 100,
      message: 'Eligible to donate today'
    };
  }

  const lastDate = new Date(lastDonationDate);
  if (isNaN(lastDate.getTime())) {
    return {
      isEligible: true,
      daysRemaining: 0,
      eligibleDate: 'Ready',
      lastDonationFormatted: 'Unknown',
      progressPercent: 100,
      message: 'Eligible to donate'
    };
  }

  const today = new Date();
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const eligibleTimestamp = lastDate.getTime() + COOLING_DAYS_INTERVAL * 24 * 60 * 60 * 1000;
  const eligibleDateObj = new Date(eligibleTimestamp);
  const eligibleDateStr = eligibleDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const lastDonationFormatted = lastDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  if (diffDays >= COOLING_DAYS_INTERVAL) {
    return {
      isEligible: true,
      daysRemaining: 0,
      eligibleDate: 'Eligible Now',
      lastDonationFormatted,
      progressPercent: 100,
      message: `Completed ${diffDays} days since last donation. Eligible to donate!`
    };
  } else {
    const daysRemaining = COOLING_DAYS_INTERVAL - diffDays;
    const progress = Math.min(100, Math.max(0, Math.round((diffDays / COOLING_DAYS_INTERVAL) * 100)));
    return {
      isEligible: false,
      daysRemaining,
      eligibleDate: eligibleDateStr,
      lastDonationFormatted,
      progressPercent: progress,
      message: `Cooldown active: ${daysRemaining} days remaining (Eligible on ${eligibleDateStr})`
    };
  }
}

/**
 * Checks compatibility between donor group and recipient required group
 */
export function isBloodCompatible(donorGroup: BloodGroup, neededGroup: BloodGroup): boolean {
  if (donorGroup === neededGroup) return true;
  // O- is universal red blood cell donor
  if (donorGroup === 'O-') return true;

  // O+ can donate to O+, A+, B+, AB+
  if (donorGroup === 'O+' && ['O+', 'A+', 'B+', 'AB+'].includes(neededGroup)) return true;

  // A- can donate to A-, A+, AB-, AB+
  if (donorGroup === 'A-' && ['A-', 'A+', 'AB-', 'AB+'].includes(neededGroup)) return true;

  // A+ can donate to A+, AB+
  if (donorGroup === 'A+' && ['A+', 'AB+'].includes(neededGroup)) return true;

  // B- can donate to B-, B+, AB-, AB+
  if (donorGroup === 'B-' && ['B-', 'B+', 'AB-', 'AB+'].includes(neededGroup)) return true;

  // B+ can donate to B+, AB+
  if (donorGroup === 'B+' && ['B+', 'AB+'].includes(neededGroup)) return true;

  // AB- can donate to AB-, AB+
  if (donorGroup === 'AB-' && ['AB-', 'AB+'].includes(neededGroup)) return true;

  // AB+ can only donate to AB+
  if (donorGroup === 'AB+' && neededGroup === 'AB+') return true;

  return false;
}

/**
 * Normalizes Indian Phone to clean numeric format
 */
export function cleanIndianPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+${digitsOnly}`;
  }
  return phone;
}

/**
 * WhatsApp message link builder with prefilled message
 */
export function generateWhatsAppLink(
  phone: string,
  donorName: string,
  bloodGroup: string,
  patientName?: string,
  hospital?: string,
  city?: string
): string {
  const cleanNumber = phone.replace(/\D/g, '');
  const targetNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

  let msg = `Namaste ${donorName} ji,\n\nI am contacting you through the RaktDaan Blood Donor Directory.`;
  if (patientName && hospital) {
    msg += `\n\n🚨 *URGENT BLOOD REQUIREMENT*\n- Patient: ${patientName}\n- Required Blood Group: ${bloodGroup}\n- Hospital: ${hospital}, ${city || ''}\n\nCould you please let us know if you are currently available to donate? Your generous help can save a life today.`;
  } else {
    msg += `\n\nWe are looking for an urgent ${bloodGroup} blood donor in ${city || 'our city'}. Please let us know if you are currently available to donate blood. Thank you!`;
  }

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`;
}

/**
 * Format relative or standard timestamp
 */
export function formatIndianDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatTimeAgo(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
