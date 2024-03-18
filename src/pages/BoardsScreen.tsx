import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import BoardList from '../components/BoardList';
import MainMenu, { hideMenu } from '../components/MainMenu';
import { useCurrentUser } from '../hooks/useCurrentUser';
import Tabs from '../components/Tabs';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getBoards } from '../data/boards';
import { addCircleOutline } from 'ionicons/icons';
const BoardsScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const history = useHistory();
  const [boards, setBoards] = useState([]);
  const [presetBoards, setPresetBoards] = useState([]);
  const [userBoards, setUserBoards] = useState([]);
  const [scenarioBoards, setScenarioBoards] = useState([]);
  const [segmentType, setSegmentType] = useState('user');

  const fetchBoards = async () => {
    const fetchedBoards = await getBoards();
    if (!fetchedBoards) {
      console.error('Error fetching boards');
      return;
    }
    setUserBoards(fetchedBoards['boards']);
    setScenarioBoards(fetchedBoards['scenarios']);
    setPresetBoards(fetchedBoards['predefined_boards']);
    console.log('Fetched boards', fetchedBoards);
    setBoards(fetchedBoards['boards']);
  }

  useEffect(() => {
    fetchBoards();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    setSegmentType(e.detail.value);
  }

  useIonViewWillEnter(() => {
    hideMenu();
  });

  useEffect(() => {
    if (segmentType === 'user') {
      setBoards(userBoards);
    }
    if (segmentType === 'preset') {
      setBoards(presetBoards);
    }
    if (segmentType === 'scenario') {
      setBoards(scenarioBoards);
    }
  } , [segmentType]);


  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Boards</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/boards/new" >
                <IonIcon icon={addCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
              <IonSegmentButton value="user">
                <IonLabel>My Boards</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="preset">
                <IonLabel>Presets</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="scenario">
                <IonLabel>Scenarios</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonItem>
            <BoardList boards={boards} />
          </IonItem>
        </IonContent>
        <Tabs />

      </IonPage>
    </>
  );
};

export default BoardsScreen;
