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
  const onSubmit = async (data: Scenario) => {
    const newScenario = await createScenario(data);
    if (newScenario.errors && newScenario.errors.length > 0) {
      console.error("Error creating scenario", newScenario.errors);
    } else {
      console.log("Scenario created", newScenario);
      props.history.push("/boards");
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
          scenario={{}}
        />
      </IonContent>
    </IonPage>
  );
};

export default NewScenario;
