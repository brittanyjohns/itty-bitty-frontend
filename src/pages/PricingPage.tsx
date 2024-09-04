import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import PricingTable from "../components/utils/PricingTable";
import { useCurrentUser } from "../hooks/useCurrentUser";
import MainHeader from "./MainHeader";
import StaticMenu from "../components/main_menu/StaticMenu";
import Footer from "../components/utils/Footer";

const PricingPage: React.FC = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();

  return (
    <>
      <MainMenu
        pageTitle="Pricing"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Pricing"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Pricing"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="flex flex-col items-center p-6">
          <div className="relative lower-fixed-bg">
            <PricingTable />
          </div>
          <Footer />
        </IonContent>
      </IonPage>
    </>
  );
};

export default PricingPage;
