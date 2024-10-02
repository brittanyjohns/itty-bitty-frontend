import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import SideMenu from "../components/main_menu/SideMenu";
import PricingTable from "../components/utils/PricingTable";
import { useCurrentUser } from "../hooks/useCurrentUser";
import MainHeader from "./MainHeader";
import StaticMenu from "../components/main_menu/StaticMenu";
import Footer from "../components/utils/Footer";

const PricingPage: React.FC = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();

  return (
    <>
      <SideMenu
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
            <div className="text-center bg-gray-900 p-4 font-sanserif text-center">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Find the plan that's right for you.
              </h1>
              <p className="mt-4 text-sm md:text-xl text-white">
                Join the growing community of users who enhance their
                communication with SpeakAnyWay.
              </p>
            </div>

            <div className="bg-white bg-opacity-50 p-4 py-9 font-sanserif text-center">
              <PricingTable />
            </div>
          </div>
          <Footer />
        </IonContent>
      </IonPage>
    </>
  );
};

export default PricingPage;
