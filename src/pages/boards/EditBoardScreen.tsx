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
  IonToolbar,
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
import SideMenu from "../../components/main_menu/SideMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import ConfirmAlert from "../../components/utils/ConfirmAlert";
import { getScreenSizeName } from "../../data/utils";
import SuggestionForm from "../../components/boards/SuggestionForm";
import { set } from "d3";

const EditBoardScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const initialSegmentType = urlParams.get("segment") || "layout";
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
  const [xMargin, setXMargin] = useState(
    board?.layout[currentScreenSize]?.x_margin
  );
  const [yMargin, setYMargin] = useState(
    board?.layout[currentScreenSize]?.y_margin
  );

  const [openAlert, setOpenAlert] = useState(false);
  const [preventCollision, setPreventCollision] = useState(false);

  useEffect(() => {
    if (board) {
      const layout = board.layout[currentScreenSize];
      const margin = board.margin_settings[currentScreenSize];

      setCurrentLayout(layout);
      if (margin) {
        setXMargin(margin.x);
        setYMargin(margin.y);
      } else {
        setXMargin(5);
        setYMargin(5);
      }
      setBoard(board);
    }
  }, [currentScreenSize]);

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
    console.log("Current screen size: ", currentScreenSize);
    const board = await getBoard(id);
    const layout = board.layout[currentScreenSize];
    setGridLayout(layout);
    setXMargin(board.margin_settings[currentScreenSize]?.x);
    setYMargin(board.margin_settings[currentScreenSize]?.y);
    setCurrentLayout(layout);

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
  });

  useEffect(() => {
    setSegmentType(initialSegmentType);
    toggleForms(initialSegmentType);
    loadPage();
  }, []);

  const handleLayoutReload = async () => {
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
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

    if (newSegment === "layout") {
      handleLayoutReload();
      return;
    }
    if (newSegment === "back") {
      history.push(`/boards/${board?.id}`);
    } else {
      setSegmentType(newSegment);
      toggleForms(newSegment);
      loadPage();
    }
  };

  const marginValues = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40,
  ];

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
      <SideMenu
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
        <IonHeader className="ion-no-border">
          <IonToolbar>
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
            {segmentType === "layout" && (
              <div className="my-5">
                <IonButtons className="grid grid-cols-2 md:grid-cols-4 gap-1">
                  <IonButton
                    className="text-sm md:text-md lg:text-lg"
                    onClick={() => setOpenAlert(true)}
                    color={"danger"}
                    fill="outline"
                    size="small"
                  >
                    <IonIcon icon={appsOutline} className="mx-1" />
                    <IonLabel className="mx-1">Reset Layout </IonLabel>
                  </IonButton>

                  <IonButton
                    className="text-sm md:text-md lg:text-lg"
                    onClick={handleSaveLayout}
                    size="small"
                    fill="outline"
                  >
                    <IonIcon icon={saveOutline} className="mx-1" />
                    <IonLabel className="mx-1">Save Layout</IonLabel>
                  </IonButton>
                  <IonButton
                    className="text-sm md:text-md lg:text-lg"
                    onClick={() => setPreventCollision(!preventCollision)}
                    color={"primary"}
                    fill={preventCollision ? "solid" : "outline"}
                    size="small"
                  >
                    <IonIcon icon={contractOutline} className="mx-1" />
                    <IonLabel className="mx-1">
                      Collision: {preventCollision ? "Off" : "On"}
                    </IonLabel>
                  </IonButton>
                  <IonButton
                    onClick={handleLayoutReload}
                    color="primary"
                    fill="outline"
                    size="small"
                    className="text-sm md:text-md lg:text-lg"
                  >
                    <IonIcon icon={appsOutline} className="mx-1" />
                    <IonLabel className="mx-1">Reload</IonLabel>
                  </IonButton>
                </IonButtons>
              </div>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
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
            <div className="my-2">
              {board && board.images && board.images.length > 0 && (
                <div className="">
                  <p className="text-center font-bold text-lg">
                    This board currently has {board.images.length} images.
                  </p>

                  <p className="text-center font-md text-md my-2">
                    Drag and drop to rearrange the layout.
                  </p>
                  <p className="text-center text-sm md:text-md lg:text-lg my-2">
                    You are currently editing the layout for{" "}
                    <span className="font-bold">
                      {getScreenSizeName(currentScreenSize)}
                    </span>{" "}
                    screens with {numberOfColumns} columns.
                  </p>
                  <div>
                    <div className="w-5/6 md:w-1/2 mx-auto flex justify-center items-center mt-6 mb-2">
                      <IonSelect
                        value={xMargin}
                        placeholder="X Margin"
                        labelPlacement="stacked"
                        label="X Margin"
                        className="mx-1"
                        fill="outline"
                        selectedText={xMargin ? xMargin.toString() : ""}
                        onIonChange={(e: any) => setXMargin(e.detail.value)}
                      >
                        {marginValues.map((type, index) => (
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
                        className="mx-1"
                        selectedText={yMargin ? yMargin.toString() : ""}
                        onIonChange={(e: any) => setYMargin(e.detail.value)}
                      >
                        {marginValues.map((type, index) => (
                          <IonSelectOption key={index} value={type}>
                            {type}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </div>
                    {/* <div className="my-5">
                      <IonButtons className="grid grid-cols-2 md:grid-cols-3 gap-1">
                        <IonButton
                          className="text-sm md:text-md lg:text-lg"
                          onClick={() => setOpenAlert(true)}
                          color={"danger"}
                          fill="outline"
                          size="small"
                        >
                          <IonIcon icon={appsOutline} className="mx-1" />
                          <IonLabel className="mx-1">Reset Layout </IonLabel>
                        </IonButton>

                        <IonButton
                          className="text-sm md:text-md lg:text-lg"
                          onClick={handleSaveLayout}
                          size="small"
                          fill="outline"
                        >
                          <IonIcon icon={saveOutline} className="mx-1" />
                          <IonLabel className="mx-1">Save Layout</IonLabel>
                        </IonButton>
                        <IonButton
                          className="text-sm md:text-md lg:text-lg"
                          onClick={() => setPreventCollision(!preventCollision)}
                          color={"primary"}
                          fill={preventCollision ? "solid" : "outline"}
                          size="small"
                        >
                          <IonIcon icon={contractOutline} className="mx-1" />
                          <IonLabel className="mx-1">
                            Collision: {preventCollision ? "Off" : "On"}
                          </IonLabel>
                        </IonButton>
                        <IonButton
                          onClick={handleLayoutReload}
                          color="primary"
                          fill="outline"
                          size="small"
                          className="text-sm md:text-md lg:text-lg"
                        >
                          <IonIcon icon={appsOutline} className="mx-1" />
                          <IonLabel className="mx-1">Reload</IonLabel>
                        </IonButton>
                      </IonButtons>
                    </div> */}
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
                        updateScreenSize={(newScreenSize: string) => {
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
