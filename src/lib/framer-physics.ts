import { Transition } from "framer-motion";

export const PERTUTO_PHYSICS = {
  // Use for layout changes, card expansions, and modals (Slow, heavy, premium)
  springHeavy: {
    type: "spring",
    stiffness: 80,
    damping: 20,
    mass: 1.2,
    restDelta: 0.001,
  } as Transition,

  // Use for text reveals and quick UI hover states (Fast, snappy, responsive)
  springSnappy: {
    type: "spring",
    stiffness: 150,
    damping: 15,
    mass: 0.8,
  } as Transition,

  // Use for infinite marquees and exact timed reveals (Smooth bezier curve)
  easePremium: {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1], // Standard Apple/Framer CSS Ease
    duration: 0.8,
  } as Transition,
};
