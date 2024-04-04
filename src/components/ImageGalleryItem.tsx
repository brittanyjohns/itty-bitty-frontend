import { IonImg } from "@ionic/react";
import { Image } from "../data/images";

interface ImageGalleryItemProps {
  image: Image;
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({ image }) => {
  return (
    <div className="cursor-pointer relative bg-white rounded-lg shadow-md">
      {/* Use IonImg for built-in lazy loading */}
      <IonImg
        src={image.src}
        alt={image.label}
        className="ion-img-contain mx-auto"
      />
      <span className="font-medium pl-1 text-xs md:text-sm lg:text-md bg-white overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
        {image.label.length > 15
          ? `${image.label.substring(0, 15)}...`
          : image.label}
      </span>
      {/* Audio, if applicable */}
      {image.audio && (
        <audio>
          <source src={image.audio} type="audio/aac" />
        </audio>
      )}
    </div>
  );
};

export default ImageGalleryItem;
