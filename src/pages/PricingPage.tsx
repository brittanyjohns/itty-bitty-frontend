import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import { getImageUrl } from "../data/utils";
import { useHistory } from "react-router";
import PriceComparisonTable from "../components/utils/PricingTable";
import PricingTable from "../components/utils/PricingTable";

const PricingPage: React.FC = () => {
  const history = useHistory();
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
