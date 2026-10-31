import React, { useState } from 'react';
import { Discipline, Language, Order, PresentationTheme, ServiceConfig, ServiceType } from '../types';
import { DISCIPLINES, PRESENTATION_THEMES, SERVICES } from '../data/disciplines';
import { exportDocumentToPdf, exportPresentationToSlidesPdf } from '../services/pdfExporter';
import { 
  Search, Bell, Plus, Flame, Clock, Eye, Download, ShieldCheck, ChevronRight, 
  HelpCircle, User, Home, ListOrdered, Palette, FileText, CheckCircle2, 
  Sparkles, ExternalLink, ArrowUpRight, TrendingUp, DollarSign, Calendar
} from 'lucide-react';

interface Props {
  userBalance: number;
  userName: string;
  userHash: string;
  isAdmin: boolean;
  orders: Order[];
  onOpenTopUp: () => void;
  onSelectServiceToOrder: (serviceType: ServiceType) => void;
  onViewOrder: (order: Order) => void;
  onSwitchToBot: () => void;
  onOpenAdmin?: () => void;
  onAuthenticateAdmin?: () => void;
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
}

export const TelegramMiniAppView: React.FC<Props> = ({
  userBalance,
  userName,
  userHash,
  isAdmin,
  orders,
  onOpenTopUp,
  onSelectServiceToOrder,
  onViewOrder,
  onSwitchToBot,
  onOpenAdmin,
  onAuthenticateAdmin,
  currentLang,
  onChangeLang
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'help' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisciplineCategory, setSelectedDisciplineCategory] = useState<string>('all');
  const [previewTheme, setPreviewTheme] = useState<PresentationTheme | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Filtered services
  const filteredServices = SERVICES.filter(s => {
    if (!searchQuery) return true;
    return s.titleUz.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.descriptionUz.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const categories = [
    'all',
    'Iqtisodiyot va Moliya',
    'Huquqshunoslik va Siyosat',
    'Pedagogika va Gumanitar',
    'IT va Aniq fanlar',
    'Tibbiyot va Tabiiy',
    'Qishloq xo\'jaligi va Muhandislik'
  ];

  return (
    <div className="flex flex-col min-h-[750px] max-h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative font-sans-modern">
      
      {/* Top Header Bar */}
      <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800/90 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-md shadow-purple-950/50">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-bold text-sm">
                🎓
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Salom, {userName} 👋</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Talaba Slide</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  MINI APP
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <select
              value={currentLang}
              onChange={(e) => onChangeLang(e.target.value as Language)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="uz">🇺🇿 UZ</option>
              <option value="kaa">🇺🇿 KAA</option>
              <option value="ru">🇷🇺 RU</option>
              <option value="en">🇬🇧 EN</option>
            </select>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-slate-900" />
            </button>
          </div>
        </div>

        {/* Notifications Popup */}
        {showNotifications && (
          <div className="absolute right-4 top-16 w-80 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl z-30 space-y-2 text-xs">
            <div className="font-bold text-white flex justify-between items-center border-b border-slate-800 pb-2">
              <span>Bildirishnomalar</span>
              <span className="text-[10px] text-purple-400">Yangi</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200">
              <span className="font-semibold text-white block mb-0.5">🎓 35 ta yo'nalish yangilandi</span>
              Rasmiy OTM talablari va 2024-2026 yangi qonun hujjatlari integratsiya qilindi.
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200">
              <span className="font-semibold text-white block mb-0.5">⚡ Sifat kafolati</span>
              Barcha ilmiy ishlar me'yoriy talablarga to'liq mos ravishda tayyorlanadi.
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Xizmatlar yoki mavzularni qidiring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition shadow-inner"
          />
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        
        {/* TAB 1: Bosh Sahifa */}
        {activeTab === 'home' && (
          <>
            {/* Balance & TopUp Hero Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-slate-900 p-5 border border-purple-500/30 shadow-xl">
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Sizning balansingiz
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    💰 {userBalance.toLocaleString('uz-UZ')} <span className="text-sm font-normal text-purple-300">so'm</span>
                  </div>
                  <div className="text-[11px] text-purple-200/80 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tezkor to'lov & Xavfsiz tranzaksiyalar</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenTopUp}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4" /> Balansni to'ldirish
                  </button>
                  <button
                    onClick={onSwitchToBot}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition"
                    title="Telegram Bot rejimiga o'tish"
                  >
                    🤖 Bot
                  </button>
                </div>
              </div>
            </div>

            {/* NARXLAR RO'YXATI Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base tracking-wide uppercase">
                    📋 Narxlar Ro'yxati
                  </h3>
                </div>
                <button
                  onClick={onSwitchToBot}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                >
                  Bot orqali boshlash <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredServices.map((service, idx) => (
                  <div
                    key={service.id}
                    className={`relative p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      service.popular
                        ? 'bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-950/20'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Mashhur Badge on first card */}
                    {service.popular && (
                      <div className="absolute -top-2.5 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current" /> Mashhur 🔥
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-sm sm:text-base">{service.titleUz}</h4>
                        <div className="text-right">
                          <span className="font-extrabold text-purple-400 text-sm sm:text-base whitespace-nowrap">
                            {service.basePrice.toLocaleString('uz-UZ')} {service.maxPrice > service.basePrice ? `- ${service.maxPrice.toLocaleString('uz-UZ')}` : ''} so'm
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {service.descriptionUz}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span>Tayyorlanish vaqti: {service.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {service.id === 'mustaqil_ish' ? '1 bet = 300 so\'m' : 'Tezkor & Sifatli'}
                      </span>
                      <button
                        onClick={() => onSelectServiceToOrder(service.id)}
                        className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 transition flex items-center gap-1.5"
                      >
                        <span>Buyurtma berish</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PREZENTATSIYA FONLARI (12 TA FОN NAMUNASI) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  <h3 className="font-extrabold text-white text-base tracking-wide uppercase">
                    Prezentatsiya Fonlari (12 xil dizayn)
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Ko'rish uchun bosing</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {PRESENTATION_THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => setPreviewTheme(theme)}
                    className="p-3 rounded-xl border border-slate-800 hover:border-purple-500/60 bg-slate-900/70 cursor-pointer transition transform hover:-translate-y-1 shadow-md space-y-2 group"
                  >
                    <div
                      style={{ backgroundColor: theme.bgColor, borderColor: theme.borderColor }}
                      className="w-full h-18 rounded-lg border flex flex-col justify-between p-2 shadow-inner relative overflow-hidden"
                    >
                      <div
                        style={{ backgroundColor: theme.accentColor }}
                        className="w-full h-1 rounded-full opacity-80"
                      />
                      <div className="space-y-1">
                        <div
                          style={{ backgroundColor: theme.cardBg }}
                          className="w-3/4 h-2 rounded"
                        />
                        <div
                          style={{ backgroundColor: theme.cardBg }}
                          className="w-1/2 h-1.5 rounded opacity-60"
                        />
                      </div>
                      <div className="text-[9px] text-right opacity-60 font-mono">
                        16:9
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-300 group-hover:text-purple-300 transition line-clamp-1">
                      {theme.nameUz}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 35 TA OTM YO'NALISHLARI SHOWCASE */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-white text-base tracking-wide uppercase">
                  🎓 35 ta Mutaxassislik Yo'nalishi
                </h3>
                <span className="text-xs text-purple-400 font-medium">Barcha OTMlar</span>
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedDisciplineCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium ${
                      selectedDisciplineCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat === 'all' ? 'Barcha 35 yo\'nalish' : cat}
                  </button>
                ))}
              </div>

              {/* Disciplines Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {DISCIPLINES.filter(d => selectedDisciplineCategory === 'all' || d.category === selectedDisciplineCategory)
                  .map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2 hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-200">{d.nameUz}</div>
                        <div className="text-[10px] text-slate-500">{d.category}</div>
                      </div>
                      <span className="text-[11px] text-purple-400 font-semibold whitespace-nowrap">
                        Akademik talablar
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: Buyurtmalar Tarixi */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base uppercase">
                📋 Buyurtmalar Tarixi ({orders.length})
              </h3>
              <button
                onClick={onSwitchToBot}
                className="text-xs text-purple-400 font-medium hover:underline"
              >
                + Yangi buyurtma berish
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">Buyurtmalar mavjud emas</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Siz hali birorta ham akademik ish buyurtma qilmadingiz. Narxlar ro'yxatidan tanlang va 1-3 daqiqada tayyor hujjatga ega bo'ling.
                </p>
                <button
                  onClick={onSwitchToBot}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-900/30"
                >
                  Birinchi buyurtmani berish
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm sm:text-base">{ord.topic}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Tayyor
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {ord.disciplineName} • {ord.author.fullName || 'Talaba'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-purple-400 text-sm">
                          {ord.price.toLocaleString('uz-UZ')} so'm
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(ord.createdAt).toLocaleDateString('uz-UZ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Rasmiy ilmiy talablar asosida</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewOrder(ord)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ko'rish
                        </button>
                        <button
                          onClick={() => {
                            if (ord.presentation) exportPresentationToSlidesPdf(ord.presentation);
                            else if (ord.document) exportDocumentToPdf(ord.document);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow transition"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Yordam & FAQ */}
        {activeTab === 'help' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-base uppercase">❓ Yordam va FAQ</h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white text-sm">✨ Ilmiy ish sifati qanday ta'minlanadi?</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Har bir matn O'zbekistonning amaldagi qonunlari, rasmiy farmonlar va nufuzli darslik manbalari bilan yoziladi. Aniq reja, titul varaq, kirish, boblar, xulosa va haqiqiy adabiyotlar to'liq kiritiladi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white text-sm">💳 Balansni to'ldirish qancha vaqt oladi?</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Siz Humo yoki Uzcard kartalariga (Safarov Azizbek Kamol Og'li) to'lov qilib, chekni yuklaganingizdan so'ng, admin va avtomatlashtirilgan tahlilchi orqali o'tkazma vaqti tekshiriladi va 1-3 daqiqada balansingiz yangilanadi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white text-sm">🔒 Shaxsiy ma'lumotlar xavfsizligi kafolatlanganmi?</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ha, buyurtma tugagach, barcha shaxsiy ma'lumotlar 30 kundan so'ng avtomatik tarzda tizimdan to'liq o'chiriladi. Hech qanday ma'lumot uchinchi shaxslarga berilmaydi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white text-sm">🎓 35 ta mutaxassislik bo'yicha talablar qanday?</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Iqtisodiyot, Huquq, Tibbiyot, IT, Pedagogika va Qishloq xo'jaligi sohalarining har biri uchun alohida ilmiy lug'at, formulalar va O'zbekiston OTMlarida qabul qilingan rasmiy titul varaq andozalari qo'llaniladi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Profil */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-base uppercase">👤 Mening Profilim</h3>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-950/60">
                  {userName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{userName}</h4>
                  <div className="text-xs text-slate-400 font-mono">ID: {userHash}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">● Faol talaba</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Jami Buyurtmalar</div>
                  <div className="text-xl font-extrabold text-white mt-1">{orders.length} ta</div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Joriy Balans</div>
                  <div className="text-xl font-extrabold text-purple-400 mt-1">
                    {userBalance.toLocaleString('uz-UZ')} so'm
                  </div>
                </div>
              </div>

              {/* Language switcher setting */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Tizim tili:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { code: 'uz', name: '🇺🇿 O\'zbek' },
                    { code: 'kaa', name: '🇺🇿 Qoraqalpoq' },
                    { code: 'ru', name: '🇷🇺 Ruscha' },
                    { code: 'en', name: '🇬🇧 Ingliz' }
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => onChangeLang(l.code as Language)}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                        currentLang === l.code
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Telegram Admin Integration & Access Block */}
              <div className="pt-3 border-t border-slate-800">
                {isAdmin ? (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Admin: @Yurist_617 ulangan
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Bot: 8766646881:AAH6gW0...
                      </div>
                    </div>
                    {onOpenAdmin && (
                      <button
                        onClick={onOpenAdmin}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                      >
                        Admin Panel →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center pt-1">
                    <button
                      onClick={onAuthenticateAdmin}
                      className="text-[11px] text-slate-500 hover:text-slate-300 font-medium transition"
                    >
                      🔒 Administrator kirish (@Yurist_617)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Theme Preview Modal */}
      {previewTheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setPreviewTheme(null)}
        >
          <div
            className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-base">{previewTheme.nameUz} (16:9 Namuna)</h4>
              <button
                onClick={() => setPreviewTheme(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Yopish ✕
              </button>
            </div>

            <div
              style={{
                backgroundColor: previewTheme.bgColor,
                color: previewTheme.textColor,
                borderColor: previewTheme.borderColor
              }}
              className="w-full aspect-[16/9] rounded-xl border p-6 flex flex-col justify-between shadow-2xl"
            >
              <div style={{ backgroundColor: previewTheme.accentColor }} className="h-1.5 w-full rounded-full" />
              <div>
                <span className="text-[10px] tracking-wider uppercase opacity-70">Prezentatsiya Slaydi</span>
                <h3 className="text-xl font-extrabold mt-1">O'ZBEKISTONDA RAQAMLI IQTISODIYOT</h3>
                <div
                  style={{ backgroundColor: previewTheme.cardBg, borderColor: previewTheme.borderColor }}
                  className="mt-3 p-3 rounded-lg border text-xs"
                >
                  • Zamonaviy standartlar va me'yoriy asoslar
                </div>
              </div>
              <div className="text-[10px] opacity-70 flex justify-between">
                <span>Talaba Slide Bot</span>
                <span>Slayd 1/12</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPreviewTheme(null);
                onSelectServiceToOrder('prezentatsiya');
              }}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition"
            >
              Ushbu fon bilan prezentatsiya buyurtma qilish →
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 grid grid-cols-4 gap-1 z-20">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-semibold transition ${
            activeTab === 'home' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Bosh sahifa</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-semibold transition ${
            activeTab === 'orders' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListOrdered className="w-4 h-4 mb-0.5" />
          <span>Buyurtmalar</span>
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-semibold transition ${
            activeTab === 'help' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 mb-0.5" />
          <span>Yordam</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-semibold transition ${
            activeTab === 'profile' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span>Profil</span>
        </button>
      </div>

    </div>
  );
};
