export const searchVariants = {
  hidden: {
    width: 0,
    opacity: 0,
    x: 20,
  },
  visible: {
    width: "200px",
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      duration: 0.4,
      bounce: 0.3,
    },
  },
  exit: {
    width: 0,
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};
