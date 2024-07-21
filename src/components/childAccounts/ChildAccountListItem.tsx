import { IonIcon, IonItem, IonLabel, IonNote } from "@ionic/react";
import { ChildAccount } from "../../data/child_accounts";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { personOutline, starOutline } from "ionicons/icons";

interface ChildAccountListItemProps {
  childAccount: ChildAccount;
  disableActionList?: boolean;
}

const ChildAccountListItem: React.FC<ChildAccountListItemProps> = ({
  childAccount,
}) => {
  const { currentUser } = useCurrentUser();
  const ownerIcon = currentUser?.email ? (
    <IonIcon icon={personOutline} />
  ) : null;
  return (
    <IonItem
      key={childAccount.id}
      routerLink={`/child-accounts/${childAccount.id}`}
      detail={true}
      lines="none"
      className="p-4 w-full"
    >
      <IonNote slot="start">{ownerIcon}</IonNote>

      <IonLabel>{childAccount.username}</IonLabel>
    </IonItem>
  );
};

export default ChildAccountListItem;
