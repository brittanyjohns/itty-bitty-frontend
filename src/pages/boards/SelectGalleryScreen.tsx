import React, { useState, useEffect, useRef } from "react";
import {
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
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import {
  addCircleOutline,
  appsOutline,
  arrowBackCircleOutline,
  cloudUploadOutline,
  createOutline,
  imagesOutline,
  refreshCircleOutline,
  refreshOutline,
} from "ionicons/icons";
import {
  getBoard,
  addImageToBoard,
  Board,
  getRemainingImages,
  saveLayout,
  rearrangeImages,
  deleteBoard,
} from "../../data/boards"; // Adjust imports based on actual functions
import { createImage, generateImage, getMoreImages } from "../../data/images";
import { Image } from "../../data/images";
import BoardForm from "../../components/boards/BoardForm";
import SelectImageGallery from "../../components/images/SelectImageGallery";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import DraggableGrid from "../../components/images/DraggableGrid";
import MainMenu from "../../components/main_menu/MainMenu";
import ImageCropper from "../../components/images/ImageCropper";
import ConfirmDeleteAlert from "../../components/utils/ConfirmDeleteAlert";

interface SelectGalleryScreenProps {}
const SelectGalleryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const boardGrid = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("edit");
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const editForm = useRef<HTMLDivElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images
  const [searchInput, setSearchInput] = useState("");
  const imageGalleryWrapper = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading board");
  const { currentUser, isWideScreen } = useCurrentUser();
  const [gridLayout, setGridLayout] = useState([]);
  const [showCreateBtn, setShowCreateBtn] = useState(false);
  const [numberOfColumns, setNumberOfColumns] = useState(4); // Default number of columns
  const [showEdit, setShowEdit] = useState(false);
  const params = useParams<{ id: string }>();

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
      console.log("Removing board: ", boardId);
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
    history.push(`/boards/${board?.id}`);
    window.location.reload();
  };

  const fetchBoard = async () => {
    // setShowLoading(true);
    const board = await getBoard(id); // Ensure getBoard is typed to return a Promise<Board>
    setBoard(board);
    setNumberOfColumns(board.number_of_columns);
    // toggleForms(segmentType);
    // const remainingImgs = await getRemainingImages(board.id, 1, searchInput);
    // setRemainingImages(remainingImgs);
    // setShowLoading(false);
    return board;
  };

  const fetchRemaining = async (id: string, page: number) => {
    const remainingImgs = await getRemainingImages(id, page, searchInput);
    setRemainingImages(remainingImgs);
  };

  const handleGetMoreImages = async (
    page: number,
    query: string
  ): Promise<Image[]> => {
    const additionalImages = await getMoreImages(page, query);
    setRemainingImages(additionalImages);
    setShowCreateBtn(additionalImages.length < 5 && query.length > 0);
    return additionalImages;
  };

  const handleSearchInput = async (event: CustomEvent) => {
    const query = event.detail.value.toLowerCase();
    setSearchInput(query);
    setPage(1); // Reset to first page on new search
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
    // toggleForms("edit");
    setSearchInput("");
    setPage(1);
  });

  useEffect(() => {
    loadPage();
  }, []);

  const toggleForms = (segmentType: string) => {
    if (segmentType === "generate") {
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.remove("hidden");
      editForm.current?.classList.add("hidden");
      imageGalleryWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "upload") {
      uploadForm.current?.classList.remove("hidden");
      generateForm.current?.classList.add("hidden");
      editForm.current?.classList.add("hidden");
      imageGalleryWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "gallery") {
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      editForm.current?.classList.add("hidden");
      imageGalleryWrapper.current?.classList.remove("hidden");
    }

    if (segmentType === "edit") {
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      editForm.current?.classList.remove("hidden");
      imageGalleryWrapper.current?.classList.add("hidden");
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

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
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

  const setGrid = (layout: any) => {
    setGridLayout(layout);
  };

  const handleSaveLayout = async () => {
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    const updatedBoard = await saveLayout(board.id, gridLayout);
    const message = "Board layout saved";
    setToastMessage(message);
    setIsOpen(true);
    setBoard(updatedBoard);
    history.push(`/boards/${board?.id}`);
  };

  const handleImageClick = (image: Image) => {
    setImage(image);
    setLoadingMessage("Adding image to board");
    setShowLoading(true);
    async function addSelectedImageToBoard() {
      if (!board?.id) {
        console.error("Board ID is missing");
        return;
      }
      const response = await addImageToBoard(board.id, image.id);
      let message = "";
      if (response["board"]) {
        message = `Image added to board: ${response["board"]["name"]}`;
        setToastMessage(message);
      } else {
        message = `${response["error"]}`;
        setToastMessage(message);
      }
      setShowLoading(false);
      setIsOpen(true);
    }
    addSelectedImageToBoard();
    handleRearrangeImages();
  };

  const handleCreateImage = async (label: string) => {
    setLoadingMessage("Creating image");
    setShowLoading(true);
    const formData = new FormData();
    formData.append("image[label]", label);
    const newImage = await createImage(formData);
    setShowLoading(false);
    if (newImage) {
      // history.push(`/images/${newImage.id}`);
      handleImageClick(newImage);
    }
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink={`/boards/${board?.id}`}>
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
              <IonSegmentButton value="edit">
                <IonLabel className="text-lg">Edit</IonLabel>
                <IonIcon icon={createOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="gallery">
                <IonLabel className="text-lg">Gallery</IonLabel>
                <IonIcon icon={imagesOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="upload">
                <IonLabel className="text-lg">Upload</IonLabel>
                <IonIcon icon={cloudUploadOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="generate">
                <IonLabel className="text-lg">Generate</IonLabel>
                <IonIcon icon={refreshCircleOutline} />
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" scrollY={true}>
          <div className="ion-justify-content-center ion-align-items-center ion-text-center pt-1">
            <IonText className="font-bold text-2xl">
              {board && board.name}{" "}
            </IonText>
            <IonIcon icon={refreshOutline} onClick={fetchBoard} />
          </div>

          <div className="lg:px-12" ref={editForm}>
            <div className="mb-2">
              <IonText className="text-sm text-gray-500">
                Voice: {board?.voice}
              </IonText>
            </div>
            <div className="w-11/12 lg:w-1/2 mx-auto">
              {board && (
                <BoardForm
                  board={board}
                  setBoard={setBoard}
                  onSubmit={loadPage}
                />
              )}
            </div>
            <div className="mt-6 px-4 lg:px-12">
              {board && board.images && board.images.length > 0 && (
                <div className="">
                  <p className="text-center font-bold text-lg">
                    This board currently has {board.images.length} images.
                  </p>
                  <p className="text-center font-bold text-md">
                    Drag and drop to rearrange the layout.
                  </p>

                  <IonButton
                    className="my-5 block w-5/6 mx-auto text-md"
                    onClick={handleSaveLayout}
                  >
                    Save Layout
                  </IonButton>
                  <IonLabel
                    className="text-sm text-gray-500"
                    onClick={handleRearrangeImages}
                  >
                    Reset layout
                    <IonIcon icon={appsOutline} />
                  </IonLabel>
                  <DraggableGrid
                    images={board.images}
                    columns={numberOfColumns}
                    onLayoutChange={(layout: any) => setGrid(layout)}
                    mute={true}
                    enableResize={true}
                  />
                </div>
              )}
              {board && board.images && board.images.length < 1 && (
                <div className="text-center">
                  <p>No images found</p>
                </div>
              )}
            </div>
            <div className="flex justify-end items-center px-4">
              {showEdit && (
                <ConfirmDeleteAlert
                  onConfirm={removeBoard}
                  onCanceled={() => {}}
                />
              )}
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

          <div className="hidden" ref={imageGalleryWrapper}>
            <IonLabel className="font-sans text-sm">
              Search for images - Click to add to board
            </IonLabel>
            <IonSearchbar
              className="mt-2"
              onIonChange={handleSearchInput}
            ></IonSearchbar>
            {showCreateBtn && (
              <IonList>
                <IonItem slot="start" className="w-full">
                  <IonText>
                    {" "}
                    Create a new image for:
                    <strong> {searchInput}</strong>.
                  </IonText>
                  <IonButton
                    slot="end"
                    size="small"
                    onClick={() => handleCreateImage(searchInput)}
                  >
                    <IonIcon slot="icon-only" icon={addCircleOutline} />
                  </IonButton>
                </IonItem>
              </IonList>
            )}
            {remainingImages && (
              <SelectImageGallery
                boardId={board?.id}
                onImageClick={handleImageClick}
                onLoadMoreImages={handleGetMoreImages}
                searchInput={searchInput}
                images={remainingImages}
              />
            )}
          </div>
          <IonToast
            isOpen={isOpen}
            message={toastMessage}
            onDidDismiss={() => setIsOpen(false)}
            duration={2000}
          ></IonToast>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default SelectGalleryScreen;
