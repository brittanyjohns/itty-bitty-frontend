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
import { key } from "ionicons/icons";

interface VoiceSetting {
  name?: string;
  language?: string;
  speed?: number;
  pitch?: number;
  rate?: number;
  volume?: number;
}

interface AdminUserSetting {
  voice?: VoiceSetting;
  wait_to_speak?: boolean;
  disable_audit_logging?: boolean;
  locked?: boolean;
  enable_text_display?: boolean;
  enable_image_display?: boolean;
  plan_type?: string;
  [key: string]: any; // Index signature for dynamic keys
}

interface AdminUserSettingsFormProps {
  onSave: (settings: AdminUserSetting, userId: string) => void;
  onCancel: () => void;
  existingUserSetting?: AdminUserSetting;
  userId: string;
}

const getNestedProperty = (obj: any, path: string, defaultValue: any) => {
  return path
    .split(".")
    .reduce((o, p) => (o && o[p] !== undefined ? o[p] : defaultValue), obj);
};

const setNestedProperty = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const deep = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
  deep[lastKey] = value;
};

const AdminUserSettingsForm: React.FC<AdminUserSettingsFormProps> = ({
  onSave,
  onCancel,
  existingUserSetting,
  userId,
}) => {
  const [settings, setSettings] = useState<AdminUserSetting>({});
  const { currentUser } = useCurrentUser();

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
    // {
    //   key: "voice.speed",
    //   label: "Speed",
    //   type: "select",
    //   options: [0.5, 1, 1.5, 2],
    // },
    // {
    //   key: "voice.pitch",
    //   label: "Pitch",
    //   type: "select",
    //   options: [0.5, 1, 1.5, 2],
    // },
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
    {
      key: "enable_text_display",
      label: "Enable Text Display",
      description: "Display text when user clicks each word.",
      type: "toggle",
    },
    {
      key: "enable_image_display",
      label: "Enable Image Display",
      description: "Display images when user clicks each word.",
      type: "toggle",
    },
    {
      key: "plan_type",
      label: "Plan Type",
      description: "Select a plan type.",
      type: "select",
      options: ["free", "pro", "team", "admin"],
    },
    {
      key: "locked",
      label: "Locked",
      description: "Lock the user account.",
      type: "toggle",
      default: existingUserSetting?.locked,
    },
  ];

  useEffect(() => {
    if (!currentUser?.admin) {
      window.location.href = "/";
      console.log("Access Denied");
    }
    const initialSettings = settingsConfig.reduce((acc, setting) => {
      const value = getNestedProperty(
        existingUserSetting,
        setting.key,
        setting.type === "toggle" ? false : ""
      );
      setNestedProperty(acc, setting.key, value);
      return acc;
    }, {} as AdminUserSetting);
    setSettings(initialSettings);
  }, [existingUserSetting]);

  const handleChange = (key: string, value: any) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings };
      setNestedProperty(updatedSettings, key, value);
      return updatedSettings;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings, userId);
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="">
        <div className="text-justify">
          <h1 className="text-2xl font-bold">Settings</h1>

          {settingsConfig.map((setting) => (
            <div key={setting.key} className="">
              {setting.type === "select" && (
                <div className="p-2 flex border w-full md:w-3/4 justify-between items-center mx-auto mt-2">
                  <p className="text-md font-bold mr-2">{setting.label}</p>

                  <div>
                    <IonSelect
                      aria-label={`Select ${setting.label}`}
                      value={getNestedProperty(settings, setting.key, "")}
                      onIonChange={(e: any) =>
                        handleChange(setting.key, e.detail.value)
                      }
                      placeholder={`Select ${setting.label}`}
                    >
                      {setting.options &&
                        setting.options.map((option: any) => (
                          <IonSelectOption key={option} value={option}>
                            {option}
                          </IonSelectOption>
                        ))}
                    </IonSelect>
                  </div>
                </div>
              )}
              {setting.type === "toggle" && (
                <div className="p-3 flex border w-full md:w-2/3 justify-between items-center mx-auto mt-2">
                  <p className="text-md font-bold">{setting.label}</p>
                  <div>
                    <IonToggle
                      aria-label={setting.label}
                      className="ml-4"
                      checked={getNestedProperty(settings, setting.key, false)}
                      onIonChange={(e: any) =>
                        handleChange(setting.key, e.detail.checked)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
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

export default AdminUserSettingsForm;
