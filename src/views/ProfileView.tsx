import React, { useState } from 'react';
import { PROVIDERS, Provider, ServiceItem, Booking } from '../data/beautyData';
import { calculateLoyaltySummary, AVAILABLE_REWARDS } from '../data/loyaltyData';
import { ReportStudioModal } from '../components/ReportStudioModal';
import { adminService } from '../services/adminService';

interface ProfileViewProps {
  providerId: string;
  onNavigate: (view: string, providerId?: string, authMode?: 'login' | 'register') => void;
  onOpenBookingModal: (providerId?: string, serviceId?: string, discount?: number) => void;
  bookings: Booking[];
  redeemedPoints: number;
  onOpenLoyaltyModal: () => void;
  isLoggedIn?: boolean;
  currentUserName?: string;
  currentUserEmail?: string;
  currentUserId?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  providerId,
  onNavigate,
  onOpenBookingModal,
  bookings,
  redeemedPoints,
  onOpenLoyaltyModal,
  isLoggedIn = false,
  currentUserName = 'Naledi Mokwena',
  currentUserEmail = 'naledi.mokwena@stenzabeauty.co.za',
  currentUserId = 'usr-client-01',
}) => {
  const provider: Provider = PROVIDERS.find((p) => p.id === providerId) || PROVIDERS[0];

  const [selectedServiceId, setSelectedServiceId] = useState<string>(provider.services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 25 Oct');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [serviceMode, setServiceMode] = useState<'in-studio' | 'mobile'>('in-studio');
  const [activeTab, setActiveTab] = useState<'services' | 'loyalty' | 'portfolio' | 'reviews' | 'about'>('services');
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [applyLoyaltyDiscount, setApplyLoyaltyDiscount] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Administrative Moderation Status Check
  const adminStudio = adminService.getStudioById(provider.id);
  const isSuspended = adminStudio?.operationalStatus === 'suspended' || adminStudio?.operationalStatus === 'disabled' || adminStudio?.isDeleted;
  const isUnderReview = adminStudio?.operationalStatus === 'under_review';

  const activeService: ServiceItem | undefined =
    provider.services.find((s) => s.id === selectedServiceId) || provider.services[0];

  // Loyalty calculations
  const loyaltySummary = calculateLoyaltySummary(bookings, redeemedPoints);
  const pointsToEarn = Math.floor((activeService?.price || 0) / 10);
  
  // R100 discount if user has at least 100 points
  const discountAmount = applyLoyaltyDiscount && loyaltySummary.availablePoints >= 100 ? 100 : 0;

  const travelFee = serviceMode === 'mobile' ? (provider.travelFee || 150) : 0;
  const baseRate = (activeService?.price || 0) + travelFee;
  const totalRate = Math.max(0, baseRate - discountAmount);

  const dates = [
    { label: 'Today', sub: '24 Oct' },
    { label: 'Tomorrow', sub: '25 Oct' },
    { label: 'Sat', sub: '26 Oct' },
    { label: 'Sun', sub: '27 Oct' },
    { label: 'Mon', sub: '28 Oct' },
  ];

  const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

  return (
    <div className="pb-20">
      {/* Cover Image Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-stone-300 overflow-hidden">
        <img
          src={provider.coverImage}
          alt={provider.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Back navigation & Share */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between text-white">
          <button
            onClick={() => onNavigate('discover')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-xs font-medium hover:bg-black/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Directory</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLoyaltyModal}
              className="px-3 py-1.5 rounded-full bg-[#695684]/90 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5 hover:bg-[#584572] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-300">diamond</span>
              <span>{loyaltySummary.availablePoints} Loyalty Pts</span>
            </button>

            <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-xs font-semibold text-emerald-300 hidden md:flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>STENZA Escrow Verified</span>
            </span>

            {/* Clearly visible Report Studio button on mobile and desktop */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-rose-950/80 hover:text-rose-200 backdrop-blur-md text-xs font-semibold text-stone-200 flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
              title="Report this studio or safety concern"
            >
              <span className="material-symbols-outlined text-[15px] text-rose-400">flag</span>
              <span className="hidden sm:inline">Report Studio</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </div>

        {/* Banner Overlaid Summary */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-end gap-4">
            <img
              src={provider.avatar}
              alt={provider.founder}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-white shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#695684] text-white px-2 py-0.5 rounded">
                  {provider.badge}
                </span>
                {provider.offersMobile && (
                  <span className="text-[10px] font-semibold bg-emerald-700/80 text-white px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">directions_car</span>
                    Mobile
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold mt-1 text-white">
                {provider.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 mt-0.5">
                by {provider.founder} • {provider.founderTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 self-start sm:self-auto">
            <div>
              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                <span>★ {provider.rating}</span>
              </div>
              <div className="text-[10px] text-stone-300">{provider.reviewCount} reviews</div>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div>
              <div className="font-bold text-sm text-white">{provider.completedBookings}+</div>
              <div className="text-[10px] text-stone-300">Bookings Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sticky Booking Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Loyalty Points Tracking Ribbon / Quick Banner in Profile View */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#26152d] via-[#39263f] to-[#695684] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center flex-shrink-0 text-amber-300">
              <span className="material-symbols-outlined text-[28px]">diamond</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#f6d9fb]">
                  Your STENZA Loyalty Tracker
                </span>
                <span className="bg-[#b9a3d6]/30 text-white text-[9px] font-bold px-2 py-0.2 rounded-full">
                  {loyaltySummary.tier}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif text-2xl font-bold">{loyaltySummary.totalPointsEarned}</span>
                <span className="text-xs text-stone-300 font-medium">Total Points Earned from Completed Bookings</span>
                <span className="text-xs text-amber-300 font-bold">({loyaltySummary.availablePoints} pts available = R{loyaltySummary.zarValue} credit)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setActiveTab('loyalty')}
              className="py-2 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Points Ledger</span>
            </button>
            <button
              onClick={onOpenLoyaltyModal}
              className="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#26152d] text-xs font-bold transition-colors shadow-sm"
            >
              Redeem Rewards
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Tabs, Services, Bio, Reviews, Loyalty */}
          <div className="lg:col-span-8 space-y-8">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#e5e0d8] pb-1 overflow-x-auto">
              {[
                { id: 'services', label: 'Treatment Menu', icon: 'spa' },
                { id: 'loyalty', label: `Loyalty Points (${loyaltySummary.totalPointsEarned} pts)`, icon: 'diamond' },
                { id: 'portfolio', label: `Portfolio (${provider.gallery.length})`, icon: 'photo_library' },
                { id: 'about', label: 'Artisan Bio & Studio', icon: 'info' },
                { id: 'reviews', label: `Reviews (${provider.reviewCount})`, icon: 'reviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-3 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#695684] text-white shadow-xs'
                      : 'text-gray-600 hover:text-[#26152d] hover:bg-[#f6f3ee]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: Services Menu */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#26152d]">
                    Curated Treatment Menu
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Select a treatment to view details and immediately reserve your spot.
                  </p>
                </div>

                <div className="space-y-3">
                  {provider.services.map((service) => {
                    const isSelected = selectedServiceId === service.id;
                    const ptsEarnable = Math.floor(service.price / 10);
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#695684] bg-white ring-2 ring-[#695684]/20 shadow-md'
                            : 'border-[#e5e0d8] bg-white hover:border-[#b9a3d6]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif text-base font-bold text-[#26152d]">
                                {service.name}
                              </h4>
                              {service.popular && (
                                <span className="bg-[#f6d9fb] text-[#39263f] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  Most Popular
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {service.duration} • {service.category}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {service.description}
                            </p>
                            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#695684] font-medium">
                              <span className="material-symbols-outlined text-[14px]">diamond</span>
                              <span>Earns <strong>+{ptsEarnable} STENZA Loyalty Points</strong> upon completion</span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="font-serif text-lg font-bold text-[#695684]">
                              R{service.price}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedServiceId(service.id);
                                onOpenBookingModal(provider.id, service.id, discountAmount);
                              }}
                              className={`mt-2 py-1.5 px-3.5 rounded-lg text-xs font-semibold transition-colors ${
                                isSelected
                                  ? 'bg-[#695684] text-white shadow-xs'
                                  : 'bg-[#f6f3ee] hover:bg-[#ebe8e3] text-[#26152d]'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Loyalty Points Tracking System */}
            {activeTab === 'loyalty' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#26152d]">
                    Your Completed Bookings Loyalty Points Tracking
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Every completed treatment automatically credits 1 STENZA point per R10 spent.
                  </p>
                </div>

                {/* Main Stats Card */}
                <div className="bg-white p-6 rounded-2xl border border-[#e5e0d8] shadow-2xs space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-[#f0ede6]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500">Total Points Earned</span>
                      <div className="font-serif text-3xl font-bold text-[#695684] mt-1">
                        {loyaltySummary.totalPointsEarned} <span className="text-xs font-sans text-gray-500 font-normal">pts</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold">From completed visits</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500">Available to Spend</span>
                      <div className="font-serif text-3xl font-bold text-[#26152d] mt-1">
                        {loyaltySummary.availablePoints} <span className="text-xs font-sans text-gray-500 font-normal">pts</span>
                      </div>
                      <span className="text-[11px] text-gray-600 font-medium">= R{loyaltySummary.zarValue} off appointments</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500">Current Status</span>
                      <div className="font-serif text-2xl font-bold text-amber-600 mt-1">
                        {loyaltySummary.tier}
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {loyaltySummary.nextTierPointsNeeded > 0
                          ? `${loyaltySummary.nextTierPointsNeeded} pts to ${loyaltySummary.nextTierName}`
                          : 'Elite VIP'}
                      </span>
                    </div>
                  </div>

                  {/* Tier Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1.5 font-medium">
                      <span>Tier Progress ({loyaltySummary.tier})</span>
                      <span>{Math.round(loyaltySummary.progressPercent)}% to next milestone</span>
                    </div>
                    <div className="w-full bg-[#f0ede6] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#695684] h-full rounded-full transition-all duration-500"
                        style={{ width: `${loyaltySummary.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Points Ledger from Completed Bookings */}
                <div className="space-y-3">
                  <h4 className="font-serif text-base font-bold text-[#26152d]">
                    Completed Booking Breakdown
                  </h4>

                  <div className="space-y-2.5">
                    {loyaltySummary.ledger.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white rounded-xl border border-[#e5e0d8] flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                              item.type === 'bonus'
                                ? 'bg-amber-100 text-amber-800'
                                : item.type === 'redeemed'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-[#f6d9fb] text-[#39263f]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {item.type === 'bonus' ? 'stars' : item.type === 'redeemed' ? 'remove_circle' : 'add_task'}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-serif text-xs font-bold text-[#26152d]">
                                {item.title}
                              </h5>
                              {item.bookingRef && (
                                <span className="font-mono text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
                                  {item.bookingRef}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {item.subtitle} • {item.date}
                            </p>
                            {item.amountZAR && (
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                Completed for R{item.amountZAR} (Credited at 1 pt per R10)
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-serif text-base font-bold ${
                              item.points > 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {item.points > 0 ? `+${item.points}` : item.points} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Redeem Vouchers Card */}
                <div className="bg-[#f6f3ee] p-5 rounded-2xl border border-[#e5e0d8] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#26152d]">
                        Redeemable Loyalty Vouchers
                      </h4>
                      <p className="text-xs text-gray-600">
                        Convert points into instant ZAR booking credits at {provider.name}.
                      </p>
                    </div>
                    <button
                      onClick={onOpenLoyaltyModal}
                      className="text-xs font-bold text-[#695684] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {AVAILABLE_REWARDS.slice(0, 2).map((rew) => (
                      <div key={rew.id} className="p-3 bg-white rounded-xl border border-[#e5e0d8] flex justify-between items-center">
                        <div>
                          <div className="font-bold text-xs text-[#26152d]">{rew.title}</div>
                          <div className="text-[10px] text-[#695684] font-semibold">{rew.pointsRequired} Points Required</div>
                        </div>
                        <button
                          onClick={onOpenLoyaltyModal}
                          className="py-1 px-3 rounded-lg bg-[#695684] text-white text-[11px] font-semibold hover:bg-[#584572]"
                        >
                          Redeem
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Portfolio */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#26152d]">
                    Artisan Portfolio & Studio Gallery
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Authentic client treatments photographed at {provider.name}.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {provider.gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageModal(imgUrl)}
                      className="aspect-square rounded-2xl overflow-hidden bg-stone-200 cursor-pointer group relative shadow-xs"
                    >
                      <img
                        src={imgUrl}
                        alt={`Portfolio piece ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[24px]">zoom_in</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: About & Amenities */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#e5e0d8] space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#26152d]">
                    About {provider.founder}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {provider.bio}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#695684]">workspace_premium</span>
                      <span><strong>{provider.experienceYears}+ Years</strong> Industry Mastery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#695684]">verified</span>
                      <span>Certified Medical Autoclave Sanitization</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-white p-6 rounded-2xl border border-[#e5e0d8] space-y-3">
                  <h4 className="font-serif text-base font-bold text-[#26152d]">
                    Studio Amenities & Hospitality
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {provider.amenities.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-gray-700">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location & Operating Hours */}
                <div className="bg-white p-6 rounded-2xl border border-[#e5e0d8] space-y-4">
                  <h4 className="font-serif text-base font-bold text-[#26152d]">
                    Location & Operating Hours
                  </h4>
                  <div className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#695684] mt-0.5">location_on</span>
                    <div>
                      <p className="font-semibold text-[#26152d]">{provider.address}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        Located inside The Keyes Art Mile with dedicated underground guest parking.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#f0ede6] pt-3 space-y-2">
                    {provider.openingHours.map((h) => (
                      <div key={h.day} className="flex justify-between text-xs text-gray-600">
                        <span>{h.day}</span>
                        <span className="font-semibold text-[#26152d]">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Score Summary Box */}
                <div className="bg-white p-6 rounded-2xl border border-[#e5e0d8] grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div className="text-center sm:border-r sm:border-[#f0ede6]">
                    <div className="font-serif text-4xl font-bold text-[#695684]">
                      {provider.rating}
                    </div>
                    <div className="text-amber-500 text-sm mt-1">★★★★★</div>
                    <div className="text-xs text-gray-500 mt-1">Based on {provider.reviewCount} client visits</div>
                  </div>

                  <div className="sm:col-span-2 space-y-2 text-xs">
                    {Object.entries(provider.ratingBreakdown).map(([trait, score]) => (
                      <div key={trait} className="flex items-center gap-3">
                        <span className="w-28 text-gray-600 capitalize">{trait}</span>
                        <div className="flex-1 bg-[#f0ede6] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#695684] h-full rounded-full"
                            style={{ width: `${(score / 5) * 100}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#26152d] w-8 text-right">{score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Review Cards */}
                <div className="space-y-4">
                  {provider.reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-5 rounded-2xl border border-[#e5e0d8] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.clientAvatar}
                            alt={rev.clientName}
                            className="w-10 h-10 rounded-full object-cover border border-[#e5e0d8]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-serif text-xs font-bold text-[#26152d]">{rev.clientName}</h5>
                              {rev.verified && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                                  Verified Booking
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500">{rev.clientLocation} • {rev.date}</div>
                          </div>
                        </div>

                        <div className="text-amber-500 font-bold text-xs">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>

                      <div className="text-[11px] font-medium text-[#7c535c] bg-[#fcf9f4] px-2.5 py-1 rounded-lg inline-block">
                        Treatment: {rev.treatment}
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed">
                        "{rev.comment}"
                      </p>

                      <div className="text-[10px] text-gray-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                        <span>{rev.helpfulCount} clients found this helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Concierge Card with Loyalty Redemption */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white p-6 rounded-3xl border border-[#e5e0d8] shadow-xl space-y-5">
              {isSuspended && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    <span>Studio Listing Restricted</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This studio profile is currently suspended under STENZA Marketplace Moderation policies. New appointments are temporarily paused.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-[#f0ede6]">
                <div className="text-xs font-serif font-bold text-[#26152d]">
                  Quick Concierge Reservation
                </div>
                <div className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Instant Sync
                </div>
              </div>

              {/* Selected Service Card */}
              <div className="p-3.5 rounded-xl bg-[#f6f3ee] border border-[#e5e0d8]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#7c535c]">Selected Service</div>
                    <div className="font-semibold text-xs text-[#26152d] mt-0.5">{activeService?.name}</div>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">diamond</span>
                    <span>+{pointsToEarn} pts</span>
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#e5e0d8] text-xs">
                  <span className="text-gray-500">{activeService?.duration}</span>
                  <span className="font-bold text-[#695684] text-base">R{activeService?.price}</span>
                </div>
              </div>

              {/* Service Venue Mode */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  Appointment Setting
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setServiceMode('in-studio')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      serviceMode === 'in-studio'
                        ? 'border-[#695684] bg-[#695684]/10 font-bold text-[#26152d]'
                        : 'border-[#e5e0d8] text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <span>In-Studio</span>
                    <span className="block text-[10px] font-normal text-gray-500 mt-0.5">Rosebank Suite</span>
                  </button>

                  <button
                    disabled={!provider.offersMobile}
                    onClick={() => setServiceMode('mobile')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      serviceMode === 'mobile'
                        ? 'border-[#695684] bg-[#695684]/10 font-bold text-[#26152d]'
                        : 'border-[#e5e0d8] text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <span>Mobile / Home</span>
                    <span className="block text-[10px] font-normal text-gray-500 mt-0.5">+ R{provider.travelFee} travel</span>
                  </button>
                </div>
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  Select Date
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {dates.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setSelectedDate(`${d.label}, ${d.sub}`)}
                      className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-center border text-xs transition-all ${
                        selectedDate.includes(d.label)
                          ? 'border-[#695684] bg-[#695684] text-white font-bold'
                          : 'border-[#e5e0d8] text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-[11px]">{d.label}</div>
                      <div className="text-[9px] opacity-75">{d.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        selectedTime === t
                          ? 'border-[#695684] bg-[#695684] text-white font-bold'
                          : 'border-[#e5e0d8] text-gray-700 hover:border-[#695684]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loyalty Points Redemption Toggle */}
              <div className="p-3 bg-[#fcf9f4] rounded-xl border border-[#e5e0d8] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#26152d]">
                    <span className="material-symbols-outlined text-[16px] text-amber-500">diamond</span>
                    <span>Redeem Loyalty Points</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Balance: <strong>{loyaltySummary.availablePoints} pts</strong>
                  </span>
                </div>

                {loyaltySummary.availablePoints >= 100 ? (
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={applyLoyaltyDiscount}
                      onChange={(e) => setApplyLoyaltyDiscount(e.target.checked)}
                      className="accent-[#695684] rounded"
                    />
                    <span>Apply 100 points for an instant <strong>-R100 discount</strong></span>
                  </label>
                ) : (
                  <p className="text-[11px] text-gray-500 italic">
                    Earn {100 - loyaltySummary.availablePoints} more points to unlock instant R100 vouchers.
                  </p>
                )}
              </div>

              {/* Cost Summary */}
              <div className="p-3 bg-[#f6f3ee] rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>{activeService?.name}</span>
                  <span>R{activeService?.price}</span>
                </div>
                {serviceMode === 'mobile' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Mobile Call-Out Fee</span>
                    <span>R{travelFee}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>STENZA Loyalty Discount</span>
                    <span>-R{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-[#26152d] pt-1.5 border-t border-[#d8d3ca]">
                  <span>Total (Escrow)</span>
                  <span className="text-[#695684]">R{totalRate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {isSuspended ? (
                  <div className="p-3 bg-stone-100 rounded-xl text-center text-stone-500 text-xs font-semibold">
                    Appointments Disabled During Compliance Review
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          onNavigate('auth', undefined, 'login');
                        } else {
                          onOpenBookingModal(provider.id, selectedServiceId, discountAmount);
                        }
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#695684] hover:bg-[#584572] text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      <span>Request This Appointment</span>
                    </button>

                    <a
                      href={`https://wa.me/27824591084?text=Hi%20${provider.founder},%20I'm%20viewing%20${provider.name}%20on%20STENZA%20Beauty%20and%20interested%20in%20${activeService?.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">chat</span>
                      <span>Instant WhatsApp Artisan Inquiry</span>
                    </a>
                  </>
                )}
              </div>

              <div className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-emerald-600">shield</span>
                <span>Protected by STENZA South Africa Escrow & POPIA Act</span>
              </div>

              {/* Customer Report Concern Trigger */}
              <div className="pt-2 border-t border-[#f0ede6] text-center">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1 cursor-pointer hover:underline transition"
                >
                  <span className="material-symbols-outlined text-[14px]">flag</span>
                  <span>Report this studio or pricing concern</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Report Modal */}
      <ReportStudioModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        studioId={provider.id}
        studioName={provider.name}
        isLoggedIn={isLoggedIn}
        currentUserName={currentUserName}
        currentUserEmail={currentUserEmail}
        currentUserId={currentUserId}
        onRequireLogin={() => onNavigate('auth', undefined, 'login')}
        onViewMyReports={() => onNavigate('bookings')}
      />

      {/* Image Modal */}
      {selectedImageModal && (
        <div 
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="relative max-w-2xl w-full bg-black rounded-2xl overflow-hidden">
            <img src={selectedImageModal} alt="Expanded photo" className="w-full h-auto max-h-[85vh] object-contain mx-auto" />
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
