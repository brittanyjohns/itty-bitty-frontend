import { Scenario, createScenario } from "../../data/scenarios";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import NewScenarioForm from "../../components/scenarios/NewScenarioForm";
import { useState } from "react";
import MainMenu from "../../components/main_menu/MainMenu";

const NewScenario: React.FC = (props: any) => {
  const [numOfImages, setNumOfImages] = useState(12); // [1]
  const initialScenario: Scenario = {
    name: "",
    age_range: "0-3",
    number_of_columns: 2,
    number_of_images: numOfImages,
    token_limit: numOfImages,
  };
  const onSubmit = async (data: Scenario) => {
    const newScenario = await createScenario(data);
    if (newScenario.errors && newScenario.errors.length > 0) {
      console.error("Error creating scenario", newScenario.errors);
      alert(`Error creating scenario: ${newScenario.errors.join(", ")}`);
    } else {
      console.log("Scenario created", newScenario);
      const boardId = newScenario.board_id;
      props.history.push("/boards/" + boardId);
    }
  };
  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/boards" />
            </IonButtons>
            <IonTitle>New Scenario</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={true} className="ion-padding">
          <NewScenarioForm
            onSave={onSubmit}
            onCancel={() => props.history.push("/boards")}
            scenario={initialScenario}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default NewScenario;
