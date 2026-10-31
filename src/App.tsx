import React, { useState } from 'react';
import { Language, Order, PaymentReceipt, ServiceType } from './types';
import { INITIAL_RECEIPTS } from './services/fraudDetector';
import { generateAcademicDocument, generateAcademicPresentation } from './services/academicGenerator';
import { TelegramBotView } from './components/TelegramBotView';
import { TelegramMiniAppView } from './components/TelegramMiniAppView';
import { AdminPanelView } from './components/AdminPanelView';
import { TopUpModal } from './components/TopUpModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { PresentationViewerModal } from './components/PresentationViewerModal';
import { 
  Bot, Smartphone, ShieldCheck, CreditCard, Sparkles, 
  Layers, CheckCircle, FileText, Globe, Lock, Unlock, X, Check
} from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState<'bot' | 'miniapp' | 'admin'>('bot');
  
  // Administrator gatekeeping (@Yurist_617)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState<string>('@Yurist_617');
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // User state
  const [userBalance, setUserBalance] = useState<number>(0); // 0 so'm - bepul foydalanish bloklangan
  const [userName, setUserName] = useState<string>('Azizbek Safarov');
  const [userHash] = useState<string>('usr_uz_98412');
  const [currentLang, setCurrentLang] = useState<Language>('uz');
  const [selectedServiceForBot, setSelectedServiceForBot] = useState<ServiceType | null>(null);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Modals state
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [viewingPresentation, setViewingPresentation] = useState<any>(null);

  // Receipts for admin panel & fraud detection
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(INITIAL_RECEIPTS);

  // Orders history (with initial realistic orders)
  const [orders, setOrders] = useState<Order[]>(() => {
    const sampleDoc = generateAcademicDocument({
      serviceType: 'referat',
      topic: "O'zbekistonda raqamli iqtisodiyotni rivojlantirish istiqbollari",
      disciplineId: 'iqtisodiyot',
      author: {
        fullName: 'Azizbek Safarov',
        university: 'Toshkent Davlat Iqtisodiyot Universiteti (TDIU)',
        faculty: 'Raqamli Iqtisodiyot',
        course: '3',
        group: 'DI-82',
        teacher: 'prof. A.V. Vaxabov'
      },
      language: 'uz',
      pages: 15,
      chaptersCount: 2,
      format: 'times_new_roman'
    });

    const samplePres = generateAcademicPresentation({
      serviceType: 'prezentatsiya',
      topic: "Sun'iy intellekt va Kiberxavfsizlik asoslari",
      disciplineId: 'cybersecurity',
      author: {
        fullName: 'Azizbek Safarov',
        university: 'Toshkent Axborot Texnologiyalari Universiteti (TATU)'
      },
      language: 'uz',
      slidesCount: 12,
      presentationThemeId: 'tech_dark_blue'
    });

    return [
      {
        id: 'ord_sample_1',
        serviceType: 'referat',
        topic: "O'zbekistonda raqamli iqtisodiyotni rivojlantirish istiqbollari",
        disciplineId: 'iqtisodiyot',
        disciplineName: 'Iqtisodiyot',
        language: 'uz',
        price: 5000,
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        status: 'completed',
        author: {
          fullName: 'Azizbek Safarov',
          university: 'TDIU',
          faculty: 'Raqamli Iqtisodiyot'
        },
        pages: 15,
        format: 'times_new_roman',
        document: sampleDoc
      },
      {
        id: 'ord_sample_2',
        serviceType: 'prezentatsiya',
        topic: "Sun'iy intellekt va Kiberxavfsizlik asoslari",
        disciplineId: 'cybersecurity',
        disciplineName: 'Axborot xavfsizligi va kiberxavfsizlik',
        language: 'uz',
        price: 8000,
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        status: 'completed',
        author: {
          fullName: 'Azizbek Safarov',
          university: 'TATU'
        },
        slidesCount: 12,
        presentationThemeId: 'tech_dark_blue',
        presentation: samplePres
      }
    ];
  });

  // Top up submit handler
  const handleReceiptSubmitted = (newReceipt: PaymentReceipt) => {
    setReceipts(prev => [newReceipt, ...prev]);
  };

  // Admin approval
  const handleApproveReceipt = (receiptId: string) => {
    const target = receipts.find(r => r.id === receiptId);
    if (!target) return;

    setUserBalance(prev => prev + target.amount);
    setReceipts(prev => prev.map(r => r.id === receiptId ? { ...r, status: 'approved' } : r));
    
    setAdminToast(`✅ To'lov tasdiqlandi! Foydalanuvchi hisobiga +${target.amount.toLocaleString('uz-UZ')} so'm tushirildi. Endi foydalanuvchi tanlangan xizmatni darhol bajara oladi!`);
    setTimeout(() => {
      setAdminToast(null);
    }, 6000);
  };

  // Admin rejection
  const handleRejectReceipt = (receiptId: string, reason?: string) => {
    setReceipts(prev => prev.map(r => r.id === receiptId ? { ...r, status: 'rejected', adminNote: reason } : r));
  };

  // Admin deletion (data privacy: 30 days / immediate clean)
  const handleDeleteReceipt = (receiptId: string) => {
    setReceipts(prev => prev.filter(r => r.id !== receiptId));
  };

  // Order created handler
  const handleOrderCreated = (newOrder: Order, price: number) => {
    setUserBalance(prev => Math.max(0, prev - price));
    setOrders(prev => [newOrder, ...prev]);
  };

  // View order
  const handleViewOrder = (order: Order) => {
    if (order.presentation) {
      setViewingPresentation(order.presentation);
    } else if (order.document) {
      setViewingDocument(order.document);
    }
  };

  const handleSelectServiceToOrder = (serviceType: ServiceType) => {
    setSelectedServiceForBot(serviceType);
    setActiveMode('bot');
  };

  // Admin Login Verification
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = adminUsernameInput.trim().toLowerCase();
    if (cleanUsername === '@yurist_617' || cleanUsername === 'yurist_617') {
      setIsAdmin(true);
      setShowAdminLoginModal(false);
      setActiveMode('admin');
      setAdminLoginError(null);
    } else {
      setAdminLoginError('Faqat @Yurist_617 admin hisobiga ruxsat berilgan.');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    setActiveMode('bot');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Application Navigation Bar */}
      <header className="border-b border-slate-800/90 bg-slate-900/80 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-lg">
                🎓
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                  Talaba Slide Bot
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline">
                  35 OTM Yo'nalishi
                </span>
              </div>
              <div className="text-[11px] text-slate-400 -mt-0.5">
                Akademik Yordamchi Tizimi
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveMode('bot')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeMode === 'bot'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">1. Telegram Bot</span>
              <span className="sm:hidden">Bot</span>
            </button>

            <button
              onClick={() => setActiveMode('miniapp')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeMode === 'miniapp'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">2. Mini App</span>
              <span className="sm:hidden">Mini App</span>
            </button>

            {/* Admin Panel button - ONLY visible when authenticated as @Yurist_617 */}
            {isAdmin && (
              <button
                onClick={() => setActiveMode('admin')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeMode === 'admin'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400'
                    : 'text-emerald-400 hover:text-white bg-emerald-950/40 border border-emerald-500/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">3. Admin (@Yurist_617)</span>
                <span className="sm:hidden">Admin</span>
                {receipts.filter(r => r.status === 'pending').length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            )}
          </div>

          {/* Quick Balance Button & Discreet Admin Entry */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition shadow-sm"
              title="Balansni to'ldirish"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>💰 {userBalance.toLocaleString('uz-UZ')} so'm</span>
            </button>

            {/* Admin Lock / Unlock Icon */}
            {isAdmin ? (
              <button
                onClick={handleLogoutAdmin}
                className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40 transition"
                title="Admin rejimini yopish (Foydalanuvchi rejimiga qaytish)"
              >
                <Unlock className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLoginModal(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 transition"
                title="Administrator Kirish (@Yurist_617)"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Toast Notification */}
      {adminToast && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-emerald-950 border border-emerald-500/80 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{adminToast}</span>
          </div>
          <button
            onClick={() => setAdminToast(null)}
            className="text-emerald-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        {activeMode === 'bot' && (
          <TelegramBotView
            userBalance={userBalance}
            userName={userName}
            isAdmin={isAdmin}
            onOpenTopUp={() => setIsTopUpOpen(true)}
            onOpenMiniApp={() => setActiveMode('miniapp')}
            onOpenAdmin={() => setActiveMode('admin')}
            onAuthenticateAdmin={() => {
              setIsAdmin(true);
              setActiveMode('admin');
            }}
            onOrderCreated={handleOrderCreated}
            onViewOrder={handleViewOrder}
            selectedServiceToOrder={selectedServiceForBot}
            onClearSelectedService={() => setSelectedServiceForBot(null)}
          />
        )}

        {activeMode === 'miniapp' && (
          <TelegramMiniAppView
            userBalance={userBalance}
            userName={userName}
            userHash={userHash}
            isAdmin={isAdmin}
            orders={orders}
            onOpenTopUp={() => setIsTopUpOpen(true)}
            onSelectServiceToOrder={handleSelectServiceToOrder}
            onViewOrder={handleViewOrder}
            onSwitchToBot={() => setActiveMode('bot')}
            onOpenAdmin={() => setActiveMode('admin')}
            onAuthenticateAdmin={() => {
              setIsAdmin(true);
              setActiveMode('admin');
            }}
            currentLang={currentLang}
            onChangeLang={setCurrentLang}
          />
        )}

        {activeMode === 'admin' && isAdmin && (
          <AdminPanelView
            receipts={receipts}
            orders={orders}
            onApproveReceipt={handleApproveReceipt}
            onRejectReceipt={handleRejectReceipt}
            onDeleteReceipt={handleDeleteReceipt}
            onViewOrder={handleViewOrder}
            onLogoutAdmin={handleLogoutAdmin}
          />
        )}
      </main>

      {/* Admin Authentication Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Administrator Kirish</h3>
                  <p className="text-xs text-slate-400">Telegram: @Yurist_617</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminLoginModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Telegram Bot Token ulangan:
              </div>
              <div className="font-mono text-[11px] text-slate-400 break-all">
                8766646881:AAH6gW0WhGjkikK4Pxih2EUj10PLSKjRWro
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Admin panel faqat @Yurist_617 ga ko'rinadi va oddiy talabalarga yopiq.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">
                  Telegram Username:
                </label>
                <input
                  type="text"
                  value={adminUsernameInput}
                  onChange={(e) => setAdminUsernameInput(e.target.value)}
                  placeholder="@Yurist_617"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                {adminLoginError && (
                  <p className="text-xs text-rose-400 mt-1.5">{adminLoginError}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950 transition"
                >
                  Kirish (@Yurist_617)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSubmitReceipt={handleReceiptSubmitted}
        currentBalance={userBalance}
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        document={viewingDocument}
        onClose={() => setViewingDocument(null)}
      />

      {/* Presentation Viewer Modal (12 themes) */}
      <PresentationViewerModal
        presentation={viewingPresentation}
        onClose={() => setViewingPresentation(null)}
      />

      {/* Footer Info */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 text-center text-xs text-slate-500">
        <p>🎓 Talaba Slide Bot & Mini App — O'zbekiston OTMlari uchun 35 ta yo'nalishda akademik yordamchi.</p>
      </footer>

    </div>
  );
}
