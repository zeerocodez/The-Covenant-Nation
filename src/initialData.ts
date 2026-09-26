import { Child, Teacher, AttendanceRecord } from './types';

// Helper to format date YYYY-MM-DD
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const now = new Date();
const todayYear = now.getFullYear();

// Sample children for TCN Children Church Uyo
export const INITIAL_CHILDREN: Child[] = [
  {
    id: 1711000001,
    name: 'David Effiong',
    parentPhone: '0803 762 9110',
    birthDate: `${todayYear - 7}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`, // Birthday today!
    age: 7,
    gender: 'Boy',
    emergencyContact: '0802 334 5566 (Uncle Bassey)',
    specialNotes: 'Asthmatic, has inhaler in bag',
    registrationDate: '2024-01-15',
  },
  {
    id: 1711000002,
    name: 'Emem Okon',
    parentPhone: '0812 456 7890',
    birthDate: `${todayYear - 5}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.min(28, now.getDate() + 3)).padStart(2, '0')}`, // Birthday this week!
    age: 5,
    gender: 'Girl',
    emergencyContact: '0803 111 2233',
    specialNotes: 'Nut allergy',
    registrationDate: '2024-02-10',
  },
  {
    id: 1711000003,
    name: 'Samuel Bassey',
    parentPhone: '0805 987 6543',
    birthDate: `${todayYear - 9}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.min(28, now.getDate() + 12)).padStart(2, '0')}`, // Upcoming this month!
    age: 9,
    gender: 'Boy',
    emergencyContact: '0703 444 8899',
    specialNotes: '',
    registrationDate: '2024-01-20',
  },
  {
    id: 1711000004,
    name: 'Kufre Udoh',
    parentPhone: '0802 998 7766',
    birthDate: `${todayYear - 6}-04-18`,
    age: 6,
    gender: 'Boy',
    emergencyContact: '0803 667 8899',
    specialNotes: '',
    registrationDate: '2024-03-01',
  },
  {
    id: 1711000005,
    name: 'Blessing Archibong',
    parentPhone: '0816 778 8990',
    birthDate: `${todayYear - 8}-08-24`,
    age: 8,
    gender: 'Girl',
    emergencyContact: '0813 555 4433',
    specialNotes: 'Lactose intolerant',
    registrationDate: '2024-02-28',
  },
  {
    id: 1711000006,
    name: 'Daniel Akpan',
    parentPhone: '0809 123 4567',
    birthDate: `${todayYear - 4}-11-05`,
    age: 4,
    gender: 'Boy',
    emergencyContact: '0802 777 9900',
    specialNotes: '',
    registrationDate: '2024-03-12',
  },
];

// Sample teachers on duty
export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 101,
    name: 'Sister Anietie Udoh',
    phone: '0803 123 4567',
    registrationDate: '2024-01-10',
  },
  {
    id: 102,
    name: 'Brother Idongesit Ekpo',
    phone: '0802 987 6543',
    registrationDate: '2024-01-12',
  },
  {
    id: 103,
    name: 'Sister Victoria Asuquo',
    phone: '0814 555 1234',
    registrationDate: '2024-02-01',
  },
  {
    id: 104,
    name: 'Brother Nsikak Umoh',
    phone: '0806 777 8899',
    registrationDate: '2024-02-15',
  },
];

// Past Sunday attendance history
export const INITIAL_ATTENDANCE_HISTORY: AttendanceRecord[] = [
  {
    date: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    total: 24,
    boys: 13,
    girls: 11,
    attendees: [],
  },
  {
    date: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
    total: 28,
    boys: 15,
    girls: 13,
    attendees: [],
  },
  {
    date: formatDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)),
    total: 22,
    boys: 12,
    girls: 10,
    attendees: [],
  },
  {
    date: formatDate(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)),
    total: 26,
    boys: 14,
    girls: 12,
    attendees: [],
  },
];
