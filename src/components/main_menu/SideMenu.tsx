import { useEffect, useRef, useState } from "react";
import {
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonItem,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { MenuLink, getMenu } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { getImageUrl } from "../../data/utils";
import { personCircleOutline } from "ionicons/icons";
import { h } from "ionicons/dist/types/stencil-public-runtime";

interface SideMenuProps {
  filteredLinks: MenuLink[];
  currentUser?: any;
  hideLogo?: boolean;
}
const SideMenu: React.FC<SideMenuProps> = ({
  filteredLinks,
  currentUser,
  hideLogo,
}) => {
  return (
    <>
      {!hideLogo && (
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
      )}
      <div className="h-full">
        {currentUser && (
          <>
            <IonItem
              slot="header"
              routerLink="/dashboard"
              className="hover:cursor-pointer text-wrap"
              detail={true}
            >
              <IonIcon icon={personCircleOutline} className="mr-5"></IonIcon>
              <IonLabel>{currentUser?.email ?? "Try it for FREE"}</IonLabel>
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
    </>
  );
};

export default SideMenu;
