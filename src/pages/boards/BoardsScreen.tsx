import {
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
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import { Board, getBoards } from "../../data/boards";
import {
  addCircleOutline,
  imagesOutline,
  personOutline,
  toggle,
} from "ionicons/icons";
import BoardGrid from "../../components/boards/BoardGrid";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { ChildBoard } from "../../data/child_boards";

interface BoardsScreenProps {
  gridType: string;
}
import "./ViewBoard.css";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";

const BoardsScreen: React.FC<BoardsScreenProps> = ({ gridType }) => {
  const { currentAccount, currentUser, isWideScreen } = useCurrentUser();
  const [boards, setBoards] = useState<Board[]>([]);
  const [childBoards, setChildBoards] = useState<ChildBoard[]>([]);
  const [presetBoards, setPresetBoards] = useState<Board[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [scenarioBoards, setScenarioBoards] = useState<Board[]>([]);
  const [segmentType, setSegmentType] = useState("preset");
  const [pageTitle, setPageTitle] = useState("Your Boards");

  const fetchBoards = async () => {
    const fetchedBoards = await getBoards();
    if (gridType === "child") {
      if (!currentAccount) {
        console.error("No current account found");
        return;
      }
      const fetchedBoards = currentAccount.boards; // Replace with actual fetching logic
      if (fetchedBoards) {
        setChildBoards(fetchedBoards);
      } else {
        console.error("No child boards found");
      }
    } else if (gridType === "user") {
      setUserBoards(fetchedBoards["boards"]);
      setScenarioBoards(fetchedBoards["scenarios"]);
      setPresetBoards(fetchedBoards["predefined_boards"]);
      setBoards(fetchedBoards["boards"]);
    }
  };

  useIonViewWillEnter(() => {
    fetchBoards();
    toggle(segmentType);
  });

  useIonViewWillLeave(() => {
    setSegmentType("preset");
    toggle("preset");
  });

  useEffect(() => {
    fetchBoards();
    toggle(segmentType);
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      fetchBoards();
      e.detail.complete();
    }, 3000);
  };

  const handleSegmentChange = (event: CustomEvent) => {
    const segmentValue = event.detail.value;
    setSegmentType(segmentValue);
    // setPageTitle(segmentValue === "user" ? "Your Boards" : "Preset Boards");
    toggle(segmentValue);
  };

  const toggle = (segmentType: string) => {
    if (segmentType === "user") {
      setBoards(userBoards);
      setPageTitle("Your Boards");
    } else if (segmentType === "preset") {
      setBoards(presetBoards);
      setPageTitle("Preset Boards");
    }
  };

  useEffect(() => {
    toggle(segmentType);
  }, [segmentType, userBoards, presetBoards]);

  const renderBoardGrid = (gridType: string, boardsToSet: Board[]) => {
    if (gridType === "preset" && presetBoards.length === 0) {
      return (
        <>
          <div className="flex flex-col items-center justify-center my-5">
            <p className="text-xl font-semibold">No preset boards found.</p>
          </div>
        </>
      );
    }

    if (boardsToSet.length > 0) {
      return <BoardGrid gridType={gridType} boards={boardsToSet} />;
    } else if (boardsToSet.length === 0 && gridType === "user") {
      return (
        <>
          <div className="flex flex-col items-center justify-center my-5">
            <p className="text-xl font-semibold">
              You have no boards yet. Create one now!
            </p>
            <IonButton
              routerLink="/boards/new"
              className="mt-3"
              fill="solid"
              color="primary"
            >
              <IonIcon icon={addCircleOutline} slot="start" />
              Create Board
            </IonButton>
          </div>
        </>
      );
    }
  };
  return (
    <>
      <MainMenu
        pageTitle="Boards"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Boards"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Boards"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
          endLink="/boards/new"
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
                <IonSegmentButton value="preset">
                  <IonLabel className="text-md lg:text-lg">Preset</IonLabel>
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
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default BoardsScreen;
