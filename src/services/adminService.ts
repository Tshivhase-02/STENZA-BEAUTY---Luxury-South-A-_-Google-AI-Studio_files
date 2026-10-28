/**
 * STENZA BEAUTY - Admin Service Layer
 * 
 * Prepares frontend contracts for integration with Java Spring Boot REST API & MySQL.
 * 
 * Endpoint contracts:
 * - GET    /api/admin/studios
 * - GET    /api/admin/studios/{id}
 * - PATCH  /api/admin/studios/{id}/approval
 * - PATCH  /api/admin/studios/{id}/status
 * - PATCH  /api/admin/studios/{id}/featured
 * - POST   /api/admin/studios/{id}/warnings
 * - PATCH  /api/admin/studios/{id}/admin-info
 * - DELETE /api/admin/studios/{id} (soft-delete)
 * - POST   /api/admin/studios/{id}/restore
 * - GET    /api/admin/reports
 * - POST   /api/reports (Public customer reporting)
 * - POST   /api/admin/reports/{id}/decision
 * - GET    /api/admin/audit-logs
 * - GET    /api/admin/appeals
 * - POST   /api/admin/appeals/{id}/decision
 * - GET    /api/admin/analytics
 */

import { 
  AdminStudio, 
  StudioReport, 
  AuditLogEntry, 
  StudioAppeal, 
  StudioOwnerNotification,
  ApprovalStatus,
  OperationalStatus,
  ReportCategory,
  ReportStatus,
  AppealStatus,
  AdminDashboardAnalytics,
  StudioPromotion
} from '../types/admin';

const STORAGE_KEYS = {
  STUDIOS: 'stenza_admin_studios_v1',
  REPORTS: 'stenza_admin_reports_v1',
  AUDIT_LOGS: 'stenza_admin_audit_logs_v1',
  APPEALS: 'stenza_admin_appeals_v1',
  NOTIFICATIONS: 'stenza_admin_notifications_v1',
  PROMOTIONS: 'stenza_admin_promotions_v1'
};

