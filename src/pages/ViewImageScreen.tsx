import React, { useState, useEffect, useRef } from 'react';
import { IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { arrowBackCircleOutline } from 'ionicons/icons';
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

  const fetchImage = async () => {
    const img = await getImage(id); // Ensure getImage is typed to return a Promise<Image>
    console.log('img', img);
    setImage(img);
    return img;
  };

  useEffect(() => {
    async function getData() {
      const imgToSet = await fetchImage();
      console.log('imgToSet', imgToSet);
      setImage(imgToSet);
      console.log('imageGrid', imageGrid.current);
      // toggleImageGrid();
    }
    getData();
  }, []);

  const toggleImageGrid = () => {
    if (imageGrid.current) {
      imageGrid.current.classList.toggle('hidden');
    }
  }

  const handleDocClick = async (e: React.MouseEvent<HTMLIonImgElement>) => {
    const target = e.target as HTMLImageElement;
    console.log('handleDocClick - target', target);
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
      </IonHeader>
      <IonContent className='ion-padding' scrollY={true}>


        <div className='ion-justify-content-center ion-align-items-center ion-text-center pt-3'>
          <IonText className='font-bold text-2xl'>
            {image && image.label}
          </IonText>
          {currentDoc && <IonImg id={currentDoc.id} src={currentDoc.src} alt={currentDoc.label} className='w-1/4 mx-auto' />}
          {image && !currentDoc && <IonImg id={image.id} src={image.src} alt={image.label} className='w-1/4 mx-auto' />}
        </div>
        <div className='mt-2'>
          {image && <FileUploadForm board={undefined} onCloseModal={undefined} showLabel={false} existingLabel={image.label} />}
        </div>
        <IonList className="ion-padding border-t-2 border-b-2" lines='none'>
          <IonItem className='my-2'>
          <IonText className='font-bold text-xl mt-2'>Generate an image with AI</IonText>
          </IonItem>
          <IonItem className='mt-2'>
          <IonLoading className='loading-icon' cssClass='loading-icon' isOpen={showLoading} message={'Adding the image to your board...'} />
            {image && <IonInput className='focus:border-blue-500 text-xs' placeholder='Enter prompt' onIonInput={(e) => setImage({ ...image, image_prompt: e.detail.value! })}></IonInput>}
            <IonButton color='primary' onClick={handleGenerate}>Generate Image</IonButton>
          </IonItem>

        </IonList>
        {image && image.docs && image.docs.length > 0 && 
        <IonCard className="ion-padding border-2 border-t-2">
          <IonLabel className='font-bold text-xl'>Choose a different display image</IonLabel>
          <div className="grid grid-cols-3 gap-4" ref={imageGrid} >
            {image?.docs && image.docs.map((doc, index) => (
              <div key={doc.id} className='h-20 w-20'>
                <IonImg id={doc.id} src={doc.src} alt={doc.label} onClick={handleDocClick} />
              </div>
            ))}
          </div>
        </IonCard>
        }
      </IonContent>
    </IonPage>
  );
};

export default ViewImageScreen;
