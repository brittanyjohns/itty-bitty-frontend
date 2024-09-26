import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  useIonViewWillEnter,
} from "@ionic/react";
import "../components/main.css";
import SideMenu from "../components/main_menu/SideMenu";
import Tabs from "../components/utils/Tabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useState, useEffect } from "react";
import { Subscription, getSubscriptions } from "../data/subscriptions";
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
import AccountContent from "../components/utils/AccountContent";
interface DashboardProps {}
const Dashboard: React.FC<DashboardProps> = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [wordEvents, setWordEvents] = useState<WordEvent[]>([]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 2000);
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

          <div className="">
            {currentAccount && currentAccount.username && (
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

            <AccountContent
              subscriptions={subscriptions}
              currentUser={currentUser}
              isVisible={currentUser?.plan_type !== "free"}
            />
            <div className="ion-padding flex flex-col">
              <p className="text-md mb-3 font-bold">
                This is your dashboard. Here you can see user activity, word
                usage & more.
              </p>
              {currentUser && currentUser?.plan_type === "free" && (
                <div className="w-full md:w-1/2 mx-auto p-3">
                  <p className="text-md mb-3 font-bold">
                    To access more features, please upgrade your plan.
                  </p>
                  <IonButtons>
                    <IonButton
                      routerLink="/upgrade"
                      color="success"
                      expand="block"
                      size="large"
                      fill="outline"
                    >
                      Upgrade Plan
                    </IonButton>
                    <IonButton
                      routerLink="/settings"
                      color="dark"
                      expand="block"
                      size="large"
                      fill="outline"
                    >
                      User Settings
                    </IonButton>
                  </IonButtons>
                </div>
              )}

              <hr></hr>
              {loading && <IonSpinner />}
              {currentUser && (
                <IonCard className="w-full md:w-1/2 mx-auto">
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="font-semibold">Plan Type:</span>{" "}
                      {currentUser?.plan_type}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Plan Status:</span>{" "}
                      {currentUser?.plan_status}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Plan Expires At:</span>{" "}
                      {currentUser?.plan_expires_at}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Free Trial?:</span>{" "}
                      {currentUser?.free_trial ? "Yes" : "No"}
                    </div>
                    <div
                      className={`mb-2 ${
                        currentUser?.free_trial ? "" : "hidden"
                      }`}
                    >
                      <span className="font-semibold">Free days left:</span>{" "}
                      {currentUser?.trial_days_left}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Tokens Remaining:</span>{" "}
                      {currentUser?.tokens}
                    </div>
                  </div>
                </IonCard>
              )}

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
