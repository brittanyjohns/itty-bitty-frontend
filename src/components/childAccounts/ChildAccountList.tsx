import { useState } from "react";
import { ChildAccount } from "../../data/child_accounts";
import { IonList, IonButton, IonItem, IonText } from "@ionic/react";
import ChildAccountListItem from "./ChildAccountListItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface ChildAccountListProps {
  childAccounts: ChildAccount[];
}
const ChildAccountList = ({ childAccounts }: ChildAccountListProps) => {
  const [childAccountId, setChildAccountId] = useState<string>("");
  const { currentUser } = useCurrentUser();

  const handleChildAccountClick = (childAccount: ChildAccount) => {
    setChildAccountId(childAccount.id as string);
  };

  const shouldDisableActionList = (childAccount: ChildAccount) => {
    return false;
  };

  return (
    <div className="ion-padding">
      <IonList className="w-full" id="childAccount-list" lines="inset">
        {childAccounts &&
          childAccounts.map((childAccount, i) => (
            <IonItem key={i}>
              <div
                id={childAccount.id}
                className="rounded-md flex relative w-full hover:cursor-pointer text-center"
                onClick={() => handleChildAccountClick(childAccount)}
                key={childAccount.id}
              >
                <ChildAccountListItem
                  childAccount={childAccount}
                  disableActionList={shouldDisableActionList(childAccount)}
                />
              </div>
            </IonItem>
          ))}
        {currentUser && childAccounts?.length === 0 && (
          <IonItem>
            <div className="text-center">
              <p>No childAccounts found</p>
              <IonButton routerLink="/child-accounts/new" color="primary">
                Create a new childAccount
              </IonButton>
            </div>
          </IonItem>
        )}
      </IonList>
    </div>
  );
};

export default ChildAccountList;
