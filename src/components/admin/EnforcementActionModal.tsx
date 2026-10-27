import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Send,
  Trash2,
  PauseCircle,
  RotateCcw,
  Check
} from 'lucide-react';
import { AdminStudio } from '../../types/admin';
import { adminService } from '../../services/adminService';

export type EnforcementType = 'warn' | 'under_review' | 'disable' | 'suspend' | 'reinstate' | 'soft_delete' | 'restore';

interface EnforcementActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studio: AdminStudio | null;
  actionType: EnforcementType;
  onSuccess: () => void;
}

const DEFAULT_REASONS: Record<EnforcementType, string[]> = {
  warn: [
    'First client complaint regarding undisclosed cash surcharge',
    'Treatment room photo discrepancy with advertised listing',
    'Unanswered client communication exceeding 48 hours',
    'Minor sanitation protocol deviation during routine inspection',
    'Custom warning reason'
  ],
  under_review: [
    'Multiple pending client complaints under investigation',
    'CIPC registration renewal verification required',
    'Municipal health inspection certificate update required',
    'Discrepancy in certified South African ID credentials',
    'Custom review reason'
  ],
  disable: [
    'Temporary voluntary studio closure requested by owner',
    'Unresolved hygiene or sanitation non-compliance notice',
    'Failure to maintain valid commercial trade insurance',
    'Extended operational inactivity with unfulfilled bookings',
    'Custom disable reason'
  ],
  suspend: [
    'Severe breach of STENZA Escrow transparent pricing policy',
    'Confirmed fraudulent documentation or fake credentials',
    'Client harassment, discrimination, or abusive conduct',
    'Multiple unresolved customer complaints',
    'Custom suspension reason'
  ],
  reinstate: [
    'Satisfactory completion of compliance remediation audit',
    'Formal appeal approved by Senior Compliance Desk',
    'Updated certified documents verified and approved',
    'Owner signed revised STENZA Artisan Conduct Agreement',
    'Custom reinstatement reason'
  ],
  soft_delete: [
    'Permanent studio closure verified by CIPC deregulation',
    'Repeated fraudulent activity and permanent ban from marketplace',
    'Written formal request for data erasure under POPIA Section 24',
    'Custom deletion reason'
  ],
  restore: [
    'Administrative review concluded deletion was in error',
    'Studio reopened under verified active management',
    'Custom restore reason'
  ]
};

