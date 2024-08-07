import React, { useState, useEffect, useRef } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
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
import MainMenu from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import BoardView from "../../components/boards/BoardView";
import { Team } from "../../data/teams";
import Tabs from "../../components/utils/Tabs";
import { text } from "ionicons/icons";
import { set } from "react-hook-form";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
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
  const { currentUser, currentAccount, isWideScreen } = useCurrentUser();
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [currentUserTeams, setCurrentUserTeams] = useState<Team[]>();
  const [showIcon, setShowIcon] = useState(false);
  const [boardError, setBoardError] = useState(false);

  const fetchMenu = async () => {
    const menuToSet = await getMenu(Number(id));
    if (!menuToSet) {
      console.error("No menu found");
      return;
    }
    setMenu(menuToSet);
    setBoard(menuToSet.board);
    setImages(menuToSet.images);
    toggleForms(segmentType);
    console.log("Menu", menuToSet);
    const imgStatuses = menuToSet.board?.images.map((img: Image) => {
      return img.status;
    });
    console.log("Image statuses", imgStatuses);
    return menuToSet;
  };

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
    console.log("Menu rerun result", result);
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
      <MainMenu
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
          startLink="/menus"
          endLink="/menus/new"
        />

        <IonContent scrollY={true}>
          <IonHeader className="bg-inherit shadow-none">
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit my-2 p-2"
            >
              <IonSegmentButton value="menuTab">
                <IonLabel className="text-md lg:text-lg">Menu</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="boardTab">
                <IonLabel className="text-md lg:text-lg">Board</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonHeader>
          <div className="hidden" ref={menuTab}>
            <h1 className="text-2xl md:text-3xl font-bold my-6 text-center">
              {menu?.name}
            </h1>
            {menu && menu.status && menu.status !== "complete" && (
              <IonList className=" text-xl" style={{ marginTop: "20px" }}>
                <IonItem lines="none" className="">
                  <p className="text-xl md:text-2xl">
                    This menu is currently being processed. Please wait a few
                    seconds and refresh the page.
                  </p>
                </IonItem>
              </IonList>
            )}
            {menu && menu.status && menu.status === "complete" && (
              <div className="w-7/8 md:w-2/3 lg:w-3/4 mx-auto text-center mb-4">
                <p className="text-xl md:text-2xl">
                  This menu board is ready for viewing.
                </p>
                <p className="text-xl md:text-2xl">
                  Click the <strong>Board</strong> tab to start speaking.
                </p>
              </div>
            )}

            {menu && menu.displayImage && (
              <div className="w-7/8 md:w-2/3 lg:w-3/4 mx-auto">
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
            {board && (
              <BoardView
                board={board}
                showEdit={menu?.can_edit || false}
                currentUserTeams={currentUserTeams}
                setShowIcon={setShowIcon}
                showShare={false} // Temporarily set to false
                numOfColumns={numOfColumns}
                showLoading={false}
              />
            )}
          </div>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewMenuScreen;
