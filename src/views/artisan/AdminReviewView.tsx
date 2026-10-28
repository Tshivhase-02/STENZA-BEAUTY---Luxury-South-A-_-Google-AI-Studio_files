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
  ShoppingBag
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
import { StenzaCategory, CategoryGroup, CategoryType, mapLegacyCategoryToSlug } from '../../data/categoryData';
import { CURATED_PRODUCTS } from '../../data/beautyData';

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

type AdminTab = 'analytics' | 'studios' | 'categories' | 'promotions' | 'reports' | 'appeals' | 'accreditation' | 'audit_logs';

export const AdminReviewView: React.FC<AdminReviewViewProps> = ({
  applications,
  onUpdateApplicationStatus,
  onNavigate,
  currentStudioId,
  onSelectArtisanPreset,
  onLogoutAdmin,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>('studios');
  
  // Data state from adminService
  const [studios, setStudios] = useState<AdminStudio[]>([]);
  const [reports, setReports] = useState<StudioReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [appeals, setAppeals] = useState<StudioAppeal[]>([]);

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
  const [studioSortBy, setStudioSortBy] = useState<'name' | 'date' | 'rating' | 'bookings' | 'reports'>('date');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Reports Filter
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('all');
  const [reportSearch, setReportSearch] = useState<string>('');

  // Audit Logs Filter
  const [auditActionFilter, setAuditActionFilter] = useState<string>('all');

  // Accreditation Review Tab State (Preserved Original)
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [accreditationFilterStatus, setAccreditationFilterStatus] = useState<string>('all');
  const [accreditationSearch, setAccreditationSearch] = useState<string>('');
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | 'changes' | null>(null);
  const [decisionReason, setDecisionReason] = useState<string>('');
  const [modalError, setModalError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<ArtisanDocument | null>(null);

  // Promotions State
  const [promotionsList, setPromotionsList] = useState<StudioPromotion[]>([]);
  const [promotionsSubTab, setPromotionsSubTab] = useState<'offers' | 'featured_studios'>('offers');
  const [promoSectionFilter, setPromoSectionFilter] = useState<string>('all');
  const [promoStatusFilter, setPromoStatusFilter] = useState<string>('all');
  const [promoSearch, setPromoSearch] = useState<string>('');

  // Reload data from adminService
  const refreshData = () => {
    setStudios(adminService.getStudios(true));
    setReports(adminService.getReports());
    setAuditLogs(adminService.getAuditLogs());
    setAppeals(adminService.getAppeals());
    setPromotionsList(adminService.getPromotions(true));
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Category Management State
  const [categoriesList, setCategoriesList] = useState<StenzaCategory[]>(categoryService.getAllCategories());
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [categoryGroupFilter, setCategoryGroupFilter] = useState<string>('all');
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<string>('all');
  const [categoryStatusFilter, setCategoryStatusFilter] = useState<string>('all');
  const [categoryToast, setCategoryToast] = useState<string | null>(null);

  const categoryMetrics = useMemo(() => {
    return categoryService.getCategoryMetrics(studios, CURATED_PRODUCTS);
  }, [studios]);

  const handleToggleCategoryActive = (catId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    categoryService.toggleCategoryActive(catId, newStatus);
    setCategoriesList(categoryService.getAllCategories());
    setCategoryToast(`Category "${catId}" has been ${newStatus ? 'activated' : 'deactivated'}.`);
    setTimeout(() => setCategoryToast(null), 3000);

    adminService.logAudit({
      adminId: 'ADMIN-01',
      adminName: 'Lead Platform Administrator',
      action: 'CATEGORY_STATUS_TOGGLED',
      targetType: 'category',
      targetId: catId,
      targetName: catId,
      newState: newStatus ? 'active' : 'inactive',
      reason: `Category [${catId}] status toggled to ${newStatus ? 'Active' : 'Inactive (Prevented from new registrations)'}`
    });
    setAuditLogs(adminService.getAuditLogs());
  };

  const handleResetCategories = () => {
    categoryService.resetToDefaults();
    setCategoriesList(categoryService.getAllCategories());
    setCategoryToast('Categories successfully reset to factory defaults.');
    setTimeout(() => setCategoryToast(null), 3000);
  };

  // Update applications sync
  useEffect(() => {
    if (applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0].id);
    }
  }, [applications, selectedAppId]);

  // Analytics Metrics
  const analytics = useMemo(() => {
    return adminService.getDashboardAnalytics();
  }, [studios, reports, appeals]);

  // Studios Filter & Sorting
  const filteredStudios = useMemo(() => {
    return studios.filter((s) => {
      // Search
      const q = studioSearch.toLowerCase();
      const matchesSearch = 
        !q ||
        s.businessName.toLowerCase().includes(q) ||
        s.founderName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.applicationId.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.suburb.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);

      // Category
      const matchesCategory = 
        studioCategoryFilter === 'all' || 
        s.category === studioCategoryFilter || 
        mapLegacyCategoryToSlug(s.category) === studioCategoryFilter;

      // Approval
      const matchesApproval = studioApprovalFilter === 'all' || s.approvalStatus === studioApprovalFilter;

      // Operational
      const matchesOperational = studioOperationalFilter === 'all' || s.operationalStatus === studioOperationalFilter;

      return matchesSearch && matchesCategory && matchesApproval && matchesOperational;
    }).sort((a, b) => {
      if (studioSortBy === 'name') return a.businessName.localeCompare(b.businessName);
      if (studioSortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (studioSortBy === 'bookings') return (b.monthlyBookings || 0) - (a.monthlyBookings || 0);
      if (studioSortBy === 'reports') return (b.reportCount || 0) - (a.reportCount || 0);
      return b.registrationDate.localeCompare(a.registrationDate);
    });
  }, [studios, studioSearch, studioCategoryFilter, studioApprovalFilter, studioOperationalFilter, studioSortBy]);

  const paginatedStudios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudios.slice(start, start + itemsPerPage);
  }, [filteredStudios, currentPage]);

  const totalPages = Math.ceil(filteredStudios.length / itemsPerPage) || 1;

  // Featured Studios (for Promotions tab)
  const featuredStudios = useMemo(() => {
    return studios
      .filter((s) => s.isFeatured && !s.isDeleted && s.approvalStatus === 'approved' && s.operationalStatus === 'active')
      .sort((a, b) => a.featuredOrder - b.featuredOrder);
  }, [studios]);

  const nonFeaturedApprovedStudios = useMemo(() => {
    return studios.filter(
      (s) => !s.isFeatured && !s.isDeleted && s.approvalStatus === 'approved' && s.operationalStatus === 'active'
    );
  }, [studios]);

  // Reports Filtered
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const q = reportSearch.toLowerCase();
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

  // Audit Logs Filtered
  const filteredAuditLogs = useMemo(() => {
    if (auditActionFilter === 'all') return auditLogs;
    return auditLogs.filter((log) => log.targetType === auditActionFilter);
  }, [auditLogs, auditActionFilter]);

  // Handlers for Studio Actions
  const handleToggleFeatured = (studio: AdminStudio) => {
    if (studio.approvalStatus !== 'approved' || studio.operationalStatus !== 'active' || studio.isDeleted) {
      alert(`Cannot feature studio "${studio.businessName}". Only studios with APPROVED accreditation and ACTIVE operational status are eligible.`);
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

  // Handlers for Promotion Actions
  const handleTogglePromotionPublished = (promo: StudioPromotion) => {
    const res = adminService.togglePromotionPublished(promo.id);
    if (!res.success) {
      alert(res.message);
    }
    refreshData();
  };

  const handleApprovePromotion = (promoId: string) => {
    adminService.updatePromotionApproval(promoId, 'approved');
    adminService.togglePromotionPublished(promoId);
    refreshData();
  };

  const handleDeletePromotion = (promo: StudioPromotion) => {
    if (window.confirm(`Are you sure you want to remove promotion "${promo.title}"?`)) {
      adminService.deletePromotion(promo.id);
      refreshData();
    }
  };

  // Filtered Promotions for Admin
  const filteredPromotions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return promotionsList.filter((p) => {
      const q = promoSearch.toLowerCase();
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.studioName.toLowerCase().includes(q);
      const matchesSection = promoSectionFilter === 'all' || p.section === promoSectionFilter;
      
      let matchesStatus = true;
      if (promoStatusFilter === 'published') {
        matchesStatus = p.isPublished && p.approvalStatus === 'approved' && p.expiryDate >= today;
      } else if (promoStatusFilter === 'unpublished') {
        matchesStatus = !p.isPublished && p.approvalStatus === 'approved';
      } else if (promoStatusFilter === 'expired') {
        matchesStatus = p.expiryDate < today;
      } else if (promoStatusFilter === 'pending') {
        matchesStatus = p.approvalStatus === 'pending';
      }
      return matchesSearch && matchesSection && matchesStatus;
    });
  }, [promotionsList, promoSearch, promoSectionFilter, promoStatusFilter]);

  const handleOpenEnforcement = (studio: AdminStudio, type: EnforcementType) => {
    setEnforceStudio(studio);
    setEnforceType(type);
  };

  // Accreditation Logic (Original preserved)
  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const filteredApps = applications.filter((app) => {
    const matchesFilter = accreditationFilterStatus === 'all' || app.status === accreditationFilterStatus;
    const matchesSearch =
      app.applicantName.toLowerCase().includes(accreditationSearch.toLowerCase()) ||
      app.businessName.toLowerCase().includes(accreditationSearch.toLowerCase()) ||
      app.id.toLowerCase().includes(accreditationSearch.toLowerCase()) ||
      app.category.toLowerCase().includes(accreditationSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenActionModal = (action: 'approve' | 'reject' | 'changes') => {
    setModalAction(action);
    setModalError('');
    if (action === 'approve') {
      setDecisionReason(
        'Verified trade credentials, valid CIPC registration, and confirmed health & safety hygiene standard adherence.'
      );
    } else if (action === 'changes') {
      setDecisionReason(
        'Please upload a clearer certified copy of your South African National ID document and provide your physical premises certificate.'
      );
    } else {
      setDecisionReason('Unable to verify required beauty trade qualifications or commercial business presence.');
    }
  };

  const handleConfirmDecision = () => {
    if (!decisionReason.trim()) {
      setModalError('A decision reason is mandatory for auditing and artisan feedback.');
      return;
    }

    if (!selectedApp) return;

    setIsSubmitting(true);
    let newStatus: ApplicationStatus = 'pending';
    if (modalAction === 'approve') newStatus = 'approved';
    if (modalAction === 'reject') newStatus = 'rejected';
    if (modalAction === 'changes') newStatus = 'changes_requested';

    setTimeout(() => {
      onUpdateApplicationStatus(selectedApp.id, newStatus, decisionReason, 'Admin (Compliance Desk)');
      // Sync into adminService
      adminService.updateApprovalStatus(
        selectedApp.studioId,
        newStatus as ApprovalStatus,
        decisionReason
      );
      refreshData();
      setIsSubmitting(false);
      setModalAction(null);
    }, 400);
  };

  const handleApproveAppeal = (appeal: StudioAppeal) => {
    if (window.confirm(`Approve appeal for ${appeal.studioName} and reinstate operational status?`)) {
      adminService.recordAppealDecision(
        appeal.id,
        'APPROVED',
        'Appeal approved by Senior Compliance Officer. Corrective proof verified.',
        true
      );
      refreshData();
    }
  };

  const handleRejectAppeal = (appeal: StudioAppeal) => {
    const reason = window.prompt('Enter reason for dismissing this appeal:', 'Insufficient corrective remediation provided.');
    if (reason) {
      adminService.recordAppealDecision(appeal.id, 'REJECTED', reason, false);
      refreshData();
    }
  };

  // Status Badges
  const getApprovalBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Changes
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  const getOperationalBadge = (status: OperationalStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case 'disabled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
            <PauseCircle className="w-3 h-3" /> Disabled
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3" /> Suspended
          </span>
        );
      case 'deleted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-800 border border-stone-300">
            <Trash2 className="w-3 h-3" /> Deleted
          </span>
        );
    }
  };

  const getReportStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
            Open
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            Under Review
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Resolved
          </span>
        );
      case 'DISMISSED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
            Dismissed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] flex flex-col justify-between font-sans">
      <div>
        {/* Dedicated Admin Top Header Bar */}
        <header className="bg-[#1b0d21] text-white border-b border-stone-800 shadow-lg sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: Branding & Role */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-[#b86b86]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-2 py-0.5 rounded shadow-xs">
                    ADMIN PORTAL
                  </span>
                  <span className="text-[11px] text-stone-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Officer: Govender M. (Compliance Desk)
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                  Studio Governance, Promotions & Moderation Centre
                </h1>
              </div>
            </div>

            {/* Center: Test Application Preset Quick Switcher */}
            {onSelectArtisanPreset && (
              <div className="hidden xl:flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 px-2 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#d4af37]" />
                  Preset:
                </span>
                <button
                  onClick={() => onSelectArtisanPreset('STZ-APP-2026-8812', 'studio-nompu-dermal')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    currentStudioId === 'studio-nompu-dermal'
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Test evaluating a pending application"
                >
                  Pending App (Nompu Dermal)
                </button>
                <button
                  onClick={() => onSelectArtisanPreset('STZ-APP-2026-7540', 'luxe-nail-studio')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    currentStudioId === 'luxe-nail-studio'
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/50 font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Test an already approved and accredited studio"
                >
                  Approved Studio (Luxe Nail)
                </button>
              </div>
            )}

            {/* Right: Actions & Return to User Page */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => onNavigate('artisan_dashboard')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                title="View Artisan Studio Dashboard"
              >
                <span>Artisan Suite</span>
              </button>

              {onLogoutAdmin && (
                <button
                  onClick={onLogoutAdmin}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 text-rose-200 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                  title="Lock admin session and require Access ID to re-enter"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Lock Console</span>
                </button>
              )}

              {/* Exit Admin and return to User Page */}
              <button
                onClick={() => onNavigate('home')}
                className="px-4 py-2 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border border-pink-300/30"
                title="Exit Administrator Portal and return to Client Marketplace"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to User Page</span>
              </button>
            </div>
          </div>

          {/* Prototype Ready Banner */}
          <div className="bg-[#26152d] border-t border-b border-stone-800 text-[11px] text-stone-300 py-1.5 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[10px]">
                  PROTOTYPE MODE
                </span>
                <span className="text-stone-300">
                  Ready for Java Spring Boot REST API & MySQL integration (<code className="text-pink-300 font-mono">/api/admin/*</code> service contracts implemented in browser memory).
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-stone-400">
                <span>South Africa Standard Time (SAST)</span>
                <span>•</span>
                <span className="text-emerald-400">POPIA Act 4 Compliant Audit Trail</span>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="bg-[#140a19] border-b border-stone-800 overflow-x-auto scrollbar-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 py-2">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-[#b86b86] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Overview & Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('studios')}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'studios'
                    ? 'bg-[#b86b86] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Studio Management</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-bold">
                  {studios.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'bg-[#b86b86] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-pink-300" />
                <span>Category Management</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-pink-400/20 text-pink-300 font-bold border border-pink-400/30">
                  {categoriesList.filter(c => c.isActive).length}/{categoriesList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('promotions')}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'promotions'
                    ? 'bg-[#b86b86] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5 text-amber-300" />
                <span>Landing Page Promotions</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                  {featuredStudios.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'bg-[#b86b86] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <Flag className="w-3.5 h-3.5 text-rose-400" />
                <span>Reports & Complaints</span>
                {analytics.openReports > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                    {analytics.openReports} Open
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('appeals')}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'appeals'
                    ? 'bg-[#b86b86] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Enforcement & Appeals</span>
                {appeals.filter(a => a.status === 'PENDING').length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-stone-900 font-bold">
                    {appeals.filter(a => a.status === 'PENDING').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('accreditation')}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'accreditation'
                    ? 'bg-[#b86b86] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Accreditation Reviews</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                  {applications.filter(a => a.status === 'pending').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('audit_logs')}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'audit_logs'
                    ? 'bg-[#b86b86] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <History className="w-3.5 h-3.5 text-stone-300" />
                <span>Audit Logs</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

          {/* TAB 1: ANALYTICS & DASHBOARD OVERVIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Metric Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div 
                  onClick={() => setActiveTab('studios')}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs cursor-pointer hover:border-[#b86b86] transition group"
                >
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Total Studios</p>
                  <p className="text-2xl font-serif font-bold text-[#26152d] mt-1 group-hover:text-[#b86b86] transition">
                    {analytics.totalStudios}
                  </p>
                  <span className="text-[10px] text-stone-400">Registered on STENZA</span>
                </div>

                <div 
                  onClick={() => setActiveTab('accreditation')}
                  className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs cursor-pointer hover:border-blue-400 transition group"
                >
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Pending Review</p>
                  <p className="text-2xl font-serif font-bold text-blue-900 mt-1">
                    {analytics.pendingAccreditation}
                  </p>
                  <span className="text-[10px] text-blue-600">Awaiting CIPC / ID audit</span>
                </div>

                <div 
                  onClick={() => setActiveTab('studios')}
                  className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs cursor-pointer hover:border-emerald-400 transition group"
                >
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Approved & Active</p>
                  <p className="text-2xl font-serif font-bold text-emerald-900 mt-1">
                    {analytics.approvedStudios}
                  </p>
                  <span className="text-[10px] text-emerald-600">Live on Directory</span>
                </div>

                <div 
                  onClick={() => setActiveTab('promotions')}
                  className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs cursor-pointer hover:border-amber-400 transition group"
                >
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Promoted / Featured</p>
                  <p className="text-2xl font-serif font-bold text-amber-900 mt-1">
                    {analytics.featuredStudios}
                  </p>
                  <span className="text-[10px] text-amber-700">Landing page featured</span>
                </div>

                <div 
                  onClick={() => setActiveTab('reports')}
                  className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs cursor-pointer hover:border-rose-400 transition group"
                >
                  <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Open Reports</p>
                  <p className="text-2xl font-serif font-bold text-rose-900 mt-1">
                    {analytics.openReports}
                  </p>
                  <span className="text-[10px] text-rose-600">Customer complaints</span>
                </div>

                <div 
                  onClick={() => setActiveTab('appeals')}
                  className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs cursor-pointer hover:border-purple-400 transition group"
                >
                  <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Suspended / Restr.</p>
                  <p className="text-2xl font-serif font-bold text-purple-900 mt-1">
                    {analytics.suspendedStudios + analytics.underReviewStudios}
                  </p>
                  <span className="text-[10px] text-purple-600">Under enforcement</span>
                </div>
              </div>

              {/* Quick Action Callout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#b86b86]">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">Landing Page Promotions</h3>
                      <p className="text-xs text-stone-500">Manage featured studios on storefront</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600">
                    Currently <strong>{featuredStudios.length}</strong> studios are highlighted on the public landing page. Only accredited and operational studios can be promoted.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setActiveTab('promotions')}
                      className="px-4 py-2 bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Manage Promotions
                    </button>
                    <button
                      onClick={() => setPreviewLandingOpen(true)}
                      className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      Preview Landing
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                      <Flag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">Customer Reports Desk</h3>
                      <p className="text-xs text-stone-500">{analytics.openReports} complaints require review</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600">
                    Review pricing discrepancies, sanitation concerns, or fraud alerts submitted by verified South African clients.
                  </p>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Investigate Reports
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">Accreditation Reviews</h3>
                      <p className="text-xs text-stone-500">CIPC and National ID Verification</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600">
                    Verify beauty diplomas, certified identity documents, and hygiene compliance before approving new applications.
                  </p>
                  <button
                    onClick={() => setActiveTab('accreditation')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Review New Applicants
                  </button>
                </div>
              </div>

              {/* Recent Audit Timeline Preview */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#b86b86]" />
                    <h3 className="text-sm font-bold text-stone-900">Recent Immutable Audit Trail</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('audit_logs')}
                    className="text-xs font-bold text-[#b86b86] hover:underline"
                  >
                    View All Logs ({auditLogs.length}) →
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-mono text-[10px] text-stone-400 font-bold">{log.id}</span>
                        <span className="font-bold text-stone-900 ml-2">{log.action}</span>
                        <span className="text-stone-600 ml-1.5">• {log.targetName}</span>
                        <p className="text-[11px] text-stone-500 mt-0.5">{log.reason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-stone-400 font-mono text-[11px]">{log.timestamp}</span>
                        <span className="block text-[10px] text-stone-500">{log.adminName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDIO MANAGEMENT */}
          {activeTab === 'studios' && (
            <div className="space-y-4">
              {/* Header & Controls Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#26152d]">
                      Registered Beauty Studios Directory
                    </h2>
                    <p className="text-xs text-stone-500">
                      Manage all verified, pending, and restricted studios. Owner contact details are encrypted and visible to authorized administrators only.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-stone-100 rounded-lg text-xs font-semibold text-stone-700">
                      Total: {filteredStudios.length} studios
                    </span>
                  </div>
                </div>

                {/* Search & Multi-Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Search input */}
                  <div className="lg:col-span-2 relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search studio name, owner, ID, city..."
                      value={studioSearch}
                      onChange={(e) => {
                        setStudioSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <select
                      value={studioCategoryFilter}
                      onChange={(e) => {
                        setStudioCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    >
                      <option value="all">All Categories ({studios.length} studios)</option>
                      {categoryService.getServiceCategories(true).map((cat) => {
                        const count = studios.filter(s => 
                          s.category === cat.name || 
                          mapLegacyCategoryToSlug(s.category) === cat.id
                        ).length;
                        return (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({count})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Approval Status Filter */}
                  <div>
                    <select
                      value={studioApprovalFilter}
                      onChange={(e) => {
                        setStudioApprovalFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    >
                      <option value="all">All Approval Statuses</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending Review</option>
                      <option value="changes_requested">Changes Requested</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Operational Status Filter */}
                  <div>
                    <select
                      value={studioOperationalFilter}
                      onChange={(e) => {
                        setStudioOperationalFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    >
                      <option value="all">All Operational Statuses</option>
                      <option value="active">Active</option>
                      <option value="under_review">Under Review</option>
                      <option value="disabled">Disabled</option>
                      <option value="suspended">Suspended</option>
                      <option value="deleted">Deleted (Archive)</option>
                    </select>
                  </div>
                </div>

                {/* Secondary Sort Ribbon */}
                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-700">Sort by:</span>
                    <button
                      onClick={() => setStudioSortBy('date')}
                      className={`px-2.5 py-1 rounded-lg ${studioSortBy === 'date' ? 'bg-[#26152d] text-white font-bold' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
                    >
                      Registration Date
                    </button>
                    <button
                      onClick={() => setStudioSortBy('name')}
                      className={`px-2.5 py-1 rounded-lg ${studioSortBy === 'name' ? 'bg-[#26152d] text-white font-bold' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
                    >
                      Studio Name
                    </button>
                    <button
                      onClick={() => setStudioSortBy('rating')}
                      className={`px-2.5 py-1 rounded-lg ${studioSortBy === 'rating' ? 'bg-[#26152d] text-white font-bold' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
                    >
                      Rating
                    </button>
                    <button
                      onClick={() => setStudioSortBy('reports')}
                      className={`px-2.5 py-1 rounded-lg ${studioSortBy === 'reports' ? 'bg-[#26152d] text-white font-bold' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
                    >
                      Reports
                    </button>
                  </div>

                  <span className="text-[11px] text-stone-400">
                    Showing Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>

              {/* Studios Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Studio / Business</th>
                        <th className="py-3 px-4">Owner & Contact (Confidential)</th>
                        <th className="py-3 px-4">Category & Location</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Featured Promo</th>
                        <th className="py-3 px-4 text-center">Reports / Audit</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {paginatedStudios.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-stone-400 text-xs">
                            No studios found matching the specified filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedStudios.map((studio) => {
                          const isEligibleToFeature = 
                            studio.approvalStatus === 'approved' && 
                            studio.operationalStatus === 'active' && 
                            !studio.isDeleted;

                          return (
                            <tr key={studio.id} className="hover:bg-stone-50/80 transition-colors">
                              {/* Studio / Business */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={studio.logoUrl || studio.coverUrl}
                                    alt={studio.businessName}
                                    className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <h4 className="font-bold text-stone-900 truncate">{studio.businessName}</h4>
                                      {studio.isFeatured && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-800 font-bold border border-amber-300">
                                          ★ #{studio.featuredOrder}
                                        </span>
                                      )}
                                    </div>
                                    <p className="font-mono text-[10px] text-stone-400">
                                      {studio.id} • Registered {studio.registrationDate}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Owner & Contact */}
                              <td className="py-3.5 px-4">
                                <div>
                                  <div className="font-semibold text-stone-800 flex items-center gap-1">
                                    <User className="w-3 h-3 text-stone-400" />
                                    <span>{studio.founderName}</span>
                                  </div>
                                  <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1 mt-0.5">
                                    <Phone className="w-2.5 h-2.5 text-stone-400" />
                                    <span>{studio.phone}</span>
                                  </div>
                                  <div className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded inline-block mt-0.5 border border-emerald-100">
                                    RSA ID: {studio.idNumber ? `${studio.idNumber.slice(0, 6)}...` : 'Verified'}
                                  </div>
                                </div>
                              </td>

                              {/* Category & Location */}
                              <td className="py-3.5 px-4">
                                <div>
                                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                                    {studio.category}
                                  </span>
                                  <p className="text-[11px] text-stone-600 flex items-center gap-1 mt-1 truncate">
                                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                                    <span>{studio.suburb}, {studio.city}</span>
                                  </p>
                                </div>
                              </td>

                              {/* Statuses */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <div>{getApprovalBadge(studio.approvalStatus)}</div>
                                  <div>{getOperationalBadge(studio.operationalStatus)}</div>
                                </div>
                              </td>

                              {/* Featured Toggle */}
                              <td className="py-3.5 px-4 text-center">
                                <div className="inline-flex flex-col items-center">
                                  <button
                                    onClick={() => handleToggleFeatured(studio)}
                                    disabled={!isEligibleToFeature}
                                    title={
                                      !isEligibleToFeature 
                                        ? `Only Approved & Active studios can be featured. Current: ${studio.approvalStatus} / ${studio.operationalStatus}`
                                        : studio.isFeatured ? 'Click to remove from homepage featured showcase' : 'Click to feature on homepage'
                                    }
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                      studio.isFeatured 
                                        ? 'bg-amber-500' 
                                        : !isEligibleToFeature 
                                        ? 'bg-stone-200 opacity-50 cursor-not-allowed' 
                                        : 'bg-stone-300 hover:bg-stone-400'
                                    }`}
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                        studio.isFeatured ? 'translate-x-4' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>
                                  <span className="text-[9px] font-semibold text-stone-500 mt-0.5">
                                    {studio.isFeatured ? `Featured (#${studio.featuredOrder})` : isEligibleToFeature ? 'Not Featured' : 'Ineligible'}
                                  </span>
                                </div>
                              </td>

                              {/* Reports / Moderation */}
                              <td className="py-3.5 px-4 text-center">
                                <div>
                                  {studio.reportCount > 0 ? (
                                    <button
                                      onClick={() => {
                                        setReportSearch(studio.businessName);
                                        setActiveTab('reports');
                                      }}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 transition"
                                    >
                                      <Flag className="w-2.5 h-2.5 text-rose-600" />
                                      <span>{studio.reportCount} Reports</span>
                                    </button>
                                  ) : (
                                    <span className="text-stone-400 text-[11px]">0 Reports</span>
                                  )}

                                  {studio.warnings.length > 0 && (
                                    <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                                      {studio.warnings.length} warning(s)
                                    </p>
                                  )}
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setDrawerStudio(studio)}
                                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                                    title="View Full Profile Drawer"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => setEditStudio(studio)}
                                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                                    title="Edit Administrative Info"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  {/* Quick Enforcement Trigger */}
                                  {studio.operationalStatus === 'suspended' ? (
                                    <button
                                      onClick={() => handleOpenEnforcement(studio, 'reinstate')}
                                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                                      title="Reinstate Studio"
                                    >
                                      <RotateCcw className="w-3 h-3 text-emerald-600" />
                                      <span>Reinstate</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenEnforcement(studio, 'warn')}
                                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition"
                                      title="Moderation Actions"
                                    >
                                      Enforce
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

                {/* Pagination Controls */}
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                  <span>
                    Showing {paginatedStudios.length} of {filteredStudios.length} studios
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-white border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-100 cursor-pointer"
                    >
                      Previous
                    </button>
                    <span className="font-semibold text-stone-800">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-white border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-100 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CATEGORY MANAGEMENT & GOVERNANCE */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Category Toast Alert */}
              {categoryToast && (
                <div className="p-4 bg-emerald-900/90 border border-emerald-500/50 text-white rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{categoryToast}</span>
                  </div>
                  <button
                    onClick={() => setCategoryToast(null)}
                    className="text-stone-300 hover:text-white text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Category Header Banner */}
              <div className="bg-gradient-to-r from-[#26152d] to-[#1b0d21] text-white p-6 rounded-3xl shadow-md border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-pink-400/20 text-pink-300 border border-pink-400/40 text-[10px] font-bold uppercase tracking-wider">
                      TAXONOMY & CATEGORY GOVERNANCE
                    </span>
                    <span className="text-xs text-stone-400">Services & Physical Products</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white">
                    Marketplace Categories & Catalog Taxonomy
                  </h2>
                  <p className="text-xs text-stone-300 max-w-2xl mt-1">
                    Supervise active categories across Hair & Styling, Beauty Services, Beauty & Personal Care Products, and Fashion. Inactive categories are prevented from being selected for new studio registrations or filters, while preserving all existing studio registrations.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={handleResetCategories}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold transition flex items-center gap-2 cursor-pointer border border-white/10"
                    title="Reset all categories to default platform configuration"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>

              {/* Category Taxonomy Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Categories</span>
                  <span className="text-xl font-bold font-serif text-[#26152d] mt-1 block">
                    {categoriesList.length}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">Configured taxonomy</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Active Live</span>
                  <span className="text-xl font-bold font-serif text-emerald-700 mt-1 block">
                    {categoriesList.filter((c) => c.isActive && !c.isFutureOptional).length}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">Publicly browseable</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#695684] uppercase tracking-wider block">Bookable Services</span>
                  <span className="text-xl font-bold font-serif text-[#695684] mt-1 block">
                    {categoriesList.filter((c) => c.type === 'SERVICE').length}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">Hair & Beauty Studios</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider block">Product Collections</span>
                  <span className="text-xl font-bold font-serif text-pink-700 mt-1 block">
                    {categoriesList.filter((c) => c.type === 'PRODUCT').length}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">Apothecary & Fashion</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Roadmap Staged</span>
                  <span className="text-xl font-bold font-serif text-amber-700 mt-1 block">
                    {categoriesList.filter((c) => c.isFutureOptional).length}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">Tattoo, Bridal, Teeth</span>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search category name, slug or keyword..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  {/* Group Filter */}
                  <div>
                    <select
                      value={categoryGroupFilter}
                      onChange={(e) => setCategoryGroupFilter(e.target.value)}
                      className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    >
                      <option value="all">All Groups (4 Parent Groups)</option>
                      <option value="Hair & Styling">Hair & Styling</option>
                      <option value="Beauty Services">Beauty Services</option>
                      <option value="Beauty & Personal Care Products">Beauty & Personal Care Products</option>
                      <option value="Fashion & Accessories">Fashion & Accessories</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <select
                      value={categoryTypeFilter}
                      onChange={(e) => setCategoryTypeFilter(e.target.value)}
                      className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    >
                      <option value="all">All Types (Services & Products)</option>
                      <option value="SERVICE">SERVICE (Bookable Studio Treatments)</option>
                      <option value="PRODUCT">PRODUCT (Shopping & Retail Drops)</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={categoryStatusFilter}
                      onChange={(e) => setCategoryStatusFilter(e.target.value)}
                      className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    >
                      <option value="all">All Statuses (Active & Inactive)</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>
                </div>

                {/* Categories Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Category & Stable Slug</th>
                        <th className="py-3 px-4">Parent Group</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Live Studios</th>
                        <th className="py-3 px-4">Catalog Items</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-right">Status & Activation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {categoriesList
                        .filter((cat) => {
                          if (categoryGroupFilter !== 'all' && cat.group !== categoryGroupFilter) return false;
                          if (categoryTypeFilter !== 'all' && cat.type !== categoryTypeFilter) return false;
                          if (categoryStatusFilter === 'active' && !cat.isActive) return false;
                          if (categoryStatusFilter === 'inactive' && cat.isActive) return false;

                          if (categorySearch.trim() !== '') {
                            const q = categorySearch.toLowerCase();
                            const matchName = cat.name.toLowerCase().includes(q);
                            const matchId = cat.id.toLowerCase().includes(q);
                            const matchDesc = cat.shortDescription.toLowerCase().includes(q);
                            const matchGroup = cat.group.toLowerCase().includes(q);
                            const matchKw = cat.keywords?.some((k) => k.toLowerCase().includes(q));
                            if (!matchName && !matchId && !matchDesc && !matchGroup && !matchKw) return false;
                          }

                          return true;
                        })
                        .map((cat) => {
                          const studioCount = categoryMetrics.studioCounts[cat.id] || 0;
                          const productCount = categoryMetrics.productCounts[cat.id] || 0;

                          return (
                            <tr key={cat.id} className="hover:bg-stone-50/60 transition-colors">
                              {/* Category Name & Slug */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                                  />
                                  <div>
                                    <div className="font-serif font-bold text-sm text-[#26152d] flex items-center gap-1.5">
                                      <span>{cat.name}</span>
                                      {cat.isFutureOptional && (
                                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-300">
                                          Roadmap
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                                      slug: <span className="text-[#695684]">{cat.id}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Parent Group */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 text-stone-800">
                                  {cat.group}
                                </span>
                              </td>

                              {/* Type: SERVICE vs PRODUCT */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    cat.type === 'SERVICE'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-purple-100 text-purple-800 border border-purple-300'
                                  }`}
                                >
                                  {cat.type === 'SERVICE' ? (
                                    <>
                                      <Scissors className="w-3 h-3 text-emerald-700" />
                                      <span>Service</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag className="w-3 h-3 text-purple-700" />
                                      <span>Product</span>
                                    </>
                                  )}
                                </span>
                              </td>

                              {/* Live Studios Count */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-semibold text-stone-800">
                                  {studioCount} {studioCount === 1 ? 'studio' : 'studios'}
                                </span>
                              </td>

                              {/* Catalog Products Count */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-semibold text-stone-800">
                                  {productCount} {productCount === 1 ? 'item' : 'items'}
                                </span>
                              </td>

                              {/* Short Description */}
                              <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                                <span title={cat.shortDescription}>{cat.shortDescription}</span>
                              </td>

                              {/* Status & Toggle Switch */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-3">
                                  <span
                                    className={`text-[11px] font-bold uppercase tracking-wider ${
                                      cat.isActive ? 'text-emerald-700' : 'text-stone-400'
                                    }`}
                                  >
                                    {cat.isActive ? 'Active' : 'Inactive'}
                                  </span>

                                  <button
                                    onClick={() => handleToggleCategoryActive(cat.id, cat.isActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                      cat.isActive ? 'bg-emerald-600' : 'bg-stone-300'
                                    }`}
                                    title={cat.isActive ? 'Click to deactivate category' : 'Click to activate category'}
                                  >
                                    <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                                        cat.isActive ? 'translate-x-6' : 'translate-x-1'
                                      }`}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Backend REST API Contract Documentation Card */}
              <div className="bg-stone-900 text-stone-100 p-6 rounded-3xl border border-stone-800 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
                    INTEGRATION CONTRACTS (JAVA SPRING BOOT & MYSQL)
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Proposed Backend Category REST Endpoints
                </h3>
                <p className="text-xs text-stone-400 max-w-3xl leading-relaxed">
                  These contracts define the recommended Spring Boot REST controllers for serving the taxonomy. Category identifiers use stable immutable slugs (e.g., <code className="text-amber-300 font-mono">hair-styling</code>, <code className="text-amber-300 font-mono">skincare-facials</code>, <code className="text-amber-300 font-mono">makeup-cosmetics</code>) ensuring display name improvements never break historical database foreign keys or past bookings.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-black/40 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-emerald-400 font-bold block">GET /api/public/categories</span>
                    <span className="text-stone-400 text-[11px] block">Returns all active categories grouped by the 4 main parent groups.</span>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-emerald-400 font-bold block">GET /api/public/categories/&#123;slug&#125;</span>
                    <span className="text-stone-400 text-[11px] block">Returns category details, description, metadata, and service/product type.</span>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-blue-400 font-bold block">GET /api/public/studios?category=&#123;slug&#125;</span>
                    <span className="text-stone-400 text-[11px] block">Filters verified studios by specific service category slug.</span>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-blue-400 font-bold block">GET /api/public/products?category=&#123;slug&#125;</span>
                    <span className="text-stone-400 text-[11px] block">Filters curated apothecary and fashion drops by product category slug.</span>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-amber-400 font-bold block">GET /api/admin/categories</span>
                    <span className="text-stone-400 text-[11px] block">Admin-secured endpoint returning all categories with studio & product metrics.</span>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-amber-400 font-bold block">PATCH /api/admin/categories/&#123;id&#125;/status</span>
                    <span className="text-stone-400 text-[11px] block">Admin endpoint to toggle activation. Inactive categories are rejected on new registrations.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LANDING PAGE & STOREFRONT PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              {/* Promotion Header Banner */}
              <div className="bg-gradient-to-r from-[#26152d] to-[#1b0d21] text-white p-6 rounded-3xl shadow-md border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase tracking-wider">
                      STOREFRONT & PROMOTIONS MANAGEMENT
                    </span>
                    <span className="text-xs text-stone-400">Marketing & Storefront Display</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white">
                    Advertising, Deals & Landing Showcase
                  </h2>
                  <p className="text-xs text-stone-300 max-w-2xl mt-1">
                    Manage public promotional deals, discount campaigns, and homepage featured studio positioning. Unapproved, suspended, or expired promotions are automatically blocked from public display.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setPreviewLandingOpen(true)}
                    className="px-4 py-2.5 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview Storefront</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <button
                  onClick={() => setPromotionsSubTab('offers')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    promotionsSubTab === 'offers'
                      ? 'bg-[#26152d] text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Special Offers & Discounts</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    promotionsSubTab === 'offers' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {promotionsList.length}
                  </span>
                </button>

                <button
                  onClick={() => setPromotionsSubTab('featured_studios')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    promotionsSubTab === 'featured_studios'
                      ? 'bg-[#26152d] text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Homepage Featured Studios</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    promotionsSubTab === 'featured_studios' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {featuredStudios.length}
                  </span>
                </button>
              </div>

              {/* SUBTAB 1: SPECIAL OFFERS & DISCOUNTS */}
              {promotionsSubTab === 'offers' && (
                <div className="space-y-5">
                  {/* Status / Metric Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Live in Store</span>
                      <div className="text-2xl font-serif font-bold text-emerald-900 mt-0.5">
                        {promotionsList.filter(p => {
                          const today = new Date().toISOString().split('T')[0];
                          return p.isPublished && p.approvalStatus === 'approved' && p.expiryDate >= today;
                        }).length}
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-1">Visible on Updates & Offers page</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending Review</span>
                      <div className="text-2xl font-serif font-bold text-amber-900 mt-0.5">
                        {promotionsList.filter(p => p.approvalStatus === 'pending').length}
                      </div>
                      <p className="text-[11px] text-amber-700 mt-1">Awaiting moderation approval</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Unpublished Drafts</span>
                      <div className="text-2xl font-serif font-bold text-stone-800 mt-0.5">
                        {promotionsList.filter(p => !p.isPublished && p.approvalStatus === 'approved').length}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">Approved but paused by admin/studio</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Expired Deals</span>
                      <div className="text-2xl font-serif font-bold text-rose-900 mt-0.5">
                        {promotionsList.filter(p => p.expiryDate < new Date().toISOString().split('T')[0]).length}
                      </div>
                      <p className="text-[11px] text-rose-700 mt-1">Automatically hidden from clients</p>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6 relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search promotions by title or studio name..."
                        value={promoSearch}
                        onChange={(e) => setPromoSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={promoSectionFilter}
                        onChange={(e) => setPromoSectionFilter(e.target.value)}
                        className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                      >
                        <option value="all">All Placement Sections</option>
                        <option value="special_offers">Special Offers & Discounts</option>
                        <option value="new_studios">New Studios Spotlight</option>
                        <option value="ending_soon">Promotions Ending Soon</option>
                        <option value="latest_updates">Latest Studio Updates</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={promoStatusFilter}
                        onChange={(e) => setPromoStatusFilter(e.target.value)}
                        className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                      >
                        <option value="all">All Statuses</option>
                        <option value="published">Live & Published</option>
                        <option value="unpublished">Unpublished / Paused</option>
                        <option value="pending">Pending Approval</option>
                        <option value="expired">Expired (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* Promotions Table / List */}
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                    <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Registered Promotions Queue ({filteredPromotions.length})
                      </h3>
                      <span className="text-[11px] text-stone-500">
                        Spring Boot API Contract: <code className="text-[#b86b86]">/api/admin/promotions/**</code>
                      </span>
                    </div>

                    {filteredPromotions.length === 0 ? (
                      <div className="p-12 text-center text-stone-400 text-xs">
                        No promotions match the current filter criteria.
                      </div>
                    ) : (
                      <div className="divide-y divide-stone-100">
                        {filteredPromotions.map((promo) => {
                          const today = new Date().toISOString().split('T')[0];
                          const isExpired = promo.expiryDate < today;
                          const isLive = promo.isPublished && promo.approvalStatus === 'approved' && !isExpired;

                          return (
                            <div key={promo.id} className="p-4 hover:bg-stone-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <img
                                  src={promo.studioImage}
                                  alt={promo.studioName}
                                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                                />
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                      {promo.id}
                                    </span>
                                    <h4 className="font-bold text-sm text-[#26152d]">{promo.title}</h4>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b86b86]/10 text-[#b86b86] border border-[#b86b86]/30">
                                      {promo.discountBadge}
                                    </span>
                                  </div>

                                  <p className="text-xs text-stone-600 line-clamp-1">
                                    {promo.shortDescription}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
                                    <span>Studio: <strong className="text-stone-800">{promo.studioName}</strong> ({promo.studioCategory})</span>
                                    <span>•</span>
                                    <span>Valid: <strong>{promo.startDate}</strong> to <strong className={isExpired ? 'text-rose-600 font-bold' : ''}>{promo.expiryDate}</strong></span>
                                    {promo.promotionalPrice && (
                                      <>
                                        <span>•</span>
                                        <span>Price: <strong className="text-emerald-700">R{promo.promotionalPrice}</strong> {promo.originalPrice && <span className="line-through text-stone-400">R{promo.originalPrice}</span>}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 self-end md:self-center shrink-0">
                                {/* Status Badge */}
                                {isExpired ? (
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-300">
                                    Expired (Auto-hidden)
                                  </span>
                                ) : promo.approvalStatus === 'pending' ? (
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                    Pending Review
                                  </span>
                                ) : isLive ? (
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    Live in Store
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                                    Unpublished
                                  </span>
                                )}

                                {/* Approval Action for Pending */}
                                {promo.approvalStatus === 'pending' && (
                                  <button
                                    onClick={() => handleApprovePromotion(promo.id)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                                  >
                                    Approve & Publish
                                  </button>
                                )}

                                {/* Publish / Unpublish Toggle */}
                                {promo.approvalStatus === 'approved' && (
                                  <button
                                    onClick={() => handleTogglePromotionPublished(promo)}
                                    disabled={isExpired}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                                      isExpired
                                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                                        : promo.isPublished
                                        ? 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                    }`}
                                  >
                                    {promo.isPublished ? 'Unpublish' : 'Publish to Store'}
                                  </button>
                                )}

                                {/* Delete Action */}
                                <button
                                  onClick={() => handleDeletePromotion(promo)}
                                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                  title="Delete Promotion"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: HOMEPAGE FEATURED STUDIOS SHOWCASE */}
              {promotionsSubTab === 'featured_studios' && (
                <div className="space-y-6">

              {/* Status / Count Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Featured Studios Active</span>
                  <div className="text-2xl font-serif font-bold text-[#b86b86] mt-0.5">
                    {featuredStudios.length} <span className="text-xs text-stone-400 font-sans font-normal">/ 6 max recommended</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Directly live on homepage hero carousel</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Eligible Pool</span>
                  <div className="text-2xl font-serif font-bold text-emerald-900 mt-0.5">
                    {studios.filter(s => s.approvalStatus === 'approved' && s.operationalStatus === 'active' && !s.isDeleted).length}
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1">Fully approved & active studios</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Blocked / Ineligible</span>
                  <div className="text-2xl font-serif font-bold text-rose-900 mt-0.5">
                    {studios.filter(s => s.approvalStatus !== 'approved' || s.operationalStatus !== 'active' || s.isDeleted).length}
                  </div>
                  <p className="text-[11px] text-rose-700 mt-1">Pending, suspended, or disabled</p>
                </div>
              </div>

              {/* Currently Featured Studios with Reordering */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-base font-bold text-[#26152d]">
                      Featured Studios Display Order
                    </h3>
                    <p className="text-xs text-stone-500">
                      These studios appear directly on the homepage in this exact sequence. Use the up and down arrows to rearrange their priority.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-lg">
                    {featuredStudios.length} Live Items
                  </span>
                </div>

                {featuredStudios.length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 rounded-xl text-stone-400 text-xs">
                    No studios are currently featured. Select an approved studio below to add it to the landing page.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {featuredStudios.map((studio, idx) => (
                      <div
                        key={studio.id}
                        className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-[#b86b86] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                      >
                        <div className="flex items-center gap-4">
                          {/* Order Badge */}
                          <div className="w-8 h-8 rounded-xl bg-[#26152d] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            #{idx + 1}
                          </div>

                          <img
                            src={studio.coverUrl || studio.logoUrl}
                            alt={studio.businessName}
                            className="w-16 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-stone-900">{studio.businessName}</h4>
                              <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                Approved & Active
                              </span>
                            </div>
                            <p className="text-xs text-stone-500">
                              {studio.category} • {studio.suburb}, {studio.city} • Rating: <strong>{studio.rating} ★</strong> ({studio.reviewCount} reviews)
                            </p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* Reorder Buttons */}
                          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                            <button
                              onClick={() => handleReorderFeatured(studio.id, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded-lg hover:bg-white text-stone-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                              title="Move up in display order"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReorderFeatured(studio.id, 'down')}
                              disabled={idx === featuredStudios.length - 1}
                              className="p-1 rounded-lg hover:bg-white text-stone-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                              title="Move down in display order"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Unfeature Toggle */}
                          <button
                            onClick={() => handleToggleFeatured(studio)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                          >
                            Remove from Featured
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Eligible Approved Studios Ready to be Promoted */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-base font-bold text-[#26152d]">
                      Eligible Approved Studios (Not Featured)
                    </h3>
                    <p className="text-xs text-stone-500">
                      These studios satisfy all compliance standards and can be added to the landing page promotions with a single click.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg">
                    {nonFeaturedApprovedStudios.length} Available
                  </span>
                </div>

                {nonFeaturedApprovedStudios.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">
                    All currently eligible approved studios are already featured.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nonFeaturedApprovedStudios.map((studio) => (
                      <div
                        key={studio.id}
                        className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-stone-300 transition flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={studio.logoUrl || studio.coverUrl}
                            alt={studio.businessName}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-stone-900 truncate">{studio.businessName}</h5>
                            <p className="text-[11px] text-stone-500 truncate">
                              {studio.category} • {studio.city}
                            </p>
                            <span className="text-[10px] text-amber-700 font-semibold">
                              {studio.rating} ★ ({studio.reviewCount} reviews)
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleFeatured(studio)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>+ Feature</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

          {/* TAB 4: REPORTS & COMPLAINTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#26152d]">
                      Customer Complaints & Fraud Investigation Queue
                    </h2>
                    <p className="text-xs text-stone-500">
                      Investigate reports submitted by clients regarding pricing breaches, sanitation issues, or fraudulent conduct.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                      {reports.filter(r => r.status === 'OPEN').length} Open Reports
                    </span>
                  </div>
                </div>

                {/* Filter and Search */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search reports by reference, studio, or client..."
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    />
                  </div>

                  <div>
                    <select
                      value={reportStatusFilter}
                      onChange={(e) => setReportStatusFilter(e.target.value)}
                      className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                    >
                      <option value="all">All Investigation Statuses</option>
                      <option value="OPEN">OPEN (Requires Attention)</option>
                      <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="DISMISSED">DISMISSED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reports List */}
              <div className="space-y-3">
                {filteredReports.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
                    No reports match the selected filters.
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 hover:border-stone-300 transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#b86b86] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                            {report.id}
                          </span>
                          <span className="font-bold text-sm text-stone-900">{report.studioName}</span>
                          <span className="text-xs text-stone-400 font-mono">({report.studioId})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-400">Submitted: {report.dateSubmitted}</span>
                          {getReportStatusBadge(report.status)}
                        </div>
                      </div>

                      {/* Complaint Category & Body */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-8 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              {report.categoryLabel}
                            </span>
                            <span className="text-xs text-stone-500">
                              Reporter: <strong>{report.reporterName}</strong> ({report.reporterEmail})
                            </span>
                          </div>

                          <p className="text-xs text-stone-800 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                            "{report.description}"
                          </p>

                          {/* Evidence link if provided */}
                          {report.evidenceUrl && (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[11px] text-stone-500 font-semibold">Attached Evidence:</span>
                              <a
                                href={report.evidenceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-[#b86b86] font-bold underline"
                              >
                                <FileText className="w-3 h-3" />
                                <span>{report.evidenceFileName || 'Supporting Attachment'}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          )}

                          {/* Decision Note if resolved */}
                          {report.decision && (
                            <div className="mt-2 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs">
                              <span className="font-bold text-emerald-900 block mb-0.5">
                                Official Resolution ({report.resolutionDate} by {report.assignedAdmin}):
                              </span>
                              <p className="text-emerald-800">{report.decision}</p>
                              {report.actionTaken && (
                                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                                  Action: {report.actionTaken}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions Column */}
                        <div className="md:col-span-4 flex flex-col justify-between gap-3 border-t md:border-t-0 md:border-l border-stone-100 md:pl-4 pt-3 md:pt-0">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">Assigned Officer</span>
                            <span className="text-xs font-semibold text-stone-800">
                              {report.assignedAdmin || 'Unassigned'}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="w-full py-2 bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Investigate & Decide</span>
                            </button>

                            <button
                              onClick={() => {
                                const st = studios.find(s => s.id === report.studioId);
                                if (st) {
                                  handleOpenEnforcement(st, 'warn');
                                } else {
                                  alert('Studio record not found.');
                                }
                              }}
                              className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                            >
                              Direct Enforcement
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ENFORCEMENT & APPEALS */}
          {activeTab === 'appeals' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#26152d]">
                      Studio Enforcement Actions & Appeals Queue
                    </h2>
                    <p className="text-xs text-stone-500">
                      Review written appeals submitted by studio owners seeking reinstatement from suspensions or penalties.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg">
                    {appeals.filter(a => a.status === 'PENDING').length} Pending Appeals
                  </span>
                </div>
              </div>

              {/* Appeals List */}
              <div className="space-y-3">
                {appeals.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
                    No active appeals pending review.
                  </div>
                ) : (
                  appeals.map((appeal) => (
                    <div
                      key={appeal.id}
                      className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#b86b86] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                            {appeal.id}
                          </span>
                          <h4 className="font-bold text-sm text-stone-900">{appeal.studioName}</h4>
                          <span className="text-xs text-stone-500">by {appeal.ownerName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-400">Submitted: {appeal.submittedAt}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            appeal.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : appeal.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {appeal.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[11px] font-bold text-stone-700 block uppercase tracking-wider">
                            Appeal Justification:
                          </span>
                          <p className="text-xs text-stone-800 font-medium mt-0.5">
                            "{appeal.appealReason}"
                          </p>
                        </div>

                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <span className="text-[11px] font-semibold text-stone-500 block mb-0.5">
                            Supporting Statement & Corrective Action Taken:
                          </span>
                          <p className="text-xs text-stone-700 leading-relaxed">
                            {appeal.supportingStatement}
                          </p>
                        </div>

                        {appeal.adminDecisionNotes && (
                          <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-700">
                            <span className="font-bold block">Officer Note:</span>
                            {appeal.adminDecisionNotes}
                          </div>
                        )}
                      </div>

                      {/* Appeal Actions */}
                      {appeal.status === 'PENDING' && (
                        <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                          <button
                            onClick={() => handleRejectAppeal(appeal)}
                            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            Dismiss Appeal
                          </button>
                          <button
                            onClick={() => handleApproveAppeal(appeal)}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
                          >
                            Accept Appeal & Reinstate Studio
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ACCREDITATION REVIEWS (Preserved Original) */}
          {activeTab === 'accreditation' && (
            <div className="space-y-6">
              {/* Metric Summary Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Total Submissions</p>
                  <p className="text-2xl font-bold text-stone-900 mt-1">{applications.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
                  <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Pending Action</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {applications.filter((a) => a.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Changes Requested</p>
                  <p className="text-2xl font-bold text-amber-900 mt-1">
                    {applications.filter((a) => a.status === 'changes_requested').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
                  <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Approved Studios</p>
                  <p className="text-2xl font-bold text-emerald-900 mt-1">
                    {applications.filter((a) => a.status === 'approved').length}
                  </p>
                </div>
              </div>

              {/* Master-Detail Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Applications List (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4">
                    {/* Search */}
                    <div className="relative mb-3">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search applicant, studio or ref..."
                        value={accreditationSearch}
                        onChange={(e) => setAccreditationSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-[#b86b86]"
                      />
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex gap-1 overflow-x-auto pb-1 mb-3 text-[11px] font-medium text-stone-600">
                      {['all', 'pending', 'changes_requested', 'approved', 'rejected'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setAccreditationFilterStatus(st)}
                          className={`px-2.5 py-1 rounded-md shrink-0 capitalize cursor-pointer transition ${
                            accreditationFilterStatus === st
                              ? 'bg-[#26152d] text-white font-semibold'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {st === 'changes_requested' ? 'Changes' : st}
                        </button>
                      ))}
                    </div>

                    {/* Applications List */}
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                      {filteredApps.length === 0 ? (
                        <div className="text-center py-8 text-stone-400 text-xs">
                          No applications match current filters.
                        </div>
                      ) : (
                        filteredApps.map((app) => {
                          const isSelected = app.id === selectedApp?.id;
                          return (
                            <div
                              key={app.id}
                              onClick={() => setSelectedAppId(app.id)}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-pink-50/60 border-[#b86b86] shadow-xs'
                                  : 'bg-white hover:bg-stone-50 border-stone-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className="font-mono text-[10px] text-stone-500 font-bold">{app.id}</span>
                                {getApprovalBadge(app.status as ApprovalStatus)}
                              </div>
                              <h4 className="text-sm font-bold text-stone-900 truncate">{app.businessName}</h4>
                              <p className="text-xs text-stone-600">{app.applicantName} • {app.category}</p>
                              <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 pt-2 border-t border-stone-100">
                                <span>{app.city}</span>
                                <span>{app.documents.length} docs</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Detailed Review & Actions (8 cols) */}
                <div className="lg:col-span-8">
                  {selectedApp ? (
                    <div className="space-y-6">
                      {/* Header & Main Status */}
                      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-[#b86b86] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                                {selectedApp.id}
                              </span>
                              <span className="text-xs text-stone-500">Submitted: {selectedApp.submissionDate}</span>
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-[#26152d]">
                              {selectedApp.businessName}
                            </h2>
                            <p className="text-sm text-stone-600">
                              Applicant: <strong className="text-stone-900">{selectedApp.applicantName}</strong> • {selectedApp.category} ({selectedApp.experienceYears} Years Exp.)
                            </p>
                          </div>

                          <div className="flex flex-col items-start sm:items-end gap-1">
                            <span className="text-xs uppercase font-semibold text-stone-400">Current Status</span>
                            {getApprovalBadge(selectedApp.status as ApprovalStatus)}
                          </div>
                        </div>

                        {/* Previous Admin Review Notes */}
                        {selectedApp.adminDecisionReason && (
                          <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase mb-1">
                              <MessageSquare className="w-3.5 h-3.5 text-[#b86b86]" />
                              Official Decision Log • {selectedApp.reviewedBy || 'Admin Desk'} ({selectedApp.reviewedAt})
                            </div>
                            <p className="text-xs sm:text-sm text-stone-800 italic">
                              "{selectedApp.adminDecisionReason}"
                            </p>
                          </div>
                        )}

                        {/* Applicant Detail Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs sm:text-sm">
                          {/* Column 1 */}
                          <div className="space-y-3 bg-stone-50/60 p-4 rounded-xl border border-stone-100">
                            <h4 className="font-bold text-stone-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                              <User className="w-4 h-4 text-stone-500" />
                              Identity & Contact Verification
                            </h4>
                            <div>
                              <span className="text-stone-500 text-xs block">South African ID Number</span>
                              <span className="font-mono font-semibold text-stone-900">{selectedApp.idNumber}</span>
                            </div>
                            <div>
                              <span className="text-stone-500 text-xs block">Contact Phone / WhatsApp</span>
                              <span className="font-semibold text-stone-900">{selectedApp.phone}</span>
                            </div>
                            <div>
                              <span className="text-stone-500 text-xs block">Email Address</span>
                              <span className="font-semibold text-stone-900">{selectedApp.email}</span>
                            </div>
                            <div>
                              <span className="text-stone-500 text-xs block">Social / Portfolio Handle</span>
                              <span className="font-semibold text-[#b86b86]">{selectedApp.instagram}</span>
                            </div>
                          </div>

                          {/* Column 2 */}
                          <div className="space-y-3 bg-stone-50/60 p-4 rounded-xl border border-stone-100">
                            <h4 className="font-bold text-stone-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-stone-500" />
                              Studio Location & House Calls
                            </h4>
                            <div>
                              <span className="text-stone-500 text-xs block">Physical Studio Address</span>
                              <span className="font-semibold text-stone-900 leading-tight block">{selectedApp.address}</span>
                            </div>
                            <div>
                              <span className="text-stone-500 text-xs block">House Calls / Mobile Option</span>
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                                {selectedApp.offersHouseCalls ? '✓ Yes, Mobile Service Enabled' : 'No (Studio Only)'}
                              </span>
                            </div>
                            {selectedApp.offersHouseCalls && (
                              <div>
                                <span className="text-stone-500 text-xs block">Mobile Radius & Base Travel Fee</span>
                                <span className="font-semibold text-stone-900">
                                  {selectedApp.serviceRadius} • <strong className="text-stone-900">R{selectedApp.travelFee}</strong> base
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="text-stone-500 text-xs block">Terms & POPIA Consent</span>
                              <span className="font-medium text-emerald-800">
                                ✓ Confirmed & Legally Bound (POPIA SA Act 4 of 2013)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                            Professional Statement / Bio
                          </span>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                            {selectedApp.bio}
                          </p>
                        </div>
                      </div>

                      {/* Verification Documents Review */}
                      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-bold text-[#26152d] flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#b86b86]" />
                            Uploaded Documents for Accreditation ({selectedApp.documents.length})
                          </h3>
                          <span className="text-xs text-stone-500">Click document to preview or audit</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedApp.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition flex items-start justify-between gap-3"
                            >
                              <div className="space-y-1 min-w-0">
                                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                                  {doc.type}
                                </span>
                                <h5 className="text-xs font-bold text-stone-900 truncate">{doc.title}</h5>
                                <p className="text-[11px] text-stone-500 font-mono">
                                  {doc.fileName} • {doc.fileSize}
                                </p>
                              </div>

                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-xs rounded-lg font-medium flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                              >
                                <Eye className="w-3.5 h-3.5 text-stone-500" />
                                <span>Audit</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Administrator Action Bar */}
                      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-bold text-[#26152d]">Administrative Decision</h4>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Enforce marketplace standards. Approving grants the artisan full capability to publish their studio profile.
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Request Changes */}
                            <button
                              onClick={() => handleOpenActionModal('changes')}
                              className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <AlertCircle className="w-4 h-4 text-amber-700" />
                              <span>Request Changes</span>
                            </button>

                            {/* Reject */}
                            <button
                              onClick={() => handleOpenActionModal('reject')}
                              className="px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <X className="w-4 h-4 text-rose-700" />
                              <span>Reject</span>
                            </button>

                            {/* Approve */}
                            <button
                              onClick={() => handleOpenActionModal('approve')}
                              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve Application</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
                      Select an artisan application from the list to review details.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOGS */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#26152d]">
                      Immutable Administrative Audit Logs
                    </h2>
                    <p className="text-xs text-stone-500">
                      Tamper-evident record of all accreditation approvals, promotions, warnings, suspensions, and report resolutions.
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-mono font-semibold rounded-lg">
                    {auditLogs.length} Logged Entries
                  </span>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="font-semibold text-stone-600">Filter Target:</span>
                  {['all', 'studio', 'promotion', 'report', 'appeal'].map((target) => (
                    <button
                      key={target}
                      onClick={() => setAuditActionFilter(target)}
                      className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition ${
                        auditActionFilter === target
                          ? 'bg-[#26152d] text-white font-bold'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {target}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logs Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Log ID & Timestamp</th>
                        <th className="py-3 px-4">Officer</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Target Record</th>
                        <th className="py-3 px-4">Audit Justification</th>
                        <th className="py-3 px-4 text-right">Terminal IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                      {filteredAuditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-stone-400 font-sans text-xs">
                            No audit logs matching this category.
                          </td>
                        </tr>
                      ) : (
                        filteredAuditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-stone-900">
                              <div>{log.id}</div>
                              <span className="text-[10px] text-stone-400 font-normal">{log.timestamp}</span>
                            </td>
                            <td className="py-3.5 px-4 font-sans text-stone-700">
                              <span className="font-bold">{log.adminId}</span>
                              <span className="block text-[10px] text-stone-400">{log.adminName}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-sans">
                              <span className="font-semibold text-stone-900">{log.targetName}</span>
                              <span className="block font-mono text-[10px] text-stone-400">
                                {log.targetType} • {log.targetId}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-sans text-stone-600 max-w-xs">
                              <p className="line-clamp-2">{log.reason}</p>
                              {log.newState && (
                                <span className="block font-mono text-[9px] text-[#b86b86] mt-0.5">
                                  State: {log.newState}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right text-stone-400 text-[10px]">
                              {log.ipAddress || '197.89.24.110'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- ALL SHARED MODALS & DRAWERS --- */}

      {/* 1. Studio Profile Drawer */}
      <StudioDetailsDrawer
        studio={drawerStudio}
        isOpen={!!drawerStudio}
        onClose={() => setDrawerStudio(null)}
        onEditInfo={(st) => {
          setDrawerStudio(null);
          setEditStudio(st);
        }}
        onEnforce={(st, act) => {
          setDrawerStudio(null);
          handleOpenEnforcement(st, act);
        }}
        onToggleFeatured={(st) => {
          handleToggleFeatured(st);
          // Update drawer state
          const updated = adminService.getStudioById(st.id);
          if (updated) setDrawerStudio(updated);
        }}
      />

      {/* 2. Edit Studio Admin Info Modal */}
      <EditStudioAdminModal
        studio={editStudio}
        isOpen={!!editStudio}
        onClose={() => setEditStudio(null)}
        onSuccess={refreshData}
      />

      {/* 3. Enforcement Actions Modal (Warn, Review, Disable, Suspend, Reinstate, Soft-Delete) */}
      <EnforcementActionModal
        studio={enforceStudio}
        actionType={enforceType}
        isOpen={!!enforceStudio}
        onClose={() => setEnforceStudio(null)}
        onSuccess={refreshData}
      />

      {/* 4. Report Investigation & Decision Modal */}
      <ReportDecisionModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onSuccess={refreshData}
        onInitiateEnforcement={(studioId, studioName, actionType) => {
          const st = studios.find(s => s.id === studioId);
          if (st) {
            handleOpenEnforcement(st, actionType);
          }
        }}
      />

      {/* 5. Storefront Landing Page Promotions Preview Modal */}
      <LandingPagePreviewModal
        isOpen={previewLandingOpen}
        onClose={() => setPreviewLandingOpen(false)}
        featuredStudios={featuredStudios}
        onOpenStorefront={() => onNavigate('home')}
      />

      {/* 6. Accreditation Decision Modal (Original) */}
      {modalAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                {modalAction === 'approve' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                {modalAction === 'reject' && <XCircle className="w-5 h-5 text-rose-600" />}
                {modalAction === 'changes' && <AlertCircle className="w-5 h-5 text-amber-600" />}
                <h3 className="text-base font-bold text-stone-900 capitalize">
                  Confirm Decision: {modalAction === 'changes' ? 'Request Changes' : modalAction}
                </h3>
              </div>
              <button
                onClick={() => setModalAction(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4">
              You are about to modify the accreditation status for{' '}
              <strong className="text-stone-900">{selectedApp?.businessName}</strong>. This action will be logged in the permanent audit trail and sent to the artisan.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Decision Note & Justification <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                placeholder="Specify the reason or feedback for this decision..."
                className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
              />
              {modalError && (
                <p className="text-xs text-rose-600 font-medium mt-1">{modalError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setModalAction(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                disabled={isSubmitting}
                className={`px-5 py-2 text-xs font-bold rounded-xl text-white transition cursor-pointer ${
                  modalAction === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : modalAction === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isSubmitting ? 'Recording Decision...' : 'Confirm & Notify Artisan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Document Audit Inspection Modal (Original) */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  {previewDoc.type}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document simulated preview */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-200/70 flex items-center justify-center text-stone-500 mb-3">
                <FileText className="w-8 h-8" />
              </div>
              <p className="font-mono text-xs font-bold text-stone-800">{previewDoc.fileName}</p>
              <p className="text-xs text-stone-500 mt-1">
                File Size: {previewDoc.fileSize} • Uploaded: {previewDoc.uploadDate}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs font-medium">
                <span>South African Verified PDF Container</span>
              </div>
            </div>

            <div className="text-xs text-stone-500 bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Compliance officers must inspect for official municipal seals, valid CIPC registration stamps, and matching ID numbers before approving.
              </span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-[#26152d] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Admin Portal Footer */}
      <footer className="mt-16 border-t border-stone-800 bg-[#140a19] text-stone-400 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-stone-300">
              STENZA Beauty Administrative Engine & Accreditation Gateway • Version 2.5.0 (Enterprise RBAC & Moderation)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400 flex-wrap">
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              POPIA Act 4 of 2013 Audited
            </span>
            <span className="text-stone-600">|</span>
            <span>RSA CIPC Business Register</span>
            <span className="text-stone-600">|</span>
            <button 
              onClick={() => onNavigate('home')} 
              className="text-pink-300 hover:text-white font-semibold underline cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Return to User Marketplace</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
