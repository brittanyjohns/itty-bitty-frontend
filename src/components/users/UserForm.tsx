import React, { useState } from "react";
import { IonButton, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import { User, updatePlan } from "../../data/users";

interface UsersFormProps {
  existingUser?: User;
  onCancel?: any;
  onSave?: any;
  setPlanType: any;
  planType: string;
  userId?: number | null;
}

const UserForm: React.FC<UsersFormProps> = ({
  setPlanType,
  planType,
  userId,
}) => {
  const planOptions = ["Free", "Pro", "Professional", "Professional Plus"];

  const handlePlanSelection = async (e: string) => {
    setPlanType(e);
    if (userId) {
      await updatePlan(e, userId);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <IonLabel className="">Update your info</IonLabel>

          <IonSelect
            label="Plan Type"
            value={planType}
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
        </div>
      </div>
    </>
  );
};

export default UserForm;
