import {
  IonActionSheet,
  IonAlert,
  IonIcon,
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
import { ChildBoard } from "../../data/child_boards";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { trashBinOutline } from "ionicons/icons";

interface BoardListItemProps {
  board: Board | ChildBoard;
  gridType?: string;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  showRemoveBtn?: boolean;
  removeChildBoard?: any;
}

const BoardGridItem: React.FC<BoardListItemProps> = ({
  board,
  gridType,
  showRemoveBtn,
  removeChildBoard,
}) => {
  const { currentUser, currentAccount } = useCurrentUser();
  const history = useHistory();
  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(board.name),
    [board.name]
  );

  const handleBoardClick = (board: any) => {
    if (currentAccount) {
      history.push(`/child-boards/${board.id}`);
    } else if (gridType === "child") {
      history.push(`/boards/${board.board_id}`);
    } else {
      history.push(`/boards/${board.id}`);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

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
        <IonText className="text-sm md:text-md font-semibold">
          {board.name.length > 50
            ? `${board.name.substring(0, 50)}...`
            : board.name}
        </IonText>
      </div>
      {showRemoveBtn && (
        <IonIcon
          slot="icon-only"
          icon={trashBinOutline}
          size="small"
          onClick={() => setIsOpen(true)}
          color="danger"
          className="tiny absolute bottom-3 right-3"
        />
      )}
      <IonAlert
        isOpen={isOpen}
        header="Remove Board"
        message="Are you sure you want to remove this board?"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              setIsOpen(false);
            },
          },
          {
            text: "OK",
            role: "confirm",
            handler: () => {
              removeChildBoard(board);
            },
          },
        ]}
        onDidDismiss={() => setIsOpen(false)}
      ></IonAlert>
    </>
  );
};

export default BoardGridItem;
