import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import { User, updateUser } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface UsersFormProps {
  // existingUser?: User;
  // onCancel?: any;
  // onSave?: any;
  // setPlanType: any;
  // planType: string;
  user?: User | null;
}

const UserForm: React.FC<UsersFormProps> = ({
  // setPlanType,
  // planType,
  user,
}) => {
  const planOptions = ["free", "pro", "professional", "professional plus"];
  const userId = user && user.id;
  const [name, setName] = useState(user && user.name);
  const [planType, setPlanType] = useState(user?.plan_type || "free");
  const { currentUser } = useCurrentUser();

  const handlePlanSelection = async (e: string) => {
    setPlanType(e);
    const userToSave = { ...user, plan_type: e };
    console.log("userToSave", userToSave);
  };

  const handleSave = async () => {
    if (!userId) {
      console.error("No user id found");
      return;
    }
    const userToSave = {
      ...user,
      name: name || "",
      plan_type: planType || "free",
    };
    const updatedUser = await updateUser(userToSave, userId);
    console.log("updatedUser", updatedUser);
  };
  useEffect(() => {
    setPlanType(user?.plan_type || "free");
    setName(user?.name || "");
  }, [user]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="w-full md:w-2/3 mx-auto border p-4">
          <h2 className="text-2xl">Account Information</h2>
          <IonItem>
            <IonLabel>Name:</IonLabel>
            <IonInput
              value={name}
              placeholder="No Name Set"
              onIonChange={(e) => setName(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Email:</IonLabel>
            <IonText>{user && user.email}</IonText>
          </IonItem>
          <IonItem>
            <IonLabel>Plan Type:</IonLabel>
            <IonText>{user && user.plan_type}</IonText>
          </IonItem>
          <IonItem>
            <IonLabel>Trial Days Left:</IonLabel>
            <IonText>{user && user.trial_days_left}</IonText>
          </IonItem>
          {currentUser?.admin && (
            <IonItem>
              <IonSelect
                label="Plan Type"
                value={planOptions[planOptions.indexOf(planType)]}
                onIonChange={(e) => handlePlanSelection(e.detail.value)}
                className=""
                disabled={true}
              >
                {planOptions.map((option) => (
                  <IonSelectOption key={option} value={option}>
                    {option}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          )}
          <IonButton
            className=""
            expand="block"
            onClick={handleSave}
            disabled={!name}
          >
            Save
          </IonButton>
        </div>
      </div>
    </>
  );
};

export default UserForm;
