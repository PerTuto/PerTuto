
"use client";

import React, { useState } from "react";
import { ZoomIn, ExternalLink, Image as ImageIcon } from "lucide-react";

interface FigureRendererProps {
  pdfUrl?: string;
  pageNumber?: number;
  box?: number[]; // [ymin, xmin, ymax, xmax] normalized 0-1000
  label?: string;
  className?: string;
  /** Pre-extracted figure URL or base64. */
  url?: string;
}

export default function FigureRenderer({
  pdfUrl,
  pageNumber,
  box,
  label,
  className,
  url,
}: FigureRendererProps) {
  const [imgError, setImgError] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  if (url && !imgError) {
    return (
      <div className={`group relative ${className || ""}`}>
        <div className="bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden relative">
          <img
            src={url}
            alt={label || "Figure"}
            className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowZoom(true)}
            onError={() => setImgError(true)}
          />
          <div className="absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowZoom(true)}
              className="p-1.5 rounded-lg bg-white/80 dark:bg-black/60 backdrop-blur text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
        {label && (
          <div className="mt-2 text-[10px] text-muted-foreground dark:text-white/40 text-center font-mono truncate px-2">
            {label}
          </div>
        )}

        {showZoom && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-8 cursor-pointer"
            onClick={() => setShowZoom(false)}
          >
            <div className="max-w-5xl max-h-full overflow-auto rounded-2xl bg-white shadow-2xl p-2 relative">
              <img
                src={url}
                alt={label || "Figure (zoomed)"}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!pdfUrl || !pageNumber) return null;

  return (
    <div className={`group relative ${className || ""}`}>
      <a
        href={`${pdfUrl}#page=${pageNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <ImageIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {label || `Figure on page ${pageNumber}`}
          </p>
          <p className="text-xs text-muted-foreground dark:text-white/30 mt-0.5">
            Page {pageNumber} · View in PDF
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground dark:text-white/30 shrink-0" />
      </a>
    </div>
  );
}
