import { BoardGroup } from "../../data/board_groups";
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
  addCircleOutline,
} from "ionicons/icons";
import AddToTeamForm from "../teams/AddToTeamForm";
import { useHistory } from "react-router";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../main_menu/MainMenu";
import DraggableGroupGrid from "./DraggableGroupGrid";

interface BoardViewProps {
  boardGroup: BoardGroup;
  showEdit: boolean;
  currentUserTeams: any;
  inputRef?: any;
  setShowIcon: any;
  showLoading: boolean;
  boardCount?: number;
  numOfColumns: number;
  handleClone?: any;
  showShare?: boolean;
  locked?: boolean;
}

const BoardGroupView: React.FC<BoardViewProps> = ({
  boardGroup,
  showEdit,
  inputRef,
  setShowIcon,
  showLoading,
  boardCount,
  numOfColumns,
  handleClone,
  locked,
}) => {
  const { currentUser } = useCurrentUser();

  const shouldShowRemoveBtn = currentUser?.role === "admin";

  const handlePlayAudioList = (audioList: string[]) => {
    console.log("handlePlayAudioList: ", audioList);
  };

  const handleBoardClick = (boardId: string) => {
    console.log("handleBoardClick: ", boardId);
    if (locked) {
      console.log("Board is locked", boardId);
      return;
    }
  };

  return (
    <>
      <div className="flex justify-center items-center my-3">
        <IonButtons slot="end">
          {boardGroup && (
            <IonButton
              routerLink={`/board-groups/${boardGroup.id}/locked`}
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
          {boardGroup && showEdit && (
            <IonButton
              routerLink={`/board-groups/${boardGroup.id}/edit`}
              className="mr-1 text-xs text-xs md:text-md lg:text-lg"
            >
              <IonIcon icon={createOutline} className="mx-2" />
              <IonLabel>Edit</IonLabel>
            </IonButton>
          )}
        </IonButtons>
      </div>

      <div>
        <h1 className="text-center text-2xl font-bold">
          {boardGroup && boardGroup.name} - {locked ? "Locked" : "Unlocked"}
        </h1>
        {boardGroup && (
          <DraggableGroupGrid
            boards={boardGroup.boards}
            boardGroup={boardGroup}
            setShowIcon={setShowIcon}
            inputRef={inputRef}
            columns={numOfColumns}
            disableReorder={true}
            mute={locked}
            viewOnClick={!locked}
            onBoardClick={handleBoardClick}
            viewLockOnClick={locked}
            showRemoveBtn={!locked && shouldShowRemoveBtn}
            onPlayAudioList={handlePlayAudioList}
          />
        )}
      </div>

      {boardCount && boardCount < 1 && (
        <div className="text-center pt-32">
          <p>No boards found</p>
        </div>
      )}
    </>
  );
};

export default BoardGroupView;
