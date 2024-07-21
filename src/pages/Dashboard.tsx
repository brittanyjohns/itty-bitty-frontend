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
import ChildAccountForm from "../components/childAccounts/ChildAccountForm";
const Dashboard: React.FC = () => {
  const { isWideScreen, currentUser } = useCurrentUser();

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

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              {!isWideScreen && <IonMenuButton></IonMenuButton>}
            </IonButtons>
            <IonTitle>Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="p-4">
            {currentUser?.admin ||
              (currentUser?.plan_type !== "free" && (
                <SubscriptionList subscriptions={subscriptions} />
              ))}
            <div className="p-3 mt-5">
              <AccountLink />

              {currentUser?.plan_type === "free" && <PricingTable />}
            </div>
          </div>
          <div className="p-4">
            <h1>Child Accounts</h1>
            <p>
              Create child accounts to allow your children to use SpeakAnyWay in
              a way that's safe and secure.
            </p>
            {currentUser && <ChildAccountForm currentUser={currentUser} />}
          </div>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default Dashboard;
