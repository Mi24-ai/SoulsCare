import React, { useState } from 'react';
import { 
  PiggyBank, 
  Sparkles, 
  Plus, 
  TrendingUp, 
  Coins, 
  ArrowUpRight, 
  ShieldCheck, 
  Target, 
  Gift,
  CheckCircle2,
  Calendar,
  Wallet
} from 'lucide-react';
import { SavingsGoal } from '../types';
import { initialSavingsGoals } from '../data/safeSpaceData';
import confetti from 'canvas-confetti';

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
  const [selectedGoalId, setSelectedGoalId] = useState<string>(initialSavingsGoals[0].id);
  const [depositAmount, setDepositAmount] = useState('50000');
  const [roundUpToggle, setRoundUpToggle] = useState(true);

  // New goal state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Konseling' | 'Self-Care Retreat' | 'Dana Darurat Jiwa' | 'Workshop Wellness'>('Konseling');
  const [newTarget, setNewTarget] = useState('300000');

  const handleDeposit = () => {
    const amt = Number(depositAmount) || 0;
    if (amt <= 0) return;

    // Add match bonus from community cross-subsidy pool (e.g. 15% bonus!)
    const matchBonus = Math.round(amt * 0.15);
    const totalAdded = amt + matchBonus;

    onUpdateVaultBalance(vaultBalance + totalAdded);

    // Update the chosen goal
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === selectedGoalId) {
          return {
            ...g,
            currentAmount: Math.min(g.targetAmount, g.currentAmount + totalAdded),
            interestBonusEarned: g.interestBonusEarned + matchBonus,
          };
        }
        return g;
      })
    );

    setIsDepositModalOpen(false);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCreateGoal = () => {
    if (!newTitle.trim()) return;

    const goal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetAmount: Number(newTarget) || 300000,
      currentAmount: 0,
      deadlineDate: '2026-12-31',
      roundUpEnabled: true,
      monthlyAutoDebit: 25000,
      interestBonusEarned: 0,
      crossSubsidyMultiplier: 1.15,
    };

    setGoals([...goals, goal]);
    setIsNewGoalModalOpen(false);
    setNewTitle('');

    confetti({
      particleCount: 40,
      spread: 50,
    });
  };

  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalBonuses = goals.reduce((acc, g) => acc + g.interestBonusEarned, 0);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-800 rounded-[40px] text-white p-6 sm:p-10 shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-indigo-100">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tabungan Berbasis Tujuan + Match Bonus Subsidi Komunitas</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              SoulVault: Nabung Receh untuk Kesehatan Jiwa
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 font-medium leading-relaxed">
              Kumpulkan dana darurat mental wellness, retreat healing, atau pos konseling rutin. Setiap tabunganmu mendapat bonus tambahan <strong className="text-amber-300">15% subsidi silang</strong> dari donatur komunitas.
            </p>
          </div>

          {/* Quick Balance Card */}
          <div className="bg-white/15 p-6 rounded-3xl backdrop-blur-md border border-white/20 text-left shrink-0 space-y-3 shadow-lg min-w-[240px]">
            <div>
              <span className="text-[11px] text-indigo-200 uppercase font-bold tracking-wider block">
                Total Saldo SoulVault Aktif
              </span>
              <div className="text-3xl font-bold font-mono text-white">
                Rp {vaultBalance.toLocaleString('id-ID')}
              </div>
              <span className="text-xs font-bold text-amber-300 block mt-0.5">
                +{totalBonuses.toLocaleString('id-ID')} bonus subsidi didanai
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                id="vault-deposit-btn"
                onClick={() => setIsDepositModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold text-xs shadow-md shadow-amber-900/20 transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nabung Cepat</span>
              </button>
              <button
                onClick={onOpenCounseling}
                className="px-3.5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Tukar Sesi
              </button>
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Auto Round-Up Feature Card */}
      <div className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-8 shadow-xl shadow-indigo-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shrink-0">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-indigo-950 text-lg">Round-Up Receh Belanjaan Otomatis</h3>
              <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                roundUpToggle ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {roundUpToggle ? 'Aktif' : 'Non-Aktif'}
              </span>
            </div>
            <p className="text-xs text-indigo-900 font-medium mt-1 max-w-xl leading-relaxed">
              Bulatkan transaksi belanja harian ke kelipatan Rp 5.000 terdekat (misal belanja Rp 17.500 dibulatkan jadi Rp 20.000, sisa Rp 2.500 otomatis masuk ke pos konselingmu).
            </p>
          </div>
        </div>

        <button
          id="toggle-roundup-btn"
          onClick={() => setRoundUpToggle(!roundUpToggle)}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md ${
            roundUpToggle
              ? 'bg-indigo-600 text-white shadow-indigo-200 hover:scale-[1.02]'
              : 'bg-[#F0F2FF] text-indigo-900 hover:bg-indigo-100 border border-indigo-100'
          }`}
        >
          {roundUpToggle ? 'Round-Up Menyala ✓' : 'Aktifkan Round-Up'}
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-['Outfit',sans-serif] text-indigo-950">
              Pos Target Kesehatan Jiwa
            </h2>
            <p className="text-xs font-bold text-indigo-400">Pantau kemajuan tabungan untuk setiap kebutuhan mentalmu</p>
          </div>
          <button
            id="create-new-goal-btn"
            onClick={() => setIsNewGoalModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Target Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div
                key={goal.id}
                id={`goal-card-${goal.id}`}
                className="bg-white rounded-[36px] border-2 border-indigo-50 p-6 sm:p-7 shadow-lg shadow-indigo-100/40 hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#F0F2FF] text-indigo-800 border border-indigo-100">
                      {goal.category}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tercapai
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-indigo-950 text-lg font-['Outfit',sans-serif] mb-4">
                    {goal.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between text-xs font-bold text-indigo-400">
                      <span>Terkumpul:</span>
                      <span className="font-bold text-indigo-950">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-[#F0F2FF] rounded-full overflow-hidden p-0.5 border border-indigo-50">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-indigo-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-indigo-600">Rp {goal.currentAmount.toLocaleString('id-ID')}</span>
                      <span className="text-indigo-300">/ Rp {goal.targetAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Subsidy Match Badge */}
                  <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100 text-xs text-amber-950 space-y-1 mb-5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span>Bonus Subsidi Silang: +15% Match</span>
                    </div>
                    <p className="text-xs text-amber-900/80 font-medium">
                      Earned bonus: Rp {goal.interestBonusEarned.toLocaleString('id-ID')} didanai pool donatur
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedGoalId(goal.id);
                    setIsDepositModalOpen(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nabung ke Pos Ini</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[36px] shadow-2xl border-2 border-indigo-50 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-indigo-50 bg-[#F0F2FF] flex items-center justify-between">
              <h3 className="font-bold text-indigo-950 text-lg font-['Outfit',sans-serif]">
                Nabung ke SoulVault
              </h3>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-indigo-400 hover:text-indigo-950 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Pilih Pos Tabungan Tujuan:
                </label>
                <select
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500"
                >
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>{g.title} (Target Rp {g.targetAmount.toLocaleString('id-ID')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                  Nominal Tabungan (Rupiah):
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['20000', '50000', '100000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`p-2.5 rounded-2xl border-2 text-xs font-mono font-bold transition-all cursor-pointer ${
                        depositAmount === amt
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-200'
                          : 'border-indigo-50 text-indigo-900 hover:bg-[#F0F2FF]'
                      }`}
                    >
                      Rp {Number(amt).toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500 font-mono"
                  placeholder="50000"
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                <p className="font-bold flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  Bonus Match Komunitas: +Rp {Math.round(Number(depositAmount || 0) * 0.15).toLocaleString('id-ID')} (15%)
                </p>
                <p className="text-xs text-emerald-800 mt-1 font-medium">
                  Total dana yang masuk ke vault: Rp {(Number(depositAmount || 0) + Math.round(Number(depositAmount || 0) * 0.15)).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-indigo-50 bg-[#F0F2FF] flex gap-3 justify-end">
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                id="confirm-deposit-btn"
                onClick={handleDeposit}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Konfirmasi Nabung
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[36px] shadow-2xl border-2 border-indigo-50 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-indigo-50 bg-[#F0F2FF] flex items-center justify-between">
              <h3 className="font-bold text-indigo-950 text-lg font-['Outfit',sans-serif]">
                Buat Target Pos Baru
              </h3>
              <button
                onClick={() => setIsNewGoalModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-indigo-400 hover:text-indigo-950 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">Nama Target:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Paket 4x Konseling Rutin"
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-medium text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">Kategori:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="Konseling">Konseling Profesional</option>
                  <option value="Self-Care Retreat">Self-Care Retreat / Healing</option>
                  <option value="Dana Darurat Jiwa">Dana Darurat Jiwa</option>
                  <option value="Workshop Wellness">Workshop Wellness</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-950 block mb-1.5">Target Nominal (Rupiah):</label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs sm:text-sm font-bold text-indigo-950 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500 font-mono"
                  placeholder="300000"
                />
              </div>
            </div>

            <div className="p-5 border-t border-indigo-50 bg-[#F0F2FF] flex gap-3 justify-end">
              <button
                onClick={() => setIsNewGoalModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleCreateGoal}
                disabled={!newTitle.trim()}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Buat Target
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
