import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Tabs from "../components/utils/Tabs";
import MainPageContent from "./MainPageContent";
import MainHeader from "./MainHeader";
import { useEffect, useState } from "react";
import BoardGrid from "../components/boards/BoardGrid";
import PricingTable from "../components/utils/PricingTable";

const Home: React.FC = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();

  const [ip, setIP] = useState("");

  const getData = async () => {
    // const res = await axios.get("https://api.ipify.org/?format=json");
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
    }, 3000); // 30000 milliseconds = 30 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        {!isWideScreen && <MainHeader />}
        <IonContent className="text-justified" scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="">
            {currentUser && currentUser?.plan_type === "free" && (
              <PricingTable showHeader={false} />
            )}
          </div>

          {!currentUser && !currentAccount && <MainPageContent ipAddr={ip} />}
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
