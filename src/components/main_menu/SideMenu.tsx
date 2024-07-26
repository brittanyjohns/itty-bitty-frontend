import React, { memo, useMemo } from "react";
import { IonItem, IonTitle, IonIcon, IonLabel } from "@ionic/react";
import { MenuLink } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { getImageUrl } from "../../data/utils";
import { personCircleOutline } from "ionicons/icons";

interface SideMenuProps {
  filteredLinks: MenuLink[];
  currentUser?: any;
  hideLogo?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = memo(
  ({ filteredLinks, currentUser, hideLogo }) => {
    const logoSection = useMemo(
      () =>
        !hideLogo && (
          <IonItem
            routerLink="/"
            className="hover:cursor-pointer"
            lines="full"
            detail={false}
          >
            <img
              slot="start"
              src={getImageUrl("round_itty_bitty_logo_1", "png")}
              className="h-10 w-10 mx-auto"
            />
            <IonTitle className="text-2xl">SpeakAnyWay</IonTitle>
          </IonItem>
        ),
      [hideLogo]
    );

    const userSection = useMemo(
      () =>
        currentUser && (
          <IonItem
            slot="header"
            routerLink="/dashboard"
            className="hover:cursor-pointer text-wrap"
            detail={true}
            lines="none"
          >
            <IonIcon icon={personCircleOutline} className="mr-5"></IonIcon>
            <IonLabel>{currentUser?.email ?? "Try it for FREE"}</IonLabel>
          </IonItem>
        ),
      [currentUser]
    );

    const linksSection = useMemo(
      () =>
        filteredLinks
          .sort((a, b) => a.id - b.id)
          .map((menuLink) => (
            <div key={menuLink.id} className="text-white">
              <MenuListItem menuLink={menuLink} />
            </div>
          )),
      [filteredLinks]
    );

    return (
      <>
        <div className="h-full">
          {logoSection}

          {userSection}
          {linksSection}
        </div>
      </>
    );
  }
);

export default SideMenu;
