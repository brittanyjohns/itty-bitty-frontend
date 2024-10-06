import {
  IonActionSheet,
  IonAlert,
  IonButton,
  IonButtons,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import {
  Board,
  cloneBoard,
  deleteBoard,
  rearrangeImages,
} from "../../data/boards";
import "./BoardListItem.css";
import { useEffect, useMemo, useRef, useState } from "react";
import ActionList from "../utils/ActionList";
import { useHistory } from "react-router";
import { generatePlaceholderImage } from "../../data/utils";
import { ChildBoard } from "../../data/child_boards";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { copyOutline, trashBinOutline } from "ionicons/icons";
import ConfirmAlert from "../utils/ConfirmAlert";

interface BoardListItemProps {
  board: Board | ChildBoard;
  gridType?: string;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  showRemoveBtn?: boolean;
  removeChildBoard?: any;
  goToSpeak?: boolean;
}

const BoardGridItem: React.FC<BoardListItemProps> = ({
  board,
  gridType,
  showRemoveBtn,
  removeChildBoard,
  goToSpeak,
}) => {
  const { currentUser, currentAccount } = useCurrentUser();
  const history = useHistory();
  const [showLoading, setShowLoading] = useState(true);

  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(board.name),
    [board.name]
  );

  const [cloneIsOpen, setCloneIsOpen] = useState(false);

  const handleClone = async () => {
    setShowLoading(true);
    try {
      if (!board?.id) {
        console.error("Board is missing");
        alert("Board is missing");
        return;
      }
      const clonedBoard = await cloneBoard(board.id);
      if (clonedBoard) {
        // const updatedBoard = await rearrangeImages(clonedBoard.id);
        // setBoard(updatedBoard || clonedBoard);
        history.push(`/boards/${clonedBoard.id}`);
      } else {
        console.error("Error cloning board");
        alert("Error cloning board");
      }
    } catch (error) {
      console.error("Error cloning board: ", error);
      alert("Error cloning board");
    }
    setShowLoading(false);
  };

  const handleBoardClick = (board: any) => {
    if (goToSpeak) {
      history.push(`/boards/${board.id}/speak`);
      return;
    }
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
      {board && (
        <IonIcon
          slot="icon-only"
          icon={copyOutline}
          title="Clone Board"
          size="small"
          onClick={() => setCloneIsOpen(true)}
          color="secondary"
          className="tiny absolute bottom-3 right-3"
        />
      )}
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
      <ConfirmAlert
        onConfirm={handleClone}
        onCanceled={() => {}}
        openAlert={cloneIsOpen}
        message="Are you sure you want to CLONE this board?"
        onDidDismiss={() => setCloneIsOpen(false)}
      />
    </>
  );
};

export default BoardGridItem;
