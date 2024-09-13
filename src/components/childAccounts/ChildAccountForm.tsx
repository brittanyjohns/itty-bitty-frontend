import React, { useEffect, useState } from "react";
import { IonLabel, IonButton, IonInput } from "@ionic/react";

import {
  ChildAccount,
  createChildAccount,
  updateChildAccount,
} from "../../data/child_accounts";
import { User } from "../../data/users";
import { useHistory } from "react-router";
import { set } from "d3";

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
      // updateChildAccount();
      console.log("updateChildAccount");
      childAccountResult = await updateChildAccount({
        ...existingChildAccount,
        name: name,
        username: username,
        password: password,
        password_confirmation: passwordConfirmation,
      });
      console.log("childAccountResult", childAccountResult);
    } else {
      const childAccount: ChildAccount = {
        name: name,
        username: username,
        user_id: currentUser.id,
        password: password,
        password_confirmation: passwordConfirmation,
      };
      childAccountResult = await createChildAccount(childAccount);
      if (childAccountResult.errors && childAccountResult.errors.length > 0) {
        alert(`Error updating child account: ${childAccountResult.errors}`);
        history.push("/child-accounts");
        window.location.reload();
      } else {
        setChildAccount(childAccountResult);
      }
    }
  };

  const onCancel = () => {
    history.push("/child_accounts");
    setChildAccount(null);
    // window.location.reload();
  };

  useEffect(() => {
    setChildAccount(childAccount);
  }, [childAccount]);

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
      className="w-full md:w-1/2 lg:w-1/2 mx-auto mt-4"
    >
      {childAccount &&
        childAccount.errors &&
        childAccount?.errors?.length > 0 && (
          <div className="text-red-500 p-2">
            <h2>{`${childAccount.errors.length} error(s) prohibited this action from being saved:`}</h2>
            <ul>
              {childAccount.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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

export default ChildAccountForm;
