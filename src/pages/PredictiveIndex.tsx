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
import SelectImageGallery from "../components/SelectImageGallery";
import { useHistory } from "react-router";
import Tabs from "../components/Tabs";
import { addCircleOutline } from "ionicons/icons";
import { getInitialImages } from "../data/boards";
import PredictiveImageGallery from "../components/PredictiveImageGallery";

const ImagesScreen: React.FC = () => {
  const [images, setImages] = useState<PredictiveImage[]>([]);
  const history = useHistory();
  const [boardId, setBoardId] = useState("");
  const fetchFirstBoard = async () => {
    let imgs: PredictiveImage[] = [];
    const board = await getInitialImages();
    setBoardId(board.id);
    console.log("setBoardId", board.id); // 'setBoardId', '1
    if (board.id) {
      imgs = await getPredictiveImages(board.id);

      console.log("ImagesScreen - result", imgs);
      setImages(imgs);
    } else {
      console.log("board.id not found");
    }
    return imgs;
  };

  useEffect(() => {
    async function fetchImages() {
      const imgs = await fetchFirstBoard();
      console.log("ImagesScreen - imgs", imgs);
      setImages(imgs);
    }
    fetchImages();
  }, []);

  const handleImageClick = (image: PredictiveImage) => {
    console.log("PredictiveImage Clicked", image);
    // history.push(`/images/${image.id}`);
  };

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
            <IonTitle>Image Gallery</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/images/add">
                <IonIcon icon={addCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar></IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonText>
            <h1>Image Gallery {images.length}</h1>
          </IonText>
          {<PredictiveImageGallery initialImages={images} />}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ImagesScreen;
