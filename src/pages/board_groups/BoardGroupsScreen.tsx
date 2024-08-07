import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidEnter,
} from "@ionic/react";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import { BoardGroup, getBoardGroups } from "../../data/board_groups";
import BoardGroupGrid from "../../components/board_groups/BoardGroupGrid";
import { useCurrentUser } from "../../hooks/useCurrentUser";

import "./ViewBoard.css";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";

const BoardGroupsScreen: React.FC = () => {
  const { currentAccount, currentUser, isWideScreen } = useCurrentUser();
  const [boardGroups, setBoardGroups] = useState<BoardGroup[]>([]);

  const [pageTitle, setPageTitle] = useState("Your Board Groups");

  const fetchBoardGroups = async () => {
    const fetchedBoardGroups = await getBoardGroups();
    console.log("SCREEN fetchedBoardGroups: ", fetchedBoardGroups);
    setBoardGroups(fetchedBoardGroups);
  };

  useEffect(() => {
    fetchBoardGroups();
  }, []);

  useIonViewDidEnter(() => {
    console.log("View did enter");
    fetchBoardGroups();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      fetchBoardGroups();
      e.detail.complete();
    }, 3000);
  };

  // const renderBoardGroupGrid = (boardGroupsToSet: BoardGroup[]) => {
  //   if (boardGroupsToSet.length > 0) {
  //     return <BoardGroupGrid boardGroups={boardGroupsToSet} />;
  //   }
  //   return;
  // };

  return (
    <>
      <MainMenu
        pageTitle="BoardGroups"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="BoardGroups"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="BoardGroups"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
          endLink="/board-groups/new"
        />
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <h1 className="text-2xl font-bold text-center">{pageTitle}</h1>
          <BoardGroupGrid boardGroups={boardGroups} />
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default BoardGroupsScreen;
