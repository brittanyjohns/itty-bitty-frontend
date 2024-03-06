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
import ImageGallery from '../components/ImageGallery';
import { Image, getImages, getMoreImages } from '../data/images';
import MainMenu from '../components/MainMenu';
import SelectImageGallery from '../components/SelectImageGallery';
import { addImageToBoard } from '../data/boards';

const ImagesScreen: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images


  const fetchImages = async () => {
    const imgs = await getImages();
    setImages(imgs);
  }

  useIonViewWillEnter(() => {
    fetchImages();

  });

  const handleGetMoreImages = async (page: number, query: string): Promise<Image[]> => {
    const additionalImages = await getMoreImages(page, query);
    console.log('Load More -  additionalImages', additionalImages);
    setImages(additionalImages);
    return additionalImages;
  }

  const handleImageClick = (image: Image) => {
    alert('Image clicked: ' + image.id);
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
            <IonTitle>Welcome to Itty Bitty Boards</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <SelectImageGallery images={images} onLoadMoreImages={handleGetMoreImages} onImageClick={handleImageClick} />
        </IonContent>
      </IonPage>
    </>
  );
};

export default ImagesScreen;
