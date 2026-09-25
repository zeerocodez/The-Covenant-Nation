import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Building2,
  Check,
} from 'lucide-react';
import { ChurchLogo } from './ChurchLogo';
import { BranchTenant } from '../types';

interface ChurchHeroProps {
  currentBranch: BranchTenant;
  branches: BranchTenant[];
  onSelectBranch: (branchId: string) => void;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export const ChurchHero: React.FC<ChurchHeroProps> = ({
  currentBranch,
  branches,
  onSelectBranch,
  selectedDate,
  onDateChange,
}) => {
  const todayFormatted = 'Today (Fri, Sep 25, 2026)';
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [activeDateDisplay, setActiveDateDisplay] = useState(todayFormatted);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const dateOptions = [
    'Today (Fri, Sep 25, 2026)',
    'Sunday, Sep 27, 2026 (1st Service)',
    'Sunday, Sep 27, 2026 (2nd Service)',
    'Wednesday Mid-Week Service',
    'Special Children & Youth Camp',
  ];

  // Extract base church name and city accent
  const churchFullName = currentBranch?.churchName || 'The Covenant Nation Uyo';
  const branchShortName = currentBranch?.shortName || currentBranch?.city || 'Uyo';

  // Highlight the branch city/location in amber
  let titlePrefix = 'The Covenant Nation';
  if (churchFullName.includes(branchShortName)) {
    titlePrefix = churchFullName.replace(branchShortName, '').trim();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-4xl border border-[#382b20] bg-gradient-to-br from-[#121110] via-[#1c1815] to-[#25170f] text-white p-4.5 sm:p-7 lg:p-9 shadow-2xl">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4 sm:space-y-5">
        {/* Top Pill Badge with Interactive Multi-Branch Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Branch Switcher Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#251e18]/95 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-xs hover:border-amber-400 hover:bg-[#2d221b] transition cursor-pointer"
              title="Switch Church Branch / Parish"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{currentBranch.churchName}</span>
              <span className="text-amber-500/60">•</span>
              <span className="hidden sm:inline">Children & Youth Church</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
            </button>

            {branchDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setBranchDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-[#1b1714] border border-[#443528] rounded-2xl shadow-2xl py-2 z-40 text-xs text-slate-200">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border-b border-[#2e241c] flex items-center justify-between">
                    <span>Switch Branch Parish (Multi-Tenant)</span>
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#2a2018]">
                    {branches.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          onSelectBranch(b.id);
                          setBranchDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 hover:bg-amber-500/15 transition cursor-pointer flex items-center justify-between ${
                          currentBranch.id === b.id
                            ? 'text-amber-300 font-bold bg-amber-500/10'
                            : 'text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white text-xs">{b.name}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                            {b.city}, {b.state}
                          </div>
                        </div>
                        {currentBranch.id === b.id && (
                          <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Parish Active
          </span>

          {/* Mobile / Screen view collapse toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/15 transition cursor-pointer"
            title={isCollapsed ? 'Expand church hero banner' : 'Collapse hero for compact view'}
          >
            <span className="hidden sm:inline">{isCollapsed ? 'Full Banner' : 'Compact View'}</span>
            <span className="sm:hidden">{isCollapsed ? 'Expand' : 'Compact'}</span>
            {isCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-300" />
            )}
          </button>
        </div>

        {isCollapsed ? (
          /* Compact Bar for Mobile & High Density View */
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md flex items-center justify-center shrink-0 border border-amber-900/20">
                <ChurchLogo className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  {titlePrefix} <span className="text-amber-400">{branchShortName}</span>
                </h2>
                <p className="text-[11px] text-slate-300 flex items-center gap-1 truncate max-w-xs sm:max-w-md">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{currentBranch.branchVenue}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-white/20 transition cursor-pointer"
              >
                <span>Expand Details</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Church Crest & Title Row */}
            <div className="flex items-center gap-3.5 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white p-1.5 shadow-lg flex items-center justify-center shrink-0 border border-amber-900/20">
                <ChurchLogo className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {titlePrefix} <span className="text-amber-400 font-extrabold">{branchShortName}</span>
                </h1>
                <p className="text-[11px] sm:text-xs mt-1 leading-snug">
                  <span className="text-amber-400 font-semibold">Senior Pastor: </span>
                  <strong className="text-white font-bold">{currentBranch.pastorInCharge || 'Pastor Poju Oyemade'}</strong>{' '}
                  <span className="text-amber-400/90 font-medium">
                    (Founder and Senior Pastor of The Covenant Nation)
                  </span>
                </p>
              </div>
            </div>

            {/* Scripture Blockquote */}
            <div className="border-l-2 border-amber-500 pl-3.5 sm:pl-4 py-0.5 text-slate-200 italic text-xs sm:text-sm md:text-base leading-relaxed">
              "Train up a child in the way he should go, and when he is old he will not depart from it." —{' '}
              <span className="not-italic font-semibold text-amber-300">Proverbs 22:6</span>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Welcome to the official attendance and child safety portal for{' '}
              <strong className="text-white font-semibold">{currentBranch.churchName}</strong>. Fast
              registration, live Sunday check-in, secure parent pickup slip verification, and multi-class management.
            </p>

            {/* Bottom Action Controls: Service Date */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Service Date Selector Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                  className="bg-[#181614] border border-[#3b322a] hover:border-amber-500/50 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center gap-2 text-xs text-slate-300 font-medium transition cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-400 hidden sm:inline">Service Date:</span>
                  <span className="font-bold text-white text-xs">{activeDateDisplay}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {dateDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setDateDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 w-72 bg-[#1b1714] border border-[#443528] rounded-xl shadow-2xl py-1.5 z-40 text-xs text-slate-200">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 border-b border-[#2e241c]">
                        Select Church Service Schedule
                      </div>
                      {dateOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setActiveDateDisplay(opt);
                            setDateDropdownOpen(false);
                            if (onDateChange) onDateChange(opt);
                          }}
                          className={`w-full text-left px-3.5 py-2 hover:bg-amber-500/15 transition cursor-pointer flex items-center justify-between ${
                            activeDateDisplay === opt ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {activeDateDisplay === opt && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
