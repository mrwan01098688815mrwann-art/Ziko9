import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Plane, Sparkles, Users, Fingerprint, History, Play, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';

interface CrashPredictorProps {
  onBack: () => void;
  userId?: string;
  platform?: string;
}

export const CrashPredictor: React.FC<CrashPredictorProps> = ({
  onBack,
  userId = '1849204812',
  platform = 'bizbet',
}) => {
  const [currentOdds, setCurrentOdds] = useState<string>('0.00x');
  const [history, setHistory] = useState<string[]>([
    '2.85x',
    '1.42x',
    '5.15x',
    '1.98x',
    '3.60x',
    '8.40x',
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [serverUsers, setServerUsers] = useState(3640);

  const platformName = platform === 'bizbet' ? 'BIZBET' : platform === 'linebet_v1' ? 'LINEBET' : '1XBET';

  useEffect(() => {
    const timer = setInterval(() => {
      setServerUsers((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(3200, Math.min(4100, prev + delta));
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const getRandomMultiplier = () => {
    const r = Math.random();
    if (r < 0.4) {
      return parseFloat((Math.random() * 1.4 + 1.4).toFixed(2));
    } else if (r < 0.75) {
      return parseFloat((Math.random() * 3.2 + 2.8).toFixed(2));
    } else {
      return parseFloat((Math.random() * 8.0 + 6.0).toFixed(2));
    }
  };

  const handleStart = () => {
    if (isAnalyzing) return;
    sound.playPredict();
    setIsAnalyzing(true);

    const target = getRandomMultiplier();
    const startTime = Date.now();
    const duration = 2400;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Exponential curve
      const factor = Math.pow(progress, 2.2);
      const val = 1 + (target - 1) * factor;

      setCurrentOdds(`${val.toFixed(2)}x`);

      if (progress >= 1) {
        clearInterval(interval);
        const finalOddsStr = `${target.toFixed(2)}x`;
        setCurrentOdds(finalOddsStr);
        setIsAnalyzing(false);
        sound.playSuccess();
        setHistory((prev) => [finalOddsStr, ...prev.slice(0, 6)]);
      }
    }, 35);
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentOdds('0.00x');
    setIsAnalyzing(false);
  };

  return (
    <div
      dir="rtl"
      className="crash-page flex flex-col min-h-full bg-transparent font-sans text-white selection:bg-[#ff1e38]/40 relative overflow-x-hidden"
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#ff1e38]/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col px-4 sm:px-6 pt-5 pb-16 max-w-md mx-auto w-full gap-5">
        {/* Top Header */}
        <div className="flex items-center justify-between p-3.5 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-neon">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#ff1e38]/60 transition-all active:scale-95 shadow-md cursor-pointer"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff1e38]/30 to-black border border-[#ff1e38]/40 flex items-center justify-center shadow-neon">
              <Plane className="w-5 h-5 text-[#ff1e38] -rotate-45" />
            </div>
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white tracking-normal">
                  CRASH AVIATOR - زيكو الروسي
                </h1>
                <span className="text-[9px] font-black uppercase text-[#ff1e38] bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">
                  {platformName}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#ff1e38] animate-pulse" />
                رادار التنبؤ الروسي المباشر
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff1e38]/10 border border-[#ff1e38]/30 rounded-full shadow-neon">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-ping" />
            <span className="text-[10px] font-black uppercase text-[#ff1e38]">
              VIP LIVE
            </span>
          </div>
        </div>

        {/* Server stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-2xl shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-[#ff1e38]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-zinc-400 font-bold uppercase">
                المتصلين بالسيرفر
              </span>
              <span className="text-sm font-black font-mono text-white truncate tabular-nums">
                {serverUsers.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-2xl shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <Fingerprint className="w-4 h-4 text-[#ff1e38]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-zinc-400 font-bold uppercase flex items-center gap-1">
                معرّف الحساب (ID)
                <span className="text-[8px] text-emerald-400 font-black bg-emerald-500/15 px-1 rounded">
                  VIP
                </span>
              </span>
              <span className="text-xs font-black font-mono truncate text-[#ff1e38] shadow-neon">
                {userId}
              </span>
            </div>
          </div>
        </div>

        {/* Signals History Tape */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1 text-xs font-black text-zinc-400">
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#ff1e38]" />
              <span>آخر إشارات السيرفر:</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">LIVE FEED</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1" dir="ltr">
            <AnimatePresence>
              {history.map((odds, idx) => (
                <motion.div
                  key={`${idx}-${odds}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-mono font-black border transition-all ${
                    idx === 0
                      ? 'bg-gradient-to-r from-red-600/30 to-[#ff1e38]/20 border-[#ff1e38] text-white shadow-neon scale-105'
                      : parseFloat(odds) >= 3.0
                      ? 'bg-red-500/10 border-red-500/30 text-[#ff1e38]'
                      : 'bg-zinc-900/80 border-white/10 text-zinc-400'
                  }`}
                >
                  {odds}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Cockpit Radar Orbit HUD */}
        <div className="odds-stage">
          <div className={`odds-orbit ${currentOdds === '0.00x' ? '' : 'odds-orbit-active'}`}>
            <span className="odds-pulse odds-pulse-one" aria-hidden="true" />
            <span className="odds-pulse odds-pulse-two" aria-hidden="true" />
            <div className="odds-circle" role="status" aria-label="الأودز" dir="ltr">
              <span
                className={`odds-value ${
                  currentOdds === '0.00x' ? 'text-zinc-500' : 'text-[#ff1e38]'
                }`}
              >
                {currentOdds}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            disabled={isAnalyzing}
            className={`h-14 w-full rounded-2xl bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase flex items-center justify-center gap-2 shadow-neon transition-all cursor-pointer ${
              isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isAnalyzing ? 'جاري التحليل...' : 'START'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRestart}
            disabled={isAnalyzing}
            className="h-14 w-full rounded-2xl border border-white/15 bg-zinc-900 hover:border-[#ff1e38]/50 text-white font-black text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
