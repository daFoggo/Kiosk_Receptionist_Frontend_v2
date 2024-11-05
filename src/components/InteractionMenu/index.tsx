import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { interactionMenu } from "./constant";
import { Button } from "@/components/ui/button";
import { IInteractionMenuProps } from "@/models/InteractionMenu/type";
import { BookMarked } from "lucide-react";

const InteractionMenu = ({
  userRole = "student",
  activingMenu = 1,
  onMenuItemClick,
}: IInteractionMenuProps) => {
  const menuItems = interactionMenu[userRole] || [];

  const handleItemClick = (item) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
  };

  return (
    <Card className="w-full p-4 rounded-2xl bg-background/20 backdrop-blur-sm space-y-4">
      <CardContent className="p-0">
        <div className="grid grid-cols-3 gap-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                variant="outline"
                key={item.id}
                className={`flex flex-col items-center justify-center p-4 rounded-xl gap-2 h-auto font-semibold ${
                  activingMenu === item.id
                    ? "bg-primary/30 border-2 border-primary hover:bg-primary/40"
                    : "bg-primary/20 hover:bg-primary/30 text-muted-foreground"
                }`}
                onClick={() => handleItemClick(item)}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-sm text-center">{item.title}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="p-0 flex items-center justify-between">
        <div></div>
        <Button
          variant="outline"
          size="icon"
          icon={<BookMarked className="w-6 h-6" />}
          iconPosition="center"
          className="bg-primary/20 font-semibold p-2 hover:bg-primary/30"
        ></Button>
      </CardFooter>
    </Card>
  );
};

export default InteractionMenu;
