import { IonImg } from "@ionic/react";
import React from "react";

interface ImageComponentProps {
  label: string;
  src: string;
  audioSrc?: string;
  onClick: () => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  label,
  src,
  audioSrc,
  onClick,
}) => {
  return (
    <div onClick={onClick} className="cursor-pointer relative">
      <IonImg src={src} alt={label} className="ion-img-contain mx-auto" />
      <span className="font-medium pl-1 text-xs md:text-sm lg:text-md bg-white overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
        {label.length > 15 ? `${label.substring(0, 15)}...` : label}
      </span>
      {audioSrc && (
        <audio>
          <source src={audioSrc} type="audio/aac" />
        </audio>
      )}
    </div>
  );
};

export default ImageComponent;
