import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  Droplet, 
  ArrowRight, 
  Scale, 
  Clock, 
  Activity, 
  HeartHandshake,
  AlertTriangle,
  Info
} from 'lucide-react';
import { MYTHS_AND_FACTS, BLOOD_GROUPS } from '../data/initialData';
import { BloodGroup } from '../types';

export const AwarenessSection: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');
  const [openMythId, setOpenMythId] = useState<number | null>(1);

  const currentGroupData = BLOOD_GROUPS.find((b) => b.group === selectedGroup) || BLOOD_GROUPS[0];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Awareness & Education
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Understanding Blood Donation in India
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Blood cannot be manufactured in factories—it only comes from generous voluntary donors like you. Discover eligibility guidelines, debunk common myths, and understand compatibility.
          </p>
        </div>

        {/* 4 Crucial Blood Donation Facts in India */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-6 transition-all duration-200 hover:shadow-md">
            <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-xl mb-4 shadow-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">1 Unit Saves Up to 3 Lives</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Donated whole blood is separated into 3 critical components: Red Blood Cells (RBCs), Plasma, and Platelets for different critical patients.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-6 transition-all duration-200 hover:shadow-md">
            <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center font-black text-xl mb-4 shadow-sm">
              90
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">90 Days Interval</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Healthy adults can safely donate whole blood every 3 months (90 days). Your body regenerates fluids within 24–48 hours.
            </p>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 transition-all duration-200 hover:shadow-md">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl mb-4 shadow-sm">
              8m
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Only 8 to 10 Minutes</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The blood collection itself takes just 8-10 minutes. The entire hospital or camp visit takes under 30 minutes including rest and juice.
            </p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 transition-all duration-200 hover:shadow-md">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xl mb-4 shadow-sm">
              100%
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Sterile & Zero Infection</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Certified single-use, pre-packaged disposable sterile needles are used for every donor, eliminating any risk of infection or disease transfer.
            </p>
          </div>
        </div>

        {/* Eligibility Criteria & 4 Steps of Donation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Eligibility checklist */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Who Can Donate Blood?</h3>
                <p className="text-xs text-slate-500">Government of India & National Blood Transfusion Council Guidelines</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sm text-slate-900">Age: 18 to 65 Years</span>
                  <p className="text-xs text-slate-600">First-time donors are recommended between 18 and 60 years.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sm text-slate-900">Body Weight: Minimum 45 kg</span>
                  <p className="text-xs text-slate-600">Ensures safe volume extraction (usually 350ml or 450ml).</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sm text-slate-900">Hemoglobin Level: ≥ 12.5 g/dL</span>
                  <p className="text-xs text-slate-600">Quick pin-prick test conducted on-spot prior to collection.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sm text-slate-900">Cooling Interval: 90 Days Gap</span>
                  <p className="text-xs text-slate-600">Minimum 90 days (3 months) since last whole blood donation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sm text-slate-900">Vitals: Normal BP & Pulse</span>
                  <p className="text-xs text-slate-600">Pulse: 50–100 bpm; Blood Pressure within acceptable clinical limits.</p>
                </div>
              </div>
            </div>

            {/* Temporary Deferrals Note */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Temporary Deferral:</strong> Wait 6 months after major surgery or tattooing/piercing, 24 hours after alcohol consumption, and 14 days after recovery from flu/fever.
              </span>
            </div>
          </div>

          {/* Blood Group Compatibility Matrix */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Blood Compatibility Explorer</h3>
                  <p className="text-xs text-slate-500">Find who you can donate to and receive from</p>
                </div>
              </div>
            </div>

            {/* Blood group selector pills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Select Your Blood Group:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg.group}
                    onClick={() => setSelectedGroup(bg.group)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all duration-150 cursor-pointer ${
                      selectedGroup === bg.group
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-102'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {bg.group}
                  </button>
                ))}
              </div>
            </div>

            {/* Compatibility Result Details */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black text-red-600">{currentGroupData.group}</span>
                  <span className="text-xs text-slate-500">({currentGroupData.rarityInIndia})</span>
                </div>
                {currentGroupData.group === 'O-' && (
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                    Universal Donor
                  </span>
                )}
                {currentGroupData.group === 'AB+' && (
                  <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                    Universal Recipient
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block mb-1.5">
                    Can Donate To:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentGroupData.canDonateTo.map((group) => (
                      <span
                        key={group}
                        className="bg-white text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wide block mb-1.5">
                    Can Receive From:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentGroupData.canReceiveFrom.map((group) => (
                      <span
                        key={group}
                        className="bg-white text-blue-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tip */}
            <p className="text-xs text-slate-500 italic flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>In India, O+ and B+ account for nearly 70% of all blood demand in hospitals.</span>
            </p>
          </div>

        </div>

        {/* Myths vs Facts Section */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900">
              Debunking Common Myths vs. Facts
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Misconceptions keep thousands of eligible donors away. Let's dispel the falsehoods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MYTHS_AND_FACTS.map((item) => {
              const isOpen = openMythId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                    isOpen 
                      ? 'bg-rose-50/50 border-red-300 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setOpenMythId(isOpen ? null : item.id)}
                >
                  <div className="p-5 flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase">
                          Myth #{item.id}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{item.category}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        "{item.myth}"
                      </h4>
                    </div>
                    <span className={`p-1.5 rounded-full ${isOpen ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'} shrink-0`}>
                      <HelpCircle className="w-4 h-4" />
                    </span>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-red-100 bg-white/70">
                      <div className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                            Medical Fact:
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {item.fact}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
