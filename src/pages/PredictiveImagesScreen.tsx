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
import { getFirstPredictiveBoard } from "../data/boards";
import { set } from "react-hook-form";

const PredictiveImagesScreen: React.FC = () => {
  const [images, setImages] = useState<PredictiveImage[]>([]);
  const history = useHistory();
  const [boardId, setBoardId] = useState("");
  const params = useParams<{ id: string }>();

  // const fetchFirstBoard = async () => {
  //   const board = await getFirstPredictiveBoard();
  //   setBoardId(board.id);
  //   const imgs = await getPredictiveImages(board.id);
  //   setImages(imgs);
  // };

  // useEffect(() => {
  //   console.log("PredictiveImagesScreen - useEffect -params", params);
  //   fetchFirstBoard();
  // }, []);

  useEffect(() => {
    console.log("PredictiveImagesScreen - params", params);
    async function fetchImages() {
      const imgs = await getPredictiveImages(params.id);
      console.log("PredictiveImagesScreen - imgs", imgs);
      setImages(imgs);
    }
    fetchImages();
  }, []);

  const handleGetMoreImages = async (
    boardId: string
  ): Promise<PredictiveImage[]> => {
    const predictiveImages = await getPredictiveImages(boardId);
    console.log("Load More -  predictiveImages", predictiveImages);
    setImages(predictiveImages);
    return predictiveImages;
  };

  const handleImageClick = (image: PredictiveImage) => {
    console.log("Image Clicked - fetchMoreImages", image);
    setBoardId(image.next_board_id);
    async function fetchMoreImages() {
      let imgs = await handleGetMoreImages(image.next_board_id);
      //  Shuffle the images
      // imgs = imgs.sort(() => Math.random() - 0.5);
      setImages(imgs);
    }
    fetchMoreImages();
  };

  useEffect(() => {
    console.log("LOAD PredictiveImagesScreen - images", images);
  }, []);

  useEffect(() => {
    console.log("PredictiveImagesScreen - boardId", boardId);
  }, [boardId]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

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
          {
            <PredictiveImageGallery
              predictiveImages={images}
              boardId={boardId}
              onImageClick={handleImageClick}
            />
          }
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default PredictiveImagesScreen;
