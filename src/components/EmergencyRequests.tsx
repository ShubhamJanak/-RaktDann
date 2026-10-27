import React, { useState } from 'react';
import { 
  AlertCircle, 
  Plus, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Users, 
  Send, 
  ShieldAlert,
  Droplet,
  ExternalLink,
  HelpCircle,
  Share2
} from 'lucide-react';
import { EmergencyRequest, BloodGroup, UrgencyLevel, Donor } from '../types';
import { INDIAN_CITIES } from '../data/initialData';
import { formatTimeAgo, formatIndianDate, isBloodCompatible, generateWhatsAppLink } from '../utils/helpers';

interface EmergencyRequestsProps {
  requests: EmergencyRequest[];
  donors: Donor[];
  onSubmitRequest: (newReq: Omit<EmergencyRequest, 'id' | 'requested_on' | 'status'>) => Promise<void>;
  onDonatePledge: (requestId: string) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const EmergencyRequests: React.FC<EmergencyRequestsProps> = ({
  requests,
  donors,
  onSubmitRequest,
  onDonatePledge
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedRequestForDonors, setSelectedRequestForDonors] = useState<EmergencyRequest | null>(null);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [hospital, setHospital] = useState('');
  const [city, setCity] = useState(INDIAN_CITIES[1]); // Default New Delhi
  const [state, setState] = useState('Delhi NCR');
  const [contactName, setContactName] = useState('');
  const [contact, setContact] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [medicalReason, setMedicalReason] = useState('');
  const [attendantRelation, setAttendantRelation] = useState('Attendant / Family');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!patientName.trim()) {
      setFormError('Please enter the patient name.');
      return;
    }
    if (!hospital.trim()) {
      setFormError('Please provide the hospital or medical institution name.');
      return;
    }
    if (!contact.trim() || contact.replace(/\D/g, '').length < 10) {
      setFormError('Please provide a valid 10-digit Indian contact phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRequest({
        patient_name: patientName.trim(),
        blood_group: bloodGroup,
        units_needed: Number(unitsNeeded),
        units_fulfilled: 0,
        hospital: hospital.trim(),
        city,
        state,
        contact_name: contactName.trim() || 'Attendant',
        contact: contact.startsWith('+91') ? contact : `+91 ${contact.trim()}`,
        urgency,
        medical_reason: medicalReason.trim() || 'Urgent medical requirement',
        attendant_relation: attendantRelation,
        verified: true
      });

