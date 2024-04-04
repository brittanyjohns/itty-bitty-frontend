import { useEffect, useRef, useState } from "react";
import {
  addImageToBoard,
  getBoard,
  getRemainingImages,
  updateBoard,
} from "../data/boards";
import { Image } from "../data/images";
import {
  IonButton,
  IonButtons,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { Board } from "../data/boards";

import { useHistory } from "react-router";
import React from "react";
interface BoardFormProps {
  board: Board;
  setBoard: (board: Board) => void;
}
const BoardForm: React.FC<BoardFormProps> = ({ board, setBoard }) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const inputRef = useRef<HTMLIonInputElement>(null);
  const history = useHistory();

  const fetchBoard = async () => {
    const boardId = window.location.pathname.split("/")[2];
    const board = await getBoard(boardId);
    console.log("setBoard", board);
    setBoard(board);
  };

  const handleGridChange = async (event: CustomEvent) => {
    if (!board || !board.id) {
      console.error("No board found");
      return;
    }
    const gridSize = event.detail.value;
    console.log("gridSize", gridSize);
    const updatedBoard = { ...board, number_of_columns: gridSize };
    console.log("updatedBoard", updatedBoard);
    setBoard(updatedBoard);
  };

  const handleSubmit = async () => {
    if (!board) {
      console.error("No board found");
      return;
    }
    const updatedBoard = await updateBoard(board);
    setBoard(updatedBoard);
    history.push(`/boards/${board?.id}`);
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

  const goToGallery = () => {
    if (!board) {
      console.error("No board found");
      return;
    }
    history.push(`/boards/${board?.id}/gallery`);
  };

  const gridSizeOptions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];

  useEffect(() => {
    fetchBoard();
  }, []);

  return (
    <div className="">
      <IonList>
        <IonItem className="mb-4">
          <IonInput
            label="Name"
            value={board?.name}
            placeholder="Enter Board Name"
            onIonInput={(e) => setBoard({ ...board, name: e.detail.value! })}
          ></IonInput>
        </IonItem>
        <IonItem className="mb-4">
          <IonSelect
            label="Number of Columns"
            placeholder="Select # of columns"
            name="number_of_columns"
            onIonChange={handleGridChange}
            value={board?.number_of_columns}
          >
            {gridSizeOptions.map((size) => (
              <IonSelectOption key={size} value={size}>
                {size}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonButton
            onClick={handleReset}
            expand="block"
            fill="outline"
            color="danger"
            className="w-1/5 mt-4 ml-4"
          >
            Reset{" "}
          </IonButton>
        </IonItem>
        <IonButtons>
          <IonButton
            onClick={handleSubmit}
            expand="block"
            fill="outline"
            color="primary"
            className="w-full"
          >
            Save
          </IonButton>
        </IonButtons>
      </IonList>
    </div>
  );
};

export default BoardForm;
