import React, { useEffect, useState } from "react";
import ImageComponent from "./ImageComponent";
import { Image, getPredictiveImages } from "../../data/images";
import { Board } from "../../data/boards";
import { getPredictiveBoardImages } from "../../data/board_images";

interface PredictiveImageGalleryProps {
  initialImages: any[];
  onImageSpeak: (image: any) => void;
  setImageId: (id: string) => void;
  imageType: string;
}

const PredictiveImageGallery: React.FC<PredictiveImageGalleryProps> = ({
  initialImages: images,
  onImageSpeak: handleImageSpeak,
  setImageId,
  imageType,
}) => {
  const [currentImages, setCurrentImages] = useState<any[]>(images);

  const handleImageClick = async (image: any) => {
    setImageId(image.id);
    handleImageSpeak(image);
    let newImages: any[] = [];
    if (imageType === "predictive") {
      // await loadPredictiveImages(image);
      console.log("loadPredictiveImages", image.id);
    } else if (imageType === "board_image") {
      console.log("loadBoardImages");
      newImages = await getPredictiveBoardImages(image.id);
    } else {
      console.log("loadImages");
      newImages = await getPredictiveImages(image.id);
    }

    console.log("newImages", newImages);
    console.log("currentImages", currentImages);
    const allImages = [...newImages, ...currentImages];
    const uniqueImageIds = new Set(allImages.map((image) => image.id));
    const uniqueImages = Array.from(uniqueImageIds).map((id) =>
      allImages.find((image) => image.id === id)
    );

    const imagesToSet = uniqueImages.filter(
      (image) => image !== undefined
    ) as any[];

    setCurrentImages(imagesToSet);
  };

  useEffect(() => {
    setCurrentImages(images);
    console.log("imageType", imageType);
    console.log("gallery - images", images);
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
