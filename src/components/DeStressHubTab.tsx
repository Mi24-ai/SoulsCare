import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wind, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  CloudRain, 
  Waves, 
  Music, 
  Send,
  Sliders,
  Dumbbell,
  Flower2,
  Footprints,
  Plane,
  Palette,
  MapPin,
  Clock,
  Tag,
  Sun,
  Moon,
  Sunset,
  Feather
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { JournalEntry, ActivityCategoryId } from '../types';
import { activityCategories } from '../data/activitiesData';
import confetti from 'canvas-confetti';

interface DeStressHubTabProps {
  initialSubTab?: 'breathing' | 'grounding' | 'sounds' | 'journal' | 'activities';
}

const activityCategoryIcons: Record<ActivityCategoryId, React.ReactNode> = {
  gym: <Dumbbell className="w-4 h-4" />,
  yoga: <Flower2 className="w-4 h-4" />,
  jogging: <Footprints className="w-4 h-4" />,
  traveling: <Plane className="w-4 h-4" />,
  kreatif: <Palette className="w-4 h-4" />,
};

const patternInfo: Record<'4-7-8' | 'box' | '5-5', { label: string; why: string }> = {
  '4-7-8': {
    label: '4-7-8 Relaksasi Tidur',
    why: 'Menahan napas lebih lama dari biasanya membantu tubuh melepas ketegangan sebelum istirahat.',
  },
  box: {
    label: 'Box Breathing 4-4-4-4',
    why: 'Ritme yang rata di semua fase membantu pikiran yang berpacu untuk kembali stabil.',
  },
  '5-5': {
    label: '5-5 Deep Calm',
    why: 'Pola sederhana yang mudah diikuti kalau kamu baru pertama kali mencoba latihan napas.',
  },
};

const dailySupportLines = [
  'Kamu tidak harus menyelesaikan semuanya hari ini. Satu langkah kecil juga tetap langkah.',
  'Kalau hari ini terasa berat, itu bukan tanda kamu gagal. Itu tanda kamu sedang berjuang.',
  'Boleh berhenti sebentar. Ruang ini akan selalu ada saat kamu siap kembali.',
  'Perasaanmu valid, sekalipun sulit dijelaskan dengan kata-kata.',
  'Pelan-pelan saja. Tidak ada yang menilai kecepatanmu di sini.',
];

const groundingClosingLines = [
  'Kamu baru saja menuntun dirimu sendiri kembali ke saat ini. Itu bukan hal kecil.',
  'Sistem sarafmu baru saja dapat sinyal bahwa kamu aman. Bawa rasa ini pelan-pelan.',
  'Kamu sudah melakukan bagianmu. Sisanya, biarkan tubuh yang menyusul.',
];

