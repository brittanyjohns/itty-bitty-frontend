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
  filteredLinks: MenuLink[];
  currentUser?: any;
}
const SideMenu: React.FC<SideMenuProps> = ({ filteredLinks, currentUser }) => {
  return (
    <>
      {/* <IonToolbar>
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
          <IonTitle className="text-2xl">SpeakAnyWaeey</IonTitle>
        </IonItem>
      </IonToolbar> */}
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
            {/* <IonAccordionGroup ref={accordionGroup}>
              <IonAccordion value="second">
                <div className="pl-5 text-lg" slot="content">
                  <IonIcon
                    icon={personCircleOutline}
                    className=""
                    onClick={() => {
                      history.push("/");
                      setIsOpen(false);
                    }}
                  />
                  <IonLabel
                    className="text-xl"
                    onClick={() => {
                      history.push("/");
                      setIsOpen(false);
                    }}
                  ></IonLabel>
                  <IonLabel
                    className="ml-2 hover:cursor-pointer"
                    onClick={() => {
                      history.push("/dashboard");
                      setIsOpen(false);
                    }}
                  >
                    Dashboard
                    <p className="mt-1 text-xs">
                      <span className="font-bold"> Plan type:</span>{" "}
                      {currentUser?.plan_type ?? "free trial"}
                    </p>
                    <p className="mt-1 text-xs">
                      <span className="font-bold"> Tokens:</span>{" "}
                      {currentUser?.tokens ?? 0}
                    </p>
                  </IonLabel>
                </div>
              </IonAccordion>
            </IonAccordionGroup> */}
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
