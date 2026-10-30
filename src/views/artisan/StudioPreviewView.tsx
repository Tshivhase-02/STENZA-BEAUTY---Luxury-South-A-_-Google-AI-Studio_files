import React, { useState } from 'react';
import { StudioProfile, ArtisanApplication, StudioService, OperatingDay } from '../../data/artisanWorkflowData';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  Star, 
  ShieldCheck, 
  Lock, 
  Eye, 
  ArrowLeft, 
  Car, 
  Clock, 
  Scissors, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Check,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Coffee
} from 'lucide-react';

interface StudioPreviewViewProps {
  studio: StudioProfile;
  application: ArtisanApplication;
  onTogglePublish: (publishState: boolean) => void;
  onNavigate: (view: string) => void;
  onOpenAdminReview: () => void;
  onBookService?: (service: StudioService) => void;
}

export const StudioPreviewView: React.FC<StudioPreviewViewProps> = ({
  studio,
  application,
  onTogglePublish,
  onNavigate,
  onOpenAdminReview,
  onBookService,
}) => {
  const isApproved = application.status === 'approved';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Service Detail & Gallery Lightbox Modal State
  const [selectedServiceForGallery, setSelectedServiceForGallery] = useState<StudioService | null>(null);
  const [galleryActiveImageIndex, setGalleryActiveImageIndex] = useState<number>(0);

  // Appointment Time Slot Selector Modal State
  const [bookingServiceTarget, setBookingServiceTarget] = useState<StudioService | null>(null);
  const [selectedBookingDayIndex, setSelectedBookingDayIndex] = useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookingConfirmedNotice, setBookingConfirmedNotice] = useState<string | null>(null);

  // Categories from active services
  const categories = ['all', ...Array.from(new Set(studio.services.map((s) => s.category)))];

  // Only show active services to customers
  const filteredServices = studio.services.filter((s) => {
    if (!s.isActive) return false;
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handlePublishClick = () => {
    if (!isApproved) {
      setShowLockedModal(true);
      return;
    }
    onTogglePublish(!studio.isPublished);
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenServiceGallery = (service: StudioService) => {
    setSelectedServiceForGallery(service);
    setGalleryActiveImageIndex(service.coverImageIndex || 0);
  };

  const handleOpenTimeSlotBooking = (service: StudioService) => {
    setBookingServiceTarget(service);
    setSelectedBookingDayIndex(0);
    setSelectedTimeSlot(null);
    setBookingConfirmedNotice(null);
  };

  // Generate next 7 days for booking calendar
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('en-ZA', { weekday: 'long' });
    const formattedDate = d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
    return { date: d, dayName, formattedDate };
  });

  const activeBookingDayInfo = next7Days[selectedBookingDayIndex] || next7Days[0];
  const activeDaySchedule = studio.operatingHours.find(
    (h) => h.day.toLowerCase() === activeBookingDayInfo.dayName.toLowerCase()
  );

  // Generate dynamic time slots based on start/close, duration, and breaks
  const generateAvailableSlots = (schedule?: OperatingDay, durationMinutes: number = 60) => {
    if (!schedule || !schedule.isOpen) return [];

    const slots: string[] = [];
    const [startH, startM] = schedule.openTime.split(':').map(Number);
    const [closeH, closeM] = schedule.closeTime.split(':').map(Number);

    const startTotalMin = startH * 60 + startM;
    const closeTotalMin = closeH * 60 + closeM;

    let breakStartMin = -1;
    let breakEndMin = -1;
    if (schedule.hasBreak && schedule.breakStartTime && schedule.breakEndTime) {
      const [bStartH, bStartM] = schedule.breakStartTime.split(':').map(Number);
      const [bEndH, bEndM] = schedule.breakEndTime.split(':').map(Number);
      breakStartMin = bStartH * 60 + bStartM;
      breakEndMin = bEndH * 60 + bEndM;
    }

    // Step by 30 mins or duration
    const stepMin = 30;
    for (let cur = startTotalMin; cur + durationMinutes <= closeTotalMin; cur += stepMin) {
      const curEnd = cur + durationMinutes;

      // Check break overlap
      if (breakStartMin !== -1 && breakEndMin !== -1) {
        if (cur < breakEndMin && curEnd > breakStartMin) {
          continue; // Overlaps break
        }
      }

      const h = Math.floor(cur / 60);
      const m = cur % 60;
      const formattedSlot = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push(formattedSlot);
    }

    return slots;
  };

  const parseDurationToMinutes = (dur: string) => {
    const match = dur.match(/(\d+)/);
    return match ? Number(match[1]) : 60;
  };

  const availableSlots = bookingServiceTarget
    ? generateAvailableSlots(
        activeDaySchedule,
        parseDurationToMinutes(bookingServiceTarget.duration)
      )
    : [];

  const handleConfirmSlot = () => {
    if (!selectedTimeSlot || !bookingServiceTarget) return;

    if (onBookService) {
      onBookService(bookingServiceTarget);
      setBookingServiceTarget(null);
    } else {
      setBookingConfirmedNotice(
        `Appointment reserved for ${bookingServiceTarget.name} on ${activeBookingDayInfo.dayName}, ${activeBookingDayInfo.formattedDate} at ${selectedTimeSlot}!`
      );
      setTimeout(() => {
        setBookingServiceTarget(null);
        setBookingConfirmedNotice(null);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] pb-24">
      {/* Top Workflow Control Bar */}
      <div className="bg-[#26152d] text-white py-4 px-4 sm:px-6 sticky top-0 z-40 border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('artisan_dashboard')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-500/30 text-pink-200 px-2 py-0.5 rounded border border-pink-400/40">
                  Customer Perspective Preview
                </span>
                <span className="text-xs text-stone-300">
                  {studio.isPublished ? 'Status: Public Live' : 'Status: Unpublished Draft'}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white hidden sm:block">
                {studio.businessName} • Marketplace Preview
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied Link!' : 'Share Beauty Shop'}</span>
            </button>

            {/* Publish / Locked Publish CTA */}
            {isApproved ? (
              <button
                onClick={handlePublishClick}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md ${
                  studio.isPublished
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{studio.isPublished ? 'Unpublish Beauty Shop' : 'Publish Beauty Shop Live'}</span>
              </button>
            ) : (
              <button
                onClick={handlePublishClick}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-700 hover:bg-stone-600 text-stone-200 flex items-center gap-2 transition cursor-pointer border border-stone-600 shadow-xs"
                title="Application is pending administrator approval"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Publish Beauty Shop (Locked)</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('artisan_dashboard')}
              className="px-3.5 py-1.5 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Return to Professional Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Rule Notification Banner */}
      {!isApproved && (
        <div className="bg-amber-500/10 border-b border-amber-300/40 px-4 py-3 text-amber-900 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Application Status: Pending Admin Approval.</strong> This beauty shop preview is currently in draft. Clients cannot discover or book your beauty shop until a STENZA compliance administrator verifies your dossier.
              </span>
            </div>
            <button
              onClick={onOpenAdminReview}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-950 shrink-0 text-left cursor-pointer"
            >
              Switch to Admin to Approve Now →
            </button>
          </div>
        </div>
      )}

      {/* Customer-Facing Page Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Hero Cover Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-stone-200 aspect-16/7 sm:aspect-21/8 bg-stone-900">
          <img
            src={studio.coverUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80'}
            alt={studio.businessName}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          {/* House Call Badge */}
          {studio.offersHouseCalls && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-stone-900 flex items-center gap-1.5 shadow-md">
              <Car className="w-4 h-4 text-[#b86b86]" />
              <span>House Calls Available (+R{studio.travelFee})</span>
            </div>
          )}
        </div>

        {/* Profile Info Overlay Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-20 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Studio Logo Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                <img
                  src={studio.logoUrl || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=300&q=80'}
                  alt={studio.businessName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b86b86] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                    {studio.category}
                  </span>

                  {isApproved && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      STENZA Verified Artisan
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#26152d]">
                  {studio.businessName}
                </h1>

                <p className="text-xs sm:text-sm text-stone-600 mt-1 flex items-center gap-2">
                  <span className="font-semibold text-stone-900">{studio.founderName}</span>
                  <span>•</span>
                  <span>{studio.founderTitle}</span>
                </p>

                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{studio.address}</span>
                </p>
              </div>
            </div>

            {/* Ratings & Quick Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 text-amber-900">
                  <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                  <span className="text-sm font-bold">{studio.averageRating}</span>
                  <span className="text-xs text-stone-500">({studio.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${studio.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Studio</span>
                </a>
                <a
                  href={`tel:${studio.phone}`}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Phone className="w-4 h-4 text-stone-600" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>

          {/* Tagline / Headline */}
          <div className="pt-4">
            <p className="text-sm sm:text-base font-serif italic text-stone-700 leading-relaxed">
              "{studio.headline}"
            </p>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Services Menu & Gallery (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Services Section */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#26152d] flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-[#b86b86]" />
                    Treatments & Services Menu
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Click any service to view its photo gallery, preparation details, and schedule slots.
                  </p>
                </div>

                {/* Category filters */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-medium transition cursor-pointer shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-[#26152d] text-white font-bold'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Cards */}
              <div className="space-y-4">
                {filteredServices.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs">
                    No active services listed in this category.
                  </div>
                ) : (
                  filteredServices.map((service) => {
                    const coverPhoto = service.images?.[service.coverImageIndex || 0] || service.imageUrl;
                    const photoCount = service.images?.length || (service.imageUrl ? 1 : 0);

                    return (
                      <div
                        key={service.id}
                        className="p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-[#b86b86]/50 hover:shadow-sm transition bg-stone-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                        <div 
                          onClick={() => handleOpenServiceGallery(service)}
                          className="flex gap-4 cursor-pointer flex-1"
                        >
                          {coverPhoto && (
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
                              <img
                                src={coverPhoto}
                                alt={service.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <ImageIcon className="w-2.5 h-2.5" /> {photoCount}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                                {service.category}
                              </span>
                              {service.popular && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-[#b86b86] flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-[#b86b86]" /> Signature
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-bold text-[#26152d] group-hover:text-[#b86b86] transition-colors">
                              {service.name}
                            </h4>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-md line-clamp-2">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                              <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3.5 h-3.5 text-stone-400" /> {service.duration}
                              </span>
                              <span className="text-[#b86b86] font-semibold underline text-[11px]">
                                View Photos & Details →
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                          <div className="text-right">
                            <span className="text-xs text-stone-400 block sm:hidden">Price</span>
                            {service.discountedPrice ? (
                              <div className="flex items-baseline gap-1.5 sm:justify-end">
                                <span className="text-lg font-bold text-[#b86b86]">R{service.discountedPrice}</span>
                                <span className="text-xs text-stone-400 line-through">R{service.price}</span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-[#26152d]">R{service.price}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenTimeSlotBooking(service)}
                              className="px-5 py-2 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Select Time</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* About / Bio Section */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-xl font-serif font-bold text-[#26152d] mb-4">
                About {studio.businessName}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {studio.bio}
              </p>

              {/* Social links */}
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-stone-100 text-xs">
                {studio.instagram && (
                  <a
                    href={`https://instagram.com/${studio.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-stone-700 hover:text-[#b86b86] font-semibold"
                  >
                    <Instagram className="w-4 h-4 text-[#b86b86]" />
                    <span>{studio.instagram}</span>
                  </a>
                )}
                {studio.website && (
                  <a
                    href={studio.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-stone-700 hover:text-[#b86b86] font-semibold"
                  >
                    <Globe className="w-4 h-4 text-stone-500" />
                    <span>Official Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Portfolio Gallery */}
            {studio.gallery && studio.gallery.length > 0 && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
                <h3 className="text-xl font-serif font-bold text-[#26152d] mb-4">
                  Studio Atmosphere & Client Showcase
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {studio.gallery.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-stone-200 group">
                      <img
                        src={img}
                        alt={`Portfolio piece ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Working Hours, House Calls, and Location (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Working Hours Schedule Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
                <Clock className="w-5 h-5 text-[#b86b86]" />
                <h4 className="text-sm font-bold text-[#26152d] uppercase tracking-wider">
                  Working Days & Hours
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                {studio.operatingHours.map((op) => (
                  <div key={op.day} className="flex items-start justify-between">
                    <span className="font-medium text-stone-700 w-24">{op.day}</span>
                    {op.isOpen ? (
                      <div className="text-right">
                        <span className="font-mono text-stone-900 font-semibold block">
                          {op.openTime} – {op.closeTime}
                        </span>
                        {op.hasBreak && op.breakStartTime && op.breakEndTime && (
                          <span className="text-[10px] text-purple-700 flex items-center justify-end gap-1 mt-0.5">
                            <Coffee className="w-2.5 h-2.5" />
                            <span>Break {op.breakStartTime}–{op.breakEndTime}</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-400 italic">Unavailable</span>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-stone-400 mt-4 pt-3 border-t border-stone-100 leading-tight">
                * Booking availability is dynamically filtered by treatment duration and pre-existing bookings.
              </p>
            </div>

            {/* House Calls Information Card */}
            {studio.offersHouseCalls && (
              <div className="bg-linear-to-br from-pink-50/80 to-purple-50/60 rounded-3xl border border-pink-200/80 p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-5 h-5 text-[#b86b86]" />
                  <h4 className="text-sm font-bold text-[#26152d] uppercase tracking-wider">
                    Mobile House Calls
                  </h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed mb-3">
                  {studio.founderName} travels to your private home or office.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-pink-200/60">
                    <span className="text-stone-500">Base Travel Callout:</span>
                    <span className="font-bold text-stone-900">R{studio.travelFee} ZAR</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-pink-200/60">
                    <span className="text-stone-500">Service Coverage:</span>
                    <span className="font-medium text-stone-900 text-right max-w-[180px]">
                      {studio.serviceAreas}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-stone-500">Appointment Buffer:</span>
                    <span className="font-medium text-stone-900">{studio.bufferMinutes} min</span>
                  </div>
                </div>
              </div>
            )}

            {/* Studio Address Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-[#b86b86]" />
                <h4 className="text-sm font-bold text-[#26152d] uppercase tracking-wider">
                  Beauty Shop Location
                </h4>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed mb-4">
                {studio.address}
              </p>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500 font-medium">
                📍 Secured access premises with customer parking available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE COMPLETE PHOTO GALLERY & DETAILS MODAL */}
      {selectedServiceForGallery && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b86b86] bg-pink-50 px-2 py-0.5 rounded">
                  {selectedServiceForGallery.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#26152d] mt-1">
                  {selectedServiceForGallery.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceForGallery(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Gallery Viewer for this particular service */}
            {selectedServiceForGallery.images && selectedServiceForGallery.images.length > 0 ? (
              <div className="space-y-3 mb-5">
                {/* Main large viewer */}
                <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-black flex items-center justify-center">
                  <img
                    src={selectedServiceForGallery.images[galleryActiveImageIndex] || selectedServiceForGallery.images[0]}
                    alt={`${selectedServiceForGallery.name} photo ${galleryActiveImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />

                  {/* Previous / Next arrows if multiple */}
                  {selectedServiceForGallery.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setGalleryActiveImageIndex((prev) =>
                            prev === 0 ? selectedServiceForGallery.images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setGalleryActiveImageIndex((prev) =>
                            prev === selectedServiceForGallery.images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {galleryActiveImageIndex + 1} of {selectedServiceForGallery.images.length} photos
                  </div>
                </div>

                {/* Thumbnails row */}
                {selectedServiceForGallery.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedServiceForGallery.images.map((thumbUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setGalleryActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                          galleryActiveImageIndex === idx ? 'border-[#b86b86]' : 'border-stone-200 opacity-60'
                        }`}
                      >
                        <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-stone-50 rounded-2xl text-center text-xs text-stone-500 mb-5">
                No gallery photos uploaded for this service yet.
              </div>
            )}

            {/* Service Details & Pricing */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-500" />
                  <span className="font-semibold text-stone-800">Duration: {selectedServiceForGallery.duration}</span>
                </div>
                <div className="text-right">
                  {selectedServiceForGallery.discountedPrice ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-[#b86b86]">R{selectedServiceForGallery.discountedPrice}</span>
                      <span className="text-stone-400 line-through text-xs">R{selectedServiceForGallery.price}</span>
                    </div>
                  ) : (
                    <span className="text-base font-bold text-[#26152d]">R{selectedServiceForGallery.price}</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1 uppercase tracking-wider text-xs">Treatment Overview</h4>
                <p className="text-stone-700 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                  {selectedServiceForGallery.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  onClick={() => setSelectedServiceForGallery(null)}
                  className="px-4 py-2 text-stone-600 font-semibold text-xs hover:bg-stone-100 rounded-xl transition cursor-pointer"
                >
                  Close Gallery
                </button>
                <button
                  onClick={() => {
                    const target = selectedServiceForGallery;
                    setSelectedServiceForGallery(null);
                    handleOpenTimeSlotBooking(target);
                  }}
                  className="px-6 py-2.5 bg-[#b86b86] hover:bg-[#a25974] text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Choose Appointment Time</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE APPOINTMENT TIME SLOT PICKER MODAL */}
      {bookingServiceTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b86b86] bg-pink-50 px-2 py-0.5 rounded">
                  Schedule Booking
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#26152d] mt-1">
                  {bookingServiceTarget.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {bookingServiceTarget.duration} • R{bookingServiceTarget.discountedPrice || bookingServiceTarget.price}
                </p>
              </div>
              <button
                onClick={() => setBookingServiceTarget(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingConfirmedNotice ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-stone-900">Appointment Reserved!</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {bookingConfirmedNotice}
                </p>
              </div>
            ) : (
              <div className="space-y-5 text-xs sm:text-sm">
                {/* 1. Date Selector (Next 7 days) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    1. Select Date
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {next7Days.map((dayItem, idx) => {
                      const isSelected = selectedBookingDayIndex === idx;
                      const daySched = studio.operatingHours.find(
                        (h) => h.day.toLowerCase() === dayItem.dayName.toLowerCase()
                      );
                      const isDayOpen = daySched?.isOpen;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedBookingDayIndex(idx);
                            setSelectedTimeSlot(null);
                          }}
                          className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center ${
                            isSelected
                              ? 'bg-[#26152d] text-white border-[#26152d] shadow-xs'
                              : isDayOpen
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                              : 'bg-stone-100/50 border-stone-200 text-stone-400 opacity-60'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold">{dayItem.dayName.slice(0, 3)}</span>
                          <span className="text-xs font-bold my-0.5">{dayItem.formattedDate.split(' ')[0]}</span>
                          <span className={`text-[8px] uppercase ${isDayOpen ? (isSelected ? 'text-pink-300' : 'text-emerald-700') : 'text-stone-400'}`}>
                            {isDayOpen ? 'Open' : 'Off'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Available Slots based on Artisan's working hours & breaks */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      2. Available Time Slots ({activeBookingDayInfo.dayName})
                    </label>
                    {activeDaySchedule?.isOpen && (
                      <span className="text-[11px] text-stone-500 font-mono">
                        Working Hours: {activeDaySchedule.openTime}–{activeDaySchedule.closeTime}
                      </span>
                    )}
                  </div>

                  {!activeDaySchedule?.isOpen ? (
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-900">
                      <p className="font-bold">{studio.founderName} is unavailable on {activeBookingDayInfo.dayName}s.</p>
                      <p className="text-[11px] text-amber-800 mt-1">Please select another date on the calendar above.</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500">
                      No matching slots found for a {bookingServiceTarget.duration} appointment on this day.
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                        {availableSlots.map((slot) => {
                          const isSlotSelected = selectedTimeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition cursor-pointer text-center ${
                                isSlotSelected
                                  ? 'bg-[#b86b86] text-white border-[#b86b86] shadow-xs'
                                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>

                      {activeDaySchedule.hasBreak && (
                        <p className="text-[10px] text-purple-700 mt-2 flex items-center gap-1">
                          <Coffee className="w-3 h-3" />
                          <span>Artisan break time ({activeDaySchedule.breakStartTime}–{activeDaySchedule.breakEndTime}) excluded from booking options.</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setBookingServiceTarget(null)}
                    className="px-4 py-2 text-stone-600 font-semibold text-xs hover:bg-stone-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedTimeSlot}
                    onClick={handleConfirmSlot}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 ${
                      selectedTimeSlot
                        ? 'bg-[#26152d] hover:bg-[#39263f] text-white cursor-pointer'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                    <span>Request Appointment ({selectedTimeSlot || 'Pick Slot'})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Locked Publishing Modal (when pending artisan attempts to publish) */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              Marketplace Publishing Locked
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              In accordance with STENZA Quality & Hygiene Standards, your studio cannot be published to the public marketplace until your artisan application (<strong className="font-mono text-stone-900">{application.id}</strong>) is approved by an administrator.
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 mb-6 text-left">
              <p className="font-bold mb-1">Status: Pending Compliance Review</p>
              <p className="text-[11px] text-amber-800">
                You can simulate this approval step immediately using the Administrator Review dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setShowLockedModal(false);
                  onOpenAdminReview();
                }}
                className="w-full py-2.5 bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Go to Admin Review & Approve Application
              </button>
              <button
                onClick={() => setShowLockedModal(false)}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
