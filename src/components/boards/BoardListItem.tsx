import { IonItem, IonText } from "@ionic/react";
import { Board, deleteBoard } from "../../data/boards";
import "./BoardListItem.css";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

interface BoardListItemProps {
  board: Board;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  disableActionList?: boolean;
}

const BoardListItem: React.FC<BoardListItemProps> = ({
  board,
  disableActionList,
}) => {
  const [boardDetails, setBoardDetails] = useState(board);
  const [showActionList, setShowActionList] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const history = useHistory();
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
      <IonItem
        className="w-full py-3"
        onClick={() => handleBoardClick(board)}
        detail={false}
        lines="none"
      >
        <IonText className="text-xl w-full font-bold">
          {board.name.length > 25
            ? `${board.name.substring(0, 22)}...`
            : board.name}
        </IonText>
      </IonItem>
    </>
  );
};

export default BoardListItem;
