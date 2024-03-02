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
import './Home.css';
import BoardList from '../components/BoardList';
import { getCurrentUser, isUserSignedIn } from '../data/users';
import SignInScreen from './SignUpScreen';
import MainMenu from '../components/MainMenu';
import SignUpScreen from './SignUpScreen';
import { get } from 'react-hook-form';
import { useEffect, useState } from 'react';
const Home: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useIonViewWillEnter(() => {
    fetchCurrentUser().then((user) => {
      setCurrentUser(user);
    } );
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  
  const fetchCurrentUser = async () => {
    if (isUserSignedIn()) {
      const userFromServer = await getCurrentUser();
      console.log('userFromServer', userFromServer);
      setCurrentUser(userFromServer);
      return userFromServer;
    }

  }

  useEffect(() => {
    fetchCurrentUser().then((user) => {
      setCurrentUser(user);
    } );
  } , []);

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
            <h1>Itty Bitty Boards{currentUser && currentUser.email}</h1>
            <BoardList />
          </IonContent>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
