import React, { useState } from 'react';
import { 
  UserPlus, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Scale, 
  Sparkles,
  Award,
  Download,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Donor, BloodGroup, AvailabilityStatus } from '../types';
import { INDIAN_CITIES } from '../data/initialData';
import { calculateEligibility, formatIndianDate } from '../utils/helpers';

interface DonorRegistrationProps {
  onRegisterDonor: (newDonor: Omit<Donor, 'id' | 'registered_on'>) => Promise<Donor>;
  onNavigateToSearch: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const DonorRegistration: React.FC<DonorRegistrationProps> = ({
  onRegisterDonor,
  onNavigateToSearch
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(25);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [weight, setWeight] = useState<number | ''>(65);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(INDIAN_CITIES[1]); // New Delhi
  const [state, setState] = useState('Delhi NCR');
  const [pincode, setPincode] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('Available');
  const [willingEmergency, setWillingEmergency] = useState(true);
  const [notes, setNotes] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredDonor, setRegisteredDonor] = useState<Donor | null>(null);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleStateChangeByCity = (selectedCity: string) => {
    setCity(selectedCity);
    if (selectedCity === 'New Delhi') setState('Delhi NCR');
    else if (['Mumbai', 'Pune', 'Nagpur'].includes(selectedCity)) setState('Maharashtra');
    else if (selectedCity === 'Bengaluru') setState('Karnataka');
    else if (selectedCity === 'Hyderabad') setState('Telangana');
    else if (selectedCity === 'Chennai') setState('Tamil Nadu');
    else if (selectedCity === 'Kolkata') setState('West Bengal');
    else if (selectedCity === 'Jaipur') setState('Rajasthan');
    else if (selectedCity === 'Lucknow' || selectedCity === 'Varanasi') setState('Uttar Pradesh');
    else if (selectedCity === 'Ahmedabad' || selectedCity === 'Surat') setState('Gujarat');
    else if (selectedCity === 'Chandigarh') setState('Punjab / Chandigarh');
    else if (selectedCity === 'Bhopal' || selectedCity === 'Indore') setState('Madhya Pradesh');
    else if (selectedCity === 'Patna') setState('Bihar');
    else if (selectedCity === 'Kochi') setState('Kerala');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 18 || numAge > 65) {
      setFormError('Age must be strictly between 18 and 65 years as per Indian National Blood Transfusion Council regulations.');
      return;
    }

    const numWeight = Number(weight);
    if (isNaN(numWeight) || numWeight < 45) {
      setFormError('Weight must be at least 45 kg for safe whole blood donation.');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!termsAgreed) {
      setFormError('Please confirm the health criteria agreement to register.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phoneDigits.slice(-10)}`;
      const donorData: Omit<Donor, 'id' | 'registered_on'> = {
        name: name.trim(),
        age: numAge,
        gender,
        weight_kg: numWeight,
        blood_group: bloodGroup,
        phone: formattedPhone,
        email: email.trim().toLowerCase(),
        city,
        state,
        pincode: pincode.trim(),
        availability_status: availabilityStatus,
        last_donation_date: isFirstTime ? '' : lastDonationDate,
        total_donations: isFirstTime ? 0 : 1,
        willing_emergency: willingEmergency,
        verified: true,
        notes: notes.trim()
      };

      const result = await onRegisterDonor(donorData);
      setRegisteredDonor(result);
      triggerConfetti();
    } catch (err: any) {
      setFormError(err.message || 'Failed to complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* If registered successfully, show digital Indian Blood Donor ID Card */}
      {registeredDonor ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-in zoom-in-95">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Registration Successful!
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
              Thank you, <strong>{registeredDonor.name}</strong>. You are now registered in the National Blood Donor Directory. Here is your official Digital Donor Pass:
            </p>
          </div>

          {/* Digital Donor Card Display */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-red-700 via-rose-700 to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-red-500/30">
            {/* Background watermarks */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-2 right-4 text-8xl font-black text-white/5 pointer-events-none">
              {registeredDonor.blood_group}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-white fill-white" />
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide">RaktDaan India</h4>
                  <p className="text-[10px] text-rose-200">Voluntary Blood Donor ID</p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                Verified Hero
              </span>
            </div>

            {/* Donor info */}
            <div className="my-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-rose-200">Donor Name</span>
                <h3 className="text-xl font-black text-white">{registeredDonor.name}</h3>
                <p className="text-xs text-rose-100 mt-0.5">{registeredDonor.city}, {registeredDonor.state}</p>
                <p className="text-xs text-rose-200 mt-1">ID: #{registeredDonor.id.slice(-6).toUpperCase()}</p>
              </div>

              <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-red-600 shadow-md">
                <span className="text-[9px] uppercase font-bold tracking-tight text-slate-500">Group</span>
                <span className="text-2xl font-black leading-tight">{registeredDonor.blood_group}</span>
              </div>
            </div>

            {/* Footer details */}
            <div className="border-t border-white/20 pt-4 flex items-center justify-between text-xs text-rose-100">
              <div>
                <span>Age: <strong>{registeredDonor.age} yrs</strong></span>
                <span className="ml-3">Status: <strong>{registeredDonor.availability_status}</strong></span>
              </div>
              <span className="text-[10px] text-rose-300">Save 3 Lives</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save Donor Pass</span>
            </button>

            <button
              onClick={onNavigateToSearch}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md shadow-red-600/25"
            >
              <span>Explore Directory</span>
            </button>
          </div>
        </div>
      ) : (
        /* Main Registration Form */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
              <UserPlus className="w-4 h-4" />
              <span>Voluntary Indian Blood Donor Network</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Register as a Lifesaving Blood Donor
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Your registration takes under 2 minutes and helps hospital patients and accident victims find you in times of urgent need.
            </p>
          </div>

          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span className="font-medium">{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <span>1. Personal & Physical Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shubham Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Age (18 – 65 Yrs) *
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Must be 18–65 yrs</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Weight (kg, Min 45kg) *
                  </label>
                  <input
                    type="number"
                    min={45}
                    max={150}
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Minimum 45 kg required</span>
                </div>

              </div>
            </div>

            {/* Contact & Location Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <span>2. Contact & City Location</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    10-Digit Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="9811234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => handleStateChangeByCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    {INDIAN_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Area Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 110001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Availability *
                  </label>
                  <select
                    value={availabilityStatus}
                    onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Available">🟢 Available to Donate</option>
                    <option value="Not Available">🔴 Currently Unavailable</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Donation History & Cooldown */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <span>3. Last Donation History (90-Day Safety Interval)</span>
              </h3>
              
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFirstTime}
                    onChange={(e) => {
                      setIsFirstTime(e.target.checked);
                      if (e.target.checked) setLastDonationDate('');
                    }}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <span className="text-sm font-semibold text-slate-800">
                    I am a First-Time Blood Donor! (No prior donation date)
                  </span>
                </label>

                {!isFirstTime && (
                  <div className="max-w-xs">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Date of Last Blood Donation:
                    </label>
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={lastDonationDate}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Our system will automatically calculate your 90-day cooldown interval.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Health Criteria Declaration */}
            <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-red-900 block">
                    Voluntary Donor Health Declaration:
                  </span>
                  <p className="text-slate-600">
                    I confirm that I am in good health, weigh at least 45 kg, have had no major surgery or tattoos in the last 6 months, and agree to receive calls/messages from verified requesters in emergencies.
                  </p>
                </div>
              </div>

              <label className="flex items-center space-x-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <span className="font-bold text-slate-900 text-xs">
                  I agree to the guidelines and consent to voluntary registration.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                id="submit-donor-reg-btn"
                className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-5 h-5" />
                <span>{isSubmitting ? 'Registering...' : 'Register as Blood Donor'}</span>
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
