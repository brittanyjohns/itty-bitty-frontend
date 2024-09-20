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
import SideMenu from "../components/main_menu/SideMenu";
import Tabs from "../components/utils/Tabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { getDemoUrl, getImageUrl } from "../data/utils";
import MainHeader from "./MainHeader";
import StaticMenu from "../components/main_menu/StaticMenu";
const Demo: React.FC = () => {
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <SideMenu
        pageTitle="Dashboard"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Dashboard"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Dashboard"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="ion-padding">
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
