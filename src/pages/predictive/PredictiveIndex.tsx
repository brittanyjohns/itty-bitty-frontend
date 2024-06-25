import { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Image, getPredictiveImages } from "../../data/images";
import MainMenu from "../../components/main_menu/MainMenu";
import { useHistory, useParams } from "react-router";
import Tabs from "../../components/utils/Tabs";
import {
  addCircleOutline,
  arrowBackCircleOutline,
  images,
  playCircleOutline,
  text,
  trashBinOutline,
} from "ionicons/icons";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

import { getInitialImages } from "../../data/boards";
import PredictiveImageGallery from "../../components/predictive/PredictiveImageGallery";
import { speak } from "../../hoarder/TextToSpeech";
import FloatingWordsBtn from "../../components/utils/FloatingWordsBtn";
import { set } from "react-hook-form";
import { clickWord } from "../../data/audits";
import { playAudioList } from "../../data/utils";

const PredictiveImagesScreen: React.FC = () => {
  const startingImageId = useParams<{ id: string }>().id;
  const [initialImages, setImages] = useState<Image[]>([]);
  const history = useHistory();
  const [boardId, setBoardId] = useState("");
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [previousLabel, setPreviousLabel] = useState<string | undefined>(
    undefined
  );

  const fetchFirstBoard = async () => {
    const imgs = await getInitialImages();
    setImages(imgs);
  };

  const handleClickWord = async (image: Image) => {
    const text = image.label;
    if (previousLabel === text) {
      console.log("Same label clicked", text);
      return;
    } else {
      const payload = {
        word: text,
        previousWord: previousLabel,
        timestamp: new Date().toISOString(),
      };
      clickWord(payload);
      setPreviousLabel(text);
      console.log("New label clicked", text);
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
    // setAudioList([...audioList, audioSrc as string]);
    // const audio = new Audio(audioSrc);
    // audio.play();
    console.log("Playing audio: ", audioSrc);
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

  const clearInput = () => {
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

  const [audioList, setAudioList] = useState<string[]>([]);

  const handleUpdateAudioList = (audio: string) => {
    setAudioList([...audioList, audio]);
  };

  const handlePlayAudioList = async () => {
    await playAudioList(audioList);
  };

  const refresh = (e: CustomEvent) => {
    // Implement the logic to refresh images here, for example:
    e.detail.complete();
  };

  return (
    <>
      <MainMenu />
      <h1 className="text-2xl text-center">Predictive Images</h1>
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink="/boards">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonItem slot="start" className="w-full" lines="none">
              <IonInput
                placeholder="Predictive Images - BETA"
                ref={inputRef}
                readonly={true}
                className="w-full text-md md:text-lg lg:text-xl text-justify bg-inherit"
              ></IonInput>
            </IonItem>
            <IonButtons slot="start">
              {showIcon && (
                <IonButton size="small" onClick={handlePlayAudioList}>
                  <IonIcon
                    slot="icon-only"
                    className="tiny"
                    icon={playCircleOutline}
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
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent />
          </IonRefresher>
          <PredictiveImageGallery
            initialImages={initialImages}
            onImageSpeak={handleImageSpeak}
          />
          {/* <FloatingWordsBtn inputRef={inputRef} /> */}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default PredictiveImagesScreen;
