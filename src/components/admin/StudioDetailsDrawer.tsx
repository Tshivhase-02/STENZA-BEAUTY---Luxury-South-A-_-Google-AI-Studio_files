import React from 'react';
import { 
  X, 
  Building, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Car, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Star, 
  FileText, 
  Sparkles,
  Edit,
  Trash2,
  Lock,
  ExternalLink,
  Flag
} from 'lucide-react';
import { AdminStudio } from '../../types/admin';

interface StudioDetailsDrawerProps {
  studio: AdminStudio | null;
  isOpen: boolean;
  onClose: () => void;
  onEditInfo: (studio: AdminStudio) => void;
  onEnforce: (studio: AdminStudio, action: 'warn' | 'under_review' | 'disable' | 'suspend' | 'reinstate' | 'soft_delete' | 'restore') => void;
  onToggleFeatured: (studio: AdminStudio) => void;
}

export const StudioDetailsDrawer: React.FC<StudioDetailsDrawerProps> = ({
  studio,
  isOpen,
  onClose,
  onEditInfo,
  onEnforce,
  onToggleFeatured
}) => {
  if (!isOpen || !studio) return null;

  const isEligibleForFeatured = studio.approvalStatus === 'approved' && studio.operationalStatus === 'active' && !studio.isDeleted;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
        role="dialog"
      >
        <div>
          {/* Header */}
          <div className="bg-[#1b0d21] text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-700 text-white px-2 py-0.5 rounded">
                BEAUTY SHOP RECORD
              </span>
              <span className="text-xs text-stone-400 font-mono">ID: {studio.id}</span>
              <span className="text-stone-500">•</span>
              <span className="text-xs text-stone-400">Registered: {studio.registrationDate}</span>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <img
                src={studio.logoUrl}
                alt={studio.businessName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 bg-stone-900 shadow-md shrink-0"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {studio.businessName}
                </h2>
                <p className="text-xs text-stone-300">
                  {studio.founderName} • {studio.founderTitle}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    studio.approvalStatus === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : studio.approvalStatus === 'pending'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : studio.approvalStatus === 'changes_requested'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    Approval: {studio.approvalStatus.replace('_', ' ')}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    studio.operationalStatus === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : studio.operationalStatus === 'suspended'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : studio.operationalStatus === 'disabled'
                      ? 'bg-stone-500/20 text-stone-300 border border-stone-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    Status: {studio.operationalStatus.replace('_', ' ')}
                  </span>

                  {studio.isFeatured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured (#{studio.featuredOrder})</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6 text-xs text-stone-700">
            {/* Soft Deleted Notice */}
            {studio.isDeleted && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 flex items-start gap-2.5">
                <Trash2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Record Soft-Deleted:</strong> This studio has been marked as deleted. Historical booking records and audit trail are preserved in the MySQL database under compliance retention rules.
                </div>
              </div>
            )}

            {/* Moderation Warnings Banner */}
            {(studio.operationalStatus === 'suspended' || studio.statusChangeReason) && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Administrative Status Notice</span>
                </div>
                <p className="text-xs leading-relaxed">
                  {studio.statusChangeReason || studio.suspensionReason || 'Studio placed under administrative hold.'}
                </p>
              </div>
            )}

            {/* Confidential Owner Information (Admin Eyes Only) */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#b86b86]" />
                  <span>Confidential Owner Contact (Authorised Admin Only)</span>
                </span>
                <span className="text-[10px] text-stone-500 font-mono">POPIA Protected</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Legal Full Name</span>
                  <p className="text-xs font-semibold text-stone-900 mt-0.5">{studio.founderName}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">SA National ID / Passport</span>
                  <p className="text-xs font-mono font-bold text-stone-900 mt-0.5">{studio.idNumber || 'Verified in CIPC'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Verified Mobile</span>
                  <p className="text-xs font-semibold text-stone-900 mt-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>{studio.phone}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Verified Email</span>
                  <p className="text-xs font-semibold text-stone-900 mt-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-stone-400" />
                    <span>{studio.email}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Physical Studio */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-3">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block border-b border-stone-100 pb-2">
                Physical Location & Category
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Primary Category</span>
                  <p className="text-xs font-semibold text-stone-900 mt-0.5">{studio.category}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">City & Hub</span>
                  <p className="text-xs font-semibold text-stone-900 mt-0.5">{studio.suburb}, {studio.city}</p>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Full Physical Address</span>
                  <p className="text-xs text-stone-900 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>{studio.address}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">House-Calls / Mobile</span>
                  <p className="text-xs font-semibold text-stone-900 mt-0.5">
                    {studio.offersHouseCalls ? `Yes (Call-out fee R${studio.travelFee || 150})` : 'Studio Visits Only'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Client Ratings</span>
                  <p className="text-xs font-semibold text-stone-900 mt-0.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{studio.rating} ({studio.reviewCount} verified reviews)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Moderation History & Reports */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reports & Moderation History</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  studio.reportCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {studio.reportCount} Complaints Lodged
                </span>
              </div>

              {studio.warnings && studio.warnings.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Previous Warnings ({studio.warnings.length}):</span>
                  {studio.warnings.map((w) => (
                    <div key={w.id} className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-rose-800">{w.reason}</span>
                        <span className="text-stone-400">{w.issuedAt} by {w.adminName}</span>
                      </div>
                      <p className="text-stone-600 text-[11px] leading-relaxed">{w.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-[11px]">Zero formal warnings on file. Clean standing.</p>
              )}

              {studio.adminNotes && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Admin Case Notes:</span>
                  <p className="text-stone-700 text-xs italic mt-0.5">{studio.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Edit administrative info */}
            <button
              onClick={() => {
                onClose();
                onEditInfo(studio);
              }}
              className="px-3.5 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit className="w-3.5 h-3.5 text-stone-600" />
              <span>Edit Listing Info</span>
            </button>

            {/* Feature on Landing Page */}
            <button
              disabled={!isEligibleForFeatured}
              onClick={() => onToggleFeatured(studio)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                studio.isFeatured
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : isEligibleForFeatured
                  ? 'bg-white text-stone-800 border border-stone-300 hover:bg-stone-100'
                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
              }`}
              title={!isEligibleForFeatured ? 'Only approved and active studios may be featured' : ''}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{studio.isFeatured ? 'Unfeature From Landing Page' : 'Feature on Landing Page'}</span>
            </button>

            {/* Warn Studio */}
            <button
              onClick={() => {
                onClose();
                onEnforce(studio, 'warn');
              }}
              className="px-3 py-2 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Warn Owner</span>
            </button>
          </div>

          {/* Severe enforcement buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-stone-200 flex-wrap">
            {studio.operationalStatus === 'active' ? (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEnforce(studio, 'under_review');
                  }}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Place Under Review
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEnforce(studio, 'disable');
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Temporarily Disable
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEnforce(studio, 'suspend');
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Suspend Studio
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onEnforce(studio, 'reinstate');
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reinstate Studio to Active</span>
              </button>
            )}

            {studio.isDeleted ? (
              <button
                onClick={() => {
                  onClose();
                  onEnforce(studio, 'restore');
                }}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold ml-auto cursor-pointer"
              >
                Restore Record
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onEnforce(studio, 'soft_delete');
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 ml-auto cursor-pointer"
              >
                Delete Record
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
