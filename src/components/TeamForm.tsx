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
import { Team } from "../data/teams";

interface TeamFormProps {
  onSave: any;
  onCancel: () => void;
  existingTeam?: Team | null;
}

const TeamForm: React.FC<TeamFormProps> = ({
  onSave,
  onCancel,
  existingTeam,
}) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [name, setName] = useState<any>(existingTeam?.name || "");
  const [teamToSave, setTeamToSave] = useState<Team | null>(null);
  useEffect(() => {
    setTeam(team);
  }, [team]);

  useEffect(() => {
    console.log("existingTeam", existingTeam);
    console.log("team", team);
  }, [team]);

  const handleNameChange = (e: CustomEvent) => {
    setName(e.detail.value);
    console.log("e.detail.value", e.detail.value);
    setTeamToSave({ ...teamToSave, name: e.detail.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("teamToSave", teamToSave);
    onSave(teamToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {team && team.errors && team?.errors?.length > 0 && (
        <div className="text-red-500 p-2">
          <h2>{`${team.errors.length} error(s) prohibited this action from being saved:`}</h2>
          <ul>
            {team.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="text-center">
          <IonLabel className="">New Team</IonLabel>
          <IonInput
            label="Team Name"
            value={name}
            onIonInput={handleNameChange}
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

export default TeamForm;
