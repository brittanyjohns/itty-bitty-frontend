import React, { useState, useRef, useEffect } from "react";
import { IonImg, useIonViewDidLeave } from "@ionic/react";
import { Image } from "../../data/images";
import ActionList from "../utils/ActionList"; // Import ActionList for local use
import { removeImageFromBoard } from "../../data/boards";
import { useHistory } from "react-router";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { useCurrentUser } from "../../hooks/useCurrentUser";
interface ImageGalleryItemProps {
  image: Image;
  board?: any;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  disableActionList?: boolean;
  mute?: boolean;
  onPlayAudioList?: any;
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({
  image,
  board,
  setShowIcon,
  inputRef,
  disableActionList,
  mute,
  onPlayAudioList,
}) => {
  const [showActionList, setShowActionList] = useState<boolean>(false);
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const [audioList, setAudioList] = useState<string[]>([]);

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
    } catch (error) {
      console.error("Error editing image: ", error);
      alert("Error editing image");
    }
  };

  const handleImageClick = (image: Image) => {
    if (!disableActionList) {
      setShowActionList(true);
    }
    if (mute) {
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
    console.log("audioSrc: ", audioSrc);
    console.log("audioList: ", audioList);
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

  useIonViewDidLeave(() => {
    setShowActionList(false);
  });

  const speak = async (text: string) => {
    console.log("speak text: ", text);
    console.log("audioList: ", audioList);
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

  const defaultButtonOptions = [
    {
      text: "Remove from board",
      role: "destructive",
      handler: () => handleActionSelected("delete"),
    },
    {
      text: "Edit image",
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
      {!disableActionList && (
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
