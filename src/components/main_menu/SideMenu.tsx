import { IonItem, IonIcon, IonLabel } from "@ionic/react";
import { MenuLink, getMenu } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { personCircleOutline } from "ionicons/icons";

interface SideMenuProps {
  filteredLinks: MenuLink[];
  currentUser?: any;
}
const SideMenu: React.FC<SideMenuProps> = ({ filteredLinks, currentUser }) => {
  return (
    <>
      <div className="h-full">
        {currentUser && (
          <>
            <IonItem
              slot="header"
              routerLink="/dashboard"
              detail={true}
              className=""
              lines="none"
            >
              <IonIcon icon={personCircleOutline} className="mr-3"></IonIcon>
              <IonLabel className="text-xs">{currentUser?.email}</IonLabel>
            </IonItem>
          </>
        )}

        {filteredLinks
          .sort((a, b) => a.id - b.id)
          .map((menuLink) => (
            <div key={menuLink.id} className="text-white">
              <MenuListItem menuLink={menuLink} />
            </div>
          ))}
      </div>
    </>
  );
};

export default SideMenu;
