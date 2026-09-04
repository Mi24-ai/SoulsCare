import React, { useState } from 'react';
import { 
  Percent, 
  X, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  Scale, 
  HeartHandshake, 
  ShieldCheck, 
  HelpCircle,
  FileCheck
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

export const SlidingScaleModal: React.FC<SlidingScaleModalProps> = ({
  isOpen,
  onClose,
  activeTier,
  onSelectTier,
  onOpenPayItForward,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'tiers' | 'assessment' | 'partner'>('tiers');

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
  const [partnerError, setPartnerError] = useState<string | null>(null);

  const verifiedPartnerCodes: Record<string, { campus: string; subsidy: number; desc: string }> = {
    'KAMPUS-UI': { campus: 'Universitas Indonesia (BEM UI x Souls Care Grant)', subsidy: 100, desc: 'Beasiswa 100% Konseling Gratis & Asuransi Mikro didanai Dana Abadi UI.' },
    'ITB-CARE': { campus: 'Institut Teknologi Bandung (Kesejahteraan Mahasiswa ITB)', subsidy: 100, desc: 'Akses Konseling Bebas Biaya 100% untuk seluruh civitas akademika ITB.' },
    'UGM-PEDULI': { campus: 'Universitas Gadjah Mada (UGM Mental Health Initiative)', subsidy: 100, desc: 'Subsidi Penuh 100% didanai Alumni Peduli Jiwa UGM.' },
    'CSR-TELKOM': { campus: 'Telkom Indonesia ESG & CSR Digital Youth', subsidy: 100, desc: 'Grant 100% Konseling Jiwa untuk 1.000 Mahasiswa & Freshgraduate se-Indonesia.' },
    'GENZ-SEHAT': { campus: 'Komunitas Solidaritas Gen Z Indonesia', subsidy: 85, desc: 'Subsidi 85% didanai Pool Donasi Pay-It-Forward Souls Care.' },
  };

  const handleVerifyPartnerCode = () => {
    setPartnerError(null);
    const code = partnerCode.trim().toUpperCase();
    if (verifiedPartnerCodes[code]) {
      const match = verifiedPartnerCodes[code];
      setPartnerVerified(match.campus);

      // Create synthetic institutional tier
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
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      setPartnerError('Kode institusi tidak ditemukan. Coba kode demo: KAMPUS-UI, ITB-CARE, UGM-PEDULI, CSR-TELKOM, atau GENZ-SEHAT.');
    }
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

      // Auto-match tier
      const matchedTier = slidingScaleTiers.find((t) => t.discountPercentage === data.subsidyPercent) || slidingScaleTiers[0];
      onSelectTier(matchedTier);

      confetti({
        particleCount: 60,
        spread: 70,
      });
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
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif]">
                Model Harga Sliding-Scale & Subsidi Silang
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Kesehatan mental berkeadilan: Bayar sesuai kemampuan finansial tanpa penurunan kualitas layanan.
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
        <div className="flex border-b border-indigo-100 bg-[#F0F2FF] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-5 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'tiers'
                ? 'border-indigo-600 text-indigo-950 bg-white rounded-t-2xl shadow-xs'
                : 'border-transparent text-indigo-800 hover:text-indigo-950'
            }`}
          >
            Daftar Tier Subsidi Silang
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-5 py-3 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-5 py-3 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
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
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black">Bagaimana Sistem Subsidi Silang Bekerja?</p>
                  <p className="text-indigo-900/80 mt-0.5 leading-relaxed font-medium">
                    Pengguna berdaya beli stabil (Tier Standar / Patron) dan donatur CSR menyisihkan kontribusi untuk mensubsidi biaya konseling mahasiswa, pencari kerja, dan anak kos (Tier Beasiswa Jiwa) hingga <strong>85% - 100%</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {slidingScaleTiers.map((tier) => {
                  const isActive = activeTier.id === tier.id;
                  const estimatedPrice = Math.round(150000 * (1 - tier.discountPercentage / 100));

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
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full ${tier.badgeColor}`}>
                            {tier.discountPercentage > 0
                              ? `Diskon ${tier.discountPercentage}%`
                              : tier.discountPercentage < 0
                              ? `Patron +25% Donasi`
                              : `Tarif Standar`}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-indigo-700">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Tier Aktif Kamu
                            </span>
                          )}
                        </div>

                        <h3 className="font-black text-indigo-950 text-base font-['Outfit',sans-serif]">
                          {tier.tierName}
                        </h3>
                        <p className="text-xs font-bold text-indigo-400">{tier.targetAudience}</p>
                        <p className="text-xs text-indigo-900 font-medium leading-relaxed bg-[#F0F2FF] p-3 rounded-2xl border border-indigo-50">
                          {tier.description}
                        </p>

                        <div className="pt-2">
                          <span className="text-[10px] text-indigo-400 uppercase font-black tracking-wider block">Estimasi Biaya Konseling:</span>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xl font-black font-mono text-indigo-950">
                              Rp {estimatedPrice.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-indigo-300 line-through font-mono">Rp 150.000</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectTier(tier);
                          confetti({ particleCount: 40, spread: 60 });
                        }}
                        className={`mt-4 w-full py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'bg-[#F0F2FF] hover:bg-indigo-100 text-indigo-950 border border-indigo-100'
                        }`}
                      >
                        {isActive ? 'Tier Aktif Kamu' : 'Pilih Tier Ini'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Pay it forward button */}
              <div className="p-5 bg-amber-50/90 rounded-3xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-amber-950">Ingin Membantu Sesama Teman Gen Z?</h4>
                  <p className="text-xs text-amber-900/80 font-medium mt-0.5">Donasikan sedikit rezeki ke pool dana Beasiswa Jiwa.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPayItForward();
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-indigo-950 text-xs font-black rounded-2xl shadow-md shadow-amber-900/10 transition-all hover:scale-105 cursor-pointer shrink-0"
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
                <h3 className="text-lg font-black text-indigo-950 font-['Outfit',sans-serif]">
                  Kalkulator & Rekomendasi Subsidi AI Souls Care
                </h3>
                <p className="text-xs font-bold text-indigo-400 mt-0.5">
                  AI kami akan menganalisis profil dan kondisi finansialmu untuk merekomendasikan tier subsidi silang yang paling berkeadilan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-indigo-950 block mb-1.5">Profesi / Status:</label>
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
                  <label className="text-xs font-black text-indigo-950 block mb-1.5">Rentang Penghasilan / Uang Saku Bulanan:</label>
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
                <label className="text-xs font-black text-indigo-950 block mb-1.5">Kondisi Tempat Tinggal / Biaya Hidup:</label>
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
                <label className="text-xs font-black text-indigo-950 block mb-1.5">Catatan Beban Finansial / Cerita Tambahan:</label>
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
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isAssessing ? 'AI Sedang Mengevaluasi...' : 'Hitung Rekomendasi Subsidi AI'}</span>
                </button>
              </div>

              {aiAssessmentResult && (
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-200 space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                      Hasil Rekomendasi Evaluasi AI:
                    </span>
                    <span className="text-xs font-black px-3 py-1 bg-indigo-600 text-white rounded-full shadow-xs">
                      Subsidi {aiAssessmentResult.subsidyPercent}% Disetujui
                    </span>
                  </div>
                  <h4 className="text-base font-black text-indigo-950">{aiAssessmentResult.tier}</h4>
                  <p className="text-xs text-indigo-900 font-medium leading-relaxed">{aiAssessmentResult.rationale}</p>
                  <div className="pt-3 border-t border-indigo-200 flex items-center justify-between text-xs font-black">
                    <span className="text-indigo-950">Biaya Rekomendasi per Sesi:</span>
                    <span className="text-lg font-black text-indigo-600 font-mono">
                      Rp {aiAssessmentResult.recommendedPricePerSession?.toLocaleString('id-ID')}
                    </span>
                  </div>
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
                  <h3 className="font-black text-indigo-950 text-sm">Program Kemitraan Kampus & Beasiswa CSR</h3>
                  <p className="text-xs text-indigo-900 font-medium mt-1 leading-relaxed">
                    Jika universitas, BEM, atau perusahaan tempatmu bekerja bermitra dengan Souls Care, masukkan kode kemitraan untuk membuka <strong>100% Voucher Konseling Gratis</strong>.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white rounded-3xl border-2 border-indigo-50 shadow-md shadow-indigo-100/40 space-y-4">
                <label className="text-xs font-black text-indigo-950 block">
                  Masukkan Kode Kemitraan Kampus / Voucher CSR:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value)}
                    placeholder="Contoh: KAMPUS-UI, ITB-CARE, UGM-PEDULI, CSR-TELKOM"
                    className="flex-1 bg-[#F0F2FF] rounded-2xl px-4 py-3 text-xs font-black text-indigo-950 border-2 border-indigo-100 uppercase font-mono tracking-wider focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    id="verify-partner-code-btn"
                    onClick={handleVerifyPartnerCode}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-md shadow-indigo-200 transition-all hover:scale-105 cursor-pointer"
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
                    <div className="flex items-center gap-1.5 font-black text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Kemitraan Terverifikasi: {partnerVerified}</span>
                    </div>
                    <p>Selamat! Hak subsidi beasiswa 100% konseling telah otomatis diaplikasikan ke akunmu.</p>
                  </div>
                )}
              </div>

              {/* Demo Sample Partner Codes for quick testing */}
              <div className="space-y-2">
                <span className="text-[11px] font-black text-indigo-400 uppercase tracking-wider block">
                  Kode Institusi Aktif (Klik untuk coba):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(verifiedPartnerCodes).map(([code, info]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setPartnerCode(code);
                      }}
                      className="p-3.5 rounded-2xl border-2 border-indigo-50 hover:border-indigo-400 bg-[#F0F2FF]/60 hover:bg-white text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs font-black text-indigo-950">
                        <span className="font-mono text-indigo-600">{code}</span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-black">
                          Cover {info.subsidy}%
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-400 font-medium mt-0.5 truncate">{info.campus}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#F0F2FF] border-t border-indigo-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-md shadow-indigo-200 transition-all hover:scale-105 cursor-pointer"
          >
            Selesai & Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};
