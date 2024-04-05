import React, { useEffect, useState } from "react";
import { Image, SelectImageGalleryProps } from "../data/images";
import { IonImg, IonButton, IonButtons, IonTitle } from "@ionic/react";

const SelectImageGallery: React.FC<SelectImageGalleryProps> = ({
  images,
  boardId,
  onImageClick,
  onLoadMoreImages,
  searchInput,
}) => {
  const [remainingImages, setRemainingImages] = useState<Image[]>(images);
  const [page, setPage] = useState(1);
  // const [searchInput, setSearchInput] = useState('');
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

  const handleOnImageClick = (image: Image) => {
    onImageClick(image);
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
                onClick={() => handleOnImageClick(image)}
                key={image.id}
                id={`image_${image.id}`}
              >
                <IonImg
                  src={image.src}
                  alt={image.label}
                  className="absolute object-contain w-full h-full top-0 left-0"
                />
                <div className="font-medium text-xs md:text-sm lg:text-md bg-white bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black mt-2">
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
