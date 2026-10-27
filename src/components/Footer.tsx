import React from 'react';
import { Heart, PhoneCall, ShieldCheck, Activity, MapPin, Mail, Droplet } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      
      {/* Indian Helpline Emergency Banner in Footer */}
      <div className="bg-gradient-to-r from-red-800 to-rose-900 text-white py-6 px-4 border-b border-red-700/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-white">Need Urgent Blood in India?</h4>
              <p className="text-xs text-rose-100">National Toll-Free Blood Helpline: 104 • Ambulance: 108 • NBTC: 1910</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="tel:104"
              className="bg-white text-red-700 hover:bg-rose-50 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
            >
              📞 Call 104
            </a>
            <a
              href="tel:108"
              className="bg-red-950/80 hover:bg-red-950 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors border border-white/20"
            >
              🚨 Call 108
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Rakt<span className="text-red-500">Daan</span> India
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A community-driven, non-commercial voluntary blood donor awareness and emergency directory dedicated to connecting voluntary donors with patients across Indian cities.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>100% Free & Voluntary Initiative</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Home & Awareness Facts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Search Donors by Blood Group
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('emergency')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Active Emergency Requests
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Register as a Lifesaver Donor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal')} className="hover:text-red-400 transition-colors cursor-pointer">
                  Donor Cooldown & Status Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Indian Blood Helplines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">National Helplines</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center justify-between">
                <span>Blood Bank Helpline:</span>
                <a href="tel:104" className="text-red-400 font-bold hover:underline">104</a>
              </li>
              <li className="flex items-center justify-between">
                <span>National Emergency:</span>
                <a href="tel:112" className="text-red-400 font-bold hover:underline">112</a>
              </li>
              <li className="flex items-center justify-between">
                <span>NBTC Guidance:</span>
                <a href="tel:1910" className="text-red-400 font-bold hover:underline">1910</a>
              </li>
              <li className="flex items-center justify-between">
                <span>National Health Portal:</span>
                <a href="tel:1075" className="text-red-400 font-bold hover:underline">1075</a>
              </li>
              <li className="flex items-center justify-between">
                <span>Red Cross HQ:</span>
                <span className="text-slate-300 font-mono text-[11px]">011-23716441</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Medical Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Medical Guidelines</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In accordance with National Blood Transfusion Council (NBTC) norms, donors must be aged 18–65 with body weight ≥ 45 kg and maintain a strict 90-day cooldown interval between donations.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('admin')}
                className="text-xs text-slate-400 hover:text-white underline flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                <span>Administrator Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RaktDaan India. Voluntary Blood Donor Network.</p>
          <p className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for Indian Citizens & Healthcare Support</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
