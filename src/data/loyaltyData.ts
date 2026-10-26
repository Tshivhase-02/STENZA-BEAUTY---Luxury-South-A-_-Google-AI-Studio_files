import { Booking } from './beautyData';

export interface LoyaltyLedgerItem {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  date: string;
  type: 'earned' | 'bonus' | 'redeemed';
  bookingRef?: string;
  amountZAR?: number;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsRequired: number;
  discountZAR: number;
  description: string;
  badge?: string;
}

export interface LoyaltySummary {
  totalPointsEarned: number;
  redeemedPoints: number;
  availablePoints: number;
  zarValue: number;
  tier: 'Silver Patron' | 'Gold VIP' | 'Diamond Elite';
  tierColor: string;
  nextTierName: string;
  nextTierPointsNeeded: number;
  progressPercent: number;
  ledger: LoyaltyLedgerItem[];
}

export const AVAILABLE_REWARDS: LoyaltyReward[] = [
  {
    id: 'rew-50',
    title: 'R50 Treatment Credit',
    pointsRequired: 50,
    discountZAR: 50,
    description: 'Instant R50 reduction on any in-studio or mobile appointment.',
  },
  {
    id: 'rew-100',
    title: 'R100 Luxury Beauty Voucher',
    pointsRequired: 100,
    discountZAR: 100,
    description: 'Save R100 on BIAB, Russian manicures, or hair steam therapies.',
    badge: 'Popular',
  },
  {
    id: 'rew-150',
    title: 'R150 Mobile Call-Out Waiver',
    pointsRequired: 150,
    discountZAR: 150,
    description: 'Complimentary travel fee for any mobile house call artisan visit.',
  },
  {
    id: 'rew-200',
    title: 'R200 VIP Studio Voucher',
    pointsRequired: 200,
    discountZAR: 200,
    description: 'Generous R200 credit towards clinical skincare facials and silk presses.',
    badge: 'Best Value',
  },
];

export function calculateLoyaltySummary(bookings: Booking[], redeemedPoints: number = 0): LoyaltySummary {
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const ledger: LoyaltyLedgerItem[] = [];

  // 1. Welcome Bonus
  ledger.push({
    id: 'led-welcome',
    title: 'STENZA VIP Welcome Reward',
    subtitle: 'Membership activation bonus',
    points: 50,
    date: '20 Sep 2026',
    type: 'bonus',
  });

  // 2. Points from each completed booking (1 pt per R10 spent)
  let bookingPointsTotal = 0;
  completedBookings.forEach((b) => {
    const pts = Math.floor(b.servicePrice / 10);
    bookingPointsTotal += pts;
    ledger.push({
      id: `led-${b.id}`,
      title: `${b.serviceName}`,
      subtitle: `${b.providerName} (${b.providerSuburb})`,
      points: pts,
      date: b.date,
      type: 'earned',
      bookingRef: b.referenceCode,
      amountZAR: b.servicePrice,
    });
  });

  // Deduct any redeemed points
  if (redeemedPoints > 0) {
    ledger.unshift({
      id: `led-redeemed-${Date.now()}`,
      title: 'Applied Booking Credit Discount',
      subtitle: 'Redeemed during appointment checkout',
      points: -redeemedPoints,
      date: 'Today',
      type: 'redeemed',
    });
  }

  const totalPointsEarned = 50 + bookingPointsTotal;
  const availablePoints = Math.max(0, totalPointsEarned - redeemedPoints);
  const zarValue = availablePoints; // 1 point = R1 discount

  // Tier calculation
  let tier: 'Silver Patron' | 'Gold VIP' | 'Diamond Elite' = 'Silver Patron';
  let tierColor = 'text-gray-500';
  let nextTierName = 'Gold VIP';
  let nextTierPointsNeeded = 150 - totalPointsEarned;
  let progressPercent = (totalPointsEarned / 150) * 100;

  if (totalPointsEarned >= 500) {
    tier = 'Diamond Elite';
    tierColor = 'text-purple-600';
    nextTierName = 'Highest Tier Achieved';
    nextTierPointsNeeded = 0;
    progressPercent = 100;
  } else if (totalPointsEarned >= 150) {
    tier = 'Gold VIP';
    tierColor = 'text-amber-600';
    nextTierName = 'Diamond Elite';
    nextTierPointsNeeded = 500 - totalPointsEarned;
    progressPercent = ((totalPointsEarned - 150) / 350) * 100;
  }

  return {
    totalPointsEarned,
    redeemedPoints,
    availablePoints,
    zarValue,
    tier,
    tierColor,
    nextTierName,
    nextTierPointsNeeded: Math.max(0, nextTierPointsNeeded),
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    ledger: ledger.reverse(), // newest first
  };
}
