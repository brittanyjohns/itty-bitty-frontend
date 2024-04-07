// ImageGalleryItem.tsx
import React, { useState, useRef } from "react";
import { IonImg } from "@ionic/react";
import { Image } from "../data/images";
import ActionList from "./ActionList"; // Import ActionList for local use
import { removeImageFromBoard } from "../data/boards";
import { useHistory } from "react-router";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
interface ImageGalleryItemProps {
  image: Image;
  board: any; // Adjust the type based on your actual board type
  setShowIcon: (show: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({
  image,
  board,
  setShowIcon,
  inputRef,
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
      history.push(`/images/${imageId}`);
    } catch (error) {
      console.error("Error editing image: ", error);
      alert("Error editing image");
    }
    // Handle edit image
  };

  const handleButtonPress = () => {
    console.log("Button Pressed");
    // handleImageClick(image);
    longPressTimer.current = setTimeout(() => setShowActionList(true), 1000);
  };

  const handleButtonRelease = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setShowActionList(false);
  };

  const handleImageClick = (image: Image) => {
    console.log("Click event", image);
    const audioSrc = image.audio;
    const label = image.label;
    if (inputRef.current) {
      inputRef.current.value += ` ${label}`;
    }
    if (inputRef.current?.value) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
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

  return (
    <div
      className="cursor-pointer bg-white rounded-md shadow-md p-1"
      onTouchStart={() => console.log("Touch Start")}
      onMouseDown={() => console.log("Mouse Down")}
      onTouchEnd={() => console.log("Touch End")}
      onMouseUp={() => console.log("Mouse Up")}
      onMouseLeave={() => console.log("Mouse Leave")}
      onTouchStartCapture={handleButtonPress}
      onMouseDownCapture={() => console.log("Mouse Down Capture")}
      onTouchEndCapture={handleButtonRelease}
    >
      <IonImg
        src={image.src}
        alt={image.label}
        className="mx-auto"
        onClick={() => handleImageClick(image)}
        onMouseDown={() => console.log("Image Mouse Down")}
        onTouchStart={() => console.log("Image Touch Start")}
        onMouseUp={() => console.log("Image Mouse Up")}
        onTouchEnd={() => console.log("Image Touch End")}
        onMouseLeave={() => console.log("Image Mouse Leave")}
        onMouseEnter={() => console.log("Image Mouse Enter")}
      />
      <span className="text-xs">{image.label}</span>
      {image.audio && <audio src={image.audio} />}
      {!board?.predifined && (
        <ActionList
          isOpen={showActionList}
          onClose={() => setShowActionList(false)}
          onActionSelected={(action) => {
            handleActionSelected(action);
          }}
        />
      )}
    </div>
  );
};

export default ImageGalleryItem;
