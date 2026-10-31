import { jsPDF } from 'jspdf';
import { GeneratedDocument, GeneratedPresentation } from '../types';

export function exportDocumentToPdf(doc: GeneratedDocument): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 30; // Standart chap hoshiya
  const marginRight = 15;
  const marginTop = 20;
  const marginBottom = 20;
  const contentWidth = pageWidth - marginLeft - marginRight;

  // Set font
  pdf.setFont('times', 'normal');

  // --- PAGE 1: TITUL VARAQ ---
  pdf.setFontSize(11);
  pdf.text('O\'ZBEKISTON RESPUBLIKASI', pageWidth / 2, marginTop + 5, { align: 'center' });
  pdf.text('OLIY TA\'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI', pageWidth / 2, marginTop + 11, { align: 'center' });

  const uniName = doc.author.university ? doc.author.university.toUpperCase() : 'OLIY TA\'LIM MUASSASASI';
  pdf.text(uniName, pageWidth / 2, marginTop + 22, { align: 'center' });

  if (doc.author.faculty) {
    pdf.text(`${doc.author.faculty.toUpperCase()} FAKULTETI`, pageWidth / 2, marginTop + 28, { align: 'center' });
  }

  // Horizontal line
  pdf.setDrawColor(180, 180, 180);
  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, marginTop + 35, pageWidth - marginRight, marginTop + 35);

  // Type of paper
  pdf.setFont('times', 'bold');
  pdf.setFontSize(15);
  pdf.text('ILMIY ISH', pageWidth / 2, marginTop + 70, { align: 'center' });

  // Topic
  pdf.setFontSize(14);
  const topicLines = pdf.splitTextToSize(`Mavzu: "${doc.title}"`, contentWidth - 20);
  pdf.text(topicLines, pageWidth / 2, marginTop + 82, { align: 'center' });

  // Direction
  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);
  pdf.text(`Ta'lim yo'nalishi: ${doc.discipline}`, pageWidth / 2, marginTop + 105, { align: 'center' });

  // Author & Supervisor info
  const rightAlignX = pageWidth - marginRight - 10;
  let infoY = marginTop + 140;

  pdf.text('Bajardi: ' + (doc.author.fullName || 'Talaba'), rightAlignX, infoY, { align: 'right' });
  if (doc.author.course || doc.author.group) {
    infoY += 7;
    pdf.text(`Kurs: ${doc.author.course || '1'}, Guruh: ${doc.author.group || '101'}`, rightAlignX, infoY, { align: 'right' });
  }
  if (doc.author.teacher) {
    infoY += 7;
    pdf.text('Ilmiy rahbar: ' + doc.author.teacher, rightAlignX, infoY, { align: 'right' });
  }

  // Footer: City & Year
  pdf.setFont('times', 'normal');
  pdf.setFontSize(11);
  pdf.text('Toshkent — 2026', pageWidth / 2, pageHeight - marginBottom - 5, { align: 'center' });

  // --- PAGE 2: MUNDARIJA (TABLE OF CONTENTS) ---
  pdf.addPage();
  let currentY = marginTop + 10;
  pdf.setFont('times', 'bold');
  pdf.setFontSize(14);
  pdf.text('MUNDARIJA', pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);

  const tocItems = [
    { title: 'KIRISH', page: 3 },
    ...doc.chapters.map((ch, idx) => ({ title: ch.title, page: 4 + idx * 2 })),
    { title: 'XULOSA VA TAKLIFLAR', page: 4 + doc.chapters.length * 2 },
    { title: 'FOYDALANILGAN ADABIYOTLAR RO\'YXATI', page: 5 + doc.chapters.length * 2 }
  ];

  tocItems.forEach(item => {
    const leftText = item.title;
    const pageStr = item.page.toString();
    pdf.text(leftText, marginLeft, currentY);
    pdf.text(pageStr, pageWidth - marginRight, currentY, { align: 'right' });
    // Dotted line
    const leftWidth = pdf.getTextWidth(leftText);
    const dotsStartX = marginLeft + leftWidth + 4;
    const dotsEndX = pageWidth - marginRight - 10;
    if (dotsEndX > dotsStartX) {
      let x = dotsStartX;
      while (x < dotsEndX) {
        pdf.text('.', x, currentY);
        x += 3;
      }
    }
    currentY += 9;
  });

  // Page number for Page 2
  pdf.setFontSize(10);
  pdf.text('2', pageWidth - marginRight, pageHeight - marginBottom, { align: 'right' });

  // --- PAGE 3: KIRISH ---
  pdf.addPage();
  currentY = marginTop + 10;
  pdf.setFont('times', 'bold');
  pdf.setFontSize(13);
  pdf.text('KIRISH', pageWidth / 2, currentY, { align: 'center' });
  currentY += 12;

  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);
  const introLines = pdf.splitTextToSize(doc.introduction, contentWidth);
  pdf.text(introLines, marginLeft, currentY, { maxWidth: contentWidth, align: 'justify' });

  pdf.setFontSize(10);
  pdf.text('3', pageWidth - marginRight, pageHeight - marginBottom, { align: 'right' });

  // --- CHAPTER PAGES ---
  let pageNumber = 4;
  doc.chapters.forEach((chapter) => {
    pdf.addPage();
    currentY = marginTop + 10;

    pdf.setFont('times', 'bold');
    pdf.setFontSize(13);
    const chTitleLines = pdf.splitTextToSize(chapter.title, contentWidth);
    pdf.text(chTitleLines, pageWidth / 2, currentY, { align: 'center' });
    currentY += chTitleLines.length * 7 + 8;

    chapter.sections.forEach(sec => {
      pdf.setFont('times', 'bold');
      pdf.setFontSize(12);
      const secTitleLines = pdf.splitTextToSize(sec.subTitle, contentWidth);
      pdf.text(secTitleLines, marginLeft, currentY);
      currentY += secTitleLines.length * 6 + 4;

      pdf.setFont('times', 'normal');
      pdf.setFontSize(12);
      const secContentLines = pdf.splitTextToSize(sec.content, contentWidth);
      pdf.text(secContentLines, marginLeft, currentY, { maxWidth: contentWidth, align: 'justify' });
      currentY += secContentLines.length * 6 + 8;
    });

    pdf.setFontSize(10);
    pdf.text(pageNumber.toString(), pageWidth - marginRight, pageHeight - marginBottom, { align: 'right' });
    pageNumber++;
  });

  // --- CONCLUSION PAGE ---
  pdf.addPage();
  currentY = marginTop + 10;
  pdf.setFont('times', 'bold');
  pdf.setFontSize(13);
  pdf.text('XULOSA VA TAVSIYALAR', pageWidth / 2, currentY, { align: 'center' });
  currentY += 12;

  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);
  const conclusionLines = pdf.splitTextToSize(doc.conclusion, contentWidth);
  pdf.text(conclusionLines, marginLeft, currentY, { maxWidth: contentWidth, align: 'justify' });

  pdf.setFontSize(10);
  pdf.text(pageNumber.toString(), pageWidth - marginRight, pageHeight - marginBottom, { align: 'right' });
  pageNumber++;

  // --- REFERENCES PAGE ---
  pdf.addPage();
  currentY = marginTop + 10;
  pdf.setFont('times', 'bold');
  pdf.setFontSize(13);
  pdf.text('FOYDALANILGAN ADABIYOTLAR RO\'YXATI', pageWidth / 2, currentY, { align: 'center' });
  currentY += 12;

  pdf.setFont('times', 'normal');
  pdf.setFontSize(11);
  doc.references.forEach((ref, idx) => {
    const refText = `${idx + 1}. ${ref}`;
    const refLines = pdf.splitTextToSize(refText, contentWidth);
    pdf.text(refLines, marginLeft, currentY);
    currentY += refLines.length * 5 + 4;
  });

  pdf.setFontSize(10);
  pdf.text(pageNumber.toString(), pageWidth - marginRight, pageHeight - marginBottom, { align: 'right' });

  // Save the PDF
  const safeFilename = `${doc.discipline}_${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}_${doc.author.fullName || 'Talaba'}.pdf`;
  pdf.save(safeFilename);
}

