import React, { useState } from 'react';
import { PROVIDERS, Provider, CITIES_DATA } from '../data/beautyData';
import { adminService } from '../services/adminService';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  Scissors, 
  Sparkles, 
  Car, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  Heart, 
  Award, 
  ArrowRight, 
  HelpCircle, 
  Building, 
  Filter, 
  Compass, 
  Calendar,
  Check,
  Eye,
  Camera,
  Layers,
  Phone,
  MessageCircle,
  X,
  ShoppingBag,
  Sparkle
} from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { CategoryGroup, CategoryType, StenzaCategory } from '../data/categoryData';

interface HomeViewProps {
  onNavigate: (
    view: string, 
    providerId?: string, 
    authMode?: 'login' | 'register',
    categoryId?: string,
    type?: 'SERVICE' | 'PRODUCT'
  ) => void;
  onOpenBookingModal: (providerId?: string, serviceId?: string) => void;
  selectedCity: string;
  onOpenLocationModal: () => void;
  isLoggedIn?: boolean;
}

// 9 Exact Beauty Categories
const LANDING_CATEGORIES = [
  {
    id: 'hair',
    name: 'Hair and Hairstyles',
    subtitle: 'Knotless Braids, Silk Presses, Locs & Wigs',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    count: '1,420+ Artisans'
  },
  {
    id: 'nails',
    name: 'Nails',
    subtitle: 'BIAB Overlays, Russian Manicures & Gel-X',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    count: '980+ Studios'
  },
  {
    id: 'makeup',
    name: 'Makeup',
    subtitle: 'Bridal Glam, Editorial & Evening Glamour',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    count: '520+ Artists'
  },
  {
    id: 'lashes-brows',
    name: 'Lashes and Brows',
    subtitle: 'Russian Volume, Microblading & Lamination',
    image: 'https://images.unsplash.com/photo-1512290900672-1f4a9c8f2b74?auto=format&fit=crop&w=600&q=80',
    count: '710+ Stylists'
  },
  {
    id: 'skincare',
    name: 'Skincare and Facials',
    subtitle: 'Medical Dermaplaning, Melanin Peels & Hydra-Glow',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    count: '640+ Specialists'
  },
  {
    id: 'barbering',
    name: 'Barbering',
    subtitle: 'Precision Fades, Hot Towel Shaves & Beard Care',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    count: '460+ Master Barbers'
  },
  {
    id: 'waxing',
    name: 'Waxing and Hair Removal',
    subtitle: 'Painless Hot Wax, Sugaring & Laser Sessions',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    count: '310+ Therapists'
  },
  {
    id: 'bridal',
    name: 'Bridal Beauty',
    subtitle: 'Traditional & White Wedding Packages',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    count: '280+ Teams'
  },
  {
    id: 'massage',
    name: 'Massage and Body Treatments',
    subtitle: 'Hot Stone, Deep Tissue & Lymphatic Drainage',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    count: '390+ Sanctuaries'
  }
];

