import { useEffect, useRef, useState } from "react";
import {
  Board,
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
  IonInput,
  IonItem,
  IonLabel,
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
  albumsOutline,
  arrowBackCircleOutline,
  copy,
  copyOutline,
  playCircleOutline,
  trashBinOutline,
} from "ionicons/icons";

import { useHistory, useParams } from "react-router";
import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import DraggableGrid from "../../components/images/DraggableGrid";
import { generatePlaceholderImage, playAudioList } from "../../data/utils";
import { Image, ImageGalleryProps } from "../../data/images";
import { clickWord } from "../../data/audits";
import FullscreenToggle from "../../components/utils/FullscreenToggle";
import ActivityTrackingConsent from "../../components/utils/ActivityTrackingConsent";
import ImageList from "../../components/utils/ImageList";
import ImageGalleryItem from "../../components/images/ImageGalleryItem";
import ConfirmAlert from "../../components/utils/ConfirmAlert";
import { getCurrentUser } from "../../data/users";

const ViewLockedBoard: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [imageCount, setImageCount] = useState(0);
  const {
    currentUser,
    smallScreen,
    mediumScreen,
    largeScreen,
    setCurrentUser,
  } = useCurrentUser();
  const [numOfColumns, setNumOfColumns] = useState(4);
  const history = useHistory();
  const [previousLabel, setPreviousLabel] = useState<string | undefined>(
    undefined
  );

  const [retryCount, setRetryCount] = useState(0);

  const [selectedImageSrcs, setSelectedImageSrcs] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [showImages, setShowImages] = useState(
    selectedImageSrcs.length > 0 ? true : false
  );

  const fetchBoard = async () => {
    const board = await getBoard(params.id);
    if (!board) {
      console.error("Error fetching board");
      return;
    } else {
      const imgCount = board?.images?.length;
      setImageCount(imgCount as number);
      setShowLoading(false);

      setBoard(board);
      const layout = board.layout[currentScreenSize];
      const margin = board.margin_settings[currentScreenSize];
    }
  };

  const handleImageClick = async (image: Image) => {
    if (!currentUser?.settings?.enable_text_display) {
      if (inputRef.current) {
        inputRef.current.hidden = true;
      }
    }
    if (currentUser?.settings?.enable_image_display) {
      let imgSrc = image.src;
      if (!imgSrc) {
        const placeholderUrl = generatePlaceholderImage(image.label);
        imgSrc = placeholderUrl;
      }

      const sourcesToSet = [...selectedImageSrcs, imgSrc];

      setSelectedImageSrcs(sourcesToSet);
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
    if (previousLabel !== text) {
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
    console.log("Clearing input");
    if (inputRef.current) {
      console.log("Input ref: ", inputRef.current);
      inputRef.current.value = "";
    }
    setAudioList([]);
    setSelectedImageSrcs([]);
    setSelectedImages([]);
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

    const fetchUser = async () => {
      // let retryCount = 0;
      console.log("Fetching user...", retryCount);
      const user = await getCurrentUser();
      if (user) setCurrentUser(user);
      {
        setRetryCount(retryCount + 1);
        if (retryCount < 3) {
          console.log("Retrying...");
        }
      }
      console.log("User: ", user);
      return user;
    };
    fetchUser();
    fetchData();
  }, []);

  useEffect(() => {
    if (board) {
      if (smallScreen) setNumOfColumns(board?.small_screen_columns || 4);
      else if (mediumScreen) setNumOfColumns(board?.medium_screen_columns || 4);
      else if (largeScreen) setNumOfColumns(board?.large_screen_columns || 4);
    }
  }, [smallScreen, mediumScreen, largeScreen, board]);

  const [xMargin, setXMargin] = useState(0);
  const [yMargin, setYMargin] = useState(0);
  const [cloneIsOpen, setCloneIsOpen] = useState(false);
  const [currentScreenSize, setCurrentScreenSize] = useState("lg");

  const isPreset = board?.predefined === true;

  // const afterRemoveFromList = (image: Image) => {
  //   console.log("AFTER Remove image from list: ", image);

  //   const labelToRemove = image.label;
  //   const audioToRemove = image.audio;
  //   const newAudioList = audioList.filter((audio) => audio !== audioToRemove);
  //   setAudioList(newAudioList);
  //   if (!inputRef.current || !inputRef.current.value) {
  //     return;
  //   }
  //   if (typeof inputRef.current.value === "string") {
  //     const newVal = inputRef.current?.value.replace(labelToRemove, "");
  //     console.log("New value: ", newVal);
  //     console.log("labelToRemove", labelToRemove);
  //     console.log("inputRef.current.value", inputRef.current.value);
  //     inputRef.current.value = newVal;
  //   }
  //   // const newImages = selectedImages.filter((img) => img.id !== image.id);
  //   // console.log("New images: ", newImages);
  //   // setSelectedImages(newImages);
  //   // setShowIcon(Boolean(newImages.length));
  // };

  useEffect(() => {
    if (board) {
      setBoard(board);
      const layout = board.layout[currentScreenSize];
      const margin = board.margin_settings[currentScreenSize];
      if (margin) {
        setXMargin(margin.x);
        setYMargin(margin.y);
      } else {
        setXMargin(0);
        setYMargin(0);
      }
    }
  }, [board, currentScreenSize]);

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
    <IonPage id="view-board-page">
      <IonHeader className="bg-inherit shadow-none">
        <IonToolbar className="mb-3">
          <div className="flex justify-between items-center py-2 mb-4">
            <IonButtons slot="start">
              {board && !isPreset && (
                <IonButton
                  routerLink={`/boards/${board.id}`}
                  fill="default"
                  title="Back to board"
                  size={smallScreen ? "default" : "large"}
                >
                  <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
                </IonButton>
              )}
              {board && isPreset && (
                <IonButton
                  routerLink={
                    currentUser?.admin ? `/boards/${board.id}` : "/presets"
                  }
                  fill="clear"
                  title="Back to presets"
                  size={smallScreen ? "default" : "large"}
                >
                  <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
                </IonButton>
              )}
            </IonButtons>
            <p className="text-sm md:text-md lg:text-lg xl:text-xl font-bold ion-text-center">
              {board?.name}
            </p>
            <IonButtons slot="end" className="mr-2">
              {showIcon && (
                <IonButton
                  size={smallScreen ? "default" : "large"}
                  onClick={handlePlayAudioList}
                  fill="outline"
                  color={"success"}
                >
                  <IonIcon
                    slot="icon-only"
                    color="success"
                    icon={playCircleOutline}
                  ></IonIcon>
                </IonButton>
              )}

              {showIcon && (
                <IonButton
                  size={smallScreen ? "default" : "large"}
                  fill="outline"
                  onClick={() => clearInput()}
                  color={"danger"}
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
          </div>
          {showImages && (
            <ImageList
              images={selectedImages}
              setSelectedImages={setSelectedImages}
              columns={numOfColumns}
              // afterRemoveFromList={afterRemoveFromList}
              setAudioList={setAudioList}
              audioList={audioList}
              inputRef={inputRef}
            />
          )}
          <div className="bg-inherit w-full">
            <IonInput
              placeholder="Click an image to begin speaking"
              ref={inputRef}
              readonly={true}
              type="text"
              className="ml-1 text-sm md:text-md lg:text-lg xl:text-xl w-full"
            ></IonInput>
          </div>
          {/* <div slot="end" className="">
            {showIcon && (
              <IonButton
                size={smallScreen ? "default" : "large"}
                onClick={handlePlayAudioList}
                fill="default"
              >
                <IonIcon
                  slot="icon-only"
                  className="bg-transparent"
                  color="success"
                  icon={playCircleOutline}
                ></IonIcon>
              </IonButton>
            )}

            {showIcon && (
              <IonButton
                size={smallScreen ? "default" : "large"}
                fill="outline"
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
          </div> */}
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
