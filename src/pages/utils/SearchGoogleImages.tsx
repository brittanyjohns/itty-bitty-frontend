import React from "react";
import { IonContent, IonPage, useIonViewWillLeave } from "@ionic/react";
import MainMenu from "../../components/main_menu/MainMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ImageSearchComponent from "../../components/admin/ImageSearchComponent";
import Tabs from "../../components/utils/Tabs";

const SearchGoogleImages: React.FC = () => {
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();

  return (
    <>
      <MainMenu
        pageTitle="Search Google Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Search Google Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Search Google Images"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent>
          <div className="ion-padding">
            <h1>Search Google Images</h1>
            <p className="ion-padding-top text-md">
              Search for images on Google and save them to your account
            </p>
            <p className="ion-padding-bottom text-sm">
              Click on an image to save it.
            </p>
          </div>

          <div className="ion-padding">
            <ImageSearchComponent />
          </div>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default SearchGoogleImages;
