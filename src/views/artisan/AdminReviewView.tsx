import React, { useState, useEffect, useMemo } from 'react';
import { ArtisanApplication, ArtisanDocument, ApplicationStatus } from '../../data/artisanWorkflowData';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  ExternalLink, 
  Eye, 
  Check, 
  X, 
  MessageSquare, 
  Building, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Car, 
  Calendar,
  Lock,
  ChevronRight,
  Info,
  ArrowLeft,
  Home,
  LogOut,
  Sliders,
  Sparkles,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ShieldAlert,
  PauseCircle,
  Trash2,
  RotateCcw,
  BarChart3,
  Megaphone,
  Flag,
  History,
  Award,
  CheckCircle2,
  ChevronDown,
  Edit,
  Shield,
  Layers,
  Star,
  Scissors,
  ShoppingBag,
  Menu,
  Bell,
  Settings,
  Users,
  CalendarCheck,
  Tag,
  Radio
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { 
  AdminStudio, 
  StudioReport, 
  AuditLogEntry, 
  StudioAppeal, 
  StudioPromotion,
  ReportStatus, 
  ApprovalStatus, 
  OperationalStatus 
} from '../../types/admin';
import { StudioDetailsDrawer } from '../../components/admin/StudioDetailsDrawer';
import { EditStudioAdminModal } from '../../components/admin/EditStudioAdminModal';
import { EnforcementActionModal, EnforcementType } from '../../components/admin/EnforcementActionModal';
import { ReportDecisionModal } from '../../components/admin/ReportDecisionModal';
import { LandingPagePreviewModal } from '../../components/admin/LandingPagePreviewModal';
import { categoryService } from '../../services/categoryService';
import { StenzaCategory, mapLegacyCategoryToSlug } from '../../data/categoryData';
import { CURATED_PRODUCTS, INITIAL_BOOKINGS, Booking } from '../../data/beautyData';
import { SOUTH_AFRICAN_PROVINCES, getTownsForProvince, formatStudioDisplayLocation } from '../../data/saLocationsData';

interface AdminReviewViewProps {
  applications: ArtisanApplication[];
  onUpdateApplicationStatus: (
    appId: string, 
    newStatus: ApplicationStatus, 
    reason: string,
    reviewedBy: string
  ) => void;
  onNavigate: (view: string) => void;
  currentStudioId?: string;
  onSelectArtisanPreset?: (appId: string, studioId: string) => void;
  onLogoutAdmin?: () => void;
}

export type AdminNavTab = 
  | 'dashboard'
  | 'studios'
  | 'approvals'
  | 'users_artisans'
  | 'bookings'
  | 'reports'
  | 'promotions'
  | 'categories'
  | 'updates_offers'
  | 'notifications'
  | 'audit_logs'
  | 'settings';

