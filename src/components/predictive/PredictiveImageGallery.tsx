import React, { useEffect, useRef, useState } from "react";
import ImageComponent from "./ImageComponent";
import { Image, getPredictiveImages } from "../../data/images";

interface PredictiveImageGalleryProps {
  initialImages: Image[];
  onImageSpeak: (image: Image) => void;
}

const PredictiveImageGallery: React.FC<PredictiveImageGalleryProps> = ({
  initialImages: images,
  onImageSpeak: handleImageSpeak,
}) => {
  const [currentImages, setCurrentImages] = useState<Image[]>(images);

  const handleImageClick = async (image: Image) => {
    handleImageSpeak(image);
    const newImages = await getPredictiveImages(image.id);
    const allImages = [...newImages, ...currentImages];
    const uniqueImageIds = new Set(allImages.map((image) => image.id));
    const uniqueImages = Array.from(uniqueImageIds).map((id) =>
      allImages.find((image) => image.id === id)
    );

    const imagesToSet = uniqueImages.filter(
      (image) => image !== undefined
    ) as Image[];

    setCurrentImages(imagesToSet);
  };

  useEffect(() => {
    setCurrentImages(images);
  }, [images]);

  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1">
      {currentImages.map((image, index) => (
        <div
          key={`${image.id}-${index}`}
          onClick={() => handleImageClick(image)}
          className={`cursor-pointer relative ${
            image.bg_color || "bg-white"
          } rounded-lg shadow-md p-1`}
        >
          {image && (
            <ImageComponent
              label={image.label}
              src={image.src}
              bg_color={image.bg_color}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PredictiveImageGallery;
