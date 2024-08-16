import React, { useEffect, useRef, useState } from "react";
import {
  Board,
  getBoard,
  rearrangeImages,
  cloneBoard,
} from "../../data/boards";
import {
  IonButton,
  IonContent,
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
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../../components/main_menu/MainMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";

import MainHeader from "../MainHeader";
import BoardView from "../../components/boards/BoardView";
import Tabs from "../../components/utils/Tabs";
import { refresh } from "ionicons/icons";

const ViewBoard: React.FC<any> = () => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [showIcon, setShowIcon] = useState(false);
  const { smallScreen, mediumScreen, largeScreen, currentUser } =
    useCurrentUser();
  const history = useHistory();

  const fetchBoard = async () => {
    setShowLoading(true);
    const board = await getBoard(params.id);
    if (!board) {
      console.error("Error fetching board");
      alert("Error fetching board");
      setShowLoading(false);
      return;
    }

    setShowEdit(board.can_edit || currentUser?.role === "admin");

    if (!board.layout) {
      const rearrangedBoard = await rearrangeImages(board.id);
      setBoard(rearrangedBoard);
      window.location.reload();
    } else {
      setBoard(board);
    }
    setShowLoading(false);
  };

  useEffect(() => {
    if (board) {
      if (smallScreen) setNumOfColumns(board.small_screen_columns);
      else if (mediumScreen) setNumOfColumns(board.medium_screen_columns);
      else if (largeScreen) setNumOfColumns(board.large_screen_columns);
    }
  }, [smallScreen, mediumScreen, largeScreen, board]);

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
  });

  const handleClone = async () => {
    setShowLoading(true);
    try {
      const clonedBoard = await cloneBoard(params.id);
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

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      fetchBoard();
    }, 3000);
  };

  return (
    <>
      <MainMenu pageTitle="Boards" currentUser={currentUser} />
      <StaticMenu pageTitle="Boards" currentUser={currentUser} />
      <IonPage id="main-content">
        <MainHeader pageTitle={board?.name || "Board"} />
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonLoading message="Please wait..." isOpen={showLoading} />
          {board && (
            <BoardView
              board={board}
              showEdit={showEdit}
              showShare={true}
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
