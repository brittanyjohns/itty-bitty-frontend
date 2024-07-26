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
  IonMenuButton,
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
import { addCircleOutline } from "ionicons/icons";
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
import SelectImageGallery from "../../components/images/SelectImageGallery";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import MainMenu from "../../components/main_menu/MainMenu";
import ImageCropper from "../../components/images/ImageCropper";

const SelectGalleryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const boardGrid = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("gallery");
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
    setNumberOfColumns(board.number_of_columns);
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
    const additionalImages = await getMoreImages(page, query, false);
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
    console.log("Board to set: ", boardToSet);
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
      handleImageClick(newImage);
    }
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="secondary">
              <IonButton>
                {/* <IonIcon slot="icon-only" icon={personCircle}></IonIcon> */}
                <IonMenuButton></IonMenuButton>
              </IonButton>
            </IonButtons>
            <IonButtons slot="primary">
              <IonButton routerLink="/boards/new">
                <IonIcon
                  slot="icon-only"
                  ios={addCircleOutline}
                  md={addCircleOutline}
                ></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle>{board?.name || "Board"}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent scrollY={true}>
          <div className="mt-6 py-3 px-1 hidden" ref={uploadForm}>
            <p className="text-sm md:text-md lg:text-lg text-center">
              Upload your own image
            </p>
            {board && image && (
              <ImageCropper
                existingId={image.id}
                boardId={board.id}
                existingLabel={image.label}
              />
            )}
          </div>
          <div className="mt-2 hidden" ref={generateForm}>
            <IonList className="w-full md:w-1/2 mx-auto" lines="none">
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
                <IonButton
                  className="w-full text-sm md:text-md lg:text-lg"
                  onClick={handleGenerate}
                >
                  Generate Image
                </IonButton>
              </IonItem>
              <IonItem className="mt-2 font-mono text-center">
                <IonText className="text-sm md:text-md lg:text-lg">
                  This will generate an board based on the prompt you enter.
                </IonText>
              </IonItem>
              <IonItem className="mt-2 font-mono text-center text-red-400">
                <IonText className="ml-6"> It will cost 1 credit.</IonText>
              </IonItem>
            </IonList>
          </div>

          <div className="hidden" ref={imageGalleryWrapper}>
            <h2 className="font-sans text-md md:text-xl lg:text-2xl text-center mt-4">
              Search for images - Click to add to board
            </h2>

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