export const AdminReviewView: React.FC<AdminReviewViewProps> = ({
  applications,
  onUpdateApplicationStatus,
  onNavigate,
  currentStudioId,
  onSelectArtisanPreset,
  onLogoutAdmin,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminNavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isDevMode, setIsDevMode] = useState<boolean>(true);

  // Check admin auth configuration
  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/auth-config')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && typeof data.devMode === 'boolean') {
          setIsDevMode(data.devMode);
        }
      })
      .catch(() => {
        if (isMounted) setIsDevMode(import.meta.env.DEV);
      });
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Data state from adminService
  const [studios, setStudios] = useState<AdminStudio[]>([]);
  const [reports, setReports] = useState<StudioReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [appeals, setAppeals] = useState<StudioAppeal[]>([]);
  const [promotionsList, setPromotionsList] = useState<StudioPromotion[]>([]);
  const [categoriesList, setCategoriesList] = useState<StenzaCategory[]>(categoryService.getAllCategories());
  const [bookingsList, setBookingsList] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Modals & Drawers State
  const [drawerStudio, setDrawerStudio] = useState<AdminStudio | null>(null);
  const [editStudio, setEditStudio] = useState<AdminStudio | null>(null);
  const [enforceStudio, setEnforceStudio] = useState<AdminStudio | null>(null);
  const [enforceType, setEnforceType] = useState<EnforcementType>('warn');
  const [selectedReport, setSelectedReport] = useState<StudioReport | null>(null);
  const [previewLandingOpen, setPreviewLandingOpen] = useState<boolean>(false);

  // Studio Management Table Filters & Search
  const [studioSearch, setStudioSearch] = useState<string>('');
  const [studioCategoryFilter, setStudioCategoryFilter] = useState<string>('all');
  const [studioApprovalFilter, setStudioApprovalFilter] = useState<string>('all');
  const [studioOperationalFilter, setStudioOperationalFilter] = useState<string>('all');
  const [studioProvinceFilter, setStudioProvinceFilter] = useState<string>('all');
  const [studioTownFilter, setStudioTownFilter] = useState<string>('all');
  const [studioSortBy, setStudioSortBy] = useState<'name' | 'date' | 'rating' | 'bookings' | 'reports'>('date');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Reports Filter
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('all');
  const [reportSearch, setReportSearch] = useState<string>('');
  const [reportsSubView, setReportsSubView] = useState<'reports' | 'appeals'>('reports');

  // Audit Logs Filter
  const [auditActionFilter, setAuditActionFilter] = useState<string>('all');

  // Accreditation / Approvals Review State
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [accreditationFilterStatus, setAccreditationFilterStatus] = useState<string>('all');
  const [accreditationSearch, setAccreditationSearch] = useState<string>('');
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | 'changes' | null>(null);
  const [decisionReason, setDecisionReason] = useState<string>('');
  const [modalError, setModalError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<ArtisanDocument | null>(null);
  const [reviewingApp, setReviewingApp] = useState<ArtisanApplication | null>(null);

  // Users & Artisans Filter
  const [userSearch, setUserSearch] = useState<string>('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Bookings Filter
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  // Promotions State
  const [promoSearch, setPromoSearch] = useState<string>('');
  const [promoStatusFilter, setPromoStatusFilter] = useState<string>('all');

  // Category Toast Notification
  const [categoryToast, setCategoryToast] = useState<string | null>(null);

  // Refresh data from adminService
  const refreshData = () => {
    setStudios(adminService.getStudios(true));
    setReports(adminService.getReports());
    setAuditLogs(adminService.getAuditLogs());
    setAppeals(adminService.getAppeals());
    setPromotionsList(adminService.getPromotions(true));
    setCategoriesList(categoryService.getAllCategories());
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0].id);
    }
  }, [applications, selectedAppId]);

  // Analytics Metrics
  const analytics = useMemo(() => {
    return adminService.getDashboardAnalytics();
  }, [studios, reports, appeals]);

  const pendingApps = useMemo(() => {
    return applications.filter((a) => a.status === 'pending');
  }, [applications]);

  const pendingActionsCount = useMemo(() => {
    const openReps = reports.filter((r) => r.status === 'OPEN' || r.status === 'UNDER_REVIEW').length;
    const pendApps = applications.filter((a) => a.status === 'pending').length;
    const pendAppeals = appeals.filter((a) => a.status === 'PENDING').length;
    return openReps + pendApps + pendAppeals;
  }, [reports, applications, appeals]);

  // Available Towns based on selected province filter
  const availableTownsForFilter = useMemo(() => {
    if (studioProvinceFilter !== 'all') {
      return getTownsForProvince(studioProvinceFilter);
    }
    const set = new Set<string>();
    studios.forEach((s) => {
      if (s.city) set.add(s.city);
    });
    return Array.from(set).sort();
  }, [studioProvinceFilter, studios]);

  // Studios Filter & Sorting
  const filteredStudios = useMemo(() => {
    return studios.filter((s) => {
      const q = studioSearch.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        s.businessName.toLowerCase().includes(q) ||
        s.founderName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.applicationId.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.suburb.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);

      const matchesCategory = 
        studioCategoryFilter === 'all' || 
        s.category === studioCategoryFilter || 
        mapLegacyCategoryToSlug(s.category) === studioCategoryFilter;

      const matchesApproval = studioApprovalFilter === 'all' || s.approvalStatus === studioApprovalFilter;
      const matchesOperational = studioOperationalFilter === 'all' || s.operationalStatus === studioOperationalFilter;

      const matchesProvince = 
        studioProvinceFilter === 'all' || 
        (s.province || '').toLowerCase() === studioProvinceFilter.toLowerCase();

      const matchesTown = 
        studioTownFilter === 'all' || 
        s.city.toLowerCase() === studioTownFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesApproval && matchesOperational && matchesProvince && matchesTown;
    }).sort((a, b) => {
      if (studioSortBy === 'name') return a.businessName.localeCompare(b.businessName);
      if (studioSortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (studioSortBy === 'bookings') return (b.monthlyBookings || 0) - (a.monthlyBookings || 0);
      if (studioSortBy === 'reports') return (b.reportCount || 0) - (a.reportCount || 0);
      return b.registrationDate.localeCompare(a.registrationDate);
    });
  }, [
    studios, 
    studioSearch, 
    studioCategoryFilter, 
    studioApprovalFilter, 
    studioOperationalFilter, 
    studioProvinceFilter, 
    studioTownFilter, 
    studioSortBy
  ]);

  const paginatedStudios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudios.slice(start, start + itemsPerPage);
  }, [filteredStudios, currentPage]);

  const totalPages = Math.ceil(filteredStudios.length / itemsPerPage) || 1;

  // Featured Studios
  const featuredStudios = useMemo(() => {
    return studios
      .filter((s) => s.isFeatured && !s.isDeleted && s.approvalStatus === 'approved' && s.operationalStatus === 'active')
      .sort((a, b) => a.featuredOrder - b.featuredOrder);
  }, [studios]);

  const eligibleNonFeaturedStudios = useMemo(() => {
    return studios.filter(
      (s) => !s.isFeatured && !s.isDeleted && s.approvalStatus === 'approved' && s.operationalStatus === 'active'
    );
  }, [studios]);

  // Reports Filtered
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const q = reportSearch.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        r.studioName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        r.categoryLabel.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);

      const matchesStatus = reportStatusFilter === 'all' || r.status === reportStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reports, reportSearch, reportStatusFilter]);

  // Filtered Applications for Approvals tab
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesFilter = accreditationFilterStatus === 'all' || app.status === accreditationFilterStatus;
      const q = accreditationSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.applicantName.toLowerCase().includes(q) ||
        app.businessName.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.city.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [applications, accreditationFilterStatus, accreditationSearch]);

  // Users & Artisans Directory list
  const usersDirectory = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      role: 'Artisan' | 'Customer' | 'Administrator';
      email: string;
      phone: string;
      studioName?: string;
      joinedDate: string;
      status: string;
    }> = [];

    // Admins
    list.push({
      id: 'ADM-001',
      name: 'Govender M.',
      role: 'Administrator',
      email: 'compliance.govender@stenzabeauty.co.za',
      phone: '+27 11 884 9000',
      studioName: 'Compliance Desk HQ',
      joinedDate: '01 Jan 2026',
      status: 'Active'
    });

    // Artisans from studios
    studios.forEach((s) => {
      list.push({
        id: `USR-ART-${s.id.slice(0, 8)}`,
        name: s.founderName,
        role: 'Artisan',
        email: s.email,
        phone: s.phone,
        studioName: s.businessName,
        joinedDate: s.registrationDate,
        status: s.operationalStatus === 'active' ? 'Active' : s.operationalStatus === 'suspended' ? 'Suspended' : 'Under Review'
      });
    });

    // Standard verified customers
    const customers = [
      { id: 'USR-CUST-101', name: 'Naledi Mokwena', email: 'naledi.mokwena@stenzabeauty.co.za', phone: '+27 82 123 4567', joined: '10 Feb 2026' },
      { id: 'USR-CUST-102', name: 'Sarah Van Zyl', email: 'sarah.vanzyl@example.co.za', phone: '+27 83 234 5678', joined: '15 Mar 2026' },
      { id: 'USR-CUST-103', name: 'Bontle Sithole', email: 'bontle.sithole@example.co.za', phone: '+27 84 345 6789', joined: '22 Mar 2026' },
      { id: 'USR-CUST-104', name: 'Zanele M.', email: 'zanele.m@example.co.za', phone: '+27 72 456 7890', joined: '05 Apr 2026' }
    ];

    customers.forEach((c) => {
      list.push({
        id: c.id,
        name: c.name,
        role: 'Customer',
        email: c.email,
        phone: c.phone,
        joinedDate: c.joined,
        status: 'Active'
      });
    });

    return list.filter((u) => {
      const q = userSearch.toLowerCase().trim();
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.studioName && u.studioName.toLowerCase().includes(q));
      const matchesRole = userRoleFilter === 'all' || u.role.toLowerCase() === userRoleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [studios, userSearch, userRoleFilter]);

  // Bookings Filtered
  const filteredBookings = useMemo(() => {
    return bookingsList.filter((b) => {
      const q = bookingSearch.toLowerCase().trim();
      const matchesSearch = !q || b.id.toLowerCase().includes(q) || b.providerName.toLowerCase().includes(q) || b.serviceName.toLowerCase().includes(q);
      const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookingsList, bookingSearch, bookingStatusFilter]);

  // Audit Logs Filtered
  const filteredAuditLogs = useMemo(() => {
    if (auditActionFilter === 'all') return auditLogs;
    return auditLogs.filter((log) => log.targetType === auditActionFilter);
  }, [auditLogs, auditActionFilter]);

  // Toggle Featured
  const handleToggleFeatured = (studio: AdminStudio) => {
    if (studio.approvalStatus !== 'approved' || studio.operationalStatus !== 'active' || studio.isDeleted) {
      alert(`Cannot feature studio "${studio.businessName}". Only studios with Approved accreditation and Active status are eligible.`);
      return;
    }
    const willFeature = !studio.isFeatured;
    adminService.setStudioFeatured(studio.id, willFeature);
    refreshData();
  };

  const handleReorderFeatured = (studioId: string, direction: 'up' | 'down') => {
    const index = featuredStudios.findIndex((s) => s.id === studioId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= featuredStudios.length) return;

    const newOrder = [...featuredStudios];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    adminService.reorderFeatured(newOrder.map((s) => s.id));
    refreshData();
  };

  const handleOpenEnforcement = (studio: AdminStudio, type: EnforcementType) => {
    setEnforceStudio(studio);
    setEnforceType(type);
  };

  const handleStartReviewApp = (app: ArtisanApplication) => {
    setReviewingApp(app);
    setSelectedAppId(app.id);
  };

  const handleOpenActionModal = (action: 'approve' | 'reject' | 'changes') => {
    setModalAction(action);
    setModalError('');
    if (action === 'approve') {
      setDecisionReason('Verified trade qualifications, valid CIPC registration, and adherence to South African beauty salon hygiene standards.');
    } else if (action === 'changes') {
      setDecisionReason('Please upload a clearer certified copy of your South African National ID document and provide your physical premises certificate.');
    } else {
      setDecisionReason('Unable to verify trade certifications or commercial business presence required under accreditation criteria.');
    }
  };

  const handleConfirmDecision = () => {
    if (!decisionReason.trim()) {
      setModalError('A decision reason is mandatory for compliance auditing.');
      return;
    }

    const appToReview = reviewingApp || applications.find((a) => a.id === selectedAppId);
    if (!appToReview) return;

    setIsSubmitting(true);
    let newStatus: ApplicationStatus = 'pending';
    if (modalAction === 'approve') newStatus = 'approved';
    if (modalAction === 'reject') newStatus = 'rejected';
    if (modalAction === 'changes') newStatus = 'changes_requested';

    setTimeout(() => {
      onUpdateApplicationStatus(appToReview.id, newStatus, decisionReason, 'Admin (Compliance Desk)');
      adminService.updateApprovalStatus(appToReview.studioId, newStatus as ApprovalStatus, decisionReason);
      refreshData();
      setIsSubmitting(false);
      setModalAction(null);
      setReviewingApp(null);
    }, 400);
  };

  const handleToggleCategoryActive = (catId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    categoryService.toggleCategoryActive(catId, newStatus);
    setCategoriesList(categoryService.getAllCategories());
    setCategoryToast(`Category "${catId}" set to ${newStatus ? 'Active' : 'Inactive'}.`);
    setTimeout(() => setCategoryToast(null), 3000);

    adminService.logAudit({
      adminId: 'ADM-001',
      adminName: 'Govender M.',
      action: 'CATEGORY_STATUS_TOGGLED',
      targetType: 'category',
      targetId: catId,
      targetName: catId,
      newState: newStatus ? 'active' : 'inactive',
      reason: `Category status updated to ${newStatus ? 'Active' : 'Inactive'}`
    });
    setAuditLogs(adminService.getAuditLogs());
  };

  const handleSoftDelete = (studio: AdminStudio) => {
    const reason = window.prompt(`Are you sure you want to delete studio "${studio.businessName}"? Enter archival reason:`, 'Administrative archive request');
    if (reason) {
      adminService.softDeleteStudio(studio.id, reason);
      refreshData();
    }
  };

  const handleRestore = (studio: AdminStudio) => {
    if (window.confirm(`Restore studio "${studio.businessName}" to active directory?`)) {
      adminService.restoreStudio(studio.id);
      refreshData();
    }
  };

  // Compact Badges
  const getApprovalBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      case 'changes_requested':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Changes</span>;
      case 'pending':
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Pending</span>;
    }
  };

  const getOperationalBadge = (status: OperationalStatus) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>;
      case 'suspended':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Suspended</span>;
      case 'disabled':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">Disabled</span>;
      case 'under_review':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Review</span>;
      case 'deleted':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-500 border border-stone-200">Archived</span>;
      default:
        return null;
    }
  };

  const getReportBadge = (status: ReportStatus) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">Open</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">Under Review</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">Resolved</span>;
      case 'DISMISSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600">Dismissed</span>;
    }
  };

  // Nav Items Configuration
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'studios', label: 'Beauty Shop Management', icon: Building, badge: studios.length },
    { id: 'approvals', label: 'Beauty Shop Approvals', icon: ShieldCheck, badge: pendingApps.length > 0 ? pendingApps.length : null, badgeAlert: true },
    { id: 'users_artisans', label: 'Users & Artisans', icon: Users, badge: null },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: null },
    { id: 'reports', label: 'Reports & Complaints', icon: Flag, badge: analytics.openReports > 0 ? analytics.openReports : null, badgeAlert: true },
    { id: 'promotions', label: 'Landing Page Promotions', icon: Megaphone, badge: featuredStudios.length },
    { id: 'categories', label: 'Services & Categories', icon: Layers, badge: null },
    { id: 'updates_offers', label: 'Updates & Offers', icon: Tag, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: null },
    { id: 'audit_logs', label: 'Audit Logs', icon: History, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f5] text-stone-900 font-sans flex flex-col md:flex-row antialiased">
      {/* Toast */}
      {categoryToast && (
        <div className="fixed top-4 right-4 z-50 p-3.5 bg-stone-900 text-white rounded-xl shadow-lg text-xs flex items-center gap-2 border border-stone-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{categoryToast}</span>
        </div>
      )}

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR NAVIGATION (Desktop fixed, Mobile sliding drawer) */}
      <aside 
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-[#1b0d21] text-white flex flex-col justify-between shrink-0 transition-transform duration-200 border-r border-stone-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-[#b86b86]/40 flex items-center justify-center text-[#d4af37] font-serif font-bold text-base">
                S
              </div>
              <div>
                <h1 className="text-sm font-serif font-bold tracking-tight text-white leading-tight">
                  STENZA BEAUTY
                </h1>
                <span className="text-[10px] text-stone-400 font-medium block">
                  Admin Governance Portal
                </span>
                {isDevMode && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    DEVELOPMENT MODE
                  </span>
                )}
              </div>
            </div>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-white md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as AdminNavTab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive 
                      ? 'bg-[#b86b86] text-white font-bold shadow-xs' 
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span 
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                        item.badgeAlert 
                          ? 'bg-rose-500 text-white' 
                          : isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-stone-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Officer & Session */}
        <div className="p-3 border-t border-white/10 bg-black/20 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                GM
              </div>
              <div className="truncate">
                <p className="font-semibold text-white truncate text-[11px]">Govender M.</p>
                <p className="text-[10px] text-stone-400 truncate">Compliance Desk</p>
              </div>
            </div>
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                title="Lock Console"
                className="p-1.5 text-stone-400 hover:text-rose-300 transition rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {onLogoutAdmin && (
            <button
              onClick={onLogoutAdmin}
              className="w-full mt-2 py-1.5 px-2 bg-white/5 hover:bg-rose-500/20 text-stone-300 hover:text-rose-200 rounded-lg text-[11px] font-medium text-center transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3 h-3" />
              <span>Sign Out of Admin</span>
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Minimal Utility Bar */}
        <header className="bg-white border-b border-stone-200 px-4 sm:px-6 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-stone-200 md:hidden text-stone-600 hover:bg-stone-50 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Admin
                </span>
                <span className="text-stone-300 text-xs">/</span>
                <span className="text-xs font-bold text-[#26152d] capitalize">
                  {navItems.find((n) => n.id === activeTab)?.label}
                </span>
                {isDevMode && (
                  <span className="ml-1 sm:ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs inline-flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>DEVELOPMENT MODE</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            {onSelectArtisanPreset && (
              <div className="hidden lg:flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
                <span className="text-[10px] uppercase font-bold text-stone-500 px-1.5">Preset:</span>
                <button
                  onClick={() => onSelectArtisanPreset('STZ-APP-2026-8812', 'studio-nompu-dermal')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    currentStudioId === 'studio-nompu-dermal'
                      ? 'bg-white text-stone-900 font-bold shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Pending App
                </button>
                <button
                  onClick={() => onSelectArtisanPreset('STZ-APP-2026-7540', 'luxe-nail-studio')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    currentStudioId === 'luxe-nail-studio'
                      ? 'bg-white text-stone-900 font-bold shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Approved Studio
                </button>
              </div>
            )}

            <button
              onClick={() => setActiveTab('notifications')}
              className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 relative transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingApps.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
              )}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit to Store</span>
            </button>
          </div>
        </header>

        {/* VIEW BODY */}
        <main className="p-4 sm:p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {/* Prominent Development Mode Notice */}
          {isDevMode && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-200/80 text-amber-900 shrink-0 mt-0.5 sm:mt-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider text-[10px] bg-amber-300 text-amber-950 border border-amber-400/60">
                      DEVELOPMENT MODE
                    </span>
                    <span className="font-bold text-amber-950 text-xs">Temporary Development Access Active</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Any non-empty username & password grants access. Existing credentials are not required in development mode.
                  </p>
                </div>
              </div>
              <div className="text-[11px] font-medium text-amber-800/90 bg-amber-100/60 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0 self-start sm:self-auto">
                Automatically disabled in production
              </div>
            </div>
          )}

          {/* ================= 1. DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 4 Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* 1: Pending Studio Approvals */}
                <div 
                  onClick={() => setActiveTab('approvals')}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-[#b86b86] cursor-pointer transition flex items-start justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Pending Approvals
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#26152d] mt-1 block">
                      {pendingApps.length}
                    </span>
                    <span className="text-[11px] text-blue-600 font-medium">Requires review</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                {/* 2: Active Studios */}
                <div 
                  onClick={() => setActiveTab('studios')}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-[#b86b86] cursor-pointer transition flex items-start justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Active Studios
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#26152d] mt-1 block">
                      {analytics.approvedStudios}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">Accredited & live</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                </div>

                {/* 3: Open Complaints */}
                <div 
                  onClick={() => setActiveTab('reports')}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-[#b86b86] cursor-pointer transition flex items-start justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Open Complaints
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-rose-600 mt-1 block">
                      {analytics.openReports}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">Awaiting decision</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Flag className="w-4 h-4" />
                  </div>
                </div>

                {/* 4: Pending Actions */}
                <div 
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-start justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Pending Actions
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-600 mt-1 block">
                      {pendingActionsCount}
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium">Tasks in queue</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* 2-Column Grid for Operational Workflows */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Outstanding Approval Requests */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#26152d]">
                        Outstanding Approval Requests ({pendingApps.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('approvals')}
                      className="text-xs font-semibold text-[#b86b86] hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {pendingApps.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">No pending accreditation applications.</p>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {pendingApps.slice(0, 3).map((app) => (
                        <div key={app.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <p className="font-bold text-stone-900">{app.businessName}</p>
                            <p className="text-stone-500 text-[11px]">{app.applicantName} • {app.city}, {app.province || 'Limpopo'}</p>
                          </div>
                          <button
                            onClick={() => {
                              handleStartReviewApp(app);
                              setActiveTab('approvals');
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                          >
                            Review
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Complaints Requiring Attention */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-rose-600" />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#26152d]">
                        Complaints Requiring Attention ({analytics.openReports})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="text-xs font-semibold text-[#b86b86] hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {reports.filter((r) => r.status === 'OPEN' || r.status === 'UNDER_REVIEW').length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">All customer complaints are resolved.</p>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {reports
                        .filter((r) => r.status === 'OPEN' || r.status === 'UNDER_REVIEW')
                        .slice(0, 3)
                        .map((rep) => (
                          <div key={rep.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] text-stone-400 font-bold">{rep.id}</span>
                                <span className="font-bold text-stone-900 truncate">{rep.studioName}</span>
                              </div>
                              <p className="text-stone-500 text-[11px] truncate">{rep.categoryLabel} • by {rep.reporterName}</p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedReport(rep);
                                setActiveTab('reports');
                              }}
                              className="px-3 py-1 bg-[#26152d] hover:bg-[#382142] text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                            >
                              Investigate
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Recent Studio Registrations */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#b86b86]" />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#26152d]">
                        Recent Studio Registrations
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('studios')}
                      className="text-xs font-semibold text-[#b86b86] hover:underline cursor-pointer"
                    >
                      All Studios ({studios.length}) →
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {studios.slice(0, 3).map((st) => (
                      <div key={st.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 truncate">{st.businessName}</p>
                          <p className="text-stone-500 text-[11px] truncate">{st.founderName} • {formatStudioDisplayLocation(st.province, st.city, st.suburb)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {getApprovalBadge(st.approvalStatus)}
                          <button
                            onClick={() => setDrawerStudio(st)}
                            className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity History */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-stone-600" />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[#26152d]">
                        Recent Activity History
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('audit_logs')}
                      className="text-xs font-semibold text-[#b86b86] hover:underline cursor-pointer"
                    >
                      View Logs ({auditLogs.length}) →
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-800 truncate text-[11px]">{log.action}: {log.targetName}</p>
                          <p className="text-stone-400 text-[10px] truncate">{log.reason}</p>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 shrink-0">{log.timestamp.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. STUDIO MANAGEMENT ================= */}
          {activeTab === 'studios' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Controls & Search */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#26152d]">
                      Beauty Shop Directory & Compliance
                    </h2>
                    <p className="text-xs text-stone-500">
                      Manage registered beauty shops across South Africa.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-lg self-start sm:self-auto">
                    {filteredStudios.length} beauty shops found
                  </span>
                </div>

                {/* Filter Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  <div className="relative lg:col-span-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search name, owner..."
                      value={studioSearch}
                      onChange={(e) => { setStudioSearch(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  <select
                    value={studioStatusFilter(studioApprovalFilter, studioOperationalFilter)}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'all') {
                        setStudioApprovalFilter('all');
                        setStudioOperationalFilter('all');
                      } else if (val === 'approved') {
                        setStudioApprovalFilter('approved');
                        setStudioOperationalFilter('all');
                      } else if (val === 'pending') {
                        setStudioApprovalFilter('pending');
                        setStudioOperationalFilter('all');
                      } else if (val === 'suspended') {
                        setStudioApprovalFilter('all');
                        setStudioOperationalFilter('suspended');
                      } else if (val === 'disabled') {
                        setStudioApprovalFilter('all');
                        setStudioOperationalFilter('disabled');
                      }
                      setCurrentPage(1);
                    }}
                    className="py-1.5 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved & Active</option>
                    <option value="pending">Pending Approval</option>
                    <option value="suspended">Suspended</option>
                    <option value="disabled">Disabled / Inactive</option>
                  </select>

                  <select
                    value={studioProvinceFilter}
                    onChange={(e) => {
                      setStudioProvinceFilter(e.target.value);
                      setStudioTownFilter('all');
                      setCurrentPage(1);
                    }}
                    className="py-1.5 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                  >
                    <option value="all">All 9 Provinces</option>
                    {SOUTH_AFRICAN_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>

                  <select
                    value={studioTownFilter}
                    onChange={(e) => { setStudioTownFilter(e.target.value); setCurrentPage(1); }}
                    className="py-1.5 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                  >
                    <option value="all">All Towns / Cities</option>
                    {availableTownsForFilter.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  <select
                    value={studioSortBy}
                    onChange={(e) => setStudioSortBy(e.target.value as any)}
                    className="py-1.5 px-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                  >
                    <option value="date">Sort: Newest</option>
                    <option value="name">Sort: Studio Name</option>
                    <option value="rating">Sort: Highest Rating</option>
                    <option value="reports">Sort: Most Reports</option>
                  </select>
                </div>
              </div>

              {/* Compact Studios Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Studio Name</th>
                        <th className="py-2.5 px-3">Owner</th>
                        <th className="py-2.5 px-3">Province & Town</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-center">Featured</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {paginatedStudios.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-stone-400 text-xs">
                            No studios match the specified search or filter criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedStudios.map((studio) => {
                          const isEligibleToFeature = 
                            studio.approvalStatus === 'approved' && 
                            studio.operationalStatus === 'active' && 
                            !studio.isDeleted;

                          return (
                            <tr key={studio.id} className="hover:bg-stone-50/70 transition-colors">
                              {/* Studio Name */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={studio.logoUrl || studio.coverUrl}
                                    alt={studio.businessName}
                                    className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="font-bold text-stone-900 truncate">{studio.businessName}</p>
                                      {studio.isFeatured && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                                          ★ #{studio.featuredOrder}
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-mono text-[10px] text-stone-400 block">{studio.id}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Owner */}
                              <td className="py-2.5 px-3">
                                <div>
                                  <p className="font-semibold text-stone-800">{studio.founderName}</p>
                                  <p className="text-[10px] font-mono text-stone-400">{studio.phone}</p>
                                </div>
                              </td>

                              {/* Province & Town */}
                              <td className="py-2.5 px-3">
                                <div>
                                  <p className="font-medium text-stone-800">{studio.city}</p>
                                  <p className="text-[10px] text-stone-500">{studio.province || 'Gauteng'} • {studio.suburb}</p>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-2.5 px-3">
                                <div className="flex flex-col gap-1 items-start">
                                  {getApprovalBadge(studio.approvalStatus)}
                                  {getOperationalBadge(studio.operationalStatus)}
                                </div>
                              </td>

                              {/* Featured Toggle */}
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFeatured(studio)}
                                  disabled={!isEligibleToFeature}
                                  title={
                                    !isEligibleToFeature 
                                      ? `Only Approved & Active studios can be featured. Current: ${studio.approvalStatus} / ${studio.operationalStatus}`
                                      : studio.isFeatured ? 'Click to unfeature' : 'Click to feature on landing page'
                                  }
                                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                    studio.isFeatured 
                                      ? 'bg-amber-500' 
                                      : !isEligibleToFeature 
                                      ? 'bg-stone-200 opacity-50 cursor-not-allowed' 
                                      : 'bg-stone-300 hover:bg-stone-400'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                      studio.isFeatured ? 'translate-x-3' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => setDrawerStudio(studio)}
                                    className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                                    title="View Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => setEditStudio(studio)}
                                    className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                                    title="Edit Info"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>

                                  {studio.operationalStatus === 'suspended' ? (
                                    <button
                                      onClick={() => handleOpenEnforcement(studio, 'reinstate')}
                                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold cursor-pointer"
                                      title="Reinstate Studio"
                                    >
                                      Reinstate
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenEnforcement(studio, 'suspend')}
                                      className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold cursor-pointer"
                                      title="Suspend Studio"
                                    >
                                      Suspend
                                    </button>
                                  )}

                                  {studio.isDeleted ? (
                                    <button
                                      onClick={() => handleRestore(studio)}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                      title="Restore Studio"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleSoftDelete(studio)}
                                      className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                      title="Archive/Delete Studio"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                  <span>
                    Showing {paginatedStudios.length} of {filteredStudios.length} studios
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg disabled:opacity-40 cursor-pointer text-xs"
                    >
                      Prev
                    </button>
                    <span className="text-stone-700 font-semibold text-xs">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg disabled:opacity-40 cursor-pointer text-xs"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. STUDIO APPROVALS ================= */}
          {activeTab === 'approvals' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#26152d]">
                    Studio Accreditation & Approvals
                  </h2>
                  <p className="text-xs text-stone-500">
                    Verify beauty diplomas, certified identity documents, and hygiene compliance before approving.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search applicants..."
                    value={accreditationSearch}
                    onChange={(e) => setAccreditationSearch(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden"
                  />
                  <select
                    value={accreditationFilterStatus}
                    onChange={(e) => setAccreditationFilterStatus(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="all">All Applications</option>
                    <option value="pending">Pending Only</option>
                    <option value="approved">Approved</option>
                    <option value="changes_requested">Changes Requested</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Applicant & ID</th>
                        <th className="py-2.5 px-3">Studio Name</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Submitted Date</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Review Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-stone-400 text-xs">
                            No applications found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredApps.map((app) => (
                          <tr key={app.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-2.5 px-3">
                              <p className="font-bold text-stone-900">{app.applicantName}</p>
                              <span className="font-mono text-[10px] text-stone-400">{app.id}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <p className="font-semibold text-stone-800">{app.businessName}</p>
                              <span className="text-[10px] text-stone-500">{app.category}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <p className="text-stone-700">{app.city}, {app.province || 'Gauteng'}</p>
                              <span className="text-[10px] text-stone-500">{app.suburb}</span>
                            </td>
                            <td className="py-2.5 px-3 text-stone-600">
                              {app.submissionDate}
                            </td>
                            <td className="py-2.5 px-3">
                              {getApprovalBadge(app.status as ApprovalStatus)}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => handleStartReviewApp(app)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Review Documents
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Review Document Drawer/Modal if an application is selected for review */}
              {reviewingApp && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200">
                    <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Accreditation Verification</span>
                        <h3 className="text-base font-bold text-stone-900">{reviewingApp.businessName}</h3>
                        <p className="text-xs text-stone-500">{reviewingApp.applicantName} • {reviewingApp.city}, {reviewingApp.province || 'Gauteng'}</p>
                      </div>
                      <button onClick={() => setReviewingApp(null)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
                      {/* Documents List */}
                      <div>
                        <h4 className="font-bold text-stone-800 mb-2 uppercase text-[11px] tracking-wider">Submitted Credentials & Certificates</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {reviewingApp.documents.map((doc) => (
                            <div key={doc.id} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between">
                              <div className="truncate mr-2">
                                <p className="font-semibold text-stone-800 truncate">{doc.title}</p>
                                <p className="text-[10px] text-stone-500 font-mono">{doc.type} • {doc.verified ? 'Verified' : 'Pending Check'}</p>
                              </div>
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="px-2 py-1 bg-white border border-stone-200 rounded text-[11px] font-semibold text-[#b86b86] hover:bg-stone-100 cursor-pointer shrink-0"
                              >
                                View Doc
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bio & Details */}
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                        <span className="font-bold text-stone-700 block">Experience & Specialties:</span>
                        <p className="text-stone-600 leading-relaxed">{reviewingApp.experienceYears} years experience. {reviewingApp.bio}</p>
                      </div>

                      {/* Current Status */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-700">Current Status:</span>
                        {getApprovalBadge(reviewingApp.status as ApprovalStatus)}
                      </div>
                    </div>

                    <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setReviewingApp(null)}
                        className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200/50 rounded-xl"
                      >
                        Cancel
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenActionModal('changes')}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() => handleOpenActionModal('reject')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleOpenActionModal('approve')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                        >
                          Approve Studio
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 4. USERS & ARTISANS ================= */}
          {activeTab === 'users_artisans' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#26152d]">
                    Users & Artisans Directory
                  </h2>
                  <p className="text-xs text-stone-500">
                    Unified platform user registry: Beauty professionals, customers, and staff.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden"
                  />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="all">All Roles</option>
                    <option value="artisan">Artisans</option>
                    <option value="customer">Customers</option>
                    <option value="administrator">Administrators</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">User Name</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">Studio / Association</th>
                        <th className="py-2.5 px-3">Contact</th>
                        <th className="py-2.5 px-3">Joined</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {usersDirectory.map((user) => (
                        <tr key={user.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-stone-900">
                            {user.name}
                            <span className="font-mono text-[10px] text-stone-400 block">{user.id}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              user.role === 'Administrator' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'Artisan' ? 'bg-[#f6d9fb] text-[#39263f]' :
                              'bg-stone-100 text-stone-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-700">
                            {user.studioName || '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            <p className="font-mono text-[11px] text-stone-800">{user.phone}</p>
                            <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                          </td>
                          <td className="py-2.5 px-3 text-stone-500">
                            {user.joinedDate}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. BOOKINGS ================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#26152d]">
                    Platform Bookings Overview
                  </h2>
                  <p className="text-xs text-stone-500">
                    Monitor client appointments, escrow states, and fulfillment status across South Africa.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden"
                  />
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="all">All Bookings</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Ref Code</th>
                        <th className="py-2.5 px-3">Studio & Service</th>
                        <th className="py-2.5 px-3">Date & Time</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-stone-800">
                            {b.referenceCode}
                          </td>
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-stone-900">{b.providerName}</p>
                            <p className="text-[11px] text-stone-500">{b.serviceName}</p>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600">
                            <p className="font-medium">{b.date}</p>
                            <p className="text-[11px] text-stone-400">{b.time}</p>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#b86b86]">
                            R{b.servicePrice}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 font-semibold text-stone-600">
                              {b.serviceType === 'mobile' ? 'Mobile House Call' : 'In-Studio'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                              b.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              b.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. REPORTS & COMPLAINTS ================= */}
          {activeTab === 'reports' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#26152d]">
                    Customer Reports & Dispute Resolution
                  </h2>
                  <p className="text-xs text-stone-500">
                    Investigate customer complaints, review evidence, and record audit decisions.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-stone-100 p-0.5 rounded-xl text-xs">
                    <button
                      onClick={() => setReportsSubView('reports')}
                      className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                        reportsSubView === 'reports' ? 'bg-white shadow-2xs text-stone-900 font-bold' : 'text-stone-500'
                      }`}
                    >
                      Complaints ({reports.length})
                    </button>
                    <button
                      onClick={() => setReportsSubView('appeals')}
                      className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                        reportsSubView === 'appeals' ? 'bg-white shadow-2xs text-stone-900 font-bold' : 'text-stone-500'
                      }`}
                    >
                      Appeals ({appeals.length})
                    </button>
                  </div>
                </div>
              </div>

              {reportsSubView === 'reports' ? (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Report Ref</th>
                          <th className="py-2.5 px-3">Studio</th>
                          <th className="py-2.5 px-3">Reason</th>
                          <th className="py-2.5 px-3">Reporter</th>
                          <th className="py-2.5 px-3">Submitted</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredReports.map((r) => (
                          <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-stone-800">
                              {r.id}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-stone-900">
                              {r.studioName}
                            </td>
                            <td className="py-2.5 px-3 text-stone-700">
                              {r.categoryLabel}
                            </td>
                            <td className="py-2.5 px-3 text-stone-600">
                              {r.reporterName}
                            </td>
                            <td className="py-2.5 px-3 text-stone-500">
                              {r.dateSubmitted ? r.dateSubmitted.split('T')[0] : 'Recent'}
                            </td>
                            <td className="py-2.5 px-3">
                              {getReportBadge(r.status)}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => setSelectedReport(r)}
                                className="px-3 py-1 bg-[#26152d] hover:bg-[#382142] text-white rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Investigate
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Appeals Sub-View */
                <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Appeal ID</th>
                          <th className="py-2.5 px-3">Studio</th>
                          <th className="py-2.5 px-3">Reason for Appeal</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {appeals.map((app) => (
                          <tr key={app.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-stone-800">{app.id}</td>
                            <td className="py-2.5 px-3 font-bold text-stone-900">{app.studioName}</td>
                            <td className="py-2.5 px-3 text-stone-700">{app.appealReason}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {app.status === 'PENDING' && (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      adminService.recordAppealDecision(app.id, 'APPROVED', 'Corrective action verified', true);
                                      refreshData();
                                    }}
                                    className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                                  >
                                    Reinstate
                                  </button>
                                  <button
                                    onClick={() => {
                                      adminService.recordAppealDecision(app.id, 'REJECTED', 'Insufficient remediation provided', false);
                                      refreshData();
                                    }}
                                    className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer"
                                  >
                                    Dismiss
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 7. LANDING PAGE PROMOTIONS ================= */}
          {activeTab === 'promotions' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#26152d]">
                    Landing Page Promotions & Featured Studios
                  </h2>
                  <p className="text-xs text-stone-500">
                    Control which approved beauty studios appear in the Featured showcase of the landing page.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewLandingOpen(true)}
                    className="px-3 py-1.5 bg-[#26152d] hover:bg-[#382142] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-pink-300" />
                    <span>Preview Landing Page</span>
                  </button>
                </div>
              </div>

              {/* Current Featured Studios List */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-stone-700">
                    Currently Featured Studios ({featuredStudios.length})
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Display order controls ranking on homepage
                  </span>
                </div>

                <div className="divide-y divide-stone-100 text-xs">
                  {featuredStudios.length === 0 ? (
                    <p className="py-8 text-center text-stone-400">No studios currently featured.</p>
                  ) : (
                    featuredStudios.map((st, idx) => (
                      <div key={st.id} className="p-3 flex items-center justify-between gap-3 hover:bg-stone-50/70">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </span>
                          <img src={st.logoUrl || st.coverUrl} alt={st.businessName} className="w-9 h-9 rounded-lg object-cover border border-stone-200" />
                          <div>
                            <p className="font-bold text-stone-900">{st.businessName}</p>
                            <p className="text-[11px] text-stone-500">{st.category} • {st.city}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => handleReorderFeatured(st.id, 'up')}
                              disabled={idx === 0}
                              className="p-1 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorderFeatured(st.id, 'down')}
                              disabled={idx === featuredStudios.length - 1}
                              className="p-1 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleToggleFeatured(st)}
                            className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Unfeature
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add More Eligible Studios */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                  Eligible Approved Studios Ready to Feature ({eligibleNonFeaturedStudios.length})
                </h3>

                <div className="divide-y divide-stone-100 text-xs">
                  {eligibleNonFeaturedStudios.slice(0, 5).map((st) => (
                    <div key={st.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-stone-900">{st.businessName}</p>
                        <p className="text-[11px] text-stone-500">{st.category} • {st.city}</p>
                      </div>
                      <button
                        onClick={() => handleToggleFeatured(st)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        + Feature
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 8. SERVICES & CATEGORIES ================= */}
          {activeTab === 'categories' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#26152d]">
                    Services & Marketplace Categories
                  </h2>
                  <p className="text-xs text-stone-500">
                    Configure customer explore categories, taxonomy, and registration availability.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Category Name</th>
                        <th className="py-2.5 px-3">Group</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Studios / Listings</th>
                        <th className="py-2.5 px-3 text-right">Status Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {categoriesList.map((cat) => (
                        <tr key={cat.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-stone-900">{cat.name}</p>
                            <span className="font-mono text-[10px] text-stone-400">{cat.id}</span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-700">
                            {cat.group}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-stone-100 font-semibold text-stone-600">
                              {cat.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600">
                            {cat.itemCountText}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleToggleCategoryActive(cat.id, cat.isActive)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                                cat.isActive 
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                  : 'bg-stone-100 text-stone-500 border border-stone-200'
                              }`}
                            >
                              {cat.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 9. UPDATES & OFFERS ================= */}
          {activeTab === 'updates_offers' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#26152d]">
                    Promotional Updates & Special Offers
                  </h2>
                  <p className="text-xs text-stone-500">
                    Manage studio promotional banners, seasonal beauty deals, and marketplace discounts.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Offer Title</th>
                        <th className="py-2.5 px-3">Studio</th>
                        <th className="py-2.5 px-3">Discount</th>
                        <th className="py-2.5 px-3">Valid Until</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {promotionsList.map((promo) => (
                        <tr key={promo.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-stone-900">{promo.title}</p>
                            <span className="text-[10px] text-stone-500">{promo.shortDescription}</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-stone-800">
                            {promo.studioName}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#b86b86]">
                            {promo.discountBadge || 'Special Offer'}
                          </td>
                          <td className="py-2.5 px-3 text-stone-600">
                            {promo.expiryDate}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              promo.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {promo.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                adminService.togglePromotionPublished(promo.id);
                                refreshData();
                              }}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer"
                            >
                              {promo.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 10. NOTIFICATIONS ================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <h2 className="text-base font-serif font-bold text-[#26152d]">
                  Administrative Compliance Feed
                </h2>
                <p className="text-xs text-stone-500">
                  Real-time alerts regarding new studio applications, customer disputes, and compliance milestones.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs divide-y divide-stone-100 text-xs">
                {pendingApps.map((app) => (
                  <div key={app.id} className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">New Studio Accreditation Application Submitted</p>
                        <p className="text-stone-600 mt-0.5">{app.businessName} ({app.applicantName}) submitted credentials for {app.city}, {app.province || 'Gauteng'}.</p>
                        <span className="text-[10px] text-stone-400 font-mono mt-1 block">{app.submissionDate}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleStartReviewApp(app);
                        setActiveTab('approvals');
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Review
                    </button>
                  </div>
                ))}

                {reports.filter((r) => r.status === 'OPEN').map((rep) => (
                  <div key={rep.id} className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Flag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">New Customer Dispute / Report Logged</p>
                        <p className="text-stone-600 mt-0.5">{rep.reporterName} filed report for {rep.studioName}: "{rep.categoryLabel}".</p>
                        <span className="text-[10px] text-stone-400 font-mono mt-1 block">{rep.dateSubmitted}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReport(rep);
                        setActiveTab('reports');
                      }}
                      className="px-3 py-1 bg-[#26152d] text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Investigate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 11. AUDIT LOGS ================= */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#26152d]">
                    POPIA-Compliant Audit Trail
                  </h2>
                  <p className="text-xs text-stone-500">
                    Immutable records of all administrative actions, studio enforcements, and approval events.
                  </p>
                </div>
                <select
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="all">All Event Types</option>
                  <option value="studio">Studios</option>
                  <option value="report">Reports</option>
                  <option value="appeal">Appeals</option>
                  <option value="category">Categories</option>
                </select>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Event ID</th>
                        <th className="py-2.5 px-3">Timestamp (SAST)</th>
                        <th className="py-2.5 px-3">Administrator</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Target</th>
                        <th className="py-2.5 px-3">Justification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-stone-500 text-[11px]">{log.id}</td>
                          <td className="py-2.5 px-3 font-mono text-stone-500 text-[11px]">{log.timestamp}</td>
                          <td className="py-2.5 px-3 font-medium text-stone-800">{log.adminName}</td>
                          <td className="py-2.5 px-3 font-bold text-stone-900">{log.action}</td>
                          <td className="py-2.5 px-3 text-stone-700">{log.targetName}</td>
                          <td className="py-2.5 px-3 text-stone-600 max-w-xs truncate">{log.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 12. SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <h2 className="text-base font-serif font-bold text-[#26152d]">
                  Platform Compliance & Admin Settings
                </h2>
                <p className="text-xs text-stone-500">
                  Global portal parameters, Spring Boot REST endpoints, and security configurations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3 text-xs">
                  <h3 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider">Compliance Officer Configuration</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Primary Officer:</span>
                      <span className="font-semibold text-stone-800">Govender M. (Compliance Desk HQ)</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Regulatory Jurisdiction:</span>
                      <span className="font-semibold text-stone-800">Republic of South Africa (POPIA Act 4 of 2013)</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Escrow Settlement Window:</span>
                      <span className="font-semibold text-stone-800">24 Hours Post Appointment Completion</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3 text-xs">
                  <h3 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider">Spring Boot REST API Contract Status</h3>
                  <div className="space-y-1.5 text-stone-600 font-mono text-[11px]">
                    <div className="flex items-center justify-between p-1.5 bg-stone-50 rounded-lg">
                      <span>/api/admin/studios</span>
                      <span className="text-emerald-700 font-bold font-sans text-[10px]">Ready</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 bg-stone-50 rounded-lg">
                      <span>/api/admin/reports</span>
                      <span className="text-emerald-700 font-bold font-sans text-[10px]">Ready</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 bg-stone-50 rounded-lg">
                      <span>/api/admin/audit-logs</span>
                      <span className="text-emerald-700 font-bold font-sans text-[10px]">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* REUSABLE MODALS & DRAWERS */}
      {drawerStudio && (
        <StudioDetailsDrawer
          studio={drawerStudio}
          isOpen={true}
          onClose={() => setDrawerStudio(null)}
          onEditInfo={(st) => { setDrawerStudio(null); setEditStudio(st); }}
          onEnforce={(st, action) => { setDrawerStudio(null); handleOpenEnforcement(st, action); }}
          onToggleFeatured={(st) => { handleToggleFeatured(st); setDrawerStudio(null); }}
        />
      )}

      {editStudio && (
        <EditStudioAdminModal
          isOpen={true}
          studio={editStudio}
          onClose={() => setEditStudio(null)}
          onSuccess={() => { refreshData(); setEditStudio(null); }}
        />
      )}

      {enforceStudio && (
        <EnforcementActionModal
          isOpen={true}
          studio={enforceStudio}
          actionType={enforceType}
          onClose={() => setEnforceStudio(null)}
          onSuccess={() => { refreshData(); setEnforceStudio(null); }}
        />
      )}

      {selectedReport && (
        <ReportDecisionModal
          isOpen={true}
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSuccess={() => { refreshData(); setSelectedReport(null); }}
        />
      )}

      {previewLandingOpen && (
        <LandingPagePreviewModal
          isOpen={true}
          featuredStudios={featuredStudios}
          onClose={() => setPreviewLandingOpen(false)}
        />
      )}

      {/* Confirmation Decision Modal for Accreditation */}
      {modalAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-2 capitalize">
              Confirm {modalAction === 'changes' ? 'Changes Request' : modalAction}
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              A written justification is required for POPIA audit trail and artisan notification.
            </p>

            <textarea
              rows={3}
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="Enter decision rationale..."
              className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
            />
            {modalError && <p className="text-rose-600 text-[11px] mt-1 font-semibold">{modalError}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalAction(null)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#26152d] text-white rounded-lg text-xs font-bold hover:bg-[#382142] cursor-pointer"
              >
                {isSubmitting ? 'Recording...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Document Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">{previewDoc.title}</h3>
              <p className="text-xs text-stone-500 font-mono mt-0.5">{previewDoc.type} • Uploaded {previewDoc.uploadDate}</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 text-left">
              <p className="font-bold text-stone-800 mb-1">Document Verification Status:</p>
              <p>Certified South African authenticity check passed. CIPC trade registry hash verified against Department of Trade, Industry and Competition records.</p>
            </div>
            <button
              onClick={() => setPreviewDoc(null)}
              className="px-4 py-2 bg-[#26152d] text-white rounded-xl text-xs font-bold hover:bg-[#382142] cursor-pointer"
            >
              Close Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function studioStatusFilter(approval: string, operational: string): string {
  if (approval === 'approved' && operational === 'all') return 'approved';
  if (approval === 'pending') return 'pending';
  if (operational === 'suspended') return 'suspended';
  if (operational === 'disabled') return 'disabled';
  return 'all';
}
