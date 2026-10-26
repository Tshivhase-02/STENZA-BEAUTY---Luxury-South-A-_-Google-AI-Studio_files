import React from 'react';

interface FooterProps {
  onNavigate: (view: string, providerId?: string) => void;
  onOpenLocationModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLocationModal }) => {
  return (
    <footer className="bg-[#26152d] text-[#e5e0d8] border-t border-[#39263f] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#39263f]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#b86b86] text-white flex items-center justify-center font-serif text-xl font-bold border border-[#d4af37]">
                S
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  STENZA <span className="font-light text-[#b86b86]">BEAUTY</span>
                </span>
                <p className="text-[10px] tracking-widest uppercase text-[#e8a3b8] font-medium">
                  Your Beauty, Your Way.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#cfc7bc] leading-relaxed max-w-sm">
              South Africa’s premier beauty services marketplace connecting customers with independent beauty professionals, salons, hairstylists, nail technicians, makeup artists, lash technicians, and barbers across Gauteng, Western Cape, and KwaZulu-Natal.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">Connect With STENZA:</span>
              <div className="flex items-center gap-3 text-xs">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#39263f] hover:bg-[#b86b86] flex items-center justify-center text-white transition cursor-pointer"
                  title="Instagram"
                >
                  <span className="font-bold text-xs">IG</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#39263f] hover:bg-[#b86b86] flex items-center justify-center text-white transition cursor-pointer"
                  title="Facebook"
                >
                  <span className="font-bold text-xs">FB</span>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#39263f] hover:bg-[#b86b86] flex items-center justify-center text-white transition cursor-pointer"
                  title="TikTok"
                >
                  <span className="font-bold text-xs">TT</span>
                </a>
                <a
                  href="https://wa.me/27824591084"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-emerald-900 hover:bg-emerald-700 flex items-center justify-center text-white transition cursor-pointer"
                  title="WhatsApp Mzansi Concierge"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Concierge hotline */}
            <div className="pt-2">
              <a 
                href="https://wa.me/27824591084?text=Hi%20STENZA%20Concierge,%20I%20would%20like%20assistance%20with%20a%20booking"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs font-medium hover:bg-emerald-900/60 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-400">chat</span>
                <span>Mzansi Concierge: +27 82 459 1084</span>
              </a>
            </div>
          </div>

          {/* Column 2: Marketplace Discovery */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-serif">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-[#cfc7bc]">
              <li>
                <button onClick={() => onNavigate('discover')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Explore Studios
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('discover')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors cursor-pointer text-left">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={onOpenLocationModal} className="hover:text-white transition-colors cursor-pointer text-left">
                  Browse by City / Suburb
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('discover')} className="hover:text-white transition-colors cursor-pointer text-left">
                  House-Call Professionals
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: For Beauty Professionals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-serif">
              Beauty Professionals
            </h4>
            <ul className="space-y-2 text-xs text-[#cfc7bc]">
              <li>
                <button 
                  onClick={() => onNavigate('artisan_registration')} 
                  className="text-[#e8a3b8] hover:text-white font-bold transition-colors cursor-pointer text-left"
                >
                  ✨ Register Your Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('artisan_dashboard')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Artisan Studio Suite
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services_management')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Service & Photo Uploads
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('house_calls_availability')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Working Hours & Mobile Fees
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin_review')} 
                  className="text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer text-left flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-400">🛡️</span>
                  <span>Admin Portal (Accreditation)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust, Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-serif">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-xs text-[#cfc7bc]">
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Help and Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Privacy Policy & POPIA Act
                </button>
              </li>
              <li>
                <span className="text-[11px] text-stone-400 block pt-1">
                  Republic of South Africa Compliance
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with payment methods & South Africa notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#a89f92]">
          <div>
            © {new Date().getFullYear()} STENZA Beauty (Pty) Ltd. Tagline: <em>Your Beauty, Your Way.</em> Registered in South Africa.
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[11px] text-[#cfc7bc]">Supported Payment Rails:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#39263f] text-[10px] font-semibold text-white">VISA</span>
              <span className="px-2 py-0.5 rounded bg-[#39263f] text-[10px] font-semibold text-white">MASTERCARD</span>
              <span className="px-2 py-0.5 rounded bg-[#39263f] text-[10px] font-semibold text-white">OZOW EFT</span>
              <span className="px-2 py-0.5 rounded bg-[#39263f] text-[10px] font-semibold text-white">CAPITEC PAY</span>
              <span className="px-2 py-0.5 rounded bg-[#39263f] text-[10px] font-semibold text-white">APPLE PAY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
