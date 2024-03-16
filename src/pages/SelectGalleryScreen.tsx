import React, { useState, useEffect, useRef } from 'react';
import { IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSegment, IonSegmentButton, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { arrowBackCircleOutline, toggle } from 'ionicons/icons';
import { getBoard, addImageToBoard, Board } from '../data/boards'; // Adjust imports based on actual functions
import { markAsCurrent } from '../data/docs'; // Adjust imports based on actual functions
import BoardDropdown from '../components/BoardDropdown';
import FileUploadForm from '../components/FileUploadForm';
import { set } from 'react-hook-form';
import { generateImage } from '../data/images';
import { Image } from '../data/images';
const SelectGalleryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null)
  const boardGrid = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState('gallery');
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const boardGridWrapper = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<Image|null>({ id: '', src: '', label: '', image_prompt: '' });
  const history = useHistory();

  const fetchBoard = async () => {
    const img = await getBoard(id); // Ensure getBoard is typed to return a Promise<Board>
    console.log('img', img);
    setBoard(img);
    return img;
  };

  useEffect(() => {
    async function getData() {
      const boardToSet = await fetchBoard();
      setBoard(boardToSet);
      toggleForms(segmentType);
    }
    getData();
  }, [image]);

  const toggleForms = (segmentType: string) => {
    if (segmentType === 'generate') {
      uploadForm.current?.classList.add('hidden');
      generateForm.current?.classList.remove('hidden');
      boardGridWrapper.current?.classList.add('hidden');
    }
    if (segmentType === 'upload') {
      uploadForm.current?.classList.remove('hidden');
      generateForm.current?.classList.add('hidden');
      boardGridWrapper.current?.classList.add('hidden');
    }
    if (segmentType === 'gallery') {
      uploadForm.current?.classList.add('hidden');
      generateForm.current?.classList.add('hidden');
      boardGridWrapper.current?.classList.remove('hidden');
    }
  }

  const handleDocClick = async (e: React.MouseEvent<HTMLIonImgElement>) => {
    const target = e.target as HTMLImageElement;
    history.push(`/images/${target.id}`);
  };

  const handleGenerate = async () => {
    console.log('Generate Image', image);
    if (!image) return;
    const formData = new FormData();
    formData.append('id', image.id);
    formData.append('image_prompt', image.image_prompt ?? '');
    setShowLoading(true);
    const updatedImage = await generateImage(formData); // Ensure generateImage returns a Promise<Image>
    if (!board?.id) {
      console.error('Board ID is missing');
      return;
    }
    const updatedBoard = await addImageToBoard(board.id, updatedImage.id); // Ensure addImageToBoard returns a Promise<Board>
    console.log('Updated Board', updatedBoard);
    setImage(null);

    // fetchBoard(); // Re-fetch board data to update state
    setShowLoading(false);
    history.push(`/boards/${board.id}`);
  }

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  }

  const handleImagePromptInput = (e: CustomEvent) => {
    const newPrompt = e.detail.value;
    if (image) {
      setImage({ ...image, image_prompt: newPrompt });
    }
  }

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink={`/boards`}>
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          {board && <IonTitle>{board.name}</IonTitle>}
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
            <IonSegmentButton value="gallery">
              <IonLabel>Gallery</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="upload">
              <IonLabel>Upload</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="generate">
              <IonLabel>Generate</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding' scrollY={true}>
        <div className='ion-justify-content-center ion-align-items-center ion-text-center pt-1'>
          <IonText className='font-bold text-2xl'>
            {board && board.name}
          </IonText>
        </div>
        <div className='mt-6 py-3 px-1 hidden text-center' ref={uploadForm}>
        <IonText className='text-lg'>Upload your own board</IonText>
          {board && <FileUploadForm board={board} onCloseModal={undefined} showLabel={true} existingLabel={image?.label} />}
        </div>
        <div className='mt-2 hidden' ref={generateForm}>
          <IonList className="ion-padding" lines='none' >
            <IonItem className='my-2'>
              <IonText className='font-bold text-xl mt-2'>Generate an board with AI</IonText>
            </IonItem>
            <IonItem className='mt-2 border-2'>
              <IonLoading className='loading-icon' cssClass='loading-icon' isOpen={showLoading} message={'Adding the board to your board...'} />
              {board && <IonTextarea fill='outline' className='' placeholder='Enter prompt' onIonInput={handleImagePromptInput}></IonTextarea>}
            </IonItem>
            <IonItem className='mt-2'>
              <IonButton className='w-full text-lg' onClick={handleGenerate}>Generate Image</IonButton>
            </IonItem>
            <IonItem className='mt-2 font-mono text-center'>
              <IonText className='text-sm'>This will generate an board based on the prompt you enter.</IonText>
            </IonItem>
            <IonItem className='mt-2 font-mono text-center text-red-400'>
              <IonText className='ml-6'> It will cost 1 credit.</IonText>
            </IonItem>
          </IonList>
        </div>
        
          <div className="ion-padding hidden" ref={boardGridWrapper}>
          {board && board.images && board.images.length > 0 &&
          <div className='ion-padding'>
            <IonLabel className='font-sans text-sm'>There are currently {board.images.length} images in this board. Click on an image to view it.</IonLabel>
            <div className="grid grid-cols-3 gap-4 mt-3" ref={boardGrid} >
              {board?.images && board.images.map((img: Image, index: number) => (
                <div key={img.id} className='h-20 w-20'>
                  <IonImg id={img.id} src={img.src} alt={img.label} onClick={handleDocClick} />
                </div>
              ))}
            </div>
          </div>
          }
          {board && board.images && board.images.length < 1 &&
            <div className="text-center">
            </div>
          }
          </div>
      </IonContent>
    </IonPage>
  );
};

export default SelectGalleryScreen;