export type TMenuAction = "dialog" | "sheet" | "drawer";

export interface IMenuItem {
  id: number;
  title: string;
  icon: any;
  action: TMenuAction;
  component?: React.ComponentType<any>;
  requiredProps?: string[];
  href?: string;
}

export interface IMenuState {
  isDialogOpen: boolean;
  isSheetOpen: boolean;
  isDrawerOpen: boolean;
  activeComponent: React.ComponentType<any> | null;
  activeItem: IMenuItem | null;
}

export interface IInteractionMenuProps {
  userRole: string;
  onMenuItemClick?: (item: IMenuItem) => void;
  itemsData: Record<string, any>;
}
