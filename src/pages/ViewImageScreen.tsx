import { useState } from 'react';
import { Image, ImageDoc, getImage, updateImage } from '../data/images';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { markAsCurrent } from '../data/docs';

const ViewImageScreen: React.FC = (props: any) => {
  const params = useParams<{ id: string }>();
  const [image, setImage] = useState<Image>({ id: '', src: '', label: '', docs: [] });
  const [docs, setDocs] = useState<ImageDoc[]>([]);
  useIonViewWillEnter(() => {
    fetchImage().then((img) => {
      setImage(img);
    });
  });

  const fetchImage = async () => {
    console.log('fetchImage');
    const img = await getImage(params.id);
    console.log('img', img.docs);
    setImage(img);
    setDocs(img.docs);
    return img;
  }

  const handleDocClick = (e: any) => {
    console.log('Image clicked: ', e.target.id);
    console.log('Image clicked: ', e.target.src);
    markAsCurrent(e.target.id);
    fetchImage();
    window.location.reload();
  }

  return (
    <IonPage id="new-image-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink={`/images`}> {/* <IonButton routerLink="/home"> */}
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
            <IonTitle>View Image</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
        <IonText>Viewing {image.label}</IonText>
        <IonItem>
            <IonImg id={image.id} src={image.src} alt={image.label} className="absolute object-contain w-full h-full top-0 left-0" />
          </IonItem>
        <>
        <div className="my-auto mx-auto grid grid-rows-4 grid-flow-col gap-1 p-1 ">
        {image && image.docs && image.docs.map((doc, index) => (
          <IonItem key={index}>
            <IonImg id={doc.id} src={doc.src} alt={doc.label} className="absolute object-contain w-full h-full top-0 left-0" onClick={handleDocClick} />
          </IonItem>
        ))}
      </div>
        </>
      </IonContent>
    </IonPage>
  );
}

export default ViewImageScreen;