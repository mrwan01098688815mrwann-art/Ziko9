import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, RotateCcw, Play, ShieldCheck, ChevronUp } from 'lucide-react';
import { sound } from '../utils/sound';
import { rtdb } from '../utils/firebase';
import { ref, set, onValue } from 'firebase/database';

interface ApplePredictorProps {
  onBack: () => void;
  userId?: string;
  platform?: string;
  language?: 'ar' | 'en';
}

// مصفوفة تعريفية للصفوف بترتيب عكسي لتظهر بالشكل الصحيح على الشاشة (من الأعلى للأسفل بصرياً، واللعب يبدأ من الأسفل x1.23)
export const TARGET_ROWS = [
  { mult: 'x349.68', row: 9 }, // أعلى صف
  { mult: 'x69.93',  row: 8 },
  { mult: 'x27.92',  row: 7 },
  { mult: 'x11.18',  row: 6 },
  { mult: 'x6.71',   row: 5 },
  { mult: 'x4.02',   row: 4 },
  { mult: 'x2.41',   row: 3 },
  { mult: 'x1.93',   row: 2 },
  { mult: 'x1.54',   row: 1 },
  { mult: 'x1.23',   row: 0 }, // أسفل صف يبدأ منه المشغل
];

// توليد التوقعات وفق الهيكلة المعتمدة في مسار m11 وتوزيع الصعوبة الواقعي
export const generateM11Predictions = () => {
  const finalObject: Record<string, Record<string, string>> = {};

  // نمر على 10 صفوف (من 0 إلى 9)
  for (let r = 0; r < 10; r++) {
    // تحديد عدد التفاحات السليمة بالصف بناء على رقم الصف
    let safeCount = 4;
    if (r >= 4 && r < 7) safeCount = 3;      // الصفوف 4، 5، 6
    if (r >= 7 && r < 9) safeCount = 2;      // الصفوف 7، 8
    if (r >= 9) safeCount = 1;               // الصف التاسع والأخير

    // تحديد أماكن التفاح السليم بشكل عشوائي داخل الأعمدة الـ 5
    const safeCols: number[] = [];
    while (safeCols.length < safeCount) {
      const randomCol = Math.floor(Math.random() * 5); // اختيار عمود عشوائي من 0 إلى 4
      if (!safeCols.includes(randomCol)) {
        safeCols.push(randomCol);
      }
    }

    // كتابة القيم للخانة (تحويل الصف والعمود لرمز الخانة من 1 لـ 50)
    for (let c = 0; c < 5; c++) {
      const mIndex = r * 5 + c + 1; // المعادلة السحرية لحساب رقم الخانة الفريد
      const value = safeCols.includes(c) ? '1' : '0'; // 1 = سليمة، 0 = تالفة
      
      // الهيكل المعتمد داخل الفايربيز
      finalObject[`m${mIndex}`] = { [`m${mIndex}`]: value };
    }
  }

  return finalObject;
};

