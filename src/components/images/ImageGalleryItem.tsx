import React, { useEffect, useLayoutEffect, useState } from "react";
import { IonAlert, IonIcon, IonImg } from "@ionic/react";
import { Image } from "../../data/images";
import { removeImageFromBoard } from "../../data/boards";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { starOutline, starSharp, trashBinOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { generatePlaceholderImage, labelForScreenSize } from "../../data/utils";

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
  setRowHeight?: any;
  setImgRef?: any;
  removeFromList?: boolean;
  afterRemove?: any;
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
  setRowHeight,
  setImgRef,
  removeFromList,
  afterRemove,
}) => {
  const [imgRefElement, setImgRefElement] = useState<HTMLDivElement | null>(
    null
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Track if the image is fully loaded
  const { currentUser, smallScreen, isMobile } = useCurrentUser();
  const [audioList, setAudioList] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const placeholderUrl = generatePlaceholderImage(image.label);
  const history = useHistory();

  const removeImage = async () => {
    if (removeFromList) {
      return;
    }
    try {
      await removeImageFromBoard(board.id, image.id);
      if (imgRefElement) {
        imgRefElement.remove();
      }
    } catch (error) {
      console.error("Error removing image: ", error);
      alert("Error removing image");
    }
  };

  const handleResize = () => {
    if (imgRefElement?.clientWidth) {
      const width = imgRefElement.clientWidth;
      if (isMobile && smallScreen) {
        setRowHeight(width * 1.2); // Adjust height based on width
      } else {
        setRowHeight(width);
      }
    } else {
      setRowHeight(0);
    }
  };

  // Track when the image has loaded
  useLayoutEffect(() => {
    if (isImageLoaded && imgRefElement) {
      handleResize(); // Trigger resize after the image is fully loaded
    }
  }, [isImageLoaded, imgRefElement]);

  // Handle image load event
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageClick = (image: Image) => {
    if (onImageClick) {
      onImageClick(image);
    }

    if (mute) {
      if (viewOnClick) {
        if (board?.can_edit === true) {
          history.push(`/images/${image.id}?boardId=${board.id}`);
          return;
        }
        history.push(`/images/${image.id}`);
        return;
      }
      return;
    }
    const audioSrc = image.audio;
    if (onPlayAudioList) {
      onPlayAudioList(audioSrc);
    }
    const label = image.label;
    if (inputRef?.current && !removeFromList) {
      inputRef.current.value += ` ${label}`;
      if (setShowIcon) {
        setShowIcon(Boolean(inputRef.current.value));
      }
    }

    const waitToSpeak = currentUser?.settings?.wait_to_speak || false;

    if (!audioSrc) {
      if (!waitToSpeak) {
        speak(label);
      }
      return;
    }
    setAudioList([...audioList, audioSrc]);

    const audio = new Audio(audioSrc);
    if (!waitToSpeak) {
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          speak(label);
        });
      }
    }
  };

  const speak = async (text: string) => {
    const language = currentUser?.settings?.voice?.language || "en-US";
    const rate = currentUser?.settings?.voice?.rate || 1.0;
    const pitch = currentUser?.settings?.voice?.pitch || 1.0;
    const volume = currentUser?.settings?.voice?.volume || 1.0;
    await TextToSpeech.speak({
      text,
      lang: language,
      rate,
      pitch,
      volume,
      category: "ambient",
    });
  };

  const imageStarIcon = (image: Image) => {
    return image.src && board?.display_image_url === image.src
      ? starSharp
      : starOutline;
  };

  return (
    <div
      ref={(el) => {
        if (setImgRefElement) {
          setImgRefElement(el);
        }
        if (setImgRef) {
          setImgRef(el);
        }
      }}
      className={`relative cursor-pointer ${
        image.bg_color || "bg-white"
      } rounded-sm p-1`}
      style={{ minHeight: "100px" }} // Set minimum height to avoid collapse while loading
      onClick={() => handleImageClick(image)}
    >
      <IonImg
        src={image.src || placeholderUrl}
        alt={image.label}
        className="ion-img-contain mx-auto"
        // onClick={() => handleImageClick(image)}
        onLoad={handleImageLoad} // Ensure resize after image fully loads
        style={{ width: "100%", height: "auto" }} // Make sure the image takes full width
      />
      {!image.is_placeholder && (
        <span
          onClick={() => {
            console.log("label clicked");
          }}
          className="bg-white bg-opacity-95 w-full font-medium tracking-tighter leading-tight text-xs md:text-sm lg:text-sm absolute bottom-0 left-0 shadow-md"
        >
          {labelForScreenSize(
            image.label,
            rowHeight,
            smallScreen,
            false, // Assuming mediumScreen and largeScreen can be false
            false
          )}
        </span>
      )}
      {image.audio && <audio src={image.audio} />}
      {showRemoveBtn && (
        <IonIcon
          slot="icon-only"
          icon={trashBinOutline}
          size="small"
          onClick={() => {
            if (removeFromList) {
              removeImage();
              return;
            } else {
              setIsOpen(true);
            }
          }}
          color="danger"
          className="tiny absolute bottom-0 right-0"
        />
      )}
      {showRemoveBtn && !removeFromList && (
        <IonIcon
          slot="icon-only"
          icon={imageStarIcon(image)}
          size="x-small"
          onClick={() => onSetDisplayImage(image)}
          color="secondary"
          className="absolute top-0 right-0 m-1 shadow-md bg-white bg-opacity-90 rounded-full p-1"
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
