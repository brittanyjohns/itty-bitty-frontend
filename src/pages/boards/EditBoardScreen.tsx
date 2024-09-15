import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import {
  appsOutline,
  arrowBackCircle,
  arrowBackCircleOutline,
  contractOutline,
  createOutline,
  gridOutline,
  helpBuoyOutline,
  imagesOutline,
  saveOutline,
} from "ionicons/icons";
import {
  getBoard,
  Board,
  getRemainingImages,
  saveLayout,
  rearrangeImages,
  deleteBoard,
} from "../../data/boards";
import { Image } from "../../data/images";
import BoardForm from "../../components/boards/BoardForm";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import DraggableGrid from "../../components/images/DraggableGrid";
import MainMenu from "../../components/main_menu/MainMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import ConfirmAlert from "../../components/utils/ConfirmAlert";
import { getScreenSizeName } from "../../data/utils";
import SuggestionForm from "../../components/boards/SuggestionForm";

const EditBoardScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const initialSegmentType = urlParams.get("segment") || "edit";
  const [segmentType, setSegmentType] = useState(initialSegmentType);
  const helpTab = useRef<HTMLDivElement>(null);
  const layoutTab = useRef<HTMLDivElement>(null);
  const editForm = useRef<HTMLDivElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>();
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState("Loading board");
  const {
    currentUser,
    isWideScreen,
    currentAccount,
    smallScreen,
    mediumScreen,
    largeScreen,
  } = useCurrentUser();
  const [gridLayout, setGridLayout] = useState([]);
  const [numberOfColumns, setNumberOfColumns] = useState(4);
  const [showEdit, setShowEdit] = useState(false);
  const params = useParams<{ id: string }>();
  const [currentLayout, setCurrentLayout] = useState([]);
  const [currentScreenSize, setCurrentScreenSize] = useState("lg");
  const [xMargin, setXMargin] = useState(board?.x_margin || 0);
  const [yMargin, setYMargin] = useState(0);
  const [currentNumberOfColumns, setCurrentNumberOfColumns] =
    useState(numberOfColumns);

  const [openAlert, setOpenAlert] = useState(false);
  const [preventCollision, setPreventCollision] = useState(false);

  const removeBoard = async () => {
    if (!board || !board) {
      return;
    }
    try {
      await deleteBoard(board.id);
      history.push("/boards");
    } catch (error) {
      console.error("Error removing board: ", error);
      alert("Error removing board");
    }
  };

  // Fetch board data and initialize state
  const fetchBoard = async () => {
    const board = await getBoard(id);
    setBoard(board);
    return board;
  };

  // Fetch remaining images
  const fetchRemaining = async (id: string, page: number) => {
    const remainingImgs = await getRemainingImages(id, page, searchInput);
    setRemainingImages(remainingImgs);
  };

  const loadPage = async () => {
    setShowLoading(true);
    const boardToSet = await fetchBoard();
    fetchRemaining(boardToSet.id, 1);
    toggleForms(segmentType);
    const userCanEdit = boardToSet.can_edit || currentUser?.role === "admin";
    setShowEdit(userCanEdit);
    setShowLoading(false);
  };

  // Ensure the form visibility based on segment type
  const toggleForms = (segmentType: string) => {
    if (segmentType === "edit") {
      helpTab.current?.classList.add("hidden");
      layoutTab.current?.classList.add("hidden");
      editForm.current?.classList.remove("hidden");
    } else if (segmentType === "layout") {
      helpTab.current?.classList.add("hidden");
      layoutTab.current?.classList.remove("hidden");
      editForm.current?.classList.add("hidden");
    } else if (segmentType === "help") {
      helpTab.current?.classList.remove("hidden");
      layoutTab.current?.classList.add("hidden");
      editForm.current?.classList.add("hidden");
    }
  };

  // Adjust layout based on screen size
  useEffect(() => {
    if (board) {
      if (smallScreen) setNumberOfColumns(board?.small_screen_columns || 4);
      else if (mediumScreen)
        setNumberOfColumns(board?.medium_screen_columns || 8);
      else if (largeScreen)
        setNumberOfColumns(board?.large_screen_columns || 12);
    }
  }, [smallScreen, mediumScreen, largeScreen, board]);

  useIonViewWillEnter(() => {
    setSearchInput("");
    setPage(1);
    setSegmentType("edit");
    toggleForms("edit");
  });

  useEffect(() => {
    loadPage();
  }, []);

  const handleLayoutReload = async () => {
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    setSegmentType("layout");
    toggleForms("layout");
    window.location.href = `/boards/${board.id}/edit?segment=layout`;
  };

  // Save layout
  const handleSaveLayout = async () => {
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }

    const updatedBoard = await saveLayout(
      board.id,
      gridLayout,
      currentScreenSize,
      { xMargin, yMargin }
    );
    const message = "Board layout saved";
    setToastMessage(message);
    setIsToastOpen(true);
    setBoard(updatedBoard);
    history.push(`/boards/${board?.id}`);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
    console.log("Segment changed to: ", newSegment);
    if (newSegment === "layout") {
      handleLayoutReload();
    }
    if (newSegment === "back") {
      history.goBack();
    } else {
      window.location.href = `/boards/${board?.id}/edit?segment=${newSegment}`;
    }
  };

  const handleCurrentLayout = (layout: any) => {
    setCurrentLayout(layout);
  };

  const setGrid = (layout: any) => {
    setGridLayout(layout);
  };

  const handleRearrangeImages = async () => {
    setShowLoading(true);
    const updatedBoard = await rearrangeImages(id);
    setBoard(updatedBoard);
    setShowLoading(false);
    window.location.reload();
  };

  return (
    <>
      <MainMenu
        pageTitle={`Edit ${board?.name}`}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle={`Edit ${board?.name}`}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <IonPage id="main-content">
        <MainHeader
          pageTitle={`Edit ${board?.name}`}
          isWideScreen={isWideScreen}
          endIcon={imagesOutline}
          endLink={`/boards/${board?.id}/gallery`}
          startIcon={arrowBackCircleOutline}
          startLink={`/boards/${board?.id}`}
        />
        <IonContent>
          <IonHeader className="bg-inherit shadow-none">
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className=""
            >
              <IonSegmentButton value="back">
                <IonLabel>Back</IonLabel>
                <IonIcon className="mt-2" icon={arrowBackCircle} />
              </IonSegmentButton>
              <IonSegmentButton value="edit">
                <IonLabel>Edit</IonLabel>
                <IonIcon className="mt-2" icon={createOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="help">
                <IonLabel>Help</IonLabel>
                <IonIcon className="mt-2" icon={helpBuoyOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="layout">
                <IonLabel>Layout</IonLabel>
                <IonIcon className="mt-2" icon={gridOutline} />
              </IonSegmentButton>
            </IonSegment>
          </IonHeader>
          <div className=" " ref={editForm}>
            <div className="w-11/12 lg:w-1/2 mx-auto">
              {board && (
                <BoardForm
                  board={board}
                  setBoard={setBoard}
                  onSubmit={loadPage}
                />
              )}
            </div>
          </div>

          <div className="mt-6 py-3 px-1 hidden text-center" ref={helpTab}>
            {currentUser && (
              <div className=" mt-5 text-center">
                {board && (
                  <SuggestionForm
                    board={board}
                    setBoard={setBoard}
                    setIsToastOpen={setIsToastOpen}
                    setToastMessage={setToastMessage}
                    setShowLoading={setShowLoading}
                    setLoadingMessage={setLoadingMessage}
                  />
                )}
              </div>
            )}
          </div>
          <div className="mt-2 hidden" ref={layoutTab}>
            <div className="my-2 px-2 lg:px-8">
              {board && board.images && board.images.length > 0 && (
                <div className="pb-10">
                  <IonButtons>
                    <IonButton
                      onClick={handleLayoutReload}
                      color="primary"
                      fill="outline"
                      size="small"
                    >
                      <IonIcon icon={appsOutline} className="mx-2" />
                      <IonLabel className="mx-1">Reload Layout</IonLabel>
                    </IonButton>
                  </IonButtons>
                  <p className="text-center font-bold text-lg">
                    This board currently has {board.images.length} images.
                  </p>

                  <p className="text-center font-mono text-md">
                    Drag and drop to rearrange the layout.
                  </p>
                  <p className="text-center text-lg ">
                    You are currently viewing the layout for{" "}
                    <span className="font-bold">
                      {getScreenSizeName(currentScreenSize)}
                    </span>{" "}
                    screens
                  </p>
                  <div>
                    <div className="w-1/2 mx-auto flex justify-center items-center">
                      <IonSelect
                        value={xMargin}
                        placeholder="X Margin"
                        labelPlacement="stacked"
                        label="X Margin"
                        className="mx-2"
                        fill="outline"
                        selectedText={xMargin.toString()}
                        onIonChange={(e: any) => setXMargin(e.detail.value)}
                      >
                        {[0, 5, 10, 15, 20, 25, 30].map((type, index) => (
                          <IonSelectOption key={index} value={type}>
                            {type}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                      <IonSelect
                        value={yMargin}
                        placeholder="Y Margin"
                        labelPlacement="stacked"
                        label="Y Margin"
                        fill="outline"
                        className="mx-2"
                        selectedText={yMargin.toString()}
                        onIonChange={(e: any) => setYMargin(e.detail.value)}
                      >
                        {[0, 5, 10, 15, 20, 25, 30].map((type, index) => (
                          <IonSelectOption key={index} value={type}>
                            {type}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </div>
                    <div className="h-5 my-3"></div>
                    {board && (
                      <DraggableGrid
                        board={board}
                        images={board.images}
                        columns={numberOfColumns}
                        onLayoutChange={(layout: any) => setGrid(layout)}
                        mute={true}
                        enableResize={true}
                        viewOnClick={false}
                        showRemoveBtn={false}
                        xMargin={xMargin}
                        yMargin={yMargin}
                        compactType={null}
                        preventCollision={preventCollision}
                        setShowLoading={setShowLoading}
                        setCurrentLayout={handleCurrentLayout}
                        updateScreenSize={(
                          newScreenSize: string,
                          newCols: number
                        ) => {
                          setCurrentNumberOfColumns(newCols);
                          setCurrentScreenSize(newScreenSize);
                        }}
                      />
                    )}
                    <div className="h-5 my-3"></div>
                  </div>
                </div>
              )}
              {board && board.images && board.images.length < 1 && (
                <div className="text-center">
                  <p>No images found</p>
                </div>
              )}
            </div>
            <div className="mt-5">
              <IonButtons className="flex justify-between">
                <IonButton
                  className="text-lg"
                  onClick={() => setOpenAlert(true)}
                  color={"danger"}
                  fill="outline"
                  size="small"
                >
                  <IonIcon icon={appsOutline} className="mx-2" />
                  <IonLabel className="mx-1">Reset Layout </IonLabel>
                </IonButton>
                <IonButton
                  className="text-md"
                  onClick={() => setPreventCollision(!preventCollision)}
                  color={"primary"}
                  fill={preventCollision ? "solid" : "outline"}
                  size="small"
                >
                  <IonIcon icon={contractOutline} className="mx-2" />
                  <IonLabel className="mx-1">
                    Prevent Collision: {preventCollision ? "On" : "Off"}
                  </IonLabel>
                </IonButton>
                <IonButton
                  className="text-lg"
                  onClick={handleSaveLayout}
                  size="large"
                  fill="outline"
                >
                  <IonIcon icon={saveOutline} className="mx-1" />
                  <IonLabel className="mx-2">Save Layout</IonLabel>
                </IonButton>
              </IonButtons>
            </div>
            <div className="flex justify-between items-center px-4 mt-4">
              <ConfirmAlert
                onConfirm={handleRearrangeImages}
                onCanceled={() => {}}
                openAlert={openAlert}
                onDidDismiss={() => setOpenAlert(false)}
                message="Are you sure you want to reset the layout? - this will revert to the standard layout."
              />
              <ConfirmAlert
                onConfirm={removeBoard}
                onCanceled={() => {}}
                openAlert={isOpen}
                message="Are you sure you want to DELETE this board? This action cannot be undone."
                onDidDismiss={() => setIsOpen(false)}
              />
            </div>
          </div>
          <IonLoading
            message={loadingMessage}
            isOpen={showLoading}
            duration={2000}
          />
          <IonToast
            isOpen={isToastOpen}
            message={toastMessage}
            onDidDismiss={() => setIsToastOpen(false)}
            duration={2000}
          ></IonToast>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default EditBoardScreen;
