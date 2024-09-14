import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import {
  add,
  appsOutline,
  arrowBackCircle,
  arrowBackCircleOutline,
  cloudUploadOutline,
  contractOutline,
  copyOutline,
  createOutline,
  gridOutline,
  helpBuoyOutline,
  imagesOutline,
  pencilOutline,
  pencilSharp,
  saveOutline,
  shareOutline,
  trashBinOutline,
} from "ionicons/icons";
import {
  getBoard,
  addImageToBoard,
  Board,
  getRemainingImages,
  saveLayout,
  rearrangeImages,
  deleteBoard,
  createAdditionalImages,
  getAdditionalWords,
  cloneBoard,
} from "../../data/boards"; // Adjust imports based on actual functions
import { generateImage } from "../../data/images";
import { Image } from "../../data/images";
import BoardForm from "../../components/boards/BoardForm";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import DraggableGrid from "../../components/images/DraggableGrid";
import MainMenu from "../../components/main_menu/MainMenu";
import ImageCropper from "../../components/images/ImageCropper";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import ConfirmAlert from "../../components/utils/ConfirmAlert";
import { getScreenSizeName } from "../../data/utils";
import { set } from "d3";
import SuggestionForm from "../../components/boards/SuggestionForm";
import { h } from "ionicons/dist/types/stencil-public-runtime";
import ConfirmDeleteAlert from "../../components/utils/ConfirmAlert";

const EditBoardScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("edit");
  const helpTab = useRef<HTMLDivElement>(null);
  const layoutTab = useRef<HTMLDivElement>(null);
  const editForm = useRef<HTMLDivElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [additionalWords, setAdditionalWords] = useState<string[]>([]);
  const [numberOfWords, setNumberOfWords] = useState(15);
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
  const [currentNumberOfColumns, setCurrentNumberOfColumns] =
    useState(numberOfColumns);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const handleDeleteBoard = async () => {
    if (!board) return;
    setShowLoading(true);
    await deleteBoard(board.id);
    history.push("/boards");
    setShowLoading(false);
  };
  const initialImage = {
    id: "",
    src: "",
    label: "",
    image_prompt: "",
    audio: "",
    bg_color: "",
    layout: [],
  };
  const [image, setImage] = useState<Image | null>(initialImage);
  const [openAlert, setOpenAlert] = useState(false);
  const [cloneIsOpen, setCloneIsOpen] = useState(false);
  const checkCurrentUserTokens = (numberOfTokens: number = 1) => {
    if (
      currentUser &&
      currentUser.tokens &&
      currentUser.tokens >= numberOfTokens
    ) {
      return true;
    }
    return false;
  };

  const removeBoard = async () => {
    try {
      const boardId = params.id;
      // Implement delete board logic
      await deleteBoard(boardId);
      window.location.href = "/boards";
    } catch (error) {
      console.error("Error removing board: ", error);
      alert("Error removing board");
    }
  };

  const handleRearrangeImages = async () => {
    setShowLoading(true);
    const updatedBoard = await rearrangeImages(id);
    setBoard(updatedBoard);
    setShowLoading(false);
    window.location.reload();
  };

  const fetchBoard = async () => {
    const board = await getBoard(id); // Ensure getBoard is typed to return a Promise<Board>
    setBoard(board);

    return board;
  };

  useEffect(() => {
    if (board) {
      if (smallScreen) setNumberOfColumns(board?.small_screen_columns || 4);
      else if (mediumScreen)
        setNumberOfColumns(board?.medium_screen_columns || 8);
      else if (largeScreen)
        setNumberOfColumns(board?.large_screen_columns || 12);
    }
  }, [smallScreen, mediumScreen, largeScreen, board]);

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

  useIonViewWillEnter(() => {
    setSearchInput("");
    setPage(1);
    setSegmentType("edit");
    toggleForms("edit");
  });

  const handleClone = async () => {
    setShowLoading(true);
    try {
      if (!board) {
        console.error("Board is missing");
        alert("Board is missing");
        return;
      }
      const clonedBoard = await cloneBoard(board.id);
      if (clonedBoard) {
        const updatedBoard = await rearrangeImages(clonedBoard.id);
        setBoard(updatedBoard || clonedBoard);
        history.push(`/boards/${clonedBoard.id}`);
      } else {
        console.error("Error cloning board");
        alert("Error cloning board");
      }
    } catch (error) {
      console.error("Error cloning board: ", error);
      alert("Error cloning board");
    }
    setShowLoading(false);
  };

  useEffect(() => {
    loadPage();
  }, []);

  const toggleForms = (segmentType: string) => {
    if (segmentType === "edit") {
      helpTab.current?.classList.add("hidden");
      layoutTab.current?.classList.add("hidden");
      editForm.current?.classList.remove("hidden");
    }
    if (segmentType === "layout") {
      helpTab.current?.classList.add("hidden");
      layoutTab.current?.classList.remove("hidden");
      editForm.current?.classList.add("hidden");
    }
    if (segmentType === "board" || segmentType === "back") {
      history.push(`/boards/${id}`);
    }

    if (segmentType === "help") {
      helpTab.current?.classList.remove("hidden");
      layoutTab.current?.classList.add("hidden");
      editForm.current?.classList.add("hidden");
    }
  };

  const handleCurrentLayout = (layout: any) => {
    setCurrentLayout(layout);
  };

  const setGrid = (layout: any) => {
    setGridLayout(layout);
  };

  const handleSaveLayout = async () => {
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }

    const updatedBoard = await saveLayout(
      board.id,
      gridLayout,
      currentScreenSize
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
  };

  useEffect(() => {
    setGridLayout(currentLayout);
  }, [currentLayout]);

  const [preventCollision, setPreventCollision] = useState(false);

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
                {!smallScreen ? (
                  <IonLabel className="">Back</IonLabel>
                ) : (
                  <IonLabel className=""></IonLabel>
                )}
                <IonIcon className="mt-2" icon={arrowBackCircle} />
              </IonSegmentButton>
              <IonSegmentButton value="edit">
                {!smallScreen ? (
                  <IonLabel className="">Edit</IonLabel>
                ) : (
                  <IonLabel className=""></IonLabel>
                )}
                <IonIcon className="mt-2" icon={createOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="help">
                {!smallScreen ? (
                  <IonLabel className="">Help</IonLabel>
                ) : (
                  <IonLabel className=""></IonLabel>
                )}
                <IonIcon className="mt-2" icon={helpBuoyOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="layout">
                {!smallScreen ? (
                  <IonLabel className="">Layout</IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg"></IonLabel>
                )}
                <IonIcon className="mt-2" icon={gridOutline} />
              </IonSegmentButton>
            </IonSegment>
          </IonHeader>
          <div className=" " ref={editForm}>
            <div className="w-11/12 lg:w-1/2 mx-auto">
              <div className=" mt-5 text-center">
                <IonButtons className="flex justify-center">
                  <IonButton
                    className="mx-2"
                    fill="outline"
                    size="small"
                    onClick={() => setCloneIsOpen(true)}
                  >
                    <IonIcon icon={copyOutline} className="mx-2" />
                    <IonLabel className="text-xs ml-1">Clone</IonLabel>
                  </IonButton>
                  {board && showEdit && (
                    <IonButton
                      className="mx-2"
                      fill="outline"
                      size="small"
                      color={"danger"}
                      onClick={() => setOpenDeleteAlert(true)}
                    >
                      <IonIcon icon={trashBinOutline} className="mx-2" />
                      <IonLabel>Delete</IonLabel>
                    </IonButton>
                  )}
                </IonButtons>
              </div>
              {board && (
                <BoardForm
                  board={board}
                  setBoard={setBoard}
                  onSubmit={loadPage}
                />
              )}
            </div>
            <ConfirmDeleteAlert
              openAlert={openDeleteAlert}
              message={
                "Are you sure you want to DELETE this board? This action cannot be undone."
              }
              onConfirm={handleDeleteBoard}
              onCanceled={() => {
                setOpenDeleteAlert(false);
              }}
            />
            <ConfirmAlert
              onConfirm={handleClone}
              onCanceled={() => {}}
              openAlert={cloneIsOpen}
              message="Are you sure you want to CLONE this board?"
              onDidDismiss={() => setCloneIsOpen(false)}
            />
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
