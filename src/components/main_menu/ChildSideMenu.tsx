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

interface SideMenuProps {
  links: MenuLink[];
  currentAccount?: any;
}
const SideMenu: React.FC<SideMenuProps> = ({ links, currentAccount }) => {
  return (
    <>
      <IonToolbar>
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
          <IonTitle className="text-2xl">SpeakAnyWayyy</IonTitle>
        </IonItem>
      </IonToolbar>
      <div className="h-full">
        {currentAccount && (
          <>
            <IonItem
              slot="header"
              routerLink="/dashboard"
              className="hover:cursor-pointer text-wrap"
              detail={true}
            >
              <IonIcon icon={personCircleOutline} className="mr-5"></IonIcon>
              <IonLabel>{currentAccount?.username ?? "No Username"}</IonLabel>
            </IonItem>
          </>
        )}

        {links
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
