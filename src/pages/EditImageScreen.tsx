import { useState } from 'react';
import { Image, getImage, updateImage } from '../data/images';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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

const EditImageScreen: React.FC = (props: any) => {
  const params = useParams<{ id: string }>();
  const [image, setImage] = useState<Image>({ id: '', src: '', label: '' });

  const {
    register,
    handleSubmit,
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

  useIonViewWillEnter(() => {
    fetchImage().then((img) => {
      setImage(img);
    });
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
            <IonButton routerLink={`/images/${image.id}`}> {/* <IonButton routerLink="/home"> */}
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
            <IonTitle>Edit Image</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
        <IonText>Editing {image.label}</IonText>
        <>
          <form className="ion-padding" onSubmit={handleSubmit(onSubmit)}>
            <IonInput
              value={image.label}
              aria-label='label'
              placeholder="Enter new image label" defaultValue="" {...register("label", { required: true })} />
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