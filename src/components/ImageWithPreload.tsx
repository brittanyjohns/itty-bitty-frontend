// ImageWithPreload.tsx
import React, { useEffect } from "react";

interface ImageWithPreloadProps {
  src: string; // The current image URL
  nextImageIds: string[]; // IDs of images to preload
  onClick: () => void; // Function to handle the click event
  getImageUrlById: (id: string) => string; // Function to get image URL by ID
}

const ImageWithPreload: React.FC<ImageWithPreloadProps> = ({
  src,
  nextImageIds,
  onClick,
  getImageUrlById,
}) => {
  useEffect(() => {
    // Preload images as soon as the component mounts or nextImageIds change
    nextImageIds.forEach((id) => {
      const img = new Image();
      img.src = getImageUrlById(id); // Assume you have a way to convert an ID to a URL
    });
  }, [nextImageIds, getImageUrlById]);

  return <img src={src} onClick={onClick} alt="" />;
};
