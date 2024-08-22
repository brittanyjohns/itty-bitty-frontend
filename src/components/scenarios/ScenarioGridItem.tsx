import { IonAlert, IonIcon, IonImg, IonText } from "@ionic/react";
import { Scenario } from "../../data/scenarios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import { generatePlaceholderImage } from "../../data/utils";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { trashBinOutline } from "ionicons/icons";
import { Board } from "../../data/boards";

interface ScenarioListItemProps {
  scenario: Scenario;
  gridType?: string;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  showRemoveBtn?: boolean;
  removeScenario?: any;
  board?: Board;
}

const ScenarioGridItem: React.FC<ScenarioListItemProps> = ({
  scenario,
  board,
  gridType,
  showRemoveBtn,
  removeScenario,
}) => {
  const { currentUser, currentAccount } = useCurrentUser();
  const history = useHistory();
  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(scenario.name),
    [scenario.name]
  );

  const handleScenarioClick = (scenario: any) => {
    if (currentAccount) {
      history.push(`/child-scenarios/${scenario.id}`);
    } else if (gridType === "child") {
      history.push(`/scenarios/${scenario.scenario_id}`);
    } else {
      history.push(`/scenarios/${scenario.id}`);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="cursor-pointer rounded-md w-full text-center p-1 border hover:bg-slate-200 hover:text-slate-800"
        onClick={() => handleScenarioClick(scenario)}
      >
        <IonImg
          src={scenario?.board?.display_image_url || placeholderUrl}
          alt={scenario.name}
          className="ion-img-contain mx-auto"
        />
        <IonText className="text-md md:text-lg">
          {scenario.name.length > 50
            ? `${scenario.name.substring(0, 50)}...`
            : scenario.name}
        </IonText>
      </div>
      {showRemoveBtn && (
        <IonIcon
          slot="icon-only"
          icon={trashBinOutline}
          size="small"
          onClick={() => setIsOpen(true)}
          color="danger"
          className="tiny absolute bottom-3 right-3 cursor-pointer"
        />
      )}
      <IonAlert
        isOpen={isOpen}
        header="Delete Scenario"
        message="Are you sure you want to delete this scenario?"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              setIsOpen(false);
            },
          },
          {
            text: "OK",
            role: "confirm",
            handler: () => {
              removeScenario(scenario);
            },
          },
        ]}
        onDidDismiss={() => setIsOpen(false)}
      ></IonAlert>
    </>
  );
};

export default ScenarioGridItem;
