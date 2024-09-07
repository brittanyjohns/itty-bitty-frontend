import React, { useEffect, useMemo, useRef, useState } from "react";
import { IonAlert, IonIcon, IonImg } from "@ionic/react";
import { Image } from "../../data/images";
import { Board, removeImageFromBoard, updateBoard } from "../../data/boards";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  arrowRedoCircleOutline,
  shareOutline,
  starOutline,
  starSharp,
  trashBinOutline,
} from "ionicons/icons";
import { useHistory } from "react-router";
import { generatePlaceholderImage, labelForScreenSize } from "../../data/utils";
import { getBoardImagebyBoard } from "../../data/board_images";

interface ImageGalleryItemProps {
  image: Image;
  board?: any;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  mute?: boolean;
  onPlayAudioList?: any;
  onImageClick?: any;
  viewOnClick?: boolean;
  showRemoveBtn?: boolean;
  onSetDisplayImage?: any;
  rowHeight?: number;
  imageType?: string;
  setNextBoardId?: any;
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({
  image,
  board,
  setShowIcon,
  inputRef,
  mute,
  onPlayAudioList,
  onImageClick,
  viewOnClick,
  showRemoveBtn,
  onSetDisplayImage,
  rowHeight,
  imageType,
  setNextBoardId,
}) => {
  const { currentUser, smallScreen, mediumScreen, largeScreen } =
    useCurrentUser();
  const imgRef = useRef<HTMLDivElement>(null);
  const [audioList, setAudioList] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(image.label),
    [image.label]
  );
  const history = useHistory();

  const removeImage = async () => {
    try {
      await removeImageFromBoard(board.id, image.id);
      imgRef.current?.remove();
    } catch (error) {
      console.error("Error removing image: ", error);
      alert("Error removing image");
    }
  };

  const handleImageClick = async (image: Image) => {
    if (onImageClick) {
      onImageClick(image);
    }

    console.log("Image click", imageType);
    console.log("Image click", image);

    if (mute) {
      if (viewOnClick) {
        console.log("View on click", imageType);
        if (board && image.board_image_id) {
          const boardImageId = image.board_image_id;
          history.push(`/board_images/${boardImageId}`);

          return;
        }
        if (board && image.id) {
          history.push(`/board_images/${image.id}`);
          return;
        }

        history.push(`/images/${image.id}`);
        return;
      }
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

    const waitToSpeak = currentUser?.settings?.wait_to_speak || false;

    if (!audioSrc) {
      if (!waitToSpeak) {
        speak(label);
      }
      // return;
    } else {
      setAudioList([...audioList, audioSrc]);

      const audio = new Audio(audioSrc);
      if (!waitToSpeak) {
        const promise = audio.play();
        if (promise !== undefined) {
          promise
            .then(() => {})
            .catch((error) => {
              console.error("Error playing audio: ", error);
              speak(label);
            });
        }
      }
    }
    console.log("After audio play");
    if (imageType === "dynamic" && image.dynamic_board) {
      const dynamicBoardId = image.dynamic_board?.id;
      console.log("Dynamic board id", dynamicBoardId);
      setNextBoardId(dynamicBoardId);
      // history.push(`/dynamic_boards/${dynamicBoardId}/locked`);
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

  const imageStarIcon = (image: Image) => {
    if (image.src && board?.display_image_url === image.src) {
      return starSharp;
    } else {
      return starOutline;
    }
  };

  const handleDynamicImageClick = (image: Image) => () => {
    if (image.dynamic_board) {
      const dynamicBoardId = image.dynamic_board
        ? image.dynamic_board.id
        : undefined;
      if (dynamicBoardId) {
        history.push(`/dynamic_boards/${dynamicBoardId}`);
      }
    }
  };

  return (
    <div
      ref={imgRef}
      className={`relative cursor-pointer ${
        image.bg_color || "bg-white"
      } rounded-sm p-2`}
    >
      {imageType === "dynamic" && (
        <>
          <IonIcon
            slot="icon-only"
            icon={arrowRedoCircleOutline}
            size="small"
            onClick={handleDynamicImageClick(image)}
            color="secondary"
            className="tiny absolute top-0 right-0"
          />
        </>
      )}
      <IonImg
        src={image.src || placeholderUrl}
        alt={image.label}
        className="ion-img-contain mx-auto"
        onClick={() => handleImageClick(image)}
      />
      {image.id}
      {!image.is_placeholder && (
        <span
          onClick={() => handleImageClick(image)}
          className="bg-white bg-opacity-95 w-full font-medium tracking-tighter leading-tight text-xs md:text-sm lg:text-sm absolute bottom-0 left-0 shadow-md"
        >
          {labelForScreenSize(
            image.label,
            rowHeight,
            smallScreen,
            mediumScreen,
            largeScreen
          )}
        </span>
      )}
      {image.audio && <audio src={image.audio} />}

      {showRemoveBtn && (
        <IonIcon
          slot="icon-only"
          icon={trashBinOutline}
          size="small"
          onClick={() => setIsOpen(true)}
          color="danger"
          className="tiny absolute bottom-0 right-0"
        />
      )}
      {showRemoveBtn && (
        <IonIcon
          slot="icon-only"
          icon={imageStarIcon(image)}
          size="x-small"
          onClick={() => onSetDisplayImage(image)}
          color="secondary"
          className="absolute top-0 left-0 m-1 shadow-md bg-white bg-opacity-90 rounded-full p-1"
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
