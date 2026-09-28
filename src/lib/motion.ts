export const motionTokens = {
  easings: {
    easeOutExpo: [0.16, 1, 0.3, 1],
  },
  springs: {
    springSnappy: { type: "spring", stiffness: 300, damping: 30 },
    springSoft: { type: "spring", stiffness: 100, damping: 20 },
  },
  durations: {
    micro: 0.15,
    standard: 0.3,
    page: 0.4,
    hero: 0.8, // 0.7 to 0.9s
  },
  variants: {
    fadeUp: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
    },
    pageTransition: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
      exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
    }
  }
};
