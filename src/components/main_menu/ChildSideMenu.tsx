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
import "./menu.css";
interface ChildSideMenuProps {
  links: MenuLink[];
  currentAccount?: any;
}
const ChildSideMenu: React.FC<ChildSideMenuProps> = ({
  links,
  currentAccount,
}) => {
  return (
    <>
      <div className="h-full" id="child-side-menu">
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
              <MenuListItem menuLink={menuLink} setActiveItem={() => {}} />
            </div>
          ))}
      </div>
    </>
  );
};

export default ChildSideMenu;
