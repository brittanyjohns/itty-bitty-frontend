import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { MenuLink } from "../../data/menu";
import { useHistory } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { lockClosed, lockClosedOutline, lockOpenOutline } from "ionicons/icons";
import { denyAccess } from "../../data/users";
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

  const freeTrial = menuLink.pro && currentUser?.free_trial;

  const [isActive, setIsActive] = useState(false);
  const premiumFeatures = ["menus", "child-accounts", "teams"];
  const shouldDisable = (slug?: string) => {
    if (!slug) {
      return false;
    }

    if (!currentUser) {
      return false;
    }
    if (freeTrial) {
      console.log("free trial");
      if (premiumFeatures.includes(slug)) {
        console.log("premium features");
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
    return false;
  };

  useEffect(() => {
    if (window.location.href.includes(menuLink.slug)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [window.location.href]);
  useEffect(() => {
    if (window.location.href.includes(menuLink.slug)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, []);

  const denyLinkAccess = (slug: string) => {
    if (!currentUser) {
      return true;
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
    if (closeMenu) {
      closeMenu();
    }
    history.push(endpoint ?? "");
  };

  const classNameForActive = () => {
    let x = `hover:cursor-${
      denyLinkAccess(menuLink.slug) ? "not-allowed" : "pointer"
    } `;
    x += freeTrial || shouldDisable() ? "text-red-700" : "";
    x += denyAccess(currentUser) ? " opacity-60" : "";
    x += isActive ? " font-bold text-lg" : "";

    return x;
  };

  const iconToUse = () => {
    if (shouldDisable(menuLink.slug)) {
      if (!currentUser?.trial_days_left) {
        console.log("no trial days left");
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
      className={classNameForActive()}
      lines="none"
      detail={false}
      ref={itemRef}
    >
      <IonIcon
        icon={iconToUse()}
        className={`mr-5 ${shouldDisable(menuLink.slug) ? "text-red-700" : ""}`}
      />
      <IonLabel className="">
        {menuLink.name}
        <span className="text-xs font-light font-mono ml-3">
          {freeTrial && !denyAccess ? "Free Trial" : ""}
        </span>
      </IonLabel>
    </IonItem>
  );
};

export default MenuListItem;