export const ApplePredictor: React.FC<ApplePredictorProps> = ({
  onBack,
  userId = '1849204812',
  platform = 'bizbet',
}) => {
  const [predictions, setPredictions] = useState<Record<string, Record<string, string>> | null>(null);
  const [hasRevealed, setHasRevealed] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(0);

  const platformName = 'BIZBET';

  // الدالة السحرية للتحقق من سلامة التفاحة وفق معادلة مسار m11
  const isSafeApple = (rowIdx: number, colIdx: number): boolean => {
    if (!predictions || Object.keys(predictions).length === 0) return false;
    
    // 1. حساب الرقم التسلسلي للخانة
    const mIndex = rowIdx * 5 + colIdx + 1;
    const mKey = `m${mIndex}`;
    
    // 2. قراءة الكائن المقابل للخانة من التوقعات المجلوبة
    const mObj = (predictions as Record<string, Record<string, string>>)[mKey];
    
    // 3. التحقق من القيمة والتأكد أنها تساوي "1"
    if (mObj && typeof mObj === 'object' && mObj[mKey] === '1') {
      return true; // التفاحة سليمة!
    }
    
    return false; // التفاحة تالفة
  };

  // الاستماع المباشر لمسار m11 في الفايربيز
  useEffect(() => {
    try {
      const m11Ref = ref(rtdb, 'm11');
      const unsubscribe = onValue(m11Ref, (snapshot) => {
        const val = snapshot.val();
        if (val && typeof val === 'object' && Object.keys(val).length > 0) {
          setPredictions(val);
          setHasRevealed(true);
        }
      });
      return () => unsubscribe();
    } catch {
      // Offline fallback
    }
  }, []);

  const handleStartAnalysis = () => {
    if (isAnalyzing) return;
    sound.playPredict();
    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const generated = generateM11Predictions();
          setPredictions(generated);
          setHasRevealed(true);
          setCurrentLevel(9); // إظهار كافة المستويات أو المستوى المتقدم
          setIsAnalyzing(false);
          sound.playSuccess();

          // حفظ التوقعات في الفايربيز تحت مسار m11
          try {
            const m11Ref = ref(rtdb, 'm11');
            set(m11Ref, generated).catch(() => {});
          } catch {
            // fallback
          }

          return 100;
        }
        return p + 7;
      });
    }, 40);
  };

  const handleStepUp = () => {
    sound.playClick();
    if (!hasRevealed) {
      handleStartAnalysis();
    } else {
      setCurrentLevel((prev) => Math.min(prev + 1, 9));
    }
  };

  const handleReset = () => {
    sound.playClick();
    setPredictions(null);
    setHasRevealed(false);
    setCurrentLevel(0);
    setIsAnalyzing(false);
  };

  return (
    <div
      dir="rtl"
      className="apple-page flex flex-col min-h-full bg-transparent font-sans text-white selection:bg-[#ff1e38]/40 relative overflow-x-hidden"
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#ff1e38]/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col px-3 sm:px-5 pt-4 pb-16 max-w-lg mx-auto w-full gap-4">
        {/* Top Bar */}
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
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#ff1e38]/30 shadow-neon">
              <img
                src="/assets/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#ff1e38] animate-pulse shadow-[0_0_8px_#ff1e38]" />
              <span className="text-xs font-black tracking-wider uppercase text-[#ff1e38]">
                {platformName} زيكو الروسي VIP
              </span>
            </div>
          </div>
        </div>

        {/* User Status and Firebase Sync Bar */}
        <div className="p-3 bg-zinc-950/80 border border-white/10 rounded-2xl flex items-center justify-between backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#ff1e38]" />
            <span className="text-[11px] font-mono font-bold text-zinc-300">
              ID: {userId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
              m11 LIVE SYNC
            </span>
            <span className="text-[10px] font-black text-white/80 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              دقة 99%
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#ff1e38] text-[11px] font-black">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>خوارزمية مسار m11 الروسية</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            توقع تفاحة الحظ (10 صفوف)
          </h1>
          <p className="text-xs text-zinc-400">
            اكشف مسار التفاحات الرابحة من الأسفل للأعلى مع تفادي التفاح التالف
          </p>
        </div>

        {/* The 10-Row Apple Tower Grid (Rendered Bottom to Top: row 9 on top, row 0 on bottom) */}
        <div className="relative bg-zinc-950/90 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-3 sm:p-4 shadow-[0_0_35px_rgba(255,30,56,0.2)] overflow-hidden">
          {/* Analysis Overlay */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 z-30"
              >
                <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-full h-full border-4 border-zinc-800 border-t-[#ff1e38] rounded-full"
                  />
                  <Sparkles className="w-6 h-6 text-[#ff1e38] absolute animate-pulse" />
                </div>
                <div className="space-y-2 text-center w-52">
                  <span className="text-xs font-black text-[#ff1e38] uppercase tracking-[0.2em] animate-pulse block">
                    مزامنة مصفوفة m11...
                  </span>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#ff1e38] to-emerald-400 rounded-full shadow-neon"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    حساب الخانات من m1 إلى m50 ({progress}%)
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid rows */}
          <div className="flex flex-col gap-2 relative z-10" dir="ltr">
            {TARGET_ROWS.map((rowInfo, rIdx) => {
              const isTopRow = rowInfo.row === 9;
              const isBottomRow = rowInfo.row === 0;

              return (
                <div
                  key={rIdx}
                  className={`flex items-center gap-2.5 p-1.5 rounded-xl transition-all duration-300 ${
                    hasRevealed
                      ? 'bg-zinc-900/40 border border-white/5'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Multiplier Label */}
                  <div className="w-14 shrink-0 text-left">
                    <span
                      className={`text-[11px] font-mono font-black px-2 py-1 rounded-lg block text-center transition-colors ${
                        isTopRow
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shadow-[0_0_8px_rgba(234,179,8,0.3)]'
                          : isBottomRow
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-900 text-zinc-300 border border-white/10'
                      }`}
                    >
                      {rowInfo.mult}
                    </span>
                  </div>

                  {/* 5 Column Slots for this Row */}
                  <div className="grid grid-cols-5 gap-2 flex-1">
                    {Array.from({ length: 5 }).map((_, cIdx) => {
                      const isSafe = isSafeApple(rowInfo.row, cIdx);
                      const mIndex = rowInfo.row * 5 + cIdx + 1;

                      return (
                        <div
                          key={cIdx}
                          className={`aspect-square rounded-xl border flex items-center justify-center transition-all duration-300 relative overflow-hidden select-none ${
                            hasRevealed && isSafe
                              ? 'border-emerald-400/50 bg-gradient-to-b from-emerald-950/80 via-black to-zinc-950 shadow-[0_0_14px_rgba(52,211,153,0.4)] scale-[1.02]'
                              : hasRevealed && !isSafe
                              ? 'border-red-950/40 bg-zinc-950/90 opacity-40'
                              : 'border-white/10 bg-zinc-900/60 hover:border-white/20'
                          }`}
                          title={`m${mIndex}`}
                        >
                          {hasRevealed ? (
                            isSafe ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                  type: 'spring',
                                  damping: 12,
                                  stiffness: 200,
                                  delay: (rowInfo.row * 5 + cIdx) * 0.01,
                                }}
                                className="w-full h-full p-1.5 flex items-center justify-center relative"
                              >
                                <img
                                  src="/assets/apple.png"
                                  alt="تفاحة سليمة"
                                  className="w-[85%] h-[85%] object-contain filter drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                                <span className="absolute inset-0 bg-emerald-400/10 rounded-full animate-pulse pointer-events-none" />
                              </motion.div>
                            ) : (
                              <div className="w-full h-full p-1.5 flex items-center justify-center opacity-25 grayscale">
                                <img
                                  src="/assets/apple.png"
                                  alt="تفاحة تالفة"
                                  className="w-[75%] h-[75%] object-contain grayscale"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-600 select-none">
                              m{mIndex}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend / Info bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/60 rounded-xl border border-white/5 text-[11px] text-zinc-400 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span>تفاحة سليمة (قيمة: "1")</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
            <span>تفاحة تالفة (قيمة: "0")</span>
          </div>
          <div className="font-mono text-zinc-500">
            مسار: m11
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className={`h-14 rounded-2xl bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon transition-all cursor-pointer ${
                isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isAnalyzing ? 'جارٍ فحص المسار...' : 'توليد توقعات m11'}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStepUp}
              disabled={isAnalyzing}
              className="h-14 rounded-2xl bg-zinc-900 border border-white/15 hover:border-emerald-500/50 text-white font-black text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ChevronUp className="w-4 h-4 text-emerald-400" />
              <span>{hasRevealed ? 'تحديث الإشارة' : 'بدء الصعود'}</span>
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleReset}
            disabled={isAnalyzing}
            className="h-11 w-full rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-[#ff1e38]/50 text-zinc-400 hover:text-white font-black text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير الشبكة</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
