import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Tabs from "../components/utils/Tabs";
import MainPageContent from "./MainPageContent";
import MainHeader from "./MainHeader";
import { useEffect, useState } from "react";
import BoardGrid from "../components/boards/BoardGrid";
import PricingTable from "../components/utils/PricingTable";
import StaticMenu from "../components/main_menu/StaticMenu";
import { logInOutline, personAddOutline } from "ionicons/icons";
import Dashboard from "./Dashboard";
import SubscriptionList from "../components/stripe/SubscriptionList";
import { Subscription, getSubscriptions } from "../data/subscriptions";
import AccountLink from "../components/stripe/AccountLink";

const Home: React.FC = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const [ip, setIP] = useState("");

  const loadSubscriptions = async () => {
    const subs = await getSubscriptions();
    setSubscriptions(subs["subscriptions"]);
  };

  const getData = async () => {
    const res = await fetch("https://api.ipify.org/?format=json");
    const resData = await res.json();
    setIP(resData.ip);
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
    loadSubscriptions();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useEffect(() => {
    // Set up the interval to fetch board data every 30 seconds
    const intervalId = setInterval(() => {
      getData();
    }, 150000); // 150000 milliseconds = 2.5 minutes

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <MainMenu
        pageTitle="SpeakAnyWay"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="SpeakAnyWay"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle={isWideScreen ? "" : currentUser ? "Home" : "SpeakAnyWay"}
          isWideScreen={isWideScreen}
          endIcon={logInOutline}
          endLink={currentUser ? "/settings" : "/sign-up"}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="text-justified" scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="w-full">
            {currentUser && currentUser?.plan_type === "free" && (
              <PricingTable showHeader={false} />
            )}
          </div>
          {/* {currentUser && currentUser?.plan_type !== "free" && (
            <>
              <h1 className="text-2xl">Dashboard</h1>

              <SubscriptionList subscriptions={subscriptions} />
              <AccountLink />
            </>
          )} */}
          {!currentUser && <MainPageContent ipAddr={ip} />}

          {currentAccount && (
            <BoardGrid
              gridType={"child"}
              boards={currentAccount.boards || []}
            />
          )}
        </IonContent>
        {currentUser && !isWideScreen && <Tabs />}
      </IonPage>
    </>
  );
};

export default Home;
