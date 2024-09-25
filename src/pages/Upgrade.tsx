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
import PricingTable from "../components/utils/PricingTable";
import StaticMenu from "../components/main_menu/StaticMenu";
import MainHeader from "./MainHeader";

const Upgrade: React.FC = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <SideMenu
        pageTitle="Upgrade"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Upgrade"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Upgrade"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="">
            {currentUser && currentUser?.plan_type === "free" ? (
              <PricingTable showHeader={false} />
            ) : (
              <div className="text-center p-4">
                <h1 className="text-2xl font-bold">
                  You are already on a paid plan.
                </h1>
              </div>
            )}
          </div>
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default Upgrade;