      setSuccessMessage('Emergency blood request posted successfully. It is now publicly listed for donors.');
      setShowModal(false);
      // Reset form
      setPatientName('');
      setHospital('');
      setContact('');
      setMedicalReason('');
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit emergency request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter requests
  const activeRequests = requests.filter((r) => {
    if (filterGroup !== 'ALL' && r.blood_group !== filterGroup) return false;
    return true;
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header & Post CTA */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-rose-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-red-500/30 text-rose-200 text-xs font-semibold px-3 py-1 rounded-full border border-red-400/30">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>Real-Time Indian Hospital Emergency Feed</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Active Emergency Blood Requests
            </h2>
            <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
              Every second matters. When a hospital faces a shortage, direct voluntary donors save lives. Browse open emergency requirements or post an urgent request for a patient.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowModal(true)}
              id="post-emergency-btn"
              className="bg-white hover:bg-rose-50 text-red-700 font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-black/20 hover:scale-102 transition-all flex items-center justify-center space-x-2 cursor-pointer text-sm sm:text-base"
            >
              <Plus className="w-5 h-5 text-red-600" />
              <span>Post Emergency Request</span>
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-5 py-4 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter by Blood Group Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Droplet className="w-4 h-4 text-red-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Filter by Blood Group:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterGroup('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterGroup === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Requests ({requests.length})
          </button>
          {BLOOD_GROUPS.map((bg) => {
            const count = requests.filter((r) => r.blood_group === bg).length;
            return (
              <button
                key={bg}
                onClick={() => setFilterGroup(bg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterGroup === bg
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {bg} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Emergency Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeRequests.map((req) => {
          const isCritical = req.urgency === 'CRITICAL';
          const isHigh = req.urgency === 'HIGH';
          const isFulfilled = req.status === 'Fulfilled';

          // Find matching donors in the directory
          const matchingDonors = donors.filter(
            (d) => isBloodCompatible(d.blood_group, req.blood_group) && d.city.toLowerCase() === req.city.toLowerCase() && d.availability_status === 'Available'
          );

          return (
            <div
              key={req.id}
              id={`emergency-card-${req.id}`}
              className={`rounded-3xl border p-6 transition-all duration-200 space-y-5 relative flex flex-col justify-between ${
                isFulfilled
                  ? 'bg-slate-50 border-slate-200 opacity-80'
                  : isCritical
                  ? 'bg-white border-red-300 shadow-lg shadow-red-500/10 ring-1 ring-red-400'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Card Header: Urgency badge & Time */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {isCritical ? (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-black bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-xs">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>CRITICAL (Within 2-4 Hours)</span>
                    </span>
                  ) : isHigh ? (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-bold bg-amber-500 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      <span>High Urgency (24h)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full uppercase">
                      <span>Moderate (Scheduled)</span>
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(req.requested_on)}</span>
                </span>
              </div>

              {/* Patient & Blood details */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {req.patient_name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Case: <span className="text-slate-700 font-medium">{req.medical_reason || 'Emergency surgery'}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-2xl px-4 py-2 rounded-2xl shadow-sm">
                    {req.blood_group}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 mt-1">
                    {req.units_needed} {req.units_needed > 1 ? 'Units' : 'Unit'} Needed
                  </div>
                </div>
              </div>

              {/* Hospital & Location Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start space-x-2 text-slate-700">
                  <Building2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{req.hospital}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{req.city}, {req.state}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Attendant: <strong>{req.contact_name}</strong> ({req.attendant_relation || 'Family'})</span>
                </div>
              </div>

              {/* Matching Local Donors Banner Alert */}
              {matchingDonors.length > 0 && !isFulfilled && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span><strong>{matchingDonors.length} matching donors</strong> available in {req.city}!</span>
                  </div>
                  <button
                    onClick={() => setSelectedRequestForDonors(req)}
                    className="text-emerald-700 font-bold underline hover:text-emerald-900 cursor-pointer"
                  >
                    View Donors
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${req.contact}`}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Hospital / Family</span>
                </a>

                <a
                  href={generateWhatsAppLink(req.contact, req.contact_name, req.blood_group, req.patient_name, req.hospital, req.city)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                {!isFulfilled && (
                  <button
                    onClick={() => onDonatePledge(req.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-red-200 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    title="Pledge to donate for this patient"
                  >
                    <CheckCircle2 className="w-4 h-4 text-red-600" />
                    <span>I Can Donate</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal for Posting Emergency Request */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Post Emergency Blood Requirement</h3>
                  <p className="text-xs text-slate-500">List urgent hospital requirements for active donors</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group Required *
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-red-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Units Needed *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / Location *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {INDIAN_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Urgency Level *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-red-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="CRITICAL">🔴 CRITICAL (2-4 Hours)</option>
                    <option value="HIGH">🟠 High (Within 24h)</option>
                    <option value="MODERATE">🔵 Moderate (Scheduled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hospital / Blood Bank Name & Area *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AIIMS Delhi, Trauma Center Ward 4"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number (10-Digit) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9811234567"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Medical Reason / Diagnosis Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bypass surgery, Thalassemia transfusion, Platelet drop due to dengue..."
                  value={medicalReason}
                  onChange={(e) => setMedicalReason(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Posting...' : 'Submit Emergency Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Matching Donors Pop-up Modal */}
      {selectedRequestForDonors && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Matching Donors in {selectedRequestForDonors.city}
                </h3>
                <p className="text-xs text-slate-500">
                  Available donors compatible with {selectedRequestForDonors.blood_group} blood group
                </p>
              </div>
              <button 
                onClick={() => setSelectedRequestForDonors(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              {donors
                .filter(
                  (d) => isBloodCompatible(d.blood_group, selectedRequestForDonors.blood_group) && d.city.toLowerCase() === selectedRequestForDonors.city.toLowerCase()
                )
                .map((donor) => (
                  <div key={donor.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{donor.name}</span>
                        <span className="bg-red-100 text-red-700 font-extrabold text-xs px-2 py-0.5 rounded">
                          {donor.blood_group}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          donor.availability_status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {donor.availability_status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{donor.city}, {donor.state} • {donor.phone}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={`tel:${donor.phone}`}
                        className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-emerald-400" />
                      </a>
                      <a
                        href={generateWhatsAppLink(donor.phone, donor.name, selectedRequestForDonors.blood_group, selectedRequestForDonors.patient_name, selectedRequestForDonors.hospital, selectedRequestForDonors.city)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedRequestForDonors(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
