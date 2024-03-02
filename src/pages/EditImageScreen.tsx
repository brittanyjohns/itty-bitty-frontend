import { useEffect, useRef, useState } from 'react';
import { Image, createImage, getImage, updateImage } from '../data/images';
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

import { SubmitHandler, set, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

const EditImageScreen: React.FC = (props: any) => {
    const params = useParams<{ id: string }>();
    const [image, setImage] = useState<Image>({ id: '', src: '', label: '' });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Image>()
  const onSubmit: SubmitHandler<Image> = (data) => {
    console.log("data", data);
    const formData = new FormData();
    formData.append('image[label]', data.label);
    formData.append('image[src]', image.src);
    formData.append('image[id]', image.id);
    
    updateImage(formData);
    props.history.push('/home');
  }
  console.log(watch("label")) // watch input value by passing the label of it

  const hideMenu = () => {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.close();
    }
  }

  useIonViewWillEnter(() => {
    console.log('EditImageScreen useIonViewWillEnter');
    console.log('params', params);
    const result = fetchImage();
    console.log('result', result);
    hideMenu();
  });

  const fetchImage = async () => {
    console.log('fetchImage');
    const img = await getImage(params.id);
    console.log('img', img);
    setImage(img);
    return img;
  }

  return (
    <IonPage id="new-image-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Back" defaultHref="/home"></IonBackButton>
            <IonTitle>Edit Image</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
          <>
          <form className="ion-padding" onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonLabel position="stacked">Label</IonLabel>
              <IonInput
              value={image.label}
              placeholder="Enter new image label" defaultValue="" {...register("label", { required: true })} />
            </IonItem>
            <IonButton className="ion-margin-top" type="submit" expand="block">
              Save
            </IonButton>
          </form>
          </>
      </IonContent>
    </IonPage>
  );
}

export default EditImageScreen;