import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Flame, ShieldCheck, Bomb, Play, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';

interface MinesPredictorProps {
  onBack: () => void;
  userId?: string;
  platform?: string;
}

export const MinesPredictor: React.FC<MinesPredictorProps> = ({
  onBack,
  userId = '1849204812',
  platform = 'bizbet',
}) => {
  const [mineCount, setMineCount] = useState<number>(3);
  const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [connectedUsers, setConnectedUsers] = useState<number>(3480);

  const platformName = platform === 'bizbet' ? 'BIZBET' : platform === 'linebet_v1' ? 'LINEBET' : '1XBET';
  const TOTAL_TILES = 25;

  useEffect(() => {
    const timer = setInterval(() => {
      setConnectedUsers((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(3100, Math.min(3900, prev + delta));
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleStart = async () => {
    if (isRevealing) return;
    sound.playPredict();
    setIsRevealing(true);
    setRevealedTiles([]);

    const diamondsToReveal =
      mineCount === 1 ? 5 : mineCount === 3 ? 4 : mineCount === 5 ? 3 : 2;

    const chosen: number[] = [];
    while (chosen.length < diamondsToReveal) {
      const idx = Math.floor(Math.random() * TOTAL_TILES);
      if (!chosen.includes(idx)) {
        chosen.push(idx);
      }
    }

    chosen.forEach((tileIdx, step) => {
      setTimeout(() => {
        setRevealedTiles((prev) => [...prev, tileIdx]);
        sound.playClick();
        if (step === chosen.length - 1) {
          setIsRevealing(false);
          sound.playSuccess();
        }
      }, (step + 1) * 350);
    });
  };

  const handleRestart = () => {
    sound.playClick();
    setRevealedTiles([]);
    setIsRevealing(false);
  };

  return (
    <div
      dir="rtl"
      className="mines-page flex flex-col min-h-full bg-transparent font-sans text-white selection:bg-[#ff1e38]/40 relative overflow-x-hidden"
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#ff1e38]/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col px-4 sm:px-6 pt-5 pb-16 max-w-md mx-auto w-full gap-5">
        {/* Top Header */}
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
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#ff1e38] animate-pulse shadow-[0_0_8px_#ff1e38]" />
              <span className="text-xs font-black tracking-wider uppercase text-[#ff1e38]">
                {platformName} زيكو MINES VIP
              </span>
            </div>
          </div>
        </div>

        {/* User Status Bar */}
        <div className="p-3 bg-zinc-950/80 border border-white/10 rounded-2xl flex items-center justify-between backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#ff1e38]" />
            <span className="text-[11px] font-mono font-bold text-zinc-300">
              ID: {userId}
            </span>
          </div>
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            متصل مباشر ({connectedUsers} لاعب)
          </span>
        </div>

        {/* Mine Density Selector */}
        <div className="p-4 rounded-3xl bg-zinc-950/85 border border-white/10 backdrop-blur-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-zinc-200 font-bold flex items-center gap-1.5">
              <Bomb className="w-4 h-4 text-[#ff1e38]" /> حدد كثافة الألغام:
            </span>
            <span className="text-[#ff1e38] font-black text-sm font-mono bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/30">
              {mineCount} ألغام
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {[1, 3, 5, 7].map((num) => {
              const isSelected = mineCount === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setMineCount(num);
                    setRevealedTiles([]);
                  }}
                  className={`py-2.5 rounded-2xl text-xs font-black font-mono transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#ff1e38] to-[#d60e2a] text-white shadow-[0_0_18px_rgba(255,30,56,0.7)] scale-105 border border-red-400'
                      : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {num} ألغام
                </button>
              );
            })}
          </div>
        </div>

        {/* 5x5 Mines Grid */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-b from-[#ff1e38]/30 via-transparent to-[#ff1e38]/20 rounded-[38px] blur-sm pointer-events-none" />
          <div className="relative rounded-[36px] bg-zinc-950/90 border-2 border-[#ff1e38] p-5 sm:p-6 backdrop-blur-3xl shadow-[0_0_45px_rgba(255,30,56,0.35)]">
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3" dir="ltr">
              {Array.from({ length: TOTAL_TILES }).map((_, idx) => {
                const isRevealed = revealedTiles.includes(idx);
                return (
                  <motion.div
                    key={idx}
                    animate={
                      isRevealed
                        ? { scale: [0.9, 1.15, 1], rotate: [0, 4, 0] }
                        : {}
                    }
                    transition={{ duration: 0.35 }}
                    className={`aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 select-none shadow-md ${
                      isRevealed
                        ? 'bg-gradient-to-br from-red-950/90 via-black to-zinc-950 border-2 border-[#ff1e38] shadow-[0_0_25px_rgba(255,30,56,0.8)]'
                        : 'bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 hover:border-red-500/40'
                    }`}
                  >
                    <AnimatePresence>
                      {isRevealed ? (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0 }}
                          className="w-full h-full p-2 flex items-center justify-center relative"
                        >
                          <img
                            src="/assets/diamond.png"
                            alt="Diamond"
                            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_#ff1e38]"
                          />
                          <span className="absolute inset-0 bg-[#ff1e38]/20 animate-pulse pointer-events-none" />
                        </motion.div>
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            disabled={isRevealing}
            className={`w-full py-4 px-4 bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(255,30,56,0.65)] flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isRevealing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRevealing ? 'كشف الألماس...' : 'START'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRestart}
            disabled={isRevealing}
            className="w-full py-4 px-4 bg-zinc-950/80 border border-white/15 hover:border-[#ff1e38] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(255,30,56,0.3)] backdrop-blur-xl"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
