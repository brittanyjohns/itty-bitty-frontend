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
import { getFilterList, getImageUrl } from "../../data/utils";
import { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
const feature1Image = getImageUrl("round_itty_bitty_logo_1", "png");
interface SideMenuProps {
  filteredLinks: MenuLink[];
  currentUser?: any;
  goToDashboard: () => void;
  currentAccount?: any;
}
const SideMenu: React.FC<SideMenuProps> = (props) => {
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);
  const history = useHistory();
  const { currentUser, currentAccount } = props;

  const filterList = useCallback(() => {
    return getFilterList(currentUser, currentAccount);
  }, [currentUser, currentAccount]);

  useEffect(() => {
    const filtered = filterList();
    setFilteredLinks(filtered);
  }, [filterList]);

  const goToDashboard = () => {
    history.push("/dashboard");
  };
  const feature1Image = getImageUrl("round_itty_bitty_logo_1", "png");

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
            <IonItem
              slot="header"
              routerLink="/dashboard"
              detail={true}
              className=""
              lines="none"
            >
              <IonIcon icon={personCircleOutline} className="mr-3"></IonIcon>
              <IonLabel className="text-xs">
                {currentUser?.email}
                <br></br>
                <span className="text-gray-500 text-xs">
                  {currentUser?.plan_type} - {currentUser?.tokens} tokens
                </span>
              </IonLabel>
            </IonItem>
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
