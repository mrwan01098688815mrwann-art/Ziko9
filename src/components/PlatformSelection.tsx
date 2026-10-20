import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, Check, ShieldCheck, Zap, ArrowLeft, KeyRound } from 'lucide-react';
import { sound } from '../utils/sound';
import { WinnersBoard } from './WinnersBoard';

export interface PlatformItem {
  id: string;
  name: string;
  img: string;
  tagline: string;
  accuracy: string;
  latency: string;
  geo?: string;
  recommended?: boolean;
}

const PLATFORMS: PlatformItem[] = [
  {
    id: 'bizbet',
    name: 'BIZBET',
    img: '/assets/bizbet.png',
    tagline: 'السيرفر الرسمي المعتمد · دقة خوارزمية فائقة',
    accuracy: '٩٩٪',
    latency: '10ms',
    geo: 'سيرفر VIP حصري',
    recommended: true,
  },
];

interface PlatformSelectionProps {
  onSelect: (platformId: string) => void;
  language?: 'ar' | 'en';
}

export const PlatformSelection: React.FC<PlatformSelectionProps> = ({
  onSelect,
}) => {
  const [selectedId, setSelectedId] = useState<string>('bizbet');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onlineCount, setOnlineCount] = useState(4120);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(3400, Math.min(4350, prev + delta));
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleChoose = (id: string) => {
    sound.playClick();
    setSelectedId(id);
  };

  const handleConfirm = () => {
    sound.playClick();
    setIsSubmitting(true);
    setTimeout(() => {
      onSelect(selectedId);
    }, 500);
  };

  const selectedPlatform = PLATFORMS.find((p) => p.id === selectedId) || PLATFORMS[0];

  return (
    <div
      dir="rtl"
      className="platform-page relative flex flex-col min-h-full font-sans overflow-x-hidden max-w-full text-white px-4 sm:px-6 pt-5 pb-20"
    >
      <div className="ambient-orbs" aria-hidden="true" />

      <div className="relative z-10 max-w-md mx-auto w-full flex flex-col gap-6">
        {/* Top bar with Online count and VIP status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-[#ff1e38]" />
            <span className="text-[11px] font-bold text-zinc-400">المتصلين الآن:</span>
            <span className="text-xs font-mono font-black text-white tabular-nums">
              {onlineCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff1e38]/10 border border-[#ff1e38]/30 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-pulse shadow-neon" />
            <span className="text-[10px] font-black tracking-wider text-[#ff1e38]">مباشر VIP</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="w-24 h-24 rounded-2xl p-1 bg-gradient-to-b from-white/20 via-[#ff1e38]/40 to-black shadow-neon border border-white/15 mb-1 overflow-hidden">
            <img
              src="/assets/logo.jpg"
              alt="هاك زيكو الروسي"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1e38]/10 border border-[#ff1e38]/20 text-[#ff1e38] text-[11px] font-black">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>هاك زيكو الروسي المعتمد</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            سيرفر زيكو الروسي VIP
          </h1>
          <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto leading-relaxed">
            المنظومة الروسية المباشرة لتوقعات منصة BIZBET بدقة 99%
          </p>
        </div>

        {/* Platforms List (BIZBET ONLY) */}
        <div className="space-y-3.5">
          {PLATFORMS.map((platform) => {
            const isSelected = selectedId === platform.id;
            return (
              <motion.button
                key={platform.id}
                type="button"
                onClick={() => handleChoose(platform.id)}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className={`relative w-full text-right rounded-2xl p-4 border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-zinc-950/90 border-[#ff1e38] shadow-neon ring-1 ring-[#ff1e38]/50'
                    : 'bg-zinc-900/60 border-white/10 hover:border-white/20 hover:bg-zinc-900/90'
                }`}
              >
                {isSelected && (
                  <div className="pointer-events-none absolute inset-0 bg-[#ff1e38]/10" />
                )}

                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={`relative w-[68px] h-[68px] shrink-0 rounded-xl overflow-hidden border-2 bg-black flex items-center justify-center ${
                      isSelected ? 'border-[#ff1e38] shadow-neon' : 'border-white/10'
                    }`}
                  >
                    <img
                      src={platform.img}
                      alt={platform.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black tracking-normal text-white">
                        {platform.name}
                      </h3>
                      {platform.recommended && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff1e38]/20 text-[#ff1e38] border border-[#ff1e38]/40">
                          موصى به
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      {platform.tagline}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#ff1e38] bg-[#ff1e38]/10 border border-[#ff1e38]/25 rounded-lg px-2 py-0.5">
                        <ShieldCheck className="w-3 h-3" /> دقة {platform.accuracy}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-zinc-400 bg-white/[0.05] border border-white/10 rounded-lg px-2 py-0.5">
                        <Zap className="w-3 h-3 text-[#ff1e38]" /> {platform.latency}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#ff1e38] border-[#ff1e38] shadow-neon'
                        : 'bg-transparent border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4]" />}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Live Winners Ticker */}
        <div className="w-full">
          <WinnersBoard />
        </div>

        {/* Platform Selection Confirmation */}
        <div className="platform-action pt-2">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
            <span className="text-zinc-400 font-bold">المنصة المحددة:</span>
            <span className="font-black text-white text-sm">
              {selectedPlatform.name}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="mt-4 w-full h-14 rounded-2xl bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-base flex items-center justify-center gap-2 shadow-neon active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>{isSubmitting ? 'جاري ربط السيرفر الروسي...' : 'متابعة الشروط وتفعيل الكود'}</span>
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-zinc-500 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> كود تفعيل أحادي لجهازك
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#ff1e38]" /> بروموكود: R11
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
