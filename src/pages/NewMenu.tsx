import { createMenu } from '../data/menus';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { arrowBackCircleOutline } from 'ionicons/icons';
type Inputs = {
  name: string
}
const NewMenu: React.FC = (props: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    createMenu(data);
    props.history.push('/home');
  }

  return (
    <IonPage id="new-menu-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
          <IonButton routerLink="/menus">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
          </IonButtons>
          <IonTitle>New Menu</IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
          <>
          <form className="ion-padding" onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonInput label="Name" placeholder="Enter new menu name" defaultValue="" {...register("name", { required: true })} />
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

export default NewMenu;