import React, { useState } from 'react';
import {
  ActiveTab,
  ServiceConfig,
  ChurchSettings,
  BranchTenant,
} from '../types';
import {
  Church,
  UserCheck,
  ShieldCheck,
  Users,
  ClipboardList,
  Sliders,
  Lock,
  Unlock,
  ChevronDown,
  Calendar,
  Clock,
  Menu,
  X,
  MapPin,
  Building2,
  Check,
} from 'lucide-react';

interface NavbarProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  services: ServiceConfig[];
  activeServiceId: string;
  onSelectService: (serviceId: string) => void;
  settings: ChurchSettings;
  branches: BranchTenant[];
  currentBranch: BranchTenant;
  onSelectBranch: (branchId: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  checkedInCount: number;
  staffInfo?: { staffName: string; role: string; loginTime: string };
  onStaffLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  services,
  activeServiceId,
  onSelectService,
  settings,
  branches,
  currentBranch,
  onSelectBranch,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onAdminLogout,
  checkedInCount,
  staffInfo,
  onStaffLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const activeService = services.find((s) => s.id === activeServiceId) || services[0];

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      onTabChange('admin');
    } else {
      onOpenAdminLogin();
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        {/* Top Banner with Branch Switcher, Church details and Service Switcher */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white px-3 py-2 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
            {/* Church Branding & Branch Selector */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
                  <Church className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h1 className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-white">
                      {currentBranch?.churchName || settings.churchName}
                    </h1>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/25 text-blue-200 border border-blue-400/30">
                      Children & Youth Church
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate max-w-[220px] sm:max-w-md">
                      {currentBranch?.branchVenue || settings.branchName}
                    </span>
                  </p>
                </div>
              </div>

              {/* Mobile quick branch indicator */}
              <button
                type="button"
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold"
              >
                <span>{currentBranch?.shortName || 'Branch'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Multi-Tenant Controls */}
            <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
              {/* Branch Parish Switcher (Desktop) */}
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-semibold transition cursor-pointer"
                  title="Switch Branch Parish"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Parish: <strong className="text-amber-300 font-bold">{currentBranch?.shortName || currentBranch?.name}</strong></span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70 ml-0.5" />
                </button>

                {branchDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setBranchDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-40 text-slate-800 animate-in fade-in">
                      <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase text-slate-500">
                          Select Church Branch
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">
                          {branches.length} Branches
                        </span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {branches.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              onSelectBranch(b.id);
                              setBranchDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-blue-50 transition cursor-pointer ${
                              b.id === currentBranch.id
                                ? 'bg-blue-50 font-bold text-blue-900 border-l-4 border-blue-600'
                                : 'text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-slate-900">{b.name}</div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                                {b.branchVenue}
                              </div>
                            </div>
                            {b.id === currentBranch.id && (
                              <Check className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="p-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setBranchDropdownOpen(false);
                            handleAdminClick();
                          }}
                          className="w-full text-center text-xs text-blue-700 hover:text-blue-900 font-bold py-1.5 rounded-lg hover:bg-slate-50 transition"
                        >
                          + Add or Manage Branches in Admin
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Service Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-medium transition cursor-pointer"
                  title="Change active church service"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Service:</span>
                  <strong className="text-amber-300 font-bold truncate max-w-[120px] sm:max-w-none">
                    {activeService?.name || 'Service'}
                  </strong>
                  <ChevronDown className="w-3 h-3 text-white/70" />
                </button>

                {serviceDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setServiceDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-40 text-slate-800 animate-in fade-in">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400">
                        Switch Service for {currentBranch.shortName}
                      </div>
                      {services
                        .filter((s) => s.isActive)
                        .map((srv) => (
                          <button
                            key={srv.id}
                            type="button"
                            onClick={() => {
                              onSelectService(srv.id);
                              setServiceDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition cursor-pointer ${
                              srv.id === activeServiceId
                                ? 'bg-blue-50 font-bold text-blue-800 border-l-4 border-blue-600'
                                : 'text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-semibold">{srv.name}</div>
                              <div className="text-[11px] text-slate-400">{srv.time}</div>
                            </div>
                            {srv.id === activeServiceId && (
                              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            )}
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>

              {/* Staff Member status badge & Lock */}
              {onStaffLogout && (
                <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-200 border border-amber-400/35 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline truncate max-w-[130px]">
                    {staffInfo?.staffName || 'Staff Member'}
                  </span>
                  <button
                    type="button"
                    onClick={onStaffLogout}
                    className="ml-1 text-[11px] text-amber-300 hover:text-white underline cursor-pointer flex items-center gap-0.5"
                    title="Lock Desk / Staff Log Out"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Lock</span>
                  </button>
                </div>
              )}

              {/* Admin status button */}
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium">
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Admin Mode</span>
                  <button
                    onClick={onAdminLogout}
                    className="ml-1 text-[11px] text-white hover:text-rose-300 font-bold underline cursor-pointer"
                    title="Log out of Admin"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-1.5 bg-blue-700/80 hover:bg-blue-600 text-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border border-blue-500/40"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-200" />
                  <span>Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 hidden md:flex items-center justify-between">
          <nav className="flex space-x-1 lg:space-x-2 py-2">
            <button
              type="button"
              onClick={() => onTabChange('website')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentTab === 'website'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-xs'
                  : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50 font-bold'
              }`}
            >
              <Church className="w-4 h-4 text-amber-700" />
              <span>Children Church Website</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('check-in')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentTab === 'check-in'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Check-In Desk</span>
              <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[11px] rounded-full font-bold">
                {checkedInCount} In
              </span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('check-out')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentTab === 'check-out'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Security Check-Out</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('children')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentTab === 'children'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Students Registry</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('reports')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentTab === 'reports'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <span>Attendance Reports</span>
            </button>

            <button
              type="button"
              onClick={handleAdminClick}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>Admin Portal</span>
              {isAdminLoggedIn ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                  Unlocked
                </span>
              ) : (
                <Lock className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Optimized for Mobile Touch) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          type="button"
          onClick={() => onTabChange('website')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] min-h-[44px] rounded-xl transition cursor-pointer relative ${
            currentTab === 'website'
              ? 'text-amber-800 font-bold bg-amber-50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Church className="w-5 h-5 text-amber-600" />
          <span className="text-[10px] mt-0.5 leading-tight">Website</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('check-in')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] min-h-[44px] rounded-xl transition cursor-pointer relative ${
            currentTab === 'check-in'
              ? 'text-blue-700 font-bold bg-blue-50/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <UserCheck className="w-5 h-5" />
            {checkedInCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {checkedInCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">Check-In</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('check-out')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[44px] rounded-xl transition cursor-pointer ${
            currentTab === 'check-out'
              ? 'text-amber-800 font-bold bg-amber-50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-tight">Check-Out</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('children')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[44px] rounded-xl transition cursor-pointer ${
            currentTab === 'children'
              ? 'text-indigo-700 font-bold bg-indigo-50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-tight">Students</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('reports')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[44px] rounded-xl transition cursor-pointer ${
            currentTab === 'reports'
              ? 'text-emerald-700 font-bold bg-emerald-50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-tight">Reports</span>
        </button>

        <button
          type="button"
          onClick={handleAdminClick}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[44px] rounded-xl transition cursor-pointer ${
            currentTab === 'admin'
              ? 'text-purple-700 font-bold bg-purple-50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Sliders className="w-5 h-5" />
            {isAdminLoggedIn ? (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
            ) : (
              <Lock className="w-2.5 h-2.5 text-slate-400 absolute -top-1 -right-1" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">Admin</span>
        </button>
      </nav>
    </>
  );
};
