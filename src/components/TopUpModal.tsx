import React, { useState } from 'react';
import { PAYMENT_CARDS, TOP_UP_PRESETS } from '../data/disciplines';
import { PaymentReceipt } from '../types';
import { analyzePaymentReceipt } from '../services/fraudDetector';
import { notifyAdminNewReceipt } from '../services/telegramService';
import { Check, Copy, CreditCard, UploadCloud, AlertTriangle, ShieldCheck, X, FileImage } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReceipt: (receipt: PaymentReceipt) => void;
  currentBalance: number;
}

export const TopUpModal: React.FC<Props> = ({ isOpen, onClose, onSubmitReceipt, currentBalance }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(20000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  // Receipt submission form
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);
  const [senderName, setSenderName] = useState<string>('Azizbek Safarov');
  const [userPhone, setUserPhone] = useState<string>('+998 90 123 45 67');
  const [transferTime, setTransferTime] = useState<string>(
    new Date(Date.now() - 1000 * 60 * 2).toISOString().slice(0, 16) // 2 mins ago
  );
  const [txnId, setTxnId] = useState<string>(() => `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`);
  const [receiptImage, setReceiptImage] = useState<string>('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80');
  const [receiptFileName, setReceiptFileName] = useState<string>('payme_chek_to\'lov.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentAmount = isCustom ? (parseInt(customAmountStr, 10) || 0) : selectedAmount;

  const handleCopy = (cardNum: string) => {
    navigator.clipboard.writeText(cardNum.replace(/\s+/g, ''));
    setCopiedCard(cardNum);
    setTimeout(() => setCopiedCard(null), 2000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReceiptImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) return;

    setIsSubmitting(true);

    const targetCard = PAYMENT_CARDS[selectedCardIdx];
    const uploadedTimeIso = new Date().toISOString();

    // Run real fraud detection check
    const fraudAnalysis = analyzePaymentReceipt({
      transferTimeStr: new Date(transferTime).toISOString(),
      uploadedTimeStr: uploadedTimeIso,
      amount: currentAmount,
      expectedAmount: currentAmount,
      txnId: txnId.trim(),
      existingTxnIds: ['TXN-ALREADY-USED'],
      recipientText: targetCard.holder,
      cardLastFour: targetCard.rawNumber.slice(-4),
      receiptImageName: receiptFileName
    });

    const newReceipt: PaymentReceipt = {
      id: `rec_${Date.now()}`,
      userId: 'usr_me',
      userName: senderName || 'Foydalanuvchi',
      userPhone,
      amount: currentAmount,
      targetCard: targetCard.number,
      targetCardHolder: targetCard.holder,
      uploadedAt: uploadedTimeIso,
      transferTime: new Date(transferTime).toISOString(),
      txnId: txnId.trim(),
      receiptImageUrl: receiptImage,
      status: 'pending',
      fraudAnalysis
    };

    // Forward notification to Telegram Bot / Admin @Yurist_617
    notifyAdminNewReceipt(newReceipt);

    setTimeout(() => {
      onSubmitReceipt(newReceipt);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 2200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Balansni to'ldirish</h2>
              <p className="text-xs text-slate-400">Joriy balans: 💰 {currentBalance.toLocaleString('uz-UZ')} so'm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">To'lov cheki yuborildi!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Chekingiz admin tekshiruviga yuborildi. O'tkazma vaqti va tranzaksiya tasdiqlangach, balansingiz darhol <span className="text-emerald-400 font-semibold">{currentAmount.toLocaleString('uz-UZ')} so'm</span>ga to'ldiriladi.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-400 border border-slate-700">
              ⚡ O'rtacha tasdiqlash vaqti: 1-3 daqiqa
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
            
            {/* Step 1: Amount Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                1. To'ldirish summasini tanlang
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TOP_UP_PRESETS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setIsCustom(false);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      !isCustom && selectedAmount === amt
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/30'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {amt.toLocaleString('uz-UZ')} so'm
                  </button>
                ))}
              </div>

              {/* Custom amount toggle */}
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className={`text-xs font-semibold transition ${isCustom ? 'text-emerald-400 underline' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  ✍️ Boshqa summa kiritish
                </button>
                {isCustom && (
                  <div className="mt-2">
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      placeholder="Masalan: 35000"
                      value={customAmountStr}
                      onChange={(e) => setCustomAmountStr(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Payment Cards Info */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                2. Quyidagi rasmiy kartalardan biriga o'tkazing
              </label>
              <div className="space-y-2.5">
                {PAYMENT_CARDS.map((card, idx) => (
                  <div
                    key={card.number}
                    onClick={() => setSelectedCardIdx(idx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      selectedCardIdx === idx
                        ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300">
                        {card.bank.split('/')[0].trim()}
                      </div>
                      <div>
                        <div className="font-mono font-bold text-white text-sm sm:text-base tracking-wider">
                          {card.number}
                        </div>
                        <div className="text-xs text-slate-400">
                          {card.holder} • <span className="text-slate-500">{card.bank}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(card.number);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-200 transition"
                      title="Karta raqamini nusxalash"
                    >
                      {copiedCard === card.number ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Nusxalandi</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Nusxalash</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-amber-400/90 mt-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                Iltimos, aynan {currentAmount.toLocaleString('uz-UZ')} so'm o'tkazing va chekni ilova qiling.
              </p>
            </div>

            {/* Step 3: Receipt & Verification Details */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                3. To'lov cheki ma'lumotlari
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">O'tkazuvchi Ismi</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Ism Familiya"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Telefon raqam</label>
                  <input
                    type="text"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="+998 90 000 00 00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">O'tkazma vaqti (Chekdagi vaqt)</label>
                  <input
                    type="datetime-local"
                    required
                    value={transferTime}
                    onChange={(e) => setTransferTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tranzaksiya / Chek raqami (Txn ID)</label>
                  <input
                    type="text"
                    required
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="TXN-12345678"
                  />
                </div>
              </div>

              {/* Receipt File Upload */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Chek skrinshoti / fotosi</label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer bg-slate-800/40 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="w-6 h-6 text-indigo-400" />
                    <div className="text-xs text-slate-300 font-medium">
                      {receiptFileName ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <FileImage className="w-4 h-4" /> {receiptFileName}
                        </span>
                      ) : (
                        "Chek rasmini yuklash uchun bosing yoki shu yerga tashlang"
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">Payme, Click, Uzum yoki Anorbank cheki (PNG, JPG)</span>
                  </div>
                </div>
              </div>

              {/* Anti-Fraud Disclaimer */}
              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-900/60 flex items-start gap-2.5 text-xs text-indigo-300">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-indigo-400 flex-shrink-0" />
                <p className="leading-relaxed">
                  <span className="font-semibold text-white">Soxta cheklardan himoya tizimi faol:</span> O'tkazma vaqti va tranzaksiya ID si bank ma'lumotlari bilan avtomatlashtirilgan tarzda solishtiriladi.
                </p>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || currentAmount <= 0}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 transition flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <span>⏳ Tekshirilmoqda va yuborilmoqda...</span>
                ) : (
                  <>
                    <span>📩 Chekni yuborish ({currentAmount.toLocaleString('uz-UZ')} so'm)</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
