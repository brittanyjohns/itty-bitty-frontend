import {
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
import BoardList from "../components/BoardList";
import MainMenu, { hideMenu } from "../components/MainMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Tabs from "../components/Tabs";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getBoards } from "../data/boards";
import {
  addCircleOutline,
  albumsOutline,
  gridOutline,
  imagesOutline,
  peopleCircleOutline,
  walkOutline,
} from "ionicons/icons";
const BoardsScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const history = useHistory();
  const [boards, setBoards] = useState([]);
  const [presetBoards, setPresetBoards] = useState([]);
  const [userBoards, setUserBoards] = useState([]);
  const [scenarioBoards, setScenarioBoards] = useState([]);
  const [sharedBoards, setSharedBoards] = useState([]);
  const [segmentType, setSegmentType] = useState("user");
  const [pageTitle, setPageTitle] = useState("Your Boards");

  const fetchBoards = async () => {
    const fetchedBoards = await getBoards();
    if (!fetchedBoards) {
      console.error("Error fetching boards");
      return;
    }
    setUserBoards(fetchedBoards["boards"]);
    setScenarioBoards(fetchedBoards["scenarios"]);
    setPresetBoards(fetchedBoards["predefined_boards"]);
    setSharedBoards(fetchedBoards["shared_boards"]);
    console.log("Fetched boards", fetchedBoards);
    setBoards(fetchedBoards["boards"]);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    setSegmentType(e.detail.value);
  };

  useIonViewWillEnter(() => {
    hideMenu();
  });

  useEffect(() => {
    if (segmentType === "user") {
      setBoards(userBoards);
      setPageTitle("Your Boards");
    }
    if (segmentType === "preset") {
      setBoards(presetBoards);
      setPageTitle("Preset Boards");
    }
    if (segmentType === "scenario") {
      setBoards(scenarioBoards);
      setPageTitle("Scenario Boards");
    }
    if (segmentType === "shared") {
      setBoards(sharedBoards);
      setPageTitle("Shared Boards");
    }
  }, [segmentType]);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Boards</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/boards/new">
                <IonIcon icon={addCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit"
            >
              <IonSegmentButton value="user">
                <IonLabel className="text-xl">
                  <IonIcon icon={albumsOutline} />
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="preset">
                <IonLabel className="text-xl">
                  <IonIcon icon={gridOutline} />
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="scenario">
                <IonLabel className="text-2xl mt-3 mb-2">
                  <IonIcon icon={walkOutline} />
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="shared">
                <IonLabel className="text-xl">
                  <IonIcon
                    icon={peopleCircleOutline}
                    className="text-2xl mt-3 mb-2"
                  />
                </IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <h2 className="mb-3 text-2xl font-bold">{pageTitle}</h2>
          <BoardList boards={boards} />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default BoardsScreen;
