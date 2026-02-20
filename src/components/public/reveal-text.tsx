"use client";

import { motion } from "framer-motion";
import { PERTUTO_PHYSICS } from "@/lib/framer-physics";
import React from "react";

export const RevealText = ({ 
  text, 
  as: Component = "h1", 
  className = "" 
}: { 
  text: string; 
  as?: React.ElementType; 
  className?: string; 
}) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: "120%", rotate: 2, opacity: 0 },
    show: { 
      y: "0%", 
      rotate: 0, 
      opacity: 1, 
      transition: PERTUTO_PHYSICS.springHeavy 
    },
  };

  // Type assertion to allow framer-motion to wrap dynamic HTML elements
  const MotionComponent = motion.create(Component as React.ForwardRefExoticComponent<any>);

  return (
    <MotionComponent
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 mr-2">
          <motion.span 
            variants={item} 
            className="inline-block origin-bottom-left will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
};
