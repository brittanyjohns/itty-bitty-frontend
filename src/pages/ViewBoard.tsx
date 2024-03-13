import { useEffect, useRef, useState } from 'react';
import { Board, addImageToBoard, getBoard, getRemainingImages } from '../data/boards';
import { Image } from '../data/images';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLoading,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';

import { add, addCircleOutline, arrowBackCircleOutline, playCircleOutline, trashBinOutline } from 'ionicons/icons';

import { useParams } from 'react-router';
import './ViewBoard.css';
import ImageGallery from '../components/ImageGallery';
import React from 'react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

const ViewBoard: React.FC<any> = ({ boardId }) => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const fetchBoard = async () => {
    const board = await getBoard(params.id);
    if (!board) {
      console.error('Error fetching board');
      return;
    } else {
      console.log('board', board);
    }
    setBoard(board);
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
    console.log('useIonViewWillEnter');
    console.log('board', board)
  });
  // useEffect(() => {
  //   fetchBoard();
  // } , []);

  useEffect(() => {
    fetchBoard();
    console.log('useEffect - fetchBoard', board);

    // if (showLoading) {
    //   setTimeout(() => {
    //     if (board?.images && board.images.length > 0) {
    //       setShowLoading(false);
    //     } else {
    //       if (board?.parent_type === 'Menu') {
    //         setShowLoading(false);
    //       } else {
    //         setShowLoading(true);
    //         fetchBoard();
    //         console.log('fetching board', board);
    //       }
    //       // setShowLoading(true);


    //       // window.location.reload();
    //     }
    //   }, 1000);
    // }
  }
    , []);

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/boards">
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonItem slot='start' className='w-full'>
            <IonInput placeholder={board?.name} ref={inputRef} readonly={true} className='w-full text-xs text-justify'>
            </IonInput>
          </IonItem>
          <IonButtons slot="start">
            {showIcon &&
              <IonButton size="small" onClick={() => speak(inputRef.current?.value as string)}>
                <IonIcon slot="icon-only" className="tiny" icon={playCircleOutline} onClick={() => speak(inputRef.current?.value as string)}></IonIcon>
              </IonButton>
            }
          </IonButtons>
          <IonButtons slot="end">
            {showIcon &&
              <IonButton size="small" onClick={() => clearInput()}>
                <IonIcon slot="icon-only" className="tiny" icon={trashBinOutline} onClick={() => clearInput()}></IonIcon>
              </IonButton>
            }
              {!showIcon && <IonButton routerLink={`/boards/${params.id}/gallery`}>
                <IonIcon icon={addCircleOutline} />
              </IonButton>}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <IonLoading message="Please wait while we create your board..." isOpen={showLoading} />

        {board && board.images &&
          <ImageGallery images={board.images} board={board} setShowIcon={setShowIcon} inputRef={inputRef} />
        }
        {board ? (
          <div className="">
            {board.images && board.images.length < 1 &&
              <div className="text-center">
                <p>No images found</p>
              </div>
            }
          </div>
        ) : (
          <div>Board not found</div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewBoard;