// Seed Studios Data (Realistic South African studios)
const INITIAL_ADMIN_STUDIOS: AdminStudio[] = [
  {
    id: 'luxe-nail-studio',
    applicationId: 'STZ-APP-2026-7540',
    businessName: 'Luxe Nail Studio',
    founderName: 'Lerato Khumalo',
    founderTitle: 'Master Nail Artist & Educator',
    email: 'lerato.khumalo@luxenailstudio.co.za',
    phone: '+27 82 590 1284',
    idNumber: '910314 0284 08 3',
    category: 'Nails',
    city: 'Johannesburg',
    suburb: 'Rosebank',
    address: 'Suite 402, The Keyes Art Mile, 19 Keyes Ave, Rosebank, 2196',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRo0jcALvSQ0kZn1E6Gb3syGczq7_n65vM6FDX7Kx_0JlrtRVs6IlD8-SxS3ZaErsCi6UEitGuHnaQmBqFWjfOC13flftfuGcwbZtjBfbLPVtyJXOstwVVqta3idXEj0wTZ0_89UHkUMxjLch7wrs4l_9mGFIXrAsIqa-_91ln-vfHZGP2nMxUvRB1MYBK25hf75G6TGP7p6wD4Jzp_y15YeyND-6zCoOrdg6C9Vkb7vwqy94gn_40',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_q2c7xA3TXNeFJRWjCkmwEHv0weCDiHIs3Q6d0HTM6w3fo8pqHKIUqiqRFjIt7peIVAS5ITxly6B7f5ZnCLMeFTOg3CGppheNWZJSDERLU1lI9wSC-ZRHYKDN_kQV_6zhsp3NsOVdSzoDbML0Ll0_6GAwLWwZ_Udd7iyU3d7oqaHJ9zyvpp7T7pl47bDIUXVWuDFtVc8CCDh-WRptExJowIzjUcOj_6J064d38O1jS1wNt4V_ZLRy',
    rating: 4.98,
    reviewCount: 242,
    monthlyBookings: 890,
    registrationDate: '12 Jan 2026',
    approvalStatus: 'approved',
    operationalStatus: 'active',
    isFeatured: true,
    featuredOrder: 1,
    reportCount: 0,
    warnings: [],
    offersHouseCalls: true,
    travelFee: 150,
    isDeleted: false,
    updatedAt: '2026-10-26T14:20:00Z',
    adminNotes: 'Accreditation verified. Premier tier South African nail artist.'
  },
  {
    id: 'studio-nompu-dermal',
    applicationId: 'STZ-APP-2026-8812',
    businessName: 'Nompumelelo Dermal Lab & Skin Clinic',
    founderName: 'Nompumelelo Sithole',
    founderTitle: 'Specialist Medical Aesthetician',
    email: 'nompu.sithole@dermalclinic.co.za',
    phone: '+27 83 490 1284',
    idNumber: '920415 0284 08 2',
    category: 'Skincare and Facials',
    city: 'Johannesburg',
    suburb: 'Sandton Central',
    address: 'Suite 204, Sandton City Atrium, 83 Rivonia Rd, Sandton, 2196',
    coverUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.92,
    reviewCount: 18,
    monthlyBookings: 45,
    registrationDate: '24 Oct 2026',
    approvalStatus: 'pending',
    operationalStatus: 'under_review',
    isFeatured: false,
    featuredOrder: 99,
    reportCount: 0,
    warnings: [],
    offersHouseCalls: true,
    travelFee: 200,
    isDeleted: false,
    updatedAt: '2026-10-26T18:10:00Z',
    adminNotes: 'Awaiting CIPC tax compliance cross-check with SARS register.'
  },
  {
    id: 'studio-royal-crown',
    applicationId: 'STZ-APP-2026-6190',
    businessName: 'Royal Crown Hair Atelier',
    founderName: 'Thandiwe Ndlovu',
    founderTitle: 'Master Trichologist & Natural Hair Sculptor',
    email: 'thandiwe@royalcrownhair.co.za',
    phone: '+27 81 742 8839',
    idNumber: '881122 0482 08 7',
    category: 'Hair and Hairstyles',
    city: 'Johannesburg',
    suburb: 'Melrose Arch',
    address: 'Shop 14, High Street, Melrose Arch, Johannesburg, 2076',
    coverUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.95,
    reviewCount: 310,
    monthlyBookings: 640,
    registrationDate: '08 Nov 2025',
    approvalStatus: 'approved',
    operationalStatus: 'active',
    isFeatured: true,
    featuredOrder: 2,
    reportCount: 0,
    warnings: [],
    offersHouseCalls: false,
    isDeleted: false,
    updatedAt: '2026-10-25T11:00:00Z',
    adminNotes: 'Top-ranked natural hair studio in Gauteng. 100% positive reviews.'
  },
  {
    id: 'studio-camps-bay',
    applicationId: 'STZ-APP-2026-5520',
    businessName: 'The Camps Bay Aesthetic & Spa Sanctuary',
    founderName: 'Dr. Helene van der Merwe',
    founderTitle: 'Clinical Aesthetic Director',
    email: 'helene@campsbayaesthetic.co.za',
    phone: '+27 21 438 9011',
    idNumber: '830919 0184 08 4',
    category: 'Spa and Wellness',
    city: 'Cape Town',
    suburb: 'Camps Bay',
    address: '42 Victoria Road, Camps Bay, Cape Town, 8005',
    coverUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 4.97,
    reviewCount: 185,
    monthlyBookings: 410,
    registrationDate: '15 Dec 2025',
    approvalStatus: 'approved',
    operationalStatus: 'active',
    isFeatured: true,
    featuredOrder: 3,
    reportCount: 0,
    warnings: [],
    offersHouseCalls: true,
    travelFee: 350,
    isDeleted: false,
    updatedAt: '2026-10-24T09:30:00Z',
    adminNotes: 'Medical director verified. High value luxury tourist client base.'
  },
  {
    id: 'studio-durban-barber',
    applicationId: 'STZ-APP-2026-4410',
    businessName: 'Durban Coastal Master Barbers',
    founderName: 'Sipho Zulu',
    founderTitle: 'Executive Barber & Grooming Specialist',
    email: 'sipho@durbancoastalbarbers.co.za',
    phone: '+27 31 303 5592',
    idNumber: '900204 0382 08 9',
    category: 'Barbering',
    city: 'Durban',
    suburb: 'Florida Road',
    address: '182 Florida Rd, Morningside, Durban, 4001',
    coverUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.91,
    reviewCount: 156,
    monthlyBookings: 520,
    registrationDate: '02 Feb 2026',
    approvalStatus: 'approved',
    operationalStatus: 'active',
    isFeatured: true,
    featuredOrder: 4,
    reportCount: 0,
    warnings: [],
    offersHouseCalls: false,
    isDeleted: false,
    updatedAt: '2026-10-26T08:00:00Z'
  },
  {
    id: 'studio-umhlanga-lash',
    applicationId: 'STZ-APP-2026-3829',
    businessName: 'Umhlanga Ridge Lash & Brow Lounge',
    founderName: 'Priyah Naidoo',
    founderTitle: 'Certified Lash Master & PMU Artist',
    email: 'priyah@umhlangalash.co.za',
    phone: '+27 31 566 2200',
    idNumber: '940822 0184 08 6',
    category: 'Lashes and Brows',
    city: 'Durban',
    suburb: 'Umhlanga',
    address: 'Shop 7, The Arch, 1 Ncondo Place, Umhlanga Ridge, 4319',
    coverUrl: 'https://images.unsplash.com/photo-1512290900672-1f4a9c8f2b74?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    rating: 4.88,
    reviewCount: 94,
    monthlyBookings: 280,
    registrationDate: '19 Mar 2026',
    approvalStatus: 'approved',
    operationalStatus: 'active',
    isFeatured: false,
    featuredOrder: 5,
    reportCount: 0,
    warnings: [],
    offersHouseCalls: true,
    travelFee: 180,
    isDeleted: false,
    updatedAt: '2026-10-25T16:45:00Z'
  },
  {
    id: 'studio-hazelwood-glow',
    applicationId: 'STZ-APP-2026-2219',
    businessName: 'Hazelwood Glow Skincare & Peels',
    founderName: 'Annelize Botha',
    founderTitle: 'Dermal Aesthetician',
    email: 'annelize@hazelwoodglow.co.za',
    phone: '+27 12 346 8899',
    idNumber: '891012 0192 08 1',
    category: 'Skincare and Facials',
    city: 'Pretoria',
    suburb: 'Hazelwood',
    address: 'The Village, 16th St, Hazelwood, Pretoria, 0081',
    coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    rating: 4.62,
    reviewCount: 42,
    monthlyBookings: 110,
    registrationDate: '14 May 2026',
    approvalStatus: 'approved',
    operationalStatus: 'under_review',
    isFeatured: false,
    featuredOrder: 99,
    reportCount: 1,
    warnings: [
      {
        id: 'wrn-1',
        adminId: 'ADM-GOVENDER',
        adminName: 'Govender M.',
        issuedAt: '25 Oct 2026',
        reason: 'Client reported treatment room sanitization protocol query',
        message: 'Please submit updated autoclave sterilization log sheets within 48 hours.'
      }
    ],
    statusChangeReason: 'Temporary under-review status pending hygiene audit log submission.',
    offersHouseCalls: false,
    isDeleted: false,
    updatedAt: '2026-10-25T14:00:00Z'
  },
  {
    id: 'studio-jhb-fade',
    applicationId: 'STZ-APP-2026-1899',
    businessName: 'Sandton Precision Cutters & Beard Bar',
    founderName: 'Kagiso Mokoena',
    founderTitle: 'Master Stylist',
    email: 'kagiso@sandtoncutters.co.za',
    phone: '+27 11 883 4000',
    idNumber: '930101 0294 08 5',
    category: 'Barbering',
    city: 'Johannesburg',
    suburb: 'Sandton',
    address: 'Rivonia Rd, Sandton Central, Johannesburg, 2196',
    coverUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 4.15,
    reviewCount: 38,
    monthlyBookings: 0,
    registrationDate: '01 Jun 2026',
    approvalStatus: 'approved',
    operationalStatus: 'suspended',
    isFeatured: false,
    featuredOrder: 99,
    reportCount: 3,
    warnings: [
      {
        id: 'wrn-2',
        adminId: 'ADM-GOVENDER',
        adminName: 'Govender M.',
        issuedAt: '20 Oct 2026',
        reason: 'Misleading in-studio surcharge added to client booking',
        message: 'Formal reprimand regarding unadvertised surcharge contrary to STENZA Escrow terms.'
      }
    ],
    suspensionReason: 'Multiple confirmed complaints regarding undisclosed add-on surcharges at point of service.',
    offersHouseCalls: true,
    travelFee: 250,
    isDeleted: false,
    updatedAt: '2026-10-23T10:00:00Z'
  },
  {
    id: 'studio-fake-salon',
    applicationId: 'STZ-APP-2026-1011',
    businessName: 'Elite Capitec Mobile Glamour',
    founderName: 'Victor Dlamini',
    founderTitle: 'Freelance Operator',
    email: 'victor@fakeglamour.co.za',
    phone: '+27 72 000 1122',
    idNumber: '850505 0192 08 2',
    category: 'Artisan Makeup',
    city: 'Johannesburg',
    suburb: 'Bramley',
    address: 'Unverified residential street, Bramley, 2090',
    coverUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    rating: 3.2,
    reviewCount: 2,
    monthlyBookings: 0,
    registrationDate: '10 Jul 2026',
    approvalStatus: 'rejected',
    operationalStatus: 'disabled',
    isFeatured: false,
    featuredOrder: 99,
    reportCount: 1,
    warnings: [],
    suspensionReason: 'Application rejected due to fraudulent CIPC registration number and duplicate identity document.',
    offersHouseCalls: true,
    isDeleted: false,
    updatedAt: '2026-10-20T12:00:00Z'
  }
];

