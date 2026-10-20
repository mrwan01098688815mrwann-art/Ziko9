<?php
/**
 * لوحة تحكم هاك زيكو الروسي - إدارة أكواد التفعيل المربوطة بالفايربيز
 * ZIKO RUSSIAN VIP - FIREBASE REALTIME CODES MANAGER
 * بدون كلمة مرور (Direct Access) - مربوطة مباشرة مع Firebase RTDB
 */

// إعدادات الفايربيز الخاصة بالسكريبت
define('FIREBASE_URL', 'https://mrwan-dd795-default-rtdb.firebaseio.com');

/**
 * دوال التعامل مع Firebase Realtime Database عبر REST API
 */
function firebaseRequest($path, $method = 'GET', $data = null) {
    $url = rtrim(FIREBASE_URL, '/') . '/' . ltrim($path, '/') . '.json';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    if ($data !== null) {
        $jsonData = json_encode($data, JSON_UNESCAPED_UNICODE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonData)
        ]);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($response === false) {
        return null;
    }
    
    return json_decode($response, true);
}

function getCodesFromFirebase() {
    $res = firebaseRequest('activation_codes');
    if (!is_array($res)) {
        return [];
    }
    // تحويل الكائن لمصفوفة مرتبة
    $list = [];
    foreach ($res as $key => $item) {
        if (is_array($item)) {
            $item['key'] = $key;
            $list[] = $item;
        }
    }
    // الترتيب من الأحدث للأقدم
    usort($list, function($a, $b) {
        return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
    });
    return $list;
}

function saveCodeToFirebase($code, $data) {
    // تنظيف المفتاح للفايربيز
    $safeKey = str_replace(['.', '$', '#', '[', ']'], '_', $code);
    return firebaseRequest("activation_codes/{$safeKey}", 'PUT', $data);
}

function deleteCodeFromFirebase($code) {
    $safeKey = str_replace(['.', '$', '#', '[', ']'], '_', $code);
    return firebaseRequest("activation_codes/{$safeKey}", 'DELETE');
}

function unlockCodeInFirebase($code) {
    $safeKey = str_replace(['.', '$', '#', '[', ']'], '_', $code);
    $updateData = [
        'status' => 'active',
        'bound_user_id' => null,
        'bound_device' => null,
        'used_at' => null
    ];
    return firebaseRequest("activation_codes/{$safeKey}", 'PATCH', $updateData);
}

function generateCodeString($prefix = 'ZIKO') {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $r1 = '';
    $r2 = '';
    for ($i = 0; $i < 4; $i++) {
        $r1 .= $chars[rand(0, strlen($chars) - 1)];
        $r2 .= $chars[rand(0, strlen($chars) - 1)];
    }
    return strtoupper($prefix) . '-' . $r1 . '-' . $r2;
}

// معالجة توليد الأكواد
$message = '';
if (isset($_POST['generate'])) {
    $count = max(1, min(50, (int)($_POST['count'] ?? 1)));
    $prefix = preg_replace('/[^A-Za-z0-9]/', '', $_POST['prefix'] ?? 'ZIKO') ?: 'ZIKO';
    
    for ($i = 0; $i < $count; $i++) {
        $codeStr = generateCodeString($prefix);
        $newCodeData = [
            'code' => $codeStr,
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s'),
            'bound_user_id' => null,
            'bound_device' => null,
            'used_at' => null,
            'note' => 'تم إنشاؤه عبر لوحة الأدمن'
        ];
        saveCodeToFirebase($codeStr, $newCodeData);
    }
    $message = "تم توليد {$count} كود بنجاح ومزامنتها مع الفايربيز مباشرة!";
}

// حذف كود
if (isset($_GET['delete'])) {
    $target = $_GET['delete'];
    deleteCodeFromFirebase($target);
    header('Location: admin.php?msg=deleted');
    exit;
}

// فك قفل كود
if (isset($_GET['unlock'])) {
    $target = $_GET['unlock'];
    unlockCodeInFirebase($target);
    header('Location: admin.php?msg=unlocked');
    exit;
}

if (isset($_GET['msg']) && $_GET['msg'] === 'deleted') {
    $message = 'تم حذف الكود من الفايربيز بنجاح.';
}
if (isset($_GET['msg']) && $_GET['msg'] === 'unlocked') {
    $message = 'تم فك قفل الكود وأصبح متاحاً للاستخدام على جهاز جديد.';
}

