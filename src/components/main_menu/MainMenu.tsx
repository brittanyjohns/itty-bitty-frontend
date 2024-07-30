import React, { useCallback, useEffect, useState } from "react";
import {
  IonContent,
  IonItem,
  IonIcon,
  IonList,
  IonMenu,
  useIonViewWillLeave,
} from "@ionic/react";
import { MenuLink, getMenu } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SideMenu from "./SideMenu";
import ChildSideMenu from "./ChildSideMenu";
import { getImageUrl } from "../../data/utils";
import { personCircleOutline, personOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import "../../components/main.css";

export const hideMenu = () => {
  // const menu = document.querySelector("ion-menu");
  // menu?.close();
  const menu = document.querySelector("#main-menu");
  menu?.classList.add("hidden");
};

export const openMenu = () => {
  // const menu = document.querySelector("ion-menu");
  // menu?.open();
  const menu = document.querySelector("#main-menu");
  menu?.classList.remove("hidden");
};

export const closeChildMenu = () => {
  const menu = document.querySelector("#child-side-menu");
  if (menu) {
    menu.classList.add("hidden");
  }
};

export const toggleMainMenu = () => {
  const menu = document.querySelector("#main-menu");
  if (menu) {
    menu.classList.toggle("hidden");
  }
};

export const openChildMenu = () => {
  const menu = document.querySelector("#child-side-menu");
  if (menu) {
    menu.classList.remove("hidden");
  }
};

interface MainMenuProps {}

const MainMenu: React.FC<MainMenuProps> = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);
  const history = useHistory();

  const filterList = useCallback(
    (links: MenuLink[]): MenuLink[] => {
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
        "settings",
      ];
      const professionalProLinks = [
        "home",
        "sign-out",
        "boards",
        "child-accounts",
        "images",
        "menus",
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
        "predictive",
        "settings",
      ];
      const freeLinks = [
        "home",
        "sign-out",
        "boards",
        "child-accounts",
        "images",
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
      const childAccountLinks = ["home", "child-boards", "child-sign-out"];

      if (currentUser) {
        if (currentUser.role === "admin") {
          return links.filter((link) => adminLinks.includes(link.slug ?? ""));
        }
        if (currentUser.plan_type === "free") {
          return links.filter((link) => freeLinks.includes(link.slug ?? ""));
        }
        if (currentUser.plan_type === "free") {
          return links.filter((link) => proLinks.includes(link.slug ?? ""));
        }
        if (
          currentUser.plan_type === "professional plus" ||
          currentUser.plan_type === "premium"
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
      } else {
        return links.filter((link) => signedOutLinks.includes(link.slug ?? ""));
      }
    },
    [currentUser, currentAccount]
  );

  const setUpMenu = useCallback(() => {
    const links = getMenu();
    setMenuLinks(links);
    const filteredList = filterList(links);
    setFilteredLinks(filteredList ?? []);
  }, [filterList]);

  useEffect(() => {
    setUpMenu();
    console.log("MainMenu useEffect", isWideScreen);
  }, [setUpMenu]);

  useEffect(() => {
    toggleMainMenu();
  }, [isWideScreen]);

  const feature1Image = getImageUrl("round_itty_bitty_logo_1", "png");

  return (
    <>
      <div className="flex items-center">
        <img slot="start" src={feature1Image} className="ml-4 h-10 w-10 mt-1" />
        <div
          className="font-bold ml-2 hover:cursor-pointer"
          onClick={() => history.push("/")}
        >
          SpeakAnyWay
        </div>
      </div>
      {isWideScreen && (
        <>
          {!currentAccount && (
            <SideMenu filteredLinks={filteredLinks} currentUser={currentUser} />
          )}

          {currentAccount && isWideScreen && (
            <ChildSideMenu
              links={filteredLinks}
              currentAccount={currentAccount}
            />
          )}
        </>
      )}

      {!isWideScreen && (
        <IonMenu
          id="main-menu"
          contentId="main-content"
          side="start"
          type="overlay"
          swipeGesture={false}
        >
          <div className="flex items-center">
            <img
              slot="start"
              src={getImageUrl("round_itty_bitty_logo_1", "png")}
              className="ml-2 h-10 w-10 mt-1"
            />
            <div className="font-bold ml-2" onClick={() => history.push("/")}>
              SpeakAnyWay
            </div>
          </div>
          <IonContent>
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
                lines="none"
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
                  closeMenu={hideMenu}
                  currentLocation={location.pathname}
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
