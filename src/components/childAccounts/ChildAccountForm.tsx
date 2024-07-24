import React, { useEffect, useState } from "react";
import { IonLabel, IonButton, IonInput } from "@ionic/react";

import { ChildAccount, createChildAccount } from "../../data/child_accounts";
import { User } from "../../data/users";
import { useHistory } from "react-router";

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
    if (existingChildAccount) {
      // updateChildAccount();
    } else {
      if (password !== passwordConfirmation) {
        alert("Password and Password Confirmation do not match");
        return;
      }
      if (!currentUser?.id) {
        alert("Please sign in");
        return;
      }
      const childAccount: ChildAccount = {
        name: name,
        username: username,
        user_id: currentUser.id,
        password: password,
        password_confirmation: passwordConfirmation,
      };
      const childAccountCreateResult = await createChildAccount(childAccount);
      if (
        childAccountCreateResult.errors &&
        childAccountCreateResult.errors.length > 0
      ) {
        setChildAccount(childAccountCreateResult);
        alert(
          `Error creating child account: ${childAccountCreateResult.errors}`
        );
      } else {
        alert("Child Account created successfully");
        history.push("/child-accounts");
        window.location.reload;
      }
    }
  };

  const onCancel = () => {
    // history.push("/child_accounts");
    window.location.reload();
  };

  useEffect(() => {
    setChildAccount(childAccount);
  }, [childAccount]);

  useEffect(() => {
    console.log("existingChildAccount", existingChildAccount);
    console.log("childAccount", childAccount);
  }, [childAccount]);

  const handleNameChange = (e: CustomEvent) => {
    setName(e.detail.value);
    console.log("e.detail.value", e.detail.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
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
          />
        </div>
        <div className="text-center">
          <IonInput
            label="Username"
            value={username}
            onIonInput={(e) => setUsername(e.detail.value!)}
            className=""
          />
        </div>
        <div className="text-center">
          <IonInput
            label="Password"
            value={password}
            type="password"
            onIonInput={(e) => setPassword(e.detail.value!)}
            className=""
          />
        </div>
        <div className="text-center">
          <IonInput
            label="Confirm Password"
            value={passwordConfirmation}
            type="password"
            onIonInput={(e) => setPasswordConfirmation(e.detail.value!)}
            className=""
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
