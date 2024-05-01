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
import { getImageUrl } from "../data/utils";
import { useMediaQuery } from "react-responsive";
import SideMenu from "../components/SideMenu";
import MainHeader from "./MainHeader";

const Home: React.FC = () => {
  const history = useHistory();
  const { currentUser, isDesktop, platforms, isWideScreen } = useCurrentUser();
  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useEffect(() => {
    console.log("isDesktop", isDesktop);
    console.log("isWideScreen", isWideScreen);
  }, []);

  return (
    <>
      <MainMenu />

      <IonPage id="main-content">
        {!isWideScreen && <MainHeader />}
        <IonContent className="ion-padding text-justified" scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <MainPageContent />
        </IonContent>
        {currentUser && !isWideScreen && <Tabs />}
      </IonPage>
    </>
  );
};

export default Home;
