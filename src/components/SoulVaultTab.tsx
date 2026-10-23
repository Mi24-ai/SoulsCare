
import React, { useState } from 'react';
import {
  PiggyBank,
  Sparkles,
  Plus,
  Coins,
  ShieldCheck,
  Target,
  Gift,
  CheckCircle2,
  Calendar,
  Wallet,
  Handshake,
  Smartphone,
  Info,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { SavingsGoal } from '../types';
import { initialSavingsGoals } from '../data/safeSpaceData';

interface SoulVaultTabProps {
  vaultBalance: number;
  onUpdateVaultBalance: (newBalance: number) => void;
  onOpenCounseling: () => void;
}

export const SoulVaultTab: React.FC<SoulVaultTabProps> = ({
  vaultBalance,
  onUpdateVaultBalance,
  onOpenCounseling,
}) => {
  const [goals, setGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    initialSavingsGoals[0]?.id ?? ''
  );
  const [depositAmount, setDepositAmount] = useState('50000');
  const [roundUpToggle, setRoundUpToggle] = useState(true);
  const [depositError, setDepositError] = useState('');
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);

  // New goal state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<
    'Konseling' | 'Self-Care Retreat' | 'Dana Darurat Jiwa' | 'Workshop Wellness'
  >('Konseling');
  const [newTarget, setNewTarget] = useState('300000');
  const [newGoalError, setNewGoalError] = useState('');

  const formatRupiah = (amount: number) =>
    `Rp ${amount.toLocaleString('id-ID')}`;

  // Semua angka di halaman ini adalah data simulasi prototipe.
  const illustrativeMatchRate = 0.15;
  const depositValue = Number(depositAmount);
  const validDeposit =
    Number.isFinite(depositValue) && depositValue > 0;

  const illustrativeBonus = validDeposit
    ? Math.round(depositValue * illustrativeMatchRate)
    : 0;

  const illustrativeTotal = validDeposit
    ? depositValue + illustrativeBonus
    : 0;

  const totalBonuses = goals.reduce(
    (total, goal) => total + goal.interestBonusEarned,
    0
  );

  const totalGoalBalances = goals.reduce(
    (total, goal) => total + goal.currentAmount,
    0
  );

  const handleDeposit = () => {
    const amount = Number(depositAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setDepositError('Masukkan nominal simulasi yang valid.');
      return;
    }

    if (!selectedGoalId) {
      setDepositError('Pilih target tabungan terlebih dahulu.');
      return;
    }

    if (isProcessingDeposit) return;

    setDepositError('');
    setIsProcessingDeposit(true);

    // SIMULASI LOKAL:
    // Tidak ada transaksi bank, pemindahan uang, atau bonus riil.
    window.setTimeout(() => {
      const matchBonus = Math.round(amount * illustrativeMatchRate);
      const totalAdded = amount + matchBonus;

      onUpdateVaultBalance(vaultBalance + totalAdded);

      setGoals((previousGoals) =>
        previousGoals.map((goal) => {
          if (goal.id !== selectedGoalId) return goal;

          return {
            ...goal,
            currentAmount: Math.min(
              goal.targetAmount,
              goal.currentAmount + totalAdded
            ),
            interestBonusEarned: goal.interestBonusEarned + matchBonus,
          };
        })
      );

      setIsProcessingDeposit(false);
      setIsDepositModalOpen(false);
      setDepositAmount('50000');

      window.alert(
        'Simulasi menabung berhasil diperbarui pada prototipe. Tidak ada uang yang benar-benar dipindahkan dan bonus 15% belum merupakan manfaat yang tersedia.'
      );
    }, 400);
  };

  const handleCreateGoal = () => {
    const target = Number(newTarget);

    if (!newTitle.trim()) {
      setNewGoalError('Nama target perlu diisi.');
      return;
    }

    if (!Number.isFinite(target) || target <= 0) {
      setNewGoalError('Masukkan target nominal yang valid.');
      return;
    }

    const goal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetAmount: target,
      currentAmount: 0,
      deadlineDate: '2026-12-31',
      roundUpEnabled: roundUpToggle,
      monthlyAutoDebit: 25000,
      interestBonusEarned: 0,
      crossSubsidyMultiplier: 1 + illustrativeMatchRate,
    };

    setGoals((previousGoals) => [...previousGoals, goal]);
    setIsNewGoalModalOpen(false);
    setNewTitle('');
    setNewTarget('300000');
    setNewCategory('Konseling');
    setNewGoalError('');
  };

  return (
    <div className="space-y-8">
      {/* Banner Utama */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-800 rounded-[40px] text-white p-6 sm:p-10 shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-indigo-100">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Konsep Tabungan Kesehatan Mental</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              SoulVault: Menabung untuk Kesehatan Mental
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 font-medium leading-relaxed">
              Rencanakan dana untuk konseling, kegiatan self-care, dan
              kebutuhan kesehatan mental. SoulVault dirancang untuk membantu
              pengguna menetapkan target, memantau progres, dan merencanakan
              pengeluaran dengan lebih terarah.
            </p>

            <div className="flex items-start gap-2 text-xs text-indigo-100/90 leading-relaxed">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                Halaman ini merupakan prototipe. Saldo, setoran, dan bonus
                yang ditampilkan tidak merepresentasikan dana riil di rekening.
              </p>
            </div>
          </div>

          {/* Ringkasan Saldo Simulasi */}
          <div className="bg-white/15 p-6 rounded-3xl backdrop-blur-md border border-white/20 text-left shrink-0 space-y-4 shadow-lg min-w-[240px]">
            <div>
              <span className="text-[11px] text-indigo-200 uppercase font-bold tracking-wider block">
                Saldo Simulasi SoulVault
              </span>

              <div className="text-3xl font-bold font-mono text-white mt-1">
                {formatRupiah(vaultBalance)}
              </div>

              <span className="text-xs font-bold text-amber-300 block mt-2">
                Bonus ilustratif: {formatRupiah(totalBonuses)}
              </span>

              <span className="text-[10px] text-indigo-100/80 block mt-1">
                Bukan saldo rekening atau bonus yang telah dicairkan
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                id="vault-deposit-btn"
                onClick={() => {
                  setDepositError('');
                  setIsDepositModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Simulasi Nabung</span>
              </button>

              <button
                onClick={onOpenCounseling}
                className="px-3.5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Lihat Konseling
              </button>
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Ringkasan Perencanaan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border-2 border-indigo-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400">
              Total Target
            </span>
            <Target className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-950 mt-2">
            {goals.length}
          </div>
          <p className="text-[11px] text-indigo-400 mt-1">
            Pos perencanaan tabungan
          </p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-indigo-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400">
              Akumulasi Target
            </span>
            <PiggyBank className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-950 mt-2 font-mono">
            {formatRupiah(totalGoalBalances)}
          </div>
          <p className="text-[11px] text-indigo-400 mt-1">
            Angka pada simulasi target
          </p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-indigo-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400">
              Rencana Bonus
            </span>
            <Gift className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-950 mt-2 font-mono">
            {formatRupiah(totalBonuses)}
          </div>
          <p className="text-[11px] text-indigo-400 mt-1">
            Ilustrasi, belum didanai
          </p>
        </div>
      </div>

      {/* Informasi Round-Up */}
      <div className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-8 shadow-xl shadow-indigo-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shrink-0">
            <Coins className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-indigo-950 text-lg">
                Round-Up Receh Belanjaan
              </h3>

              <span
                className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                  roundUpToggle
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {roundUpToggle
                  ? 'Pratinjau Aktif'
                  : 'Pratinjau Nonaktif'}
              </span>
            </div>

            <p className="text-xs text-indigo-900 font-medium mt-1 max-w-xl leading-relaxed">
              Fitur ini dirancang untuk menghitung selisih transaksi menuju
              kelipatan Rp5.000 terdekat. Contohnya, transaksi Rp17.500
              dibulatkan menjadi Rp20.000 sehingga selisih ilustratifnya
              Rp2.500.
            </p>

            <p className="text-[11px] text-indigo-400 mt-2">
              Belum terhubung ke transaksi belanja, rekening bank, atau
              pemindahan dana otomatis.
            </p>
          </div>
        </div>

        <button
          id="toggle-roundup-btn"
          onClick={() => setRoundUpToggle((previous) => !previous)}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md ${
            roundUpToggle
              ? 'bg-indigo-600 text-white shadow-indigo-200'
              : 'bg-[#F0F2FF] text-indigo-900 hover:bg-indigo-100 border border-indigo-100'
          }`}
        >
          {roundUpToggle
            ? 'Nonaktifkan Pratinjau'
            : 'Lihat Pratinjau Round-Up'}
        </button>
      </div>

      {/* Kartu Target Tabungan */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-indigo-950">
              Target Kesehatan Mental
            </h2>
            <p className="text-xs font-bold text-indigo-400 mt-1">
              Buat target dan pantau progres perencanaan dana kesehatan mental.
            </p>
          </div>

          <button
            id="create-new-goal-btn"
            onClick={() => {
              setNewGoalError('');
              setIsNewGoalModalOpen(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Target Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress =
              goal.targetAmount > 0
                ? Math.min(
                    100,
                    Math.round(
                      (goal.currentAmount / goal.targetAmount) * 100
                    )
                  )
                : 0;

            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div
                key={goal.id}
                id={`goal-card-${goal.id}`}
                className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-7 shadow-lg shadow-indigo-100/40 hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#F0F2FF] text-indigo-800 border border-indigo-100">
                      {goal.category}
                    </span>

                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Target Simulasi Tercapai
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-indigo-950 text-lg font-['Outfit',sans-serif] mb-4">
                    {goal.title}
                  </h3>

                  {/* Progress */}
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between text-xs font-bold text-indigo-400">
                      <span>Progres simulasi</span>
                      <span className="font-bold text-indigo-950">
                        {progress}%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-[#F0F2FF] rounded-full overflow-hidden p-0.5 border border-indigo-50">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-amber-400 to-indigo-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between gap-2 text-xs font-mono font-bold">
                      <span className="text-indigo-600">
                        {formatRupiah(goal.currentAmount)}
                      </span>
                      <span className="text-indigo-300 text-right">
                        / {formatRupiah(goal.targetAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Informasi Bonus */}
                  <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100 text-xs text-amber-950 space-y-1 mb-5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span>Rencana Bonus Subsidi Silang</span>
                    </div>

                    <p className="text-xs text-amber-900/80 font-medium">
                      Ilustrasi bonus 15%: {formatRupiah(goal.interestBonusEarned)}
                    </p>

                    <p className="text-[10px] text-amber-800/80 leading-relaxed">
                      Bonus bergantung pada ketersediaan pendanaan dan
                      kesepakatan program. Belum dijamin atau dicairkan.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-[11px] text-indigo-400 mb-4">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>
                      Target waktu: {goal.deadlineDate}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedGoalId(goal.id);
                    setDepositError('');
                    setIsDepositModalOpen(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simulasikan Setoran</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Pengelolaan Dana */}
      <div className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-8 shadow-xl shadow-indigo-100/60 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Handshake className="w-4 h-4" />
            Rencana Kemitraan
          </div>

          <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-indigo-950">
            Bagaimana SoulVault Direncanakan Bekerja?
          </h2>

          <p className="text-sm text-indigo-500 mt-2 leading-relaxed">
            SoulVault dirancang sebagai alat bantu perencanaan dana kesehatan
            mental. Penyimpanan dan pemindahan dana riil akan memerlukan
            mekanisme serta mitra keuangan yang sesuai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-[#F0F2FF] border border-indigo-100">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-indigo-600 mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-indigo-950 mb-2">
              1. Perencanaan Digital
            </h3>

            <p className="text-xs text-indigo-700 leading-relaxed">
              Pengguna membuat target, memasukkan nominal rencana tabungan,
              dan memantau progres kebutuhan konseling atau self-care.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#F0F2FF] border border-indigo-100">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-indigo-600 mb-4">
              <Wallet className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-indigo-950 mb-2">
              2. Rencana Penyimpanan Dana
            </h3>

            <p className="text-xs text-indigo-700 leading-relaxed">
              Dana riil direncanakan tetap berada pada rekening atau layanan
              keuangan yang sesuai. Souls Care berfokus pada pencatatan tujuan
              dan tampilan progres, sesuai ruang lingkup kerja sama.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#F0F2FF] border border-indigo-100">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-indigo-600 mb-4">
              <Gift className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-indigo-950 mb-2">
              3. Rencana Subsidi Silang
            </h3>

            <p className="text-xs text-indigo-700 leading-relaxed">
              Bonus 15% merupakan konsep insentif yang memerlukan sumber
              pendanaan, kriteria penerima, batas anggaran, dan persetujuan
              mitra atau donatur.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Catatan:</strong> kerja sama penyimpanan dana, integrasi
          rekening, pemindahan dana, dan program subsidi silang belum
          dinyatakan aktif pada prototipe ini. Setiap implementasi riil
          memerlukan kesepakatan dengan mitra dan mekanisme yang sesuai
          ketentuan yang berlaku.
        </div>
      </div>

      {/* Modal Simulasi Setoran */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-[36px] shadow-2xl border-2 border-indigo-50 max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-indigo-50 bg-[#F0F2FF] flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-indigo-950 text-lg font-['Outfit',sans-serif]">
                  Simulasi Menabung
                </h3>
                <p className="text-xs font-bold text-indigo-400 mt-1">
                  Pratinjau setoran SoulVault
                </p>
              </div>

              <button
                onClick={() => {
                  setIsDepositModalOpen(false);
                  setDepositError('');
                }}
                aria-label="Tutup modal"
                className="w-8 h-8 shrink-0 rounded-full bg-white text-indigo-400 hover:text-indigo-950 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Mode simulasi:</strong> nominal yang dimasukkan hanya
                memperbarui tampilan prototipe. Tidak ada uang yang ditarik
                dari rekening atau dipindahkan.
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Pilih Target Tabungan
                </label>

                <select
                  value={selectedGoalId}
                  onChange={(event) => setSelectedGoalId(event.target.value)}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-none focus:border-indigo-500"
                >
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title} (Target {formatRupiah(goal.targetAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Nominal Simulasi (Rupiah)
                </label>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['20000', '50000', '100000'].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setDepositAmount(amount);
                        setDepositError('');
                      }}
                      className={`p-2.5 rounded-2xl border-2 text-xs font-mono font-bold transition-all cursor-pointer ${
                        depositAmount === amount
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-200'
                          : 'border-indigo-50 text-indigo-900 hover:bg-[#F0F2FF]'
                      }`}
                    >
                      {formatRupiah(Number(amount))}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min="1"
                  value={depositAmount}
                  onChange={(event) => {
                    setDepositAmount(event.target.value);
                    setDepositError('');
                  }}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="50000"
                />
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-xs text-indigo-950">
                <p className="font-bold flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-indigo-600" />
                  Ilustrasi Bonus 15%
                </p>

                <p className="mt-2">
                  Bonus simulasi: {formatRupiah(illustrativeBonus)}
                </p>

                <p className="font-bold text-indigo-700 mt-1">
                  Total simulasi: {formatRupiah(illustrativeTotal)}
                </p>

                <p className="text-[11px] text-indigo-500 mt-2 leading-relaxed">
                  Bonus hanya contoh perhitungan. Ketersediaan dan nilai
                  bonus sebenarnya belum dijamin.
                </p>
              </div>

              {depositError && (
                <div
                  role="alert"
                  className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{depositError}</span>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-indigo-50 bg-[#F0F2FF] flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setIsDepositModalOpen(false);
                  setDepositError('');
                }}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-100 cursor-pointer"
              >
                Batal
              </button>

              <button
                id="confirm-deposit-btn"
                onClick={handleDeposit}
                disabled={
                  isProcessingDeposit ||
                  !validDeposit ||
                  !selectedGoalId ||
                  goals.length === 0
                }
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-200 transition-all cursor-pointer"
              >
                {isProcessingDeposit
                  ? 'Memperbarui Simulasi...'
                  : 'Tampilkan Simulasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Target Baru */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-[36px] shadow-2xl border-2 border-indigo-50 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-indigo-50 bg-[#F0F2FF] flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-indigo-950 text-lg font-['Outfit',sans-serif]">
                  Buat Target Baru
                </h3>
                <p className="text-xs font-bold text-indigo-400 mt-1">
                  Tambahkan rencana tabungan
                </p>
              </div>

              <button
                onClick={() => {
                  setIsNewGoalModalOpen(false);
                  setNewGoalError('');
                }}
                aria-label="Tutup modal"
                className="w-8 h-8 shrink-0 rounded-full bg-white text-indigo-400 hover:text-indigo-950 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                Target baru hanya disimpan pada state prototipe dan belum
                terhubung ke rekening atau layanan keuangan.
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Nama Target
                </label>

                <input
                  type="text"
                  value={newTitle}
                  onChange={(event) => {
                    setNewTitle(event.target.value);
                    setNewGoalError('');
                  }}
                  placeholder="Contoh: Dana untuk 4 sesi konseling"
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-medium text-indigo-950 border-2 border-indigo-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Kategori
                </label>

                <select
                  value={newCategory}
                  onChange={(event) =>
                    setNewCategory(event.target.value as typeof newCategory)
                  }
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Konseling">Konseling Profesional</option>
                  <option value="Self-Care Retreat">
                    Self-Care Retreat / Healing
                  </option>
                  <option value="Dana Darurat Jiwa">
                    Dana Darurat Kesehatan Mental
                  </option>
                  <option value="Workshop Wellness">
                    Workshop Wellness
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Target Nominal (Rupiah)
                </label>

                <input
                  type="number"
                  min="1"
                  value={newTarget}
                  onChange={(event) => {
                    setNewTarget(event.target.value);
                    setNewGoalError('');
                  }}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="300000"
                />
              </div>

              {newGoalError && (
                <div
                  role="alert"
                  className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{newGoalError}</span>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-indigo-50 bg-[#F0F2FF] flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setIsNewGoalModalOpen(false);
                  setNewGoalError('');
                }}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-100 cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleCreateGoal}
                disabled={!newTitle.trim()}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-indigo-200 transition-all cursor-pointer"
              >
                Buat Target
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
            SoulVault merupakan konsep perencanaan dana kesehatan mental.
            Saldo, setoran, progres, dan bonus pada prototipe ini merupakan
            simulasi lokal. Penyimpanan dana riil, integrasi rekening,
            transaksi otomatis, dan subsidi silang memerlukan mekanisme
            serta kesepakatan mitra yang sesuai. Pengguna harus tetap
            memiliki kejelasan atas kepemilikan dan penggunaan dananya.
          </p>
        </div>
      </div>
    </div>
  );
};
