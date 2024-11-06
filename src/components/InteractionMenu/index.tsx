import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";
import {
  IInteractionMenuProps,
  IMenuItem,
  IMenuState,
} from "@/models/InteractionMenu/type";
import { interactionMenu } from "./constant";
import { gridVariants, itemVariants, activeButtonVariants } from "./motion";

const InteractionMenu = ({
  userRole,
  onMenuItemClick,
  itemsData,
}: IInteractionMenuProps) => {
  const [activingButton, setActivingButton] = useState<number | null>(null);
  const [menuState, setMenuState] = useState<IMenuState>({
    isDialogOpen: false,
    isSheetOpen: false,
    isDrawerOpen: false,
    activeComponent: null,
    activeItem: null,
  });
  const [previousRole, setPreviousRole] = useState<string>(userRole);
  const menuItems = interactionMenu[userRole] || [];

  const handleItemClick = (item: IMenuItem) => {
    setActivingButton(item.id);

    if (onMenuItemClick) {
      onMenuItemClick(item);
    }

    if (item.requiredProps) {
      const missingProps = item.requiredProps.filter(
        (prop) => !itemsData[prop]
      );
      if (missingProps.length > 0) {
        console.error(
          `Missing required props for ${item.title}: ${missingProps.join(", ")}`
        );
        return;
      }
    }

    switch (item.action) {
      case "dialog":
        setMenuState({
          isDialogOpen: true,
          isSheetOpen: false,
          isDrawerOpen: false,
          activeComponent: item.component || null,
          activeItem: item,
        });
        break;
      case "sheet":
        setMenuState({
          isDialogOpen: false,
          isSheetOpen: true,
          isDrawerOpen: false,
          activeComponent: item.component || null,
          activeItem: item,
        });
        break;
      case "drawer":
        setMenuState({
          isDialogOpen: false,
          isSheetOpen: false,
          isDrawerOpen: true,
          activeComponent: item.component || null,
          activeItem: item,
        });
        break;
    }
  };

  const closeAll = () => {
    setMenuState({
      isDialogOpen: false,
      isSheetOpen: false,
      isDrawerOpen: false,
      activeComponent: null,
      activeItem: null,
    });
  };

  const ActiveComponent = menuState.activeComponent;
  const activeItem = menuState.activeItem;

  const getComponentProps = () => {
    if (!activeItem?.requiredProps) return { onClose: closeAll };

    const componentProps = activeItem.requiredProps.reduce(
      (props, propName) => {
        props[propName] = itemsData[propName];
        return props;
      },
      {} as Record<string, any>
    );

    return {
      ...componentProps,
      onClose: closeAll,
    };
  };

  // Update previous role when role changes
  if (previousRole !== userRole) {
    setPreviousRole(userRole);
  }

  return (
    <>
      <Card className="w-full p-4 rounded-2xl bg-background/20 backdrop-blur-sm space-y-4 overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={userRole}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-3 gap-2"
            >
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={`${userRole}-${item.id}`}
                    variants={itemVariants}
                    layout
                  >
                    <motion.div
                      animate={
                        activingButton === item.id ? "active" : "initial"
                      }
                      variants={activeButtonVariants}
                    >
                      <Button
                        variant="outline"
                        className={`w-full flex flex-col items-center justify-center p-4 rounded-xl gap-2 h-auto font-semibold ${
                          activingButton === item.id
                            ? "bg-primary/30 border-2 border-primary hover:bg-primary/40 text-primary"
                            : "bg-primary/20 hover:bg-primary/30 text-secondary-foreground"
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <motion.div
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconComponent className="w-6 h-6" />
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-sm text-center"
                        >
                          {item.title}
                        </motion.span>
                      </Button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="p-0 flex items-center justify-between">
          <div></div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="bg-primary/20 font-semibold p-2 hover:bg-primary/30"
            >
              <BookMarked className="w-6 h-6" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>

      <Dialog open={menuState.isDialogOpen} onOpenChange={() => closeAll()}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-w-[80%] h-auto rounded-3xl p-6"
        >
          <DialogTitle className="text-3xl font-semibold p-0 mb-6">
            {activeItem?.title}
          </DialogTitle>
          {ActiveComponent && <ActiveComponent {...getComponentProps()} />}
        </DialogContent>
      </Dialog>

      <Sheet open={menuState.isSheetOpen} onOpenChange={() => closeAll()}>
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          side="left"
          className="sm:max-w-7xl p-6"
        >
          <SheetTitle className="text-3xl font-semibold p-0 mb-6">
            {activeItem?.title}
          </SheetTitle>
          {ActiveComponent && <ActiveComponent {...getComponentProps()} />}
        </SheetContent>
      </Sheet>

      <Drawer open={menuState.isDrawerOpen} onOpenChange={() => closeAll()}>
        <DrawerContent onOpenAutoFocus={(e) => e.preventDefault()} className="p-6">
          <DrawerTitle className="text-3xl font-semibold p-0 mb-6">
            {activeItem?.title}
          </DrawerTitle>
          {ActiveComponent && <ActiveComponent {...getComponentProps()} />}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default InteractionMenu;
