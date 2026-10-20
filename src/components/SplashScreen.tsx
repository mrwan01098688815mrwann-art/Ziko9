import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/sound';

interface SplashScreenProps {
  onComplete: () => void;
  language?: 'ar' | 'en';
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  language = 'ar',
}) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const messagesAr = [
    'تأمين الاتصال بالسيرفر الروسي...',
    'مزامنة خوارزميات BIZBET...',
    'تأكيد تشفير كود التفعيل...',
    'النظام جاهز للتشغيل',
  ];
  const messagesEn = [
    'SECURING RUSSIAN SERVER...',
    'SYNCING BIZBET MATRIX...',
    'ENCRYPTING HARDWARE KEY...',
    'SYSTEM READY',
  ];

  const messages = language === 'ar' ? messagesAr : messagesEn;
  const currentMessageIndex = Math.min(
    Math.floor((progress / 100) * messages.length),
    messages.length - 1
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            sound.playSuccess();
          }, 400);
          setTimeout(() => {
            onCompleteRef.current();
          }, 1100);
          return 100;
        }
        return prev + 3;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out bg-[#07080c] smart-grid overflow-hidden ${
        isDone ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="ambient-orbs" aria-hidden="true" />
      <div className="splash-scanline" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-sm">
        {/* Animated Halo and Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="logo-halo mb-8"
        >
          <span className="logo-ring" aria-hidden="true" />
          <span className="logo-ring logo-ring-inner" aria-hidden="true" />
          <div className="splash-logo">
            <img
              src="/assets/logo.jpg"
              alt="هاك زيكو الروسي"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Text and Branding */}
        <div className="text-center space-y-2 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2"
          >
            <h1 className="text-3xl font-black text-white tracking-wider">
              زيكو <span className="text-[#ff1e38]">الروسي</span>
            </h1>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#ff1e38]/20 text-[#ff1e38] border border-[#ff1e38]/40">
              VIP RUSSIAN
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-zinc-400 font-medium"
          >
            النسخة الأصلية المعتمدة لتحليلات BIZBET الحصرية
          </motion.p>
        </div>

        {/* Progress bar and status */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#ff1e38] font-bold tracking-wide animate-pulse">
              {messages[currentMessageIndex]}
            </span>
            <span className="text-zinc-400 font-black">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-zinc-900/90 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#ff334b] rounded-full shadow-neon"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
            <span>PROMO: R11</span>
            <span>SINGLE-DEVICE ENCRYPTION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
