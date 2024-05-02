// ActionList.tsx
import React, { useEffect } from "react";
import { IonActionSheet } from "@ionic/react";

interface ActionListProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelected: (action: string) => void;
  buttonOptions?: any;
}

const ActionList: React.FC<ActionListProps> = ({
  isOpen,
  onClose,
  onActionSelected,
  buttonOptions,
}) => {
  const defaultButtonOptions = [
    {
      text: "Delete",
      role: "destructive",
      handler: () => onActionSelected("delete"),
    },
    {
      text: "Edit",
      handler: () => onActionSelected("edit"),
    },
    {
      text: "Cancel",
      role: "cancel",
      handler: onClose,
    },
  ];
  const [initialButtonOptions, setInitialButtonOptions] =
    React.useState(buttonOptions);
  useEffect(() => {
    if (!buttonOptions) {
      setInitialButtonOptions(defaultButtonOptions);
    }
  }, [buttonOptions]);
  return (
    <IonActionSheet
      isOpen={isOpen}
      onDidDismiss={onClose}
      buttons={initialButtonOptions}
    />
  );
};

export default ActionList;
