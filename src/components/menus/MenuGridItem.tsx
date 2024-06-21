import { IonActionSheet, IonImg, IonItem, IonLabel, IonText } from "@ionic/react";
import { Menu, deleteMenu } from "../../data/menus";
import "./MenuListItem.css";
import { useEffect, useRef, useState } from "react";
import ActionList from "../utils/ActionList";
import { useHistory } from "react-router";

interface MenuGridItemProps {
  menu: Menu;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const MenuGridItem: React.FC<MenuGridItemProps> = ({ menu }) => {
  const [menuDetails, setMenuDetails] = useState(menu);
  const [showActionList, setShowActionList] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const history = useHistory();

  const removeMenu = async (menuId: string) => {
    try {
      console.log("Removing menu: ", menuId);
      // Implement delete menu logic
      deleteMenu(menuId);
    } catch (error) {
      console.error("Error removing menu: ", error);
      alert("Error removing menu");
    }
  };

  const handleMenuClick = (menu: Menu) => {
    console.log("Menu clicked: ", menu);
    history.push(`/menus/${menu.id}`);
  };
  const onClose = () => {
    setShowActionList(false);
  };

  useEffect(() => {
    setMenuDetails(menu);
  }, [menu]);
  return (
    <>
      <div
        className="cursor-pointer rounded-md w-full text-center p-4 border hover:bg-slate-200"
        onClick={() => handleMenuClick(menu)}
      >
        <IonImg
        src={menu.displayImage}
        alt={menu.name}
        className="ion-img-contain mx-auto"
      />
        <IonText className="text-xl">
          {menu.name.length > 50
            ? `${menu.name.substring(0, 50)}...`
            : menu.name}
        </IonText>
      </div>
     
    </>
  );
};

export default MenuGridItem;
