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

import { useHistory, useParams } from "react-router";
import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import DraggableGrid from "../../components/images/DraggableGrid";
import { playAudioList } from "../../data/utils";
import { Image } from "../../data/images";
import { clickWord } from "../../data/audits";
import FullscreenToggle from "../../components/utils/FullscreenToggle";
import ActivityTrackingConsent from "../../components/utils/ActivityTrackingConsent";

const ViewLockedBoard: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [imageCount, setImageCount] = useState(0);
  const { currentUser } = useCurrentUser();
  const [numOfColumns, setNumOfColumns] = useState(4);
  const history = useHistory();
  const [previousLabel, setPreviousLabel] = useState<string | undefined>(
    undefined
  );

  const fetchBoard = async () => {
    const board = await getBoard(params.id);
    if (!board) {
      console.error("Error fetching board");
      return;
    } else {
      const imgCount = board?.images?.length;
      setImageCount(imgCount as number);
      setCurrentLayout(board.layout);
      setShowLoading(false);

      setBoard(board);
      setNumOfColumns(board.number_of_columns);
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

  useIonViewWillEnter(() => {
    async function fetchData() {
      await fetchBoard();
    }
    fetchData();
  }, []);

  const [xMargin, setXMargin] = useState(0);
  const [yMargin, setYMargin] = useState(0);
  const [currentLayout, setCurrentLayout] = useState([]);
  const [currentScreenSize, setCurrentScreenSize] = useState("lg");

  useEffect(() => {
    console.log("board?.margin_settings: ", board?.margin_settings);
    if (board) {
      setBoard(board);
      const layout = board.layout[currentScreenSize];
      const margin = board.margin_settings[currentScreenSize];
      console.log("currentScreenSize: ", currentScreenSize);
      setCurrentLayout(layout);
      if (margin) {
        setXMargin(margin.x);
        setYMargin(margin.y);
      } else {
        setXMargin(0);
        setYMargin(0);
      }
    }
  }, [board, currentScreenSize]);

  // const [showTrackingConsent, setShowTrackingConsent] = useState(false);

  // useEffect(() => {
  //   const trackingConsent = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("tracking_consent="));

  //   if (!trackingConsent) setShowTrackingConsent(true);
  // }, []);

  const [audioList, setAudioList] = useState<string[]>([]);

  const handleUpdateAudioList = (audio: string) => {
    setAudioList([...audioList, audio]);
  };

  const handlePlayAudioList = async () => {
    await playAudioList(audioList);
  };

  const goToBoard = () => {
    history.push("/boards");
  };

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      fetchBoard();
    }, 3000);
  };

  return (
    <IonPage id="view-board-page">
      <IonHeader className="bg-inherit shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={goToBoard}>
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
            <FullscreenToggle />

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
            onLayoutChange={() => {}}
            disableReorder={true}
            onPlayAudioList={handleUpdateAudioList}
            onImageClick={handleImageClick}
            viewOnClick={false}
            showRemoveBtn={false}
            setShowLoading={setShowLoading}
            xMargin={xMargin}
            yMargin={yMargin}
            updateScreenSize={(newScreenSize: string) => {
              setCurrentScreenSize(newScreenSize);
            }}
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
        {/* <FloatingWordsBtn inputRef={inputRef} words={board?.floating_words} /> */}
        <ActivityTrackingConsent />
      </IonContent>
    </IonPage>
  );
};

export default ViewLockedBoard;
