import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  ShieldAlert, 
  Percent, 
  PiggyBank, 
  Menu, 
  X, 
  Bot, 
  MessageSquare, 
  Users, 
  Wind, 
  ShieldCheck, 
  Coins,
  Scale,
  Sparkle
} from 'lucide-react';
import { TabType, SlidingScaleTier } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeTier: SlidingScaleTier;
  onOpenSlidingScale: () => void;
  onOpenCrisis: () => void;
  vaultBalance: number;
  currentMood: string;
  onQuickMoodSelect: (mood: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeTier,
  onOpenSlidingScale,
  onOpenCrisis,
  vaultBalance,
  currentMood,
  onQuickMoodSelect,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);

  const moods = [
    { emoji: '🌿', label: 'Tenang & Mindful' },
    { emoji: '⚡', label: 'Overthinking / Cemas' },
    { emoji: '😴', label: 'Lelah / Burnout' },
    { emoji: '💔', label: 'Sedih / Galau' },
    { emoji: '✨', label: 'Bersemangat & Syukur' },
  ];

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'companion', label: 'Souls AI', icon: <Bot className="w-4 h-4" />, badge: 'Weltie' },
    { id: 'counseling', label: 'Souls Consult', icon: <Users className="w-4 h-4" /> },
    { id: 'safespace', label: 'Souls Mail', icon: <MessageSquare className="w-4 h-4" />, badge: 'Anonim' },
    { id: 'destress', label: 'Souls Health', icon: <Wind className="w-4 h-4" /> },
    { id: 'insurance', label: 'Souls Insurance', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'vault', label: 'Souls Vault', icon: <PiggyBank className="w-4 h-4" /> },
    { id: 'slidingscale', label: 'Souls Subsidi', icon: <Scale className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F0F2FF]/95 backdrop-blur-md border-b border-indigo-100/80 transition-colors">
      {/* Top Banner for Cross-Subsidy & Gen Z Solidarity in Vibrant Style */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-violet-100" />
        <span>
          <strong>Souls Care Solidaritas</strong>: Didukung model subsidi silang & beasiswa kampus. Kesehatan mental adalah hak setiap jiwa.
        </span>
        <button 
          onClick={onOpenSlidingScale}
          className="bg-white/20 hover:bg-white/30 text-white text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ml-1.5"
        >
          Cek tahapan Kamu →
        </button>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand matching Vibrant Theme */}
          <div className="flex items-center gap-3">
<button 
  onClick={() => setActiveTab('companion')}
  className="flex items-center gap-3 text-left group cursor-pointer"
  id="brand-logo-btn"
