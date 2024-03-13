import {
  IonButtons,
  IonContent,
  IonHeader,
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
import { set } from 'react-hook-form';
const BoardsScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const history = useHistory();
  const [boards, setBoards] = useState([]);
  const [presetBoards, setPresetBoards] = useState([]);
  const [segmentType, setSegmentType] = useState('user');

  const fetchBoards = async () => {
    const fetchedBoards = await getBoards();
    if (!fetchedBoards) {
      console.error('Error fetching boards');
      return;
    }
    setBoards(fetchedBoards['boards']);
    setPresetBoards(fetchedBoards['predefined_boards']);
  }

  useEffect(() => {
    fetchBoards();
  }, [segmentType]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    setSegmentType(e.detail.value);
    console.log('Segment selected', e.detail.value);
    const type = e.detail.value;
    // if (type === 'user') {
    //   console.log('Setting boards to user boards');
    //   setBoards(boards);
    // }
    // if (type === 'preset') {
      
    //   setBoards(presetBoards);
    // }

  }

  useIonViewWillEnter(() => {
    hideMenu();
  });


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
          </IonToolbar>
          <IonToolbar>
            <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
              <IonSegmentButton value="user">
                <IonLabel>My Boards</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="preset">
                <IonLabel>Preset Boards</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonItem>
            <BoardList boards={segmentType === 'user' ? boards : presetBoards} />
          </IonItem>
        </IonContent>
        <Tabs />

      </IonPage>
    </>
  );
};

export default BoardsScreen;
