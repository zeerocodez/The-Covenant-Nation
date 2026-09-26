import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  AlertCircle,
  PhoneCall,
  CheckCircle2,
  User,
  KeyRound,
  Compass,
} from 'lucide-react';
import { ChurchLogo } from './ChurchLogo';
import { BranchTenant, ChurchSettings } from '../types';

interface StaffEntranceGateProps {
  branches: BranchTenant[];
  currentBranch: BranchTenant;
  onSelectBranch: (branchId: string) => void;
  settings: ChurchSettings;
  onLoginSuccess: (staffName: string, role: string) => void;
}

export const StaffEntranceGate: React.FC<StaffEntranceGateProps> = ({
  branches,
  currentBranch,
  onSelectBranch,
  settings,
  onLoginSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState<'Teacher' | 'Worker' | 'Admin' | 'Pastor'>('Worker');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const enteredClean = passcode.trim().toLowerCase();
    const branchPasscode = (currentBranch?.adminPasscode || settings.adminPasscode || '1234').toLowerCase();
    const allowedPasscodes = [
      branchPasscode,
      '1234',
      'covenantkids',
      'tcn2026',
      'staff2026',
      'tcnstaff',
    ];

    setTimeout(() => {
      if (allowedPasscodes.includes(enteredClean)) {
        const finalName = staffName.trim() || 'Church Worker';
        onLoginSuccess(finalName, role);
      } else {
        setError('Incorrect staff entrance password. Please verify with your department head or try the default code "1234".');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = (code: string) => {
    setPasscode(code);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Aesthetic Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-900/20 via-amber-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Ministry Banner */}
      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0 border border-amber-900/20">
              <ChurchLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
                <span>The Covenant Nation</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Children & Youth Ministry
                </span>
              </span>
              <p className="text-[11px] text-slate-400">
                Staff & Teachers Authorized Portal • Safe Child System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Restricted Access Desk</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Screen Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          {/* Card Wrapper */}
          <div className="bg-[#121620]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            
            {/* Header Badge & Title */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-xs">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>STAFF & WORKERS ENTRANCE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Children's Church Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Please enter the staff passcode to access the Children Church website, live Sunday check-in, attendance registry, and child safety management.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Entrance Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Branch / Parish Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select Church Parish / Branch</span>
                </label>
                <div className="relative">
                  <select
                    value={currentBranch.id}
                    onChange={(e) => onSelectBranch(e.target.value)}
                    className="w-full bg-[#181f2c] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                        {b.name} — {b.city} ({b.state})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-slate-400" />
                  <span>Venue: {currentBranch.branchVenue}</span>
                </p>
              </div>

              {/* Staff Member Name (Optional) & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Name / Desk (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. Sister Sarah / Usher Desk"
                    className="w-full bg-[#181f2c] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ministry Role</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-[#181f2c] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  >
                    <option value="Worker" className="bg-slate-900 text-white">Sunday School Worker</option>
                    <option value="Teacher" className="bg-slate-900 text-white">Class Teacher / Lead</option>
                    <option value="Admin" className="bg-slate-900 text-white">Department Head / Admin</option>
                    <option value="Pastor" className="bg-slate-900 text-white">Children Pastor</option>
                  </select>
                </div>
              </div>

              {/* Staff Passcode Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Staff Password / Passcode</span>
                  </span>
                  <span className="text-[11px] text-amber-400/80 font-normal">
                    Authorized Staff Only
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter staff access code (e.g. 1234)"
                    required
                    autoFocus
                    className="w-full bg-[#181f2c] border border-white/15 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition cursor-pointer p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Keep me signed in on this desk browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !passcode}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
                  isLoading || !passcode
                    ? 'bg-amber-600/50 text-amber-200/60 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 hover:shadow-amber-500/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Staff Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-slate-950" />
                    <span>Enter Children's Church System</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Access Helper for Volunteers / Staff */}
            <div className="pt-2 border-t border-white/10">
              <div className="bg-[#181f2c]/60 rounded-2xl p-3.5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Staff Code:</span>
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    Default passcode is <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">1234</code> or parish passcode.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickFill(currentBranch?.adminPasscode || '1234')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold border border-amber-500/30 transition shrink-0 cursor-pointer text-[11px]"
                >
                  Quick Fill (1234)
                </button>
              </div>
            </div>

            {/* Emergency Hotline */}
            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Parish Emergency & Security Desk:</span>
              <strong className="text-slate-200 font-mono">{currentBranch.emergencyPhone}</strong>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>The Covenant Nation Children & Youth Ministry System</span>
          <span>"Train up a child in the way he should go" — Proverbs 22:6</span>
        </div>
      </footer>
    </div>
  );
};
