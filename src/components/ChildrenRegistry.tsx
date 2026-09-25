import React, { useState } from 'react';
import { Child, DepartmentConfig, ServiceConfig, ChurchSettings } from '../types';
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Filter,
  Phone,
  Home,
  AlertCircle,
  Sparkles,
  Calendar,
  Heart,
  X,
  UserCheck,
} from 'lucide-react';
import { getTodayDateString } from '../mockData';

interface ChildrenRegistryProps {
  childrenList: Child[];
  departments: DepartmentConfig[];
  services: ServiceConfig[];
  activeServiceId: string;
  onSaveChild: (child: Child) => void;
  onDeleteChild: (childId: string) => void;
  onCheckInChild: (child: Child) => void;
}

export const ChildrenRegistry: React.FC<ChildrenRegistryProps> = ({
  childrenList,
  departments,
  services,
  activeServiceId,
  onSaveChild,
  onDeleteChild,
  onCheckInChild,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<number>(5);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [departmentId, setDepartmentId] = useState<string>(departments[0]?.id || '');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [secondaryContactName, setSecondaryContactName] = useState('');
  const [secondaryContactPhone, setSecondaryContactPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [allergiesMedicalNotes, setAllergiesMedicalNotes] = useState('None');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isFirstTimer, setIsFirstTimer] = useState(false);

  const resetForm = () => {
    setEditingChild(null);
    setFormError(null);
    setFullName('');
    setDateOfBirth('');
    setAge(5);
    setGender('Male');
    setDepartmentId(departments[0]?.id || '');
    setParentName('');
    setParentPhone('');
    setSecondaryContactName('');
    setSecondaryContactPhone('');
    setEmail('');
    setEmergencyContact('');
    setHomeAddress('');
    setAllergiesMedicalNotes('None');
    setSpecialNotes('');
    setIsFirstTimer(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (child: Child) => {
    setEditingChild(child);
    setFormError(null);
    setFullName(child.fullName);
    setDateOfBirth(child.dateOfBirth || '');
    setAge(child.age);
    setGender(child.gender);
    setDepartmentId(child.departmentId);
    setParentName(child.parentName);
    setParentPhone(child.parentPhone);
    setSecondaryContactName(child.secondaryContactName || '');
    setSecondaryContactPhone(child.secondaryContactPhone || '');
    setEmail(child.email || '');
    setEmergencyContact(child.emergencyContact || '');
    setHomeAddress(child.homeAddress || '');
    setAllergiesMedicalNotes(child.allergiesMedicalNotes || 'None');
    setSpecialNotes(child.specialNotes || child.notes || '');
    setIsFirstTimer(!!child.isFirstTimer);
    setIsModalOpen(true);
  };

  // Auto-calculate age and recommend department when DOB changes
  const handleDOBChange = (dob: string) => {
    setDateOfBirth(dob);
    if (!dob) return;
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const calculatedAge = Math.max(0, currentYear - birthYear);
    setAge(calculatedAge);

    // Auto-match department by age
    const matchingDept = departments.find(
      (d) => calculatedAge >= d.minAge && calculatedAge <= d.maxAge
    );
    if (matchingDept) {
      setDepartmentId(matchingDept.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const normName = fullName.trim().toLowerCase();
    const normPhone = parentPhone.trim().replace(/\D/g, '');

    // Duplicate check: check if another child is already registered with matching name and parent phone/age
    const duplicate = childrenList.find((c) => {
      if (editingChild && c.id === editingChild.id) return false;
      const sameName = c.fullName.trim().toLowerCase() === normName;
      const samePhone = normPhone && c.parentPhone.replace(/\D/g, '') === normPhone;
      return sameName && (samePhone || c.age === Number(age));
    });

    if (duplicate) {
      const dept = departments.find((d) => d.id === duplicate.departmentId);
      setFormError(
        `Duplicate entry blocked: "${fullName.trim()}" is already registered in ${
          dept?.name || 'this parish'
        } (Parent: ${duplicate.parentName}, Phone: ${duplicate.parentPhone}). A child cannot be registered twice.`
      );
      return;
    }

    const colors = [
      'bg-blue-600',
      'bg-emerald-600',
      'bg-purple-600',
      'bg-amber-600',
      'bg-rose-600',
      'bg-indigo-600',
      'bg-teal-600',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const childToSave: Child = {
      id: editingChild ? editingChild.id : `child-${Date.now()}`,
      fullName: fullName.trim(),
      dateOfBirth,
      age: Number(age),
      gender,
      departmentId,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      secondaryContactName: secondaryContactName.trim(),
      secondaryContactPhone: secondaryContactPhone.trim(),
      email: email.trim(),
      emergencyContact: emergencyContact.trim(),
      homeAddress: homeAddress.trim(),
      allergiesMedicalNotes: allergiesMedicalNotes.trim() || 'None',
      specialNotes: specialNotes.trim(),
      notes: specialNotes.trim(),
      isFirstTimer,
      registeredDate: editingChild ? editingChild.registeredDate : getTodayDateString(),
      avatarColor: editingChild ? editingChild.avatarColor : randomColor,
    };

    onSaveChild(childToSave);
    setIsModalOpen(false);
    resetForm();
  };

  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch =
      child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.parentPhone.includes(searchTerm);

    const matchesDept = selectedDeptId === 'all' || child.departmentId === selectedDeptId;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Children's Church Directory</h2>
              <p className="text-xs text-slate-500">
                Registered children database, parent records, and medical alerts
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Child</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by child's name, parent name, or contact number..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
          />
        </div>

        {/* Department Filter Tabs */}
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

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChildren.map((child) => {
          const dept = departments.find((d) => d.id === child.departmentId);

          return (
            <div
              key={child.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 truncate max-w-[70%]">
                    {dept?.name || 'Class'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(child)}
                      className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                      title="Edit child"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${child.fullName}?`)) {
                          onDeleteChild(child.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete child"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-xs ${
                      child.avatarColor || 'bg-blue-600'
                    }`}
                  >
                    {child.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{child.fullName}</span>
                      {child.isFirstTimer && (
                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-md font-extrabold flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          1st
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Age: <strong>{child.age} yrs</strong> • {child.gender}
                    </p>
                  </div>
                </div>

                {/* Parent Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Parent:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                      {child.parentName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-mono text-slate-700 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {child.parentPhone}
                    </span>
                  </div>
                  {child.homeAddress && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Address:</span>
                      <span className="text-slate-700 truncate max-w-[170px]">
                        {child.homeAddress}
                      </span>
                    </div>
                  )}

                  {child.allergiesMedicalNotes && child.allergiesMedicalNotes !== 'None' && (
                    <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{child.allergiesMedicalNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onCheckInChild(child)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Quick Check-In</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Child Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{editingChild ? 'Edit Child Details' : 'Register New Child'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="block font-bold">Registration Blocked:</strong>
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Child's Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. David Kufre Udoh"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => handleDOBChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={18}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Church Department / Class *
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.ageRange})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Mr. & Mrs. Udoh"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parent Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="e.g. 08034567890"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secondary Contact / Pickup
                  </label>
                  <input
                    type="text"
                    value={secondaryContactName}
                    onChange={(e) => setSecondaryContactName(e.target.value)}
                    placeholder="e.g. Grandma / Driver"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secondary Phone
                  </label>
                  <input
                    type="tel"
                    value={secondaryContactPhone}
                    onChange={(e) => setSecondaryContactPhone(e.target.value)}
                    placeholder="e.g. 08123456789"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Allergies, Medical Notes or Special Needs
                </label>
                <input
                  type="text"
                  value={allergiesMedicalNotes}
                  onChange={(e) => setAllergiesMedicalNotes(e.target.value)}
                  placeholder="e.g. None, Peanut allergy, Asthma inhaler with teacher"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Home Address (Optional)
                </label>
                <input
                  type="text"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="e.g. 15 Shelter Afrique Estate, Uyo"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="firstTimerCheck"
                  checked={isFirstTimer}
                  onChange={(e) => setIsFirstTimer(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="firstTimerCheck" className="text-xs font-semibold text-slate-700">
                  Mark as First-Timer visiting The Covenant Nation Uyo
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition"
                >
                  {editingChild ? 'Update Child Record' : 'Save & Register Child'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
