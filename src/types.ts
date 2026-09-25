export interface BranchTenant {
  id: string;
  name: string;
  shortName: string;
  churchName: string;
  city: string;
  state: string;
  branchVenue: string;
  contactEmail: string;
  emergencyPhone: string;
  pastorInCharge: string;
  childrenPastor: string;
  adminPasscode: string;
  schedules: { label: string; time: string }[];
  instagramUrl?: string;
  facebookUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceConfig {
  id: string;
  branchId?: string;
  name: string;
  time: string;
  day: 'Sunday' | 'Wednesday' | 'Friday' | 'Saturday' | 'All' | string;
  isActive: boolean;
  description?: string;
}

export interface DepartmentConfig {
  id: string;
  branchId?: string;
  name: string;
  ageRange: string;
  minAge: number;
  maxAge: number;
  location: string;
  color: string; // tailwind color token, e.g. 'emerald', 'sky', 'indigo', 'amber', 'rose'
  teacherInCharge: string;
  notes?: string;
}

export interface Child {
  id: string;
  branchId?: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female';
  departmentId: string;
  parentName: string;
  parentPhone: string;
  secondaryContactName?: string;
  secondaryContactPhone?: string;
  email?: string;
  homeAddress?: string;
  emergencyContact?: string;
  allergiesMedicalNotes: string;
  specialNotes?: string;
  notes?: string;
  isFirstTimer?: boolean;
  registeredDate: string;
  avatarColor: string;
}

export interface AttendanceRecord {
  id: string;
  branchId?: string;
  childId: string;
  childName: string;
  serviceId: string;
  serviceName: string;
  departmentId: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string;
  checkOutTime?: string;
  status: 'checked_in' | 'checked_out';
  pickupSecurityCode: string;
  parentName: string;
  parentPhone: string;
  checkedInBy: string;
  checkedOutBy?: string;
  allergiesMedicalNotes?: string;
  notes?: string;
}

export interface ChurchSettings {
  churchName: string;
  branchName: string;
  emergencyPhone: string;
  pastorInCharge: string;
  childrenPastor: string;
  adminPasscode: string;
  requireSecurityCodeOnCheckout: boolean;
  autoSelectDepartmentByAge: boolean;
  activeBranchId?: string;
}

export type ActiveTab = 'check-in' | 'check-out' | 'children' | 'reports' | 'admin';

