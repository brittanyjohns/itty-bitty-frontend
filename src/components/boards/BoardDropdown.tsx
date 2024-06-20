import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import { Board, addImageToBoard, getBoards } from "../../data/boards";
import { useHistory } from "react-router";

interface BoardDropdownProps {
  imageId: string;
  boards: Board[];
}

const BoardDropdown: React.FC<BoardDropdownProps> = ({ imageId, boards }) => {
  // const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const selectRef = React.useRef<HTMLIonSelectElement>(null);
  const history = useHistory();

  const handleSelectChange = (e: CustomEvent) => {
    const boardId = e.detail.value;
    setBoardId(boardId);
    setShowLoading(true);
    async function addSelectedImageToBoard() {
      const response = await addImageToBoard(boardId, imageId);
      if (!response) {
        console.error("Error adding image to board");
        return;
      }
      if (response["error"]) {
        const message = `${response["error"]}`;
        setToastMessage(message);
        setShowLoading(false);
        setIsOpen(true);
        return;
      }
      if (response["board"]) {
        const message = `Image added to board: ${response["board"]["name"]}`;
        setToastMessage(message);
        setShowLoading(false);
        setIsOpen(true);
        setBoardId(response["board"]["id"]);
        history.push(`/boards/${response["board"]["id"]}`);
      }
    }
    addSelectedImageToBoard();
    selectRef.current!.value = null;
  };

  useEffect(() => {
    console.log("Board Dropdown: Boards", boards);
  }, []);

  return (
    <IonList>
      <IonItem lines="none">
        <IonSelect
          placeholder="Select a board to add this image to"
          className=""
          name="boardId"
          onIonChange={(e) => handleSelectChange(e)}
          ref={selectRef}
        >
          {boards &&
            boards.map((board: { id?: any; name: any }) => (
              <IonSelectOption key={board.id} value={board.id}>
                {board.name}
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
export default BoardDropdown;
