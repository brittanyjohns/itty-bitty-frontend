import { IonIcon, IonItem, IonLabel, IonNote } from "@ionic/react";
import { Team } from "../../data/teams";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { personOutline, starOutline } from "ionicons/icons";

interface TeamListItemProps {
  team: Team;
  disableActionList?: boolean;
}

const TeamListItem: React.FC<TeamListItemProps> = ({ team }) => {
  const { currentUser } = useCurrentUser();
  const ownerIcon =
    team.created_by === currentUser?.email ? (
      <IonIcon icon={personOutline} />
    ) : null;
  return (
    <IonItem
      routerLink={`/teams/${team.id}`}
      detail={true}
      lines="none"
      className="p-4 w-full"
    >
      <IonNote slot="start">{ownerIcon}</IonNote>

      <IonLabel>{team.name}</IonLabel>
    </IonItem>
  );
};

export default TeamListItem;
