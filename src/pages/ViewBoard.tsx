import { useRef, useState } from "react";
import { Board, getBoard } from "../data/boards";
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
  playCircleOutline,
  trashBinOutline,
} from "ionicons/icons";

import { useParams } from "react-router";
import "./ViewBoard.css";
import ImageGallery from "../components/ImageGallery";
import React from "react";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import FloatingWordsBtn from "../components/FloatingWordsBtn";

const ViewBoard: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [imageCount, setImageCount] = useState(0);

  const fetchBoard = async () => {
    const board = await getBoard(params.id);
    if (!board) {
      console.error("Error fetching board");
      return;
    } else {
      const imgCount = board?.images?.length;
      console.log("Image count: ", imgCount);
      setImageCount(imgCount as number);
      setShowLoading(false);
      const result = board.predefined ? false : true;
      const userCanEdit = board.can_edit;
      setShowEdit(userCanEdit && result);

      setBoard(board);

      if (board?.status === "pending") {
        setShowLoading(true);
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      }
    }
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
          <IonItem slot="start" className="w-full">
            <IonInput
              placeholder={board?.name}
              ref={inputRef}
              readonly={true}
              className="w-full text-xs text-justify"
            ></IonInput>
          </IonItem>
          <IonButtons slot="start">
            {showIcon && (
              <IonButton
                size="small"
                onClick={() => speak(inputRef.current?.value as string)}
              >
                <IonIcon
                  slot="icon-only"
                  className="tiny"
                  icon={playCircleOutline}
                  onClick={() => speak(inputRef.current?.value as string)}
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
            {showEdit && !showIcon && (
              <IonButton routerLink={`/boards/${params.id}/gallery`}>
                <IonIcon icon={addCircleOutline} />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={true}>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonLoading message="Please wait..." isOpen={showLoading} />
        {board && board.images && board.images.length > 0 && (
          <ImageGallery
            images={board.images}
            board={board}
            setShowIcon={setShowIcon}
            inputRef={inputRef}
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
