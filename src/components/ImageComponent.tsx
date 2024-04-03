// ImageComponent.tsx
import { IonImg } from "@ionic/react";
import React from "react";

interface ImageComponentProps {
  label: string;
  src: string; // Assuming this is the direct image URL
  audioSrc?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  label,
  src,
  audioSrc,
}) => {
  return (
    <div className="cursor-pointer relative">
      {/* Use IonImg for built-in lazy loading */}
      <IonImg src={src} alt={label} className="ion-img-contain mx-auto" />
      <span className="font-medium pl-1 text-xs md:text-sm lg:text-md bg-white overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
        {label.length > 15 ? `${label.substring(0, 15)}...` : label}
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
