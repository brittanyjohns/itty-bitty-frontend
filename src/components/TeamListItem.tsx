import { IonItem, IonLabel, IonNote } from "@ionic/react";
import { Team } from "../data/teams";

interface TeamListItemProps {
  team: Team;
  disableActionList?: boolean;
}

const TeamListItem: React.FC<TeamListItemProps> = ({ team }) => {
  return (
    <IonItem
      routerLink={`/teams/${team.id}`}
      detail={true}
      className="p-4 w-full"
    >
      <IonLabel>{team.name}</IonLabel>
      <IonNote slot="">{team.created_by}</IonNote>
    </IonItem>
  );
};

export default TeamListItem;
