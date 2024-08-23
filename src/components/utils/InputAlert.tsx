import { IonAlert, IonButton, IonIcon, IonLabel } from "@ionic/react";
import { trashBinOutline } from "ionicons/icons";
interface InputAlertProps {
  onConfirm?: () => void;
  onCanceled: () => void;
  message: string;
  onDidDismiss?: (detail: any) => void;
  openAlert: boolean;
  onInputChange: (str: string) => void;
}
const InputAlert: React.FC<InputAlertProps> = ({
  //   onConfirm,
  onCanceled,
  message,
  onDidDismiss,
  openAlert,
  onInputChange,
}) => {
  const handleDismiss = (event: CustomEvent) => {
    const input = event.detail.data.values.name;
    console.log(`Dismissed with  input: ${input}`);
    if (input) {
      onInputChange(input);
    }
    if (onDidDismiss) {
      onDidDismiss(input);
    }
  };

  const handleInputChange = (input: any) => {
    console.log("input", input);
    onInputChange(input.value);
  };

  return (
    <>
      <IonAlert
        header={message}
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
              //   onConfirm();
            },
          },
        ]}
        onDidDismiss={handleDismiss}
        inputs={[
          {
            name: "name",
            type: "text",
            placeholder: "Enter your name",

            handler: (input) => {
              handleInputChange(input);
              console.log("handler input", input);
            },
          },
        ]}
      ></IonAlert>
    </>
  );
};
export default InputAlert;
