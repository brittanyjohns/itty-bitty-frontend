import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import MainHeader from "./MainHeader";
import StaticMenu from "../components/main_menu/StaticMenu";
import UserHome from "../components/utils/UserHome";
import { useEffect, useState } from "react";
const Demo: React.FC = () => {
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();
  const [ip, setIP] = useState("");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setIP(data.ip);
      });
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu
        pageTitle="Welcome"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Welcome"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Welcome"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div>
            {currentUser && (
              <UserHome
                userName={currentUser?.name || currentUser.email}
                trialDaysLeft={currentUser?.trial_days_left}
                freeAccount={currentUser?.plan_type === "free"}
                tokens={currentUser?.tokens ? currentUser.tokens : 0}
              />
            )}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Demo;
