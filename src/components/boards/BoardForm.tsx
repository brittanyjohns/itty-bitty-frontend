import { useEffect, useRef } from "react";
import { updateBoard } from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonInput,
  IonItem,
  IonList,
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import { Board } from "../../data/boards";
import { useHistory } from "react-router";
import React from "react";
import { set } from "react-hook-form";
interface BoardFormProps {
  board: Board;
  setBoard: (board: Board) => void;
  onGridSizeChange?: any;
  onSubmit?: any;
}
const BoardForm: React.FC<BoardFormProps> = ({ board, setBoard }) => {
  const history = useHistory();
  const [gridSize, setGridSize] = React.useState<number>(
    board.number_of_columns
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [voice, setVoice] = React.useState(board.voice);
  const [toastMessage, setToastMessage] = React.useState("");
  const [showLoading, setShowLoading] = React.useState(false);

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
    setShowLoading(true);
    const updatingBoard = { ...board, number_of_columns: gridSize };

    const savedBoard = await updateBoard(updatingBoard);
    setBoard(savedBoard);
    setShowLoading(false);
    setToastMessage("Board saved successfully");
    setIsOpen(true);
    // window.location.reload();
  };

  const gridSizeOptions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];

  const voiceOptions = ["alloy", "shimmer", "onyx", "fable", "nova"];

  const handleVoiceChange = (event: CustomEvent) => {
    setVoice(event.detail.value);
    const updateBoard = { ...board, voice: event.detail.value };
    setBoard(updateBoard);
  };

  return (
    <div className="">
      <IonLoading
        message="Please wait while we update your board"
        isOpen={showLoading}
      />

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
        </IonItem>
        <IonItem>
          <IonSelect
            label="Voice:"
            placeholder="Select Voice"
            name="voice"
            className="mr-2"
            onIonChange={handleVoiceChange}
            value={voice}
          >
            {voiceOptions.map((size) => (
              <IonSelectOption key={size} value={size}>
                {size}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonButtons className="mt-4">
          <IonButton onClick={handleSubmit} fill="solid" size="large">
            Save
          </IonButton>
        </IonButtons>
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
