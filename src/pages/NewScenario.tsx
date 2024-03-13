import { Scenario, createScenario } from '../data/scenarios';
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
import { arrowBackCircleOutline } from 'ionicons/icons';
import NewScenarioForm from '../components/NewScenarioForm';

const NewScenario: React.FC = (props: any) => {
  useIonViewWillEnter(() => {
    console.log('ionViewWillEnter event fired');
  });
  
  const onSubmit = async (data: Scenario) => {
    const newScenario = await createScenario(data);
    if (newScenario.errors && newScenario.errors.length > 0) {
      console.error('Error creating scenario', newScenario.errors);
    } else {
      props.history.push('/scenarios');
    }
  } 
  
  return (
    <IonPage id="new-scenario-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
          <IonButton routerLink="/scenarios">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
          </IonButtons>
          <IonTitle>New Scenario</IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
          <NewScenarioForm onSave={onSubmit} onCancel={() => props.history.push('/scenarios')} scenario={{}} />
      </IonContent>
    </IonPage>
  );
}

export default NewScenario;