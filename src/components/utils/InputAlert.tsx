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
  initialValue,
}) => {
  const handleDismiss = (event: CustomEvent) => {
    let inputToSet = event.detail.data.values.name;
    const role = event.detail.role;
    console.log(`Dismissed with  input: ${inputToSet}`);
    console.log("event", event);
    if (inputToSet && role === "confirm") {
      console.log("inputToSet", inputToSet);
      if (inputToSet === "") {
        console.log(
          "inputToSet is empty - setting to initialValue",
          initialValue
        );
        inputToSet = initialValue;
        return;
      }
      onInputChange(inputToSet);
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
