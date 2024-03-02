import { useEffect, useRef, useState } from 'react';
import { getBoard, getRemainingImages } from '../data/boards';
import { Image } from '../data/images';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { Board } from '../types';
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
  const [page, setPage] = useState(1);

  const fetchBoard = async () => {
    const board = await getBoard(parseInt(params.id, 10));
    setBoard(board);
    const remainingImgs = await getRemainingImages(board.id, { page: page, query: null })
    setRemainingImages(remainingImgs);
  }

  const closeModal = () => {
    modal.current?.dismiss()
  }

  const nextPage = () => {
    setPage(page + 1);
  }

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }


  const getMoreImages = async () => {
    if (!board) return;
    const remainingImgs = await getRemainingImages(board.id, { page: page, query: null })
    setRemainingImages(remainingImgs);
  }

  useEffect(() => {
    getMoreImages();

  }, [page]);

  const modalForm = (() => {
    return (
      <IonModal ref={modal} trigger="open-modal" isOpen={isOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => closeModal()}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Add an Image</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => previousPage()}>Prev</IonButton>
              <IonButton onClick={() => nextPage()}>Next</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

          <FileUploadForm board={board} onCloseModal={closeModal} />

          {board && remainingImages &&
            <SelectImageGallery images={remainingImages} boardId={board.id} page={page} />}
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
            <IonBackButton text="Back" defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>{board && board.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton id="open-modal" expand="block">
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
