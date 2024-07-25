import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import MainMenu, { hideMenu } from "../../components/main_menu/MainMenu";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import { Board, getBoards } from "../../data/boards";
import { addCircleOutline, albumsOutline, gridOutline } from "ionicons/icons";
import BoardGrid from "../../components/boards/BoardGrid";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { ChildBoard } from "../../data/child_boards";

interface BoardsScreenProps {
  gridType: string;
}

const BoardsScreen: React.FC<BoardsScreenProps> = ({ gridType }) => {
  const { currentAccount, currentUser, isWideScreen } = useCurrentUser();
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

  const handleSegmentChange = (boardType: string) => {
    setSegmentType(boardType);
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
    return;
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none px-2">
          <IonToolbar>
            <IonButtons slot="start">
              {!isWideScreen && <IonMenuButton></IonMenuButton>}
            </IonButtons>
            <IonTitle>{pageTitle}</IonTitle>
            <IonButtons slot="end">
              <IonButton
                routerLink="/boards/new"
                className="mr-1 text-xs md:text-md lg:text-lg"
              >
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
          <div className="bg-inherit shadow-none w-full md:w-2/3 lg:w-1/2 mx-auto my-3">
            {currentUser && (
              <IonButtons className="flex justify-between items-center">
                <IonButton
                  onClick={() => handleSegmentChange("user")}
                  className="mr-1 text-xs md:text-md lg:text-lg"
                >
                  <IonIcon icon={albumsOutline} />
                  <IonLabel className="text-md lg:text-lg mx-1">
                    Boards
                  </IonLabel>
                </IonButton>
                <IonButton
                  onClick={() => handleSegmentChange("preset")}
                  className="mr-1 text-xs md:text-md lg:text-lg"
                >
                  <IonIcon icon={gridOutline} />
                  <IonLabel className="text-md lg:text-lg mx-1">
                    Preset
                  </IonLabel>
                </IonButton>
                {/* <IonButton
                  routerLink="/boards/new"
                  className="mr-1 text-xs md:text-md lg:text-lg"
                >
                  <IonLabel className="mr-2 text-md lg:text-lg">New</IonLabel>
                  <IonIcon icon={addCircleOutline} className="block text-xl" />
                </IonButton> */}
              </IonButtons>
            )}
          </div>
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
