import {
  IonActionSheet,
  IonImg,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import { Board, deleteBoard } from "../../data/boards";
import "./BoardListItem.css";
import { useEffect, useMemo, useRef, useState } from "react";
import ActionList from "../utils/ActionList";
import { useHistory } from "react-router";
import { generatePlaceholderImage } from "../../data/utils";

interface BoardListItemProps {
  board: Board;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const BoardGridItem: React.FC<BoardListItemProps> = ({ board }) => {
  const [boardDetails, setBoardDetails] = useState(board);
  const [showActionList, setShowActionList] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const history = useHistory();
  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(board.name),
    [board.name]
  );

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
        className="cursor-pointer rounded-md w-full text-center p-1 border hover:bg-slate-200 hover:text-slate-800"
        onClick={() => handleBoardClick(board)}
      >
        <IonImg
          src={board.display_image_url || placeholderUrl}
          alt={board.name}
          className="ion-img-contain mx-auto"
        />
        <IonText className="text-xl">
          {board.name.length > 50
            ? `${board.name.substring(0, 50)}...`
            : board.name}
        </IonText>
      </div>
    </>
  );
};

export default BoardGridItem;
