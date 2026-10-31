import { FraudAnalysisResult, PaymentReceipt } from '../types';

export interface CheckVerificationInput {
  transferTimeStr: string;
  uploadedTimeStr: string;
  amount: number;
  expectedAmount: number;
  txnId: string;
  existingTxnIds: string[];
  recipientText?: string;
  cardLastFour?: string;
  receiptImageName?: string;
}

export function analyzePaymentReceipt(input: CheckVerificationInput): FraudAnalysisResult {
  const flags: string[] = [];
  let riskScore = 0;

  const now = new Date(input.uploadedTimeStr || new Date().toISOString()).getTime();
  let transferTimeMs = 0;

  try {
    transferTimeMs = new Date(input.transferTimeStr).getTime();
  } catch {
    transferTimeMs = 0;
  }

  // 1. Vaqt tahlili (Transfer vaqti vs Yuborilgan vaqti)
  let diffMinutes = 0;
  if (transferTimeMs > 0 && !isNaN(transferTimeMs)) {
    const diffMs = now - transferTimeMs;
    diffMinutes = Math.round(diffMs / (1000 * 60));

    // Kelajakdagi vaqt (soxta botlar yoki o'zboshimcha soat)
    if (diffMinutes < -3) {
      flags.push(`⚠️ Kelajakdagi vaqt ko'rsatilgan! (${Math.abs(diffMinutes)} daqiqa oldinroq yozilgan). Soxta chek generatori ehtimoli 95%.`);
      riskScore += 65;
    } 
    // Juda eski chek (24 soatdan ortiq)
    else if (diffMinutes > 1440) {
      const hoursAgo = Math.round(diffMinutes / 60);
      flags.push(`⏱️ Chek o'tkazmasi ${hoursAgo} soat oldin amalga oshirilgan (Eski chek qayta yuborilgan bo'lishi mumkin).`);
      riskScore += 35;
    }
    // O'tkazma qilinganiga 3-30 daqiqa bo'lgan bo'lsa - normal
    else if (diffMinutes >= 0 && diffMinutes <= 30) {
      // Normal vaqt oralig'i
    }
  } else {
    flags.push(`❌ O'tkazma vaqti noto'g'ri yoki tanib bo'lmadi.`);
    riskScore += 25;
  }

  // 2. Takroriy Tranzaksiya ID (Duplicate Txn ID - bir xil chekni qayta ishlatish)
  if (input.txnId && input.existingTxnIds.includes(input.txnId.trim())) {
    flags.push(`🚨 DIQQAT: Ushbu Tranzaksiya ID (${input.txnId}) allaqachon boshqa to'lovda ishlatilgan! Takroriy firibgarlik.`);
    riskScore += 80;
  }

  // 3. Tranzaksiya ID formati tekshiruvi (Payme, Click, Uzum, Anorbank, MBank)
  const cleanTxn = (input.txnId || '').trim();
  if (cleanTxn.length < 6) {
    flags.push(`⚠️ Tranzaksiya ID juda qisqa yoki noto'g'ri formatda.`);
    riskScore += 20;
  }

  // 4. Summa mosligi tekshiruvi
  if (input.amount !== input.expectedAmount) {
    flags.push(`💰 Tanlangan summa (${input.expectedAmount.toLocaleString('uz-UZ')} so'm) va chekdagi summa (${input.amount.toLocaleString('uz-UZ')} so'm) o'zaro mos emas!`);
    riskScore += 45;
  }

  // 5. Qabul qiluvchi tekshiruvi (Safarov Azizbek)
  if (input.recipientText) {
    const textLower = input.recipientText.toLowerCase();
    const isHolderValid = textLower.includes('safarov') || textLower.includes('azizbek') || textLower.includes('aziz');
    if (!isHolderValid) {
      flags.push(`👤 Qabul qiluvchi ismi Safarov Azizbek kartasiga mos kelmadi.`);
      riskScore += 40;
    }
  }

  // 6. Kartaning so'nggi 4 raqami (4729 yoki 4670)
  if (input.cardLastFour) {
    const validEndings = ['4729', '4670'];
    if (!validEndings.includes(input.cardLastFour.trim())) {
      flags.push(`💳 Karta raqami adashgan: oxirgi raqamlar (${input.cardLastFour}) botdagi rasmiy kartalarga (4729 / 4670) to'g'ri kelmadi.`);
      riskScore += 35;
    }
  }

  // 7. Rasmli shubhali belgilar (Telegram screenshot fake maker)
  if (input.receiptImageName) {
    const nameLower = input.receiptImageName.toLowerCase();
    if (nameLower.includes('fake') || nameLower.includes('prank') || nameLower.includes('mock') || nameLower.includes('generator')) {
      flags.push(`🚨 Fayl nomida soxtalashtirish belgilari mavjud.`);
      riskScore += 60;
    }
  }

  // Risk Score chegaralash
  riskScore = Math.min(100, Math.max(0, riskScore));

  const isSuspicious = riskScore >= 50;

  if (flags.length === 0) {
    flags.push(`✅ Chek vaqti va tranzaksiya parametrlari to'liq mos keldi. Soxtalashtirish alomatlari topilmadi.`);
  }

  return {
    riskScore,
    isSuspicious,
    flags,
    timeDiffMinutes: diffMinutes,
    timestampExtracted: input.transferTimeStr,
    extractedAmount: input.amount,
    extractedRecipient: input.recipientText || 'Safarov Azizbek',
    extractedTxnId: input.txnId,
    confidence: isSuspicious ? 92 : 88
  };
}

