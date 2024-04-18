// ImageGalleryItem.tsx
import React, { useState, useRef } from "react";
import { IonImg, useIonViewDidLeave } from "@ionic/react";
import { Image } from "../data/images";
import ActionList from "./ActionList"; // Import ActionList for local use
import { removeImageFromBoard } from "../data/boards";
import { useHistory } from "react-router";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { h } from "ionicons/dist/types/stencil-public-runtime";
interface ImageGalleryItemProps {
  image: Image;
  board?: any; // Adjust the type based on your actual board type
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
    console.log("Action selected: ", action);
    console.log("Image: ", image);
    if (action === "delete") {
      removeImage(image.id, board.id);
      // Handle delete action
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
    // Handle edit image
  };

  const handleButtonPress = () => {
    console.log("Button Pressed");
    // handleImageClick(image);
    if (disableActionList) {
      console.log("Action list disabled");
      return;
    }
    longPressTimer.current = setTimeout(() => {
      console.log("Long press detected");
      setShowActionList(true);
    }, 1000);
  };

  const handleButtonRelease = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setTimeout(() => {
      console.log("Button Released - closing action list");
      setShowActionList(false);
    }, 1000);
  };

  const handleImageClick = (image: Image) => {
    console.log("Click event", image);
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
    // audio.play();

    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          console.log("Autoplay started");
          // Autoplay started
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
    console.log("Leaving ImageGalleryItem");
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
      text: "Delete",
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
    <div className="cursor-pointer bg-white rounded-md shadow-md p-1 h-fit">
      <IonImg
        src={image.src}
        alt={image.label}
        className="ion-img-contain mx-auto"
        onClick={() => handleImageClick(image)}
        onMouseDown={() => console.log("Image Mouse Down")}
        onTouchStart={() => {
          console.log("Image Touch Start");
          handleButtonPress();
        }}
        onMouseUp={() => console.log("Image Mouse Up")}
        onTouchEnd={() => {
          console.log("Image Touch End");
          handleButtonRelease();
        }}
        onMouseLeave={() => console.log("Image Mouse Leave")}
        onMouseEnter={() => console.log("Image Mouse Enter")}
      />
      <span className="font-medium text-xs md:text-sm lg:text-md text-black">
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
