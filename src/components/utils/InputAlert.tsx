import { IonAlert, IonButton, IonIcon, IonLabel } from "@ionic/react";
interface InputAlertProps {
  onConfirm?: () => void;
  onCanceled: () => void;
  message: string;
  onDidDismiss?: (detail: any) => void;
  openAlert: boolean;
  onInputChange: (str: string) => void;
  initialValue?: string;
}
const InputAlert: React.FC<InputAlertProps> = ({
  //   onConfirm,
  onCanceled,
  message,
  onDidDismiss,
  openAlert,
  onInputChange,
  onConfirm,
  initialValue,
}) => {
  const handleDismiss = (event: CustomEvent) => {
    let inputToSet = event.detail.data.values.name;
    const role = event.detail.role;
    if (inputToSet && role === "confirm") {
      console.log("inputToSet", inputToSet);
      if (inputToSet === "") {
        inputToSet = initialValue;
        return;
      }
      onInputChange(inputToSet);
    }
    if (role === "confirm") {
      onConfirm();
    }
    if (role === "cancel") {
      onCanceled();
    }
    if (onDidDismiss) {
      onDidDismiss(inputToSet);
    }
  };

  const handleInputChange = (input: any) => {
    console.log("input", input);
    // onInputChange(input.value);
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
            handler: (input) => {
              console.log("input", input);

              onInputChange(input["name"]);
            },
          },
        ]}
        onDidDismiss={handleDismiss}
        inputs={[
          {
            name: "name",
            type: "text",
            placeholder: "Enter image label",
            value: initialValue,
          },
        ]}
      ></IonAlert>
    </>
  );
};
export default InputAlert;
