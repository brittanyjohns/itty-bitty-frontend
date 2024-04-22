import React, { useEffect, useRef, useState } from "react";
import { Image, SelectImageGalleryProps } from "../data/images";
import {
  IonImg,
  IonButton,
  IonButtons,
  IonTitle,
  IonActionSheet,
} from "@ionic/react";
import { useHistory } from "react-router";
import { addImageToBoard, getUserBoards } from "../data/boards";

const SelectImageGallery: React.FC<SelectImageGalleryProps> = ({
  images,
  boardId,
  onImageClick,
  onLoadMoreImages,
  searchInput,
}) => {
  const [remainingImages, setRemainingImages] = useState<Image[]>(images);
  const [page, setPage] = useState(1);
  const [showActionList, setShowActionList] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [disableActionList, setDisableActionList] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [userBoards, setUserBoards] = useState([]);
  const history = useHistory();
  const fetchImages = async () => {
    if (searchInput.length > 1) {
      setPage(1);
    }
    const imgs = await onLoadMoreImages(page, searchInput);
    setRemainingImages(imgs);
  };

  const fetchUserBoards = async () => {
    // Fetch user boards
    const fetchedBoards = await getUserBoards();
    setUserBoards(fetchedBoards["boards"]);
  };
  useEffect(() => {
    fetchImages();
  }, [page, searchInput]);

  useEffect(() => {
    fetchUserBoards();
  }, []);

  useEffect(() => {
    setRemainingImages(images);
  }, [images]);

  const handleOnImageClick = (event: any, image: Image) => {
    console.log("Event: ", event);
    console.log("Image clicked", image, selectedImage);
    if (showActionList) {
      console.log("Action list is open, not handling click");
      return;
    }
    onImageClick(image);
  };

  const handleButtonPress = (image: Image) => {
    if (selectedImage === null) {
      console.log("No selected image, setting selected image", image);
      setSelectedImage(image);
    } else {
      console.log("Selected image: ", selectedImage);
    }
    if (disableActionList) {
      console.log("Action list disabled");
      return;
    }
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    longPressTimer.current = setTimeout(() => {
      console.log("Long press detected", image.id, selectedImage);
      setSelectedImage(image);
      setShowActionList(true);
    }, 1000);
  };

  const handleButtonRelease = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleActionSelected = async (
    action: string,
    imageId: string,
    selectedBoardId: string
  ) => {
    if (action === "add") {
      if (!selectedBoardId) {
        console.error("Board ID not provided");
        return;
      }
      const result = await addImageToBoard(selectedBoardId, imageId);
      console.log("Image added to board: ", result);
      history.push(`/boards/${selectedBoardId}/gallery`);
    } else {
      console.log("Unknown action: ", action);
    }
  };

  const setBoardButtons = () => {
    const imageBtns = userBoards.map((board: any) => {
      return {
        text: board.name,
        handler: () => {
          if (selectedImage) {
            handleActionSelected("add", selectedImage.id, board.id);
          }
        },
      };
    });
    return imageBtns;
  };
  const imageBtns = setBoardButtons();

  const onClose = () => {
    setShowActionList(false);
  };

  return (
    <div className="ion-padding h-full">
      <div>
        <IonButtons class="flex justify-between w-full text-center">
          <IonButton
            disabled={page <= 1}
            onClick={() => setPage((oldPage) => Math.max(1, oldPage - 1))}
          >
            Prev
          </IonButton>
          <IonTitle>Page {page}</IonTitle>
          <IonButton onClick={() => setPage((oldPage) => oldPage + 1)}>
            Next
          </IonButton>
        </IonButtons>
      </div>
      <div className="mt-1">
        <div
          className="my-auto mx-auto grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1"
          key={remainingImages.length}
        >
          {remainingImages &&
            remainingImages.map((image, i) => (
              <div
                className="flex relative w-full hover:cursor-pointer text-center min-h-24 p-1 bg-white rounded-md"
                onClick={(event) => handleOnImageClick(event, image)}
                onTouchStart={() => handleButtonPress(image)}
                onTouchEnd={handleButtonRelease}
                key={image.id}
                id={`image_${image.id}`}
              >
                <IonImg
                  src={image.src}
                  alt={image.label}
                  className="absolute object-contain w-full h-full top-0 left-0"
                />
                <div
                  className={`font-medium text-xs md:text-sm lg:text-md cursor-pointer ${
                    image.bg_color || "bg-white"
                  } rounded-lg shadow-md bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black mt-2`}
                >
                  {image.label}
                  <audio>
                    <source src={image.audio} type="audio/aac" />
                  </audio>
                </div>
                <IonActionSheet
                  isOpen={showActionList}
                  onDidDismiss={onClose}
                  header={`Add ${selectedImage?.label} to board`}
                  buttons={imageBtns}
                />
              </div>
            ))}
          {remainingImages.length < 1 && (
            <p className="col-span-3 text-center">No images found</p>
          )}
        </div>
        {remainingImages.length > 12 && (
          <IonButtons class="flex justify-between w-full my-3 text-center">
            <IonButton
              disabled={page <= 1}
              onClick={() => setPage((oldPage) => Math.max(1, oldPage - 1))}
            >
              Prev
            </IonButton>
            <IonTitle>Page {page}</IonTitle>
            <IonButton onClick={() => setPage((oldPage) => oldPage + 1)}>
              Next
            </IonButton>
          </IonButtons>
        )}
      </div>
    </div>
  );
};

export default SelectImageGallery;
