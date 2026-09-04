import React, { useState } from 'react';
import { Header } from './components/Header';
import { CrisisModal } from './components/CrisisModal';
import { AiCompanionTab } from './components/AiCompanionTab';
import { CounselingTab } from './components/CounselingTab';
import { SafeSpaceTab } from './components/SafeSpaceTab';
import { DeStressHubTab } from './components/DeStressHubTab';
import { SoulProtectTab } from './components/SoulProtectTab';
import { SoulVaultTab } from './components/SoulVaultTab';
import { SlidingScaleModal } from './components/SlidingScaleModal';
import { PayItForwardModal } from './components/PayItForwardModal';
import { TabType, SlidingScaleTier, Booking } from './types';
import { slidingScaleTiers } from './data/safeSpaceData';
import { Heart, Sparkles, Shield, Lock, Award, HeartHandshake, PhoneCall } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('companion');
  const [currentMood, setCurrentMood] = useState<string>('Tenang & Mindful');
  const [activeTier, setActiveTier] = useState<SlidingScaleTier>(slidingScaleTiers[0]); // Default: Beasiswa Jiwa (85% off)
  const [vaultBalance, setVaultBalance] = useState<number>(185000);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Modals state
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isSlidingScaleOpen, setIsSlidingScaleOpen] = useState(false);
  const [isPayItForwardOpen, setIsPayItForwardOpen] = useState(false);

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
  };

  return (
    <div className="min-h-screen bg-[#F0F2FF] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTier={activeTier}
        onOpenSlidingScale={() => setIsSlidingScaleOpen(true)}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        vaultBalance={vaultBalance}
        currentMood={currentMood}
        onQuickMoodSelect={setCurrentMood}
      />

      {/* Main Tab Content Display */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'companion' && (
          <AiCompanionTab
            userMood={currentMood}
            onOpenBreathing={() => setActiveTab('destress')}
            onOpenGrounding={() => setActiveTab('destress')}
            onOpenJournal={() => setActiveTab('destress')}
            onOpenCounseling={() => setActiveTab('counseling')}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        )}

        {activeTab === 'counseling' && (
          <CounselingTab
            activeTier={activeTier}
            onOpenSlidingScale={() => setIsSlidingScaleOpen(true)}
            onBookingCreated={handleBookingCreated}
          />
        )}

        {activeTab === 'safespace' && (
          <SafeSpaceTab />
        )}

        {activeTab === 'destress' && (
          <DeStressHubTab />
        )}

        {activeTab === 'insurance' && (
          <SoulProtectTab />
        )}

        {activeTab === 'vault' && (
          <SoulVaultTab
            vaultBalance={vaultBalance}
            onUpdateVaultBalance={setVaultBalance}
            onOpenCounseling={() => setActiveTab('counseling')}
          />
        )}
      </main>

      {/* Footer in Vibrant Palette Styling */}
      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="bg-white rounded-[32px] border-2 border-indigo-100 shadow-xl shadow-indigo-100/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-indigo-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 overflow-hidden">
              <img src="/image/logo.png" alt="Souls Care Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-black text-sm text-indigo-950 font-['Outfit',sans-serif]">Souls Care Indonesia</p>
              <p className="text-[11px] font-bold text-indigo-400">Ekosistem Kesehatan Mental Berkeadilan untuk Gen Z</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-black">
            <button
              onClick={() => setIsSlidingScaleOpen(true)}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-800"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
              <span>Model Sliding-Scale</span>
            </button>
            <button
              onClick={() => setIsPayItForwardOpen(true)}
              className="hover:text-pink-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-800"
            >
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              <span>Pool Gotong Royong</span>
            </button>
            <button
              onClick={() => setIsCrisisModalOpen(true)}
              className="hover:text-red-700 transition-colors text-red-600 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 font-extrabold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              <span>Hotline Krisis 24/7</span>
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] font-bold text-indigo-300">
            Terenkripsi Standar Medis • Terverifikasi HIMPSI & Kemenkes RI
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      <SlidingScaleModal
        isOpen={isSlidingScaleOpen}
        onClose={() => setIsSlidingScaleOpen(false)}
        activeTier={activeTier}
        onSelectTier={setActiveTier}
        onOpenPayItForward={() => setIsPayItForwardOpen(true)}
      />

      <PayItForwardModal
        isOpen={isPayItForwardOpen}
        onClose={() => setIsPayItForwardOpen(false)}
        onDonationComplete={(amt) => {
          // Add extra bonus credits to community pool
        }}
      />
    </div>
  );
}

export default App;