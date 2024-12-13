import { MotionProps } from "framer-motion";

export interface PersonBadgeProps extends MotionProps {
  person: { name: string; role: string };
  isMain?: boolean;
}