// Popular services with dedicated artisan-uploaded photos (distinct from generic studio covers)
const POPULAR_SERVICES_DATA = [
  {
    id: 'pop-1',
    name: 'Knotless Goddess Braids (Mid-Back)',
    studioId: 'sovereign-crown-salon',
    studioName: 'Sovereign Crown Salon',
    studioLocation: 'Sandton, Johannesburg',
    price: 1450,
    duration: '180 min',
    rating: 4.97,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1584297091622-af8e5bd9cbf9?auto=format&fit=crop&w=600&q=80',
    category: 'Hair and Hairstyles',
    description: 'Tension-free parting with organic shea butter hydration. Lightweight human hair wavy curls incorporated throughout for a lightweight bohemian silhouette.'
  },
  {
    id: 'pop-2',
    name: 'BIAB Builder Gel Overlay & Dry Cuticle Prep',
    studioId: 'luxe-nail-studio',
    studioName: 'Luxe Nail Studio',
    studioLocation: 'Rosebank, Johannesburg',
    price: 650,
    duration: '90 min',
    rating: 4.99,
    reviewCount: 194,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    category: 'Nails',
    description: 'High-precision dry e-file diamond manicure followed by strengthening apex builder gel overlay to restore weak nails without toxic chemicals.'
  },
  {
    id: 'pop-3',
    name: 'Master Russian Couture Manicure',
    studioId: 'luxe-nail-studio',
    studioName: 'Luxe Nail Studio',
    studioLocation: 'Rosebank, Johannesburg',
    price: 520,
    duration: '75 min',
    rating: 4.98,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    category: 'Nails',
    description: 'Meticulous dry skin smoothing, diamond bit cuticle cleaning, nourishing peptide bath, and high-shine protective glass lacquer.'
  },
  {
    id: 'pop-4',
    name: 'Surgical Dermaplaning & Brightening Peel',
    studioId: 'velvet-glow-aesthetics',
    studioName: 'Velvet Glow Aesthetics',
    studioLocation: 'Camps Bay, Cape Town',
    price: 890,
    duration: '60 min',
    rating: 4.99,
    reviewCount: 96,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    category: 'Skincare and Facials',
    description: 'Medical-grade blade exfoliation to gently eliminate dead surface cells and peach fuzz, followed by brightening mandelic glow infusion.'
  },
  {
    id: 'pop-5',
    name: 'Signature Glow Hydra-Facial & LED Canopy',
    studioId: 'velvet-glow-aesthetics',
    studioName: 'Velvet Glow Aesthetics',
    studioLocation: 'Camps Bay, Cape Town',
    price: 1200,
    duration: '75 min',
    rating: 4.98,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1512290900672-1f5518b62c05?auto=format&fit=crop&w=600&q=80',
    category: 'Skincare and Facials',
    description: 'Triple vortex suction extraction with personalized salicylic-hyaluronic acid boosters and medical LED canopy for radiant collagen activation.'
  },
  {
    id: 'pop-6',
    name: 'Gentleman Precision Razor Fade & Beard Sculpt',
    studioId: 'monarch-blade-parlour',
    studioName: 'Monarch Blade Parlour',
    studioLocation: 'Menlyn, Pretoria',
    price: 380,
    duration: '45 min',
    rating: 4.96,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    category: 'Barbering',
    description: 'Skin taper fade with eucalyptus hot towel wrap, traditional straight-edge razor line work, and cold pressed argan oil beard sculpting.'
  },
  {
    id: 'pop-7',
    name: 'Couture Bridal Glam Makeup & Skin Prep',
    studioId: 'lumina-glam-atelier',
    studioName: 'Lumina Glam Atelier',
    studioLocation: 'Umhlanga, Durban',
    price: 950,
    duration: '90 min',
    rating: 4.97,
    reviewCount: 74,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    category: 'Makeup',
    description: 'Long-wearing waterproof airbrush foundation, customized mink individual lash clusters, and soft radiant sculpting perfected for high-definition photography.'
  },
  {
    id: 'pop-8',
    name: 'Apres Gel-X Sculptural Extensions (Full Set)',
    studioId: 'luxe-nail-studio',
    studioName: 'Luxe Nail Studio',
    studioLocation: 'Rosebank, Johannesburg',
    price: 850,
    duration: '105 min',
    rating: 4.99,
    reviewCount: 168,
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
    category: 'Nails',
    description: 'Full-cover soft gel tips custom matched to nail beds. Zero acrylic damage, ultra-lightweight wear, and personalized almond or stiletto shaping.'
  }
];

