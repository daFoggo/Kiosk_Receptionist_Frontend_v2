export const gridVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

export const activeButtonVariants = {
  initial: { scale: 1 },
  active: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 17,
    },
  },
};
