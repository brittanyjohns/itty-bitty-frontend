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
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import {
  BoardGroup,
  getBoardGroups,
  getPresetBoardGroups,
} from "../../data/board_groups";
import {
  accessibilityOutline,
  addCircleOutline,
  imagesOutline,
  infiniteOutline,
  personOutline,
  podiumOutline,
  ribbon,
  ribbonOutline,
  toggle,
} from "ionicons/icons";
import BoardGroupGrid from "../../components/board_groups/BoardGroupGrid";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface PresetBoardGroupsScreenProps {
  initialSegmentType: string;
}
import SideMenu from "../../components/main_menu/SideMenu";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
const PresetBoardGroupsScreen: React.FC<
  PresetBoardGroupsScreenProps
> = ({}) => {
  const { currentAccount, currentUser, isWideScreen } = useCurrentUser();
  const [presetBoardGroups, setPresetBoardGroups] = useState<BoardGroup[]>([]);
  const [welcomeGroup, setWelcomeGroup] = useState<BoardGroup | null>(null);
  const [segmentType, setSegmentType] = useState("welcome");
  const [pageTitle, setPageTitle] = useState("Preset BoardGroups");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [fetchBoardGroupPayload, setFetchBoardGroupPayload] = useState<any>({});

  const fetchBoardGroups = async () => {
    console.log("Fetching board_groups...", searchInput, page, filter);
    const fetchedBoardGroups = await getPresetBoardGroups(
      searchInput,
      page,
      filter
    );
    console.log("Fetched board_groups: ", fetchedBoardGroups);
    setFetchBoardGroupPayload(fetchedBoardGroups);
  };

  useEffect(() => {
    const presetBoardGroups = fetchBoardGroupPayload["predefined_board_groups"];
    const welcomeGroup = fetchBoardGroupPayload["welcome_group"];
    setWelcomeGroup(welcomeGroup);
    setPresetBoardGroups(presetBoardGroups);
  }, [fetchBoardGroupPayload]);

  const handleSearchInput = async (event: CustomEvent) => {
    const query = event.detail.value.toLowerCase();
    setSearchInput(query);
    if (query === "" && welcomeGroup) {
      setSegmentType("welcome");
      setPageTitle("WELCOME TO SpeakAnyWay!");
      setPresetBoardGroups([welcomeGroup]);
    } else {
      console.log("Setting segment type to all");
      setSegmentType("all");
    }
    setPage(1); // Reset to first page on new search
  };

  const clearInput = () => {
    setSearchInput("");
    setPage(1); // Reset to first page on new search
  };

  useEffect(() => {
    fetchBoardGroups();
  }, []);

  useEffect(() => {
    fetchBoardGroups();
  }, [searchInput, page, filter]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      fetchBoardGroups();
      e.detail.complete();
    }, 3000);
  };

  useEffect(() => {
    if (segmentType === "welcome") {
      setPageTitle("WELCOME TO SpeakAnyWay!");
      if (welcomeGroup) {
        setPresetBoardGroups([welcomeGroup]);
        setSearchInput("");
      }
    } else if (segmentType === "preset") {
      setPageTitle("Preset BoardGroups");
    } else if (segmentType === "popular") {
      setPageTitle("Popular BoardGroups");
    } else {
      setPageTitle("All BoardGroups");
    }

    setFilter(segmentType);
  }, [segmentType]);

  const handleSegmentChange = (e: any) => {
    const segment = e.detail.value;
    console.log("Segment selected: ", segment);
    setSegmentType(segment);
    setPage(1); // Reset to first page on new segment
  };

  return (
    <>
      <SideMenu
        pageTitle={pageTitle}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle={pageTitle}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle={pageTitle}
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
          endLink="/board_groups/new"
        />
        <div className="w-full mx-auto">
          <div className="flex justify-center items-center my-3">
            <IonSearchbar
              debounce={1000}
              onIonInput={handleSearchInput}
              onIonClear={() => clearInput()}
              animated={true}
              value={searchInput}
              placeholder="Search board_groups"
            ></IonSearchbar>
          </div>
        </div>
        <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
          <IonSegmentButton value="all">
            <IonIcon icon={infiniteOutline} />
            <IonLabel>All</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="welcome">
            <IonIcon icon={accessibilityOutline} />
            <IonLabel>Welcome</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="popular">
            <IonIcon icon={ribbonOutline} />
            <IonLabel>Featured</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          {segmentType != "welcome" && presetBoardGroups && (
            <BoardGroupGrid boardGroups={presetBoardGroups} />
          )}
          {segmentType === "welcome" && welcomeGroup && (
            <>
              <h1 className="text-2xl font-bold text-center mt-4">
                WELCOME TO SpeakAnyWay!
              </h1>
              <BoardGroupGrid boardGroups={[welcomeGroup]} />
            </>
          )}
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default PresetBoardGroupsScreen;