export const DeStressHubTab: React.FC<DeStressHubTabProps> = ({ initialSubTab = 'breathing' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'breathing' | 'grounding' | 'sounds' | 'journal' | 'activities'>(initialSubTab);
  const [activeActivityCategory, setActiveActivityCategory] = useState<ActivityCategoryId>('gym');

  // --- Time-aware greeting (no clinical framing, just a warm hello) ---
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return { text: 'Selamat pagi', icon: <Sun className="w-5 h-5" /> };
    if (hour < 15) return { text: 'Halo, semangat siang ini', icon: <Sun className="w-5 h-5" /> };
    if (hour < 19) return { text: 'Selamat sore', icon: <Sunset className="w-5 h-5" /> };
    return { text: 'Malam ini, pelan-pelan saja', icon: <Moon className="w-5 h-5" /> };
  }, []);
  const supportLine = useMemo(
    () => dailySupportLines[new Date().getDate() % dailySupportLines.length],
    []
  );

  // --- Breathing Visualizer State ---
  const [breathingPattern, setBreathingPattern] = useState<'4-7-8' | 'box' | '5-5'>('4-7-8');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Sound mixer state
  const [rainVol, setRainVol] = useState(0);
  const [oceanVol, setOceanVol] = useState(0);
  const [droneVol, setDroneVol] = useState(0);

  // --- 5-4-3-2-1 Grounding State ---
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingFinished, setGroundingFinished] = useState(false);
  const groundingPrompts = [
    { count: 5, sense: 'Penglihatan (Lihat)', desc: 'Sebutkan 5 benda di sekitarmu yang bisa kamu lihat saat ini (misal: jam dinding, bayangan pohon, warna cangkir)...', icon: '👀' },
    { count: 4, sense: 'Sentuhan (Raba)', desc: 'Rasakan 4 hal fisik yang sedang menyentuh kulitmu (misal: telapak kaki di lantai, tekstur baju, suhu udara)...', icon: '✋' },
    { count: 3, sense: 'Pendengaran (Dengar)', desc: 'Fokuskan telinga pada 3 suara samar di latar belakang (suara kipas, kendaraan jauh, nafasmu sendiri)...', icon: '👂' },
    { count: 2, sense: 'Penciuman (Cium)', desc: 'Identifikasi 2 aroma yang bisa kamu hirup (aroma kopi, wangi sabun, udara segar)...', icon: '👃' },
    { count: 1, sense: 'Pengecapan / Afirmasi Diri', desc: 'Rasakan 1 rasa di lidahmu, dan katakan dalam hati: "Aku aman di saat ini."', icon: '👅' },
  ];
  const [groundingInputs, setGroundingInputs] = useState<string[]>(['', '', '', '', '']);
  const closingLine = useMemo(
    () => groundingClosingLines[Math.floor(Math.random() * groundingClosingLines.length)],
    [groundingFinished]
  );

  // --- AI Gratitude Journal State ---
  const [journalMood, setJournalMood] = useState('Tenang');
  const [journalGratitude, setJournalGratitude] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [isAnalyzingJournal, setIsAnalyzingJournal] = useState(false);
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([
    {
      id: 'j1',
      date: 'Kemarin, 21:40',
      mood: 'Lega',
      gratitude: 'Secangkir teh hangat dan teman yang mendengarkan tanpa menghakimi.',
      content: 'Hari ini sempat overthinking soal revisi skripsi, tapi setelah latihan napas 4-7-8 dan jalan kaki sebentar di sekitar kosan, kepalaku terasa jauh lebih ringan.',
      aiReflection: {
        summary: 'Kamu menunjukkan kesadaran diri yang luar biasa dalam meregulasi emosi.',
        emotionalInsights: [
          'Mengambil jeda fisik (jalan kaki) terbukti efektif meredakan flight-or-fight response.',
          'Rasa syukurmu pada hal-hal kecil memperkuat ketahanan mentalmu.',
        ],
        affirmation: 'Setiap hari adalah kanvas baru. Kamu melangkah maju dengan kecepatan yang tepat untukmu.',
        sentimentScore: 0.85,
      },
    },
  ]);

  // Breathing Cycle Interval Engine
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathingPattern === '4-7-8') {
              if (breathPhase === 'Inhale') {
                soundEngine.playInhaleChime();
                setBreathPhase('Hold');
                return 7;
              } else if (breathPhase === 'Hold') {
                soundEngine.playExhaleChime();
                setBreathPhase('Exhale');
                return 8;
              } else {
                soundEngine.playInhaleChime();
                setBreathPhase('Inhale');
                setCyclesCompleted((c) => c + 1);
                return 4;
              }
            } else if (breathingPattern === 'box') {
              // 4-4-4-4
              if (breathPhase === 'Inhale') {
                setBreathPhase('Hold');
                return 4;
              } else if (breathPhase === 'Hold') {
                soundEngine.playExhaleChime();
                setBreathPhase('Exhale');
                return 4;
              } else if (breathPhase === 'Exhale') {
                setBreathPhase('Rest');
                return 4;
              } else {
                soundEngine.playInhaleChime();
                setBreathPhase('Inhale');
                setCyclesCompleted((c) => c + 1);
                return 4;
              }
            } else {
              // 5-5 Deep Calm
              if (breathPhase === 'Inhale') {
                soundEngine.playExhaleChime();
                setBreathPhase('Exhale');
                return 5;
              } else {
                soundEngine.playInhaleChime();
                setBreathPhase('Inhale');
                setCyclesCompleted((c) => c + 1);
                return 5;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, breathingPattern]);

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      soundEngine.playInhaleChime();
      setBreathPhase('Inhale');
      setPhaseSecondsLeft(breathingPattern === '4-7-8' ? 4 : breathingPattern === 'box' ? 4 : 5);
      setIsBreathingActive(true);
    } else {
      setIsBreathingActive(false);
    }
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('Inhale');
    setPhaseSecondsLeft(breathingPattern === '4-7-8' ? 4 : 4);
    setCyclesCompleted(0);
  };

  // Sound mixer handlers
  const handleRainChange = (val: number) => {
    setRainVol(val);
    soundEngine.setRainVolume(val / 100);
  };

  const handleOceanChange = (val: number) => {
    setOceanVol(val);
    soundEngine.setOceanVolume(val / 100);
  };

  const handleDroneChange = (val: number) => {
    setDroneVol(val);
    soundEngine.setAlphaDroneVolume(val / 100);
  };

  const applySoundPreset = (rain: number, ocean: number, drone: number) => {
    handleRainChange(rain);
    handleOceanChange(ocean);
    handleDroneChange(drone);
  };

  // Journal Submission
  const handleSaveJournal = async () => {
    if (!journalContent.trim() || isAnalyzingJournal) return;

    setIsAnalyzingJournal(true);
    try {
      const res = await fetch('/api/ai/journal-reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry: journalContent,
          mood: journalMood,
          gratitude: journalGratitude,
        }),
      });

      const data = await res.json();
      const newEntry: JournalEntry = {
        id: `j-${Date.now()}`,
        date: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        mood: journalMood,
        gratitude: journalGratitude,
        content: journalContent,
        aiReflection: {
          summary: data.summary || 'Refleksi yang berharga untuk merawat jiwamu.',
          emotionalInsights: data.emotionalInsights || ['Kamu berani menatap perasaanmu tanpa menyangkal.'],
          affirmation: data.affirmation || 'Kamu berharga dan pantas mendapatkan ketenangan.',
          sentimentScore: data.sentimentScore || 0.8,
        },
      };

      setSavedEntries([newEntry, ...savedEntries]);
      setJournalContent('');
      setJournalGratitude('');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      console.error('Journal reflect error:', e);
    } finally {
      setIsAnalyzingJournal(false);
    }
  };

  const subTabs: { id: typeof activeSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'breathing', label: 'Napas', icon: <Wind className="w-4 h-4" /> },
    { id: 'grounding', label: 'Grounding', icon: <Compass className="w-4 h-4" /> },
    { id: 'sounds', label: 'Suara Tenang', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'journal', label: 'Jurnal', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'activities', label: 'Aktivitas', icon: <Dumbbell className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Warm, low-key greeting — sets the tone before anything else loads */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-[28px] bg-gradient-to-r from-indigo-50 via-white to-white border border-indigo-100">
        <div className="p-2 rounded-full bg-white text-indigo-500 shadow-2xs shrink-0">{greeting.icon}</div>
        <div>
          <p className="text-sm font-black text-indigo-950">{greeting.text}.</p>
          <p className="text-xs font-medium text-indigo-500 mt-0.5 leading-relaxed">{supportLine}</p>
        </div>
      </div>

      {/* Sub-nav Tabs in floating pill design */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 bg-white p-2 rounded-full border-2 border-indigo-100 shadow-xl shadow-indigo-100/40 max-w-2xl mx-auto overflow-x-auto">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            id={`subtab-${tab.id}`}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-indigo-950 hover:bg-indigo-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. BREATHING VISUALIZER SUBTAB */}
      {activeSubTab === 'breathing' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] border-2 border-indigo-50 shadow-xl shadow-indigo-100/60 p-6 sm:p-10 flex flex-col items-center text-center">
            {/* Pattern Switcher */}
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-[#F0F2FF] rounded-full border-2 border-indigo-100">
              {(['4-7-8', 'box', '5-5'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => { setBreathingPattern(p); resetBreathing(); }}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                    breathingPattern === p ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-indigo-900 hover:bg-white'
                  }`}
                >
                  {patternInfo[p].label}
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-indigo-400 mt-3 max-w-sm">{patternInfo[breathingPattern].why}</p>

            {/* Morphing Animated Breathing Circle */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-6">
              {/* Outer Pulse Rings */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 motion-reduce:transition-none ${
                  isBreathingActive && breathPhase === 'Inhale'
                    ? 'scale-115 bg-indigo-200/50'
                    : isBreathingActive && breathPhase === 'Hold'
                    ? 'scale-105 bg-purple-200/50'
                    : 'scale-90 bg-slate-100'
                }`}
              />
              <div
                className={`absolute inset-4 rounded-full transition-all duration-1000 motion-reduce:transition-none ${
                  isBreathingActive && breathPhase === 'Inhale'
                    ? 'scale-110 bg-indigo-300/60'
                    : isBreathingActive && breathPhase === 'Hold'
                    ? 'scale-100 bg-purple-300/60'
                    : 'scale-85 bg-slate-200/60'
                }`}
              />

              {/* Main Core Circle */}
              <div
                className={`w-48 h-48 sm:w-52 sm:h-52 rounded-full shadow-2xl flex flex-col items-center justify-center text-white z-10 transition-all duration-1000 motion-reduce:transition-none ${
                  breathPhase === 'Inhale'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 scale-105 shadow-indigo-300/60'
                    : breathPhase === 'Hold'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-500 scale-100 shadow-purple-300/60'
                    : breathPhase === 'Exhale'
                    ? 'bg-gradient-to-br from-teal-500 to-indigo-600 scale-95 shadow-teal-300/60'
                    : 'bg-gradient-to-br from-indigo-800 to-slate-800 scale-90'
                }`}
              >
                <span className="text-xs uppercase font-black tracking-widest text-indigo-100 mb-1">
                  {isBreathingActive ? breathPhase : 'Siap Mulai'}
                </span>
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                  {isBreathingActive ? phaseSecondsLeft : '✨'}
                </span>
                <span className="text-xs text-white/90 mt-1 font-bold">
                  {breathPhase === 'Inhale' && 'Tarik Napas...'}
                  {breathPhase === 'Hold' && 'Tahan Santai...'}
                  {breathPhase === 'Exhale' && 'Hembuskan Perlahan...'}
                  {breathPhase === 'Rest' && 'Jeda Rileks...'}
                </span>
              </div>
            </div>

            {/* Cycle Counter + gentle encouragement */}
            <div className="text-xs text-indigo-900 font-bold">
              Siklus Selesai: <strong className="text-indigo-600 font-mono text-sm">{cyclesCompleted}</strong> putaran
            </div>
            {cyclesCompleted > 0 && (
              <p className="text-xs font-medium text-indigo-400 mt-1.5">
                {cyclesCompleted < 3
                  ? 'Bagus, terus ikuti ritmenya sesuai kenyamananmu.'
                  : 'Kamu sudah bertahan cukup lama. Boleh berhenti kapan pun terasa cukup.'}
              </p>
            )}

            {/* Play/Pause/Reset Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                id="toggle-breathing-btn"
                onClick={toggleBreathing}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-200 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isBreathingActive ? 'Jeda Latihan' : 'Mulai Sekarang'}</span>
              </button>

              <button
                id="reset-breathing-btn"
                onClick={resetBreathing}
                className="p-3.5 rounded-2xl bg-[#F0F2FF] hover:bg-indigo-100 text-indigo-900 border border-indigo-100 transition-all cursor-pointer"
                title="Reset Latihan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 5-4-3-2-1 GROUNDING SUBTAB — earthy palette, distinct from breathing's indigo */}
      {activeSubTab === 'grounding' && (
        <div className="bg-white rounded-[40px] border-2 border-amber-50 p-6 sm:p-10 shadow-xl shadow-amber-100/50 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Kembali ke momen ini, lewat panca indera
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-500 mt-1.5 max-w-xl">
              Saat pikiran terasa berlarian atau cemas menumpuk, teknik ini membantu tubuhmu perlahan kembali tenang — satu indera pada satu waktu.
            </p>
          </div>

          {!groundingFinished ? (
            <>
              {/* Stepper Navigator */}
              <div className="grid grid-cols-5 gap-2.5">
                {groundingPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGroundingStep(idx)}
                    className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                      groundingStep === idx
                        ? 'border-amber-500 bg-amber-50/80 text-stone-900 ring-2 ring-amber-200 font-black shadow-sm'
                        : groundingInputs[idx]
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-100 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{p.icon}</span>
                    <span className="text-xs font-black block">{p.count} Hal</span>
                    <span className="text-[10px] font-bold text-stone-400 truncate block">{p.sense.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Current Step Card */}
              <div className="p-6 sm:p-7 bg-[#FBF6EE] rounded-[32px] border-2 border-amber-100 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{groundingPrompts[groundingStep].icon}</span>
                  <div>
                    <h3 className="text-lg font-black text-stone-900">
                      Langkah {groundingStep + 1}: {groundingPrompts[groundingStep].count} Hal {groundingPrompts[groundingStep].sense}
                    </h3>
                    <p className="text-xs font-bold text-stone-600 mt-0.5 leading-relaxed">
                      {groundingPrompts[groundingStep].desc}
                    </p>
                  </div>
                </div>

                <textarea
                  value={groundingInputs[groundingStep]}
                  onChange={(e) => {
                    const next = [...groundingInputs];
                    next[groundingStep] = e.target.value;
                    setGroundingInputs(next);
                  }}
                  placeholder="Ketik apa yang kamu amati di sini (atau cukup rasakan dalam hening)..."
                  rows={3}
                  className="w-full bg-white rounded-2xl p-4 text-xs sm:text-sm font-medium text-stone-900 placeholder-stone-300 border-2 border-amber-100 focus:outline-hidden focus:border-amber-500 transition-all"
                />

                <div className="flex justify-between items-center pt-2">
                  <button
                    disabled={groundingStep === 0}
                    onClick={() => setGroundingStep((s) => s - 1)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-black text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-30 border border-stone-100 cursor-pointer"
                  >
                    ← Sebelumnya
                  </button>

                  {groundingStep < 4 ? (
                    <button
                      onClick={() => {
                        soundEngine.playInhaleChime();
                        setGroundingStep((s) => s + 1);
                      }}
                      className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-lg shadow-amber-200 transition-all cursor-pointer"
                    >
                      Lanjut ke Langkah {groundingStep + 2} →
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundEngine.playExhaleChime();
                        confetti({ particleCount: 60, spread: 70 });
                        setGroundingFinished(true);
                      }}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-200 transition-all cursor-pointer"
                    >
                      Selesai ✨
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 sm:p-10 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-[32px] border-2 border-emerald-100 text-center space-y-4">
              <span className="text-4xl block">🌿</span>
              <p className="text-sm sm:text-base font-black text-stone-900 max-w-md mx-auto leading-relaxed">
                {closingLine}
              </p>
              <button
                onClick={() => {
                  setGroundingFinished(false);
                  setGroundingStep(0);
                  setGroundingInputs(['', '', '', '', '']);
                }}
                className="px-5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-black border border-stone-200 cursor-pointer"
              >
                Ulangi Latihan
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. AMBIENT SOUNDSCAPES MIXER SUBTAB — cool water/sky palette */}
      {activeSubTab === 'sounds' && (
        <div className="bg-white rounded-[40px] border-2 border-sky-50 p-6 sm:p-10 shadow-xl shadow-sky-100/50 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Racik suara yang paling menenangkan telingamu
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1.5 max-w-xl">
              Campurkan hujan, ombak, dan gelombang alpha sesuai kenyamananmu. Semua diproses langsung di perangkatmu, jadi tidak perlu koneksi internet setelah dimuat.
            </p>
          </div>

          {/* One-tap presets */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Menjelang Tidur', vals: [70, 25, 20] as const },
              { label: 'Fokus Belajar', vals: [15, 10, 55] as const },
              { label: 'Rileks Sore', vals: [30, 60, 15] as const },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => applySoundPreset(...preset.vals)}
                className="px-4 py-2 rounded-full text-xs font-black text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rain */}
            <div className="p-6 rounded-[32px] bg-white border-2 border-sky-100 shadow-md shadow-sky-100/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <CloudRain className="w-5 h-5 text-sky-600" />
                  <span>Hujan Teduh</span>
                </div>
                <span className="text-xs font-mono font-black text-sky-600">{rainVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainVol}
                onChange={(e) => handleRainChange(Number(e.target.value))}
                aria-label="Volume suara hujan"
                className="w-full accent-sky-600 cursor-pointer"
              />
              <p className="text-[11px] font-medium text-slate-400">
                Rintik lembut dengan nuansa pink noise untuk relaksasi.
              </p>
            </div>

            {/* Ocean */}
            <div className="p-6 rounded-[32px] bg-white border-2 border-sky-100 shadow-md shadow-sky-100/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <Waves className="w-5 h-5 text-teal-600" />
                  <span>Ombak Lautan</span>
                </div>
                <span className="text-xs font-mono font-black text-teal-600">{oceanVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={oceanVol}
                onChange={(e) => handleOceanChange(Number(e.target.value))}
                aria-label="Volume suara ombak"
                className="w-full accent-teal-600 cursor-pointer"
              />
              <p className="text-[11px] font-medium text-slate-400">
                Deburan periodik yang bisa membantu menyelaraskan ritme napasmu.
              </p>
            </div>

            {/* Alpha Drone */}
            <div className="p-6 rounded-[32px] bg-white border-2 border-sky-100 shadow-md shadow-sky-100/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <Music className="w-5 h-5 text-indigo-600" />
                  <span>Alpha Wave 432Hz</span>
                </div>
                <span className="text-xs font-mono font-black text-indigo-600">{droneVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={droneVol}
                onChange={(e) => handleDroneChange(Number(e.target.value))}
                aria-label="Volume gelombang alpha"
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] font-medium text-slate-400">
                Drone lembut yang cocok didengar saat kamu perlu fokus tenang.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                applySoundPreset(0, 0, 0);
                soundEngine.stopAll();
              }}
              className="px-5 py-2.5 rounded-2xl text-xs font-black text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-1.5 cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              <span>Hentikan Semua Suara</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. AI GRATITUDE JOURNAL SUBTAB — warm paper palette, serif for the human voice */}
      {activeSubTab === 'journal' && (
        <div className="space-y-6 animate-in fade-in">
          {/* New Entry Card */}
          <div className="bg-white rounded-[40px] border-2 border-rose-50 p-6 sm:p-8 shadow-xl shadow-rose-100/40 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-stone-900">
                  Ruang jujur untuk dirimu
                </h2>
                <p className="text-xs font-bold text-stone-400">Ditulis dengan katamu sendiri, ditemani refleksi dari Aria</p>
              </div>

              {/* Mood picker */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {['🌿 Tenang', '⚡ Cemas', '😴 Lelah', '✨ Bersyukur'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setJournalMood(m.split(' ')[1])}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      journalMood === m.split(' ')[1]
                        ? 'bg-rose-100 text-rose-950 border border-rose-300 shadow-2xs'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Gratitude Prompt */}
            <div>
              <label className="text-xs font-black text-stone-900 block mb-1.5">
                Hal kecil yang aku syukuri hari ini
              </label>
              <input
                type="text"
                value={journalGratitude}
                onChange={(e) => setJournalGratitude(e.target.value)}
                placeholder="Misal: kopi pagi, telepon dari ibu, tugas selesai tepat waktu..."
                className="w-full bg-stone-50 rounded-2xl p-3 text-xs sm:text-sm font-medium text-stone-900 border-2 border-stone-100 focus:outline-hidden focus:border-rose-400 focus:bg-white"
              />
            </div>

            {/* Main Journal Content */}
            <div>
              <label className="text-xs font-black text-stone-900 block mb-1.5">
                Apa pun yang sedang kamu rasakan
              </label>
              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="Tuliskan apa saja tanpa sensor. Tidak ada yang salah di sini..."
                rows={4}
                className="w-full bg-stone-50 rounded-2xl p-3.5 text-xs sm:text-sm font-medium text-stone-900 border-2 border-stone-100 focus:outline-hidden focus:border-rose-400 focus:bg-white resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                id="save-journal-btn"
                onClick={handleSaveJournal}
                disabled={!journalContent.trim() || isAnalyzingJournal}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-black text-xs shadow-lg shadow-rose-200 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                {isAnalyzingJournal ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
                <span>{isAnalyzingJournal ? 'Menganalisis dengan lembut...' : 'Simpan & Dapatkan Refleksi'}</span>
              </button>
            </div>
          </div>

          {/* Past Entries Log */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider px-1">
              Riwayat jurnalmu
            </h3>
            {savedEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-[32px] border-2 border-stone-50 p-6 shadow-lg shadow-stone-100/40 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-stone-900">{entry.date}</span>
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-900 font-black border border-rose-200">
                    {entry.mood}
                  </span>
                </div>

                {entry.gratitude && (
                  <p className="text-xs text-amber-950 bg-amber-50 p-3 rounded-2xl border border-amber-200 font-bold">
                    ✨ {entry.gratitude}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-stone-900 font-medium leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>

                {entry.aiReflection && (
                  <div className="mt-3 p-5 bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl border-2 border-rose-100 text-xs space-y-3">
                    <div className="flex items-center gap-1.5 font-black text-stone-900">
                      <Feather className="w-4 h-4 text-rose-500" />
                      <span>Refleksi dari Aria</span>
                    </div>
                    <p className="text-stone-700 font-medium">{entry.aiReflection.summary}</p>
                    <div className="text-sm text-stone-900 font-serif italic bg-white p-4 rounded-xl border border-rose-100 shadow-2xs leading-relaxed">
                      "{entry.aiReflection.affirmation}"
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. REFRESHING ACTIVITIES SUBTAB */}
      {activeSubTab === 'activities' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Intro Banner */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[32px] p-6 border-2 border-orange-100 text-center">
            <h2 className="text-xl font-black text-stone-900">
              Kadang jiwa butuh gerak, bukan cuma diam
            </h2>
            <p className="text-xs text-stone-600 font-medium mt-1.5 max-w-xl mx-auto leading-relaxed">
              Napas dan jurnal penting, tapi keluar rumah dan bergerak juga membantu. Pilih kategori yang paling menarik buatmu sekarang.
            </p>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {activityCategories.map((cat) => (
              <button
                key={cat.id}
                id={`activity-category-${cat.id}`}
                onClick={() => setActiveActivityCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap cursor-pointer border-2 ${
                  activeActivityCategory === cat.id
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200'
                    : 'bg-white text-stone-700 border-stone-100 hover:bg-orange-50'
                }`}
              >
                {activityCategoryIcons[cat.id]}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Selected Category Detail */}
          {activityCategories
            .filter((cat) => cat.id === activeActivityCategory)
            .map((cat) => (
              <div key={cat.id} className="space-y-5">
                <div className="bg-white rounded-[40px] border-2 border-orange-50 p-6 sm:p-8 shadow-xl shadow-orange-100/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
                      {activityCategoryIcons[cat.id]}
                    </div>
                    <h3 className="text-lg font-black text-stone-900">{cat.name}</h3>
                  </div>
                  <p className="text-xs font-bold text-orange-500">{cat.tagline}</p>
                  <p className="text-xs text-stone-600 font-medium mt-2 leading-relaxed">{cat.benefit}</p>
                </div>

                {/* Places */}
                <div>
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider px-1 mb-3">
                    Saran Tempat
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {cat.places.map((place) => (
                      <div
                        key={place.id}
                        id={`activity-place-${place.id}`}
                        className="p-5 rounded-[28px] bg-white border-2 border-orange-50 shadow-md shadow-orange-100/30 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-sm font-black text-stone-900">{place.name}</h5>
                          {place.priceRange && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1 whitespace-nowrap">
                              {place.priceRange}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-500">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{place.location}</span>
                        </div>
                        <p className="text-xs text-stone-600 font-medium leading-relaxed">{place.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {place.tags.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-1 text-[10px] font-black text-orange-700 bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exercises (gym only) */}
                {cat.exercises && (
                  <div>
                    <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider px-1 mb-3">
                      Rekomendasi Gerakan
                    </h4>
                    <div className="space-y-3">
                      {cat.exercises.map((ex) => (
                        <div
                          key={ex.id}
                          id={`activity-exercise-${ex.id}`}
                          className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-start gap-3"
                        >
                          <div className="p-2 rounded-xl bg-white text-orange-600 shadow-2xs">
                            <Dumbbell className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-stone-900">{ex.name}</span>
                              <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 whitespace-nowrap">
                                <Clock className="w-3 h-3" />
                                {ex.duration}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600 font-medium mt-0.5 leading-relaxed">{ex.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="p-5 sm:p-6 rounded-[28px] bg-amber-50/60 border-2 border-amber-100">
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Tips Ringan
                  </h4>
                  <ul className="space-y-2">
                    {cat.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-amber-950/90 font-medium leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};