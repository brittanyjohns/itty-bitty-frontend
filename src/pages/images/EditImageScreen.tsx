import { useState } from "react";
import { Image, getImage, updateImage } from "../../data/images";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";

import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { arrowBackCircleOutline } from "ionicons/icons";
import ImageCropper from "../../components/images/ImageCropper";
import SideMenu from "../../components/main_menu/SideMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import { useCurrentUser } from "../../contexts/UserContext";

const EditImageScreen: React.FC = (props: any) => {
  const params = useParams<{ id: string }>();
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  const [image, setImage] = useState<Image>({
    id: "",
    src: "",
    label: "",
    bg_color: "",
  });

  useIonViewWillEnter(() => {
    fetchImage().then((img) => {
      setImage(img);
    });
  });

  const fetchImage = async () => {
    console.log("fetchImage");
    const img = await getImage(params.id);
    console.log("img", img);
    setImage(img);
    return img;
  };

  return (
    <>
      <SideMenu
        pageTitle="Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Images"
          isWideScreen={isWideScreen}
          startLink="/images"
        />

        <IonContent className="ion-padding">
          <h1 className="text-center">
            Edit image for:{" "}
            <span className="font-bold my-2 block">{image.label}</span>
          </h1>
          <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
            <ImageCropper
              hidePaste={true}
              existingId={image.id}
              existingImageSrc={image.src}
              existingLabel={image.label}
            />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default EditImageScreen;
