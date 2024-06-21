import React, { useState, useEffect, useRef } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { getMenu, Menu, rerunMenuJob } from "../../data/menus"; // Adjust imports based on actual functions
import { Image } from "../../data/images";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import BoardView from "../../components/boards/BoardView";
import { Team } from "../../data/teams";
interface ViewMenuScreenProps {
  id: string;
}
const ViewMenuScreen: React.FC<ViewMenuScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [board, setBoard] = useState<any | null>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>("");
  const boardTab = useRef<HTMLDivElement>(null);
  const [segmentType, setSegmentType] = useState("menuTab");
  const menuTab = useRef<HTMLDivElement>(null);
  const boardGrid = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<Image[]>([]);
  const history = useHistory();
  const { isWideScreen } = useCurrentUser();
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const { currentUser } = useCurrentUser();
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [currentUserTeams, setCurrentUserTeams] = useState<Team[]>();

  const fetchMenu = async () => {
    const menuToSet = await getMenu(Number(id));
    setMenu(menuToSet);
    setBoard(menuToSet.board);
    setImages(menuToSet.images);
    return menuToSet;
  };

  useEffect(() => {
    async function getData() {
      const menuToSet = await fetchMenu();
      setMenu(menuToSet);
      toggleForms(segmentType);
      if (menuToSet.display_doc && menuToSet.display_doc.src) {
        setCurrentMenu(menuToSet.display_doc.src);
      } else {
        setCurrentMenu(menuToSet.src);
      }
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
    if (result.status === "success") {
      alert("Menu rerun successfully");
    } else {
      alert("Menu rerun failed");
    }
    // setMenu(updatedMenu);
  }

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  };

  return (
    <>
      <MainMenu />

      <IonPage id="main-content">
        {!isWideScreen && <MainHeader />}
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/menus" />
            </IonButtons>
            <IonTitle>{menu?.name}</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
              <IonSegmentButton value="menuTab">
                <IonLabel>Menu</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="boardTab">
                <IonLabel>Board</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" scrollY={true}>
          <div className="hidden" ref={menuTab}>
            {menu && menu.displayImage && (
              <div className="">
                <IonImg src={menu.displayImage} alt={menu.name} />
              </div>
            )}
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonText>{menu?.name}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea>{menu?.description}</IonTextarea>
              </IonItem>
              <IonItem>
                <IonButton onClick={handleRerun}>Rerun</IonButton>
              </IonItem>
            </IonList>
          </div>
          <div className="hidden" ref={boardTab}>
          <BoardView 
            board={board} 
            showEdit={showEdit}
            currentUserTeams={currentUserTeams}
            // handleAddToTeam={handleAddToTeam}
            // toggleAddToTeam={toggleAddToTeam}
            // handleClone={handleClone}
            setShowIcon={setShowIcon}
            numOfColumns={numOfColumns}
          />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default ViewMenuScreen;
