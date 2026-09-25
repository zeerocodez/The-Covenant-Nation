import React, { useState, useRef } from 'react';
import { Child, DepartmentConfig } from '../types';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Users,
  Sparkles,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { getTodayDateString, RAW_SAMPLE_CSV_TEXT } from '../mockData';

export interface ParsedItem {
  child: Child;
  isDuplicate: boolean;
  duplicateReason?: string;
}

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: DepartmentConfig[];
  activeBranchId?: string;
  existingChildren?: Child[];
  onImportChildren: (importedChildren: Child[], newDeptsToCreate?: DepartmentConfig[]) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  departments,
  activeBranchId,
  existingChildren = [],
  onImportChildren,
}) => {
  const [csvText, setCsvText] = useState('');
  const [targetClassMode, setTargetClassMode] = useState<string>('auto'); // 'auto' or specific deptId
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [newClassesFound, setNewClassesFound] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validNewChildren = parsedItems.filter((p) => !p.isDuplicate).map((p) => p.child);
  const duplicateChildren = parsedItems.filter((p) => p.isDuplicate);

  const handleDownloadSample = () => {
    const blob = new Blob([RAW_SAMPLE_CSV_TEXT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'TCN_Students_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCsvContent = (content: string, overrideDeptId = targetClassMode) => {
    setParseError(null);
    setSuccessCount(null);
    try {
      const lines = content
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length <= 1) {
        setParseError('The CSV file appears empty or only has the header row.');
        setParsedItems([]);
        return;
      }

      // Simple CSV line parser respecting quotes
      const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result.map((r) => r.replace(/^"|"$/g, ''));
      };

      const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
      const nameIdx = headers.findIndex((h) => (h.includes('name') || h.includes('student')) && !h.includes('parent'));
      const ageIdx = headers.findIndex((h) => h.includes('age'));
      const classIdx = headers.findIndex((h) => h.includes('class') || h.includes('dept') || h.includes('department'));
      const genderIdx = headers.findIndex((h) => h.includes('gender') || h.includes('sex'));
      const parentNameIdx = headers.findIndex((h) => h.includes('parent') && !h.includes('phone'));
      const phoneIdx = headers.findIndex((h) => (h.includes('phone') || h.includes('mobile')) && !h.includes('alt'));
      const altPhoneIdx = headers.findIndex((h) => h.includes('alt') || h.includes('secondary'));
      const emailIdx = headers.findIndex((h) => h.includes('email'));
      const addressIdx = headers.findIndex((h) => h.includes('address') || h.includes('residence'));
      const emergencyIdx = headers.findIndex((h) => h.includes('emergency'));
      const allergyIdx = headers.findIndex((h) => h.includes('allerg') || h.includes('medical'));
      const specialNotesIdx = headers.findIndex((h) => h.includes('special') || h.includes('note'));

      const colors = [
        'bg-blue-600',
        'bg-emerald-600',
        'bg-purple-600',
        'bg-amber-600',
        'bg-rose-600',
        'bg-indigo-600',
        'bg-teal-600',
      ];

      // Prepare existing registry signatures for duplicate detection
      const seenExisting = new Set<string>();
      existingChildren.forEach((c) => {
        const normName = c.fullName.trim().toLowerCase();
        const normPhone = c.parentPhone.replace(/\D/g, '');
        if (normPhone) seenExisting.add(`${normName}||phone:${normPhone}`);
        seenExisting.add(`${normName}||age:${c.age}`);
      });

      const batchSeen = new Set<string>();
      const parsedList: ParsedItem[] = [];
      const discoveredNewClasses = new Set<string>();

      for (let i = 1; i < lines.length; i++) {
        const parts = parseLine(lines[i]);
        if (parts.length < 2) continue;

        const fullName = (nameIdx >= 0 ? parts[nameIdx] : parts[0]) || `Student ${i}`;
        const rawAge = (ageIdx >= 0 ? parts[ageIdx] : parts[1]) || '5';
        const parsedAge = parseInt(rawAge, 10) || 5;
        const rawGender = (genderIdx >= 0 ? parts[genderIdx] : parts[3]) || 'Male';
        const isFemale =
          rawGender.toLowerCase().startsWith('f') ||
          rawGender.toLowerCase().startsWith('g') ||
          rawGender.toLowerCase() === 'girl';
        const gender: 'Male' | 'Female' = isFemale ? 'Female' : 'Male';

        const rawClass = (classIdx >= 0 ? parts[classIdx] : '') || '';

        // Determine department
        let matchedDeptId = '';
        if (overrideDeptId !== 'auto') {
          matchedDeptId = overrideDeptId;
        } else if (rawClass) {
          const match = departments.find(
            (d) =>
              d.name.toLowerCase().includes(rawClass.toLowerCase()) ||
              rawClass.toLowerCase().includes(d.name.toLowerCase())
          );
          if (match) {
            matchedDeptId = match.id;
          } else {
            // New class found! Mark it to be auto-created
            discoveredNewClasses.add(rawClass);
            matchedDeptId = `dept-auto-${rawClass.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
          }
        }

        if (!matchedDeptId) {
          const ageMatch = departments.find((d) => parsedAge >= d.minAge && parsedAge <= d.maxAge);
          matchedDeptId = ageMatch ? ageMatch.id : departments[0]?.id || 'dept-default';
        }

        const parentName = (parentNameIdx >= 0 ? parts[parentNameIdx] : parts[4]) || 'Parent / Guardian';
        const phone = (phoneIdx >= 0 ? parts[phoneIdx] : parts[5]) || '08000000000';
        const altPhone = (altPhoneIdx >= 0 ? parts[altPhoneIdx] : parts[6]) || '';
        const email = (emailIdx >= 0 ? parts[emailIdx] : parts[7]) || '';
        const address = (addressIdx >= 0 ? parts[addressIdx] : parts[8]) || '';
        const emergencyContact = (emergencyIdx >= 0 ? parts[emergencyIdx] : parts[9]) || '';
        const allergies = (allergyIdx >= 0 ? parts[allergyIdx] : parts[10]) || 'None';
        const specialNotes = (specialNotesIdx >= 0 ? parts[specialNotesIdx] : parts[11]) || '';

        // Check for duplicates
        const normName = fullName.trim().toLowerCase();
        const normPhone = phone.replace(/\D/g, '');
        const sigPhone = normPhone ? `${normName}||phone:${normPhone}` : null;
        const sigAge = `${normName}||age:${parsedAge}`;

        let isDuplicate = false;
        let duplicateReason = '';

        if ((sigPhone && seenExisting.has(sigPhone)) || seenExisting.has(sigAge)) {
          isDuplicate = true;
          duplicateReason = 'Already registered in church directory';
        } else if ((sigPhone && batchSeen.has(sigPhone)) || batchSeen.has(sigAge)) {
          isDuplicate = true;
          duplicateReason = 'Duplicate row within this CSV file';
        }

        if (!isDuplicate) {
          if (sigPhone) batchSeen.add(sigPhone);
          batchSeen.add(sigAge);
        }

        const childRecord: Child = {
          id: `child-csv-${Date.now()}-${i}`,
          branchId: activeBranchId,
          fullName,
          age: parsedAge,
          gender,
          departmentId: matchedDeptId,
          parentName,
          parentPhone: phone,
          secondaryContactPhone: altPhone,
          email,
          homeAddress: address,
          emergencyContact,
          allergiesMedicalNotes: allergies || 'None',
          specialNotes,
          notes: specialNotes,
          isFirstTimer: false,
          dateOfBirth: '',
          registeredDate: getTodayDateString(),
          avatarColor: colors[i % colors.length],
        };

        parsedList.push({
          child: childRecord,
          isDuplicate,
          duplicateReason,
        });
      }

      setParsedItems(parsedList);
      setNewClassesFound(Array.from(discoveredNewClasses));

      if (parsedList.length === 0) {
        setParseError('Could not parse any valid student records from the provided CSV file.');
      }
    } catch (err: any) {
      setParseError(`CSV Parsing error: ${err.message || 'Unknown format'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      parseCsvContent(text, targetClassMode);
    };
    reader.readAsText(file);
  };

  const handleLoadUserSample = () => {
    setCsvText(RAW_SAMPLE_CSV_TEXT);
    parseCsvContent(RAW_SAMPLE_CSV_TEXT, targetClassMode);
  };

  const handleTargetClassChange = (newMode: string) => {
    setTargetClassMode(newMode);
    if (csvText) {
      parseCsvContent(csvText, newMode);
    }
  };

  const handleConfirmImport = () => {
    if (validNewChildren.length === 0) return;

    // Check if any new departments need to be created
    const newDeptsToCreate: DepartmentConfig[] = [];
    newClassesFound.forEach((className) => {
      const generatedId = `dept-auto-${className.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const alreadyExists = departments.some((d) => d.id === generatedId || d.name.toLowerCase() === className.toLowerCase());
      if (!alreadyExists) {
        newDeptsToCreate.push({
          id: generatedId,
          branchId: activeBranchId,
          name: className,
          ageRange: 'All Ages',
          minAge: 0,
          maxAge: 17,
          location: 'Children Church Wing',
          color: 'indigo',
          teacherInCharge: 'Class Teacher',
          notes: 'Auto-created from student CSV import',
        });
      }
    });

    onImportChildren(validNewChildren, newDeptsToCreate.length > 0 ? newDeptsToCreate : undefined);
    setSuccessCount(validNewChildren.length);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-stone-900 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Upload Students CSV (Duplicate Protected)</h3>
              <p className="text-xs text-amber-200/80">
                Bulk register students with automatic duplicate detection & multi-class enrolment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {successCount !== null ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-slate-800">
                Successfully Imported {successCount} New Students!
              </h4>
              <p className="text-xs text-slate-500">
                All records verified with zero duplicates. Class rosters are updated.
              </p>
            </div>
          ) : (
            <>
              {/* Target Class Selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Target Class / Department Assignment:</span>
                </label>
                <select
                  value={targetClassMode}
                  onChange={(e) => handleTargetClassChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <option value="auto">⚡ Auto-assign from CSV "Class" column (Auto-creates missing classes)</option>
                  <optgroup label="Or Force Assign All Rows To Specific Class:">
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.ageRange})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-[11px] text-slate-500">
                  {targetClassMode === 'auto'
                    ? 'The parser reads each student\'s "Class" column (e.g. Kingdom Kids, Little Angels, Stars & Sunbeams).'
                    : 'All students in the uploaded file will be assigned directly to the selected class.'}
                </p>
              </div>

              {/* Sample file buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <div className="text-xs text-amber-950 font-medium">
                  <span>Download official template or load the 8 pre-formatted students.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-xl border border-amber-300 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadUserSample}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load 8 Sample Students</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/70 hover:bg-amber-50/20 rounded-2xl p-6 text-center cursor-pointer transition space-y-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-amber-600 mx-auto" />
                <div className="text-xs font-semibold text-slate-800">
                  Click or drag and drop your <strong className="text-amber-800">.CSV file</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  Supported columns: Full Name, Age, Class, Gender, Parent Name, Phone, Alt Phone, Email, Address, Emergency Contact, Allergies, Special Notes
                </div>
              </div>

              {parseError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Notification of newly discovered classes to be created */}
              {newClassesFound.length > 0 && targetClassMode === 'auto' && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">New Classes Detected in CSV: </span>
                    <span>
                      {newClassesFound.join(', ')}. These will be automatically registered in your Children's Church directory!
                    </span>
                  </div>
                </div>
              )}

              {/* Preview List & Duplicate Warning */}
              {parsedItems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span>
                        Verified Records: <strong className="text-emerald-700">{validNewChildren.length} New</strong>
                        {duplicateChildren.length > 0 && (
                          <span className="text-rose-700 font-bold ml-1.5">
                            ({duplicateChildren.length} Duplicate{duplicateChildren.length > 1 ? 's' : ''} Skipped)
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Total rows scanned: {parsedItems.length}
                    </span>
                  </div>

                  {duplicateChildren.length > 0 && (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Deduplication Guard Active:</strong> {duplicateChildren.length} student record{duplicateChildren.length > 1 ? 's' : ''} already exist in the parish directory or are duplicate rows in this CSV file. They are marked below and will <strong>not</strong> be imported.
                      </span>
                    </div>
                  )}

                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 text-xs">
                    {parsedItems.map((item, idx) => {
                      const c = item.child;
                      const dept = departments.find((d) => d.id === c.departmentId);
                      const classNameDisplay = dept ? dept.name : c.departmentId.replace('dept-auto-', '');

                      return (
                        <div
                          key={idx}
                          className={`p-3 flex items-start justify-between gap-3 transition ${
                            item.isDuplicate ? 'bg-slate-50/80 opacity-75' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{c.fullName}</span>
                              <span className="text-[11px] font-normal text-slate-500">
                                ({c.age} yrs • {c.gender})
                              </span>
                              {item.isDuplicate ? (
                                <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center gap-0.5">
                                  <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                                  Duplicate Skipped
                                </span>
                              ) : (
                                <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  New Student
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              Parent: <strong className="text-slate-800">{c.parentName}</strong> ({c.parentPhone})
                              {c.secondaryContactPhone && <span> • Alt: {c.secondaryContactPhone}</span>}
                            </div>
                            {item.isDuplicate && (
                              <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
                                Reason: {item.duplicateReason}
                              </div>
                            )}
                            {c.allergiesMedicalNotes && c.allergiesMedicalNotes !== 'None' && (
                              <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                                Allergy: {c.allergiesMedicalNotes}
                              </div>
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                              item.isDuplicate
                                ? 'bg-slate-200 text-slate-600'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {classNameDisplay}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {successCount === null && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={validNewChildren.length === 0}
              onClick={handleConfirmImport}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                validNewChildren.length > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {validNewChildren.length > 0
                  ? `Import ${validNewChildren.length} New Students`
                  : 'No New Students to Import'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
