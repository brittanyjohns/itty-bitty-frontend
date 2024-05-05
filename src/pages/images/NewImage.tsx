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
} from "@ionic/react";
import FileUploadForm from "../../components/images/FileUploadForm";
import { arrowBackCircleOutline } from "ionicons/icons";

const NewImage: React.FC = (props: any) => {
  return (
    <>
      <IonPage id="new-image-page">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink="/images">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>New Image</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
            <FileUploadForm
              board={undefined}
              onCloseModal={undefined}
              showLabel={true}
            />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default NewImage;
