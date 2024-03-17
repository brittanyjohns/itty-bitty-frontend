import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import MainMenu from '../components/MainMenu';
import Tabs from '../components/Tabs';
import { useCurrentUser } from '../hooks/useCurrentUser';
const SettingsPage: React.FC = () => {
  const { currentUser } = useCurrentUser();

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
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonContent fullscreen className='ion-padding'>
            <IonList>
              <IonItem>
                <IonText> Name: {currentUser && currentUser.name}</IonText>
              </IonItem>
              <IonItem>
                <IonText> Email: {currentUser && currentUser.email}</IonText>
              </IonItem>
              <IonItem>
                <IonText> Role: {currentUser && currentUser.role}</IonText>
              </IonItem>
              <IonItem>
                <IonText> Tokens: {currentUser && currentUser.tokens}</IonText>
              </IonItem>
              <IonItem>
                <IonText> Created At: {currentUser && currentUser.created_at}</IonText>
              </IonItem>
              <IonItem>
                <IonText> Updated At: {currentUser && currentUser.updated_at}</IonText>
              </IonItem>
            </IonList>
          </IonContent>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default SettingsPage;
