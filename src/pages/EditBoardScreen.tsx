import { useEffect, useRef, useState } from 'react';
import { addImageToBoard, getBoard, getRemainingImages } from '../data/boards';
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
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { Board } from '../types';
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
  const [board, setBoard] = useState<Board>();
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

  const handleImageClick = (image: Image) => {
    if (!board) {
      console.error('No board found');
      fetchBoard();
    } else {
      addImageToBoard(board?.id, image.id);
      setIsOpen(true);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000);
    }
  };

  const getMoreImages = async (page: number, query: string) => {
    if (!board) return;

    const remainingImgs = await getRemainingImages(board.id, page, query);
    setRemainingImages(remainingImgs);
    return remainingImgs;
  }

  const speak = async (text: string) => {
    await TextToSpeech.speak({
      text: text,
      lang: 'en-US',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient',
    });
  };

  const goToGallery = () => {
    if (!board) {
      console.error('No board found');
      return;
    }
    history.push(`/boards/${board?.id}/gallery`);
  }


  useEffect(() => {
    fetchBoard();
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
        <IonCard className='p-4'>
          <FileUploadForm board={board} onCloseModal={closeModal} />
        </IonCard>
        <IonButton onClick={goToGallery} expand="block" fill="outline" color="primary" className="mt-4 w-5/6 mx-auto">
          View Gallery
        </IonButton>
      </IonContent>

    </IonPage>
  );
}

export default EditBoardScreen;
