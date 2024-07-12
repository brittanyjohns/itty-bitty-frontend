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
  currentUserTeams,
  inputRef,
  setShowIcon,
  showLoading,
  imageCount,
  numOfColumns,
  handleClone,
  showShare,
}) => {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const addToTeamRef = useRef<HTMLDivElement>(null);

  const handleAddToTeam = async (teamId: string) => {
    const boardId = board.id;
    if (!teamId || !boardId) {
      return;
    }
    const response = await addToTeam(boardId, teamId);
    if (response) {
      history.push("/teams/" + teamId);
    }
  };

  const shouldShowRemoveBtn = currentUser?.role === "admin" || board?.can_edit;

  const toggleAddToTeam = () => {
    addToTeamRef.current?.classList.toggle("hidden");
  };
  return (
    <>
      <div className="flex justify-center items-center">
        <div ref={addToTeamRef} className="p-4 hidden">
          {currentUserTeams && (
            <AddToTeamForm
              onSubmit={handleAddToTeam}
              toggleAddToTeam={toggleAddToTeam}
              currentUserTeams={currentUserTeams}
            />
          )}
        </div>
      </div>
      <div className="flex justify-center items-center px-4">
        <IonItem lines="none">
          {board && board?.has_generating_images && (
            <IonText color="success">
              {`Please wait while we generate images for your board`}
            </IonText>
          )}
        </IonItem>
        <IonItem lines="none">
          {currentUser?.admin && board && board?.status && (
            <IonText color="success">{`Status: ${board?.status}`}</IonText>
          )}
        </IonItem>
        <IonButtons slot="end">
          {showShare && (
            <IonButton onClick={toggleAddToTeam} className="mr-4">
              <IonIcon icon={shareOutline} className="mx-2" />
              <IonLabel>Share</IonLabel>
            </IonButton>
          )}
          {board && (
            <IonButton
              routerLink={`/boards/${board.id}/locked`}
              className="mr-4"
            >
              <IonIcon icon={chatbubbleEllipsesOutline} className="mx-2" />
              <IonLabel>Speak</IonLabel>
            </IonButton>
          )}
          {handleClone && (
            <IonButton onClick={handleClone} className="mr-4">
              <IonIcon icon={copyOutline} className="mx-2" />
              <IonLabel>Clone</IonLabel>
            </IonButton>
          )}
          {board && showEdit && (
            <IonButton routerLink={`/boards/${board.id}/edit`} className="mr-4">
              <IonIcon icon={createOutline} className="mx-2" />
              <IonLabel>Edit</IonLabel>
            </IonButton>
          )}
          {board && showEdit && (
            <IonButton
              routerLink={`/boards/${board.id}/gallery`}
              className="mr-4"
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
