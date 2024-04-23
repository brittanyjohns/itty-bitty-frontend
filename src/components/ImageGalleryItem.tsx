import React, { useState, useRef } from "react";
import { IonImg, useIonViewDidLeave } from "@ionic/react";
import { Image } from "../data/images";
import ActionList from "./ActionList"; // Import ActionList for local use
import { removeImageFromBoard } from "../data/boards";
import { useHistory } from "react-router";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
interface ImageGalleryItemProps {
  image: Image;
  board?: any;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  disableActionList?: boolean;
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({
  image,
  board,
  setShowIcon,
  inputRef,
  disableActionList,
}) => {
  const [showActionList, setShowActionList] = useState<boolean>(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const history = useHistory();

  const handleActionSelected = (action: string) => {
    if (action === "delete") {
      removeImage(image.id, board.id);
    } else if (action === "edit") {
      editImage(image.id);
    }
  };

  const removeImage = async (imageId: string, boardId: string) => {
    try {
      await removeImageFromBoard(boardId, imageId);
      window.location.reload();
    } catch (error) {
      console.error("Error removing image: ", error);
      alert("Error removing image");
    }
  };

  const editImage = (imageId: string) => {
    try {
      if (!board) {
        history.push(`/images/${imageId}`);
      } else {
        history.push(`/images/${imageId}?boardId=${board.id}`);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error editing image: ", error);
      alert("Error editing image");
    }
  };

  const handleButtonPress = () => {
    if (disableActionList) {
      return;
    }
    longPressTimer.current = setTimeout(() => {
      setShowActionList(true);
    }, 1000);
  };

  const handleButtonRelease = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setTimeout(() => {
      setShowActionList(false);
    }, 1000);
  };

  const handleImageClick = (image: Image) => {
    const audioSrc = image.audio;
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
    setAudioList([...audioList, audioSrc as string]);
    const audio = new Audio(audioSrc);

    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          console.log("Autoplay started");
        })
        .catch((error) => {
          console.log("Autoplay was prevented", error);
          // Autoplay was prevented.
          audio.muted = true;
          audio.play();
        });
    }
  };

  const [audioList, setAudioList] = useState<string[]>([]);

  useIonViewDidLeave(() => {
    setShowActionList(false);
  });

  const speak = async (text: string) => {
    await TextToSpeech.speak({
      text: text,
      lang: "en-US",
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: "ambient",
    });
  };

  const defaultButtonOptions = [
    {
      text: "Remove",
      role: "destructive",
      handler: () => handleActionSelected("delete"),
    },
    {
      text: "Edit",
      handler: () => handleActionSelected("edit"),
    },
    {
      text: "Cancel",
      role: "cancel",
      handler: () => setShowActionList(false),
    },
  ];

  return (
    <div
      className={`relative cursor-pointer ${
        image.bg_color || "bg-white"
      } rounded-md shadow-md p-1 h-fit`}
      onClick={() => handleImageClick(image)}
      onTouchStart={() => {
        handleButtonPress();
      }}
      onTouchEnd={() => {
        handleButtonRelease();
      }}
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
      {!board?.predefined && (
        <ActionList
          isOpen={showActionList}
          onClose={() => setShowActionList(false)}
          onActionSelected={handleActionSelected}
          buttonOptions={defaultButtonOptions}
        />
      )}
    </div>
  );
};

export default ImageGalleryItem;
