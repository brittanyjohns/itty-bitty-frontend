import { useRef, useState } from "react";
import { Board, getAdditionalWords, updateBoard } from "../../data/boards";
import {
  IonButton,
  IonItem,
  IonText,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButtons,
} from "@ionic/react";

import { useHistory } from "react-router";
import { set } from "d3";

interface SuggestionFormProps {
  board: Board;
  setShowLoading: (show: boolean) => void;
  setLoadingMessage: (message: string) => void;
  setToastMessage(message: string): void;
  setIsToastOpen(isOpen: boolean): void;
  setBoard: (board: Board) => void;
}
const SuggestionForm = ({
  board,
  setShowLoading,
  setLoadingMessage,
  setToastMessage,
  setIsToastOpen,
  setBoard,
}: SuggestionFormProps) => {
  const submitBtnRef = useRef<HTMLIonButtonElement>(null);
  const history = useHistory();
  const [additionalWords, setAdditionalWords] = useState<string[]>([]);

  const [numberOfWords, setNumberOfWords] = useState(15);

  const handleOnSubmit = async () => {
    setShowLoading(true);
    setLoadingMessage("Adding words to the board");
    submitBtnRef.current?.setAttribute("disabled", "true");

    if (additionalWords.length > 0) {
      board.word_list = additionalWords;
    }
    const updatedBoard = await updateBoard(board);
    if (!updatedBoard) {
      console.error("Error creating board");
      setToastMessage("Error adding words to the board");
      setIsToastOpen(true);
      setShowLoading(false);
      submitBtnRef.current?.removeAttribute("disabled");
      return;
    } else {
      setBoard(updatedBoard);

      setAdditionalWords([]);
      submitBtnRef.current?.removeAttribute("disabled");
      setShowLoading(false);
      setToastMessage(
        "Creating images from words - this may take a few minutes"
      );
      setIsToastOpen(true);
      setAdditionalWords([]);
      history.push(`/boards/${updatedBoard.id}`);
      window.location.reload();
    }

    return;
  };

  const handleGetAdditionalImages = async () => {
    setLoadingMessage("Getting additional words");
    setShowLoading(true);
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    const result = await getAdditionalWords(board?.id, numberOfWords);
    const words = result["additional_words"];
    setAdditionalWords(words);
    setShowLoading(false);
  };

  return (
    <div className="ion-padding">
      <div className="w-full md:w-5/6 mx-auto text-center">
        <h2 className="text-center text-2xl font-bold my-2">
          Need some word inspiration?
        </h2>
        <p className="text-center my-2">
          Click the button below to get additional words that can be added to
          the board.
        </p>
        <p className="text-center my-2">
          There are currently {board?.images?.length} words on the board.
        </p>
        <div className="w-full md:w-1/2 mx-auto  border-2 p-1 rounded-lg">
          <IonItem className="my-4" lines="none">
            <IonInput
              value={board.name}
              label="Board Name"
              labelPlacement="stacked"
              placeholder="Enter board name"
              onIonChange={(e: any) => {
                board.name = e.detail.value!;
              }}
            />
          </IonItem>
          <IonItem className="my-4" lines="none">
            <IonSelect
              label="Number of words"
              labelPlacement="stacked"
              className=""
              value={numberOfWords}
              placeholder="Select number of words"
              onIonChange={(e: any) => setNumberOfWords(e.detail.value)}
            >
              <IonSelectOption value={5}>5</IonSelectOption>
              <IonSelectOption value={10}>10</IonSelectOption>
              <IonSelectOption value={15}>15</IonSelectOption>
              <IonSelectOption value={20}>20</IonSelectOption>
              <IonSelectOption value={25}>25</IonSelectOption>
              <IonSelectOption value={30}>30</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem className="my-4" lines="none">
            <IonButton
              slot="end"
              onClick={handleGetAdditionalImages}
              size="default"
              fill="outline"
              color={"primary"}
              className=""
            >
              {" "}
              Get Suggestions
            </IonButton>
          </IonItem>
        </div>
        <div className="text-center">
          {additionalWords.length > 0 && (
            <div className="w-full md:w-1/2 mx-auto my-4 border-2 p-1 rounded-lg">
              <IonText>
                <h3 className="text-center my-2">Additional words</h3>
              </IonText>
              <IonText>
                <IonTextarea
                  rows={5}
                  value={additionalWords.join(", ")}
                  aria-loabel="Word List"
                  placeholder="Enter words separated by commas"
                  onIonChange={(e: any) => {
                    setAdditionalWords(e.detail.value!.split(","));
                  }}
                />
              </IonText>
              <IonButtons>
                <IonButton
                  onClick={handleOnSubmit}
                  size="default"
                  fill="outline"
                  color={"primary"}
                  className=""
                >
                  {" "}
                  Add {numberOfWords} words to the board
                </IonButton>
                <IonButton
                  onClick={() => {
                    setAdditionalWords([]);
                  }}
                  size="default"
                  fill="outline"
                  color={"danger"}
                  className=""
                >
                  {" "}
                  Clear suggestions
                </IonButton>
              </IonButtons>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestionForm;
