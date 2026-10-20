import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

interface WinnerItem {
  id: string;
  userId: string;
  bet: number;
  win: number;
}

const maskUserId = (str: string) => `${str.slice(0, 2)}*******${str.slice(-2)}`;

const INITIAL_WINNERS: WinnerItem[] = [
  { id: 'w-1', userId: '74*******12', bet: 100, win: 480 },
  { id: 'w-2', userId: '89*******35', bet: 50, win: 245 },
  { id: 'w-3', userId: '12*******90', bet: 200, win: 920 },
  { id: 'w-4', userId: '45*******67', bet: 25, win: 110 },
  { id: 'w-5', userId: '63*******81', bet: 150, win: 690 },
  { id: 'w-6', userId: '91*******04', bet: 75, win: 360 },
];

export const WinnersBoard: React.FC<{ title?: string }> = ({
  title = 'فوز اللاعبين مباشر',
}) => {
  const [winners, setWinners] = useState<WinnerItem[]>(INITIAL_WINNERS);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomId = String(Math.floor(1000000000 + Math.random() * 8999999999));
      const bets = [10, 20, 25, 50, 75, 100, 150, 200, 250, 500];
      const bet = bets[Math.floor(Math.random() * bets.length)];
      const multiplier = 1.8 + Math.random() * 7.5;
      const newWin: WinnerItem = {
        id: `${Date.now()}-${Math.random()}`,
        userId: maskUserId(randomId),
        bet,
        win: Math.round(bet * multiplier),
      };

      setWinners((prev) => [newWin, ...prev.slice(0, 5)]);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="winners-board w-full overflow-hidden border border-[#ff1e38]/30 rounded-2xl bg-[#090b10]/90 backdrop-blur-xl shadow-lg" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#ff1e38]/20 bg-gradient-to-r from-[#ff1e38]/10 to-transparent">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#ff1e38]" />
          <span className="text-xs font-black text-white">{title}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#ff1e38]/40 bg-[#ff1e38]/10">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#ff1e38] shadow-neon" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#ff1e38]">LIVE</span>
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-3 px-4 py-2 text-[10px] font-bold text-zinc-400 border-b border-white/5 bg-zinc-950/50">
        <div>المعرّف</div>
        <div className="text-center">الرهان</div>
        <div className="text-left flex items-center justify-end gap-1">
          <TrendingUp className="w-3 h-3 text-[#ff1e38]" />
          <span>الأرباح</span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {winners.map((item, idx) => (
          <div
            key={item.id}
            className={`grid grid-cols-3 px-4 py-2.5 text-xs transition-colors duration-500 items-center ${
              idx === 0 ? 'bg-[#ff1e38]/10 font-bold' : 'hover:bg-white/[0.02]'
            }`}
          >
            <div className="font-mono text-zinc-300 text-[11px] flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-[#ff1e38] animate-ping' : 'bg-zinc-600'}`} />
              <span>{item.userId}</span>
            </div>
            <div className="text-center font-mono text-zinc-400 text-[11px]">
              {item.bet} L.E
            </div>
            <div className="text-left font-mono font-black text-[#ff1e38] text-xs filter drop-shadow-[0_0_8px_rgba(255,30,56,0.5)]">
              +{item.win} L.E
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