// Seed Reports Data
const INITIAL_REPORTS: StudioReport[] = [
  {
    id: 'REP-2026-1042',
    studioId: 'studio-jhb-fade',
    studioName: 'Sandton Precision Cutters & Beard Bar',
    reporterName: 'Siphesihle Mthembu',
    reporterEmail: 'siphesihle.m@gmail.com',
    category: 'misleading_pricing',
    categoryLabel: 'Misleading prices or services',
    description: 'Booked a Deluxe Beard Shaping and Hot Towel treatment listed at R280 on STENZA. Upon arrival at the studio, they demanded an additional R150 "premium barber surcharge" in cash before starting.',
    evidenceUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    evidenceFileName: 'Invoice_Demanded_Cash.jpg',
    dateSubmitted: '22 Oct 2026',
    status: 'RESOLVED',
    assignedAdmin: 'Govender M. (Compliance Desk)',
    resolutionDate: '23 Oct 2026',
    actionTaken: 'Studio suspended for 14 days pending compliance audit. Client refunded in full via escrow.',
    decision: 'Violation of STENZA Transparent Pricing Policy section 4.1 confirmed.'
  },
  {
    id: 'REP-2026-1045',
    studioId: 'studio-hazelwood-glow',
    studioName: 'Hazelwood Glow Skincare & Peels',
    reporterName: 'Marike van Zyl',
    reporterEmail: 'marike.vz@iafrica.com',
    category: 'poor_unsafe_conduct',
    categoryLabel: 'Poor or unsafe conduct',
    description: 'During a medium depth chemical peel treatment, the aesthetician did not wear fresh medical gloves and reuse applicator swabs. Requested clinic sterilization log sheets.',
    dateSubmitted: '25 Oct 2026',
    status: 'UNDER_REVIEW',
    assignedAdmin: 'Govender M. (Compliance Desk)',
    adminNotes: 'Contacted owner Annelize Botha. Clinic owner agreed to submit video protocol and sterilization register.'
  },
  {
    id: 'REP-2026-1048',
    studioId: 'studio-nompu-dermal',
    studioName: 'Nompumelelo Dermal Lab & Skin Clinic',
    reporterUserId: 'usr-client-01',
    reporterName: 'Naledi Mokwena',
    reporterEmail: 'naledi.mokwena@stenzabeauty.co.za',
    category: 'misleading_pricing',
    categoryLabel: 'Misleading prices or services',
    description: 'Advertised introductory consultation listed at R450 on catalog, but checkout preview displayed R580 before any addon services were selected.',
    bookedThroughStenza: true,
    bookingRef: 'STZ-BK-9812',
    dateSubmitted: '26 Oct 2026',
    status: 'UNDER_REVIEW',
    assignedAdmin: 'Govender M. (Compliance Desk)',
    adminNotes: 'Contacted clinic management. Investigating pricing tier matrix.',
    customerNotification: 'STENZA Compliance is currently reviewing the clinic catalog pricing configuration. Escrow protection is active.'
  },
  {
    id: 'REP-2026-1039',
    studioId: 'luxe-nail-studio',
    studioName: 'Luxe Nail Studio',
    reporterName: 'Chloe Jacobs',
    reporterEmail: 'chloe.j@outlook.com',
    category: 'other',
    categoryLabel: 'Other concerns',
    description: 'Appointment delayed by 15 minutes due to previous client removal running over.',
    dateSubmitted: '20 Oct 2026',
    status: 'DISMISSED',
    assignedAdmin: 'Govender M. (Compliance Desk)',
    resolutionDate: '21 Oct 2026',
    actionTaken: 'No violation found. Studio offered complimentary gel removal credit on next appointment.',
    decision: 'Unsubstantiated breach. Standard 15 min buffer handled courteously by salon front desk.'
  }
];

// Seed Audit Logs
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-9014',
    adminId: 'ADM-GOVENDER',
    adminName: 'Govender M. (Senior Compliance Officer)',
    action: 'STUDIO_SUSPENDED',
    targetType: 'studio',
    targetId: 'studio-jhb-fade',
    targetName: 'Sandton Precision Cutters & Beard Bar',
    reason: 'Confirmed multiple undisclosed surcharges breaching escrow contract.',
    previousState: 'operationalStatus: active, isFeatured: false',
    newState: 'operationalStatus: suspended, isFeatured: false',
    timestamp: '23 Oct 2026, 14:15 SAST',
    ipAddress: '197.89.24.110 (Sandton HQ)'
  },
  {
    id: 'AUD-9013',
    adminId: 'ADM-GOVENDER',
    adminName: 'Govender M. (Senior Compliance Officer)',
    action: 'STUDIO_FEATURED',
    targetType: 'promotion',
    targetId: 'studio-durban-barber',
    targetName: 'Durban Coastal Master Barbers',
    reason: 'Approved for landing page featured showcase (Position #4).',
    previousState: 'isFeatured: false',
    newState: 'isFeatured: true, featuredOrder: 4',
    timestamp: '22 Oct 2026, 11:30 SAST',
    ipAddress: '197.89.24.110 (Sandton HQ)'
  },
  {
    id: 'AUD-9012',
    adminId: 'ADM-GOVENDER',
    adminName: 'Govender M. (Senior Compliance Officer)',
    action: 'STUDIO_APPROVED',
    targetType: 'studio',
    targetId: 'luxe-nail-studio',
    targetName: 'Luxe Nail Studio',
    reason: 'Accreditation certified with CIDESCO qualifications and CIPC verification.',
    previousState: 'approvalStatus: pending',
    newState: 'approvalStatus: approved, operationalStatus: active',
    timestamp: '15 Jan 2026, 09:45 SAST',
    ipAddress: '197.89.24.110 (Sandton HQ)'
  }
];

// Seed Appeals
const INITIAL_APPEALS: StudioAppeal[] = [
  {
    id: 'APP-2026-081',
    studioId: 'studio-jhb-fade',
    studioName: 'Sandton Precision Cutters & Beard Bar',
    ownerName: 'Kagiso Mokoena',
    appealReason: 'Immediate staff disciplinary action taken and updated pricing boards installed',
    supportingStatement: 'The junior apprentice responsible for quoting the unauthorized cash fee has been re-trained and reassigned. We have posted prominent in-studio signage affirming that all rates are strictly fixed on STENZA with zero cash surcharges.',
    submittedAt: '24 Oct 2026',
    status: 'PENDING'
  }
];

