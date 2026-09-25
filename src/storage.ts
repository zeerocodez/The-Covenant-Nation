import {
  BranchTenant,
  ServiceConfig,
  DepartmentConfig,
  Child,
  AttendanceRecord,
  ChurchSettings,
} from './types';
import {
  DEFAULT_BRANCHES,
  DEFAULT_SERVICES,
  DEFAULT_DEPARTMENTS,
  SEED_CHILDREN,
  SEED_ATTENDANCE,
} from './mockData';

const KEYS = {
  BRANCHES: 'tcn_multi_tenant_branches_v3',
  ACTIVE_BRANCH_ID: 'tcn_active_branch_id_v3',
  SERVICES_PREFIX: 'tcn_services_b_',
  DEPARTMENTS_PREFIX: 'tcn_departments_b_',
  CHILDREN_PREFIX: 'tcn_children_b_',
  ATTENDANCE_PREFIX: 'tcn_attendance_b_',
  ACTIVE_SERVICE_PREFIX: 'tcn_active_service_b_',
  ADMIN_AUTH: 'tcn_admin_auth_session_v3',
};

function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading key "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key "${key}" to localStorage:`, err);
  }
}

export const StorageService = {
  // ==================== BRANCH TENANTS ====================
  getBranches(): BranchTenant[] {
    const branches = safeGetItem<BranchTenant[]>(KEYS.BRANCHES, DEFAULT_BRANCHES);
    return branches && branches.length > 0 ? branches : DEFAULT_BRANCHES;
  },

  saveBranches(branches: BranchTenant[]): void {
    safeSetItem(KEYS.BRANCHES, branches);
  },

  getActiveBranchId(): string {
    const stored = localStorage.getItem(KEYS.ACTIVE_BRANCH_ID);
    const branches = this.getBranches();
    if (stored && branches.some((b) => b.id === stored)) {
      return stored;
    }
    const defaultBranch = branches[0] || DEFAULT_BRANCHES[0];
    return defaultBranch.id;
  },

  setActiveBranchId(branchId: string): void {
    localStorage.setItem(KEYS.ACTIVE_BRANCH_ID, branchId);
  },

  getActiveBranch(): BranchTenant {
    const id = this.getActiveBranchId();
    const branches = this.getBranches();
    return branches.find((b) => b.id === id) || branches[0] || DEFAULT_BRANCHES[0];
  },

  addBranch(branch: BranchTenant): void {
    const branches = this.getBranches();
    const updated = [...branches, branch];
    this.saveBranches(updated);
  },

  updateBranch(branch: BranchTenant): void {
    const branches = this.getBranches();
    const updated = branches.map((b) => (b.id === branch.id ? branch : b));
    this.saveBranches(updated);
  },

  // ==================== SERVICES (PER TENANT) ====================
  getServices(branchId?: string): ServiceConfig[] {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.SERVICES_PREFIX}${bId}`;
    return safeGetItem<ServiceConfig[]>(key, DEFAULT_SERVICES);
  },

  saveServices(services: ServiceConfig[], branchId?: string): void {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.SERVICES_PREFIX}${bId}`;
    safeSetItem(key, services);
  },

  // ==================== DEPARTMENTS / CLASSES (PER TENANT) ====================
  getDepartments(branchId?: string): DepartmentConfig[] {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.DEPARTMENTS_PREFIX}${bId}`;
    return safeGetItem<DepartmentConfig[]>(key, DEFAULT_DEPARTMENTS);
  },

  saveDepartments(departments: DepartmentConfig[], branchId?: string): void {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.DEPARTMENTS_PREFIX}${bId}`;
    safeSetItem(key, departments);
  },

  // ==================== STUDENTS / CHILDREN (PER TENANT) ====================
  getChildren(branchId?: string): Child[] {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.CHILDREN_PREFIX}${bId}`;
    return safeGetItem<Child[]>(key, SEED_CHILDREN);
  },

  saveChildren(children: Child[], branchId?: string): void {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.CHILDREN_PREFIX}${bId}`;
    safeSetItem(key, children);
  },

  // ==================== ATTENDANCE RECORDS (PER TENANT) ====================
  getAttendance(branchId?: string): AttendanceRecord[] {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.ATTENDANCE_PREFIX}${bId}`;
    return safeGetItem<AttendanceRecord[]>(key, SEED_ATTENDANCE);
  },

  saveAttendance(records: AttendanceRecord[], branchId?: string): void {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.ATTENDANCE_PREFIX}${bId}`;
    safeSetItem(key, records);
  },

  // ==================== ACTIVE SERVICE ID (PER TENANT) ====================
  getActiveServiceId(branchId?: string): string {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.ACTIVE_SERVICE_PREFIX}${bId}`;
    const services = this.getServices(bId);
    const stored = localStorage.getItem(key);
    if (stored && services.some((s) => s.id === stored && s.isActive)) {
      return stored;
    }
    const firstActive = services.find((s) => s.isActive) || services[0];
    return firstActive ? firstActive.id : 'first-service';
  },

  setActiveServiceId(id: string, branchId?: string): void {
    const bId = branchId || this.getActiveBranchId();
    const key = `${KEYS.ACTIVE_SERVICE_PREFIX}${bId}`;
    localStorage.setItem(key, id);
  },

  // ==================== CHURCH SETTINGS ADAPTER ====================
  getSettings(branchId?: string): ChurchSettings {
    const branch = this.getActiveBranch();
    return {
      churchName: branch.churchName,
      branchName: branch.branchVenue,
      emergencyPhone: branch.emergencyPhone,
      pastorInCharge: branch.pastorInCharge,
      childrenPastor: branch.childrenPastor,
      adminPasscode: branch.adminPasscode || '1234',
      requireSecurityCodeOnCheckout: true,
      autoSelectDepartmentByAge: true,
      activeBranchId: branch.id,
    };
  },

  saveSettings(settings: ChurchSettings, branchId?: string): void {
    const bId = branchId || this.getActiveBranchId();
    const branch = this.getBranches().find((b) => b.id === bId);
    if (branch) {
      const updatedBranch: BranchTenant = {
        ...branch,
        churchName: settings.churchName,
        branchVenue: settings.branchName,
        emergencyPhone: settings.emergencyPhone,
        pastorInCharge: settings.pastorInCharge,
        childrenPastor: settings.childrenPastor,
        adminPasscode: settings.adminPasscode,
      };
      this.updateBranch(updatedBranch);
    }
  },

  // ==================== ADMIN AUTH ====================
  isAdminLoggedIn(): boolean {
    return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminLoggedIn(status: boolean): void {
    if (status) {
      localStorage.setItem(KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(KEYS.ADMIN_AUTH);
    }
  },

  // Reset current branch data
  resetBranchData(branchId?: string): void {
    const bId = branchId || this.getActiveBranchId();
    localStorage.removeItem(`${KEYS.SERVICES_PREFIX}${bId}`);
    localStorage.removeItem(`${KEYS.DEPARTMENTS_PREFIX}${bId}`);
    localStorage.removeItem(`${KEYS.CHILDREN_PREFIX}${bId}`);
    localStorage.removeItem(`${KEYS.ATTENDANCE_PREFIX}${bId}`);
    localStorage.removeItem(`${KEYS.ACTIVE_SERVICE_PREFIX}${bId}`);
  },

  // Factory reset all
  resetAllData(): void {
    localStorage.clear();
  },

  generateSecurityCode(): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `TCN-${randomDigits}`;
  },
};
