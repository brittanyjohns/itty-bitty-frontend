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
import './Dashboard.css';
import BoardList from '../components/BoardList';
import MainMenu from '../components/MainMenu';
const Dashboard: React.FC = () => {

  useIonViewWillEnter(() => {
    hideMenu();
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
            <BoardList />
          </IonContent>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Dashboard;
