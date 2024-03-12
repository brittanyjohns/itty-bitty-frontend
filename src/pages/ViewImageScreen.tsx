import React, { useState, useEffect } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { getImage, updateImage, Image, ImageDoc, generateImage } from '../data/images'; // Adjust imports based on actual functions
import { markAsCurrent } from '../data/docs'; // Adjust imports based on actual functions
import BoardDropdown from '../components/BoardDropdown';
import FileUploadForm from '../components/FileUploadForm';
const ViewImageScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<Image>({ id: '', src: '', label: '', docs: [], image_prompt: '' });
  const [currentDoc, setCurrentDoc] = useState<ImageDoc | null>(null);

  const fetchImage = async () => {
    const img = await getImage(id); // Ensure getImage is typed to return a Promise<Image>
    setImage(img);
    const currentDoc = img.docs.find((doc: { is_current: any; }) => doc.is_current);
    console.log('currentDoc', currentDoc);
    setCurrentDoc(currentDoc || null);
  };

  useEffect(() => {
    fetchImage();
  }, [id ]);

  const handleDocClick = async (e: React.MouseEvent<HTMLIonImgElement>) => {
    const target = e.target as HTMLImageElement;
    const response = await markAsCurrent(target.id); // Ensure markAsCurrent returns a Promise
    await fetchImage(); // Re-fetch image data to update state
  };

  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append('id', image.id);
    formData.append('image_prompt', image.image_prompt ?? '');
    const updatedImage = await generateImage(formData); // Ensure generateImage returns a Promise<Image>
    setImage(updatedImage);
    fetchImage(); // Re-fetch image data to update state
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
        </IonToolbar>
      </IonHeader>
        <IonText className='text-2xl' style={{display: 'block' }}>{image.label}</IonText>
          {currentDoc && <IonImg id={currentDoc.id} src={currentDoc.src} alt={currentDoc.label} className='max-h-32' />}
          {!currentDoc && <IonImg id={image.id} src={image.src} alt={image.label} />}
        <div className='ion-padding'>
        <FileUploadForm board={undefined} onCloseModal={undefined} />
        </div>
        
        <div className="ion-padding">
            <p className='font-bold'>Prompt:</p>
            <IonInput onIonInput={(e) => setImage({ ...image, image_prompt: e.detail.value! })}></IonInput>
          <IonButton onClick={handleGenerate}>Generate Image</IonButton>

          <h1> Add to a board</h1>
            <BoardDropdown imageId={image.id} />
        </div>

        <div className="grid grid-cols-4 grid-flow-col gap-1 p-1">
          {image?.docs && image.docs.map((doc, index) => (
            <div key={doc.id} className='h-20 w-20'>
              <IonImg id={doc.id} src={doc.src} alt={doc.label} onClick={handleDocClick} />
            </div>
          ))}
        </div>
    </IonPage>
  );
};

export default ViewImageScreen;
