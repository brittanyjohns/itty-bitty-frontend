import React, { useEffect, useRef, useState } from "react";
import { Board } from "../../data/boards";
import {
  IonButton,
  IonContent,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToast,
  IonToolbar,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../../components/main_menu/MainMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";

import MainHeader from "../MainHeader";
import BoardView from "../../components/boards/BoardView";
import Tabs from "../../components/utils/Tabs";
import { refresh } from "ionicons/icons";
import { set } from "d3";
import { getDynamicBoard } from "../../data/dynamic_boards";

const ViewDynamicBoard: React.FC<any> = () => {
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const fetchBoard = async () => {
    setShowLoading(true);
    if (isNaN(+params.id)) {
      setToastMessage("Invalid board id");
      setIsOpen(true);
      history.push("/dynamic_boards");
      setShowLoading(false);
      return;
    }
    const board = await getDynamicBoard(params.id);
    console.log("board", board);
    if (!board) {
      console.error("Error fetching board");
      setToastMessage("Error fetching board");
      setIsOpen(true);
      history.push("/dynamic_boards");
      setShowLoading(false);
      return;
    }

    setShowEdit(board.can_edit || currentUser?.role === "admin");

    if (!board.layout) {
      setToastMessage("Dynamic Board layout not found");
      setIsOpen(true);
      if (retryCount < 3) {
        setRetryCount(retryCount + 1);
      } else {
        history.push("/dynamic_boards");
      }
      setShowLoading(false);

      // const rearrangedBoard = await rearrangeImages(board.id);
      // setBoard(rearrangedBoard);

      // window.location.reload();
    } else {
      setBoard(board);
    }
    setShowLoading(false);
  };

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function load() {
      const board = await getDynamicBoard(params.id);
      if (!board) {
        console.error("Error fetching board");
        alert("Error fetching board");
        setShowLoading(false);
        return;
      }
      if (!board.layout) {
        setToastMessage("Dynamic Board layout not found");
        setIsOpen(true);
        setTimeout(() => {
          window.location.reload();
          setShowLoading(false);
        }, 3000);
      }
    }
    load();
  }, [retryCount]);

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

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      fetchBoard();
    }, 3000);
  };

  return (
    <>
      <MainMenu pageTitle="Dynamic Boards" currentUser={currentUser} />
      <StaticMenu pageTitle="Dynamic Boards" currentUser={currentUser} />
      <IonPage id="main-content">
        <MainHeader pageTitle={`${board?.name || "Dynamic Board"} Dynamic`} />
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonLoading message="Please wait..." isOpen={showLoading} />
          <h1 className="text-center text-2xl font-bold">
            TEMP - ViewDynamicBoard
          </h1>
          {board && (
            <BoardView
              boardType="dynamic"
              board={board}
              showEdit={showEdit}
              showShare={true}
              setShowIcon={setShowIcon}
              inputRef={inputRef}
              numOfColumns={numOfColumns}
              showLoading={showLoading}
              setShowLoading={setShowLoading}
            />
          )}
          <IonToast
            isOpen={isOpen}
            message={toastMessage}
            onDidDismiss={() => setIsOpen(false)}
            duration={2000}
          ></IonToast>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewDynamicBoard;
