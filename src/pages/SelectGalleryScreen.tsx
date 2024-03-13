import { useEffect, useRef, useState } from 'react';
import { addImageToBoard, getBoard, getRemainingImages } from '../data/boards';
import { Image } from '../data/images';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { Board } from '../data/boards';
import { add, arrowBackCircleOutline, playCircleOutline, trashBinOutline } from 'ionicons/icons';

import { useParams } from 'react-router';
import './ViewBoard.css';
import ImageGallery from '../components/ImageGallery';
import FileUploadForm from '../components/FileUploadForm';
import SelectImageGallery from '../components/SelectImageGallery';
import React from 'react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { set } from 'react-hook-form';

const SelectGalleryScreen: React.FC<any> = () => {
  const [board, setBoard] = useState<Board>();
  const [isOpen, setIsOpen] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showLoading, setShowLoading] = useState(false);

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
      if (image.id && board.id) {
        addImageToBoard(board.id, image.id);
        setIsOpen(true);
        setShowLoading(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  };

  const getMoreImages = async (page: number, query: string) => {
    if (!board || !board.id) {
      console.error('No board found');
      return;
    }
    const remainingImgs = await getRemainingImages(board.id, page, query);
    setRemainingImages(remainingImgs);
    return remainingImgs;
  }

  useEffect(() => {
    fetchBoard();
  } , []);

  return (
    <IonPage id="edit-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start" className='mr-4'>
            <IonButton routerLink={`/boards/${board?.id}`}>
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle className="text-sm">Add images to {board?.name} ({board?.images?.length})</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonLoading className='loading-icon' cssClass='loading-icon' isOpen={showLoading} message={'Adding the image to your board...'} />
      <FileUploadForm board={board} onCloseModal={closeModal} showLabel={true} />

      {board && remainingImages &&
        <SelectImageGallery images={remainingImages} boardId={board.id} onLoadMoreImages={getMoreImages} onImageClick={handleImageClick} />
      }
      {board && remainingImages && remainingImages.length === 0 &&
        <div className="text-center">
          <p>No images found</p>
        </div>
      }
      </IonContent>
    </IonPage>
  );
}

export default SelectGalleryScreen;
