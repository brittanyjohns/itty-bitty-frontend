import {
  IonButton,
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
import MainMenu from "../components/MainMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Tabs from "../components/Tabs";
import { useHistory } from "react-router";
const Home: React.FC = () => {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useCurrentUser();

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding text-justified" scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <h1 className="text-2xl font-bold">Welcome to Itty Bitty Boards</h1>
          {currentUser && (
            <p className="text-xl font-light mt-2">
              Click on the Boards tab to get started
            </p>
          )}
          {!currentUser && (
            <div className="text-center">
              <p className="text-xl font-light mt-2">
                Please sign in to get started
              </p>
              <IonButton
                onClick={() => history.push("/sign-in")}
                color="primary"
                className="mt-2"
              >
                Sign In
              </IonButton>
              <p className="text-xl font-light mt-2">Or create an account</p>
              <IonButton
                onClick={() => history.push("/sign-up")}
                color="primary"
                className="mt-2"
              >
                Sign Up
              </IonButton>
            </div>
          )}
          <p className="p-3 m-3 text-center font-mono text-red-600">
            Please note: This application is in development and may not be fully
            functional.
          </p>
          <p className="p-3 m-3 text-center">
            If you have issues, please use the web version at{" "}
            <a
              className="font-bold"
              href="https://speakanyway.com"
              target="_blank"
            >
              {" "}
              IttyBittyBoards.com
            </a>
          </p>
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default Home;
