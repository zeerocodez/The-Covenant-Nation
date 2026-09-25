import React, { useState } from 'react';
import { AttendanceRecord, DepartmentConfig, ServiceConfig, ChurchSettings } from '../types';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  AlertTriangle,
  UserCheck,
  KeyRound,
  Printer,
  XCircle,
} from 'lucide-react';
import { getTodayDateString } from '../mockData';

interface CheckOutDeskProps {
  attendance: AttendanceRecord[];
  departments: DepartmentConfig[];
  services: ServiceConfig[];
  activeServiceId: string;
  settings: ChurchSettings;
  onCheckOutRecord: (recordId: string, authorizedPerson: string) => void;
  onViewSlip: (record: AttendanceRecord) => void;
}

export const CheckOutDesk: React.FC<CheckOutDeskProps> = ({
  attendance,
  departments,
  services,
  activeServiceId,
  settings,
  onCheckOutRecord,
  onViewSlip,
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [authorizedPerson, setAuthorizedPerson] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [alreadyCheckedOutWarning, setAlreadyCheckedOutWarning] = useState<AttendanceRecord | null>(null);
  const [checkoutSuccessMessage, setCheckoutSuccessMessage] = useState<string | null>(null);
  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState<string | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const todayStr = getTodayDateString();

  // All children currently checked in today (across active service or all today)
  const checkedInToday = attendance.filter(
    (a) => a.date === todayStr && a.status === 'checked_in'
  );

  const checkedOutToday = attendance.filter(
    (a) => a.date === todayStr && a.status === 'checked_out'
  );

  const handleSearchCode = (val: string) => {
    setCodeInput(val);
    setCheckoutErrorMessage(null);
    const cleaned = val.trim().toLowerCase();
    if (!cleaned) {
      setSelectedRecord(null);
      setAlreadyCheckedOutWarning(null);
      return;
    }

    const match = checkedInToday.find(
      (rec) =>
        rec.pickupSecurityCode.toLowerCase() === cleaned ||
        rec.pickupSecurityCode.replace('tcn-', '').toLowerCase() === cleaned ||
        rec.childName.toLowerCase().includes(cleaned) ||
        rec.parentPhone.includes(cleaned)
    );

    if (match) {
      setSelectedRecord(match);
      setAuthorizedPerson(match.parentName);
      setAlreadyCheckedOutWarning(null);
    } else {
      setSelectedRecord(null);
      const alreadyOut = checkedOutToday.find(
        (rec) =>
          rec.pickupSecurityCode.toLowerCase() === cleaned ||
          rec.pickupSecurityCode.replace('tcn-', '').toLowerCase() === cleaned ||
          rec.childName.toLowerCase().includes(cleaned) ||
          rec.parentPhone.includes(cleaned)
      );
      setAlreadyCheckedOutWarning(alreadyOut || null);
    }
  };

  const handleSelectChildDirectly = (rec: AttendanceRecord) => {
    setCheckoutErrorMessage(null);
    if (rec.status === 'checked_out') {
      setAlreadyCheckedOutWarning(rec);
      setSelectedRecord(null);
      return;
    }
    setSelectedRecord(rec);
    setCodeInput(rec.pickupSecurityCode);
    setAuthorizedPerson(rec.parentName);
    setAlreadyCheckedOutWarning(null);
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || isProcessingCheckout) return;

    if (selectedRecord.status === 'checked_out') {
      setCheckoutErrorMessage(`Duplicate checkout blocked: ${selectedRecord.childName} has already been checked out today.`);
      setSelectedRecord(null);
      return;
    }

    setIsProcessingCheckout(true);
    onCheckOutRecord(selectedRecord.id, authorizedPerson || selectedRecord.parentName);
    setCheckoutSuccessMessage(
      `✓ Successfully checked out ${selectedRecord.childName}. Child released to ${
        authorizedPerson || selectedRecord.parentName
      }.`
    );
    setSelectedRecord(null);
    setAlreadyCheckedOutWarning(null);
    setCodeInput('');
    setAuthorizedPerson('');
    setIsProcessingCheckout(false);

    setTimeout(() => {
      setCheckoutSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Checkout Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Secure Parent Verification & Release</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Security Check-Out Desk
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 max-w-xl mt-1">
              Verify parent pickup security code or scan ticket before releasing children from their church classes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-2.5 text-center min-w-[110px]">
              <span className="text-[11px] text-amber-200 uppercase font-semibold block">
                Pending Pickup
              </span>
              <span className="text-2xl font-black text-white">
                {checkedInToday.length}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-2.5 text-center min-w-[110px]">
              <span className="text-[11px] text-amber-200 uppercase font-semibold block">
                Released Today
              </span>
              <span className="text-2xl font-black text-white">
                {checkedOutToday.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {checkoutSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{checkoutSuccessMessage}</span>
        </div>
      )}

      {checkoutErrorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{checkoutErrorMessage}</span>
        </div>
      )}

      {/* Main Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Form Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Enter Security Pickup Code</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter 4-digit code (e.g. 8421 or TCN-8421), child name, or parent phone.
            </p>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={codeInput}
              onChange={(e) => handleSearchCode(e.target.value)}
              placeholder="e.g. 8421, TCN-8421, or David Udoh"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-2xl text-base font-mono font-bold tracking-wider text-slate-900 focus:outline-hidden focus:bg-white transition"
              autoFocus
            />
          </div>

          {/* Already Checked Out Duplicate Warning */}
          {alreadyCheckedOutWarning && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Child Already Checked Out (Duplicate Checkout Blocked)</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>{alreadyCheckedOutWarning.childName}</strong> was already checked out and released today at{' '}
                <strong>{alreadyCheckedOutWarning.checkOutTime || 'earlier'}</strong> to{' '}
                <strong>{alreadyCheckedOutWarning.checkedOutBy || alreadyCheckedOutWarning.parentName}</strong>. A child cannot be checked out twice.
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-600">
                  Ticket Code: <strong>{alreadyCheckedOutWarning.pickupSecurityCode}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => onViewSlip(alreadyCheckedOutWarning)}
                  className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  View Security Record
                </button>
              </div>
            </div>
          )}

          {/* Matched Child Preview */}
          {selectedRecord ? (
            <form onSubmit={handleConfirmCheckout} className="space-y-4 pt-2">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                      Verified Match Found
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-0.5">
                      {selectedRecord.childName}
                    </h4>
                  </div>
                  <span className="font-mono text-base font-black px-2.5 py-1 bg-amber-200 text-amber-900 rounded-xl">
                    {selectedRecord.pickupSecurityCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Service:</span>
                    <strong className="text-slate-800">{selectedRecord.serviceName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Class / Dept:</span>
                    <strong className="text-slate-800">{selectedRecord.departmentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Registered Parent:</span>
                    <strong className="text-slate-800">{selectedRecord.parentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Parent Phone:</span>
                    <strong className="text-slate-800 font-mono">{selectedRecord.parentPhone}</strong>
                  </div>
                </div>

                {selectedRecord.allergiesMedicalNotes &&
                  selectedRecord.allergiesMedicalNotes !== 'None' && (
                    <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{selectedRecord.allergiesMedicalNotes}</span>
                    </div>
                  )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Person Picking Up Child (Authorized Name):
                </label>
                <input
                  type="text"
                  required
                  value={authorizedPerson}
                  onChange={(e) => setAuthorizedPerson(e.target.value)}
                  placeholder="Parent or authorized guardian name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Release Child</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs">
              <KeyRound className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <span>Enter a security code or click on any child from the waiting list below.</span>
            </div>
          )}
        </div>

        {/* Currently Checked-In Waiting List */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Children Awaiting Checkout</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Click a child to quick-load their verification card
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg">
                {checkedInToday.length} In Class
              </span>
            </div>

            {checkedInToday.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <p className="font-semibold text-slate-700">All children have been checked out!</p>
                <p className="mt-0.5">No children currently pending release.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {checkedInToday.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => handleSelectChildDirectly(rec)}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {rec.childName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {rec.departmentName} • {rec.serviceName}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2 py-1 bg-slate-100 text-slate-800 rounded-lg">
                        {rec.pickupSecurityCode}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewSlip(rec);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                        title="View slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Checked Out History */}
          {checkedOutToday.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Recently Released Today ({checkedOutToday.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {checkedOutToday.slice(-5).map((rec) => (
                  <span
                    key={rec.id}
                    className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{rec.childName}</span>
                    <span className="text-[10px] text-slate-400">({rec.checkOutTime || 'Out'})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
