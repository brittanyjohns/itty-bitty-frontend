import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  IonAlert,
  IonIcon,
  IonImg,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  BoardGroup,
  removeBoardFromGroup,
  updateBoardGroup,
} from "../../data/board_groups";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { starOutline, starSharp, trashBinOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { generatePlaceholderImage } from "../../data/utils";
import { Board } from "../../data/boards";

interface BoardGalleryItemProps {
  board: Board;
  boardGroup?: BoardGroup;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  mute?: boolean;
  onPlayAudioList?: any;
  onBoardClick?: any;
  viewOnClick?: boolean;
  showRemoveBtn?: boolean;
  onSetDisplayBoard?: any;
}

const BoardGalleryItem: React.FC<BoardGalleryItemProps> = ({
  boardGroup,
  board,
  setShowIcon,
  inputRef,
  mute,
  onPlayAudioList,
  onBoardClick,
  viewOnClick,
  showRemoveBtn,
  onSetDisplayBoard,
}) => {
  const { currentUser } = useCurrentUser();
  const imgRef = useRef<HTMLDivElement>(null);
  const [audioList, setAudioList] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(board.name),
    [board.name]
  );
  const history = useHistory();

  const removeBoard = async () => {
    if (!boardGroup || !board.id) {
      return;
    }
    try {
      await removeBoardFromGroup(boardGroup.id, board.id);
      imgRef.current?.remove();
    } catch (error) {
      console.error("Error removing board: ", error);
      alert("Error removing board");
    }
  };

  const handleBoardClick = (board: Board) => {
    if (onBoardClick) {
      onBoardClick(board);
    }

    console.log("Board clicked: ", board);

    if (mute) {
      if (viewOnClick) {
        if (board?.can_edit === true) {
          history.push(`/images/${board.id}?boardId=${board.id}`);
          return;
        }
        history.push(`/images/${board.id}`);
        return;
      }
      return;
    }
    const audioSrc = board.audio_url;
    onPlayAudioList(audioSrc);
    const name = board.name;
    if (inputRef?.current) {
      inputRef.current.value += ` ${name}`;
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
        speak(name);
      }
      return;
    }
    setAudioList([...audioList, audioSrc]);

    console.log("Playing audio: ", audioSrc);
    console.log("waitToSpeak ", waitToSpeak);
    const audio = new Audio(audioSrc);
    if (!waitToSpeak) {
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {})
          .catch((error) => {
            speak(name);
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

  const imageStarIcon = (board: Board) => {
    if (boardGroup?.display_image_url === board.display_image_url) {
      return starSharp;
    } else {
      return starOutline;
    }
  };
  return (
    <div
      ref={imgRef}
      className={`relative cursor-pointer ${
        board.bg_color || "bg-white"
      } rounded-sm p-2`}
    >
      <IonImg
        src={board.display_image_url || placeholderUrl}
        alt={board.name}
        className="ion-img-contain mx-auto"
        onClick={() => handleBoardClick(board)}
      />
      {/* {!board.is_placeholder && (
        <span
          onClick={() => handleBoardClick(board)}
          className="bg-white bg-opacity-90 w-full font-medium tracking-tighter leading-tight text-xs md:text-sm lg:text-sm absolute bottom-0 left-0 shadow-md"
        >
          {board.name.length > 15
            ? `${board.name.substring(0, 10)}...`
            : board.name}
        </span>
      )} */}
      {board.audio_url && <audio src={board.audio_url} />}
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
          icon={imageStarIcon(board)}
          size="x-small"
          onClick={() => onSetDisplayBoard(board)}
          color="secondary"
          className="absolute top-0 right-0 m-1 shadow-md bg-white bg-opacity-90 rounded-full p-1"
        />
      )}
      <IonAlert
        isOpen={isOpen}
        header="Remove Board"
        message="Are you sure you want to remove this board?"
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
              removeBoard();
            },
          },
        ]}
        onDidDismiss={() => setIsOpen(false)}
      ></IonAlert>
    </div>
  );
};

export default BoardGalleryItem;
