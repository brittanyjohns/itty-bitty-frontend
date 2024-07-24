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
import ChildSideMenu from "./ChildSideMenu";
import { set } from "react-hook-form";

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
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);
  const history = useHistory();
  // Function to filter links based on the current user's status
  const filterList = (links: MenuLink[]) => {
    const adminLinks = [
      "home",
      "sign-out",
      "boards",
      "child-accounts",
      "images",
      "menus",
      "teams",
      "predictive",
      "settings",
      "admin-dashboard",
    ];
    const professionalLinks = [
      "home",
      "sign-out",
      "boards",
      "child-accounts",
      "images",
      "teams",
      "settings",
    ];
    const professionalProLinks = [
      "home",
      "sign-out",
      "boards",
      "child-accounts",
      "images",
      "menus",
      "teams",
      "predictive",
      "settings",
    ];
    const proLinks = [
      "home",
      "sign-out",
      "boards",
      "child-accounts",
      "images",
      "menus",
      "teams",
      "predictive",
      "settings",
    ];

    const freeLinks = [
      "home",
      "sign-out",
      "boards",
      "child-accounts",
      "images",
      "teams",
      "menus",
      "predictive",
      "settings",
    ];
    const signedOutLinks = [
      "sign-in",
      "sign-up",
      "forgot-password",
      "home",
      "pricing",
      "about",
    ];
    const childAccountLinks = [
      "home",
      "child-boards",
      "settings",
      "child-sign-out",
    ];

    return links.filter((link) => {
      if (currentUser) {
        if (currentUser.role === "admin") {
          return adminLinks.includes(link.slug ?? "");
        }
        if (currentUser.plan_type === "Free") {
          return freeLinks.includes(link.slug ?? "");
        }
        if (currentUser.plan_type === "Pro") {
          return proLinks.includes(link.slug ?? "");
        }
        if (currentUser.plan_type === "Professional Plus") {
          return professionalProLinks.includes(link.slug ?? "");
        }
        if (currentUser.plan_type === "Premium") {
          return professionalProLinks.includes(link.slug ?? "");
        }
        return freeLinks.includes(link.slug ?? "");
      } else if (currentAccount) {
        return childAccountLinks.includes(link.slug ?? "");
      } else {
        return signedOutLinks.includes(link.slug ?? "");
      }
    });
  };

  // useIonViewWillEnter(() => {
  //   const links = getMenu();
  //   if (currentUser?.role === "admin") {
  //     console.log("getMenu", currentUser);
  //     links.push({
  //       endpoint: "/admin-dashboard",
  //       name: "Admin Dashboard",
  //       slug: "admin-dashboard",
  //       icon: homeOutline,
  //       id: 8888,
  //     });
  //   }
  //   console.log("getMenu", links);
  //   setMenuLinks(links);
  // }, []);

  useEffect(() => {
    console.log("getMenu", currentUser);
    const links = getMenu();
    setMenuLinks(links);
    // Now we filter the list whenever menuLinks or currentUser changes
    const filteredList = filterList(links);
    setFilteredLinks(filteredList);
  }, [menuLinks, currentUser, currentAccount]); // Depend on menuLinks and currentUser

  useIonViewWillLeave(() => {
    hideMenu();
  });

  return (
    <>
      {!currentAccount && isWideScreen && (
        <SideMenu filteredLinks={filteredLinks} currentUser={currentUser} />
      )}
      {currentAccount && isWideScreen && (
        <ChildSideMenu links={filteredLinks} currentAccount={currentAccount} />
      )}
      {!isWideScreen && (
        <IonMenu
          contentId="main-content"
          side="start"
          type="overlay"
          swipeGesture={true}
        >
          <IonHeader className="shadow-none">
            <IonToolbar>
              <img
                slot="start"
                src={getImageUrl("round_itty_bitty_logo_1", "png")}
                className=" ml-2 h-10 w-10 mt-1"
              />
              <IonTitle className="text-left" onClick={() => history.push("/")}>
                SpeakAnyWay
              </IonTitle>
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
                    {currentUser?.plan_type ?? "free trial"}
                  </p>
                </div>
              </IonItem>
            )}
            {currentAccount && (
              <IonItem
                routerLink="/"
                className="hover:cursor-pointer py-4"
                lines="full"
                detail={false}
              >
                <IonIcon icon={homeOutline} className="" />
                <div className="ml-5 text-xs">
                  <p className="mt-1 font-bold">
                    {currentAccount?.username ?? "Guest Account"}
                  </p>
                  <p className="mt-1 text-xs">
                    {currentAccount?.user_id ?? "no user id"}
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
