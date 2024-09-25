import { createRef, useEffect, useRef, useState } from "react";
import { ChildBoard, getChildBoard } from "../../data/child_boards";
import { AUTO_REFRESH_RATE, REFRESH_RATE } from "../../data/constants";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonLoading,
  IonPage,
  IonRefresher,
  IonToolbar,
  useIonViewDidLeave,
} from "@ionic/react";

import {
  arrowBackCircleOutline,
  create,
  playCircleOutline,
  trashBinOutline,
} from "ionicons/icons";

import { useHistory, useParams } from "react-router";
import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import DraggableGrid from "../../components/images/DraggableGrid";
import { generatePlaceholderImage, playAudioList } from "../../data/utils";
import { Image } from "../../data/images";
import { clickWord } from "../../data/audits";

import FullscreenToggle from "../../components/utils/FullscreenToggle";
import ImageList from "../../components/utils/ImageList";

const ViewChildBoardScreen: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<ChildBoard>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [imageCount, setImageCount] = useState(0);
  const {
    currentUser,
    currentAccount,
    smallScreen,
    mediumScreen,
    largeScreen,
  } = useCurrentUser();
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [previousLabel, setPreviousLabel] = useState<string | undefined>(
    undefined
  );

  const [showText, setShowText] = useState(
    currentAccount?.settings?.enable_text_display
  );

  useEffect(() => {
    if (board) {
      if (smallScreen) setNumOfColumns(board?.small_screen_columns || 4);
      else if (mediumScreen) setNumOfColumns(board?.medium_screen_columns || 4);
      else if (largeScreen) setNumOfColumns(board?.large_screen_columns || 4);
    }
  }, [smallScreen, mediumScreen, largeScreen, board]);

  const [showHeader, setShowHeader] = useState(true);
  const history = useHistory();

  const [xMargin, setXMargin] = useState(0);
  const [yMargin, setYMargin] = useState(0);
  const [currentLayout, setCurrentLayout] = useState([]);
  const [currentScreenSize, setCurrentScreenSize] = useState("lg");

  const [audioList, setAudioList] = useState<string[]>([]);
  const [account, setAccount] = useState(currentAccount);

  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [showImages, setShowImages] = useState(
    selectedImages.length > 0 ? true : false
  );
  useEffect(() => {
    if (board) {
      setBoard(board);
      const layout = board.layout[currentScreenSize];
      const margin = board.margin_settings[currentScreenSize];
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

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
    // openChildMenu();
  });

  const fetchBoard = async () => {
    const board = await getChildBoard(Number(params.id));
    if (!board) {
      console.error("Error fetching board");
      return;
    } else {
      const imgCount = board?.images?.length;
      setImageCount(imgCount as number);
      setShowLoading(false);
      setBoard(board);
      setNumOfColumns(board.number_of_columns);
    }
  };

  useEffect(() => {
    const shouldSetShowText = currentAccount?.settings?.enable_text_display;
    setShowText(shouldSetShowText);
    const shouldSetShowImages = currentAccount?.settings?.enable_image_display;
    setShowImages(shouldSetShowImages);

    setShowHeader(
      shouldSetShowImages || shouldSetShowText || audioList.length > 0
    );
  }, [selectedImages, audioList]);

  const handleImageClick = async (image: Image) => {
    if (!currentAccount?.settings?.enable_text_display) {
      if (inputRef.current) {
        inputRef.current.hidden = true;
      }
    }
    if (currentAccount?.settings?.enable_image_display) {
      let imgSrc = image.src;
      if (!imgSrc) {
        const placeholderUrl = generatePlaceholderImage(image.label);
        imgSrc = placeholderUrl;
      }

      const imagesToSet = [...selectedImages, image];

      setSelectedImages(imagesToSet);
      setShowIcon(true);
      setShowImages(true);
    }

    if (currentUser?.settings?.disable_audit_logging) {
      console.log("Audit logging is disabled");
      return;
    }
    const text = image.label;
    if (previousLabel === text) {
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
    setSelectedImages([]);
  };

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

  useEffect(() => {
    fetchBoard();

    const intervalId = setInterval(() => {
      fetchBoard();
    }, AUTO_REFRESH_RATE); // Fetch child boards every 30 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [account]);

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

  const gotToAccountDashboard = () => {
    history.push("/account-dashboard");
  };

  return (
    <IonPage id="view-board-page">
      <FullscreenToggle />
      <IonRefresher slot="fixed" onIonRefresh={refresh} />

      <IonHeader className="bg-inherit shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={gotToAccountDashboard}>
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          <p className="text-sm md:text-md lg:text-lg xl:text-xl font-bold ion-text-center">
            {board?.name}
          </p>
          {showImages && (
            <ImageList images={selectedImages} columns={numOfColumns} />
          )}
          <div className="bg-inherit">
            <IonInput
              placeholder="Click an image to begin speaking"
              ref={inputRef}
              readonly={true}
              type="text"
              className="ml-1 text-sm md:text-md lg:text-lg xl:text-xl"
            ></IonInput>
          </div>
          <IonButtons slot="end" className="">
            {showIcon && (
              <IonButton
                size={smallScreen ? "default" : "large"}
                onClick={handlePlayAudioList}
                fill="default"
              >
                <IonIcon
                  slot="icon-only"
                  className=""
                  color="success"
                  icon={playCircleOutline}
                ></IonIcon>
              </IonButton>
            )}

            {showIcon && (
              <IonButton
                size={smallScreen ? "default" : "large"}
                fill="default"
                onClick={() => clearInput()}
              >
                <IonIcon
                  slot="icon-only"
                  className=""
                  color="danger"
                  icon={trashBinOutline}
                  onClick={() => clearInput()}
                ></IonIcon>
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
      </IonContent>
    </IonPage>
  );
};

export default ViewChildBoardScreen;
