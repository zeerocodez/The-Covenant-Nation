export type ChildClass = 'KINGDOM TOTS' | 'KINGDOM GIANTS' | 'GIDEON FORCE' | 'UNASSIGNED';

export interface Child {
  id: number;
  childId: string; // e.g., TCN-KID-0001
  name: string;
  guardian1Name: string;
  guardian1Phone: string;
  guardian2Name?: string;
  guardian2Phone?: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  gender: 'Boy' | 'Girl';
  assignedClass: ChildClass;
  allergies?: string;
  medicalNotes?: string;
  address?: string;
  emergencyContact?: string;
  registrationDate: string;
  // Analytics & Follow-up
  attendancePercentage?: number;
  numberOfSundaysAttended?: number;
  lastAttendanceDate?: string;
  consecutiveAbsences: number;
  followUpStatus?: 'Contacted' | 'No Response' | 'Resolved' | 'Pending';
}

export interface CheckedInChild extends Child {
  checkInTime: string;
  sundayTagNumber: string; // e.g., 027
  guardianPickupCode: string; // e.g., 4-digit code
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  total: number;
  boys: number;
  girls: number;
  kingdomTots: number;
  kingdomGiants: number;
  gideonForce: number;
  firstTimeChildren: number;
  returningChildren: number;
  attendees: {
    id: number;
    childId: string;
    name: string;
    gender: 'Boy' | 'Girl';
    age: number;
    assignedClass: ChildClass;
  }[];
}

export interface Teacher {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role?: string;
  assignedClass?: ChildClass;
  registrationDate: string;
}

export interface TeacherOnDuty extends Teacher {
  checkInTime: string;
}

export type ViewTab = 'dashboard' | 'checkin' | 'register' | 'birthdays' | 'attendance' | 'teachers' | 'followup';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
