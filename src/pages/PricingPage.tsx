import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonMenu,
  IonMenuButton,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import PricingTable from "../components/utils/PricingTable";
import { useCurrentUser } from "../hooks/useCurrentUser";

const PricingPage: React.FC = () => {
  const { isWideScreen } = useCurrentUser();

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        {!isWideScreen && (
          <IonHeader className="bg-inherit shadow-none">
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
              </IonButtons>
              <IonTitle>Pricing</IonTitle>
            </IonToolbar>
          </IonHeader>
        )}
        <IonContent>
          <PricingTable />
        </IonContent>
      </IonPage>
    </>
  );
};

export default PricingPage;
