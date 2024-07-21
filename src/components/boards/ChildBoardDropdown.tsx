import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import { Board } from "../../data/boards";
import { useHistory } from "react-router";
import { assignBoardToChildAccount } from "../../data/child_accounts";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface ChildBoardDropdownProps {
  childAccountId: number;
  boards: Board[];
}

const ChildBoardDropdown: React.FC<ChildBoardDropdownProps> = ({
  childAccountId,
  boards,
}) => {
  // const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { currentUser } = useCurrentUser();
  const selectRef = React.useRef<HTMLIonSelectElement>(null);
  const history = useHistory();

  const handleSelectChange = (e: CustomEvent) => {
    const boardId = e.detail.value;
    console.log("boardId", boardId);
    // setBoardId(boardId);
    setShowLoading(true);
    if (!currentUser?.id) {
      console.error("No current user");
      setShowLoading(false);
      return;
    }
    async function addSelectedBoardToAccount() {
      const response = await assignBoardToChildAccount(
        currentUser?.id || 0,
        childAccountId,
        boardId || 0
      );
      if (!response) {
        console.error("Error adding board to child account");
        return;
      }
      if (response["error"]) {
        const message = `Error:${response["error"]}`;
        setToastMessage(message);
        setShowLoading(false);
        setIsOpen(true);
        return;
      }
    }
    addSelectedBoardToAccount();
    selectRef.current!.value = null;
  };
  return (
    <IonList className="text-center w-full border border-gray-300">
      <IonItem lines="none">
        <IonSelect
          placeholder="Add to board"
          className="text-sm text-wrap text-center"
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
export default ChildBoardDropdown;
