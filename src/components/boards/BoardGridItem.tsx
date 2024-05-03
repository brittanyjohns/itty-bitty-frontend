import { IonActionSheet, IonItem, IonLabel, IonText } from "@ionic/react";
import { Board, deleteBoard } from "../../data/boards";
import "./BoardListItem.css";
import { useEffect, useRef, useState } from "react";
import ActionList from "../utils/ActionList";
import { useHistory } from "react-router";

interface BoardListItemProps {
  board: Board;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const BoardListItem: React.FC<BoardListItemProps> = ({ board }) => {
  const [boardDetails, setBoardDetails] = useState(board);
  const [showActionList, setShowActionList] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const history = useHistory();

  const handleActionSelected = (action: string) => {
    console.log("Action selected: ", action);
    console.log("Board: ", board);
    if (!board || !board.id) {
      return;
    }
    if (action === "delete") {
      removeBoard(board.id);
      window.location.reload();
      // Handle delete action
    } else {
      console.log("Do nothing");
    }
  };

  const removeBoard = async (boardId: string) => {
    try {
      console.log("Removing board: ", boardId);
      // Implement delete board logic
      deleteBoard(boardId);
    } catch (error) {
      console.error("Error removing board: ", error);
      alert("Error removing board");
    }
  };

  const handleButtonPress = () => {
    console.log("Button Pressed");

    longPressTimer.current = setTimeout(() => {
      console.log("Long press detected");
      // setShowActionList(true);
    }, 1000);
  };

  const handleButtonRelease = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setTimeout(() => {
      console.log("Button Released - closing action list");
      setShowActionList(false);
    }, 1000);
  };

  const handleBoardClick = (board: Board) => {
    console.log("Board clicked: ", board);
    history.push(`/boards/${board.id}`);
  };
  const onClose = () => {
    setShowActionList(false);
  };

  useEffect(() => {
    setBoardDetails(board);
    if (board?.predefined) {
      setShowActionList(false);
    }
  }, [board]);
  return (
    <>
      <div
        className="cursor-pointer rounded-md w-full text-center p-4 border hover:bg-slate-200"
        onClick={() => handleBoardClick(board)}
        // onTouchStart={handleButtonPress}
        // onTouchEnd={handleButtonRelease}
      >
        <IonText className="text-xl">
          {board.name.length > 50
            ? `${board.name.substring(0, 50)}...`
            : board.name}
        </IonText>
      </div>
      {/* 
      {!board?.predefined && (
        <IonActionSheet
          isOpen={showActionList}
          onDidDismiss={onClose}
          buttons={[
            {
              text: "Delete",
              role: "destructive",
              handler: () => handleActionSelected("delete"),
            },
            {
              text: "Cancel",
              role: "cancel",
              handler: onClose,
            },
          ]}
        />
      )} */}
    </>
  );
};

export default BoardListItem;
