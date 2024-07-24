import {
  IonContent,
  IonItem,
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
import { getImageUrl } from "../data/utils";
import BoardGrid from "../components/boards/BoardGrid";

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

  return (
    <>
      <IonToolbar>
        <img
          slot="start"
          src={getImageUrl("round_itty_bitty_logo_1", "png")}
          className="h-10 w-10 mx-auto"
        />
        <p className="ml-3 font-bold text-2xl">SpeakAnyWay</p>
      </IonToolbar>
      <MainMenu hideLogo={true} />
      <IonPage id="main-content">
        {/* {!isWideScreen && <MainHeader />} */}
        <IonContent className="text-justified" scrollY={true}>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          {!currentAccount && <MainPageContent ipAddr={ip} />}
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
