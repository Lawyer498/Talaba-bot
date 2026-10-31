import { Discipline, ServiceConfig, PresentationTheme } from '../types';

export const DISCIPLINES: Discipline[] = [
  // Iqtisodiyot va Moliya (9 ta)
  {
    id: 'iqtisodiyot',
    nameUz: 'Iqtisodiyot',
    nameRu: 'Экономика',
    nameEn: 'Economics',
    nameKaa: 'Ekonomika',
    category: 'Iqtisodiyot va Moliya',
    keyLaws: [
      'O\'zbekiston Respublikasi Soliq Kodeksi (yangi tahrir, 2024)',
      'O\'zbekiston Respublikasi Prezidentining PF-60-sonli "Taraqqiyot strategiyasi" Farmoni',
      'O\'zbekiston Respublikasining "Raqobat to\'g\'risida"gi Qonuni (O\'RQ-850)'
    ],
    keyAuthors: [
      'Vaxabov A.V., Razzoqov A. - "Iqtisodiyot nazariyasi", Toshkent, 2023',
      'Mankiw N.G. - "Macroeconomics", 11th edition, 2022',
      'G\'ulomov S.S. - "Raqamli iqtisodiyot asoslari", Toshkent, 2024'
    ]
  },
  {
    id: 'buxgalteriya',
    nameUz: 'Buxgalteriya hisobi va audit',
    nameRu: 'Бухгалтерский учет и аудит',
    nameEn: 'Accounting & Auditing',
    nameKaa: 'Buxgalteriya esabi hám audit',
    category: 'Iqtisodiyot va Moliya',
    keyLaws: [
      'O\'zbekiston Respublikasining "Buxgalteriya hisobi to\'g\'risida"gi Qonuni',
      'MHXS (IFRS) xalqaro moliyaviy hisobot standartlari',
      'O\'zbekiston Respublikasi "Auditorlik faoliyati to\'g\'risida"gi Qonuni (O\'RQ-677)'
    ],
    keyAuthors: [
      'Dusmuratov R.D. - "Audit asoslari", Toshkent, 2023',
      'Urazov K.B. - "Buxgalteriya hisobi nazariyasi", Fan va texnologiya, 2022',
      'Kieso D.E., Weygandt J.J. - "Intermediate Accounting", Wiley, 2022'
    ]
  },
  {
    id: 'moliya',
    nameUz: 'Moliya va moliyaviy texnologiyalar (FinTech)',
    nameRu: 'Финансы и финансовые технологии',
    nameEn: 'Finance and FinTech',
    nameKaa: 'Finans hám finanslıq texnologiyalar',
    category: 'Iqtisodiyot va Moliya',
    keyLaws: [
      'O\'zbekiston Respublikasining "To\'lovlar va to\'lov tizimlari to\'g\'risida"gi Qonuni',
      'O\'zbekiston Respublikasi Byudjet Kodeksi',
      'O\'zbekiston Respublikasining "Kripto-aktivlar aylanmasi sohasini rivojlantirish to\'g\'risida"gi Qarorlari'
    ],
    keyAuthors: [
      'Malikov T.S., Olimjonov O. - "Moliya", Iqtisod-Moliya, 2023',
      'Bodie Z., Kane A., Marcus A. - "Investments", McGraw Hill, 2023',
      'Xidirov M. - "Zamonaviy bank va FinTech texnologiyalari", 2024'
    ]
  },
  {
    id: 'bank_ishi',
    nameUz: 'Bank ishi va auditi',
    nameRu: 'Банковское дело и аудит',
    nameEn: 'Banking and Auditing',
    nameKaa: 'Bank isi hám auditi',
    category: 'Iqtisodiyot va Moliya',
    keyLaws: [
      'O\'zbekiston Respublikasi "Markaziy bank to\'g\'risida"gi Qonuni',
      'O\'zbekiston Respublikasi "Banklar va bank faoliyati to\'g\'risida"gi Qonuni (O\'RQ-580)',
      'Bazel III xalqaro bank nazorati standartlari'
    ],
    keyAuthors: [
      'Abdullaeva Sh.Z. - "Bank ishi", Toshkent, 2022',
      'Mishkin F.S. - "The Economics of Money, Banking and Financial Markets", 2023',
      'Toymurodov E. - "Tijorat banklarida risk-menejment", 2024'
    ]
  },
  {
    id: 'menejment',
    nameUz: 'Menejment',
    nameRu: 'Менеджмент',
    nameEn: 'Management',
    nameKaa: 'Menejment',
    category: 'Iqtisodiyot va Moliya',
    keyLaws: [
      'O\'zbekiston Respublikasi Mehnat Kodeksi (yangi tahrir, 2023)',
      'O\'zbekiston Respublikasining "Aksiyadorlik jamiyatlari va aksiyadorlarning huquqlarini himoya qilish to\'g\'risida"gi Qonuni',
      'ISO 9001:2015 Sifat menejmenti tizimlari'
    ],
    keyAuthors: [
      'Sharifxo\'jayev M., Abdullayev Yo. - "Menejment", Toshkent, 2022',
      'Drucker P.F. - "The Effective Executive", HarperBusiness',
      'Robbins S.P., Coulter M. - "Management", Pearson, 2022'
    ]
  },
  {
    id: 'marketing',
    nameUz: 'Marketing',
    nameRu: 'Маркетинг',
    nameEn: 'Marketing',
    nameKaa: 'Marketing',
    category: 'Iqtisodiyot va Moliya',
    keyLaws: [
      'O\'zbekiston Respublikasining "Reklama to\'g\'risida"gi Qonuni (yangi tahrir, 2022)',
      'O\'zbekiston Respublikasining "Iste\'molchilarning huquqlarini himoya qilish to\'g\'risida"gi Qonuni',
      'O\'zbekiston Respublikasining "Elektron tijorat to\'g\'risida"gi Qonuni (O\'RQ-792)'
    ],
    keyAuthors: [
      'Kotler P., Armstrong G. - "Principles of Marketing", 19th ed., Pearson, 2023',
      'Yusupov M. - "Raqamli marketing va SMM strategiyalari", Toshkent, 2024',
      'Ergashxodjayeva Sh.J. - "Marketing", Toshkent, 2023'
    ]
  },
  {
    id: 'xim',
    nameUz: 'Xalqaro iqtisodiy munosabatlar',
    nameRu: 'Международные экономические отношения',
    nameEn: 'International Economic Relations',
    nameKaa: 'Xalıqaralıq ekonomikalıq qatnasıqlar',
    category: 'Iqtisodiyot va Moliya',
    keyLaws: [
      'O\'zbekiston Respublikasi Bojxona Kodeksi',
      'O\'zbekistonning Butunjahon Savdo Tashkiloti (JST/WTO)ga kirish strategiyasi',
      'Incoterms 2020 xalqaro savdo qoidalari'
    ],
    keyAuthors: [
      'Krugman P.R., Obstfeld M. - "International Economics: Theory and Policy", 2022',
      'Vaxabov A.V., Xajibakiyev Sh. - "Xalqaro iqtisodiy munosabatlar", 2023',
      'Rasulov T. - "Tashqi iqtisodiy faoliyatni tartibga solish", Toshkent, 2024'
    ]
  },
  {
    id: 'mba',
    nameUz: 'Biznesni boshqarish (MBA)',
    nameRu: 'Управление бизнесом (MBA)',
    nameEn: 'Business Administration (MBA)',
    nameKaa: 'Biznesti basqarıw (MBA)',
    category: 'Iqtisodiyot va Moliya',
    keyLaws: [
      'O\'zbekiston Respublikasining "Tadbirkorlik faoliyati erkinligining kafolatlari to\'g\'risida"gi Qonuni',
      'Prezidentning "Kichik va o\'rta biznesni moliyaviy qo\'llab-quvvatlash to\'g\'risida"gi Qarorlari',
      'O\'zbekiston Respublikasining Investitsiya Kodeksi loyihasi'
    ],
    keyAuthors: [
      'Porter M.E. - "Competitive Strategy: Techniques for Analyzing Industries", Free Press',
      'Christensen C.M. - "The Innovator\'s Dilemma", Harvard Business Review',
      'Qosimov S. - "Startap va venture investitsiyalar amaliyoti", Toshkent, 2024'
    ]
  },
  {
    id: 'logistika',
    nameUz: 'Logistika va ta\'minot zanjiri',
    nameRu: 'Логистика и цепи поставок',
    nameEn: 'Logistics and Supply Chain Management',
    nameKaa: 'Logistika hám támiyinlew shınjırı',
    category: 'Iqtisodiyot va Moliya',
    keyLaws: [
      'O\'zbekiston Respublikasining "Transport to\'g\'risida"gi Qonuni (O\'RQ-695)',
      'CMR va TIR xalqaro yuk tashish konvensiyalari',
      'Xalqaro multimodal transport koridorlari to\'g\'risidagi bitimlar'
    ],
    keyAuthors: [
      'Christopher M. - "Logistics & Supply Chain Management", 6th edition, 2022',
      'G\'ulomov S., Qodirov A. - "Transport logistikasi", Toshkent, 2023',
      'Bowersox D.J. - "Supply Chain Logistics Management", McGraw-Hill'
    ]
  },

  // Huquqshunoslik va Siyosat (5 ta)
  {
    id: 'huquq',
    nameUz: 'Huquqshunoslik (Davlat, Jinoyat, Fuqarolik huquqi)',
    nameRu: 'Юриспруденция',
    nameEn: 'Law & Jurisprudence',
    nameKaa: 'Huqıqtanıw',
    category: 'Huquqshunoslik va Siyosat',
    keyLaws: [
      'O\'zbekiston Respublikasining yangi tahrirdagi Konstitutsiyasi (2023)',
      'O\'zbekiston Respublikasi Fuqarolik Kodeksi va Fuqarolik-protsessual kodeksi',
      'O\'zbekiston Respublikasi Jinoyat Kodeksi va Jinoyat-protsessual kodeksi'
    ],
    keyAuthors: [
      'Saidov A.X. - "Qiyosiy huquqshunoslik", Adolat, 2023',
      'Oqyulov O. - "Fuqarolik huquqi muammolari", Toshkent, 2022',
      'Rustambayev M.X. - "O\'zbekiston Respublikasi Jinoyat huquqi kursi", 2023'
    ]
  },
  {
    id: 'xalqaro_huquq',
    nameUz: 'Xalqaro huquq',
    nameRu: 'Международное право',
    nameEn: 'International Law',
    nameKaa: 'Xalıqaralıq huqıq',
    category: 'Huquqshunoslik va Siyosat',
    keyLaws: [
      'BMT Nizomi (UN Charter) va Xalqaro Sud Statuti',
      '1969-yilgi Xalqaro Shartnomalar Huquqi to\'g\'risidagi Vena Konvensiyasi',
      'Inson huquqlari umumjahon deklaratsiyasi'
    ],
    keyAuthors: [
      'Brownlie I., Crawford J. - "Principles of Public International Law", Oxford, 2022',
      'Hakimov F. - "Zamonaviy xalqaro gumanitar huquq", Toshkent, 2023',
      'Shaw M.N. - "International Law", Cambridge University Press'
    ]
  },
  {
    id: 'xalqaro_munosabatlar',
    nameUz: 'Xalqaro munosabatlar',
    nameRu: 'Международные отношения',
    nameEn: 'International Relations',
    nameKaa: 'Xalıqaralıq qatnasıqlar',
    category: 'Huquqshunoslik va Siyosat',
    keyLaws: [
      'O\'zbekiston Respublikasining Tashqi siyosiy faoliyat konsepsiyasi',
      'Shanxay Hamkorlik Tashkiloti (SHHT) va MDH ustav hujjatlari',
      'Markaziy Osiyoda yaxshi qo\'shnichilik va integratsiya to\'g\'risidagi rezolyutsiyalar'
    ],
    keyAuthors: [
      'Kissinger H. - "World Order", Penguin Books',
      'Morgenthau H.J. - "Politics Among Nations: The Struggle for Power and Peace"',
      'Ziyodullayev N. - "Markaziy Osiyo geosiyosati", Toshkent, 2023'
    ]
  },
  {
    id: 'siyosatshunoslik',
    nameUz: 'Siyosatshunoslik',
    nameRu: 'Политология',
    nameEn: 'Political Science',
    nameKaa: 'Politologiya',
    category: 'Huquqshunoslik va Siyosat',
    keyLaws: [
      'O\'zbekiston Respublikasining "Siyosiy partiyalar to\'g\'risida"gi Qonuni',
      'O\'zbekiston Respublikasi Saylov Kodeksi',
      'Prezident Shavkat Mirziyoyev asarlari ("Yangi O\'zbekiston strategiyasi")'
    ],
    keyAuthors: [
      'Heywood A. - "Politics", 5th edition, Bloomsbury Academic',
      'Jo\'rayev N. - "Siyosatshunoslik asoslari", Toshkent, 2023',
      'Fukuyama F. - "The Origins of Political Order", Profile Books'
    ]
  },
  {
    id: 'davlat_boshqaruvi',
    nameUz: 'Davlat va jamiyat boshqaruvi',
    nameRu: 'Государственное и общественное управление',
    nameEn: 'Public Administration & Governance',
    nameKaa: 'Mámleketlik hám jámiyetlik basqarıw',
    category: 'Huquqshunoslik va Siyosat',
    keyLaws: [
      'O\'zbekiston Respublikasining "Davlat fuqarolik xizmati to\'g\'risida"gi Qonuni (O\'RQ-788)',
      'O\'zbekiston Respublikasining "Jamoatchilik nazorati to\'g\'risida"gi Qonuni',
      'O\'zbekiston Respublikasi Ma\'muriy tartib-taomillar to\'g\'risidagi Qonun'
    ],
    keyAuthors: [
      'Alimov A.A. - "Davlat xizmati va kadrlar menejmenti", DBA nashriyoti, 2023',
      'Rosenbloom D.H. - "Public Administration: Understanding Management, Politics, and Law"',
      'Muxtorov A. - "Elektron hukumat va ma\'muriy islohotlar", 2024'
    ]
  },

  // Pedagogika va Gumanitar fanlar (8 ta)
  {
    id: 'maktabgacha_talim',
    nameUz: 'Maktabgacha ta\'lim',
    nameRu: 'Дошкольное образование',
    nameEn: 'Early Childhood Education',
    nameKaa: 'Mektepke shekemgi tálim',
    category: 'Pedagogika va Gumanitar',
    keyLaws: [
      'O\'zbekiston Respublikasining "Maktabgacha ta\'lim va tarbiya to\'g\'risida"gi Qonuni',
      '"Ilk qadam" davlat o\'quv dasturi (takomillashtirilgan tahrir)',
      'O\'zbekiston Respublikasi Maktabgacha ta\'lim tizimini rivojlantirish konsepsiyasi'
    ],
    keyAuthors: [
      'Montessori M. - "The Absorbent Mind", Montessori-Pierson Publishing',
      'Shin A., Grosheva I. - "Bolalarni erta rivojlantirish metodikasi", Toshkent, 2023',
      'Vygotsky L.S. - "Mind in Society: The Development of Higher Psychological Processes"'
    ]
  },
  {
    id: 'boshlangich_talim',
    nameUz: 'Boshlang\'ich ta\'lim metodikasi',
    nameRu: 'Методика начального образования',
    nameEn: 'Primary Education Methodology',
    nameKaa: 'Baslawısh tálim metodikası',
    category: 'Pedagogika va Gumanitar',
    keyLaws: [
      'O\'zbekiston Respublikasining "Ta\'lim to\'g\'risida"gi Qonuni (yangi tahrir)',
      'Umumiy o\'rta ta\'limning Milliy o\'quv dasturi (2023-2026)',
      'PIRLS va TIMSS xalqaro baholash dasturlari talablari'
    ],
    keyAuthors: [
      'Matchonov S. - "Boshlang\'ich sinflarda ona tili o\'qitish metodikasi", 2023',
      'G\'oziyev E. - "Tafakkur psixologiyasi", O\'qituvchi',
      'Piaget J. - "The Child\'s Conception of the World", Routledge'
    ]
  },
  {
    id: 'ona_tili_adabiyot',
    nameUz: 'Ona tili va adabiyoti (O\'zbek, Rus, Qoraqalpoq)',
    nameRu: 'Родной язык и литература',
    nameEn: 'Native Language and Literature',
    nameKaa: 'Ana tili hám ádebiyatı',
    category: 'Pedagogika va Gumanitar',
    keyLaws: [
      'O\'zbekiston Respublikasining "Davlat tili haqida"gi Qonuni',
      'O\'zbek tilini rivojlantirish va til siyosatini takomillashtirish konsepsiyasi',
      'Qoraqalpog\'iston Respublikasi "Davlat tili to\'g\'risida"gi Qonuni'
    ],
    keyAuthors: [
      'Navoiy Alisher - "Muhokamat ul-lug\'atayn", Xazoyinul maoniy',
      'Sayfullayeva R., Mengliyev B. - "Hozirgi o\'zbek adabiy tili", Toshkent, 2023',
      'Dovletov A., Allambergenova K. - "Qaraqalpaq tili stilistikası", Nókis, 2022'
    ]
  },
  {
    id: 'tarix',
    nameUz: 'Tarix (O\'zbekiston tarixi va Jahon tarixi)',
    nameRu: 'История',
    nameEn: 'History',
    nameKaa: 'Tariyx',
    category: 'Pedagogika va Gumanitar',
    keyLaws: [
      'O\'zbekiston Respublikasi Prezidentining "Tarixiy xotirani tiklash va tarix fanini rivojlantirish to\'g\'risida"gi Qarori',
      'O\'zbekiston Milliy Arxiv fondi to\'g\'risidagi Qonunchilik',
      'Jadidlar merosini chuqur o\'rganish va targ\'ib qilish davlat dasturi'
    ],
    keyAuthors: [
      'Ziyo Azamat - "O\'zbek davlatchiligi tarixi", Toshkent, 2023',
      'Usmonov Q., Sodiqov M. - "O\'zbekiston tarixi", Sharq, 2022',
      'Toynbee A. - "A Study of History", Oxford University Press'
    ]
  },
  {
    id: 'ingliz_filologiyasi',
    nameUz: 'Ingliz tili filologiyasi va tarjimashunoslik',
    nameRu: 'Английская филология и переводоведение',
    nameEn: 'English Philology and Translation Studies',
    nameKaa: 'Inglis tili filologiyası hám awdarmashılıq',
    category: 'Pedagogika va Gumanitar',
    keyLaws: [
      'Prezidentning "Xorijiy tillarni o\'rganishni ommalashtirish to\'g\'risida"gi PQ-5117-son Qarori',
      'CEFR (Common European Framework of Reference) standartlari',
      'Xalqaro Tarjimonlar Federatsiyasi (FIT) etik qoidalari'
    ],
    keyAuthors: [
      'Baker M. - "In Other Words: A Coursebook on Translation", Routledge, 2022',
      'Salomov G\'. - "Tarjima nazariyasi asoslari", Fan, Toshkent',
      'Yule G. - "The Study of Language", Cambridge University Press, 2023'
    ]
  },
  {
    id: 'xorijiy_tillar',
    nameUz: 'Xorijiy tillar (Nemis, Fransuz, Xitoy, Koreys)',
    nameRu: 'Иностранные языки (Немецкий, Французский, Китайский, Корейский)',
    nameEn: 'Foreign Languages (German, French, Chinese, Korean)',
    nameKaa: 'Shet tilleri (Nemis, Francuz, Qıtay, Koreys)',
    category: 'Pedagogika va Gumanitar',
    keyLaws: [
      'O\'zbekiston Respublikasining xorijiy tillarni o\'qitish bo\'yicha davlat ta\'lim standartlari',
      'HSK, Goethe-Zertifikat, DELF/DALF va TOPIK xalqaro sertifikatlash mezonlari'
    ],
    keyAuthors: [
      'Helbig G., Buscha J. - "Deutsche Grammatik: Ein Handbuch für den Ausländerunterricht"',
      'Chomsky N. - "Aspects of the Theory of Syntax", MIT Press',
      'Karimov I., Li S. - "Sharq tillari qiyosiy grammatikasi", Toshkent, 2023'
    ]
  },
  {
    id: 'psixologiya',
    nameUz: 'Amaliy psixologiya',
    nameRu: 'Практическая психология',
    nameEn: 'Applied Psychology',
    nameKaa: 'Ámeliy psixologiya',
    category: 'Pedagogika va Gumanitar',
    keyLaws: [
      'O\'zbekiston Respublikasining "Psixologik yordam ko\'rsatish to\'g\'risida"gi Qonuni (O\'RQ-910)',
      'Oliy va o\'rta ta\'lim muassasalarida psixologik xizmat to\'g\'risidagi Nizom',
      'Xalqaro Psixologlar Assotsiatsiyasi (APA) etik kodeksi'
    ],
    keyAuthors: [
      'Karimova V.M. - "Ijtimoiy psixologiya", Toshkent, 2023',
      'Kahneman D. - "Thinking, Fast and Slow", Farrar, Straus and Giroux',
      'G\'oziyev E.G\'. - "Umumiy psixologiya", Universitet nashriyoti, 2022'
    ]
  },
  {
    id: 'sport',
    nameUz: 'Jismoniy madaniyat va sport',
    nameRu: 'Физическая культура и спорт',
    nameEn: 'Physical Education and Sports Science',
    nameKaa: 'Dene mádeniyatı hám sport',
    category: 'Pedagogika va Gumanitar',
    keyLaws: [
      'O\'zbekiston Respublikasining "Jismoniy tarbiya va sport to\'g\'risida"gi Qonuni',
      'O\'zbekiston Respublikasida jismoniy tarbiya va sportni 2025-yilgacha rivojlantirish Konsepsiyasi',
      'Xalqaro Olimpiya Qo\'mitasi va WADA antidoping qoidalari'
    ],
    keyAuthors: [
      'Kerimov F.A. - "Sport kurashi nazariyasi va usuliyoti", Toshkent, 2022',
      'Matveyev L.P. - "Teoriya i metodika fizicheskoy kultury", Moskva',
      'Yunusov T. - "Sport fiziologiyasi va biomexanika", Toshkent, 2023'
    ]
  },

  // IT va Aniq fanlar (5 ta)
  {
    id: 'software_engineering',
    nameUz: 'Dasturiy injiniring (Software Engineering)',
    nameRu: 'Программная инженерия',
    nameEn: 'Software Engineering',
    nameKaa: 'Programmalıq injiniring',
    category: 'IT va Aniq fanlar',
    keyLaws: [
      'O\'zbekiston Respublikasining "Mualliflik huquqi va turdosh huquqlar to\'g\'risida"gi Qonuni (EHM dasturlari)',
      'IT Park rezidentlari uchun soliq imtiyozlari to\'g\'risidagi Prezident Farmonlari',
      'IEEE/ACM Software Engineering Body of Knowledge (SWEBOK v3.0)'
    ],
    keyAuthors: [
      'Sommerville I. - "Software Engineering", 10th edition, Pearson, 2022',
      'Martin R.C. - "Clean Architecture: A Craftsman\'s Guide to Software Structure", Prentice Hall',
      'Zokirov A. - "Bulutli hisoblash va mikroservislar arxitekturasi", Toshkent, 2024'
    ]
  },
  {
    id: 'computer_engineering',
    nameUz: 'Kompyuter injiniringi va tarmoqlar',
    nameRu: 'Компьютерная инженерия',
    nameEn: 'Computer Engineering & Networking',
    nameKaa: 'Kompyuter injiniringi',
    category: 'IT va Aniq fanlar',
    keyLaws: [
      'O\'zbekiston Respublikasining "Aloqa to\'g\'risida"gi Qonuni',
      'Telekommunikatsiya tarmoqlarining xavfsizligi davlat standartlari (O\'zDSt)',
      'OSI va TCP/IP xalqaro protokollari spetsifikatsiyalari'
    ],
    keyAuthors: [
      'Tanenbaum A.S., Wetherall D.J. - "Computer Networks", 6th edition, Pearson, 2022',
      'Patterson D.A., Hennessy J.L. - "Computer Organization and Design", Morgan Kaufmann',
      'Aripov M.M. - "Axborot-kommunikatsiya texnologiyalari va tizimlari", 2023'
    ]
  },
  {
    id: 'cybersecurity',
    nameUz: 'Axborot xavfsizligi va kiberxavfsizlik',
    nameRu: 'Информационная безопасность и кибербезопасность',
    nameEn: 'Cybersecurity and Information Security',
    nameKaa: 'Informaciyalıq qáwipsizlik hám kiberqáwipsizlik',
    category: 'IT va Aniq fanlar',
    keyLaws: [
      'O\'zbekiston Respublikasining "Kiberxavfsizlik to\'g\'risida"gi Qonuni (O\'RQ-764)',
      'O\'zbekiston Respublikasining "Shaxsga doir ma\'lumotlar to\'g\'risida"gi Qonuni (O\'RQ-547)',
      'ISO/IEC 27001:2022 Axborot xavfsizligi menejmenti tizimlari'
    ],
    keyAuthors: [
      'Stallings W. - "Cryptography and Network Security: Principles and Practice", 8th ed., 2022',
      'G\'aniyev S.K. - "Axborot xavfsizligi asoslari", Fan va texnologiya, 2023',
      'Mitnick K. - "The Art of Invisibility", Little, Brown and Company'
    ]
  },
  {
    id: 'ai_datascience',
    nameUz: 'Sun\'iy intellekt va ma\'lumotlar ilmi (AI & Data Science)',
    nameRu: 'Искусственный интеллект и наука о данных',
    nameEn: 'Artificial Intelligence and Data Science',
    nameKaa: 'Jasama intellekt hám maǵlıwmatlar ilimi',
    category: 'IT va Aniq fanlar',
    keyLaws: [
      'O\'zbekiston Respublikasida Sun\'iy intellekt texnologiyalarini joriy etish strategiyasi (PQ-4996)',
      'Yevropa Ittifoqining Sun\'iy intellekt akti (EU AI Act, 2024)',
      'Sun\'iy intellekt etikasi bo\'yicha YUNESKO tavsiyanomalari'
    ],
    keyAuthors: [
      'Russell S., Norvig P. - "Artificial Intelligence: A Modern Approach", 4th ed., Pearson, 2022',
      'Goodfellow I., Bengio Y., Courville A. - "Deep Learning", MIT Press',
      'Qodirov R. - "Katta hajmli ma\'lumotlar tahlili va mashinaviy o\'rganish", Toshkent, 2024'
    ]
  },
  {
    id: 'matematika_informatika',
    nameUz: 'Amaliy matematika va informatika',
    nameRu: 'Прикладная математика и информатика',
    nameEn: 'Applied Mathematics and Computer Science',
    nameKaa: 'Ámeliy matematika hám informatika',
    category: 'IT va Aniq fanlar',
    keyLaws: [
      'O\'zbekiston Respublikasida Matematika ta\'limi va fanlarini rivojlantirish konsepsiyasi',
      'V.I.Romanovskiy nomidagi Matematika instituti ilmiy tadqiqot standartlari'
    ],
    keyAuthors: [
      'Sadullayev A., Mansurov X. - "Matematik analiz", Toshkent, O\'zbekiston nashriyoti, 2022',
      'Strang G. - "Introduction to Linear Algebra", Wellesley-Cambridge Press, 2023',
      'Boyarchuk A.K. - "Differensial tenglamalar va modellashtirish", 2023'
    ]
  },

  // Tibbiyot va Tabiiy fanlar (5 ta)
  {
    id: 'davolash_ishi',
    nameUz: 'Davolash ishi (Umumiy tibbiyot)',
    nameRu: 'Лечебное дело',
    nameEn: 'General Medicine',
    nameKaa: 'Emlew isi',
    category: 'Tibbiyot va Tabiiy',
    keyLaws: [
      'O\'zbekiston Respublikasining "Fuqarolar sog\'lig\'ini saqlash to\'g\'risida"gi Qonuni',
      'Sog\'liqni saqlash vazirligining klinik protokollari va diagnostika standartlari',
      'Jahon Sog\'liqni Saqlash Tashkiloti (JSST/WHO) tavsiyanomalari'
    ],
    keyAuthors: [
      'Jameson J.L., Fauci A.S. - "Harrison\'s Principles of Internal Medicine", 21st ed., McGraw Hill, 2022',
      'Bobojonov S. - "Ichki kasalliklar propedevtikasi", Toshkent, 2023',
      'Guyton A.C., Hall J.E. - "Textbook of Medical Physiology", Elsevier'
    ]
  },
  {
    id: 'pediatriya',
    nameUz: 'Pediatriya ishi',
    nameRu: 'Педиатрия',
    nameEn: 'Pediatrics',
    nameKaa: 'Pediatriya isi',
    category: 'Tibbiyot va Tabiiy',
    keyLaws: [
      'O\'zbekiston Respublikasining "Bola huquqlarining kafolatlari to\'g\'risida"gi Qonuni',
      'Onalik va bolalikni muhofaza qilish milliy dasturi',
      'JSSTning bolalardagi keng tarqalgan kasalliklarni integratsiyalashgan boshqarish (IMCI) strategiyasi'
    ],
    keyAuthors: [
      'Kliegman R.M. - "Nelson Textbook of Pediatrics", 21st ed., Elsevier, 2022',
      'Daminov T.O. - "Bolalar yuqumli kasalliklari", Toshkent, 2023',
      'Ahmedova D.I. - "Bolalar gomeostazi va reanimatsiyasi", 2022'
    ]
  },
  {
    id: 'stomatologiya',
    nameUz: 'Stomatologiya',
    nameRu: 'Стоматология',
    nameEn: 'Dentistry & Stomatology',
    nameKaa: 'Stomatologiya',
    category: 'Tibbiyot va Tabiiy',
    keyLaws: [
      'O\'zbekiston Respublikasi SSV stomatologik yordam sifat standartlari',
      'Sanitariya qoidalari va normalari (SanQvaN) stomatologiya klinikalari uchun',
      'FDI Butunjahon Stomatologlar Federatsiyasi ko\'rsatmalari'
    ],
    keyAuthors: [
      'Rizaev J.A. - "Terapevtik stomatologiya", Toshkent, 2023',
      'Malamed S.F. - "Handbook of Local Anesthesia", Elsevier',
      'Bekjanova O.O. - "Periodontologiya va og\'iz bo\'shlig\'i shilliq qavati kasalliklari", 2022'
    ]
  },
  {
    id: 'farmatsiya',
    nameUz: 'Farmatsiya va farmatsevtik biotexnologiya',
    nameRu: 'Фармация',
    nameEn: 'Pharmacy and Pharmaceutical Biotechnology',
    nameKaa: 'Farmaciya',
    category: 'Tibbiyot va Tabiiy',
    keyLaws: [
      'O\'zbekiston Respublikasining "Dori vositalari va farmatsevtika faoliyati to\'g\'risida"gi Qonuni',
      'O\'zbekiston Respublikasi Davlat Farmakopeyasi (I jild, 2023)',
      'GMP (Good Manufacturing Practice) va GDP (Good Distribution Practice) standartlari'
    ],
    keyAuthors: [
      'Brunton L.L. - "Goodman & Gilman\'s The Pharmacological Basis of Therapeutics", 14th ed., 2023',
      'Urmanova F.F. - "Farmatsevtik kimyo", Toshkent, 2022',
      'To\'laganov A.A. - "Dori shakllari texnologiyasi", Fan, 2023'
    ]
  },
  {
    id: 'biologiya_ekologiya',
    nameUz: 'Biologiya va ekologiya',
    nameRu: 'Биология и экология',
    nameEn: 'Biology and Environmental Ecology',
    nameKaa: 'Biologiya hám ekologiya',
    category: 'Tibbiyot va Tabiiy',
    keyLaws: [
      'O\'zbekiston Respublikasining "Tabiatni muhofaza qilish to\'g\'risida"gi Qonuni',
      'O\'zbekiston Respublikasi Qizil Kitobi (so\'nggi nashr)',
      'Orolbo\'yi mintaqasini ekologik innovatsiyalar va texnologiyalar hududi deb e\'lon qilish to\'g\'risidagi BMT rezolyutsiyasi'
    ],
    keyAuthors: [
      'Campbell N.A., Reece J.B. - "Biology", 12th edition, Pearson, 2022',
      'Tojiboyev K.Sh. - "O\'zbekiston florasi va bioxilma-xilligi", Fan, 2023',
      'Ergashev A.E. - "Umumiy ekologiya", Toshkent, 2022'
    ]
  },

  // Qishloq xo'jaligi va Muhandislik (3 ta)
  {
    id: 'agronomiya',
    nameUz: 'Agronomiya va agrobiotexnologiya',
    nameRu: 'Агрономия и биотехнология',
    nameEn: 'Agronomy and Agrobiotechnology',
    nameKaa: 'Agronomiya hám agrobiotexnologiya',
    category: 'Qishloq xo\'jaligi va Muhandislik',
    keyLaws: [
      'O\'zbekiston Respublikasining "Urug\'chilik to\'g\'risida"gi Qonuni',
      'O\'zbekiston Respublikasi Qishloq xo\'jaligini rivojlantirishning 2020-2030 yillarga mo\'ljallangan strategiyasi',
      'Organik qishloq xo\'jaligi va oziq-ovqat xavfsizligi standartlari'
    ],
    keyAuthors: [
      'Oripov R., Halilov N. - "O\'simlikshunoslik", Toshkent, Mehnat',
      'Gliessman S.R. - "Agroecology: The Ecology of Sustainable Food Systems", CRC Press',
      'Atabaeva X. - "Agrobiotexnologiya va ekinlar hosildorligi", 2023'
    ]
  },
  {
    id: 'veterinariya',
    nameUz: 'Veterinariya tibbiyoti',
    nameRu: 'Ветеринарная медицина',
    nameEn: 'Veterinary Medicine',
    nameKaa: 'Veterinariya medicinası',
    category: 'Qishloq xo\'jaligi va Muhandislik',
    keyLaws: [
      'O\'zbekiston Respublikasining "Veterinariya to\'g\'risida"gi Qonuni (yangi tahrir)',
      'Davlat veterinariya nazorati qoidalari va epizootik xavfsizlik talablari',
      'WOAH (Butunjahon Hayvonlar Sog\'lig\'ini Saqlash Tashkiloti) qoidalari'
    ],
    keyAuthors: [
      'Salimov X.S. - "Epizootologiya va infeksion kasalliklar", Fan, 2022',
      'Blood D.C., Radostits O.M. - "Veterinary Medicine: A textbook of diseases of cattle, horses, sheep, pigs and goats"',
      'Daminov A. - "Veterinariya jarrohligi va akusherligi", Toshkent, 2023'
    ]
  },
  {
    id: 'suv_xojaligi',
    nameUz: 'Suv xo\'jaligi va gidromelioratsiya',
    nameRu: 'Водное хозяйство и мелиорация',
    nameEn: 'Water Management and Hydromelioration',
    nameKaa: 'Suw xojalıǵı hám melioraciya',
    category: 'Qishloq xo\'jaligi va Muhandislik',
    keyLaws: [
      'O\'zbekiston Respublikasining "Suv va suvdan foydalanish to\'g\'risida"gi Qonuni',
      'Prezidentning "Suv resurslarini boshqarish va suv tejovchi texnologiyalarni joriy etish to\'g\'risida"gi Farmonlari',
      'Transchegaraviy suv oqimlari va xalqaro ko\'llarni muhofaza qilish Konvensiyasi'
    ],
    keyAuthors: [
      'Bakiyev M.R. - "Gidrotexnika inshootlari va gidrologiya", Toshkent, 2023',
      'Chertousov M.D. - "Gidravlika kursi", O\'qituvchi nashriyoti',
      'Mirzayev M. - "Tomchilatib va yomg\'irlatib sug\'orish texnologiyalari", 2024'
    ]
  }
];

