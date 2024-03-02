import { useState } from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Home.css';
import ImageGallery from '../components/ImageGallery';
import { Image, getImages } from '../data/images';
import MainMenu from '../components/MainMenu';
const ImagesScreen: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);

  const fetchImages = async () => {
    const imgs = await getImages();
    setImages(imgs);
  }

  useIonViewWillEnter(() => {
    fetchImages();

  });

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
            <IonTitle>Welcome to Itty Bitty Boards</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonContent fullscreen>
            <ImageGallery images={images} />
          </IonContent>
        </IonContent>
      </IonPage>
    </>
  );
};

export default ImagesScreen;
