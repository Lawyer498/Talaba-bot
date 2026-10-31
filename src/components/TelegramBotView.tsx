import React, { useState, useRef, useEffect } from 'react';
import { AuthorDetails, Discipline, Language, Order, ServiceType } from '../types';
import { DISCIPLINES, PRESENTATION_THEMES, SERVICES } from '../data/disciplines';
import { generateAcademicDocument, generateAcademicPresentation } from '../services/academicGenerator';
import { exportDocumentToPdf, exportPresentationToSlidesPdf } from '../services/pdfExporter';
import { 
  Send, Bot, Check, ArrowLeft, RefreshCw, Eye, Download,
  Sparkles, ShieldCheck, ChevronRight, Smartphone, BookOpen, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  inlineButtons?: {
    text: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger' | 'success';
    fullWidth?: boolean;
  }[];
  generatedOrder?: Order;
}

interface Props {
  userBalance: number;
  userName: string;
  isAdmin: boolean;
  onOpenTopUp: () => void;
  onOpenMiniApp: () => void;
  onOpenAdmin: () => void;
  onAuthenticateAdmin: () => void;
  onOrderCreated: (order: Order, price: number) => void;
  onViewOrder: (order: Order) => void;
  selectedServiceToOrder?: ServiceType | null;
  onClearSelectedService?: () => void;
}

