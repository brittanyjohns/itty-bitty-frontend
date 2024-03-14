import React, { useState, useEffect, useRef } from 'react';
import { IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { arrowBackCircleOutline, toggle } from 'ionicons/icons';
import { getImage, updateImage, Image, ImageDoc, generateImage } from '../data/images'; // Adjust imports based on actual functions
import { markAsCurrent } from '../data/docs'; // Adjust imports based on actual functions
import BoardDropdown from '../components/BoardDropdown';
import FileUploadForm from '../components/FileUploadForm';
const ViewImageScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<Image | null>(null)
  const [currentDoc, setCurrentDoc] = useState<ImageDoc | null>(null);
  const imageGrid = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState('gallery');
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const imageGridWrapper = useRef<HTMLDivElement>(null);

  const fetchImage = async () => {
    const img = await getImage(id); // Ensure getImage is typed to return a Promise<Image>
    console.log('img', img);
    setImage(img);
    return img;
  };

  useEffect(() => {
    async function getData() {
      const imgToSet = await fetchImage();
      setImage(imgToSet);
      toggleForms(segmentType);
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
    setCurrentDoc(imgToSet.display_doc);
  };

  const handleGenerate = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('id', image.id);
    formData.append('image_prompt', image.image_prompt ?? '');
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
            <IonButton routerLink={`/images`}>
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
            <IonTitle>View Image</IonTitle>
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
          {currentDoc && <IonImg id={currentDoc.id} src={currentDoc.src} alt={currentDoc.label} className='w-1/2 mx-auto' />}
          {image && !currentDoc && <IonImg id={image.id} src={image.src} alt={image.label} className='w-1/2 mx-auto' />}
          </div>
        </div>
        <div className='mt-2 hidden' ref={uploadForm}>
          {image && <FileUploadForm board={undefined} onCloseModal={undefined} showLabel={false} existingLabel={image.label} />}
        </div>
        <div className='mt-2 hidden' ref={generateForm}>
          <IonList className="ion-padding" lines='none' >
            <IonItem className='my-2'>
              <IonText className='font-bold text-xl mt-2'>Generate an image with AI</IonText>
            </IonItem>
            <IonItem className='mt-2'>
              <IonLoading className='loading-icon' cssClass='loading-icon' isOpen={showLoading} message={'Adding the image to your board...'} />
              {image && <IonInput className='focus:border-blue-500 text-xs' placeholder='Enter prompt' onIonInput={(e) => setImage({ ...image, image_prompt: e.detail.value! })}></IonInput>}
              <IonButton color='primary' onClick={handleGenerate}>Generate Image</IonButton>
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
