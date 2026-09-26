export interface Child {
  id: number;
  name: string;
  parentPhone: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  gender: 'Boy' | 'Girl';
  emergencyContact?: string;
  specialNotes?: string;
  registrationDate: string;
}

export interface CheckedInChild extends Child {
  checkInTime: string;
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  total: number;
  boys: number;
  girls: number;
  attendees: {
    id: number;
    name: string;
    gender: 'Boy' | 'Girl';
    age: number;
  }[];
}

export interface Teacher {
  id: number;
  name: string;
  phone: string;
  registrationDate: string;
}

export interface TeacherOnDuty extends Teacher {
  checkInTime: string;
}

export type ViewTab = 'dashboard' | 'checkin' | 'register' | 'birthdays' | 'attendance' | 'teachers';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
