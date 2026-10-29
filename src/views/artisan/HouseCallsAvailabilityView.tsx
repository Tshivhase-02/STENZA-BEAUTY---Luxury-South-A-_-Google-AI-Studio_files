import React, { useState } from 'react';
import { StudioProfile, OperatingDay } from '../../data/artisanWorkflowData';
import { 
  Car, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Save, 
  Check, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  Info,
  Calendar,
  AlertCircle,
  Copy,
  Coffee
} from 'lucide-react';

interface HouseCallsAvailabilityViewProps {
  studio: StudioProfile;
  onUpdateAvailability: (updated: {
    offersHouseCalls: boolean;
    travelFee: number;
    serviceAreas: string;
    bufferMinutes: number;
    operatingHours: OperatingDay[];
  }) => void;
  onNavigate: (view: string) => void;
}

export const HouseCallsAvailabilityView: React.FC<HouseCallsAvailabilityViewProps> = ({
  studio,
  onUpdateAvailability,
  onNavigate,
}) => {
  const [offersHouseCalls, setOffersHouseCalls] = useState(studio.offersHouseCalls);
  const [travelFee, setTravelFee] = useState<number>(studio.travelFee || 150);
  const [serviceAreas, setServiceAreas] = useState<string>(
    studio.serviceAreas || 'Rosebank, Sandton, Hyde Park, Houghton, Melrose Arch (Radius 12km)'
  );
  const [bufferMinutes, setBufferMinutes] = useState<number>(studio.bufferMinutes || 15);
  const [operatingHours, setOperatingHours] = useState<OperatingDay[]>(
    studio.operatingHours || [
      { day: 'Monday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Tuesday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Wednesday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Thursday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Friday', isOpen: true, openTime: '08:30', closeTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Saturday', isOpen: true, openTime: '08:00', closeTime: '17:00', hasBreak: false },
      { day: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '14:00' },
    ]
  );

  const [copySourceDay, setCopySourceDay] = useState<string>('Monday');
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleToggleDay = (dayName: string) => {
    setOperatingHours((prev) =>
      prev.map((item) =>
        item.day === dayName ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const handleTimeChange = (
    dayName: string, 
    field: 'openTime' | 'closeTime' | 'breakStartTime' | 'breakEndTime', 
    val: string
  ) => {
    setOperatingHours((prev) =>
      prev.map((item) =>
        item.day === dayName ? { ...item, [field]: val } : item
      )
    );
  };

  const handleToggleBreak = (dayName: string) => {
    setOperatingHours((prev) =>
      prev.map((item) =>
        item.day === dayName
          ? {
              ...item,
              hasBreak: !item.hasBreak,
              breakStartTime: item.breakStartTime || '13:00',
              breakEndTime: item.breakEndTime || '14:00',
            }
          : item
      )
    );
  };

  const handleCopyHoursToAll = () => {
    const source = operatingHours.find((item) => item.day === copySourceDay);
    if (!source) return;

    setOperatingHours((prev) =>
      prev.map((item) => {
        if (item.isOpen) {
          return {
            ...item,
            openTime: source.openTime,
            closeTime: source.closeTime,
            hasBreak: source.hasBreak,
            breakStartTime: source.breakStartTime,
            breakEndTime: source.breakEndTime,
          };
        }
        return item;
      })
    );

    setToastMessage(`Copied ${copySourceDay}'s hours (${source.openTime}–${source.closeTime}) to all open working days.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleError(null);

    // Validate that closing time is later than opening time
    for (const day of operatingHours) {
      if (day.isOpen) {
        if (day.closeTime <= day.openTime) {
          setScheduleError(`${day.day}: Closing time (${day.closeTime}) must be later than opening time (${day.openTime}).`);
          return;
        }
        if (day.hasBreak && day.breakStartTime && day.breakEndTime) {
          if (day.breakEndTime <= day.breakStartTime) {
            setScheduleError(`${day.day}: Break end time must be later than break start time.`);
            return;
          }
        }
      }
    }

    setIsSaving(true);

    setTimeout(() => {
      onUpdateAvailability({
        offersHouseCalls,
        travelFee,
        serviceAreas,
        bufferMinutes,
        operatingHours,
      });
      setIsSaving(false);
      setToastMessage('House call settings and working hours saved successfully.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 350);
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
                  Logistics & Schedule
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                House Calls & Working Hours Availability
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('studio_preview')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-pink-300" />
              <span>Beauty Shop Preview</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Availability'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-3">
        {/* Toast */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {scheduleError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="text-sm font-semibold">{scheduleError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Explicit House-Call Module */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-6 border-b border-stone-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#b86b86] flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#26152d]">
                    House Call & Mobile Artisan Services
                  </h2>
                  <p className="text-xs text-stone-500">
                    Travel to clients' residences, offices, hotels, or bridal venues
                  </p>
                </div>
              </div>

              {/* Master House Call Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={offersHouseCalls}
                  onChange={(e) => setOffersHouseCalls(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-13 h-7 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-3 text-xs font-bold text-stone-800 hidden sm:inline-block">
                  {offersHouseCalls ? 'House Calls Enabled' : 'Disabled (In-Studio Only)'}
                </span>
              </label>
            </div>

            {offersHouseCalls ? (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#b86b86] shrink-0 mt-0.5" />
                  <div className="text-xs text-stone-700 leading-relaxed">
                    <strong className="text-stone-900 block mb-0.5 font-bold">
                      South African Mobile Service Guidelines:
                    </strong>
                    Clients who book house calls pay your base travel fee directly in advance via STENZA Paystack Escrow. You are protected with verified client phone numbers, gated access codes, and cancellation security.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Travel Fee in ZAR */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Base Travel Fee in South African Rand (ZAR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 font-bold text-stone-500 text-sm">R</span>
                      <input
                        type="number"
                        min={0}
                        step={10}
                        required
                        value={travelFee}
                        onChange={(e) => setTravelFee(Number(e.target.value))}
                        className="w-full pl-9 pr-4 py-2.5 font-bold text-stone-900 text-sm border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Standard fee for petrol, toll gates, and mobile kit transit (Typical: R150 - R250)
                    </p>
                  </div>

                  {/* Buffer time */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Travel & Sanitization Buffer (Minutes) *
                    </label>
                    <select
                      value={bufferMinutes}
                      onChange={(e) => setBufferMinutes(Number(e.target.value))}
                      className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:border-[#b86b86] bg-white outline-none"
                    >
                      <option value={15}>15 Minutes Buffer</option>
                      <option value={20}>20 Minutes Buffer</option>
                      <option value={30}>30 Minutes Buffer (Recommended for Sandton/Rosebank traffic)</option>
                      <option value={45}>45 Minutes Buffer</option>
                      <option value={60}>60 Minutes Buffer</option>
                    </select>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Automatically blocks out this buffer between mobile appointments
                    </p>
                  </div>

                  {/* Service Areas */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Covered Neighborhoods & Radius Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceAreas}
                      onChange={(e) => setServiceAreas(e.target.value)}
                      placeholder="e.g. Rosebank, Sandton Central, Hyde Park, Houghton, Melrose Arch (Radius 12km)"
                      className="w-full text-sm px-4 py-2.5 border border-stone-300 rounded-xl focus:border-[#b86b86] outline-none"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Clients outside this boundary will be asked to request a custom quote before confirmation.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500">
                You are currently set to <strong className="text-stone-800">Studio Visits Only</strong>. Clients will visit your physical address ({studio.address || 'set in Profile'}). Toggle the switch above at any time to offer mobile treatments.
              </div>
            )}
          </div>

          {/* Section 2: Weekly Operating Schedule Table with Breaks & Copy Feature */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#26152d]">
                    Working Days & Hours Schedule
                  </h2>
                  <p className="text-xs text-stone-500">
                    Set your standard weekly operating hours, break windows, and unavailable days
                  </p>
                </div>
              </div>

              {/* Copy Hours to Selected Days */}
              <div className="flex items-center gap-2">
                <select
                  value={copySourceDay}
                  onChange={(e) => setCopySourceDay(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg bg-stone-50 text-stone-800 font-medium focus:border-[#b86b86] outline-none"
                  title="Select source day to copy from"
                >
                  {operatingHours.filter(d => d.isOpen).map(d => (
                    <option key={d.day} value={d.day}>Copy from {d.day}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleCopyHoursToAll}
                  className="px-3 py-1.5 bg-[#26152d] hover:bg-[#39263f] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-pink-300" />
                  <span>Copy Hours to Open Days</span>
                </button>
              </div>
            </div>

            {/* Explanatory Policy Notice */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong className="block font-semibold mb-0.5">Scheduling Transparency:</strong>
                These are your usual working hours. Actual appointment availability on the customer booking calendar depends on existing bookings, buffer times, and treatment duration.
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {operatingHours.map((opDay) => (
                <div
                  key={opDay.day}
                  className={`py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                    !opDay.isOpen ? 'opacity-60 bg-stone-50/40 px-3 rounded-xl' : ''
                  }`}
                >
                  {/* Day and Open Toggle */}
                  <div className="flex items-center gap-3 w-48">
                    <input
                      type="checkbox"
                      id={`day-${opDay.day}`}
                      checked={opDay.isOpen}
                      onChange={() => handleToggleDay(opDay.day)}
                      className="w-4 h-4 rounded text-[#b86b86] focus:ring-[#b86b86] cursor-pointer"
                    />
                    <div>
                      <label
                        htmlFor={`day-${opDay.day}`}
                        className="text-sm font-bold text-stone-900 cursor-pointer block"
                      >
                        {opDay.day}
                      </label>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                        opDay.isOpen ? 'text-emerald-700' : 'text-stone-400'
                      }`}>
                        {opDay.isOpen ? 'Working Day' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  {/* Time pickers and breaks */}
                  {opDay.isOpen ? (
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {/* Hours */}
                      <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                        <span className="text-stone-500 font-medium">Hours:</span>
                        <input
                          type="time"
                          value={opDay.openTime}
                          onChange={(e) => handleTimeChange(opDay.day, 'openTime', e.target.value)}
                          className="text-xs px-2 py-1 border border-stone-300 rounded bg-white font-mono font-semibold text-[#26152d] focus:border-[#b86b86] outline-none"
                        />
                        <span className="text-stone-400">to</span>
                        <input
                          type="time"
                          value={opDay.closeTime}
                          onChange={(e) => handleTimeChange(opDay.day, 'closeTime', e.target.value)}
                          className="text-xs px-2 py-1 border border-stone-300 rounded bg-white font-mono font-semibold text-[#26152d] focus:border-[#b86b86] outline-none"
                        />
                      </div>

                      {/* Break Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleBreak(opDay.day)}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            opDay.hasBreak
                              ? 'bg-purple-50 text-purple-900 border-purple-200'
                              : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                          }`}
                        >
                          <Coffee className="w-3.5 h-3.5" />
                          <span>{opDay.hasBreak ? 'Break Enabled' : '+ Add Break'}</span>
                        </button>

                        {opDay.hasBreak && (
                          <div className="flex items-center gap-1 bg-purple-50/70 px-2 py-1 rounded-lg border border-purple-200">
                            <input
                              type="time"
                              value={opDay.breakStartTime || '13:00'}
                              onChange={(e) => handleTimeChange(opDay.day, 'breakStartTime', e.target.value)}
                              className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-purple-200 font-mono"
                            />
                            <span className="text-stone-400 text-[10px]">to</span>
                            <input
                              type="time"
                              value={opDay.breakEndTime || '14:00'}
                              onChange={(e) => handleTimeChange(opDay.day, 'breakEndTime', e.target.value)}
                              className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-purple-200 font-mono"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-400 italic">
                      Unavailable • No appointments accepted
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <button
              type="button"
              onClick={() => onNavigate('artisan_dashboard')}
              className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
            >
              Back to Dashboard
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#b86b86] hover:bg-[#a25974] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
