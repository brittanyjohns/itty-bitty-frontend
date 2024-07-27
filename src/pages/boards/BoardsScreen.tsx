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
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import MainMenu, { hideMenu } from "../../components/main_menu/MainMenu";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import { Board, getBoards } from "../../data/boards";
import {
  addCircleOutline,
  albumsOutline,
  gridOutline,
  imagesOutline,
  personOutline,
} from "ionicons/icons";
import BoardGrid from "../../components/boards/BoardGrid";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { ChildBoard } from "../../data/child_boards";
import { set } from "react-hook-form";

interface BoardsScreenProps {
  gridType: string;
}
import "./ViewBoard.css";

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
      console.log("Set preset boards: ", fetchedBoards["predefined_boards"]);
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

  const handleSegmentChange = (event: CustomEvent) => {
    const segmentValue = event.detail.value;
    console.log("Segment value: ", segmentValue);
    setSegmentType(segmentValue);
    // setPageTitle(segmentValue === "user" ? "Your Boards" : "Preset Boards");
    if (segmentType === "user") {
      setBoards(userBoards);
      setPageTitle("Your Boards");
    } else if (segmentType === "preset") {
      setBoards(presetBoards);
      setPageTitle("Preset Boards");
    }
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
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar className="bg-inherit shadow-none text-center">
            <IonButtons slot="start">
              <IonButton>
                <IonMenuButton></IonMenuButton>
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton routerLink="/boards/new">
                <IonIcon
                  slot="icon-only"
                  ios={addCircleOutline}
                  md={addCircleOutline}
                ></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle>{pageTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
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
                <IonSegmentButton value="preset">
                  <IonLabel className="text-md lg:text-lg">
                    Preset Boards
                  </IonLabel>
                  <IonIcon icon={imagesOutline} size="small" />
                </IonSegmentButton>
                <IonSegmentButton value="user">
                  <IonLabel className="text-md lg:text-lg">
                    Your Boards
                  </IonLabel>
                  <IonIcon icon={personOutline} size="small" />
                </IonSegmentButton>
              </IonSegment>
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
