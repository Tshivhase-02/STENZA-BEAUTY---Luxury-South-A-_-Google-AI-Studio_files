import React, { useState } from 'react';
import { CURATED_PRODUCTS, BeautyProduct, HOW_IT_WORKS_STEPS, FAQS, TRUST_PILLARS } from '../data/beautyData';

interface HowItWorksViewProps {
  onNavigate: (view: string) => void;
  onAddToCart: (product: BeautyProduct) => void;
  onOpenBookingModal: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onNavigate,
  onAddToCart,
  onOpenBookingModal
}) => {
  const [activeAudience, setActiveAudience] = useState<'client' | 'pro'>('client');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleProductAdd = (product: BeautyProduct) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="pb-24 space-y-20">
      {/* Hero Intro */}
      <section className="bg-gradient-to-b from-[#fcf9f4] via-[#f7f2ea] to-[#fcf9f4] pt-12 pb-16 border-b border-[#e5e0d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#7c535c] bg-[#f6d9fb]/60 px-3 py-1 rounded-full border border-[#b9a3d6]/50">
            The STENZA Standard
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#26152d]">
            How Mzansi Luxury Beauty Works
          </h1>
          <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
            Whether you are booking a couture BIAB set in Rosebank or scaling your independent salon business in Camps Bay, STENZA provides seamless discovery, transparent scheduling, and South African escrow security.
          </p>

          {/* Audience Switcher */}
          <div className="inline-flex rounded-full bg-white p-1.5 border border-[#e5e0d8] shadow-sm text-xs font-semibold">
            <button
              onClick={() => setActiveAudience('client')}
              className={`py-2 px-6 rounded-full transition-all ${
                activeAudience === 'client'
                  ? 'bg-[#695684] text-white shadow-xs font-bold'
                  : 'text-gray-600 hover:text-[#26152d]'
              }`}
            >
              For Discerning Clients
            </button>
            <button
              onClick={() => setActiveAudience('pro')}
              className={`py-2 px-6 rounded-full transition-all ${
                activeAudience === 'pro'
                  ? 'bg-[#695684] text-white shadow-xs font-bold'
                  : 'text-gray-600 hover:text-[#26152d]'
              }`}
            >
              For Verified Artisans
            </button>
          </div>
        </div>
      </section>

      {/* Audience Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeAudience === 'client' ? (
          <div className="space-y-12">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
                4 Steps to Flawless Pampering
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Zero phone tag. Zero awkward payments. Just effortless beauty.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS_STEPS.map((s) => (
                <div key={s.step} className="p-6 rounded-2xl bg-white border border-[#e5e0d8] relative shadow-2xs space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#f6d9fb]/40 text-[#695684] font-serif text-2xl font-bold flex items-center justify-center">
                    {s.step}
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#26152d]">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={onOpenBookingModal}
                className="py-3.5 px-8 rounded-full bg-[#695684] text-white text-xs font-semibold shadow-md hover:bg-[#584572] transition-colors"
              >
                Book Your First Appointment
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26152d]">
                The Artisan Growth Ecosystem
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Designed specifically for South African beauty entrepreneurs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: 'shield_locked',
                  title: 'Guaranteed Escrow & Zero No-Shows',
                  desc: 'Every booking requires an upfront deposit held in our South African trust account. If a client cancels last-minute, your cancellation payout is guaranteed.'
                },
                {
                  icon: 'calendar_month',
                  title: 'Automated Calendar & WhatsApp Sync',
                  desc: 'Clients receive instant WhatsApp confirmations and automated reminders with zero manual typing required from you.'
                },
                {
                  icon: 'payments',
                  title: 'Direct Weekly South African EFT Payouts',
                  desc: 'Enjoy rapid bank disbursements to FNB, Standard Bank, Nedbank, Absa, Capitec, or Investec accounts with transparent low processing fees.'
                }
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-2xl bg-white border border-[#e5e0d8] shadow-2xs space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#695684]/10 text-[#695684] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#26152d]">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => onNavigate('auth')}
                className="py-3.5 px-8 rounded-full bg-[#26152d] text-white text-xs font-semibold shadow-md hover:bg-[#39263f] transition-colors"
              >
                Apply for Verified Artisan Accreditation
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Curated South African Beauty Apothecary Shelf */}
      <section className="bg-[#f6f3ee] py-16 border-y border-[#e5e0d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#7c535c]">STENZA Apothecary</span>
              <h2 className="font-serif text-3xl font-bold text-[#26152d] mt-1">
                South African Botanical Hair & Skincare
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Formulated with indigenous wild-harvested Marula, Kalahari Melon, and Cape Chamomile.
              </p>
            </div>

            <div className="text-xs font-medium text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-full border border-emerald-300 self-start sm:self-auto flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              <span>Free Courier Delivery Over R500</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {CURATED_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-[#695684] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7c535c]">{prod.brand}</span>
                    <h4 className="font-serif text-xs font-bold text-[#26152d] line-clamp-1 mt-0.5">{prod.name}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-snug">{prod.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#f0ede6] flex items-center justify-between">
                    <div>
                      <div className="font-serif text-sm font-bold text-[#26152d]">R{prod.price}</div>
                      <div className="text-[10px] text-amber-600 font-semibold">★ {prod.rating} ({prod.reviewsCount})</div>
                    </div>

                    <button
                      onClick={() => handleProductAdd(prod)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                        addedProductId === prod.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#695684] hover:bg-[#584572] text-white shadow-2xs'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {addedProductId === prod.id ? 'check' : 'add_shopping_cart'}
                      </span>
                      <span>{addedProductId === prod.id ? 'Added' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#7c535c]">Everything Answered</span>
          <h2 className="font-serif text-3xl font-bold text-[#26152d]">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-500">
            Have questions about mobile visits, cancellations, or South African escrow safety?
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-sm font-bold text-[#26152d] hover:text-[#695684] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`material-symbols-outlined text-[20px] transition-transform ${isOpen ? 'rotate-180 text-[#695684]' : 'text-gray-400'}`}>
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-[#f0ede6] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