export const TelegramBotView: React.FC<Props> = ({
  userBalance,
  userName,
  isAdmin,
  onOpenTopUp,
  onOpenMiniApp,
  onOpenAdmin,
  onAuthenticateAdmin,
  onOrderCreated,
  onViewOrder,
  selectedServiceToOrder,
  onClearSelectedService
}) => {
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Wizard state
  const [wizardState, setWizardState] = useState<{
    step: 'idle' | 'topic' | 'discipline' | 'author' | 'language' | 'options' | 'confirm';
    serviceType?: ServiceType;
    topic?: string;
    disciplineId?: string;
    authorDetails?: AuthorDetails;
    language?: Language;
    pages?: number;
    format?: 'times_new_roman' | 'handwriting';
    presentationThemeId?: string;
    slidesCount?: number;
    chaptersCount?: number;
    translationStyle?: string;
    problemDifficulty?: 'easy' | 'medium' | 'hard';
    price?: number;
  }>({
    step: 'idle'
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const prevBalanceRef = useRef<number>(userBalance);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      showMainMenu(true);
    }
  }, []);

  // When admin approves payment and balance increases
  useEffect(() => {
    if (userBalance > prevBalanceRef.current) {
      const added = userBalance - prevBalanceRef.current;
      if (wizardState.step === 'confirm' && wizardState.price && userBalance >= wizardState.price) {
        addBotMessage(
          `🎉 To'lovingiz administrator (@Yurist_617) tomonidan tasdiqlandi!\n\n` +
          `➕ Hisobingizga qo'shildi: +${added.toLocaleString('uz-UZ')} so'm\n` +
          `💰 Yangi balansingiz: ${userBalance.toLocaleString('uz-UZ')} so'm\n\n` +
          `Endi tanlangan xizmatni darhol bajarishingiz mumkin!`,
          [
            {
              text: `🚀 Buyurtmani darhol bajarish (${wizardState.price.toLocaleString('uz-UZ')} so'm)`,
              action: () => executeOrder(wizardState, wizardState.price!),
              style: 'success',
              fullWidth: true
            },
            {
              text: '🏠 Bosh menyu',
              action: () => showMainMenu(),
              style: 'secondary',
              fullWidth: true
            }
          ]
        );
      } else {
        addBotMessage(
          `🎉 To'lovingiz administrator (@Yurist_617) tomonidan tasdiqlandi!\n\n` +
          `➕ Hisobingizga qo'shildi: +${added.toLocaleString('uz-UZ')} so'm\n` +
          `💰 Yangi balansingiz: ${userBalance.toLocaleString('uz-UZ')} so'm\n\n` +
          `Xizmatlardan to'liq foydalanishingiz mumkin!`,
          [
            {
              text: '📋 Xizmat tanlash',
              action: () => showMainMenu(),
              style: 'primary',
              fullWidth: true
            }
          ]
        );
      }
    }
    prevBalanceRef.current = userBalance;
  }, [userBalance]);

  // When a service is picked from Mini App or elsewhere
  useEffect(() => {
    if (selectedServiceToOrder) {
      startService(selectedServiceToOrder);
      if (onClearSelectedService) {
        onClearSelectedService();
      }
    }
  }, [selectedServiceToOrder]);

  const addBotMessage = (text: string, inlineButtons?: BotMessage['inlineButtons'], generatedOrder?: Order) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now()}_${Math.random()}`,
          sender: 'bot',
          text,
          timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
          inlineButtons,
          generatedOrder
        }
      ]);
      setIsTyping(false);
    }, 450);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: `msg_${Date.now()}_${Math.random()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const showMainMenu = (isInitial = false) => {
    const welcome = isInitial
      ? `🎓 Assalomu alaykum, ${userName}! 👋\nMen — Talaba Slide Bot, sizning shaxsiy akademik yordamchingizman.\n\nO'zbekiston OTMlarining 35 ta ta'lim yo'nalishi bo'yicha ilmiy talablar va standartlar asosida xizmat ko'rsataman.\n\n💰 Balansingiz: ${userBalance.toLocaleString('uz-UZ')} so'm\n\n📋 XIZMATLAR VA NARXLAR:\n🔥 Mashhur:\n📝 Esse / Referat — 5 000 so'm (1-2 min)\n📊 Ilmiy Maqola — 20 000 so'm (2-3 min)\n🎓 Kurs ishi — 45 000 so'm (3-5 min)\n🎬 Prezentatsiya — 8 000 so'm (1-2 min)\n📋 Mustaqil ish — 3 000 - 12 000 so'm\n🌐 Tarjima xizmati — 10 000 so'm\n🔢 Masala va Lab — 5 000 - 15 000 so'm\n📚 Tezis — 25 000 so'm\n\n👇 Xizmat turini tanlang yoki 💰 Balansni to'ldiring:`
      : `🎓 Talaba Slide Bot — Bosh Menyu\nSalom, ${userName}! 👋\nSizning balansingiz: 💰 ${userBalance.toLocaleString('uz-UZ')} so'm\n\n📋 Xizmat turini tanlang:`;

    const buttons = [
      { text: '📝 Esse / Referat', action: () => startService('referat') },
      { text: '📊 Ilmiy Maqola', action: () => startService('maqola') },
      { text: '🎓 Kurs ishi', action: () => startService('kurs_ishi') },
      { text: '🎬 Prezentatsiya (PPTX)', action: () => startService('prezentatsiya') },
      { text: '📋 Mustaqil ish', action: () => startService('mustaqil_ish') },
      { text: '🌐 Tarjima xizmati', action: () => startService('tarjima') },
      { text: '🔢 Masala / Lab', action: () => startService('masala_lab') },
      { text: '📚 Tezis', action: () => startService('tezis') },
      { text: '💰 Balansni to\'ldirish', action: onOpenTopUp, style: 'success' as const },
      { text: '📱 Mini App ni ochish', action: onOpenMiniApp, style: 'primary' as const, fullWidth: true }
    ];

    addBotMessage(welcome, buttons);
    setWizardState({ step: 'idle' });
  };

  const startService = (serviceType: ServiceType) => {
    const service = SERVICES.find(s => s.id === serviceType);
    addUserMessage(service?.titleUz || serviceType);

    setWizardState({
      step: 'discipline',
      serviceType
    });

    // Ask to choose discipline category or direct discipline
    const discButtons = DISCIPLINES.slice(0, 10).map(d => ({
      text: d.nameUz,
      action: () => handleSelectDiscipline(d.id)
    }));

    addBotMessage(
      `📚 1-QADAM: ${service?.titleUz} uchun OTM ta'lim yo'nalishingizni tanlang (Jami 35 ta mutaxassislik mavjud):`,
      [
        ...discButtons,
        { text: '🏛️ Boshqa yo\'nalishlar...', action: () => showMoreDisciplines(serviceType), fullWidth: true },
        { text: '❌ Bekor qilish', action: () => showMainMenu(), style: 'danger', fullWidth: true }
      ]
    );
  };

  const showMoreDisciplines = (serviceType: ServiceType) => {
    const moreButtons = DISCIPLINES.slice(10, 25).map(d => ({
      text: d.nameUz,
      action: () => handleSelectDiscipline(d.id)
    }));

    addBotMessage(
      `📚 Qo'shimcha yo'nalishlar (Pedagogika, IT, Tibbiyot, Tabiiy fanlar):`,
      [
        ...moreButtons,
        { text: '⬅️ Orqaga', action: () => startService(serviceType), style: 'secondary', fullWidth: true }
      ]
    );
  };

  const handleSelectDiscipline = (disciplineId: string) => {
    const discipline = DISCIPLINES.find(d => d.id === disciplineId);
    addUserMessage(discipline?.nameUz || 'Yo\'nalish tanlandi');

    setWizardState(prev => ({
      ...prev,
      step: 'topic',
      disciplineId
    }));

    addBotMessage(
      `✍️ 2-QADAM: Ilmiy ish mavzusini yozing:\n\nMasalan:\n• "O'zbekistonda raqamli iqtisodiyotni rivojlantirish istiqbollari"\n• "Korrupsiyaga qarshi kurashning huquqiy mexanizmlari"\n• "Sun'iy intellekt texnologiyalarining tibbiyotdagi o'rni"\n\nMavzuni pastdagi xabar maydoniga yozib yuboring:`,
      [{ text: '❌ Bekor qilish', action: () => showMainMenu(), style: 'danger', fullWidth: true }]
    );
  };

  const handleTopicSubmitted = (topic: string) => {
    const serviceType = wizardState.serviceType!;
    addUserMessage(topic);

    if (serviceType === 'maqola' || serviceType === 'kurs_ishi' || serviceType === 'tezis') {
      // Step: Muallif ma'lumotlari
      setWizardState(prev => ({ ...prev, step: 'author', topic }));
      addBotMessage(
        `📋 3-QADAM: Muallif ma'lumotlarini kiriting (Rasmiy titul varaq uchun):\n\nNamunadagi kabi to'ldiring:\n1️⃣ Ism-Familiya: ${userName}\n2️⃣ OTM: Toshkent Davlat Universiteti\n3️⃣ Fakultet: Amaliy fanlar\n4️⃣ Kurs: 3-kurs, Guruh: 301\n5️⃣ Ilmiy rahbar: prof. A. Karimov\n\nPastdagi xabar maydoniga yozing yoki [📋 Namunani qo'llash] tugmasini bosing:`,
        [
          {
            text: '📋 Namunaviy ma\'lumotlarni qo\'llash',
            action: () => handleAuthorSubmitted({
              fullName: userName,
              university: 'O\'zbekiston Milliy Universiteti',
              faculty: 'Iqtisodiyot va Moliya',
              course: '3',
              group: '302-guruh',
              subject: 'Mutaxassislik fani',
              teacher: 'dots. N. Alimov'
            }),
            style: 'primary',
            fullWidth: true
          },
          { text: '⬅️ Orqaga', action: () => showMainMenu(), style: 'secondary', fullWidth: true }
        ]
      );
    } else if (serviceType === 'prezentatsiya') {
      setWizardState(prev => ({
        ...prev,
        step: 'options',
        topic,
        authorDetails: { fullName: userName, university: 'OTM' }
      }));
      showPresentationOptions();
    } else {
      setWizardState(prev => ({
        ...prev,
        step: 'language',
        topic,
        authorDetails: { fullName: userName, university: 'OTM' }
      }));
      showLanguageSelection();
    }
  };

  const handleAuthorSubmitted = (author: AuthorDetails) => {
    addUserMessage(`${author.fullName} (${author.university})`);
    setWizardState(prev => ({
      ...prev,
      step: 'language',
      authorDetails: author
    }));
    showLanguageSelection();
  };

  const showLanguageSelection = () => {
    addBotMessage(
      `🌐 Tilni tanlang:\nBarcha ilmiy terminlar, xulosalar va adabiyotlar shu tilda bo'ladi:`,
      [
        { text: '🇺🇿 O\'zbekcha', action: () => handleLanguageSelected('uz') },
        { text: '🇷🇺 Ruscha', action: () => handleLanguageSelected('ru') },
        { text: '🇬🇧 Inglizcha', action: () => handleLanguageSelected('en') },
        { text: '🇺🇿 Qoraqalpoqcha', action: () => handleLanguageSelected('kaa') }
      ]
    );
  };

  const handleLanguageSelected = (lang: Language) => {
    const langNames = { uz: 'O\'zbekcha', ru: 'Ruscha', en: 'Inglizcha', kaa: 'Qoraqalpoqcha' };
    addUserMessage(`Til: ${langNames[lang]}`);

    const serviceType = wizardState.serviceType!;

    if (serviceType === 'referat') {
      showReferatOptions(lang);
    } else if (serviceType === 'kurs_ishi') {
      showKursIshiOptions(lang);
    } else if (serviceType === 'mustaqil_ish') {
      showMustaqilIshOptions(lang);
    } else if (serviceType === 'tarjima') {
      showTranslationOptions(lang);
    } else if (serviceType === 'masala_lab') {
      showProblemOptions(lang);
    } else {
      // Maqola, Tezis -> Confirmation
      const price = serviceType === 'maqola' ? 20000 : 25000;
      showConfirmation({
        ...wizardState,
        language: lang,
        price,
        format: 'times_new_roman',
        pages: serviceType === 'maqola' ? 8 : 4
      });
    }
  };

  const showReferatOptions = (lang: Language) => {
    addBotMessage(
      `📏 Referat / Esse hajmini tanlang:`,
      [
        { text: '📄 5 sahifa — 1 500 so\'m', action: () => chooseReferatFormat(lang, 5, 1500) },
        { text: '📄 10 sahifa — 3 000 so\'m', action: () => chooseReferatFormat(lang, 10, 3000) },
        { text: '📄 15 sahifa — 4 500 so\'m', action: () => chooseReferatFormat(lang, 15, 4500) },
        { text: '📄 20 sahifa — 5 000 so\'m', action: () => chooseReferatFormat(lang, 20, 5000) }
      ]
    );
  };

  const chooseReferatFormat = (lang: Language, pages: number, price: number) => {
    addUserMessage(`${pages} sahifa (${price.toLocaleString('uz-UZ')} so'm)`);
    addBotMessage(
      `🎨 Hujjat formatini tanlang:`,
      [
        {
          text: '📄 Standart PDF (Times New Roman 14)',
          action: () => showConfirmation({ ...wizardState, language: lang, pages, price, format: 'times_new_roman' })
        },
        {
          text: '📱 Qo\'lyozma PDF (Daftar katak/chiziq effekti)',
          action: () => showConfirmation({ ...wizardState, language: lang, pages, price, format: 'handwriting' })
        }
      ]
    );
  };

  const showKursIshiOptions = (lang: Language) => {
    addBotMessage(
      `📚 Kurs ishi boblar sonini tanlang:`,
      [
        {
          text: '📗 2 bob — 30 000 so\'m (25-30 bet)',
          action: () => showConfirmation({
            ...wizardState,
            language: lang,
            chaptersCount: 2,
            pages: 28,
            price: 30000,
            format: 'times_new_roman'
          })
        },
        {
          text: '📘 3 bob — 45 000 so\'m (35-40 bet)',
          action: () => showConfirmation({
            ...wizardState,
            language: lang,
            chaptersCount: 3,
            pages: 38,
            price: 45000,
            format: 'times_new_roman'
          })
        }
      ]
    );
  };

  const showPresentationOptions = () => {
    addBotMessage(
      `🎬 Slaydlar sonini tanlang:`,
      [
        { text: '📊 10 slayd — 5 000 so\'m', action: () => choosePresentationTheme(10, 5000) },
        { text: '📊 12 slayd — 6 000 so\'m', action: () => choosePresentationTheme(12, 6000) },
        { text: '📊 15 slayd — 8 000 so\'m', action: () => choosePresentationTheme(15, 8000) },
        { text: '📊 20 slayd — 10 000 so\'m', action: () => choosePresentationTheme(20, 10000) }
      ]
    );
  };

  const choosePresentationTheme = (slidesCount: number, price: number) => {
    addUserMessage(`${slidesCount} slayd (${price.toLocaleString('uz-UZ')} so'm)`);
    const themeButtons = PRESENTATION_THEMES.slice(0, 6).map(t => ({
      text: t.nameUz,
      action: () => showConfirmation({
        ...wizardState,
        slidesCount,
        price,
        presentationThemeId: t.id,
        language: 'uz'
      })
    }));

    addBotMessage(
      `🎨 Fon rangini tanlang (Mini App orqali barcha 12 ta namunani ko'rish mumkin):`,
      [
        ...themeButtons,
        {
          text: '🌈 Zamonaviy Gradient',
          action: () => showConfirmation({
            ...wizardState,
            slidesCount,
            price,
            presentationThemeId: 'modern_gradient',
            language: 'uz'
          }),
          fullWidth: true
        }
      ]
    );
  };

  const showMustaqilIshOptions = (lang: Language) => {
    addBotMessage(
      `📏 Necha sahifa bo'lsin? (1 sahifa = 300 so'm):`,
      [
        { text: '📄 10 sahifa → 3 000 so\'m', action: () => showConfirmation({ ...wizardState, language: lang, pages: 10, price: 3000, format: 'times_new_roman' }) },
        { text: '📄 15 sahifa → 4 500 so\'m', action: () => showConfirmation({ ...wizardState, language: lang, pages: 15, price: 4500, format: 'times_new_roman' }) },
        { text: '📄 20 sahifa → 6 000 so\'m', action: () => showConfirmation({ ...wizardState, language: lang, pages: 20, price: 6000, format: 'times_new_roman' }) },
        { text: '📄 25 sahifa → 7 500 so\'m', action: () => showConfirmation({ ...wizardState, language: lang, pages: 25, price: 7500, format: 'times_new_roman' }) },
        { text: '📄 30 sahifa → 9 000 so\'m', action: () => showConfirmation({ ...wizardState, language: lang, pages: 30, price: 9000, format: 'times_new_roman' }) },
        { text: '📄 40 sahifa → 12 000 so\'m', action: () => showConfirmation({ ...wizardState, language: lang, pages: 40, price: 12000, format: 'times_new_roman' }) }
      ]
    );
  };

  const showTranslationOptions = (lang: Language) => {
    addBotMessage(
      `🎨 Tarjima uslubini tanlang:`,
      [
        { text: '🔬 Ilmiy', action: () => showConfirmation({ ...wizardState, language: lang, translationStyle: 'Ilmiy', price: 10000 }) },
        { text: '📜 Rasmiy', action: () => showConfirmation({ ...wizardState, language: lang, translationStyle: 'Rasmiy', price: 10000 }) },
        { text: '🎨 Badiiy', action: () => showConfirmation({ ...wizardState, language: lang, translationStyle: 'Badiiy', price: 10000 }) },
        { text: '📰 Jurnalistik', action: () => showConfirmation({ ...wizardState, language: lang, translationStyle: 'Jurnalistik', price: 10000 }) }
      ]
    );
  };

  const showProblemOptions = (lang: Language) => {
    addBotMessage(
      `📊 Murakkablik darajasini tanlang:`,
      [
        { text: '🟢 Oson — 5 000 so\'m', action: () => showConfirmation({ ...wizardState, language: lang, problemDifficulty: 'easy', price: 5000 }) },
        { text: '🟡 O\'rta — 10 000 so\'m', action: () => showConfirmation({ ...wizardState, language: lang, problemDifficulty: 'medium', price: 10000 }) },
        { text: '🔴 Murakkab — 15 000 so\'m', action: () => showConfirmation({ ...wizardState, language: lang, problemDifficulty: 'hard', price: 15000 }) }
      ]
    );
  };

  const showConfirmation = (state: typeof wizardState) => {
    const discipline = DISCIPLINES.find(d => d.id === state.disciplineId);
    const service = SERVICES.find(s => s.id === state.serviceType);
    const price = state.price || service?.basePrice || 5000;

    setWizardState({ ...state, price, step: 'confirm' });

    const summary = `✅ BUYURTMA MA'LUMOTLARI:
📋 Xizmat: ${service?.titleUz}
🏛️ Yo'nalish: ${discipline?.nameUz}
📝 Mavzu: "${state.topic}"
🌐 Til: ${state.language?.toUpperCase()}
${state.pages ? `📏 Hajm: ${state.pages} sahifa` : ''}
${state.slidesCount ? `🎬 Slaydlar: ${state.slidesCount} ta` : ''}
${state.format ? `🎨 Format: ${state.format === 'handwriting' ? 'Qo\'lyozma daftar' : 'Standart Times New Roman (PDF)'}` : ''}
💰 Narx: ${price.toLocaleString('uz-UZ')} so'm
━━━━━━━━━━━━━━━━━
Sizning balansingiz: 💰 ${userBalance.toLocaleString('uz-UZ')} so'm`;

    const canAfford = userBalance >= price;

    if (canAfford) {
      addBotMessage(summary, [
        {
          text: `✅ Tasdiqlash va to'lash (${price.toLocaleString('uz-UZ')} so'm)`,
          action: () => executeOrder(state, price),
          style: 'success',
          fullWidth: true
        },
        { text: '❌ Bekor qilish', action: () => showMainMenu(), style: 'danger', fullWidth: true }
      ]);
    } else {
      const needed = price - userBalance;
      addBotMessage(
        `${summary}\n\n❌ Balansingiz yetarli emas! Yetishmayotgan summa: ${needed.toLocaleString('uz-UZ')} so'm.\nIltimos, avval balansni to'ldiring.`,
        [
          { text: '💰 Balansni to\'ldirish', action: onOpenTopUp, style: 'success', fullWidth: true },
          { text: '❌ Bekor qilish', action: () => showMainMenu(), style: 'danger', fullWidth: true }
        ]
      );
    }
  };

  const executeOrder = (state: typeof wizardState, price: number) => {
    if (userBalance < price) {
      addBotMessage(
        `❌ Balansingizda mablag' yetarli emas!\n\nXizmat narxi: ${price.toLocaleString('uz-UZ')} so'm\nSizning balansingiz: ${userBalance.toLocaleString('uz-UZ')} so'm.\n\nIltimos, avval hisobingizni to'ldiring va chekni yuboring. To'lov tasdiqlanishi bilan xizmat darhol amalga oshiriladi.`,
        [
          { text: '💰 Balansni to\'ldirish', action: onOpenTopUp, style: 'success', fullWidth: true },
          { text: '❌ Bekor qilish', action: () => showMainMenu(), style: 'danger', fullWidth: true }
        ]
      );
      return;
    }

    addUserMessage('✅ Tasdiqlash va to\'lash');

    addBotMessage('🔄 Generatsiya jarayoni yuklanmoqda, iltimos kuting...\n(Amaldagi O\'zbekiston qonunlari va rasmiy akademik talablar asosida tayyorlanmoqda)');

    setTimeout(() => {
      const discipline = DISCIPLINES.find(d => d.id === state.disciplineId) || DISCIPLINES[0];
      const author = state.authorDetails || { fullName: userName, university: 'OTM' };

      let doc = undefined;
      let pres = undefined;

      if (state.serviceType === 'prezentatsiya') {
        pres = generateAcademicPresentation({
          serviceType: 'prezentatsiya',
          topic: state.topic || 'Mavzu',
          disciplineId: discipline.id,
          author,
          language: state.language || 'uz',
          slidesCount: state.slidesCount || 12,
          presentationThemeId: state.presentationThemeId || 'tech_dark_blue'
        });
      } else {
        doc = generateAcademicDocument({
          serviceType: state.serviceType || 'referat',
          topic: state.topic || 'Mavzu',
          disciplineId: discipline.id,
          author,
          language: state.language || 'uz',
          format: state.format || 'times_new_roman',
          pages: state.pages || 10,
          chaptersCount: state.chaptersCount || 2
        });
      }

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        serviceType: state.serviceType || 'referat',
        topic: state.topic || 'Mavzu',
        disciplineId: discipline.id,
        disciplineName: discipline.nameUz,
        language: state.language || 'uz',
        price,
        createdAt: new Date().toISOString(),
        status: 'completed',
        author,
        pages: state.pages,
        chaptersCount: state.chaptersCount,
        format: state.format,
        presentationThemeId: state.presentationThemeId,
        slidesCount: state.slidesCount,
        document: doc,
        presentation: pres
      };

      onOrderCreated(newOrder, price);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      const successText = `🎉 TAYYOR!\n"${state.topic}" bo'yicha ilmiy ish muvaffaqiyatli tayyorlandi!\n\n🏛️ Keltirilgan manbalar: 5+ ta haqiqiy qonun va darsliklar\n📄 Format: Rasmiy akademik talablarga to'liq mos\n\nQuyidagi tugmalar orqali ko'rishingiz yoki yuklab olishingiz mumkin:`;

      const actionButtons = [
        {
          text: pres ? '🎬 Slaydlarni Ko\'rish (Interaktiv)' : '📄 Hujjatni Ko\'rish',
          action: () => onViewOrder(newOrder),
          style: 'primary' as const,
          fullWidth: true
        },
        {
          text: pres ? '📥 PPTX / PDF Slaydlarni Yuklash' : '📥 Rasmiy PDF Faylni Yuklab Olish',
          action: () => {
            if (pres) exportPresentationToSlidesPdf(pres);
            else if (doc) exportDocumentToPdf(doc);
          },
          style: 'success' as const,
          fullWidth: true
        },
        {
          text: '⭐ 5 baho berish & Yangi buyurtma',
          action: () => showMainMenu(),
          style: 'secondary' as const,
          fullWidth: true
        }
      ];

      addBotMessage(successText, actionButtons, newOrder);
    }, 1800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    if (wizardState.step === 'topic') {
      handleTopicSubmitted(text);
    } else if (wizardState.step === 'author') {
      handleAuthorSubmitted({
        fullName: text,
        university: 'OTM',
        faculty: 'Kafedra',
        course: '1'
      });
    } else {
      addUserMessage(text);
      const lower = text.toLowerCase();

      if (lower === '/admin' || lower.includes('@yurist_617') || lower === 'admin') {
        if (isAdmin) {
          addBotMessage(`🛡️ Xush kelibsiz, Administrator @Yurist_617!\nTelegram Bot: 8766646881:AAH... faol holatda.\nAdmin panelga o'tish uchun quyidagi tugmani bosing:`, [
            { text: '🛡️ Admin Panelni Ochish', action: onOpenAdmin, style: 'success', fullWidth: true }
          ]);
        } else {
          addBotMessage(`🔐 ADMIN IDENTIFIKATSIYASI (@Yurist_617)\nUshbu panel faqat bot boshqaruvchisi (@Yurist_617) uchun mo'ljallangan va oddiy foydalanuvchilarga ko'rinmaydi.\n\nSiz haqiqatan ham @Yurist_617 misiz?`, [
            { text: '✅ Ha, @Yurist_617 sifatida kirish', action: () => { onAuthenticateAdmin(); onOpenAdmin(); }, style: 'primary', fullWidth: true },
            { text: '❌ Bekor qilish', action: () => showMainMenu(), style: 'secondary', fullWidth: true }
          ]);
        }
      } else if (lower.includes('balans')) {
        onOpenTopUp();
      } else if (lower.includes('mini') || lower.includes('app')) {
        onOpenMiniApp();
      } else {
        addBotMessage(`Buyruq qabul qilindi. Bosh menyuga qaytish uchun tugmani bosing:`, [
          { text: '🎓 Bosh menyuni ko\'rish', action: () => showMainMenu(), style: 'primary' }
        ]);
      }
    }
  };

  return (
    <div className="flex flex-col h-[750px] max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Telegram Chat Header */}
      <div className="px-5 py-3.5 bg-slate-900/95 border-b border-slate-800/80 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-950/60 ring-2 ring-indigo-500/30">
              🎓
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-sm sm:text-base">Talaba Slide Bot</h3>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-1.5 py-0.2 rounded">BOT</span>
            </div>
            <p className="text-xs text-slate-400">
              {isTyping ? <span className="text-indigo-400 font-medium animate-pulse">yozmoqda...</span> : 'onlayn • 35 ta ta\'lim yo\'nalishi'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Balance indicator */}
          <button
            onClick={onOpenTopUp}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-900/40 transition shadow-sm"
          >
            <span>💰 {userBalance.toLocaleString('uz-UZ')} so'm</span>
          </button>

          {/* Shortcut to Mini App */}
          <button
            onClick={onOpenMiniApp}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-900/30 transition"
            title="Telegram Mini App ko'rinishi"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mini App</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90">
        
        {/* Xavfsizlik eslatmasi */}
        <div className="flex justify-center">
          <div className="px-3.5 py-1 rounded-full bg-slate-800/70 border border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xabarlar shifrlangan • Ma'lumotlar 30 kunda avtomatik o'chiriladi</span>
          </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm shadow-md transition-all ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none'
                  : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/70'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

              {/* Inline Buttons (Telegram bot uslubida) */}
              {msg.inlineButtons && msg.inlineButtons.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-slate-700/70 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {msg.inlineButtons.map((btn, bIdx) => (
                    <button
                      key={bIdx}
                      onClick={btn.action}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-1.5 shadow-sm ${
                        btn.fullWidth ? 'sm:col-span-2' : ''
                      } ${
                        btn.style === 'primary'
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          : btn.style === 'success'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : btn.style === 'danger'
                          ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50'
                          : 'bg-slate-700/80 hover:bg-slate-750 text-slate-200 border border-slate-600/50 hover:text-white'
                      }`}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`mt-1.5 text-[10px] text-right ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-2xl rounded-bl-none w-24 border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Persistent Shortcut Bar */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => showMainMenu()}
          className="flex items-center gap-1 hover:text-white transition font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Bosh menyu
        </button>
        <button
          onClick={onOpenTopUp}
          className="flex items-center gap-1 hover:text-emerald-400 transition font-medium"
        >
          💰 Balans to'ldirish
        </button>
        <button
          onClick={onOpenMiniApp}
          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          📱 Mini App ga o'tish →
        </button>
      </div>

      {/* Message Input Field */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            wizardState.step === 'topic'
              ? 'Ilmiy ish mavzusini kiriting...'
              : wizardState.step === 'author'
              ? 'Muallif ma\'lumotlarini kiriting...'
              : 'Xabar yozing...'
          }
          className="flex-1 bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition shadow-md shadow-indigo-950"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
