/**
 * STENZA BEAUTY - Administrative Data Models & Type Contracts
 * Prepared for Java Spring Boot REST API & MySQL Database Integration
 */

export type ApprovalStatus = 'pending' | 'under_review' | 'changes_requested' | 'approved' | 'rejected';

export type OperationalStatus = 'active' | 'under_review' | 'disabled' | 'suspended' | 'deleted';

export type ReportCategory = 
  | 'scam_fraud'
  | 'harassment'
  | 'misleading_pricing'
  | 'unsafe_conduct'
  | 'fake_studio'
  | 'other'
  | 'fraud_scam' 
  | 'inappropriate_content' 
  | 'poor_unsafe_conduct' 
  | 'fake_duplicate' 
  | 'harassment_abuse';

export type ReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export type AppealStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface StudioWarning {
  id: string;
  adminId: string;
  adminName: string;
  issuedAt: string;
  reason: string;
  message: string;
  acknowledged?: boolean;
}

export interface AdminStudio {
  id: string;
  applicationId: string;
  businessName: string;
  founderName: string;
  founderTitle: string;
  email: string; // Visible only to authorised administrators
  phone: string; // Visible only to authorised administrators
  idNumber?: string; // South African ID / Passport
  category: string;
  city: string;
  suburb: string;
  address: string;
  coverUrl: string;
  logoUrl: string;
  rating: number;
  reviewCount: number;
  monthlyBookings: number;
  registrationDate: string;
  approvalStatus: ApprovalStatus;
  operationalStatus: OperationalStatus;
  isFeatured: boolean;
  featuredOrder: number;
  reportCount: number;
  warnings: StudioWarning[];
  suspensionReason?: string;
  statusChangeReason?: string;
  adminNotes?: string;
  offersHouseCalls: boolean;
  travelFee?: number;
  isDeleted: boolean; // Soft deletion support
  deletedAt?: string;
  updatedAt: string;
}

export interface StudioReport {
  id: string; // e.g. 'REP-2026-1042'
  studioId: string;
  studioName: string;
  reporterUserId?: string; // Authenticated user ID (e.g. 'usr-client-01')
  reporterName: string;
  reporterEmail: string;
  reporterPhone?: string;
  category: ReportCategory;
  categoryLabel: string;
  description: string;
  bookedThroughStenza?: boolean;
  bookingRef?: string;
  evidenceUrl?: string;
  evidenceFileName?: string;
  dateSubmitted: string;
  status: ReportStatus;
  adminNotes?: string;
  assignedAdmin?: string;
  resolutionDate?: string;
  actionTaken?: string;
  decision?: string;
  customerNotification?: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: 
    | 'STUDIO_APPROVED'
    | 'STUDIO_REJECTED'
    | 'STUDIO_CHANGES_REQUESTED'
    | 'STUDIO_FEATURED'
    | 'STUDIO_UNFEATURED'
    | 'STUDIO_ORDER_CHANGED'
    | 'STUDIO_WARNED'
    | 'STUDIO_UNDER_REVIEW'
    | 'STUDIO_DISABLED'
    | 'STUDIO_REACTIVATED'
    | 'STUDIO_SUSPENDED'
    | 'STUDIO_REINSTATED'
    | 'STUDIO_SOFT_DELETED'
    | 'STUDIO_RESTORED'
    | 'STUDIO_INFO_UPDATED'
    | 'REPORT_STATUS_CHANGED'
    | 'REPORT_RESOLVED'
    | 'REPORT_DISMISSED'
    | 'APPEAL_DECIDED';
  targetType: 'studio' | 'report' | 'promotion' | 'appeal';
  targetId: string;
  targetName: string;
  reason?: string;
  previousState?: string;
  newState?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface StudioAppeal {
  id: string;
  studioId: string;
  studioName: string;
  ownerName: string;
  appealReason: string;
  supportingStatement: string;
  submittedAt: string;
  status: AppealStatus;
  adminDecisionNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface StudioOwnerNotification {
  id: string;
  studioId: string;
  title: string;
  message: string;
  type: 'warning' | 'status_change' | 'approval' | 'promotion' | 'report_notice' | 'appeal_update';
  sentAt: string;
  read: boolean;
}

export interface AdminDashboardAnalytics {
  totalRegisteredStudios: number;
  pendingApprovals: number;
  approvedAndActiveStudios: number;
  featuredStudios: number;
  openReports: number;
  studiosUnderReview: number;
  disabledOrSuspendedStudios: number;
  auditEventsCount: number;
}

export interface StudioPromotion {
  id: string; // e.g. 'PRM-2026-01'
  studioId: string;
  studioName: string;
  studioImage: string;
  studioCategory: string;
  title: string;
  shortDescription: string;
  discountBadge: string; // e.g. '25% OFF', 'R150 OFF', 'Free Gel Nail Art'
  originalPrice?: number;
  promotionalPrice?: number;
  startDate: string; // 'YYYY-MM-DD'
  expiryDate: string; // 'YYYY-MM-DD'
  termsAndConditions: string;
  serviceId?: string;
  isPublished: boolean;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  section: 'new_studios' | 'special_offers' | 'latest_updates' | 'ending_soon';
  featuredOrder?: number;
  createdAt: string;
}

