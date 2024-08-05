import React, { useEffect, useState } from "react";
import {
  BoardImageResponse,
  getBoardImage,
  setNextBoardImageWords,
  switchBoardImageMode,
} from "../../data/board_images";
import { IonButton } from "@ionic/react";
import { set } from "d3";
interface BoardImageProps {
  boardImageId: number;
}

const BoardImage: React.FC<BoardImageProps> = ({ boardImageId }) => {
  const [data, setData] = useState<BoardImageResponse | null>(null);

  useEffect(() => {
    getBoardImage(boardImageId.toString()).then((response) => {
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

    switch (data.action) {
      case "speak":
        return (
          <div>
            {data.label}
            <audio src={data.audio_url} controls></audio>
            <IonButton onClick={handleSwitchMode}>{data.mode}</IonButton>
          </div>
        );
      case "display_next_words":
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

export default BoardImage;
