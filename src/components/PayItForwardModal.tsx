import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  Sparkles, 
  Gift, 
  Users, 
  CheckCircle2, 
  HeartHandshake, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PayItForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationComplete?: (amount: number) => void;
}

export const PayItForwardModal: React.FC<PayItForwardModalProps> = ({
  isOpen,
  onClose,
  onDonationComplete,
}) => {
  if (!isOpen) return null;

  const [donationAmount, setDonationAmount] = useState('50000');
  const [donorName, setDonorName] = useState('Sahabat Baik Souls Care');
  const [donorMessage, setDonorMessage] = useState('Tetap semangat ya kawan! Kamu tidak berjuang sendirian 🤍');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const presets = [
    { label: 'Kopi Jiwa', amount: '20000', impact: 'Subsidi 1x sesi latihan napas & safe space' },
    { label: 'Setengah Sesi', amount: '75000', impact: 'Subsidi 50% biaya 1 sesi konseling mahasiswa' },
    { label: 'Sponsor Penuh', amount: '150000', impact: 'Biayai 1 sesi konseling psikolog GRATIS untuk 1 anak kos' },
  ];

  const handleDonate = () => {
    const amt = Number(donationAmount) || 0;
    if (amt <= 0) return;

    setIsSubmitted(true);
    if (onDonationComplete) onDonationComplete(amt);

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-indigo-950/70 backdrop-blur-sm animate-in fade-in">
      <div 
        id="pay-it-forward-dialog"
        className="bg-white rounded-[36px] shadow-2xl border-2 border-indigo-50 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-6 sm:p-7 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/20">
              <Heart className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Outfit',sans-serif]">
                Pay-It-Forward: Pool Subsidi Silang
              </h2>
              <p className="text-xs text-indigo-100 mt-0.5 font-medium">
                Gotong royong kesehatan jiwa sesama generasi muda Indonesia.
              </p>
            </div>
          </div>
          <button 
            id="close-payitforward-btn"
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
            {/* Impact Metric Banner */}
            <div className="p-5 bg-violet-50/80 rounded-3xl border border-violet-100 text-xs text-violet-950 space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-violet-600" />
                  <span>Dampak Gotong Royong Komunitas:</span>
                </span>
                <span className="font-mono text-violet-700 font-bold text-sm">1.482 Sesi Tersubsidi</span>
              </div>
              <p className="text-indigo-900/80 font-medium text-xs leading-relaxed">
                100% donasi masuk langsung ke dana abadi subsidi silang konseling dan asuransi mikro mahasiswa pra-sejahtera.
              </p>
            </div>

            {/* Presets */}
            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-2">
                Pilih Nominal Dukungan:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {presets.map((p) => (
                  <button
                    key={p.amount}
                    type="button"
                    onClick={() => setDonationAmount(p.amount)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      donationAmount === p.amount
                        ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100 ring-2 ring-indigo-200'
                        : 'border-indigo-50 bg-[#F0F2FF]/60 hover:bg-white'
                    }`}
                  >
                    <span className="text-[11px] text-indigo-400 block uppercase font-bold">{p.label}</span>
                    <span className="text-xs font-bold text-indigo-950 font-mono block my-1">
                      Rp {Number(p.amount).toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-indigo-800/70 font-medium line-clamp-2 leading-tight">{p.impact}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                Atau Masukkan Nominal Kustom (Rupiah):
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-bold text-indigo-950 border-2 border-indigo-100 font-mono focus:outline-hidden focus:border-indigo-500"
                placeholder="50000"
              />
            </div>

            {/* Donor Encouragement Message */}
            <div>
              <label className="text-xs font-bold text-indigo-950 block mb-1.5">
                Pesan Semangat / Doa untuk Penerima Subsidi:
              </label>
              <textarea
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                rows={2}
                placeholder="Tuliskan kata-kata hangat yang akan dibaca teman penerima beasiswa jiwa..."
                className="w-full bg-[#F0F2FF] rounded-2xl p-3 text-xs font-medium text-indigo-950 border-2 border-indigo-100 resize-none focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>
        ) : (
          /* Thank You Screen */
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-md shadow-indigo-200">
              <Heart className="w-8 h-8 fill-indigo-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-['Outfit',sans-serif] text-indigo-950">
                Terima Kasih Banyak, Orang Baik! 🤍
              </h3>
              <p className="text-xs text-indigo-900/80 font-medium mt-1 max-w-sm mx-auto leading-relaxed">
                Donasi sebesarmu <strong>Rp {Number(donationAmount).toLocaleString('id-ID')}</strong> telah berhasil disalurkan ke pool dana subsidi silang Souls Care.
              </p>
            </div>
            <div className="p-4 bg-[#F0F2FF] rounded-2xl border border-indigo-100 text-xs text-indigo-950 italic font-medium">
              "{donorMessage}"
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Tutup & Kembali
            </button>
          </div>
        )}

        {!isSubmitted && (
          <div className="p-5 bg-[#F0F2FF] border-t border-indigo-50 flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-indigo-700 hover:bg-indigo-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              id="confirm-payitforward-btn"
              onClick={handleDonate}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Kirim Donasi Subsidi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
