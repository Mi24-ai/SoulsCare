
import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Upload,
  Shield,
  AlertCircle,
  Receipt,
  Handshake,
  Smartphone,
  ChartNoAxesCombined,
  Info,
} from 'lucide-react';
import { InsurancePolicy, InsuranceClaim } from '../types';
import { insurancePoliciesData } from '../data/safeSpaceData';

export const SoulProtectTab: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly'>(
    'monthly'
  );

  const [activePolicyId, setActivePolicyId] = useState<string>('p2');

  const [claims, setClaims] = useState<InsuranceClaim[]>([
    {
      id: 'demo-101',
      policyName: 'SoulCare Plus',
      category: 'Konsultasi Psikolog',
      amount: 150000,
      status: 'Approved',
      date: 'Contoh simulasi',
      receiptNumber: 'DEMO-SC-001',
      notes:
        'Contoh alur pengajuan biaya konsultasi psikolog. Bukan klaim sungguhan.',
    },
    {
      id: 'demo-102',
      policyName: 'SoulCare Plus',
      category: 'Resep Psikiater',
      amount: 280000,
      status: 'Approved',
      date: 'Contoh simulasi',
      receiptNumber: 'DEMO-SC-002',
      notes:
        'Contoh data pengajuan biaya layanan kesehatan mental untuk demonstrasi.',
    },
  ]);

  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const [claimCategory, setClaimCategory] = useState<
    'Konsultasi Psikolog' | 'Resep Psikiater' | 'Darurat Krisis'
  >('Konsultasi Psikolog');

  const [claimAmount, setClaimAmount] = useState('150000');
  const [claimNotes, setClaimNotes] = useState('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimError, setClaimError] = useState('');

  const activePolicy =
    insurancePoliciesData.find((p) => p.id === activePolicyId) ||
    insurancePoliciesData[1] ||
    insurancePoliciesData[0];

  const handleSelectPolicy = (policy: InsurancePolicy) => {
    setActivePolicyId(policy.id);
  };

  const handleSimulateClaim = () => {
    const amount = Number(claimAmount);

    if (!claimAmount || !Number.isFinite(amount) || amount <= 0) {
      setClaimError('Masukkan nominal simulasi yang valid.');
      return;
    }

    if (isSubmittingClaim) return;

    setClaimError('');
    setIsSubmittingClaim(true);

    // Simulasi antarmuka lokal.
    // Tidak mengirim klaim ke perusahaan asuransi dan tidak mencairkan dana.
    setTimeout(() => {
      const newClaim: InsuranceClaim = {
        id: `demo-${Date.now()}`,
        policyName: activePolicy.name,
        category: claimCategory,
        amount,
        status: 'Approved',
        date: 'Simulasi pengajuan',
        receiptNumber: `DEMO-${Date.now().toString().slice(-6)}`,
        notes:
          claimNotes.trim() ||
          `Contoh pengajuan biaya ${claimCategory}. Belum dikirim ke perusahaan asuransi.`,
      };

      setClaims((previousClaims) => [newClaim, ...previousClaims]);
      setIsSubmittingClaim(false);
      setClaimModalOpen(false);
      setClaimNotes('');
      setClaimAmount('150000');
      setClaimError('');

      window.alert(
        'Simulasi berhasil ditampilkan. Ini bukan pengajuan klaim asuransi sebenarnya dan tidak menghasilkan pencairan dana.'
      );
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Banner Utama */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-[40px] text-white p-6 sm:p-10 shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-indigo-100">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Konsep Asuransi Mikro Kesehatan Mental</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              SoulProtect: Rancangan Perlindungan Finansial Kesehatan Mental
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 font-medium leading-relaxed">
              Kesehatan mental layak mendapat perlindungan yang terjangkau.
              SoulProtect dirancang untuk membantu pengguna mempersiapkan
              biaya layanan kesehatan mental melalui produk asuransi yang
              akan dikembangkan bersama mitra asuransi berizin.
            </p>

            <div className="flex items-start gap-2 text-xs text-indigo-100/80 leading-relaxed">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                Harga, limit, dan manfaat pada halaman ini merupakan simulasi,
                bukan penawaran polis asuransi resmi.
              </p>
            </div>
          </div>

          {/* Tombol Simulasi Klaim */}
          <div className="bg-white/15 rounded-3xl p-5 backdrop-blur-md border border-white/20 text-left shrink-0 shadow-lg max-w-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
              <FileText className="w-4 h-4" />
              <span>Simulasi Pengajuan Klaim</span>
            </div>

            <p className="text-xs text-indigo-100 font-medium mb-3 leading-relaxed">
              Lihat bagaimana alur pengajuan klaim digital direncanakan
              bekerja. Persetujuan dan pembayaran nantinya mengikuti
              ketentuan polis mitra asuransi.
            </p>

            <button
              id="open-claim-modal-btn"
              onClick={() => setClaimModalOpen(true)}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Coba Simulasi Klaim</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Ringkasan Paket */}
      <div className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-8 shadow-xl shadow-indigo-100/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Shield className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-indigo-950 text-lg">
                  {activePolicy.name}
                </h3>

                <span className="px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider border border-amber-200">
                  Paket Simulasi
                </span>
              </div>

              <p className="text-xs font-bold text-indigo-400 mt-0.5">
                {activePolicy.tagline}
              </p>

              <p className="text-[11px] text-indigo-400 mt-1">
                Pratinjau paket, bukan polis aktif.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[11px] text-indigo-400 uppercase font-bold tracking-wider">
                Ilustrasi Limit Tahunan
              </div>

              <div className="text-xl font-bold text-indigo-600 font-mono">
                Rp{' '}
                {activePolicy.claimLimitPerYear.toLocaleString('id-ID')}
              </div>

              <p className="text-[10px] text-indigo-400 mt-1">
                Belum menjadi manfaat polis resmi
              </p>
            </div>

            <button
              onClick={() => setClaimModalOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Lihat Simulasi Klaim
            </button>
          </div>
        </div>

        {/* Ilustrasi Manfaat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
          <div className="p-4 bg-[#F0F2FF] rounded-2xl border-2 border-indigo-100">
            <span className="text-[11px] uppercase font-bold text-indigo-400 block mb-1">
              Konseling Psikolog
            </span>
            <p className="font-bold text-indigo-950">
              {activePolicy.counselingCoverage}
            </p>
          </div>

          <div className="p-4 bg-[#F0F2FF] rounded-2xl border-2 border-indigo-100">
            <span className="text-[11px] uppercase font-bold text-indigo-400 block mb-1">
              Resep Obat Psikiater
            </span>
            <p className="font-bold text-indigo-950">
              {activePolicy.psychiatristMedCoverage}
            </p>
          </div>

          <div className="p-4 bg-[#F0F2FF] rounded-2xl border-2 border-indigo-100">
            <span className="text-[11px] uppercase font-bold text-indigo-400 block mb-1">
              Dukungan Krisis
            </span>
            <p className="font-bold text-indigo-950">
              {activePolicy.emergencyCrisisCoverage}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Catatan:</strong> rincian manfaat di atas merupakan
          rancangan awal. Ketersediaan, batas perlindungan, pengecualian,
          dan mekanisme klaim akan mengikuti produk dan ketentuan yang
          disepakati bersama mitra asuransi.
        </div>
      </div>

      {/* Pilihan Paket */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-indigo-950">
              Pilihan Paket Simulasi SoulProtect
            </h2>

            <p className="text-xs font-bold text-indigo-400 mt-1">
              Ilustrasi harga dan manfaat untuk pengembangan produk bersama
              mitra asuransi.
            </p>
          </div>

          {/* Toggle Periode */}
          <div className="flex items-center p-1.5 bg-[#F0F2FF] rounded-full border-2 border-indigo-100 w-fit max-w-full">
            <button
              onClick={() => setBillingCycle('weekly')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'weekly'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-indigo-900 hover:bg-white'
              }`}
            >
              Mingguan
            </button>

            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-indigo-900 hover:bg-white'
              }`}
            >
              Bulanan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insurancePoliciesData.map((policy) => {
            const isSelected = activePolicyId === policy.id;

            const price =
              billingCycle === 'weekly'
                ? policy.weeklyPrice
                : policy.monthlyPrice;

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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-indigo-950 text-lg font-['Outfit',sans-serif]">
                      {policy.name}
                    </h3>

                    {policy.isPopular && (
                      <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-[11px] font-bold border border-pink-200 shrink-0">
                        Rekomendasi
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-indigo-400 mb-4">
                    {policy.tagline}
                  </p>

                  {/* Harga Simulasi */}
                  <div className="mb-6 pb-4 border-b border-indigo-50">
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-3xl font-bold text-indigo-950 font-mono">
                        Rp {price.toLocaleString('id-ID')}
                      </span>

                      <span className="text-xs font-bold text-indigo-400">
                        /{billingCycle === 'weekly' ? 'minggu' : 'bulan'}
                      </span>
                    </div>

                    <span className="text-xs text-indigo-600 font-bold mt-2 block">
                      Ilustrasi limit: Rp{' '}
                      {policy.claimLimitPerYear.toLocaleString('id-ID')} / tahun
                    </span>

                    <p className="text-[10px] text-indigo-400 mt-2 leading-relaxed">
                      Harga dan limit masih berupa simulasi, bukan premi
                      atau manfaat polis yang telah ditetapkan.
                    </p>
                  </div>

                  {/* Rancangan Manfaat */}
                  <div className="space-y-3 text-xs text-indigo-900 font-medium mb-6">
                    {policy.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPolicy(policy)}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-[#F0F2FF] hover:bg-indigo-100 text-indigo-950 border border-indigo-100'
                  }`}
                >
                  {isSelected
                    ? 'Paket Simulasi Dipilih'
                    : 'Lihat Paket Ini'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl border border-indigo-100 bg-white text-xs text-indigo-700 leading-relaxed">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Seluruh paket merupakan rancangan untuk demonstrasi prototipe.
              Harga, manfaat, limit, dan mekanisme pembayaran final akan
              ditentukan setelah evaluasi produk dan kesepakatan dengan
              mitra asuransi berizin.
            </p>
          </div>
        </div>
      </div>

      {/* Model Kerja Sama */}
      <div className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-8 shadow-xl shadow-indigo-100/60 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Handshake className="w-4 h-4" />
            Model Kemitraan
          </div>

          <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-indigo-950">
            Bagaimana SoulProtect Direncanakan Bekerja?
          </h2>

          <p className="text-sm text-indigo-500 mt-2 leading-relaxed">
            SoulProtect dirancang sebagai bagian dari ekosistem digital
            Souls Care, dengan perlindungan asuransi yang direncanakan
            melalui kerja sama dengan perusahaan asuransi berizin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-[#F0F2FF] border border-indigo-100">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-indigo-600 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-indigo-950 mb-2">
              1. Mitra Asuransi
            </h3>

            <p className="text-xs text-indigo-700 leading-relaxed">
              Mitra direncanakan menyediakan produk asuransi, menentukan
              ketentuan polis, mengevaluasi klaim, dan membayar klaim
              yang disetujui sesuai ketentuan.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#F0F2FF] border border-indigo-100">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-indigo-600 mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-indigo-950 mb-2">
              2. Platform Souls Care
            </h3>

            <p className="text-xs text-indigo-700 leading-relaxed">
              Souls Care dirancang untuk membantu pengguna mengakses
              informasi produk dan alur layanan digital sesuai ruang
              lingkup kerja sama dengan mitra.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#F0F2FF] border border-indigo-100">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-indigo-600 mb-4">
              <ChartNoAxesCombined className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-indigo-950 mb-2">
              3. Rencana Pendapatan
            </h3>

            <p className="text-xs text-indigo-700 leading-relaxed">
              Souls Care akan menjajaki komisi atau fee layanan dari
              mitra. Asumsi awal sebesar 1% dari nilai klaim yang
              dibayarkan masih perlu dinegosiasikan dan disepakati.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Catatan kemitraan:</strong> skema fee 1% bukan potongan
          otomatis dari uang klaim pengguna. Pembayaran fee, dasar
          perhitungan, dan mekanismenya harus disepakati dalam perjanjian
          dengan mitra serta memenuhi ketentuan yang berlaku. Kemitraan
          dan skema pendapatan pada halaman ini masih berupa rencana.
        </div>
      </div>

      {/* Riwayat Simulasi */}
      <div className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-8 shadow-xl shadow-indigo-100/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-indigo-950 text-lg font-['Outfit',sans-serif]">
              Pratinjau Riwayat Pengajuan Klaim
            </h3>

            <p className="text-xs font-bold text-indigo-400 mt-1">
              Contoh data untuk demonstrasi antarmuka SoulProtect
            </p>
          </div>

          <button
            onClick={() => setClaimModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-200 cursor-pointer"
          >
            + Coba Simulasi
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Data simulasi:</strong> nominal, nomor referensi, tanggal,
          dan status di bawah ini hanya contoh antarmuka. Data ini bukan
          klaim asuransi nyata, bukan bukti persetujuan mitra, dan tidak
          menunjukkan bahwa dana telah dicairkan.
        </div>

        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="p-4 sm:p-5 rounded-2xl border-2 border-indigo-50 bg-[#F0F2FF]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-white border border-indigo-100 text-indigo-600 shadow-sm">
                  <Receipt className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-indigo-950">
                      {claim.category}
                    </span>

                    <span className="text-[11px] text-indigo-400 font-mono">
                      {claim.receiptNumber}
                    </span>
                  </div>

                  <p className="text-indigo-900 font-medium mt-1 leading-relaxed">
                    {claim.notes}
                  </p>

                  <span className="text-[11px] font-bold text-indigo-400 block mt-1">
                    {claim.date}
                  </span>

                  <span className="inline-flex mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Contoh Simulasi
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                <span className="font-mono font-bold text-sm text-indigo-950">
                  Rp {claim.amount.toLocaleString('id-ID')}
                </span>

                <span className="text-[10px] text-indigo-400">
                  Nominal ilustratif
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Simulasi Klaim */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-[36px] shadow-2xl border-2 border-indigo-50 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-indigo-50 bg-[#F0F2FF] flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-indigo-950 text-lg font-['Outfit',sans-serif]">
                  Simulasi Pengajuan Klaim
                </h3>

                <p className="text-xs font-bold text-indigo-400 mt-1">
                  Pratinjau alur untuk paket {activePolicy.name}
                </p>
              </div>

              <button
                onClick={() => {
                  setClaimModalOpen(false);
                  setClaimError('');
                }}
                aria-label="Tutup modal"
                className="w-8 h-8 shrink-0 rounded-full bg-white text-indigo-400 hover:text-indigo-950 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Mode demonstrasi.</strong> Formulir ini tidak
                mengirimkan klaim ke perusahaan asuransi, tidak mengaktifkan
                polis, dan tidak memproses pembayaran.
              </div>

              {/* Kategori */}
              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Kategori Pengeluaran
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'Konsultasi Psikolog',
                      'Resep Psikiater',
                      'Darurat Krisis',
                    ] as const
                  ).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setClaimCategory(category)}
                      className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer ${
                        claimCategory === category
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-200'
                          : 'border-indigo-50 hover:bg-[#F0F2FF] text-indigo-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nominal */}
              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Nominal Simulasi (Rupiah)
                </label>

                <input
                  type="number"
                  min="1"
                  value={claimAmount}
                  onChange={(event) => {
                    setClaimAmount(event.target.value);
                    setClaimError('');
                  }}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="150000"
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Nama Layanan / Catatan Contoh
                </label>

                <input
                  type="text"
                  value={claimNotes}
                  onChange={(event) => setClaimNotes(event.target.value)}
                  placeholder="Contoh: biaya konsultasi psikolog"
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-medium text-indigo-950 border-2 border-indigo-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Placeholder Upload */}
              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Bukti Pengeluaran
                </label>

                <div className="p-5 border-2 border-dashed border-indigo-200 rounded-3xl text-center bg-[#F0F2FF]/50">
                  <Upload className="w-7 h-7 text-indigo-400 mx-auto mb-1.5" />

                  <p className="text-xs text-indigo-950 font-bold">
                    Pratinjau area unggah bukti
                  </p>

                  <p className="text-[11px] text-indigo-400 mt-1 font-medium leading-relaxed">
                    Fitur unggah dan validasi dokumen belum diaktifkan
                    pada prototipe ini.
                  </p>
                </div>
              </div>

              {claimError && (
                <div
                  role="alert"
                  className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{claimError}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-indigo-50 bg-[#F0F2FF] flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setClaimModalOpen(false);
                  setClaimError('');
                }}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-100 cursor-pointer"
              >
                Batal
              </button>

              <button
                id="submit-claim-confirm-btn"
                onClick={handleSimulateClaim}
                disabled={isSubmittingClaim}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-200 transition-all cursor-pointer"
              >
                {isSubmittingClaim
                  ? 'Menyiapkan Simulasi...'
                  : 'Tampilkan Simulasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-2 pb-4">
        <div className="flex items-start gap-3 text-indigo-400">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />

          <p className="text-[11px] leading-relaxed">
            SoulProtect merupakan konsep pengembangan perlindungan finansial
            kesehatan mental melalui rencana kemitraan dengan perusahaan
            asuransi berizin. Paket, harga, manfaat, limit, dan alur klaim
            dalam halaman ini hanya ilustrasi prototipe. Produk resmi,
            apabila dikembangkan, akan mengikuti ketentuan mitra dan
            peraturan yang berlaku.
          </p>
        </div>
      </div>
    </div>
  );
};
