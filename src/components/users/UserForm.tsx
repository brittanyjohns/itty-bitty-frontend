import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonInput,
} from "@ionic/react";
import { language } from "ionicons/icons";
import { set } from "react-hook-form";
import { User } from "../../data/users";

interface UsersFormProps {
  onNameChange: any;
  existingUser?: User;
}

const UsersForm: React.FC<UsersFormProps> = ({
  onNameChange,
  existingUser,
}) => {
  const [userSetting, setUser] = useState<User>({});

  const handleNameChange = (e: any) => {
    console.log("name change", e.target.value);
    onNameChange(e.target.value);
  };

  return (
    <>
      {userSetting.errors && userSetting?.errors?.length > 0 && (
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
          <IonLabel className="">Update your info</IonLabel>

          <IonInput
            type="text"
            value={existingUser?.name}
            onIonChange={handleNameChange}
            className="border rounded w-full"
          ></IonInput>
        </div>
      </div>
    </>
  );
};

export default UsersForm;
