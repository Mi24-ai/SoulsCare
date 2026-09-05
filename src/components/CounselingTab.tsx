import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Video, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Info,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Counselor, SlidingScaleTier, Booking } from '../types';
import { counselorsData } from '../data/counselors';
import { ConsultationRoomModal } from './ConsultationRoomModal';
import confetti from 'canvas-confetti';

interface CounselingTabProps {
  activeTier: SlidingScaleTier;
  onOpenSlidingScale: () => void;
  onBookingCreated: (booking: Booking) => void;
}

export const CounselingTab: React.FC<CounselingTabProps> = ({
  activeTier,
  onOpenSlidingScale,
  onBookingCreated,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'Video Call' | 'Private Chat' | 'Voice Call'>('Video Call');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('Hari ini');
  const [activeSession, setActiveSession] = useState<Booking | null>(null);
  const [consultationRoomOpen, setConsultationRoomOpen] = useState(false);

  const specialties = [
    'Semua',
    'Quarter-Life Crisis',
    'Burnout Kerja/Skripsi',
    'Toxic Relationship & Heartbreak',
    'Overthinking & Anxiety',
    'Depresi & Mood Disorder',
    'Family Boundaries & Inner Child',
    'ADHD Dewasa',
  ];

  const filteredCounselors = counselorsData.filter((c) => {
    const matchesSpec =
      selectedSpecialty === 'Semua' ||
      c.specializations.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.approach.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesSearch;
  });

  // Calculate sliding scale price
  const calculateFinalPrice = (standardPrice: number) => {
    const discount = activeTier.discountPercentage;
    if (discount >= 100) return 0;
    if (discount <= 0) return standardPrice;
    return Math.round(standardPrice * (1 - discount / 100));
  };

  const handleStartBooking = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setSelectedSlot(counselor.availableSlots[0] || '16:00 - 17:00 WIB');
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedCounselor) return;

    const finalPrice = calculateFinalPrice(selectedCounselor.standardPrice);
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      counselorId: selectedCounselor.id,
      counselorName: selectedCounselor.name,
      counselorTitle: selectedCounselor.title,
      counselorAvatar: selectedCounselor.avatar,
      date: selectedDate,
      timeSlot: selectedSlot,
      type: bookingType,
      originalPrice: selectedCounselor.standardPrice,
      finalPrice,
      discountApplied: activeTier.discountPercentage,
      subsidySource: activeTier.tierName,
      status: 'Confirmed',
    };

    onBookingCreated(newBooking);
    setActiveSession(newBooking);
    setBookingModalOpen(false);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner / Value Proposition */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-[40px] text-white p-6 sm:p-10 shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-indigo-100">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Psikolog & Psikiater Berlisensi HIMPSI / Kemenkes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Konseling Profesional Terjangkau Tanpa Tabu
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 font-medium leading-relaxed">
              Jadwalkan sesi privat 1-on-1 bersama psikolog klinis pilihanmu. Dengan sistem <strong>Sliding-Scale</strong> dan cross-subsidy, biaya konseling disubsidi hingga 85% untuk mahasiswa & pekerja pemula.
            </p>
          </div>

          {/* Active User Tier Pill & Action */}
          <div className="bg-white/15 rounded-3xl p-5 backdrop-blur-md border border-white/20 text-left shrink-0 shadow-lg">
            <div className="text-[11px] text-indigo-100 uppercase font-bold tracking-wider mb-2">
              Tier Subsidimu Saat Ini:
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeTier.badgeColor} shadow-xs`}>
                {activeTier.tierName}
              </span>
              <span className="text-xs font-bold text-amber-300">
                Hemat {activeTier.discountPercentage}%
              </span>
            </div>
            <button
              onClick={onOpenSlidingScale}
              className="text-xs text-white bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Ubah / Ajukan Beasiswa Jiwa</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient Blur */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Active Scheduled Session Notification if any */}
      {activeSession && (
        <div className="p-6 rounded-[32px] bg-[#D1FAE5] border-b-4 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-400 shrink-0 shadow-xs">
              <img 
                src={activeSession.counselorAvatar} 
                alt={activeSession.counselorName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Sesi Siap Dimulai
                </span>
              </div>
              <h4 className="font-bold text-emerald-950 text-base">{activeSession.counselorName}</h4>
              <p className="text-xs font-bold text-emerald-800">
                {activeSession.date} • {activeSession.timeSlot} ({activeSession.type})
              </p>
            </div>
          </div>
          <button
            id="launch-active-session-btn"
            onClick={() => setConsultationRoomOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Video className="w-4 h-4 text-white" />
            <span>Masuk Ruang Konseling Live</span>
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama psikolog, spesialisasi (cth: overthinking, heartbreak, ADHD)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-full border-2 border-indigo-100 text-xs sm:text-sm font-medium text-indigo-950 placeholder-indigo-300 focus:outline-hidden focus:border-indigo-500 shadow-md shadow-indigo-100/40"
          />
        </div>

        {/* Specialty Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-indigo-950 hover:bg-indigo-50 border-2 border-indigo-100 shadow-2xs'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Counselors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCounselors.map((counselor) => {
          const finalPrice = calculateFinalPrice(counselor.standardPrice);
          const hasDiscount = activeTier.discountPercentage > 0;

          return (
            <div
              key={counselor.id}
              id={`counselor-card-${counselor.id}`}
              className="bg-white rounded-[32px] border-2 border-indigo-50 shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:border-indigo-200 transition-all p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Header: Photo & Bio */}
                <div className="flex gap-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-indigo-100 shrink-0 relative shadow-sm">
                    <img 
                      src={counselor.avatar} 
                      alt={counselor.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {counselor.licenseNumber}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{counselor.rating}</span>
                        <span className="text-indigo-300 font-bold">({counselor.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-indigo-950 font-['Outfit',sans-serif] leading-snug">
                      {counselor.name}
                    </h3>
                    <p className="text-xs font-bold text-indigo-400">{counselor.title} • {counselor.experienceYears} thn exp</p>
                  </div>
                </div>

                {/* Education & Bio snippet */}
                <div className="mt-4 space-y-2 text-xs text-indigo-900 font-medium">
                  <div className="flex items-center gap-1.5 text-indigo-500 font-bold">
                    <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">{counselor.education}</span>
                  </div>
                  <p className="leading-relaxed line-clamp-2 text-indigo-950 bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100">
                    "{counselor.bio}"
                  </p>
                </div>

                {/* Specialization Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {counselor.specializations.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-[#F0F2FF] text-indigo-900 border border-indigo-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer: Dynamic Price & Booking Button */}
              <div className="mt-6 pt-4 border-t border-indigo-100 flex items-end justify-between gap-2">
                <div>
                  <div className="text-[11px] text-indigo-400 uppercase font-bold tracking-wider">
                    Biaya per Sesi (50 Menit)
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-indigo-950 font-mono">
                      Rp {finalPrice.toLocaleString('id-ID')}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-indigo-400 line-through font-mono">
                        Rp {counselor.standardPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <span className="text-xs text-emerald-600 font-bold block">
                      Tersubsidi ({activeTier.tierName})
                    </span>
                  )}
                </div>

                <button
                  id={`book-btn-${counselor.id}`}
                  onClick={() => handleStartBooking(counselor)}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Jadwalkan Sesi</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && selectedCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-['Outfit',sans-serif]">
                  Pilih Jadwal & Format Konseling
                </h3>
                <p className="text-xs text-slate-500">Bersama {selectedCounselor.name}</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Type Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Format Sesi Konsultasi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'Video Call' as const, icon: <Video className="w-4 h-4" />, desc: 'Tatap muka visual' },
                    { type: 'Private Chat' as const, icon: <MessageSquare className="w-4 h-4" />, desc: 'Teks terenkripsi' },
                    { type: 'Voice Call' as const, icon: <Phone className="w-4 h-4" />, desc: 'Panggilan suara' },
                  ].map((f) => (
                    <button
                      key={f.type}
                      onClick={() => setBookingType(f.type)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        bookingType === f.type
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                        {f.icon}
                        <span>{f.type}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Pilih Slot Waktu yang Tersedia
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCounselor.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedSlot === slot
                          ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>{slot}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown with Cross-Subsidy Calculation */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Standar Konseling:</span>
                  <span className="font-mono">Rp {selectedCounselor.standardPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Subsidi Silang ({activeTier.tierName}):</span>
                  <span className="font-mono">
                    - Rp {(selectedCounselor.standardPrice - calculateFinalPrice(selectedCounselor.standardPrice)).toLocaleString('id-ID')} ({activeTier.discountPercentage}%)
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total yang Kamu Bayar:</span>
                  <span className="text-teal-700 font-mono">
                    Rp {calculateFinalPrice(selectedCounselor.standardPrice).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2 justify-end">
              <button
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                id="confirm-booking-btn"
                onClick={handleConfirmBooking}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                Konfirmasi & Jadwalkan Sesi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Consultation Room Simulator Modal */}
      {consultationRoomOpen && selectedCounselor && (
        <ConsultationRoomModal
          isOpen={consultationRoomOpen}
          onClose={() => setConsultationRoomOpen(false)}
          booking={activeSession}
          counselor={selectedCounselor}
        />
      )}
    </div>
  );
};
