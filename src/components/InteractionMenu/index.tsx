import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  IInteractionMenuProps,
  IMenuItem,
  IMenuItemProps,
  IMenuState,
} from "@/models/interaction-menu";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { interactionMenu } from "./constant";
import { activeButtonVariants, gridVariants, itemVariants } from "./motion";

const MenuItem = memo(({ item, onClick, isActive }: IMenuItemProps) => (
  <motion.div
    key={`${item.id}`}
    variants={itemVariants}
    layout
    className="relative"
    style={{
      touchAction: "none",
      WebkitTapHighlightColor: "transparent",
    }}
  >
    <motion.div
      animate={isActive ? "active" : "initial"}
      variants={activeButtonVariants}
      className="w-full h-full z-50"
    >
      <Button
        variant="outline"
        className={`w-full flex flex-col items-center justify-center p-4 rounded-xl gap-2 h-auto font-semibold ${
          isActive
            ? "bg-primary/30 border-2 border-primary hover:bg-primary/40 text-primary"
            : "bg-primary/20 hover:bg-primary/30 text-secondary-foreground"
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick(item);
        }}
        disabled={item.disabled}
      >
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-none"
        >
          <item.icon className="w-6 h-6" />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-center pointer-events-none"
        >
          {item.title}
        </motion.span>
      </Button>
    </motion.div>
  </motion.div>
));

const InteractionMenu = memo(
  ({ userRole, onMenuItemClick, itemsData }: IInteractionMenuProps) => {
    const { t } = useTranslation();
    const [activingButton, setActivingButton] = useState<number | null>(null);
    const [menuState, setMenuState] = useState<IMenuState>({
      isDialogOpen: false,
      isSheetOpen: false,
      isDrawerOpen: false,
      activeComponent: null,
      activeItem: null,
    });
    const [previousRole, setPreviousRole] = useState<string>(userRole);
    const menuItems = useMemo(
      () => interactionMenu(t)[userRole] || [],
      [userRole, t]
    );

    const handleItemClick = useCallback(
      (item: IMenuItem) => {
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
              `Missing required props for ${item.title}: ${missingProps.join(
                ", "
              )}`
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
      },
      [onMenuItemClick, itemsData]
    );

    const closeAll = useCallback(() => {
      setMenuState({
        isDialogOpen: false,
        isSheetOpen: false,
        isDrawerOpen: false,
        activeComponent: null,
        activeItem: null,
      });
    }, []);

    const ActiveComponent = menuState.activeComponent;
    const activeItem = menuState.activeItem;

    const getComponentProps = useCallback(() => {
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
    }, [activeItem, itemsData, closeAll]);

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
                className="grid grid-cols-3 gap-2 relative"
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={`${userRole}-${item.id}`}
                    item={item}
                    onClick={() => handleItemClick(item)}
                    isActive={activingButton === item.id}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="p-0 flex items-center justify-between">
            <div></div>
            <LanguageSelector />
          </CardFooter>
        </Card>

        <Dialog open={menuState.isDialogOpen} onOpenChange={closeAll}>
          <DialogContent
            className="max-w-[80%] h-auto rounded-3xl p-6"
          >
            <DialogHeader className="mb-6">
              <DialogTitle className="text-3xl font-semibold">
                {activeItem?.title}
              </DialogTitle>
              <DialogDescription className="text-xl text-muted-foreground  font-semibold">
                {activeItem?.description}
              </DialogDescription>
            </DialogHeader>
            {ActiveComponent && <ActiveComponent {...getComponentProps()} />}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeAll}
                className="text-xl font-semibold px-8 py-6"
              >
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet open={menuState.isSheetOpen} onOpenChange={closeAll}>
          <SheetContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            side="left"
            className="sm:max-w-7xl p-6"
          >
            <SheetHeader className="mb-6">
              <SheetTitle className="text-3xl font-semibold">
                {activeItem?.title}
              </SheetTitle>
              <SheetDescription className="text-xl text-muted-foreground  font-semibold">
                {activeItem?.description}
              </SheetDescription>
            </SheetHeader>
            {ActiveComponent && <ActiveComponent {...getComponentProps()} />}
          </SheetContent>
        </Sheet>

        <Drawer open={menuState.isDrawerOpen} onOpenChange={closeAll}>
          <DrawerContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="p-6 h-[75%]"
          >
            <DrawerHeader className="mb-6">
              <DrawerTitle className="text-3xl font-semibold">
                {activeItem?.title}
              </DrawerTitle>
              <DialogDescription className="text-xl text-muted-foreground font-semibold">
                {activeItem?.description}
              </DialogDescription>
            </DrawerHeader>
            {ActiveComponent && <ActiveComponent {...getComponentProps()} />}
          </DrawerContent>
        </Drawer>
      </>
    );
  }
);

export default InteractionMenu;
