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
import { PredictiveImage, getPredictiveImages } from "../data/images";
import MainMenu from "../components/MainMenu";
import { useHistory } from "react-router";
import Tabs from "../components/Tabs";
import {
  addCircleOutline,
  arrowBackCircleOutline,
  playCircleOutline,
  trashBinOutline,
} from "ionicons/icons";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

import { getInitialImages } from "../data/boards";
import PredictiveImageGallery from "../components/PredictiveImageGallery";
import { speak } from "../hoarder/TextToSpeech";
import FloatingWordsBtn from "../components/FloatingWordsBtn";

const ImagesScreen: React.FC = () => {
  const [initialImages, setImages] = useState<PredictiveImage[]>([]);
  const history = useHistory();
  const [boardId, setBoardId] = useState("");
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);

  const fetchFirstBoard = async () => {
    const imgs = await getInitialImages();
    setImages(imgs);
  };

  const handleImageSpeak = (image: PredictiveImage) => {
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
    // setAudioList([...audioList, audioSrc as string]);
    const audio = new Audio(audioSrc);
    audio.play();
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
    fetchFirstBoard();
  };

  useEffect(() => {
    // const fetchFirstBoard = async () => {
    //   const board = await getInitialImages();
    //   console.log("board", board);
    //   const imgs = board;
    //   setImages(imgs);
    // };

    fetchFirstBoard();
  }, []);

  const refresh = (e: CustomEvent) => {
    // Implement the logic to refresh images here, for example:
    e.detail.complete();
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader>
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
                className="w-full text-xs text-justify bg-inherit"
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
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonTitle>Predictive Images</IonTitle>
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
          <FloatingWordsBtn inputRef={inputRef} />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ImagesScreen;
