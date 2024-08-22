import { useEffect, useRef, useState } from "react";
import { Scenario } from "../../data/scenarios";
import { IonButton, IonButtons, IonIcon, IonLabel } from "@ionic/react";
import {
  copyOutline,
  createOutline,
  chatbubbleEllipsesOutline,
  imageOutline,
} from "ionicons/icons";
import DraggableGrid from "../images/DraggableGrid";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getScreenSizeName } from "../../data/utils";
import { Board } from "../../data/boards";

interface ScenarioViewProps {
  scenario: Scenario;
  showEdit: boolean;
  currentUserTeams?: any;
  inputRef?: any;
  setShowIcon: any;
  showLoading: boolean;
  imageCount?: number;
  numOfColumns: number;
  handleClone?: any;
  showShare?: boolean;
  setShowLoading: any;
}

const ScenarioView: React.FC<ScenarioViewProps> = ({
  scenario,
  showEdit,
  imageCount,
  numOfColumns,
  handleClone,
  setShowLoading,
  showLoading,
}) => {
  const { currentUser } = useCurrentUser();

  return (
    <>
      <div className="flex justify-center items-center my-3">
        <IonButtons slot="end">
          {scenario && (
            <IonButton
              routerLink={`/scenarios/${scenario.id}/chat`}
              className="mr-1 text-xs md:text-md lg:text-lg"
            >
              <IonIcon icon={chatbubbleEllipsesOutline} className="mx-2" />
              <IonLabel>Chat</IonLabel>
            </IonButton>
          )}
          {handleClone && (
            <IonButton
              onClick={handleClone}
              className="mr-1 text-xs md:text-md lg:text-lg"
            >
              <IonIcon
                icon={copyOutline}
                className="mx-1 text-xs md:text-md lg:text-lg"
              />
              <IonLabel>Clone</IonLabel>
            </IonButton>
          )}
          {scenario && showEdit && (
            <IonButton
              routerLink={`/scenarios/${scenario.id}/edit`}
              className="mr-1 text-xs text-xs md:text-md lg:text-lg"
            >
              <IonIcon icon={createOutline} className="mx-2" />
              <IonLabel>Edit</IonLabel>
            </IonButton>
          )}
          {scenario && showEdit && (
            <IonButton
              routerLink={`/scenarios/${scenario.id}/gallery`}
              className="mr-1 text-xs text-xs md:text-md lg:text-lg"
            >
              <IonIcon icon={imageOutline} className="mx-2" />
              <IonLabel>Add</IonLabel>
            </IonButton>
          )}
        </IonButtons>
      </div>
      <IonLabel className="text-xs md:text-md lg:text-lg block text-center">
        <span className="font-bold">{scenario?.name || "this scenario"}</span>
      </IonLabel>

      {imageCount && imageCount < 1 && (
        <div className="text-center pt-32">
          <p>No images found</p>
        </div>
      )}
    </>
  );
};

export default ScenarioView;
