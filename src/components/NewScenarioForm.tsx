import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonButton } from '@ionic/react';

interface Scenario {
  prompt_text?: string;
  age_range?: string;
  number_of_images?: number;
  token_limit?: number;
  errors?: string[];
}

interface NewScenarioFormProps {
  onSave: any
  onCancel: () => void;
  scenario: Scenario;
}

const NewScenarioForm: React.FC<NewScenarioFormProps> = ({ onSave, onCancel, scenario }) => {
  const [promptText, setPromptText] = useState<string>(scenario?.prompt_text || '');
  const [ageRange, setAgeRange] = useState<string>(scenario?.age_range || '');
  const [numberOfImages, setNumberOfImages] = useState<number>(scenario?.number_of_images || 6);
  const [tokenLimit, setTokenLimit] = useState<number>(scenario?.token_limit || 0);
  
  const ageRangeList: string[] = ['0-3', '4-7', '8-12', '13+']; // Example age ranges
  const imageOptions = Array.from({ length: 31 }, (_, i) => 6 + i);
  const tokenOptions = Array.from({ length: 37 }, (_, i) => i);

  useEffect(() => {
    setPromptText(scenario?.prompt_text || '');
    setAgeRange(scenario?.age_range || '');
    setNumberOfImages(scenario?.number_of_images || 6);
    setTokenLimit(scenario?.token_limit || 0);
  }, [scenario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ prompt_text: promptText, age_range: ageRange, number_of_images: numberOfImages, token_limit: tokenLimit });
  };

  return (
    <IonPage>
      <IonContent className="p-4">
        <form onSubmit={handleSubmit} className="rounded-lg shadow-md p-4">
          {scenario.errors && scenario?.errors?.length > 0 && (
            <div className="text-red-500 p-2">
              <h2>{`${scenario.errors.length} error(s) prohibited this action from being saved:`}</h2>
              <ul>
                {scenario.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="text-center">
              <IonLabel className="block font-bold mb-2">Scenario</IonLabel>
              <p className="text-xs my-2">Enter the scenario you'd like to create a board for.</p>
              <IonTextarea 
                value={promptText}
                onIonChange={(e) => setPromptText(e.detail.value!)}
                placeholder="Ex: 'First day at a new job'"
                rows={6}
                className="border rounded w-full"
              />
            </div>
            <div className="text-center">
              <IonLabel className="block font-bold mb-2">Age</IonLabel>
              <IonSelect 
                value={ageRange} 
                onIonChange={(e) => setAgeRange(e.detail.value)}
                placeholder="Select Age Range"
                className="w-full"
              >
                {ageRangeList.map((range, index) => (
                  <IonSelectOption key={index} value={range}>{range}</IonSelectOption>
                ))}
              </IonSelect>
            </div>
            <div className="text-center">
              <IonLabel className="block font-bold mb-2">Images Count</IonLabel>
              <IonSelect 
                value={numberOfImages}
                onIonChange={(e) => setNumberOfImages(parseInt(e.detail.value, 10))}
                className="w-full"
              >
                {imageOptions.map(option => (
                  <IonSelectOption key={option} value={option}>{option}</IonSelectOption>
                ))}
              </IonSelect>
            </div>
            <div className="text-center">
              <IonLabel className="block font-bold mb-2">Token Limit</IonLabel>
              <IonSelect 
                value={tokenLimit}
                onIonChange={(e) => setTokenLimit(parseInt(e.detail.value, 10))}
                className="w-full"
              >
                {tokenOptions.map(option => (
                  <IonSelectOption key={option} value={option}>{option}</IonSelectOption>
                ))}
              </IonSelect>
              <p className="text-xs text-indigo-500 my-2">Note: A limit of 0 uses only placeholder images.</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <IonButton color="medium" onClick={onCancel}>Cancel</IonButton>
            <IonButton type="submit" color="primary">Save</IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default NewScenarioForm;
