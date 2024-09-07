import { useEffect, useRef, useState } from "react";
import { Board, getBoard } from "../../data/boards";
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
  IonTextarea,
  IonToolbar,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";

import {
  arrowBackCircleOutline,
  playCircleOutline,
  trashBinOutline,
} from "ionicons/icons";

import { useParams } from "react-router";
import React from "react";
import FloatingWordsBtn from "../utils/FloatingWordsBtn";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import DraggableGrid from "../images/DraggableGrid";
import { playAudioList } from "../../data/utils";
import { Image } from "../../data/images";
import { clickWord } from "../../data/audits";
import ActivityTrackingConsent from "../utils/ActivityTrackingConsent";
import { getDynamicBoard } from "../../data/dynamic_boards";
interface LockedDynamicBoardProps {
  boardId: string;
  boardType: string;
}
const LockedDynamicBoard: React.FC<LockedDynamicBoardProps> = ({
  boardId,
  boardType,
}) => {
  const [board, setBoard] = useState<Board>();
  // const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [imageCount, setImageCount] = useState(0);
  const { currentUser } = useCurrentUser();
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [previousLabel, setPreviousLabel] = useState<string | undefined>(
    undefined
  );
  const [currentBoardId, setCurrentBoardId] = useState(boardId);
  const [currentBoardType, setCurrentBoardType] = useState(boardType);

  const fetchBoard = async () => {
    let board;
    if (currentBoardType === "dynamic") {
      console.log("Fetching dynamic board", currentBoardId);
      board = await getDynamicBoard(currentBoardId);
    } else {
      console.log("Fetching board", currentBoardId);
      board = await getBoard(currentBoardId);
    }

    if (!board) {
      console.error("Error fetching board");
      return;
    } else {
      const imgCount = board?.images?.length;
      setImageCount(imgCount as number);
      setShowLoading(false);

      setBoard(board);
      setNumOfColumns(board.number_of_columns);

      // if (board?.status === "pending") {
      //   console.log("Board is pending");
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 3000);
      // }
    }
  };

  const handleImageClick = async (image: Image) => {
    if (currentUser?.settings?.disable_audit_logging) {
      console.log("Audit logging is disabled");
      return;
    }
    const text = image.label;
    if (previousLabel === text) {
      console.log("Same label clicked", text);
    } else {
      const payload = {
        word: text,
        previousWord: previousLabel,
        timestamp: new Date().toISOString(),
        boardId: board?.id,
      };
      clickWord(payload);
      setPreviousLabel(text);
    }
  };
  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setAudioList([]);
    setShowIcon(false);
    setPreviousLabel(undefined);
  };

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

  const handleSetNextBoardId = (id: string) => {
    setCurrentBoardType("dynamic");
    setCurrentBoardId(id);
    setShowLoading(true);
  };

  useEffect(() => {
    console.log("Fetching new board", currentBoardId);
    fetchBoard();
  }, [currentBoardId]);

  useIonViewWillEnter(() => {
    async function fetchData() {
      await fetchBoard();
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetchBoard();
    console.log("Board", board);
  }, []);

  const [audioList, setAudioList] = useState<string[]>([]);

  const handleUpdateAudioList = (audio: string) => {
    setAudioList([...audioList, audio]);
  };

  const handlePlayAudioList = async () => {
    await playAudioList(audioList);
  };

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      fetchBoard();
    }, 3000);
  };

  return (
    <>
      <IonHeader className="bg-inherit shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              routerLink={
                currentBoardType === "dynamic" ? "/dynamic_boards" : "/boards"
              }
            >
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonItem slot="start" className="ml-2 w-full" lines="none">
            <IonInput
              placeholder="Click an image to begin speaking"
              ref={inputRef}
              readonly={true}
              type="text"
              className="w-full text-sm text-justify text-wrap"
            ></IonInput>
          </IonItem>

          <IonButtons slot="start">
            {showIcon && (
              <IonButton size="small" onClick={handlePlayAudioList}>
                <IonIcon
                  slot="icon-only"
                  className="tiny"
                  icon={playCircleOutline}
                  // onClick={() => speak(inputRef.current?.value as string)}
                ></IonIcon>
              </IonButton>
            )}
          </IonButtons>
          <IonButtons slot="end">
            {showIcon && (
              <IonButton size="small" onClick={() => clearInput()}>
                <IonIcon
                  slot="icon-only"
                  className="tiny"
                  icon={trashBinOutline}
                  onClick={() => clearInput()}
                ></IonIcon>
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonRefresher slot="fixed" onIonRefresh={refresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <IonLoading message="Please wait..." isOpen={showLoading} />
      <h1>
        {board?.name} - {currentBoardType}
      </h1>

      {board && (
        <DraggableGrid
          setNextBoardId={handleSetNextBoardId}
          images={board.images}
          board={board}
          setShowIcon={setShowIcon}
          inputRef={inputRef}
          columns={numOfColumns}
          onLayoutChange={() => {}}
          disableReorder={true}
          onPlayAudioList={handleUpdateAudioList}
          onImageClick={handleImageClick}
          viewOnClick={false}
          showRemoveBtn={false}
          setShowLoading={setShowLoading}
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

export default LockedDynamicBoard;
