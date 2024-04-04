import React, { useEffect, useRef, useState } from "react";
import ImageComponent from "./ImageComponent";
import { PredictiveImage, getPredictiveImages } from "../data/images";
import { get } from "react-hook-form";
// import { TextToSpeech } from "@capacitor-community/text-to-speech";

interface PredictiveImageGalleryProps {
  initialImages: PredictiveImage[];
  onImageSpeak: (image: PredictiveImage) => void;
}

const PredictiveImageGallery: React.FC<PredictiveImageGalleryProps> = ({
  initialImages,
  onImageSpeak: handleImageSpeak,
}) => {
  const [currentImages, setCurrentImages] =
    useState<PredictiveImage[]>(initialImages);

  const handleImageClick = async (image: PredictiveImage) => {
    handleImageSpeak(image);
    const newImages = await getPredictiveImages(image.id);
    const allImages = [...newImages, ...currentImages];
    const uniqueImageIds = new Set(allImages.map((image) => image.id));
    const uniqueImages = Array.from(uniqueImageIds).map((id) =>
      allImages.find((image) => image.id === id)
    );

    const imagesToSet = uniqueImages.filter(
      (image) => image !== undefined
    ) as PredictiveImage[];

    setCurrentImages(imagesToSet);
  };

  useEffect(() => {
    setCurrentImages(initialImages);
  }, [initialImages]);

  return (
    <div className="grid grid-cols-4 gap-2">
      {currentImages.map((image, index) => (
        <div
          key={`${image.id}-${index}`}
          onClick={() => handleImageClick(image)}
          className={`cursor-pointer ${
            image.bg_color || "bg-white"
          } rounded-lg shadow-md p-1`}
        >
          <ImageComponent label={image.label} src={image.src} />
        </div>
      ))}
    </div>
  );
};

export default PredictiveImageGallery;
