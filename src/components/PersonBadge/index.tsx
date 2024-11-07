import { forwardRef, memo } from "react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";

import { badgeVariants } from "./motion";
import { convertRole } from "@/utils/Helper/common";
import { PersonBadgeProps } from "@/models/PersonBadge/type";

const PersonBadge = memo(
  forwardRef<HTMLDivElement, PersonBadgeProps>(
    ({ person, isMain = false, ...props }, ref) => (
      <motion.div
        ref={ref}
        layout
        variants={badgeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        {...props}
      >
        <Badge
          variant="outline"
          className={`inline-flex px-4 py-2 text-base bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all duration-300 ${
            isMain ? "border-primary border-2" : "border-primary/20"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">{person.name}</span>
            <span
              className={`w-${isMain ? "2" : "1"} h-${
                isMain ? "2" : "1"
              } rounded-full bg-primary/40`}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">
              {convertRole(person.role)}
            </span>
          </div>
        </Badge>
      </motion.div>
    )
  )
);

PersonBadge.displayName = "PersonBadge";

export default PersonBadge;
