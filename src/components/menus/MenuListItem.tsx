import { IonImg, IonItem, IonLabel, IonNote, IonText } from "@ionic/react";
import { Menu } from "../../data/menus";
import "./MenuListItem.css";

interface MenuListItemProps {
  menu: Menu;
}

const MenuListItem: React.FC<MenuListItemProps> = ({ menu }) => {
  return (
    <IonItem
      className="w-full py-3"
      // onClick={() => handleBoardClick(board)}
      // onTouchStart={handleButtonPress}
      // onTouchEnd={handleButtonRelease}
      detail={false}
      lines="none"
    >
      <IonText className="text-xl w-full font-bold">
        {menu.name.length > 25 ? `${menu.name.substring(0, 22)}...` : menu.name}
      </IonText>
    </IonItem>
  );
};

export default MenuListItem;
