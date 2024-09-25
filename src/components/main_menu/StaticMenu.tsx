import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
} from "@ionic/react";
import {
  arrowForward,
  arrowForwardCircleOutline,
  informationCircleOutline,
  logOutOutline,
  personCircleOutline,
} from "ionicons/icons";
import { MenuLink } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { getFilterList, getImageUrl } from "../../data/utils";
import { useEffect, useState, useCallback, useRef } from "react";
import { User } from "../../data/users";
import { ChildAccount } from "../../data/child_accounts";
import ColorKey from "../utils/ColorKey";
import { useHistory } from "react-router";
import { useCurrentUser } from "../../contexts/UserContext";
import { closeMainMenu } from "../../pages/MainHeader";

interface StaticMenuProps {
  pageTitle?: string;
  isWideScreen?: boolean;
  currentUser?: User | null;
  currentAccount?: ChildAccount | null;
}

const StaticMenu: React.FC<StaticMenuProps> = (props) => {
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);
  const { currentUser, currentAccount } = props;
  const history = useHistory();
  const { isWideScreen } = useCurrentUser();
  const menuRef = useRef<HTMLDivElement>(null);

  // const filterList = useCallback(() => {
  //   return getFilterList(currentUser, currentAccount);
  // }, [currentUser, currentAccount]);

  useEffect(() => {
    window.addEventListener("resize", hideSelf);
    return () => {
      window.removeEventListener("resize", hideSelf);
    };
  }, []);
  useEffect(() => {
    hideSelf();
  }, [isWideScreen]);

  const hideSelf = () => {
    const classToSet = isWideScreen ? "block" : "none";
    if (menuRef.current) {
      menuRef.current.style.display = classToSet;
    }
  };

  const feature1Image = getImageUrl("round_itty_bitty_logo_1", "png");
  useEffect(() => {
    const list = getFilterList(currentUser, currentAccount);
    setFilteredLinks(list);
  }, []);

  useEffect(() => {
    const list = getFilterList(currentUser, currentAccount);
    setFilteredLinks(list);
  }, [currentUser, currentAccount]);

  return (
    <div className="h-full overflow-y-scroll" id="static-menu" ref={menuRef}>
      <IonToolbar>
        <img slot="start" src={feature1Image} className="ml-2 h-10 w-10" />
        <div
          className="font-bold ml-2 hover:cursor-pointer"
          onClick={() => {
            currentAccount
              ? history.push("/account-dashboard")
              : history.push("/home");
          }}
        >
          SpeakAnyWay
        </div>
      </IonToolbar>
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
              <IonIcon icon={personCircleOutline} className="mr-3"></IonIcon>
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
              className="border-t-2 border-b-2"
              lines="none"
            >
              <p className="text-gray-500 text-xs font-bold ml-10">
                {/* {"enable_text_display":false,"enable_image_display":true} */}
                {currentAccount.settings.enable_text_display
                  ? "Text Display Enabled"
                  : ""}
                {currentAccount.settings.enable_image_display
                  ? "Image Display Enabled"
                  : ""}
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
            <IonItem
              slot="header"
              routerLink="/account-dashboard"
              className=""
              lines="none"
            >
              <ColorKey />
            </IonItem>
          </>
        )}
        {!currentAccount &&
          filteredLinks.map((link) => (
            <IonItem key={link.id} lines={currentAccount ? "none" : "full"}>
              <MenuListItem menuLink={link} />
            </IonItem>
          ))}
        <IonItem lines="none">{currentUser && <ColorKey />}</IonItem>
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
  );
};

export default StaticMenu;
