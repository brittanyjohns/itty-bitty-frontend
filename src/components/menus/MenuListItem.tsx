import { IonImg, IonItem, IonLabel, IonNote, IonText } from "@ionic/react";
import { Menu } from "../../data/menus";
import "./MenuListItem.css";

interface MenuListItemProps {
  menu: Menu;
}

const MenuListItem: React.FC<MenuListItemProps> = ({ menu }) => {
  return (
    // <IonItem
    //   routerLink={`/menus/${menu.id}`}
    //   detail={true}
    //   className="p-4"
    // >
    //   <IonImg
    //     src={menu.displayImage}
    //     alt={menu.name}
    //     className="w-24 h-24 rounded-full mr-4"
    //   />
    //   <IonLabel>{menu.name}</IonLabel>
    //   <IonNote slot="end">{menu.boardId}</IonNote>
    // </IonItem>
    <IonItem
        className="w-full py-3"
        // onClick={() => handleBoardClick(board)}
        // onTouchStart={handleButtonPress}
        // onTouchEnd={handleButtonRelease}
        detail={false}
        lines="none"
      >
        <IonText className="text-xl w-full font-bold">
          {menu.name.length > 25
            ? `${menu.name.substring(0, 22)}...`
            : menu.name}
        </IonText>
      </IonItem>
  );
};

export default MenuListItem;
