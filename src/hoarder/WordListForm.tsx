import React, { useState } from "react";

import { addImageListToBoard, Board } from "../data/boards";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
} from "@ionic/react";

const WordListForm = ({ boardId, reloadBoardAndImages }: any) => {
  const [currentWord, setCurrentWord] = useState("");
  const [wordList, setWordList] = useState<string[]>([]); // Provide an initial type for wordList
  const [board, setBoard] = useState<Board | undefined>(undefined); // Provide an initial type for board

  const handleAddWord = () => {
    if (currentWord.trim() !== "") {
      setWordList([...wordList, currentWord.trim()]);
      setCurrentWord("");
    }
  };

  const handleSubmit = async () => {
    // Here you can handle the submission of the word list
    // For example, sending it to a server or another component
    console.log("Board ID:", boardId);
    console.log("Word List:", wordList);
    const board = await addImageListToBoard(boardId, { word_list: wordList });

    setWordList([]);
    reload();
  };

  const reload = () => {
    reloadBoardAndImages();
  };

  return (
    <IonContent style={styles.container}>
      <IonItem>
        <IonLabel position="floating">Label</IonLabel>
        <IonInput
          value={currentWord}
          onIonChange={(e: any) => setCurrentWord(e.detail.value!)}
          type="text"
          required
        />
      </IonItem>
      <IonButton title="Add" onClick={handleAddWord} />

      <IonItem style={styles.listContainer}>
        {wordList.map((word, index) => (
          <IonItem key={index} style={styles.listItem}>
            {word}
          </IonItem>
        ))}
      </IonItem>

      <IonButton title="Submit" onClick={handleSubmit} />
    </IonContent>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  listContainer: {
    width: "100%",
    marginBottom: 20,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
};

export default WordListForm;