export function exportPresentationToSlidesPdf(pres: GeneratedPresentation): void {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = 297;
  const height = 210;

  pres.slides.forEach((slide, idx) => {
    if (idx > 0) pdf.addPage();

    // Background gradient simulation
    pdf.setFillColor(15, 23, 42); // dark slate
    pdf.rect(0, 0, width, height, 'F');

    // Accent line at top
    pdf.setFillColor(99, 102, 241); // indigo
    pdf.rect(0, 0, width, 5, 'F');

    // Slide Header
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(slide.title, 20, 25);

    // Key highlight pill box
    if (slide.keyHighlight) {
      pdf.setFillColor(30, 41, 59);
      pdf.roundedRect(20, 32, width - 40, 10, 2, 2, 'F');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(165, 180, 252);
      pdf.text(`✨ Asosiy nuqta: ${slide.keyHighlight}`, 25, 38.5);
    }

    // Bullets
    pdf.setTextColor(226, 232, 240);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);

    let startY = 55;
    slide.bullets.forEach((b) => {
      const wrapped = pdf.splitTextToSize(`•  ${b}`, width - 50);
      pdf.text(wrapped, 25, startY);
      startY += wrapped.length * 8 + 6;
    });

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Talaba Slide Bot — ${pres.topic}`, 20, height - 12);
    pdf.text(`Slayd ${slide.slideNumber} / ${pres.slides.length}`, width - 40, height - 12);
  });

  const safeFilename = `Prezentatsiya_${pres.topic.replace(/[^a-zA-Z0-9]/g, '_')}_${pres.authorName}.pdf`;
  pdf.save(safeFilename);
}
