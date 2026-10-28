import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Tag, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Info, 
  Building, 
  ArrowRight, 
  Percent, 
  Flame, 
  Store,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { StudioPromotion } from '../types/admin';

interface UpdatesAndOffersViewProps {
  onNavigate: (view: string, providerId?: string) => void;
  onOpenBookingModal: (providerId?: string, serviceId?: string) => void;
}

export const UpdatesAndOffersView: React.FC<UpdatesAndOffersViewProps> = ({
  onNavigate,
  onOpenBookingModal,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'special_offers' | 'new_studios' | 'ending_soon' | 'latest_updates'>('all');
  const [expandedTermsId, setExpandedTermsId] = useState<string | null>(null);

  // Fetch only published, approved, and unexpired promotions from eligible studios
  const promotions = useMemo(() => {
    return adminService.getPromotions(false);
  }, []);

  // Filtered by section
  const newStudiosPromos = useMemo(() => {
    return promotions.filter((p) => p.section === 'new_studios');
  }, [promotions]);

  const specialOffersPromos = useMemo(() => {
    return promotions.filter((p) => p.section === 'special_offers');
  }, [promotions]);

  const latestUpdatesPromos = useMemo(() => {
    return promotions.filter((p) => p.section === 'latest_updates');
  }, [promotions]);

  const endingSoonPromos = useMemo(() => {
    return promotions.filter((p) => p.section === 'ending_soon');
  }, [promotions]);

  // Format date helper (e.g. 2026-11-20 -> 20 Nov 2026)
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const renderPromotionCard = (promo: StudioPromotion) => {
    const isTermsOpen = expandedTermsId === promo.id;

    return (
      <div 
        key={promo.id}
        className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          {/* Card Image Banner with Discount Badge */}
          <div className="relative h-44 sm:h-48 overflow-hidden bg-stone-100">
            <img 
              src={promo.studioImage} 
              alt={promo.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-lg bg-[#b86b86] text-white text-[11px] font-bold shadow-sm tracking-wide">
                {promo.discountBadge}
              </span>
            </div>

            {/* Studio Name chip */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <button 
                type="button"
                onClick={() => onNavigate('profile', promo.studioId)}
                className="font-serif font-bold text-sm hover:underline flex items-center gap-1.5 cursor-pointer text-left"
              >
                <span>{promo.studioName}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-stone-200">
                {promo.studioCategory}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 space-y-3">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#1b0d21] leading-snug">
                {promo.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                {promo.shortDescription}
              </p>
            </div>

            {/* Price block if available */}
            {(promo.promotionalPrice !== undefined || promo.originalPrice !== undefined) && (
              <div className="flex items-baseline gap-2 pt-1 border-t border-stone-100">
                {promo.promotionalPrice !== undefined && (
                  <span className="font-serif text-lg font-bold text-[#b86b86]">
                    R{promo.promotionalPrice}
                  </span>
                )}
                {promo.originalPrice !== undefined && promo.originalPrice > (promo.promotionalPrice || 0) && (
                  <span className="text-xs text-stone-400 line-through">
                    R{promo.originalPrice}
                  </span>
                )}
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium ml-auto">
                  Limited offer
                </span>
              </div>
            )}

            {/* Validity Dates */}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 bg-stone-50 p-2 rounded-xl border border-stone-100">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Valid: <strong className="text-stone-700">{formatDate(promo.startDate)}</strong> – <strong className="text-stone-700">{formatDate(promo.expiryDate)}</strong></span>
            </div>

            {/* Terms and conditions toggle */}
            {promo.termsAndConditions && (
              <div className="text-xs">
                <button
                  type="button"
                  onClick={() => setExpandedTermsId(isTermsOpen ? null : promo.id)}
                  className="text-[11px] font-semibold text-[#b86b86] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                  <span>{isTermsOpen ? 'Hide terms' : 'View terms & conditions'}</span>
                </button>
                {isTermsOpen && (
                  <div className="mt-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 leading-relaxed animate-in fade-in duration-150">
                    {promo.termsAndConditions}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onNavigate('profile', promo.studioId)}
            className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition cursor-pointer text-center"
          >
            View studio
          </button>
          <button
            type="button"
            onClick={() => onOpenBookingModal(promo.studioId, promo.serviceId)}
            className="w-full py-2 px-3 rounded-xl bg-[#b86b86] hover:bg-[#a25974] text-white text-xs font-bold transition shadow-xs cursor-pointer text-center"
          >
            Book now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-[#1b0d21] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg border border-stone-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/15 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Updates & Special Offers</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Offers, New Studios & Updates
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Discover limited-time promotions, new partner studios, and verified discounts across Johannesburg, Cape Town, and Durban.
          </p>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-radial from-[#b86b86]/30 to-transparent rounded-full pointer-events-none" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200">
        {[
          { id: 'all', label: `All Offers (${promotions.length})` },
          { id: 'special_offers', label: `Special Offers (${specialOffersPromos.length})` },
          { id: 'new_studios', label: `New Studios (${newStudiosPromos.length})` },
          { id: 'ending_soon', label: `Ending Soon (${endingSoonPromos.length})` },
          { id: 'latest_updates', label: `Studio Updates (${latestUpdatesPromos.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-[#1b0d21] text-white shadow-xs font-bold'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* When no promotions exist at all */}
      {promotions.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Tag className="w-6 h-6 text-stone-400" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1b0d21]">
            No current promotions available
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Studios publish new discounts and seasonal packages regularly. Check back soon or explore our verified salons.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('discover')}
            className="py-2.5 px-5 rounded-xl bg-[#b86b86] text-white text-xs font-bold hover:bg-[#a25974] transition cursor-pointer shadow-xs"
          >
            Find a studio
          </button>
        </div>
      )}

      {/* SECTION 1: PROMOTIONS ENDING SOON */}
      {(selectedFilter === 'all' || selectedFilter === 'ending_soon') && endingSoonPromos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1b0d21]">
                  Promotions Ending Soon
                </h2>
                <p className="text-xs text-stone-500">Limited-time flash specials expiring in the next few days</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endingSoonPromos.map(renderPromotionCard)}
          </div>
        </div>
      )}

      {/* SECTION 2: SPECIAL OFFERS AND DISCOUNTS */}
      {(selectedFilter === 'all' || selectedFilter === 'special_offers') && specialOffersPromos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pink-100 text-[#b86b86] flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1b0d21]">
                  Special Offers & Discounts
                </h2>
                <p className="text-xs text-stone-500">Exclusive member savings on signature treatments</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialOffersPromos.map(renderPromotionCard)}
          </div>
        </div>
      )}

      {/* SECTION 3: NEW STUDIOS */}
      {(selectedFilter === 'all' || selectedFilter === 'new_studios') && newStudiosPromos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1b0d21]">
                  New Studios on STENZA
                </h2>
                <p className="text-xs text-stone-500">Welcome packages and introductory rates from newly approved studios</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newStudiosPromos.map(renderPromotionCard)}
          </div>
        </div>
      )}

      {/* SECTION 4: LATEST STUDIO UPDATES */}
      {(selectedFilter === 'all' || selectedFilter === 'latest_updates') && latestUpdatesPromos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1b0d21]">
                  Latest Studio Updates
                </h2>
                <p className="text-xs text-stone-500">New service launches, house-call schedules, and studio notices</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestUpdatesPromos.map(renderPromotionCard)}
          </div>
        </div>
      )}

      {/* Empty state for specific sub-filter if no matches */}
      {selectedFilter !== 'all' && promotions.filter(p => p.section === selectedFilter).length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-2">
          <Info className="w-6 h-6 text-stone-400 mx-auto" />
          <h4 className="font-serif text-base font-bold text-[#1b0d21]">
            No offers in this section right now
          </h4>
          <p className="text-xs text-stone-500">
            Switch to All Offers to see current verified deals across all categories.
          </p>
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className="py-1.5 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
          >
            View all offers
          </button>
        </div>
      )}
    </div>
  );
};
