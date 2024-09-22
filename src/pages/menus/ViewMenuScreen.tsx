import React, { useState, useEffect, useRef } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { getMenu, Menu, rerunMenuJob, updateMenu } from "../../data/menus"; // Adjust imports based on actual functions
import { Image } from "../../data/images";
import SideMenu from "../../components/main_menu/SideMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import BoardView from "../../components/boards/BoardView";
import { Team } from "../../data/teams";
import Tabs from "../../components/utils/Tabs";
import {
  fastFoodOutline,
  gridOutline,
  layersOutline,
  text,
} from "ionicons/icons";
import { set } from "react-hook-form";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import ProgressBar from "../../components/utils/ProgressBar";
import { rearrangeImages } from "../../data/boards";
interface ViewMenuScreenProps {
  id: string;
}
const ViewMenuScreen: React.FC<ViewMenuScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [board, setBoard] = useState<any | null>(null);
  const boardTab = useRef<HTMLDivElement>(null);
  const [segmentType, setSegmentType] = useState("menuTab");
  const menuTab = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<Image[]>([]);
  const history = useHistory();
  const { currentUser, currentAccount, isWideScreen, largeScreen } =
    useCurrentUser();
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [currentUserTeams, setCurrentUserTeams] = useState<Team[]>();
  const [showIcon, setShowIcon] = useState(false);
  const [boardError, setBoardError] = useState(false);
  const [status, setStatus] = useState("");
  const [pendingImages, setPendingImages] = useState(0);
  const [completedImages, setCompletedImages] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(100);

  const fetchMenu = async () => {
    const menuToSet = await getMenu(Number(id));
    if (!menuToSet) {
      console.error("No menu found");
      return;
    }
    setMenu(menuToSet);
    setStatus(menuToSet.status);
    const mainBoard = menuToSet.board;
    // setBoard(mainBoard);
    console.log("Main board", mainBoard);
    console.log("largeScreen", largeScreen);
    // setTimeout(() => {
    //   console.log("Setting board", mainBoard);
    // }, 5000); //
    if (!mainBoard?.layout) {
      console.log("Empty board layout");
      if (mainBoard && mainBoard.id) {
        // const rearrangedBoard = await rearrangeImages(mainBoard.id);
        // setBoard(rearrangedBoard);
        const boardHasError = mainBoard?.status.includes("error");
        if (boardHasError) {
          setBoardError(true);
          setStatus("error");
          console.error("Error fetching board");
          alert("Error fetching board");
          return;
        }
        console.log("Rearranging board...", mainBoard.id);
        const rearrangedBoard = await rearrangeImages(mainBoard.id);
        console.log("Rearranged board", rearrangedBoard);
        setBoard(rearrangedBoard);
      }
      // window.location.reload();
    } else {
      setBoard(mainBoard);
    }
    setImages(menuToSet.images);
    toggleForms(segmentType);
    const imgStatuses =
      menuToSet.board?.images.map((img: Image) => {
        return img.status;
      }) || [];

    console.log("Image statuses", imgStatuses);

    const pendingImages =
      imgStatuses?.filter(
        (status: string) => status === "pending" || status === "generating"
      ).length || 0;

    const progressToSet = Math.round(
      (completedImages / imgStatuses.length) * 100
    );
    setProgress(progress);
    setPendingImages(pendingImages);
    setCompletedImages(
      imgStatuses?.filter(
        (status: string) => status === "completed" || status === "skipped"
      ).length || 0
    );
    setProgressPercentage(progressToSet);

    if (
      imgStatuses?.length === 0 ||
      imgStatuses?.includes("generating") ||
      imgStatuses?.includes("pending")
    ) {
      setStatus("generating");
      return menuToSet;
    } else {
      setStatus("complete");
    }
    return menuToSet;
  };

  const [showLoading, setShowLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading images");

  useEffect(() => {
    fetchMenu();
    if (menu?.status !== "complete" && status === "generating") {
      setLoadingMessage("Please wait while we generate your menu board...");
      setShowLoading(true);
      const intervalId = setInterval(() => {
        console.log("Checking for menu board...", status);

        fetchMenu();
      }, 3000); // Check every 5 seconds
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    } else {
      setShowLoading(false);
    }
  }, [status]);

  useEffect(() => {
    async function getData() {
      const menuToSet = await fetchMenu();
      if (!menuToSet) {
        setBoardError(true);
        console.error("No menu found");
        return;
      }
      setMenu(menuToSet);
    }
    getData();
  }, []);

  const toggleForms = (segmentType: string) => {
    if (segmentType === "boardTab") {
      menuTab.current?.classList.add("hidden");
      boardTab.current?.classList.remove("hidden");
    }
    if (segmentType === "menuTab") {
      menuTab.current?.classList.remove("hidden");
      boardTab.current?.classList.add("hidden");
    }
  };

  const handleRerun = async () => {
    if (!menu) {
      console.error("No menu found");
      return;
    }
    const result = await rerunMenuJob(menu.id as string);
    if (result.error) {
      alert(`Menu rerun failed: ${result.error}`);
    } else {
      alert("Menu rerun successful");
      history.push(`/menus/${menu.id}`);
      fetchMenu();
    }
    // setMenu(updatedMenu);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  };

  const handleLimitChange = (e: CustomEvent) => {
    const newLimit = e.detail.value;
    if (!menu) {
      console.error("No menu found");
      return;
    }
    const updatedMenu = { ...menu, token_limit: newLimit };
    setMenu(updatedMenu);
  };

  const handleUpdateMenu = async () => {
    if (!menu) {
      console.error("No menu found");
      return;
    }
    const result = await updateMenu(menu);
    if (!result) {
      console.error("No menu found");
      return;
    }
    console.log("Updated menu", result);
    setMenu(result);
  };

  return (
    <>
      <SideMenu
        pageTitle="Menus"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Menus"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Menus"
          isWideScreen={isWideScreen}
          largeScreen={largeScreen}
          startLink="/menus"
          endLink="/menus/new"
          showMenuButton={true}
        />

        <IonContent className="ion-padding">
          <IonHeader className="bg-inherit shadow-none">
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit mb-2"
            >
              <IonSegmentButton value="menuTab">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Menu
                </IonLabel>
                <IonIcon className="mt-2" icon={fastFoodOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="boardTab">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Board
                </IonLabel>
                <IonIcon className="mt-2" icon={gridOutline} />
              </IonSegmentButton>
            </IonSegment>
          </IonHeader>
          <div className="hidden" ref={menuTab}>
            <h1 className="text-2xl md:text-3xl font-bold my-6 text-center">
              {menu?.name}
            </h1>
            {status === "generating" && (
              <>
                {progressPercentage / 100 > 0 && (
                  <ProgressBar progressToSet={progressPercentage / 100} />
                )}

                <IonList className=" text-xl" style={{ marginTop: "20px" }}>
                  <IonItem lines="none" className="ion-margin-bottom">
                    <p className="text-lg md:text-xl mb-4 text-center font-bold">
                      This menu is currently being processed. Please wait. This
                      {board && board.images && board.images.length > 1
                        ? ` may take a few minutes.`
                        : ` should be ready shortly.`}
                      <br></br> This page will refresh automatically once the
                      menu is ready.
                    </p>
                  </IonItem>
                </IonList>
              </>
            )}
            {status === "complete" && (
              <div className="w-7/8 md:w-2/3 lg:w-3/4 mx-auto text-center mb-4">
                <p className="text-xl md:text-2xl">
                  This menu board is ready for viewing.
                </p>
                <p className="text-xl md:text-2xl">
                  Click the <strong>Board</strong> tab to get started.
                </p>
              </div>
            )}

            {menu && menu.displayImage && (
              <div className="w-7/8 md:w-2/3 lg:w-3/4 mx-auto mt-4">
                <IonImg src={menu.displayImage} alt={menu.name} />
              </div>
            )}
            {boardError && (
              <IonList className=" text-xl" style={{ marginTop: "20px" }}>
                <IonItem lines="none" className="">
                  <IonText color={"danger"} className=" text-2xl">
                    An error has occured while creating your board. Please try
                    again.
                  </IonText>
                </IonItem>
                <IonItem lines="none">
                  <IonText color={"danger"} className=" text-xl">
                    If this error persists, please try a different image.
                  </IonText>
                </IonItem>
              </IonList>
            )}
            <IonList lines="none" className="">
              {currentUser?.role === "admin" && (
                <IonCard className="p-4 w-1/2 md:w-1/3 lg:w-1/4 mx-auto">
                  <IonItem>
                    <IonLabel position="stacked">Description</IonLabel>
                    <IonText>{menu?.description}</IonText>
                  </IonItem>
                  <IonText>Current Cost: {menu?.board?.cost}</IonText>
                  <IonInput
                    type="number"
                    value={menu?.token_limit}
                    label="Token Limit"
                    labelPlacement="fixed"
                    onIonChange={handleLimitChange}
                  />
                  <IonButton onClick={handleUpdateMenu}>Update</IonButton>
                  {menu?.token_limit &&
                    menu?.board?.cost &&
                    menu?.board?.cost - menu?.token_limit < 0 && (
                      <IonButton
                        disabled={menu?.token_limit - menu?.board?.cost < 0}
                        onClick={handleRerun}
                      >
                        Rerun
                      </IonButton>
                    )}
                </IonCard>
              )}
            </IonList>
          </div>
          <div className="hidden" ref={boardTab}>
            {board && board.layout && (
              <BoardView
                setShowLoading={setShowLoading}
                board={board}
                showEdit={menu?.can_edit || false}
                currentUserTeams={currentUserTeams}
                setShowIcon={setShowIcon}
                numOfColumns={numOfColumns}
                showLoading={false}
              />
            )}
          </div>
          <IonLoading
            className="loading-icon"
            cssClass="loading-icon"
            isOpen={showLoading}
            message={loadingMessage}
          />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewMenuScreen;
