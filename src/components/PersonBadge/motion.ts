export const badgeVariants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};
