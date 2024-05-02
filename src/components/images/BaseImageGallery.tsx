import React, { useEffect, useState, useRef } from "react";
import { Image, ImageGalleryProps } from "../../data/images";
import { IonImg } from "@ionic/react";

import { TextToSpeech } from "@capacitor-community/text-to-speech";
import "./main.css";
import { useHistory } from "react-router";
import ActionList from "../utils/ActionList";
import { removeImageFromBoard } from "../../data/boards";
const BaseImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  board,
  setShowIcon,
  inputRef,
}) => {
  const gridRef = useRef(null); // Ref for the grid container
  const [audioList, setAudioList] = useState<string[]>([]);
  const [imageId, setImageId] = useState<string>("");
  const [leaving, setLeaving] = useState<boolean>(false);
  const history = useHistory();
  const [showActionList, setShowActionList] = useState<boolean>(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const resizeGrid = () => {
    const imagesCount = images.length;
    let cols = 1;
    let rows = 1;

    if (imagesCount > 1) {
      const sqrt = Math.sqrt(imagesCount);
      rows = Math.ceil(sqrt);
      cols = Math.round(sqrt);
    }

    const gridTarget = gridRef.current
      ? (gridRef.current as HTMLElement)
      : null;
    if (!gridTarget) return;

    // For a single image, we want it to fill the entire viewport
    if (imagesCount === 1) {
      gridTarget.style.height = "100vh";
      gridTarget.style.width = "100vw";
      gridTarget.style.display = "flex";
      gridTarget.style.justifyContent = "center";
      gridTarget.style.alignItems = "center";
    } else {
      // Adjust grid for multiple images
      const adjustedHeight = `calc(100vh - 60px)`; // Adjust as needed
      const adjustedWidth = `calc(100vw)`; // Adjust as needed

      gridTarget.style.height = adjustedHeight;
      gridTarget.style.width = adjustedWidth;
      gridTarget.style.display = "grid";
    }

    // Set grid layout
    gridTarget.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    gridTarget.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
  };

  const handleImageClick = (image: Image) => {
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

    if (leaving) {
      console.log("Leaving");
      return;
    }
    if (!audioSrc) {
      speak(label);
      return;
    }
    setAudioList([...audioList, audioSrc as string]);
    const audio = new Audio(audioSrc);
    audio.play();
  };

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

  const handleButtonPress = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    const imageId = (event.target as HTMLDivElement).id;

    longPressTimer.current = setTimeout(() => {
      setShowActionList(true); // Show the action list on long press
      setLeaving(true);
    }, 800); // 500 milliseconds threshold for long press
  };

  const handleButtonRelease = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current); // Cancel the timer if the button is released before the threshold
      longPressTimer.current = null;
    }
  };

  const handleActionSelected = (action: string) => {
    if (action === "delete") {
      if (!board?.id) {
        console.error("Board ID is missing");
        return;
      }
      const result = remove(imageId, board.id);
      console.log("Action", result);
      // window.location.reload();
    } else if (action === "edit") {
      history.push(`/images/${imageId}/edit`);
    }
    setShowActionList(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const imageId = (event.target as HTMLDivElement).id;
    if (!imageId) {
      return;
    }
    setImageId(imageId);
  };

  const remove = async (imageId: string, boardId: string) => {
    const result = await removeImageFromBoard(boardId, imageId);
    console.log("Remove Image from Board", result);
    return result;
  };

  // Resize grid on mount and when images state changes
  useEffect(() => {
    // resizeGrid();
    // Add window resize event listener to adjust grid on viewport change
    window.addEventListener("resize", resizeGrid);
    return () => window.removeEventListener("resize", resizeGrid);
  }, [images]);

  return (
    <div className="gallery-container" ref={galleryRef}>
      <div className="grid grid-cols-3 gap-1" ref={gridRef}>
        {images.map((image, i) => (
          <div
            className="min-h-20 h-full flex relative w-full hover:cursor-pointer text-center"
            onClick={() => handleImageClick(image)}
            key={image.id}
            onTouchStart={(e) => handleButtonPress(e)}
            onPointerDown={(e) => handlePointerDown(e)}
            onTouchEnd={(e) => handleButtonRelease(e)}
            onMouseDown={(e) => handleButtonPress(e)} // For desktop
            onMouseUp={handleButtonRelease} // For desktop
            onMouseLeave={handleButtonRelease} // Cancel on mouse leave to handle edge cases
          >
            <IonImg
              id={image.id}
              src={image.src}
              alt={image.label}
              className="absolute ion-img-cover w-full h-full top-0 left-0"
            />
            <span className="font-medium text-xs md:text-sm lg:text-md overflow-hidden absolute bottom-0 left-0 right-0">
              {image.label.length > 20
                ? image.label.substring(0, 20) + "..."
                : image.label}
              <audio>
                <source src={image.audio} type="audio/aac" />
              </audio>
            </span>
            <ActionList
              isOpen={showActionList}
              onClose={() => setShowActionList(false)}
              onActionSelected={(action: string) =>
                handleActionSelected(action)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseImageGallery;
