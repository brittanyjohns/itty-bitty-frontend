import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, SelectImageGalleryProps } from "../../data/images";
import {
  IonImg,
  IonButton,
  IonButtons,
  IonTitle,
  IonActionSheet,
  IonIcon,
} from "@ionic/react";
import { generatePlaceholderImage } from "../../data/utils";
import { personCircleOutline, trashBinOutline } from "ionicons/icons";
import { useCurrentUser } from "../../contexts/UserContext";

const SelectImageGallery: React.FC<SelectImageGalleryProps> = ({
  images,
  onImageClick,
  onLoadMoreImages,
  searchInput,
}) => {
  const [remainingImages, setRemainingImages] = useState<Image[]>(images);
  const [page, setPage] = useState(1);
  const [showActionList, setShowActionList] = useState(false);
  const { currentUser } = useCurrentUser();

  const isUserImage = (image: Image) => {
    return image.user_id === currentUser?.id;
  };

  // const placeholderUrl = useMemo(() => generatePlaceholderImage(image.label), [image.label]);
  const fetchImages = async () => {
    if (searchInput.length > 1) {
      setPage(1);
    }
    const imgs = await onLoadMoreImages(page, searchInput);
    setRemainingImages(imgs);
  };

  useEffect(() => {
    fetchImages();
  }, [page, searchInput]);

  useEffect(() => {
    setRemainingImages(images);
  }, [images]);

  const handleOnImageClick = (event: any, image: Image) => {
    onImageClick(image);
  };

  const onClose = () => {
    setShowActionList(false);
  };

  return (
    <div className="h-full">
      <div>
        <IonButtons className="flex justify-between w-full text-center">
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
          className="my-auto mx-auto grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1"
          key={remainingImages.length}
        >
          {remainingImages &&
            remainingImages.map((image, i) => (
              <div
                className={`flex relative w-full hover:cursor-pointer text-center min-h-24 p-1 cursor-pointer ${
                  image.bg_color || "bg-white"
                } rounded-sm`}
                onClick={(event) => handleOnImageClick(event, image)}
                key={image.id}
                id={`image_${image.id}`}
              >
                <IonImg
                  src={image.src || generatePlaceholderImage(image.label)}
                  alt={image.label}
                  className="ion-img-contain mx-auto"
                  style={{ width: "100%", height: "auto" }} // Make sure the image takes full width
                />

                {isUserImage(image) && (
                  <IonIcon
                    slot="icon-only"
                    icon={personCircleOutline}
                    size="small"
                    color="dark"
                    title="Your image"
                    className="tiny absolute top-0 right-0 m-1 shadow-md bg-white bg-opacity-90 rounded-full p-1"
                  />
                )}
                <div
                  className={`font-medium text-xs md:text-sm lg:text-md rounded-sm shadow-md bg-white bg-opacity-95 overflow-hidden absolute bottom-0 left-0 right-0 p-0 mt-2`}
                >
                  {image.label}
                  <audio>
                    <source src={image.audio} type="audio/aac" />
                  </audio>
                </div>
              </div>
            ))}
          {remainingImages.length < 1 && (
            <p className="col-span-3 text-center">No images found</p>
          )}
        </div>
        {remainingImages.length > 12 && (
          <IonButtons className="flex justify-between w-full my-3 text-center">
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
