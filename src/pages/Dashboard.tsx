import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import Tabs from "../components/utils/Tabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
const Dashboard: React.FC = () => {
  const { isWideScreen } = useCurrentUser();

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              {!isWideScreen && <IonMenuButton></IonMenuButton>}
            </IonButtons>
            <IonTitle>Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonContent fullscreen></IonContent>
        </IonContent>
      </IonPage>
      <Tabs />
    </>
  );
};

export default Dashboard;
