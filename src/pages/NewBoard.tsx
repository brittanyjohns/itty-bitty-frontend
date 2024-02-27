import { useEffect, useRef, useState } from 'react';
import { Board, createBoard, getBoard } from '../data/boards';
import { Image } from '../data/images';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
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
import './NewBoard.css';
import ImageGallery from '../components/ImageGallery';
import ReorderList from '../components/ReorderList';

const NewBoard: React.FC = (props: any) => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  useForm({
    defaultValues: {
      firstName: '',
      lastName: ''
    }
  })
  const hideMenu = () => {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.close();
    }
  }

  useIonViewWillEnter(() => {
    console.log('NewBoard useIonViewWillEnter');
    hideMenu();
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('handleSubmit');

    createBoard(board);
  }

  // useEffect(() => {
  //   fetchBoard();

  // }, []);

  return (
    <IonPage id="new-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" defaultHref="/home"></IonBackButton>
            <IonTitle>New Board</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
          <>
          <form className="ion-padding" onSubmit={handleSubmit}>
            <IonItem>
              <IonInput label="Name" placeholder="Enter new board name"></IonInput>
            </IonItem>
            <IonButton className="ion-margin-top" type="submit" expand="block">
              Create
            </IonButton>
          </form>
          </>
      </IonContent>
    </IonPage>
  );
}

export default NewBoard;