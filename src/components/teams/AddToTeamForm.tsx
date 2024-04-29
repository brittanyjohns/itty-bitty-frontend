import { IonSelect, IonSelectOption, IonButton } from "@ionic/react";
import { useState } from "react";
import { set } from "react-hook-form";

interface AddToTeamFormProps {
  onSubmit: (teamId: string) => void;
  currentUserTeams: any[];
}

const AddToTeamForm: React.FC<AddToTeamFormProps> = ({
  onSubmit,
  currentUserTeams,
}) => {
  const [team, setTeam] = useState<string | undefined>(undefined);

  const handleAddToTeam = async () => {
    if (!team) {
      return;
    }
    onSubmit(team);
    setTeam(undefined);
  };
  return (
    <div className="mt-1">
      <label htmlFor="team-select" className="mb-2 text-md font-semibold">
        Add this board to a team
      </label>
      <IonSelect
        interface="action-sheet"
        placeholder="Select a team"
        onIonChange={(e) => setTeam(e.detail.value)}
        className=""
        id="team-select"
      >
        {currentUserTeams &&
          currentUserTeams.map((team) => (
            <IonSelectOption key={team.id} value={team.id}>
              {team.name}
            </IonSelectOption>
          ))}
      </IonSelect>
      <IonButton className="mt-4" onClick={handleAddToTeam}>
        Add to Team
      </IonButton>
    </div>
  );
};

export default AddToTeamForm;
