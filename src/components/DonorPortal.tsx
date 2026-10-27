import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  Heart, 
  ShieldCheck, 
  Save, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Donor, AvailabilityStatus } from '../types';
import { calculateEligibility, formatIndianDate } from '../utils/helpers';

interface DonorPortalProps {
  donors: Donor[];
  onUpdateDonor: (donorId: string, updates: Partial<Donor>) => Promise<void>;
  onRegisterClick: () => void;
}

export const DonorPortal: React.FC<DonorPortalProps> = ({
  donors,
  onUpdateDonor,
  onRegisterClick
}) => {
  const [lookupQuery, setLookupQuery] = useState('');
  const [activeDonor, setActiveDonor] = useState<Donor | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // Editable fields in donor portal
  const [status, setStatus] = useState<AvailabilityStatus>('Available');
  const [lastDate, setLastDate] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setUpdateSuccess(null);

    const query = lookupQuery.trim().toLowerCase();
    const queryDigits = query.replace(/\D/g, '');

    if (!query) {
      setLookupError('Please enter your registered mobile number or email address.');
      return;
    }

    const matched = donors.find((d) => {
      const dPhoneDigits = d.phone.replace(/\D/g, '');
      const isPhoneMatch = queryDigits.length >= 10 && dPhoneDigits.includes(queryDigits);
      const isEmailMatch = d.email.toLowerCase() === query;
      return isPhoneMatch || isEmailMatch;
    });

    if (matched) {
      setActiveDonor(matched);
      setStatus(matched.availability_status);
      setLastDate(matched.last_donation_date || '');
      setPhone(matched.phone);
      setCity(matched.city);
    } else {
      setLookupError(`No registered donor found matching "${lookupQuery}". Please check your details or register as a new donor.`);
    }
  };

  const handleSaveUpdates = async () => {
    if (!activeDonor) return;
    setIsUpdating(true);
    setUpdateSuccess(null);

    try {
      await onUpdateDonor(activeDonor.id, {
        availability_status: status,
        last_donation_date: lastDate,
        phone,
        city
      });

      // Update local state
      setActiveDonor((prev) => prev ? {
        ...prev,
        availability_status: status,
        last_donation_date: lastDate,
        phone,
        city
      } : null);

      setUpdateSuccess('Your profile, availability status, and donation cooldown have been updated successfully!');
      setTimeout(() => setUpdateSuccess(null), 5000);
    } catch (err: any) {
      setLookupError(err.message || 'Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRecordNewDonationToday = async () => {
    if (!activeDonor) return;
    const todayStr = new Date().toISOString().split('T')[0];
    setLastDate(todayStr);
    setStatus('Not Available'); // Automatic cooldown after donation

    setIsUpdating(true);
    try {
      await onUpdateDonor(activeDonor.id, {
        last_donation_date: todayStr,
        availability_status: 'Not Available',
        total_donations: (activeDonor.total_donations || 1) + 1
      });

      setActiveDonor((prev) => prev ? {
        ...prev,
        last_donation_date: todayStr,
        availability_status: 'Not Available',
        total_donations: (prev.total_donations || 1) + 1
      } : null);

      setUpdateSuccess('Awesome! New donation recorded for today. Your 90-day cooldown interval is now active.');
    } catch (err: any) {
      setLookupError(err.message || 'Failed to record donation.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-red-200">
          <UserCheck className="w-4 h-4" />
          <span>Donor Self-Service Portal</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Manage Your Availability & Cooldown
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm">
          Travelling, unwell, or recently donated? Toggle your availability status anytime to prevent untimely emergency calls, or track your 90-day recovery timeline.
        </p>
      </div>

      {/* Lookup Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleLookup} className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Look up your Donor Record by Phone Number or Email:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="e.g. 9811234567 or rahul.sharma@gmail.com"
                id="donor-portal-lookup-input"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              id="donor-portal-lookup-btn"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-red-600/20 transition-all cursor-pointer"
            >
              Find My Profile
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Quick test lookup: <code>9811234567</code> (Rahul) or <code>9820187654</code> (Pooja)</span>
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-red-600 font-semibold hover:underline cursor-pointer"
            >
              Not registered? Register here
            </button>
          </div>
        </form>

        {lookupError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start space-x-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{lookupError}</span>
          </div>
        )}

        {updateSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{updateSuccess}</span>
          </div>
        )}
      </div>

      {/* Active Donor Profile & Management Card */}
      {activeDonor && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-8 animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Header Profile Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-2xl shadow-md">
                {activeDonor.blood_group}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">{activeDonor.name}</h3>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeDonor.city}, {activeDonor.state} • Registered: {formatIndianDate(activeDonor.registered_on)}
                </p>
              </div>
            </div>

            {/* Live calculated eligibility */}
            {(() => {
              const elig = calculateEligibility(lastDate);
              return (
                <div className="text-right">
                  <span className={`inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full ${
                    elig.isEligible && status === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${elig.isEligible && status === 'Available' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span>{elig.isEligible && status === 'Available' ? 'Ready to Donate Today' : 'Cooldown / Unavailable'}</span>
                  </span>
                </div>
              );
            })()}
          </div>

          {/* 90-Day Cooldown Progress Tracker */}
          {(() => {
            const eligibility = calculateEligibility(lastDate);
            return (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-slate-900 text-sm">90-Day Medical Recovery & Cooldown Meter</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {eligibility.daysRemaining > 0 ? `${eligibility.daysRemaining} Days Left` : '100% Ready'}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      eligibility.isEligible ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${eligibility.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Last Donation: <strong>{eligibility.lastDonationFormatted}</strong></span>
                  <span>Eligible Again: <strong>{eligibility.eligibleDate}</strong></span>
                </div>
              </div>
            );
          })()}

          {/* Edit Controls */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 text-base uppercase tracking-wider text-xs">
              Update Profile & Status:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Availability Status Toggle */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Emergency Availability Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('Available')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      status === 'Available'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Available</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('Not Available')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      status === 'Not Available'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Unavailable</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Switch to "Unavailable" if you are travelling, busy, or under medication.
                </p>
              </div>

              {/* Last Donation Date */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Last Donation Date:
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={lastDate}
                  onChange={(e) => setLastDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={handleRecordNewDonationToday}
                  disabled={isUpdating}
                  className="text-xs text-red-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer pt-1"
                >
                  <Heart className="w-3.5 h-3.5 fill-red-600" />
                  <span>I just donated blood today!</span>
                </button>
              </div>

            </div>

            {/* Save Button Bar */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveUpdates}
                disabled={isUpdating}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center space-x-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isUpdating ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
