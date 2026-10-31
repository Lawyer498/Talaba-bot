import React, { useState, useEffect } from 'react';
import { GeneratedPresentation, PresentationTheme } from '../types';
import { PRESENTATION_THEMES } from '../data/disciplines';
import { exportPresentationToSlidesPdf } from '../services/pdfExporter';
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, Palette, Sparkles, X, MessageSquareQuote } from 'lucide-react';

interface Props {
  presentation: GeneratedPresentation | null;
  onClose: () => void;
}

export const PresentationViewerModal: React.FC<Props> = ({ presentation, onClose }) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(presentation?.themeId || 'tech_dark_blue');
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (presentation?.themeId) {
      setSelectedThemeId(presentation.themeId);
    }
  }, [presentation]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!presentation) return null;

  const currentTheme = PRESENTATION_THEMES.find(t => t.id === selectedThemeId) || PRESENTATION_THEMES[0];
  const slide = presentation.slides[currentSlideIdx];

  const handleNext = () => {
    if (currentSlideIdx < presentation.slides.length - 1) {
      setCurrentSlideIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(prev => prev - 1);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col ${isFullscreen ? 'h-full max-w-full rounded-none border-0' : 'max-h-[95vh]'} overflow-hidden`}>
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">{presentation.topic}</h2>
              <div className="text-xs text-slate-400">
                <span>Muallif: {presentation.authorName}</span>
                <span className="mx-2">•</span>
                <span>Slayd {currentSlideIdx + 1} / {presentation.slides.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Selector */}
            <div className="relative flex items-center">
              <Palette className="w-4 h-4 text-slate-400 mr-1.5" />
              <select
                value={selectedThemeId}
                onChange={(e) => setSelectedThemeId(e.target.value)}
                className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {PRESENTATION_THEMES.map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.nameUz}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes Toggle */}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg text-xs font-medium border transition ${
                showNotes ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Spiker qaydlari"
            >
              <MessageSquareQuote className="w-4 h-4" />
            </button>

            {/* Download Presentation */}
            <button
              onClick={() => exportPresentationToSlidesPdf(presentation)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Yuklab Olish (PDF)</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-rose-900/50 hover:text-rose-400 text-slate-400 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Display Canvas */}
        <div className="flex-1 bg-black/60 p-4 sm:p-8 flex items-center justify-center overflow-auto">
          <div
            style={{
              backgroundColor: currentTheme.bgColor,
              color: currentTheme.textColor,
              borderColor: currentTheme.borderColor
            }}
            className="w-full max-w-4xl aspect-[16/9] rounded-2xl border-2 shadow-2xl p-6 sm:p-12 flex flex-col justify-between relative overflow-hidden transition-all duration-300"
          >
            {/* Top decorative accent bar */}
            <div
              style={{ backgroundColor: currentTheme.accentColor }}
              className="absolute top-0 left-0 right-0 h-2 shadow-sm"
            />

            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between text-xs tracking-wider opacity-70 mb-3 uppercase font-semibold">
                <span>Talaba Slide Bot — Akademik Taqdimot</span>
                <span>#{slide.slideNumber}</span>
              </div>
              <h1
                style={{ color: currentTheme.textColor }}
                className="text-xl sm:text-3xl font-extrabold tracking-tight leading-snug"
              >
                {slide.title}
              </h1>

              {slide.keyHighlight && (
                <div
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.borderColor,
                    color: currentTheme.accentColor
                  }}
                  className="mt-3 px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>{slide.keyHighlight}</span>
                </div>
              )}
            </div>

            {/* Slide Body Bullets */}
            <div className="my-auto py-4 space-y-3 sm:space-y-4">
              {slide.bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.borderColor
                  }}
                  className="p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 backdrop-blur-sm"
                >
                  <span
                    style={{ backgroundColor: currentTheme.accentColor }}
                    className="w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 shadow"
                  />
                  <p className="text-sm sm:text-base font-medium leading-relaxed opacity-95">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

            {/* Slide Footer */}
            <div
              style={{ borderColor: currentTheme.borderColor }}
              className="border-t pt-3 flex items-center justify-between text-xs opacity-70"
            >
              <span>{presentation.topic}</span>
              <span>Bajaruvchi: {presentation.authorName}</span>
            </div>
          </div>
        </div>

        {/* Speaker Notes Drawer */}
        {showNotes && (
          <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <span className="font-bold text-indigo-400 whitespace-nowrap">🎙️ Spiker nutqi:</span>
            <p className="italic">{slide.notes || "Ushbu slayd uchun maxsus qaydlar mavjud."}</p>
          </div>
        )}

        {/* Bottom Slide Navigation Bar */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlideIdx === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            <ChevronLeft className="w-4 h-4" /> Oldingi
          </button>

          {/* Slide Thumbnails / Indicators */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[60vw] px-2">
            {presentation.slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIdx(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition ${
                  idx === currentSlideIdx
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-1 ring-white/50'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlideIdx === presentation.slides.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition"
          >
            Keyingi <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
