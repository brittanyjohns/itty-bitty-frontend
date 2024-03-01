import { useEffect, useState } from 'react';
import { MenuLink, getMenu } from '../data/menu';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Home.css';
import Grid from '../components/Grid';
import ImageGallery from '../components/ImageGallery';
import BoardList from '../components/BoardList';
import CreateButton from '../components/CreateButton';
import Menu from '../components/Menu';
import MenuListItem from '../components/MenuListItem';
import { BASE_URL } from '../data/users';
import SignUpScreen from './SignUpScreen';
import { Image, getImages } from '../data/images';
const ImagesScreen: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);

    const fetchImages = async () => {
        const imgs = await getImages();
        setImages(imgs);
    }

  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);

  useIonViewWillEnter(() => {
    hideMenu();
    const links = getMenu();
    setMenuLinks(links);
    fetchImages(); 

  });

  const refresh =  (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const hideMenu = () => {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.close();
    }
  }


  return (
    <>
      <IonMenu contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            {menuLinks.map(m => (
              <MenuListItem key={m.id} menuLink={m} />
            ))}
          </IonList>
        </IonContent>
      </IonMenu>
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
