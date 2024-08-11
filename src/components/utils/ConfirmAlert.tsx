import { IonAlert, IonButton, IonIcon, IonLabel } from "@ionic/react";
import { trashBinOutline } from "ionicons/icons";
interface ConfirmDeleteAlertProps {
  onConfirm: () => void;
  onCanceled: () => void;
  message: string;
  onDidDismiss?: (detail: any) => void;
  openAlert: boolean;
}
const ConfirmDeleteAlert: React.FC<ConfirmDeleteAlertProps> = ({
  onConfirm,
  onCanceled,
  message,
  onDidDismiss,
  openAlert,
}) => {
  const handleDismiss = (detail: any) => {
    console.log(`Dismissed with role: ${detail.role}`);
    if (onDidDismiss) {
      onDidDismiss(detail);
    }
  };
  return (
    <>
      <IonAlert
        header={message}
        // trigger="present-alert"
        isOpen={openAlert}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              onCanceled();
            },
          },
          {
            text: "OK",
            role: "confirm",
            handler: () => {
              console.log("Alert confirmed");
              onConfirm();
            },
          },
        ]}
        // onDidDismiss={({ detail }) =>
        //   console.log(`Dismissed with role: ${detail.role}`)
        // }
        onDidDismiss={handleDismiss}
      ></IonAlert>
    </>
  );
};
export default ConfirmDeleteAlert;
