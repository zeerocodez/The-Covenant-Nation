import React, { useState } from 'react';
import {
  AttendanceRecord,
  DepartmentConfig,
  ServiceConfig,
  ChurchSettings,
} from '../types';
import {
  ClipboardList,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Search,
  Calendar,
  Layers,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { getTodayDateString } from '../mockData';

interface AttendanceReportsProps {
  attendance: AttendanceRecord[];
  departments: DepartmentConfig[];
  services: ServiceConfig[];
  settings: ChurchSettings;
  onViewSlip: (record: AttendanceRecord) => void;
}

export const AttendanceReports: React.FC<AttendanceReportsProps> = ({
  attendance,
  departments,
  services,
  settings,
  onViewSlip,
}) => {
  const todayStr = getTodayDateString();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reportFeedback, setReportFeedback] = useState<string | null>(null);

  const showReportFeedback = (msg: string) => {
    setReportFeedback(msg);
    setTimeout(() => setReportFeedback(null), 3500);
  };

  const filteredRecords = attendance.filter((rec) => {
    const matchesService = selectedServiceId === 'all' || rec.serviceId === selectedServiceId;
    const matchesDept = selectedDeptId === 'all' || rec.departmentId === selectedDeptId;
    const matchesStatus = selectedStatus === 'all' || rec.status === selectedStatus;
    const matchesDate = !selectedDate || rec.date === selectedDate;
    const matchesSearch =
      rec.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.pickupSecurityCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.parentPhone.includes(searchQuery);

    return matchesService && matchesDept && matchesStatus && matchesDate && matchesSearch;
  });

  const totalAttendees = filteredRecords.length;
  const checkedInCount = filteredRecords.filter((r) => r.status === 'checked_in').length;
  const checkedOutCount = filteredRecords.filter((r) => r.status === 'checked_out').length;

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      showReportFeedback('ℹ No records found to export with the current filter settings.');
      return;
    }

    const headers = [
      'Date',
      'Child Name',
      'Service',
      'Department / Class',
      'Security Pickup Code',
      'Parent Name',
      'Parent Phone',
      'Check-In Time',
      'Check-In Officer',
      'Status',
      'Check-Out Time',
      'Released To',
      'Medical Notes',
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.date}"`,
      `"${r.childName}"`,
      `"${r.serviceName}"`,
      `"${r.departmentName}"`,
      `"${r.pickupSecurityCode}"`,
      `"${r.parentName}"`,
      `"${r.parentPhone}"`,
      `"${r.checkInTime}"`,
      `"${r.checkedInBy || ''}"`,
      `"${r.status === 'checked_in' ? 'Checked In' : 'Checked Out'}"`,
      `"${r.checkOutTime || ''}"`,
      `"${r.checkedOutBy || ''}"`,
      `"${(r.allergiesMedicalNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `TCN_Uyo_Children_Church_Attendance_${selectedDate || 'all'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Attendance Database & Reports</h2>
              <p className="text-xs text-slate-500">
                Official rosters, security checkout audits, and service attendance statistics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {reportFeedback && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50 border border-blue-300 text-blue-900 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <span>{reportFeedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Filtered
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {totalAttendees}
            </span>
            <span className="text-[11px] text-slate-500">Children recorded</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Currently Checked In
            </span>
            <span className="text-3xl font-black text-blue-700 mt-1 block">
              {checkedInCount}
            </span>
            <span className="text-[11px] text-slate-500">In class right now</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Checked Out / Released
            </span>
            <span className="text-3xl font-black text-emerald-600 mt-1 block">
              {checkedOutCount}
            </span>
            <span className="text-[11px] text-slate-500">Verified pickup</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Services Breakdown Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> Service Breakdown (for selected date)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {services.map((srv) => {
            const count = attendance.filter(
              (r) => r.serviceId === srv.id && (!selectedDate || r.date === selectedDate)
            ).length;
            const isSelected = selectedServiceId === srv.id;

            return (
              <div
                key={srv.id}
                onClick={() => setSelectedServiceId(isSelected ? 'all' : srv.id)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 truncate">
                    {srv.name}
                  </span>
                  <span className="text-base font-black text-blue-700">{count}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{srv.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Search Record
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Child name, code, parent..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Service Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Church Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            >
              <option value="all">All Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Department / Class
            </label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-semibold mr-1">Status:</span>
          {['all', 'checked_in', 'checked_out'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer capitalize ${
                selectedStatus === st
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Status' : st === 'checked_in' ? 'Checked In' : 'Checked Out'}
            </button>
          ))}
          {selectedDate !== '' && (
            <button
              type="button"
              onClick={() => setSelectedDate('')}
              className="ml-auto text-xs text-blue-700 hover:underline cursor-pointer"
            >
              Clear Date Filter (Show All Time)
            </button>
          )}
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Child Name</th>
                <th className="px-4 py-3.5">Service</th>
                <th className="px-4 py-3.5">Department / Class</th>
                <th className="px-4 py-3.5 font-mono">Pickup Code</th>
                <th className="px-4 py-3.5">Parent & Contact</th>
                <th className="px-4 py-3.5">Check-In / Out</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No attendance records found matching the current criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {record.childName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {record.serviceName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {record.departmentName}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      {record.pickupSecurityCode}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{record.parentName}</div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {record.parentPhone}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-slate-800">In: {record.checkInTime}</div>
                      {record.checkOutTime && (
                        <div className="text-slate-500 text-[11px]">
                          Out: {record.checkOutTime}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {record.status === 'checked_in' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Clock className="w-3 h-3 text-blue-600" />
                          Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Checked Out
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onViewSlip(record)}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                      >
                        Slip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
