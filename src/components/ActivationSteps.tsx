import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Download,
  Send,
  Copy,
  Check,
  ExternalLink,
  DollarSign,
  Coins,
  Fingerprint,
  CheckCircle2,
  Lock,
  Gamepad2,
  Sparkles,
  KeyRound,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { verifyAndConsumeCode } from '../utils/activationCodes';

interface ActivationStepsProps {
  platform?: string;
  onComplete: (userId: string) => void;
  onBack: () => void;
  language?: 'ar' | 'en';
}

export const ActivationSteps: React.FC<ActivationStepsProps> = ({
  platform = 'bizbet',
  onComplete,
  onBack,
}) => {
  const [userId, setUserId] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationStage, setVerificationStage] = useState<'step1' | 'step2' | 'ready'>('step1');

  const platformName = 'BIZBET';
  const appDownloadUrl = 'https://refpa83754.com/L?tag=d_6238052m_67005c_&site=6238052&ad=67005';
  const registerUrl = 'https://refpa83754.com/L?tag=d_6238052m_88828c_&site=6238052&ad=88828';
  const telegramUrl = 'https://t.me/+4fSJ8LxoeN1mZGNk';
  const promoCode = 'R11';

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    sound.playCopy();
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = async () => {
    sound.playClick();
    const cleanedId = userId.trim();
    const cleanedCode = activationCode.trim();

    if (!cleanedId) {
      setError('يرجى إدخال معرّف الحساب (ID).');
      sound.playError();
      return;
    }
    if (cleanedId.length < 10 || cleanedId.length > 15) {
      setError('يرجى إدخال رقم ID صحيح مكون من 10 إلى 15 أرقام.');
      sound.playError();
      return;
    }

    if (!cleanedCode) {
      setError('يرجى إدخال كود التفعيل المخصص لجهازك (مطلوب للدخول).');
      sound.playError();
      return;
    }

    // Validate single-use activation code from Firebase and delete on consumption
    const validation = await verifyAndConsumeCode(cleanedCode, cleanedId);
    if (!validation.success) {
      setError(validation.message);
      sound.playError();
      return;
    }

    setError(null);
    setIsModalOpen(true);
    setVerificationStage('step1');

    setTimeout(() => {
      setVerificationStage('step2');
      setTimeout(() => {
        setVerificationStage('ready');
        sound.playSuccess();
      }, 1600);
    }, 1600);
  };

  const handleProceedToGames = () => {
    sound.playClick();
    setIsModalOpen(false);
    onComplete(userId);
  };

  const handleDownloadAndPlay = () => {
    window.open(appDownloadUrl, '_blank');
    sound.playClick();
    setTimeout(() => {
      setIsModalOpen(false);
      onComplete(userId);
    }, 400);
  };

  return (
    <div
      dir="rtl"
      className="activation-page flex flex-col min-h-full bg-transparent font-sans text-white selection:bg-[#ff1e38]/40 relative overflow-x-hidden"
    >
      <div className="ambient-orbs fixed" aria-hidden="true" />

      <div className="relative z-10 flex flex-col px-4 sm:px-6 pt-5 pb-20 max-w-lg mx-auto w-full gap-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="w-10 h-10 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#ff1e38]/60 transition-all active:scale-95 shadow-lg cursor-pointer"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#ff1e38]/10 border border-[#ff1e38]/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#ff1e38] animate-pulse shadow-neon" />
            <span className="text-xs font-black uppercase text-[#ff1e38]">
              شروط تفعيل {platformName} - هاك زيكو الروسي
            </span>
          </div>
        </div>

        {/* Brand Banner */}
        <div className="activation-heading py-2">
          <div className="relative flex items-center gap-4">
            <div className="w-20 h-20 shrink-0 rounded-2xl border-2 border-[#ff1e38]/40 bg-black flex items-center justify-center overflow-hidden shadow-neon">
              <img
                src="/assets/logo.jpg"
                alt="هاك زيكو الروسي"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/ziko_logo.jpg';
                }}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  زيكو <span className="text-[#ff1e38]">الروسي</span>
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                  VIP SYSTEM
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                أكمل الشروط الخمسة لتفعيل الربط المباشر مع سيرفر التوقعات بدقة 99%
              </p>
            </div>
          </div>
        </div>

        {/* STEP 1 */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff1e38] text-white flex items-center justify-center font-black text-sm shadow-neon">
                1
              </div>
              <h2 className="text-base font-black text-white">تثبيت تطبيق {platformName}</h2>
            </div>
            <span className="text-[10px] font-bold text-[#ff1e38] bg-[#ff1e38]/10 px-2.5 py-1 rounded-full border border-[#ff1e38]/20">
              إلزامي
            </span>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/80 border border-white/5 p-3 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-black border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/assets/bizbet.png"
                alt={platformName}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              قم بتحميل وتثبيت النسخة الرسمية من تطبيق{' '}
              <strong className="text-white">{platformName}</strong> لربط معرف حسابك مع خوارزمية
              الذكاء الاصطناعي.
            </p>
          </div>

          {/* Download App & Create Account Buttons */}
          <div className="space-y-2.5">
            <a
              href={appDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ff1e38] to-[#d60e2a] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase flex items-center justify-center gap-2 shadow-neon active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل تطبيق {platformName}</span>
            </a>

            <a
              href={registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="w-full h-12 rounded-xl bg-zinc-900 border border-white/15 hover:border-[#ff1e38] text-white font-black text-sm uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#ff1e38]" />
              <span>إنشاء حساب في {platformName}</span>
              <ExternalLink className="w-3.5 h-3.5 mr-1 text-zinc-400" />
            </a>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0088cc] text-white flex items-center justify-center font-black text-sm shadow-md">
                2
              </div>
              <h2 className="text-base font-black text-white">الانضمام لقناة التلجرام</h2>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/10">
              تحديثات فورية
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/80 border border-white/5 p-3 rounded-xl">
            انضم لقناتنا الرسمية لمتابعة الإشارات المباشرة والتحديثات وسيرفرات التوقعات في الوقت
            الفعلي.
          </p>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="w-full h-12 rounded-xl bg-[#0088cc] hover:bg-[#0099e6] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>الانضمام إلى قناة التلجرام الرسمية</span>
            <ExternalLink className="w-3.5 h-3.5 mr-1 text-white/80" />
          </a>
        </div>

        {/* STEP 3 */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff1e38] text-white flex items-center justify-center font-black text-sm shadow-neon">
                3
              </div>
              <h2 className="text-base font-black text-white">إدخال كود البروموكود</h2>
            </div>
            <span className="text-[10px] font-bold text-[#ff1e38] bg-[#ff1e38]/10 px-2.5 py-1 rounded-full border border-[#ff1e38]/25">
              مطلوب للتسجيل
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            عند إنشاء حسابك الجديد، استخدم البروموكود المعتمد لضمان ربط حسابك بسيرفر الذكاء الاصطناعي
            بنجاح:
          </p>

          {/* Copy Promo Code Box */}
          <div
            onClick={handleCopyCode}
            className="relative bg-zinc-900/90 rounded-xl border-2 border-dashed border-[#ff1e38]/50 hover:border-[#ff1e38] p-4 transition-all cursor-pointer group shadow-neon flex items-center justify-between"
          >
            <div>
              <span className="block text-[10px] text-zinc-400 font-bold uppercase mb-0.5">
                الكود المعتمد
              </span>
              <span className="text-3xl font-black font-mono text-[#ff1e38] tracking-widest">
                {promoCode}
              </span>
            </div>

            <button
              type="button"
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                copied
                  ? 'bg-[#ff1e38] text-white shadow-neon'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>

          <a
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="w-full h-12 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ff1e38]" />
            <span>إنشاء حساب بالبروموكود R11</span>
            <ExternalLink className="w-4 h-4 text-zinc-600 mr-1" />
          </a>
        </div>

        {/* STEP 4 */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff1e38] text-white flex items-center justify-center font-black text-sm shadow-neon">
                4
              </div>
              <h2 className="text-base font-black text-white">الحد الأدنى للإيداع</h2>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/10">
              تفعيل الخوارزمية
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            قم بإجراء أول عملية إيداع بالحساب للحد الأدنى الموضح لتفعيل المزامنة التلقائية مع محرك
            التوقعات:
          </p>

          <div className="grid grid-cols-2 gap-3" dir="ltr">
            <div className="bg-zinc-900/90 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#ff1e38]" /> USD ($)
              </span>
              <span className="text-2xl font-black text-white font-mono shadow-neon">
                $4.00
              </span>
            </div>

            <div className="bg-zinc-900/90 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#ff1e38]" /> EGP (جنيه)
              </span>
              <span className="text-2xl font-black text-[#ff1e38] font-mono shadow-neon">
                180 L.E
              </span>
            </div>
          </div>
        </div>

        {/* STEP 5: USER ID + ACTIVATION CODE */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff1e38] text-white flex items-center justify-center font-black text-sm shadow-neon">
                5
              </div>
              <h2 className="text-base font-black text-white">التحقق وتفعيل الاشتراك</h2>
            </div>
            <span className="text-[10px] font-bold text-[#ff1e38] bg-[#ff1e38]/10 px-2.5 py-1 rounded-full border border-[#ff1e38]/25">
              خطوة أخيرة
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            أدخل معرف الحساب (ID) المكون من 10 إلى 15 رقم، وكود التفعيل الخاص بجهازك:
          </p>

          <div className="space-y-3">
            {/* Field 1: User ID */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                معرّف الحساب (User ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center pointer-events-none">
                  <Fingerprint
                    className={`w-5 h-5 ${userId ? 'text-[#ff1e38]' : 'text-zinc-500'}`}
                  />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setUserId(cleaned);
                    if (error) setError(null);
                  }}
                  placeholder="مثال: 1849204812"
                  maxLength={15}
                  className="w-full bg-zinc-900/90 border border-white/15 focus:border-[#ff1e38] text-white font-mono text-base pr-12 pl-4 py-3.5 rounded-xl focus:outline-none transition-all text-right placeholder:text-zinc-600 focus:ring-2 focus:ring-[#ff1e38]/30"
                />
              </div>
            </div>

            {/* Field 2: Activation Code (كود التفعيل لجهاز واحد فقط) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-zinc-300 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#ff1e38]" />
                  <span>كود التفعيل (Activation Code)</span>
                </label>
                <span className="text-[10px] text-[#ff1e38] font-bold">
                  مخصص لجهاز واحد فقط
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center pointer-events-none">
                  <Lock
                    className={`w-5 h-5 ${activationCode ? 'text-[#ff1e38]' : 'text-zinc-500'}`}
                  />
                </div>
                <input
                  type="text"
                  value={activationCode}
                  onChange={(e) => {
                    setActivationCode(e.target.value.toUpperCase());
                    if (error) setError(null);
                  }}
                  placeholder="مثال: ZIKO-XXXX-YYYY"
                  className="w-full bg-zinc-900/90 border border-white/15 focus:border-[#ff1e38] text-white font-mono text-base pr-12 pl-4 py-3.5 rounded-xl focus:outline-none transition-all text-right uppercase placeholder:text-zinc-600 focus:ring-2 focus:ring-[#ff1e38]/30"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                إذا لم يكن لديك كود، يمكنك الحصول عليه من قناة التلجرام الرسمية.
              </p>
            </div>

            {error && (
              <p className="text-xs text-[#ff1e38] font-bold pr-1 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase flex items-center justify-center gap-2 shadow-neon active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>تأكيد وتفعيل الحساب</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* Security badge */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#ff1e38] shrink-0" />
            <span>نظام الحماية الروسي: كود التفعيل يرتبط بجهازك تلقائياً لمنع التكرار.</span>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-zinc-950 border-2 border-[#ff1e38]/40 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-neon relative overflow-hidden"
            >
              {verificationStage === 'step1' && (
                <div className="flex flex-col items-center py-4">
                  <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-[#ff1e38] animate-spin" />
                    <Fingerprint className="w-8 h-8 text-[#ff1e38]" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-1.5">
                    جاري فحص كود التفعيل وربطه بجهازك...
                  </h3>
                  <p className="text-xs text-zinc-400">التحقق من حصرية الكود</p>
                </div>
              )}

              {verificationStage === 'step2' && (
                <div className="flex flex-col items-center py-4">
                  <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-[#ff1e38] animate-spin" />
                    <Lock className="w-8 h-8 text-[#ff1e38]" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-1.5">
                    جاري ربط السيرفر بحساب BIZBET...
                  </h3>
                  <p className="text-xs text-zinc-400">مزامنة خوارزمية زيكو الروسي</p>
                </div>
              )}

              {verificationStage === 'ready' && (
                <div className="flex flex-col items-center w-full py-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#ff1e38]/10 border border-[#ff1e38]/40 flex items-center justify-center mb-4 shadow-neon">
                    <CheckCircle2 className="w-9 h-9 text-[#ff1e38]" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">
                    تم التفعيل والربط بنجاح!
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6">
                    تم حجز الكود لجهازك بنجاح، وربط معرف الحساب برادار التوقعات.
                  </p>

                  <button
                    onClick={handleDownloadAndPlay}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-[#ff1e38] to-[#d60e2a] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase rounded-xl shadow-neon flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>تحميل التطبيق وبدء اللعب</span>
                  </button>

                  <button
                    onClick={handleProceedToGames}
                    className="mt-3 w-full py-3.5 px-6 bg-zinc-900 border border-white/15 hover:border-[#ff1e38]/60 text-white font-black text-sm uppercase rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                  >
                    <Gamepad2 className="w-4 h-4 text-[#ff1e38]" />
                    <span>المتابعة للألعاب</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
