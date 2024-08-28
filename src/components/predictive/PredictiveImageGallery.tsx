import React, { useEffect, useState } from "react";
import ImageComponent from "./ImageComponent";
import { Image, getPredictiveImages } from "../../data/images";
import { Board } from "../../data/boards";

interface PredictiveImageGalleryProps {
  predictiveBoard: Board;
  initialImages: Image[];
  onImageSpeak: (image: Image) => void;
  setImageId: (id: string) => void;
}

const PredictiveImageGallery: React.FC<PredictiveImageGalleryProps> = ({
  predictiveBoard: board,
  initialImages: images,
  onImageSpeak: handleImageSpeak,
  setImageId,
}) => {
  const [currentImages, setCurrentImages] = useState<Image[]>(images);

  const handleImageClick = async (image: Image) => {
    setImageId(image.id);
    handleImageSpeak(image);
    const newImages = await getPredictiveImages(image.id);
    console.log("newImages", newImages);
    console.log("currentImages", currentImages);
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
    console.log("board", board);
    setCurrentImages(images);
  }, [images]);

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-1">
      {currentImages &&
        currentImages.length > 0 &&
        currentImages.map((image, index) => (
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
