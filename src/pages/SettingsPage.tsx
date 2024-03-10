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
import MainMenu from '../components/MainMenu';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../data/users';
import Tabs from '../components/Tabs';
const SettingsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);

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
          </IonContent>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default SettingsPage;
