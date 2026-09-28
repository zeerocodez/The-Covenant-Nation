import { Child, Teacher, AttendanceRecord, ChildClass } from './types';

// Helper to format date YYYY-MM-DD
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const now = new Date();
const todayYear = now.getFullYear();

export const getAssignedClass = (age: number): ChildClass => {
  if (age >= 1 && age <= 3) return 'KINGDOM TOTS';
  if (age >= 4 && age <= 5) return 'KINGDOM GIANTS';
  if (age >= 6 && age <= 7) return 'GIDEON FORCE';
  return 'UNASSIGNED';
};

// Sample children for TCN Children Church Uyo
export const INITIAL_CHILDREN: Child[] = [
  {
    id: 1711000001,
    childId: 'TCN-KID-0001',
    name: 'David Effiong',
    guardian1Name: 'Mr. Effiong',
    guardian1Phone: '0803 762 9110',
    birthDate: `${todayYear - 7}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`, // Birthday today!
    age: 7,
    gender: 'Boy',
    assignedClass: getAssignedClass(7),
    emergencyContact: '0802 334 5566 (Uncle Bassey)',
    medicalNotes: 'Asthmatic, has inhaler in bag',
    registrationDate: '2024-01-15',
    consecutiveAbsences: 0,
  },
  {
    id: 1711000002,
    childId: 'TCN-KID-0002',
    name: 'Emem Okon',
    guardian1Name: 'Mrs. Okon',
    guardian1Phone: '0812 456 7890',
    birthDate: `${todayYear - 5}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.min(28, now.getDate() + 3)).padStart(2, '0')}`, // Birthday this week!
    age: 5,
    gender: 'Girl',
    assignedClass: getAssignedClass(5),
    emergencyContact: '0803 111 2233',
    allergies: 'Nut allergy',
    medicalNotes: 'Nut allergy',
    registrationDate: '2024-02-10',
    consecutiveAbsences: 1,
  },
  {
    id: 1711000003,
    childId: 'TCN-KID-0003',
    name: 'Samuel Bassey',
    guardian1Name: 'Mr. Bassey',
    guardian1Phone: '0805 987 6543',
    birthDate: `${todayYear - 9}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.min(28, now.getDate() + 12)).padStart(2, '0')}`, // Upcoming this month!
    age: 9,
    gender: 'Boy',
    assignedClass: getAssignedClass(9),
    emergencyContact: '0703 444 8899',
    registrationDate: '2024-01-20',
    consecutiveAbsences: 3,
    followUpStatus: 'Pending',
  },
  {
    id: 1711000004,
    childId: 'TCN-KID-0004',
    name: 'Kufre Udoh',
    guardian1Name: 'Mrs. Udoh',
    guardian1Phone: '0802 998 7766',
    birthDate: `${todayYear - 6}-04-18`,
    age: 6,
    gender: 'Boy',
    assignedClass: getAssignedClass(6),
    emergencyContact: '0803 667 8899',
    registrationDate: '2024-03-01',
    consecutiveAbsences: 0,
  },
  {
    id: 1711000005,
    childId: 'TCN-KID-0005',
    name: 'Blessing Archibong',
    guardian1Name: 'Mr. Archibong',
    guardian1Phone: '0816 778 8990',
    birthDate: `${todayYear - 8}-08-24`,
    age: 8,
    gender: 'Girl',
    assignedClass: getAssignedClass(8),
    emergencyContact: '0813 555 4433',
    allergies: 'Lactose intolerant',
    registrationDate: '2024-02-28',
    consecutiveAbsences: 0,
  },
  {
    id: 1711000006,
    childId: 'TCN-KID-0006',
    name: 'Daniel Akpan',
    guardian1Name: 'Mrs. Akpan',
    guardian1Phone: '0809 123 4567',
    birthDate: `${todayYear - 2}-11-05`,
    age: 2,
    gender: 'Boy',
    assignedClass: getAssignedClass(2),
    emergencyContact: '0802 777 9900',
    registrationDate: '2024-03-12',
    consecutiveAbsences: 0,
  },
];

// Sample teachers on duty
export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 101,
    name: 'Sister Anietie Udoh',
    phone: '0803 123 4567',
    role: 'Lead Teacher',
    assignedClass: 'KINGDOM TOTS',
    registrationDate: '2024-01-10',
  },
  {
    id: 102,
    name: 'Brother Idongesit Ekpo',
    phone: '0802 987 6543',
    role: 'Assistant',
    assignedClass: 'KINGDOM GIANTS',
    registrationDate: '2024-01-12',
  },
  {
    id: 103,
    name: 'Sister Victoria Asuquo',
    phone: '0814 555 1234',
    role: 'Lead Teacher',
    assignedClass: 'GIDEON FORCE',
    registrationDate: '2024-02-01',
  },
  {
    id: 104,
    name: 'Brother Nsikak Umoh',
    phone: '0806 777 8899',
    role: 'Assistant',
    assignedClass: 'KINGDOM TOTS',
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
    kingdomTots: 8,
    kingdomGiants: 10,
    gideonForce: 6,
    firstTimeChildren: 2,
    returningChildren: 22,
    attendees: [],
  },
  {
    date: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
    total: 28,
    boys: 15,
    girls: 13,
    kingdomTots: 9,
    kingdomGiants: 11,
    gideonForce: 8,
    firstTimeChildren: 1,
    returningChildren: 27,
    attendees: [],
  },
  {
    date: formatDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)),
    total: 22,
    boys: 12,
    girls: 10,
    kingdomTots: 7,
    kingdomGiants: 9,
    gideonForce: 6,
    firstTimeChildren: 0,
    returningChildren: 22,
    attendees: [],
  },
  {
    date: formatDate(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)),
    total: 26,
    boys: 14,
    girls: 12,
    kingdomTots: 9,
    kingdomGiants: 10,
    gideonForce: 7,
    firstTimeChildren: 3,
    returningChildren: 23,
    attendees: [],
  },
];
