import {
  IonItem,
  IonIcon,
  IonLabel,
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { MenuLink, getMenu } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { personCircleOutline } from "ionicons/icons";
import { getImageUrl } from "../../data/utils";
const feature1Image = getImageUrl("round_itty_bitty_logo_1", "png");
interface SideMenuProps {
  filteredLinks: MenuLink[];
  currentUser?: any;
  goToDashboard: () => void;
}
const SideMenu: React.FC<SideMenuProps> = ({
  filteredLinks,
  currentUser,
  goToDashboard,
}) => {
  return (
    <IonMenu menuId="main-menu" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <img slot="start" src={feature1Image} className="ml-4 h-10 w-10" />
          <div
            className="font-bold ml-2 hover:cursor-pointer"
            onClick={goToDashboard}
          >
            SpeakAnyWay
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
