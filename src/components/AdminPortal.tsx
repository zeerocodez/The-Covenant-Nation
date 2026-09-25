import React, { useState } from 'react';
import {
  BranchTenant,
  DepartmentConfig,
  ServiceConfig,
  ChurchSettings,
  Child,
  AttendanceRecord,
} from '../types';
import {
  Sliders,
  Layers,
  Edit2,
  Trash2,
  Plus,
  Save,
  Check,
  RotateCcw,
  Lock,
  Unlock,
  KeyRound,
  Church,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  Building2,
  ExternalLink,
  Users,
  UploadCloud,
  Sparkles,
  Download,
} from 'lucide-react';
import { RAW_SAMPLE_CSV_TEXT } from '../mockData';

interface AdminPortalProps {
  departments: DepartmentConfig[];
  services: ServiceConfig[];
  settings: ChurchSettings;
  branches: BranchTenant[];
  currentBranch: BranchTenant;
  childrenList?: Child[];
  attendance?: AttendanceRecord[];
  onSelectBranch: (branchId: string) => void;
  onAddBranch: (branch: BranchTenant) => void;
  onUpdateBranch: (branch: BranchTenant) => void;
  onOpenImportCsvModal: () => void;
  isAdminLoggedIn: boolean;
  onOpenLoginModal: () => void;
  onAdminLogout: () => void;
  onUpdateDepartments: (departments: DepartmentConfig[]) => void;
  onUpdateServices: (services: ServiceConfig[]) => void;
  onUpdateSettings: (settings: ChurchSettings) => void;
  onResetAllData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  departments,
  services,
  settings,
  branches,
  currentBranch,
  childrenList = [],
  attendance = [],
  onSelectBranch,
  onAddBranch,
  onUpdateBranch,
  onOpenImportCsvModal,
  isAdminLoggedIn,
  onOpenLoginModal,
  onAdminLogout,
  onUpdateDepartments,
  onUpdateServices,
  onUpdateSettings,
  onResetAllData,
}) => {
  // If not logged in, show authenticated portal gate
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-xl mx-auto my-8 sm:my-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Admin Authentication Required</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
            Please log in with the administrator passcode to rename children church classes, upload student rosters, manage branches, and configure services.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left text-xs text-blue-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-blue-950">
            <KeyRound className="w-4 h-4 text-blue-700" />
            <span>Default Passcode Notice</span>
          </div>
          <p>
            Current Active Passcode: <strong>{currentBranch?.adminPasscode || settings.adminPasscode || '1234'}</strong>
          </p>
          <p className="text-slate-500">
            Click the button below to sign in.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLoginModal}
          className="w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Unlock className="w-4 h-4" />
          <span>Open Admin Sign-In</span>
        </button>
      </div>
    );
  }

  // Active sub-tab in Admin
  const [activeAdminSection, setActiveAdminSection] = useState<
    'branches' | 'csv-upload' | 'departments' | 'services' | 'church' | 'security'
  >('branches');

  // Success Feedback Toast
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // ==================== 1. BRANCH TENANTS MANAGEMENT ====================
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchShortName, setNewBranchShortName] = useState('');
  const [newBranchChurchName, setNewBranchChurchName] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchState, setNewBranchState] = useState('');
  const [newBranchVenue, setNewBranchVenue] = useState('');
  const [newBranchEmail, setNewBranchEmail] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [newBranchPastor, setNewBranchPastor] = useState('');

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;

    const shortName = newBranchShortName.trim() || newBranchCity.trim() || 'Parish';
    const newBranch: BranchTenant = {
      id: `branch-${Date.now()}`,
      name: newBranchName.trim(),
      shortName,
      churchName: newBranchChurchName.trim() || `The Covenant Nation ${shortName}`,
      city: newBranchCity.trim() || 'Nigeria',
      state: newBranchState.trim() || '',
      branchVenue: newBranchVenue.trim() || 'Church Center Auditorium',
      contactEmail: newBranchEmail.trim() || `tcn${shortName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      emergencyPhone: newBranchPhone.trim() || '+234 800 000 0000',
      pastorInCharge: newBranchPastor.trim() || 'Resident Pastor',
      childrenPastor: 'Children Ministry Lead',
      adminPasscode: '1234',
      schedules: [
        { label: '1st Service', time: '8:00 AM' },
        { label: '2nd Service', time: '10:30 AM' },
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    onAddBranch(newBranch);
    setIsAddingBranch(false);
    setNewBranchName('');
    setNewBranchShortName('');
    setNewBranchChurchName('');
    setNewBranchCity('');
    setNewBranchState('');
    setNewBranchVenue('');
    setNewBranchEmail('');
    setNewBranchPhone('');
    setNewBranchPastor('');
    showFeedback(`✓ New parish branch "${newBranch.name}" created successfully!`);
  };

  // ==================== 2. DEPARTMENTS EDITING ====================
  const [deptList, setDeptList] = useState<DepartmentConfig[]>(departments);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptAgeRange, setNewDeptAgeRange] = useState('');
  const [newDeptLocation, setNewDeptLocation] = useState('');
  const [newDeptTeacher, setNewDeptTeacher] = useState('');
  const [isAddingDept, setIsAddingDept] = useState(false);

  // Sync if props change on branch switch
  React.useEffect(() => {
    setDeptList(departments);
  }, [departments]);

  const handleSaveDepartment = (
    deptId: string,
    updatedName: string,
    updatedLocation: string,
    updatedTeacher: string,
    updatedAgeRange: string
  ) => {
    const updated = deptList.map((d) =>
      d.id === deptId
        ? {
            ...d,
            name: updatedName.trim() || d.name,
            location: updatedLocation.trim() || d.location,
            teacherInCharge: updatedTeacher.trim() || d.teacherInCharge,
            ageRange: updatedAgeRange.trim() || d.ageRange,
          }
        : d
    );
    setDeptList(updated);
    onUpdateDepartments(updated);
    setEditingDeptId(null);
    showFeedback("✓ Children's Church department name successfully updated!");
  };

  const handleAddNewDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    const newDept: DepartmentConfig = {
      id: `dept-${Date.now()}`,
      branchId: currentBranch.id,
      name: newDeptName.trim(),
      ageRange: newDeptAgeRange.trim() || 'All Ages',
      minAge: 0,
      maxAge: 18,
      location: newDeptLocation.trim() || 'Main Children Hall',
      color: 'blue',
      teacherInCharge: newDeptTeacher.trim() || 'Department Teacher',
    };

    const updated = [...deptList, newDept];
    setDeptList(updated);
    onUpdateDepartments(updated);
    setNewDeptName('');
    setNewDeptAgeRange('');
    setNewDeptLocation('');
    setNewDeptTeacher('');
    setIsAddingDept(false);
    showFeedback("✓ New Children's Church class added successfully!");
  };

  const handleDeleteDepartment = (deptId: string, deptName: string) => {
    if (deptList.length <= 1) {
      alert("You must have at least one Children's Church department.");
      return;
    }
    if (confirm(`Are you sure you want to remove the class "${deptName}"?`)) {
      const updated = deptList.filter((d) => d.id !== deptId);
      setDeptList(updated);
      onUpdateDepartments(updated);
      showFeedback('✓ Department removed.');
    }
  };

  // ==================== 3. SERVICES EDITING ====================
  const [servicesList, setServicesList] = useState<ServiceConfig[]>(services);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceTime, setNewServiceTime] = useState('');
  const [newServiceDay, setNewServiceDay] = useState('Sunday');
  const [isAddingService, setIsAddingService] = useState(false);

  React.useEffect(() => {
    setServicesList(services);
  }, [services]);

  const handleSaveService = (serviceId: string, updatedName: string, updatedTime: string, updatedDay: string) => {
    const updated = servicesList.map((s) =>
      s.id === serviceId
        ? {
            ...s,
            name: updatedName.trim() || s.name,
            time: updatedTime.trim() || s.time,
            day: updatedDay.trim() || s.day,
          }
        : s
    );
    setServicesList(updated);
    onUpdateServices(updated);
    setEditingServiceId(null);
    showFeedback('✓ Service configuration saved!');
  };

  const handleToggleServiceActive = (serviceId: string) => {
    const updated = servicesList.map((s) =>
      s.id === serviceId ? { ...s, isActive: !s.isActive } : s
    );
    setServicesList(updated);
    onUpdateServices(updated);
    showFeedback('✓ Service status toggled.');
  };

  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newService: ServiceConfig = {
      id: `service-${Date.now()}`,
      branchId: currentBranch.id,
      name: newServiceName.trim(),
      time: newServiceTime.trim() || 'Schedule TBA',
      day: newServiceDay,
      isActive: true,
      description: 'Special church service and children fellowship',
    };

    const updated = [...servicesList, newService];
    setServicesList(updated);
    onUpdateServices(updated);
    setNewServiceName('');
    setNewServiceTime('');
    setIsAddingService(false);
    showFeedback('✓ New church service added!');
  };

  const handleDeleteService = (serviceId: string, serviceName: string) => {
    if (servicesList.length <= 1) {
      alert('You must retain at least one service.');
      return;
    }
    if (confirm(`Remove the service "${serviceName}"?`)) {
      const updated = servicesList.filter((s) => s.id !== serviceId);
      setServicesList(updated);
      onUpdateServices(updated);
      showFeedback('✓ Service removed.');
    }
  };

  // ==================== 4. CHURCH VENUE & DETAILS ====================
  const [churchNameInput, setChurchNameInput] = useState(currentBranch.churchName);
  const [branchVenueInput, setBranchVenueInput] = useState(currentBranch.branchVenue);
  const [emergencyPhoneInput, setEmergencyPhoneInput] = useState(currentBranch.emergencyPhone);
  const [pastorInput, setPastorInput] = useState(currentBranch.pastorInCharge);
  const [coordinatorInput, setCoordinatorInput] = useState(currentBranch.childrenPastor);

  React.useEffect(() => {
    setChurchNameInput(currentBranch.churchName);
    setBranchVenueInput(currentBranch.branchVenue);
    setEmergencyPhoneInput(currentBranch.emergencyPhone);
    setPastorInput(currentBranch.pastorInCharge);
    setCoordinatorInput(currentBranch.childrenPastor);
  }, [currentBranch]);

  const handleSaveChurchSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBranch: BranchTenant = {
      ...currentBranch,
      churchName: churchNameInput.trim() || currentBranch.churchName,
      branchVenue: branchVenueInput.trim() || currentBranch.branchVenue,
      emergencyPhone: emergencyPhoneInput.trim(),
      pastorInCharge: pastorInput.trim(),
      childrenPastor: coordinatorInput.trim(),
    };
    onUpdateBranch(updatedBranch);
    showFeedback(`✓ Details for ${updatedBranch.name} saved!`);
  };

  // ==================== 5. PASSCODE & RESET ====================
  const [currentPasscode, setCurrentPasscode] = useState(currentBranch.adminPasscode || '1234');
  const [newPasscodeInput, setNewPasscodeInput] = useState('');

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscodeInput.trim() || newPasscodeInput.trim().length < 4) {
      alert('Passcode must be at least 4 characters/digits.');
      return;
    }
    const updatedBranch: BranchTenant = {
      ...currentBranch,
      adminPasscode: newPasscodeInput.trim(),
    };
    onUpdateBranch(updatedBranch);
    setCurrentPasscode(newPasscodeInput.trim());
    setNewPasscodeInput('');
    showFeedback(`✓ Admin passcode for ${currentBranch.name} successfully changed!`);
  };

  // ==================== CSV EXPORT HANDLERS (ADMIN ONLY) ====================
  const handleExportStudents = () => {
    const list = childrenList || [];
    if (list.length === 0) {
      alert(`No student records found in ${currentBranch.name} to export.`);
      return;
    }
    const headers = [
      'Full Name',
      'Age',
      'Class',
      'Gender',
      'Parent Name',
      'Phone',
      'Alt Phone',
      'Email',
      'Address',
      'Emergency Contact',
      'Allergies / Medical Notes',
      'Special Notes',
      'Registered Date',
    ];
    const rows = list.map((c) => {
      const dept = departments.find((d) => d.id === c.departmentId);
      return [
        `"${c.fullName.replace(/"/g, '""')}"`,
        c.age,
        `"${(dept?.name || 'Children Church').replace(/"/g, '""')}"`,
        c.gender,
        `"${(c.parentName || '').replace(/"/g, '""')}"`,
        `"${c.parentPhone || ''}"`,
        `"${c.secondaryContactPhone || ''}"`,
        `"${c.email || ''}"`,
        `"${(c.homeAddress || '').replace(/"/g, '""')}"`,
        `"${(c.emergencyContact || '').replace(/"/g, '""')}"`,
        `"${(c.allergiesMedicalNotes || 'None').replace(/"/g, '""')}"`,
        `"${(c.specialNotes || '').replace(/"/g, '""')}"`,
        `"${c.registeredDate || ''}"`,
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentBranch.shortName.replace(/\s+/g, '_')}_Students_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback(`✓ Exported ${list.length} student records for ${currentBranch.shortName} to CSV!`);
  };

  const handleExportAttendance = () => {
    const list = attendance || [];
    if (list.length === 0) {
      alert(`No attendance records found for ${currentBranch.name} to export.`);
      return;
    }
    const headers = [
      'Child Name',
      'Service',
      'Class / Department',
      'Date',
      'Check-In Time',
      'Check-Out Time',
      'Status',
      'Pickup Security Code',
      'Parent Name',
      'Parent Phone',
      'Checked-In By',
      'Authorized Pickup By',
      'Allergies / Notes',
    ];
    const rows = list.map((a) => [
      `"${a.childName.replace(/"/g, '""')}"`,
      `"${a.serviceName.replace(/"/g, '""')}"`,
      `"${a.departmentName.replace(/"/g, '""')}"`,
      `"${a.date}"`,
      `"${a.checkInTime}"`,
      `"${a.checkOutTime || 'Pending'}"`,
      `"${a.status}"`,
      `"${a.pickupSecurityCode}"`,
      `"${(a.parentName || '').replace(/"/g, '""')}"`,
      `"${a.parentPhone || ''}"`,
      `"${a.checkedInBy || ''}"`,
      `"${(a.checkedOutBy || '').replace(/"/g, '""')}"`,
      `"${(a.allergiesMedicalNotes || 'None').replace(/"/g, '""')}"`,
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentBranch.shortName.replace(/\s+/g, '_')}_Attendance_Records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback(`✓ Exported ${list.length} attendance records for ${currentBranch.shortName} to CSV!`);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([RAW_SAMPLE_CSV_TEXT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'TCN_Students_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback('✓ Downloaded official CSV template.');
  };

  return (
    <div className="space-y-6">
      {/* Admin Portal Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/25 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5 text-purple-300" />
            <span>Multi-Tenant Administrator Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Church Branches & System Administration
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl mt-1">
            Managing: <strong className="text-white underline">{currentBranch.name}</strong> ({currentBranch.city}). Upload student CSV files for classes, rename departments, and manage parish tenants.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl text-xs font-semibold">
            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Active</span>
          </div>
          <button
            type="button"
            onClick={onAdminLogout}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Lock Admin
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Admin Subtabs Navigation (Mobile-Optimized Horizontal Scroll) */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveAdminSection('branches')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeAdminSection === 'branches'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Branches (Multi-Tenant)</span>
          <span className="text-[10px] bg-purple-900 text-purple-100 px-1.5 py-0.2 rounded-full font-bold">
            {branches.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSection('csv-upload')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeAdminSection === 'csv-upload'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Import & Export CSV</span>
          <span className="text-[10px] bg-amber-800 text-amber-100 px-1.5 py-0.2 rounded-full font-bold">
            Hub
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSection('departments')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeAdminSection === 'departments'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Class Names ({currentBranch.shortName})</span>
          <span className="text-[10px] bg-purple-900 text-purple-100 px-1.5 py-0.2 rounded-full font-bold">
            {deptList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSection('services')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeAdminSection === 'services'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Services</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSection('church')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeAdminSection === 'church'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Church className="w-4 h-4" />
          <span>Venue & Contacts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSection('security')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeAdminSection === 'security'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>PIN & Reset</span>
        </button>
      </div>

      {/* ==================== 1. MULTI-TENANT BRANCHES TAB ==================== */}
      {activeAdminSection === 'branches' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-700" />
                <span>Multi-Tenant Parish Branches</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every church branch (Uyo, Iganmu, Lekki, Abuja, etc.) has independent students, class rosters, services, and attendance records.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingBranch(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Branch Parish</span>
            </button>
          </div>

          {/* Add Branch Modal/Form */}
          {isAddingBranch && (
            <form
              onSubmit={handleCreateBranch}
              className="bg-purple-50/80 border border-purple-200 rounded-3xl p-5 sm:p-6 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-purple-950 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-700" />
                  <span>Register New Church Branch Parish</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingBranch(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="e.g. Port Harcourt Parish"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Name / Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranchShortName}
                    onChange={(e) => setNewBranchShortName(e.target.value)}
                    placeholder="e.g. PH / Calabar"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Church Name
                  </label>
                  <input
                    type="text"
                    value={newBranchChurchName}
                    onChange={(e) => setNewBranchChurchName(e.target.value)}
                    placeholder="e.g. The Covenant Nation Port Harcourt"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranchCity}
                    onChange={(e) => setNewBranchCity(e.target.value)}
                    placeholder="e.g. Port Harcourt"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={newBranchState}
                    onChange={(e) => setNewBranchState(e.target.value)}
                    placeholder="e.g. Rivers State"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    value={newBranchPhone}
                    onChange={(e) => setNewBranchPhone(e.target.value)}
                    placeholder="e.g. +234 803 000 0000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Physical Venue / Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranchVenue}
                    onChange={(e) => setNewBranchVenue(e.target.value)}
                    placeholder="e.g. Hotel Presidential Hall, Aba Road, Port Harcourt"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={newBranchEmail}
                    onChange={(e) => setNewBranchEmail(e.target.value)}
                    placeholder="e.g. tcnph@gmail.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBranch(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Save & Provision Branch
                </button>
              </div>
            </form>
          )}

          {/* Branches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branches.map((b) => {
              const isActive = b.id === currentBranch.id;

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl border p-5 transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900">
                            {b.name}
                          </h4>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {b.shortName}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-purple-700 mt-0.5">
                          {b.churchName}
                        </p>
                      </div>

                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Current Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectBranch(b.id);
                            showFeedback(`✓ Switched to ${b.name}!`);
                          }}
                          className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
                        >
                          Switch Branch
                        </button>
                      )}
                    </div>

                    <div className="pt-2 text-xs text-slate-600 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{b.branchVenue}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono">{b.emergencyPhone}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Pastor: <strong className="text-slate-700">{b.pastorInCharge}</strong> • Email: <span className="font-mono">{b.contactEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      PIN: <strong className="font-mono text-slate-700">{b.adminPasscode || '1234'}</strong>
                    </span>
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectBranch(b.id);
                          showFeedback(`✓ Switched to ${b.name}!`);
                        }}
                        className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                      >
                        Manage this parish →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== 2. CSV IMPORT & EXPORT HUB ==================== */}
      {activeAdminSection === 'csv-upload' && (
        <div className="space-y-6">
          {/* Admin Policy Notice */}
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 text-sm">
                Authorized Admin Data Management Policy
              </h4>
              <p className="mt-0.5 text-amber-800/90 leading-relaxed">
                In compliance with church data security and privacy guidelines, student CSV rosters can <strong>only be imported or exported directly from this Administrator Dashboard</strong>. Public check-in desks and student directories are restricted from uploading files.
              </p>
            </div>
          </div>

          {/* Action Cards Grid: Import & Export */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 1. CSV IMPORT CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <UploadCloud className="w-4 h-4 text-amber-600" />
                    <span>Import Students</span>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    {currentBranch.shortName}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Upload CSV File of Students for Different Classes
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Batch-enrol students for <strong className="text-slate-900">{currentBranch.name}</strong>. Assign to specific classes or let the CSV automatically detect and register new classes.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1 font-mono">
                  <div className="font-bold text-slate-700 font-sans">Supported Header Format:</div>
                  <div className="text-slate-500 overflow-x-auto">
                    Full Name, Age, Class, Gender, Parent Name, Phone, Alt Phone, Email, Address, Emergency Contact, Allergies, Special Notes
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={onOpenImportCsvModal}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer active:scale-98"
                >
                  <UploadCloud className="w-4 h-4 text-slate-950" />
                  <span>Open Student CSV Uploader</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>
            </div>

            {/* 2. CSV EXPORT CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Export to CSV</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Excel & Sheets Ready
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Export Student Rosters & Attendance Records
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Download structured <code>.CSV</code> files of registered children, phone directories, medical allergy alerts, and church attendance logs for reporting.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <span className="text-[11px] text-slate-500 block">Registered Students</span>
                    <strong className="text-lg font-black text-slate-800">{childrenList.length}</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <span className="text-[11px] text-slate-500 block">Attendance Logs</span>
                    <strong className="text-lg font-black text-slate-800">{attendance.length}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportStudents}
                  className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Students Roster ({childrenList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportAttendance}
                  className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Attendance ({attendance.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sample Table Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Standard Children's Church Sample Template Preview
                </h4>
                <p className="text-xs text-slate-500">
                  Matches the standard format for The Covenant Nation children church departments.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenImportCsvModal}
                className="text-xs font-bold text-amber-700 hover:underline cursor-pointer self-start sm:self-auto"
              >
                Import this sample batch in modal →
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold">
                  <tr>
                    <th className="px-3 py-2">Student Name</th>
                    <th className="px-2 py-2">Age</th>
                    <th className="px-3 py-2">Class</th>
                    <th className="px-2 py-2">Gender</th>
                    <th className="px-3 py-2">Parent Name</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2">Allergies / Special Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="px-3 py-2 font-bold text-slate-900">David John</td>
                    <td className="px-2 py-2">8</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">Kingdom Kids</span></td>
                    <td className="px-2 py-2">Boy</td>
                    <td className="px-3 py-2">Mrs John</td>
                    <td className="px-3 py-2 font-mono">08034567890</td>
                    <td className="px-3 py-2 text-slate-500">First time visitor</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-bold text-slate-900">Sarah Oluwaseun</td>
                    <td className="px-2 py-2">3</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold">Little Angels</span></td>
                    <td className="px-2 py-2">Girl</td>
                    <td className="px-3 py-2">Deacon & Mrs Oluwaseun</td>
                    <td className="px-3 py-2 font-mono">08023456781</td>
                    <td className="px-3 py-2 text-rose-600 font-semibold">No dairy products</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-bold text-slate-900">Daniel Okon</td>
                    <td className="px-2 py-2">5</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">Stars & Sunbeams</span></td>
                    <td className="px-2 py-2">Boy</td>
                    <td className="px-3 py-2">Pastor Okon</td>
                    <td className="px-3 py-2 font-mono">08076543210</td>
                    <td className="px-3 py-2 text-amber-700 font-semibold">Asthma inhaler in bag</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. DEPARTMENTS SECTION ==================== */}
      {activeAdminSection === 'departments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Rename & Manage Children's Church Classes ({currentBranch.shortName})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize department names (e.g. Kingdom Kids, Little Angels, Stars & Sunbeams, Junior Church), room locations, and lead teachers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingDept(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Class</span>
            </button>
          </div>

          {isAddingDept && (
            <form
              onSubmit={handleAddNewDepartment}
              className="bg-purple-50/60 border border-purple-200 rounded-3xl p-5 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-purple-950">Add New Class in {currentBranch.shortName}</h4>
                <button
                  type="button"
                  onClick={() => setIsAddingDept(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Class / Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="e.g. Kingdom Kids"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Age Range
                  </label>
                  <input
                    type="text"
                    value={newDeptAgeRange}
                    onChange={(e) => setNewDeptAgeRange(e.target.value)}
                    placeholder="e.g. 6 - 8 Years"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Room / Hall Location
                  </label>
                  <input
                    type="text"
                    value={newDeptLocation}
                    onChange={(e) => setNewDeptLocation(e.target.value)}
                    placeholder="e.g. Hall B"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Teacher in Charge
                  </label>
                  <input
                    type="text"
                    value={newDeptTeacher}
                    onChange={(e) => setNewDeptTeacher(e.target.value)}
                    placeholder="e.g. Teacher Emmanuel"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDept(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold"
                >
                  Save Class
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {deptList.map((dept) => {
              const isEditing = editingDeptId === dept.id;

              return (
                <DepartmentRowCard
                  key={dept.id}
                  dept={dept}
                  isEditing={isEditing}
                  onStartEdit={() => setEditingDeptId(dept.id)}
                  onCancelEdit={() => setEditingDeptId(null)}
                  onSave={handleSaveDepartment}
                  onDelete={() => handleDeleteDepartment(dept.id, dept.name)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== 4. SERVICES TAB ==================== */}
      {activeAdminSection === 'services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Church Services Management ({currentBranch.shortName})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure schedules for First Service, Second Service, Mid-Week, and special programs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingService(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Service</span>
            </button>
          </div>

          {isAddingService && (
            <form
              onSubmit={handleAddNewService}
              className="bg-blue-50/60 border border-blue-200 rounded-3xl p-5 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-blue-950">Add Service</h4>
                <button
                  type="button"
                  onClick={() => setIsAddingService(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="e.g. 3rd Service"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Time Schedule
                  </label>
                  <input
                    type="text"
                    value={newServiceTime}
                    onChange={(e) => setNewServiceTime(e.target.value)}
                    placeholder="e.g. 11:30 AM - 01:15 PM"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={newServiceDay}
                    onChange={(e) => setNewServiceDay(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="All">All / Special</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingService(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold"
                >
                  Save Service
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {servicesList.map((service) => {
              const isEditing = editingServiceId === service.id;

              return (
                <ServiceRowCard
                  key={service.id}
                  service={service}
                  isEditing={isEditing}
                  onStartEdit={() => setEditingServiceId(service.id)}
                  onCancelEdit={() => setEditingServiceId(null)}
                  onSave={handleSaveService}
                  onToggleActive={() => handleToggleServiceActive(service.id)}
                  onDelete={() => handleDeleteService(service.id, service.name)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== 5. VENUE & DETAILS TAB ==================== */}
      {activeAdminSection === 'church' && (
        <form
          onSubmit={handleSaveChurchSettings}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
        >
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Church className="w-5 h-5 text-blue-700" />
              <span>Parish Venue & Branch Contacts ({currentBranch.name})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These details appear on printed security claim slips, badges, and the church overview card.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Church Brand Name
              </label>
              <input
                type="text"
                required
                value={churchNameInput}
                onChange={(e) => setChurchNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Emergency & Security Hotline
              </label>
              <input
                type="text"
                required
                value={emergencyPhoneInput}
                onChange={(e) => setEmergencyPhoneInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Physical Parish Venue & Address
              </label>
              <input
                type="text"
                required
                value={branchVenueInput}
                onChange={(e) => setBranchVenueInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pastor in Charge
              </label>
              <input
                type="text"
                value={pastorInput}
                onChange={(e) => setPastorInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Children's Ministry Lead
              </label>
              <input
                type="text"
                value={coordinatorInput}
                onChange={(e) => setCoordinatorInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Parish Details</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================== 6. PIN & RESET TAB ==================== */}
      {activeAdminSection === 'security' && (
        <div className="space-y-6">
          <form
            onSubmit={handleChangePasscode}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
          >
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <span>Admin Passcode Security ({currentBranch.shortName})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current active passcode for this parish: <strong className="font-mono">{currentPasscode}</strong>
              </p>
            </div>

            <div className="max-w-md">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Admin Passcode (minimum 4 digits)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={newPasscodeInput}
                  onChange={(e) => setNewPasscodeInput(e.target.value)}
                  placeholder="Enter new PIN"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition cursor-pointer"
                >
                  Update PIN
                </button>
              </div>
            </div>
          </form>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-rose-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-600" />
                <span>Restore Default Factory Seed Data</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Reset all branches, pre-seeded classes, and student records back to initial default state.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to reset all data back to factory defaults?')) {
                  onResetAllData();
                }
              }}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default Data</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for individual Department Row
interface DepartmentRowCardProps {
  dept: DepartmentConfig;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (
    deptId: string,
    updatedName: string,
    updatedLocation: string,
    updatedTeacher: string,
    updatedAgeRange: string
  ) => void;
  onDelete: () => void;
}

const DepartmentRowCard: React.FC<DepartmentRowCardProps> = ({
  dept,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}) => {
  const [nameVal, setNameVal] = useState(dept.name);
  const [locVal, setLocVal] = useState(dept.location);
  const [teacherVal, setTeacherVal] = useState(dept.teacherInCharge);
  const [ageRangeVal, setAgeRangeVal] = useState(dept.ageRange);

  if (isEditing) {
    return (
      <div className="bg-purple-50/70 border-2 border-purple-400 rounded-2xl p-4 space-y-3 animate-in fade-in">
        <div className="font-bold text-xs uppercase text-purple-900 tracking-wider">
          Renaming Children's Church Department
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">
              Class Name *
            </label>
            <input
              type="text"
              required
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">
              Age Range
            </label>
            <input
              type="text"
              value={ageRangeVal}
              onChange={(e) => setAgeRangeVal(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">
              Room / Hall Location
            </label>
            <input
              type="text"
              value={locVal}
              onChange={(e) => setLocVal(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">
              Teacher in Charge
            </label>
            <input
              type="text"
              value={teacherVal}
              onChange={(e) => setTeacherVal(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(dept.id, nameVal, locVal, teacherVal, ageRangeVal)}
            className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-purple-300 hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
            {dept.name}
          </h4>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            {dept.ageRange}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {dept.location}
          </span>
          <span>•</span>
          <span>Lead: <strong className="text-slate-700">{dept.teacherInCharge}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          type="button"
          onClick={onStartEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Rename / Edit</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
          title="Delete department"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// Sub-component for individual Service Row
interface ServiceRowCardProps {
  service: ServiceConfig;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (serviceId: string, updatedName: string, updatedTime: string, updatedDay: string) => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

const ServiceRowCard: React.FC<ServiceRowCardProps> = ({
  service,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onToggleActive,
  onDelete,
}) => {
  const [nameVal, setNameVal] = useState(service.name);
  const [timeVal, setTimeVal] = useState(service.time);
  const [dayVal, setDayVal] = useState(service.day);

  if (isEditing) {
    return (
      <div className="bg-blue-50/70 border-2 border-blue-400 rounded-2xl p-4 space-y-3 animate-in fade-in">
        <div className="font-bold text-xs uppercase text-blue-900 tracking-wider">
          Edit Church Service
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">
              Time Schedule
            </label>
            <input
              type="text"
              value={timeVal}
              onChange={(e) => setTimeVal(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">
              Day of Week
            </label>
            <select
              value={dayVal}
              onChange={(e) => setDayVal(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            >
              <option value="Sunday">Sunday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="All">All / Special</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(service.id, nameVal, timeVal, dayVal)}
            className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Service</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        service.isActive
          ? 'bg-white border-slate-200 hover:border-blue-300'
          : 'bg-slate-50 border-slate-200 opacity-60'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
            {service.name}
          </h4>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
            {service.day}
          </span>
          {service.isActive ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Active
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
              Disabled
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Schedule: <strong className="text-slate-700">{service.time}</strong>
          {service.description && ` • ${service.description}`}
        </p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          type="button"
          onClick={onToggleActive}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            service.isActive
              ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          {service.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          type="button"
          onClick={onStartEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Rename</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
          title="Delete service"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
