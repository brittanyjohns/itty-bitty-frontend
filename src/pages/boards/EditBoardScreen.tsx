import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
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
  arrowBackCircleOutline,
  contractOutline,
  imagesOutline,
  saveOutline,
  shareOutline,
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
  getAddionalImages,
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

const EditBoardScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("edit");
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
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
  // const [screenSize, setScreenSize] = useState("lg");
  const [currentScreenSize, setCurrentScreenSize] = useState("lg");
  const [currentNumberOfColumns, setCurrentNumberOfColumns] =
    useState(numberOfColumns);

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
    // history.push(`/boards/${board?.id}`);
    window.location.reload();
  };

  const fetchBoard = async () => {
    const board = await getBoard(id); // Ensure getBoard is typed to return a Promise<Board>
    setBoard(board);

    // setNumberOfColumns(board.number_of_columns);
    return board;
  };

  useEffect(() => {
    if (board) {
      if (smallScreen) setNumberOfColumns(board.small_screen_columns);
      else if (mediumScreen) setNumberOfColumns(board.medium_screen_columns);
      else if (largeScreen) setNumberOfColumns(board.large_screen_columns);
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
  });

  useEffect(() => {
    loadPage();
    console.log("Loading page");
  }, [id]);

  const toggleForms = (segmentType: string) => {
    if (segmentType === "edit") {
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      editForm.current?.classList.remove("hidden");
    }
  };

  const handleGenerate = async () => {
    if (!checkCurrentUserTokens()) {
      alert(
        "Sorry, you do not have enough tokens to generate an image. Please purchase more tokens to continue."
      );
      console.error("User does not have enough tokens");
      return;
    }
    if (!image) {
      console.error("Image is missing");
      return;
    }
    const formData = new FormData();
    formData.append("image[label]", image.label);
    if (image.image_prompt) {
      formData.append("image[image_prompt]", image.image_prompt);
    }
    setLoadingMessage("Generating image");
    setShowLoading(true);
    const updatedImage = await generateImage(formData); // Ensure generateImage returns a Promise<Image>
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    await addImageToBoard(board.id, updatedImage.id); // Ensure addImageToBoard returns a Promise<Board>
    setImage(initialImage);

    setShowLoading(false);
    const message = `Image added to board: ${updatedImage.label}`;
    setToastMessage(message);
    // history.push(`/boards/${board.id}`);
  };

  const handleImagePromptInput = (e: CustomEvent) => {
    const newPrompt = e.detail.value;
    if (image) {
      setImage({ ...image, image_prompt: newPrompt });
    }
  };

  const handleLabelInput = (e: CustomEvent) => {
    const newLabel = e.detail.value;
    if (image) {
      setImage({ ...image, label: newLabel });
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
    console.log("Updated board: ", updatedBoard);
    const message = "Board layout saved";
    setToastMessage(message);
    setIsToastOpen(true);
    setBoard(updatedBoard);
    history.push(`/boards/${board?.id}`);
  };

  const handleCreateAdditionalImages = async () => {
    setLoadingMessage("Creating additional images");
    setShowLoading(true);
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    const updatedBoard = await createAdditionalImages(board?.id, numberOfWords);
    setBoard(updatedBoard);
    setShowLoading(false);
    const message = "Additional images created";
    setToastMessage(message);
    setIsToastOpen(true);
    // history.push(`/boards/${board?.id}`);
  };

  const handleGetAdditionalImages = async () => {
    setLoadingMessage("Getting additional images");
    setShowLoading(true);
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    const result = await getAddionalImages(board?.id, numberOfWords);
    const words = result["additional_words"];
    setAdditionalWords(words);
    setShowLoading(false);

    const message = "Additional images created";
    setToastMessage(message);
    setIsToastOpen(true);

    // history.push(`/boards/${board?.id}`);
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
        <IonContent className="ion-padding">
          <div className=" " ref={editForm}>
            <div className="w-11/12 lg:w-1/2 mx-auto">
              <div className=" mt-5 text-center">
                <IonButton
                  size="default"
                  fill="outline"
                  routerLink={`/boards/${id}`}
                >
                  {" "}
                  <p className="font-bold my-2">Return to board</p>
                </IonButton>
              </div>
              {currentUser?.admin && (
                <div className=" mt-5 text-center">
                  <IonButtons>
                    <IonButton
                      onClick={handleCreateAdditionalImages}
                      size="default"
                      fill="outline"
                    >
                      {" "}
                      <p className="font-bold my-2">
                        Create {numberOfWords} additional images
                      </p>
                    </IonButton>
                    <IonButton
                      onClick={handleGetAdditionalImages}
                      size="default"
                      fill="outline"
                    >
                      {" "}
                      <p className="font-bold my-2">Get additional words</p>
                    </IonButton>
                    <IonSelect
                      label="Number of words"
                      labelPlacement="stacked"
                      className="w-1/2 md:w-1/4 mx-auto"
                      value={numberOfWords}
                      placeholder="Select number of words"
                      onIonChange={(e) => setNumberOfWords(e.detail.value)}
                    >
                      <IonSelectOption value={5}>5</IonSelectOption>
                      <IonSelectOption value={10}>10</IonSelectOption>
                      <IonSelectOption value={15}>15</IonSelectOption>
                      <IonSelectOption value={20}>20</IonSelectOption>
                      <IonSelectOption value={25}>25</IonSelectOption>
                      <IonSelectOption value={30}>30</IonSelectOption>
                    </IonSelect>
                  </IonButtons>
                </div>
              )}
              <h1 className="text-center text-2xl font-bold">
                Editing {board?.name || "Board"}
              </h1>
              {board && (
                <BoardForm
                  board={board}
                  setBoard={setBoard}
                  onSubmit={loadPage}
                />
              )}
            </div>
            <div className="my-2 px-2 lg:px-8">
              {board && board.images && board.images.length > 0 && (
                <div className="pb-10">
                  <p className="text-center font-bold text-lg">
                    This board currently has {board.images.length} images.
                  </p>

                  {currentUser?.admin && (
                    <div className="p-4">
                      <h1 className="text-center text-2xl font-bold">
                        {additionalWords.length} additional words
                      </h1>
                      {additionalWords &&
                        additionalWords.map((word, index) => (
                          <span key={index} className="mx-1">
                            {word}
                          </span>
                        ))}
                    </div>
                  )}
                  <p className="text-center font-mono text-md">
                    Drag and drop to rearrange the layout.
                  </p>
                  <p className="text-center text-lg ">
                    You are currently viewing the layout for{" "}
                    <span className="font-bold">
                      {getScreenSizeName(currentScreenSize)}
                    </span>{" "}
                    screens ({currentNumberOfColumns} columns).
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

          <div className="mt-6 py-3 px-1 hidden text-center" ref={uploadForm}>
            <IonText className="text-lg">Upload your own image</IonText>
            {board && image && (
              <ImageCropper
                existingId={image.id}
                boardId={board.id}
                existingLabel={image.label}
              />
            )}
          </div>
          <div className="mt-2 hidden" ref={generateForm}>
            <IonList className="" lines="none">
              <IonItem className="my-2">
                <IonText className="font-bold text-xl mt-2">
                  Generate an board with AI
                </IonText>
              </IonItem>

              <IonItem className="mt-2 border-2">
                {board && (
                  <IonInput
                    className=""
                    aria-label="label"
                    value={image?.label}
                    placeholder="Enter label"
                    onIonInput={handleLabelInput}
                  ></IonInput>
                )}
              </IonItem>
              <IonItem className="mt-2 border-2">
                <IonLoading
                  className="loading-icon"
                  cssClass="loading-icon"
                  isOpen={showLoading}
                  message={loadingMessage}
                />
                {board && (
                  <IonTextarea
                    className=""
                    placeholder="Enter prompt"
                    onIonInput={handleImagePromptInput}
                  ></IonTextarea>
                )}
              </IonItem>
              <IonItem className="mt-2">
                <IonButton className="w-full text-lg" onClick={handleGenerate}>
                  Generate Image
                </IonButton>
              </IonItem>
              <IonItem className="mt-2 font-mono text-center">
                <IonText className="text-md">
                  This will generate an board based on the prompt you enter.
                </IonText>
              </IonItem>
              <IonItem className="mt-2 font-mono text-center text-red-400">
                <IonText className="ml-6"> It will cost 1 credit.</IonText>
              </IonItem>
            </IonList>
          </div>
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
