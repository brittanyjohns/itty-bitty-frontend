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
} from "ionicons/icons";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { toggleMainMenu } from "../../pages/MainHeader";
const Tabs: React.FC = () => {
  const { isWideScreen } = useCurrentUser();

  return (
    <IonTabBar>
      <IonTabButton tab="home" href="/home" className="ml-1">
        <IonIcon icon={home} size="small" />
        <IonLabel className="text-xs">Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="boards" href="/boards">
        <IonIcon icon={albumsOutline} />
        <IonLabel>Boards</IonLabel>
      </IonTabButton>
      <IonTabButton tab="images" href="/images">
        <IonIcon icon={imagesOutline} />
        <IonLabel>Images</IonLabel>
      </IonTabButton>
      <IonTabButton tab="accounts" href="/child-accounts">
        <IonIcon icon={peopleCircleOutline} />
        <IonLabel>Accounts</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings" onClick={toggleMainMenu}>
        <IonIcon icon={menuSharp} />
        <IonLabel>Menu</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};
export default Tabs;
