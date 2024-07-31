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
import MainHeader from "./MainHeader";

const PricingPage: React.FC = () => {
  const { isWideScreen } = useCurrentUser();

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <MainHeader />

        <IonContent>
          <PricingTable />
        </IonContent>
      </IonPage>
    </>
  );
};

export default PricingPage;
