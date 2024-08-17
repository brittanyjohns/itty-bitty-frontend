import React, { useEffect, useState } from "react";
import {
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonInput,
} from "@ionic/react";

interface Scenario {
  prompt_text?: string;
  id?: string;
  name: string;
  age_range: string;
  displayImage?: string;
  number_of_columns: number;
  number_of_images: number;
  token_limit: number;
  board_id?: string;
  errors?: string[];
}

interface NewScenarioFormProps {
  onSave: any;
  onCancel: () => void;
  scenario: Scenario;
}

const NewScenarioForm: React.FC<NewScenarioFormProps> = ({
  onSave,
  onCancel,
  scenario,
}) => {
  const [promptText, setPromptText] = useState<string>(
    scenario?.prompt_text || ""
  );
  const [ageRange, setAgeRange] = useState<string>(scenario?.age_range || "");
  const [numberOfImages, setNumberOfImages] = useState<number>(
    scenario?.number_of_images || 6
  );
  const [tokenLimit, setTokenLimit] = useState<number>(
    scenario?.token_limit || 0
  );

  const ageRangeList: string[] = [
    "0-3",
    "4-6",
    "7-9",
    "10-12",
    "13-15",
    "16-18",
    "19-21",
    "22-25",
    "26-30",
    "31-35",
    "36-40",
    "41-45",
    "46-50",
    "51-55",
    "56-60",
    "61-65",
    "66-70",
    "71-75",
    "76-80",
    "81-85",
    "86-90",
    "91-95",
    "96-100",
  ];
  const imageOptions = Array.from({ length: 31 }, (_, i) => 6 + i);
  const tokenOptions = Array.from({ length: 37 }, (_, i) => i);
  const [boardName, setBoardName] = useState<string>(scenario.name || "");

  useEffect(() => {
    setBoardName(scenario.name);
    setPromptText(scenario.prompt_text || "");
    setAgeRange(scenario?.age_range || "");
    setNumberOfImages(scenario?.number_of_images || 6);
    setTokenLimit(scenario?.token_limit || scenario?.number_of_images || 6);
  }, [scenario]);

  const handleNumberSelection = (e: any) => {
    const value = parseInt(e, 10);
    setNumberOfImages(value);
    setTokenLimit(value);
  };

  const handlePromptInput = (value: string) => {
    setPromptText(value);
  };

  const handleBoardName = (value: string) => {
    setBoardName(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText === "") {
      alert("Please enter a scenario prompt.");
      return;
    }
    onSave({
      prompt_text: promptText,
      age_range: ageRange,
      number_of_images: numberOfImages,
      token_limit: tokenLimit,
      name: boardName,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Scenario</h2>

          <p className="text-md my-2">
            Enter the scenario you'd like to create a board for.
          </p>
          <IonInput
            value={boardName}
            onIonInput={(e) => handleBoardName(e.detail.value!)}
            placeholder="Ex: 'First day at a new job'"
            className="border rounded md:w-3/4 lg:w-1/2 mx-auto"
          />

          <p className="text-sm my-2">
            Be as descriptive as possible to get the best results.
          </p>
          <IonTextarea
            value={promptText}
            onIonInput={(e) => handlePromptInput(e.detail.value!)}
            placeholder="Ex: 'You are the new employee at a tech company.'"
            className="border rounded md:w-1/2 lg:w-1/2 mx-auto"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:w-3/4 lg:w-1/2 mx-auto">
          <IonSelect
            label="Age of person"
            value={ageRange}
            onIonChange={(e) => setAgeRange(e.detail.value)}
            placeholder="Select Age Range"
            className=""
          >
            {ageRangeList.map((range, index) => (
              <IonSelectOption key={index} value={range}>
                {range}
              </IonSelectOption>
            ))}
          </IonSelect>

          <IonSelect
            label="Number of Images"
            value={numberOfImages}
            onIonChange={(e) => handleNumberSelection(e.detail.value)}
            className=""
          >
            {imageOptions.map((option) => (
              <IonSelectOption key={option} value={option}>
                {option}
              </IonSelectOption>
            ))}
          </IonSelect>
          <div>
            <IonSelect
              label="Token Limit"
              value={tokenLimit}
              onIonChange={(e) => setTokenLimit(parseInt(e.detail.value, 10))}
              className=""
            >
              {tokenOptions.map((option) => (
                <IonSelectOption key={option} value={option}>
                  {option}
                </IonSelectOption>
              ))}
            </IonSelect>
            <p className="text-sm text-red-500 my-2 text-center">
              Note: Setting the token limit to 0 will disable AI image
              generation.<br></br> Placeholder images will be used instead.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4 mx-auto lg:w-1/2">
        <IonButton color="medium" onClick={onCancel}>
          Cancel
        </IonButton>
        <IonButton type="submit" color="primary">
          Save
        </IonButton>
      </div>
    </form>
  );
};

export default NewScenarioForm;
