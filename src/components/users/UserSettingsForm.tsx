import React, { useEffect, useState } from "react";
import {
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonToggle,
  IonItem,
} from "@ionic/react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { denyAccess, classNameForInput } from "../../data/users";

interface VoiceSetting {
  name?: string;
  language?: string;
  speed?: number;
  pitch?: number;
  rate?: number;
  volume?: number;
}

interface UserSetting {
  voice?: VoiceSetting;
  wait_to_speak?: boolean;
  disable_audit_logging?: boolean;
  [key: string]: any; // Index signature for dynamic keys
}

interface UserSettingsFormProps {
  onSave: (settings: UserSetting) => void;
  onCancel: () => void;
  existingUserSetting?: UserSetting;
}

const settingsConfig = [
  {
    key: "voice.name",
    label: "Voice",
    description: "Select a default voice for text-to-speech.",
    type: "select",
    options: ["alloy", "onyx", "shimmer", "nova", "fable"],
  },
  {
    key: "voice.language",
    label: "Language",
    type: "select",
    options: ["English", "Spanish", "French"],
  },
  {
    key: "voice.speed",
    label: "Speed",
    type: "select",
    options: [0.5, 1, 1.5, 2],
  },
  {
    key: "voice.pitch",
    label: "Pitch",
    type: "select",
    options: [0.5, 1, 1.5, 2],
  },
  {
    key: "wait_to_speak",
    label: "Wait To Speak",
    description: "Stop audio playback when user clicks each word.",
    type: "toggle",
  },
  {
    key: "disable_audit_logging",
    label: "Disable Audit Logging",
    description: "Disable logging of user actions.",
    type: "toggle",
  },
];

const getNestedProperty = (obj: any, path: string, defaultValue: any) => {
  return path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), obj);
};

const setNestedProperty = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const deep = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
  deep[lastKey] = value;
};

const UserSettingsForm: React.FC<UserSettingsFormProps> = ({
  onSave,
  onCancel,
  existingUserSetting = {},
}) => {
  const [settings, setSettings] = useState<UserSetting>({});

  useEffect(() => {
    const initialSettings = settingsConfig.reduce((acc, setting) => {
      const value = getNestedProperty(
        existingUserSetting,
        setting.key,
        setting.type === "toggle" ? false : ""
      );
      setNestedProperty(acc, setting.key, value);
      return acc;
    }, {} as UserSetting);
    setSettings(initialSettings);
  }, [existingUserSetting]);

  const handleChange = (key: string, value: any) => {
    console.log("handleChange", key, value);
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings };
      setNestedProperty(updatedSettings, key, value);
      return updatedSettings;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  const { currentUser } = useCurrentUser();

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="">
        <div className="text-justify">
          <IonLabel>Settings</IonLabel>
          {settingsConfig.map((setting) => (
            <IonItem key={setting.key} lines="none" className="mt-2 p-2 border">
              <IonLabel>{setting.label}</IonLabel>
              {setting.type === "select" && (
                <IonSelect
                  aria-label="Select Voice"
                  value={getNestedProperty(settings, setting.key, "")}
                  onIonChange={(e) => handleChange(setting.key, e.detail.value)}
                  placeholder={`Select ${setting.label}`}
                  disabled={denyAccess(currentUser)}
                  className={`${classNameForInput(currentUser)} ml-4`}
                >
                  {setting.options &&
                    setting.options.map((option: any) => (
                      <IonSelectOption key={option} value={option}>
                        {option}
                      </IonSelectOption>
                    ))}
                </IonSelect>
              )}
              {setting.type === "toggle" && (
                <>
                  <IonToggle
                    aria-label={setting.label}
                    className="mt-2 ml-4"
                    checked={getNestedProperty(settings, setting.key, false)}
                    onIonChange={(e) =>
                      handleChange(setting.key, e.detail.checked)
                    }
                  />
                  <p className="text-xs mt-2 ml-2 font-light">
                    {setting.description}
                  </p>
                </>
              )}
            </IonItem>
          ))}
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
