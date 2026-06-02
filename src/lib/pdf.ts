import { jsPDF } from "jspdf";
import type { GeneratedDocument } from "./types";

/**
 * Render a generated document to a downloadable PDF entirely on the client.
 * Uses jsPDF's text layout (not html2canvas) so the output is crisp, selectable
 * text and stays lightweight.
 */
export function downloadDocumentPdf(doc: GeneratedDocument): void {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });

  const marginX = 56;
  const marginTop = 64;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginX * 2;
  let y = marginTop;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginTop) {
      pdf.addPage();
      y = marginTop;
    }
  };

  const writeParagraph = (
    text: string,
    {
      size = 11,
      style = "normal",
      gap = 6,
      lineHeight = 15,
      align = "left",
    }: {
      size?: number;
      style?: "normal" | "bold" | "italic";
      gap?: number;
      lineHeight?: number;
      align?: "left" | "center";
    } = {},
  ) => {
    pdf.setFont("times", style);
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(text, contentWidth) as string[];
    for (const line of lines) {
      ensureSpace(lineHeight);
      if (align === "center") {
        pdf.text(line, pageWidth / 2, y, { align: "center" });
      } else {
        pdf.text(line, marginX, y);
      }
      y += lineHeight;
    }
    y += gap;
  };

  // Title
  writeParagraph(doc.title || "LEGAL DOCUMENT", {
    size: 16,
    style: "bold",
    align: "center",
    gap: 4,
  });
  writeParagraph("PROFESSIONAL LEGAL DOCUMENT", {
    size: 9,
    align: "center",
    gap: 16,
  });

  // Sections
  for (const section of doc.sections) {
    writeParagraph(section.heading.toUpperCase(), {
      size: 12,
      style: "bold",
      gap: 4,
    });
    for (const para of section.body.split(/\n{2,}/)) {
      if (para.trim()) writeParagraph(para.trim(), { gap: 8 });
    }
    y += 4;
  }

  // Swahili summary
  ensureSpace(40);
  y += 8;
  writeParagraph("MUHTASARI (SWAHILI SUMMARY)", {
    size: 12,
    style: "bold",
    gap: 4,
  });
  writeParagraph(doc.swahiliSummary, { style: "italic", gap: 12 });

  // Disclaimer
  ensureSpace(40);
  writeParagraph(doc.disclaimer, { size: 8.5, style: "italic", gap: 0 });

  const safeTitle =
    (doc.title || "hakidocs-document")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "hakidocs-document";

  pdf.save(`${safeTitle}.pdf`);
}
