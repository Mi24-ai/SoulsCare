import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Upload, 
  Clock, 
  ArrowRight, 
  Shield, 
  AlertCircle,
  Zap,
  Receipt
} from 'lucide-react';
import { InsurancePolicy, InsuranceClaim } from '../types';
import { insurancePoliciesData } from '../data/safeSpaceData';
import confetti from 'canvas-confetti';

export const SoulProtectTab: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly'>('monthly');
  const [activePolicyId, setActivePolicyId] = useState<string>('p2'); // Default active: SoulCare Plus
  const [claims, setClaims] = useState<InsuranceClaim[]>([
    {
      id: 'claim-101',
      policyName: 'SoulCare Plus',
      category: 'Konsultasi Psikolog',
      amount: 150000,
      status: 'Disbursed',
      date: '24 Agt 2026',
      receiptNumber: 'INV-SC-99824',
      notes: 'Klaim sesi konseling klinis darurat bersama Dian Paramitha, M.Psi.',
    },
    {
      id: 'claim-102',
      policyName: 'SoulCare Plus',
      category: 'Resep Psikiater',
      amount: 280000,
      status: 'Approved',
      date: '28 Agt 2026',
      receiptNumber: 'INV-RSJ-44120',
      notes: 'Penggantian resep farmakoterapi tidur & antidepresan.',
    },
  ]);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimCategory, setClaimCategory] = useState<'Konsultasi Psikolog' | 'Resep Psikiater' | 'Darurat Krisis'>('Konsultasi Psikolog');
  const [claimAmount, setClaimAmount] = useState('150000');
  const [claimNotes, setClaimNotes] = useState('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  const activePolicy = insurancePoliciesData.find((p) => p.id === activePolicyId) || insurancePoliciesData[1];

  const handleSelectPolicy = (policy: InsurancePolicy) => {
    setActivePolicyId(policy.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleSimulateClaim = () => {
    if (!claimAmount || isSubmittingClaim) return;

    setIsSubmittingClaim(true);
    setTimeout(() => {
      const newClaim: InsuranceClaim = {
        id: `claim-${Date.now().toString().slice(-4)}`,
        policyName: activePolicy.name,
        category: claimCategory,
        amount: Number(claimAmount) || 150000,
        status: 'Approved',
        date: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        receiptNumber: `INV-DIGITAL-${Math.floor(10000 + Math.random() * 90000)}`,
        notes: claimNotes || `Klaim penggantian ${claimCategory} melalui SoulProtect Fast-Track`,
      };

      setClaims([newClaim, ...claims]);
      setIsSubmittingClaim(false);
      setClaimModalOpen(false);
      setClaimNotes('');

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-[40px] text-white p-6 sm:p-10 shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest text-indigo-100">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Mikro-Asuransi Kesehatan Mental Pertama untuk Gen Z</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              SoulProtect: Proteksi Jiwa Mulai Rp 1.500/Minggu
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 font-medium leading-relaxed">
              Kesehatan mental tak boleh jadi beban finansial. Lindungi dirimu dari biaya konseling dan resep obat psikiatri darurat dengan premi mikro super terjangkau.
            </p>
          </div>

          {/* Quick Submit Claim CTA */}
          <div className="bg-white/15 rounded-3xl p-5 backdrop-blur-md border border-white/20 text-left shrink-0 shadow-lg max-w-xs">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300 mb-1">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Klaim Instan 1-Klik</span>
            </div>
            <p className="text-xs text-indigo-100 font-medium mb-3">
              Unggah struk konseling/resep obat dan klaim langsung cair ke rekening / e-wallet.
            </p>
            <button
              id="open-claim-modal-btn"
              onClick={() => setClaimModalOpen(true)}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black text-xs rounded-2xl shadow-md shadow-amber-900/20 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Ajukan Reimburse Sekarang</span>
            </button>
          </div>
        </div>

        {/* Ambient Blur */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Active Coverage Summary Box */}
      <div className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-8 shadow-xl shadow-indigo-100/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-indigo-950 text-lg">{activePolicy.name}</h3>
                <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                  Aktif & Terlindungi
                </span>
              </div>
              <p className="text-xs font-bold text-indigo-400 mt-0.5">{activePolicy.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] text-indigo-400 uppercase font-black tracking-wider">Sisa Limit Klaim Tahunan</div>
              <div className="text-xl font-black text-indigo-600 font-mono">
                Rp {activePolicy.claimLimitPerYear.toLocaleString('id-ID')}
              </div>
            </div>
            <button
              onClick={() => setClaimModalOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-md shadow-indigo-200 transition-all hover:scale-105 cursor-pointer"
            >
              + Ajukan Klaim
            </button>
          </div>
        </div>

        {/* Coverage Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
          <div className="p-4 bg-[#F0F2FF] rounded-2xl border-2 border-indigo-100">
            <span className="text-[10px] uppercase font-black text-indigo-400 block mb-1">Konseling Psikolog</span>
            <p className="font-black text-indigo-950">{activePolicy.counselingCoverage}</p>
          </div>
          <div className="p-4 bg-[#F0F2FF] rounded-2xl border-2 border-indigo-100">
            <span className="text-[10px] uppercase font-black text-indigo-400 block mb-1">Resep Obat Psikiater</span>
            <p className="font-black text-indigo-950">{activePolicy.psychiatristMedCoverage}</p>
          </div>
          <div className="p-4 bg-[#F0F2FF] rounded-2xl border-2 border-indigo-100">
            <span className="text-[10px] uppercase font-black text-indigo-400 block mb-1">Hotline & Mediasi Darurat</span>
            <p className="font-black text-indigo-950">{activePolicy.emergencyCrisisCoverage}</p>
          </div>
        </div>
      </div>

      {/* Plan Selection Tiers */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black font-['Outfit',sans-serif] text-indigo-950">
              Pilihan Paket Mikro-Proteksi Souls Care
            </h2>
            <p className="text-xs font-bold text-indigo-400">Pilih durasi mingguan atau bulanan yang paling fleksibel untukmu</p>
          </div>

          {/* Weekly / Monthly Toggle */}
          <div className="flex items-center p-1.5 bg-[#F0F2FF] rounded-full border-2 border-indigo-100 w-fit">
            <button
              onClick={() => setBillingCycle('weekly')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                billingCycle === 'weekly' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-indigo-900 hover:bg-white'
              }`}
            >
              Mikro Mingguan (Mulai Rp 1.500)
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-indigo-900 hover:bg-white'
              }`}
            >
              Bulanan Hemat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insurancePoliciesData.map((policy) => {
            const isSelected = activePolicyId === policy.id;
            const price = billingCycle === 'weekly' ? policy.weeklyPrice : policy.monthlyPrice;

            return (
              <div
                key={policy.id}
                id={`policy-card-${policy.id}`}
                className={`rounded-[36px] border-2 p-6 sm:p-7 flex flex-col justify-between transition-all bg-white ${
                  isSelected
                    ? 'border-indigo-600 shadow-xl shadow-indigo-100 ring-2 ring-indigo-200'
                    : 'border-indigo-50 shadow-lg shadow-indigo-100/40 hover:border-indigo-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-indigo-950 text-lg font-['Outfit',sans-serif]">
                      {policy.name}
                    </h3>
                    {policy.isPopular && (
                      <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-[10px] font-black border border-pink-200">
                        Paling Favorit
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-indigo-400 mb-4">{policy.tagline}</p>

                  {/* Price */}
                  <div className="mb-6 pb-4 border-b border-indigo-50">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-indigo-950 font-mono">
                        Rp {price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs font-bold text-indigo-400">/{billingCycle === 'weekly' ? 'minggu' : 'bulan'}</span>
                    </div>
                    <span className="text-[11px] text-indigo-600 font-bold mt-1 block">
                      Limit Klaim: Rp {policy.claimLimitPerYear.toLocaleString('id-ID')} / thn
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 text-xs text-indigo-900 font-medium mb-6">
                    {policy.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPolicy(policy)}
                  className={`w-full py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-[#F0F2FF] hover:bg-indigo-100 text-indigo-950 border border-indigo-100'
                  }`}
                >
                  {isSelected ? 'Paket Aktif Kamu' : 'Pilih Paket Ini'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Claims History */}
      <div className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-8 shadow-xl shadow-indigo-100/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-indigo-950 text-lg font-['Outfit',sans-serif]">
              Riwayat Klaim & Reimbursement Digital
            </h3>
            <p className="text-xs font-bold text-indigo-400">Transparan, cepat, dan terhubung langsung ke e-wallet</p>
          </div>
          <button
            onClick={() => setClaimModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-md shadow-indigo-200 cursor-pointer"
          >
            + Klaim Baru
          </button>
        </div>

        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="p-4 sm:p-5 rounded-2xl border-2 border-indigo-50 bg-[#F0F2FF]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-white border border-indigo-100 text-indigo-600 shadow-2xs">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-indigo-950">{claim.category}</span>
                    <span className="text-[10px] text-indigo-400 font-mono">{claim.receiptNumber}</span>
                  </div>
                  <p className="text-indigo-900 font-medium mt-0.5">{claim.notes}</p>
                  <span className="text-[10px] font-bold text-indigo-300">{claim.date}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                <span className="font-mono font-black text-sm text-indigo-950">
                  Rp {claim.amount.toLocaleString('id-ID')}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  claim.status === 'Disbursed'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                }`}>
                  {claim.status === 'Disbursed' ? 'Dana Dicairkan' : 'Disetujui'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instant Claim Submission Modal */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[36px] shadow-2xl border-2 border-indigo-50 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-indigo-50 bg-[#F0F2FF] flex items-center justify-between">
              <div>
                <h3 className="font-black text-indigo-950 text-lg font-['Outfit',sans-serif]">
                  Pengajuan Klaim Reimburse Digital
                </h3>
                <p className="text-xs font-bold text-indigo-400">Didukung perlindungan {activePolicy.name}</p>
              </div>
              <button
                onClick={() => setClaimModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-indigo-400 hover:text-indigo-950 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Category */}
              <div>
                <label className="text-xs font-black text-indigo-950 block mb-1.5">
                  Kategori Pengeluaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Konsultasi Psikolog', 'Resep Psikiater', 'Darurat Krisis'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setClaimCategory(cat)}
                      className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer ${
                        claimCategory === cat
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-black ring-2 ring-indigo-200'
                          : 'border-indigo-50 hover:bg-[#F0F2FF] text-indigo-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nominal */}
              <div>
                <label className="text-xs font-black text-indigo-950 block mb-1.5">
                  Nominal Klaim (Rupiah)
                </label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-black text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500 font-mono"
                  placeholder="150000"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-black text-indigo-950 block mb-1.5">
                  Nama Klinik / Psikolog / Catatan
                </label>
                <input
                  type="text"
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder="Misal: Konseling klinis HIMPSI atau Resep RSJ"
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-medium text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* File Upload Simulator Box */}
              <div>
                <label className="text-xs font-black text-indigo-950 block mb-1.5">
                  Unggah Bukti Struk / Invoice Pembayaran
                </label>
                <div className="p-5 border-2 border-dashed border-indigo-200 rounded-3xl text-center bg-[#F0F2FF]/50 hover:bg-[#F0F2FF] cursor-pointer">
                  <Upload className="w-7 h-7 text-indigo-400 mx-auto mb-1.5" />
                  <p className="text-xs text-indigo-950 font-bold">
                    Tarik dan lepas file foto struk atau <span className="text-indigo-600 underline">pilih file</span>
                  </p>
                  <p className="text-[10px] text-indigo-400 mt-1 font-medium">Mendukung JPG, PNG, PDF (maks 5MB)</p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-indigo-50 bg-[#F0F2FF] flex gap-3 justify-end">
              <button
                onClick={() => setClaimModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-xs font-black text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                id="submit-claim-confirm-btn"
                onClick={handleSimulateClaim}
                disabled={isSubmittingClaim}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-indigo-200 transition-all hover:scale-105 cursor-pointer"
              >
                {isSubmittingClaim ? 'Memvalidasi Klaim...' : 'Kirim Klaim Instan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
