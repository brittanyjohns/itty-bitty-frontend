import { useEffect, useRef, useState } from "react";
import {
  Board,
  addToTeam,
  cloneBoard,
  deleteBoard,
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
  trashBin,
  trashBinOutline,
} from "ionicons/icons";
import DraggableGrid from "../images/DraggableGrid";
import AddToTeamForm from "../teams/AddToTeamForm";
import { useHistory } from "react-router";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../main_menu/MainMenu";
import { getScreenSizeName } from "../../data/utils";
import ConfirmDeleteAlert from "../utils/ConfirmAlert";
import { set } from "d3";

interface BoardViewProps {
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

const BoardView: React.FC<BoardViewProps> = ({
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
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const shouldShowRemoveBtn = currentUser?.role === "admin" || board?.can_edit;

  const [currentLayout, setCurrentLayout] = useState([]);
  const [currentScreenSize, setCurrentScreenSize] = useState("lg");
  const [currentNumberOfColumns, setCurrentNumberOfColumns] =
    useState(numOfColumns);

  const handleCurrentLayout = (layout: any) => {
    setCurrentLayout(layout);
  };

  const handleDeleteBoard = async () => {
    setShowLoading(true);
    await deleteBoard(board.id);
    history.push("/boards");
    setShowLoading(false);
  };

  return (
    <>
      <div className="flex justify-center items-center my-3">
        <IonButtons slot="end">
          {board && (
            <IonButton
              routerLink={`/boards/${board.id}/locked`}
              className="mr-1 text-xs md:text-md lg:text-lg"
            >
              <IonIcon icon={chatbubbleEllipsesOutline} className="mx-2" />
              <IonLabel>Speak</IonLabel>
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
          {board && showEdit && (
            <IonButton
              onClick={() => setOpenDeleteAlert(true)}
              className="mr-1 text-xs text-xs md:text-md lg:text-lg"
            >
              <IonIcon icon={trashBinOutline} className="mx-2" />
              <IonLabel>Delete</IonLabel>
            </IonButton>
          )}
        </IonButtons>
        <ConfirmDeleteAlert
          openAlert={openDeleteAlert}
          message={
            "Are you sure you want to DELETE this board? This action cannot be undone."
          }
          onConfirm={handleDeleteBoard}
          onCanceled={() => {
            setOpenDeleteAlert(false);
          }}
        />
      </div>
      <IonLabel className="text-xs md:text-md lg:text-lg block text-center">
        You are currently viewing the layout for{" "}
        <span className="font-bold">
          {getScreenSizeName(currentScreenSize)}
        </span>{" "}
        screens.
      </IonLabel>

      {currentBoard &&
        currentBoard.images &&
        currentBoard.images.length > 0 && (
          <DraggableGrid
            images={board.images}
            board={currentBoard}
            setBoard={setBoard}
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

export default BoardView;
