import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { MenuLink } from "../../data/menu";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { lockClosed, lockOpenOutline } from "ionicons/icons";
import { User, denyAccess } from "../../data/users";
import { closeMainMenu } from "../../pages/MainHeader";
interface MainMenuListItemProps {
  menuLink: MenuLink;
}

const MenuListItem: React.FC<MainMenuListItemProps> = ({ menuLink }) => {
  const history = useHistory();
  const itemRef = useRef<HTMLIonItemElement>(null);
  const { currentUser } = useCurrentUser();

  const freeTrial = menuLink.pro && currentUser?.free_trial;

  const [isActive, setIsActive] = useState(false);
  const premiumFeatures = ["menus", "child-accounts", "teams", "groups"];
  const shouldDisable = (slug?: string) => {
    if (!slug) {
      return false;
    }

    if (!currentUser) {
      return false;
    }
    if (freeTrial) {
      if (premiumFeatures.includes(slug)) {
        return true;
      }
      return false;
    }
    if (currentUser?.admin) {
      return false;
    }
    if (currentUser?.pro) {
      return false;
    }

    if (premiumFeatures.includes(slug)) {
      return true;
    }
    return false;
  };

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes(menuLink.slug)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location]);
  useEffect(() => {
    if (window.location.href.includes(menuLink.slug)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, []);

  const denyLinkAccess = (slug: string) => {
    if (!currentUser) {
      return false;
    }
    if (denyAccess(currentUser) && premiumFeatures.includes(slug)) {
      return true;
    }
    return false;
  };

  const handleClick = (slug: string, endpoint: string) => () => {
    if (denyLinkAccess(slug)) {
      alert(
        "Your trial has ended. Please upgrade to continue using this feature."
      );
      return;
    }
    closeMainMenu();
    history.push(endpoint ?? "");
  };

  const classNameForActive = () => {
    let x = `hover:cursor-${
      denyLinkAccess(menuLink.slug) ? "not-allowed" : "pointer"
    } `;
    x += freeTrial || shouldDisable(menuLink.slug) ? "text-red-700" : "";
    x += isActive ? " font-bold text-lg" : "";

    return x;
  };

  const iconToUse = () => {
    if (shouldDisable(menuLink.slug)) {
      if (!currentUser?.trial_days_left) {
        return lockClosed;
      }
      if (denyAccess(currentUser)) {
        return lockClosed;
      }
      return lockOpenOutline;
    }
    if (isActive) {
      return menuLink.icon;
    }
    return menuLink.icon;
  };

  return (
    <IonItem
      key={menuLink.id}
      onClick={handleClick(menuLink.slug, menuLink.endpoint)}
      className={`text-sm md:text-md lg:text-lg ${classNameForActive()} w-full`}
      lines="none"
      detail={false}
      ref={itemRef}
    >
      <IonIcon
        icon={iconToUse()}
        className={`mr-2 ${shouldDisable(menuLink.slug) ? "text-red-700" : ""}`}
      />
      <IonLabel className="">
        {menuLink.name}
        <span className="text-xs font-light font-mono ml-2">
          {freeTrial && !denyAccess(currentUser) ? "Free Trial" : ""}
        </span>
      </IonLabel>
    </IonItem>
  );
};

export default MenuListItem;
