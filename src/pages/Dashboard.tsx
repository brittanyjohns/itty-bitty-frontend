import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
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
import WordNetworkGraph from "../components/utils/WordNetworkGraph";
import { WordEvent, fetchWordEvents } from "../data/word_event";
import WordCloudChart from "../components/utils/WordCloudChart";
const Dashboard: React.FC = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [wordEvents, setWordEvents] = useState<WordEvent[]>([]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const loadSubscriptions = async () => {
    const subs = await getSubscriptions();
    setSubscriptions(subs["subscriptions"]);
  };

  const [loading, setLoading] = useState(false);

  const loadWordEvents = async () => {
    setLoading(true);
    const events = await fetchWordEvents();
    setLoading(false);
    console.log("events", events);
    setWordEvents(events);
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
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="">
            {currentAccount && (
              <h2 className="text-xl font-semibold">
                {currentAccount?.name || currentAccount?.username}'s Dashboard
                🚀
              </h2>
            )}
            {(currentUser && currentUser?.admin) ||
              (currentUser && currentUser?.plan_type !== "free" && (
                <>
                  <SubscriptionList subscriptions={subscriptions} />
                  <AccountLink />
                </>
              ))}
            <div className="">
              {currentUser && currentUser?.plan_type === "free" && (
                <PricingTable />
              )}
            </div>
            <div className="mt-3 w-full md:w-5/6 mx-auto">
              {currentUser && (
                <div className="p-4">
                  <IonButtons slot="start" className="mt-4">
                    <IonButton
                      fill="outline"
                      color="primary"
                      expand="block"
                      size="large"
                      onClick={loadWordEvents}
                    >
                      Load Graphs
                    </IonButton>
                  </IonButtons>
                  {loading && <IonSpinner />}
                  <div className="">
                    <div className="w-full md:w-5/6 mx-auto my-4">
                      <h1 className="text-2xl mt-4">Word Usage Word Cloud</h1>

                      <WordCloudChart wordEvents={wordEvents} />
                    </div>
                    <div className="w-full md:w-5/6 mx-auto my-4">
                      <h1 className="text-2xl">Word Relationships </h1>

                      <WordNetworkGraph wordEvents={wordEvents} />
                    </div>
                  </div>
                </div>
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
