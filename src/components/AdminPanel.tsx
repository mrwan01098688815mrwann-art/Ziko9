import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  KeyRound,
  Plus,
  Trash2,
  Copy,
  Check,
  X,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  FirebaseActivationCode,
  subscribeToFirebaseCodes,
  addRandomCodesToFirebase,
  deleteCodeFromFirebase,
} from '../utils/activationCodes';
import { sound } from '../utils/sound';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [codes, setCodes] = useState<FirebaseActivationCode[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [prefix, setPrefix] = useState('ZIKO');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // استماع مباشر للأكواد من الفايربيز بدون باسورد
  useEffect(() => {
    if (isOpen) {
      const unsubscribe = subscribeToFirebaseCodes((firebaseCodes) => {
        setCodes(firebaseCodes);
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [isOpen]);

  const handleGenerateCodes = async (count = 1) => {
    sound.playClick();
    setIsGenerating(true);
    setStatusMsg(`جارٍ توليد ${count} كود عشوائي وحفظهم في الفايربيز...`);

    const newCodes = await addRandomCodesToFirebase(count, prefix.trim() || 'ZIKO');
    setIsGenerating(false);
    sound.playSuccess();
    setStatusMsg(`تم بنجاح توليد ${newCodes.length} كود عشوائي في الفايربيز!`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteCode = async (codeToDelete: string) => {
    sound.playClick();
    await deleteCodeFromFirebase(codeToDelete);
  };

  const handleCopy = (code: string) => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    sound.playCopy();
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCodes = codes.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-[#090b10] border-2 border-[#ff1e38]/50 rounded-3xl shadow-neon overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header (بدون باسورد - وصول فوري للأدمن) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#ff1e38]/15 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff1e38]/20 border border-[#ff1e38]/40 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-[#ff1e38]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                لوحة توليد الأكواد العشوائية (Firebase Live)
                <span className="text-[10px] bg-emerald-500 text-black font-black px-2 py-0.5 rounded-full uppercase">
                  متصل بالفايربيز
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                الأكواد عشوائية وتُحذف تلقائياً من الفايربيز بمجرد أن يستخدمها العميل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-5">
          {/* Status notification */}
          {statusMsg && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/90 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center text-center">
              <span className="text-[10px] text-zinc-400 font-bold uppercase mb-0.5">
                الأكواد النشطة بالفايربيز
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {codes.length}
              </span>
            </div>

            <div className="bg-zinc-900/90 border border-emerald-500/30 p-3.5 rounded-2xl flex flex-col items-center text-center">
              <span className="text-[10px] text-emerald-400 font-bold uppercase mb-0.5">
                حالة الحذف التلقائي
              </span>
              <span className="text-sm font-black text-emerald-400 mt-1 flex items-center gap-1">
                <Flame className="w-4 h-4 text-[#ff1e38]" /> يُحذف الكود فور الاستخدام
              </span>
            </div>
          </div>

          {/* Generator Controls */}
          <div className="bg-zinc-950 border border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-300 font-bold">بادئة الكود:</span>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                className="w-24 bg-zinc-900 border border-white/10 text-white font-mono text-center text-xs py-2 rounded-xl focus:border-[#ff1e38] focus:outline-none uppercase"
                placeholder="ZIKO"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleGenerateCodes(1)}
                disabled={isGenerating}
                className="px-3.5 py-2.5 bg-[#ff1e38] hover:bg-[#ff334b] text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-neon cursor-pointer transition-all disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>توليد كود عشوائي</span>
              </button>

              <button
                onClick={() => handleGenerateCodes(5)}
                disabled={isGenerating}
                className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ff1e38]" />
                <span>+5 أكواد</span>
              </button>

              <button
                onClick={() => handleGenerateCodes(10)}
                disabled={isGenerating}
                className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>+10 أكواد</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث في الأكواد..."
              className="w-full bg-zinc-900/90 border border-white/10 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ff1e38]"
            />
          </div>

          {/* Codes List (Live from Firebase) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-bold px-1">
              <span>الأكواد الجاهزة للاستخدام (تختفي فور استخدامها):</span>
              <span>{filteredCodes.length} كود</span>
            </div>

            {filteredCodes.map((c) => {
              const isCopied = copiedCode === c.code;
              return (
                <div
                  key={c.code}
                  className="p-3.5 rounded-2xl border bg-zinc-900/80 border-white/10 hover:border-[#ff1e38]/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                      ✓
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-white tracking-widest">
                          {c.code}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          جاهز
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        تاريخ الإنشاء: {new Date(c.createdAt).toLocaleTimeString('ar-EG')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(c.code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isCopied
                          ? 'bg-emerald-500 text-black'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      }`}
                      title="نسخ الكود"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteCode(c.code)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-[#ff1e38] transition-all cursor-pointer"
                      title="حذف من الفايربيز"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredCodes.length === 0 && (
              <div className="py-8 text-center text-xs text-zinc-500 bg-zinc-950/50 rounded-2xl border border-white/5">
                لا توجد أكواد نشطة حالياً في الفايربيز. اضغط على "توليد كود عشوائي" بالأعلى!
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
