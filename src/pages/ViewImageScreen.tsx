import React, { useState, useEffect, useRef } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg, 
  IonItem,
  IonLabel,
  IonList, 
  IonLoading,
  IonPage, 
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  IonToolbar
} from '@ionic/react';
import { useParams } from 'react-router';
import { getImage, Image, generateImage } from '../data/images'; // Adjust imports based on actual functions
import { markAsCurrent } from '../data/docs'; // Adjust imports based on actual functions
import BoardDropdown from '../components/BoardDropdown';
import FileUploadForm from '../components/FileUploadForm';
import { useCurrentUser } from '../hooks/useCurrentUser';

const ViewImageScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<Image | null>(null)
  const [currentImage, setCurrentImage] = useState<string |null>('');
  const imageGrid = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState('gallery');
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const imageGridWrapper = useRef<HTMLDivElement>(null);

  const { currentUser, setCurrentUser } = useCurrentUser();

  const checkCurrentUserTokens = (numberOfTokens: number = 1) => {
    if (currentUser && currentUser.tokens && currentUser.tokens >= numberOfTokens) {
      return true;
    }
    return false;
  }

  const fetchImage = async () => {
    const img = await getImage(id);
    setImage(img);
    return img;
  };

  useEffect(() => {
    async function getData() {
      const imgToSet = await fetchImage();
      setImage(imgToSet);
      toggleForms(segmentType);
      if (imgToSet.display_doc && imgToSet.display_doc.src) {
        setCurrentImage(imgToSet.display_doc.src);
      } else {
        setCurrentImage(imgToSet.src);
      }
    }
    getData();
  }, []);

  const toggleForms = (segmentType: string) => {
    if (segmentType === 'generate') {
      uploadForm.current?.classList.add('hidden');
      generateForm.current?.classList.remove('hidden');
      imageGridWrapper.current?.classList.add('hidden');
    }
    if (segmentType === 'upload') {
      uploadForm.current?.classList.remove('hidden');
      generateForm.current?.classList.add('hidden');
      imageGridWrapper.current?.classList.add('hidden');
    }
    if (segmentType === 'gallery') {
      uploadForm.current?.classList.add('hidden');
      generateForm.current?.classList.add('hidden');
      imageGridWrapper.current?.classList.remove('hidden');
    }
  }

  const handleDocClick = async (e: React.MouseEvent<HTMLIonImgElement>) => {
    const target = e.target as HTMLImageElement;
    await markAsCurrent(target.id); // Ensure markAsCurrent returns a Promise
    const imgToSet = await fetchImage();
    setImage(imgToSet);
    setCurrentImage(imgToSet?.display_doc?.src ?? imgToSet.src);
  };

  const handleGenerate = async () => {
    if (!image) return;
    const hasTokens = checkCurrentUserTokens(1);
    if (!hasTokens) {
      alert('Sorry, you do not have enough tokens to generate an image. Please purchase more tokens to continue.');
      console.error('User does not have enough tokens');
      return;
    }
    const formData = new FormData();
    formData.append('id', image.id);
    formData.append('image[image_prompt]', image.image_prompt ?? '');
    setShowLoading(true);
    const updatedImage = await generateImage(formData); // Ensure generateImage returns a Promise<Image>
    setImage(updatedImage);
    fetchImage(); // Re-fetch image data to update state
    setShowLoading(false);
  }

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  }

  return (
    <IonPage id="view-image-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/images" />
          </IonButtons>
          {image && <BoardDropdown imageId={image.id} />}
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
            {image && image.label}
          </IonText>
          <div className='mt-2'>
            {currentImage && image && <IonImg id={image.id} src={currentImage} alt={image.label} className='w-1/2 mx-auto' />}
            {/* {image && !currentImage && <IonImg id={image.id} src={image.src} alt={image.label} className='w-1/2 mx-auto' />} */}
          </div>
        </div>
        <div className='mt-6 py-3 px-1 hidden text-center' ref={uploadForm}>
          <IonText className='text-lg'>Upload your own image</IonText>
          {image && <FileUploadForm board={undefined} onCloseModal={undefined} showLabel={false} existingLabel={image.label} />}
        </div>
        <div className='mt-2 hidden' ref={generateForm}>
          <IonList className="ion-padding" lines='none' >
            <IonItem className='my-2'>
              <IonText className='font-bold text-xl mt-2'>Generate an image with AI</IonText>
            </IonItem>
            <IonItem className='mt-2 border-2'>
              <IonLoading className='loading-icon' cssClass='loading-icon' isOpen={showLoading} message={'Adding the image to your board...'} />
              {image && <IonTextarea className='' placeholder='Enter prompt' onIonInput={(e) => setImage({ ...image, image_prompt: e.detail.value! })}></IonTextarea>}
            </IonItem>
            <IonItem className='mt-2'>
              <IonButton className='w-full text-lg' onClick={handleGenerate}>Generate Image</IonButton>
            </IonItem>
            <IonItem className='mt-2 font-mono text-center'>
              <IonText className='text-sm'>This will generate an image based on the prompt you enter.</IonText>
            </IonItem>
            <IonItem className='mt-2 font-mono text-center text-red-400'>
              <IonText className='ml-6'> It will cost 1 credit.</IonText>
            </IonItem>
          </IonList>
        </div>

        <div className="ion-padding hidden" ref={imageGridWrapper}>
          {image && image.docs && image.docs.length > 0 &&
            <div className='ion-padding'>
              <IonLabel className='font-sans text-sm'>Click on a different to display for this word</IonLabel>
              <div className="grid grid-cols-3 gap-4 mt-3" ref={imageGrid} >
                {image?.docs && image.docs.map((doc, index) => (
                  <div key={doc.id} className='h-20 w-20'>
                    <IonImg id={doc.id} src={doc.src} alt={doc.label} onClick={handleDocClick} />
                  </div>
                ))}
              </div>
            </div>
          }
          {image && image.docs && image.docs.length < 1 &&
            <div className="text-center">
            </div>
          }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewImageScreen;
