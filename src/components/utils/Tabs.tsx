// Tabs.tsx
import React from "react";
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import {
  home,
  imagesOutline,
  albumsOutline,
  peopleCircleOutline,
  menuSharp,
  cogOutline,
  settingsOutline,
  searchSharp,
  gridOutline,
  infinite,
  infiniteOutline,
  flower,
  flowerOutline,
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
          <IonTabButton tab="preset" href="/preset">
            <IonIcon icon={gridOutline} />
            <IonLabel>Presets</IonLabel>
          </IonTabButton>
          <IonTabButton tab="images" href="/images">
            <IonIcon icon={imagesOutline} />
            <IonLabel>Images</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" onClick={toggleMainMenu}>
            <IonIcon icon={menuSharp} />
            <IonLabel>Menu</IonLabel>
          </IonTabButton>
        </IonTabBar>
      )}
    </>
  );
};
export default Tabs;
