import { Scenario, createScenario } from "../../data/scenarios";
import {
  IonBackButton,
  IonBackdrop,
  IonButtons,
  IonContent,
  IonHeader,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import NewScenarioForm from "../../components/scenarios/NewScenarioForm";
import { useState } from "react";
import SideMenu from "../../components/main_menu/SideMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import HelpPopup from "../../components/utils/HelpPopup";
import { additionalText, helpItems } from "../../data/help";
import HelpList from "../../components/utils/HelpPopup";

const NewScenario: React.FC = (props: any) => {
  const [numOfImages, setNumOfImages] = useState(12); // [1]
  const initialScenario: Scenario = {
    name: "",
    age_range: "0-3",
    number_of_columns: 2,
    number_of_images: numOfImages,
    token_limit: numOfImages,
  };
  const { currentUser, currentAccount, isWideScreen } = useCurrentUser();
  const [showLoading, setShowLoading] = useState(false);

  const onSubmit = async (data: Scenario) => {
    const newScenario = await createScenario(data);
    if (newScenario.errors && newScenario.errors.length > 0) {
      console.error("Error creating scenario", newScenario.errors);
      alert(`Error creating scenario: ${newScenario.errors.join(", ")}`);
    } else {
      console.log("Scenario created", newScenario);
      props.history.push("/scenarios/" + newScenario.id + "/chat");
    }
  };
  return (
    <>
      <SideMenu
        pageTitle="New Scenario"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="New Scenario"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="New Scenario"
          isWideScreen={isWideScreen}
          startLink="/scenarios"
        />
        <IonContent fullscreen scrollY={true} className="ion-padding">
          <IonLoading message="Please wait..." isOpen={showLoading} />
          <div className="flex justify-end">
            <HelpList items={helpItems} additionalText={additionalText} />
          </div>
          <NewScenarioForm
            setShowLoading={setShowLoading}
            onSave={onSubmit}
            onCancel={() => props.history.push("/scenarios")}
            scenario={initialScenario}
          />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default NewScenario;
