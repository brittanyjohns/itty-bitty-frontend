import { IonContent, IonPage, useIonViewDidLeave } from "@ionic/react";
import React, { useEffect, useRef } from "react";
import MainMenu from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import Tabs from "../../components/utils/Tabs";
import BoardGroupForm from "../../components/board_groups/BoardGroupForm";

const NewBoard: React.FC = () => {
  const { currentUser, currentAccount, isWideScreen } = useCurrentUser();

  return (
    <>
      <MainMenu
        pageTitle="New Board Group"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="New Board Group"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="New Board Group"
          isWideScreen={isWideScreen}
          startLink="/board-groups"
        />
        <IonContent fullscreen scrollY={true}>
          <div className="ion-padding">
            <h1>Create a New Board Group</h1>
            <BoardGroupForm />
          </div>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default NewBoard;
