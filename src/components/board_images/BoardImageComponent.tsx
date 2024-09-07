import React, { useEffect, useState } from "react";
import {
  getBoardImage,
  BoardImage,
  setNextBoardImageWords,
  switchBoardImageMode,
} from "../../data/board_images";
import { IonButton } from "@ionic/react";
import { set } from "d3";
interface BoardImageProps {
  boardImage: BoardImage;
}

const BoardImageComponent: React.FC<BoardImageProps> = ({ boardImage }) => {
  const [data, setData] = useState<BoardImage | null>(null);
  const boardImageId = boardImage?.id;

  useEffect(() => {
    if (!boardImageId) return;
    getBoardImage(boardImageId).then((response) => {
      setData(response);
    });
  }, [boardImageId]);

  const handleSwitchMode = () => {
    switchBoardImageMode(boardImageId.toString()).then((response) => {
      setData(response);
    });
  };

  const handleSetNextWords = () => {
    setNextBoardImageWords(boardImageId.toString()).then((response) => {
      setData(response);
    });
  };

  const renderContent = () => {
    if (!data) return <p>Loading...</p>;

    switch (data.mode) {
      case "static":
        return (
          <div>
            {data.label}
            <audio src={data.audio_url} controls></audio>
            <IonButton onClick={handleSwitchMode}>{data.mode}</IonButton>
          </div>
        );
      case "dynamic":
        return (
          <div>
            <h2>Next Words:</h2>
            {data.next_words.length === 0 && (
              <div className="w-3/4 mx-auto bg-gray-300 p-2">
                <p>No next words</p>
                <IonButton onClick={handleSetNextWords}>
                  Set next words
                </IonButton>
              </div>
            )}
            <ul>
              {data.next_words.map((word, index) => (
                <li key={index}>{word} </li>
              ))}
            </ul>
          </div>
        );
      default:
        return <p>Unknown action</p>;
    }
  };

  return (
    <div>
      <h1>{data?.label}</h1>
      {renderContent()}
    </div>
  );
};

export default BoardImageComponent;
