import React, { useState } from 'react';
import { GeneratedDocument } from '../types';
import { exportDocumentToPdf } from '../services/pdfExporter';
import { Download, Printer, Copy, Check, X, ShieldCheck, BookOpen, PenTool, FileText } from 'lucide-react';

interface Props {
  document: GeneratedDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<Props> = ({ document, onClose }) => {
  const [format, setFormat] = useState<'times_new_roman' | 'handwriting'>('times_new_roman');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'full' | 'title' | 'intro' | 'chapters' | 'conclusion' | 'references'>('full');

  if (!document) return null;

  const handleCopy = () => {
    const fullText = `
${document.title}
${document.discipline}
Muallif: ${document.author.fullName || 'Talaba'}

KIRISH
${document.introduction}

${document.chapters.map(c => `${c.title}\n${c.sections.map(s => `${s.subTitle}\n${s.content}`).join('\n\n')}`).join('\n\n')}

XULOSA
${document.conclusion}

ADABIYOTLAR
${document.references.map((r, i) => `${i + 1}. ${r}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">{document.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{document.discipline}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Sifat: A'lo darajada
                </span>
                <span>•</span>
                <span>{document.pageCount} sahifa</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle: Times New Roman vs Handwriting */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setFormat('times_new_roman')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  format === 'times_new_roman'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Rasmiy PDF formati"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Standart</span> PDF
              </button>
              <button
                onClick={() => setFormat('handwriting')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  format === 'handwriting'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Qo'lyozma daftar formati"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Qo'lyozma</span> Daftar
              </button>
            </div>

            {/* Action buttons */}
            <button
              onClick={() => exportDocumentToPdf(document)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-900/30 transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF Yuklab Olish</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              title="Nusxalash"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              title="Chop etish"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-rose-900/50 hover:text-rose-400 text-slate-400 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('full')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition ${
              activeTab === 'full' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📖 To'liq Hujjat
          </button>
          <button
            onClick={() => setActiveTab('title')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition ${
              activeTab === 'title' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏛️ Titul Varaq
          </button>
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition ${
              activeTab === 'intro' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📌 Kirish
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition ${
              activeTab === 'chapters' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📚 Boblar ({document.chapters.length} ta)
          </button>
          <button
            onClick={() => setActiveTab('conclusion')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition ${
              activeTab === 'conclusion' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎯 Xulosa
          </button>
          <button
            onClick={() => setActiveTab('references')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition ${
              activeTab === 'references' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📑 Adabiyotlar ({document.references.length} ta)
          </button>
        </div>

        {/* Paper Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center">
          <div
            className={`w-full max-w-3xl min-h-[900px] p-8 sm:p-14 shadow-2xl transition-all rounded-sm ${
              format === 'handwriting'
                ? 'notebook-paper text-blue-950 font-handwriting text-xl sm:text-2xl leading-8 sm:leading-9'
                : 'bg-white text-neutral-900 font-academic text-base leading-relaxed border border-neutral-300'
            }`}
          >
            {/* TITUL VARAQ */}
            {(activeTab === 'full' || activeTab === 'title') && (
              <div className="border-b-2 border-dashed border-neutral-300 pb-12 mb-12 text-center">
                <div className="text-xs uppercase font-bold tracking-wider text-neutral-700 leading-snug">
                  O'ZBEKISTON RESPUBLIKASI<br />
                  OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI
                </div>
                <div className="mt-4 text-sm font-semibold uppercase text-neutral-800">
                  {document.author.university || 'TOSHKENT DAVLAT UNIVERSITETI'}
                </div>
                {document.author.faculty && (
                  <div className="text-xs text-neutral-600 mt-1 uppercase">
                    {document.author.faculty} FAKULTETI
                  </div>
                )}
                
                <div className="w-32 h-[1px] bg-neutral-400 mx-auto my-8" />

                <div className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
                  {document.discipline}
                </div>
                <div className="mt-2 text-lg italic text-neutral-800">
                  Mavzu: "{document.title}"
                </div>

                <div className="mt-16 text-right space-y-1 text-sm text-neutral-800 pr-4">
                  <p><span className="font-semibold">Bajardi:</span> {document.author.fullName || 'Talaba'}</p>
                  {document.author.course && <p><span className="font-semibold">Bosqich:</span> {document.author.course}-kurs</p>}
                  {document.author.group && <p><span className="font-semibold">Guruh:</span> {document.author.group}</p>}
                  {document.author.teacher && <p><span className="font-semibold">Ilmiy rahbar:</span> {document.author.teacher}</p>}
                </div>

                <div className="mt-20 text-xs font-medium text-neutral-600">
                  Toshkent — 2026
                </div>
              </div>
            )}

            {/* MUNDARIJA */}
            {(activeTab === 'full' || activeTab === 'title') && (
              <div className="border-b border-neutral-300 pb-8 mb-8">
                <h3 className="text-center font-bold text-lg mb-6 tracking-wide">MUNDARIJA</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-dotted border-neutral-400 pb-1">
                    <span>KIRISH</span>
                    <span className="font-mono">3</span>
                  </div>
                  {document.chapters.map((ch, idx) => (
                    <div key={idx} className="flex justify-between border-b border-dotted border-neutral-400 pb-1">
                      <span>{ch.title}</span>
                      <span className="font-mono">{4 + idx * 2}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-b border-dotted border-neutral-400 pb-1">
                    <span>XULOSA VA TAVSIYALAR</span>
                    <span className="font-mono">{4 + document.chapters.length * 2}</span>
                  </div>
                  <div className="flex justify-between border-b border-dotted border-neutral-400 pb-1">
                    <span>FOYDALANILGAN ADABIYOTLAR RO'YXATI</span>
                    <span className="font-mono">{5 + document.chapters.length * 2}</span>
                  </div>
                </div>
              </div>
            )}

            {/* KIRISH */}
            {(activeTab === 'full' || activeTab === 'intro') && (
              <div className="mb-10">
                <h3 className="text-center font-bold text-base uppercase tracking-wider mb-4">KIRISH</h3>
                <div className="text-justify indent-8 space-y-3">
                  {document.introduction.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* BOBLAR */}
            {(activeTab === 'full' || activeTab === 'chapters') && (
              <div className="space-y-10 mb-10">
                {document.chapters.map((chapter, cIdx) => (
                  <div key={cIdx} className="space-y-6">
                    <h3 className="text-center font-bold text-base uppercase tracking-wide border-t border-neutral-300 pt-6">
                      {chapter.title}
                    </h3>
                    {chapter.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="space-y-3">
                        <h4 className="font-bold text-sm tracking-normal text-neutral-800">
                          {sec.subTitle}
                        </h4>
                        <div className="text-justify indent-8 space-y-3">
                          {sec.content.split('\n\n').map((p, pIdx) => (
                            <p key={pIdx}>{p}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* XULOSA */}
            {(activeTab === 'full' || activeTab === 'conclusion') && (
              <div className="mb-10 border-t border-neutral-300 pt-6">
                <h3 className="text-center font-bold text-base uppercase tracking-wider mb-4">XULOSA VA TAVSIYALAR</h3>
                <div className="text-justify indent-8 space-y-3">
                  {document.conclusion.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* ADABIYOTLAR */}
            {(activeTab === 'full' || activeTab === 'references') && (
              <div className="border-t border-neutral-300 pt-6">
                <h3 className="text-center font-bold text-base uppercase tracking-wider mb-4">
                  FOYDALANILGAN ADABIYOTLAR RO'YXATI
                </h3>
                <ol className="list-decimal pl-6 space-y-2 text-xs sm:text-sm">
                  {document.references.map((ref, idx) => (
                    <li key={idx} className="text-neutral-800">{ref}</li>
                  ))}
                </ol>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Banner */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>🔒 Ushbu hujjat O'zbekiston OTMlarining rasmiy talablariga to'liq mos formatlangan.</span>
          <div className="flex items-center gap-3">
            <span>Matn hajmi: ~{document.wordCount} so'z</span>
            <button
              onClick={() => exportDocumentToPdf(document)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
            >
              PDF yuklab olish →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
