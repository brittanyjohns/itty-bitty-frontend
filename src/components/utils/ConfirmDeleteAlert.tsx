import { IonAlert, IonButton } from "@ionic/react";
interface ConfirmDeleteAlertProps {
  onConfirm: () => void;
  onCanceled: () => void;
}
const ConfirmDeleteAlert: React.FC<ConfirmDeleteAlertProps> = ({
  onConfirm,
  onCanceled,
}) => {
  return (
    <>
      <IonButton id="present-alert">Delete</IonButton>
      <IonAlert
        header="Are you sure you want to delete this item?"
        trigger="present-alert"
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
        onDidDismiss={({ detail }) =>
          console.log(`Dismissed with role: ${detail.role}`)
        }
      ></IonAlert>
    </>
  );
};
export default ConfirmDeleteAlert;
