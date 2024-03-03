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
import './Dashboard.css';
import BoardList from '../components/BoardList';
import MainMenu from '../components/MainMenu';
import { useEffect, useState } from 'react';
import { User, getCurrentUser } from '../data/users';
import { useCurrentUser } from '../hooks/useCurrentUser';
const BoardsScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();

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
            {currentUser && <h2>Welcome {currentUser.email}</h2>}
            <BoardList />
          </IonContent>
        </IonContent>
      </IonPage>
    </>
  );
};

export default BoardsScreen;
