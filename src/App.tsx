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

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');

  // Database State with LocalStorage
  const [children, setChildren] = useState<Child[]>(() => {
    const saved = localStorage.getItem('children');
    if (saved) {
      try {
        return JSON.parse(saved);
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
        return JSON.parse(saved);
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
        return JSON.parse(saved);
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

  // Search State
  const [childSearchQuery, setChildSearchQuery] = useState('');
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');

  // New Child Form State
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

  // Persist Data to LocalStorage
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
    }, 3200);
  };

  // Date of Birth & Age Calculation
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
      showNotification('Please fill in all required fields *', 'error');
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

    setChildren((prev) => [...prev, newChild]);

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
      setCheckedInChildren((prev) => [...prev, record]);
      showNotification(`${child.name} checked in successfully! 🎉`, 'success');
    }
  };

  // Check Out Child
  const handleCheckOut = (childId: number) => {
    const child = checkedInChildren.find((c) => c.id === childId);
    if (child) {
      setCheckedInChildren((prev) => prev.filter((c) => c.id !== childId));
      showNotification(`${child.name} checked out successfully! 👋`, 'info');
    }
  };

  // Register Teacher
  const handleRegisterTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherPhone.trim()) {
      showNotification('Please enter teacher name and phone number', 'error');
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

  // Record Today's Attendance
  const handleRecordTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];

    // Check if today is already recorded
    const existing = attendanceHistory.find((r) => r.date === today);
    if (existing) {
      showNotification("Today's attendance is already recorded! 📝", 'info');
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
      showNotification('No children are checked in to record! ⚠️', 'error');
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

  // Date and Birthday Computations
  const todayDateObj = new Date();
  const todayDateString = todayDateObj.toISOString().split('T')[0];
  const formattedToday = todayDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Birthdays This Week for Dashboard
  const weekFromNow = new Date(todayDateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
  const birthdaysThisWeek = children.filter((child) => {
    if (!child.birthDate) return false;
    const parts = child.birthDate.split('-');
    if (parts.length < 3) return false;
    const birthMonth = parseInt(parts[1], 10) - 1;
    const birthDay = parseInt(parts[2], 10);
    const thisYearBday = new Date(todayDateObj.getFullYear(), birthMonth, birthDay);
    return thisYearBday >= new Date(todayDateObj.getFullYear(), todayDateObj.getMonth(), todayDateObj.getDate()) &&
      thisYearBday <= weekFromNow;
  });

  // Birthday Reminders Categorization
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

  // Sunday Attendance Calculations
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

  // Filtered Children for Check In/Out Search
  const filteredChildren =
    childSearchQuery.trim().length >= 2
      ? children.filter((c) =>
          c.name.toLowerCase().includes(childSearchQuery.toLowerCase().trim())
        )
      : [];

  // Filtered Teachers for Teacher Check-In Search
  const filteredTeachers =
    teacherSearchQuery.trim().length >= 2
      ? teachers.filter((t) =>
          t.name.toLowerCase().includes(teacherSearchQuery.toLowerCase().trim())
        )
      : [];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen text-slate-800 antialiased selection:bg-purple-200">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-lg shadow-lg text-white font-semibold fade-in pointer-events-auto ${
              n.type === 'success'
                ? 'bg-green-500'
                : n.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 mb-2 tracking-tight">
            🌟 TCN, Children Church, Uyo 🌟
          </h1>
          <p className="text-gray-600 text-lg font-medium">Safe & Simple Check-In System</p>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg text-white flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 ring-4 ring-blue-300 ring-opacity-60 scale-105'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg text-white flex items-center gap-2 cursor-pointer ${
              activeTab === 'checkin'
                ? 'bg-green-600 ring-4 ring-green-300 ring-opacity-60 scale-105'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            ✅ Check In/Out
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg text-white flex items-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-purple-600 ring-4 ring-purple-300 ring-opacity-60 scale-105'
                : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            📝 New Registration
          </button>
          <button
            onClick={() => setActiveTab('birthdays')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg text-white flex items-center gap-2 cursor-pointer ${
              activeTab === 'birthdays'
                ? 'bg-pink-600 ring-4 ring-pink-300 ring-opacity-60 scale-105'
                : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            🎂 Birthdays
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg text-white flex items-center gap-2 cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-orange-600 ring-4 ring-orange-300 ring-opacity-60 scale-105'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            📈 Attendance
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg text-white flex items-center gap-2 cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-indigo-600 ring-4 ring-indigo-300 ring-opacity-60 scale-105'
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            👩‍🏫 Teachers on Duty
          </button>
        </nav>

        {/* ============================================================ */}
        {/* VIEW 1: DASHBOARD */}
        {/* ============================================================ */}
        {activeTab === 'dashboard' && (
          <div className="fade-in max-w-6xl mx-auto">
            {/* Top 3 Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Checked In */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">👥</div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Currently Checked In</p>
                    <p className="text-3xl font-bold text-blue-600">{checkedInChildren.length}</p>
                  </div>
                </div>
              </div>

              {/* Total Registered */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">📋</div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Registered</p>
                    <p className="text-3xl font-bold text-green-600">{children.length}</p>
                  </div>
                </div>
              </div>

              {/* Birthdays This Week */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🎉</div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Birthdays This Week</p>
                    <p className="text-3xl font-bold text-pink-600">{birthdaysThisWeek.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Currently Checked In List */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">✅</span>
                Currently Checked In
              </h3>

              {checkedInChildren.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <p className="text-lg">No children currently checked in</p>
                  <button
                    onClick={() => setActiveTab('checkin')}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                  >
                    Go to Check In/Out to check in a child
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {checkedInChildren.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 slide-in"
                    >
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{child.gender === 'Girl' ? '👧' : '👦'}</div>
                        <div>
                          <p className="font-semibold text-gray-800">{child.name}</p>
                          <p className="text-sm text-gray-600">
                            Age {child.age} • Checked in at {child.checkInTime}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCheckOut(child.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer shadow-sm"
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
          <div className="fade-in max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Check In/Out System
              </h2>

              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Search for Child</label>
                <div className="relative">
                  <input
                    type="text"
                    value={childSearchQuery}
                    onChange={(e) => setChildSearchQuery(e.target.value)}
                    placeholder="Type child's name..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg pr-10"
                    autoFocus
                  />
                  <div className="absolute right-3 top-3.5 text-gray-400 text-xl pointer-events-none">
                    🔍
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Type at least 2 letters to search</p>
              </div>

              {/* Search Results */}
              <div className="space-y-3">
                {childSearchQuery.trim().length >= 2 && filteredChildren.length === 0 && (
                  <p className="text-gray-500 text-center py-6">No children found</p>
                )}

                {filteredChildren.map((child) => {
                  const isCheckedIn = checkedInChildren.some((c) => c.id === child.id);
                  return (
                    <div
                      key={child.id}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200 slide-in"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">
                            {isCheckedIn ? '✅' : child.gender === 'Girl' ? '👧' : '👦'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{child.name}</p>
                            <p className="text-sm text-gray-600">
                              Age {child.age} • {child.parentPhone}
                            </p>
                            {child.specialNotes && (
                              <p className="text-sm text-orange-600 font-medium">
                                ⚠️ {child.specialNotes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {isCheckedIn ? (
                            <button
                              onClick={() => handleCheckOut(child.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer shadow-sm"
                            >
                              Check Out
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCheckIn(child.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer shadow-sm"
                            >
                              Check In
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
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                New Child Registration
              </h2>

              <form onSubmit={handleRegisterChild} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="e.g. Samuel Bassey"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Parent/Guardian Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newChildPhone}
                    onChange={(e) => setNewChildPhone(e.target.value)}
                    placeholder="e.g. 0803 123 4567"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={newChildBirthDate}
                      onChange={(e) => handleBirthDateChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Gender *</label>
                    <select
                      required
                      value={newChildGender}
                      onChange={(e) => setNewChildGender(e.target.value as 'Boy' | 'Girl')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Boy">Boy</option>
                      <option value="Girl">Girl</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Age</label>
                    <input
                      type="number"
                      readOnly
                      value={newChildAge}
                      placeholder="Auto"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Emergency Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={newChildEmergency}
                    onChange={(e) => setNewChildEmergency(e.target.value)}
                    placeholder="e.g. 0802 334 5566 (Aunt)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Special Notes (Allergies, etc.)
                  </label>
                  <textarea
                    rows={3}
                    value={newChildNotes}
                    onChange={(e) => setNewChildNotes(e.target.value)}
                    placeholder="e.g. Asthmatic, allergic to nuts, lactose intolerant..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full mt-8 bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg cursor-pointer"
                >
                  Register Child 🌟
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: BIRTHDAYS */}
        {/* ============================================================ */}
        {activeTab === 'birthdays' && (
          <div className="fade-in max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                <span className="text-3xl mr-2">🎂</span>
                Birthday Reminders
              </h2>

              {/* Today's Birthdays */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-pink-600 mb-4">🎉 Today's Birthdays</h3>
                {todaysBirthdays.length === 0 ? (
                  <p className="text-gray-500">No birthdays today</p>
                ) : (
                  <div className="space-y-3">
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
                          className="p-4 bg-pink-50 rounded-lg border border-pink-200 slide-in"
                        >
                          <div className="flex items-center">
                            <div className="text-3xl mr-4">🎂</div>
                            <div>
                              <p className="font-semibold text-gray-800">{child.name}</p>
                              <p className="text-sm text-gray-600">
                                Turning {age} on {birthdayStr}
                              </p>
                              <p className="text-sm text-gray-500">{child.parentPhone}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* This Week's Birthdays */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-600 mb-4">📅 This Week's Birthdays</h3>
                {weekBirthdaysList.length === 0 ? (
                  <p className="text-gray-500">No birthdays this week</p>
                ) : (
                  <div className="space-y-3">
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
                          className="p-4 bg-pink-50 rounded-lg border border-pink-200 slide-in"
                        >
                          <div className="flex items-center">
                            <div className="text-3xl mr-4">🎂</div>
                            <div>
                              <p className="font-semibold text-gray-800">{child.name}</p>
                              <p className="text-sm text-gray-600">
                                Turning {age} on {birthdayStr}
                              </p>
                              <p className="text-sm text-gray-500">{child.parentPhone}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upcoming Birthdays This Month */}
              <div>
                <h3 className="text-xl font-bold text-green-600 mb-4">🔮 Upcoming This Month</h3>
                {monthBirthdaysList.length === 0 ? (
                  <p className="text-gray-500">No upcoming birthdays this month</p>
                ) : (
                  <div className="space-y-3">
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
                          className="p-4 bg-pink-50 rounded-lg border border-pink-200 slide-in"
                        >
                          <div className="flex items-center">
                            <div className="text-3xl mr-4">🎂</div>
                            <div>
                              <p className="font-semibold text-gray-800">{child.name}</p>
                              <p className="text-sm text-gray-600">
                                Turning {age} on {birthdayStr}
                              </p>
                              <p className="text-sm text-gray-500">{child.parentPhone}</p>
                            </div>
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
          <div className="fade-in max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                <span className="text-3xl mr-2">📈</span>
                Sunday Attendance Summary
              </h2>

              {/* Current Sunday Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">👥</div>
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Today's Total</p>
                      <p className="text-2xl font-bold">{todayTotal}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">👦</div>
                    <div>
                      <p className="text-green-100 text-sm font-medium">Boys Today</p>
                      <p className="text-2xl font-bold">{todayBoys.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">👧</div>
                    <div>
                      <p className="text-pink-100 text-sm font-medium">Girls Today</p>
                      <p className="text-2xl font-bold">{todayGirls.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">📅</div>
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Date</p>
                      <p className="text-lg font-bold">{formattedToday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Summary */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Weekly Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{avgTotal}</p>
                      <p className="text-gray-600 font-medium">Average Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{avgBoys}</p>
                      <p className="text-gray-600 font-medium">Average Boys</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-pink-600">{avgGirls}</p>
                      <p className="text-gray-600 font-medium">Average Girls</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance History */}
              <div className="mb-8">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="text-2xl mr-2">📋</span>
                    Attendance History
                  </h3>
                  <button
                    onClick={handleRecordTodayAttendance}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg cursor-pointer"
                  >
                    📝 Record Today's Attendance
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Boys
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Girls
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            No attendance records yet
                          </td>
                        </tr>
                      ) : (
                        attendanceHistory.map((record, index) => {
                          const percentage =
                            children.length > 0
                              ? Math.round((record.total / children.length) * 100)
                              : 0;
                          const dateObj = new Date(record.date);
                          const dateFormatted = !isNaN(dateObj.getTime())
                            ? dateObj.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : record.date;
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {dateFormatted}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                {record.total}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                                {record.boys}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600 font-medium">
                                {record.girls}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Today's Attendees List */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">👥</span>
                  Today's Attendees
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Boys List */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                      <span className="text-xl mr-2">👦</span>
                      Boys ({todayBoys.length})
                    </h4>
                    {todayBoys.length === 0 ? (
                      <p className="text-gray-500">No boys checked in today</p>
                    ) : (
                      <div className="space-y-2">
                        {todayBoys.map((boy) => (
                          <div
                            key={boy.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                          >
                            <div className="flex items-center">
                              <div className="text-lg mr-3">👦</div>
                              <div>
                                <p className="font-semibold text-gray-800">{boy.name}</p>
                                <p className="text-sm text-gray-600">Age {boy.age}</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{boy.checkInTime}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Girls List */}
                  <div className="bg-pink-50 rounded-lg p-6 border border-pink-100">
                    <h4 className="text-lg font-bold text-pink-800 mb-3 flex items-center">
                      <span className="text-xl mr-2">👧</span>
                      Girls ({todayGirls.length})
                    </h4>
                    {todayGirls.length === 0 ? (
                      <p className="text-gray-500">No girls checked in today</p>
                    ) : (
                      <div className="space-y-2">
                        {todayGirls.map((girl) => (
                          <div
                            key={girl.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-pink-200"
                          >
                            <div className="flex items-center">
                              <div className="text-lg mr-3">👧</div>
                              <div>
                                <p className="font-semibold text-gray-800">{girl.name}</p>
                                <p className="text-sm text-gray-600">Age {girl.age}</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{girl.checkInTime}</span>
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
          <div className="fade-in max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                <span className="text-3xl mr-2">👩‍🏫</span>
                Teachers on Duty
              </h2>

              {/* Teacher Registration Form */}
              <div className="mb-8 bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">Add New Teacher</h3>
                <form
                  onSubmit={handleRegisterTeacher}
                  className="grid md:grid-cols-3 gap-4 items-end"
                >
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Teacher Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTeacherName}
                      onChange={(e) => setNewTeacherName(e.target.value)}
                      placeholder="e.g. Sister Anietie Udoh"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newTeacherPhone}
                      onChange={(e) => setNewTeacherPhone(e.target.value)}
                      placeholder="e.g. 0803 123 4567"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-lg font-semibold transition-all duration-200 shadow-lg cursor-pointer"
                    >
                      Add Teacher 👩‍🏫
                    </button>
                  </div>
                </form>
              </div>

              {/* Today's Duty Stats */}
              <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">👥</div>
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Teachers on Duty</p>
                      <p className="text-2xl font-bold">{teachersOnDuty.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">✅</div>
                    <div>
                      <p className="text-green-100 text-sm font-medium">Checked In</p>
                      <p className="text-2xl font-bold">{teachersOnDuty.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">📅</div>
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Date</p>
                      <p className="text-lg font-bold">{formattedToday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Check-In Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🔍</span>
                  Teacher Check-In
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Search Teacher</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={teacherSearchQuery}
                        onChange={(e) => setTeacherSearchQuery(e.target.value)}
                        placeholder="Type teacher's name..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg pr-10 bg-white"
                      />
                      <div className="absolute right-3 top-3.5 text-gray-400 text-xl pointer-events-none">
                        🔍
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Type at least 2 letters to search</p>
                  </div>

                  {/* Teacher Search Results */}
                  <div className="space-y-3">
                    {teacherSearchQuery.trim().length >= 2 && filteredTeachers.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No teachers found</p>
                    )}

                    {filteredTeachers.map((teacher) => {
                      const isOnDuty = teachersOnDuty.some((t) => t.id === teacher.id);
                      return (
                        <div
                          key={teacher.id}
                          className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-all duration-200 slide-in"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">{isOnDuty ? '✅' : '👩‍🏫'}</div>
                              <div>
                                <p className="font-semibold text-gray-800">{teacher.name}</p>
                                <p className="text-sm text-gray-600">{teacher.phone}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {isOnDuty ? (
                                <button
                                  onClick={() => handleTeacherCheckOut(teacher.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer shadow-sm"
                                >
                                  Check Out
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleTeacherCheckIn(teacher.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer shadow-sm"
                                >
                                  Check In
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

              {/* Currently on Duty */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✅</span>
                  Currently on Duty
                </h3>
                {teachersOnDuty.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No teachers currently on duty</p>
                ) : (
                  <div className="space-y-3">
                    {teachersOnDuty.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 slide-in"
                      >
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">👩‍🏫</div>
                          <div>
                            <p className="font-semibold text-gray-800">{teacher.name}</p>
                            <p className="text-sm text-gray-600">
                              {teacher.phone} • Checked in at {teacher.checkInTime}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleTeacherCheckOut(teacher.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer shadow-sm"
                        >
                          Check Out
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Registered Teachers */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📋</span>
                  All Registered Teachers
                </h3>
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teachers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            No teachers registered yet
                          </td>
                        </tr>
                      ) : (
                        teachers.map((teacher) => {
                          const isOnDuty = teachersOnDuty.some((t) => t.id === teacher.id);
                          return (
                            <tr key={teacher.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {teacher.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {teacher.phone}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    isOnDuty
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {isOnDuty ? 'On Duty' : 'Off Duty'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {isOnDuty ? (
                                  <button
                                    onClick={() => handleTeacherCheckOut(teacher.id)}
                                    className="text-red-600 hover:text-red-900 font-semibold cursor-pointer"
                                  >
                                    Check Out
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleTeacherCheckIn(teacher.id)}
                                    className="text-green-600 hover:text-green-900 font-semibold cursor-pointer"
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
      </div>
    </div>
  );
}