export const SERVICES: ServiceConfig[] = [
  {
    id: 'referat',
    titleUz: 'Esse / Referat',
    titleRu: 'Эссе / Реферат',
    titleEn: 'Essay / Referat',
    titleKaa: 'Esse / Referat',
    basePrice: 5000,
    maxPrice: 5000,
    estimatedTime: '1-2 minut',
    icon: 'FileText',
    popular: true,
    descriptionUz: 'Kirish, asosiy qism, tahlil, xulosa va haqiqiy adabiyotlar ro\'yxati bilan. Standart PDF yoki Daftar/Qo\'lyozma formatida.'
  },
  {
    id: 'maqola',
    titleUz: 'Ilmiy Maqola',
    titleRu: 'Научная статья',
    titleEn: 'Scientific Article',
    titleKaa: 'Ilimiy Maqala',
    basePrice: 20000,
    maxPrice: 20000,
    estimatedTime: '2-3 minut',
    icon: 'GraduationCap',
    popular: false,
    descriptionUz: 'Annotatsiya (uz/en/ru), kalit so\'zlar, UDK/DOI talablari, IMRAD strukturasi va 5+ ta nufuzli ilmiy manbalar.'
  },
  {
    id: 'kurs_ishi',
    titleUz: 'Kurs ishi',
    titleRu: 'Курсовая работа',
    titleEn: 'Coursework / Term Paper',
    titleKaa: 'Kurs jumısı',
    basePrice: 30000,
    maxPrice: 45000,
    estimatedTime: '3-5 minut',
    icon: 'BookOpen',
    popular: false,
    descriptionUz: 'Rasmiy titul varaq, mundarija, 2 yoki 3 bob, grafiklar, xulosalar va adabiyotlar ro\'yxati bilan to\'liq tayyorlangan ilmiy ish.'
  },
  {
    id: 'prezentatsiya',
    titleUz: 'Prezentatsiya (PPTX)',
    titleRu: 'Презентация (PPTX)',
    titleEn: 'Presentation (PPTX)',
    titleKaa: 'Prezentaciya (PPTX)',
    basePrice: 8000,
    maxPrice: 10000,
    estimatedTime: '1-2 minut',
    icon: 'Presentation',
    popular: true,
    descriptionUz: '10-20 slaydli zamonaviy dizayn, 12 xil fon andozasi, animatsiyali vizual slaydlar va to\'liq PPTX yuklab olish.'
  },
  {
    id: 'mustaqil_ish',
    titleUz: 'Mustaqil ish',
    titleRu: 'Самостоятельная работа',
    titleEn: 'Independent Work',
    titleKaa: 'Ǵárezsiz jumıs',
    basePrice: 3000,
    maxPrice: 12000,
    estimatedTime: '2-3 minut',
    icon: 'ClipboardList',
    popular: false,
    descriptionUz: '10 dan 40 sahifagacha (1 sahifa = 300 so\'m). Talab qilingan reja bo\'yicha to\'liq yoritilgan ilmiy hisobot.'
  },
  {
    id: 'tarjima',
    titleUz: 'Tarjima xizmati',
    titleRu: 'Услуга перевода',
    titleEn: 'Translation Service',
    titleKaa: 'Awdarma xızmeti',
    basePrice: 10000,
    maxPrice: 10000,
    estimatedTime: '1-2 minut',
    icon: 'Languages',
    popular: false,
    descriptionUz: 'Ilmiy, rasmiy, badiiy yoki jurnalistik uslubda professional akademik tarjima (Uzbek, Karakalpak, Russian, English).'
  },
  {
    id: 'masala_lab',
    titleUz: 'Masala va Laboratoriya',
    titleRu: 'Задачи и лаборатории',
    titleEn: 'Problems & Lab Work',
    titleKaa: 'Masele hám laboratoriya',
    basePrice: 5000,
    maxPrice: 15000,
    estimatedTime: '3-5 minut',
    icon: 'Binary',
    popular: false,
    descriptionUz: '35 ta yo\'nalish bo\'yicha formulalar, yechish bosqichlari, hisob-kitoblar va xulosalar (Oson, O\'rta, Murakkab).'
  },
  {
    id: 'tezis',
    titleUz: 'Tezis (Dissertatsiya qismi)',
    titleRu: 'Тезис (часть диссертации)',
    titleEn: 'Thesis / Conference Abstract',
    titleKaa: 'Tezis (dissertaciya bólimi)',
    basePrice: 25000,
    maxPrice: 25000,
    estimatedTime: '1-2 minut',
    icon: 'ScrollText',
    popular: false,
    descriptionUz: 'Ilmiy konferensiyalar va magistrlik/doktorlik dissertatsiyalari himoyasi uchun siqiq va mazmunli ilmiy tezis.'
  }
];

