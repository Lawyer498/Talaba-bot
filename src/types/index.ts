export type Language = 'uz' | 'kaa' | 'ru' | 'en';

export interface AuthorDetails {
  fullName: string;
  university: string;
  faculty?: string;
  course?: string;
  group?: string;
  subject?: string;
  teacher?: string;
  phone?: string;
  email?: string;
  telegramUsername?: string;
}

export type ServiceType = 
  | 'referat'
  | 'maqola'
  | 'kurs_ishi'
  | 'prezentatsiya'
  | 'mustaqil_ish'
  | 'tarjima'
  | 'masala_lab'
  | 'tezis';

export interface ServiceConfig {
  id: ServiceType;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  titleKaa: string;
  basePrice: number;
  maxPrice: number;
  estimatedTime: string;
  icon: string;
  popular?: boolean;
  descriptionUz: string;
}

export interface Discipline {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  nameKaa: string;
  category: 'Iqtisodiyot va Moliya' | 'Huquqshunoslik va Siyosat' | 'Pedagogika va Gumanitar' | 'IT va Aniq fanlar' | 'Tibbiyot va Tabiiy' | 'Qishloq xo\'jaligi va Muhandislik';
  keyLaws: string[];
  keyAuthors: string[];
}

export interface PresentationTheme {
  id: string;
  nameUz: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  cardBg: string;
  borderColor: string;
  previewGradient: string;
}

export interface GeneratedDocument {
  title: string;
  discipline: string;
  author: AuthorDetails;
  language: Language;
  format: 'times_new_roman' | 'handwriting';
  pageCount: number;
  wordCount: number;
  chaptersCount?: number;
  abstract?: string;
  keywords?: string[];
  introduction: string;
  chapters: {
    title: string;
    sections: {
      subTitle: string;
      content: string;
    }[];
  }[];
  conclusion: string;
  references: string[];
  qualityScore: number;
  generatedAt: string;
}

export interface SlideItem {
  slideNumber: number;
  title: string;
  bullets: string[];
  keyHighlight?: string;
  notes?: string;
}

export interface GeneratedPresentation {
  topic: string;
  authorName: string;
  themeId: string;
  slideCount: number;
  slides: SlideItem[];
  generatedAt: string;
}

export interface Order {
  id: string;
  serviceType: ServiceType;
  topic: string;
  disciplineId: string;
  disciplineName: string;
  language: Language;
  price: number;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  author: AuthorDetails;
  pages?: number;
  chaptersCount?: number;
  format?: 'times_new_roman' | 'handwriting';
  presentationThemeId?: string;
  slidesCount?: number;
  translationSourceLang?: string;
  translationTargetLang?: string;
  translationStyle?: string;
  problemDifficulty?: 'easy' | 'medium' | 'hard';
  document?: GeneratedDocument;
  presentation?: GeneratedPresentation;
}

export interface FraudAnalysisResult {
  riskScore: number; // 0 to 100
  isSuspicious: boolean;
  flags: string[];
  timeDiffMinutes: number;
  timestampExtracted?: string;
  extractedAmount?: number;
  extractedRecipient?: string;
  extractedTxnId?: string;
  confidence: number;
}

export interface PaymentReceipt {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  amount: number;
  targetCard: string;
  targetCardHolder: string;
  uploadedAt: string;
  transferTime: string;
  txnId: string;
  receiptImageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  fraudAnalysis: FraudAnalysisResult;
  adminNote?: string;
}

export interface UserProfile {
  id: string;
  userHash: string;
  fullName: string;
  username: string;
  balance: number;
  language: Language;
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
}
