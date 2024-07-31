// Tabs.tsx
import React from "react";
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import {
  home,
  imagesOutline,
  albumsOutline,
  peopleCircleOutline,
  menuSharp,
} from "ionicons/icons";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { toggleMainMenu } from "../../pages/MainHeader";
const Tabs: React.FC = () => {
  const { isWideScreen } = useCurrentUser();

  return (
    <>
      {!isWideScreen && (
        <IonTabBar slot="bottom" className="">
          <IonTabButton tab="home" href="/home" className="">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="boards" href="/boards">
            <IonIcon icon={albumsOutline} />
            <IonLabel>Boards</IonLabel>
          </IonTabButton>
          <IonTabButton tab="images" href="/images">
            <IonIcon icon={imagesOutline} />
            <IonLabel>Images</IonLabel>
          </IonTabButton>
          {/* <IonTabButton tab="menus" href="/menus">
            <IonIcon icon={fastFoodOutline} />
            <IonLabel>Menus</IonLabel>
          </IonTabButton> */}
          <IonTabButton tab="accounts" href="/child-accounts">
            <IonIcon icon={peopleCircleOutline} />
            <IonLabel>Accounts</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" onClick={toggleMainMenu}>
            <IonIcon icon={menuSharp} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      )}
    </>
  );
};
export default Tabs;
