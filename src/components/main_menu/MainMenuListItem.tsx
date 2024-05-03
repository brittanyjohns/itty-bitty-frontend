import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { MenuLink } from "../../data/menu";
import { useHistory } from "react-router";
import { useRef, useState } from "react";

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
  const [active, setActive] = useState<string | null>(null);

  const handleClick =
    (slug: string | undefined, endpoint: string | undefined) => () => {
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
      className="hover:cursor-pointer active:bg-gray-200"
      lines="full"
      detail={false}
      ref={itemRef}
    >
      <IonIcon icon={menuLink.icon} className="" />
      <IonLabel className="text-xl ml-8">
        <h2>{menuLink.name}</h2>
      </IonLabel>
    </IonItem>
  );
};

export default MenuListItem;
