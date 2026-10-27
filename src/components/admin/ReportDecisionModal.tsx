import React, { useState } from 'react';
import { 
  X, 
  Flag, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Mail, 
  Calendar,
  Check
} from 'lucide-react';
import { StudioReport, ReportStatus } from '../../types/admin';
import { adminService } from '../../services/adminService';

interface ReportDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: StudioReport | null;
  onSuccess: () => void;
  onInitiateEnforcement?: (studioId: string, studioName: string, actionType: 'warn' | 'under_review' | 'suspend' | 'disable') => void;
}

export const ReportDecisionModal: React.FC<ReportDecisionModalProps> = ({
  isOpen,
  onClose,
  report,
  onSuccess,
  onInitiateEnforcement
}) => {
  const [status, setStatus] = useState<ReportStatus>('RESOLVED');
  const [decision, setDecision] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [customerNotification, setCustomerNotification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      adminService.updateReportDecision(report.id, {
        status,
        decision: decision.trim(),
        adminNotes: adminNotes.trim() || undefined,
        actionTaken: actionTaken.trim() || (status === 'RESOLVED' ? 'Corrective action recorded.' : 'Complaint closed without sanction.'),
        customerNotification: customerNotification.trim() || undefined
      });

      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-[#1b0d21] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-rose-900 text-rose-200 px-2 py-0.5 rounded">
              REPORT AUDIT CONSOLE
            </span>
            <span className="text-xs text-stone-400 font-mono">REF: {report.id}</span>
          </div>

          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-400" />
            <span>Investigate & Resolve Complaint</span>
          </h2>

          <p className="text-xs text-stone-300 mt-1">
            Target Studio: <strong className="text-white">{report.studioName}</strong> ({report.studioId})
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-stone-700">
          {/* Complaint Details Card */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-bold text-rose-900 text-[11px] uppercase tracking-wider">
                Category: {report.categoryLabel}
              </span>
              <span className="text-[10px] text-stone-400">Lodged: {report.dateSubmitted}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                Client Statement:
              </span>
              <p className="bg-white p-3 rounded-xl border border-stone-200 text-stone-800 leading-relaxed italic">
                "{report.description}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="font-semibold text-stone-500">Client: </span>
                <span className="text-stone-900 font-medium">{report.reporterName}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-500">Email: </span>
                <span className="text-stone-900 font-medium">{report.reporterEmail}</span>
              </div>
            </div>

            {report.bookedThroughStenza && (
              <div className="p-2 bg-purple-50 rounded-lg border border-purple-200 text-[11px] text-purple-900 flex items-center justify-between">
                <span>Booked via STENZA Marketplace</span>
                {report.bookingRef && <span className="font-mono font-bold">{report.bookingRef}</span>}
              </div>
            )}

            {report.evidenceUrl && (
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <span className="font-semibold text-stone-600">Client Evidence Attached:</span>
                <a
                  href={report.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#b86b86] hover:underline flex items-center gap-1"
                >
                  <span>Inspect Attachment</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Decision Outcome */}
          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Investigation Finding / Resolution Status *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('RESOLVED')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  status === 'RESOLVED'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resolved</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('UNDER_REVIEW')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  status === 'UNDER_REVIEW'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Under Review</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('DISMISSED')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  status === 'DISMISSED'
                    ? 'border-stone-500 bg-stone-100 text-stone-900 ring-1 ring-stone-400'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-stone-500" />
                <span>Dismissed</span>
              </button>
            </div>
          </div>

          {/* Decision statement */}
          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1">
              Official Decision Statement *
            </label>
            <input
              type="text"
              required
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="e.g. Investigation confirmed undisclosed pricing violation. Full refund issued."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
            />
          </div>

          {/* Action Taken */}
          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1">
              Corrective Action Taken
            </label>
            <input
              type="text"
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="e.g. Studio suspended for 14 days; warning logged on file."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
            />
          </div>

          {/* Internal admin notes */}
          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1">
              Internal Compliance Notes (Confidential)
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Evidence reviewed, phone calls with studio owner, auditor observations..."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-[#b86b86]"
            />
          </div>

          {/* Status Update Notice to Customer */}
          <div>
            <label className="block font-bold text-stone-800 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Customer Status Update Notice (Visible to Client)</span>
              <span className="text-[10px] text-stone-400 font-normal">Optional</span>
            </label>
            <textarea
              rows={2}
              value={customerNotification}
              onChange={(e) => setCustomerNotification(e.target.value)}
              placeholder="e.g. STENZA Compliance has completed an audit of this studio and enforced corrective pricing rules..."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          {/* Fast track enforcement buttons */}
          {onInitiateEnforcement && (
            <div className="pt-2 border-t border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">
                Fast-Track Studio Sanctions:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onInitiateEnforcement(report.studioId, report.studioName, 'warn');
                  }}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-bold text-[11px] cursor-pointer"
                >
                  Warn Studio Owner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onInitiateEnforcement(report.studioId, report.studioName, 'suspend');
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 rounded-lg font-bold text-[11px] cursor-pointer"
                >
                  Suspend Studio
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 flex gap-2">
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
              className="flex-1 py-2.5 bg-rose-800 hover:bg-rose-900 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <span>Recording Decision...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Finalize Report Finding</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
