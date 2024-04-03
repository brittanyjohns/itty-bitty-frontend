import React, { useEffect, useState } from "react";
import {
  Image,
  PredictiveImage,
  PredictiveImageGalleryProps,
  getPredictiveImages,
} from "../data/images";
import { IonImg, IonButton, IonButtons, IonTitle } from "@ionic/react";

const PredictiveImageGallery: React.FC<PredictiveImageGalleryProps> = ({
  predictiveImages,
  boardId,
  onImageClick,
}) => {
  const handleOnImageClick = (image: PredictiveImage) => {
    console.log("PredictiveImage Clicked", image);
    onImageClick(image);
  };

  useEffect(() => {
    console.log("PredictiveImageGallery - predictiveImages", predictiveImages);
  }, [predictiveImages]);

  return (
    <div className="ion-padding h-full">
      {predictiveImages && (
        <div className="mt-1">
          <div
            className="my-auto mx-auto grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1"
            key={predictiveImages.length}
          >
            {predictiveImages.map((image, i) => (
              <div
                className="flex relative w-full hover:cursor-pointer text-center min-h-24 m-1"
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
            {predictiveImages.length < 1 && (
              <p className="col-span-3 text-center">No images found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveImageGallery;
