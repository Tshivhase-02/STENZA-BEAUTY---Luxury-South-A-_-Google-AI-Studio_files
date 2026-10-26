import React, { useState, useEffect } from 'react';
import { PROVIDERS, Provider, ServiceItem, Booking } from '../data/beautyData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProviderId?: string;
  preselectedServiceId?: string;
  preselectedDiscount?: number;
  onBookingConfirmed: (newBooking: Booking) => void;
  onNavigateToBookings: () => void;
  isLoggedIn?: boolean;
  onNavigateToLogin: () => void;
  bookingToReview?: Booking | null;
  completedBookings?: Booking[];
  onSaveReview?: (bookingId: string, rating: number, reviewText: string) => void;
}

const REVIEW_ATTRIBUTES = [
  'Punctual & Prepared',
  'Sterile & Hygienic Tools',
  'Gentle Technique',
  'Matched Reference Image',
  'Professional Consultation',
  'Hospitality & Care',
  'True to Stated Duration',
  'Long-Lasting Results'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedProviderId,
  preselectedServiceId,
  preselectedDiscount = 0,
  onBookingConfirmed,
  onNavigateToBookings,
  isLoggedIn = false,
  onNavigateToLogin,
  bookingToReview = null,
  completedBookings = [],
  onSaveReview
}) => {
  // Modal Mode: 'book' for new appointment request, 'review' for rating completed service
  const [activeTab, setActiveTab] = useState<'book' | 'review'>('book');

  // Booking Flow States
  const [providerId, setProviderId] = useState<string>(preselectedProviderId || 'luxe-nail-studio');
  const provider: Provider = PROVIDERS.find((p) => p.id === providerId) || PROVIDERS[0];

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || provider.services[0]?.id || ''
  );
  const [serviceType, setServiceType] = useState<'in-studio' | 'mobile'>('in-studio');
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 25 Oct');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [clientAddress, setClientAddress] = useState('14 West Road South, Morningside, Sandton');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Review & Rating States
  const [targetReviewBooking, setTargetReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual & Prepared', 'Sterile & Hygienic Tools']);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState<boolean>(false);

  // Sync mode and selections when modal opens or props change
  useEffect(() => {
    if (bookingToReview) {
      setActiveTab('review');
      setTargetReviewBooking(bookingToReview);
      setRating(bookingToReview.rating || 5);
      setReviewText(bookingToReview.review || '');
      setIsReviewSubmitted(false);
    } else if (preselectedProviderId) {
      setActiveTab('book');
      setProviderId(preselectedProviderId);
      const targetP = PROVIDERS.find((p) => p.id === preselectedProviderId) || PROVIDERS[0];
      if (preselectedServiceId) {
        setSelectedServiceId(preselectedServiceId);
      } else if (targetP.services[0]) {
        setSelectedServiceId(targetP.services[0].id);
      }
      setIsSuccess(false);
    } else {
      setActiveTab('book');
      setIsSuccess(false);
    }
  }, [bookingToReview, preselectedProviderId, preselectedServiceId, isOpen]);

  if (!isOpen) return null;

  const currentService: ServiceItem | undefined =
    provider.services.find((s) => s.id === selectedServiceId) || provider.services[0];

  const travelFee = serviceType === 'mobile' ? (provider.travelFee || 150) : 0;
  const totalPrice = Math.max(0, (currentService?.price || 0) + travelFee - (preselectedDiscount || 0));
  const pointsToEarn = Math.floor(totalPrice / 10);

  const dates = [
    { label: 'Today', sub: '24 Oct' },
    { label: 'Tomorrow', sub: '25 Oct' },
    { label: 'Saturday', sub: '26 Oct' },
    { label: 'Sunday', sub: '27 Oct' },
    { label: 'Monday', sub: '28 Oct' },
  ];

  const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

  // Handle Request Appointment Submission
  // CRITICAL REQUIREMENT: Verify if the user is logged in, and if not, direct user to the login page!
  const handleConfirm = () => {
    if (!isLoggedIn) {
      onClose();
      onNavigateToLogin();
      return;
    }

    const reference = `STZ-${Math.floor(1000 + Math.random() * 9000)}-${provider.city.slice(0, 3).toUpperCase()}`;
    const newBooking: Booking = {
      id: `BK-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      providerAvatar: provider.avatar,
      providerSuburb: `${provider.suburb}, ${provider.city}`,
      serviceId: currentService.id,
      serviceName: currentService.name,
      servicePrice: totalPrice,
      date: `${selectedDate}, ${selectedTime}`,
      time: `${selectedTime} (${currentService.duration})`,
      status: 'pending',
      serviceType,
      address: serviceType === 'mobile' ? clientAddress : provider.address,
      referenceCode: reference,
      bookedAt: 'Just now',
      notes: notes || undefined
    };

    setCreatedBooking(newBooking);
    onBookingConfirmed(newBooking);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsReviewSubmitted(false);
    onClose();
  };

  // Toggle quick review attribute tags
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Handle Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReviewBooking) return;
    if (rating === 0) return;

    let finalReviewText = reviewText.trim();
    if (selectedTags.length > 0) {
      const tagsSummary = `Praised for: ${selectedTags.join(', ')}`;
      finalReviewText = finalReviewText
        ? `${finalReviewText}\n\n${tagsSummary}`
        : tagsSummary;
    }

    if (onSaveReview) {
      onSaveReview(targetReviewBooking.id, rating, finalReviewText);
    }
    setIsReviewSubmitted(true);
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return '5.0 — Outstanding • Exceptional Luxury Standard';
      case 4:
        return '4.0 — Great • High Quality & Very Satisfied';
      case 3:
        return '3.0 — Good • Satisfactory Standard';
      case 2:
        return '2.0 — Fair • Room for Improvement';
      case 1:
        return '1.0 — Poor • Unsatisfactory Experience';
      default:
        return 'Select a Star Rating (1 to 5)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-[#fcf9f4] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e5e0d8] animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* REVIEW SUBMITTED SUCCESS STATE */}
        {activeTab === 'review' && isReviewSubmitted && targetReviewBooking ? (
          <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[36px]">grade</span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#b86b86]">
                Verified Review Stored
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#26152d] mt-1">
                Thank You for Your Feedback!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                Your rating has been permanently recorded in your booking history and published to {targetReviewBooking.providerName}’s public trust profile.
              </p>
            </div>

            {/* Review Snapshot Card */}
            <div className="bg-white rounded-xl p-4 border border-[#e5e0d8] text-left text-xs space-y-2 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede6]">
                <span className="font-bold text-[#26152d]">{targetReviewBooking.serviceName}</span>
                <span className="flex items-center text-amber-600 font-bold">
                  ★ {rating}.0
                </span>
              </div>
              <p className="text-stone-700 italic text-[11px] leading-relaxed">
                "{reviewText || 'High-quality service matching STENZA standards.'}"
              </p>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedTags.map((t) => (
                    <span key={t} className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleResetAndClose();
                  onNavigateToBookings();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#695684] text-white font-semibold text-xs hover:bg-[#584572] transition-colors shadow-sm cursor-pointer"
              >
                Back to My Bookings
              </button>
              <button
                onClick={handleResetAndClose}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-200 text-stone-800 font-semibold text-xs hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : activeTab === 'review' && targetReviewBooking ? (
          /* REVIEW & RATING FORM FOR COMPLETED SERVICE */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e0d8]">
              <div className="flex items-center gap-3">
                <img
                  src={targetReviewBooking.providerAvatar}
                  alt={targetReviewBooking.providerName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#b86b86]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#26152d]">
                      Rate Your Service
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {targetReviewBooking.providerName} • {targetReviewBooking.serviceName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ebe8e3] text-gray-500 transition-colors cursor-pointer"
                aria-label="Close review modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Review Form Body */}
            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4 max-h-[68vh] overflow-y-auto pr-1">
              {/* Service Receipt Micro-banner */}
              <div className="p-3 bg-[#f6f3ee] rounded-xl border border-[#e5e0d8] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Appointment Reference</span>
                  <span className="font-mono font-bold text-[#26152d]">{targetReviewBooking.referenceCode}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Date Completed</span>
                  <span className="font-semibold text-[#695684]">{targetReviewBooking.date}</span>
                </div>
              </div>

              {/* Star Rating Section */}
              <div className="text-center py-2 bg-white rounded-xl border border-[#e5e0d8] p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Overall Rating
                </label>

                {/* 5-Star Interactive Selector */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled = (hoverRating || rating) >= starValue;
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 sm:p-2 transition-transform hover:scale-115 focus:outline-hidden cursor-pointer"
                        title={`${starValue} Stars`}
                      >
                        <span 
                          className={`material-symbols-outlined text-[36px] sm:text-[42px] transition-colors ${
                            isFilled ? 'text-amber-400 fill-current' : 'text-stone-300'
                          }`}
                        >
                          star
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-bold text-stone-800">
                  {getRatingLabel(hoverRating || rating)}
                </div>
              </div>

              {/* Quick Attribute Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  What did the artisan do well? (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REVIEW_ATTRIBUTES.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer flex items-center gap-1 ${
                          active
                            ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        {active && <span>✓</span>}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Written Feedback Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#26152d]">
                    Written Feedback & Experience Details
                  </label>
                  <span className="text-[10px] text-gray-500">
                    {reviewText.length} characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about the technician’s precision, cleanliness of the studio, gentleness, and how pleased you are with the final result..."
                  className="w-full p-3 rounded-xl bg-white border border-[#d8d3ca] text-xs text-[#26152d] focus:border-[#b86b86] outline-none leading-relaxed"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  * All reviews are verified against confirmed STENZA Escrow appointments to maintain zero fake reviews.
                </p>
              </div>

              {/* Submit Review Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={rating === 0}
                  className="w-full py-3.5 rounded-xl bg-[#b86b86] hover:bg-[#a25974] disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Submit Verified Review & Rating</span>
                </button>
              </div>
            </form>
          </div>
        ) : isSuccess && createdBooking ? (
          /* BOOKING DISPATCHED SUCCESS STATE */
          <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#695684]">
                Booking Request Dispatched
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#26152d] mt-1">
                You’re Almost Set!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                {provider.name} has been notified via instant WhatsApp & STENZA artisan dispatch. They typically confirm within 15 minutes.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e5e0d8] text-left text-xs space-y-2.5 shadow-2xs">
              <div className="flex justify-between pb-2 border-b border-[#f0ede6]">
                <span className="text-gray-500">Booking Reference</span>
                <span className="font-mono font-bold text-[#26152d]">{createdBooking.referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-[#26152d]">{createdBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Artisan / Studio</span>
                <span className="font-medium text-[#26152d]">{provider.name} ({provider.suburb})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time</span>
                <span className="font-medium text-[#695684]">{createdBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Appointment Type</span>
                <span className="font-medium text-[#26152d] capitalize">{createdBooking.serviceType}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#f0ede6] text-sm">
                <span className="font-bold text-[#26152d]">Total (ZAR Escrow)</span>
                <span className="font-bold text-[#695684]">R{createdBooking.servicePrice}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleResetAndClose();
                  onNavigateToBookings();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#695684] text-white font-semibold text-xs hover:bg-[#584572] transition-colors shadow-sm cursor-pointer"
              >
                View in My Bookings
              </button>
              <a
                href={`https://wa.me/27824591084?text=Hi%20${provider.founder},%20I%20just%20submitted%20booking%20${createdBooking.referenceCode}%20via%20STENZA%20Beauty!`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                WhatsApp Concierge
              </a>
            </div>
          </div>
        ) : (
          /* STANDARD APPOINTMENT REQUEST FORM */
          <div>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e0d8]">
              <div className="flex items-center gap-3">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#695684]"
                />
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#26152d]">
                    Book with {provider.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center text-amber-600 font-semibold">
                      ★ {provider.rating}
                    </span>
                    <span>•</span>
                    <span>{provider.suburb}, {provider.city}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ebe8e3] text-gray-500 transition-colors cursor-pointer"
                aria-label="Close booking modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Quick Switch to Rate Completed Service if user has eligible bookings */}
            {completedBookings.length > 0 && (
              <div className="mt-3 p-2 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
                <span className="text-amber-900 font-medium text-[11px]">
                  Have a completed appointment to review?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTargetReviewBooking(completedBookings[0]);
                    setActiveTab('review');
                  }}
                  className="text-[#b86b86] font-bold hover:underline text-[11px] cursor-pointer"
                >
                  Rate Completed Service →
                </button>
              </div>
            )}

            {/* Content Form */}
            <div className="mt-4 space-y-4 max-h-[64vh] overflow-y-auto pr-1">
              {/* Studio Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  Select Provider / Studio
                </label>
                <select
                  value={providerId}
                  onChange={(e) => {
                    setProviderId(e.target.value);
                    const newP = PROVIDERS.find((p) => p.id === e.target.value);
                    if (newP && newP.services[0]) {
                      setSelectedServiceId(newP.services[0].id);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#d8d3ca] text-xs font-medium text-[#26152d] focus:border-[#695684] outline-none"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.suburb}, {p.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  Select Treatment
                </label>
                <div className="space-y-2">
                  {provider.services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedServiceId === service.id
                          ? 'border-[#695684] bg-[#695684]/5 font-medium shadow-2xs'
                          : 'border-[#e5e0d8] bg-white hover:border-[#b9a3d6]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-[#26152d]">{service.name}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {service.duration} • {service.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#695684] text-sm">R{service.price}</div>
                        {service.popular && (
                          <span className="text-[9px] bg-[#695684] text-white px-1.5 py-0.2 rounded font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-Studio vs Mobile Toggle */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  Appointment Location
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType('in-studio')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      serviceType === 'in-studio'
                        ? 'border-[#695684] bg-[#695684] text-white shadow-xs'
                        : 'border-[#e5e0d8] bg-white text-[#26152d] hover:bg-stone-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">storefront</span>
                    <span>In-Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (provider.offersMobile) {
                        setServiceType('mobile');
                      }
                    }}
                    disabled={!provider.offersMobile}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      !provider.offersMobile
                        ? 'opacity-50 cursor-not-allowed border-dashed bg-gray-100 text-gray-400'
                        : serviceType === 'mobile'
                        ? 'border-[#695684] bg-[#695684] text-white shadow-xs'
                        : 'border-[#e5e0d8] bg-white text-[#26152d] hover:bg-stone-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">directions_car</span>
                    <span>House Call (+R{provider.travelFee || 150})</span>
                  </button>
                </div>
                {!provider.offersMobile && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    * This artisan currently offers appointments at their studio suite only.
                  </p>
                )}
              </div>

              {/* Mobile Address Input */}
              {serviceType === 'mobile' && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1.5">
                  <label className="block text-xs font-semibold text-amber-900">
                    Your Address for Mobile House Call
                  </label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Enter full street address, apartment/estate, suburb..."
                    className="w-full p-2.5 rounded-lg bg-white border border-amber-300 text-xs text-[#26152d] focus:border-[#695684] outline-none"
                  />
                  <span className="text-[10px] text-amber-800 block">
                    Vetted artisan will arrive 10 minutes prior with sanitized professional setup.
                  </span>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  Select Date
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {dates.map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setSelectedDate(`${d.label}, ${d.sub}`)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedDate.startsWith(d.label)
                          ? 'border-[#695684] bg-[#695684] text-white shadow-xs'
                          : 'border-[#e5e0d8] bg-white text-[#26152d] hover:border-[#695684]'
                      }`}
                    >
                      <div className="text-[10px] font-semibold opacity-80">{d.label}</div>
                      <div className="text-xs font-bold mt-0.5">{d.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  Available Working Hours Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 px-1 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selectedTime === t
                          ? 'border-[#695684] bg-[#695684] text-white shadow-2xs'
                          : 'border-[#e5e0d8] bg-white text-[#26152d] hover:border-[#695684]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#26152d] mb-1.5">
                  Special Notes or Allergies (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Prefer chrome finish or sensitive skin considerations..."
                  className="w-full p-2.5 rounded-xl bg-white border border-[#d8d3ca] text-xs text-[#26152d] focus:border-[#695684] outline-none"
                />
              </div>

              {/* Cost Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#f6f3ee] border border-[#e5e0d8] space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{currentService?.name || 'Treatment'}</span>
                  <span>R{currentService?.price || 0}</span>
                </div>
                {serviceType === 'mobile' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Mobile Artisan Travel Fee</span>
                    <span>R{travelFee}</span>
                  </div>
                )}
                {preselectedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Applied Loyalty Discount Voucher</span>
                    <span>-R{preselectedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-700 text-[11px]">
                  <span>STENZA ZAR Escrow Guarantee</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-amber-700 text-[11px] font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">diamond</span>
                    <span>Loyalty Points to Earn Upon Completion</span>
                  </span>
                  <span>+{pointsToEarn} pts</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#d8d3ca] font-bold text-sm text-[#26152d]">
                  <span>Total Amount</span>
                  <span className="text-[#695684]">R{totalPrice}</span>
                </div>
              </div>

              {/* Not Logged In Warning Banner */}
              {!isLoggedIn && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">lock</span>
                  <span>
                    You are currently not signed in. Pressing <strong>Request Appointment</strong> will direct you to the login page to confirm and protect your booking.
                  </span>
                </div>
              )}
            </div>

            {/* Submit Action: Request Appointment Button */}
            <div className="mt-5 pt-3 border-t border-[#e5e0d8]">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-3.5 rounded-xl bg-[#695684] hover:bg-[#584572] text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Request Appointment • R{totalPrice} (Escrow Protected)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
