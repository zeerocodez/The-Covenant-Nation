import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  BranchTenant,
  Child,
  AttendanceRecord,
  DepartmentConfig,
  ServiceConfig,
  ChurchSettings,
} from './types';
import { StorageService } from './storage';
import { getTodayDateString } from './mockData';
import { Navbar } from './components/Navbar';
import { CheckInDesk } from './components/CheckInDesk';
import { CheckOutDesk } from './components/CheckOutDesk';
import { ChildrenRegistry } from './components/ChildrenRegistry';
import { AttendanceReports } from './components/AttendanceReports';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SecurityBadgeModal } from './components/SecurityBadgeModal';
import { ChurchHero } from './components/ChurchHero';
import { CsvImportModal } from './components/CsvImportModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sparkles, Church, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Multi-Tenant Branches
  const [branches, setBranches] = useState<BranchTenant[]>(() => StorageService.getBranches());
  const [activeBranchId, setActiveBranchId] = useState<string>(() => StorageService.getActiveBranchId());

  // Current Active Branch Tenant
  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  // Application Data State with LocalStorage backing (Namespaced to active branch)
  const [currentTab, setCurrentTab] = useState<ActiveTab>('check-in');
  const [services, setServices] = useState<ServiceConfig[]>(() => StorageService.getServices(activeBranchId));
  const [departments, setDepartments] = useState<DepartmentConfig[]>(() =>
    StorageService.getDepartments(activeBranchId)
  );
  const [childrenList, setChildrenList] = useState<Child[]>(() => StorageService.getChildren(activeBranchId));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() =>
    StorageService.getAttendance(activeBranchId)
  );
  const [settings, setSettings] = useState<ChurchSettings>(() => StorageService.getSettings(activeBranchId));
  const [activeServiceId, setActiveServiceId] = useState<string>(() =>
    StorageService.getActiveServiceId(activeBranchId)
  );

  // Authentication & Modals State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() =>
    StorageService.isAdminLoggedIn()
  );
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isImportCsvModalOpen, setIsImportCsvModalOpen] = useState(false);
  const [selectedSlipRecord, setSelectedSlipRecord] = useState<AttendanceRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle Switching Branch Parish
  const handleSelectBranch = (newBranchId: string) => {
    setActiveBranchId(newBranchId);
    StorageService.setActiveBranchId(newBranchId);

    // Refresh tenant data for the newly selected branch
    setServices(StorageService.getServices(newBranchId));
    setDepartments(StorageService.getDepartments(newBranchId));
    setChildrenList(StorageService.getChildren(newBranchId));
    setAttendance(StorageService.getAttendance(newBranchId));
    setActiveServiceId(StorageService.getActiveServiceId(newBranchId));
    setSettings(StorageService.getSettings(newBranchId));

    const targetBranch = branches.find((b) => b.id === newBranchId);
    if (targetBranch) {
      setToastMessage(`✓ Switched to ${targetBranch.name} (${targetBranch.city})`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleAddBranch = (newBranch: BranchTenant) => {
    StorageService.addBranch(newBranch);
    const updatedBranches = StorageService.getBranches();
    setBranches(updatedBranches);
    handleSelectBranch(newBranch.id);
  };

  const handleUpdateBranch = (updated: BranchTenant) => {
    StorageService.updateBranch(updated);
    const updatedBranches = StorageService.getBranches();
    setBranches(updatedBranches);
    setSettings(StorageService.getSettings(updated.id));
  };

  // Save states on updates (per active branch)
  const handleUpdateServices = (newServices: ServiceConfig[]) => {
    setServices(newServices);
    StorageService.saveServices(newServices, activeBranchId);
  };

  const handleUpdateDepartments = (newDepartments: DepartmentConfig[]) => {
    setDepartments(newDepartments);
    StorageService.saveDepartments(newDepartments, activeBranchId);
  };

  const handleUpdateChildren = (newChildren: Child[]) => {
    setChildrenList(newChildren);
    StorageService.saveChildren(newChildren, activeBranchId);
  };

  const handleUpdateAttendance = (newAttendance: AttendanceRecord[]) => {
    setAttendance(newAttendance);
    StorageService.saveAttendance(newAttendance, activeBranchId);
  };

  const handleUpdateSettings = (newSettings: ChurchSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings, activeBranchId);
  };

  const handleSelectService = (serviceId: string) => {
    setActiveServiceId(serviceId);
    StorageService.setActiveServiceId(serviceId, activeBranchId);
  };

  // Admin Login Handlers
  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    StorageService.setAdminLoggedIn(true);
    setCurrentTab('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    StorageService.setAdminLoggedIn(false);
    if (currentTab === 'admin') {
      setCurrentTab('check-in');
    }
  };

  // Factory Reset
  const handleResetAllData = () => {
    StorageService.resetAllData();
    const defaultBranches = StorageService.getBranches();
    setBranches(defaultBranches);
    const defId = defaultBranches[0]?.id || 'branch-uyo';
    setActiveBranchId(defId);
    setServices(StorageService.getServices(defId));
    setDepartments(StorageService.getDepartments(defId));
    setChildrenList(StorageService.getChildren(defId));
    setAttendance(StorageService.getAttendance(defId));
    setSettings(StorageService.getSettings(defId));
    setActiveServiceId(StorageService.getActiveServiceId(defId));
    setIsAdminLoggedIn(false);
    setCurrentTab('check-in');
    setToastMessage('✓ All data reset to default seed state.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check-In Child Handler (Strict: No child can be checked in twice)
  const handleCheckInChild = (child: Child) => {
    const todayStr = getTodayDateString();
    const activeService = services.find((s) => s.id === activeServiceId) || services[0];
    const dept = departments.find((d) => d.id === child.departmentId) || departments[0];
    const normName = StorageService.normalize(child.fullName);

    // 1. Check if child is currently checked in anywhere today (cannot be in two services at once)
    const currentlyInClass = attendance.find(
      (a) =>
        (a.childId === child.id || StorageService.normalize(a.childName) === normName) &&
        a.date === todayStr &&
        a.status === 'checked_in'
    );

    if (currentlyInClass) {
      setSelectedSlipRecord(currentlyInClass);
      setToastMessage(
        `⚠ Duplicate check-in blocked: "${child.fullName}" is ALREADY checked in for ${currentlyInClass.serviceName} today (Code: ${currentlyInClass.pickupSecurityCode}). A child cannot be checked in twice.`
      );
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }

    // 2. Check if child has already attended and been checked out for this service today
    const alreadyAttendedThisService = attendance.find(
      (a) =>
        (a.childId === child.id || StorageService.normalize(a.childName) === normName) &&
        a.date === todayStr &&
        a.serviceId === activeService?.id
    );

    if (alreadyAttendedThisService) {
      setSelectedSlipRecord(alreadyAttendedThisService);
      setToastMessage(
        `⚠ Duplicate check-in blocked: "${child.fullName}" has already attended and been checked out for ${activeService?.name || 'this service'} today at ${alreadyAttendedThisService.checkOutTime || 'earlier'}. A child cannot be checked in twice.`
      );
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }

    const pickupCode = StorageService.generateSecurityCode();
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      branchId: activeBranchId,
      childId: child.id,
      childName: child.fullName,
      serviceId: activeService?.id || 'first-service',
      serviceName: activeService?.name || 'Main Service',
      departmentId: dept?.id || 'dept-default',
      departmentName: dept?.name || 'Children Church',
      date: todayStr,
      checkInTime: timeFormatted,
      status: 'checked_in',
      pickupSecurityCode: pickupCode,
      parentName: child.parentName,
      parentPhone: child.parentPhone,
      checkedInBy: 'Church Usher Desk',
      allergiesMedicalNotes: child.allergiesMedicalNotes,
    };

    const updated = [newRecord, ...attendance];
    handleUpdateAttendance(updated);
    setSelectedSlipRecord(newRecord);
    setToastMessage(`✓ ${child.fullName} checked in for ${activeService?.name}. Pickup Code: ${pickupCode}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check-Out Child Handler (Strict: No child can be checked out twice)
  const handleCheckOutRecord = (recordId: string, authorizedPerson: string) => {
    const target = attendance.find((rec) => rec.id === recordId);
    if (!target) {
      setToastMessage('⚠ Attendance record not found.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (target.status === 'checked_out') {
      setToastMessage(`⚠ Duplicate checkout blocked: "${target.childName}" was already checked out at ${target.checkOutTime || 'earlier'} by ${target.checkedOutBy || 'parent'}. Cannot be checked out twice.`);
      setTimeout(() => setToastMessage(null), 4500);
      return;
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const updated = attendance.map((rec) =>
      rec.id === recordId
        ? {
            ...rec,
            status: 'checked_out' as const,
            checkOutTime: timeFormatted,
            checkedOutBy: authorizedPerson,
          }
        : rec
    );

    handleUpdateAttendance(updated);
    setToastMessage(`✓ ${target.childName} successfully checked out and released to ${authorizedPerson}.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Child Save/Edit/Delete (Strict Duplicate Prevention: No child is registered twice)
  const handleSaveChild = (child: Child) => {
    const childWithBranch: Child = {
      ...child,
      branchId: activeBranchId,
    };
    const exists = childrenList.some((c) => c.id === child.id);

    const cleanStr = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanDigits = (s: string) => (s || '').replace(/\D/g, '');

    const normName = cleanStr(child.fullName);
    const normPhone = cleanDigits(child.parentPhone);

    // Check if another child already exists with matching name and parent phone / age / parent name
    const duplicate = childrenList.find((c) => {
      if (c.id === child.id) return false;
      const sameName = cleanStr(c.fullName) === normName;
      const cPhone = cleanDigits(c.parentPhone);
      const samePhone = normPhone.length >= 6 && cPhone.length >= 6 && (normPhone.slice(-10) === cPhone.slice(-10) || normPhone === cPhone);
      const sameAge = Number(c.age) === Number(child.age);
      const sameParent = cleanStr(c.parentName) === cleanStr(child.parentName);
      return sameName && (samePhone || sameAge || sameParent);
    });

    if (duplicate) {
      setToastMessage(`⚠ Duplicate rejected: "${child.fullName}" is already registered in ${currentBranch.shortName}. A child cannot be registered twice.`);
      setTimeout(() => setToastMessage(null), 4500);
      return;
    }

    let updated: Child[];
    if (exists) {
      updated = childrenList.map((c) => (c.id === child.id ? childWithBranch : c));
      setToastMessage(`✓ Updated student details for ${child.fullName}.`);
    } else {
      updated = [childWithBranch, ...childrenList];
      setToastMessage(`✓ Registered new child: ${child.fullName}.`);
    }
    handleUpdateChildren(updated);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteChild = (childId: string) => {
    const updated = childrenList.filter((c) => c.id !== childId);
    handleUpdateChildren(updated);
  };

  const handleCleanDuplicates = () => {
    const res = StorageService.cleanAllDuplicates();
    setChildrenList(StorageService.getChildren(activeBranchId));
    setAttendance(StorageService.getAttendance(activeBranchId));
    return res;
  };

  // CSV Import (Strict Deduplication: No child is registered twice)
  const handleImportChildren = (imported: Child[], newDeptsToCreate?: DepartmentConfig[]) => {
    if (newDeptsToCreate && newDeptsToCreate.length > 0) {
      const mergedDepts = [...departments, ...newDeptsToCreate];
      handleUpdateDepartments(mergedDepts);
    }

    // Index all existing children signatures
    const seenSigs = new Set<string>();
    childrenList.forEach((c) => {
      const nameKey = c.fullName.trim().toLowerCase();
      const phoneDigits = c.parentPhone.replace(/\D/g, '');
      if (phoneDigits) {
        seenSigs.add(`${nameKey}||phone:${phoneDigits}`);
      }
      seenSigs.add(`${nameKey}||age:${c.age}`);
    });

    const uniqueNewChildren: Child[] = [];
    let duplicateCount = 0;

    for (const c of imported) {
      const nameKey = c.fullName.trim().toLowerCase();
      const phoneDigits = c.parentPhone.replace(/\D/g, '');
      const sigPhone = phoneDigits ? `${nameKey}||phone:${phoneDigits}` : null;
      const sigAge = `${nameKey}||age:${c.age}`;

      if ((sigPhone && seenSigs.has(sigPhone)) || seenSigs.has(sigAge)) {
        duplicateCount++;
        continue;
      }

      if (sigPhone) seenSigs.add(sigPhone);
      seenSigs.add(sigAge);
      uniqueNewChildren.push(c);
    }

    if (uniqueNewChildren.length === 0) {
      setToastMessage(`ℹ No new students imported. All ${duplicateCount} records already exist in ${currentBranch.shortName}.`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const updated = [...uniqueNewChildren, ...childrenList];
    handleUpdateChildren(updated);
    setToastMessage(
      `✓ Successfully imported ${uniqueNewChildren.length} new students for ${currentBranch.shortName}${
        duplicateCount > 0 ? ` (${duplicateCount} duplicate${duplicateCount > 1 ? 's' : ''} skipped)` : ''
      }!`
    );
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Active check-in count for today
  const todayStr = getTodayDateString();
  const activeCheckedInCount = attendance.filter(
    (a) => a.date === todayStr && a.status === 'checked_in'
  ).length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900 pb-16 md:pb-0 overflow-x-hidden">
        {/* Navigation & Header */}
        <Navbar
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab === 'admin' && !isAdminLoggedIn) {
              setIsAdminLoginModalOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          services={services}
          activeServiceId={activeServiceId}
          onSelectService={handleSelectService}
          settings={settings}
          branches={branches}
          currentBranch={currentBranch}
          onSelectBranch={handleSelectBranch}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
          onAdminLogout={handleAdminLogout}
          checkedInCount={activeCheckedInCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
          {/* Multi-Tenant Official Hero Banner */}
          <ChurchHero
            currentBranch={currentBranch}
            branches={branches}
            onSelectBranch={handleSelectBranch}
            selectedDate={todayStr}
          />

          {toastMessage && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {currentTab === 'check-in' && (
            <CheckInDesk
              childrenList={childrenList}
              attendance={attendance}
              departments={departments}
              services={services}
              activeServiceId={activeServiceId}
              onSelectService={handleSelectService}
              settings={settings}
              onCheckInChild={handleCheckInChild}
              onOpenRegisterModal={() => setCurrentTab('children')}
              onViewSlip={(rec) => setSelectedSlipRecord(rec)}
            />
          )}

          {currentTab === 'check-out' && (
            <CheckOutDesk
              attendance={attendance}
              departments={departments}
              services={services}
              activeServiceId={activeServiceId}
              settings={settings}
              onCheckOutRecord={handleCheckOutRecord}
              onViewSlip={(rec) => setSelectedSlipRecord(rec)}
            />
          )}

          {currentTab === 'children' && (
            <ChildrenRegistry
              childrenList={childrenList}
              attendance={attendance}
              departments={departments}
              services={services}
              activeServiceId={activeServiceId}
              onSaveChild={handleSaveChild}
              onDeleteChild={handleDeleteChild}
              onCheckInChild={handleCheckInChild}
              onViewSlip={(rec) => setSelectedSlipRecord(rec)}
            />
          )}

          {currentTab === 'reports' && (
            <AttendanceReports
              attendance={attendance}
              departments={departments}
              services={services}
              settings={settings}
              onViewSlip={(rec) => setSelectedSlipRecord(rec)}
            />
          )}

          {currentTab === 'admin' && (
            <AdminPortal
              departments={departments}
              services={services}
              settings={settings}
              branches={branches}
              currentBranch={currentBranch}
              childrenList={childrenList}
              attendance={attendance}
              onSelectBranch={handleSelectBranch}
              onAddBranch={handleAddBranch}
              onUpdateBranch={handleUpdateBranch}
              onOpenImportCsvModal={() => setIsImportCsvModalOpen(true)}
              isAdminLoggedIn={isAdminLoggedIn}
              onOpenLoginModal={() => setIsAdminLoginModalOpen(true)}
              onAdminLogout={handleAdminLogout}
              onUpdateDepartments={handleUpdateDepartments}
              onUpdateServices={handleUpdateServices}
              onUpdateSettings={handleUpdateSettings}
              onResetAllData={handleResetAllData}
              onCleanDuplicates={handleCleanDuplicates}
            />
          )}
        </main>

        {/* Church Footer */}
        <footer className="bg-white border-t border-slate-200 mt-8 sm:mt-12 py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Church className="w-4 h-4 text-blue-700" />
              <span className="font-bold text-slate-800">
                {currentBranch.churchName}
              </span>
              <span>•</span>
              <span className="text-slate-500">{currentBranch.city}</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Multi-Parish Child Safety System</span>
              </span>
              <span>•</span>
              <span>Emergency: <strong className="text-slate-700 font-mono">{currentBranch.emergencyPhone}</strong></span>
            </div>
          </div>
        </footer>

        {/* Security / Parent Claim Slip Modal */}
        {selectedSlipRecord && (
          <SecurityBadgeModal
            record={selectedSlipRecord}
            department={departments.find(
              (d) => d.id === selectedSlipRecord.departmentId
            )}
            settings={settings}
            onClose={() => setSelectedSlipRecord(null)}
          />
        )}

        {/* Admin Login Modal */}
        <AdminLoginModal
          isOpen={isAdminLoginModalOpen}
          onClose={() => setIsAdminLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          currentAdminPasscode={currentBranch?.adminPasscode || settings.adminPasscode}
        />

        {/* CSV Import Modal (Supports Multiple Classes & Auto-Class Creation with Deduplication) */}
        <CsvImportModal
          isOpen={isImportCsvModalOpen}
          onClose={() => setIsImportCsvModalOpen(false)}
          departments={departments}
          activeBranchId={activeBranchId}
          existingChildren={childrenList}
          onImportChildren={handleImportChildren}
        />
      </div>
    </ErrorBoundary>
  );
}
