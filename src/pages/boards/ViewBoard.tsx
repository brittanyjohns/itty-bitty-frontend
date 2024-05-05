import { useEffect, useRef, useState } from "react";
import { Board, addToTeam, getBoard } from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
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

  const shouldDisableActionList = () => {
    if (currentUser?.role === "admin") {
      return false;
    }
    if (board?.can_edit) {
      return false;
    }
    return true;
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
    }, 3000);
  };

  return (
    <>
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            {!showIcon && (
              <h1 className="text-center text-lg font-bold">
                {board?.name || "Board"}
              </h1>
            )}
            {showEdit && (
              <IonButtons slot="end">
                <IonButton onClick={toggleAddToTeam}>
                  <IonIcon icon={shareOutline} />
                </IonButton>
              </IonButtons>
            )}
            <IonButtons slot="end">
              <IonButton routerLink={`/boards/${params.id}/locked`}>
                <IonIcon icon={documentLockOutline} />
              </IonButton>
            </IonButtons>
            {showEdit && (
              <IonButtons slot="end">
                <IonButton routerLink={`/boards/${params.id}/gallery`}>
                  <IonIcon icon={createOutline} />
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonLoading message="Please wait..." isOpen={showLoading} />
          {/* <IonToolbar className="mb-6">
            {!showIcon && (
              <h1 className="text-center text-lg font-bold">
                {board?.name || "Board"}
              </h1>
            )}
            {showEdit && (
              <IonButtons slot="end">
                <IonButton onClick={toggleAddToTeam}>
                  <IonIcon icon={shareOutline} />
                </IonButton>
              </IonButtons>
            )}
            <IonButtons slot="end">
              <IonButton routerLink={`/boards/${params.id}/locked`}>
                <IonIcon icon={documentLockOutline} />
              </IonButton>
            </IonButtons>
            {showEdit && (
              <IonButtons slot="end" className="mr-4">
                <IonButton routerLink={`/boards/${params.id}/gallery`}>
                  <IonIcon icon={addCircleOutline} />
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar> */}
          <div ref={addToTeamRef} className="p-4 hidden">
            {currentUserTeams && (
              <AddToTeamForm
                onSubmit={handleAddToTeam}
                toggleAddToTeam={toggleAddToTeam}
                currentUserTeams={currentUserTeams}
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
              disableActionList={shouldDisableActionList()}
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
          <FloatingWordsBtn inputRef={inputRef} words={board?.floating_words} />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewBoard;
