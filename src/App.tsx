/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LocationModal } from './components/LocationModal';
import { BookingModal } from './components/BookingModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { LoyaltyModal } from './components/LoyaltyModal';
import { ConciergeChatModal } from './components/ConciergeChatModal';
import { AdminAccessModal } from './components/AdminAccessModal';
import { HomeView } from './views/HomeView';
import { DiscoverView } from './views/DiscoverView';
import { ProfileView } from './views/ProfileView';
import { BookingsView } from './views/BookingsView';
import { AuthView } from './views/AuthView';
import { HowItWorksView } from './views/HowItWorksView';

// Artisan & Admin Suite Views
import { ArtisanRegistrationView } from './views/artisan/ArtisanRegistrationView';
import { ApplicationSubmittedView } from './views/artisan/ApplicationSubmittedView';
import { AdminReviewView } from './views/artisan/AdminReviewView';
import { ArtisanDashboardView } from './views/artisan/ArtisanDashboardView';
import { StudioProfileEditorView } from './views/artisan/StudioProfileEditorView';
import { ServicesManagementView } from './views/artisan/ServicesManagementView';
import { HouseCallsAvailabilityView } from './views/artisan/HouseCallsAvailabilityView';
import { StudioPreviewView } from './views/artisan/StudioPreviewView';

// Data models & Seed Data
import { INITIAL_BOOKINGS, Booking, BeautyProduct } from './data/beautyData';
import { calculateLoyaltySummary, LoyaltyReward } from './data/loyaltyData';
import { 
  INITIAL_APPLICATIONS, 
  INITIAL_STUDIOS, 
  DEFAULT_WEEKLY_SCHEDULE,
  ArtisanApplication, 
  StudioProfile, 
  StudioService, 
  OperatingDay, 
  ApplicationStatus 
} from './data/artisanWorkflowData';

