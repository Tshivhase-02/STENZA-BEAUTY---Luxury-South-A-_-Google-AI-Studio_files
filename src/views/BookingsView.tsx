import React, { useState, useEffect } from 'react';
import { Booking } from '../data/beautyData';
import { calculateLoyaltySummary } from '../data/loyaltyData';
import { adminService } from '../services/adminService';
import { StudioReport, ReportStatus } from '../types/admin';
import { ReportStudioModal } from '../components/ReportStudioModal';
import { 
  Flag, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  Lock, 
  Calendar, 
  Info,
  Building,
  Check,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

interface BookingsViewProps {
  bookings: Booking[];
  onNavigate: (view: string, providerId?: string) => void;
  onOpenBookingModal: (providerId?: string, serviceId?: string) => void;
  onOpenReviewModal?: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  redeemedPoints: number;
  onOpenLoyaltyModal: () => void;
  isLoggedIn?: boolean;
  currentUserName?: string;
  currentUserEmail?: string;
  currentUserId?: string;
  onRequireLogin?: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onNavigate,
  onOpenBookingModal,
  onOpenReviewModal,
  onCancelBooking,
  redeemedPoints,
  onOpenLoyaltyModal,
  isLoggedIn = true,
  currentUserName = 'Naledi Mokwena',
  currentUserEmail = 'naledi.mokwena@stenzabeauty.co.za',
  currentUserId = 'usr-client-01',
  onRequireLogin,
}) => {
  // Main view section: Appointments vs Customer Reports Tracker
  const [activeMainSection, setActiveMainSection] = useState<'appointments' | 'reports'>('appointments');

  // Bookings sub-filter
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'pending' | 'completed' | 'cancelled'>('all');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Reports sub-filter & state
  const [reportFilterTab, setReportFilterTab] = useState<'all' | 'active' | 'resolved' | 'dismissed'>('all');
  const [customerReports, setCustomerReports] = useState<StudioReport[]>([]);
  const [reportingTarget, setReportingTarget] = useState<{ studioId: string; studioName: string; bookingRef?: string } | null>(null);

  // Load customer's own reports (strictly isolated by currentUserEmail or currentUserId)
  useEffect(() => {
    const reports = adminService.getCustomerReports(currentUserEmail);
    setCustomerReports(reports);
  }, [currentUserEmail, activeMainSection]);

  const refreshCustomerReports = () => {
    const updated = adminService.getCustomerReports(currentUserEmail);
    setCustomerReports(updated);
  };

  const loyaltySummary = calculateLoyaltySummary(bookings, redeemedPoints);

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'all') return true;
    return b.status === filterTab;
  });

  const filteredReports = customerReports.filter((r) => {
    if (reportFilterTab === 'all') return true;
    if (reportFilterTab === 'active') return r.status === 'OPEN' || r.status === 'UNDER_REVIEW';
    if (reportFilterTab === 'resolved') return r.status === 'RESOLVED';
    if (reportFilterTab === 'dismissed') return r.status === 'DISMISSED';
    return true;
  });

  const handleCancelConfirm = (id: string) => {
    onCancelBooking(id);
    setCancellingBookingId(null);
    setFeedbackToast('Booking cancelled successfully. Escrow funds refunded immediately.');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleAddToCalendar = (booking: Booking) => {
    setFeedbackToast(`Added "${booking.serviceName}" to Google Calendar.`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'OPEN':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Submitted — Pending Review',
          icon: Clock
        };
      case 'UNDER_REVIEW':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'Under Active Investigation',
          icon: AlertTriangle
        };
      case 'RESOLVED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'Resolved by Moderation',
          icon: CheckCircle2
        };
      case 'DISMISSED':
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          label: 'Dismissed',
          icon: Info
        };
      default:
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          label: status,
          icon: Info
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-24 right-4 z-50 bg-[#26152d] text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[#695684] animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Client Header Card with Loyalty Summary & Section Switcher */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoBMuyv1m3ZJeonXSXPwSf9fXxjbLsXmfygfObrLMx9cB8CIEn-BPGAUAazFtUHgteMW0-h8xYzh1AvlcYd_Ht8n1wANl4VfUq9Qdf2gCVXKfusgS_BInruAJ2lTrInOCFiexMWfMOu4fTEQB2L5YKlWabC-Jnmvs_5wwrtmlyi2-hbSnAZA2EmQOnAV1OdT6qRdZig0y_Cn7Ui-BU741im3hnDMoJeS4IbH2z-XSG-rpKSkgP-w_r"
              alt={currentUserName}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#695684] shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
                Welcome back, {currentUserName.split(' ')[0]}
              </h1>
              <span className="text-[10px] font-bold bg-[#f6d9fb] text-[#39263f] px-2 py-0.5 rounded-full">
                {loyaltySummary.tier}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Sandton Central, Johannesburg • Verified Client ({currentUserEmail})
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs">
              <span className="text-gray-600">
                <strong className="text-[#695684]">{bookings.filter(b => b.status === 'completed').length}</strong> Treatments Completed
              </span>
              <span className="text-gray-300">•</span>
              <button
                onClick={onOpenLoyaltyModal}
                className="flex items-center gap-1 text-[#695684] font-bold hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-500">diamond</span>
                <span>{loyaltySummary.totalPointsEarned} Total Loyalty Points</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenLoyaltyModal}
            className="py-3 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-600">diamond</span>
            <span>Rewards: {loyaltySummary.availablePoints} pts</span>
          </button>
          <button
            onClick={() => onOpenBookingModal()}
            className="py-3 px-5 rounded-xl bg-[#695684] hover:bg-[#584572] text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Primary Section Switcher: Appointments vs Customer Reports Tracker */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-stone-100/90 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMainSection('appointments')}
            className={`flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMainSection === 'appointments'
                ? 'bg-[#1b0d21] text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <span>My Appointments ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainSection('reports');
              refreshCustomerReports();
            }}
            className={`flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer relative ${
              activeMainSection === 'reports'
                ? 'bg-[#1b0d21] text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Flag className="w-4 h-4 text-rose-400" />
            <span>My Reports & Inquiries</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeMainSection === 'reports' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800'
            }`}>
              {customerReports.length}
            </span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] text-stone-500 pr-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>POPIA Act 4 of 2013 Protected • Confidential Client Privacy</span>
        </div>
      </div>

      {/* SECTION 1: MY APPOINTMENTS */}
      {activeMainSection === 'appointments' && (
        <div className="space-y-6">
          {/* Loyalty Points Banner */}
          <div 
            onClick={onOpenLoyaltyModal}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#26152d] via-[#39263f] to-[#695684] text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-serif">STENZA Loyalty Program</span>
                  <span className="text-[10px] bg-amber-400 text-[#26152d] font-bold px-2 py-0.2 rounded-full">
                    {loyaltySummary.tier}
                  </span>
                </div>
                <p className="text-xs text-stone-200 mt-0.5">
                  You have earned <strong className="text-white">{loyaltySummary.totalPointsEarned} points</strong> from completed treatments across South Africa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#f6d9fb]">
              <span>View Rewards & Vouchers</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>

          {/* Main Grid: Bookings + Support Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Bookings with Status Tabs */}
            <div className="lg:col-span-8 space-y-6">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#e5e0d8]">
                {[
                  { id: 'all', label: 'All Bookings', count: bookings.length },
                  { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => b.status === 'upcoming').length },
                  { id: 'pending', label: 'Pending Confirmation', count: bookings.filter(b => b.status === 'pending').length },
                  { id: 'completed', label: 'Completed History', count: bookings.filter(b => b.status === 'completed').length },
                  { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id as any)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      filterTab === tab.id
                        ? 'bg-[#695684] text-white shadow-xs'
                        : 'text-gray-600 hover:bg-[#f6f3ee] hover:text-[#26152d]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      filterTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#e5e0d8] text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bookings List */}
              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#e5e0d8] space-y-3">
                  <span className="material-symbols-outlined text-gray-300 text-[48px]">
                    event_busy
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#26152d]">
                    No bookings in this tab
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Ready to pamper yourself? Explore verified studios in Sandton, Rosebank, and Camps Bay.
                  </p>
                  <button
                    onClick={() => onNavigate('discover')}
                    className="py-2 px-4 rounded-xl bg-[#695684] text-white text-xs font-semibold hover:bg-[#584572] cursor-pointer"
                  >
                    Discover Salons
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((b) => {
                    const bookingPoints = Math.floor(b.servicePrice / 10);
                    return (
                      <div
                        key={b.id}
                        className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-2xs space-y-4 ${
                          b.status === 'pending'
                            ? 'border-amber-300 ring-1 ring-amber-200/50'
                            : b.status === 'upcoming'
                            ? 'border-[#695684]/40 ring-1 ring-[#695684]/20'
                            : 'border-[#e5e0d8]'
                        }`}
                      >
                        {/* Top Status & Ref */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#f0ede6]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-gray-500">
                              REF: {b.referenceCode}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[11px] text-gray-500 capitalize">
                              {b.serviceType} Treatment
                            </span>
                          </div>

                          <div>
                            {b.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Pending Studio Confirmation
                              </span>
                            )}
                            {b.status === 'upcoming' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Confirmed Appointment
                              </span>
                            )}
                            {b.status === 'completed' && (
                              <span className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px] text-emerald-600">check</span>
                                <span>Completed (+{bookingPoints} pts)</span>
                              </span>
                            )}
                            {b.status === 'cancelled' && (
                              <span className="text-[11px] font-semibold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
                                Cancelled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Body Content */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={b.providerAvatar}
                              alt={b.providerName}
                              className="w-14 h-14 rounded-xl object-cover border border-[#e5e0d8] flex-shrink-0"
                            />
                            <div>
                              <h3 className="font-serif text-base font-bold text-[#26152d]">
                                {b.serviceName}
                              </h3>
                              <p 
                                onClick={() => onNavigate('profile', b.providerId)}
                                className="text-xs text-[#695684] hover:underline font-semibold cursor-pointer"
                              >
                                {b.providerName} ({b.providerSuburb})
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                <span className="material-symbols-outlined text-[16px] text-gray-400">schedule</span>
                                <span>{b.date} • {b.time}</span>
                              </div>
                              {b.status === 'completed' && (
                                <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-semibold">
                                  <span className="material-symbols-outlined text-[13px]">diamond</span>
                                  <span>Earned {bookingPoints} STENZA Loyalty Points</span>
                                </div>
                              )}
                              {b.notes && (
                                <p className="text-[11px] text-gray-500 mt-1 italic">
                                  Note: "{b.notes}"
                                </p>
                              )}

                              {/* Completed Booking Review Card / Prompt */}
                              {b.status === 'completed' && (
                                <div className="mt-2.5">
                                  {b.rating ? (
                                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 font-bold text-amber-900">
                                          <span className="flex text-amber-500">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <span key={star} className="material-symbols-outlined text-[15px] text-amber-500">
                                                {star <= (b.rating || 5) ? 'star' : 'star_border'}
                                              </span>
                                            ))}
                                          </span>
                                          <span className="ml-1 text-[11px] font-bold text-amber-950">
                                            {b.rating}.0 • Verified Client Feedback
                                          </span>
                                        </div>
                                        {b.reviewedAt && (
                                          <span className="text-[10px] text-stone-500 font-medium">{b.reviewedAt}</span>
                                        )}
                                      </div>
                                      {b.review && (
                                        <p className="text-stone-700 italic text-[11px] leading-relaxed">
                                          "{b.review}"
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-200/90 text-xs flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2 text-stone-700 text-[11px]">
                                        <span className="material-symbols-outlined text-[18px] text-[#b86b86]">rate_review</span>
                                        <span>How was your treatment? Leave a star rating & written feedback for {b.providerName}.</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => onOpenReviewModal?.(b)}
                                        className="py-1 px-3 rounded-lg bg-[#b86b86] hover:bg-[#a25974] text-white text-[11px] font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
                                      >
                                        Rate & Review
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#f0ede6]">
                            <div className="text-[10px] uppercase font-bold text-gray-500">ZAR Escrow Total</div>
                            <div className="font-serif text-xl font-bold text-[#26152d]">
                              R{b.servicePrice}
                            </div>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-stone-100">
                          <div className="text-gray-500 text-[11px]">
                            Location: <strong className="text-gray-700">{b.address}</strong>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Report Concern for this booking (All statuses) */}
                            <button
                              type="button"
                              onClick={() => setReportingTarget({
                                studioId: b.providerId,
                                studioName: b.providerName,
                                bookingRef: b.referenceCode
                              })}
                              className="py-1.5 px-2.5 rounded-lg border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              title="Report pricing, hygiene, or conduct concern for this booking"
                            >
                              <Flag className="w-3.5 h-3.5" />
                              <span>Report Concern</span>
                            </button>

                            {b.status === 'pending' && (
                              <>
                                <a
                                  href={`https://wa.me/27824591084?text=Hi,%20I'm%20inquiring%20about%20my%20pending%20STENZA%20booking%20${b.referenceCode}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[14px]">chat</span>
                                  <span>WhatsApp Studio</span>
                                </a>

                                <button
                                  onClick={() => setCancellingBookingId(b.id)}
                                  className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                                >
                                  Cancel Request
                                </button>
                              </>
                            )}

                            {b.status === 'upcoming' && (
                              <>
                                <button
                                  onClick={() => handleAddToCalendar(b)}
                                  className="py-1.5 px-3 rounded-lg bg-[#f6f3ee] hover:bg-[#ebe8e3] text-[#26152d] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px]">event</span>
                                  <span>Add to Calendar</span>
                                </button>

                                <a
                                  href={`https://wa.me/27824591084?text=Hi,%20confirming%20my%20confirmed%20appointment%20${b.referenceCode}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[14px]">chat</span>
                                  <span>WhatsApp</span>
                                </a>

                                <button
                                  onClick={() => setCancellingBookingId(b.id)}
                                  className="py-1.5 px-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer"
                                >
                                  Reschedule / Cancel
                                </button>
                              </>
                            )}

                            {b.status === 'completed' && (
                              <div className="flex flex-wrap items-center gap-2">
                                {b.rating ? (
                                  <button
                                    onClick={() => onOpenReviewModal?.(b)}
                                    className="py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[14px] text-amber-600">edit_note</span>
                                    <span>Edit Review (★{b.rating})</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => onOpenReviewModal?.(b)}
                                    className="py-1.5 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[15px] text-amber-600">star</span>
                                    <span>Rate & Review Service</span>
                                  </button>
                                )}

                                <button
                                  onClick={onOpenLoyaltyModal}
                                  className="py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px] text-amber-600">diamond</span>
                                  <span>+{bookingPoints} pts earned</span>
                                </button>

                                <button
                                  onClick={() => onOpenBookingModal(b.providerId, b.serviceId)}
                                  className="py-1.5 px-3.5 rounded-lg bg-[#695684] hover:bg-[#584572] text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px]">replay</span>
                                  <span>Rebook Treatment</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Support & Concierge Hotline */}
            <div className="lg:col-span-4 space-y-6">
              {/* Direct Concierge Box */}
              <div className="bg-[#26152d] text-white p-6 rounded-3xl shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">support_agent</span>
                  <h3 className="font-serif text-lg font-bold">STENZA Concierge Desk</h3>
                </div>
                <p className="text-xs text-[#cfc7bc] leading-relaxed">
                  Need to coordinate multiple appointments, group bridal glam, or need urgent rescheduling? Our dedicated team is on standby.
                </p>

                <div className="space-y-2 pt-2">
                  <a
                    href="https://wa.me/27824591084?text=Hi%20STENZA%20Concierge,%20I%20need%20help%20with%20my%20account"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>WhatsApp: +27 82 459 1084</span>
                  </a>

                  <a
                    href="tel:+27118849000"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/20"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    <span>Call Hotline: +27 11 884 9000</span>
                  </a>
                </div>

                <div className="pt-2 text-[10px] text-stone-400 border-t border-[#39263f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400">verified_user</span>
                  <span>Available Monday – Sunday 07:00 – 20:00 SAST</span>
                </div>
              </div>

              {/* South African POPIA & Escrow Guarantee Box */}
              <div className="bg-white p-6 rounded-3xl border border-[#e5e0d8] shadow-2xs space-y-3 text-xs">
                <h4 className="font-serif text-sm font-bold text-[#26152d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#695684] text-[18px]">lock</span>
                  <span>Your Escrow Security</span>
                </h4>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Every booking made through STENZA holds funds in a South African compliant trust escrow account until after your treatment. If a practitioner fails to arrive, a 100% immediate refund is credited.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CUSTOMER REPORTS & MODERATION INQUIRIES TRACKER */}
      {activeMainSection === 'reports' && (
        <div className="space-y-6">
          {/* Header Banner & Privacy Guarantee */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                  CONFIDENTIAL INQUIRY TRACKER
                </span>
                <span className="text-xs text-stone-500">Only your submitted records are shown</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1b0d21]">
                Your Studio Reports & Trust Investigations
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Track real-time investigation progress, compliance team findings, and official resolution decisions for reports you lodged against partner salons.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setReportingTarget({
                  studioId: 'luxe-nail-studio',
                  studioName: 'Luxe Nail & Beauty Bar Sandton'
                })}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Submit New Report</span>
              </button>
            </div>
          </div>

          {/* Privacy & Spring Boot REST API Architecture Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="font-semibold text-amber-950">Strict Customer Isolation Guarantee:</strong> Under South African POPIA Act 4 of 2013, only reports submitted under your verified account (<code className="font-mono bg-white/70 px-1 py-0.2 rounded text-[10px]">{currentUserEmail}</code>) are retrievable. In production, this view queries <code className="font-mono font-bold">GET /api/me/reports</code> with JWT credentials; other client records are completely inaccessible.
            </div>
          </div>

          {/* Reports Status Sub-tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200">
            {[
              { id: 'all', label: 'All My Reports', count: customerReports.length },
              { id: 'active', label: 'Under Review', count: customerReports.filter(r => r.status === 'OPEN' || r.status === 'UNDER_REVIEW').length },
              { id: 'resolved', label: 'Resolved Decisions', count: customerReports.filter(r => r.status === 'RESOLVED').length },
              { id: 'dismissed', label: 'Dismissed', count: customerReports.filter(r => r.status === 'DISMISSED').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportFilterTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  reportFilterTab === tab.id
                    ? 'bg-[#1b0d21] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  reportFilterTab === tab.id ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Reports List */}
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1b0d21]">
                No reports found in this tab
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                You have no active disputes or reports in this category. STENZA Beauty monitors all listings to ensure verified pricing and quality conduct across South Africa.
              </p>
              <button
                type="button"
                onClick={() => setReportingTarget({
                  studioId: 'luxe-nail-studio',
                  studioName: 'Luxe Nail & Beauty Bar Sandton'
                })}
                className="py-2.5 px-4 rounded-xl bg-[#1b0d21] hover:bg-[#2c1437] text-white text-xs font-bold transition cursor-pointer"
              >
                File a Studio Concern
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredReports.map((report) => {
                const statusInfo = getStatusBadge(report.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={report.id}
                    className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-2xs space-y-5 transition hover:shadow-md"
                  >
                    {/* Top Row: Ref, Date, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1b0d21] bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                          {report.id}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-xs text-stone-500">
                          Submitted on {new Date(report.dateSubmitted).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {report.bookingRef && (
                          <>
                            <span className="text-stone-300">•</span>
                            <span className="text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                              Booking Ref: {report.bookingRef}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Studio & Reason Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Reported Studio</div>
                        <div className="font-serif text-base font-bold text-[#1b0d21] mt-0.5 flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-[#d4af37]" />
                          <span>{report.studioName}</span>
                        </div>
                        <span className="text-[11px] text-stone-500 font-mono">ID: {report.studioId}</span>
                      </div>

                      <div>
                        <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Report Category</div>
                        <div className="text-xs font-bold text-stone-800 mt-1 flex items-center gap-1.5">
                          <Flag className="w-3.5 h-3.5 text-rose-500" />
                          <span>{report.categoryLabel}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Booked on STENZA: <strong className="text-stone-700">{report.bookedThroughStenza ? 'Yes (Verified)' : 'No'}</strong>
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Assigned Moderator</div>
                        <div className="text-xs font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{report.assignedAdmin || 'Senior Trust & Safety Officer'}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Resolution: <strong className="text-stone-700">{report.resolutionDate ? report.resolutionDate : 'Investigation in Progress'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Customer's statement */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1.5">
                      <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Your Statement & Details</div>
                      <p className="text-stone-800 leading-relaxed italic text-xs">
                        "{report.description}"
                      </p>
                      {report.evidenceFileName && (
                        <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-600">
                          <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>Attached Evidence: <strong className="text-stone-800">{report.evidenceFileName}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Official Administrative Response / Resolution Notice */}
                    {report.customerNotification || report.decision ? (
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-emerald-100/60 border border-emerald-300 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Official STENZA Trust & Safety Resolution Notice</span>
                          </div>
                          {report.resolutionDate && (
                            <span className="text-[10px] text-emerald-800 font-mono font-medium">
                              Resolved: {report.resolutionDate}
                            </span>
                          )}
                        </div>

                        <p className="text-emerald-900 leading-relaxed text-xs">
                          {report.customerNotification || report.decision}
                        </p>

                        {report.actionTaken && (
                          <div className="pt-2 border-t border-emerald-200/80 flex items-center gap-2 text-[11px] text-emerald-950 font-medium">
                            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Administrative Action:</span>
                            <span className="font-semibold">{report.actionTaken}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs flex items-start gap-3">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-blue-900 leading-relaxed text-[11px]">
                          <strong>Investigation Ongoing:</strong> Our Trust & Safety team is reviewing salon activity logs, service agreements, and statements. You will receive an email update at <code className="font-semibold">{report.reporterEmail}</code> once our compliance board reaches a decision.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#fcf9f4] p-6 rounded-2xl max-w-sm w-full border border-[#e5e0d8] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div className="text-center">
              <h4 className="font-serif text-lg font-bold text-[#26152d]">
                Cancel this Appointment?
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Your escrow deposit will be released immediately to your payment card. This action cannot be reversed.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelConfirm(cancellingBookingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-sm cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Studio Modal */}
      {reportingTarget && (
        <ReportStudioModal
          isOpen={true}
          onClose={() => setReportingTarget(null)}
          studioId={reportingTarget.studioId}
          studioName={reportingTarget.studioName}
          bookingRefInitial={reportingTarget.bookingRef}
          isLoggedIn={isLoggedIn}
          currentUserName={currentUserName}
          currentUserEmail={currentUserEmail}
          currentUserId={currentUserId}
          onRequireLogin={onRequireLogin}
          onSuccess={() => {
            refreshCustomerReports();
            setActiveMainSection('reports');
          }}
          onViewMyReports={() => {
            setReportingTarget(null);
            refreshCustomerReports();
            setActiveMainSection('reports');
          }}
        />
      )}
    </div>
  );
};
