import { useEffect, useRef, useState } from "react";
import {
  Board,
  addToTeam,
  cloneBoard,
  getBoard,
  rearrangeImages,
} from "../../data/boards";
import {
  IonContent,
  IonHeader,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
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

  const fetchBoard = async () => {
    const board = await getBoard(params.id);

    if (!board) {
      console.error("Error fetching board");
      setShowLoading(false);
      alert("Error fetching board");
      return;
    } else {
      setCurrentUserTeams(board?.current_user_teams);
      setShowLoading(false);
      const userCanEdit = board.can_edit || currentUser?.role === "admin";
      setShowEdit(userCanEdit);

      setBoard(board);
      setNumOfColumns(board.number_of_columns);

      // if (board?.status === "pending") {
      //   setShowLoading(true);
      // }
    }
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setShowIcon(false);
  };
  // const toggleAddToTeam = () => {
  //   addToTeamRef.current?.classList.toggle("hidden");
  // };

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

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
        <IonHeader className="bg-inherit shadow-none text-xl">
          <IonToolbar>
            {!showIcon && (
              <h1 className="text-center text-lg font-bold">
                {board?.name || "Board"}
              </h1>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
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
