import { useRef, useState } from "react";
import { Board, getBoard, saveLayout } from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
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
  documentLockOutline,
  playCircleOutline,
  trashBinOutline,
} from "ionicons/icons";

import { useParams } from "react-router";
import "./ViewBoard.css";
import React from "react";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import FloatingWordsBtn from "../../components/FloatingWordsBtn";
import BoardGridDropdown from "../../components/BoardGridDropdown";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import DraggableGrid from "../../components/DraggableGrid";
import { set } from "react-hook-form";

const ViewBoard: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [gridSize, setGridSize] = useState(4);
  const { currentUser } = useCurrentUser();
  const [gridLayout, setGrid] = useState<any>([]);
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [reorder, setReorder] = useState(true);

  const fetchBoard = async () => {
    const board = await getBoard(params.id);
    if (!board) {
      console.error("Error fetching board");
      return;
    } else {
      const imgCount = board?.images?.length;
      setImageCount(imgCount as number);
      setShowLoading(false);
      const userCanEdit = board.can_edit || currentUser?.role === "admin";
      console.log("User can edit: ", userCanEdit);
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

  const setGridLayout = (layout: any) => {
    console.log("Setting grid layout: ", layout);
    setGrid(layout);
  };

  const speak = async (text: string) => {
    await TextToSpeech.speak({
      text: text,
      lang: "en-US",
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: "ambient",
    });
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

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

  useIonViewWillEnter(() => {
    async function fetchData() {
      await fetchBoard();
    }
    fetchData();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      fetchBoard();
    }, 3000);
  };

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/boards">
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          {!showIcon && (
            <IonItem slot="start" className="w-5/6">
              <h1 className="text-center text-lg font-bold">
                {board?.name || "Board"}
              </h1>
            </IonItem>
          )}
          <IonButtons slot="start">
            <IonButton routerLink={`/boards/${params.id}/locked`}>
              <IonIcon icon={documentLockOutline} />
            </IonButton>
          </IonButtons>
          <IonButtons slot="end" className="mr-4">
            <IonButton routerLink={`/boards/${params.id}/gallery`}>
              <IonIcon icon={addCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={true}>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonLoading message="Please wait..." isOpen={showLoading} />
        {board && (
          <DraggableGrid
            images={board.images}
            board={board}
            setShowIcon={setShowIcon}
            inputRef={inputRef}
            columns={numOfColumns}
            disableActionList={shouldDisableActionList()}
            onLayoutChange={(layout: any) => setGridLayout(layout)}
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
    </IonPage>
  );
};

export default ViewBoard;
