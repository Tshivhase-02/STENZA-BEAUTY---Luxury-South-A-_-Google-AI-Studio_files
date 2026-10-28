export interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: number; // in ZAR
  description: string;
  category: string;
  popular?: boolean;
}

export interface ReviewItem {
  id: string;
  clientName: string;
  clientAvatar: string;
  clientLocation: string;
  rating: number;
  date: string;
  treatment: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface Provider {
  id: string;
  name: string;
  founder: string;
  founderTitle: string;
  headline: string;
  badge: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  completedBookings: number;
  city: string;
  suburb: string;
  address: string;
  providerType: 'Salon' | 'Mobile' | 'Independent' | 'Home Studio';
  offersMobile: boolean;
  mobileCoverage?: string;
  travelFee?: number;
  phone: string;
  whatsapp: string;
  instagram: string;
  bio: string;
  experienceYears: number;
  amenities: string[];
  categories: string[];
  startingPrice: number;
  highestPrice: number;
  gallery: string[];
  services: ServiceItem[];
  reviews: ReviewItem[];
  ratingBreakdown: {
    punctuality: number;
    cleanliness: number;
    skill: number;
    communication: number;
    ambiance: number;
  };
  openingHours: {
    day: string;
    hours: string;
  }[];
}

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerSuburb: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  status: 'pending' | 'upcoming' | 'completed' | 'cancelled';
  serviceType: 'in-studio' | 'mobile';
  address: string;
  referenceCode: string;
  bookedAt: string;
  notes?: string;
  rating?: number;
  review?: string;
  reviewedAt?: string;
}

export interface BeautyProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  description: string;
  badge?: string;
}

