import { useRef } from "react";
import { Board, addToTeam } from "../../data/boards";
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

interface BoardViewProps {
  board: Board;
  showEdit: boolean;
  currentUserTeams: any;
  inputRef?: any;
  setShowIcon: any;
  showLoading: boolean;
  imageCount?: number;
  numOfColumns: number;
  handleClone?: any;
  showShare?: boolean;
}

const BoardView: React.FC<BoardViewProps> = ({
  board,
  showEdit,
  inputRef,
  setShowIcon,
  showLoading,
  imageCount,
  numOfColumns,
  handleClone,
}) => {
  const { currentUser } = useCurrentUser();

  const shouldShowRemoveBtn = currentUser?.role === "admin" || board?.can_edit;

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

      {board && (
        <DraggableGrid
          images={board.images}
          board={board}
          setShowIcon={setShowIcon}
          inputRef={inputRef}
          columns={numOfColumns}
          disableReorder={true}
          mute={true}
          viewOnClick={true}
          showRemoveBtn={shouldShowRemoveBtn}
        />
      )}

      {imageCount && imageCount < 1 && (
        <div className="text-center pt-32">
          <p>No images found</p>
        </div>
      )}
      {board?.parent_type === "Menu" && imageCount && imageCount < 1 && (
        <div className="text-center pt-32">
          <IonLoading
            message="Please wait while we load your board..."
            isOpen={showLoading}
          />
        </div>
      )}
    </>
  );
};

export default BoardView;
