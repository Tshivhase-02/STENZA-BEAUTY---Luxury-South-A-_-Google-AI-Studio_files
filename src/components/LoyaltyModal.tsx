import React, { useState } from 'react';
import { Booking } from '../data/beautyData';
import { calculateLoyaltySummary, AVAILABLE_REWARDS, LoyaltyReward } from '../data/loyaltyData';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  redeemedPoints: number;
  onRedeemReward: (reward: LoyaltyReward) => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({
  isOpen,
  onClose,
  bookings,
  redeemedPoints,
  onRedeemReward,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'redeem'>('overview');
  const [redeemedToast, setRedeemedToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const summary = calculateLoyaltySummary(bookings, redeemedPoints);

  const handleClaim = (reward: LoyaltyReward) => {
    if (summary.availablePoints < reward.pointsRequired) {
      setRedeemedToast(`You need ${reward.pointsRequired - summary.availablePoints} more points to claim this voucher.`);
      setTimeout(() => setRedeemedToast(null), 3000);
      return;
    }
    onRedeemReward(reward);
    setRedeemedToast(`Successfully redeemed "${reward.title}"! R${reward.discountZAR} voucher applied to your next appointment.`);
    setTimeout(() => setRedeemedToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* Toast */}
      {redeemedToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#26152d] text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-[#695684] flex items-center gap-2 animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{redeemedToast}</span>
        </div>
      )}

      <div
        className="relative bg-[#fcf9f4] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e5e0d8] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e0d8]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#695684] to-[#39263f] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[26px]">diamond</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#26152d]">
                  STENZA Luxe Rewards
                </h3>
                <span className="text-[10px] font-bold bg-[#f6d9fb] text-[#39263f] px-2 py-0.5 rounded-full">
                  {summary.tier}
                </span>
              </div>
              <p className="text-xs text-[#7c535c] mt-0.5">
                Earn 1 Point for every R10 spent on completed luxury bookings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ebe8e3] text-gray-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-[#f6f3ee] p-1 text-xs font-semibold text-gray-600 mt-5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-white text-[#26152d] shadow-2xs font-bold' : 'hover:text-[#26152d]'
            }`}
          >
            Points Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-white text-[#26152d] shadow-2xs font-bold' : 'hover:text-[#26152d]'
            }`}
          >
            Ledger ({summary.ledger.length})
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'redeem' ? 'bg-[#695684] text-white shadow-2xs font-bold' : 'hover:text-[#26152d]'
            }`}
          >
            Redeem Rewards
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="mt-5 space-y-5">
            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#26152d] via-[#39263f] to-[#695684] text-white p-6 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#f6d9fb]">
                    Available Loyalty Balance
                  </span>
                  <div className="font-serif text-4xl sm:text-5xl font-bold mt-1 text-white">
                    {summary.availablePoints}{' '}
                    <span className="text-xl font-sans font-normal text-[#d4cfc8]">pts</span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1">
                    Redemption value: <strong className="text-white">R{summary.zarValue}</strong> booking credit
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-semibold text-[#f6d9fb]">
                    {summary.tier}
                  </span>
                  <div className="text-[10px] text-stone-300 mt-1">
                    Total Earned: <strong>{summary.totalPointsEarned} pts</strong>
                  </div>
                </div>
              </div>

              {/* Progress to next tier */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex justify-between text-xs text-stone-200 mb-1.5">
                  <span>Tier Progress: {summary.tier}</span>
                  <span>{summary.nextTierPointsNeeded > 0 ? `${summary.nextTierPointsNeeded} pts to ${summary.nextTierName}` : 'Top Tier'}</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${summary.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Benefits Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-[#e5e0d8] shadow-2xs">
                <span className="material-symbols-outlined text-[#695684] text-[20px]">currency_exchange</span>
                <div className="font-bold text-xs text-[#26152d] mt-1">1 pt = R1</div>
                <div className="text-[10px] text-gray-500">Instant credit value</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e5e0d8] shadow-2xs">
                <span className="material-symbols-outlined text-[#695684] text-[20px]">local_cafe</span>
                <div className="font-bold text-xs text-[#26152d] mt-1">VIP Bar</div>
                <div className="text-[10px] text-gray-500">Botanical teas in studio</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e5e0d8] shadow-2xs">
                <span className="material-symbols-outlined text-[#695684] text-[20px]">lock_clock</span>
                <div className="font-bold text-xs text-[#26152d] mt-1">Zero Expiry</div>
                <div className="text-[10px] text-gray-500">Points never expire</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: History Ledger */}
        {activeTab === 'history' && (
          <div className="mt-5 space-y-3 max-h-72 overflow-y-auto pr-1">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Points Earned from Completed Appointments
            </div>
            {summary.ledger.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white rounded-xl border border-[#e5e0d8] flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      item.type === 'bonus'
                        ? 'bg-amber-100 text-amber-800'
                        : item.type === 'redeemed'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-[#f6d9fb] text-[#39263f]'
                    }`}
                  >
                    {item.type === 'bonus' ? '★' : item.type === 'redeemed' ? '−' : '+'}
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-bold text-[#26152d]">{item.title}</h5>
                    <p className="text-[10px] text-gray-500">{item.subtitle} • {item.date}</p>
                    {item.amountZAR && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        Treatment amount: R{item.amountZAR} (ZAR Escrow)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-serif text-sm font-bold ${
                      item.points > 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {item.points > 0 ? `+${item.points}` : item.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Redeem Rewards */}
        {activeTab === 'redeem' && (
          <div className="mt-5 space-y-3 max-h-72 overflow-y-auto pr-1">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Available Vouchers & Booking Credits
            </div>
            {AVAILABLE_REWARDS.map((rew) => {
              const canAfford = summary.availablePoints >= rew.pointsRequired;
              return (
                <div
                  key={rew.id}
                  className="p-4 bg-white rounded-xl border border-[#e5e0d8] flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h5 className="font-serif text-xs font-bold text-[#26152d]">{rew.title}</h5>
                      {rew.badge && (
                        <span className="text-[9px] bg-[#695684] text-white px-1.5 py-0.2 rounded font-semibold">
                          {rew.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">{rew.description}</p>
                    <span className="text-[10px] font-bold text-[#695684] block">
                      Cost: {rew.pointsRequired} points
                    </span>
                  </div>

                  <button
                    onClick={() => handleClaim(rew)}
                    disabled={!canAfford}
                    className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      canAfford
                        ? 'bg-[#695684] hover:bg-[#584572] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem Voucher' : 'Not Enough Points'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-[#e5e0d8] flex items-center justify-between text-xs text-gray-500">
          <span>Total Points Earned: <strong className="text-[#26152d]">{summary.totalPointsEarned} pts</strong></span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#695684] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
