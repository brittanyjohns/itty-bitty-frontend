import { IonButton, IonButtons, IonIcon, IonItem, IonList } from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import React, { useState } from "react";
import { User } from "../../data/users";
interface UserInfoItem {
  user: User;
}
const UserInfo: React.FC<UserInfoItem> = ({ user }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleUserInfo = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="w-full h-full mx-auto ion-padding">
      <p>{user.name}</p>
      <IonList className="flex justify-between ml-4" lines="none">
        <IonItem>Boards: {user.boards?.length}</IonItem>
        <IonItem>Accounts: {user.child_accounts?.length}</IonItem>
      </IonList>
      <IonList className="flex justify-between ml-4" lines="none">
        <IonItem>Plan Type: {user.plan_type}</IonItem>
        <IonItem>Tokens: {user.tokens}</IonItem>
      </IonList>
      <IonList className="" lines="none">
        <IonItem>
          {user.settings?.disable_audit_logging && <p>Disable Audit Logging</p>}
          {user.settings?.wait_to_speak && <p>Wait to Speak</p>}
          {user.settings?.enable_image_display && <p>Enable Image Display</p>}
          {user.settings?.disable_audit_logging && <p>Disable Audit Logging</p>}
          {user.settings?.disable_audit_logging && <p>Disable Audit Logging</p>}
        </IonItem>
      </IonList>
      <IonList className="flex justify-between ml-4" lines="none">
        <IonItem>Plan Status: {user.plan_status}</IonItem>
        <IonItem>Stripe ID: {user.stripe_customer_id}</IonItem>
      </IonList>
      <IonList className="flex justify-between ml-4" lines="none"></IonList>
    </div>
  );
};

export default UserInfo;
