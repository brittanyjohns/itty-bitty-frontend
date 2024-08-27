import { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { Image, getPredictiveImages } from "../../data/images";
import MainMenu from "../../components/main_menu/MainMenu";
import { useHistory, useParams } from "react-router";
import Tabs from "../../components/utils/Tabs";
import {
  arrowBackCircleOutline,
  imageOutline,
  pencilOutline,
  playCircleOutline,
  refreshCircleOutline,
  trashBinOutline,
} from "ionicons/icons";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

import { Board, getInitialPredictive } from "../../data/boards";
import PredictiveImageGallery from "../../components/predictive/PredictiveImageGallery";
import { clickWord } from "../../data/audits";
import { playAudioList } from "../../data/utils";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";

const PredictiveImagesScreen: React.FC = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  const startingImageId = useParams<{ id: string }>().id;
  const [initialImages, setImages] = useState<Image[]>([]);
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [previousLabel, setPreviousLabel] = useState<string | undefined>(
    undefined
  );
  const [imageId, setImageId] = useState<string | undefined>(undefined);
  const [predictive, setPredictive] = useState<Board>();

  const history = useHistory();

  const fetchFirstBoard = async () => {
    const initialPredictiveBoard = await getInitialPredictive();
    setPredictive(initialPredictiveBoard);
    const imgs = initialPredictiveBoard.images;
    if (!imgs) {
      return;
    }
    setImages(imgs);
  };

  const handleClickWord = async (image: Image) => {
    const text = image.label;
    if (previousLabel === text) {
      return;
    } else {
      const payload = {
        word: text,
        previousWord: previousLabel,
        timestamp: new Date().toISOString(),
      };
      clickWord(payload);
      setPreviousLabel(text);
    }
  };

  const handleImageSpeak = (image: Image) => {
    handleClickWord(image);
    const audioSrc = image.audio;
    const label = image.label;

    if (inputRef.current) {
      inputRef.current.value += ` ${label}`;
    }
    if (inputRef.current?.value) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }

    if (!audioSrc) {
      speak(label);
      return;
    }
    handleUpdateAudioList(audioSrc);

    const audio = new Audio(audioSrc);

    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {})
        .catch((error) => {
          console.error("Error playing audio: ", error);
          speak(label);
        });
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

  const clearInput = async () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setAudioList([]);
    setShowIcon(false);
    setPreviousLabel(undefined);
    fetchFirstBoard();
  };

  const setStartingImages = async (startingImageId: string) => {
    const imgs = await getPredictiveImages(startingImageId);
    setImages(imgs);
  };

  useEffect(() => {
    if (startingImageId) {
      setStartingImages(startingImageId);
    } else {
      fetchFirstBoard();
    }
  }, []);

  const loadMoreImages = async () => {
    const predictiveBoard = await getInitialPredictive();
    const newImages = predictiveBoard.images || [];
    let allImages: Image[] = [];
    if (newImages) {
      allImages = [...newImages, ...initialImages];
    } else {
      allImages = initialImages;
    }

    const uniqueImageIds = new Set(allImages.map((image) => image.id));
    const uniqueImages = Array.from(uniqueImageIds).map((id) =>
      allImages.find((image) => image.id === id)
    );

    const imagesToSet = uniqueImages.filter(
      (image) => image !== undefined
    ) as Image[];

    setImages(imagesToSet);
  };

  const [audioList, setAudioList] = useState<string[]>([]);

  const handleUpdateAudioList = (audio: string) => {
    setAudioList([...audioList, audio]);
  };

  const handlePlayAudioList = async () => {
    await playAudioList(audioList);
  };

  const handleEdit = () => {
    if (!predictive) {
      return;
    }
    history.push(`/boards/${predictive.id}`);
  };

  const refresh = (e: CustomEvent) => {
    // Implement the logic to refresh images here, for example:
    e.detail.complete();
  };

  return (
    <>
      <MainMenu
        pageTitle="Predictive - beta"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Predictive - beta"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Predictive - beta"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="ion-padding">
          <IonItem className="w-full my-2" lines="none">
            <IonButtons slot="start" className="ml-0">
              <IonButton routerLink="/boards">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonItem slot="start" className="w-full" lines="none">
              <IonInput
                placeholder="Click on images to speak"
                ref={inputRef}
                readonly={true}
                className="w-full text-md md:text-lg lg:text-xl text-justify bg-inherit mr-0"
              ></IonInput>
            </IonItem>
            <IonButtons slot="start" className="ml-0">
              {currentUser?.admin && (
                <IonButton size="small" onClick={handleEdit}>
                  <IonIcon
                    slot="icon-only"
                    className="tiny"
                    icon={pencilOutline}
                  ></IonIcon>
                </IonButton>
              )}
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
                <IonButton size="small" onClick={loadMoreImages}>
                  <IonIcon
                    slot="icon-only"
                    className="tiny"
                    icon={refreshCircleOutline}
                  ></IonIcon>
                </IonButton>
              )}
              {showIcon && (
                <>
                  <IonButton size="small" onClick={() => clearInput()}>
                    <IonIcon
                      slot="icon-only"
                      className="tiny"
                      icon={trashBinOutline}
                    ></IonIcon>
                  </IonButton>
                  <IonButton routerLink={`/images/${imageId}`}>
                    <IonIcon icon={imageOutline} />
                  </IonButton>
                </>
              )}
            </IonButtons>
          </IonItem>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent />
          </IonRefresher>
          {predictive && (
            <PredictiveImageGallery
              predictiveBoard={predictive}
              initialImages={initialImages}
              onImageSpeak={handleImageSpeak}
              setImageId={setImageId}
            />
          )}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default PredictiveImagesScreen;
