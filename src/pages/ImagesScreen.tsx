import { useEffect, useState } from 'react';
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
import { Image, getImages, getMoreImages } from '../data/images';
import MainMenu from '../components/MainMenu';
import SelectImageGallery from '../components/SelectImageGallery';
import { useHistory } from 'react-router';
import Tabs from '../components/Tabs';

const ImagesScreen: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const history = useHistory();

  const fetchImages = async () => {
    const imgs = await getImages();
    setImages(imgs);
  }

  useEffect(() => {
    fetchImages();
  }, []);
  
  const handleGetMoreImages = async (page: number, query: string): Promise<Image[]> => {
    const additionalImages = await getMoreImages(page, query);
    console.log('Load More -  additionalImages', additionalImages);
    setImages(additionalImages);
    return additionalImages;
  }

  const handleImageClick = (image: Image) => {
    history.push(`/images/${image.id}`);
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
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          {<SelectImageGallery images={images} onLoadMoreImages={handleGetMoreImages} onImageClick={handleImageClick} />}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ImagesScreen;
