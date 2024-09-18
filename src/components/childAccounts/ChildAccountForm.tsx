import React, { useEffect, useState } from "react";
import {
  IonLabel,
  IonButton,
  IonInput,
  IonToast,
  IonicSafeString,
  IonCheckbox,
} from "@ionic/react";

import {
  ChildAccount,
  createChildAccount,
  updateChildAccount,
} from "../../data/child_accounts";
import { User } from "../../data/users";
import { useHistory } from "react-router";
import { set } from "d3";
import { alertCircleOutline } from "ionicons/icons";
import { h } from "ionicons/dist/types/stencil-public-runtime";

interface ChildAccountFormProps {
  // onSave: () => void;
  // onCancel: () => void;
  currentUser: User;
  existingChildAccount?: ChildAccount | null;
}

const ChildAccountForm: React.FC<ChildAccountFormProps> = ({
  // onSave,
  // onCancel,
  currentUser,
  existingChildAccount,
}) => {
  const history = useHistory();
  const [childAccount, setChildAccount] = useState<ChildAccount | null>(null);
  const [name, setName] = useState<any>(existingChildAccount?.name || "");
  const [username, setUsername] = useState<any>(
    existingChildAccount?.username || ""
  );
  const [password, setPassword] = useState<any>(
    existingChildAccount?.password || ""
  );
  const [passwordConfirmation, setPasswordConfirmation] = useState<any>(
    existingChildAccount?.password || ""
  );

  const [isOpen, setIsOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<any>();
  const [showLoading, setShowLoading] = React.useState(false);
  const [errors, setErrors] = useState<any>(null);
  const [imageDisplay, setImageDisplay] = useState(
    existingChildAccount?.settings?.enable_image_display || false
  );
  const [textDisplay, setTextDisplay] = useState(
    existingChildAccount?.settings?.enable_text_display || false
  );

  const onSave = async () => {
    let childAccountResult: ChildAccount;
    if (password !== passwordConfirmation) {
      alert("Password and Password Confirmation do not match");
      return;
    }
    if (!currentUser?.id) {
      alert("Please sign in");
      return;
    }
    if (existingChildAccount) {
      childAccountResult = await updateChildAccount({
        ...existingChildAccount,
        name: name,
        username: username,
        password: password,
        password_confirmation: passwordConfirmation,
        settings: {
          enable_image_display: imageDisplay,
          enable_text_display: textDisplay,
        },
      });
    } else {
      const childAccount: ChildAccount = {
        name: name,
        username: username,
        user_id: currentUser.id,
        password: password,
        password_confirmation: passwordConfirmation,
        settings: {
          enable_image_display: imageDisplay,
          enable_text_display: textDisplay,
        },
      };
      childAccountResult = await createChildAccount(childAccount);
      if (childAccountResult.errors) {
        setErrors(childAccountResult.errors);
        setChildAccount(childAccountResult);
        // history.push("/child-accounts");
        // window.location.reload();
      } else {
        setChildAccount(childAccountResult);
        history.push(`/child-accounts/${childAccountResult.id}`);
      }
    }
  };

  useEffect(() => {
    if (errors) {
      const errorMessages = Object.keys(errors).map((key) => {
        return `${key}: ${errors[key]}`;
      });
      const errorList = new IonicSafeString(
        errorMessages.map((msg) => `<li>${msg}</li>`).join("")
      );
      setToastMessage(errorList);
      setIsOpen(true);
    }
  }, [errors]);

  const onCancel = () => {
    history.push("/child-accounts");
    setChildAccount(null);
  };

  const handleNameChange = (e: CustomEvent) => {
    setName(e.detail.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-3/4 mx-auto mt-4 p-4 bg-white shadow-md rounded-lg"
    >
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <IonInput
            label="Child's Name"
            value={existingChildAccount?.name || name}
            onIonInput={handleNameChange}
            className=""
            fill="outline"
          />
        </div>
        <div className="text-center">
          <IonInput
            label="Username"
            value={username}
            onIonInput={(e: any) => setUsername(e.detail.value!)}
            className=""
            fill="outline"
          />
        </div>
        <div className="text-center">
          <IonInput
            label="Password"
            value={password}
            type="password"
            onIonInput={(e: any) => setPassword(e.detail.value!)}
            className=""
            fill="outline"
          />
        </div>
        <div className="text-center">
          <IonInput
            label="Confirm Password"
            value={passwordConfirmation}
            type="password"
            onIonInput={(e: any) => setPasswordConfirmation(e.detail.value!)}
            className=""
            fill="outline"
          />
        </div>
        <div className="">
          <IonCheckbox
            checked={imageDisplay}
            onIonChange={(e) => setImageDisplay(e.detail.checked)}
            // labelPlacement="fixed"
          >
            <IonLabel className="mx-3">Enable Image Display</IonLabel>
          </IonCheckbox>
        </div>
        <div className="">
          <IonCheckbox
            checked={textDisplay}
            onIonChange={(e) => setTextDisplay(e.detail.checked)}
            // labelPlacement="fixed"
          >
            <IonLabel className="mx-3">Enable Text Display</IonLabel>
          </IonCheckbox>
        </div>
      </div>
      <IonToast
        isOpen={isOpen}
        message={toastMessage}
        position="middle"
        onDidDismiss={() => setIsOpen(false)}
        duration={3000}
        header="Error"
        color={"danger"}
        icon={alertCircleOutline}
        layout="stacked"
      />

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

export default ChildAccountForm;
