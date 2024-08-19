import {
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
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
import { imagesOutline, personOutline } from "ionicons/icons";

const BoardGroupsScreen: React.FC = () => {
  const { currentAccount, currentUser, isWideScreen } = useCurrentUser();
  const [boardGroups, setBoardGroups] = useState<BoardGroup[]>([]);
  const [presetBoardGroups, setPresetBoardGroups] = useState<BoardGroup[]>([]);
  const [userBoardGroups, setUserBoardGroups] = useState<BoardGroup[]>([]);
  const [segmentType, setSegmentType] = useState("predefined");

  const fetchBoardGroups = async () => {
    const fetchedBoardGroups = await getBoardGroups();
    setPresetBoardGroups(fetchedBoardGroups["predefined"]);
    setUserBoardGroups(fetchedBoardGroups["user"]);
    setBoardGroups(presetBoardGroups);
  };

  useEffect(() => {
    fetchBoardGroups();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      fetchBoardGroups();
      e.detail.complete();
    }, 2000); //  2 seconds
  };

  const handleSegmentChange = (event: CustomEvent) => {
    const segmentValue = event.detail.value;
    setSegmentType(segmentValue);
    if (segmentType === "user") {
      setBoardGroups(userBoardGroups);
    } else if (segmentType === "predefined") {
      setBoardGroups(presetBoardGroups);
    }
  };

  return (
    <>
      <MainMenu
        pageTitle="Board Groups"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Board Groups"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Board Groups"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
          endLink="/board-groups/new"
        />
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="bg-inherit shadow-none w-full md:w-2/3 lg:w-1/2 mx-auto my-3">
            {currentUser && (
              <IonSegment
                value={segmentType}
                onIonChange={handleSegmentChange}
                className="w-full bg-inherit"
              >
                <IonSegmentButton value="predefined">
                  <IonLabel className="text-md lg:text-lg">Preset</IonLabel>
                  <IonIcon icon={imagesOutline} size="small" />
                </IonSegmentButton>
                <IonSegmentButton value="user">
                  <IonLabel className="text-md lg:text-lg">
                    Your Groups
                  </IonLabel>
                  <IonIcon icon={personOutline} size="small" />
                </IonSegmentButton>
              </IonSegment>
            )}
          </div>

          {segmentType === "user" && (
            <BoardGroupGrid boardGroups={userBoardGroups} />
          )}
          {segmentType === "predefined" && (
            <BoardGroupGrid boardGroups={presetBoardGroups} />
          )}
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default BoardGroupsScreen;
