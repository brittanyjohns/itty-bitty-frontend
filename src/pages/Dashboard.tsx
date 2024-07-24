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
import { useState, useEffect } from "react";
import SubscriptionList from "../components/stripe/SubscriptionList";
import { Subscription, getSubscriptions } from "../data/subscriptions";
import AccountLink from "../components/stripe/AccountLink";
import PricingTable from "../components/utils/PricingTable";
const Dashboard: React.FC = () => {
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
    if (currentUser) {
      loadSubscriptions();
    }
  }, []);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="p-4">
            {currentAccount && (
              <h2 className="text-xl font-semibold">
                {currentAccount?.name || currentAccount?.username}'s Dashboard
                🚀
              </h2>
            )}
            {(currentUser && currentUser?.admin) ||
              (currentUser && currentUser?.plan_type !== "free" && (
                <>
                  <h2 className="text-xl font-semibold">Subscriptions</h2>
                  <SubscriptionList subscriptions={subscriptions} />
                </>
              ))}
            <div className="p-3 mt-5">
              <AccountLink />

              {currentUser && currentUser?.plan_type === "free" && (
                <PricingTable />
              )}
            </div>
          </div>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default Dashboard;
