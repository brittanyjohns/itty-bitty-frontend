import { IonImg } from "@ionic/react";
import React, { useMemo } from "react";
import { generatePlaceholderImage } from "../../data/utils";

interface ImageComponentProps {
  label: string;
  src: string | null; // Assuming this is the direct image URL
  audioSrc?: string;
  bg_color?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  label,
  src,
  audioSrc,
  bg_color,
}) => {
  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(label),
    [label]
  );
  return (
    <div
      className={`cursor-pointer ${
        bg_color || "bg-white"
      } rounded-lg shadow-md p-1`}
    >
      {/* Use IonImg for built-in lazy loading */}
      <IonImg
        src={src || placeholderUrl}
        alt={label}
        className="ion-img-contain mx-auto"
      />
      <span className="font-medium pl-1 text-xs md:text-sm lg:text-md bg-white bg-opacity-95 overflow-hidden absolute bottom-0 left-0 right-0 p-0">
        {label?.length && label.length > 15
          ? `${label.substring(0, 15)}...`
          : label}
      </span>
      {/* Audio, if applicable */}
      {audioSrc && (
        <audio>
          <source src={audioSrc} type="audio/aac" />
        </audio>
      )}
    </div>
  );
};

export default ImageComponent;
