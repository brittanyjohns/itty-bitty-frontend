import React, { useState } from "react";
import { IonAlert, IonIcon, IonImg, useIonViewDidLeave } from "@ionic/react";
import { Image } from "../../data/images";
import { removeImageFromBoard } from "../../data/boards";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { trashBinOutline } from "ionicons/icons";
import { useHistory } from "react-router";

interface ImageGalleryItemProps {
  image: Image;
  board?: any;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  mute?: boolean;
  onPlayAudioList?: any;
  onImageClick?: any;
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({
  image,
  board,
  setShowIcon,
  inputRef,
  mute,
  onPlayAudioList,
  onImageClick,
}) => {
  const { currentUser } = useCurrentUser();
  const [audioList, setAudioList] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const showRemoveBtn = () => {
    if (currentUser?.role === "admin") {
      return true;
    }
    if (board?.can_edit === true) {
      return true;
    }
    return false;
  };

  const removeImage = async () => {
    try {
      await removeImageFromBoard(board.id, image.id);
      window.location.reload();
    } catch (error) {
      console.error("Error removing image: ", error);
      alert("Error removing image");
    }
  };

  const handleImageClick = (image: Image) => {
    if (onImageClick) {
      onImageClick(image);
    }

    if (mute) {
      if (board?.can_edit === true) {
        history.push(`/images/${image.id}?boardId=${board.id}`);
        return;
      }
      history.push(`/images/${image.id}`);
      return;
    }
    const audioSrc = image.audio;
    onPlayAudioList(audioSrc);
    const label = image.label;
    if (inputRef?.current) {
      inputRef.current.value += ` ${label}`;
      if (setShowIcon) {
        if (inputRef.current?.value) {
          setShowIcon(true);
        } else {
          setShowIcon(false);
        }
      }
    }

    if (!audioSrc) {
      speak(label);
      return;
    }
    setAudioList([...audioList, audioSrc]);

    const audio = new Audio(audioSrc);

    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {})
        .catch((error) => {
          console.log("Autoplay was prevented", error);
          // Autoplay was prevented.
          audio.muted = true;
          audio.play();
        });
    }
  };

  const speak = async (text: string) => {
    const language = currentUser?.settings?.voice?.language || "en-US";
    const rate = currentUser?.settings?.voice?.rate || 1.0;
    const pitch = currentUser?.settings?.voice?.pitch || 1.0;
    const volume = currentUser?.settings?.voice?.volume || 1.0;
    await TextToSpeech.speak({
      text: text,
      lang: language,
      rate: rate,
      pitch: pitch,
      volume: volume,
      category: "ambient",
    });
  };

  return (
    <div
      className={`relative cursor-pointer ${
        image.bg_color || "bg-white"
      } rounded-md shadow-md p-0 h-full`}
      onClick={() => handleImageClick(image)}
    >
      <IonImg
        src={image.src}
        alt={image.label}
        className="ion-img-contain mx-auto"
      />
      <span className="bg-white bg-opacity-80 w-full font-medium text-sm md:text-md lg:text-md text-black absolute bottom-0 left-0 p-1 pl-2 rounded-sm">
        {image.label.length > 15
          ? `${image.label.substring(0, 12)}...`
          : image.label}
      </span>
      {image.audio && <audio src={image.audio} />}
      {showRemoveBtn() && (
        <IonIcon
          slot="icon-only"
          icon={trashBinOutline}
          size="small"
          onClick={() => setIsOpen(true)}
          className="absolute bottom-0 right-0 p-1 pr-2"
        />
      )}
      <IonAlert
        isOpen={isOpen}
        header="Remove Image"
        message="Are you sure you want to remove this image?"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              setIsOpen(false);
            },
          },
          {
            text: "OK",
            role: "confirm",
            handler: () => {
              removeImage();
            },
          },
        ]}
        onDidDismiss={() => setIsOpen(false)}
      ></IonAlert>
    </div>
  );
};

export default ImageGalleryItem;
