import { useEffect, useRef, useState } from 'react';
import { addImageToBoard, getBoard, getRemainingImages } from '../data/boards';
import { Image } from '../data/images';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
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

import { useParams } from 'react-router';
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

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setShowIcon(false);
  }

  useIonViewWillEnter(() => {
    // fetchBoard();
  });

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
        <IonAccordionGroup>
          <IonAccordion value="first">
            <IonItem slot="header" color="light">
              <IonLabel className='ml-2'>Upload a Image</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <FileUploadForm board={board} onCloseModal={closeModal} />
            </div>
          </IonAccordion>
          <IonAccordion value="second">
            <IonItem slot="header" color="light">
              <IonLabel  className='ml-2'>Generate with AI</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Second Content
            </div>
          </IonAccordion>
          <IonAccordion value="third">
            <IonItem slot="header" color="light">
              <IonLabel className='ml-2'>Image Gallery</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              {board && remainingImages &&
                <SelectImageGallery images={remainingImages} boardId={board.id} onLoadMoreImages={getMoreImages} onImageClick={handleImageClick} />
              }
              {board && remainingImages && remainingImages.length === 0 &&
                <div className="text-center">
                  <p>No images found</p>
                </div>
              }
            </div>
            <IonToast
              isOpen={isOpen}
              message="Image added to board!"
              onDidDismiss={() => setIsOpen(false)}
              duration={3000}
            ></IonToast>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
}

export default EditBoardScreen;
