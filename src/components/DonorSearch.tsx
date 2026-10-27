import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Calendar,
  AlertCircle,
  ExternalLink,
  PhoneCall,
  ChevronDown
} from 'lucide-react';
import { Donor, BloodGroup, AvailabilityStatus } from '../types';
import { INDIAN_CITIES } from '../data/initialData';
import { calculateEligibility, generateWhatsAppLink, formatIndianDate } from '../utils/helpers';

interface DonorSearchProps {
  donors: Donor[];
  initialBloodGroup?: BloodGroup | 'ALL';
  onRegisterClick: () => void;
  onRequestClick: () => void;
}

const BLOOD_GROUPS_ALL: (BloodGroup | 'ALL')[] = ['ALL', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const DonorSearch: React.FC<DonorSearchProps> = ({
  donors,
  initialBloodGroup = 'ALL',
  onRegisterClick,
  onRequestClick
}) => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>(initialBloodGroup);
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE_ONLY'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDonorForModal, setSelectedDonorForModal] = useState<Donor | null>(null);

  // Filtered Donors list
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      // Blood Group Match
      if (selectedBloodGroup !== 'ALL' && donor.blood_group !== selectedBloodGroup) {
        return false;
      }

      // City Match
      if (selectedCity !== 'All Cities' && donor.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Availability Filter
      if (availabilityFilter === 'AVAILABLE_ONLY' && donor.availability_status !== 'Available') {
        return false;
      }

      // Query Search (Name, City, State, Pincode)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = donor.name.toLowerCase().includes(query);
        const matchesCity = donor.city.toLowerCase().includes(query);
        const matchesState = donor.state.toLowerCase().includes(query);
        const matchesPincode = donor.pincode?.toLowerCase().includes(query);
        const matchesNotes = donor.notes?.toLowerCase().includes(query);

        if (!matchesName && !matchesCity && !matchesState && !matchesPincode && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [donors, selectedBloodGroup, selectedCity, availabilityFilter, searchQuery]);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-red-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Searchable National Blood Donor Directory</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Blood Donors by Blood Group & City
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Quickly query verified voluntary donors. Every profile includes 90-day cooldown & real-time availability.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onRequestClick}
            className="bg-red-50 hover:bg-red-100 text-red-700 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl border border-red-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Post Emergency Request</span>
          </button>
          <button
            onClick={onRegisterClick}
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Register as Donor</span>
          </button>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-6">
        
        {/* Blood Group Filter Chips */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Filter by Blood Group:
          </label>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS_ALL.map((group) => {
              const isSelected = selectedBloodGroup === group;
              return (
                <button
                  key={group}
                  onClick={() => setSelectedBloodGroup(group)}
                  id={`filter-bg-${group}`}
                  className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/25 scale-102'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {group === 'ALL' ? 'All Blood Groups' : group}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters: City + Availability + Keyword Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 pt-4 border-t border-slate-100">
          
          {/* City Selection */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select City / Location:
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                id="search-city-select"
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
              >
                {INDIAN_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Availability Status Filter */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Availability Status:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAvailabilityFilter('ALL')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  availabilityFilter === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('AVAILABLE_ONLY')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1 transition-colors cursor-pointer ${
                  availabilityFilter === 'AVAILABLE_ONLY'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Available Only</span>
              </button>
            </div>
          </div>

          {/* Keyword Search */}
          <div className="lg:col-span-4 sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Search by Name / Pincode:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Rahul, AIIMS, 110001..."
                id="search-keyword-input"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{filteredDonors.length}</strong> registered donors
            {selectedBloodGroup !== 'ALL' && <span> for blood group <strong className="text-red-600">{selectedBloodGroup}</strong></span>}
            {selectedCity !== 'All Cities' && <span> in <strong className="text-slate-900">{selectedCity}</strong></span>}
          </div>
          {(selectedBloodGroup !== 'ALL' || selectedCity !== 'All Cities' || availabilityFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBloodGroup('ALL');
                setSelectedCity('All Cities');
                setAvailabilityFilter('ALL');
                setSearchQuery('');
              }}
              className="text-red-600 hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Donors Results Grid */}
      {filteredDonors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map((donor) => {
            const eligibility = calculateEligibility(donor.last_donation_date);
            const isAvailable = donor.availability_status === 'Available' && eligibility.isEligible;
            const waLink = generateWhatsAppLink(donor.phone, donor.name, donor.blood_group, undefined, undefined, donor.city);

            return (
              <div
                key={donor.id}
                id={`donor-card-${donor.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 relative overflow-hidden group"
              >
                {/* Top header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
                      {donor.blood_group}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-red-600 transition-colors">
                          {donor.name}
                        </h3>
                        {donor.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Volunteer" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{donor.city}, {donor.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div>
                    {isAvailable ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{eligibility.daysRemaining > 0 ? `Cooldown (${eligibility.daysRemaining}d)` : 'Unavailable'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Donor Details Card Body */}
                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs text-slate-600 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Age / Gender:</span>
                    <span className="font-semibold text-slate-800">{donor.age} yrs {donor.gender ? `• ${donor.gender}` : ''}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Donated:</span>
                    <span className="font-semibold text-slate-800">
                      {donor.last_donation_date ? formatIndianDate(donor.last_donation_date) : 'First-time donor'}
                    </span>
                  </div>

                  {eligibility.daysRemaining > 0 ? (
                    <div className="pt-1.5 border-t border-slate-200/60">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-amber-700 font-semibold flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>90-Day Cooldown:</span>
                        </span>
                        <span className="font-bold text-amber-900">{eligibility.daysRemaining} days left</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-amber-500 h-1.5 rounded-full" 
                          style={{ width: `${eligibility.progressPercent}%` }} 
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Eligible again on {eligibility.eligibleDate}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-emerald-700 font-medium text-[11px] pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready & Eligible for Whole Blood Donation</span>
                    </div>
                  )}

                  {donor.notes && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-1 pt-1 border-t border-slate-200/40">
                      "{donor.notes}"
                    </p>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${donor.phone}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Donor</span>
                  </a>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-red-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Donors Found for this Filter</h3>
          <p className="text-xs sm:text-sm text-slate-500">
            We currently don't have matching registered donors for <strong>{selectedBloodGroup !== 'ALL' ? selectedBloodGroup : 'this query'}</strong> in <strong>{selectedCity}</strong>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedBloodGroup('ALL');
                setSelectedCity('All Cities');
                setAvailabilityFilter('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Clear Filters
            </button>
            <button
              onClick={onRegisterClick}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
            >
              Be the First Donor Here
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
