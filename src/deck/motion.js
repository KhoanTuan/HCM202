// Các kiểu chuyển động dùng chung (Framer Motion variants).
export const ease = [0.22, 1, 0.36, 1];

export const stagger = (delay = 0.08, delayChildren = 0.15) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren } },
});

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 160, damping: 18 } },
};

export const slideRight = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

export const slideLeft = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

export const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.2, ease } },
};

export const ruleGrow = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease } },
};

// Chuyển slide: trượt theo hướng đi tới / lùi lại
export const pageVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, filter: 'blur(6px)', transition: { duration: 0.35, ease } }),
};
