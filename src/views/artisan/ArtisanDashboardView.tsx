import React from 'react';
import { ArtisanApplication, StudioProfile } from '../../data/artisanWorkflowData';
import { 
  Building, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Scissors, 
  Calendar, 
  Car, 
  Eye, 
  Edit3, 
  ArrowUpRight, 
  TrendingUp, 
  Star, 
  Lock, 
  ChevronRight, 
  Users, 
  MapPin, 
  Phone, 
  Share2,
  FileText
} from 'lucide-react';

interface ArtisanDashboardViewProps {
  application: ArtisanApplication;
  studio: StudioProfile;
  onNavigate: (view: string) => void;
  onOpenAdminReview: () => void;
}

export const ArtisanDashboardView: React.FC<ArtisanDashboardViewProps> = ({
  application,
  studio,
  onNavigate,
  onOpenAdminReview,
}) => {
  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (studio.businessName) score += 15;
    if (studio.bio) score += 15;
    if (studio.logoUrl) score += 10;
    if (studio.coverUrl) score += 10;
    if (studio.gallery && studio.gallery.length > 0) score += 15;
    if (studio.services && studio.services.length > 0) score += 20;
    if (studio.operatingHours && studio.operatingHours.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const completionPercent = calculateCompletion();
  const isApproved = application.status === 'approved';

  return (
    <div className="min-h-screen bg-[#faf7f5] pb-24">
      {/* Top Header */}
      <div className="bg-[#26152d] text-white py-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#b86b86]/30 text-[#e8a3b8] border border-[#b86b86]/50 uppercase tracking-wider">
                Artisan Studio Suite
              </span>
              <span className="text-xs text-stone-400 font-mono">Ref: {application.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {studio.businessName}
            </h1>
            <p className="text-stone-300 text-sm mt-1 flex items-center gap-2">
              <span>{studio.founderName}</span> • <span>{studio.category}</span> • 
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#b86b86]" /> {studio.suburb}, {studio.city}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('studio_preview')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-pink-300" />
              <span>Studio Preview</span>
            </button>
            <button
              onClick={() => onNavigate('studio_profile_editor')}
              className="px-4 py-2.5 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4">
        {/* Dynamic Status Notification Banner */}
        {application.status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-5 mb-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-amber-900">Application Status: Pending Admin Approval</h3>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                    In Compliance Queue
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                  Your artisan credentials and documents are currently under review. While pending, you can set up your studio profile, add services, and configure house-call fees, but <strong className="font-semibold text-amber-950">public catalog publishing is locked</strong> until approved.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('application_submitted')}
                className="px-3.5 py-2 bg-white text-amber-900 border border-amber-300 rounded-xl text-xs font-bold hover:bg-amber-100/50 transition cursor-pointer"
              >
                View App Receipt
              </button>
              <button
                onClick={onOpenAdminReview}
                className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                title="Switch persona to STENZA Admin to simulate approving this application"
              >
                Simulate Admin Approval
              </button>
            </div>
          </div>
        )}

        {application.status === 'changes_requested' && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-orange-950">Action Required: Compliance Changes Requested</h3>
                <p className="text-xs sm:text-sm text-orange-900 mt-1 leading-relaxed">
                  Admin Note: <span className="italic font-medium">"{application.adminDecisionReason}"</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('artisan_registration')}
              className="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
            >
              Update Registration Info
            </button>
          </div>
        )}

        {application.status === 'approved' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-emerald-950">Artisan Accreditation Approved & Verified</h3>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                    Official STENZA Artisan
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                  Congratulations! Your studio is accredited. You can now toggle your studio status to <strong className="font-semibold text-emerald-950">Live Marketplace Active</strong> and receive bookings directly from Johannesburg and Pretoria clients.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-emerald-800">
                Studio Status: <strong className={studio.isPublished ? "text-emerald-700" : "text-stone-500"}>{studio.isPublished ? "Published (Live)" : "Draft"}</strong>
              </span>
              <button
                onClick={() => onNavigate('studio_preview')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Manage Studio Live Status
              </button>
            </div>
          </div>
        )}

        {/* Profile Completion Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#26152d]">Studio Profile Readiness</h3>
                <span className="text-xs font-bold text-[#b86b86] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                  {completionPercent}% Completed
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Complete all studio sections to rank higher on the client discovery catalog.
              </p>
            </div>
            <button
              onClick={() => onNavigate('studio_profile_editor')}
              className="text-xs font-semibold text-[#b86b86] hover:text-[#914660] flex items-center gap-1 cursor-pointer"
            >
              <span>Complete Missing Fields</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-stone-100 rounded-full h-3 mb-5 overflow-hidden">
            <div
              className="bg-linear-to-r from-[#b86b86] to-[#d4af37] h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          {/* Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Basic Business Info</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bio & Accreditations</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${studio.services.length > 0 ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span>Services Menu ({studio.services.length})</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${studio.offersHouseCalls ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span>House Calls & Hours</span>
            </div>
          </div>
        </div>

        {/* Studio Management Quick Shortcuts */}
        <div className="mb-8">
          <h2 className="text-lg font-serif font-bold text-[#26152d] mb-4">
            Studio Management Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Shortcut 1: Profile Editor */}
            <div
              onClick={() => onNavigate('studio_profile_editor')}
              className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-[#b86b86]/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#b86b86] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#b86b86] transition-colors">
                  Studio Profile Editor
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Update business name, bio, founder credentials, photo gallery, logo and social handles.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#b86b86]">
                <span>Manage Profile</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Shortcut 2: Services Management */}
            <div
              onClick={() => onNavigate('services_management')}
              className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-[#b86b86]/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Scissors className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#b86b86] transition-colors">
                  Services & Pricing
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Add, edit, deactivate and set prices in ZAR for your treatment and service offerings ({studio.services.length} items).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#b86b86]">
                <span>Manage Services</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Shortcut 3: House Calls & Availability */}
            <div
              onClick={() => onNavigate('house_calls_availability')}
              className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-[#b86b86]/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Car className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#b86b86] transition-colors">
                  House Calls & Hours
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Configure mobile travel radii, R{studio.travelFee} call-out fee, operating hours, and buffer breaks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#b86b86]">
                <span>Set Availability</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Shortcut 4: Studio Preview & Publishing */}
            <div
              onClick={() => onNavigate('studio_preview')}
              className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-[#b86b86]/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#b86b86] transition-colors">
                    Customer Preview
                  </h4>
                  {!isApproved && <Lock className="w-3.5 h-3.5 text-stone-400" />}
                </div>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  See how Johannesburg and Pretoria clients view your studio before publishing live.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#b86b86]">
                <span>{isApproved ? 'Preview & Publish' : 'Locked Preview'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Booking & Business Activity Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Booking Overview Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#26152d]">Booking Performance & Revenue</h3>
                <p className="text-xs text-stone-500">Trailing 30 days marketplace activity</p>
              </div>
              <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
                South Africa (ZAR)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <p className="text-xs text-stone-500 uppercase font-medium">Monthly Bookings</p>
                <p className="text-2xl font-bold text-stone-900 mt-1">{studio.monthlyBookings || 0}</p>
                <span className="text-[11px] text-emerald-600 font-medium">↑ 12% vs last month</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <p className="text-xs text-stone-500 uppercase font-medium">Revenue (ZAR)</p>
                <p className="text-2xl font-bold text-stone-900 mt-1">R{(studio.monthlyRevenueZAR || 0).toLocaleString()}</p>
                <span className="text-[11px] text-stone-400 font-medium">Via Paystack Escrow</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <p className="text-xs text-stone-500 uppercase font-medium">Client Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
                  <span className="text-2xl font-bold text-stone-900">{studio.averageRating}</span>
                </div>
                <span className="text-[11px] text-stone-500">{studio.reviewCount} verified reviews</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <p className="text-xs text-stone-500 uppercase font-medium">House Calls</p>
                <p className="text-2xl font-bold text-stone-900 mt-1">{studio.offersHouseCalls ? 'Active' : 'Off'}</p>
                <span className="text-[11px] text-[#b86b86] font-medium">+R{studio.travelFee} Travel Fee</span>
              </div>
            </div>

            {/* Quick tips for approved/pending artisans */}
            <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 text-xs text-stone-700 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#b86b86] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-900">Artisan Success Tip for South African Market:</p>
                <p className="text-stone-600 mt-0.5">
                  Artisans who offer mobile house-call services in Sandton, Rosebank, and Menlyn receive 40% more weekday evening bookings. Keep your service areas and travel fees updated in the House Calls module.
                </p>
              </div>
            </div>
          </div>

          {/* Verification & Compliance Status */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#26152d] mb-1">Accreditation Dossier</h3>
              <p className="text-xs text-stone-500 mb-4">Official South African documentation</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">ID Verification (SA Citizen/Permit)</span>
                  <span className="font-medium text-emerald-700">Verified ID</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">CIPC Company Status</span>
                  <span className="font-medium text-emerald-700">Enterprise Reg</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">Municipal Health & Safety</span>
                  <span className="font-medium text-emerald-700">Cleaned & Inspected</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-50">
                  <span className="text-stone-600">POPIA Act Compliance</span>
                  <span className="font-medium text-emerald-700">Enforced</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span>Compliance Officer</span>
                <span className="font-medium text-stone-800">{application.reviewedBy || 'Kagiso Molefe (Lead)'}</span>
              </div>
              <button
                onClick={onOpenAdminReview}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Open Administrative Audit Review</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
