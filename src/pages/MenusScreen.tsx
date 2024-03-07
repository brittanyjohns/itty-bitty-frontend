import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import MenuList from '../components/MenuList';
import MainMenu, { hideMenu } from '../components/MainMenu';
import { useCurrentUser } from '../hooks/useCurrentUser';
const MenusScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useIonViewWillEnter(() => {
    hideMenu();
  } );


  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Welcome to Itty Bitty Menus</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonItem>
          {currentUser && <h2>Welcome {currentUser.email}</h2>}
          </IonItem>
            <IonItem>
              <MenuList />
            </IonItem>
        </IonContent>
      </IonPage>
    </>
  );
};

export default MenusScreen;
