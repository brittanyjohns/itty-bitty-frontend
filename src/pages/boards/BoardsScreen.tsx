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
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";

const BoardsScreen: React.FC<BoardsScreenProps> = ({ gridType }) => {
  const { currentAccount, currentUser, isWideScreen } = useCurrentUser();
  const [boards, setBoards] = useState<Board[]>([]);
  const [childBoards, setChildBoards] = useState<any[]>([]);
  const [presetBoards, setPresetBoards] = useState<Board[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [segmentType, setSegmentType] = useState("user");
  const [pageTitle, setPageTitle] = useState("Your Boards");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [onlyUserImages, setOnlyUserImages] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchBoards = async () => {
    const fetchedBoards = await getBoards(searchInput, page, onlyUserImages);
    if (gridType === "child") {
      if (!currentAccount) {
        console.error("No current account found");
        return;
      }
    } else if (gridType === "user") {
      setUserBoards(fetchedBoards["boards"]);
      setPresetBoards(fetchedBoards["predefined_boards"]);
      setBoards(fetchedBoards["boards"]);
      setCategories(fetchedBoards["categories"]);
    }
  };

  const handleSearchInput = async (event: CustomEvent) => {
    const query = event.detail.value.toLowerCase();
    setSearchInput(query);
    setPage(1); // Reset to first page on new search
  };

  const clearInput = () => {
    setSearchInput("");
    setPage(1); // Reset to first page on new search
  };

  useIonViewWillEnter(() => {
    fetchBoards();
    toggle(segmentType);
  }, []);

  useEffect(() => {
    fetchBoards();
    toggle(segmentType);
  }, []);

  useIonViewWillLeave(() => {
    setSegmentType("user");
    toggle("user");
  });

  useEffect(() => {
    fetchBoards();
    toggle(segmentType);
  }, [searchInput, page]);

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

  const handleCategoryChange = (e: any) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === "") {
      setBoards(userBoards);
    } else {
      const filteredBoards = userBoards.filter(
        (board) => board.category === category
      );
      setBoards(filteredBoards);
    }
  };

  const categoryDropdown = () => {
    return (
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
    );
  };

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

    if (boardsToSet && boardsToSet?.length > 0) {
      return <BoardGrid gridType={gridType} boards={boardsToSet} />;
    } else if (boardsToSet?.length === 0 && gridType === "user") {
      return (
        <>
          <div className="flex flex-col items-center justify-center my-5">
            <p className="text-2xl font-semibold m-4">
              You have no boards yet. Create one now!
            </p>
            <p className="text-lg w-3/4 text-center mb-5 md:w-1/2 font-md">
              Boards are collections of images with natural language labels that
              can be used to communicate with others.{" "}
            </p>
            <p className="text-xl text-center w-3/4 md:w-1/2 font-semibold my-4">
              They simpliest way to get started is by choosing a{" "}
              <span
                onClick={() => setSegmentType("preset")}
                className="font-bold text-blue-500 cursor-pointer"
              >
                preset board
              </span>
              , cloning it, and then editing it to suit your needs.
            </p>
            <p className="text-lg text-center w-3/4 md:w-1/2 font-md my-4">
              You can also create a board from scratch by clicking the button
              below.
            </p>
            <IonButton
              routerLink="/boards/new"
              className="mt-3"
              fill="solid"
              size="large"
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
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="bg-inherit shadow-none w-full md:w-2/3 lg:w-1/2 mx-auto">
            {currentUser && (
              <IonSegment
                value={segmentType}
                onIonChange={handleSegmentChange}
                className="w-full bg-inherit"
              >
                <IonSegmentButton value="preset">
                  <IonLabel className="text-sm lg:text-md">Preset</IonLabel>
                  <IonIcon icon={imagesOutline} size="small" className="" />
                </IonSegmentButton>
                <IonSegmentButton value="user">
                  <IonLabel className="text-sm lg:text-md">
                    Your Boards
                  </IonLabel>
                  <IonIcon icon={personOutline} size="small" className="" />
                </IonSegmentButton>
              </IonSegment>
            )}
          </div>
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
          {segmentType === "user" && renderBoardGrid("user", boards)}

          {segmentType === "preset" && renderBoardGrid("preset", presetBoards)}
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default BoardsScreen;
