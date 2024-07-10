import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import PricingTable from "../components/utils/PricingTable";

const PricingPage: React.FC = () => {
  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Pricing</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <PricingTable />
        </IonContent>
      </IonPage>
    </>
  );
};

export default PricingPage;
