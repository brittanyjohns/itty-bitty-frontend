import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
} from "@ionic/react";
import { language } from "ionicons/icons";
import { set } from "react-hook-form";
import { UserSetting } from "../data/users";

interface UserSettingsFormProps {
  onSave: any;
  onCancel: () => void;
  existingUserSetting?: UserSetting;
}

const UserSettingsForm: React.FC<UserSettingsFormProps> = ({
  onSave,
  onCancel,
  existingUserSetting,
}) => {
  const [userSetting, setUserSetting] = useState<UserSetting | null>(null);
  const [voice, setVoice] = useState<string>(
    existingUserSetting?.voice?.name || ""
  );
  const [language, setLanguage] = useState<string>(
    existingUserSetting?.voice.language || ""
  );
  const [speed, setSpeed] = useState<number>(
    existingUserSetting?.voice.speed || 1
  );
  const [pitch, setPitch] = useState<number>(
    existingUserSetting?.voice.pitch || 1
  );

  const voiceList: string[] = ["alloy", "onyx", "shimmer"];
  const languageOptions = ["English", "Spanish", "French"];
  const decimalOptions = [0.5, 1, 1.5, 2];

  useEffect(() => {
    setUserSetting(userSetting);
  }, [userSetting]);

  useEffect(() => {
    setVoice(existingUserSetting?.voice?.name || "");
    setLanguage(existingUserSetting?.voice?.language || "");
    setSpeed(existingUserSetting?.voice?.speed || 1);
    setPitch(existingUserSetting?.voice?.pitch || 1);
  }, [existingUserSetting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settingToSave = {
      user: {
        voice: {
          name: voice,
          language: language,
          speed: speed,
          pitch: pitch,
        },
      },
    };

    onSave(settingToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {userSetting && userSetting.errors && userSetting?.errors?.length > 0 && (
        <div className="text-red-500 p-2">
          <h2>{`${userSetting.errors.length} error(s) prohibited this action from being saved:`}</h2>
          <ul>
            {userSetting.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="text-center">
          <IonLabel className="">Settings</IonLabel>
          <IonSelect
            label="Voice"
            value={voice}
            onIonChange={(e) => setVoice(e.detail.value)}
            placeholder="Select Voice"
            className=""
          >
            {voiceList.map((range, index) => (
              <IonSelectOption key={index} value={range}>
                {range}
              </IonSelectOption>
            ))}
          </IonSelect>

          <IonSelect
            label="Language"
            value={language}
            onIonChange={(e) => setLanguage(e.detail.value)}
            className=""
          >
            {languageOptions.map((option) => (
              <IonSelectOption key={option} value={option}>
                {option}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonSelect
            label="Speed"
            value={speed}
            onIonChange={(e) => setSpeed(parseFloat(e.detail.value))}
            className=""
          >
            {decimalOptions.map((option) => (
              <IonSelectOption key={option} value={option}>
                {option}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonSelect
            label="Pitch"
            value={pitch}
            onIonChange={(e) => setPitch(parseFloat(e.detail.value))}
            className=""
          >
            {decimalOptions.map((option) => (
              <IonSelectOption key={option} value={option}>
                {option}
              </IonSelectOption>
            ))}
          </IonSelect>
        </div>
      </div>

      <div className="flex justify-between mt-4">
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

export default UserSettingsForm;
