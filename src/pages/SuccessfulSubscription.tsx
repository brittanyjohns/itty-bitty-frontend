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
import MainMenu from "../components/main_menu/MainMenu";
import Tabs from "../components/utils/Tabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { Subscription, getSubscriptions } from "../data/subscriptions";
import SubscriptionList from "../components/stripe/SubscriptionList";
import AccountLink from "../components/stripe/AccountLink";
import StaticMenu from "../components/main_menu/StaticMenu";
import MainHeader from "./MainHeader";

const SuccessfulSubscription: React.FC = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const loadSubscriptions = async () => {
    const subs = await getSubscriptions();
    setSubscriptions(subs["subscriptions"]);
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  // loadSubscriptions();

  return (
    <>
      <MainMenu
        pageTitle="Success"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Success"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <MainHeader pageTitle="Success" isWideScreen={isWideScreen} />

      <IonPage id="main-content">
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="mb-4 p-4 w-full md:w-1/2 mx-auto">
            <h1 className="text-4xl font-bold my-8">
              Thank you for subscribing!
            </h1>

            <h1 className="text-2xl">Your subscription is now active.</h1>
            <p className="text-lg">
              You can now access all the features of the Pro plan.
            </p>
            <p className="text-lg">
              You can manage your subscription from the settings page.
            </p>
            {currentUser?.plan_status !== "active" && (
              <IonButton routerLink="/upgrade">Upgrade</IonButton>
            )}
          </div>
          <SubscriptionList subscriptions={subscriptions} />
          {currentUser?.plan_status === "active" && <AccountLink />}
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default SuccessfulSubscription;
