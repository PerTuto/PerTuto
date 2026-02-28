"use client";

import React from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

interface MathTextProps {
  children: string;
  className?: string;
  as?: "span" | "div" | "p";
}

/**
 * MathText - Renders text with LaTeX math support.
 * Automatically detects LaTeX delimiters ($...$, $$...$$, \(...\), \[...\])
 * and renders them as formatted math expressions.
 * Falls back to plain text when no math content is detected.
 */
export default function MathText({
  children,
  className = "",
  as: Tag = "span",
}: MathTextProps) {
  // Check if text contains LaTeX delimiters
  const hasLatex = /(\$[^$]+\$|\\[([][\s\S]+?\\[\])])/.test(children);

  if (!hasLatex) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className}>
      <Latex>{children}</Latex>
    </Tag>
  );
}