// جلب الأكواد الحالية من الفايربيز
$codes = getCodesFromFirebase();

// إحصائيات
$activeCount = count(array_filter($codes, fn($c) => ($c['status'] ?? '') === 'active'));
$usedCount = count(array_filter($codes, fn($c) => ($c['status'] ?? '') === 'used'));
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة تحكم زيكو الروسي - Firebase Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Cairo', sans-serif;
            background-color: #07080c;
            color: #ffffff;
        }
        .font-mono {
            font-family: 'Share Tech Mono', monospace;
        }
        .shadow-neon {
            box-shadow: 0 0 25px rgba(255, 30, 56, 0.45);
        }
    </style>
</head>
<body class="min-h-screen bg-[#07080c] flex flex-col p-4 sm:p-6">
    <div class="max-w-4xl mx-auto w-full space-y-6">
        <!-- Header -->
        <header class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-[#ff1e38]/20 border border-[#ff1e38]/40 flex items-center justify-center shadow-neon font-black text-xl text-[#ff1e38]">
                    Z
                </div>
                <div>
                    <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                        لوحة تحكم هاك زيكو الروسي
                        <span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-sans uppercase">
                            FIREBASE LIVE
                        </span>
                    </h1>
                    <p class="text-xs text-zinc-400">
                        مربوطة مباشرة بفايربيز السكريبت: <span class="font-mono text-zinc-300">mrwan-dd795</span> (بدون باسورد)
                    </p>
                </div>
            </div>

            <!-- Firebase status indicator -->
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>RTDB CONNECTED</span>
            </div>
        </header>

        <?php if ($message): ?>
            <div class="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 rounded-2xl text-xs font-bold flex items-center justify-between">
                <span>✓ <?= htmlspecialchars($message) ?></span>
                <a href="admin.php" class="text-zinc-400 hover:text-white underline">إغلاق</a>
            </div>
        <?php endif; ?>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-3 sm:gap-4">
            <div class="bg-zinc-900/90 border border-white/10 p-4 rounded-2xl text-center shadow-lg">
                <span class="text-xs text-zinc-400 font-bold block mb-1">إجمالي الأكواد بالفايربيز</span>
                <span class="text-3xl font-black text-white font-mono"><?= count($codes) ?></span>
            </div>
            <div class="bg-zinc-900/90 border border-emerald-500/30 p-4 rounded-2xl text-center shadow-lg">
                <span class="text-xs text-emerald-400 font-bold block mb-1">أكواد جاهزة (غير مستخدمة)</span>
                <span class="text-3xl font-black text-emerald-400 font-mono"><?= $activeCount ?></span>
            </div>
            <div class="bg-zinc-900/90 border border-[#ff1e38]/30 p-4 rounded-2xl text-center shadow-lg">
                <span class="text-xs text-[#ff1e38] font-bold block mb-1">أكواد مقفلة على أجهزة</span>
                <span class="text-3xl font-black text-[#ff1e38] font-mono"><?= $usedCount ?></span>
            </div>
        </div>

        <!-- Code Generator Bar -->
        <div class="bg-zinc-950 border border-white/10 p-5 rounded-2xl shadow-xl">
            <h2 class="text-sm font-black text-white mb-3 flex items-center gap-2">
                <span>⚡</span> توليد أكواد تفعيل جديدة وحفظها في الفايربيز
            </h2>
            <form method="POST" class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2">
                    <span class="text-xs text-zinc-300 font-bold">بادئة الكود:</span>
                    <input type="text" name="prefix" value="ZIKO" class="w-24 bg-zinc-900 border border-white/15 text-white font-mono text-center text-xs py-2 rounded-xl focus:border-[#ff1e38] focus:outline-none uppercase">
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-zinc-300 font-bold">العدد:</span>
                    <select name="count" class="bg-zinc-900 border border-white/15 text-white text-xs py-2 px-3 rounded-xl focus:border-[#ff1e38] focus:outline-none">
                        <option value="1">كود واحد</option>
                        <option value="5">5 أكواد</option>
                        <option value="10">10 أكواد</option>
                        <option value="20">20 كود</option>
                    </select>
                </div>
                <button type="submit" name="generate" class="px-5 py-2.5 bg-gradient-to-r from-[#ff1e38] to-[#d60e2a] hover:from-[#ff334b] text-white font-black text-xs rounded-xl shadow-neon cursor-pointer transition">
                    + توليد وحفظ في الفايربيز
                </button>
            </form>
        </div>

        <!-- Codes Table -->
        <div class="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div class="px-5 py-3.5 border-b border-white/10 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400 font-bold">
                <span>قائمة الأكواد المزامنة مع السكريبت</span>
                <span class="font-mono text-zinc-300"><?= count($codes) ?> كود مسجل</span>
            </div>

            <div class="divide-y divide-white/5 max-h-[550px] overflow-y-auto">
                <?php if (empty($codes)): ?>
                    <div class="p-8 text-center text-zinc-500 text-xs">
                        لا توجد أكواد مسجلة حالياً في الفايربيز، اضغط على زر التوليد بالأعلى لإنشاء أول كود.
                    </div>
                <?php else: ?>
                    <?php foreach ($codes as $c): ?>
                        <?php 
                            $codeVal = $c['code'] ?? '';
                            $status = $c['status'] ?? 'active';
                            $isActive = $status === 'active';
                        ?>
                        <div class="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-white/[0.02] transition">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs <?= $isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-[#ff1e38] border border-red-500/30' ?>">
                                    <?= $isActive ? '✓' : '🔒' ?>
                                </div>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono font-black text-sm text-white tracking-wider">
                                            <?= htmlspecialchars($codeVal) ?>
                                        </span>
                                        <span class="text-[9px] font-bold px-2 py-0.5 rounded-full <?= $isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-[#ff1e38] border border-red-500/30' ?>">
                                            <?= $isActive ? 'جاهز للبيع والاستخدام' : 'مستخدم ومقفل على جهاز' ?>
                                        </span>
                                    </div>
                                    <?php if (!$isActive): ?>
                                        <div class="text-[11px] text-zinc-400 mt-1 flex flex-wrap gap-2">
                                            <span>معرف الحساب: <strong class="text-white font-mono"><?= htmlspecialchars($c['bound_user_id'] ?: 'غير محدد') ?></strong></span>
                                            <span>•</span>
                                            <span>بصمة الجهاز: <span class="font-mono text-zinc-500"><?= htmlspecialchars(substr($c['bound_device'] ?: '', 0, 16)) ?>...</span></span>
                                            <span>•</span>
                                            <span>تاريخ الاستخدام: <?= htmlspecialchars($c['used_at'] ?: '-') ?></span>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <button onclick="navigator.clipboard.writeText('<?= addslashes($codeVal) ?>'); alert('تم نسخ الكود: <?= addslashes($codeVal) ?>');" class="px-3 py-1.5 bg-zinc-900 border border-white/10 hover:border-white/30 text-white rounded-lg text-xs font-bold transition cursor-pointer">
                                    نسخ
                                </button>
                                <?php if (!$isActive): ?>
                                    <a href="?unlock=<?= urlencode($codeVal) ?>" onclick="return confirm('هل تريد فك قفل هذا الكود ليتمكن جهاز آخر من استخدامه؟')" class="px-3 py-1.5 bg-zinc-900 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 rounded-lg text-xs font-bold transition">
                                        فك القفل
                                    </a>
                                <?php endif; ?>
                                <a href="?delete=<?= urlencode($codeVal) ?>" onclick="return confirm('هل أنت متأكد من حذف هذا الكود من الفايربيز نهائياً؟')" class="px-3 py-1.5 bg-zinc-900 border border-red-500/30 text-[#ff1e38] hover:bg-red-500/10 rounded-lg text-xs font-bold transition">
                                    حذف
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

        <!-- Fast Links -->
        <div class="flex items-center justify-between text-xs text-zinc-500 px-2">
            <span>السكريبت واللوحة مربوطان معاً في نفس قاعدة بيانات الفايربيز لحظياً.</span>
            <a href="https://console.firebase.google.com/project/mrwan-dd795/database/mrwan-dd795-default-rtdb/data" target="_blank" class="text-zinc-400 hover:text-white underline">
                فتح كونسول الفايربيز ↗
            </a>
        </div>
    </div>
</body>
</html>
