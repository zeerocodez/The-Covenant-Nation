import React, { useState } from 'react';
import { AttendanceRecord, DepartmentConfig, ChurchSettings } from '../types';
import {
  X,
  Printer,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  User,
  Church,
} from 'lucide-react';

interface SecurityBadgeModalProps {
  record: AttendanceRecord | null;
  department?: DepartmentConfig;
  settings: ChurchSettings;
  onClose: () => void;
}

export const SecurityBadgeModal: React.FC<SecurityBadgeModalProps> = ({
  record,
  department,
  settings,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(record.pickupSecurityCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Security Check-In Slip</h3>
              <p className="text-[11px] text-slate-300">
                Official Parent Claim Slip & Child Name Badge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div
            id="printable-slip"
            className="bg-gradient-to-b from-slate-50 to-white border-2 border-dashed border-slate-300 rounded-2xl p-5 shadow-xs relative"
          >
            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="flex items-center justify-center gap-1.5 text-blue-900 font-extrabold text-base uppercase tracking-wider">
                <Church className="w-5 h-5 text-blue-700" />
                <span>{settings.churchName || 'The Covenant Nation Uyo'}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {settings.branchName || 'Vinpy Events Centre, 10 Udo Udoma Ave, Uyo'}
              </p>
              <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-widest">
                Parent Security Claim Slip
              </div>
            </div>

            {/* Big Pickup Code Box */}
            <div className="my-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-xl p-4 text-center shadow-md">
              <span className="text-[11px] uppercase tracking-widest text-blue-200 block font-semibold mb-1">
                Parent Pickup Security Code
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-amber-300 flex items-center justify-center gap-2">
                <span>{record.pickupSecurityCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer text-xs"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-blue-200 mt-1">
                Must present this code or slip to check out child
              </p>
            </div>

            {/* Child & Service Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">
                  Child's Full Name
                </span>
                <span className="font-bold text-slate-800 text-sm block mt-0.5 truncate">
                  {record.childName}
                </span>
              </div>

              <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">
                  Service Attended
                </span>
                <span className="font-bold text-blue-700 text-sm block mt-0.5 truncate">
                  {record.serviceName}
                </span>
              </div>

              <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200/60 col-span-2">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">
                  Children's Church Department / Class
                </span>
                <span className="font-bold text-slate-800 text-sm block mt-0.5">
                  {record.departmentName}
                </span>
                {department?.location && (
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {department.location}
                  </span>
                )}
              </div>

              <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">
                  Parent / Guardian
                </span>
                <span className="font-semibold text-slate-700 block mt-0.5 truncate">
                  {record.parentName}
                </span>
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {record.parentPhone}
                </span>
              </div>

              <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200/60">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">
                  Check-In Time
                </span>
                <span className="font-semibold text-slate-700 block mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {record.checkInTime} • {record.date}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Officer: {record.checkedInBy}
                </span>
              </div>
            </div>

            {/* Medical / Allergies Alert */}
            {record.allergiesMedicalNotes && record.allergiesMedicalNotes !== 'None' && (
              <div className="mt-3.5 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block uppercase text-[10px] tracking-wider text-amber-800">
                    Medical & Allergy Note:
                  </strong>
                  <span>{record.allergiesMedicalNotes}</span>
                </div>
              </div>
            )}

            {/* Emergency Info Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500">
              Emergency Church Security Hotline:{' '}
              <strong className="text-slate-700">{settings.emergencyPhone}</strong>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
          >
            Done
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Code Copied' : 'Copy Code'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Security Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
