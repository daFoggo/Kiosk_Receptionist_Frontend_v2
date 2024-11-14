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
      className="inline-block m-1"
        {...props}
      >
        <Badge
          variant="outline"
          className={`inline-flex px-4 py-2 text-base bg-background/50 backdrop-blur-sm hover:bg-background/60 transition-all duration-300 whitespace-nowrap ${
            isMain ? "border-primary border-2" : "border-primary/20"
          }`}
        >
          <div className="flex items-center gap-2 flex-nowrap min-w-0">
            <span className="font-semibold truncate">{person.name}</span>
            <span
              className={`flex-shrink-0 ${
                isMain ? "w-2 h-2" : "w-1 h-1"
              } rounded-full bg-primary/40`}
              aria-hidden="true"
            />
            <span className="text-muted-foreground truncate">
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