>
  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-[1.02] transition-transform overflow-hidden">
    <img src="/image/logo.png" alt="Souls Care Logo" className="w-full h-full object-cover" />
  </div>
  <div>
        <span className="font-['Outfit',sans-serif] font-bold text-2xl tracking-tight text-indigo-900 flex items-center gap-2">
                  Souls Care
                  <span className="text-[11px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                    Gen Z
                  </span>
                </span>
                <p className="text-xs font-bold text-indigo-400 tracking-wide hidden sm:block">
                  Mental Wellness & Sliding Scale
                </p>
              </div>
            </button>
          </div>

          {/* Quick Widgets: Mood Tracker, Sliding Scale Pill, SoulVault, SOS */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Mood Tracker Widget */}
            <div className="relative">
              <button
                id="quick-mood-btn"
                onClick={() => setShowMoodDropdown(!showMoodDropdown)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border-2 border-indigo-100 bg-white hover:border-indigo-200 text-xs font-bold text-indigo-900 transition-all shadow-xs"
                title="Catat mood kamu sekarang"
              >
                <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold">Mood</span>
                <span className="text-xs font-bold text-indigo-900">{currentMood || '🌿 Netral'}</span>
              </button>

              {showMoodDropdown && (
                <div 
                  id="mood-dropdown-menu"
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-indigo-100 border-2 border-indigo-100 p-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <p className="text-[11px] font-bold text-indigo-400 px-3 py-1.5 uppercase tracking-wider">
                    Bagaimana hatimu sekarang?
                  </p>
                  <div className="space-y-1">
                    {moods.map((m) => (
                      <button
                        key={m.label}
                        onClick={() => {
                          onQuickMoodSelect(`${m.emoji} ${m.label}`);
                          setShowMoodDropdown(false);
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-900 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <span className="text-base">{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sliding Scale Active Tier Pill */}
            <button
              id="header-sliding-scale-btn"
              onClick={onOpenSlidingScale}
              className="bg-white px-4 py-2 rounded-full border-2 border-indigo-100 hover:border-indigo-200 flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-widest">Sliding Scale</span>
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                {activeTier.tierName}
                {activeTier.discountPercentage > 0 && (
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    -{activeTier.discountPercentage}%
                  </span>
                )}
              </span>
            </button>

            {/* SoulVault Quick Balance in Honey/Amber Vibrant Block */}
            <button
              id="header-vault-btn"
              onClick={() => setActiveTab('vault')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border-2 border-amber-200 bg-[#FEF3C7] hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all shadow-xs hover:scale-[1.02] cursor-pointer"
            >
              <PiggyBank className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold">Vault:</span>
              <span className="text-amber-900 font-bold font-mono">
                Rp {vaultBalance.toLocaleString('id-ID')}
              </span>
            </button>

            {/* SOS Emergency Crisis Button */}
            <button
              id="header-sos-btn"
              onClick={onOpenCrisis}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-xs font-bold shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>SOS Bantuan</span>
            </button>

            {/* Avatar Pill Indicator */}
            <div className="w-10 h-10 bg-white rounded-full border-2 border-white overflow-hidden shadow-md">
              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-400 flex items-center justify-center text-white font-bold text-xs">
                ✨
              </div>
            </div>
          </div>

          {/* Mobile SOS & Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-sos-btn"
              onClick={onOpenCrisis}
              className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-md shadow-rose-200 flex items-center justify-center"
              aria-label="SOS Bantuan"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl border-2 border-indigo-100 bg-white text-indigo-900 hover:bg-indigo-50 shadow-xs"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs as Vibrant Floating Pills */}
        <nav className="hidden lg:flex items-center justify-between bg-white rounded-[24px] p-1.5 mt-3 shadow-md shadow-indigo-100/70 border-2 border-indigo-50">
          <div className="flex items-center gap-1.5 w-full justify-between">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => {
                    if (item.id === 'slidingscale') {
                      onOpenSlidingScale();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-102'
                      : 'text-indigo-900/80 hover:text-indigo-900 hover:bg-indigo-50/80 font-bold'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        isActive ? 'bg-violet-500 text-white' : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-indigo-100 bg-white p-5 space-y-3 animate-in slide-in-from-top duration-200 shadow-2xl rounded-b-[32px]">
          <div className="grid grid-cols-2 gap-2.5 pb-3 border-b border-indigo-50">
            <button
              onClick={() => {
                onOpenSlidingScale();
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 text-xs font-bold text-left flex flex-col gap-1 text-indigo-900"
            >
              <div className="flex items-center gap-1 text-[11px] uppercase font-bold text-indigo-400 tracking-wider">
                <Percent className="w-3 h-3" /> Tier Subsidi
              </div>
              <span className="truncate">{activeTier.tierName}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('vault');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-2xl border-2 border-amber-200 bg-[#FEF3C7] text-xs font-bold text-left flex flex-col gap-1 text-amber-900"
            >
              <div className="flex items-center gap-1 text-[11px] uppercase font-bold text-amber-700 tracking-wider">
                <PiggyBank className="w-3 h-3" /> SoulVault
              </div>
              <span className="font-mono text-amber-900">Rp {vaultBalance.toLocaleString('id-ID')}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'slidingscale') {
                      onOpenSlidingScale();
                    } else {
                      setActiveTab(item.id);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold ${
                    isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-indigo-950 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${isActive ? 'bg-violet-500 text-white' : 'bg-violet-100 text-violet-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
