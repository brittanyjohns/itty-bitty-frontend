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
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToolbar,
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
import ConfirmAlert from "../utils/ConfirmAlert";

interface BoardViewProps {
  board: Board;
  showEdit?: boolean;
  currentUserTeams?: any;
  inputRef?: any;
  setShowIcon?: any;
  showLoading?: boolean;
  imageCount?: number;
  numOfColumns: number;
  // handleClone?: any;
  setShowLoading?: any;
}

const BoardView: React.FC<BoardViewProps> = ({
  board,
  showEdit,
  inputRef,
  setShowIcon,
  imageCount,
  numOfColumns,
  setShowLoading,
  showLoading,
}) => {
  const { currentUser } = useCurrentUser();
  const history = useHistory();
  const [currentBoard, setBoard] = useState<Board>(board);
  const shouldShowRemoveBtn = currentUser?.role === "admin" || board?.can_edit;

  const [currentLayout, setCurrentLayout] = useState([]);
  const [currentScreenSize, setCurrentScreenSize] = useState("lg");
  const [currentNumberOfColumns, setCurrentNumberOfColumns] =
    useState(numOfColumns);

  const handleCurrentLayout = (layout: any) => {
    setCurrentLayout(layout);
  };

  const [xMargin, setXMargin] = useState(0);
  const [yMargin, setYMargin] = useState(0);

  useEffect(() => {
    if (board) {
      setBoard(board);
      const layout = board.layout[currentScreenSize];
      const margin = board.margin_settings[currentScreenSize];
      setCurrentLayout(layout);
      if (margin) {
        setXMargin(margin.x);
        setYMargin(margin.y);
      } else {
        setXMargin(0);
        setYMargin(0);
      }
    }
  }, [board]);

  useEffect(() => {
    if (currentBoard && currentBoard.layout) {
      const layout = currentBoard.layout[currentScreenSize];
      setCurrentLayout(layout);
    }
  }, [currentBoard]);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [cloneIsOpen, setCloneIsOpen] = useState(false);
  const handleDeleteBoard = async () => {
    if (!board) return;
    setShowLoading(true);
    await deleteBoard(board.id);
    history.push("/boards");
    setShowLoading(false);
  };

  const handleClone = async () => {
    setShowLoading(true);
    try {
      if (!board) {
        console.error("Board is missing");
        alert("Board is missing");
        return;
      }
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

  return (
    <>
      <div className=" my-2 text-center">
        <IonButtons className="flex justify-center">
          <IonButton
            className="mx-2"
            fill="clear"
            size="small"
            onClick={() => setCloneIsOpen(true)}
          >
            <IonIcon icon={copyOutline} className="mx-2" />
            <IonLabel className="text-xs ml-1">Clone</IonLabel>
          </IonButton>
          {board && showEdit && (
            <IonButton
              className="mx-2"
              fill="clear"
              size="small"
              color={"danger"}
              onClick={() => setOpenDeleteAlert(true)}
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
        <ConfirmAlert
          onConfirm={handleClone}
          onCanceled={() => {}}
          openAlert={cloneIsOpen}
          message="Are you sure you want to CLONE this board?"
          onDidDismiss={() => setCloneIsOpen(false)}
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
            xMargin={xMargin}
            yMargin={yMargin}
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
