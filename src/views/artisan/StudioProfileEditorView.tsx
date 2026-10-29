import React, { useState } from 'react';
import { StudioProfile } from '../../data/artisanWorkflowData';
import { categoryService } from '../../services/categoryService';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  ArrowLeft, 
  Eye, 
  Sparkles,
  Save,
  MessageCircle,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { 
  SOUTH_AFRICAN_PROVINCES, 
  getTownsForProvince, 
  getSuburbsForTown, 
  formatStudioDisplayLocation 
} from '../../data/saLocationsData';

interface StudioProfileEditorViewProps {
  studio: StudioProfile;
  onUpdateStudio: (updated: Partial<StudioProfile>) => void;
  onNavigate: (view: string) => void;
}

export const StudioProfileEditorView: React.FC<StudioProfileEditorViewProps> = ({
  studio,
  onUpdateStudio,
  onNavigate,
}) => {
  // Local editable form states
  const [businessName, setBusinessName] = useState(studio.businessName);
  const [founderName, setFounderName] = useState(studio.founderName);
  const [founderTitle, setFounderTitle] = useState(studio.founderTitle);
  const [headline, setHeadline] = useState(studio.headline);
  const [bio, setBio] = useState(studio.bio);
  const [category, setCategory] = useState(studio.category);

  // Contact
  const [phone, setPhone] = useState(studio.phone);
  const [whatsapp, setWhatsapp] = useState(studio.whatsapp);
  const [email, setEmail] = useState(studio.email);
  const [instagram, setInstagram] = useState(studio.instagram);
  const [website, setWebsite] = useState(studio.website);

  // Location
  const [province, setProvince] = useState(studio.province || 'Gauteng');
  const [city, setCity] = useState(studio.city);
  const [suburb, setSuburb] = useState(studio.suburb);
  const [address, setAddress] = useState(studio.address);
  const [isCustomTown, setIsCustomTown] = useState(() => {
    const towns = getTownsForProvince(studio.province || 'Gauteng');
    return studio.city ? !towns.includes(studio.city) : false;
  });
  const [isCustomSuburb, setIsCustomSuburb] = useState(() => {
    const subs = getSuburbsForTown(studio.city);
    return studio.suburb ? !subs.includes(studio.suburb) : false;
  });

  const handleProvinceChange = (newProv: string) => {
    setProvince(newProv);
    const towns = getTownsForProvince(newProv);
    if (towns.length > 0) {
      setCity(towns[0]);
      setIsCustomTown(false);
      const subs = getSuburbsForTown(towns[0]);
      setSuburb(subs[0] || '');
      setIsCustomSuburb(false);
    } else {
      setCity('');
      setSuburb('');
      setIsCustomTown(true);
      setIsCustomSuburb(true);
    }
  };

  const handleTownChange = (newTown: string) => {
    setCity(newTown);
    setIsCustomTown(false);
    const subs = getSuburbsForTown(newTown);
    if (subs.length > 0) {
      setSuburb(subs[0]);
      setIsCustomSuburb(false);
    } else {
      setSuburb('');
      setIsCustomSuburb(true);
    }
  };

  // Media
  const [logoUrl, setLogoUrl] = useState(studio.logoUrl);
  const [coverUrl, setCoverUrl] = useState(studio.coverUrl);
  const [gallery, setGallery] = useState<string[]>(studio.gallery || []);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // UI state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setGallery((prev) => [...prev, newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedData: Partial<StudioProfile> = {
      businessName,
      founderName,
      founderTitle,
      headline,
      bio,
      category,
      phone,
      whatsapp,
      email,
      instagram,
      website,
      province,
      city,
      suburb,
      address,
      logoUrl,
      coverUrl,
      gallery,
    };

    setTimeout(() => {
      onUpdateStudio(updatedData);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] pb-24">
      {/* Top Header */}
      <div className="bg-[#26152d] text-white py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('artisan_dashboard')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e8a3b8]">
                  Beauty Shop Configuration
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Edit Beauty Shop Profile & Branding
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('studio_preview')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-pink-300" />
              <span>Preview Profile</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-3">
        {/* Success toast banner */}
        {saveSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <Check className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold">Beauty Shop Profile saved successfully! Client view updated.</span>
            </div>
            <button
              onClick={() => onNavigate('studio_preview')}
              className="text-xs font-bold underline hover:text-emerald-950 cursor-pointer"
            >
              View Preview →
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Business Identity */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-100">
              <Building className="w-5 h-5 text-[#b86b86]" />
              <h2 className="text-lg font-serif font-bold text-[#26152d]">
                Business Identity & Brand Essence
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Beauty Shop / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Founder / Lead Artisan Name *
                </label>
                <input
                  type="text"
                  required
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Founder Professional Title *
                </label>
                <input
                  type="text"
                  value={founderTitle}
                  onChange={(e) => setFounderTitle(e.target.value)}
                  placeholder="e.g. Master Nail Artist & Educator"
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Category Specialization *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86] bg-white"
                >
                  {/* Preserve current if legacy */}
                  {!categoryService.getServiceCategories().some(c => c.name === category) && (
                    <option value={category}>{category} (Current)</option>
                  )}
                  {categoryService.getServiceCategories().map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name} ({cat.group})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Beauty Shop Headline (Tagline) *
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. High-precision Russian manicures, sculptural BIAB overlays and couture nail art."
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Comprehensive Beauty Shop Biography & Credentials *
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-sm p-4 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86] leading-relaxed"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Mention certifications, international training, hygiene protocols, and salon ambiance.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Social Handles */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-100">
              <MessageCircle className="w-5 h-5 text-[#b86b86]" />
              <h2 className="text-lg font-serif font-bold text-[#26152d]">
                Client Contact & Booking Communication
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Studio Telephone (Landline or Cell)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Direct WhatsApp Line (+27 format) *
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+27 82 123 4567"
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
                <p className="text-[11px] text-stone-400 mt-1">Used for customer booking confirmations</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Inquiries Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Instagram Handle *
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@yourstudioname"
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Official Website (Optional)
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.yourstudio.co.za"
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Physical Location */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-stone-100 flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#b86b86]" />
                <h2 className="text-lg font-serif font-bold text-[#26152d]">
                  Physical Studio Location & Discoverability
                </h2>
              </div>
              {province && city && suburb && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-semibold text-[#b86b86]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Public Display: {formatStudioDisplayLocation(province, city, suburb)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Province */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Province *
                </label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86] font-medium"
                >
                  {SOUTH_AFRICAN_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-1">One of 9 South African provinces</p>
              </div>

              {/* Town / City */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Town or City *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomTown(!isCustomTown);
                      if (isCustomTown) {
                        const towns = getTownsForProvince(province);
                        setCity(towns[0] || '');
                      }
                    }}
                    className="text-[11px] font-semibold text-[#b86b86] hover:underline cursor-pointer"
                  >
                    {isCustomTown ? 'Select from list' : '+ Enter custom town'}
                  </button>
                </div>
                {isCustomTown ? (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter town or city name"
                    className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                  />
                ) : (
                  <select
                    value={city}
                    onChange={(e) => handleTownChange(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86] font-medium"
                  >
                    {getTownsForProvince(province).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                )}
                <p className="text-[11px] text-stone-500 mt-1">Clients search by town or city</p>
              </div>

              {/* Suburb */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Suburb or Area *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSuburb(!isCustomSuburb);
                      if (isCustomSuburb) {
                        const subs = getSuburbsForTown(city);
                        setSuburb(subs[0] || '');
                      }
                    }}
                    className="text-[11px] font-semibold text-[#b86b86] hover:underline cursor-pointer"
                  >
                    {isCustomSuburb ? 'Select from list' : '+ Enter custom suburb'}
                  </button>
                </div>
                {isCustomSuburb || getSuburbsForTown(city).length === 0 ? (
                  <input
                    type="text"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="Enter suburb or township/area"
                    className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                  />
                ) : (
                  <select
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86] font-medium"
                  >
                    {getSuburbsForTown(city).map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                )}
                <p className="text-[11px] text-stone-500 mt-1">Primary neighborhood or business district</p>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Street Address & Building / Suite (Optional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Unit 4, Rosebank Corner, 191 Jan Smuts Ave"
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
                <p className="text-[11px] text-stone-500 mt-1">Specific directions for booked clients</p>
              </div>

              {/* Privacy Notice Banner */}
              <div className="sm:col-span-2 p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <span className="font-bold">Privacy & Security Guarantee:</span> Only your Suburb, Town, and Province are publicly displayed in marketplace search results. Your exact street address or home studio directions are confidential and only sent to verified clients with confirmed appointments.
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Visual Branding & Portfolio Gallery */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-100">
              <ImageIcon className="w-5 h-5 text-[#b86b86]" />
              <h2 className="text-lg font-serif font-bold text-[#26152d]">
                Visual Branding, Cover Hero & Portfolio Gallery
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Logo URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Studio Logo URL
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
                {logoUrl && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="w-14 h-14 rounded-full object-cover border border-stone-300 shadow-2xs"
                    />
                    <span className="text-xs text-stone-500">Square avatar (1:1 ratio)</span>
                  </div>
                )}
              </div>

              {/* Cover URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Studio Banner / Cover Hero Photo URL
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
                {coverUrl && (
                  <div className="mt-3">
                    <img
                      src={coverUrl}
                      alt="Cover preview"
                      className="w-full h-20 rounded-xl object-cover border border-stone-300 shadow-2xs"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Gallery manager */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Portfolio Showcase Gallery ({gallery.length} Images)
              </label>

              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  placeholder="Paste high-res image URL (e.g. Unsplash or Cloudinary)..."
                  className="flex-1 text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#b86b86]"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-4 py-2 bg-[#26152d] text-white rounded-xl text-xs font-bold hover:bg-[#3a1d3a] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-stone-200 aspect-square">
                    <img
                      src={img}
                      alt={`Portfolio ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <button
              type="button"
              onClick={() => onNavigate('artisan_dashboard')}
              className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
            >
              Cancel & Return
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('studio_preview')}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View Preview</span>
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
