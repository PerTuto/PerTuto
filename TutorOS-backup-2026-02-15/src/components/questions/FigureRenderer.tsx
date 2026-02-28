"use client";

import React, { useState } from "react";
import { ZoomIn, ExternalLink, Image } from "lucide-react";

interface FigureRendererProps {
  pdfUrl?: string;
  pageNumber: number;
  box: number[]; // [ymin, xmin, ymax, xmax] normalized 0-1000
  label?: string;
  className?: string;
  /** Pre-extracted figure URL (from AI). If present, renders as image directly. */
  figureUrl?: string;
}

/**
 * Lightweight figure renderer.
 * - If figureUrl is provided → renders as <img> with zoom modal.
 * - Otherwise → shows a clickable link to open the PDF at the relevant page.
 */
export default function FigureRenderer({
  pdfUrl,
  pageNumber,
  // box is captured via ...rest but not used directly
  label,
  className,
  figureUrl,
  ...rest
}: FigureRendererProps) {
  void rest; // satisfy lint for unused box
  const [imgError, setImgError] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  // Pre-extracted figure URL — render as image
  if (figureUrl && !imgError) {
    return (
      <div className={`group relative ${className || ""}`}>
        <div className="bg-white rounded-lg border border-white/10 overflow-hidden relative">
          <img
            src={figureUrl}
            alt={label || "Figure"}
            className="w-full h-auto cursor-pointer"
            onClick={() => setShowZoom(true)}
            onError={() => setImgError(true)}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowZoom(true)}
              className="p-1.5 rounded-lg bg-black/60 backdrop-blur text-white/80 hover:text-white transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
        {label && (
          <div className="mt-2 text-xs text-white/40 text-center font-mono truncate">
            {label}
          </div>
        )}

        {/* Zoom modal */}
        {showZoom && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8 cursor-pointer"
            onClick={() => setShowZoom(false)}
          >
            <div className="max-w-4xl max-h-full overflow-auto rounded-2xl bg-white shadow-2xl p-2">
              <img
                src={figureUrl}
                alt={label || "Figure (zoomed)"}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback: link to open the PDF at the figure's page
  if (!pdfUrl) return null;

  return (
    <div className={`group relative ${className || ""}`}>
      <a
        href={`${pdfUrl}#page=${pageNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Image className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {label || `Figure on page ${pageNumber}`}
          </p>
          <p className="text-xs text-white/30 mt-0.5">
            Page {pageNumber} · Click to view in PDF
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-white/30 shrink-0" />
      </a>
    </div>
  );
}
