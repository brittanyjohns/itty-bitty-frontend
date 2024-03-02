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
  IonList,
  IonMenu,
  IonMenuButton,
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
import ImageFilePicker from '../components/ImageFilePicker';
import { createImage } from '../data/imageItems';
import { NewImageItemPayload } from '../types';
import { SubmitHandler, useForm } from 'react-hook-form';
import FileUploadForm from '../components/FileUploadForm';
import { MenuLink, getMenu } from '../data/menu';
import MenuListItem from '../components/MenuListItem';

type Inputs = {
  label: string
}
const NewImage: React.FC = (props: any) => {

  const [_isOpen, setIsOpen] = useState(false);

  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);
  const hideMenu = () => {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.close();
    }
  }

  useIonViewWillEnter(() => {
    console.log('NewImage useIonViewWillEnter');
    hideMenu();
    const links = getMenu();
    setMenuLinks(links);
  });

  return (
    <>
    <IonPage id="new-image-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" defaultHref="/home"></IonBackButton>
            <IonTitle>New Image</IonTitle>
          </IonButtons>
          <IonButtons slot="end">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
          <>
          <FileUploadForm board={undefined} onCloseModal={undefined} />
          </>
      </IonContent>
    </IonPage>
    </>
  );
}

export default NewImage;
function ionRouteDidChange(arg0: () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}