export const EnforcementActionModal: React.FC<EnforcementActionModalProps> = ({
  isOpen,
  onClose,
  studio,
  actionType,
  onSuccess
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [warnMessage, setWarnMessage] = useState<string>('');
  const [cancelBookingsConfirm, setCancelBookingsConfirm] = useState(true);
  const [notifyOwnerConfirm, setNotifyOwnerConfirm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen || !studio) return null;

  const reasonsList = DEFAULT_REASONS[actionType] || [];

  const getActionTitle = () => {
    switch (actionType) {
      case 'warn': return 'Issue Formal Written Warning';
      case 'under_review': return 'Place Studio Under Formal Review';
      case 'disable': return 'Temporarily Disable Studio';
      case 'suspend': return 'Suspend Studio (Escrow Restricted)';
      case 'reinstate': return 'Reinstate Studio to Active Status';
      case 'soft_delete': return 'Initiate Studio Deletion (Soft-Delete)';
      case 'restore': return 'Restore Studio From Deletion';
    }
  };

  const getActionDescription = () => {
    switch (actionType) {
      case 'warn':
        return 'Issues a logged administrative warning to the studio owner. Does not disrupt public bookings but is recorded in the studio moderation profile.';
      case 'under_review':
        return 'Marks the studio as under review. The studio will be flagged in the admin portal and removed from landing page promotions until investigation completes.';
      case 'disable':
        return 'Temporarily hides the studio from public discovery and disables new appointment bookings while preserving all existing booking records.';
      case 'suspend':
        return 'Suspends all public visibility, halts escrow payouts, and freezes new bookings due to substantiated policy or conduct violations.';
      case 'reinstate':
        return 'Restores the studio to ACTIVE operational status. The studio will reappear in public search results and become eligible for landing page promotions.';
      case 'soft_delete':
        return 'Soft-deletes the studio record from the public platform while permanently preserving all past transaction and audit history in MySQL.';
      case 'restore':
        return 'Restores this soft-deleted studio back to active administrative management.';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const finalReason = selectedReason === 'Custom warning reason' || 
      selectedReason === 'Custom review reason' || 
      selectedReason === 'Custom disable reason' || 
      selectedReason === 'Custom suspension reason' || 
      selectedReason === 'Custom reinstatement reason' || 
      selectedReason === 'Custom deletion reason' || 
      selectedReason === 'Custom restore reason' || 
      !selectedReason
        ? customReason.trim()
        : selectedReason;

    if (!finalReason) {
      setError('Please provide a mandatory justification reason for this administrative action.');
      return;
    }

    if (actionType === 'warn' && !warnMessage.trim()) {
      setError('Please enter the specific warning notice message to be delivered to the studio owner.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let success = false;
      if (actionType === 'warn') {
        success = adminService.warnStudio(studio.id, warnMessage.trim(), finalReason);
      } else if (actionType === 'under_review') {
        success = adminService.updateStudioStatus(studio.id, 'under_review', finalReason);
      } else if (actionType === 'disable') {
        success = adminService.updateStudioStatus(studio.id, 'disabled', finalReason);
      } else if (actionType === 'suspend') {
        success = adminService.updateStudioStatus(studio.id, 'suspended', finalReason);
      } else if (actionType === 'reinstate') {
        success = adminService.updateStudioStatus(studio.id, 'active', finalReason);
      } else if (actionType === 'soft_delete') {
        success = adminService.softDeleteStudio(studio.id, finalReason);
      } else if (actionType === 'restore') {
        success = adminService.restoreStudio(studio.id);
      }

      setIsSubmitting(false);
      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('Failed to update studio status. Please try again.');
      }
    }, 500);
  };

  const isSevere = actionType === 'suspend' || actionType === 'soft_delete' || actionType === 'disable';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`p-6 text-white relative ${isSevere ? 'bg-rose-950' : 'bg-[#1b0d21]'}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${isSevere ? 'bg-rose-700 text-white' : 'bg-[#d4af37] text-stone-900'}`}>
              CONFIRMATION REQUIRED
            </span>
            <span className="text-xs text-stone-400">Officer: Govender M.</span>
          </div>

          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            {isSevere ? (
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            ) : actionType === 'reinstate' || actionType === 'restore' ? (
              <RotateCcw className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            <span>{getActionTitle()}</span>
          </h2>

          <p className="text-xs text-stone-300 mt-1">
            Target Studio: <strong className="text-white">{studio.businessName}</strong> ({studio.id})
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-stone-700 leading-relaxed">
            {getActionDescription()}
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Standard Justification Reason *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-600"
            >
              <option value="">Select pre-audited compliance reason...</option>
              {reasonsList.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Custom Reason Notes */}
          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Detailed Case Notes & Audit Evidence *
            </label>
            <textarea
              required
              rows={3}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter comprehensive administrative explanation. This will be stored in the permanent MySQL audit log..."
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-600 focus:bg-white"
            />
          </div>

          {/* Warn message specific */}
          {actionType === 'warn' && (
            <div>
              <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Formal Notice Message to Owner *</span>
                <span className="text-[10px] text-[#b86b86]">Delivered to {studio.email}</span>
              </label>
              <textarea
                required
                rows={2}
                value={warnMessage}
                onChange={(e) => setWarnMessage(e.target.value)}
                placeholder="Formal notice text explaining corrective actions required within 48 hours..."
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-600 focus:bg-white"
              />
            </div>
          )}

          {/* Impact Disclosures */}
          {isSevere && (
            <div className="space-y-2 pt-1 border-t border-stone-200">
              <label className="flex items-start gap-2.5 text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cancelBookingsConfirm}
                  onChange={(e) => setCancelBookingsConfirm(e.target.checked)}
                  className="mt-0.5 accent-rose-600"
                />
                <span>
                  <strong>Handle Active Appointments:</strong> Remove studio from public search & notify affected clients through the automated rescheduling/refund queue.
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOwnerConfirm}
                  onChange={(e) => setNotifyOwnerConfirm(e.target.checked)}
                  className="mt-0.5 accent-rose-600"
                />
                <span>
                  <strong>Transmit Formal Decision Notice:</strong> Send formal administrative notice and appeal guidelines to <strong>{studio.email}</strong>.
                </span>
              </label>
            </div>
          )}

          <div className="pt-3 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 text-white rounded-xl font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                isSevere
                  ? 'bg-rose-700 hover:bg-rose-800'
                  : actionType === 'reinstate' || actionType === 'restore'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {isSubmitting ? (
                <span>Recording Audit Decision...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm Enforcement Action</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