import { 
  ShieldCheck, 
  Sparkles, 
  Scissors, 
  ShoppingBag, 
  UserCheck, 
  Clock, 
  ChevronDown,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('luxe-nail-studio');
  const [selectedCity, setSelectedCity] = useState<string>('Rosebank, Johannesburg');
  
  // State for bookings & client session
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('Naledi Mokwena');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'pro'>('login');

  // Artisan & Admin Workflow State
  const [applications, setApplications] = useState<ArtisanApplication[]>(INITIAL_APPLICATIONS);
  const [studios, setStudios] = useState<Record<string, StudioProfile>>(INITIAL_STUDIOS);
  
  // Active artisan application being viewed/managed
  // Default to the newly submitted pending application (Nompumelelo Dermal Lab)
  const [currentAppId, setCurrentAppId] = useState<string>('STZ-APP-2026-8812');
  const [currentStudioId, setCurrentStudioId] = useState<string>('studio-nompu-dermal');

  // Loyalty points tracking state
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);
  const [bookingDiscount, setBookingDiscount] = useState<number>(0);
  const [loyaltyModalOpen, setLoyaltyModalOpen] = useState<boolean>(false);

  // Gemini AI Concierge chat state
  const [conciergeChatOpen, setConciergeChatOpen] = useState<boolean>(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);

  // Modals state
  const [locationModalOpen, setLocationModalOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [modalProviderId, setModalProviderId] = useState<string>('luxe-nail-studio');
  const [modalServiceId, setModalServiceId] = useState<string | undefined>(undefined);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  // Admin access control state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminAccessModalOpen, setAdminAccessModalOpen] = useState<boolean>(false);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProviderId]);

  const loyaltySummary = calculateLoyaltySummary(bookings, redeemedPoints);

  // Get current active artisan application and studio
  const currentApp = applications.find((a) => a.id === currentAppId) || applications[0];
  const currentStudio = studios[currentStudioId] || studios['studio-nompu-dermal'] || Object.values(studios)[0];

  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;

  const handleNavigate = (view: string, providerId?: string, authMode?: 'login' | 'register') => {
    if (providerId) {
      setSelectedProviderId(providerId);
    }
    if (authMode) {
      setAuthInitialMode(authMode);
    }
    // Access control: Require Access ID before entering Admin Portal
    if (view === 'admin_review' && !isAdminAuthenticated) {
      setAdminAccessModalOpen(true);
      return;
    }
    setCurrentView(view);
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setAdminAccessModalOpen(false);
    setCurrentView('admin_review');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('home');
  };

  // Switch between artisan presets (e.g. pending vs approved)
  const handleSelectArtisanPreset = (appId: string, studioId: string) => {
    setCurrentAppId(appId);
    setCurrentStudioId(studioId);
  };

  // Workflow Action 1: Artisan Registration Submitted
  const handleApplicationSubmitted = (newApp: ArtisanApplication) => {
    // Add to applications list
    setApplications((prev) => [newApp, ...prev]);
    setCurrentAppId(newApp.id);
    setCurrentStudioId(newApp.studioId);

    // Create studio record in draft status
    const newStudio: StudioProfile = {
      id: newApp.studioId,
      applicationId: newApp.id,
      businessName: newApp.businessName,
      founderName: newApp.applicantName,
      founderTitle: 'Lead Artisan & Specialist',
      headline: newApp.bio.slice(0, 100) + '...',
      bio: newApp.bio,
      phone: newApp.phone,
      whatsapp: newApp.phone,
      email: newApp.email,
      instagram: newApp.instagram,
      website: newApp.website || '',
      city: newApp.city,
      suburb: newApp.suburb,
      address: newApp.address,
      category: newApp.category,
      logoUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
      ],
      offersHouseCalls: newApp.offersHouseCalls,
      travelFee: newApp.travelFee,
      serviceAreas: newApp.serviceRadius,
      bufferMinutes: 20,
      isPublished: false, // Locked until approved
      operatingHours: newApp.workingHours || DEFAULT_WEEKLY_SCHEDULE,
      services: [
        {
          id: `srv-${Date.now()}-1`,
          name: `${newApp.category} Signature Consultation`,
          category: newApp.category,
          duration: '60 min',
          durationMinutes: 60,
          price: 550,
          discountedPrice: 480,
          description: 'Comprehensive consultation, skin/hair assessment, and personalized treatment protocol.',
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
    };

    setStudios((prev) => ({
      ...prev,
      [newApp.studioId]: newStudio,
    }));

    setCurrentView('application_submitted');
  };

  // Workflow Action 2: Administrator Reviews & Decides on Application
  const handleUpdateApplicationStatus = (
    appId: string,
    newStatus: ApplicationStatus,
    reason: string,
    reviewedBy: string
  ) => {
    const now = new Date().toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            adminDecisionReason: reason,
            reviewedBy,
            reviewedAt: `${now} SAST`,
            updatedAt: `${now} SAST`,
          };
        }
        return app;
      })
    );

    // If application rejected, also unpublish the studio
    if (newStatus === 'rejected') {
      const targetApp = applications.find((a) => a.id === appId);
      if (targetApp && studios[targetApp.studioId]) {
        setStudios((prev) => ({
          ...prev,
          [targetApp.studioId]: {
            ...prev[targetApp.studioId],
            isPublished: false,
          },
        }));
      }
    }
  };

  // Workflow Action 3: Studio Profile Updates
  const handleUpdateStudioProfile = (updated: Partial<StudioProfile>) => {
    if (!currentStudioId) return;
    setStudios((prev) => ({
      ...prev,
      [currentStudioId]: {
        ...prev[currentStudioId],
        ...updated,
      },
    }));
  };

  // Workflow Action 4: Services Management Updates
  const handleUpdateStudioServices = (services: StudioService[]) => {
    if (!currentStudioId) return;
    setStudios((prev) => ({
      ...prev,
      [currentStudioId]: {
        ...prev[currentStudioId],
        services,
      },
    }));
  };

  // Workflow Action 5: House Calls & Availability Updates
  const handleUpdateAvailability = (avail: {
    offersHouseCalls: boolean;
    travelFee: number;
    serviceAreas: string;
    bufferMinutes: number;
    operatingHours: OperatingDay[];
  }) => {
    if (!currentStudioId) return;
    setStudios((prev) => ({
      ...prev,
      [currentStudioId]: {
        ...prev[currentStudioId],
        ...avail,
      },
    }));
  };

  // Workflow Action 6: Toggle Studio Publishing (Enforced Workflow Rule)
  const handleToggleStudioPublish = (publishState: boolean) => {
    if (!currentStudioId || !currentApp) return;

    // Rule: Pending artisans CANNOT publish studios
    if (currentApp.status !== 'approved' && publishState) {
      alert('Policy violation: Only accredited and admin-approved artisans can publish studios to the public marketplace.');
      return;
    }

    setStudios((prev) => ({
      ...prev,
      [currentStudioId]: {
        ...prev[currentStudioId],
        isPublished: publishState,
      },
    }));
  };

  // Client Booking & Cart Handlers
  const handleOpenBookingModal = (providerId?: string, serviceId?: string, discount?: number) => {
    setModalProviderId(providerId || selectedProviderId || 'luxe-nail-studio');
    setModalServiceId(serviceId);
    setBookingDiscount(discount || 0);
    setReviewBooking(null);
    setBookingModalOpen(true);
  };

  const handleOpenReviewModal = (booking: Booking) => {
    setReviewBooking(booking);
    setBookingModalOpen(true);
  };

  const handleSaveBookingReview = (bookingId: string, rating: number, reviewText: string) => {
    const reviewedAt = new Date().toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              rating,
              review: reviewText,
              reviewedAt
            }
          : b
      )
    );
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    if (bookingDiscount > 0) {
      setRedeemedPoints((prev) => prev + bookingDiscount);
      setBookingDiscount(0);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
  };

  const handleRedeemReward = (reward: LoyaltyReward) => {
    setRedeemedPoints((prev) => prev + reward.pointsRequired);
    setBookingDiscount(reward.discountZAR);
  };

  const handleAddToCart = (product: BeautyProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isAdminView = currentView === 'admin_review';
  const isArtisanView = [
    'artisan_dashboard',
    'studio_profile_editor',
    'services_management',
    'house_calls_availability',
    'studio_preview',
    'application_submitted',
    'artisan_registration',
  ].includes(currentView);
  const isAuthView = currentView === 'auth';

  // 1. SEPARATE DEDICATED ADMIN PORTAL (Requires Admin Authentication)
  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#140a19] flex items-center justify-center p-4">
          <AdminAccessModal
            isOpen={true}
            onClose={() => setCurrentView('home')}
            onSuccess={handleAdminAuthSuccess}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-stone-100 text-[#1c1b1c] font-sans relative">
        <AdminReviewView
          applications={applications}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onNavigate={handleNavigate}
          currentStudioId={currentStudioId}
          onSelectArtisanPreset={handleSelectArtisanPreset}
          onLogoutAdmin={handleAdminLogout}
        />

        {/* Discreet Quick Portal Switcher Dock (Bottom-Left) */}
        <aside aria-label="Portal Navigation Dock" className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-1.5 p-1.5 bg-[#1b0d21]/95 backdrop-blur-md text-white rounded-full border border-emerald-500/40 shadow-2xl text-[11px]">
          <span className="text-[10px] text-stone-400 pl-2.5 pr-1 font-bold uppercase tracking-wider">
            Portal:
          </span>
          <button
            onClick={() => handleNavigate('home')}
            className="px-3 py-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer flex items-center gap-1 font-medium"
            title="Switch to Customer Marketplace"
          >
            <span>🌸 User Page</span>
          </button>
          <button
            onClick={() => handleNavigate('artisan_dashboard')}
            className="px-3 py-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer flex items-center gap-1 font-medium"
            title="Switch to Artisan Studio Suite"
          >
            <span>✂️ Artisan Suite</span>
          </button>
          <button
            onClick={() => handleNavigate('admin_review')}
            className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold transition shadow-xs flex items-center gap-1 cursor-default"
            title="Currently in Admin Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            <span>🛡️ Admin Portal</span>
            {pendingAppsCount > 0 && (
              <span className="bg-amber-400 text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingAppsCount}
              </span>
            )}
          </button>
        </aside>
      </div>
    );
  }

  // 2. DEDICATED ARTISAN SUITE OR USER/CLIENT MARKETPLACE
  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f4] text-[#1c1b1c] font-sans relative">
      {/* If in Artisan Workspace: Render Focused Artisan Studio Top Bar */}
      {isArtisanView ? (
        <aside aria-label="Artisan Suite Navigation" className="bg-[#1b0d21] border-b border-[#35193f] text-white px-4 sm:px-6 py-2.5 text-xs sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="font-serif font-bold text-white text-sm">
                STENZA <span className="font-light text-[#b86b86]">ARTISAN SUITE</span>
              </span>
              <span className="text-stone-600 hidden sm:inline">|</span>
              <span className="text-stone-300 text-xs font-medium">
                Studio: <strong className="text-white">{currentStudio.businessName}</strong>
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  currentApp.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {currentApp.status === 'approved' ? 'Accredited & Published' : 'Pending Review'}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => handleNavigate('admin_review')}
                className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-emerald-300 text-xs transition cursor-pointer flex items-center gap-1.5 font-medium border border-emerald-500/30"
                title="Inspect how your studio application appears in the Admin Accreditation Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Review Portal</span>
              </button>
              <button
                onClick={() => handleNavigate('home')}
                className="px-3.5 py-1 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-lg transition-all text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                title="Return to the client-facing marketplace"
              >
                <span>← Return to User Page</span>
              </button>
            </div>
          </div>
        </aside>
      ) : (
        /* If in User Marketplace: Render Pristine Client Header */
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          selectedCity={selectedCity}
          onOpenLocationModal={() => setLocationModalOpen(true)}
          onOpenBookingModal={() => handleOpenBookingModal()}
          onOpenCart={() => setCartDrawerOpen(true)}
          cartCount={totalCartCount}
          bookings={bookings}
          isLoggedIn={isLoggedIn}
          onLogout={() => setIsLoggedIn(false)}
          loyaltyPoints={loyaltySummary.availablePoints}
          onOpenLoyaltyModal={() => setLoyaltyModalOpen(true)}
        />
      )}

      {/* Main Connected View Router */}
      <main className="flex-1">
        {/* Client Marketplace Views */}
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenBookingModal={(pId) => handleOpenBookingModal(pId)}
            selectedCity={selectedCity}
            onOpenLocationModal={() => setLocationModalOpen(true)}
            isLoggedIn={isLoggedIn}
          />
        )}

        {(currentView === 'discover' || currentView === 'categories') && (
          <DiscoverView
            onNavigate={handleNavigate}
            onOpenBookingModal={(pId) => handleOpenBookingModal(pId)}
            selectedCity={selectedCity}
            onOpenLocationModal={() => setLocationModalOpen(true)}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            providerId={selectedProviderId}
            onNavigate={handleNavigate}
            onOpenBookingModal={(pId, sId, discount) => handleOpenBookingModal(pId, sId, discount)}
            bookings={bookings}
            redeemedPoints={redeemedPoints}
            onOpenLoyaltyModal={() => setLoyaltyModalOpen(true)}
            isLoggedIn={isLoggedIn}
          />
        )}

        {currentView === 'bookings' && (
          <BookingsView
            bookings={bookings}
            onNavigate={handleNavigate}
            onOpenBookingModal={(pId, sId) => handleOpenBookingModal(pId, sId)}
            onOpenReviewModal={handleOpenReviewModal}
            onCancelBooking={handleCancelBooking}
            redeemedPoints={redeemedPoints}
            onOpenLoyaltyModal={() => setLoyaltyModalOpen(true)}
          />
        )}

        {currentView === 'auth' && (
          <AuthView
            initialMode={authInitialMode}
            onNavigate={handleNavigate}
            onLoginSuccess={(name, accountType) => {
              setIsLoggedIn(true);
              setClientName(name);
              if (accountType === 'client') {
                setCurrentView('bookings');
              } else if (accountType === 'admin') {
                setIsAdminAuthenticated(true);
                setCurrentView('admin_review');
              } else {
                setCurrentView('artisan_dashboard');
              }
            }}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksView
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onOpenBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {/* 1. Artisan Registration: 5-step multi-step form */}
        {currentView === 'artisan_registration' && (
          <ArtisanRegistrationView
            onApplicationSubmitted={handleApplicationSubmitted}
            onNavigate={handleNavigate}
          />
        )}

        {/* 2. Application Submitted: Reference ID, Pending Admin Approval status, next steps */}
        {currentView === 'application_submitted' && (
          <ApplicationSubmittedView
            application={currentApp}
            onNavigate={handleNavigate}
            onOpenAdminReview={() => setCurrentView('admin_review')}
          />
        )}

        {/* 3. Artisan Dashboard: Status banner, profile readiness score, metrics, shortcuts */}
        {currentView === 'artisan_dashboard' && (
          <ArtisanDashboardView
            application={currentApp}
            studio={currentStudio}
            onNavigate={handleNavigate}
            onOpenAdminReview={() => setCurrentView('admin_review')}
          />
        )}

        {/* 4. Studio Profile Editor: Business info, contact, location, descriptions, logo, cover, gallery */}
        {currentView === 'studio_profile_editor' && (
          <StudioProfileEditorView
            studio={currentStudio}
            onUpdateStudio={handleUpdateStudioProfile}
            onNavigate={handleNavigate}
          />
        )}

        {/* 5. Services Management: Add, edit, deactivate, remove services with ZAR pricing */}
        {currentView === 'services_management' && (
          <ServicesManagementView
            studio={currentStudio}
            onUpdateServices={handleUpdateStudioServices}
            onNavigate={handleNavigate}
          />
        )}

        {/* 6. House Calls & Availability: Explicit house-call toggle, travel fees, hours table */}
        {currentView === 'house_calls_availability' && (
          <HouseCallsAvailabilityView
            studio={currentStudio}
            onUpdateAvailability={handleUpdateAvailability}
            onNavigate={handleNavigate}
          />
        )}

        {/* 7. Studio Preview: Customer perspective with locked publish workflow for pending artisans */}
        {currentView === 'studio_preview' && (
          <StudioPreviewView
            studio={currentStudio}
            application={currentApp}
            onTogglePublish={handleToggleStudioPublish}
            onNavigate={handleNavigate}
            onOpenAdminReview={() => setCurrentView('admin_review')}
            onBookService={(srv) => {
              handleOpenBookingModal(currentStudio.id, srv.id);
            }}
          />
        )}
      </main>

      {/* Floating STENZA Gemini AI Concierge Trigger (Consumer View only, hidden on Auth/Login & Artisan views) */}
      {!isArtisanView && !isAuthView && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          <button
            onClick={() => setConciergeChatOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#26152d] hover:bg-[#39263f] text-white shadow-2xl border border-[#b86b86]/50 transition-all hover:scale-105 group cursor-pointer"
            title="Ask STENZA Mzansi Concierge"
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[22px] text-[#f6d9fb] group-hover:rotate-12 transition-transform">
                smart_toy
              </span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#26152d]"></span>
            </div>
            <span className="text-xs font-semibold tracking-wide">
              Ask AI Concierge
            </span>
            <span className="text-[10px] bg-[#b86b86] text-white px-1.5 py-0.2 rounded font-mono font-bold">
              Maps
            </span>
          </button>
        </div>
      )}


      {/* Global Modals */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setReviewBooking(null);
        }}
        preselectedProviderId={modalProviderId}
        preselectedServiceId={modalServiceId}
        preselectedDiscount={bookingDiscount}
        onBookingConfirmed={handleBookingConfirmed}
        onNavigateToBookings={() => handleNavigate('bookings')}
        isLoggedIn={isLoggedIn}
        onNavigateToLogin={() => handleNavigate('auth', undefined, 'login')}
        bookingToReview={reviewBooking}
        completedBookings={bookings.filter((b) => b.status === 'completed')}
        onSaveReview={handleSaveBookingReview}
      />

      <LoyaltyModal
        isOpen={loyaltyModalOpen}
        onClose={() => setLoyaltyModalOpen(false)}
        bookings={bookings}
        redeemedPoints={redeemedPoints}
        onRedeemReward={handleRedeemReward}
      />

      <ConciergeChatModal
        isOpen={conciergeChatOpen}
        onClose={() => setConciergeChatOpen(false)}
        selectedCity={selectedCity}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Admin Access ID Authentication Security Gate */}
      <AdminAccessModal
        isOpen={adminAccessModalOpen}
        onClose={() => setAdminAccessModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Footer: Artisan vs User Page vs Auth (Hidden on Auth/Login page) */}
      {isAuthView ? null : isArtisanView ? (
        <footer className="bg-[#140a19] text-stone-400 border-t border-[#35193f] py-6 px-4 sm:px-6 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#d4af37]" />
              <span className="text-stone-300 font-medium">
                STENZA Beauty Artisan Studio Suite • South African Beauty Network
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <button onClick={() => handleNavigate('artisan_dashboard')} className="hover:text-white transition cursor-pointer">Dashboard</button>
              <button onClick={() => handleNavigate('services_management')} className="hover:text-white transition cursor-pointer">Services</button>
              <button onClick={() => handleNavigate('house_calls_availability')} className="hover:text-white transition cursor-pointer">Operating Hours</button>
              <button onClick={() => handleNavigate('admin_review')} className="text-emerald-400 hover:text-emerald-300 transition font-semibold cursor-pointer">Admin Portal</button>
              <button onClick={() => handleNavigate('home')} className="text-pink-300 hover:text-white font-semibold transition cursor-pointer">User Marketplace</button>
            </div>
          </div>
        </footer>
      ) : (
        <Footer
          onNavigate={handleNavigate}
          onOpenLocationModal={() => setLocationModalOpen(true)}
        />
      )}
    </div>
  );
}
