import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Send, 
  MessageSquare, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Award,
  Lock
} from 'lucide-react';
import { Counselor, Booking } from '../types';
import confetti from 'canvas-confetti';

interface ConsultationRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  counselor: Counselor | null;
}

export const ConsultationRoomModal: React.FC<ConsultationRoomModalProps> = ({
  isOpen,
  onClose,
  booking,
  counselor,
}) => {
  if (!isOpen || !counselor) return null;

  const [activeView, setActiveView] = useState<'video' | 'notes'>('video');
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(120); // start at 2m
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [userNotes, setUserNotes] = useState(
    'Catatan sesi:\n- Mengidentifikasi pemicu overthinking saat malam hari\n- Rencana aksi: membatasi screen time 1 jam sebelum tidur dan grounding 5-4-3-2-1'
  );

  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: counselor.name,
      text: `Halo! Selamat datang di sesi konseling Souls Care. Senang bisa bertemu denganmu hari ini. Tarik napas santai ya, ruang ini sepenuhnya rahasia dan aman. Boleh ceritakan apa yang paling mengganjal di hatimu belakangan ini?`,
      time: '16:02',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Stopwatch timer
  useEffect(() => {
    if (sessionCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionCompleted]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'Kamu', text: userText, time: now }]);
    setChatInput('');

    // Simulated empathetic therapist response after 1.5s
    setTimeout(() => {
      const therapistReplies = [
        `Aku mendengar betapa beratnya beban itu untukmu. Reaksi tubuh dan emosimu sangat wajar mengingat situasi yang kamu hadapi. Mari kita uraikan satu per satu bersama ya.`,
        `Terima kasih sudah sangat berani mengutarakannya. Itu adalah langkah awal yang sangat berharga. Apa yang biasanya membantumu merasa sedikit lebih tenang saat hal itu terjadi?`,
        `Bagus sekali refleksimu. Jangan lupa bahwa kamu tidak harus menyelesaikan semuanya dalam satu malam. Mari kita buat satu target kecil yang realistis untuk minggu ini.`,
      ];
      const randomReply = therapistReplies[Math.floor(Math.random() * therapistReplies.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          sender: counselor.name,
          text: randomReply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  const handleFinishSession = () => {
    setSessionCompleted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        {/* Top Session Header */}
        <div className="bg-slate-950/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-teal-400/40">
              <img 
                src={counselor.avatar} 
                alt={counselor.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-['Outfit',sans-serif]">{counselor.name}</h3>
                <span className="flex items-center gap-1 text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                  <ShieldCheck className="w-3 h-3" /> Terverifikasi HIMPSI
                </span>
              </div>
              <p className="text-xs text-slate-400">{counselor.title} • Sesi {booking?.type || 'Video Call'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-200">
                {formatTimer(elapsedSeconds)} / 50:00
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Consultation Arena */}
        {!sessionCompleted ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
            {/* Left 2 Cols: Video Feed or Notes */}
            <div className="lg:col-span-2 bg-slate-950 p-4 flex flex-col justify-between relative">
              {activeView === 'video' ? (
                <div className="flex-1 grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-4 relative">
                  {/* Counselor Video Stream */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group">
                    <img 
                      src={counselor.avatar} 
                      alt={counselor.name} 
                      className="w-full h-full object-cover filter brightness-95" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{counselor.name}</span>
                    </div>
                  </div>

                  {/* User Self Video Stream */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {videoOn ? (
                      <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-indigo-950 flex flex-col items-center justify-center text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xl font-bold mb-2">
                          Kamu
                        </div>
                        <p className="text-xs text-slate-300 font-medium">Kamera Aktif (Koneksi HD)</p>
                        <span className="text-[10px] text-teal-400 mt-1">Sesi Terenkripsi End-to-End</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <VideoOff className="w-10 h-10 mb-2" />
                        <p className="text-xs">Kamera Dimatikan</p>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-700">
                      <span>Kamu (Klien)</span>
                      {!micOn && <MicOff className="w-3 h-3 text-rose-400" />}
                    </div>
                  </div>
                </div>
              ) : (
                /* Private Notes View */
                <div className="flex-1 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Catatan Pribadi Selama Konseling
                    </h4>
                    <span className="text-[10px] text-slate-400">Hanya tersimpan di perangkatmu</span>
                  </div>
                  <textarea
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    className="flex-1 w-full bg-slate-950/60 rounded-xl p-3 text-xs text-slate-200 border border-slate-800 focus:outline-hidden focus:border-teal-500 font-sans leading-relaxed resize-none"
                    placeholder="Tulis poin-poin refleksi atau insight dari psikolog di sini..."
                  />
                </div>
              )}

              {/* Bottom Control Bar */}
              <div className="mt-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`p-3 rounded-xl transition-all ${
                      micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                    title={micOn ? 'Mute Mic' : 'Unmute Mic'}
                  >
                    {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setVideoOn(!videoOn)}
                    className={`p-3 rounded-xl transition-all ${
                      videoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                    title={videoOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}
                  >
                    {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setActiveView(activeView === 'video' ? 'notes' : 'video')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeView === 'notes' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{activeView === 'notes' ? 'Kembali ke Video' : 'Catatan Sesi'}</span>
                  </button>
                </div>

                <button
                  id="finish-consultation-btn"
                  onClick={handleFinishSession}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all hover:scale-102"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Selesaikan Sesi</span>
                </button>
              </div>
            </div>

            {/* Right Col: Live In-Session Chat */}
            <div className="border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60 flex flex-col h-full overflow-hidden">
              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-slate-200">Chat Ruang Konseling</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Lock className="w-3 h-3 text-teal-400" /> Terenkripsi
                </span>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => {
                  const isMe = msg.sender === 'Kamu';
                  return (
                    <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-slate-400 mb-0.5">{msg.sender} • {msg.time}</span>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                          isMe
                            ? 'bg-teal-600 text-white rounded-tr-xs'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ketik pesan ke psikolog..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-slate-950 font-bold transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Post-Session Summary & Takeaways */
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-950 flex flex-col items-center justify-center text-center">
            <div className="max-w-xl w-full space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-teal-400">
                  Sesi Konseling Telah Selesai
                </span>
                <h2 className="text-2xl font-bold font-['Outfit',sans-serif] mt-1 text-white">
                  Terima Kasih Sudah Merawat Jiwamu Hari Ini 🌿
                </h2>
                <p className="text-xs text-slate-400 mt-2">
                  Kamu telah menyelesaikan sesi bersama <strong>{counselor.name}</strong> selama {Math.round(elapsedSeconds / 60)} menit.
                </p>
              </div>

              {/* Clinical Takeaways Card */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-left space-y-3">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-bold">
                  <Award className="w-4 h-4" />
                  <span>Rangkuman Klinis & Rekomendasi Langkah Selanjutnya</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <p>• <strong>Identifikasi Isu Utama:</strong> Cognitive distortion terkait quarter-life crisis dan sindrom imposter.</p>
                  <p>• <strong>Rekomendasi Terapi:</strong> Latihan pernapasan 4-7-8 setiap pagi, serta micro-journaling bersyukur 3 hal setiap malam.</p>
                  <p>• <strong>Follow-up Sesi:</strong> Disarankan 1x sesi lanjutan dalam 2 minggu ke depan untuk evaluasi progress batasan emosional.</p>
                </div>
              </div>

              {/* Subsidy Receipt */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Skema Pembayaran: <strong>{booking?.subsidySource || 'Subsidi Silang Beasiswa Jiwa'}</strong></span>
                <span className="text-teal-400 font-bold">Terbayar Lunas (100% Covered)</span>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:scale-102 cursor-pointer"
                >
                  Kembali ke Dashboard Souls Care
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
