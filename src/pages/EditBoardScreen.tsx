import { useEffect, useRef, useState } from 'react';
import { addImageToBoard, getBoard, getRemainingImages, updateBoard } from '../data/boards';
import { Image } from '../data/images';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { Board } from '../data/boards';
import { add, arrowBackCircleOutline, playCircleOutline, trashBinOutline } from 'ionicons/icons';

import { useHistory, useParams } from 'react-router';
import './ViewBoard.css';
import ImageGallery from '../components/ImageGallery';
import FileUploadForm from '../components/FileUploadForm';
import SelectImageGallery from '../components/SelectImageGallery';
import React from 'react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { set } from 'react-hook-form';

const EditBoardScreen: React.FC<any> = () => {
  const [board, setBoard] = useState<Board>({ id: '', name: '', number_of_columns: 0, images: [] });
  const [isOpen, setIsOpen] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const history = useHistory();

  const fetchBoard = async () => {
    const boardId = window.location.pathname.split('/')[2];
    const board = await getBoard(boardId);
    setBoard(board);
    const remainingImgs = await getRemainingImages(board.id, 1, '');
    console.log('fetch board remainingImgs', remainingImgs);
    setRemainingImages(remainingImgs);
  }

  const closeModal = () => {
    modal.current?.dismiss()
  }


  const handleGridChange = async (event: CustomEvent) => {
    if (!board || !board.id) {
      console.error('No board found');
      return;
    }
    const gridSize = event.detail.value;
    const updatedBoard = { ...board, number_of_columns: gridSize };
    setBoard({ ...updatedBoard, number_of_columns: parseInt(updatedBoard.number_of_columns) });

  }

  const handleSubmit = async () => {
    if (!board) {
      console.error('No board found');
      return;
    }
    const updatedBoard = await updateBoard(board);
    setBoard(updatedBoard);
  }

  const handleReset = () => {
    if (!board) {
      console.error('No board found');
      return;
    }
    const updatedBoard = { ...board, number_of_columns: 0 };
    setBoard(updatedBoard);
  }

  const goToGallery = () => {
    if (!board) {
      console.error('No board found');
      return;
    }
    history.push(`/boards/${board?.id}/gallery`);
  }

  const gridSizeOptions = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];


  useEffect(() => {
    fetchBoard();
    console.log('fetchBoard', board);

  }, []);

  return (
    <IonPage id="edit-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start" className='mr-4'>
            <IonButton routerLink={`/boards/${board?.id}`}>
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonItem slot='start' className='w-full'>
            <IonTitle>{board?.name}</IonTitle>

          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent id="board-modal">
      <IonButton onClick={goToGallery} expand="block" fill="outline" color="primary" className="mt-4 w-5/6 mx-auto">
          View Gallery
        </IonButton>
        <IonCard className='p-4'>
          <IonText className='text-2xl text-center'>Upload an image</IonText>
          <FileUploadForm board={board} onCloseModal={closeModal} />
        </IonCard>
        <IonCard className='p-4'>
          <IonText className='text-2xl text-center'>Grid size Override</IonText>
          <IonItem>
            <IonItem>
                <IonSelect placeholder="Select # of columns" name="number_of_columns" onIonChange={handleGridChange} value={board?.number_of_columns}>
                    {gridSizeOptions.map((size) => (
                        <IonSelectOption key={size} value={size}>
                            {size}
                        </IonSelectOption>
                    ))} 
                </IonSelect>
            </IonItem>
            <IonButtons>
            <IonButton onClick={() => {
              handleSubmit();
            } } expand="block" fill="outline" color="primary" className="mt-4 w-5/6 mx-auto">
              Save
            </IonButton>
            <IonButton onClick={() => {handleReset}  } expand="block" fill="outline" color="danger" className="mt-4 w-5/6 mx-auto">  Reset </IonButton>
            </IonButtons>
          </IonItem>
        </IonCard>
      </IonContent>

    </IonPage>
  );
}

export default EditBoardScreen;
