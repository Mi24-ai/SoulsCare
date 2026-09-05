import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, Heart, X, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBreathing: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose, onOpenBreathing }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const hotlines = [
    {
      name: 'Layanan Sejiwa Kemenkes RI',
      number: '119 ext 8',
      desc: 'Layanan konsultasi kesehatan jiwa resmi Kementerian Kesehatan 24/7 bebas pulsa.',
      type: 'phone',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      name: 'Into The Light Indonesia',
      number: 'https://www.intothelightid.org/tentang-bunuh-diri/layanan-konseling-2/',
      desc: 'Pusat rujukan pencegahan bunuh diri dan pendampingan kesehatan mental berbasis bukti.',
      type: 'link',
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      name: 'Lisa Helpline Indonesia',
      number: '0811-3855-472',
      desc: 'Layanan dukungan psikologis dan krisis emosional 24 jam dalam Bahasa Indonesia & English.',
      type: 'phone',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      name: 'Yayasan Pulih',
      number: '0811-8436-633 (WhatsApp)',
      desc: 'Layanan pemulihan trauma, kekerasan psikologis, dan krisis emosional.',
      type: 'whatsapp',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="crisis-modal-dialog"
        className="bg-white rounded-[36px] shadow-2xl max-w-xl w-full overflow-hidden border-2 border-rose-100 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-pink-700 text-white p-6 sm:p-7 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Ruang Aman Darurat & Bantuan Krisis</h2>
              <p className="text-xs text-rose-100 mt-0.5 font-medium">Kamu tidak sendirian. Rasa sakit ini bisa dilewati bersama.</p>
            </div>
          </div>
          <button 
            id="close-crisis-modal-btn"
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white flex items-center justify-center font-bold cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {/* Quick Immediate Grounding Prompt */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border-2 border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Pertolongan Pertama Saat Terasa Terlalu Sesak</span>
            </div>
            <p className="text-xs text-amber-900/90 font-medium leading-relaxed">
              Tarik napas panjang 4 detik... tahan 4 detik... hembuskan perlahan 6 detik. Taruh satu tangan di dadamu dan rasakan detak jantungmu. Tubuhmu sedang berusaha melindungimu.
            </p>
            <div className="mt-3.5 flex gap-2">
              <button
                id="crisis-breathing-btn"
                onClick={() => {
                  soundEngine.playInhaleChime();
                  onClose();
                  onOpenBreathing();
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-indigo-950 text-xs font-bold rounded-2xl shadow-md shadow-amber-900/10 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Mulai Latihan Napas Penenang
              </button>
            </div>
          </div>

          {/* Hotline Numbers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
              Kontak Bantuan Profesional Bebas Pulsa / Terjangkau 24 Jam
            </h3>
            <div className="space-y-3">
              {hotlines.map((h, idx) => (
                <div 
                  key={idx} 
                  id={`hotline-card-${idx}`}
                  className={`p-4 rounded-2xl border-2 ${h.color} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold">{h.name}</h4>
                      <p className="text-xs opacity-90 font-medium mt-0.5">{h.desc}</p>
                    </div>
                    {h.type === 'link' ? (
                      <a 
                        href={h.number} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-2xl hover:bg-indigo-700 whitespace-nowrap shadow-sm"
                      >
                        <span>Buka Info</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <a 
                        href={h.type === 'phone' ? `tel:${h.number}` : `https://wa.me/${h.number.replace(/[^0-9]/g, '')}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-950 text-white text-xs font-bold rounded-2xl hover:bg-indigo-900 whitespace-nowrap shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{h.number}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="text-center p-4 bg-[#F0F2FF] rounded-2xl border border-indigo-100 text-xs text-indigo-900 font-medium leading-relaxed">
            <p>
              Souls Care berkomitmen menyediakan akses kesehatan mental yang aman dan inklusif. Konsultasi psikolog di Souls Care juga dilengkapi skema <strong>Subsidi Silang s/d 100%</strong> untuk situasi darurat.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#F0F2FF] border-t border-indigo-50 flex justify-end">
          <button
            id="close-crisis-footer-btn"
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
