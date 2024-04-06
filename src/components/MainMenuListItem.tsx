import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { MenuLink } from "../data/menu";
import "./MenuListItem.css";
import { useHistory } from "react-router";
import { ComponentProps } from "react";

interface MainMenuListItemProps {
  menuLink: MenuLink;
  icon?: any;
  closeMenu: () => void;
}

const MenuListItem: React.FC<MainMenuListItemProps> = ({
  menuLink,
  icon,
  closeMenu,
}) => {
  const history = useHistory();

  const handleClick = (endpoint: string | undefined) => () => {
    console.log("MenuListItem - handleClick", endpoint);
    closeMenu();

    history.push(endpoint ?? "");
  };
  return (
    <IonItem
      onClick={handleClick(menuLink.endpoint)}
      className="hover:cursor-pointer"
      lines="full"
      detail={false}
    >
      <IonIcon icon={menuLink.icon} className="" />
      <IonLabel className="text-xl ml-8">
        <h2>{menuLink.name}</h2>
      </IonLabel>
    </IonItem>
  );
};

export default MenuListItem;
