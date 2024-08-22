// src/components/ScenarioForm.tsx

import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonTextarea,
  IonLoading,
  IonAlert,
} from "@ionic/react";
import { Scenario, ScenarioData, createScenario } from "../../data/scenarios";
interface ScenarioFormProps {
  onSave: any;
  onCancel: () => void;
}
const ScenarioForm: React.FC<ScenarioFormProps> = () => {
  const [name, setName] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: Scenario) => {
    const newScenario = await createScenario(data);
    if (newScenario.errors && newScenario.errors.length > 0) {
      console.error("Error creating scenario", newScenario.errors);
      alert(`Error creating scenario: ${newScenario.errors.join(", ")}`);
    } else {
      console.log("Scenario created", newScenario);
      const boardId = newScenario.board_id;
    }
  };

  const handleSubmit = async (data: Scenario) => {
    setLoading(true);
    const newScenario = await createScenario(data);
    setLoading(false);

    if (response) {
      setQuestion(response.question_1);
    } else {
      setError("Failed to create scenario");
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonItem>
          <IonLabel position="floating">Name</IonLabel>
          <IonInput
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
            required
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Age Range</IonLabel>
          <IonInput
            value={ageRange}
            onIonChange={(e) => setAgeRange(e.detail.value!)}
            required
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Initial Description</IonLabel>
          <IonTextarea
            value={initialDescription}
            onIonChange={(e) => setInitialDescription(e.detail.value!)}
            required
          />
        </IonItem>
        <IonButton expand="full" onClick={handleSubmit}>
          Create Scenario
        </IonButton>

        <IonLoading isOpen={loading} message={"Please wait..."} />

        {question && (
          <IonItem>
            <IonLabel>{question}</IonLabel>
          </IonItem>
        )}

        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header={"Error"}
          message={"Failed to create scenario"}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ScenarioForm;
