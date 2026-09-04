import React, { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Plus, 
  Users, 
  Lock, 
  Compass, 
  Flame, 
  HeartHandshake, 
  Shield, 
  Moon, 
  RefreshCw,
  Shuffle
} from 'lucide-react';
import { SafeSpaceRoom, SafeSpaceMessage } from '../types';
import { safeSpaceRooms, initialSafeSpaceMessages } from '../data/safeSpaceData';
import confetti from 'canvas-confetti';

export const SafeSpaceTab: React.FC = () => {
  const [activeRoomId, setActiveRoomId] = useState<string>('room-quarterlife');
  const [messagesMap, setMessagesMap] = useState<Record<string, SafeSpaceMessage[]>>(initialSafeSpaceMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Pseudonym generator for Gen Z anonymous privacy
  const pseudonymAvatars = ['🐱', '🐼', '🦊', '🌿', '☁️', '⭐', '🌙', '🍵', '🌻', '🦉'];
  const pseudonymAdjectives = ['Matcha', 'Teduh', 'Ngopi', 'Sage', 'Senja', 'Bintang', 'Hening', 'Peluk', 'Kopi', 'Damai'];
  const pseudonymNouns = ['Kucing', 'Awan', 'Panda', 'Daun', 'Rubah', 'Bulan', 'Jiwa', 'Sahabat', 'Bunga', 'Burung'];

  const [currentAlias, setCurrentAlias] = useState({
    name: 'Kucing Matcha 🍵',
    avatar: '🐱',
    badge: 'Jiwa Tangguh',
  });

  const randomizeAlias = () => {
    const avatar = pseudonymAvatars[Math.floor(Math.random() * pseudonymAvatars.length)];
    const adj = pseudonymAdjectives[Math.floor(Math.random() * pseudonymAdjectives.length)];
    const noun = pseudonymNouns[Math.floor(Math.random() * pseudonymNouns.length)];
    const badges = ['Survivor 2026', 'Pejuang Skripsi', 'Teman Dengar', 'Pencari Arah', 'Healing Mode', 'Kawan Baik'];
    const badge = badges[Math.floor(Math.random() * badges.length)];
    setCurrentAlias({
      name: `${noun} ${adj} ${avatar}`,
      avatar,
      badge,
    });
  };

  const activeRoom = safeSpaceRooms.find((r) => r.id === activeRoomId) || safeSpaceRooms[0];
  const currentMessages = messagesMap[activeRoomId] || [];

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isPosting) return;

    setIsPosting(true);
    const newMsg: SafeSpaceMessage = {
      id: `msg-${Date.now()}`,
      roomId: activeRoomId,
      authorAlias: currentAlias.name,
      authorAvatar: currentAlias.avatar,
      authorBadge: currentAlias.badge,
      content: inputMessage.trim(),
      timestamp: 'Baru saja',
      likes: 1,
      userLiked: true,
      repliesCount: 0,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeRoomId]: [newMsg, ...(prev[activeRoomId] || [])],
    }));
    setInputMessage('');
    setIsPosting(false);

    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 },
    });

    // Simulated warm peer reply after 3.5s
    setTimeout(() => {
      const supportiveAliases = [
        { name: 'Sahabat Hening 🌙', avatar: '🌙', badge: 'Teman Dengar' },
        { name: 'Awan Senja ☁️', avatar: '☁️', badge: 'Pendengar Baik' },
        { name: 'Daun Damai 🌿', avatar: '🌿', badge: 'Survivor' },
      ];
      const selected = supportiveAliases[Math.floor(Math.random() * supportiveAliases.length)];
      const peerMessages = [
        'Terima kasih sudah membagikannya di sini. Apa yang kamu rasakan itu wajar banget. Jangan ragu luapkan di sini kapan saja ya 🤍',
        'Peluk hangat dari jauh! Kita semua di circle ini ada di sampingmu. Kamu lebih kuat dari yang kamu kira.',
        'Semangat ya! Hari yang berat bukan berarti seluruh hidupmu berat. Luangkan waktu untuk istirahat malam ini.',
      ];
      const peerReply: SafeSpaceMessage = {
        id: `reply-${Date.now()}`,
        roomId: activeRoomId,
        authorAlias: selected.name,
        authorAvatar: selected.avatar,
        authorBadge: selected.badge,
        content: peerMessages[Math.floor(Math.random() * peerMessages.length)],
        timestamp: 'Baru saja',
        likes: 2,
        userLiked: false,
        repliesCount: 0,
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeRoomId]: [...(prev[activeRoomId] || []), peerReply],
      }));
    }, 3500);
  };

  const handleLikeMessage = (msgId: string) => {
    setMessagesMap((prev) => {
      const roomMsgs = prev[activeRoomId] || [];
      return {
        ...prev,
        [activeRoomId]: roomMsgs.map((m) => {
          if (m.id === msgId) {
            const nextLiked = !m.userLiked;
            return {
              ...m,
              userLiked: nextLiked,
              likes: nextLiked ? m.likes + 1 : Math.max(0, m.likes - 1),
            };
          }
          return m;
        }),
      };
    });
  };

  const getRoomIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Moon': return <Moon className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-[40px] text-white p-6 sm:p-10 shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest text-indigo-100">
              <Lock className="w-4 h-4 text-amber-300" />
              <span>100% Pseudonim & Terenkripsi Peer-to-Peer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Private Safe Space & Circle Curhat Anonim
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 font-medium leading-relaxed">
              Ruang berbagi rasa tanpa takut dihakimi. Menggunakan identitas anonim unik untuk menjaga keamanan privasimu secara mutlak.
            </p>
          </div>

          {/* User Active Pseudonym Card */}
          <div className="bg-white/15 p-4 rounded-3xl backdrop-blur-md border border-white/20 flex items-center justify-between gap-4 shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                {currentAlias.avatar}
              </div>
              <div>
                <span className="text-[10px] text-indigo-200 uppercase font-black tracking-wider block">Alias Anonim Kamu:</span>
                <span className="text-sm font-black text-white block">{currentAlias.name}</span>
                <span className="text-[10px] font-bold text-amber-300">{currentAlias.badge}</span>
              </div>
            </div>
            <button
              onClick={randomizeAlias}
              className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer"
              title="Ganti Alias Acak"
            >
              <Shuffle className="w-4 h-4" />
              <span>Acak</span>
            </button>
          </div>
        </div>

        {/* Ambient Blur */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Room Channels on Left, Chat Stream on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Channel Rooms */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider px-1">
            Pilih Circle Ruang Curhat
          </h3>
          <div className="space-y-2.5">
            {safeSpaceRooms.map((room) => {
              const isActive = activeRoomId === room.id;
              return (
                <button
                  key={room.id}
                  id={`safe-room-btn-${room.id}`}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`w-full text-left p-4 rounded-[28px] border-2 transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-white border-indigo-600 shadow-lg shadow-indigo-100 ring-2 ring-indigo-200'
                      : 'bg-white hover:bg-indigo-50/50 border-indigo-50 text-indigo-950 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-2xl ${room.color} shrink-0`}>
                      {getRoomIcon(room.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-indigo-950">{room.name}</h4>
                      <p className="text-[11px] font-medium text-indigo-400 line-clamp-1 mt-0.5">{room.description}</p>
                    </div>
                  </div>

                  <span className="text-[10px] bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-full font-black shrink-0 border border-indigo-100">
                    {room.activeMembers} online
                  </span>
                </button>
              );
            })}
          </div>

          {/* Community Guidelines Box */}
          <div className="p-5 bg-[#FEF3C7] rounded-[28px] border-b-4 border-amber-300 text-xs text-amber-950 space-y-2 shadow-sm">
            <div className="flex items-center gap-1.5 font-black text-sm text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>Kode Etik Ruang Aman</span>
            </div>
            <p className="font-medium text-amber-900 leading-relaxed">1. Bebas menghakimi, celaan, dan toxic positivity.</p>
            <p className="font-medium text-amber-900 leading-relaxed">2. Dilarang membagikan kontak pribadi / nomor HP.</p>
            <p className="font-medium text-amber-900 leading-relaxed">3. Responlah setiap cerita dengan empati dan kebaikan.</p>
          </div>
        </div>

        {/* Right 2 Cols: Feed & Input */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Room Title Card */}
          <div className="bg-white p-5 rounded-[32px] border-2 border-indigo-50 flex items-center justify-between shadow-lg shadow-indigo-100/50">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${activeRoom.color}`}>
                {getRoomIcon(activeRoom.icon)}
              </div>
              <div>
                <h2 className="text-base font-black text-indigo-950 font-['Outfit',sans-serif]">
                  {activeRoom.name}
                </h2>
                <p className="text-xs font-bold text-indigo-400">{activeRoom.description}</p>
              </div>
            </div>
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {activeRoom.tag}
            </span>
          </div>

          {/* Post New Curhat Box */}
          <div className="bg-white rounded-[32px] border-2 border-indigo-50 p-5 sm:p-6 shadow-xl shadow-indigo-100/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{currentAlias.avatar}</span>
              <span className="text-xs font-black text-indigo-950">{currentAlias.name}</span>
              <span className="text-[11px] font-bold text-indigo-400">• Posting secara rahasia</span>
            </div>
            <textarea
              id="safespace-input-textarea"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Tulis apa saja yang ada di hatimu untuk circle "${activeRoom.name}"...`}
              rows={3}
              className="w-full bg-[#F0F2FF] rounded-2xl p-3.5 text-xs sm:text-sm font-medium text-indigo-950 placeholder-indigo-300 border-2 border-indigo-100 focus:outline-hidden focus:border-indigo-500 focus:bg-white resize-none transition-all"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-400">Pesan otomatis dimoderasi untuk kenyamanan bersama</span>
              <button
                id="safespace-post-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isPosting}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Curhat</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="space-y-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                id={`safespace-msg-${msg.id}`}
                className="bg-white rounded-[32px] border-2 border-indigo-50 p-5 sm:p-6 shadow-lg shadow-indigo-100/40 space-y-3 animate-in fade-in"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg shadow-2xs">
                      {msg.authorAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-950">{msg.authorAlias}</span>
                        {msg.authorBadge && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 font-black border border-pink-100">
                            {msg.authorBadge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-indigo-300">{msg.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* Actions */}
                <div className="pt-3 border-t border-indigo-50 flex items-center gap-4 text-xs">
                  <button
                    onClick={() => handleLikeMessage(msg.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                      msg.userLiked ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'hover:bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${msg.userLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                    <span>{msg.likes} Dukungan</span>
                  </button>

                  <div className="flex items-center gap-1 text-indigo-400 font-bold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{msg.repliesCount} Tanggapan</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
