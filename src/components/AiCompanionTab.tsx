import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Wind, 
  Compass, 
  BookOpen, 
  Users, 
  ShieldAlert, 
  RefreshCw, 
  MessageSquareHeart,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Smile
} from 'lucide-react';
import { ChatMessage } from '../types';
import { soundEngine } from '../utils/audioSynth';

interface AiCompanionTabProps {
  onOpenBreathing: () => void;
  onOpenGrounding: () => void;
  onOpenJournal: () => void;
  onOpenCounseling: () => void;
  onOpenCrisis: () => void;
  userMood: string;
}

export const AiCompanionTab: React.FC<AiCompanionTabProps> = ({
  onOpenBreathing,
  onOpenGrounding,
  onOpenJournal,
  onOpenCounseling,
  onOpenCrisis,
  userMood,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content: 'Halo teman! 🌿 Aku Aria, AI Mental Wellness Companion-mu di Souls Care. Di sini adalah ruang aman 100% tanpa penghakiman. Mau berbagi apa yang lagi terasa berat di pikiranmu hari ini? Atau mau ditemani latihan napas santai dulu?',
      timestamp: 'Baru saja',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState<'empathetic' | 'solution' | 'reflective'>('empathetic');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: '🤯 Lagi overthinking masa depan & karir', text: 'Aria, aku lagi overthinking banget mikirin masa depan dan karir. Rasanya tertinggal jauh dari orang lain dan takut gagal.' },
    { label: '😴 Burnout skripsi / kerjaan menumpuk', text: 'Aku ngerasa burnout banget sama tugas dan deadline. Mau ngerjain tapi rasanya lelah mental dan fisik.' },
    { label: '💔 Lagi patah hati & butuh validasi', text: 'Aku lagi ngerasa sedih banget karena masalah hubungan. Susah fokus dan dadaku terasa sesak.' },
    { label: '🌬️ Tolong pandu aku tarik napas', text: 'Pikiranku lagi penuh dan sesak, bisa temani aku latihan pernapasan penenang sekarang?' },
    { label: '🫂 Ngerasa kesepian & gak punya teman cerita', text: 'Kadang aku ngerasa sendirian banget di tengah keramaian, gak tahu harus cerita ke siapa.' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    if (soundEnabled) {
      soundEngine.playInhaleChime();
    }

    try {
      const response = await fetch('/api/chat/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          tone,
          userContext: {
            mood: userMood,
            time: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi Aria server');
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Aku di sini mendengarkanmu. Ceritakan pelan-pelan ya...',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        suggestedExercise: data.suggestedExercise,
      };

      setMessages(prev => [...prev, aiMsg]);

      if (soundEnabled) {
        soundEngine.playExhaleChime();
      }
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'model',
        content: 'Terima kasih sudah bercerita. Apa yang kamu rasakan sangat valid. Cobalah letakkan tangan di dadamu dan tarik napas perlahan. Aku selalu ada di sini untuk mendengarkanmu.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Vibrant Hero Banner matching Design HTML */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-[40px] p-6 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-200/50">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest text-indigo-100 mb-3">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>Souls AI • Weltie</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight tracking-tight">
            "Bagaimana kondisi hatimu hari ini?"
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 font-medium mb-6 leading-relaxed">
            Ruang aman 100% tanpa penghakiman. Luapkan overthinking, beban skripsi, quarter-life crisis, atau luangkan jeda napas bersama Aria.
          </p>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                const el = document.getElementById('aria-chat-input');
                el?.focus();
              }}
              className="bg-white text-indigo-600 px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-indigo-900/20 hover:scale-105 transition-all text-sm cursor-pointer"
            >
              Curhat ke Weltie Sekarang
            </button>
            <button 
              onClick={onOpenBreathing}
              className="bg-indigo-400/30 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl font-black hover:bg-indigo-400/40 transition-all text-sm cursor-pointer"
            >
              Daily Vibe & Napas 🌬️
            </button>
          </div>
        </div>

        {/* Ambient Blur & Fun Vibrant Orbs */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden sm:flex absolute right-14 top-10 w-20 h-20 animate-bounce drop-shadow-xl">
          <svg viewBox="0 0 680 400" className="w-full h-full" style={{ transform: 'scale(2.3) translate(-5%, -10%)' }}>
            <defs>
              <linearGradient id="weltieBlobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <path d="M340 110 C410 110 460 160 460 225 C460 290 405 330 340 330 C275 330 220 290 220 225 C220 160 270 110 340 110 Z" fill="url(#weltieBlobGrad)" />
            <ellipse cx="290" cy="180" rx="10" ry="14" fill="#ffffff" />
            <ellipse cx="390" cy="180" rx="10" ry="14" fill="#ffffff" />
            <ellipse cx="290" cy="184" rx="5" ry="7" fill="#3730a3" />
            <ellipse cx="390" cy="184" rx="5" ry="7" fill="#3730a3" />
            <circle cx="260" cy="215" r="14" fill="#fda4c7" opacity="0.7" />
            <circle cx="420" cy="215" r="14" fill="#fda4c7" opacity="0.7" />
            <path d="M305 225 Q340 255 375 225" fill="none" stroke="#3730a3" strokeWidth="5" strokeLinecap="round" />
            <path d="M340 108 C330 85 345 65 365 60 C355 80 358 98 340 108 Z" fill="#34d399" />
          </svg>
        </div>
      </div>

      {/* 2 Pastel Feature Highlights from Design HTML */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Counseling Mint Block */}
        <div 
          onClick={onOpenCounseling}
          className="bg-[#D1FAE5] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between border-b-4 border-emerald-300 hover:scale-[1.01] transition-all cursor-pointer shadow-sm"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-emerald-950 font-black text-xl">Konseling Profesional</h3>
              <span className="text-[10px] font-black text-emerald-900 bg-white/70 px-3 py-1 rounded-full uppercase tracking-wider">
                Sliding-Scale
              </span>
            </div>
            <p className="text-emerald-800 text-sm font-medium">Konsultasi dengan psikolog & psikiater terverifikasi HIMPSI</p>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-emerald-200/60">
            <span className="text-xs font-black text-emerald-900 bg-white px-3.5 py-1.5 rounded-full shadow-2xs">
              Mulai Rp 15.000 / sesi
            </span>
            <div className="flex items-center gap-1 text-emerald-900 font-bold text-xs">
              <span>Pilih Jadwal</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Goal Savings Honey/Amber Block */}
        <div className="bg-[#FEF3C7] rounded-[32px] p-6 sm:p-7 flex flex-col justify-between border-b-4 border-amber-300 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-amber-950 font-black text-xl">Souls Vault Savings</h3>
              <span className="text-[10px] font-black text-amber-900 bg-white/70 px-3 py-1 rounded-full uppercase tracking-wider">
                +15% Match Bonus
              </span>
            </div>
            <p className="text-amber-800 text-sm font-medium">Tabungan dana darurat & sesi terapi untuk masa depanmu</p>
          </div>
          <div className="space-y-2 mt-5">
            <div className="w-full bg-white/80 h-3 rounded-full overflow-hidden p-0.5">
              <div className="bg-amber-500 w-3/4 h-full rounded-full transition-all" />
            </div>
            <div className="flex justify-between text-xs font-black text-amber-900">
              <span>Tercapai Rp 185.000 / Rp 250.000</span>
              <span className="text-emerald-800">74%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface in Pure White Rounded Card */}
      <div className="bg-white rounded-[40px] p-6 sm:p-8 shadow-xl shadow-indigo-100/60 border-2 border-indigo-50 flex flex-col h-[650px]">
        {/* Chat Control Toolbar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-indigo-50 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-indigo-950">Weltie Chat Space</h3>
              <p className="text-[11px] font-bold text-indigo-400">Terenkripsi • 100% Rahasia & Aman</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50/70 p-1.5 rounded-2xl border border-indigo-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 px-2">Gaya Respon:</span>
            <button
              onClick={() => setTone('empathetic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                tone === 'empathetic' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-indigo-900 hover:bg-white'
              }`}
            >
              Empatik
            </button>
            <button
              onClick={() => setTone('solution')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                tone === 'solution' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-indigo-900 hover:bg-white'
              }`}
            >
              Solutif
            </button>
            <button
              onClick={() => setTone('reflective')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                tone === 'reflective' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-indigo-900 hover:bg-white'
              }`}
            >
              Reflektif
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl hover:bg-white text-indigo-700 ml-1 cursor-pointer"
              title={soundEnabled ? 'Matikan suara chime' : 'Nyalakan suara chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div 
          id="aria-chat-messages-container"
          className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40 rounded-3xl my-4 border border-indigo-50/80"
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {!isUser && (
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-200">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 sm:p-5 rounded-3xl text-sm leading-relaxed font-medium ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-lg shadow-indigo-200'
                        : 'bg-white border-2 border-indigo-100 text-indigo-950 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Interactive Quick Action Pill if Suggested */}
                  {!isUser && msg.suggestedExercise && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.suggestedExercise === 'breathing' && (
                        <button
                          onClick={onOpenBreathing}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#D1FAE5] hover:bg-emerald-200 text-emerald-950 border border-emerald-300 text-xs font-black shadow-xs transition-all hover:scale-102 cursor-pointer"
                        >
                          <Wind className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Mulai Latihan Napas 4-7-8</span>
                        </button>
                      )}
                      {msg.suggestedExercise === 'grounding' && (
                        <button
                          onClick={onOpenGrounding}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-xs font-black shadow-xs transition-all hover:scale-102 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Latihan Grounding 5-4-3-2-1</span>
                        </button>
                      )}
                      {msg.suggestedExercise === 'journal' && (
                        <button
                          onClick={onOpenJournal}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FEF3C7] hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-black shadow-xs transition-all hover:scale-102 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                          <span>Tulis Jurnal Refleksi Jiwa</span>
                        </button>
                      )}
                      {msg.suggestedExercise === 'counseling' && (
                        <button
                          onClick={onOpenCounseling}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 text-xs font-black shadow-xs transition-all hover:scale-102 cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-purple-700" />
                          <span>Cari Psikolog Tarif Sliding-Scale</span>
                        </button>
                      )}
                    </div>
                  )}

                  <span className={`text-[10px] font-bold text-indigo-300 block ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-10 h-10 rounded-2xl bg-white border-2 border-indigo-100 flex items-center justify-center text-indigo-900 shrink-0 font-black text-xs shadow-xs">
                    Kamu
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 bg-white border-2 border-indigo-100 rounded-3xl rounded-tl-xs shadow-xs text-xs font-bold text-indigo-900 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                <span>Weltie sedang merangkai tanggapan empatik...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div className="py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider shrink-0">
            Topik Cepat:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.text)}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-950 border-2 border-indigo-100 hover:border-indigo-200 text-xs font-bold whitespace-nowrap transition-all shrink-0 disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="pt-2">
          <div className="flex items-end gap-2 bg-[#F0F2FF] rounded-3xl border-2 border-indigo-100 p-2 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <textarea
              id="aria-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ceritakan apa saja yang ada di pikiranmu hari ini (Tekan Enter untuk kirim)..."
              rows={2}
              className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm font-medium text-indigo-950 placeholder-indigo-300 focus:outline-hidden p-2 max-h-32"
            />
            <div className="flex items-center gap-1.5 pb-1 pr-1">
              <button
                id="send-aria-msg-btn"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Kirim Pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-indigo-400 px-2">
            <span>Privasi terjamin • Enkripsi end-to-end tanpa penyimpanan data sensitif</span>
            <button 
              onClick={onOpenCrisis} 
              className="text-rose-600 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Butuh Bantuan Krisis Cepat?</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};