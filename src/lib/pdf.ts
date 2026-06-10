import { jsPDF } from "jspdf";
import type { GeneratedDocument } from "./types";

// HakiDocs brand colours, sampled from the logo.
const NAVY: [number, number, number] = [22, 40, 74]; // #16284a
const GOLD: [number, number, number] = [201, 162, 39]; // #c9a227

/**
 * Load an image from the public folder as a data URL + its intrinsic size.
 * Returns null if it can't be fetched/decoded, so the PDF still renders fine
 * even when the asset is missing (graceful degradation).
 */
async function loadImageAsset(
  src: string,
): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const res = await fetch(src, { cache: "force-cache" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = reject;
      img.src = data;
    });
    return { data, ...dims };
  } catch {
    return null;
  }
}

/**
 * Render a generated document to a downloadable PDF entirely on the client.
 * Uses jsPDF's text layout (not html2canvas) so the output is crisp, selectable
 * text and stays lightweight. The HakiDocs logo is embedded as a top header and
 * a navy/green stamp + signature block is drawn at the foot.
 */
export async function downloadDocumentPdf(doc: GeneratedDocument): Promise<void> {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });

  const marginX = 56;
  const marginTop = 64;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginX * 2;
  let y = marginTop;

  // Small colour helpers (avoid tuple-spread overload friction with jsPDF).
  const stroke = (c: [number, number, number]) => pdf.setDrawColor(c[0], c[1], c[2]);
  const fill = (c: [number, number, number]) => pdf.setFillColor(c[0], c[1], c[2]);
  const ink = (c: [number, number, number]) => pdf.setTextColor(c[0], c[1], c[2]);

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

  // Generation date shown on the stamp, e.g. "10 JUN 2026".
  const generatedOn = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  // Draw a scales-of-justice glyph centred on (cx, cy), sized to `r`, in `color`.
  const drawScales = (
    cx: number,
    cy: number,
    r: number,
    color: [number, number, number],
  ) => {
    stroke(color);
    fill(color);
    pdf.setLineWidth(Math.max(0.5, r * 0.06));
    const topY = cy - r * 0.34;
    const beamY = cy - r * 0.16;
    const botY = cy + r * 0.3;
    const hw = r * 0.34;
    pdf.line(cx, topY, cx, botY); // central pillar
    pdf.line(cx - hw * 0.5, botY, cx + hw * 0.5, botY); // base
    pdf.line(cx - hw, beamY, cx + hw, beamY); // beam
    pdf.circle(cx, topY, Math.max(0.8, r * 0.07), "F"); // top knob
    const panY = beamY + r * 0.24;
    const panRx = r * 0.16;
    const panRy = r * 0.06;
    pdf.line(cx - hw, beamY, cx - hw - panRx, panY); // left strings
    pdf.line(cx - hw, beamY, cx - hw + panRx, panY);
    pdf.ellipse(cx - hw, panY, panRx, panRy, "S"); // left pan
    pdf.line(cx + hw, beamY, cx + hw - panRx, panY); // right strings
    pdf.line(cx + hw, beamY, cx + hw + panRx, panY);
    pdf.ellipse(cx + hw, panY, panRx, panRy, "S"); // right pan
  };

  // Draw the HakiDocs stamp: a navy outer ring + gold inner ring around a navy
  // shield with a gold rim bearing gold scales, with "HAKIDOCS" above and
  // "AI-DRAFTED DOCUMENT" + date below. Mirrors the logo's shield+scales mark in
  // the navy/gold palette. Deliberately a brand stamp (not a state seal) — it
  // signals provenance without implying any official/government certification.
  const drawStamp = (cx: number, cy: number, r: number) => {
    // Double ring: navy outer (solid) + gold inner (dashed) = embossed look.
    stroke(NAVY);
    pdf.setLineWidth(1.4);
    pdf.circle(cx, cy, r, "S");
    stroke(GOLD);
    pdf.setLineWidth(0.6);
    pdf.setLineDashPattern([0.8, 1.6], 0);
    pdf.circle(cx, cy, r - 4.5, "S");
    pdf.setLineDashPattern([], 0);

    // Navy shield (flat top, pointed bottom) with a gold rim, centred.
    const sCy = cy - r * 0.04;
    const W = r * 0.4;
    const Hs = r * 0.4; // top half height
    const Hb = r * 0.34; // bottom point depth
    fill(NAVY);
    stroke(GOLD);
    pdf.setLineWidth(1.1);
    pdf.lines(
      [
        [2 * W, 0],
        [0, Hs],
        [-W, Hb],
        [-W, -Hb],
        [0, -Hs],
      ],
      cx - W,
      sCy - Hs,
      [1, 1],
      "FD",
      true,
    );

    // Gold scales on the shield.
    drawScales(cx, sCy + r * 0.02, r * 0.6, GOLD);

    // Brand text (navy) around the mark.
    ink(NAVY);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.text("HAKIDOCS", cx, cy - r * 0.52, { align: "center" });
    pdf.setFontSize(4.6);
    pdf.text("AI-DRAFTED DOCUMENT", cx, cy + r * 0.62, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(4.4);
    pdf.text(generatedOn, cx, cy + r * 0.78, { align: "center" });
  };

  // --- Brand header: the HakiDocs logo lockup, centred at the top ----------
  const logo = await loadImageAsset("/logo.png");
  if (logo) {
    const maxW = 232;
    const maxH = 60;
    let w = maxW;
    let h = (logo.h / logo.w) * w;
    if (h > maxH) {
      h = maxH;
      w = (logo.w / logo.h) * h;
    }
    pdf.addImage(logo.data, "PNG", (pageWidth - w) / 2, y, w, h);
    y += h + 16;
  }

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

  // --- Execution: signature lines + brand stamp, near the foot -------------
  const stampR = 40;
  const boxR = stampR + 13;
  ensureSpace(boxR * 2 + 56);

  y += 16;
  stroke(NAVY);
  pdf.setLineWidth(0.6);
  pdf.line(marginX, y, pageWidth - marginX, y); // brand separator
  y += 24;

  const blockTop = y;

  // Left column: signature / name / date lines.
  const lineW = 210;
  let rowY = blockTop + 26;
  for (const label of ["Signed", "Name (print)", "Date"]) {
    pdf.setDrawColor(40, 40, 40);
    pdf.setLineWidth(0.8);
    pdf.line(marginX, rowY, marginX + lineW, rowY);
    pdf.setTextColor(40, 40, 40);
    pdf.setFont("times", "normal");
    pdf.setFontSize(9);
    pdf.text(label, marginX, rowY + 12);
    rowY += 34;
  }

  // Right column: bordered stamp box + caption.
  const boxCx = pageWidth - marginX - boxR;
  const boxCy = blockTop + boxR + 2;
  pdf.setDrawColor(190, 198, 210);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(boxCx - boxR, boxCy - boxR, boxR * 2, boxR * 2, 6, 6, "S");
  drawStamp(boxCx, boxCy, stampR);
  pdf.setTextColor(120, 130, 145);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.text("STAMP / SEAL", boxCx, boxCy + boxR + 12, { align: "center" });

  // Continue below the taller column; reset to plain black ink for the footer.
  y = Math.max(rowY, boxCy + boxR + 18) + 10;
  pdf.setTextColor(0, 0, 0);
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.2);

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
