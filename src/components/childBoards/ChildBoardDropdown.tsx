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
import {
  ChildAccount,
  assignBoardToChildAccount,
} from "../../data/child_accounts";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { set } from "react-hook-form";

interface ChildBoardDropdownProps {
  childAccount: ChildAccount;
  boards: Board[];
  onSuccess: () => void;
}

const ChildBoardDropdown: React.FC<ChildBoardDropdownProps> = ({
  childAccount: { id: childAccountId },
  boards,
  onSuccess,
}) => {
  // const [boards, setBoards] = useState([]);
  // const [boardId, setBoardId] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { currentUser } = useCurrentUser();
  const selectRef = React.useRef<HTMLIonSelectElement>(null);
  const history = useHistory();

  const handleSelectChange = (e: CustomEvent) => {
    const boardId = e.detail.value;
    setShowLoading(true);
    // if (!currentUser?.id) {
    //   console.error("No current user");
    //   setShowLoading(false);
    //   return;
    // }
    async function addSelectedBoardToAccount() {
      const response = await assignBoardToChildAccount(
        currentUser?.id || 0,
        childAccountId || 0,
        boardId || 0
      );
      if (!response) {
        setShowLoading(false);

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
      if (response) {
        setShowLoading(false);
        setToastMessage("Board added to child account");
        setIsOpen(true);
        // await delayOpen();
        history.push(`/child-accounts/${childAccountId}`);
        onSuccess();
        // window.location.reload();
      }
    }
    addSelectedBoardToAccount();
    selectRef.current!.value = null;
  };

  const delayOpen = () => {
    setTimeout(() => {
      setIsOpen(true);
    }, 1000);
  };
  return (
    <IonList className="text-center w-full md:w-3/4 lg:w-1/2 mx-auto border border-gray-300">
      <IonItem lines="none">
        <IonSelect
          placeholder="Select a board"
          className="text-sm text-wrap text-center"
          name="boardId"
          onIonChange={(e: any) => handleSelectChange(e)}
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
