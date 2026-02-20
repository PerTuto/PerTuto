"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const StackingSection = ({ 
  children, 
  zIndex 
}: { 
  children: React.ReactNode; 
  zIndex: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of THIS specific section.
  // "start start" means trigger when the top of the container hits the top of the viewport
  // "end start" means it tracks until the bottom of the container hits the top of the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // As the user scrolls past this section, it scales down from 1 to 0.92
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  
  // It fades out slightly as it pushes back into Z-space
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  
  // Subtle parallax pushing the div down so it feels like it's sinking under the new content
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]); 

  return (
    <div 
      ref={containerRef} 
      // h-screen and sticky top-0 force the section to "pin" to the viewport while scrollYProgress runs
      className="h-[100svh] w-full sticky top-0 flex flex-col overflow-hidden"
      style={{ zIndex }}
    >
      <motion.div 
        style={{ scale, opacity, y }} 
        className="w-full h-full bg-background origin-top will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};
