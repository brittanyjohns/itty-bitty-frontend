import React, { useEffect } from "react";
import ImageComponent from "./ImageComponent";
import { PredictiveImage } from "../data/images"; // Ensure this is the correct import

interface PredictiveImageGalleryProps {
  initialImages: PredictiveImage[];
}

const PredictiveImageGallery: React.FC<PredictiveImageGalleryProps> = ({
  initialImages,
}) => {
  useEffect(() => {
    // Preload images
    initialImages.forEach((image) => {
      image.nextImageIds.forEach((id) => {
        const img = new Image();
        img.src = image.src; // Assuming `src` is directly usable
      });
    });
  }, [initialImages]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {initialImages.map((image) => (
        <ImageComponent
          key={image.id}
          label={image.label}
          src={image.src}
          audioSrc={image.audio}
          onClick={() => console.log(`Clicked on image ${image.id}`)}
        />
      ))}
    </div>
  );
};

export default PredictiveImageGallery;
