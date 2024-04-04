import { Scenario, createScenario } from "../data/scenarios";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import NewScenarioForm from "../components/NewScenarioForm";

const NewScenario: React.FC = (props: any) => {
  const initialScenario: Scenario = {
    name: "",
    age_range: "0-3",
    number_of_columns: 2,
    number_of_images: 6,
    token_limit: 0,
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
    <IonPage id="new-scenario-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/boards" />
          </IonButtons>
          <IonTitle>New Scenario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <NewScenarioForm
          onSave={onSubmit}
          onCancel={() => props.history.push("/boards")}
          scenario={initialScenario}
        />
      </IonContent>
    </IonPage>
  );
};

export default NewScenario;
