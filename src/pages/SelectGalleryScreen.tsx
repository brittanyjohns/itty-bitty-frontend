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
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import {
  arrowBackCircleOutline,
  cloudUploadOutline,
  createOutline,
  imagesOutline,
  refreshCircleOutline,
  toggle,
} from "ionicons/icons";
import {
  getBoard,
  addImageToBoard,
  Board,
  getRemainingImages,
} from "../data/boards"; // Adjust imports based on actual functions
import FileUploadForm from "../components/FileUploadForm";
import { generateImage, getMoreImages } from "../data/images";
import { Image } from "../data/images";
import BoardForm from "../components/BoardForm";
import SelectImageGallery from "../components/SelectImageGallery";
import ImageGalleryItem from "../components/ImageGalleryItem";
import "./ViewBoard.css";
import { useCurrentUser } from "../hooks/useCurrentUser";
interface SelectGalleryScreenProps {}
const SelectGalleryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const boardGrid = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("edit ");
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const editForm = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<Image | null>({
    id: "",
    src: "",
    label: "",
    image_prompt: "",
    audio: "",
    bg_color: "",
  });
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const imageGalleryWrapper = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Generating Image...");
  const { currentUser, setCurrentUser } = useCurrentUser();

  const checkCurrentUserTokens = (numberOfTokens: number = 1) => {
    console.log("currentUser", currentUser);
    if (
      currentUser &&
      currentUser.tokens &&
      currentUser.tokens >= numberOfTokens
    ) {
      return true;
    }
    return false;
  };

  const fetchBoard = async () => {
    const board = await getBoard(id); // Ensure getBoard is typed to return a Promise<Board>
    console.log("board", board);
    setBoard(board);
    toggleForms(segmentType);
    const remainingImgs = await getRemainingImages(board.id, 1, searchInput);
    setRemainingImages(remainingImgs);
    return board;
  };

  const handleGetMoreImages = async (
    page: number,
    query: string
  ): Promise<Image[]> => {
    const additionalImages = await getMoreImages(page, query);
    setRemainingImages(additionalImages);
    return additionalImages;
  };

  const handleSearchInput = async (event: CustomEvent) => {
    const query = event.detail.value.toLowerCase();
    setSearchInput(query);
    setPage(1); // Reset to first page on new search
  };

  useEffect(() => {
    async function getData() {
      console.log("id", id);
      const boardToSet = await fetchBoard();
      setBoard(boardToSet);
      toggleForms(segmentType);
    }
    getData();
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

  const handleDocClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = e.target as HTMLImageElement;
    history.push(`/images/${target.id}`);
  };

  const handleGenerate = async () => {
    console.log("Generate Image", image);
    if (!checkCurrentUserTokens()) {
      alert(
        "Sorry, you do not have enough tokens to generate an image. Please purchase more tokens to continue."
      );
      console.error("User does not have enough tokens");
      return;
    }
    if (!image) return;
    const formData = new FormData();
    formData.append("image[label]", image.label);
    if (image.image_prompt) {
      formData.append("image[image_prompt]", image.image_prompt);
    }
    setShowLoading(true);
    const updatedImage = await generateImage(formData); // Ensure generateImage returns a Promise<Image>
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    await addImageToBoard(board.id, updatedImage.id); // Ensure addImageToBoard returns a Promise<Board>
    setImage(null);

    setShowLoading(false);
    const message = `Image added to board: ${updatedImage.label}`;
    setToastMessage(message);
    history.push(`/boards/${board.id}`);
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

  const handleImageClick = (image: Image) => {
    setImage(image);
    setShowLoading(true);
    async function addSelectedImageToBoard() {
      if (!board?.id) {
        console.error("Board ID is missing");
        return;
      }
      const response = await addImageToBoard(board.id, image.id);
      const message = `Image added to board: ${response["name"]}`;
      setToastMessage(message);
      setShowLoading(false);
      setIsOpen(true);
    }
    addSelectedImageToBoard();
  };

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink={`/boards/${board?.id}`}>
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          {board && <IonTitle>{board.name}</IonTitle>}
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
            <IonSegmentButton value="edit">
              <IonLabel className="text-xl">
                <IonIcon icon={createOutline} />
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="gallery">
              <IonLabel className="text-xl">
                <IonIcon icon={imagesOutline} />
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="upload">
              <IonLabel className="text-xl">
                <IonIcon icon={cloudUploadOutline} />
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="generate">
              <IonLabel className="text-xl">
                <IonIcon icon={refreshCircleOutline} />
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={true}>
        <div className="ion-justify-content-center ion-align-items-center ion-text-center pt-1">
          <IonText className="font-bold text-2xl">
            {board && board.name}
          </IonText>
        </div>

        <div className="ion-padding" ref={editForm}>
          {board && <BoardForm board={board} setBoard={setBoard} />}
          <div className="">
            {board && board.images && board.images.length > 0 && (
              <div className="">
                <IonLabel className="font-sans text-sm">
                  There are currently {board.images.length} images in this
                  board. Click on an image to view it.
                </IonLabel>
                <div className="grid grid-cols-3 gap-4 mt-3" ref={boardGrid}>
                  {board?.images &&
                    board.images.map((img: Image, index: number) => (
                      <div
                        key={index}
                        className="relative"
                        onClick={handleDocClick}
                      >
                        <ImageGalleryItem key={index} image={img} />
                      </div>
                    ))}
                </div>
              </div>
            )}
            {board && board.images && board.images.length < 1 && (
              <div className="text-center">
                <p>No images found</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 py-3 px-1 hidden text-center" ref={uploadForm}>
          <IonText className="text-lg">Upload your own board</IonText>
          {board && (
            <FileUploadForm
              board={board}
              onCloseModal={undefined}
              showLabel={true}
              existingLabel={image?.label}
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
              <IonText className="text-sm">
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
    </IonPage>
  );
};

export default SelectGalleryScreen;
