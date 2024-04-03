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
    setCurrentImages(newImages);
  };

  useEffect(() => {
    setCurrentImages(initialImages);
  }, [initialImages]);

  return (
    <div className="grid grid-cols-4 gap-1">
      {currentImages.map((image, index) => (
        <div
          key={image.id}
          onClick={() => handleImageClick(image)}
          className="cursor-pointer bg-white rounded-lg shadow-md p-1"
        >
          <ImageComponent label={image.label} src={image.src} />
        </div>
      ))}
    </div>
  );
};

export default PredictiveImageGallery;
