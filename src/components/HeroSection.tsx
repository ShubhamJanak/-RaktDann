import React from 'react';
import { 
  Heart, 
  Search, 
  UserPlus, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  Activity, 
  MapPin, 
  PhoneCall 
} from 'lucide-react';
import { BloodGroup } from '../types';

interface HeroSectionProps {
  onNavigate: (tab: string, preselectedGroup?: BloodGroup) => void;
  totalDonors: number;
  availableDonors: number;
  activeRequestsCount: number;
  citiesCount: number;
}

const BLOOD_GROUPS_LIST: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  totalDonors,
  availableDonors,
  activeRequestsCount,
  citiesCount
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-50/80 via-white to-slate-50 border-b border-rose-100">
      {/* Decorative subtle background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full border border-red-200 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span>National Blood Donor Network & Emergency Directory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Donate Blood, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-700">
                Save Lives.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Every two seconds, someone in India needs blood for surgeries, accident trauma, cancer treatment, or thalassemia. Connect instantly with verified voluntary blood donors across India in times of emergency.
            </p>

            {/* Quick Action Button Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => onNavigate('search')}
                id="hero-find-donor-btn"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all duration-200 flex items-center space-x-2 cursor-pointer transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <Search className="w-5 h-5" />
                <span>Find Donors Now</span>
              </button>

              <button
                onClick={() => onNavigate('register')}
                id="hero-register-donor-btn"
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3.5 rounded-xl border-2 border-slate-200 hover:border-red-300 shadow-sm transition-all duration-200 flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
              >
                <UserPlus className="w-5 h-5 text-red-600" />
                <span>Register as Donor</span>
              </button>

              <button
                onClick={() => onNavigate('emergency')}
                id="hero-emergency-request-btn"
                className="bg-rose-50 hover:bg-rose-100 text-red-700 font-bold px-5 py-3.5 rounded-xl border border-red-200 transition-all duration-200 flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Emergency Need</span>
              </button>
            </div>

            {/* Fast Blood Group Picker Strip */}
            <div className="pt-4 border-t border-slate-200/80">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Quick Search by Blood Group:
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {BLOOD_GROUPS_LIST.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => onNavigate('search', bg)}
                    className="px-3 py-1.5 bg-white hover:bg-red-600 hover:text-white text-slate-800 font-bold text-xs sm:text-sm rounded-lg border border-slate-200 hover:border-red-600 transition-all duration-150 shadow-2xs cursor-pointer"
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Stats & Live Overview Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Directory Health & Live Status</h3>
                    <p className="text-xs text-slate-500">Real-time voluntary network</p>
                  </div>
                </div>
                <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live 24x7</span>
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-medium">Registered Donors</span>
                    <Users className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalDonors}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Verified across India</p>
                </div>

                <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center justify-between text-emerald-800 mb-1">
                    <span className="text-xs font-medium">Ready Available</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700">{availableDonors}</div>
                  <p className="text-[11px] text-emerald-600 mt-1">Eligible & active today</p>
                </div>

                <div className="bg-rose-50/70 rounded-xl p-4 border border-rose-100">
                  <div className="flex items-center justify-between text-rose-800 mb-1">
                    <span className="text-xs font-medium">Emergency Requests</span>
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-700">{activeRequestsCount}</div>
                  <p className="text-[11px] text-rose-600 mt-1">Active patient cases</p>
                </div>

                <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between text-blue-800 mb-1">
                    <span className="text-xs font-medium">Cities Covered</span>
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-700">{citiesCount}+</div>
                  <p className="text-[11px] text-blue-600 mt-1">Metro & Tier 1/2 hubs</p>
                </div>
              </div>

              {/* Indian Emergency Helpline Quick Call Banner */}
              <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-xl p-4 text-white flex items-center justify-between shadow-md">
                <div className="space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-100">
                    Emergency Blood Need in Hospital?
                  </span>
                  <p className="text-sm font-bold text-white">Call National Blood Helpline</p>
                </div>
                <a
                  href="tel:104"
                  className="bg-white text-red-600 hover:bg-rose-50 font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow-xs flex items-center space-x-1.5"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 104</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