// Initial Seed Promotions (South African marketplace offers)
const INITIAL_PROMOTIONS: StudioPromotion[] = [
  {
    id: 'PRM-2026-01',
    studioId: 'luxe-nail-studio',
    studioName: 'Luxe Nail Studio',
    studioImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    studioCategory: 'Nails',
    title: 'Spring Gel Mani + Pedi Duo Special',
    shortDescription: 'Enjoy a complete Russian manicure with bespoke cuticle therapy and deluxe gel pedicure.',
    discountBadge: '20% OFF',
    originalPrice: 650,
    promotionalPrice: 520,
    startDate: '2026-10-15',
    expiryDate: '2026-11-20',
    termsAndConditions: 'Valid on weekdays only between 09:00 and 15:00. Advance booking required. Cannot be combined with loyalty points discount.',
    serviceId: 'srv-1',
    isPublished: true,
    approvalStatus: 'approved',
    section: 'special_offers',
    featuredOrder: 1,
    createdAt: '2026-10-15T08:00:00Z'
  },
  {
    id: 'PRM-2026-02',
    studioId: 'crown-braids-lounge',
    studioName: 'Crown & Coiffure Braiding Lounge',
    studioImage: '/assets/aistudio/Media__7__14ebe8b0.jpg',
    studioCategory: 'Hair',
    title: 'Signature Mzansi Knotless Braids + Scalp Treatment',
    shortDescription: 'Precision stitch braiding including botanical scalp therapy, steaming, and edge definition.',
    discountBadge: 'R180 OFF',
    originalPrice: 850,
    promotionalPrice: 670,
    startDate: '2026-10-18',
    expiryDate: '2026-11-25',
    termsAndConditions: 'Includes hypoallergenic synthetic extensions. Natural hair wash included. Booking deposit required.',
    isPublished: true,
    approvalStatus: 'approved',
    section: 'special_offers',
    featuredOrder: 2,
    createdAt: '2026-10-18T10:00:00Z'
  },
  {
    id: 'PRM-2026-03',
    studioId: 'afro-botanics-lounge',
    studioName: 'Afro Botanics Natural Hair Lounge',
    studioImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    studioCategory: 'Hair',
    title: 'New Studio Spotlight: Complimentary Hydration Treatment',
    shortDescription: 'Newly accredited boutique salon in Camps Bay welcoming clients with pure Marula oil deep conditioning.',
    discountBadge: 'NEW STUDIO',
    originalPrice: 450,
    promotionalPrice: 320,
    startDate: '2026-10-20',
    expiryDate: '2026-12-10',
    termsAndConditions: 'Available for first-time visitors to Afro Botanics. Limited to 20 clients per week.',
    isPublished: true,
    approvalStatus: 'approved',
    section: 'new_studios',
    featuredOrder: 3,
    createdAt: '2026-10-20T11:00:00Z'
  },
  {
    id: 'PRM-2026-04',
    studioId: 'luxe-nail-studio',
    studioName: 'Luxe Nail Studio',
    studioImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    studioCategory: 'Nails',
    title: 'House-Call Travel Fee Waived: Sandton & Rosebank',
    shortDescription: 'Book mobile beauty services directly to your home or office with zero travel fee on Tuesdays & Thursdays.',
    discountBadge: 'FREE TRAVEL',
    originalPrice: 150,
    promotionalPrice: 0,
    startDate: '2026-10-22',
    expiryDate: '2026-11-15',
    termsAndConditions: 'Applies to mobile bookings of R450 or more within a 15km radius of Sandton Central.',
    isPublished: true,
    approvalStatus: 'approved',
    section: 'latest_updates',
    featuredOrder: 4,
    createdAt: '2026-10-22T09:00:00Z'
  },
  {
    id: 'PRM-2026-05',
    studioId: 'velvet-lash-atelier',
    studioName: 'Velvet Lash & Brow Atelier',
    studioImage: 'https://images.unsplash.com/photo-1583001800475-4309e5c54cae?auto=format&fit=crop&w=600&q=80',
    studioCategory: 'Lashes',
    title: 'Weekend Flash: Volume Lash Full Set',
    shortDescription: 'Limited weekend appointments available with lead lash stylist at an introductory promotional rate.',
    discountBadge: 'ENDS SOON',
    originalPrice: 750,
    promotionalPrice: 580,
    startDate: '2026-10-24',
    expiryDate: '2026-10-31',
    termsAndConditions: 'Flash promotion valid through this weekend only. Non-refundable R150 booking confirmation.',
    isPublished: true,
    approvalStatus: 'approved',
    section: 'ending_soon',
    featuredOrder: 5,
    createdAt: '2026-10-24T12:00:00Z'
  },
  {
    id: 'PRM-2026-06',
    studioId: 'studio-nompu-dermal',
    studioName: 'Nompumelelo Dermal Lab',
    studioImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    studioCategory: 'Skincare',
    title: 'Medical Micro-Needling Launch Offer',
    shortDescription: 'Introductory pricing on collagen induction therapy with sterile peptide ampoules.',
    discountBadge: '30% OFF',
    originalPrice: 950,
    promotionalPrice: 665,
    startDate: '2026-11-01',
    expiryDate: '2026-12-01',
    termsAndConditions: 'Requires 48-hour pre-treatment consultation. Unsuitable for active acne.',
    isPublished: false,
    approvalStatus: 'pending',
    section: 'special_offers',
    featuredOrder: 6,
    createdAt: '2026-10-26T15:00:00Z'
  },
  {
    id: 'PRM-2026-EXPIRED',
    studioId: 'luxe-nail-studio',
    studioName: 'Luxe Nail Studio',
    studioImage: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
    studioCategory: 'Nails',
    title: 'Winter Warmth Paraffin Hand Spa',
    shortDescription: 'Deep hydration paraffin bath and hand massage.',
    discountBadge: 'EXPIRED',
    originalPrice: 350,
    promotionalPrice: 280,
    startDate: '2026-08-01',
    expiryDate: '2026-09-30',
    termsAndConditions: 'Winter campaign expired.',
    isPublished: true,
    approvalStatus: 'approved',
    section: 'special_offers',
    featuredOrder: 99,
    createdAt: '2026-08-01T00:00:00Z'
  }
];

// Service Class
class AdminService {
  private studios: AdminStudio[] = [];
  private reports: StudioReport[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private appeals: StudioAppeal[] = [];
  private notifications: StudioOwnerNotification[] = [];
  private promotions: StudioPromotion[] = [];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    try {
      const storedStudios = localStorage.getItem(STORAGE_KEYS.STUDIOS);
      this.studios = storedStudios ? JSON.parse(storedStudios) : INITIAL_ADMIN_STUDIOS;

      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      this.reports = storedReports ? JSON.parse(storedReports) : INITIAL_REPORTS;

      const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      this.auditLogs = storedLogs ? JSON.parse(storedLogs) : INITIAL_AUDIT_LOGS;

      const storedAppeals = localStorage.getItem(STORAGE_KEYS.APPEALS);
      this.appeals = storedAppeals ? JSON.parse(storedAppeals) : INITIAL_APPEALS;

      const storedPromos = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
      this.promotions = storedPromos ? JSON.parse(storedPromos) : INITIAL_PROMOTIONS;
    } catch (e) {
      this.studios = INITIAL_ADMIN_STUDIOS;
      this.reports = INITIAL_REPORTS;
      this.auditLogs = INITIAL_AUDIT_LOGS;
      this.appeals = INITIAL_APPEALS;
      this.promotions = INITIAL_PROMOTIONS;
    }
  }

