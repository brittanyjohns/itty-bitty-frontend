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

  const onLoadMoreImages = async (page: number, query: string) => {
    console.log('Load More - view board page', page);
    console.log('Load More - view board query', query);

    // if (!query) {
    //   query = ''
    // } 
    // if (!page) {
    //   page = 1
    // }



    const remainingImgs = await getMoreImages(page, query);
    console.log('Load More - view board remainingImgs', remainingImgs);
    setRemainingImages(remainingImgs);
    return remainingImgs;
  }


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
          <SelectImageGallery images={images} getMoreImages={onLoadMoreImages} />
          </IonContent>
        </IonContent>
      </IonPage>
    </>
  );
};

export default ImagesScreen;
