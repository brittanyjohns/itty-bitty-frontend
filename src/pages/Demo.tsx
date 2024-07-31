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
import MainHeader from "./MainHeader";
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
        <MainHeader pageTitle="Demo" isWideScreen={isWideScreen} />
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
            <div className="p-4 font-mono">
              <video
                className="w-full md:w-3/4 mx-auto"
                controls
                src="https://itty-bitty-boards-development.s3.amazonaws.com/demo071424.mp4"
              ></video>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Demo;
