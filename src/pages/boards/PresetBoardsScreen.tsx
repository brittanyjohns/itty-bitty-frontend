import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonViewWillLeave,
} from "@ionic/react";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import { Board, getBoards, getPresetBoards } from "../../data/boards";
import {
  infiniteOutline,
  podiumOutline,
  ribbon,
  ribbonOutline,
  toggle,
} from "ionicons/icons";
import BoardGrid from "../../components/boards/BoardGrid";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface PresetBoardsScreenProps {
  initialSegmentType: string;
}
import SideMenu from "../../components/main_menu/SideMenu";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";

const PresetBoardsScreen: React.FC<PresetBoardsScreenProps> = ({
  initialSegmentType,
}) => {
  const { currentAccount, currentUser, isWideScreen } = useCurrentUser();
  const [presetBoards, setPresetBoards] = useState<Board[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [segmentType, setSegmentType] = useState(initialSegmentType);
  const [pageTitle, setPageTitle] = useState("Preset Boards");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [fetchBoardPayload, setFetchBoardPayload] = useState<any>({});

  const fetchBoards = async () => {
    const fetchedBoards = await getPresetBoards(searchInput, page, filter);
    setFetchBoardPayload(fetchedBoards);
  };

  useEffect(() => {
    const presetBoards = fetchBoardPayload["predefined_boards"];
    const welcomeBoards = fetchBoardPayload["welcome_boards"];
    const categories = fetchBoardPayload["categories"];
    const allCategories = fetchBoardPayload["all_categories"];

    setAllCategories(allCategories);
    setCategories(categories);

    if (segmentType === "welcome") {
      setPresetBoards(welcomeBoards);
    } else {
      setPresetBoards(presetBoards);
    }
  }, [fetchBoardPayload]);

  const handleSearchInput = async (event: CustomEvent) => {
    const query = event.detail.value.toLowerCase();
    setSearchInput(query);
    setPage(1); // Reset to first page on new search
  };

  const clearInput = () => {
    setSearchInput("");
    setPage(1); // Reset to first page on new search
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [searchInput, page, filter]);

  useEffect(() => {
    if (searchInput !== "") {
      setSegmentType("all");
    } else {
      setFilter("");
    }
  }, [searchInput]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      fetchBoards();
      e.detail.complete();
    }, 3000);
  };

  const clearSearchFields = () => {
    setSelectedCategory("");
    setSearchInput("");
    setSegmentType("all");
    fetchBoards();
  };

  useEffect(() => {
    if (segmentType === "welcome") {
      setPageTitle("Welcome to SpeakAnyWay!");
    } else if (segmentType === "preset") {
      setPageTitle("Preset Boards");
    } else if (segmentType === "featured") {
      setPageTitle("Featured Boards");
    } else {
      setPageTitle("All Boards");
    }

    setFilter(segmentType);
  }, [segmentType]);

  const renderBoardGrid = () => {
    return (
      <>
        {/* <h1 className="text-center text-2xl font-bold mt-4">{segmentType}</h1> */}
        {presetBoards && (
          <BoardGrid boards={presetBoards} noBoardsMsg={""} goToSpeak={true} />
        )}
      </>
    );
  };

  useIonViewWillLeave(() => {
    setSegmentType("welcome");
    setSearchInput("");
  }, []);

  const handleCategoryChange = (e: any) => {
    const category = e.target.value;
    setSelectedCategory(category);
    console.log("Category selected: ", category);
    if (category === "") {
      fetchBoards();
    } else {
      const filteredPresetBoards = presetBoards.filter(
        (board) => board.category === category
      );
      setPresetBoards(filteredPresetBoards);
    }
  };

  const handleSegmentChange = (e: any) => {
    const segment = e.detail.value;
    setSegmentType(segment);
    setPage(1); // Reset to first page on new segment
  };

  const categoryDropdown = () => {
    return (
      <div className="w-full md:w-1/2 mx-auto flex justify-between items-center px-2 border-2 rounded-lg">
        <IonSelect
          onIonChange={handleCategoryChange}
          placeholder="Select Category"
          value={selectedCategory}
          // fill="outline"
        >
          <IonSelectOption value="">All Categories</IonSelectOption>
          {categories &&
            categories.map((category, i) => (
              <IonSelectOption key={i} value={category}>
                {category}
              </IonSelectOption>
            ))}
        </IonSelect>
        <IonButton fill="clear" size="small" onClick={clearSearchFields}>
          Clear
        </IonButton>
      </div>
    );
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
          endLink="/boards/new"
        />
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <div className="w-5/6 md:w-3/4 mx-auto">
              <div className="flex justify-center items-center my-3">
                <IonSearchbar
                  debounce={1000}
                  onIonInput={handleSearchInput}
                  onIonClear={clearInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchBoards();
                    }
                  }}
                  animated={true}
                  value={searchInput}
                  placeholder="Search preset boards"
                ></IonSearchbar>
              </div>
              {categoryDropdown()}
            </div>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {allCategories && (
            <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
              <IonSegmentButton value="all">
                <IonIcon icon={infiniteOutline} />
                <IonLabel>All</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="welcome">
                <IonIcon icon={ribbonOutline} />
                <IonLabel>Welcome</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="featured">
                <IonIcon icon={podiumOutline} />
                <IonLabel>Featured</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          )}
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          {presetBoards && renderBoardGrid()}
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default PresetBoardsScreen;
