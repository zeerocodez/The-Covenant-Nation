import React, { useState, useEffect } from 'react';
import {
  Child,
  CheckedInChild,
  AttendanceRecord,
  Teacher,
  TeacherOnDuty,
  ViewTab,
  ToastNotification,
} from './types';
import {
  INITIAL_CHILDREN,
  INITIAL_TEACHERS,
  INITIAL_ATTENDANCE_HISTORY,
} from './initialData';
import { ChurchLogo } from './components/ChurchLogo';
import {
  Users,
  UserCheck,
  Cake,
  Calendar,
  TrendingUp,
  GraduationCap,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Sparkles,
  CheckCircle2,
  Download,
  Check,
  ChevronRight,
  UserPlus,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');

  // Database State backed by LocalStorage
  const [children, setChildren] = useState<Child[]>(() => {
    const saved = localStorage.getItem('children');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CHILDREN;
  });

  const [checkedInChildren, setCheckedInChildren] = useState<CheckedInChild[]>(() => {
    const saved = localStorage.getItem('checkedIn');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendanceHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ATTENDANCE_HISTORY;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('teachers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TEACHERS;
  });

  const [teachersOnDuty, setTeachersOnDuty] = useState<TeacherOnDuty[]>(() => {
    const saved = localStorage.getItem('teachersOnDuty');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Notification Toasts
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Search Queries
  const [childSearchQuery, setChildSearchQuery] = useState('');
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');

  // New Child Registration Form State
  const [newChildName, setNewChildName] = useState('');
  const [newChildPhone, setNewChildPhone] = useState('');
  const [newChildBirthDate, setNewChildBirthDate] = useState('');
  const [newChildGender, setNewChildGender] = useState<'Boy' | 'Girl' | ''>('');
  const [newChildAge, setNewChildAge] = useState<number | ''>('');
  const [newChildEmergency, setNewChildEmergency] = useState('');
  const [newChildNotes, setNewChildNotes] = useState('');

  // New Teacher Form State
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');

  // Synchronize State to LocalStorage
  useEffect(() => {
    localStorage.setItem('children', JSON.stringify(children));
  }, [children]);

  useEffect(() => {
    localStorage.setItem('checkedIn', JSON.stringify(checkedInChildren));
  }, [checkedInChildren]);

  useEffect(() => {
    localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));
  }, [attendanceHistory]);

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('teachersOnDuty', JSON.stringify(teachersOnDuty));
  }, [teachersOnDuty]);

  // Show Toast
  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3500);
  };

  // DOB Change and Age Calculation
  const handleBirthDateChange = (dobString: string) => {
    setNewChildBirthDate(dobString);
    if (!dobString) {
      setNewChildAge('');
      return;
    }
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setNewChildAge(Math.max(0, age));
  };

  // Register Child
  const handleRegisterChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim() || !newChildPhone.trim() || !newChildBirthDate || !newChildGender) {
      showNotification('Please fill in all required fields marked with *', 'error');
      return;
    }

    const calculatedAge = typeof newChildAge === 'number' ? newChildAge : 0;
    const newChild: Child = {
      id: Date.now(),
      name: newChildName.trim(),
      parentPhone: newChildPhone.trim(),
      birthDate: newChildBirthDate,
      age: calculatedAge,
      gender: newChildGender as 'Boy' | 'Girl',
      emergencyContact: newChildEmergency.trim(),
      specialNotes: newChildNotes.trim(),
      registrationDate: new Date().toISOString().split('T')[0],
    };

    setChildren((prev) => [newChild, ...prev]);

    // Reset Form
    setNewChildName('');
    setNewChildPhone('');
    setNewChildBirthDate('');
    setNewChildGender('');
    setNewChildAge('');
    setNewChildEmergency('');
    setNewChildNotes('');

    showNotification(`${newChild.name} registered successfully! 🌟`, 'success');
    setActiveTab('dashboard');
  };

  // Check In Child
  const handleCheckIn = (childId: number) => {
    const child = children.find((c) => c.id === childId);
    if (child && !checkedInChildren.some((c) => c.id === childId)) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const record: CheckedInChild = {
        ...child,
        checkInTime: timeStr,
      };
      setCheckedInChildren((prev) => [record, ...prev]);
      showNotification(`${child.name} checked in successfully! 🎉`, 'success');
    }
  };

  // Check Out Child
  const handleCheckOut = (childId: number) => {
    const child = checkedInChildren.find((c) => c.id === childId);
    if (child) {
      setCheckedInChildren((prev) => prev.filter((c) => c.id !== childId));
      showNotification(`${child.name} checked out safely! 👋`, 'info');
    }
  };

  // Register Teacher
  const handleRegisterTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherPhone.trim()) {
      showNotification('Please provide teacher name and phone number', 'error');
      return;
    }

    const newTeacher: Teacher = {
      id: Date.now(),
      name: newTeacherName.trim(),
      phone: newTeacherPhone.trim(),
      registrationDate: new Date().toISOString().split('T')[0],
    };

    setTeachers((prev) => [...prev, newTeacher]);
    setNewTeacherName('');
    setNewTeacherPhone('');
    showNotification(`${newTeacher.name} registered as teacher! 👩‍🏫`, 'success');
  };

  // Check In Teacher
  const handleTeacherCheckIn = (teacherId: number) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (teacher && !teachersOnDuty.some((t) => t.id === teacherId)) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTeachersOnDuty((prev) => [...prev, { ...teacher, checkInTime: timeStr }]);
      showNotification(`${teacher.name} checked in for duty! 🎉`, 'success');
    }
  };

  // Check Out Teacher
  const handleTeacherCheckOut = (teacherId: number) => {
    const teacher = teachersOnDuty.find((t) => t.id === teacherId);
    if (teacher) {
      setTeachersOnDuty((prev) => prev.filter((t) => t.id !== teacherId));
      showNotification(`${teacher.name} checked out from duty! 👋`, 'info');
    }
  };

  // Record Attendance for Today
  const handleRecordTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];

    const existing = attendanceHistory.find((r) => r.date === today);
    if (existing) {
      showNotification("Today's attendance has already been recorded! 📝", 'info');
      return;
    }

    const todayAttendees = checkedInChildren.map((c) => {
      const full = children.find((orig) => orig.id === c.id);
      return {
        id: c.id,
        name: c.name,
        gender: (full?.gender || c.gender || 'Boy') as 'Boy' | 'Girl',
        age: c.age,
      };
    });

    const total = todayAttendees.length;
    const boys = todayAttendees.filter((c) => c.gender === 'Boy').length;
    const girls = todayAttendees.filter((c) => c.gender === 'Girl').length;

    if (total === 0) {
      showNotification('No children currently checked in to record attendance! ⚠️', 'error');
      return;
    }

    const newRecord: AttendanceRecord = {
      date: today,
      total,
      boys,
      girls,
      attendees: todayAttendees,
    };

    setAttendanceHistory((prev) => [newRecord, ...prev]);
    showNotification(`Attendance recorded: ${total} children (${boys} boys, ${girls} girls) 📊`, 'success');
  };

  // Export Attendance CSV
  const handleExportCsv = () => {
    if (attendanceHistory.length === 0) {
      showNotification('No attendance history available to export', 'error');
      return;
    }
    const headers = 'Date,Total,Boys,Girls,Percentage\n';
    const rows = attendanceHistory
      .map((r) => {
        const pct = children.length > 0 ? Math.round((r.total / children.length) * 100) : 0;
        return `"${r.date}",${r.total},${r.boys},${r.girls},"${pct}%"`;
      })
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TCN_Uyo_Children_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Attendance records exported successfully! 📁', 'success');
  };

  // Dates and Helpers
  const todayDateObj = new Date();
  const todayDateString = todayDateObj.toISOString().split('T')[0];
  const formattedToday = todayDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Birthday Calculations
  const weekFromNow = new Date(todayDateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
  const birthdaysThisWeek = children.filter((child) => {
    if (!child.birthDate) return false;
    const parts = child.birthDate.split('-');
    if (parts.length < 3) return false;
    const birthMonth = parseInt(parts[1], 10) - 1;
    const birthDay = parseInt(parts[2], 10);
    const thisYearBday = new Date(todayDateObj.getFullYear(), birthMonth, birthDay);
    const todayZero = new Date(todayDateObj.getFullYear(), todayDateObj.getMonth(), todayDateObj.getDate());
    return thisYearBday >= todayZero && thisYearBday <= weekFromNow;
  });

  const todaysBirthdays = children.filter((child) => {
    if (!child.birthDate) return false;
    const parts = child.birthDate.split('-');
    if (parts.length < 3) return false;
    const birthMonth = parseInt(parts[1], 10) - 1;
    const birthDay = parseInt(parts[2], 10);
    const thisYearBday = new Date(todayDateObj.getFullYear(), birthMonth, birthDay);
    return thisYearBday.toISOString().split('T')[0] === todayDateString;
  });

  const weekBirthdaysList = children.filter((child) => {
    if (!child.birthDate) return false;
    const parts = child.birthDate.split('-');
    if (parts.length < 3) return false;
    const birthMonth = parseInt(parts[1], 10) - 1;
    const birthDay = parseInt(parts[2], 10);
    const thisYearBday = new Date(todayDateObj.getFullYear(), birthMonth, birthDay);
    const todayZero = new Date(todayDateObj.getFullYear(), todayDateObj.getMonth(), todayDateObj.getDate());
    return thisYearBday > todayZero && thisYearBday <= weekFromNow;
  });

  const monthBirthdaysList = children.filter((child) => {
    if (!child.birthDate) return false;
    const parts = child.birthDate.split('-');
    if (parts.length < 3) return false;
    const birthMonth = parseInt(parts[1], 10) - 1;
    const birthDay = parseInt(parts[2], 10);
    const thisYearBday = new Date(todayDateObj.getFullYear(), birthMonth, birthDay);
    return thisYearBday > weekFromNow && thisYearBday.getMonth() === todayDateObj.getMonth();
  });

  // Attendance Breakdown
  const todayCheckedInWithGender = checkedInChildren.map((c) => {
    const full = children.find((orig) => orig.id === c.id);
    return {
      ...c,
      gender: full?.gender || c.gender || 'Boy',
    };
  });
  const todayTotal = todayCheckedInWithGender.length;
  const todayBoys = todayCheckedInWithGender.filter((c) => c.gender === 'Boy');
  const todayGirls = todayCheckedInWithGender.filter((c) => c.gender === 'Girl');

  // 4 Weeks Averages
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const recentHistory = attendanceHistory.filter(
    (record) => new Date(record.date) >= fourWeeksAgo
  );

  const avgTotal =
    recentHistory.length > 0
      ? Math.round(recentHistory.reduce((sum, r) => sum + r.total, 0) / recentHistory.length)
      : 0;
  const avgBoys =
    recentHistory.length > 0
      ? Math.round(recentHistory.reduce((sum, r) => sum + r.boys, 0) / recentHistory.length)
      : 0;
  const avgGirls =
    recentHistory.length > 0
      ? Math.round(recentHistory.reduce((sum, r) => sum + r.girls, 0) / recentHistory.length)
      : 0;

  // Filtered queries
  const filteredChildren =
    childSearchQuery.trim().length >= 2
      ? children.filter((c) =>
          c.name.toLowerCase().includes(childSearchQuery.toLowerCase().trim())
        )
      : [];

  const filteredTeachers =
    teacherSearchQuery.trim().length >= 2
      ? teachers.filter((t) =>
          t.name.toLowerCase().includes(teacherSearchQuery.toLowerCase().trim())
        )
      : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-purple-200">
      {/* Toast Notification Floating Banner */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl shadow-2xl text-white font-medium text-sm flex items-center justify-between pointer-events-auto transition-all transform duration-300 ${
              n.type === 'success'
                ? 'bg-emerald-600 border border-emerald-500'
                : n.type === 'error'
                ? 'bg-rose-600 border border-rose-500'
                : 'bg-indigo-600 border border-indigo-500'
            }`}
          >
            <span>{n.message}</span>
          </div>
        ))}
      </div>

      {/* TOP EMERGENCY & CHURCH CONTACT BAR */}
      <div className="bg-[#1e1b4b] text-slate-200 text-xs py-2 px-4 border-b border-indigo-950">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>Vinpy Events Centre, 10 Udo Udoma Ave, Uyo</span>
            </span>
            <span className="hidden md:inline text-indigo-400">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Sundays: 8:00 AM & 10:30 AM</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+2348037629110"
              className="flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">+234 803 762 9110</span>
            </a>
            <span className="text-indigo-400">•</span>
            <a
              href="mailto:tcnuyo@gmail.com"
              className="hidden sm:flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>tcnuyo@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* HIGH-END HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#311042] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/60 shadow-xl">
        {/* Ambient glow orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Logo and Church Identity */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/15 shadow-2xl shrink-0 ring-1 ring-amber-400/30">
                <ChurchLogo className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Covenant Nation Uyo</span>
                  <span>•</span>
                  <span>Children Church</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  🌟 TCN Children Church, Uyo 🌟
                </h1>
                <p className="text-slate-300 text-base sm:text-lg mt-2 font-medium max-w-xl">
                  Safe & Simple Check-In System — Nurturing future leaders in Christ with safety, security, and love.
                </p>
              </div>
            </div>

            {/* Quick Hero Badges */}
            <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">Secure Attendance Gate</div>
                  <div className="text-slate-300">Verified Parent Pickup</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-xs font-semibold">
                <Heart className="w-4 h-4 text-pink-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">Allergy & Medical Alert</div>
                  <div className="text-slate-300">Real-time Safety Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* REFINED NAVIGATION BUTTONS */}
        <nav className="flex flex-wrap justify-center items-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-3 rounded-full font-bold text-sm transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white ring-4 ring-blue-300/60 scale-105 shadow-blue-500/25'
                : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200'
            }`}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-5 py-3 rounded-full font-bold text-sm transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer ${
              activeTab === 'checkin'
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-300/60 scale-105 shadow-emerald-500/25'
                : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 border border-slate-200'
            }`}
          >
            <span>✅</span>
            <span>Check In/Out</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-5 py-3 rounded-full font-bold text-sm transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-purple-600 text-white ring-4 ring-purple-300/60 scale-105 shadow-purple-500/25'
                : 'bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-600 border border-slate-200'
            }`}
          >
            <span>📝</span>
            <span>New Registration</span>
          </button>

          <button
            onClick={() => setActiveTab('birthdays')}
            className={`px-5 py-3 rounded-full font-bold text-sm transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer ${
              activeTab === 'birthdays'
                ? 'bg-pink-600 text-white ring-4 ring-pink-300/60 scale-105 shadow-pink-500/25'
                : 'bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200'
            }`}
          >
            <span>🎂</span>
            <span>Birthdays</span>
            {birthdaysThisWeek.length > 0 && (
              <span className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full font-extrabold ml-1">
                {birthdaysThisWeek.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-5 py-3 rounded-full font-bold text-sm transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-orange-600 text-white ring-4 ring-orange-300/60 scale-105 shadow-orange-500/25'
                : 'bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200'
            }`}
          >
            <span>📈</span>
            <span>Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-5 py-3 rounded-full font-bold text-sm transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-300/60 scale-105 shadow-indigo-500/25'
                : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200'
            }`}
          >
            <span>👩‍🏫</span>
            <span>Teachers on Duty</span>
            {teachersOnDuty.length > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-extrabold ml-1">
                {teachersOnDuty.length}
              </span>
            )}
          </button>
        </nav>

        {/* ============================================================ */}
        {/* VIEW 1: DASHBOARD */}
        {/* ============================================================ */}
        {activeTab === 'dashboard' && (
          <div className="fade-in space-y-8">
            {/* Top 3 Stat Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Checked In */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 border border-slate-100 hover:shadow-2xl transition duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mr-4 shadow-inner">
                      👥
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                        Currently Checked In
                      </p>
                      <p className="text-4xl font-extrabold text-blue-600 mt-1">
                        {checkedInChildren.length}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('checkin')}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                    title="Check in a child"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Total Registered */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-emerald-500 border border-slate-100 hover:shadow-2xl transition duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mr-4 shadow-inner">
                      📋
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                        Total Registered
                      </p>
                      <p className="text-4xl font-extrabold text-emerald-600 mt-1">
                        {children.length}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('register')}
                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                    title="Register new child"
                  >
                    <UserPlus className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Birthdays This Week */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-pink-500 border border-slate-100 hover:shadow-2xl transition duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-3xl mr-4 shadow-inner">
                      🎉
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                        Birthdays This Week
                      </p>
                      <p className="text-4xl font-extrabold text-pink-600 mt-1">
                        {birthdaysThisWeek.length}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('birthdays')}
                    className="p-2 text-pink-500 hover:bg-pink-50 rounded-xl transition cursor-pointer"
                    title="View birthdays"
                  >
                    <Cake className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Currently Checked In Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                  <span className="text-2xl mr-2">✅</span>
                  Currently Checked In ({checkedInChildren.length})
                </h3>
                {checkedInChildren.length > 0 && (
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Attendance Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {checkedInChildren.length === 0 ? (
                <div className="py-14 text-center text-slate-500 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                  <div className="text-4xl mb-3">👦 👧</div>
                  <p className="text-lg font-medium text-slate-700">No children currently checked in</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Children will appear here in real-time as they arrive and check in.
                  </p>
                  <button
                    onClick={() => setActiveTab('checkin')}
                    className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Go to Check In Desk</span>
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {checkedInChildren.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4.5 bg-emerald-50/60 rounded-xl border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition slide-in"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-white text-2xl flex items-center justify-center shadow-xs border border-emerald-100">
                          {child.gender === 'Girl' ? '👧' : '👦'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base">{child.name}</p>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Age {child.age} • Checked in at{' '}
                            <span className="font-semibold text-emerald-800">{child.checkInTime}</span>
                          </p>
                          {child.specialNotes && (
                            <p className="text-xs text-amber-700 font-medium mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span>{child.specialNotes}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCheckOut(child.id)}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm hover:shadow cursor-pointer"
                      >
                        Check Out
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: CHECK IN/OUT */}
        {/* ============================================================ */}
        {activeTab === 'checkin' && (
          <div className="fade-in max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Check In/Out System</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Search by child's name to instantly check them into Sunday service or release them to parents.
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-slate-700 font-bold mb-2 text-sm">Search for Child</label>
                <div className="relative">
                  <input
                    type="text"
                    value={childSearchQuery}
                    onChange={(e) => setChildSearchQuery(e.target.value)}
                    placeholder="Type child's name (e.g. David, Emem, Samuel)..."
                    className="w-full px-5 py-3.5 pl-12 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-base transition bg-slate-50/50"
                    autoFocus
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                  {childSearchQuery && (
                    <button
                      onClick={() => setChildSearchQuery('')}
                      className="absolute right-4 top-3.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded-md cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-between">
                  <span>Type at least 2 characters to filter</span>
                  <span>{children.length} total registered children</span>
                </p>
              </div>

              {/* Search Results */}
              <div className="space-y-3">
                {childSearchQuery.trim().length >= 2 && filteredChildren.length === 0 && (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-600 font-semibold">No children found matching "{childSearchQuery}"</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Check spelling or register a new child below.
                    </p>
                    <button
                      onClick={() => setActiveTab('register')}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register {childSearchQuery} now</span>
                    </button>
                  </div>
                )}

                {filteredChildren.map((child) => {
                  const isCheckedIn = checkedInChildren.some((c) => c.id === child.id);
                  return (
                    <div
                      key={child.id}
                      className={`p-4.5 rounded-xl border-2 transition duration-200 slide-in ${
                        isCheckedIn
                          ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400'
                          : 'border-slate-200 bg-white hover:border-blue-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs ${
                              isCheckedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'
                            }`}
                          >
                            {isCheckedIn ? '✅' : child.gender === 'Girl' ? '👧' : '👦'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 text-base">{child.name}</p>
                              {isCheckedIn && (
                                <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full uppercase">
                                  In Service
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                              <span>Age {child.age}</span>
                              <span>•</span>
                              <a
                                href={`tel:${child.parentPhone}`}
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{child.parentPhone}</span>
                              </a>
                            </p>
                            {child.specialNotes && (
                              <p className="text-xs text-amber-700 font-medium mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>⚠️ {child.specialNotes}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          {isCheckedIn ? (
                            <button
                              onClick={() => handleCheckOut(child.id)}
                              className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm hover:shadow cursor-pointer"
                            >
                              Check Out 👋
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCheckIn(child.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm hover:shadow cursor-pointer"
                            >
                              Check In 🎉
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: NEW CHILD REGISTRATION */}
        {/* ============================================================ */}
        {activeTab === 'register' && (
          <div className="fade-in max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-9 border border-slate-100">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-purple-50 text-purple-600 mb-2">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">New Child Registration</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Register a child into The Covenant Nation Uyo children church registry.
                </p>
              </div>

              <form onSubmit={handleRegisterChild} className="space-y-5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-sm">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="e.g. Samuel David Bassey"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none text-slate-800 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-sm">
                    Parent/Guardian Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newChildPhone}
                    onChange={(e) => setNewChildPhone(e.target.value)}
                    placeholder="e.g. 0803 762 9110"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none text-slate-800 transition"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 text-sm">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={newChildBirthDate}
                      onChange={(e) => handleBirthDateChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none text-slate-800 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 text-sm">Gender *</label>
                    <select
                      required
                      value={newChildGender}
                      onChange={(e) => setNewChildGender(e.target.value as 'Boy' | 'Girl')}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none bg-white text-slate-800 transition"
                    >
                      <option value="">Select Gender</option>
                      <option value="Boy">Boy</option>
                      <option value="Girl">Girl</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 text-sm">Age</label>
                    <input
                      type="number"
                      readOnly
                      value={newChildAge}
                      placeholder="Auto"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-600 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-sm">
                    Emergency Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={newChildEmergency}
                    onChange={(e) => setNewChildEmergency(e.target.value)}
                    placeholder="e.g. 0802 334 5566 (Uncle Bassey)"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none text-slate-800 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-sm">
                    Special Notes (Allergies, Medical, etc.)
                  </label>
                  <textarea
                    rows={3}
                    value={newChildNotes}
                    onChange={(e) => setNewChildNotes(e.target.value)}
                    placeholder="e.g. Asthmatic, allergic to nuts, lactose intolerant, wearing glasses..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none text-slate-800 transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-xl font-extrabold text-lg shadow-lg hover:shadow-xl transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Register Child 🌟</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: BIRTHDAYS */}
        {/* ============================================================ */}
        {activeTab === 'birthdays' && (
          <div className="fade-in max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-2xl bg-pink-50 text-pink-600 mb-2">
                  <Cake className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Birthday Reminders</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Celebrate our covenant kids! Track today's, this week's, and upcoming birthdays this month.
                </p>
              </div>

              {/* Today's Birthdays */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎉</span>
                  <h3 className="text-xl font-bold text-pink-600">Today's Birthdays</h3>
                  <span className="bg-pink-100 text-pink-700 text-xs px-2.5 py-0.5 rounded-full font-bold ml-1">
                    {todaysBirthdays.length}
                  </span>
                </div>

                {todaysBirthdays.length === 0 ? (
                  <p className="text-slate-400 italic bg-slate-50 p-4 rounded-xl">No birthdays today</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {todaysBirthdays.map((child) => {
                      const birthDate = new Date(child.birthDate);
                      const age = new Date().getFullYear() - birthDate.getFullYear();
                      const birthdayStr = birthDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      });
                      return (
                        <div
                          key={child.id}
                          className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200 flex items-center gap-4 shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white text-2xl flex items-center justify-center shadow-xs">
                            🎂
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{child.name}</p>
                            <p className="text-xs text-pink-700 font-semibold">
                              Turning {age} today ({birthdayStr})!
                            </p>
                            <a
                              href={`tel:${child.parentPhone}`}
                              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{child.parentPhone}</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* This Week's Birthdays */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📅</span>
                  <h3 className="text-xl font-bold text-blue-600">This Week's Birthdays</h3>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-bold ml-1">
                    {weekBirthdaysList.length}
                  </span>
                </div>

                {weekBirthdaysList.length === 0 ? (
                  <p className="text-slate-400 italic bg-slate-50 p-4 rounded-xl">No birthdays this week</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {weekBirthdaysList.map((child) => {
                      const birthDate = new Date(child.birthDate);
                      const age = new Date().getFullYear() - birthDate.getFullYear();
                      const birthdayStr = birthDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      });
                      return (
                        <div
                          key={child.id}
                          className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center gap-4 shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white text-2xl flex items-center justify-center shadow-xs">
                            🎂
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{child.name}</p>
                            <p className="text-xs text-blue-700 font-semibold">
                              Turning {age} on {birthdayStr}
                            </p>
                            <a
                              href={`tel:${child.parentPhone}`}
                              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{child.parentPhone}</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upcoming Birthdays This Month */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🔮</span>
                  <h3 className="text-xl font-bold text-emerald-600">Upcoming This Month</h3>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold ml-1">
                    {monthBirthdaysList.length}
                  </span>
                </div>

                {monthBirthdaysList.length === 0 ? (
                  <p className="text-slate-400 italic bg-slate-50 p-4 rounded-xl">
                    No upcoming birthdays this month
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {monthBirthdaysList.map((child) => {
                      const birthDate = new Date(child.birthDate);
                      const age = new Date().getFullYear() - birthDate.getFullYear();
                      const birthdayStr = birthDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      });
                      return (
                        <div
                          key={child.id}
                          className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-4 shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white text-2xl flex items-center justify-center shadow-xs">
                            🎂
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{child.name}</p>
                            <p className="text-xs text-emerald-700 font-semibold">
                              Turning {age} on {birthdayStr}
                            </p>
                            <a
                              href={`tel:${child.parentPhone}`}
                              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{child.parentPhone}</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 5: SUNDAY ATTENDANCE SUMMARY */}
        {/* ============================================================ */}
        {activeTab === 'attendance' && (
          <div className="fade-in space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <span>📈</span>
                    <span>Sunday Attendance Summary</span>
                  </h2>
                  <p className="text-slate-500 text-sm mt-0.5">
                    Official attendance statistics and service reporting.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={handleRecordTodayAttendance}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    <span>📝 Record Today's Attendance</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="text-3xl">👥</div>
                    <div>
                      <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">
                        Today's Total
                      </p>
                      <p className="text-3xl font-black mt-0.5">{todayTotal}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="text-3xl">👦</div>
                    <div>
                      <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                        Boys Today
                      </p>
                      <p className="text-3xl font-black mt-0.5">{todayBoys.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="text-3xl">👧</div>
                    <div>
                      <p className="text-pink-200 text-xs font-semibold uppercase tracking-wider">
                        Girls Today
                      </p>
                      <p className="text-3xl font-black mt-0.5">{todayGirls.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="text-3xl">📅</div>
                    <div>
                      <p className="text-purple-200 text-xs font-semibold uppercase tracking-wider">
                        Service Date
                      </p>
                      <p className="text-lg font-bold mt-1 truncate">{formattedToday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span>📊</span>
                  <span>Weekly Summary (Past 4 Weeks Average)</span>
                </h3>
                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80">
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                      <p className="text-3xl font-black text-blue-600">{avgTotal}</p>
                      <p className="text-slate-500 text-xs font-semibold mt-1 uppercase">
                        Average Attendance
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                      <p className="text-3xl font-black text-emerald-600">{avgBoys}</p>
                      <p className="text-slate-500 text-xs font-semibold mt-1 uppercase">
                        Average Boys
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                      <p className="text-3xl font-black text-pink-600">{avgGirls}</p>
                      <p className="text-slate-500 text-xs font-semibold mt-1 uppercase">
                        Average Girls
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance History */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  <span>Attendance History</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-5 py-3.5">Date</th>
                        <th className="px-5 py-3.5">Total</th>
                        <th className="px-5 py-3.5 text-blue-600">Boys</th>
                        <th className="px-5 py-3.5 text-pink-600">Girls</th>
                        <th className="px-5 py-3.5">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {attendanceHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                            No attendance records recorded yet
                          </td>
                        </tr>
                      ) : (
                        attendanceHistory.map((record, index) => {
                          const percentage =
                            children.length > 0
                              ? Math.round((record.total / children.length) * 100)
                              : 0;
                          return (
                            <tr key={index} className="hover:bg-slate-50/80 transition">
                              <td className="px-5 py-3.5 font-bold text-slate-900">{record.date}</td>
                              <td className="px-5 py-3.5 font-extrabold text-slate-900">
                                {record.total}
                              </td>
                              <td className="px-5 py-3.5 font-bold text-blue-600">{record.boys}</td>
                              <td className="px-5 py-3.5 font-bold text-pink-600">{record.girls}</td>
                              <td className="px-5 py-3.5 font-semibold text-slate-700">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                  {percentage}%
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Today's Attendees Breakdown */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>👥</span>
                  <span>Today's Attendees</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Boys List */}
                  <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                    <h4 className="text-base font-bold text-blue-900 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>👦</span>
                        <span>Boys</span>
                      </span>
                      <span className="bg-blue-200/70 text-blue-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {todayBoys.length}
                      </span>
                    </h4>
                    {todayBoys.length === 0 ? (
                      <p className="text-slate-400 text-sm italic py-4 text-center">
                        No boys checked in today
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {todayBoys.map((boy) => (
                          <div
                            key={boy.id}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-xs text-sm"
                          >
                            <div>
                              <p className="font-bold text-slate-800">{boy.name}</p>
                              <p className="text-xs text-slate-500">Age {boy.age}</p>
                            </div>
                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                              {boy.checkInTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Girls List */}
                  <div className="bg-pink-50/50 rounded-2xl p-5 border border-pink-100">
                    <h4 className="text-base font-bold text-pink-900 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>👧</span>
                        <span>Girls</span>
                      </span>
                      <span className="bg-pink-200/70 text-pink-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {todayGirls.length}
                      </span>
                    </h4>
                    {todayGirls.length === 0 ? (
                      <p className="text-slate-400 text-sm italic py-4 text-center">
                        No girls checked in today
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {todayGirls.map((girl) => (
                          <div
                            key={girl.id}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border border-pink-100 shadow-xs text-sm"
                          >
                            <div>
                              <p className="font-bold text-slate-800">{girl.name}</p>
                              <p className="text-xs text-slate-500">Age {girl.age}</p>
                            </div>
                            <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md">
                              {girl.checkInTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 6: TEACHERS ON DUTY */}
        {/* ============================================================ */}
        {activeTab === 'teachers' && (
          <div className="fade-in space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Teachers on Duty</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Manage teachers assigned to Sunday service duty, check-in schedules, and active staff.
                </p>
              </div>

              {/* Add New Teacher Form */}
              <div className="mb-8 bg-indigo-50/60 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-base font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span>Add New Teacher</span>
                </h3>
                <form
                  onSubmit={handleRegisterTeacher}
                  className="grid sm:grid-cols-3 gap-3.5 items-end"
                >
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Teacher Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTeacherName}
                      onChange={(e) => setNewTeacherName(e.target.value)}
                      placeholder="e.g. Sister Victoria Asuquo"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newTeacherPhone}
                      onChange={(e) => setNewTeacherPhone(e.target.value)}
                      placeholder="e.g. 0803 123 4567"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none bg-white text-sm"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                    >
                      Add Teacher 👩‍🏫
                    </button>
                  </div>
                </form>
              </div>

              {/* 3 Teacher Stat Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="text-3xl">👥</div>
                    <div>
                      <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
                        Teachers on Duty
                      </p>
                      <p className="text-3xl font-black mt-0.5">{teachersOnDuty.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="text-3xl">✅</div>
                    <div>
                      <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                        Checked In
                      </p>
                      <p className="text-3xl font-black mt-0.5">{teachersOnDuty.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="text-3xl">📅</div>
                    <div>
                      <p className="text-purple-200 text-xs font-semibold uppercase tracking-wider">
                        Duty Date
                      </p>
                      <p className="text-lg font-bold mt-1 truncate">{formattedToday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Check-In Search Section */}
              <div className="mb-8">
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span>🔍</span>
                  <span>Teacher Check-In</span>
                </h3>
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80">
                  <div className="relative mb-3">
                    <input
                      type="text"
                      value={teacherSearchQuery}
                      onChange={(e) => setTeacherSearchQuery(e.target.value)}
                      placeholder="Search registered teacher's name..."
                      className="w-full px-4 py-3 pl-11 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none bg-white text-sm"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  </div>

                  <div className="space-y-2">
                    {teacherSearchQuery.trim().length >= 2 && filteredTeachers.length === 0 && (
                      <p className="text-slate-400 text-xs text-center py-3">No teachers found</p>
                    )}

                    {filteredTeachers.map((teacher) => {
                      const isOnDuty = teachersOnDuty.some((t) => t.id === teacher.id);
                      return (
                        <div
                          key={teacher.id}
                          className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{isOnDuty ? '✅' : '👩‍🏫'}</div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{teacher.name}</p>
                              <p className="text-xs text-slate-500">{teacher.phone}</p>
                            </div>
                          </div>
                          <div>
                            {isOnDuty ? (
                              <button
                                onClick={() => handleTeacherCheckOut(teacher.id)}
                                className="bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                              >
                                Check Out
                              </button>
                            ) : (
                              <button
                                onClick={() => handleTeacherCheckIn(teacher.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                              >
                                Check In
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Currently on Duty List */}
              <div className="mb-8">
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span>✅</span>
                  <span>Currently on Duty ({teachersOnDuty.length})</span>
                </h3>
                {teachersOnDuty.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-6 text-center bg-slate-50 rounded-xl">
                    No teachers currently on duty
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {teachersOnDuty.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white text-xl flex items-center justify-center shadow-xs">
                            👩‍🏫
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{teacher.name}</p>
                            <p className="text-xs text-slate-600">
                              {teacher.phone} • At{' '}
                              <span className="font-bold text-emerald-800">{teacher.checkInTime}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleTeacherCheckOut(teacher.id)}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Check Out
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Registered Teachers Directory */}
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  <span>All Registered Teachers Directory</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-5 py-3.5">Name</th>
                        <th className="px-5 py-3.5">Phone</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {teachers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                            No teachers registered yet
                          </td>
                        </tr>
                      ) : (
                        teachers.map((teacher) => {
                          const isOnDuty = teachersOnDuty.some((t) => t.id === teacher.id);
                          return (
                            <tr key={teacher.id} className="hover:bg-slate-50/80 transition">
                              <td className="px-5 py-3.5 font-bold text-slate-900">{teacher.name}</td>
                              <td className="px-5 py-3.5 text-slate-600">{teacher.phone}</td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    isOnDuty
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {isOnDuty ? 'On Duty' : 'Off Duty'}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right font-medium">
                                {isOnDuty ? (
                                  <button
                                    onClick={() => handleTeacherCheckOut(teacher.id)}
                                    className="text-rose-600 hover:text-rose-800 font-bold text-xs cursor-pointer"
                                  >
                                    Check Out
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleTeacherCheckIn(teacher.id)}
                                    className="text-emerald-600 hover:text-emerald-800 font-bold text-xs cursor-pointer"
                                  >
                                    Check In
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-[#0f172a] text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChurchLogo className="w-8 h-8 text-amber-400" />
            <div>
              <p className="font-bold text-white text-sm">The Covenant Nation Uyo — Children Church</p>
              <p className="text-slate-400">Vinpy Events Centre, 10 Udo Udoma Avenue, Uyo, Akwa Ibom State</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p>Helpline: +234 803 762 9110 • Email: tcnuyo@gmail.com</p>
            <p className="text-slate-500 mt-0.5">© {new Date().getFullYear()} The Covenant Nation. Safe & Simple Attendance System.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
