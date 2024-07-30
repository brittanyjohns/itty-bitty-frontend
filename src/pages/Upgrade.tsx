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
import PricingTable from "../components/utils/PricingTable";

const Upgrade: React.FC = () => {
  const { isWideScreen, currentUser } = useCurrentUser();

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        {!isWideScreen && (
          <IonHeader className="bg-inherit shadow-none">
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
              </IonButtons>
              <IonTitle>Upgrade</IonTitle>
            </IonToolbar>
          </IonHeader>
        )}
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="">
            {currentUser && currentUser?.plan_type === "free" && (
              <PricingTable showHeader={false} />
            )}
          </div>
        </IonContent>
      </IonPage>
      <Tabs />
    </>
  );
};

export default Upgrade;
