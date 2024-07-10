import { createRef, useState } from "react";
import { Menu } from "../../data/menus";
import { IonGrid, IonButton, IonItem, IonText } from "@ionic/react";
import MenuGridItem from "./MenuGridItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface MenuGridProps {
  menus: Menu[];
}
const MenuGrid = ({ menus }: MenuGridProps) => {
  const [menuId, setMenuId] = useState<string>("");
  const { currentUser } = useCurrentUser();
  const gridRef = createRef<HTMLDivElement>();

  const handleMenuClick = (menu: Menu) => {
    setMenuId(menu.id as string);
  };

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1"
      ref={gridRef}
    >
      {menus &&
        menus.map((menu, i) => (
          <div
            id={menu.id}
            className="rounded-md flex relative p-1"
            onClick={() => handleMenuClick(menu)}
            key={menu.id}
          >
            <MenuGridItem menu={menu} />
          </div>
        ))}
      {currentUser && menus?.length === 0 && (
        <div className="text-center">
          <p className="text-lg">No menus found</p>

          <IonButton routerLink="/menus/new" color="primary">
            Create a new menu
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default MenuGrid;
