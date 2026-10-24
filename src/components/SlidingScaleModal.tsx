import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Building2,
  Scale,
  HeartHandshake,
  ShieldCheck,
  FileCheck,
  Clock,
  Wallet,
} from 'lucide-react';
import { SlidingScaleTier } from '../types';
import { slidingScaleTiers } from '../data/safeSpaceData';
import confetti from 'canvas-confetti';

interface SlidingScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTier: SlidingScaleTier;
  onSelectTier: (tier: SlidingScaleTier) => void;
  onOpenPayItForward: () => void;
}

/* ------------------------------------------------------------------ */
/* Konfigurasi sistem subsidi (data simulasi, hubungkan ke backend)    */
/* ------------------------------------------------------------------ */

// Tarif dasar sesi konseling. Psikolog selalu menerima tarif ini dikurangi komisi platform.
const BASE_PRICE = 150000;

// Saldo pool subsidi silang bulan ini. Jumlah sesi bersubsidi dibatasi oleh saldo ini.
const POOL_STATUS = {
  monthlyBudget: 12000000,
  usedThisMonth: 8700000,
};

// Batas sesi bersubsidi per pengguna agar subsidi merata.
const SUBSIDIZED_SESSION_CAP_PER_SEMESTER = 4;

// Sumber pengisian pool.
const POOL_SOURCES = [
  'Kontribusi tier Patron',
  'Donasi pay-it-forward',
  'CSR kampus & perusahaan',
  'Komisi platform',
];

// Kode kemitraan SIMULASI. Nama institusi sengaja generik; ganti dengan mitra nyata
// hanya setelah ada kesepakatan tertulis. Tiap kode punya kuota sesi bulanan sendiri.
const verifiedPartnerCodes: Record<
  string,
  { campus: string; subsidy: number; desc: string; monthlyQuota: number; usedThisMonth: number }
> = {
  'KAMPUS-A': {
    campus: 'Kampus Mitra A (contoh simulasi)',
    subsidy: 100,
    desc: 'Konseling gratis 100% untuk civitas kampus, didanai kontribusi kampus mitra.',
    monthlyQuota: 80,
    usedThisMonth: 52,
  },
  'KAMPUS-B': {
    campus: 'Kampus Mitra B (contoh simulasi)',
    subsidy: 100,
    desc: 'Akses konseling bebas biaya untuk mahasiswa, didanai dana kesejahteraan kampus.',
    monthlyQuota: 60,
    usedThisMonth: 31,
  },
  'CSR-PERUSAHAAN': {
    campus: 'Perusahaan Mitra CSR (contoh simulasi)',
    subsidy: 100,
    desc: 'Grant konseling 100% untuk penerima program CSR, didanai perusahaan mitra.',
    monthlyQuota: 40,
    usedThisMonth: 12,
  },
  'GENZ-SEHAT': {
    campus: 'Komunitas Solidaritas Gen Z',
    subsidy: 85,
    desc: 'Subsidi 85% didanai pool donasi Pay-It-Forward Souls Care.',
    monthlyQuota: 50,
    usedThisMonth: 20,
  },
  'KAMPUS-PENUH': {
    campus: 'Kampus Mitra C (simulasi kuota habis)',
    subsidy: 100,
    desc: 'Contoh kondisi ketika kuota bulanan mitra sudah terpakai seluruhnya.',
    monthlyQuota: 30,
    usedThisMonth: 30,
  },
};

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

// Nilai subsidi yang harus ditutup pool untuk satu sesi pada tier tertentu.
const subsidyPerSession = (tier: SlidingScaleTier) =>
  tier.discountPercentage > 0 ? Math.round((BASE_PRICE * tier.discountPercentage) / 100) : 0;

