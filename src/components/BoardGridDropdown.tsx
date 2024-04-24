import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";

interface BoardGridDropdownProps {
  gridSize: number;
  onUpdateGrid: any;
}

const BoardGridDropdown: React.FC<BoardGridDropdownProps> = ({
  gridSize,
  onUpdateGrid,
}) => {
  const [showLoading, setShowLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const selectRef = React.useRef<HTMLIonSelectElement>(null);

  const gridSizes = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  const handleSelectChange = (e: CustomEvent) => {
    const gridSize = e.detail.value;
    onUpdateGrid(gridSize);
  };

  return (
    <IonList slot="end" className="">
      <IonItem lines="none">
        <IonSelect
          placeholder={gridSize.toString()}
          className=""
          name="number_of_columns"
          onIonChange={(e) => handleSelectChange(e)}
          ref={selectRef}
        >
          {gridSizes.map((size: number) => (
            <IonSelectOption key={size} value={size}>
              {size}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <IonToast
        isOpen={isOpen}
        message={toastMessage}
        onDidDismiss={() => setIsOpen(false)}
        duration={2000}
      ></IonToast>
    </IonList>
  );
};
export default BoardGridDropdown;
