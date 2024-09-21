import { IonButton, IonButtons, IonItem, IonList } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { getCurrentUser, User } from "../../data/users";
import { useCurrentUser } from "../../contexts/UserContext";

const UserInfo: React.FC<any> = ({}) => {
  const { currentUser } = useCurrentUser();
  const [user, setUser] = useState<User | null>(currentUser);

  const refetchUser = async () => {
    const updatedUser = await getCurrentUser();
    // const updatedUser = user;
    if (updatedUser) {
      setUser(updatedUser);
    } else {
      setUser(null);
    }

    return updatedUser;
  };

  useEffect(() => {
    refetchUser();
  }, [currentUser]);

  return (
    <div className="w-full mx-auto ion-padding min-h-screen border-2 border-gray-200">
      <IonButtons>
        <IonButton fill="outline" routerLink="/settings">
          Go To User Settings
        </IonButton>
      </IonButtons>
      <IonItem>{user?.name}</IonItem>
      <IonList className="flex justify-between ml-4" lines="none">
        <IonItem>Boards: {user?.boards?.length}</IonItem>
        <IonItem>Accounts: {user?.child_accounts?.length}</IonItem>
      </IonList>
      <IonList className="flex justify-between ml-4" lines="none">
        <IonItem>Plan Type: {user?.plan_type}</IonItem>
        <IonItem>Tokens: {user?.tokens}</IonItem>
      </IonList>
      <IonList className="" lines="none">
        {user?.settings?.disable_audit_logging && (
          <IonItem>Disable Audit Logging</IonItem>
        )}
        {user?.settings?.wait_to_speak && <IonItem>Wait to Speak</IonItem>}
        {user?.settings?.voice?.name && (
          <IonItem>Voice: {user.settings.voice.name}</IonItem>
        )}
        {user?.settings?.voice?.language && (
          <IonItem>Language: {user.settings.voice.language}</IonItem>
        )}
        {user?.settings?.voice?.speed && (
          <IonItem>Speed: {user.settings.voice.speed}</IonItem>
        )}
        {user?.settings?.voice?.pitch && (
          <IonItem>Pitch: {user?.settings?.voice.pitch}</IonItem>
        )}
        {user?.settings?.voice?.rate && (
          <IonItem>Rate: {user.settings.voice.rate}</IonItem>
        )}
        {user?.settings?.voice?.volume && (
          <IonItem>Volume: {user.settings.voice.volume}</IonItem>
        )}

        {user?.settings?.disable_audit_logging && (
          <IonItem>Disable Audit Logging</IonItem>
        )}
        {user?.settings?.disable_audit_logging && (
          <IonItem>Disable Audit Logging</IonItem>
        )}
      </IonList>
      <IonList className="flex justify-between ml-4" lines="none">
        <IonItem>Plan Status: {user?.plan_status}</IonItem>
        <IonItem>Stripe ID: {user?.stripe_customer_id}</IonItem>
      </IonList>
      <IonList className="flex justify-between ml-4" lines="none"></IonList>
    </div>
  );
};

export default UserInfo;
