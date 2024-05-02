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
import { Team } from "../../data/teams";

interface TeamInviteFormProps {
  onSave: any;
  onCancel: () => void;
  existingTeam?: Team | null;
}

const TeamInviteForm: React.FC<TeamInviteFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<any>(null);

  const handleEmailChange = (e: CustomEvent) => {
    setEmail(e.detail.value);
    console.log("e.detail.value", e.detail.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) {
      alert("Please enter email and select a role");
      return;
    }
    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    console.log("email invite", email);
    onSave(email, role);
    setEmail("");
    setRole(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-center">Invite a new member</h2>
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <IonInput
            label="Email"
            value={email}
            onIonInput={handleEmailChange}
            className=""
          />
        </div>
        <div className="text-center">
          <IonSelect
            placeholder="Select Role"
            onIonChange={(e) => setRole(e.detail.value)}
          >
            <IonSelectOption value="admin">Admin</IonSelectOption>
            <IonSelectOption value="member">Member</IonSelectOption>
          </IonSelect>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <IonButton color="medium" onClick={onCancel}>
          Cancel
        </IonButton>
        <IonButton type="submit" color="primary">
          Send Invite
        </IonButton>
      </div>
    </form>
  );
};

export default TeamInviteForm;