export const CATEGORIES = [
  { id: 'hair', name: 'Luxury Hair', icon: 'content_cut', count: '1,420+ Artisans', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80' },
  { id: 'nails', name: 'Nail Couture', icon: 'brush', count: '980+ Studios', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80' },
  { id: 'skincare', name: 'Clinical Skincare', icon: 'spa', count: '640+ Specialists', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80' },
  { id: 'makeup', name: 'Artisan Makeup', icon: 'palette', count: '520+ Artists', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80' },
  { id: 'spa', name: 'Spa & Wellness', icon: 'self_improvement', count: '390+ Sanctuaries', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80' },
  { id: 'lashes', name: 'Lashes & Brows', icon: 'visibility', count: '710+ Stylists', img: 'https://images.unsplash.com/photo-1512290900672-1f4a9c8f2b74?auto=format&fit=crop&w=600&q=80' },
  { id: 'grooming', name: 'Gentlemen Grooming', icon: 'face', count: '460+ Master Barbers', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80' },
  { id: 'aesthetics', name: 'Aesthetic Medicine', icon: 'healing', count: '210+ Clinics', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80' },
];

export const CITIES_DATA = [
  {
    name: 'Johannesburg',
    province: 'Gauteng',
    suburbs: ['Sandton', 'Rosebank', 'Hyde Park', 'Melrose Arch', 'Bryanston', 'Melville', 'Fourways'],
    count: '1,840+ Pros',
    image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Cape Town',
    province: 'Western Cape',
    suburbs: ['Camps Bay', 'V&A Waterfront', 'Kloof Street', 'Sea Point', 'Constantia', 'Claremont'],
    count: '1,420+ Pros',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Durban',
    province: 'KwaZulu-Natal',
    suburbs: ['Umhlanga', 'Morningside', 'Florida Road', 'Ballito', 'Durban North', 'Westville'],
    count: '890+ Pros',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Pretoria',
    province: 'Gauteng',
    suburbs: ['Menlyn Maine', 'Brooklyn', 'Hazelwood', 'Waterkloof', 'Centurion', 'Lynnwood'],
    count: '650+ Pros',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
  }
];

export const ALL_PROVINCES = [
  {
    province: 'Gauteng',
    cities: ['Johannesburg (Sandton, Rosebank, Hyde Park)', 'Pretoria (Menlyn, Brooklyn, Hazelwood)', 'Centurion', 'Midrand']
  },
  {
    province: 'Western Cape',
    cities: ['Cape Town (Camps Bay, Waterfront, Sea Point)', 'Stellenbosch & Winelands', 'Franschhoek', 'Somerset West']
  },
  {
    province: 'KwaZulu-Natal',
    cities: ['Durban (Umhlanga, Morningside)', 'Ballito & Dolphin Coast', 'Pietermaritzburg']
  },
  {
    province: 'Eastern Cape & Others',
    cities: ['Gqeberha (Port Elizabeth)', 'East London', 'Bloemfontein (Free State)', 'Nelspruit (Mpumalanga)']
  }
];

export const PROVIDERS: Provider[] = [
  {
    id: 'luxe-nail-studio',
    name: 'Luxe Nail Studio',
    founder: 'Lerato Khumalo',
    founderTitle: 'Master Nail Artist & Educator',
    headline: 'High-precision Russian manicures, sculptural BIAB builder overlays, and couture Japanese nail art.',
    badge: 'Premier Verified Artisan',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_q2c7xA3TXNeFJRWjCkmwEHv0weCDiHIs3Q6d0HTM6w3fo8pqHKIUqiqRFjIt7peIVAS5ITxly6B7f5ZnCLMeFTOg3CGppheNWZJSDERLU1lI9wSC-ZRHYKDN_kQV_6zhsp3NsOVdSzoDbML0Ll0_6GAwLWwZ_Udd7iyU3d7oqaHJ9zyvpp7T7pl47bDIUXVWuDFtVc8CCDh-WRptExJowIzjUcOj_6J064d38O1jS1wNt4V_ZLRy',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRo0jcALvSQ0kZn1E6Gb3syGczq7_n65vM6FDX7Kx_0JlrtRVs6IlD8-SxS3ZaErsCi6UEitGuHnaQmBqFWjfOC13flftfuGcwbZtjBfbLPVtyJXOstwVVqta3idXEj0wTZ0_89UHkUMxjLch7wrs4l_9mGFIXrAsIqa-_91ln-vfHZGP2nMxUvRB1MYBK25hf75G6TGP7p6wD4Jzp_y15YeyND-6zCoOrdg6C9Vkb7vwqy94gn_40',
    rating: 4.98,
    reviewCount: 242,
    completedBookings: 890,
    city: 'Johannesburg',
    suburb: 'Rosebank',
    address: 'Suite 402, The Keyes Art Mile, 19 Keyes Ave, Rosebank, 2196',
    providerType: 'Salon',
    offersMobile: true,
    mobileCoverage: 'Rosebank, Sandton, Hyde Park & Houghton (Radius 12km)',
    travelFee: 150,
    phone: '+27 11 880 2341',
    whatsapp: '+27 82 459 1084',
    instagram: '@luxenailstudio.za',
    bio: 'Lerato is an internationally certified master nail technician with over 8 years of specialized experience in dry machine manicuring, damage-free natural nail restoration, and bespoke hand-painted botanical motifs. Trained in London and Seoul, she brings clinical sanitation and refined aesthetics to every client experience.',
    experienceYears: 8,
    amenities: [
      'Espresso & Botanical Tea Bar',
      'High-Speed Wi-Fi',
      'Medical-grade Autoclave Sterilization',
      'Private VIP Suite Available',
      'Secure Underground Parking',
      'Card & Instant EFT Accepted'
    ],
    categories: ['Nails', 'Lashes & Brows'],
    startingPrice: 480,
    highestPrice: 950,
    gallery: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
    ],
    services: [
      {
        id: 'biab-overlay',
        name: 'BIAB Builder Gel Overlay & Dry Prep',
        duration: '90 min',
        price: 650,
        description: 'Comprehensive e-file cuticle clean, nail plate balancing, strengthening builder gel foundation, and long-wear pigmented gel finish.',
        category: 'BIAB & Strengthening',
        popular: true
      },
      {
        id: 'russian-manicure',
        name: 'Master Russian Couture Manicure',
        duration: '75 min',
        price: 520,
        description: 'Diamond bit cuticle polishing with seamless skin smoothing, hydrating cuticle oil bath, and clean glass shine coat.',
        category: 'Manicures'
      },
      {
        id: 'gel-x-extensions',
        name: 'Apres Gel-X Sculptural Extensions (Full Set)',
        duration: '105 min',
        price: 850,
        description: 'Full-cover soft gel tips custom sized to your nail bed. Includes dry prep, chosen length, shaping, and single shade lacquer.',
        category: 'Extensions',
        popular: true
      },
      {
        id: 'bespoke-nail-art',
        name: 'Couture Hand-Painted Nail Art (Tier 2)',
        duration: '30 min',
        price: 280,
        description: 'Chrome glazes, micro-French lines, tortoiseshell, 3D droplets, or minimal geometric accents across all 10 fingers.',
        category: 'Art & Embellishments'
      },
      {
        id: 'medi-pedicure',
        name: 'Medical Callus Peel & Deep Spa Pedicure',
        duration: '60 min',
        price: 590,
        description: 'AHA fruit acid heel treatment, hot towel wrap, exfoliating sea-salt scrub, massage, and gel polish.',
        category: 'Pedicures'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Naledi Mokwena',
        clientAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoBMuyv1m3ZJeonXSXPwSf9fXxjbLsXmfygfObrLMx9cB8CIEn-BPGAUAazFtUHgteMW0-h8xYzh1AvlcYd_Ht8n1wANl4VfUq9Qdf2gCVXKfusgS_BInruAJ2lTrInOCFiexMWfMOu4fTEQB2L5YKlWabC-Jnmvs_5wwrtmlyi2-hbSnAZA2EmQOnAV1OdT6qRdZig0y_Cn7Ui-BU741im3hnDMoJeS4IbH2z-XSG-rpKSkgP-w_r',
        clientLocation: 'Sandton, JHB',
        rating: 5,
        date: '3 days ago',
        treatment: 'BIAB Builder Gel Overlay & Dry Prep',
        comment: 'Lerato’s precision is second to none in Johannesburg. My natural nails have never grown this long or felt so healthy. The Keyes Art Mile studio is tranquil and gorgeous.',
        verified: true,
        helpfulCount: 18
      },
      {
        id: 'rev-2',
        clientName: 'Sarah Van Zyl',
        clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        clientLocation: 'Rosebank, JHB',
        rating: 5,
        date: '1 week ago',
        treatment: 'Apres Gel-X Sculptural Extensions',
        comment: 'Cleanest cuticles in Gauteng! Lasted 4 full weeks without a single chip. The complimentary oat milk flat white was also delicious.',
        verified: true,
        helpfulCount: 9
      },
      {
        id: 'rev-3',
        clientName: 'Bontle Sithole',
        clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        clientLocation: 'Hyde Park, JHB',
        rating: 5,
        date: '2 weeks ago',
        treatment: 'Master Russian Couture Manicure',
        comment: 'Incredible attention to hygiene and detail. Hospital grade sanitation gave me absolute peace of mind.',
        verified: true,
        helpfulCount: 14
      }
    ],
    ratingBreakdown: {
      punctuality: 4.99,
      cleanliness: 5.0,
      skill: 4.98,
      communication: 4.95,
      ambiance: 4.97
    },
    openingHours: [
      { day: 'Monday - Friday', hours: '08:30 - 18:00' },
      { day: 'Saturday', hours: '08:00 - 17:00' },
      { day: 'Sunday & Public Holidays', hours: '09:00 - 14:00' }
    ]
  },
  {
    id: 'sovereign-crown-salon',
    name: 'Sovereign Crown Salon',
    founder: 'Keabetswe Molefe',
    founderTitle: 'Master Trichologist & Natural Hair Artisan',
    headline: 'Silk presses, steam hydration therapies, and bespoke microloc maintenance for textured crowns.',
    badge: 'Award-Winning Salon',
    avatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    rating: 4.96,
    reviewCount: 312,
    completedBookings: 1240,
    city: 'Johannesburg',
    suburb: 'Sandton',
    address: 'Shop 12, Nelson Mandela Square, Sandton Central, 2196',
    providerType: 'Salon',
    offersMobile: false,
    phone: '+27 11 784 9012',
    whatsapp: '+27 83 291 4001',
    instagram: '@sovereigncrown.jhb',
    bio: 'Dedicated to preserving afro-textured hair integrity with tailored scientific treatments, low-tension protective styling, and featherlight bouncy silk presses.',
    experienceYears: 11,
    amenities: ['Champagne Lounge', 'Steam Scalp Mist Rooms', 'Private Pods', 'WiFi', 'Valet Parking'],
    categories: ['Hair'],
    startingPrice: 550,
    highestPrice: 2200,
    gallery: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    ],
    services: [
      {
        id: 'crown-silk-press',
        name: 'Crown Silk Press & Deep Steam Therapy',
        duration: '120 min',
        price: 850,
        description: 'Detoxifying scalp wash, infrared steam therapy with chebe oil infusion, tension-free blow dry, and silk press finish.',
        category: 'Silk Press & Smoothing',
        popular: true
      },
      {
        id: 'microlocs-retie',
        name: 'Microlocs Retightening & Scalp Tonic',
        duration: '180 min',
        price: 1450,
        description: 'Precision interlock rotation, hairline gentle treatment, and rosemary peppermint soothing rinse.',
        category: 'Locs & Protective'
      }
    ],
    reviews: [
      {
        id: 'rev-201',
        clientName: 'Kagiso M.',
        clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        clientLocation: 'Morningside, JHB',
        rating: 5,
        date: '5 days ago',
        treatment: 'Crown Silk Press & Deep Steam Therapy',
        comment: 'Keabetswe understood my 4C hair needs completely. Zero heat damage and the bounce lasted 3 weeks in JHB humidity!',
        verified: true,
        helpfulCount: 22
      }
    ],
    ratingBreakdown: { punctuality: 4.95, cleanliness: 4.99, skill: 4.98, communication: 4.94, ambiance: 4.96 },
    openingHours: [
      { day: 'Tuesday - Saturday', hours: '08:00 - 18:00' },
      { day: 'Sunday', hours: '09:00 - 15:00' }
    ]
  },
  {
    id: 'velvet-glow-aesthetics',
    name: 'Velvet Glow Aesthetics',
    founder: 'Dr. Thandiwe Sithole',
    founderTitle: 'Cosmetic Physician & Dermal Clinician',
    headline: 'High-performance clinical facials, dermaplaning, and medical-grade peeling for radiant melanin-rich skin.',
    badge: 'Clinical Excellence',
    avatar: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.99,
    reviewCount: 188,
    completedBookings: 670,
    city: 'Cape Town',
    suburb: 'Camps Bay',
    address: 'The Promenade, Victoria Road, Camps Bay, 8005',
    providerType: 'Salon',
    offersMobile: false,
    phone: '+27 21 438 8800',
    whatsapp: '+27 79 123 4567',
    instagram: '@velvetglow.cpt',
    bio: 'Medical aesthetics sanctuary overlooking the Atlantic Ocean. Specializing in hyperpigmentation correction, micro-needling, and peptide revitalization.',
    experienceYears: 12,
    amenities: ['Ocean View Consult Suites', 'Complimentary Botanical Tonics', 'Medical Diagnostic Scan', 'Private Parking'],
    categories: ['Clinical Skincare', 'Aesthetic Medicine'],
    startingPrice: 650,
    highestPrice: 3500,
    gallery: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512290900672-1f4a9c8f2b74?auto=format&fit=crop&w=600&q=80'
    ],
    services: [
      {
        id: 'hydra-glow-facial',
        name: 'Signature Glow Hydra-Facial & LED Therapy',
        duration: '75 min',
        price: 1200,
        description: 'Triple vortex suction extraction, salicylic-hyaluronic infusion, lymphatic drainage, and customized medical LED canopy.',
        category: 'Facials',
        popular: true
      },
      {
        id: 'dermaplane-peel',
        name: 'Surgical Dermaplaning & Mandelic Glow Peel',
        duration: '60 min',
        price: 890,
        description: 'Fine vellus hair and dead keratinocyte removal with sterile surgical blade, followed by ultra-gentle brightening mandelic acid.',
        category: 'Exfoliation & Peels'
      }
    ],
    reviews: [
      {
        id: 'rev-301',
        clientName: 'Dominique Marais',
        clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        clientLocation: 'Camps Bay, CPT',
        rating: 5,
        date: '2 weeks ago',
        treatment: 'Signature Glow Hydra-Facial & LED Therapy',
        comment: 'Dr. Thandiwe transformed my persistent pigmentation. My skin is literally reflecting light without makeup.',
        verified: true,
        helpfulCount: 31
      }
    ],
    ratingBreakdown: { punctuality: 5.0, cleanliness: 5.0, skill: 5.0, communication: 4.98, ambiance: 4.99 },
    openingHours: [
      { day: 'Monday - Friday', hours: '09:00 - 17:30' },
      { day: 'Saturday', hours: '09:00 - 14:00' }
    ]
  },
  {
    id: 'eden-sculpt-bar',
    name: 'Eden Sculpt Bar & Spa',
    founder: 'Zanele Dlamini',
    founderTitle: 'Holistic Body Therapist & Spa Director',
    headline: 'African botanic stone massage, lymphatic drainage, and rejuvenating ocean mist body therapies.',
    badge: 'Coastal Retreat',
    avatar: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    rating: 4.94,
    reviewCount: 164,
    completedBookings: 540,
    city: 'Durban',
    suburb: 'Umhlanga',
    address: 'Oceans Mall Tower, Lighthouse Rd, Umhlanga Rocks, 4320',
    providerType: 'Salon',
    offersMobile: true,
    mobileCoverage: 'Umhlanga, Durban North, Morningside',
    travelFee: 180,
    phone: '+27 31 561 2290',
    whatsapp: '+27 82 998 1234',
    instagram: '@edensculpt.dbn',
    bio: 'Rebalancing mind and body using indigenous South African extracts: marula, rooibos, and kalahari melon.',
    experienceYears: 9,
    amenities: ['Eucalyptus Steam Room', 'Warm Herbal Tea Bar', 'Couples Suites', 'Ocean Breeze Balcony'],
    categories: ['Spa & Wellness'],
    startingPrice: 480,
    highestPrice: 1800,
    gallery: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80'
    ],
    services: [
      {
        id: 'hot-stone-massage',
        name: 'Durban Basalt Hot Stone & Marula Ritual',
        duration: '90 min',
        price: 950,
        description: 'Smooth volcanic stones paired with warm organic marula butter to release muscular tension and reset lymphatic flow.',
        category: 'Body Massage',
        popular: true
      }
    ],
    reviews: [
      {
        id: 'rev-401',
        clientName: 'Priya Naidoo',
        clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        clientLocation: 'Umhlanga, DBN',
        rating: 5,
        date: '1 month ago',
        treatment: 'Durban Basalt Hot Stone & Marula Ritual',
        comment: 'Pure bliss. The views of the Indian ocean during the botanical soak are heavenly.',
        verified: true,
        helpfulCount: 12
      }
    ],
    ratingBreakdown: { punctuality: 4.93, cleanliness: 4.98, skill: 4.96, communication: 4.92, ambiance: 4.97 },
    openingHours: [
      { day: 'Monday - Sunday', hours: '08:00 - 19:00' }
    ]
  },
  {
    id: 'mane-co-grooming',
    name: 'Mane & Co. Artisan Grooming',
    founder: 'Sipho Nkosi',
    founderTitle: 'Master Barber & Stylist',
    headline: 'Precision razor fades, hot towel eucalyptus shaves, and bespoke beard sculpting in Menlyn.',
    badge: 'Gentlemen Choice',
    avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    rating: 4.97,
    reviewCount: 220,
    completedBookings: 910,
    city: 'Pretoria',
    suburb: 'Menlyn',
    address: 'Menlyn Maine Central Square, Aramist Ave, Pretoria, 0181',
    providerType: 'Salon',
    offersMobile: true,
    mobileCoverage: 'Pretoria East, Brooklyn, Waterkloof',
    travelFee: 120,
    phone: '+27 12 348 7720',
    whatsapp: '+27 84 555 1290',
    instagram: '@maneandco.pta',
    bio: 'Crafting tailored gentleman aesthetics with modern scissors mastery and traditional straight-edge barbering traditions.',
    experienceYears: 10,
    amenities: ['Artisanal Single Malt Bar', 'Leather Recliners', 'Express Polish', 'WiFi'],
    categories: ['Gentlemen Grooming'],
    startingPrice: 250,
    highestPrice: 950,
    gallery: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80'
    ],
    services: [
      {
        id: 'royal-shave-cut',
        name: 'The Royal Cut, Beard Sculpt & Hot Towel Treatment',
        duration: '60 min',
        price: 450,
        description: 'Skin fade or scissor crop, precision hot lather straight razor beard lining, mint facial compress, and styling pomade.',
        category: 'Hair & Beard',
        popular: true
      }
    ],
    reviews: [
      {
        id: 'rev-501',
        clientName: 'Johan Becker',
        clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        clientLocation: 'Waterkloof, PTA',
        rating: 5,
        date: '4 days ago',
        treatment: 'The Royal Cut, Beard Sculpt & Hot Towel Treatment',
        comment: 'Sipho is the best barber in Pretoria without question. Sharpest fades and top tier customer service.',
        verified: true,
        helpfulCount: 8
      }
    ],
    ratingBreakdown: { punctuality: 4.98, cleanliness: 4.97, skill: 4.99, communication: 4.96, ambiance: 4.95 },
    openingHours: [
      { day: 'Monday - Saturday', hours: '08:30 - 18:30' }
    ]
  },
  {
    id: 'aura-lash-brow',
    name: 'Aura Lash & Brow Studio',
    founder: 'Chloe Van Der Merwe',
    founderTitle: 'Lash Master & Microblade Artist',
    headline: 'Weightless Russian volume lashes, HD brow lamination, and keratin lash lifts.',
    badge: 'Lash Specialist',
    avatar: 'https://images.unsplash.com/photo-1512290900672-1f4a9c8f2b74?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    reviewCount: 145,
    completedBookings: 480,
    city: 'Cape Town',
    suburb: 'V&A Waterfront',
    address: 'The Silo District, South Arm Rd, Waterfront, 8001',
    providerType: 'Independent',
    offersMobile: false,
    phone: '+27 21 408 7600',
    whatsapp: '+27 76 345 8899',
    instagram: '@auralashes.cpt',
    bio: 'Customizing lash maps to enhance each eye shape effortlessly. Using hypoallergenic cruelty-free silk fibres and sensitive medical adhesives.',
    experienceYears: 7,
    amenities: ['Memory Foam Cloud Beds', 'Aromatherapy Diffusers', 'Lash Aftercare Kit Included'],
    categories: ['Lashes & Brows'],
    startingPrice: 380,
    highestPrice: 1400,
    gallery: [
      'https://images.unsplash.com/photo-1512290900672-1f4a9c8f2b74?auto=format&fit=crop&w=600&q=80'
    ],
    services: [
      {
        id: 'brow-lamination',
        name: 'Sculpted Brow Lamination, Tint & Shape',
        duration: '50 min',
        price: 450,
        description: 'Keratin infused brow lifting, custom hybrid tinting, and precise tweezing for feathery runway brows.',
        category: 'Brows',
        popular: true
      }
    ],
    reviews: [
      {
        id: 'rev-601',
        clientName: 'Naledi Mokwena',
        clientAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoBMuyv1m3ZJeonXSXPwSf9fXxjbLsXmfygfObrLMx9cB8CIEn-BPGAUAazFtUHgteMW0-h8xYzh1AvlcYd_Ht8n1wANl4VfUq9Qdf2gCVXKfusgS_BInruAJ2lTrInOCFiexMWfMOu4fTEQB2L5YKlWabC-Jnmvs_5wwrtmlyi2-hbSnAZA2EmQOnAV1OdT6qRdZig0y_Cn7Ui-BU741im3hnDMoJeS4IbH2z-XSG-rpKSkgP-w_r',
        clientLocation: 'Sandton, JHB',
        rating: 5,
        date: '28 Sep',
        treatment: 'Sculpted Brow Lamination, Tint & Shape',
        comment: 'Booked Chloe while visiting Cape Town for work. Brows stayed lifted for 6 weeks straight. Obsessed!',
        verified: true,
        helpfulCount: 16
      }
    ],
    ratingBreakdown: { punctuality: 4.96, cleanliness: 4.99, skill: 4.97, communication: 4.93, ambiance: 4.96 },
    openingHours: [
      { day: 'Monday - Saturday', hours: '09:00 - 17:00' }
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-2026-904',
    providerId: 'luxe-nail-studio',
    providerName: 'Luxe Nail Studio',
    providerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_q2c7xA3TXNeFJRWjCkmwEHv0weCDiHIs3Q6d0HTM6w3fo8pqHKIUqiqRFjIt7peIVAS5ITxly6B7f5ZnCLMeFTOg3CGppheNWZJSDERLU1lI9wSC-ZRHYKDN_kQV_6zhsp3NsOVdSzoDbML0Ll0_6GAwLWwZ_Udd7iyU3d7oqaHJ9zyvpp7T7pl47bDIUXVWuDFtVc8CCDh-WRptExJowIzjUcOj_6J064d38O1jS1wNt4V_ZLRy',
    providerSuburb: 'Rosebank, Johannesburg',
    serviceId: 'biab-overlay',
    serviceName: 'BIAB Builder Gel Overlay & Dry Prep',
    servicePrice: 650,
    date: 'Tomorrow, 14:00',
    time: '14:00 (90 min)',
    status: 'pending',
    serviceType: 'in-studio',
    address: 'Suite 402, The Keyes Art Mile, 19 Keyes Ave, Rosebank',
    referenceCode: 'STZ-8821-JHB',
    bookedAt: 'Today at 09:15',
    notes: 'Please add subtle milky white chrome glaze if time permits.'
  },
  {
    id: 'BK-2026-879',
    providerId: 'sovereign-crown-salon',
    providerName: 'Sovereign Crown Salon',
    providerAvatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
    providerSuburb: 'Sandton Central, Johannesburg',
    serviceId: 'crown-silk-press',
    serviceName: 'Crown Silk Press & Deep Steam Therapy',
    servicePrice: 850,
    date: 'Saturday 28 Oct, 10:30',
    time: '10:30 (120 min)',
    status: 'upcoming',
    serviceType: 'in-studio',
    address: 'Shop 12, Nelson Mandela Square, Sandton Central',
    referenceCode: 'STZ-7740-SND',
    bookedAt: '2 days ago'
  },
  {
    id: 'BK-2026-810',
    providerId: 'velvet-glow-aesthetics',
    providerName: 'Velvet Glow Aesthetics',
    providerAvatar: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    providerSuburb: 'Camps Bay, Cape Town',
    serviceId: 'hydra-glow-facial',
    serviceName: 'Signature Glow Hydra-Facial & LED Therapy',
    servicePrice: 1200,
    date: '12 Oct 2026',
    time: '11:00 (75 min)',
    status: 'completed',
    serviceType: 'in-studio',
    address: 'The Promenade, Victoria Road, Camps Bay',
    referenceCode: 'STZ-6192-CPT',
    bookedAt: '10 Oct 2026',
    rating: 5,
    review: 'Dr. Thandiwe was gentle, hygienic, and thoroughly explained every step of the Hydra-Facial. My skin is glowing!',
    reviewedAt: '13 Oct 2026'
  },
  {
    id: 'BK-2026-750',
    providerId: 'aura-lash-brow',
    providerName: 'Aura Lash & Brow Studio',
    providerAvatar: 'https://images.unsplash.com/photo-1512290900672-1f4a9c8f2b74?auto=format&fit=crop&w=600&q=80',
    providerSuburb: 'Waterfront, Cape Town',
    serviceId: 'brow-lamination',
    serviceName: 'Sculpted Brow Lamination, Tint & Shape',
    servicePrice: 450,
    date: '28 Sep 2026',
    time: '15:00 (50 min)',
    status: 'completed',
    serviceType: 'in-studio',
    address: 'The Silo District, South Arm Rd, Waterfront',
    referenceCode: 'STZ-5032-VNA',
    bookedAt: '26 Sep 2026'
  }
];

export const CURATED_PRODUCTS: BeautyProduct[] = [
  // Skincare Products
  {
    id: 'prod-1',
    name: 'Marula Gold Botanical Facial Elixir',
    brand: 'STENZA Apothecary',
    price: 680,
    rating: 4.96,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1608248597359-545a90e386e6?auto=format&fit=crop&w=600&q=80',
    category: 'skincare-products',
    description: 'Cold-pressed wild harvested Limpopo marula oil with vitamin C & CoQ10 for radiant dewy glow.',
    badge: 'Award Winner'
  },
  {
    id: 'prod-2',
    name: 'Cape Chamomile Calming Mist',
    brand: 'Botanica Botanica',
    price: 350,
    rating: 4.88,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    category: 'skincare-products',
    description: 'Hydrosol spray steam-distilled from Fynbos flowers to immediately cool flushed post-treatment skin.'
  },
  {
    id: 'prod-3',
    name: 'Rooibos Infused Micro-Peel Scrub',
    brand: 'Cape Botanicals',
    price: 390,
    rating: 4.90,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
    category: 'skincare-products',
    description: 'Ultra-fine enzymatic physical exfoliator with red bush antioxidants to resurface skin texture.'
  },

  // Makeup & Cosmetics
  {
    id: 'prod-4',
    name: 'Kalahari Sunset Velvet Lip Glaze',
    brand: 'Mzansi Glamour',
    price: 320,
    rating: 4.94,
    reviewsCount: 78,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    category: 'makeup-cosmetics',
    description: 'Ultra-pigmented hydrating lip gloss with golden shimmer inspired by Kalahari desert sunsets.',
    badge: 'Best Seller'
  },
  {
    id: 'prod-5',
    name: 'Melanin Match HD Setting Powder',
    brand: 'STENZA Artistry',
    price: 460,
    rating: 4.97,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    category: 'makeup-cosmetics',
    description: 'Flashback-free micro-milled translucent powder formulated specifically for warm and deep skin undertones.'
  },

  // Hair Care Products
  {
    id: 'prod-6',
    name: 'Baobab Restorative Hair & Scalp Soufflé',
    brand: 'Mzansi Crowns',
    price: 550,
    rating: 4.98,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    category: 'hair-care-products',
    description: 'Intense moisture sealant formulation enriched with baobab proteins and essential mint leaves.',
    badge: 'Salon Grade'
  },
  {
    id: 'prod-7',
    name: 'Organic Chebe Growth & Edge Drops',
    brand: 'AfroBotanix Lab',
    price: 380,
    rating: 4.91,
    reviewsCount: 135,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
    category: 'hair-care-products',
    description: 'Stimulating hair oil with authentic Chebe seed infusion, peppermint oil, and rosemary extract.'
  },

  // Wigs & Hair Extensions
  {
    id: 'prod-8',
    name: 'Raw Cambodian HD Lace Frontal Wig (26")',
    brand: 'Crown Luxe Hair',
    price: 4850,
    rating: 4.99,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
    category: 'wigs-hair-extensions',
    description: 'Unprocessed single-donor raw hair with invisible HD lace and pre-plucked natural hairline.',
    badge: 'Luxury Tier'
  },
  {
    id: 'prod-9',
    name: 'Deep Wave Virgin Hair Bundles (3-Pack)',
    brand: 'Crown Luxe Hair',
    price: 2950,
    rating: 4.93,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1522337094345-a044afc6d0d6?auto=format&fit=crop&w=600&q=80',
    category: 'wigs-hair-extensions',
    description: '100% cuticle-intact virgin deep wave bundles that bleach effortlessly up to 613 blonde.'
  },

  // Fragrances & Body Care
  {
    id: 'prod-10',
    name: 'Kalahari Melon Radiance Body Butter',
    brand: 'STENZA Naturals',
    price: 420,
    rating: 4.92,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    category: 'fragrances-body-care',
    description: 'Rich whipped hydration infused with Kalahari melon seed extract and organic shea.',
    badge: 'Best Seller'
  },
  {
    id: 'prod-11',
    name: 'Cape Fynbos Nectar Eau de Parfum (100ml)',
    brand: 'Artisan Perfumery SA',
    price: 1250,
    rating: 4.96,
    reviewsCount: 49,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    category: 'fragrances-body-care',
    description: 'Handcrafted signature scent capturing indigenous wild heather, pink pepper, and warm vanilla sandalwood.'
  },

  // Herbal & Wellness Products
  {
    id: 'prod-12',
    name: 'Wild Buchu & Honeybush Detox Elixir',
    brand: 'Cape Herbalist',
    price: 280,
    rating: 4.89,
    reviewsCount: 67,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    category: 'herbal-wellness-products',
    description: 'Organic wellness tea blend of wild mountain buchu and sweet honeybush for full-body cellular detox.',
    badge: 'Organic'
  },
  {
    id: 'prod-13',
    name: 'African Ginger Sore Muscle Relief Balm',
    brand: 'Roots & Leaves SA',
    price: 340,
    rating: 4.95,
    reviewsCount: 82,
    image: 'https://images.unsplash.com/photo-1512290903048-7935c400429d?auto=format&fit=crop&w=600&q=80',
    category: 'herbal-wellness-products',
    description: 'Deep penetrating warming balm infused with wild African ginger and eucalyptus for spa-level muscle recovery.'
  },

  // Beauty Tools & Equipment
  {
    id: 'prod-14',
    name: 'Pro-Glide Titanium Silk Press Iron',
    brand: 'STENZA Pro Tools',
    price: 1850,
    rating: 4.98,
    reviewsCount: 104,
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80',
    category: 'beauty-tools-equipment',
    description: 'Precision digital temperature flat iron engineered for 4C afro-hair silk presses with zero heat damage.',
    badge: 'Pro Choice'
  },

  // Activewear & Gym Wear
  {
    id: 'prod-15',
    name: 'Sculpt & Contour High-Waisted Seamless Leggings',
    brand: 'STENZA Active',
    price: 790,
    rating: 4.95,
    reviewsCount: 91,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    category: 'activewear-gym-wear',
    description: 'Squat-proof, compression ribbed knit with ergonomic booty-contouring silhouette and breathable moisture-wicking tech.',
    badge: 'Trending'
  },
  {
    id: 'prod-16',
    name: 'PowerFlex Zip-Front Sports Bra',
    brand: 'STENZA Active',
    price: 490,
    rating: 4.88,
    reviewsCount: 53,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    category: 'activewear-gym-wear',
    description: 'High-impact support sports bra featuring reinforced lockable front zip and cross-back ventilation straps.'
  },

  // Fashion Accessories
  {
    id: 'prod-17',
    name: 'Handcrafted Contemporary Zulu Bead Choker',
    brand: 'Indoni Studio',
    price: 650,
    rating: 4.97,
    reviewsCount: 47,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    category: 'fashion-accessories',
    description: 'Modern artisanal neckpiece crafted by master KwaZulu-Natal beadworkers combining brass and midnight glass beads.',
    badge: 'Artisan Crafted'
  },
  {
    id: 'prod-18',
    name: 'Sandton Oversized Tortoiseshell Sunglasses',
    brand: 'Luxe Africa Eyewear',
    price: 920,
    rating: 4.90,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    category: 'fashion-accessories',
    description: 'UV400 polarized acetate frames with Italian hardware and rich honey-amber tortoise patterns.'
  },

  // Shoes & Footwear
  {
    id: 'prod-19',
    name: 'Handcrafted Genuine Leather Strappy Mules',
    brand: 'Mzansi Sole',
    price: 1450,
    rating: 4.92,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    category: 'shoes-footwear',
    description: 'Buttery soft vegetable-tanned leather kitten heels with memory foam insole for all-day elegance.',
    badge: 'Handmade'
  },

  // Clothing & Fashion
  {
    id: 'prod-20',
    name: 'Sunset Glow Silk-Satin Kimono Robe',
    brand: 'STENZA Atelier',
    price: 1100,
    rating: 4.96,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    category: 'clothing-fashion',
    description: 'Flowing lounge robe with wide kimono sleeves in vibrant blush copper satin, ideal for pre-event glam prep.'
  },

  // Shapewear & Lingerie
  {
    id: 'prod-21',
    name: 'Hourglass Seamless Full Bodysuit Shaper',
    brand: 'Curvaceous Africa',
    price: 780,
    rating: 4.94,
    reviewsCount: 68,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80',
    category: 'shapewear-lingerie',
    description: 'Invisible micro-mesh open-bust body shaper providing 360-degree firm waist contouring without digging in.',
    badge: 'Top Rated'
  }
];

export const TRUST_PILLARS = [
  {
    icon: 'verified_user',
    title: '100% Vetted & Verified Artisans',
    description: 'Every beauty provider is in-person assessed for sanitation standards, trade qualifications, and professional liability.'
  },
  {
    icon: 'lock',
    title: 'Guaranteed Escrow Protection',
    description: 'Your payment is safely held in escrow and only released to the artisan once your treatment is complete to your total satisfaction.'
  },
  {
    icon: 'event_available',
    title: 'Zero Overbooking Guarantee',
    description: 'Real-time studio calendar synchronization prevents schedule collisions and ensures you are seated without waiting.'
  },
  {
    icon: 'support_agent',
    title: 'Dedicated Mzansi Concierge',
    description: 'Direct WhatsApp and South African phone support (+27 11 884 9000) ready to assist with custom bookings or reschedules.'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Discover Verified Talent',
    description: 'Filter premier stylists, dermatological clinics, and nail artists across South Africa by suburb, rating, or mobile availability.'
  },
  {
    step: '02',
    title: 'Select Customized Treatments',
    description: 'Review transparent menus, real portfolios, authentic verified client photos, and exact appointment durations in ZAR.'
  },
  {
    step: '03',
    title: 'Reserve Instantly with Confidence',
    description: 'Lock in your preferred date and time slot with secure local payment options (Card, Apple Pay, Instant EFT) and immediate confirmation.'
  },
  {
    step: '04',
    title: 'Enjoy Luxury Elevated Beauty',
    description: 'Relax in a high-end salon suite or let the vetted artisan come directly to your home or hotel with full professional setup.'
  }
];

export const FAQS = [
  {
    q: 'How does mobile at-home beauty booking work in South Africa?',
    a: 'When booking with a professional who offers mobile service, simply toggle "Mobile / At Home" during checkout and enter your residential or hotel address. Your verified artisan arrives with all necessary sterile equipment, luxury towels, and lighting.'
  },
  {
    q: 'How are treatments paid for and is my money safe?',
    a: 'STENZA utilizes bank-grade South African payment gateways with 3D Secure verification. Payments are held in secure escrow and only dispatched to the provider post-treatment.'
  },
  {
    q: 'What is the cancellation and rescheduling policy?',
    a: 'You can reschedule or cancel for free up to 24 hours prior to your appointment directly from your Client Dashboard or via our WhatsApp Concierge.'
  },
  {
    q: 'Are all artisans compliant with the South African health and POPIA regulations?',
    a: 'Yes. All salons and mobile practitioners adhere strictly to municipal health by-laws, professional hygiene guidelines, and your personal data is protected under the Protection of Personal Information Act (POPIA).'
  }
];
