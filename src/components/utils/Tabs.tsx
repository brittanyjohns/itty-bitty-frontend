// Tabs.tsx
import React from "react";
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTab,
} from "@ionic/react";
import {
  home,
  imagesOutline,
  albumsOutline,
  peopleCircleOutline,
  fastFoodOutline,
  personCircleOutline,
  ellipseOutline,
  menuOutline,
  menuSharp,
  gridSharp,
} from "ionicons/icons";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { openMenu } from "../main_menu/MainMenu";
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
          <IonTabButton tab="menus" href="/menus">
            <IonIcon icon={fastFoodOutline} />
            <IonLabel>Menus</IonLabel>
          </IonTabButton>
          <IonTabButton tab="teams" href="/teams">
            <IonIcon icon={peopleCircleOutline} />
            <IonLabel>Accounts</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" onClick={openMenu}>
            <IonIcon icon={gridSharp} />
            {/* <IonLabel>Settings</IonLabel> */}
          </IonTabButton>
        </IonTabBar>
      )}
    </>
  );
};
export default Tabs;
