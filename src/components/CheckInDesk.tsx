import React, { useState } from 'react';
import {
  Child,
  AttendanceRecord,
  DepartmentConfig,
  ServiceConfig,
  ChurchSettings,
} from '../types';
import {
  Search,
  UserCheck,
  UserPlus,
  Clock,
  Printer,
  ShieldCheck,
  AlertCircle,
  Tag,
  Filter,
  CheckCircle2,
  Phone,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { getTodayDateString } from '../mockData';

interface CheckInDeskProps {
  childrenList: Child[];
  attendance: AttendanceRecord[];
  departments: DepartmentConfig[];
  services: ServiceConfig[];
  activeServiceId: string;
  onSelectService: (serviceId: string) => void;
  settings: ChurchSettings;
  onCheckInChild: (child: Child) => void;
  onOpenRegisterModal: () => void;
  onViewSlip: (record: AttendanceRecord) => void;
}

export const CheckInDesk: React.FC<CheckInDeskProps> = ({
  childrenList,
  attendance,
  departments,
  services,
  activeServiceId,
  onSelectService,
  settings,
  onCheckInChild,
  onOpenRegisterModal,
  onViewSlip,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');

  const todayStr = getTodayDateString();
  const activeService = services.find((s) => s.id === activeServiceId) || services[0];

  // Records for today's active service
  const todayServiceAttendance = attendance.filter(
    (a) => a.date === todayStr && a.serviceId === activeServiceId
  );

  // Map of childId -> attendance record for current service today (status: checked_in or checked_out)
  const todayAttendanceMap = new Map<string, AttendanceRecord>();
  todayServiceAttendance.forEach((rec) => {
    todayAttendanceMap.set(rec.childId, rec);
  });

  const currentlyCheckedInCount = todayServiceAttendance.filter((a) => a.status === 'checked_in').length;

  // Filter children based on search and department
  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch =
      child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.parentPhone.includes(searchTerm) ||
      (child.secondaryContactPhone && child.secondaryContactPhone.includes(searchTerm));

    const matchesDept = selectedDeptId === 'all' || child.departmentId === selectedDeptId;

    return matchesSearch && matchesDept;
  });

  const getDeptObj = (deptId: string) => departments.find((d) => d.id === deptId);

  return (
    <div className="space-y-6">
      {/* Service Banner & Overview */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/25 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Service Check-In Window</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {activeService?.name || 'Active Service'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-200/90 max-w-xl">
              {activeService?.description || 'Children and youth church registration and security tag check-in.'}
              {activeService?.time && ` • Schedule: ${activeService.time}`}
            </p>
          </div>

          {/* Quick Stats & Service Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-2.5 text-center min-w-[100px]">
              <span className="text-[11px] text-blue-200 uppercase font-semibold block">
                Checked In
              </span>
              <span className="text-2xl font-black text-white">
                {currentlyCheckedInCount}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-2.5 text-center min-w-[100px]">
              <span className="text-[11px] text-blue-200 uppercase font-semibold block">
                Registered
              </span>
              <span className="text-2xl font-black text-white">
                {childrenList.length}
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenRegisterModal}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition shadow-md cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Register New Child</span>
            </button>
          </div>
        </div>

        {/* Quick Service Switch Tabs within the banner */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-blue-200 mr-2">Available Services:</span>
          {services
            .filter((s) => s.isActive)
            .map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => onSelectService(srv.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  srv.id === activeServiceId
                    ? 'bg-white text-blue-950 font-bold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white/90'
                }`}
              >
                <span>{srv.name}</span>
                {srv.id === activeServiceId && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
              </button>
            ))}
        </div>
      </div>

      {/* Search and Department Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search child by name, parent name, or phone number..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />
          </div>

          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="sm:hidden w-full py-2.5 px-4 bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Child</span>
          </button>
        </div>

        {/* Children's Church Departments Filter (Names customizable by Admin) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Department:
          </span>
          <button
            type="button"
            onClick={() => setSelectedDeptId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer ${
              selectedDeptId === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Classes ({childrenList.length})
          </button>

          {departments.map((dept) => {
            const count = childrenList.filter((c) => c.departmentId === dept.id).length;
            const isSelected = selectedDeptId === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDeptId(dept.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{dept.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-blue-900 text-blue-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Children List Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>
            Showing <strong>{filteredChildren.length}</strong> children in registry
          </span>
          <span>
            Target Service: <strong>{activeService?.name}</strong>
          </span>
        </div>

        {filteredChildren.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700 text-base">No children found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm
                ? `No child matches "${searchTerm}". Try a different name or register as a new child.`
                : 'There are no children in this department.'}
            </p>
            <button
              type="button"
              onClick={onOpenRegisterModal}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register First-Timer / Child</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChildren.map((child) => {
              const dept = getDeptObj(child.departmentId);
              const attendanceRecord = todayAttendanceMap.get(child.id);
              const isCheckedIn = attendanceRecord?.status === 'checked_in';
              const isCheckedOut = attendanceRecord?.status === 'checked_out';

              return (
                <div
                  key={child.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 p-4.5 flex flex-col justify-between ${
                    isCheckedIn
                      ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                      : isCheckedOut
                      ? 'border-slate-300 bg-slate-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Row: Department badge & Check-in Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 truncate max-w-[60%]">
                        {dept?.name || 'Children Church'}
                      </span>
                      {isCheckedIn && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Checked In
                        </span>
                      )}
                      {isCheckedOut && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                          Checked Out ({attendanceRecord.checkOutTime})
                        </span>
                      )}
                      {!isCheckedIn && !isCheckedOut && (
                        <span className="text-[11px] text-slate-400 font-medium shrink-0">
                          Not Checked In
                        </span>
                      )}
                    </div>

                    {/* Child Identity */}
                    <div className="flex items-center gap-3 mt-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xs ${
                          child.avatarColor || 'bg-blue-600'
                        }`}
                      >
                        {child.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                          <span>{child.fullName}</span>
                          {child.isFirstTimer && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-md font-extrabold flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              1st
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Age: <strong className="text-slate-700">{child.age} yrs</strong> • {child.gender}
                        </p>
                      </div>
                    </div>

                    {/* Parent & Contact Details */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 text-[11px]">Parent:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                          {child.parentName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 text-[11px]">Phone:</span>
                        <span className="font-mono text-slate-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {child.parentPhone}
                        </span>
                      </div>

                      {/* Allergies / Medical Warning */}
                      {child.allergiesMedicalNotes && child.allergiesMedicalNotes !== 'None' && (
                        <div className="mt-2 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="truncate">{child.allergiesMedicalNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {isCheckedIn && attendanceRecord ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1.5 flex-1 text-center">
                          <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                            Pickup Code
                          </span>
                          <span className="font-mono font-black text-sm text-emerald-900">
                            {attendanceRecord.pickupSecurityCode}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onViewSlip(attendanceRecord)}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                          title="Print / View Parent Security Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Slip</span>
                        </button>
                      </div>
                    ) : isCheckedOut && attendanceRecord ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 flex-1 text-center">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">
                            Checked Out
                          </span>
                          <span className="font-semibold text-xs text-slate-700 truncate block">
                            Released to {attendanceRecord.checkedOutBy || attendanceRecord.parentName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onViewSlip(attendanceRecord)}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                          title="View Attendance Security Record"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Record</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCheckInChild(child)}
                        className="w-full py-2.5 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                      >
                        <UserCheck className="w-4 h-4 text-blue-200" />
                        <span>Check-In to {activeService?.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
