export interface ArtisanDocument {
  id: string;
  title: string;
  type: 'Trade Certificate' | 'CIPC Registration' | 'South African ID' | 'Health & Hygiene Permit' | 'Liability Insurance';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  verified: boolean;
  notes?: string;
}

export type ApplicationStatus = 'pending' | 'under_review' | 'changes_requested' | 'approved' | 'rejected';

export interface OperatingDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' | string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  hasBreak?: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
}

export interface ArtisanApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  idNumber: string;
  businessName: string;
  category: string;
  experienceYears: number;
  city: string;
  suburb: string;
  address: string;
  offersHouseCalls: boolean;
  serviceRadius: string;
  travelFee: number;
  bio: string;
  instagram: string;
  website?: string;
  documents: ArtisanDocument[];
  workingHours?: OperatingDay[];
  termsAccepted: boolean;
  popiaConsent: boolean;
  status: ApplicationStatus;
  submissionDate: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminDecisionReason?: string;
  studioId: string;
}

export interface StudioService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: string; // e.g. '75 min'
  durationMinutes?: number;
  imageUrl?: string;
  images: string[]; // Up to 5 photos specifically for this service
  coverImageIndex: number; // Index in `images` selected as cover
  isActive: boolean;
  popular?: boolean;
}

export interface StudioProfile {
  id: string;
  applicationId: string;
  businessName: string;
  founderName: string;
  founderTitle: string;
  headline: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  website: string;
  city: string;
  suburb: string;
  address: string;
  category: string;
  logoUrl: string;
  coverUrl: string;
  gallery: string[];
  offersHouseCalls: boolean;
  travelFee: number;
  serviceAreas: string;
  bufferMinutes: number;
  isPublished: boolean;
  operatingHours: OperatingDay[];
  services: StudioService[];
  monthlyBookings: number;
  monthlyRevenueZAR: number;
  averageRating: number;
  reviewCount: number;
}

