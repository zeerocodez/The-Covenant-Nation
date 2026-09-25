import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, X, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  currentAdminPasscode: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentAdminPasscode,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Compare with current admin passcode or standard fallback '1234'
    const targetPasscode = currentAdminPasscode || '1234';
    if (passcode.trim() === targetPasscode.trim()) {
      onLoginSuccess();
      setPasscode('');
      setError('');
      onClose();
    } else {
      setError('Incorrect passcode. Please check the passcode and try again.');
    }
  };

  const handleUseDemoPasscode = () => {
    setPasscode(currentAdminPasscode || '1234');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-blue-300" />
          </div>
          <h2 className="text-xl font-bold">Admin Portal Access</h2>
          <p className="text-xs text-blue-200/80 mt-1">
            Access settings, rename children's church departments & manage services
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Admin Passcode / PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Helper */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-blue-900">
              <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Default Passcode: <strong>{currentAdminPasscode || '1234'}</strong></span>
            </div>
            <button
              type="button"
              onClick={handleUseDemoPasscode}
              className="text-xs bg-white text-blue-700 hover:bg-blue-100 font-semibold px-2.5 py-1 rounded-lg border border-blue-200 transition shadow-2xs"
            >
              Fill Code
            </button>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition shadow-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
