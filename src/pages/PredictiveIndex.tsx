import { useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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
import { addCircleOutline } from "ionicons/icons";
import { getInitialImages } from "../data/boards";
import PredictiveImageGallery from "../components/PredictiveImageGallery";

const ImagesScreen: React.FC = () => {
  const [initialImages, setImages] = useState<PredictiveImage[]>([]);
  const history = useHistory();
  const [boardId, setBoardId] = useState("");

  const fetchFirstBoard = async () => {
    const imgs = await getInitialImages();
    setImages(imgs);
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
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent />
          </IonRefresher>
          <IonText>
            <h1>Predictive Images - BETA {initialImages.length}</h1>
          </IonText>
          <PredictiveImageGallery initialImages={initialImages} />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ImagesScreen;
