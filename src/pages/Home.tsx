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
import StaticMenu from "../components/main_menu/StaticMenu";
import { logInOutline } from "ionicons/icons";
import UserHome from "../components/utils/UserHome";

const Home: React.FC = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();

  const [ip, setIP] = useState("");

  const getData = async () => {
    const res = await fetch("https://api.ipify.org/?format=json");
    const resData = await res.json();
    setIP(resData.ip);
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
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
          endLink={"/sign-up"}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="text-justified" scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="bg-inherit shadow-none w-full md:w-3/4 lg:w-2/3 mx-auto ion-padding">
            {(currentUser && (
              <UserHome
                userName={currentUser?.name || currentUser.email}
                trialDaysLeft={currentUser?.trial_days_left}
                freeAccount={currentUser?.plan_type === "free"}
                tokens={currentUser?.tokens ? currentUser.tokens : 0}
              />
            )) || <MainPageContent ipAddr={ip} />}
          </div>

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
