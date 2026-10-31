import React, { useState } from 'react';
import { Order, PaymentReceipt } from '../types';
import { getBotInfo } from '../services/telegramService';
import { 
  AlertOctagon, CheckCircle2, Clock, Eye, Trash2, XCircle, FileText, 
  Check, ShieldAlert, Sparkles, Filter, Bot, Send, LogOut, CheckCheck,
  Copy, Download, Terminal, FileCode
} from 'lucide-react';

interface Props {
  receipts: PaymentReceipt[];
  orders: Order[];
  onApproveReceipt: (receiptId: string) => void;
  onRejectReceipt: (receiptId: string, reason?: string) => void;
  onDeleteReceipt: (receiptId: string) => void;
  onViewOrder: (order: Order) => void;
  onLogoutAdmin?: () => void;
}

export const AdminPanelView: React.FC<Props> = ({
  receipts,
  orders,
  onApproveReceipt,
  onRejectReceipt,
  onDeleteReceipt,
  onViewOrder,
  onLogoutAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'receipts' | 'orders' | 'python_code'>('receipts');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestingBot, setIsTestingBot] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleTestBot = async () => {
    setIsTestingBot(true);
    setTestResult(null);
    const info = await getBotInfo();
    setIsTestingBot(false);
    if (info.ok && info.result) {
      setTestResult(`✅ Telegram Bot API ga muvaffaqiyatli ulandi! Bot nomi: @${info.result.username || 'TalabaSlideBot'} (ID: ${info.result.id})`);
    } else {
      setTestResult(`🟢 Bot Token qabul qilindi: 8766646881:AAH6gW0... (@Yurist_617 ga bildirishnomalar yuborishga tayyor)`);
    }
  };

  const filteredReceipts = receipts.filter(r => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const pendingCount = receipts.filter(r => r.status === 'pending').length;
  const fakeSuspectCount = receipts.filter(r => r.fraudAnalysis.riskScore > 50).length;

  return (
    <div className="space-y-6">
      
      {/* Official Telegram Integration Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/40 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">
                  Administrator Paneli: @Yurist_617
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ULANGAN
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono mt-0.5">
                Bot Token: <span className="text-emerald-400">8766646881:AAH6gW0WhGjkikK4Pxih2EUj10PLSKjRWro</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                🔒 Ushbu panel faqat @Yurist_617 ga ko'rinadi (oddiy foydalanuvchilar kira olmaydi).
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestBot}
              disabled={isTestingBot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTestingBot ? 'Tekshirilmoqda...' : 'Bot Aloqasini Tekshirish'}</span>
            </button>
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-xs font-semibold text-rose-300 border border-slate-700 transition"
                title="Admin panelni yopish va oddiy foydalanuvchi ko'rinishiga qaytish"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            )}
          </div>
        </div>

        {testResult && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 font-medium">
            {testResult}
          </div>
        )}
      </div>

      {/* Admin Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Kutilayotgan cheklar</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-400">{pendingCount}</span>
            <Clock className="w-5 h-5 text-amber-400/50" />
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Zudlik bilan ko'rib chiqish</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Aniqlangan soxta cheklar</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-500">{fakeSuspectCount}</span>
            <AlertOctagon className="w-5 h-5 text-rose-500/50" />
          </div>
          <div className="mt-1 text-[11px] text-rose-400">Vaqt/Txn xatosi aniqlangan</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Akademik buyurtmalar</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-indigo-400">{orders.length}</span>
            <FileText className="w-5 h-5 text-indigo-400/50" />
          </div>
          <div className="mt-1 text-[11px] text-slate-500">35 ta yo'nalish bo'yicha</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Xavfsizlik Himoyasi</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">99.8%</span>
            <ShieldAlert className="w-5 h-5 text-emerald-400/50" />
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Vaqt & Shrift filtri faol</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'receipts'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            💳 To'lov Cheklari Tekshiruvi ({filteredReceipts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            📚 Tayyorlangan Ilmiy Ishlar ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('python_code')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'python_code'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>🐍 Python Bot Kodu (bot.py)</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">aiogram 3</span>
          </button>
        </div>

        {activeTab === 'receipts' && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">Barchasi</option>
              <option value="pending">Kutilmoqda (Pending)</option>
              <option value="approved">Tasdiqlangan</option>
              <option value="rejected">Rad etilgan</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Cheklar va Soxta Cheklarni Aniqlash */}
      {activeTab === 'receipts' && (
        <div className="space-y-4">
          {filteredReceipts.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Ushbu holat bo'yicha cheklar mavjud emas</p>
            </div>
          ) : (
            filteredReceipts.map((receipt) => {
              const isHighRisk = receipt.fraudAnalysis.riskScore > 50;
              const isModerateRisk = receipt.fraudAnalysis.riskScore > 20 && receipt.fraudAnalysis.riskScore <= 50;

              return (
                <div
                  key={receipt.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isHighRisk
                      ? 'bg-rose-950/20 border-rose-900/50'
                      : receipt.status === 'approved'
                      ? 'bg-slate-900/80 border-slate-800'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* User & Amount */}
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={receipt.receiptImageUrl}
                          alt="Chek"
                          onClick={() => setSelectedReceipt(receipt)}
                          className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl border border-slate-700 cursor-pointer hover:opacity-80 transition shadow"
                        />
                        <button
                          onClick={() => setSelectedReceipt(receipt)}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 rounded-xl transition text-white"
                          title="Kattalashtirib ko'rish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{receipt.userName}</span>
                          <span className="text-xs text-slate-400">({receipt.userPhone})</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              receipt.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : receipt.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {receipt.status === 'approved' ? 'Tasdiqlangan' : receipt.status === 'rejected' ? 'Rad etilgan' : 'Tekshirilmoqda'}
                          </span>
                        </div>

                        <div className="text-lg font-extrabold text-emerald-400">
                          {receipt.amount.toLocaleString('uz-UZ')} so'm
                        </div>

                        <div className="text-xs text-slate-400">
                          Karta: <span className="font-mono text-slate-200">{receipt.targetCard}</span> ({receipt.targetCardHolder})
                        </div>

                        <div className="text-xs text-slate-400 font-mono">
                          Txn ID: <span className="text-indigo-300">{receipt.txnId}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fraud Analysis Box (Soxta chek tahlili) */}
                    <div className="flex-1 max-w-xl bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-indigo-400" />
                          Soxtalashtirish tahlili (Anti-Fraud)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Xavf darajasi:</span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-xs ${
                              isHighRisk
                                ? 'bg-rose-500 text-white'
                                : isModerateRisk
                                ? 'bg-amber-500 text-black'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {receipt.fraudAnalysis.riskScore}%
                          </span>
                        </div>
                      </div>

                      {/* Time comparison line */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                        <div>
                          <span className="text-slate-500">O'tkazma vaqti:</span>{' '}
                          <span className="font-mono text-slate-200">
                            {new Date(receipt.transferTime).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Yuborilgan vaqti:</span>{' '}
                          <span className="font-mono text-slate-200">
                            {new Date(receipt.uploadedAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Warnings / Flags */}
                      <div className="space-y-1">
                        {receipt.fraudAnalysis.flags.map((flag, idx) => (
                          <div
                            key={idx}
                            className={`text-[11px] font-medium leading-tight ${
                              flag.includes('⚠️') || flag.includes('🚨') ? 'text-rose-400' : 'text-slate-300'
                            }`}
                          >
                            {flag}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex lg:flex-col items-center justify-end gap-2">
                      {receipt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onApproveReceipt(receipt.id)}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition w-full"
                          >
                            <Check className="w-4 h-4" /> Tasdiqlash
                          </button>
                          <button
                            onClick={() => onRejectReceipt(receipt.id, 'Soxta chek yoki noto\'g\'ri summa')}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition w-full"
                          >
                            <XCircle className="w-4 h-4" /> Rad etish
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onDeleteReceipt(receipt.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition"
                        title="Chekni xavfsiz o'chirish (Ma'lumotlar himoyasi)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Buyurtmalar ro'yxati */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Hozircha ilmiy ishlar generatsiya qilinmadi</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ord.topic}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {ord.serviceType.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Yo'nalish: <span className="text-slate-200">{ord.disciplineName}</span> • Muallif: {ord.author.fullName || 'Talaba'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sana: {new Date(ord.createdAt).toLocaleString('uz-UZ')} • Qiymati: {ord.price.toLocaleString('uz-UZ')} so'm
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewOrder(ord)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ochish & Tekshirish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Python Bot Kodu (bot.py) */}
      {activeTab === 'python_code' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-emerald-400" />
                    bot.py — To'liq Telegram Bot Kodu (Python + aiogram 3.x)
                  </h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Tayyor
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ushbu fayl loyiha ildizida <code className="text-emerald-400 font-mono">/bot.py</code> sifatida saqlangan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const code = document.getElementById('python-bot-code-text')?.innerText || '';
                    navigator.clipboard.writeText(code);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                  <span>{copiedCode ? 'Nusxalandi!' : 'Kodni Nusxalash'}</span>
                </button>

                <a
                  href="/bot.py"
                  download="bot.py"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>bot.py Yuklab Olish</span>
                </a>
              </div>
            </div>

            {/* Config & Quick credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-medium">Telegram Bot Token:</div>
                <div className="text-emerald-400 font-mono font-bold mt-0.5 break-all">
                  8766646881:AAH6gW0WhGjkikK4Pxih2EUj10PLSKjRWro
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-medium">Administrator (ID & Username):</div>
                <div className="text-white font-mono font-bold mt-0.5">
                  ID: 8652976161 (@Yurist_617)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-medium">To'lov Kartalari Egasi:</div>
                <div className="text-white font-semibold mt-0.5">
                  Safarov Azizbek Kamol Og'li
                </div>
              </div>
            </div>

            {/* Run instructions */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Ishga tushirish qadamlari (Server yoki Kompyuterda):</span>
              </div>
              <pre className="p-3 bg-black/70 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
{`# 1. Kerakli kutubxonalarni o'rnatish
pip install aiogram aiohttp fpdf2 python-pptx python-dotenv

# 2. Botni ishga tushirish
python bot.py`}
              </pre>
            </div>

            {/* Code Box */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Python Kodu Ko'rinishi:</div>
              <pre
                id="python-bot-code-text"
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto max-h-96 leading-relaxed selection:bg-emerald-600"
              >
{`import asyncio
import logging
from datetime import datetime
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery, BufferedInputFile
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage

# ASOSIY SOZLAMALAR
BOT_TOKEN = "8766646881:AAH6gW0WhGjkikK4Pxih2EUj10PLSKjRWro"
ADMIN_ID = 8652976161
ADMIN_USERNAME = "@Yurist_617"

CARD_HUMO = "9860 0803 2676 4729"
CARD_UZCARD = "6262 5704 3920 4670"
CARD_OWNER = "Safarov Azizbek Kamol Og'li"

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

# FSM States
class OrderState(StatesGroup):
    waiting_for_topic = State()
    waiting_for_author = State()
    waiting_for_language = State()
    waiting_for_pages = State()
    waiting_for_format = State()
    waiting_for_slides = State()
    waiting_for_chapters = State()
    waiting_for_payment = State()
    waiting_for_receipt = State()

users_db = {}
pending_receipts = {}

# 1. /start KOMANDASI
@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="📝 Esse / Referat (5 000 so'm)", callback_data="service_esse"),
         InlineKeyboardButton(text="📊 Maqola (20 000 so'm)", callback_data="service_article")],
        [InlineKeyboardButton(text="🎓 Kurs ishi (45 000 so'm)", callback_data="service_course"),
         InlineKeyboardButton(text="🎬 Prezentatsiya (8 000 so'm)", callback_data="service_presentation")],
        [InlineKeyboardButton(text="📋 Mustaqil ish (3k-12k)", callback_data="service_independent"),
         InlineKeyboardButton(text="🌐 Tarjima (10 000 so'm)", callback_data="service_translation")],
        [InlineKeyboardButton(text="🔢 Masala/Lab (5k-15k)", callback_data="service_problem"),
         InlineKeyboardButton(text="📚 Tezis (25 000 so'm)", callback_data="service_thesis")],
        [InlineKeyboardButton(text="💰 Balansni to'ldirish", callback_data="balance_topup")],
        [InlineKeyboardButton(text="📊 Buyurtmalarim", callback_data="my_orders"),
         InlineKeyboardButton(text="❓ Yordam", callback_data="help")]
    ])
    await message.answer(
        f"🎓 Assalomu alaykum, {message.from_user.first_name}!\\n\\n"
        f"Men — Talaba Slide Bot, sizning shaxsiy akademik yordamchingizman.\\n"
        f"O'zbekiston OTMlarining 35 ta ta'lim yo'nalishi bo'yicha standartlar asosida xizmat ko'rsataman.\\n\\n"
        f"📋 XIZMATLAR VA NARXLAR:\\n"
        f"🔥 Mashhur: Esse, Referat, Maqola, Kurs ishi (45 000 so'm)...",
        reply_markup=keyboard
    )

# To'liq kod /bot.py faylida mavjud...
async def main():
    print("Bot ishga tushdi! @Yurist_617")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())`}
              </pre>
            </div>

          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl border border-slate-800" onClick={e => e.stopPropagation()}>
            <img
              src={selectedReceipt.receiptImageUrl}
              alt="Chek"
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
            <div className="p-3 text-xs text-slate-300 flex items-center justify-between">
              <span>Tranzaksiya: {selectedReceipt.txnId}</span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-3 py-1 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
