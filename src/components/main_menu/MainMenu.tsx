import React, { useCallback, useEffect, useState } from "react";
import { IonContent, IonItem, IonIcon, IonList, IonMenu } from "@ionic/react";
import { MenuLink, getMenu } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SideMenu from "./SideMenu";
import ChildSideMenu from "./ChildSideMenu";
import { getImageUrl } from "../../data/utils";
import { personCircleOutline, personOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import "../../components/main.css";

import { closeMainMenu } from "../../pages/MainHeader";

interface MainMenuProps {}

const MainMenu: React.FC<MainMenuProps> = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
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
    const filteredList = filterList(links);
    setFilteredLinks(filteredList ?? []);
  }, [filterList]);

  useEffect(() => {
    setUpMenu();
    console.log("MainMenu useEffect", isWideScreen);
  }, [setUpMenu]);

  // useEffect(() => {
  //   toggleMainMenu();
  // }, [isWideScreen]);

  const goToDashboard = () => {
    closeMainMenu();
    // if (currentAccount) {
    //   toggleChildMenu();
    // } else {
    //   toggleSideMenu();
    // }
    history.push("/home");
  };

  const feature1Image = getImageUrl("round_itty_bitty_logo_1", "png");

  return (
    <>
      <div className="flex items-center">
        <img slot="start" src={feature1Image} className="ml-4 h-10 w-10" />
        <div
          className="font-bold ml-2 hover:cursor-pointer"
          onClick={goToDashboard}
        >
          SpeakAnyWay
        </div>
      </div>
      <SideMenu
        filteredLinks={filteredLinks}
        currentUser={currentUser}
        goToDashboard={goToDashboard}
      />
    </>
  );
};

export default MainMenu;
