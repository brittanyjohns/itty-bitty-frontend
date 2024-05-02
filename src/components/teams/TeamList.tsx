import { useState } from "react";
import { Team } from "../../data/teams";
import { IonList, IonButton, IonItem, IonText } from "@ionic/react";
import TeamListItem from "./TeamListItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface TeamListProps {
  teams: Team[];
}
const TeamList = ({ teams }: TeamListProps) => {
  const [teamId, setTeamId] = useState<string>("");
  const { currentUser, setCurrentUser } = useCurrentUser();

  const handleTeamClick = (team: Team) => {
    setTeamId(team.id as string);
  };

  const shouldDisableActionList = (team: Team) => {
    return false;
  };

  return (
    <div className="ion-padding">
      <IonList className="w-full" id="team-list" lines="inset">
        {teams &&
          teams.map((team, i) => (
            <IonItem key={i}>
              <div
                id={team.id}
                className="rounded-md flex relative w-full hover:cursor-pointer text-center"
                onClick={() => handleTeamClick(team)}
                key={team.id}
              >
                <TeamListItem
                  team={team}
                  disableActionList={shouldDisableActionList(team)}
                />
              </div>
            </IonItem>
          ))}
        {currentUser && teams?.length === 0 && (
          <IonItem>
            <div className="text-center">
              <p>No teams found</p>
              <IonButton routerLink="/teams/new" color="primary">
                Create a new team
              </IonButton>
            </div>
          </IonItem>
        )}
      </IonList>
    </div>
  );
};

export default TeamList;
