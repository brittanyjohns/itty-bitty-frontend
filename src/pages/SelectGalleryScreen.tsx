import { useEffect, useRef, useState } from 'react';
import { addImageToBoard, getBoard, getRemainingImages } from '../data/boards';
import { Image } from '../data/images';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
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

const SelectGalleryScreen: React.FC<any> = () => {
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
    console.log('handleImageClick', image);
    console.log('board', board);
    if (!board) {
      console.error('No board found');
      fetchBoard();
    } else {
      addImageToBoard(board?.id, image.id);
      setIsOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
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

  useEffect(() => {
    fetchBoard();
  } , []);

  return (
    <IonPage id="edit-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start" className='mr-4'>
            <IonButton routerLink={`/boards/${board?.id}/edit`}>
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Add images to {board?.name} ({board?.images.length})</IonTitle>
        </IonToolbar>
      </IonHeader>
      {board && remainingImages &&
        <SelectImageGallery images={remainingImages} boardId={board.id} onLoadMoreImages={getMoreImages} onImageClick={handleImageClick} />
      }
      {board && remainingImages && remainingImages.length === 0 &&
        <div className="text-center">
          <p>No images found</p>
        </div>
      }
    </IonPage>
  );
}

export default SelectGalleryScreen;
