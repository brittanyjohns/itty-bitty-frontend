import {
  IonItem,
  IonIcon,
  IonLabel,
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonList,
} from "@ionic/react";
import { MenuLink, getMenu } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import {
  arrowForward,
  arrowForwardCircleOutline,
  logOutOutline,
  personCircleOutline,
} from "ionicons/icons";
import { getImageUrl } from "../../data/utils";
import ColorKey from "../utils/ColorKey";
interface SideMenuProps {
  filteredLinks: MenuLink[];
  currentUser?: any;
  goToDashboard: () => void;
  currentAccount?: any;
}
const SideMenu: React.FC<SideMenuProps> = (props) => {
  const { currentUser, currentAccount, filteredLinks, goToDashboard } = props;

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
          <IonList>
            {currentUser && (
              <IonItem
                slot="header"
                routerLink="/settings"
                detail={true}
                className=""
                lines="none"
              >
                <IonIcon icon={personCircleOutline} className="mr-3"></IonIcon>
                <p className="text-xs">
                  {currentUser?.email}
                  <br></br>
                  <span className="text-gray-500 text-xs">
                    {currentUser?.plan_type} - {currentUser?.tokens} tokens
                  </span>
                </p>
              </IonItem>
            )}
            {currentAccount && (
              <>
                <IonItem
                  slot="header"
                  routerLink="/account-dashboard"
                  className=""
                  lines="none"
                >
                  <IonIcon
                    icon={personCircleOutline}
                    className="mr-3"
                  ></IonIcon>
                  <p className="text-xs">
                    {currentAccount.name}
                    <br></br>
                    <span className="text-gray-500 text-xs">
                      username: {currentAccount.username}
                    </span>
                  </p>
                </IonItem>
                <IonItem
                  slot="header"
                  routerLink="/account-dashboard"
                  className=""
                  lines="none"
                >
                  <IonIcon
                    size="small"
                    icon={arrowForward}
                    className="mr-2 ml-3"
                  ></IonIcon>
                  <p className="text-xs">
                    <span className="text-gray-500 text-xs">
                      You have {currentAccount.boards?.length || 0} board
                      {currentAccount.boards?.length === 1 ? "" : "s"}
                    </span>
                    <br></br>
                    <span className="text-gray-500 text-xs">
                      Parent account: {currentAccount.parent_name}
                    </span>
                  </p>
                </IonItem>
              </>
            )}
            {filteredLinks.map((link) => (
              <IonItem key={link.id} lines={currentAccount ? "none" : "full"}>
                <MenuListItem menuLink={link} />
              </IonItem>
            ))}
            <IonItem lines="none">
              {(currentUser || currentAccount) && <ColorKey />}
            </IonItem>
            <IonItem lines="none">
              {currentAccount && (
                <MenuListItem
                  menuLink={{
                    id: 0,
                    name: "Sign Out",
                    slug: "child-sign-out",
                    icon: arrowForwardCircleOutline,
                    endpoint: "/child-accounts/sign-out",
                  }}
                />
              )}
              {currentUser && (
                <MenuListItem
                  menuLink={{
                    id: 0,
                    name: "Sign Out",
                    slug: "sign-out",
                    icon: logOutOutline,
                    endpoint: "/users/sign-out",
                  }}
                />
              )}
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
