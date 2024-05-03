import { useEffect, useRef } from "react";
import { updateBoard } from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import { Board } from "../../data/boards";

import { useHistory } from "react-router";
import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
interface BoardFormProps {
  board: Board;
  setBoard: (board: Board) => void;
  onGridSizeChange?: any;
  onSubmit?: any;
}
const BoardForm: React.FC<BoardFormProps> = ({
  board,
  setBoard,
  onGridSizeChange,
  onSubmit,
}) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const inputRef = useRef<HTMLIonInputElement>(null);
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const [gridSize, setGridSize] = React.useState<number>(
    board.number_of_columns
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const handleGridSizeChange = (event: CustomEvent) => {
    setGridSize(event.detail.value);
    handleAfterAction();
  };

  const handleAfterAction = () => {
    if (!board) {
      console.error("No board found");
      return;
    }
    console.log("After action", gridSize);
    const updatedBoard = { ...board, number_of_columns: gridSize };
    setBoard(updatedBoard);
  };

  const handleSubmit = async () => {
    if (!board) {
      console.error("No board found");
      return;
    }
    const updatingBoard = { ...board, number_of_columns: gridSize };

    const savedBoard = await updateBoard(updatingBoard);
    setBoard(savedBoard);
    window.location.reload();
  };

  const handleReset = () => {
    if (!board) {
      console.error("No board found");
      return;
    }
    async function updateChangedBoard() {
      const updatedBoard = await updateBoard({
        ...board,
        number_of_columns: 0,
      });
      setBoard(updatedBoard);
    }
    updateChangedBoard();
    history.push(`/boards/${board?.id}`);
  };

  const gridSizeOptions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];

  return (
    <div className="">
      <IonList>
        <IonItem className="mb-4">
          <IonInput
            label="Name:"
            value={board?.name}
            placeholder="Enter Board Name"
            onIonInput={(e) => setBoard({ ...board, name: e.detail.value! })}
          ></IonInput>
        </IonItem>
        <IonItem className="mb-4">
          <IonSelect
            label="Number of Columns:"
            placeholder="Select # of columns"
            name="number_of_columns"
            className="mr-2"
            onIonChange={handleGridSizeChange}
            value={gridSize}
          >
            {gridSizeOptions.map((size) => (
              <IonSelectOption key={size} value={size}>
                {size}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonButtons>
            <IonButton
              onClick={handleSubmit}
              fill="outline"
              color="primary"
              slot="end"
            >
              Save
            </IonButton>
          </IonButtons>
        </IonItem>
      </IonList>
      <IonToast
        isOpen={isOpen}
        message={toastMessage}
        onDidDismiss={() => setIsOpen(false)}
        duration={2000}
      ></IonToast>
    </div>
  );
};

export default BoardForm;
