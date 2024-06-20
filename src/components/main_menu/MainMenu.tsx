import { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
  useIonViewWillLeave,
  useIonViewWillEnter,
  IonItem,
  IonIcon,
} from "@ionic/react";
import { MenuLink, getMenu } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SideMenu from "./SideMenu";
import { homeOutline } from "ionicons/icons";
import { getImageUrl } from "../../data/utils";
import { useHistory } from "react-router";

export const hideMenu = () => {
  const menu = document.querySelector("ion-menu");
  if (menu) {
    menu.close();
  }
};

export const openMenu = () => {
  const menu = document.querySelector("ion-menu");
  if (menu) {
    menu.open();
  }
};

interface MainMenuProps {}
const MainMenu: React.FC<MainMenuProps> = () => {
  const { currentUser, isWideScreen } = useCurrentUser();
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);
  const history = useHistory();
  // Function to filter links based on the current user's status
  const filterList = (links: MenuLink[]) => {
    const signedInLinks = [
      "home",
      "sign-out",
      "boards",
      "images",
      "menus",
      "teams",
      "predictive",
      "settings",
    ];
    const signedOutLinks = ["sign-in", "sign-up", "forgot-password", "home"];

    return links.filter((link) => {
      if (currentUser) {
        return signedInLinks.includes(link.slug ?? "");
      } else {
        return signedOutLinks.includes(link.slug ?? "");
      }
    });
  };

  useIonViewWillEnter(() => {
    const links = getMenu();
    setMenuLinks(links);
    // if (isWideScreen) {
    //   openMenu();
    // }
  }, []);

  useEffect(() => {
    // Now we filter the list whenever menuLinks or currentUser changes
    const filteredList = filterList(menuLinks);
    setFilteredLinks(filteredList);
  }, [menuLinks, currentUser]); // Depend on menuLinks and currentUser

  useIonViewWillLeave(() => {
    hideMenu();
  });

  return (
    <>
      {isWideScreen && (
        <SideMenu filteredLinks={filteredLinks} currentUser={currentUser} />
      )}
      {!isWideScreen && (
        <IonMenu
          contentId="main-content"
          side="start"
          type="overlay"
          swipeGesture={true}
        >
          <IonHeader className="bg-inherit shadow-none">
            <IonToolbar>            
          <img
              slot="start"
              // src="/src/assets/images/round_itty_bitty_logo_1.png"
              src={getImageUrl("round_itty_bitty_logo_1", "png")}
              className=" ml-2 h-10 w-10 mt-1"
            />
            <IonTitle className="text-left" onClick={() => history.push("/")}>
              SpeakAnyWay</IonTitle>
              </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {currentUser && (
              <IonItem
                routerLink="/"
                className="hover:cursor-pointer py-4"
                lines="full"
                detail={false}
              >
                <IonIcon icon={homeOutline} className="" />
                <div className="ml-5 text-xs">
                  <p className="mt-1 font-bold">
                    {currentUser?.email ?? "Guest"}
                  </p>
                  <p className="mt-1 text-xs">
                    {currentUser?.role ?? "free trial"}
                  </p>
                </div>
              </IonItem>
            )}
            <IonList>
              {filteredLinks.map((menuLink) => (
                <MenuListItem
                  key={menuLink.id}
                  menuLink={menuLink}
                  icon={menuLink.icon}
                  closeMenu={hideMenu}
                />
              ))}
            </IonList>
          </IonContent>
        </IonMenu>
      )}
    </>
  );
};

export default MainMenu;
