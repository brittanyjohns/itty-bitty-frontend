import { useEffect, useRef, useState } from "react";
import {
  Board,
  addToTeam,
  cloneBoard,
  getBoard,
  rearrangeImages,
} from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  shareOutline,
  documentLockOutline,
  copyOutline,
  createOutline,
  chatbubbleEllipsesOutline,
} from "ionicons/icons";
import DraggableGrid from "../images/DraggableGrid";
import AddToTeamForm from "../teams/AddToTeamForm";
import { useParams } from "react-router";

interface BoardViewProps {
  board: Board;
  showEdit: boolean;
  currentUserTeams: any;
  inputRef?: any;
  addToTeamRef?: any;
  setShowIcon: any;
  showLoading: boolean;
  imageCount?: number;
  numOfColumns: number;
  handleAddToTeam: any;
  toggleAddToTeam: any;
  handleClone?: any;
  showShare?: boolean;
}

const BoardView: React.FC<any> = ({
  board,
  showEdit,
  currentUserTeams,
  inputRef,
  addToTeamRef,
  setShowIcon,
  showLoading,
  imageCount,
  numOfColumns,
  handleAddToTeam,
  toggleAddToTeam,
  handleClone,
  showShare,
}) => {
  const iconTest = (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" stroke="black" stroke-width="4" />
      <path
        d="M20 32C20 28.6863 22.6863 26 26 26H38C41.3137 26 44 28.6863 44 32C44 35.3137 41.3137 38 38 38H26C22.6863 38 20 35.3137 20 32Z"
        fill="black"
      />
      <path
        d="M48 32C48 30.3431 49.3431 29 51 29C52.6569 29 54 30.3431 54 32C54 33.6569 52.6569 35 51 35C49.3431 35 48 33.6569 48 32Z"
        fill="black"
      />
    </svg>
  );

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
            <IonButton
              routerLink={`/boards/${board.id}/gallery`}
              className="mr-4"
            >
              <IonIcon icon={createOutline} className="mx-2" />
              <IonLabel>Edit</IonLabel>
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
          showRemoveBtn={true}
        />
      )}
      {imageCount < 1 && (
        <div className="text-center pt-32">
          <p>No images found</p>
        </div>
      )}
      {board?.parent_type === "Menu" && imageCount < 1 && (
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
