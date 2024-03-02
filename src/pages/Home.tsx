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
import { BASE_URL, isUserSignedIn } from '../data/users';
import SignUpScreen from './SignUpScreen';
import MainMenu from '../components/MainMenu';
const Home: React.FC = () => {

  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);

  useIonViewWillEnter(() => {
    hideMenu();
    const links = getMenu();
    setMenuLinks(links);

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
            <h1>Itty Bitty Boards</h1>
            {isUserSignedIn() ? <BoardList /> : <SignUpScreen />}
          </IonContent>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