export const PRESENTATION_THEMES: PresentationTheme[] = [
  {
    id: 'minimal_white_blue',
    nameUz: '⚪ Minimalistik Oq-Ko\'k',
    bgColor: '#ffffff',
    accentColor: '#2563eb',
    textColor: '#0f172a',
    cardBg: '#f8fafc',
    borderColor: '#e2e8f0',
    previewGradient: 'from-slate-100 to-blue-50'
  },
  {
    id: 'tech_dark_blue',
    nameUz: '🔵 Texnologik Qora-Ko\'k',
    bgColor: '#090d16',
    accentColor: '#38bdf8',
    textColor: '#f8fafc',
    cardBg: '#0f172a',
    borderColor: '#1e293b',
    previewGradient: 'from-slate-950 via-slate-900 to-sky-950'
  },
  {
    id: 'medical_green',
    nameUz: '🟢 Tibbiy Yashil',
    bgColor: '#064e3b',
    accentColor: '#34d399',
    textColor: '#f0fdf4',
    cardBg: '#065f46',
    borderColor: '#047857',
    previewGradient: 'from-emerald-950 via-teal-900 to-emerald-800'
  },
  {
    id: 'gold_black',
    nameUz: '🟡 Jiddiy Oltin-Qora',
    bgColor: '#0c0a09',
    accentColor: '#fbbf24',
    textColor: '#fef3c7',
    cardBg: '#1c1917',
    borderColor: '#44403c',
    previewGradient: 'from-stone-950 via-neutral-900 to-amber-950'
  },
  {
    id: 'soft_pastel',
    nameUz: '🌸 Soft Pastel',
    bgColor: '#fff1f2',
    accentColor: '#f43f5e',
    textColor: '#4c0519',
    cardBg: '#ffe4e6',
    borderColor: '#fecdd3',
    previewGradient: 'from-rose-50 via-pink-100 to-rose-200'
  },
  {
    id: 'academic_purple',
    nameUz: '🟣 Akademik Binafsha',
    bgColor: '#2e1065',
    accentColor: '#c084fc',
    textColor: '#faf5ff',
    cardBg: '#3b0764',
    borderColor: '#581c87',
    previewGradient: 'from-purple-950 via-indigo-950 to-violet-900'
  },
  {
    id: 'energetic_red_white',
    nameUz: '🔴 Energetik Qizil-Oq',
    bgColor: '#ffffff',
    accentColor: '#dc2626',
    textColor: '#18181b',
    cardBg: '#fef2f2',
    borderColor: '#fee2e2',
    previewGradient: 'from-white via-red-50 to-rose-100'
  },
  {
    id: 'nature_green_white',
    nameUz: '🌿 Tabiiy Yashil-Oq',
    bgColor: '#f0fdf4',
    accentColor: '#16a34a',
    textColor: '#14532d',
    cardBg: '#dcfce7',
    borderColor: '#bbf7d0',
    previewGradient: 'from-green-50 via-emerald-50 to-teal-100'
  },
  {
    id: 'business_gray',
    nameUz: '⚫ Biznes Kulrang',
    bgColor: '#18181b',
    accentColor: '#94a3b8',
    textColor: '#f4f4f5',
    cardBg: '#27272a',
    borderColor: '#3f3f46',
    previewGradient: 'from-zinc-900 via-neutral-900 to-stone-900'
  },
  {
    id: 'creative_yellow_black',
    nameUz: '🟨 Kreativ Sariq-Qora',
    bgColor: '#000000',
    accentColor: '#facc15',
    textColor: '#ffffff',
    cardBg: '#18181b',
    borderColor: '#27272a',
    previewGradient: 'from-black via-zinc-950 to-amber-950'
  },
  {
    id: 'scientific_navy',
    nameUz: '🔷 Ilmiy To\'q Ko\'k',
    bgColor: '#0f172a',
    accentColor: '#60a5fa',
    textColor: '#f8fafc',
    cardBg: '#1e293b',
    borderColor: '#334155',
    previewGradient: 'from-slate-900 via-blue-950 to-indigo-950'
  },
  {
    id: 'modern_gradient',
    nameUz: '🌈 Zamonaviy Gradient',
    bgColor: '#0f172a',
    accentColor: '#ec4899',
    textColor: '#ffffff',
    cardBg: 'rgba(30, 41, 59, 0.7)',
    borderColor: '#4f46e5',
    previewGradient: 'from-indigo-900 via-purple-900 to-pink-900'
  }
];

export const PAYMENT_CARDS = [
  {
    number: '9860 0803 2676 4729',
    rawNumber: '9860080326764729',
    bank: 'Humo / Milliy Bank',
    holder: "Safarov Azizbek Kamol Og'li"
  },
  {
    number: '6262 5704 3920 4670',
    rawNumber: '6262570439204670',
    bank: 'Uzcard / Xalq Banki',
    holder: "Safarov Azizbek Kamol Og'li"
  }
];

export const TOP_UP_PRESETS = [
  5000,
  10000,
  20000,
  50000,
  100000,
  200000
];

export const INDEPENDENT_WORK_PAGES = [
  { pages: 10, price: 3000 },
  { pages: 15, price: 4500 },
  { pages: 20, price: 6000 },
  { pages: 25, price: 7500 },
  { pages: 30, price: 9000 },
  { pages: 35, price: 10500 },
  { pages: 40, price: 12000 }
];
