// Activation Codes Manager with Firebase Realtime Database sync and single-device binding
import { ref, get, set, onValue } from 'firebase/database';
import { rtdb } from './firebase';

export interface ActivationCode {
  code: string;
  status: 'active' | 'used';
  createdAt: string;
  usedAt?: string;
  boundUserId?: string;
  boundDeviceId?: string;
  note?: string;
}

const STORAGE_KEY = 'ziko_activation_codes';
const DEVICE_KEY = 'ziko_device_fingerprint';

// Get or create unique device fingerprint
export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server';
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    const raw = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    deviceId = `DEV-${Math.abs(hash).toString(16).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem(DEVICE_KEY, deviceId);
  }
  return deviceId;
};

// Initial default codes
const DEFAULT_CODES: ActivationCode[] = [
  {
    code: 'ZIKO-2026-VIP',
    status: 'active',
    createdAt: new Date().toISOString(),
    note: 'كود تجريبي نشط',
  },
  {
    code: 'ZIKO-R11-PRO',
    status: 'active',
    createdAt: new Date().toISOString(),
    note: 'كود VIP خاص بالبروموكود R11',
  },
  {
    code: 'RUSSIAN-777-WIN',
    status: 'active',
    createdAt: new Date().toISOString(),
    note: 'كود روسي معتمد',
  },
  {
    code: 'ACT-ZIKO-888',
    status: 'active',
    createdAt: new Date().toISOString(),
    note: 'كود فوري',
  },
  {
    code: 'VIP-99-PRED',
    status: 'active',
    createdAt: new Date().toISOString(),
    note: 'كود دقة 99%',
  },
];

export const getStoredCodes = (): ActivationCode[] => {
  if (typeof window === 'undefined') return DEFAULT_CODES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CODES));
      return DEFAULT_CODES;
    }
    return JSON.parse(saved);
  } catch {
    return DEFAULT_CODES;
  }
};

export const saveCodes = (codes: ActivationCode[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  }
};

// Initialize Firebase sync listener
if (typeof window !== 'undefined') {
  try {
    const codesRef = ref(rtdb, 'activation_codes');
    onValue(codesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data === 'object') {
        const list: ActivationCode[] = [];
        Object.keys(data).forEach((key) => {
          const item = data[key];
          if (item && typeof item === 'object') {
            list.push({
              code: item.code || key,
              status: item.status || 'active',
              createdAt: item.created_at || item.createdAt || new Date().toISOString(),
              usedAt: item.used_at || item.usedAt,
              boundUserId: item.bound_user_id || item.boundUserId,
              boundDeviceId: item.bound_device || item.boundDeviceId,
              note: item.note,
            });
          }
        });
        if (list.length > 0) {
          saveCodes(list);
        }
      }
    });
  } catch {
    // Offline fallback
  }
}

export const generateSingleCode = (prefix = 'ZIKO'): ActivationCode => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand1 = '';
  let rand2 = '';
  for (let i = 0; i < 4; i++) {
    rand1 += chars.charAt(Math.floor(Math.random() * chars.length));
    rand2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const code = `${prefix}-${rand1}-${rand2}`;
  return {
    code,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
};

export const validateAndRedeemCode = (
  rawCode: string,
  userId: string
): { success: boolean; message: string; code?: ActivationCode } => {
  const codeToVerify = rawCode.trim().toUpperCase();
  if (!codeToVerify) {
    return { success: false, message: 'يرجى إدخال كود التفعيل.' };
  }

  const codes = getStoredCodes();
  const currentDeviceId = getDeviceId();

  const foundIndex = codes.findIndex(
    (c) => c.code.toUpperCase() === codeToVerify
  );

  if (foundIndex === -1) {
    return {
      success: false,
      message: 'كود التفعيل غير صحيح، يرجى التأكد من كتابة الكود بدقة.',
    };
  }

  const target = codes[foundIndex];

  // If already used
  if (target.status === 'used') {
    // Check if it's the SAME device and SAME user ID (allowed re-login)
    if (
      target.boundDeviceId === currentDeviceId ||
      (target.boundUserId && target.boundUserId === userId)
    ) {
      return {
        success: true,
        message: 'تم التحقق من الكود المربوط بهذا الجهاز بنجاح.',
        code: target,
      };
    }

    return {
      success: false,
      message: 'هذا الكود تم استخدامه مسبقاً على جهاز آخر ولا يمكن استخدامه مجدداً.',
    };
  }

  // Redeem for single device
  const now = new Date().toISOString();
  const updatedCode: ActivationCode = {
    ...target,
    status: 'used',
    usedAt: now,
    boundUserId: userId,
    boundDeviceId: currentDeviceId,
  };

  codes[foundIndex] = updatedCode;
  saveCodes(codes);

  // Sync to Firebase RTDB in real time
  try {
    const safeKey = target.code.replace(/[.$#[\]]/g, '_');
    const fbRef = ref(rtdb, `activation_codes/${safeKey}`);
    set(fbRef, {
      code: target.code,
      status: 'used',
      used_at: now,
      bound_user_id: userId,
      bound_device: currentDeviceId,
      created_at: target.createdAt,
    }).catch(() => {});
  } catch {
    // fallback
  }

  return {
    success: true,
    message: 'تم تفعيل الكود وربطه بهذا الجهاز بنجاح!',
    code: updatedCode,
  };
};
