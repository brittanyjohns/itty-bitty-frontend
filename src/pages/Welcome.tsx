import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import SideMenu from "../components/main_menu/SideMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import MainHeader from "./MainHeader";
import StaticMenu from "../components/main_menu/StaticMenu";
import UserHome from "../components/utils/UserHome";
import { useEffect, useState } from "react";
import CookiesConsent from "../components/utils/CookieConsent";
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

  const [showCookiesConsent, setShowCookiesConsent] = useState(false);

  useEffect(() => {
    const cookiesConsent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookies_consent=true"));

    if (!cookiesConsent) {
      console.log("No cookies consent found");
      setShowCookiesConsent(true);
    }
  }, []);

  return (
    <>
      <SideMenu
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
        <IonContent className="">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="bg-inherit shadow-none w-full md:w-2/3 lg:w-1/2 mx-auto">
            {currentUser && (
              <UserHome
                userName={currentUser?.name || currentUser.email}
                trialDaysLeft={currentUser?.trial_days_left}
                freeAccount={currentUser?.plan_type === "free"}
                tokens={currentUser?.tokens ? currentUser.tokens : 0}
              />
            )}
          </div>
          {showCookiesConsent && <CookiesConsent />}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Demo;
