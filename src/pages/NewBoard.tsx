import { createBoard } from '../data/boards';
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
  useIonViewWillEnter,
} from '@ionic/react';
import './NewBoard.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { arrowBackCircleOutline } from 'ionicons/icons';
type Inputs = {
  name: string
}
const NewBoard: React.FC = (props: any) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    createBoard(data);
    props.history.push('/boards');
    window.location.reload();
  }
  console.log(watch("name")) // watch input value by passing the name of it

  return (
    <IonPage id="new-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
          <IonButton routerLink="/boards">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
          </IonButtons>
          <IonTitle>New Board</IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
          <>
          <form className="ion-padding" onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonInput label="Name" placeholder="Enter new board name" defaultValue="" {...register("name", { required: true })} />
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

export default NewBoard;