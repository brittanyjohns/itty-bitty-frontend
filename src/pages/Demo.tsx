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
import { getDemoUrl, getImageUrl } from "../data/utils";
const Demo: React.FC = () => {
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
            <IonTitle>Demo</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div>
            <h1 className="text-center text-2xl mt-10">
              Scenrios Boards Demo +
            </h1>
            <p className="text-center mt-5">
              Build a custom communication board based on any real life scenario
              & more!
            </p>
            <video className="w-1/2 mx-auto mt-10" controls>
              <source src={getDemoUrl("demo071424", "mp4")} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="p-4 font-mono">
            <img
              slot="start"
              // src="/src/assets/images/round_itty_bitty_logo_1.png"
              src={getDemoUrl("demo071424", "mp4")}

              // className="h-10 w-10"
            />
          </div>
        </IonContent>
      </IonPage>
      <Tabs />
    </>
  );
};

export default Demo;
