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
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { PredictiveImage, getPredictiveImages } from "../data/images";

import MainMenu from "../components/MainMenu";
import PredictiveImageGallery from "../components/PredictiveImageGallery";
import { useHistory, useParams } from "react-router";
import Tabs from "../components/Tabs";
import { addCircleOutline } from "ionicons/icons";
import { getInitialImages } from "../data/boards";
import { set } from "react-hook-form";
import GalleryComponent from "../components/PredictiveImageGallery";

const PredictiveImagesScreen: React.FC = () => {
  const [images, setImages] = useState<PredictiveImage[]>([]);
  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useEffect(() => {
    const fetchFirstBoard = async () => {
      const board = await getInitialImages();
      if (board.id) {
        const imgs = await getPredictiveImages(board.id);
        setImages(imgs);
      }
    };
    fetchFirstBoard();
  }, []);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonText>
            <h1>Image Gallery</h1>
          </IonText>
          {<PredictiveImageGallery initialImages={images} />}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default PredictiveImagesScreen;
