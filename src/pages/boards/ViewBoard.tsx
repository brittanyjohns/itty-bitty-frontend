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
  IonLoading,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";

import { useHistory, useParams } from "react-router";
import "./ViewBoard.css";
import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Team } from "../../data/teams";
import Tabs from "../../components/utils/Tabs";
import MainMenu from "../../components/main_menu/MainMenu";
import BoardView from "../../components/boards/BoardView";
import { addCircleOutline } from "ionicons/icons";

const ViewBoard: React.FC<any> = () => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const { currentUser } = useCurrentUser();
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [currentUserTeams, setCurrentUserTeams] = useState<Team[]>();
  const { isWideScreen } = useCurrentUser();

  const fetchBoard = async () => {
    console.log("Fetching board: ", params.id);
    const board = await getBoard(params.id);

    if (!board) {
      console.error("Error fetching board");
      setShowLoading(false);
      alert("Error fetching board");
      return;
    }

    setCurrentUserTeams(board?.current_user_teams);
    const userCanEdit = board.can_edit || currentUser?.role === "admin";
    setShowEdit(userCanEdit);

    // Check if board layout is empty and rearrange images if necessary
    if (!board.layout) {
      console.log("Empty board layout, rearranging images");
      const rearrangedBoard = await rearrangeImages(board.id);
      setBoard(rearrangedBoard);
    } else {
      setBoard(board);
    }

    setNumOfColumns(board.number_of_columns);
    setShowLoading(false);
  };

  useEffect(() => {
    fetchBoard();
  }, [params.id]);

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

  const clearInput = () => {
    inputRef.current!.value = "";
  };

  useIonViewWillEnter(() => {
    fetchBoard();
  }, []);

  const handleClone = async () => {
    try {
      const clonedBoard = await cloneBoard(params.id);
      if (clonedBoard && clonedBoard.id) {
        const updatedBoard = await rearrangeImages(clonedBoard.id);
        setBoard(updatedBoard);
      }
      window.location.href = `/boards/${clonedBoard.id}`;
    } catch (error) {
      console.error("Error cloning board: ", error);
      alert("Error cloning board");
    }
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none text-xl mt-2">
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
              <IonButton routerLink="/boards/new">
                <IonIcon icon={addCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {!showIcon && (
            <h1 className="text-center text-lg font-bold">
              {board?.name || "Board"}
            </h1>
          )}
          <IonLoading message="Please wait..." isOpen={showLoading} />
          {board && (
            <BoardView
              board={board}
              showEdit={showEdit}
              showShare={true}
              currentUserTeams={currentUserTeams}
              handleClone={handleClone}
              setShowIcon={setShowIcon}
              inputRef={inputRef}
              numOfColumns={numOfColumns}
              showLoading={showLoading}
            />
          )}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewBoard;
