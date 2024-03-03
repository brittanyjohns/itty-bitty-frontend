import { useEffect, useRef, useState } from 'react';
import { getBoard, getRemainingImages } from '../data/boards';
import { Image } from '../data/images';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { Board } from '../types';
import { arrowBackCircleOutline } from 'ionicons/icons';

import { useParams } from 'react-router';
import './ViewBoard.css';
import ImageGallery from '../components/ImageGallery';
import FileUploadForm from '../components/FileUploadForm';
import SelectImageGallery from '../components/SelectImageGallery';
import React from 'react';

const ViewBoard: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<Board>();
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const modal = useRef<HTMLIonModalElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images


  const fetchBoard = async () => {
    const board = await getBoard(parseInt(params.id, 10));
    setBoard(board);
    const remainingImgs = await getRemainingImages(board.id, 1, '');
    console.log('fetch board remainingImgs', remainingImgs);
    setRemainingImages(remainingImgs);
  }

  const closeModal = () => {
    modal.current?.dismiss()
  }

  const onLoadMoreImages = async (page: number, query: string) => {
    console.log('Load More - view board page', page);
    console.log('Load More - view board query', query);
    console.log('Load More - view board board', board);

    if (!board) return;
    // if (!query) {
    //   query = ''
    // } 
    // if (!page) {
    //   page = 1
    // }



    const remainingImgs = await getRemainingImages(board.id, page, query);
    console.log('Load More - view board remainingImgs', remainingImgs);
    setRemainingImages(remainingImgs);
    return remainingImgs;
  }

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

          {board && remainingImages &&
            <SelectImageGallery images={remainingImages} boardId={board.id} getMoreImages={onLoadMoreImages} />}
        </IonContent>
      </IonModal>
    )
  });

  useIonViewWillEnter(() => {
    fetchBoard();
  });

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/boards">
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{board && board.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton id="open-modal" expand="block" onClick={() => setIsOpen(true)}>
              Add
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {modalForm()}

      {board &&
        <>
          <ImageGallery images={board.images} boardId={board.id} />
        </>
      }
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
