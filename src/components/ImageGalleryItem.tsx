import {
  IonImg,
} from '@ionic/react';
import { Image } from '../data/images';

interface ImageGalleryItemProps {
  image: Image;

}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({ image }) => {
  return (
    <>
      <IonImg id={image.id} src={image.src} alt={image.label} className="ion-img-contain mx-auto" />
      <span className="font-medium text-xs md:text-sm lg:text-md bg-white rounded-sm overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
        {image.label.length > 15 ? image.label.substring(0, 20) + "..." : image.label}
        <audio>
          <source src={image.audio} type="audio/aac" />
        </audio>
      </span>
      </>
  );
};

export default ImageGalleryItem;
