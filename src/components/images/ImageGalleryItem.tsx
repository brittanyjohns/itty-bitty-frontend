import React, { useEffect, useMemo, useRef, useState } from "react";
import { IonAlert, IonIcon, IonImg } from "@ionic/react";
import { Image } from "../../data/images";
import { Board, removeImageFromBoard, updateBoard } from "../../data/boards";
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
}) => {
  const imgRef = useRef<HTMLDivElement>(null);
  // const imgRef = useRef();
  const [imgRefElement, setImgRef] = useState<HTMLDivElement | null>(null);

  const { currentUser, smallScreen, mediumScreen, largeScreen, isMobile } =
    useCurrentUser();
  const [audioList, setAudioList] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(image.label),
    [image.label]
  );
  const history = useHistory();

  useEffect(() => {
    if (imgRefElement) {
      console.log("Current client - Image ref: ", imgRefElement);
      console.log("Current client - Image ref: ", imgRefElement?.clientWidth);
      handleResize();
    }
  }, [imgRefElement]);

  const removeImage = async () => {
    try {
      await removeImageFromBoard(board.id, image.id);
      if (imgRef) {
        imgRef.current?.remove();
      }
    } catch (error) {
      console.error("Error removing image: ", error);
      alert("Error removing image");
    }
  };

  const handleResize = () => {
    if (imgRef.current) {
      const width = imgRef.current.clientWidth;
      if (isMobile && smallScreen) {
        setRowHeight(width * 1.2);
      } else {
        setRowHeight(width);
      }
    } else {
      setRowHeight(imgRefElement?.clientWidth || 0);
      console.log("Image ref is null");
    }
  };

  useEffect(() => {
    if (imgRef?.current) {
      console.log("Current client - Image ref: ", imgRef?.current.clientWidth);
      handleResize(); // Ensure imgRef is available before calling handleResize
    } else {
      console.log("Image ref is null");
    }

    const resizeListener = () => {
      if (imgRef?.current) {
        handleResize();
      }
    };

    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [imgRef?.current]); // Updated useEffect to check imgRef.current

  useEffect(() => {
    console.log("Current client - Image ref: ", imgRef?.current);
    console.log("Current client - Image ref: ", imgRef?.current?.clientWidth);

    if (imgRef?.current?.clientWidth) {
      handleResize(); // Ensure imgRef.current is not null before calling handleResize
    }
  }, [imgRef?.current?.clientWidth]);

  useEffect(() => {
    handleResize();
  }, []);

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
      return;
    }
    setAudioList([...audioList, audioSrc]);

    const audio = new Audio(audioSrc);
    if (!waitToSpeak) {
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {})
          .catch((error) => {
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

  return (
    <div
      ref={(el) => {
        setImgRef(el);
      }}
      className={`relative cursor-pointer ${
        image.bg_color || "bg-white"
      } rounded-sm p-2`}
    >
      <IonImg
        src={image.src || placeholderUrl}
        alt={image.label}
        className="ion-img-contain mx-auto"
        onClick={() => handleImageClick(image)}
      />
      {!image.is_placeholder && (
        <span
          onClick={() => handleImageClick(image)}
          className="bg-white xbg-opacity-95 w-full font-medium tracking-tighter leading-tight text-xs md:text-sm lg:text-sm absolute bottom-0 left-0 shadow-md"
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
