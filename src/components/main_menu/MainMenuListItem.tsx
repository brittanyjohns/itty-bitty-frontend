import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { MenuLink } from "../../data/menu";
import { useHistory } from "react-router";
import { useRef, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { lockClosed, lockClosedOutline } from "ionicons/icons";

interface MainMenuListItemProps {
  menuLink: MenuLink;
  closeMenu?: () => void;
}

const MenuListItem: React.FC<MainMenuListItemProps> = ({
  menuLink,
  closeMenu,
}) => {
  const history = useHistory();
  const itemRef = useRef<HTMLIonItemElement>(null);
  const { currentUser } = useCurrentUser();
  // const [activeItem, setActiveItem] = useState("");

  const freeTrial = menuLink.pro && currentUser?.free_trial;
  const shouldDisable = () => {
    // return false;
    if (!currentUser) {
      return false;
    }
    if (freeTrial) {
      return false;
    }
    if (currentUser?.admin) {
      return false;
    }
    if (currentUser?.pro) {
      return false;
    }
    return true;
  };

  const handleClick = (slug: string, endpoint: string) => () => {
    if (shouldDisable()) {
      alert(
        "Your trial has ended. Please upgrade to continue using this feature."
      );
      return;
    }
    if (closeMenu) {
      closeMenu();
    }
    console.log("slug", slug);
    history.push(endpoint ?? "");
  };

  const classNameForActive = () => {
    let x = `hover:cursor-pointer`;
    x += freeTrial || shouldDisable() ? "text-red-700" : "";
    x += shouldDisable() ? " opacity-50" : "";
    // x += isActive ? " font-bold text-lg" : "";

    return x;
  };

  const iconToUse = shouldDisable() ? lockClosed : menuLink.icon;

  return (
    <IonItem
      key={menuLink.id}
      onClick={handleClick(menuLink.slug, menuLink.endpoint)}
      className={classNameForActive()}
      lines="none"
      detail={false}
      ref={itemRef}
    >
      <IonIcon
        icon={iconToUse}
        className={`mr-5 ${shouldDisable() ? "text-red-700" : ""}`}
      />
      <IonLabel className="ml-5">
        {menuLink.name}
        <span className="text-xs font-light font-mono ml-3">
          {freeTrial ? "Free Trial" : ""}
          {shouldDisable() ? "Upgrade" : ""}
        </span>
      </IonLabel>
    </IonItem>
  );
};

export default MenuListItem;