  private saveStudios() {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDIOS, JSON.stringify(this.studios));
    } catch (e) {
      console.warn('LocalStorage error saving studios', e);
    }
  }

  private saveReports() {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
    } catch (e) {
      console.warn('LocalStorage error saving reports', e);
    }
  }

  private savePromotions() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(this.promotions));
    } catch (e) {
      console.warn('LocalStorage error saving promotions', e);
    }
  }

  private saveAuditLogs() {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn('LocalStorage error saving audit logs', e);
    }
  }

  private saveAppeals() {
    try {
      localStorage.setItem(STORAGE_KEYS.APPEALS, JSON.stringify(this.appeals));
    } catch (e) {
      console.warn('LocalStorage error saving appeals', e);
    }
  }

  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('en-ZA', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }) + ' SAST',
      ipAddress: '197.89.24.110 (Sandton Compliance Desk)'
    };
    this.auditLogs.unshift(newLog);
    this.saveAuditLogs();
  }

  // --- STUDIOS API ---
  public getStudios(includeDeleted = true): AdminStudio[] {
    if (!includeDeleted) {
      return this.studios.filter(s => !s.isDeleted);
    }
    return [...this.studios];
  }

  public getActiveApprovedFeaturedStudios(): AdminStudio[] {
    return this.studios
      .filter(s => !s.isDeleted && s.approvalStatus === 'approved' && s.operationalStatus === 'active' && s.isFeatured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder);
  }

  public getStudioById(id: string): AdminStudio | undefined {
    return this.studios.find(s => s.id === id);
  }

  public registerNewStudio(appData: {
    id: string;
    businessName: string;
    founderName: string;
    category: string;
    city: string;
    suburb: string;
    address: string;
    email: string;
    phone: string;
    idNumber?: string;
    coverUrl?: string;
    logoUrl?: string;
  }): AdminStudio {
    const newStudio: AdminStudio = {
      id: appData.id,
      applicationId: `STZ-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      businessName: appData.businessName,
      founderName: appData.founderName,
      founderTitle: 'Studio Director',
      email: appData.email,
      phone: appData.phone,
      idNumber: appData.idNumber,
      category: appData.category,
      city: appData.city,
      suburb: appData.suburb,
      address: appData.address,
      coverUrl: appData.coverUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      logoUrl: appData.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewCount: 0,
      monthlyBookings: 0,
      registrationDate: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
      approvalStatus: 'pending',
      operationalStatus: 'under_review',
      isFeatured: false,
      featuredOrder: 99,
      reportCount: 0,
      warnings: [],
      offersHouseCalls: false,
      isDeleted: false,
      updatedAt: new Date().toISOString(),
      adminNotes: 'New artisan submission awaiting document accreditation review.'
    };

    this.studios.unshift(newStudio);
    this.saveStudios();

    this.logAudit({
      adminId: 'SYSTEM',
      adminName: 'Registration Gateway',
      action: 'STUDIO_UNDER_REVIEW',
      targetType: 'studio',
      targetId: newStudio.id,
      targetName: newStudio.businessName,
      reason: 'New artisan application registered with PENDING status.'
    });

    return newStudio;
  }

  public updateStudioApproval(
    studioId: string, 
    approvalStatus: ApprovalStatus, 
    reason: string,
    adminName = 'Govender M.'
  ): boolean {
    const studio = this.studios.find(s => s.id === studioId);
    if (!studio) return false;

    const prevState = `approval: ${studio.approvalStatus}, operational: ${studio.operationalStatus}, isFeatured: ${studio.isFeatured}`;
    studio.approvalStatus = approvalStatus;
    studio.adminNotes = reason;
    studio.updatedAt = new Date().toISOString();

    if (approvalStatus === 'approved') {
      studio.operationalStatus = 'active';
    } else {
      // Ineligible studios cannot be active or featured
      studio.isFeatured = false;
      if (approvalStatus === 'rejected') {
        studio.operationalStatus = 'disabled';
      }
    }

    this.saveStudios();

    let action: AuditLogEntry['action'] = 'STUDIO_APPROVED';
    if (approvalStatus === 'rejected') action = 'STUDIO_REJECTED';
    if (approvalStatus === 'changes_requested') action = 'STUDIO_CHANGES_REQUESTED';

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action,
      targetType: 'studio',
      targetId: studio.id,
      targetName: studio.businessName,
      reason,
      previousState: prevState,
      newState: `approval: ${studio.approvalStatus}, operational: ${studio.operationalStatus}, isFeatured: ${studio.isFeatured}`
    });

    return true;
  }

  public updateStudioStatus(
    studioId: string, 
    operationalStatus: OperationalStatus, 
    reason: string,
    adminName = 'Govender M.'
  ): boolean {
    const studio = this.studios.find(s => s.id === studioId);
    if (!studio) return false;

    const prevState = `operationalStatus: ${studio.operationalStatus}, isFeatured: ${studio.isFeatured}`;
    studio.operationalStatus = operationalStatus;
    studio.statusChangeReason = reason;
    studio.updatedAt = new Date().toISOString();

    // If disabled or suspended, automatically unfeature and cancel landing page promotion
    if (operationalStatus !== 'active') {
      studio.isFeatured = false;
    }

    this.saveStudios();

    let action: AuditLogEntry['action'] = 'STUDIO_UNDER_REVIEW';
    if (operationalStatus === 'disabled') action = 'STUDIO_DISABLED';
    if (operationalStatus === 'suspended') action = 'STUDIO_SUSPENDED';
    if (operationalStatus === 'active') action = 'STUDIO_REINSTATED';

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action,
      targetType: 'studio',
      targetId: studio.id,
      targetName: studio.businessName,
      reason,
      previousState: prevState,
      newState: `operationalStatus: ${studio.operationalStatus}, isFeatured: ${studio.isFeatured}`
    });

    return true;
  }

  public updateStudioFeatured(
    studioId: string, 
    isFeatured: boolean, 
    featuredOrder?: number,
    adminName = 'Govender M.'
  ): { success: boolean; message: string } {
    const studio = this.studios.find(s => s.id === studioId);
    if (!studio) return { success: false, message: 'Studio not found' };

    // Enforce Rule: Only APPROVED and ACTIVE studios may be featured!
    if (isFeatured && (studio.approvalStatus !== 'approved' || studio.operationalStatus !== 'active' || studio.isDeleted)) {
      return {
        success: false,
        message: 'Only approved and active studios may be featured on the public landing page.'
      };
    }

    const prevState = `isFeatured: ${studio.isFeatured}, order: ${studio.featuredOrder}`;
    studio.isFeatured = isFeatured;
    if (featuredOrder !== undefined) {
      studio.featuredOrder = featuredOrder;
    }
    studio.updatedAt = new Date().toISOString();

    this.saveStudios();

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action: isFeatured ? 'STUDIO_FEATURED' : 'STUDIO_UNFEATURED',
      targetType: 'promotion',
      targetId: studio.id,
      targetName: studio.businessName,
      reason: isFeatured 
        ? `Featured on landing page in position #${studio.featuredOrder}`
        : 'Removed from landing page featured section',
      previousState: prevState,
      newState: `isFeatured: ${studio.isFeatured}, order: ${studio.featuredOrder}`
    });

    return { 
      success: true, 
      message: isFeatured 
        ? `${studio.businessName} is now featured on the public landing page.`
        : `${studio.businessName} has been removed from featured promotions.`
    };
  }

  public updateFeaturedOrder(orderedStudioIds: string[], adminName = 'Govender M.') {
    orderedStudioIds.forEach((id, index) => {
      const studio = this.studios.find(s => s.id === id);
      if (studio && studio.isFeatured) {
        studio.featuredOrder = index + 1;
      }
    });
    this.saveStudios();

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action: 'STUDIO_ORDER_CHANGED',
      targetType: 'promotion',
      targetId: 'all',
      targetName: 'Landing Page Featured Studios Order',
      reason: 'Admin re-ordered landing page featured display order.'
    });
  }

  public warnStudio(studioId: string, message: string, reason: string, adminName = 'Govender M.'): boolean {
    const studio = this.studios.find(s => s.id === studioId);
    if (!studio) return false;

    const newWarning = {
      id: `wrn-${Date.now()}`,
      adminId: 'ADM-GOVENDER',
      adminName,
      issuedAt: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
      reason,
      message,
      acknowledged: false
    };

    if (!studio.warnings) studio.warnings = [];
    studio.warnings.unshift(newWarning);
    studio.updatedAt = new Date().toISOString();
    this.saveStudios();

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action: 'STUDIO_WARNED',
      targetType: 'studio',
      targetId: studio.id,
      targetName: studio.businessName,
      reason: `${reason} - Notice: ${message}`
    });

    return true;
  }

  public updateStudioAdminInfo(
    studioId: string, 
    info: { category?: string; city?: string; suburb?: string; address?: string; phone?: string; adminNotes?: string },
    adminName = 'Govender M.'
  ): boolean {
    const studio = this.studios.find(s => s.id === studioId);
    if (!studio) return false;

    if (info.category) studio.category = info.category;
    if (info.city) studio.city = info.city;
    if (info.suburb) studio.suburb = info.suburb;
    if (info.address) studio.address = info.address;
    if (info.phone) studio.phone = info.phone;
    if (info.adminNotes) studio.adminNotes = info.adminNotes;
    studio.updatedAt = new Date().toISOString();

    this.saveStudios();

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action: 'STUDIO_INFO_UPDATED',
      targetType: 'studio',
      targetId: studio.id,
      targetName: studio.businessName,
      reason: 'Administrative listing details modified.'
    });

    return true;
  }

  public softDeleteStudio(studioId: string, reason: string, adminName = 'Govender M.'): boolean {
    const studio = this.studios.find(s => s.id === studioId);
    if (!studio) return false;

    studio.isDeleted = true;
    studio.deletedAt = new Date().toISOString();
    studio.operationalStatus = 'deleted';
    studio.isFeatured = false;
    studio.statusChangeReason = reason;

    this.saveStudios();

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action: 'STUDIO_SOFT_DELETED',
      targetType: 'studio',
      targetId: studio.id,
      targetName: studio.businessName,
      reason: `Soft-deleted by administrator: ${reason}`
    });

    return true;
  }

  public restoreStudio(studioId: string, adminName = 'Govender M.'): boolean {
    const studio = this.studios.find(s => s.id === studioId);
    if (!studio) return false;

    studio.isDeleted = false;
    studio.deletedAt = undefined;
    studio.operationalStatus = studio.approvalStatus === 'approved' ? 'active' : 'under_review';

    this.saveStudios();

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action: 'STUDIO_RESTORED',
      targetType: 'studio',
      targetId: studio.id,
      targetName: studio.businessName,
      reason: 'Restored from soft-deleted records.'
    });

    return true;
  }

  // --- REPORTS API (Prepared for Java Spring Boot REST API & MySQL) ---
  
  /**
   * GET /api/admin/reports
   * Retrieves all customer reports for authorized platform compliance administrators.
   */
  public getReports(): StudioReport[] {
    return [...this.reports];
  }

  public getAdminReports(filters?: {
    status?: string;
    category?: string;
    studioId?: string;
  }): StudioReport[] {
    let result = [...this.reports];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(r => r.status === filters.status);
    }
    if (filters?.category && filters.category !== 'all') {
      result = result.filter(r => r.category === filters.category);
    }
    if (filters?.studioId && filters.studioId !== 'all') {
      result = result.filter(r => r.studioId === filters.studioId);
    }
    return result;
  }

  /**
   * GET /api/admin/reports/{reportId}
   */
  public getAdminReportById(reportId: string): StudioReport | undefined {
    return this.reports.find(r => r.id === reportId);
  }

  /**
   * GET /api/me/reports
   * Returns reports submitted by the authenticated customer only.
   * Enforces privacy: never exposes reports submitted by other customers.
   */
  public getCustomerReports(userEmailOrId: string): StudioReport[] {
    if (!userEmailOrId) return [];
    const lower = userEmailOrId.toLowerCase().trim();
    return this.reports.filter(r => 
      (r.reporterEmail && r.reporterEmail.toLowerCase().trim() === lower) ||
      (r.reporterUserId && r.reporterUserId.toLowerCase().trim() === lower)
    );
  }

  /**
   * GET /api/me/reports/{reportId}
   * Returns a specific report if it belongs to the authenticated customer.
   */
  public getCustomerReportById(reportId: string, userEmailOrId: string): StudioReport | undefined {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return undefined;
    const lower = (userEmailOrId || '').toLowerCase().trim();
    const isOwner = 
      (report.reporterEmail && report.reporterEmail.toLowerCase().trim() === lower) ||
      (report.reporterUserId && report.reporterUserId.toLowerCase().trim() === lower);
    return isOwner ? report : undefined;
  }

  /**
   * POST /api/studios/{studioId}/reports
   * Submits a customer complaint against a studio with server-side reference generation.
   */
  public submitCustomerReport(reportData: {
    studioId: string;
    studioName: string;
    reporterUserId?: string;
    reporterName: string;
    reporterEmail: string;
    reporterPhone?: string;
    category: ReportCategory;
    description: string;
    bookedThroughStenza?: boolean;
    bookingRef?: string;
    evidenceUrl?: string;
    evidenceFileName?: string;
  }): StudioReport {
    const categoryLabels: Record<string, string> = {
      scam_fraud: 'Scam or fraud',
      harassment: 'Mistreated or harassed',
      misleading_pricing: 'Misleading prices or services',
      unsafe_conduct: 'Unsafe or unprofessional behaviour',
      fake_studio: 'Fake studio or suspicious activity',
      other: 'Other',
      fraud_scam: 'Scam or fraud',
      poor_unsafe_conduct: 'Unsafe or unprofessional behaviour',
      harassment_abuse: 'Mistreated or harassed',
      fake_duplicate: 'Fake studio or suspicious activity',
      inappropriate_content: 'Inappropriate content or photos'
    };

    const newReport: StudioReport = {
      id: `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      studioId: reportData.studioId,
      studioName: reportData.studioName,
      reporterUserId: reportData.reporterUserId || 'usr-client-01',
      reporterName: reportData.reporterName,
      reporterEmail: reportData.reporterEmail,
      reporterPhone: reportData.reporterPhone,
      category: reportData.category,
      categoryLabel: categoryLabels[reportData.category] || 'Other',
      description: reportData.description,
      bookedThroughStenza: !!reportData.bookedThroughStenza,
      bookingRef: reportData.bookingRef,
      evidenceUrl: reportData.evidenceUrl,
      evidenceFileName: reportData.evidenceFileName,
      dateSubmitted: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'OPEN'
    };

    this.reports.unshift(newReport);
    this.saveReports();

    // Increment studio report count
    const targetStudio = this.studios.find(s => s.id === reportData.studioId);
    if (targetStudio) {
      targetStudio.reportCount = (targetStudio.reportCount || 0) + 1;
      this.saveStudios();
    }

    this.logAudit({
      adminId: 'SYSTEM',
      adminName: 'Customer Ingestion Gateway',
      action: 'REPORT_SUBMITTED' as any,
      targetType: 'report',
      targetId: newReport.id,
      targetName: `Report against ${reportData.studioName}`,
      reason: `Client filed ${newReport.categoryLabel} complaint (${newReport.id})`
    });

    return newReport;
  }

  // Backward compatibility alias for submitReport
  public submitReport(reportData: {
    studioId: string;
    studioName: string;
    reporterName: string;
    reporterEmail: string;
    category: ReportCategory;
    description: string;
    evidenceUrl?: string;
  }): StudioReport {
    return this.submitCustomerReport(reportData);
  }

  /**
   * PATCH /api/admin/reports/{reportId}/status
   */
  public updateReportStatus(
    reportId: string, 
    status: ReportStatus, 
    adminNotes?: string,
    customerNotification?: string,
    adminName = 'Govender M.'
  ): boolean {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return false;

    report.status = status;
    if (adminNotes) report.adminNotes = adminNotes;
    if (customerNotification) report.customerNotification = customerNotification;
    this.saveReports();

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action: status === 'RESOLVED' ? 'REPORT_RESOLVED' : status === 'DISMISSED' ? 'REPORT_DISMISSED' : 'REPORT_UNDER_REVIEW' as any,
      targetType: 'report',
      targetId: report.id,
      targetName: `Report on ${report.studioName}`,
      reason: `Status changed to ${status}. Note: ${adminNotes || 'None'}`
    });

    return true;
  }

  /**
   * POST /api/admin/reports/{reportId}/notes
   */
  public addReportAdminNotes(reportId: string, notes: string, adminName = 'Govender M.'): boolean {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return false;

    const timestamp = new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const existing = report.adminNotes ? `${report.adminNotes}\n` : '';
    report.adminNotes = `${existing}[${timestamp} by ${adminName}]: ${notes}`;
    this.saveReports();
    return true;
  }

  /**
   * POST /api/admin/reports/{reportId}/decision
   */
  public updateReportDecision(
    reportId: string, 
    decisionData: {
      status: ReportStatus;
      decision: string;
      adminNotes?: string;
      actionTaken?: string;
      assignedAdmin?: string;
      customerNotification?: string;
    },
    adminName = 'Govender M.'
  ): boolean {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return false;

    report.status = decisionData.status;
    report.decision = decisionData.decision;
    if (decisionData.adminNotes) report.adminNotes = decisionData.adminNotes;
    report.actionTaken = decisionData.actionTaken;
    report.assignedAdmin = decisionData.assignedAdmin || adminName;
    report.resolutionDate = new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
    if (decisionData.customerNotification) {
      report.customerNotification = decisionData.customerNotification;
    } else {
      report.customerNotification = decisionData.status === 'RESOLVED'
        ? `Your report has been investigated and resolved by the STENZA Compliance Desk. Action taken: ${decisionData.actionTaken || 'Remediation completed.'}`
        : `Your report has been reviewed and closed by STENZA Compliance.`;
    }

    this.saveReports();

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action: decisionData.status === 'RESOLVED' ? 'REPORT_RESOLVED' : 'REPORT_DISMISSED',
      targetType: 'report',
      targetId: report.id,
      targetName: `Report on ${report.studioName}`,
      reason: `${decisionData.decision} - Action: ${decisionData.actionTaken || 'None'}`
    });

    return true;
  }

  // --- AUDIT LOGS API ---
  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  // --- APPEALS API ---
  public getAppeals(): StudioAppeal[] {
    return [...this.appeals];
  }

  public decideAppeal(
    appealId: string, 
    status: AppealStatus, 
    adminDecisionNotes: string,
    adminName = 'Govender M.'
  ): boolean {
    const appeal = this.appeals.find(a => a.id === appealId);
    if (!appeal) return false;

    appeal.status = status;
    appeal.adminDecisionNotes = adminDecisionNotes;
    appeal.reviewedAt = new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
    appeal.reviewedBy = adminName;

    this.saveAppeals();

    // If appeal approved, reinstate studio
    if (status === 'APPROVED') {
      const studio = this.studios.find(s => s.id === appeal.studioId);
      if (studio && studio.operationalStatus === 'suspended') {
        studio.operationalStatus = 'active';
        this.saveStudios();
      }
    }

    this.logAudit({
      adminId: 'ADM-GOVENDER',
      adminName,
      action: 'APPEAL_DECIDED',
      targetType: 'appeal',
      targetId: appeal.id,
      targetName: `Appeal for ${appeal.studioName}`,
      reason: `Appeal status set to ${status}: ${adminDecisionNotes}`
    });

    return true;
  }

  // --- ANALYTICS ---
  public getAnalytics(): AdminDashboardAnalytics {
    const nonDeleted = this.studios.filter(s => !s.isDeleted);
    return {
      totalRegisteredStudios: this.studios.length,
      pendingApprovals: this.studios.filter(s => s.approvalStatus === 'pending').length,
      approvedAndActiveStudios: nonDeleted.filter(s => s.approvalStatus === 'approved' && s.operationalStatus === 'active').length,
      featuredStudios: nonDeleted.filter(s => s.isFeatured && s.approvalStatus === 'approved' && s.operationalStatus === 'active').length,
      openReports: this.reports.filter(r => r.status === 'OPEN' || r.status === 'UNDER_REVIEW').length,
      studiosUnderReview: nonDeleted.filter(s => s.operationalStatus === 'under_review' || (s.approvalStatus as string) === 'under_review').length,
      disabledOrSuspendedStudios: nonDeleted.filter(s => s.operationalStatus === 'disabled' || s.operationalStatus === 'suspended').length,
      auditEventsCount: this.auditLogs.length
    };
  }

  // Aliases for unified calling conventions across Admin Center
  public updateApprovalStatus(studioId: string, approvalStatus: ApprovalStatus, reason: string): boolean {
    return this.updateStudioApproval(studioId, approvalStatus, reason);
  }

  public setStudioFeatured(studioId: string, isFeatured: boolean): { success: boolean; message: string } {
    return this.updateStudioFeatured(studioId, isFeatured);
  }

  public reorderFeatured(orderedStudioIds: string[]): void {
    this.updateFeaturedOrder(orderedStudioIds);
  }

  public recordAppealDecision(
    appealId: string, 
    status: AppealStatus, 
    notes: string, 
    _reinstateStudio?: boolean
  ): boolean {
    return this.decideAppeal(appealId, status, notes);
  }

  public getDashboardAnalytics(): {
    totalStudios: number;
    pendingAccreditation: number;
    approvedStudios: number;
    featuredStudios: number;
    openReports: number;
    suspendedStudios: number;
    underReviewStudios: number;
  } {
    const raw = this.getAnalytics();
    return {
      totalStudios: raw.totalRegisteredStudios,
      pendingAccreditation: raw.pendingApprovals,
      approvedStudios: raw.approvedAndActiveStudios,
      featuredStudios: raw.featuredStudios,
      openReports: raw.openReports,
      suspendedStudios: raw.disabledOrSuspendedStudios,
      underReviewStudios: raw.studiosUnderReview
    };
  }

  // ================= PROMOTIONS & OFFERS MANAGEMENT =================
  public getPromotions(includeUnpublishedAndExpired = false): StudioPromotion[] {
    if (includeUnpublishedAndExpired) {
      return [...this.promotions];
    }

    const today = new Date().toISOString().split('T')[0];
    const approvedStudioIds = new Set(
      this.getStudios(false)
        .filter((s) => s.approvalStatus === 'approved' && s.operationalStatus === 'active' && !s.isDeleted)
        .map((s) => s.id)
    );

    return this.promotions.filter((p: StudioPromotion) => {
      // Must be published and approved
      if (!p.isPublished || p.approvalStatus !== 'approved') return false;
      // Must not be expired (expiryDate >= today)
      if (p.expiryDate < today) return false;
      // Studio must be an active, approved studio
      if (!approvedStudioIds.has(p.studioId)) return false;
      return true;
    });
  }

  public getPromotionById(id: string): StudioPromotion | undefined {
    return this.promotions.find((p) => p.id === id);
  }

  public createPromotion(newPromoData: Omit<StudioPromotion, 'id' | 'createdAt'>): StudioPromotion {
    const newPromo: StudioPromotion = {
      ...newPromoData,
      id: `PRM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    this.promotions.unshift(newPromo);
    this.savePromotions();

    this.logAudit({
      adminId: 'ADM-COMPLIANCE-01',
      adminName: 'Govender M. (Compliance Desk)',
      action: 'STUDIO_FEATURED',
      targetType: 'promotion',
      targetId: newPromo.id,
      targetName: newPromo.title,
      reason: `Promotion "${newPromo.title}" created for ${newPromo.studioName}`
    });

    return newPromo;
  }

  public updatePromotion(id: string, updates: Partial<StudioPromotion>): StudioPromotion | null {
    const index = this.promotions.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedItem = { ...this.promotions[index], ...updates };
    this.promotions[index] = updatedItem;
    this.savePromotions();

    this.logAudit({
      adminId: 'ADM-COMPLIANCE-01',
      adminName: 'Govender M. (Compliance Desk)',
      action: 'STUDIO_INFO_UPDATED',
      targetType: 'promotion',
      targetId: id,
      targetName: updatedItem.title,
      reason: `Promotion "${updatedItem.title}" updated`
    });

    return updatedItem;
  }

  public togglePromotionPublished(id: string): { success: boolean; isPublished: boolean; message: string } {
    const item = this.promotions.find((p) => p.id === id);
    if (!item) return { success: false, isPublished: false, message: 'Promotion not found' };

    // Eligibility check
    const studio = this.getStudioById(item.studioId);
    if (studio && (studio.approvalStatus !== 'approved' || studio.operationalStatus !== 'active' || studio.isDeleted)) {
      return { 
        success: false, 
        isPublished: item.isPublished, 
        message: `Cannot publish promotion: Studio "${studio.businessName}" is not currently approved and active.` 
      };
    }

    item.isPublished = !item.isPublished;
    this.savePromotions();

    this.logAudit({
      adminId: 'ADM-COMPLIANCE-01',
      adminName: 'Govender M. (Compliance Desk)',
      action: item.isPublished ? 'STUDIO_FEATURED' : 'STUDIO_UNFEATURED',
      targetType: 'promotion',
      targetId: id,
      targetName: item.title,
      reason: item.isPublished ? 'Promotion published to public store' : 'Promotion unpublished from public store'
    });

    return {
      success: true,
      isPublished: item.isPublished,
      message: item.isPublished ? 'Promotion published' : 'Promotion unpublished'
    };
  }

  public updatePromotionApproval(id: string, status: 'approved' | 'rejected'): boolean {
    const item = this.promotions.find((p) => p.id === id);
    if (!item) return false;
    item.approvalStatus = status;
    if (status === 'rejected') {
      item.isPublished = false;
    }
    this.savePromotions();
    return true;
  }

  public deletePromotion(id: string): boolean {
    const filtered = this.promotions.filter((p) => p.id !== id);
    if (filtered.length === this.promotions.length) return false;
    this.promotions = filtered;
    this.savePromotions();

    this.logAudit({
      adminId: 'ADM-COMPLIANCE-01',
      adminName: 'Govender M. (Compliance Desk)',
      action: 'STUDIO_SOFT_DELETED',
      targetType: 'promotion',
      targetId: id,
      targetName: id,
      reason: `Promotion removed by administrator`
    });

    return true;
  }
}

export const adminService = new AdminService();

