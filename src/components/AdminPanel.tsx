import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  LogOut, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Edit, 
  Plus, 
  Download, 
  Send, 
  Search, 
  RefreshCw, 
  Activity, 
  X,
  Phone,
  MessageCircle,
  Clock
} from 'lucide-react';
import { Donor, EmergencyRequest, AdminUser, BloodGroup, AvailabilityStatus, UrgencyLevel } from '../types';
import { INDIAN_CITIES } from '../data/initialData';
import { calculateEligibility, formatIndianDate, generateWhatsAppLink } from '../utils/helpers';

interface AdminPanelProps {
  adminUser: AdminUser | null;
  onLoginAdmin: (email: string, pass: string) => Promise<boolean>;
  onLogoutAdmin: () => void;
  donors: Donor[];
  requests: EmergencyRequest[];
  onUpdateDonor: (id: string, updates: Partial<Donor>) => Promise<void>;
  onDeleteDonor: (id: string) => Promise<void>;
  onAddDonor: (donor: Omit<Donor, 'id' | 'registered_on'>) => Promise<Donor>;
  onUpdateRequest: (id: string, updates: Partial<EmergencyRequest>) => Promise<void>;
  onDeleteRequest: (id: string) => Promise<void>;
  onResetData: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  adminUser,
  onLoginAdmin,
  onLogoutAdmin,
  donors,
  requests,
  onUpdateDonor,
  onDeleteDonor,
  onAddDonor,
  onUpdateRequest,
  onDeleteRequest,
  onResetData
}) => {
  // Login form state
  const [loginEmail, setLoginEmail] = useState('janakshubham62@gmail.com');
  const [loginPass, setLoginPass] = useState('1920');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin tabs
  const [adminTab, setAdminTab] = useState<'overview' | 'donors' | 'requests' | 'broadcast'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  // Edit Donor Modal
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  // Add Donor Modal
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);

  // Broadcast state
  const [broadcastGroup, setBroadcastGroup] = useState<BloodGroup>('O+');
  const [broadcastCity, setBroadcastCity] = useState(INDIAN_CITIES[1]);
  const [broadcastMessage, setBroadcastMessage] = useState('URGENT: Whole blood units required immediately at AIIMS Delhi for an emergency case. Please report if available.');
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const success = await onLoginAdmin(loginEmail.trim(), loginPass.trim());
      if (!success) {
        setLoginError('Invalid administrator credentials. Please check the email and password.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Export Donors to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Age', 'Blood Group', 'City', 'State', 'Phone', 'Email', 'Availability', 'Last Donation Date', 'Verified'];
    const rows = donors.map((d) => [
      d.id,
      `"${d.name}"`,
      d.age,
      d.blood_group,
      `"${d.city}"`,
      `"${d.state}"`,
      `"${d.phone}"`,
      `"${d.email}"`,
      d.availability_status,
      d.last_donation_date || 'N/A',
      d.verified ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RaktDaan_Donors_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not logged in, render login view
  if (!adminUser) {
    return (
      <div className="py-12 sm:py-16 max-w-md mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Admin Portal Login</h2>
            <p className="text-xs text-slate-500">
              Authorized administrators can manage donors, approve requests, and dispatch emergency broadcasts.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              id="admin-login-submit-btn"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center text-xs text-slate-500 space-y-1">
            <span className="font-semibold text-slate-700 block">Default Admin Credentials:</span>
            <p>Email: <code className="text-red-700 font-bold">janakshubham62@gmail.com</code></p>
            <p>Password: <code className="text-red-700 font-bold">1920</code></p>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Donors for admin
  const adminFilteredDonors = donors.filter((d) => {
    if (selectedGroup !== 'ALL' && d.blood_group !== selectedGroup) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Administrator Control Center</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-500">Logged in as {adminUser.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onResetData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer transition-colors"
            title="Reset data to initial verified records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Sample Data</span>
          </button>
          <button
            onClick={onLogoutAdmin}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            adminTab === 'overview'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setAdminTab('donors')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            adminTab === 'donors'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Manage Donors ({donors.length})
        </button>
        <button
          onClick={() => setAdminTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            adminTab === 'requests'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Emergency Requests ({requests.length})
        </button>
        <button
          onClick={() => setAdminTab('broadcast')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            adminTab === 'broadcast'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Emergency Broadcast
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-slate-400 text-xs font-semibold uppercase">Total Donors</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{donors.length}</div>
              <span className="text-[11px] text-emerald-600">All registered volunteers</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-slate-400 text-xs font-semibold uppercase">Available Donors</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                {donors.filter((d) => d.availability_status === 'Available').length}
              </div>
              <span className="text-[11px] text-slate-500">Ready to donate immediately</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-slate-400 text-xs font-semibold uppercase">Active Hospital Requests</div>
              <div className="text-3xl font-black text-red-600 mt-1">
                {requests.filter((r) => r.status === 'Active').length}
              </div>
              <span className="text-[11px] text-red-500 font-semibold">Urgent open cases</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-slate-400 text-xs font-semibold uppercase">Fulfilled Requests</div>
              <div className="text-3xl font-black text-blue-600 mt-1">
                {requests.filter((r) => r.status === 'Fulfilled').length}
              </div>
              <span className="text-[11px] text-blue-500">Patients assisted</span>
            </div>
          </div>

          {/* Blood group inventory / donor distribution */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Blood Group Distribution in Directory</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {BLOOD_GROUPS.map((bg) => {
                const count = donors.filter((d) => d.blood_group === bg).length;
                const available = donors.filter((d) => d.blood_group === bg && d.availability_status === 'Available').length;
                return (
                  <div key={bg} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-base font-black text-red-600">{bg}</span>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{count}</div>
                    <span className="text-[10px] text-emerald-600 block">{available} Available</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE DONORS */}
      {adminTab === 'donors' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search donor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700"
              >
                <option value="ALL">All Groups</option>
                {BLOOD_GROUPS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setShowAddDonorModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Donor</span>
              </button>
            </div>
          </div>

          {/* Donors Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Donor Name</th>
                  <th className="py-3 px-3">Blood Group</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Last Donation</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {adminFilteredDonors.map((donor) => {
                  const isAvail = donor.availability_status === 'Available';
                  return (
                    <tr key={donor.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{donor.name}</span>
                        <span className="text-[11px] text-slate-400">{donor.age} yrs • {donor.gender || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-red-100 text-red-700 font-black text-xs px-2.5 py-1 rounded-lg">
                          {donor.blood_group}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span>{donor.city}</span>
                        <span className="text-[11px] text-slate-400 block">{donor.state}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-xs">
                        <div>{donor.phone}</div>
                        <div className="text-[11px] text-slate-400">{donor.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onUpdateDonor(donor.id, {
                            availability_status: isAvail ? 'Not Available' : 'Available'
                          })}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                            isAvail ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {donor.availability_status}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-500">
                        {donor.last_donation_date ? formatIndianDate(donor.last_donation_date) : 'First-time'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setEditingDonor(donor)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete donor ${donor.name}?`)) {
                                onDeleteDonor(donor.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE EMERGENCY REQUESTS */}
      {adminTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Hospital Emergency Blood Requests</h3>
            <span className="text-xs text-slate-400">{requests.length} total entries</span>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded-lg">
                      {req.blood_group}
                    </span>
                    <span className="font-bold text-slate-900 text-base">{req.patient_name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-slate-400">({req.urgency})</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Hospital: <strong>{req.hospital}</strong> ({req.city}, {req.state}) • Units: {req.units_needed} • Attendant: {req.contact_name} ({req.contact})
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onUpdateRequest(req.id, {
                      status: req.status === 'Active' ? 'Fulfilled' : 'Active'
                    })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      req.status === 'Active' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {req.status === 'Active' ? 'Mark Fulfilled' : 'Reopen'}
                  </button>
                  <button
                    onClick={() => onDeleteRequest(req.id)}
                    className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EMERGENCY BROADCAST */}
      {adminTab === 'broadcast' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Emergency Alert Dispatcher</h3>
            <p className="text-xs text-slate-500">
              Instantly simulate an emergency SMS / WhatsApp broadcast to registered donors in a specific city.
            </p>
          </div>

          {broadcastSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{broadcastSuccess}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Blood Group:
                </label>
                <select
                  value={broadcastGroup}
                  onChange={(e) => setBroadcastGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-red-600"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target City:
                </label>
                <select
                  value={broadcastCity}
                  onChange={(e) => setBroadcastCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  {INDIAN_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Emergency Alert Message:
              </label>
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            {/* Matching Donors preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
              <span>Matching Available Donors in {broadcastCity}: </span>
              <strong className="text-slate-900">
                {donors.filter((d) => d.blood_group === broadcastGroup && d.city.toLowerCase() === broadcastCity.toLowerCase() && d.availability_status === 'Available').length} Donors
              </strong>
            </div>

            <button
              onClick={() => {
                setBroadcastSuccess(`Emergency broadcast simulated successfully! Alert sent to matching ${broadcastGroup} donors in ${broadcastCity}.`);
                setTimeout(() => setBroadcastSuccess(null), 5000);
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md shadow-red-600/30 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Emergency Notification</span>
            </button>
          </div>
        </div>
      )}

      {/* Edit Donor Modal */}
      {editingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Edit Donor: {editingDonor.name}</h3>
              <button onClick={() => setEditingDonor(null)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={editingDonor.phone}
                  onChange={(e) => setEditingDonor({ ...editingDonor, phone: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City:</label>
                <input
                  type="text"
                  value={editingDonor.city}
                  onChange={(e) => setEditingDonor({ ...editingDonor, city: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Availability Status:</label>
                <select
                  value={editingDonor.availability_status}
                  onChange={(e) => setEditingDonor({ ...editingDonor, availability_status: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border rounded-xl font-bold text-emerald-700"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button onClick={() => setEditingDonor(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-xs">Cancel</button>
              <button
                onClick={async () => {
                  await onUpdateDonor(editingDonor.id, editingDonor);
                  setEditingDonor(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
