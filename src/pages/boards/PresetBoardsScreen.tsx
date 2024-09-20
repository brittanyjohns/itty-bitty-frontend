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
import { Board, getBoards, getPresetBoards } from "../../data/boards";
import {
  addCircleOutline,
  imagesOutline,
  infiniteOutline,
  personOutline,
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
import { render } from "@testing-library/react";
import { set } from "d3";

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
    console.log("Fetching boards...", searchInput, page, filter);
    const fetchedBoards = await getPresetBoards(searchInput, page, filter);
    setFetchBoardPayload(fetchedBoards);
  };

  useEffect(() => {
    const presetBoards = fetchBoardPayload["predefined_boards"];
    const popularBoards = fetchBoardPayload["popular_boards"];
    const categories = fetchBoardPayload["categories"];
    const allCategories = fetchBoardPayload["all_categories"];
    setAllCategories(allCategories);
    setCategories(categories);

    setPresetBoards(presetBoards);
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
  }, [filter]);

  useEffect(() => {
    fetchBoards();
  }, [searchInput, page]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      fetchBoards();
      e.detail.complete();
    }, 3000);
  };

  const clearSearchFields = () => {
    setSelectedCategory("");
    setSearchInput("");
    fetchBoards();
    console.log("Clearing search fields");
  };

  useEffect(() => {
    if (segmentType === "featured") {
      setPageTitle("Your Boards");
    } else if (segmentType === "preset") {
      setPageTitle("Preset Boards");
      setCategories(allCategories);
    }
    setFilter(segmentType);
  }, [segmentType]);

  const renderBoardGrid = () => {
    return (
      <>
        <h1 className="text-center text-2xl font-bold mt-4">{segmentType}</h1>
        {presetBoards && <BoardGrid boards={presetBoards} noBoardsMsg={""} />}
      </>
    );
  };

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
    console.log("Segment selected: ", segment);
    setSegmentType(segment);
    setPage(1); // Reset to first page on new segment
  };

  const categoryDropdown = () => {
    return (
      <div className="flex items-center justify-center">
        <IonSelect
          onIonChange={handleCategoryChange}
          placeholder="Select Category"
          value={selectedCategory}
          fill="outline"
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
        <div>
          <div className="w-full md:w-34 lg:w-2/3 mx-auto grid grid-cols-1 md:grid-cols-2 gap-1 mt-6">
            <div className="">
              <IonSearchbar
                debounce={1000}
                onIonInput={handleSearchInput}
                onIonClear={() => clearInput()}
                animated={true}
                value={searchInput}
                placeholder="Search boards"
              ></IonSearchbar>
            </div>
            <div className="w-1/2 mx-auto">{categoryDropdown()}</div>
          </div>
        </div>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          {allCategories && (
            <div className="flex justify-center items-center mt-4">
              <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
                <IonSegmentButton value="all">
                  <IonIcon icon={infiniteOutline} />
                  <IonLabel>All</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="featured">
                  <IonIcon icon={ribbonOutline} />
                  <IonLabel>Featured</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="popular">
                  <IonIcon icon={podiumOutline} />
                  <IonLabel>Popular</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>
          )}

          {presetBoards && renderBoardGrid()}
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default PresetBoardsScreen;
