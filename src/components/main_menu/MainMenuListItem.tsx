import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { MenuLink } from "../../data/menu";
import { useHistory } from "react-router";
import { useRef, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface MainMenuListItemProps {
  menuLink: MenuLink;
  icon?: any;
  closeMenu?: () => void;
}

const MenuListItem: React.FC<MainMenuListItemProps> = ({
  menuLink,
  icon,
  closeMenu,
}) => {
  const history = useHistory();
  const itemRef = useRef<HTMLIonItemElement>(null);
  const iconsRef = useRef<HTMLIonIconElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const { currentUser } = useCurrentUser();

  const freeTrial = menuLink.pro && currentUser?.free_trial;
  const shouldDisable =
    menuLink.pro &&
    currentUser?.trial_days_left &&
    currentUser?.trial_days_left <= 0 &&
    !currentUser?.admin;

  const handleClick =
    (slug: string | undefined, endpoint: string | undefined) => () => {
      if (shouldDisable) {
        alert("Your trial has ended. Please upgrade to continue.");
        return;
      }
      if (itemRef.current && slug) {
        itemRef.current.style.backgroundColor = "red";
        setActive(slug);
      }
      if (closeMenu) {
        closeMenu();
      }

      history.push(endpoint ?? "");
    };
  return (
    <IonItem
      key={menuLink.id}
      onClick={handleClick(menuLink.slug, menuLink.endpoint)}
      // className="hover:cursor-pointer active:bg-gray-400"
      className={
        freeTrial || shouldDisable
          ? "hover:cursor-pointer text-red-700"
          : "hover:cursor-pointer"
      }
      lines="none"
      detail={false}
      ref={itemRef}
    >
      <IonIcon icon={menuLink.icon} ref={iconsRef} />

      <IonLabel className="ml-5">
        {menuLink.name}
        <span className="text-xs font-light font-mono ml-3">
          {freeTrial ? "Free Trial" : ""}
          {shouldDisable ? `Trial ended ` : ""}
        </span>
      </IonLabel>
    </IonItem>
  );
};

export default MenuListItem;