export const SlidingScaleModal: React.FC<SlidingScaleModalProps> = ({
  isOpen,
  onClose,
  activeTier,
  onSelectTier,
  onOpenPayItForward,
}) => {
  const [activeTab, setActiveTab] = useState<'tiers' | 'assessment' | 'partner'>('tiers');

  // Verifikasi tier bersubsidi
  const [pendingTier, setPendingTier] = useState<SlidingScaleTier | null>(null);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [waitlistTierId, setWaitlistTierId] = useState<string | null>(null);

  // Assessment Form State
  const [occupation, setOccupation] = useState('Mahasiswa');
  const [incomeRange, setIncomeRange] = useState('< Rp 1.500.000');
  const [livingCondition, setLivingCondition] = useState('Anak Kos / Merantau');
  const [financialNote, setFinancialNote] = useState('');
  const [isAssessing, setIsAssessing] = useState(false);
  const [aiAssessmentResult, setAiAssessmentResult] = useState<any>(null);

  // Partner code state
  const [partnerCode, setPartnerCode] = useState('');
  const [partnerVerified, setPartnerVerified] = useState<string | null>(null);
  const [partnerRemainingQuota, setPartnerRemainingQuota] = useState<number | null>(null);
  const [partnerError, setPartnerError] = useState<string | null>(null);

  // Early return setelah semua hook agar urutan hook selalu sama.
  if (!isOpen) return null;

  const poolRemaining = Math.max(POOL_STATUS.monthlyBudget - POOL_STATUS.usedThisMonth, 0);
  const poolUsedPercent = Math.min(
    Math.round((POOL_STATUS.usedThisMonth / POOL_STATUS.monthlyBudget) * 100),
    100,
  );

  // Perkiraan jumlah sesi yang masih bisa disubsidi pada sebuah tier.
  const remainingSessionsFor = (tier: SlidingScaleTier): number | null => {
    const perSession = subsidyPerSession(tier);
    return perSession > 0 ? Math.floor(poolRemaining / perSession) : null;
  };

  const handleChooseTier = (tier: SlidingScaleTier) => {
    setWaitlistTierId(null);
    if (tier.discountPercentage > 0) {
      // Tier bersubsidi perlu bukti dahulu sebelum diterapkan.
      setPendingTier(tier);
      setProofFileName(null);
      return;
    }
    setPendingTier(null);
    onSelectTier(tier);
    confetti({ particleCount: 40, spread: 60 });
  };

  const handleSubmitProof = () => {
    if (!pendingTier || !proofFileName) return;
    // Di produksi: kirim berkas ke API verifikasi, lalu terapkan setelah disetujui.
    onSelectTier(pendingTier);
    setPendingTier(null);
    setProofFileName(null);
    confetti({ particleCount: 60, spread: 70 });
  };

  const handleVerifyPartnerCode = () => {
    setPartnerError(null);
    setPartnerVerified(null);
    setPartnerRemainingQuota(null);
    const code = partnerCode.trim().toUpperCase();
    const match = verifiedPartnerCodes[code];

    if (!match) {
      setPartnerError(
        'Kode institusi tidak ditemukan. Coba kode simulasi: KAMPUS-A, KAMPUS-B, CSR-PERUSAHAAN, GENZ-SEHAT, atau KAMPUS-PENUH.',
      );
      return;
    }

    const remaining = match.monthlyQuota - match.usedThisMonth;
    if (remaining <= 0) {
      setPartnerError(
        `Kuota bulan ini untuk ${match.campus} sudah habis. Kamu bisa masuk daftar tunggu, atau memakai tier subsidi lain di tab "Daftar Tier".`,
      );
      return;
    }

    setPartnerVerified(match.campus);
    setPartnerRemainingQuota(remaining);

    // Tier institusi sintetis
    const customTier: SlidingScaleTier = {
      id: `partner-${code}`,
      tierName: `Mitra Institusi: ${match.campus.split(' ')[0]}`,
      discountPercentage: match.subsidy,
      targetAudience: `Mahasiswa & Penerima Grant ${match.campus}`,
      description: match.desc,
      requiredProof: 'Terverifikasi via Kode Resmi Kampus / CSR',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-2 ring-emerald-500/20',
    };

    onSelectTier(customTier);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
  };

  const handleRunAiAssessment = async () => {
    setIsAssessing(true);
    try {
      const res = await fetch('/api/ai/sliding-scale-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occupation,
          monthlyIncomeRange: incomeRange,
          livingCondition,
          financialStrainNote: financialNote,
          partnerCode: partnerCode.trim(),
        }),
      });

      const data = await res.json();
      setAiAssessmentResult(data);

      // Cocokkan tier. Tier bersubsidi tetap perlu verifikasi dokumen.
      const matchedTier =
        slidingScaleTiers.find((t) => t.discountPercentage === data.subsidyPercent) ||
        slidingScaleTiers[0];

      if (matchedTier.discountPercentage > 0) {
        setPendingTier(matchedTier);
        setProofFileName(null);
      } else {
        onSelectTier(matchedTier);
      }

      confetti({ particleCount: 60, spread: 70 });
    } catch (e) {
      console.error('Assessment error:', e);
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-indigo-950/70 backdrop-blur-sm animate-in fade-in">
      <div
        id="sliding-scale-modal-dialog"
        className="bg-white rounded-[36px] shadow-2xl border-2 border-indigo-50 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-7 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/20">
              <Scale className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif]">
                Model Harga Sliding-Scale & Subsidi Silang
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Kesehatan mental berkeadilan: bayar sesuai kemampuan finansial tanpa penurunan kualitas layanan.
              </p>
            </div>
          </div>
          <button
            id="close-sliding-scale-modal-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-indigo-100 bg-[#F0F2FF] px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tiers'
                ? 'border-indigo-600 text-indigo-950 bg-white rounded-t-2xl shadow-xs'
                : 'border-transparent text-indigo-800 hover:text-indigo-950'
            }`}
          >
            Daftar Tier Subsidi Silang
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'assessment'
                ? 'border-indigo-600 text-indigo-950 bg-white rounded-t-2xl shadow-xs'
                : 'border-transparent text-indigo-800 hover:text-indigo-950'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Kalkulator & Evaluator AI</span>
          </button>
          <button
            onClick={() => setActiveTab('partner')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'partner'
                ? 'border-indigo-600 text-indigo-950 bg-white rounded-t-2xl shadow-xs'
                : 'border-transparent text-indigo-800 hover:text-indigo-950'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Kemitraan Kampus / CSR</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: TIERS LIST */}
          {activeTab === 'tiers' && (
            <div className="space-y-5">
              {/* Cara kerja */}
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Bagaimana sistem subsidi silang bekerja?</p>
                  <p className="text-indigo-900/80 mt-0.5 leading-relaxed font-medium">
                    Harga sesi dihitung otomatis dari tarif dasar {rupiah(BASE_PRICE)} sesuai tier. Selisihnya
                    ditutup <strong>pool subsidi silang</strong>, sehingga psikolog tetap menerima tarif penuh
                    dikurangi komisi platform.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {POOL_SOURCES.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-indigo-100 text-indigo-900"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status pool */}
              <div className="p-4 bg-white rounded-2xl border-2 border-indigo-50 shadow-md shadow-indigo-100/40 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                    <Wallet className="w-4 h-4 text-indigo-600" />
                    <span>Kuota subsidi bulan ini</span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700">
                    {rupiah(poolRemaining)} tersisa dari {rupiah(POOL_STATUS.monthlyBudget)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-indigo-50 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${poolUsedPercent >= 90 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                    style={{ width: `${poolUsedPercent}%` }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-medium text-indigo-900">
                  <div className="flex items-start gap-1.5 bg-[#F0F2FF] rounded-xl p-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Tier bersubsidi perlu verifikasi dokumen</span>
                  </div>
                  <div className="flex items-start gap-1.5 bg-[#F0F2FF] rounded-xl p-2.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      Maksimal {SUBSIDIZED_SESSION_CAP_PER_SEMESTER} sesi bersubsidi per semester
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 bg-[#F0F2FF] rounded-xl p-2.5">
                    <Wallet className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Jika kuota habis, masuk daftar tunggu atau pilih tier lain</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {slidingScaleTiers.map((tier) => {
                  const isActive = activeTier.id === tier.id;
                  const estimatedPrice = Math.round(BASE_PRICE * (1 - tier.discountPercentage / 100));
                  const remaining = remainingSessionsFor(tier);
                  const quotaFull = remaining !== null && remaining <= 0;
                  const isWaitlisted = waitlistTierId === tier.id;

                  return (
                    <div
                      key={tier.id}
                      id={`tier-card-${tier.id}`}
                      className={`p-6 rounded-[28px] border-2 transition-all flex flex-col justify-between ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100 ring-2 ring-indigo-200'
                          : 'border-indigo-50 bg-white shadow-md shadow-indigo-100/40 hover:border-indigo-200'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${tier.badgeColor}`}>
                            {tier.discountPercentage > 0
                              ? `Diskon ${tier.discountPercentage}%`
                              : tier.discountPercentage < 0
                              ? `Patron +${Math.abs(tier.discountPercentage)}% Donasi`
                              : `Tarif Standar`}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-700">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Tier Aktif Kamu
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-indigo-950 text-base font-['Outfit',sans-serif]">
                          {tier.tierName}
                        </h3>
                        <p className="text-xs font-bold text-indigo-400">{tier.targetAudience}</p>
                        <p className="text-xs text-indigo-900 font-medium leading-relaxed bg-[#F0F2FF] p-3 rounded-2xl border border-indigo-50">
                          {tier.description}
                        </p>

                        {tier.discountPercentage > 0 && (
                          <p className="text-[11px] font-bold text-indigo-800 flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                            Bukti: {tier.requiredProof}
                          </p>
                        )}

                        <div className="pt-2">
                          <span className="text-[11px] text-indigo-400 uppercase font-bold tracking-wider block">
                            Estimasi Biaya Konseling:
                          </span>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xl font-bold font-mono text-indigo-950">
                              {rupiah(estimatedPrice)}
                            </span>
                            {tier.discountPercentage !== 0 && (
                              <span className="text-xs text-indigo-300 line-through font-mono">
                                {rupiah(BASE_PRICE)}
                              </span>
                            )}
                          </div>
                          {remaining !== null && (
                            <p
                              className={`text-[11px] font-bold mt-1 ${
                                quotaFull ? 'text-rose-600' : 'text-emerald-700'
                              }`}
                            >
                              {quotaFull
                                ? 'Kuota bulan ini habis'
                                : `Sisa kuota bulan ini: sekitar ${remaining} sesi`}
                            </p>
                          )}
                        </div>
                      </div>

                      {isWaitlisted && (
                        <p className="mt-3 text-[11px] font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                          Kamu masuk daftar tunggu untuk tier ini. Kami akan memberi tahu saat kuota dibuka, atau
                          kamu bisa memilih tier lain.
                        </p>
                      )}

                      <button
                        onClick={() => (quotaFull ? setWaitlistTierId(tier.id) : handleChooseTier(tier))}
                        disabled={isActive || isWaitlisted}
                        className={`mt-4 w-full py-3 rounded-2xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 cursor-default'
                            : quotaFull
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 cursor-pointer'
                            : 'bg-[#F0F2FF] hover:bg-indigo-100 text-indigo-950 border border-indigo-100 cursor-pointer'
                        }`}
                      >
                        {isActive
                          ? 'Tier Aktif Kamu'
                          : isWaitlisted
                          ? 'Sudah di Daftar Tunggu'
                          : quotaFull
                          ? 'Masuk Daftar Tunggu'
                          : tier.discountPercentage > 0
                          ? 'Pilih Tier & Verifikasi'
                          : 'Pilih Tier Ini'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Panel verifikasi dokumen */}
              {pendingTier && (
                <div className="p-5 bg-white rounded-3xl border-2 border-indigo-300 shadow-lg shadow-indigo-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-950">
                    <FileCheck className="w-5 h-5 text-indigo-600" />
                    <span>Verifikasi untuk {pendingTier.tierName}</span>
                  </div>
                  <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                    Unggah bukti: <strong>{pendingTier.requiredProof}</strong>. Dokumen hanya dipakai untuk
                    memastikan subsidi tepat sasaran dan tidak dibagikan ke psikolog. Subsidi dibatasi{' '}
                    {SUBSIDIZED_SESSION_CAP_PER_SEMESTER} sesi per semester.
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setProofFileName(e.target.files?.[0]?.name ?? null)}
                    className="block w-full text-xs text-indigo-950 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#F0F2FF] file:text-indigo-950 hover:file:bg-indigo-100"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setPendingTier(null);
                        setProofFileName(null);
                      }}
                      className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#F0F2FF] text-indigo-950 border border-indigo-100 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSubmitProof}
                      disabled={!proofFileName}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md transition-all ${
                        proofFileName
                          ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 cursor-pointer'
                          : 'bg-indigo-300 cursor-not-allowed'
                      }`}
                    >
                      Kirim Bukti & Terapkan Tier
                    </button>
                  </div>
                </div>
              )}

              {/* Pay it forward button */}
              <div className="p-5 bg-amber-50/90 rounded-3xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-amber-950">Ingin Membantu Sesama Teman Gen Z?</h4>
                  <p className="text-xs text-amber-900/80 font-medium mt-0.5">
                    Donasikan sedikit rezeki ke pool dana Beasiswa Jiwa agar kuota subsidi bulan depan lebih besar.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPayItForward();
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-indigo-950 text-xs font-bold rounded-2xl shadow-md shadow-amber-900/10 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
                >
                  Donasi ke Pool Komunitas →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI ASSESSMENT */}
          {activeTab === 'assessment' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-indigo-950 font-['Outfit',sans-serif]">
                  Kalkulator & Rekomendasi Subsidi AI Souls Care
                </h3>
                <p className="text-xs font-bold text-indigo-400 mt-0.5">
                  AI menganalisis profil dan kondisi finansialmu untuk merekomendasikan tier yang paling berkeadilan.
                  Hasilnya berupa rekomendasi, subsidi baru berlaku setelah dokumen terverifikasi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-indigo-950 block mb-1.5">Profesi / Status:</label>
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Mahasiswa">Mahasiswa Aktif (S1/D3)</option>
                    <option value="Freshgraduate">Fresh Graduate / Sedang Magang</option>
                    <option value="Pencari Kerja">Pencari Kerja (Jobseeker)</option>
                    <option value="Freelancer">Pekerja Lepas / Gig Economy</option>
                    <option value="Karyawan">Karyawan / Profesional</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                    Rentang Penghasilan / Uang Saku Bulanan:
                  </label>
                  <select
                    value={incomeRange}
                    onChange={(e) => setIncomeRange(e.target.value)}
                    className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="< Rp 1.500.000">&lt; Rp 1.500.000 / bulan</option>
                    <option value="Rp 1.500.000 - Rp 3.500.000">Rp 1.500.000 - Rp 3.500.000 / bulan</option>
                    <option value="Rp 3.500.000 - Rp 6.000.000">Rp 3.500.000 - Rp 6.000.000 / bulan</option>
                    <option value="> Rp 6.000.000">&gt; Rp 6.000.000 / bulan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Kondisi Tempat Tinggal / Biaya Hidup:
                </label>
                <select
                  value={livingCondition}
                  onChange={(e) => setLivingCondition(e.target.value)}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="Anak Kos / Merantau">Anak Kos / Merantau mandiri</option>
                  <option value="Sandwich Generation">Sandwich Generation (Menanggung ortu/adik)</option>
                  <option value="Tinggal Bersama Orang Tua">Tinggal bersama orang tua</option>
                  <option value="Tinggal Sendiri (Kontrak/Rumah)">Tinggal sendiri mandiri</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Catatan Beban Finansial / Cerita Tambahan:
                </label>
                <textarea
                  value={financialNote}
                  onChange={(e) => setFinancialNote(e.target.value)}
                  placeholder="Ceritakan singkat beban biaya yang sedang kamu hadapi (misal: UKT kampus, cicilan keluarga, atau baru terkena lay-off)..."
                  rows={2}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-medium text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  id="run-ai-assessment-btn"
                  onClick={handleRunAiAssessment}
                  disabled={isAssessing}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isAssessing ? 'AI Sedang Mengevaluasi...' : 'Hitung Rekomendasi Subsidi AI'}</span>
                </button>
              </div>

              {aiAssessmentResult && (
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-200 space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Hasil Rekomendasi Evaluasi AI:
                    </span>
                    <span className="text-xs font-bold px-3 py-1 bg-indigo-600 text-white rounded-full shadow-xs">
                      Rekomendasi Subsidi {aiAssessmentResult.subsidyPercent}%
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-indigo-950">{aiAssessmentResult.tier}</h4>
                  <p className="text-xs text-indigo-900 font-medium leading-relaxed">{aiAssessmentResult.rationale}</p>
                  <div className="pt-3 border-t border-indigo-200 flex items-center justify-between text-xs font-bold">
                    <span className="text-indigo-950">Biaya Rekomendasi per Sesi:</span>
                    <span className="text-lg font-bold text-indigo-600 font-mono">
                      Rp {aiAssessmentResult.recommendedPricePerSession?.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {pendingTier && (
                    <button
                      onClick={() => setActiveTab('tiers')}
                      className="w-full py-2.5 rounded-2xl text-xs font-bold bg-white text-indigo-950 border border-indigo-200 hover:bg-indigo-50 cursor-pointer"
                    >
                      Lanjut ke Verifikasi Dokumen
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CAMPUS & CSR INSTITUTIONAL PARTNERSHIP */}
          {activeTab === 'partner' && (
            <div className="space-y-5">
              <div className="flex items-start gap-3.5 p-5 bg-[#F0F2FF] rounded-3xl border border-indigo-100">
                <Building2 className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-indigo-950 text-sm">Program Kemitraan Kampus & Beasiswa CSR</h3>
                  <p className="text-xs text-indigo-900 font-medium mt-1 leading-relaxed">
                    Jika kampus atau perusahaanmu bermitra dengan Souls Care, masukkan kode kemitraan untuk membuka
                    konseling bersubsidi penuh. Dana berasal dari kontribusi institusi mitra, dengan{' '}
                    <strong>kuota sesi bulanan</strong> untuk setiap mitra agar sistem tetap berkelanjutan.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white rounded-3xl border-2 border-indigo-50 shadow-md shadow-indigo-100/40 space-y-4">
                <label className="text-xs font-bold text-indigo-950 block">
                  Masukkan Kode Kemitraan Kampus / Voucher CSR:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value)}
                    placeholder="Contoh simulasi: KAMPUS-A, KAMPUS-B, CSR-PERUSAHAAN"
                    className="flex-1 bg-[#F0F2FF] rounded-2xl px-4 py-3 text-xs font-bold text-indigo-950 border-2 border-indigo-100 uppercase font-mono tracking-wider focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    id="verify-partner-code-btn"
                    onClick={handleVerifyPartnerCode}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Verifikasi Kode
                  </button>
                </div>

                {partnerError && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-200 font-medium">
                    {partnerError}
                  </p>
                )}

                {partnerVerified && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-xs text-emerald-950 space-y-1 font-medium">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Kemitraan Terverifikasi: {partnerVerified}</span>
                    </div>
                    <p>
                      Hak subsidi konseling telah diterapkan ke akunmu. Sisa kuota mitra bulan ini:{' '}
                      <strong>{partnerRemainingQuota} sesi</strong>. Subsidi dibatasi{' '}
                      {SUBSIDIZED_SESSION_CAP_PER_SEMESTER} sesi per pengguna per semester.
                    </p>
                  </div>
                )}
              </div>

              {/* Kode simulasi dengan sisa kuota */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Kode Simulasi (klik untuk coba):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(verifiedPartnerCodes).map(([code, info]) => {
                    const remaining = info.monthlyQuota - info.usedThisMonth;
                    return (
                      <button
                        key={code}
                        onClick={() => setPartnerCode(code)}
                        className="p-3.5 rounded-2xl border-2 border-indigo-50 hover:border-indigo-400 bg-[#F0F2FF]/60 hover:bg-white text-left transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                          <span className="font-mono text-indigo-600">{code}</span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                              remaining > 0 ? 'text-emerald-800 bg-emerald-100' : 'text-rose-800 bg-rose-100'
                            }`}
                          >
                            {remaining > 0 ? `Cover ${info.subsidy}% · sisa ${remaining} sesi` : 'Kuota habis'}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-400 font-medium mt-0.5 truncate">{info.campus}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#F0F2FF] border-t border-indigo-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Selesai & Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};
