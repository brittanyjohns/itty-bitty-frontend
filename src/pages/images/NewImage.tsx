import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
} from "@ionic/react";
import ImageCropper from "../../components/images/ImageCropper";
import { createImage, cropImage } from "../../data/images";
import { useHistory } from "react-router";
import { arrowBackCircleOutline } from "ionicons/icons";
import MainMenu from "../../components/main_menu/MainMenu";

const NewImage: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => history.goBack()}>
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>New Image</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
            <ImageCropper />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default NewImage;
