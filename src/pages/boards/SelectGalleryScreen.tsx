import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonSearchbar,
  IonText,
  IonToast,
  useIonViewDidLeave,
} from "@ionic/react";
import { useParams } from "react-router";
import { addCircleOutline, create, createOutline } from "ionicons/icons";
import {
  getBoard,
  addImagesToBoard,
  Board,
  getRemainingImages,
} from "../../data/boards"; // Adjust imports based on actual functions
import { createImage, getMoreImages } from "../../data/images";
import { Image } from "../../data/images";
import SelectImageGallery from "../../components/images/SelectImageGallery";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import SideMenu from "../../components/main_menu/SideMenu";
import ImageCropper from "../../components/images/ImageCropper";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import { set } from "d3";

const SelectGalleryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("gallery");
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const editForm = useRef<HTMLDivElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images
  const [searchInput, setSearchInput] = useState("");
  const imageGalleryWrapper = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading board");
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  const [showCreateBtn, setShowCreateBtn] = useState(false);
  const [numberOfColumns, setNumberOfColumns] = useState(4); // Default number of columns
  const [showEdit, setShowEdit] = useState(false);

  const initialImage = {
    id: "",
    src: "",
    label: "",
    image_prompt: "",
    audio: "",
    bg_color: "",
    layout: [],
    audio_url: "",
  };
  const [image, setImage] = useState<Image | null>(initialImage);

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
    console.log("Query: ", query);
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

  const [imageIds, setImageIds] = useState<string[]>([]);

  const handleImageClick = (image: Image) => {
    setImage(image);
    setLoadingMessage("Adding image to board");
    setImageIds([...imageIds, image.id]);
  };

  const addSelectedImageToBoard = async () => {
    setLoadingMessage("Adding images to board");
    setShowLoading(true);
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    const response = await addImagesToBoard(board.id, imageIds);
    let message = "";
    if (response["new_board_images"]) {
      message = `Added ${response["new_board_images"].length} images to board: ${response["board"]["name"]}`;
      setToastMessage(message);
    } else {
      message = `${response["error"]}`;
      setToastMessage(message);
    }
    setShowLoading(false);
    setIsOpen(true);
    setImageIds([]);
  };

  useIonViewDidLeave(() => {
    setImageIds([]);
  }, []);

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
      <SideMenu
        pageTitle={board?.name}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle={board?.name}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle={board?.name}
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
          endLink={`/boards/${id}/edit`}
          endIcon={createOutline}
        />
        <IonContent>
          <div className="mt-3 py-3 px-1 hidden" ref={uploadForm}>
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
          <div
            className="hidden w-full md:w-5/6 mx-auto py-3 px-1"
            ref={imageGalleryWrapper}
          >
            <div className=" mt-5 text-center">
              <IonButton
                size="small"
                fill="outline"
                routerLink={`/boards/${id}`}
              >
                {" "}
                <p className="font-bold text-sm">Return to board</p>
              </IonButton>
            </div>
            <h2 className="font-sans text-sm md:text-xl lg:text-xl text-center mt-4">
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
            <p className="text-center mt-2">
              {imageIds.length} images selected for board
            </p>
            <IonButtons className="flex justify-center my-2">
              <IonButton
                className="w-full md:w-1/2 mx-auto my-2"
                size="large"
                fill="outline"
                onClick={addSelectedImageToBoard}
              >
                Add selected images to board
              </IonButton>
            </IonButtons>
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
