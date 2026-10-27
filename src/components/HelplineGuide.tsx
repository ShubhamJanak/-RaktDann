import React from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  Building2, 
  MapPin, 
  ExternalLink, 
  Heart, 
  Activity, 
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';
import { INDIAN_HELPLINES } from '../data/initialData';

const STATE_BLOOD_BANKS = [
  { state: 'Delhi NCR', helpline: '104 / 011-23716441', hospital: 'AIIMS, Safdarjung & Red Cross HQ', time: '24x7' },
  { state: 'Maharashtra (Mumbai/Pune)', helpline: '104 / 022-24107000', hospital: 'KEM Hospital & State Blood Transfusion Council', time: '24x7' },
  { state: 'Karnataka (Bengaluru)', helpline: '104 / 080-22210555', hospital: 'Victoria Hospital & NIMHANS Blood Center', time: '24x7' },
  { state: 'Telangana (Hyderabad)', helpline: '104 / 040-23466666', hospital: 'Osmania General Hospital & NIMS', time: '24x7' },
  { state: 'Tamil Nadu (Chennai)', helpline: '104 / 044-25305000', hospital: 'Rajiv Gandhi Govt General Hospital', time: '24x7' },
  { state: 'West Bengal (Kolkata)', helpline: '104 / 033-22231589', hospital: 'Medical College & Hospital Kolkata & Central Blood Bank', time: '24x7' },
  { state: 'Uttar Pradesh (Lucknow)', helpline: '104 / 0522-2257540', hospital: 'KGMU Blood Transfusion Dept', time: '24x7' },
  { state: 'Rajasthan (Jaipur)', helpline: '104 / 0141-2560291', hospital: 'SMS Medical College Blood Bank', time: '24x7' },
  { state: 'Gujarat (Ahmedabad)', helpline: '104 / 079-22686565', hospital: 'Civil Hospital Ahmedabad & Red Cross', time: '24x7' },
  { state: 'Punjab & Chandigarh', helpline: '104 / 0172-2756565', hospital: 'PGIMER Chandigarh Blood Center', time: '24x7' },
  { state: 'Kerala (Kochi/TVM)', helpline: '104 / 0471-2555722', hospital: 'Govt Medical College Blood Bank', time: '24x7' },
  { state: 'Bihar (Patna)', helpline: '104 / 0612-2300080', hospital: 'PMCH Patna Blood Center', time: '24x7' }
];

export const HelplineGuide: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-red-200">
          <PhoneCall className="w-4 h-4" />
          <span>Government of India & Emergency Directory</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          24x7 Indian Blood Bank & Emergency Helplines
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          In severe trauma, rare blood group shortages, or disaster situations, connect directly with official Government of India health desks and state blood bank networks.
        </p>
      </div>

      {/* Primary National 24x7 Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDIAN_HELPLINES.map((hl) => (
          <div
            key={hl.number}
            className={`rounded-3xl border p-6 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
                  {hl.number}
                </span>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>24x7 Toll-Free</span>
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{hl.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{hl.description}</p>
            </div>

            <a
              href={hl.action}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md shadow-red-600/20 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Direct Dial {hl.number}</span>
            </a>
          </div>
        ))}
      </div>

      {/* State-Wise Blood Bank Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              State-Wise Official Blood Bank Desks
            </h3>
            <p className="text-xs text-slate-500">Government Medical College Blood Transfusion Centers</p>
          </div>
          <span className="text-xs text-slate-400">All India Coverage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">State / Union Territory</th>
                <th className="py-3 px-3">Major Regional Center</th>
                <th className="py-3 px-3">Helpline / Contact</th>
                <th className="py-3 px-3 text-right">Instant Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {STATE_BLOOD_BANKS.map((row) => (
                <tr key={row.state} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{row.state}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{row.hospital}</td>
                  <td className="py-3 px-3 font-mono font-bold text-red-600">{row.helpline}</td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={`tel:${row.helpline.split('/')[0].trim()}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3 h-3 text-emerald-400" />
                      <span>Call Desk</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* e-RaktKosh National Portal Notice */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white">e-RaktKosh (Digital India MoHFW Integration)</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              e-RaktKosh enforces standard operating procedures across all licensed blood banks in India. For finding live unit stocks in government hospital blood banks, citizens can also reference the official national portal.
            </p>
          </div>
        </div>
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
          <span className="bg-white/10 px-3 py-1.5 rounded-lg text-slate-300 font-mono">
            Portal: https://eraktkosh.in
          </span>
          <span className="text-slate-400">
            Compliant with Drug & Cosmetics Act (India) Blood Bank Standards
          </span>
        </div>
      </div>

    </div>
  );
};