// Boshlang'ich demo cheklar (Admin paneli darhol to'liq ishlashi va tekshiruv namunasini ko'rish uchun)
export const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'rec_1001',
    userId: 'usr_7894',
    userName: 'Akmal Rustamov',
    userPhone: '+998 90 123 45 67',
    amount: 45000,
    targetCard: '9860 0803 2676 4729',
    targetCardHolder: "Safarov Azizbek Kamol Og'li",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    transferTime: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
    txnId: 'TXN-984210459',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
    fraudAnalysis: {
      riskScore: 5,
      isSuspicious: false,
      flags: ['✅ Vaqt farqi 4 daqiqa. Haqiqiy to\'lov tasdiqlangan.'],
      timeDiffMinutes: 4,
      confidence: 96
    }
  },
  {
    id: 'rec_1002',
    userId: 'usr_5521',
    userName: 'Javohir Tursunov',
    userPhone: '+998 93 999 11 22',
    amount: 20000,
    targetCard: '6262 5704 3920 4670',
    targetCardHolder: "Safarov Azizbek Kamol Og'li",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    transferTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(), // Kelajakdagi soxta vaqt!
    txnId: 'TXN-FAKE-0001',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=600&q=80',
    status: 'rejected',
    fraudAnalysis: {
      riskScore: 85,
      isSuspicious: true,
      flags: [
        '⚠️ Kelajakdagi vaqt ko\'rsatilgan! (+120 daqiqa oldinroq). Soxta bot cheki.',
        '⚠️ Tranzaksiya ID shubhali formatda (TXN-FAKE-0001).'
      ],
      timeDiffMinutes: -120,
      confidence: 94
    },
    adminNote: 'Soxta chek generatori orqali qilingan, rad etildi.'
  },
  {
    id: 'rec_1003',
    userId: 'usr_3310',
    userName: 'Nilufar Karimova',
    userPhone: '+998 97 777 88 99',
    amount: 10000,
    targetCard: '9860 0803 2676 4729',
    targetCardHolder: "Safarov Azizbek Kamol Og'li",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    transferTime: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    txnId: 'TXN-773194002',
    receiptImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    fraudAnalysis: {
      riskScore: 8,
      isSuspicious: false,
      flags: ['✅ Vaqt farqi 2 daqiqa. Qabul qiluvchi: Safarov Azizbek. Summa to\'liq mos.'],
      timeDiffMinutes: 2,
      confidence: 95
    }
  }
];