export const DEFAULT_WEEKLY_SCHEDULE: OperatingDay[] = [
  { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '17:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
  { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
  { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00', hasBreak: false, breakStartTime: '13:00', breakEndTime: '14:00' },
  { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
  { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
  { day: 'Saturday', isOpen: true, openTime: '08:00', closeTime: '15:00', hasBreak: false, breakStartTime: '12:00', breakEndTime: '12:30' },
  { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '14:00', hasBreak: false, breakStartTime: '12:00', breakEndTime: '13:00' },
];

export const INITIAL_APPLICATIONS: ArtisanApplication[] = [
  {
    id: 'STZ-APP-2026-8812',
    applicantName: 'Nompumelelo Sithole',
    email: 'nompu.sithole@dermalclinic.co.za',
    phone: '+27 83 490 1284',
    idNumber: '920415 0284 08 2',
    businessName: 'Nompumelelo Dermal Lab & Skin Clinic',
    category: 'Clinical Skincare',
    experienceYears: 6,
    city: 'Johannesburg',
    suburb: 'Sandton Central',
    address: 'Suite 204, Sandton City Atrium, 83 Rivonia Rd, Sandton, 2196',
    offersHouseCalls: true,
    serviceRadius: 'Sandton, Morningside, Bryanston & Hyde Park (15km)',
    travelFee: 200,
    bio: 'Specialist medical aesthetician with clinical certification in non-invasive skin rejuvenation, chemical peeling, and hyperpigmentation therapy for African skin tones.',
    instagram: '@nompu_dermallab',
    website: 'https://www.nompudermal.co.za',
    documents: [
      {
        id: 'doc-1',
        title: 'CIDESCO Diploma in Aesthetics & Skincare',
        type: 'Trade Certificate',
        fileName: 'CIDESCO_Diploma_N_Sithole.pdf',
        fileSize: '2.4 MB',
        uploadDate: '24 Oct 2026',
        verified: false,
      },
      {
        id: 'doc-2',
        title: 'CIPC Company Registration Certificate',
        type: 'CIPC Registration',
        fileName: 'CIPC_CoReg_2024_981244_07.pdf',
        fileSize: '1.1 MB',
        uploadDate: '24 Oct 2026',
        verified: false,
      },
      {
        id: 'doc-3',
        title: 'City of Johannesburg Health & Sanitation Permit',
        type: 'Health & Hygiene Permit',
        fileName: 'JHB_Municipal_Health_Clearance_2026.pdf',
        fileSize: '890 KB',
        uploadDate: '24 Oct 2026',
        verified: false,
      },
      {
        id: 'doc-4',
        title: 'Certified South African National ID Document',
        type: 'South African ID',
        fileName: 'SA_ID_N_Sithole_Certified.pdf',
        fileSize: '750 KB',
        uploadDate: '24 Oct 2026',
        verified: false,
      }
    ],
    workingHours: [
      { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '17:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Wednesday', isOpen: false, openTime: '09:00', closeTime: '17:00' },
      { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '17:30', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '17:30', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Saturday', isOpen: true, openTime: '08:30', closeTime: '15:00', hasBreak: false },
      { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '13:00' },
    ],
    termsAccepted: true,
    popiaConsent: true,
    status: 'pending',
    submissionDate: '24 Oct 2026, 09:30 SAST',
    updatedAt: '24 Oct 2026, 09:30 SAST',
    studioId: 'studio-nompu-dermal'
  },
  {
    id: 'STZ-APP-2026-7540',
    applicantName: 'Lerato Khumalo',
    email: 'lerato@luxenailstudio.co.za',
    phone: '+27 82 459 1084',
    idNumber: '881104 0192 08 4',
    businessName: 'Luxe Nail Studio',
    category: 'Nail Couture',
    experienceYears: 8,
    city: 'Johannesburg',
    suburb: 'Rosebank',
    address: 'Suite 402, The Keyes Art Mile, 19 Keyes Ave, Rosebank, 2196',
    offersHouseCalls: true,
    serviceRadius: 'Rosebank, Sandton, Hyde Park & Houghton (Radius 12km)',
    travelFee: 150,
    bio: 'Lerato is an internationally certified master nail technician specializing in dry e-file Russian manicures, damage-free natural nail restoration, and sculptural Japanese BIAB builder overlays.',
    instagram: '@luxenailstudio.za',
    website: 'https://www.luxenailstudio.co.za',
    documents: [
      {
        id: 'doc-10',
        title: 'ITEC Master Nail Technology Certification',
        type: 'Trade Certificate',
        fileName: 'ITEC_Master_Nails_LeratoKhumalo.pdf',
        fileSize: '3.1 MB',
        uploadDate: '10 Aug 2026',
        verified: true,
      },
      {
        id: 'doc-11',
        title: 'Municipal Autoclave Sterilization Certificate',
        type: 'Health & Hygiene Permit',
        fileName: 'Rosebank_Clinic_Autoclave_Sterilization.pdf',
        fileSize: '1.4 MB',
        uploadDate: '10 Aug 2026',
        verified: true,
      }
    ],
    workingHours: [
      { day: 'Monday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Tuesday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Wednesday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Thursday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Friday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Saturday', isOpen: true, openTime: '08:00', closeTime: '17:00', hasBreak: false },
      { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '14:00' },
    ],
    termsAccepted: true,
    popiaConsent: true,
    status: 'approved',
    submissionDate: '10 Aug 2026, 11:15 SAST',
    updatedAt: '12 Aug 2026, 14:00 SAST',
    reviewedAt: '12 Aug 2026, 14:00 SAST',
    reviewedBy: 'Admin (Kagiso Molefe)',
    adminDecisionReason: 'Complete trade accreditation, certified autoclave inspection, and verified commercial lease at Keyes Art Mile.',
    studioId: 'luxe-nail-studio'
  },
  {
    id: 'STZ-APP-2026-6210',
    applicantName: 'Thabo Mthembu',
    email: 'thabo@mzansicrowns.co.za',
    phone: '+27 71 884 1029',
    idNumber: '900318 5184 08 9',
    businessName: 'Crown Sculpt Barbers & Braids',
    category: 'Gentlemen Grooming',
    experienceYears: 4,
    city: 'Pretoria',
    suburb: 'Menlyn',
    address: 'Menlyn Maine Central Square, Pretoria',
    offersHouseCalls: true,
    serviceRadius: 'Menlyn, Brooklyn, Hazelwood (10km)',
    travelFee: 120,
    bio: 'Master barber specialized in precision fades, hot towel eucalyptus shaves, and clean razor lineups.',
    instagram: '@crownsculpt_pta',
    documents: [
      {
        id: 'doc-20',
        title: 'Barber Trade Certificate',
        type: 'Trade Certificate',
        fileName: 'Barber_Trade_Certificate.pdf',
        fileSize: '1.8 MB',
        uploadDate: '15 Oct 2026',
        verified: false,
      }
    ],
    workingHours: [
      { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
      { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
      { day: 'Saturday', isOpen: true, openTime: '08:00', closeTime: '16:00' },
      { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '14:00' },
    ],
    termsAccepted: true,
    popiaConsent: true,
    status: 'changes_requested',
    submissionDate: '15 Oct 2026, 14:20 SAST',
    updatedAt: '16 Oct 2026, 10:15 SAST',
    reviewedAt: '16 Oct 2026, 10:15 SAST',
    reviewedBy: 'Admin (Kagiso Molefe)',
    adminDecisionReason: 'Please re-upload a clear certified copy of your South African ID Document and current Municipal Health Clearance certificate for your Menlyn Maine studio.',
    studioId: 'studio-crown-sculpt'
  }
];

export const INITIAL_STUDIOS: Record<string, StudioProfile> = {
  'luxe-nail-studio': {
    id: 'luxe-nail-studio',
    applicationId: 'STZ-APP-2026-7540',
    businessName: 'Luxe Nail Studio',
    founderName: 'Lerato Khumalo',
    founderTitle: 'Master Nail Artist & Educator',
    headline: 'High-precision Russian manicures, sculptural BIAB builder overlays, and couture Japanese nail art.',
    bio: 'Lerato is an internationally certified master nail technician with over 8 years of specialized experience in dry machine manicuring, damage-free natural nail restoration, and bespoke hand-painted botanical motifs. Trained in London and Seoul, she brings clinical sanitation and refined aesthetics to every client experience.',
    phone: '+27 11 880 2341',
    whatsapp: '+27 82 459 1084',
    email: 'lerato@luxenailstudio.co.za',
    instagram: '@luxenailstudio.za',
    website: 'https://www.luxenailstudio.co.za',
    city: 'Johannesburg',
    suburb: 'Rosebank',
    address: 'Suite 402, The Keyes Art Mile, 19 Keyes Ave, Rosebank, 2196',
    category: 'Nail Couture',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_q2c7xA3TXNeFJRWjCkmwEHv0weCDiHIs3Q6d0HTM6w3fo8pqHKIUqiqRFjIt7peIVAS5ITxly6B7f5ZnCLMeFTOg3CGppheNWZJSDERLU1lI9wSC-ZRHYKDN_kQV_6zhsp3NsOVdSzoDbML0Ll0_6GAwLWwZ_Udd7iyU3d7oqaHJ9zyvpp7T7pl47bDIUXVWuDFtVc8CCDh-WRptExJowIzjUcOj_6J064d38O1jS1wNt4V_ZLRy',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRo0jcALvSQ0kZn1E6Gb3syGczq7_n65vM6FDX7Kx_0JlrtRVs6IlD8-SxS3ZaErsCi6UEitGuHnaQmBqFWjfOC13flftfuGcwbZtjBfbLPVtyJXOstwVVqta3idXEj0wTZ0_89UHkUMxjLch7wrs4l_9mGFIXrAsIqa-_91ln-vfHZGP2nMxUvRB1MYBK25hf75G6TGP7p6wD4Jzp_y15YeyND-6zCoOrdg6C9Vkb7vwqy94gn_40',
    gallery: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    ],
    offersHouseCalls: true,
    travelFee: 150,
    serviceAreas: 'Rosebank, Sandton Central, Hyde Park, Houghton, Melrose Arch (Radius 12km)',
    bufferMinutes: 15,
    isPublished: true,
    operatingHours: [
      { day: 'Monday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Tuesday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Wednesday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Thursday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Friday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Saturday', isOpen: true, openTime: '08:00', closeTime: '17:00', hasBreak: false },
      { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '14:00' },
    ],
    services: [
      {
        id: 'biab-overlay',
        name: 'BIAB Builder Gel Overlay & Dry Prep',
        category: 'BIAB & Strengthening',
        duration: '90 min',
        durationMinutes: 90,
        price: 650,
        discountedPrice: 590,
        description: 'Comprehensive e-file cuticle clean, nail plate balancing, strengthening builder gel foundation, and long-wear pigmented gel finish.',
        imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80'
        ],
        coverImageIndex: 0,
        isActive: true,
        popular: true
      },
      {
        id: 'russian-manicure',
        name: 'Master Russian Couture Manicure',
        category: 'Manicures',
        duration: '75 min',
        durationMinutes: 75,
        price: 520,
        description: 'Diamond bit cuticle polishing with seamless skin smoothing, hydrating cuticle oil bath, and clean glass shine coat.',
        imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80'
        ],
        coverImageIndex: 0,
        isActive: true
      },
      {
        id: 'gel-x-extensions',
        name: 'Apres Gel-X Sculptural Extensions (Full Set)',
        category: 'Extensions',
        duration: '105 min',
        durationMinutes: 105,
        price: 850,
        discountedPrice: 790,
        description: 'Full-cover soft gel tips custom sized to your nail bed. Includes dry prep, chosen length, shaping, and single shade lacquer.',
        imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80'
        ],
        coverImageIndex: 0,
        isActive: true,
        popular: true
      },
      {
        id: 'bespoke-nail-art',
        name: 'Couture Hand-Painted Nail Art (Tier 2)',
        category: 'Art & Embellishments',
        duration: '30 min',
        durationMinutes: 30,
        price: 280,
        description: 'Chrome glazes, micro-French lines, tortoiseshell, 3D droplets, or minimal geometric accents across all 10 fingers.',
        imageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80'
        ],
        coverImageIndex: 0,
        isActive: true
      },
      {
        id: 'medi-pedicure',
        name: 'Medical Callus Peel & Deep Spa Pedicure',
        category: 'Pedicures',
        duration: '60 min',
        durationMinutes: 60,
        price: 590,
        description: 'AHA fruit acid heel treatment, hot towel wrap, exfoliating sea-salt scrub, massage, and gel polish.',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
        ],
        coverImageIndex: 0,
        isActive: false
      }
    ],
    monthlyBookings: 64,
    monthlyRevenueZAR: 43200,
    averageRating: 4.98,
    reviewCount: 242,
  },
  'studio-nompu-dermal': {
    id: 'studio-nompu-dermal',
    applicationId: 'STZ-APP-2026-8812',
    businessName: 'Nompumelelo Dermal Lab & Skin Clinic',
    founderName: 'Nompumelelo Sithole',
    founderTitle: 'Clinical Aesthetician & Dermal Specialist',
    headline: 'High-performance dermal facials, chemical peels, and microneedling for radiant melanin skin.',
    bio: 'Specialist medical aesthetician with clinical certification in non-invasive skin rejuvenation, chemical peeling, and hyperpigmentation therapy for African skin tones.',
    phone: '+27 83 490 1284',
    whatsapp: '+27 83 490 1284',
    email: 'nompu.sithole@dermalclinic.co.za',
    instagram: '@nompu_dermallab',
    website: 'https://www.nompudermal.co.za',
    city: 'Johannesburg',
    suburb: 'Sandton Central',
    address: 'Suite 204, Sandton City Atrium, 83 Rivonia Rd, Sandton, 2196',
    category: 'Clinical Skincare',
    logoUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
    ],
    offersHouseCalls: true,
    travelFee: 200,
    serviceAreas: 'Sandton, Morningside, Bryanston & Hyde Park (15km)',
    bufferMinutes: 20,
    isPublished: false, // Locked until admin approves
    operatingHours: [
      { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '17:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Wednesday', isOpen: false, openTime: '09:00', closeTime: '17:00' },
      { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '17:30', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '17:30', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Saturday', isOpen: true, openTime: '08:30', closeTime: '15:00', hasBreak: false },
      { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '13:00' },
    ],
    services: [
      {
        id: 'clinical-dermaplane',
        name: 'Medical Dermaplaning & Brightening Peel',
        category: 'Clinical Facials',
        duration: '60 min',
        durationMinutes: 60,
        price: 850,
        discountedPrice: 750,
        description: 'Surgical blade exfoliation with mandelic acid brightener and soothing peptide jelly mask.',
        imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
        ],
        coverImageIndex: 0,
        isActive: true,
        popular: true
      }
    ],
    monthlyBookings: 0,
    monthlyRevenueZAR: 0,
    averageRating: 5.0,
    reviewCount: 0,
  }
};
