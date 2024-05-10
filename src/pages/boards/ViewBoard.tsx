import { useEffect, useRef, useState } from "react";
import {
  Board,
  addToTeam,
  cloneBoard,
  deleteBoard,
  getBoard,
  rearrangeImages,
} from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
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
  addCircleOutline,
  arrowBackCircleOutline,
  copyOutline,
  createOutline,
  documentLockOutline,
  pencilOutline,
  shareOutline,
} from "ionicons/icons";

import { useHistory, useParams } from "react-router";
import "./ViewBoard.css";
import React from "react";
import FloatingWordsBtn from "../../components/utils/FloatingWordsBtn";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import DraggableGrid from "../../components/images/DraggableGrid";
import { Team } from "../../data/teams";
import AddToTeamForm from "../../components/teams/AddToTeamForm";
import Tabs from "../../components/utils/Tabs";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import ConfirmDeleteAlert from "../../components/utils/ConfirmDeleteAlert";

const ViewBoard: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const addToTeamRef = useRef<HTMLDivElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [gridSize, setGridSize] = useState(4);
  const { currentUser, isWideScreen } = useCurrentUser();
  const [gridLayout, setGrid] = useState<any>([]);
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [currentUserTeams, setCurrentUserTeams] = useState<Team[]>();
  const [reorder, setReorder] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>();
  const history = useHistory();

  const handleAddToTeam = async (teamId: string) => {
    const boardId = params.id;
    console.log("teamId", teamId);
    if (!teamId) {
      return;
    }
    const response = await addToTeam(boardId, teamId);
    if (response) {
      history.push("/teams/" + teamId);
    }
  };

  const fetchBoard = async () => {
    const board = await getBoard(params.id);

    if (!board) {
      console.error("Error fetching board");
      setShowLoading(false);
      alert("Error fetching board");
      return;
    } else {
      const imgCount = board?.images?.length;
      setCurrentUserTeams(board?.current_user_teams);
      console.log("currentUserTeams", board?.current_user_teams);
      setImageCount(imgCount as number);
      setShowLoading(false);
      const userCanEdit = board.can_edit || currentUser?.role === "admin";
      setShowEdit(userCanEdit);

      setBoard(board);
      setNumOfColumns(board.number_of_columns);
      setGridSize(board.number_of_columns);

      if (board?.status === "pending") {
        setShowLoading(true);
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      }
    }
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setShowIcon(false);
  };
  const toggleAddToTeam = () => {
    addToTeamRef.current?.classList.toggle("hidden");
  };

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

  useEffect(() => {
    console.log("USE EFFECT");
    // fetchBoard();
  }, []);

  useIonViewWillEnter(() => {
    console.log("USE ION VIEW WILL ENTER");
    fetchBoard();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      fetchBoard();
    }, 5000);
  };

  const handleClone = async () => {
    try {
      console.log("Cloning board: ", params.id);
      // Implement clone board logic
      const clonedBoard = await cloneBoard(params.id);
      console.log("Cloned board: ", clonedBoard);
      if (clonedBoard && clonedBoard.id) {
        const updatedBoard = await rearrangeImages(clonedBoard.id);
        setBoard(updatedBoard);
      }
      console.log("Updated board: ", board);
      window.location.href = `/boards/${clonedBoard.id}`;
    } catch (error) {
      console.error("Error cloning board: ", error);
      alert("Error cloning board");
    }
  };

  const removeBoard = async () => {
    try {
      const boardId = params.id;
      console.log("Removing board: ", boardId);
      // Implement delete board logic
      await deleteBoard(boardId);
      window.location.href = "/boards";
    } catch (error) {
      console.error("Error removing board: ", error);
      alert("Error removing board");
    }
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none text-xl">
          <IonToolbar>
            {!showIcon && (
              <h1 className="text-center text-lg font-bold">
                {board?.name || "Board"}
              </h1>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonLoading message="Please wait..." isOpen={showLoading} />
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
              {showEdit && (
                <IonButton onClick={toggleAddToTeam} className="mr-4">
                  <IonIcon icon={shareOutline} className="mx-2" />
                  <IonLabel>Share</IonLabel>
                </IonButton>
              )}
              <IonButton
                routerLink={`/boards/${params.id}/locked`}
                className="mr-4"
              >
                <IonIcon icon={documentLockOutline} className="mx-2" />
                <IonLabel>Lock</IonLabel>
              </IonButton>
              <IonButton onClick={handleClone} className="mr-4">
                <IonIcon icon={copyOutline} className="mx-2" />
                <IonLabel>Clone</IonLabel>
              </IonButton>
              {showEdit && (
                <IonButton
                  routerLink={`/boards/${params.id}/gallery`}
                  className="mr-4"
                >
                  <IonIcon icon={createOutline} className="mx-2" />
                  <IonLabel>Edit</IonLabel>
                </IonButton>
              )}
            </IonButtons>
          </div>
          <div className="flex justify-end items-center px-4">
            {showEdit && (
              <ConfirmDeleteAlert
                onConfirm={removeBoard}
                onCanceled={() => {}}
              />
            )}
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
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewBoard;
