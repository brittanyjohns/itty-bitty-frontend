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
import { useState } from "react";
import { useHistory } from "react-router";
import { arrowBackCircleOutline } from "ionicons/icons";
import MainMenu from "../../components/main_menu/MainMenu";

const NewImage: React.FC = () => {
  const history = useHistory();
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const handleFormSubmit = async (data: {
    label: string;
    croppedImage: string;
  }) => {
    setShowLoading(true);
    console.log("data:", data);
    const formData = new FormData();
    const strippedImage = data.croppedImage.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    );

    console.log("strippedImage:", strippedImage);

    formData.append("cropped_image", strippedImage);
    formData.append("image[label]", data.label);

    const result = await cropImage(formData);
    setShowLoading(false);

    if (result && result.id) {
      history.replace("/images"); // Use history to navigate
    } else {
      console.error("Error:", result.error);
    }
  };

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
        <IonContent fullscreen className="ion-padding">
          <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
            <ImageCropper onSubmit={handleFormSubmit} />
          </div>
          <IonLoading isOpen={showLoading} message="Uploading..." />
        </IonContent>
      </IonPage>
    </>
  );
};

export default NewImage;
