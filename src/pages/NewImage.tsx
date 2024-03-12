import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import FileUploadForm from '../components/FileUploadForm';
import { arrowBackCircleOutline } from 'ionicons/icons';

const NewImage: React.FC = (props: any) => {

  return (
    <>
      <IonPage id="new-image-page">
        <IonHeader translucent>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink="/images">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>New Image</IonTitle>

            <IonButtons slot="end">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <>
            <FileUploadForm board={undefined} onCloseModal={undefined} showLabel={true} />
          </>
        </IonContent>
      </IonPage>
    </>
  );
}

export default NewImage;
