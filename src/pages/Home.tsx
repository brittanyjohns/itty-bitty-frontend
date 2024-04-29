import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import MainMenu from "../components/MainMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Tabs from "../components/Tabs";
import { useHistory } from "react-router";
import { useEffect } from "react";
import MainPageContent from "./MainPageContent";

const Home: React.FC = () => {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useCurrentUser();

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useEffect(() => {
    const onDesktop = currentUser?.isDesktop;
    console.log("platforms", onDesktop);
  }, []);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <img
              slot="start"
              src="public/images/round_itty_bitty_logo_1.png"
              className="h-10 w-10"
            />
            <IonTitle>SpeakAnyWay</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding text-justified" scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <MainPageContent />
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default Home;
