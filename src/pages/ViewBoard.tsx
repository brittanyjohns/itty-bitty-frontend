import { useEffect, useState } from 'react';
import { Board, getBoard } from '../data/boards';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import { useParams } from 'react-router';
import './ViewBoard.css';
import ImageGallery from '../components/ImageGallery';

const ViewBoard: React.FC = (props: any) => {
  const [board, setBoard] = useState<Board>();
  const [images, setImages] = useState<any[]>(props.images || []);
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
    // fetchBoard();
  });
  
  useEffect(() => {
    fetchBoard();
    console.log('ViewBoard useEffect');
    setImages(board?.images || []);
    console.log('board', board);
    console.log('board.images', board?.images);
    // fetchBoard();
  } , []);

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Inbox" defaultHref="/home"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {board ? (
          <>
            <IonItem>
              <IonIcon aria-hidden="true" icon={personCircle} color="primary"></IonIcon>
              <IonLabel className="ion-text-wrap">
                <h2>
                  {board.name}
                  <span className="date">
                    <IonNote>{board.id}</IonNote>
                  </span>
                </h2>
                <h3>
                  To: <IonNote>Me</IonNote>
                </h3>
              </IonLabel>
            </IonItem>

            <div className="ion-padding">
              <h1>{board.name}</h1>
              <ImageGallery images={images} />
            </div>
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

