import {
  IonButton,
  IonImg,
  IonItem,
  IonLabel,
  IonNote
} from '@ionic/react';
import { Image } from '../data/images';
// import './ImageGalleryItem.css';
import ActionList from './ActionList';

interface ImageGalleryItemProps {
  image: Image;

}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({ image }) => {
  return (
    <>
      <IonImg id={image.id} src={image.src} alt={image.label} className="ion-img-contain mx-auto" />
      <span className="font-medium text-xs md:text-sm lg:text-md rounded-sm bg-white bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
        {image.label.length > 15 ? image.label.substring(0, 20) + "..." : image.label}
        <audio>
          <source src={image.audio} type="audio/aac" />
        </audio>
      </span>
      </>
  );
};

export default ImageGalleryItem;
