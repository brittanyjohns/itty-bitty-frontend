import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  IonAlert,
  IonIcon,
  IonImg,
  IonLabel,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { starOutline, starSharp, trashBinOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { generatePlaceholderImage } from "../../data/utils";
import { BoardGroup, removeBoardFromGroup } from "../../data/board_groups";
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
  viewLockOnClick?: boolean;
}

const BoardGalleryItem: React.FC<BoardGalleryItemProps> = ({
  board,
  boardGroup,
  setShowIcon,
  inputRef,
  mute,
  onPlayAudioList,
  onBoardClick,
  viewOnClick,
  showRemoveBtn,
  onSetDisplayBoard,
  viewLockOnClick,
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
    if (!board || !boardGroup) {
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
    let playAudioList = false;
    if (mute) {
      if (viewOnClick) {
        if (boardGroup?.id) {
          history.push(`/boards/${board.id}?boardGroupId=${boardGroup.id}`);
        }
        history.push(`/boards/${board.id}`);
      }
    } else {
      playAudioList = true;
    }
    const audioSrc = board.audio_url;
    if (!audioSrc) {
      console.log("No audio for board: ", board);
    } else {
      if (onPlayAudioList) {
        onPlayAudioList(audioSrc);
      }
    }
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
      console.log("No audio for board: ", board);
      if (!waitToSpeak) {
        console.log("No audio, speaking name: ", name);
        speak(name);
      }
    } else {
      if (!waitToSpeak) {
        playAudioList = true;
      }
    }
    if (playAudioList && audioSrc && audioList) {
      setAudioList([...audioList, audioSrc]);
    }
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

    if (viewOnClick) {
      if (boardGroup?.id) {
        history.push(`/boards/${board.id}?boardGroupId=${boardGroup.id}`);
        return;
      }
      history.push(`/boards/${board.id}`);
      return;
    }
    if (viewLockOnClick) {
      if (boardGroup?.id) {
        history.push(
          `/boards/${board.id}/locked?boardGroupId=${boardGroup.id}`
        );
        return;
      }
      history.push(`/boards/${board.id}`);
      return;
    }
    if (onBoardClick) {
      onBoardClick(board);
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

  const boardStarIcon = (board: Board) => {
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
        board?.bg_color || "bg-white"
      } rounded-sm p-1 border`}
    >
      <IonLabel className="text-center text-xs md:text-sm lg:text-sm font-medium">
        {board.name.length > 20
          ? `${board.name.substring(0, 25)}...`
          : board.name}
      </IonLabel>
      <IonImg
        src={board?.display_image_url || placeholderUrl}
        alt={board?.name}
        className="ion-img-contain mx-auto"
        onClick={() => handleBoardClick(board)}
      />
      {board && board.audio_url && <audio src={board.audio_url} />}
      {showRemoveBtn && (
        <IonIcon
          slot="icon-only"
          icon={trashBinOutline}
          size="small"
          onClick={() => setIsOpen(true)}
          color="danger"
          className="tiny absolute bottom-0 right-0 bg-white rounded-md p-1"
        />
      )}
      {showRemoveBtn && (
        <IonIcon
          slot="icon-only"
          icon={boardStarIcon(board)}
          size="x-small"
          onClick={() => onSetDisplayBoard(boardGroup, board)}
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
