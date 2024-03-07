import { useRef, useState } from 'react';
import { addImageToBoard, getBoard, getRemainingImages } from '../data/boards';
import { Image } from '../data/images';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
  IonPage,
  IonTitle,
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

const ViewBoard: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<Board>();
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const modal = useRef<HTMLIonModalElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images
  const inputRef = useRef<HTMLIonInputElement>(null);
    const [showIcon, setShowIcon] = useState(false);

  const fetchBoard = async () => {
    const board = await getBoard(params.id);
    setBoard(board);
    const remainingImgs = await getRemainingImages(board.id, 1, '');
    console.log('fetch board remainingImgs', remainingImgs);
    setRemainingImages(remainingImgs);
  }

  const closeModal = () => {
    modal.current?.dismiss()
  }

  const handleImageClick = (image: Image) => {
    console.log('Image clicked: ', image.id);
    console.log('Image clicked: ', image.label);
    console.log('Board clicked: ', board?.id);
    // alert('Image clicked: ' + image.id);
    if (!board) return;
    addImageToBoard(board?.id, image.id);
    closeModal();
  };

  const getMoreImages = async (page: number, query: string) => {
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
        <IonContent id="board-modal">

          <FileUploadForm board={board} onCloseModal={closeModal} />
          <div className="text-center p-2 border">
            <p>OR</p>
          {board && remainingImages &&
            <SelectImageGallery images={remainingImages} boardId={board.id} onLoadMoreImages={getMoreImages} onImageClick={handleImageClick} /> 
          }
          </div>
        </IonContent>
      </IonModal>
    )
  });

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
    fetchBoard();
  });

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start" className='mr-4'>
            <IonButton routerLink="/boards">
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonItem slot='start' className='w-full'>
                <IonInput placeholder={board?.name} ref={inputRef} readonly={true} className='w-3/4'>
                </IonInput>
                <div className="flex justify-around">
                    {showIcon &&
                        <IonButton className="tiny" size="small" onClick={() => speak(inputRef.current?.value as string)}><IonIcon slot="icon-only" className="tiny"
                            icon={playCircleOutline} onClick={() => speak(inputRef.current?.value as string)}></IonIcon> </IonButton>
                    }
                    {showIcon &&
                        <IonButton size="small" onClick={() => clearInput()}><IonIcon slot="icon-only" icon={trashBinOutline} onClick={() => clearInput()}></IonIcon></IonButton>

                    }
                </div>
            </IonItem>
            <IonButtons slot="start" className='mr-4'>
            <IonButton routerLink={`/boards/${board?.id}/edit`} >
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {modalForm()}
      <IonContent fullscreen scrollY={false}>
      {board &&
        <ImageGallery images={board.images} boardId={board.id} setShowIcon={setShowIcon} inputRef={inputRef} />
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
      </IonContent>
    </IonPage>
  );
}

export default ViewBoard;