// Verified Completed-Appointment Reviews (Realistic sample content)
const SAMPLE_REVIEWS = [
  {
    id: 'rev-luxe-1',
    clientName: 'Naledi Mokwena',
    location: 'Sandton, Johannesburg',
    studioName: 'Luxe Nail Studio',
    serviceReceived: 'BIAB Builder Gel Overlay & Dry Cuticle Prep',
    rating: 5,
    date: '18 Oct 2026',
    comment: 'Lerato’s attention to detail is unmatched in Johannesburg. My natural nails have never grown this long or felt so healthy. The Keyes Art Mile studio is serene, immaculate, and hospital-grade clean.'
  },
  {
    id: 'rev-crown-1',
    clientName: 'Keabetswe Sithole',
    location: 'Rosebank, Johannesburg',
    studioName: 'Sovereign Crown Salon',
    serviceReceived: 'Knotless Goddess Braids (Mid-Back)',
    rating: 5,
    date: '15 Oct 2026',
    comment: 'The zero-tension technique made such a difference. My scalp did not hurt once, and the curls are still bouncy after two weeks. Truly the premier textured hair sanctuary in Gauteng.'
  },
  {
    id: 'rev-velvet-1',
    clientName: 'Sarah Van Zyl',
    location: 'Camps Bay, Cape Town',
    studioName: 'Velvet Glow Aesthetics',
    serviceReceived: 'Surgical Dermaplaning & Brightening Peel',
    rating: 5,
    date: '12 Oct 2026',
    comment: 'Dr. Thandiwe took the time to map my skin before touching it. The dermaplaning was so gentle and my hyperpigmentation has visibly faded. Worth every cent.'
  },
  {
    id: 'rev-eden-1',
    clientName: 'Bontle Dlamini',
    location: 'Umhlanga, Durban',
    studioName: 'Eden Sculpt Bar & Spa',
    serviceReceived: 'African Botanic Hot Stone Massage',
    rating: 5,
    date: '08 Oct 2026',
    comment: 'Booked a house call appointment while recovering from travel. The therapist arrived with heated stones, fresh towels, and soothing botanicals. Exceptional service!'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenBookingModal,
  selectedCity,
  onOpenLocationModal,
  isLoggedIn = false
}) => {
  const [searchService, setSearchService] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  
  // Service quick detail modal
  const [activeServiceDetail, setActiveServiceDetail] = useState<typeof POPULAR_SERVICES_DATA[0] | null>(null);

  // FAQ Expand state (Tracks which index is open)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Category filter state for landing page
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'all' | 'SERVICE' | 'PRODUCT'>('all');
  const [categoryGroupFilter, setCategoryGroupFilter] = useState<string>('all');

  // Dynamically sourced featured studios from Admin Advertising Management
  const activeFeaturedAdminStudios = adminService.getActiveApprovedFeaturedStudios();
  const displayFeaturedStudios: Provider[] = activeFeaturedAdminStudios.length > 0 
    ? activeFeaturedAdminStudios.map(fs => {
        const match = PROVIDERS.find(p => p.id === fs.id);
        if (match) return match;
        return {
          id: fs.id,
          name: fs.businessName,
          founder: fs.founderName,
          city: fs.city,
          suburb: fs.suburb,
          address: fs.address,
          rating: fs.rating || 5.0,
          reviewCount: fs.reviewCount || 0,
          startingPrice: 350,
          coverImage: fs.coverUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
          avatar: fs.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          categories: [fs.category],
          headline: `${fs.category} Specialist in ${fs.suburb}`,
          bio: fs.adminNotes || 'Premier verified beauty studio.',
          offersMobile: fs.offersHouseCalls,
          travelFee: fs.travelFee || 150,
          services: [],
          amenities: ['Verified Accreditation', 'Escrow Protected'],
          openingHours: [{ day: 'Mon - Sat', hours: '09:00 - 18:00' }],
          reviews: [],
          ratingBreakdown: { hygiene: 5.0, punctuality: 4.9, technique: 5.0, hospitality: 4.9 },
          gallery: [fs.coverUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'],
          verified: true
        } as unknown as Provider;
      })
    : PROVIDERS.slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('discover');
  };

  const handleBookClick = (providerId: string, serviceId?: string) => {
    onOpenBookingModal(providerId, serviceId);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: 'Can I browse studios without creating an account?',
      a: 'Yes, absolutely. STENZA Beauty allows all visitors to search, explore studio profiles, compare treatment prices, view high-resolution photo galleries, and read verified reviews without registering.'
    },
    {
      q: 'Do I need an account to book an appointment?',
      a: 'Yes. An account is required when confirming a booking so your appointment details, booking reminders, artisan contact numbers, and escrow deposit protections can be managed securely.'
    },
    {
      q: 'How do I find services near me?',
      a: 'You can use the location selector in the hero search or filter studios by metropolitan hub (Johannesburg, Cape Town, Durban, Pretoria) and specific suburbs like Sandton, Rosebank, Camps Bay, or Menlyn.'
    },
    {
      q: 'Can I choose a specific beauty professional?',
      a: 'Yes. Every studio and independent artisan has an individual profile showing their lead artist, trade accreditations, years of experience, specific services, and portfolio photographs.'
    },
    {
      q: 'How do I become a registered beauty professional on STENZA?',
      a: 'Click "Register Your Studio" in the navigation or recruitment section to access our 6-step artisan registration form. You will provide your business details, trade qualifications, and operating hours.'
    },
    {
      q: 'How does studio approval work?',
      a: 'To safeguard client safety and hygiene standards, all artisan applications remain pending until a STENZA administrator reviews the submitted credentials, CIPC active registration, and municipal hygiene certificates.'
    },
    {
      q: 'Can artisans offer mobile house calls?',
      a: 'Yes. Artisans can enable house calls in their studio settings, configure their travel radius, and specify a transparent travel fee in South African Rand (ZAR) which is clearly shown to clients.'
    },
    {
      q: 'How can I leave a review?',
      a: 'To guarantee authenticity and avoid fake reviews, only clients with verified, completed appointments through STENZA Beauty receive an invitation to rate their artisan and share feedback.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fcf9f4] via-[#f7f2ea] to-[#fcf9f4] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#e5e0d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Headlines, Subtitle, Search Component & Dual CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbf0f4] border border-[#f0d0dc] text-xs font-semibold text-[#b86b86]">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>South Africa's Premier Beauty Marketplace</span>
              </div>

              {/* Exact Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#26152d] tracking-tight leading-[1.14]">
                Your Beauty. <br />
                <span className="italic font-normal text-[#b86b86]">Your Style.</span> Your Perfect Match.
              </h1>

              {/* Exact Subtitle */}
              <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed">
                Discover talented beauty professionals, explore their work, compare prices and book your next beauty experience with confidence.
              </p>

              {/* Prominent Search Component */}
              <form 
                onSubmit={handleSearchSubmit}
                className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-stone-200/90 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Service input */}
                  <div className="sm:col-span-6 relative flex items-center">
                    <Search className="w-4 h-4 absolute left-3.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="What beauty service are you looking for?"
                      value={searchService}
                      onChange={(e) => setSearchService(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 text-xs sm:text-sm text-[#26152d] bg-stone-50 rounded-xl border border-stone-200/70 focus:border-[#b86b86] outline-none"
                    />
                  </div>

                  {/* Location input */}
                  <div 
                    onClick={onOpenLocationModal}
                    className="sm:col-span-4 relative flex items-center px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200/70 cursor-pointer hover:bg-stone-100 transition"
                  >
                    <MapPin className="w-4 h-4 text-[#b86b86] mr-2 shrink-0" />
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-[10px] text-stone-400 font-semibold uppercase">Location</div>
                      <div className="text-xs font-bold text-stone-800 truncate">
                        {searchLocation || selectedCity}
                      </div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full h-full py-3 px-4 rounded-xl bg-[#26152d] hover:bg-[#39263f] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>
                </div>

                {/* Popular Search Tags */}
                <div className="flex items-center gap-2 pt-1 text-xs text-stone-500 overflow-x-auto pb-1">
                  <span className="font-semibold text-stone-700 shrink-0">Popular:</span>
                  {['Knotless Braids', 'BIAB Nails', 'Dermaplaning', 'Hydra-Facial', 'Fade & Beard', 'Bridal Glam'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchService(tag);
                        onNavigate('discover');
                      }}
                      className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium shrink-0 transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>

              {/* Two Calls to Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('discover')}
                  className="px-6 py-3.5 bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Studios</span>
                </button>

                <button
                  onClick={() => onNavigate('auth', undefined, 'register')}
                  className="px-6 py-3.5 bg-white hover:bg-stone-50 text-[#26152d] border border-stone-300 text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-stone-500" />
                </button>

                <span className="text-[11px] text-stone-500">
                  ✨ Browse studios, prices & portfolios without registering.
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 bg-stone-900 group">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                  alt="Professional beauty artisan providing service in luxury South African studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Studio Trust Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#b86b86] text-white flex items-center justify-center font-serif text-lg font-bold">
                        L
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">Luxe Nail Studio</h4>
                        <p className="text-[11px] text-stone-500">Rosebank, Johannesburg • 4.98 ★ (242 reviews)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Open Today
                    </span>
                  </div>
                </div>

                {/* House Call Badge */}
                <div className="absolute top-4 left-4 bg-[#26152d]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Car className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>House Calls Available Across JHB & CPT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED AND TOP-RANKED STUDIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b86b86] bg-pink-50 px-2 py-0.5 rounded">
                Verified Excellence
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
              Discover Top Beauty Studios
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Explore talented professionals and find the right beauty experience for you.
            </p>
          </div>

          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-bold text-[#b86b86] hover:text-[#914660] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Studios</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Studios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayFeaturedStudios.map((studio) => (
            <div
              key={studio.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image & Badges */}
                <div className="relative aspect-16/9 bg-stone-900 overflow-hidden">
                  <img
                    src={studio.coverImage}
                    alt={studio.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Chip */}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#26152d] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    {studio.categories?.[0] || 'Beauty Studio'}
                  </span>

                  {/* House Call Indicator */}
                  {studio.offersMobile && (
                    <span className="absolute top-3 right-3 bg-[#26152d]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Car className="w-3 h-3 text-[#d4af37]" />
                      <span>House Calls (+R{studio.travelFee || 150})</span>
                    </span>
                  )}

                  {/* Starting Price Overlay */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#26152d] px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs">
                    From R{studio.startingPrice || 350}
                  </div>
                </div>

                {/* Studio Info Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#26152d] group-hover:text-[#b86b86] transition-colors">
                      {studio.name}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{studio.suburb}, {studio.city}</span>
                    </p>
                  </div>

                  {/* Rating & Review Count */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-900 font-bold border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                      <span>{studio.rating}</span>
                    </div>
                    <span className="text-stone-500 text-[11px]">({studio.reviewCount} verified reviews)</span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {studio.headline || studio.bio}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('profile', studio.id)}
                  className={`py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition text-center cursor-pointer ${
                    isLoggedIn ? 'flex-1' : 'w-full'
                  }`}
                >
                  View Studio
                </button>
                {isLoggedIn && (
                  <button
                    onClick={() => handleBookClick(studio.id)}
                    className="flex-1 py-2.5 rounded-xl bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-bold transition text-center shadow-xs cursor-pointer"
                  >
                    Book Appointment
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Fallback New Studio (Without reviews yet) */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="relative aspect-16/9 bg-stone-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
                  alt="Nompumelelo Dermal Lab & Skin Clinic"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#26152d] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                  Clinical Skincare
                </span>
                <span className="absolute top-3 right-3 bg-pink-100 text-[#b86b86] border border-pink-200 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  ✨ New on STENZA
                </span>
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#26152d] px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs">
                  From R550
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#26152d] group-hover:text-[#b86b86] transition-colors">
                    Nompumelelo Dermal Lab & Skin Clinic
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Sandton Central, Johannesburg</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    Introductory Studio • Accepting Initial Bookings
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  Specialist medical aesthetician with clinical certification in non-invasive skin rejuvenation, chemical peeling, and hyperpigmentation therapy.
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center gap-2">
              <button
                onClick={() => onNavigate('studio_preview')}
                className={`py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition text-center cursor-pointer ${
                  isLoggedIn ? 'flex-1' : 'w-full'
                }`}
              >
                View Studio
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => handleBookClick('luxe-nail-studio')}
                  className="flex-1 py-2.5 rounded-xl bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-bold transition text-center shadow-xs cursor-pointer"
                >
                  Book Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE BEAUTY, PERSONAL CARE & FASHION CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#695684] bg-[#695684]/10 px-3 py-1 rounded-full">
            Improved Directory & Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
            Explore Curated Categories
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Book certified South African beauty artisans and stylists or shop curated botanical apothecary, hair care, and designer fashion.
          </p>
        </div>

        {/* Filter Controls: Type Toggle + Group Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs">
          {/* Service vs Product Toggle */}
          <div className="flex items-center bg-[#f6f3ee] p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => { setCategoryTypeFilter('all'); setCategoryGroupFilter('all'); }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                categoryTypeFilter === 'all'
                  ? 'bg-white text-[#26152d] shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => { setCategoryTypeFilter('SERVICE'); setCategoryGroupFilter('all'); }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                categoryTypeFilter === 'SERVICE'
                  ? 'bg-[#26152d] text-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-emerald-300" />
              <span>Book Services</span>
            </button>
            <button
              onClick={() => { setCategoryTypeFilter('PRODUCT'); setCategoryGroupFilter('all'); }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                categoryTypeFilter === 'PRODUCT'
                  ? 'bg-[#695684] text-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-pink-200" />
              <span>Shop Products</span>
            </button>
          </div>

          {/* 4 Main Parent Groups Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setCategoryGroupFilter('all')}
              className={`px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition cursor-pointer ${
                categoryGroupFilter === 'all'
                  ? 'bg-[#26152d] text-white border-[#26152d] font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              All Groups
            </button>
            {(['Hair & Styling', 'Beauty Services', 'Beauty & Personal Care Products', 'Fashion & Accessories'] as CategoryGroup[])
              .filter(group => {
                if (categoryTypeFilter === 'SERVICE') {
                  return group === 'Hair & Styling' || group === 'Beauty Services';
                }
                if (categoryTypeFilter === 'PRODUCT') {
                  return group === 'Beauty & Personal Care Products' || group === 'Fashion & Accessories';
                }
                return true;
              })
              .map((grp) => (
                <button
                  key={grp}
                  onClick={() => setCategoryGroupFilter(grp)}
                  className={`px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition cursor-pointer ${
                    categoryGroupFilter === grp
                      ? 'bg-[#695684] text-white border-[#695684] font-semibold shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {grp}
                </button>
              ))}
          </div>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoryService
            .getActiveCategories()
            .filter((c) => {
              if (categoryTypeFilter !== 'all' && c.type !== categoryTypeFilter) return false;
              if (categoryGroupFilter !== 'all' && c.group !== categoryGroupFilter) return false;
              return true;
            })
            .map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigate('discover', undefined, undefined, cat.id, cat.type)}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 border border-stone-200/80 bg-stone-900 flex flex-col justify-between p-4"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onNavigate('discover', undefined, undefined, cat.id, cat.type);
                  }
                }}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />

                {/* Top Row: Group Badge & Type Pill */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 truncate max-w-[150px]">
                    {cat.group}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${
                      cat.type === 'SERVICE'
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-[#695684]/90 text-white'
                    }`}
                  >
                    {cat.type === 'SERVICE' ? 'Service' : 'Product'}
                  </span>
                </div>

                {/* Bottom Row: Count, Title, Description */}
                <div className="relative z-10 text-white mt-auto">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                      {cat.itemCountText}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold group-hover:text-pink-200 transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                    {cat.shortDescription}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* View All & Category Info Footer */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <p className="flex items-center gap-1.5 text-stone-500 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>All categories are monitored for quality and South African regulatory compliance.</span>
          </p>
          <button
            onClick={() => onNavigate('discover')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#26152d] hover:bg-[#3d2348] text-white font-semibold transition cursor-pointer shadow-xs"
          >
            <span>View All in Directory & Apothecary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. POPULAR SERVICES */}
      <section className="bg-stone-100/60 py-16 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b86b86] bg-pink-50 px-2 py-0.5 rounded">
                Client Favorites
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d] mt-1">
                Popular Beauty Services
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Handcrafted treatment results with real artisan-uploaded photos and transparent South African Rand pricing.
              </p>
            </div>

            <button
              onClick={() => onNavigate('discover')}
              className="text-xs font-bold text-[#b86b86] hover:text-[#914660] flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Treatments</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {POPULAR_SERVICES_DATA.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Service-Specific Image */}
                  <div className="relative aspect-4/3 bg-stone-900 overflow-hidden">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {srv.category}
                    </span>

                    <span className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-[#26152d] text-xs font-bold px-2 py-0.5 rounded-lg shadow-xs">
                      R{srv.price}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif text-sm font-bold text-[#26152d] group-hover:text-[#b86b86] transition-colors line-clamp-1">
                      {srv.name}
                    </h3>

                    <p className="text-[11px] text-stone-500 font-medium truncate">
                      {srv.studioName} • {srv.studioLocation}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="flex items-center gap-1 text-stone-600 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-stone-400" /> {srv.duration}
                      </span>
                      <span className="flex items-center gap-1 text-amber-800 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-[#d4af37] text-[#d4af37]" /> {srv.rating} ({srv.reviewCount})
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed pt-1">
                      {srv.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-2 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => setActiveServiceDetail(srv)}
                    className={`py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition text-center cursor-pointer ${
                      isLoggedIn ? 'flex-1' : 'w-full'
                    }`}
                  >
                    View Details
                  </button>
                  {isLoggedIn && (
                    <button
                      onClick={() => handleBookClick(srv.studioId)}
                      className="flex-1 py-2 rounded-xl bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-bold transition text-center shadow-xs cursor-pointer"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CUSTOMERS CHOOSE STENZA BEAUTY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#b86b86] bg-pink-50 px-3 py-1 rounded-full">
            Transparent Marketplace
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
            Why Customers Choose STENZA Beauty
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            A modern booking experience designed for discerning South African clients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#b86b86] flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#26152d]">
              Discover professionals in one place
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Browse top independent hairstylists, nail artists, aesthetic doctors, and lash specialists across South Africa on a single unified platform.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#26152d]">
              Compare prices before booking
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No hidden fees or guesswork. All treatment durations and prices are listed upfront in South African Rand (ZAR) so you can compare with confidence.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#26152d]">
              Explore real portfolios
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Inspect verified service galleries uploaded directly by artisans, showing genuine client results on diverse skin tones and hair textures.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#26152d]">
              Convenient appointment requests
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Check real-time working schedule availability, exclude breaks, and select appointment slots that fit seamlessly into your day.
            </p>
          </div>

          {/* Benefit 5 */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#26152d]">
              Read reviews from customers
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Read authentic feedback and ratings submitted exclusively by clients who have completed their appointments through the platform.
            </p>
          </div>

          {/* Benefit 6 */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#26152d]">
              Find professionals offering house calls
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Prefer treatments at home or in your hotel? Easily filter for artisans who offer mobile house-call appointments with transparent travel call-out fees.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="bg-[#26152d] text-white py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] bg-white/10 px-3 py-1 rounded-full">
              Seamless 4-Step Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Booking your next beauty service in Johannesburg, Cape Town, or Durban takes under two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#b86b86] text-white font-serif font-bold text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Discover</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Search for a beauty service or studio by treatment category, city, or neighborhood.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#b86b86] text-white font-serif font-bold text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Compare</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Explore real portfolios, check prices, examine locations, and read genuine client reviews.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#b86b86] text-white font-serif font-bold text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Book</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Choose a service and request an available appointment slot matching the artisan's working schedule.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-stone-900 font-serif font-bold text-lg flex items-center justify-center">
                4
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Enjoy</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Receive booking updates, enjoy your treatment, and share verified feedback after completion.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('discover')}
              className="px-8 py-3.5 bg-[#b86b86] hover:bg-[#a25974] text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Studios</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. REVIEWS AND CUSTOMER TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#b86b86] bg-pink-50 px-3 py-1 rounded-full">
            Customer Feedback
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
            Beauty Experiences That Speak for Themselves
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Only customers with eligible completed appointments may submit a rating or review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#26152d]">
                    {rev.studioName}
                  </h3>
                  <p className="text-xs text-[#b86b86] font-medium mt-0.5">
                    {rev.serviceReceived}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-stone-800">{rev.clientName} • {rev.location}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. ARTISAN RECRUITMENT PROMOTIONAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#26152d] via-[#3a1d3a] to-[#26152d] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-stone-800">
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#b86b86]/30 border border-[#b86b86]/50 text-xs font-bold uppercase tracking-wider text-[#e8a3b8]">
              For Independent Beauty Professionals
            </span>

            {/* Exact Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Your Talent Deserves to Be Seen.
            </h2>

            {/* Exact Subtitle */}
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Create your studio profile, showcase your services, manage appointments and connect with customers looking for their next beauty professional.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Build your online studio profile</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Upload photos of your work and services</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Set your prices and working hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Indicate whether you offer house calls</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Manage booking requests</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Reach customers searching for beauty services</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => onNavigate('artisan_registration')}
                className="px-8 py-3.5 bg-[#b86b86] hover:bg-[#a25974] text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Scissors className="w-4 h-4" />
                <span>Register Your Studio</span>
              </button>

              <p className="text-[11px] text-stone-400">
                * Applications are subject to administrator approval before studios become publicly visible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#b86b86] bg-pink-50 px-3 py-1 rounded-full">
            Help & Information
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Everything you need to know about browsing, booking, and studio registrations on STENZA.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#26152d] hover:bg-stone-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#b86b86] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-[#fbf0f4] border border-[#f0d0dc] rounded-3xl p-10 sm:p-14 space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#b86b86] text-white flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6 text-[#d4af37]" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#26152d]">
              Your Next Beauty Experience Starts Here.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Discover your style, find your professional and make your next appointment.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('discover')}
              className="px-8 py-3.5 bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Studios</span>
            </button>

            <button
              onClick={() => onNavigate('auth', undefined, 'register')}
              className="px-8 py-3.5 bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SERVICE DETAIL QUICK MODAL */}
      {activeServiceDetail && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b86b86] bg-pink-50 px-2 py-0.5 rounded">
                  {activeServiceDetail.category}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#26152d] mt-1">
                  {activeServiceDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveServiceDetail(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-16/10 mb-4 bg-stone-100 border border-stone-200">
              <img
                src={activeServiceDetail.image}
                alt={activeServiceDetail.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Artisan Work Sample
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Artisan Studio</span>
                  <span className="font-bold text-stone-900">{activeServiceDetail.studioName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Investment</span>
                  <span className="text-base font-bold text-[#26152d]">R{activeServiceDetail.price}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1 uppercase tracking-wider text-xs">Description</h4>
                <p className="text-stone-600 leading-relaxed">
                  {activeServiceDetail.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  onClick={() => setActiveServiceDetail(null)}
                  className="px-4 py-2 text-stone-600 font-semibold text-xs hover:bg-stone-100 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      const sid = activeServiceDetail.studioId;
                      setActiveServiceDetail(null);
                      handleBookClick(sid);
                    }}
                    className="px-6 py-2.5 bg-[#b86b86] hover:bg-[#a25974] text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book This Service</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveServiceDetail(null);
                      onNavigate('auth', undefined, 'login');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-[#b86b86] hover:text-[#914660] hover:bg-pink-50 rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Sign in to book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
