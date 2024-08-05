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
import BoardGrid from "../components/boards/BoardGrid";
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
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <div className="">
            {currentAccount && (
              <>
                <h2 className="text-xl font-semibold">
                  {currentAccount?.name || currentAccount?.username}'s Dashboard
                  🚀
                </h2>
                <div className="flex flex-col">
                  <div className="m-1">
                    <BoardGrid
                      gridType={"child"}
                      boards={currentAccount.boards || []}
                    />
                  </div>
                </div>
              </>
            )}
            {(currentUser && currentUser?.admin) ||
              (currentUser && currentUser?.plan_type !== "free" && (
                <>
                  <h1 className="text-2xl">Dashboard</h1>

                  <SubscriptionList subscriptions={subscriptions} />
                  <AccountLink />
                </>
              ))}
            <div className="ion-padding flex flex-col">
              <p className="text-md mb-3 font-bold">
                This is your dashboard. Here you can see user activity, word
                usage & more.
              </p>

              <hr></hr>
              {currentUser && (
                <div className="ion-padding border">
                  <IonLabel className="text-2xl text-gray-500">
                    🚧 BETA Features 🚧 <br></br>{" "}
                    <span className="text-md font-bold">
                      Under Construction
                    </span>
                    <br></br>{" "}
                    <span className="text-sm">
                      Word Events & Word Relationships
                    </span>
                  </IonLabel>
                  {loading && <IonSpinner />}
                  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    <div className="border ion-padding overflow-hidden">
                      <h1 className="text-2xl mt-4">Word Usage Cloud</h1>
                      <WordCloudChart wordEvents={wordEvents} />
                    </div>

                    <div className="border ion-padding">
                      <h1 className="text-2xl mt-4">Word Relationships </h1>

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
