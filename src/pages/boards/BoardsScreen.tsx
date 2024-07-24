import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import MainMenu, { hideMenu } from "../../components/main_menu/MainMenu";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import { Board, getBoards } from "../../data/boards";
import { addCircleOutline, albumsOutline, gridOutline } from "ionicons/icons";
import BoardGrid from "../../components/boards/BoardGrid";
import { ChildAccount } from "../../data/child_accounts";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { User } from "../../data/users";
import { ChildBoard } from "../../data/child_boards";

interface BoardsScreenProps {
  gridType: string;
}

const BoardsScreen: React.FC<BoardsScreenProps> = ({ gridType }) => {
  const { currentAccount, currentUser } = useCurrentUser();
  const [boards, setBoards] = useState<Board[]>([]);
  const [childBoards, setChildBoards] = useState<ChildBoard[]>([]);
  const [presetBoards, setPresetBoards] = useState<Board[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [scenarioBoards, setScenarioBoards] = useState<Board[]>([]);
  const [segmentType, setSegmentType] = useState("user");
  const [pageTitle, setPageTitle] = useState("Your Boards");

  const fetchBoards = async () => {
    if (gridType === "child" && currentAccount) {
      console.log("Fetching child boards", gridType);
      const fetchedBoards = currentAccount.boards; // Replace with actual fetching logic
      if (fetchedBoards) {
        setChildBoards(fetchedBoards);
      } else {
        console.error("No child boards found");
      }
    } else if (gridType === "user" && currentUser) {
      console.log("Fetching user boards", gridType);
      const fetchedBoards = await getBoards();
      setUserBoards(fetchedBoards["boards"]);
      setScenarioBoards(fetchedBoards["scenarios"]);
      setPresetBoards(fetchedBoards["predefined_boards"]);
      setBoards(fetchedBoards["boards"]);
    }
  };

  useEffect(() => {
    console.log("Use effect -gridType: ", gridType);
    fetchBoards();
  }, [gridType, currentAccount, currentUser]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      fetchBoards();
      e.detail.complete();
    }, 3000);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    setSegmentType(e.detail.value);
  };

  useEffect(() => {
    if (segmentType === "user") {
      setBoards(userBoards);
      setPageTitle("Your Boards");
    } else if (segmentType === "preset") {
      setBoards(presetBoards);
      setPageTitle("Preset Boards");
    }
  }, [segmentType, userBoards, presetBoards]);

  const renderBoardGrid = (
    gridType: string,
    boardsToSet: Board[] | ChildBoard[]
  ) => {
    console.log("Rendering board grid: ", boardsToSet);
    if (boardsToSet.length > 0) {
      return <BoardGrid gridType={gridType} boards={boardsToSet} />;
    }
    return <p>No boards available</p>;
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonMenuButton></IonMenuButton>
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="bg-inherit"
            >
              <IonSegmentButton value="user">
                <IonLabel className="text-md lg:text-lg">Your Boards</IonLabel>
                <IonIcon icon={albumsOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="preset">
                <IonLabel className="text-md lg:text-lg">
                  Preset Boards
                </IonLabel>
                <IonIcon icon={gridOutline} />
              </IonSegmentButton>
            </IonSegment>
            <IonButtons className="mr-4" slot="end">
              <IonButton routerLink="/boards/new" className="text-wrap mx-auto">
                <IonLabel className="mr-2 text-md lg:text-lg">New</IonLabel>
                <IonIcon icon={addCircleOutline} className="block text-xl" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          {segmentType === "user" && renderBoardGrid("user", boards)}
          {segmentType === "preset" && renderBoardGrid("preset", presetBoards)}
          {gridType === "child" && renderBoardGrid("child", childBoards)}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default BoardsScreen;
