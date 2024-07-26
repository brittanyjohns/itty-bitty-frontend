import { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
  useIonViewWillLeave,
  IonItem,
  IonIcon,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import { MenuLink, getMenu } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SideMenu from "./SideMenu";
import {
  homeOutline,
  personCircleOutline,
  personOutline,
} from "ionicons/icons";
import { getImageUrl } from "../../data/utils";
import { useHistory } from "react-router";
import ChildSideMenu from "./ChildSideMenu";
import SearchAlert from "../utils/SearchAlert";

export const hideMenu = () => {
  const menu = document.querySelector("ion-menu");
  if (menu) {
    menu.close();
  }
};

export const closeChildMenu = () => {
  const menu = document.querySelector("#child-side-menu");
  if (menu) {
    menu.classList.add("hidden");
  }
};

export const openChildMenu = () => {
  const menu = document.querySelector("#child-side-menu");
  if (menu) {
    menu.classList.remove("hidden");
  }
};

export const openMenu = () => {
  const menu = document.querySelector("ion-menu");
  if (menu) {
    menu.open();
  }
};

interface MainMenuProps {
  hideLogo?: boolean;
}
const MainMenu: React.FC<MainMenuProps> = ({ hideLogo }) => {
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
      // "teams",
      "settings",
    ];
    const professionalProLinks = [
      "home",
      "sign-out",
      "boards",
      "child-accounts",
      "images",
      "menus",
      // "teams",
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
      // "teams",
      "predictive",
      "settings",
    ];

    const freeLinks = [
      "home",
      "sign-out",
      "boards",
      "child-accounts",
      "images",
      // "teams",
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
      // "settings",
      "child-sign-out",
    ];

    if (currentUser) {
      if (currentUser.role === "admin") {
        return links.filter((link) => adminLinks.includes(link.slug ?? ""));
      }
      if (currentUser.plan_type === "Free") {
        return links.filter((link) => freeLinks.includes(link.slug ?? ""));
      }
      if (currentUser.plan_type === "Pro") {
        return links.filter((link) => proLinks.includes(link.slug ?? ""));
      }
      if (
        currentUser.plan_type === "Professional Plus" ||
        currentUser.plan_type === "Premium"
      ) {
        return links.filter((link) =>
          professionalProLinks.includes(link.slug ?? "")
        );
      }
      return links.filter((link) => freeLinks.includes(link.slug ?? ""));
    } else if (currentAccount) {
      return links.filter((link) =>
        childAccountLinks.includes(link.slug ?? "")
      );
    } else if (!currentAccount) {
      return links.filter((link) => signedOutLinks.includes(link.slug ?? ""));
    }
  };

  const setUpMenu = () => {
    const links = getMenu();
    setMenuLinks(links);
    const filteredList = filterList(links);
    if (currentAccount) {
      console.log("Setting up child menu");
    }
    setFilteredLinks(filteredList ?? []);
  };

  useEffect(() => {
    setUpMenu();
  }, [currentUser, currentAccount]);

  useIonViewWillLeave(() => {
    hideMenu();
  });

  return (
    <>
      <IonMenuButton slot="start" />

      {!currentAccount && isWideScreen && (
        <SideMenu
          filteredLinks={filteredLinks}
          currentUser={currentUser}
          hideLogo={hideLogo}
        />
      )}
      {currentAccount && isWideScreen && (
        <ChildSideMenu links={filteredLinks} currentAccount={currentAccount} />
      )}
      {!isWideScreen && (
        <IonMenu
          contentId="main-content"
          side="start"
          type="overlay"
          swipeGesture={false}
        >
          {hideLogo && (
            <div className="flex items-center">
              <img
                slot="start"
                src={getImageUrl("round_itty_bitty_logo_1", "png")}
                className=" ml-2 h-10 w-10 mt-1"
              />
              <div className="font-bold" onClick={() => history.push("/")}>
                SpeakAnyWay
              </div>
            </div>
          )}
          <IonContent className="">
            {currentUser && !currentAccount && (
              <IonItem
                routerLink="/dashboard"
                className="hover:cursor-pointer py-4"
                lines="none"
                detail={false}
              >
                <IonIcon icon={personCircleOutline} className="" />
                <div className="ml-5 text-xs md:text-sm lg:text-base">
                  <p className="mt-1 font-bold">
                    {currentUser?.email ?? "Guest"}
                  </p>
                  <div className="justify-between flex">
                    <p className="mt-1 text-xs md:text-sm lg:text-base">
                      {currentUser?.plan_type ?? "free trial"} plan
                    </p>
                    <p className="mt-1 text-xs md:text-sm lg:text-base">
                      {currentUser?.tokens ?? 0} tokens
                    </p>
                  </div>
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
                <IonIcon icon={personOutline} className="" />
                <div className="ml-5 text-xs">
                  <p className="mt-1 font-bold">
                    {currentAccount?.username ?? "Guest Account"}
                  </p>
                  <p className="mt-1 text-xs">
                    User ID: {currentAccount?.user_id ?? "no user id"}
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
