import React, { useState, useEffect } from 'react';
import { X, Edit3, Building, MapPin, Phone, FileText, Check } from 'lucide-react';
import { AdminStudio } from '../../types/admin';
import { adminService } from '../../services/adminService';

interface EditStudioAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  studio: AdminStudio | null;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Hair and Hairstyles',
  'Nails',
  'Makeup',
  'Lashes and Brows',
  'Skincare and Facials',
  'Barbering',
  'Waxing and Hair Removal',
  'Bridal Beauty',
  'Spa and Wellness'
];

export const EditStudioAdminModal: React.FC<EditStudioAdminModalProps> = ({
  isOpen,
  onClose,
  studio,
  onSuccess
}) => {
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [suburb, setSuburb] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (studio) {
      setCategory(studio.category);
      setCity(studio.city);
      setSuburb(studio.suburb);
      setAddress(studio.address);
      setPhone(studio.phone);
      setAdminNotes(studio.adminNotes || '');
    }
  }, [studio]);

  if (!isOpen || !studio) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      adminService.updateStudioAdminInfo(studio.id, {
        category,
        city,
        suburb,
        address,
        phone,
        adminNotes
      });

      setIsSaving(false);
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="bg-[#1b0d21] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-700 text-white px-2 py-0.5 rounded">
            ADMINISTRATIVE EDITING
          </span>

          <h2 className="text-xl font-serif font-bold text-white mt-1.5 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#d4af37]" />
            <span>Edit Administrative Listing Info</span>
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Studio: <strong className="text-white">{studio.businessName}</strong> ({studio.id})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1">
              Primary Marketplace Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1">
                Metropolitan City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1">
                Suburb / District
              </label>
              <input
                type="text"
                required
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1">
              Full Physical Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1">
              Verified Studio Phone
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1">
              Internal Administrative Audit Notes
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal compliance notes visible only to STENZA administrators..."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 bg-[#b86b86] hover:bg-[#a25974] disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isSaving ? (
                <span>Saving to Database...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Listing Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
