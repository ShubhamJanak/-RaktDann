/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AwarenessSection } from './components/AwarenessSection';
import { DonorSearch } from './components/DonorSearch';
import { EmergencyRequests } from './components/EmergencyRequests';
import { DonorRegistration } from './components/DonorRegistration';
import { DonorPortal } from './components/DonorPortal';
import { HelplineGuide } from './components/HelplineGuide';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

import { Donor, EmergencyRequest, AdminUser, BloodGroup } from './types';
import { INITIAL_DONORS, INITIAL_REQUESTS } from './data/initialData';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from './firebase';

const STORAGE_KEYS = {
  DONORS: 'raktdaan_donors_v1',
  REQUESTS: 'raktdaan_requests_v1',
  ADMIN: 'raktdaan_admin_session_v1'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedBloodGroupFilter, setSelectedBloodGroupFilter] = useState<BloodGroup | 'ALL'>('ALL');
  
  // Donors state
  const [donors, setDonors] = useState<Donor[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEYS.DONORS);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing cached donors', e);
      }
    }
    return INITIAL_DONORS;
  });

  // Emergency Requests state
  const [requests, setRequests] = useState<EmergencyRequest[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing cached requests', e);
      }
    }
    return INITIAL_REQUESTS;
  });

  // Admin user session
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const cached = localStorage.getItem(STORAGE_KEYS.ADMIN);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Save to LocalStorage whenever donors or requests change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(adminUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN);
    }
  }, [adminUser]);

  // Try fetching from Firestore on mount if available
  useEffect(() => {
    async function syncFromFirestore() {
      try {
        const donorsCol = collection(db, 'donors');
        const donorsSnapshot = await getDocs(donorsCol);
        if (!donorsSnapshot.empty) {
          const remoteDonors: Donor[] = [];
          donorsSnapshot.forEach((docSnap) => {
            remoteDonors.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          if (remoteDonors.length > 0) {
            setDonors(remoteDonors);
          }
        }

        const reqCol = collection(db, 'requests');
        const reqSnapshot = await getDocs(reqCol);
        if (!reqSnapshot.empty) {
          const remoteReqs: EmergencyRequest[] = [];
          reqSnapshot.forEach((docSnap) => {
            remoteReqs.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          if (remoteReqs.length > 0) {
            setRequests(remoteReqs);
          }
        }
      } catch (err) {
        console.log('Firebase online sync notice (falling back to durable local store):', err);
      }
    }
    syncFromFirestore();
  }, []);

  // Handlers
  const handleNavigate = (tab: string, preselectedGroup?: BloodGroup) => {
    if (preselectedGroup) {
      setSelectedBloodGroupFilter(preselectedGroup);
    } else if (tab === 'search') {
      setSelectedBloodGroupFilter('ALL');
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Donor
  const handleRegisterDonor = async (newDonorData: Omit<Donor, 'id' | 'registered_on'>): Promise<Donor> => {
    const id = `donor-${Date.now()}`;
    const registered_on = new Date().toISOString();
    const newDonor: Donor = {
      ...newDonorData,
      id,
      registered_on
    };

    // Try saving to Firestore
    try {
      const docRef = await addDoc(collection(db, 'donors'), {
        ...newDonorData,
        registered_on
      });
      newDonor.id = docRef.id;
    } catch (err) {
      console.log('Saved to resilient local store');
    }

    setDonors((prev) => [newDonor, ...prev]);
    return newDonor;
  };

  // Update Donor
  const handleUpdateDonor = async (donorId: string, updates: Partial<Donor>): Promise<void> => {
    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, ...updates } : d))
    );

    // Try Firestore update
    try {
      const docRef = doc(db, 'donors', donorId);
      await updateDoc(docRef, updates);
    } catch (err) {
      // Local fallback handled
    }
  };

  // Delete Donor
  const handleDeleteDonor = async (donorId: string): Promise<void> => {
    setDonors((prev) => prev.filter((d) => d.id !== donorId));

    try {
      const docRef = doc(db, 'donors', donorId);
      await deleteDoc(docRef);
    } catch (err) {
      // Local fallback handled
    }
  };

  // Add Emergency Request
  const handleSubmitRequest = async (newReqData: Omit<EmergencyRequest, 'id' | 'requested_on' | 'status'>): Promise<void> => {
    const id = `req-${Date.now()}`;
    const requested_on = new Date().toISOString();
    const newReq: EmergencyRequest = {
      ...newReqData,
      id,
      requested_on,
      status: 'Active'
    };

    try {
      const docRef = await addDoc(collection(db, 'requests'), {
        ...newReqData,
        requested_on,
        status: 'Active'
      });
      newReq.id = docRef.id;
    } catch (err) {
      console.log('Saved to resilient local store');
    }

    setRequests((prev) => [newReq, ...prev]);
  };

  // Update Request
  const handleUpdateRequest = async (reqId: string, updates: Partial<EmergencyRequest>): Promise<void> => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, ...updates } : r))
    );

    try {
      const docRef = doc(db, 'requests', reqId);
      await updateDoc(docRef, updates);
    } catch (err) {
      // Local fallback handled
    }
  };

  // Delete Request
  const handleDeleteRequest = async (reqId: string): Promise<void> => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));

    try {
      const docRef = doc(db, 'requests', reqId);
      await deleteDoc(docRef);
    } catch (err) {
      // Local fallback handled
    }
  };

  // Donate Pledge Action
  const handleDonatePledge = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;
    const attendantPhone = req.contact.replace(/\D/g, '');
    const cleanPhone = attendantPhone.length === 10 ? `91${attendantPhone}` : attendantPhone;
    const msg = `Namaste! I saw your urgent emergency request for ${req.blood_group} blood for patient ${req.patient_name} at ${req.hospital}, ${req.city}. I am an eligible blood donor and would like to help donate. Please let me know how to proceed.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Admin Login (using user provided credentials)
  const handleLoginAdmin = async (email: string, pass: string): Promise<boolean> => {
    if (email.toLowerCase() === 'janakshubham62@gmail.com' && pass === '1920') {
      const admin: AdminUser = {
        email: 'janakshubham62@gmail.com',
        name: 'Shubham Janak',
        role: 'admin'
      };
      setAdminUser(admin);
      return true;
    }
    return false;
  };

  const handleLogoutAdmin = () => {
    setAdminUser(null);
  };

  // Reset to default data
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all records to the original sample dataset?')) {
      setDonors(INITIAL_DONORS);
      setRequests(INITIAL_REQUESTS);
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      alert('Directory dataset reset successfully.');
    }
  };

  // Statistics calculation
  const totalDonorsCount = donors.length;
  const availableDonorsCount = donors.filter((d) => d.availability_status === 'Available').length;
  const activeRequestsCount = requests.filter((r) => r.status === 'Active').length;
  const uniqueCitiesCount = new Set(donors.map((d) => d.city)).size;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminUser={adminUser}
        onLogoutAdmin={handleLogoutAdmin}
        activeRequestsCount={activeRequestsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onNavigate={handleNavigate}
              totalDonors={totalDonorsCount}
              availableDonors={availableDonorsCount}
              activeRequestsCount={activeRequestsCount}
              citiesCount={uniqueCitiesCount}
            />
            <AwarenessSection />
            <div className="bg-slate-50 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Latest Available Donors in India
                  </h3>
                  <button
                    onClick={() => handleNavigate('search')}
                    className="text-sm font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    View All Donors &rarr;
                  </button>
                </div>
                <DonorSearch
                  donors={donors.slice(0, 6)}
                  initialBloodGroup="ALL"
                  onRegisterClick={() => handleNavigate('register')}
                  onRequestClick={() => handleNavigate('emergency')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <DonorSearch
            donors={donors}
            initialBloodGroup={selectedBloodGroupFilter}
            onRegisterClick={() => handleNavigate('register')}
            onRequestClick={() => handleNavigate('emergency')}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyRequests
            requests={requests}
            donors={donors}
            onSubmitRequest={handleSubmitRequest}
            onDonatePledge={handleDonatePledge}
          />
        )}

        {activeTab === 'register' && (
          <DonorRegistration
            onRegisterDonor={handleRegisterDonor}
            onNavigateToSearch={() => handleNavigate('search')}
          />
        )}

        {activeTab === 'portal' && (
          <DonorPortal
            donors={donors}
            onUpdateDonor={handleUpdateDonor}
            onRegisterClick={() => handleNavigate('register')}
          />
        )}

        {activeTab === 'helpline' && (
          <HelplineGuide />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            adminUser={adminUser}
            onLoginAdmin={handleLoginAdmin}
            onLogoutAdmin={handleLogoutAdmin}
            donors={donors}
            requests={requests}
            onUpdateDonor={handleUpdateDonor}
            onDeleteDonor={handleDeleteDonor}
            onAddDonor={handleRegisterDonor}
            onUpdateRequest={handleUpdateRequest}
            onDeleteRequest={handleDeleteRequest}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
