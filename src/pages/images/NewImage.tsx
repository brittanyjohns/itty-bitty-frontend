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

  // const handleFormSubmit = async (data: {
  //   label: string;
  //   croppedImage: string;
  //   fileExtension: string;
  // }) => {
  //   setShowLoading(true);
  //   const formData = new FormData();
  //   const strippedImage = data.croppedImage.replace(
  //     /^data:image\/[a-z]+;base64,/,
  //     ""
  //   );

  //   formData.append("cropped_image", strippedImage);
  //   formData.append("image[label]", data.label);
  //   formData.append("file_extension", data.fileExtension);

  //   const result = await cropImage(formData);
  //   setShowLoading(false);

  //   if (result && result.id) {
  //     history.replace(`/images/${result.id}`);
  //   } else {
  //     console.error("Error:", result.error);
  //     alert("An error occurred. Please try again.");
  //   }
  // };

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
            <ImageCropper />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default NewImage;
