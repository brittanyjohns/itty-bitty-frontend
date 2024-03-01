import { useEffect, useRef, useState } from 'react';
import { getBoard } from '../data/boards';
import { Image } from '../data/images';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonModal,
  useIonViewWillEnter,
} from '@ionic/react';
import { Board } from '../types';
import { personCircle } from 'ionicons/icons';
import { useParams } from 'react-router';
import './ViewBoard.css';
import ImageGallery from '../components/ImageGallery';
import ReorderList from '../components/ReorderList';
import WordListForm from '../components/WordListForm';
import FileUploadForm from '../components/FileUploadForm';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';

const ViewBoard: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<Board>();
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const fetchBoard = async () => {
    console.log('ViewBoard fetchBoard');
    const board = await getBoard(parseInt(params.id, 10));
    console.log('board', board);
    console.log('board.images', board.images);
    setBoard(board);
  }

  const closeModal = () => {
    modal.current?.dismiss()
  }

  useEffect(() => {
    console.log('ViewBoard useEffect');
    console.log('isOpen', isOpen);
  } , [isOpen]);

  const modalForm = (() => {
    return (
      <IonModal ref={modal} trigger="open-modal" isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => closeModal()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Add an Image</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <FileUploadForm board={board} onCloseModal={closeModal} />
      </IonContent>
    </IonModal>
    )
  } );

  useIonViewWillEnter(() => {
    console.log('ViewBoard useIonViewWillEnter');
    fetchBoard();
  });

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" defaultHref="/home"></IonBackButton>
            <IonTitle>{board && board.name} {board && board.images.length}</IonTitle>
          </IonButtons>
          <IonButtons slot="end">
          <IonButton id="open-modal" expand="block">
            Open
          </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {modalForm()}

{board && 
            <ImageGallery images={board.images} />}
      {board ? (
        <>
          {board.images && board.images.length < 1 &&
            <div className="text-center">
              <p>No images found</p>
            </div>
          }
        </>
      ) : (
        <div>Board not found</div>
      )}
    </IonPage>
  );
}

export default ViewBoard;
