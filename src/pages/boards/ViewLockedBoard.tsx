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

  const [selectedImageSrcs, setSelectedImageSrcs] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [showImages, setShowImages] = useState(
    selectedImageSrcs.length > 0 ? true : false
  );

  const handleClone = async () => {
    setShowLoading(true);
    try {
      if (!board) {
        console.error("Board is missing");
        alert("Board is missing");
        return;
      }
      const clonedBoard = await cloneBoard(board.id);
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
      setNumOfColumns(board.number_of_columns);
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

    console.log("image clicked", image.label);

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
    setSelectedImageSrcs([]);
    setSelectedImages([]);
    setShowIcon(false);
    setPreviousLabel(undefined);
  };

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

  useEffect(() => {
    console.log("Selected image sources", selectedImageSrcs);
    console.log("Selected image components", selectedImages);
  }, [selectedImageSrcs, selectedImages]);

  useIonViewWillEnter(() => {
    async function fetchData() {
      await fetchBoard();
    }
    fetchData();
  }, []);

  const [xMargin, setXMargin] = useState(0);
  const [yMargin, setYMargin] = useState(0);
  const [cloneIsOpen, setCloneIsOpen] = useState(false);
  const [currentScreenSize, setCurrentScreenSize] = useState("lg");

  const isPreset = board?.predefined === true;

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
          <IonButtons slot="start">
            {board && !isPreset && (
              <IonButton
                routerLink={`/boards/${board.id}`}
                fill="clear"
                title="Back to board"
              >
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            )}
            {board && isPreset && (
              <IonButton
                routerLink={`/preset`}
                fill="clear"
                title="Back to presets"
              >
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            )}

            {board && currentUser?.admin && (
              <IonButton
                routerLink={`/boards/${board.id}`}
                fill="clear"
                title="View board"
                className="cursor-pointer"
              >
                <IonIcon slot="icon-only" icon={albumsOutline} />
              </IonButton>
            )}
          </IonButtons>
          <ConfirmAlert
            onConfirm={handleClone}
            onCanceled={() => {}}
            openAlert={cloneIsOpen}
            message="Are you sure you want to CLONE this board?"
            onDidDismiss={() => setCloneIsOpen(false)}
          />
          <div className="flex justify-center items-center">
            <p className="text-sm md:text-md lg:text-lg xl:text-xl font-bold ion-text-center">
              {board?.name}
            </p>
            {board && isPreset && (
              <IonButtons slot="end" className="flex justify-center ml-2">
                <IonButton
                  onClick={() => setCloneIsOpen(true)}
                  fill="clear"
                  shape="round"
                  size="small"
                  title="Clone board"
                >
                  <IonIcon icon={copyOutline} />
                </IonButton>
              </IonButtons>
            )}
          </div>
          {showImages && <ImageList images={selectedImages} />}
          <div className="bg-inherit">
            <IonInput
              placeholder="Click an image to begin speaking"
              ref={inputRef}
              readonly={true}
              type="text"
              className="ml-1 text-sm md:text-md lg:text-lg xl:text-xl"
            ></IonInput>
          </div>
          <IonButtons slot="end">
            {showIcon && (
              <IonButton size="small" onClick={handlePlayAudioList}>
                <IonIcon
                  slot="icon-only"
                  className="tiny"
                  icon={playCircleOutline}
                ></IonIcon>
              </IonButton>
            )}

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
