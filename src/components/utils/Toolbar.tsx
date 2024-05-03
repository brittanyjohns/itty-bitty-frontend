import {
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonButtons,
  IonButton,
} from "@ionic/react";
import { albumsOutline, gridOutline, addCircleOutline } from "ionicons/icons";
import React, { useState } from "react";

interface ToolbarProps {
  // Define the props for your component here
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const [segmentType, setSegmentType] = useState("user");
  const handleSegmentChange = (e: CustomEvent) => {
    setSegmentType(e.detail.value);
  };

  return (
    <IonToolbar>
      <IonSegment
        value={segmentType}
        onIonChange={handleSegmentChange}
        className="w-full bg-inherit"
      >
        <IonSegmentButton value="user">
          <IonLabel className="text-md lg:text-lg">Your Boards</IonLabel>
          <IonIcon icon={albumsOutline} />
        </IonSegmentButton>
        <IonSegmentButton value="preset">
          <IonLabel className="text-md lg:text-lg">Preset Boards</IonLabel>
          <IonIcon icon={gridOutline} />
        </IonSegmentButton>
      </IonSegment>
      <IonButtons slot="end">
        <IonButton routerLink="/boards/new">
          <IonIcon icon={addCircleOutline} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
};

export default Toolbar;
