import { useEffect, useRef, useState } from 'react';
import { Image } from '../data/images';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import { useParams } from 'react-router';
import './NewImage.css';
import ImageGallery from '../components/ImageGallery';
import ReorderList from '../components/ReorderList';

const NewImage: React.FC = (props: any) => {
  const [image, setImage] = useState<Image>();
  const params = useParams<{ id: string }>();

  const hideMenu = () => {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.close();
    }
  }

  useIonViewWillEnter(() => {
    console.log('NewImage useIonViewWillEnter');
    hideMenu();
  });

  // useEffect(() => {
  //   fetchImage();

  // }, []);

  return (
    <IonPage id="new-image-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" defaultHref="/home"></IonBackButton>
            <IonTitle>New Image</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
          <>
          <form className="ion-padding">
            <IonItem>
              <IonInput label="Name" placeholder="Enter new image name"></IonInput>
            </IonItem>
            <IonButton className="ion-margin-top" type="submit" expand="block">
              Create
            </IonButton>
          </form>
          </>
      </IonContent>
    </IonPage>
  );
}

export default NewImage;
function ionRouteDidChange(arg0: () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}

