import { useEffect, useRef, useState } from "react";
import {
  Board,
  addToTeam,
  cloneBoard,
  rearrangeImages,
} from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  IonText,
} from "@ionic/react";
import {
  shareOutline,
  copyOutline,
  createOutline,
  chatbubbleEllipsesOutline,
  imageOutline,
} from "ionicons/icons";
import DraggableGrid from "../images/DraggableGrid";
import AddToTeamForm from "../teams/AddToTeamForm";
import { useHistory } from "react-router";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../main_menu/MainMenu";
import { getScreenSizeName } from "../../data/utils";

interface DynamicBoardProps {
  board: Board;
  showEdit: boolean;
  currentUserTeams?: any;
  inputRef?: any;
  setShowIcon: any;
  showLoading: boolean;
  imageCount?: number;
  numOfColumns: number;
  // handleClone?: any;
  showShare?: boolean;
  setShowLoading: any;
}

const DynamicBoard: React.FC<DynamicBoardProps> = ({
  board,
  showEdit,
  inputRef,
  setShowIcon,
  imageCount,
  numOfColumns,
  // handleClone,
  setShowLoading,
  showLoading,
}) => {
  const { currentUser } = useCurrentUser();
  const history = useHistory();
  const [showShare, setShowShare] = useState(false);
  const [currentBoard, setBoard] = useState<Board>(board);

  const shouldShowRemoveBtn = currentUser?.role === "admin" || board?.can_edit;

  const [currentLayout, setCurrentLayout] = useState([]);
  const [currentScreenSize, setCurrentScreenSize] = useState("lg");
  const [currentNumberOfColumns, setCurrentNumberOfColumns] =
    useState(numOfColumns);

  const handleClone = async () => {
    setShowLoading(true);
    try {
      const clonedBoard = await cloneBoard(board.id);
      if (clonedBoard) {
        const updatedBoard = await rearrangeImages(clonedBoard.id);
        setBoard(updatedBoard || clonedBoard);
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

  const handleCurrentLayout = (layout: any) => {
    setCurrentLayout(layout);
  };

  return (
    <>
      <div className="flex justify-center items-center my-3">
        <IonButtons slot="end">
          {board && (
            <IonButton
              routerLink={`/dynamic_boards/${board.id}/locked`}
              className="mr-1 text-xs md:text-md lg:text-lg"
            >
              <IonIcon icon={chatbubbleEllipsesOutline} className="mx-2" />
              <IonLabel>Speak</IonLabel>
            </IonButton>
          )}
          {handleClone && (
            <IonButton
              onClick={handleClone}
              className="mr-1 text-xs md:text-md lg:text-lg"
            >
              <IonIcon
                icon={copyOutline}
                className="mx-1 text-xs md:text-md lg:text-lg"
              />
              <IonLabel>Clone</IonLabel>
            </IonButton>
          )}
          {board && showEdit && (
            <IonButton
              routerLink={`/boards/${board.id}/edit`}
              className="mr-1 text-xs text-xs md:text-md lg:text-lg"
            >
              <IonIcon icon={createOutline} className="mx-2" />
              <IonLabel>Edit</IonLabel>
            </IonButton>
          )}
          {board && showEdit && (
            <IonButton
              routerLink={`/boards/${board.id}/gallery`}
              className="mr-1 text-xs text-xs md:text-md lg:text-lg"
            >
              <IonIcon icon={imageOutline} className="mx-2" />
              <IonLabel>Add</IonLabel>
            </IonButton>
          )}
        </IonButtons>
      </div>
      <IonLabel className="text-xs md:text-md lg:text-lg block text-center">
        You are currently viewing the layout for{" "}
        <span className="font-bold">
          {getScreenSizeName(currentScreenSize)}
        </span>{" "}
        screens ({currentNumberOfColumns} columns).
      </IonLabel>

      {board && board.images && board.images.length > 0 && (
        <DraggableGrid
          gridType="dynamic"
          images={board.images}
          board={board}
          setShowIcon={setShowIcon}
          inputRef={inputRef}
          columns={currentNumberOfColumns}
          disableReorder={true}
          mute={true}
          viewOnClick={true}
          showRemoveBtn={shouldShowRemoveBtn}
          setCurrentLayout={handleCurrentLayout}
          preventCollision={true}
          setShowLoading={setShowLoading}
          showLoading={showLoading}
          updateScreenSize={(newScreenSize: string, newCols: number) => {
            console.log("Breakpoint change: ", newScreenSize, newCols);
            setCurrentNumberOfColumns(newCols);
            setCurrentScreenSize(newScreenSize);
          }}
        />
      )}

      {imageCount && imageCount < 1 && (
        <div className="text-center pt-32">
          <p>No images found</p>
        </div>
      )}
    </>
  );
};

export default DynamicBoard;
