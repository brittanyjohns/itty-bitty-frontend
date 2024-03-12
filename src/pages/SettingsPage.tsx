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
} from '@ionic/react';
import BoardList from '../components/BoardList';
import { Image, getImages } from '../data/images';
import MainMenu from '../components/MainMenu';
import { useEffect, useRef, useState } from 'react';
import { getCurrentUser } from '../data/users';
import Tabs from '../components/Tabs';
import BaseImageGallery from '../components/BaseImageGallery';
import { useHistory } from 'react-router';
const SettingsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showIcon, setShowIcon] = useState(false);
  const inputRef = useRef<HTMLIonInputElement>(null);

  const [images, setImages] = useState<Image[]>([]);
  const history = useHistory();

  const fetchImages = async () => {
    const imgs = await getImages();
    setImages(imgs);
  }

  useEffect(() => {
    fetchImages();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useEffect(() => {
    getCurrentUser().then((user) => {
      console.log('user from useEffect', user);
      setCurrentUser(user);
    }
    );
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
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonContent fullscreen>
            <IonTitle>Settings</IonTitle>
            {currentUser && currentUser.email}
            <BaseImageGallery images={images} setShowIcon={setShowIcon} inputRef={inputRef} />
          </IonContent>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default SettingsPage;
