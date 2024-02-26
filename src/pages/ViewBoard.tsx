import { useEffect, useRef, useState } from 'react';
import { Board, getBoard } from '../data/boards';
import { Image } from '../data/images';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import { useParams } from 'react-router';
import './ViewBoard.css';
import ImageGallery from '../components/ImageGallery';
import ReorderList from '../components/ReorderList';

const ViewBoard: React.FC = (props: any) => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();

  const fetchBoard = async () => {
    console.log('ViewBoard fetchBoard');
    const board = await getBoard(parseInt(params.id, 10));
    console.log('board', board);
    console.log('board.images', board.images);
    setBoard(board);
  }

  useIonViewWillEnter(() => {
    console.log('ViewBoard useIonViewWillEnter');
    fetchBoard();
  });

  // useEffect(() => {
  //   fetchBoard();

  // }, []);

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" defaultHref="/home"></IonBackButton>
            <IonTitle>{board && board.name}</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
        {board ? (
          <>
            <ImageGallery images={board.images} />
            {/* <ReorderList /> */}
          </>
        ) : (
          <div>Board not found</div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewBoard;
function ionRouteDidChange(arg0: () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}

