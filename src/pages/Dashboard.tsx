import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import Tabs from "../components/utils/Tabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useState, useEffect } from "react";
import SubscriptionList from "../components/stripe/SubscriptionList";
import { Subscription, getSubscriptions } from "../data/subscriptions";
import AccountLink from "../components/stripe/AccountLink";
import WordNetworkGraph from "../components/utils/WordNetworkGraph";
import {
  WordEvent,
  fetchWordEvents,
  fetchWordEventsByUserId,
} from "../data/word_event";
import WordCloudChart from "../components/utils/WordCloudChart";
import MainHeader, { closeMainMenu } from "./MainHeader";
import StaticMenu from "../components/main_menu/StaticMenu";

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
    if (!currentUser) {
      setLoading(false);
      console.log("No current user");
      return;
    }
    let events: WordEvent[] = [];
    if (currentUser?.admin) {
      events = await fetchWordEvents();
    }
    events = await fetchWordEventsByUserId(currentUser.id || 0);
    setLoading(false);
    console.log("events", events);
    setWordEvents(events);
  };

  useIonViewWillEnter(() => {
    closeMainMenu();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadSubscriptions();
    }
    loadWordEvents();
  }, [currentUser]);

  return (
    <>
      <MainMenu
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
        <IonContent className="">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <h1 className="text-2xl">Dashboard</h1>

          <div className="">
            <p className="text-md my-3">
              This is your dashboard. Here you can see user activity, word usage
              & more.
            </p>
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
            <div className="flex flex-col">
              {currentUser && currentUser?.plan_type !== "free" && (
                <div className="p-2 text-center border">
                  <IonLabel className="text-2xl text-gray-500">
                    BETA Features below - Word Events & Word Relationships
                  </IonLabel>
                  {loading && <IonSpinner />}
                  <h1 className="text-xl font-bold">Word Events</h1>

                  <div className="flex justify-between">
                    <div className="w-full md:w-1/2">
                      <h1 className="text-xl mt-4">Word Usage Cloud</h1>
                      <div className=" border overflow-hidden m-1">
                        <WordCloudChart wordEvents={wordEvents} />
                      </div>
                    </div>
                    <h1 className="text-2xl">Word Relationships </h1>

                    <div className=" border m-1">
                      <WordNetworkGraph wordEvents={wordEvents} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default Dashboard;
