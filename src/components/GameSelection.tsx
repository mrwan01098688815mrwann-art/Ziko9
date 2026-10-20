import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Flame, ChevronLeft } from 'lucide-react';
import { sound } from '../utils/sound';

interface GameItem {
  id: 'apple' | 'crash' | 'mines';
  title: string;
  subtitle: string;
  desc: string;
  img: string;
  badge: string;
  accuracy: string;
  hot?: boolean;
}

const GAMES: GameItem[] = [
  {
    id: 'apple',
    title: 'Apple of Fortune',
    subtitle: 'تفاحة الحظ الروسية',
    desc: 'توقعات الصفوف الآمنة بدقة خوارزمية 99% ونسب أرباح مضاعفة',
    img: '/assets/apple.png',
    badge: 'الأكثر ربحاً',
    accuracy: '99%',
    hot: true,
  },
  {
    id: 'crash',
    title: 'Crash Aviator',
    subtitle: 'لعبة الطائرة زيكو',
    desc: 'تحليل نقطة انفجار الطائرة المباشرة والضربات المرتفعة',
    img: '/assets/crash.png',
    badge: 'إشارات فورية',
    accuracy: '98%',
    hot: true,
  },
  {
    id: 'mines',
    title: 'Gams Mines',
    subtitle: 'لعبة الألغام والألماس',
    desc: 'كشف خلايا الألماس الصافية بدقة مطلقة مع تجنب القنابل',
    img: '/assets/diamond.png',
    badge: 'تحديث فوري',
    accuracy: '99%',
    hot: false,
  },
];

interface GameSelectionProps {
  onSelectGame: (gameId: 'apple' | 'crash' | 'mines') => void;
  onBack: () => void;
  userId?: string;
  platform?: string;
}

export const GameSelection: React.FC<GameSelectionProps> = ({
  onSelectGame,
  onBack,
  userId = '1849204812',
  platform = 'bizbet',
}) => {
  const platformName = 'BIZBET';

  return (
    <div
      dir="rtl"
      className="flex flex-col min-h-full bg-transparent font-sans text-white selection:bg-[#ff1e38]/40 relative overflow-x-hidden"
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#ff1e38]/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col px-4 sm:px-6 pt-5 pb-16 max-w-md mx-auto w-full gap-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="w-10 h-10 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#ff1e38]/60 transition-all active:scale-95 shadow-md cursor-pointer"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#ff1e38]/40 shadow-neon">
              <img
                src="/assets/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#ff1e38] animate-pulse shadow-[0_0_8px_#ff1e38]" />
              <span className="text-xs font-black tracking-wider uppercase text-[#ff1e38]">
                {platformName} زيكو VIP
              </span>
            </div>
          </div>
        </div>

        {/* Verified User ID & Activation Code status */}
        {userId && (
          <div className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-2xl flex items-center justify-between backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#ff1e38]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  الحساب المفعل
                </span>
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  ID: {userId}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>كود نشط ومحمي</span>
            </div>
          </div>
        )}

        {/* Section Heading */}
        <div className="text-right">
          <h2 className="text-xl font-black text-white">اختر لعبة للتوقع</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            خوارزميات هاك زيكو الروسي المباشرة بدقة 99%
          </p>
        </div>

        {/* Games Cards */}
        <div className="space-y-4">
          {GAMES.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                sound.playClick();
                onSelectGame(game.id);
              }}
              className="group relative bg-zinc-950/90 border border-white/10 hover:border-[#ff1e38] rounded-2xl p-4 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(255,30,56,0.25)] flex items-center gap-4 overflow-hidden"
            >
              <div className="relative w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 group-hover:border-[#ff1e38]/50 p-2 flex items-center justify-center overflow-hidden transition-colors">
                <img
                  src={game.img}
                  alt={game.title}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,30,56,0.4)] group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-black text-white group-hover:text-[#ff1e38] transition-colors">
                    {game.title}
                  </h3>
                  {game.hot && (
                    <span className="flex items-center gap-0.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-[#ff1e38] border border-red-500/30">
                      <Flame className="w-2.5 h-2.5" />
                      {game.badge}
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-zinc-300 mb-1">
                  {game.subtitle}
                </div>

                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {game.desc}
                </p>

                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#ff1e38] bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20 font-mono">
                    دقة {game.accuracy}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 group-hover:border-[#ff1e38] group-hover:bg-[#ff1e38] text-zinc-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
