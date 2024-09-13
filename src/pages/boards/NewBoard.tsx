import { Board, createBoard, getWords } from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLoading,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonViewDidLeave,
} from "@ionic/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { arrowBackCircleOutline } from "ionicons/icons";
import React, { useEffect, useRef } from "react";
import MainMenu from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { denyAccess } from "../../data/users";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import Tabs from "../../components/utils/Tabs";
import { NewBoardPayload } from "../../data/boards";
import { set } from "d3";
const NewBoard: React.FC = (props: any) => {
  const [wordList, setWordList] = React.useState<string[]>([]);
  const submitBtnRef = useRef<HTMLIonButtonElement>(null);
  const [showLoading, setShowLoading] = React.useState(false);
  const handleOnSubmit = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }
    setShowLoading(true);
    submitBtnRef.current?.setAttribute("disabled", "true");
    const boardToCreate: NewBoardPayload = {
      name,
    };
    if (wordList.length > 0) {
      boardToCreate.word_list = wordList;
    }
    const newBoard = await createBoard(boardToCreate);
    if (!newBoard) {
      console.error("Error creating board");
      return;
    }
    if (newBoard.id) {
      props.history.push(`/boards/${newBoard.id}`);
    }
    setName("");
    setWordList([]);
    submitBtnRef.current?.removeAttribute("disabled");
    setShowLoading(false);
    return;
  };

  useIonViewDidLeave(() => {
    setName("");
    setWordList([]);
  });

  const scenarioBtnRef = useRef<HTMLIonButtonElement>(null);
  const scratchDivRef = useRef<HTMLDivElement>(null);
  const scratchBtnRef = useRef<HTMLIonButtonElement>(null);

  const [name, setName] = React.useState("");
  const [suggestedWords, setSuggestedWords] = React.useState("");
  const suggestionBtnRef = useRef<HTMLIonButtonElement>(null);
  const handleGetWords = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }
    suggestionBtnRef.current?.setAttribute("disabled", "true");
    const result = await getWords(name, 24);
    if (!result) {
      console.error("Error getting words");
      return;
    }
    console.log("Result: ", result);
    const words = result.join(", ");

    const newWords = result.filter((word: string) => !wordList.includes(word));
    setWordList([...wordList, ...newWords]);
    setSuggestedWords(words);

    console.log("Word list: ", wordList);
    suggestionBtnRef.current?.removeAttribute("disabled");
  };

  const { currentUser, currentAccount, isWideScreen } = useCurrentUser();

  const handleCreateFromScratch = () => {
    scratchBtnRef.current?.classList.toggle("hidden");
    scratchDivRef.current?.classList.toggle("hidden");
    scenarioBtnRef.current?.classList.toggle("hidden");
  };

  useIonViewDidLeave(() => {
    scratchBtnRef.current?.classList.remove("hidden");
    scratchDivRef.current?.classList.add("hidden");
    scenarioBtnRef.current?.classList.remove("hidden");
  });

  useEffect(() => {
    console.log("Word list: ", wordList);
  }, [wordList]);

  const handleNameChange = (e: CustomEvent) => {
    setName(e.detail.value);
  };

  return (
    <>
      <MainMenu
        pageTitle="New Board"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="New Board"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <IonLoading message="Please wait..." isOpen={showLoading} />
        <MainHeader
          pageTitle="New Board"
          isWideScreen={isWideScreen}
          startLink="/boards"
        />
        <IonContent className="ion-padding">
          <div className="w-1/2 mx-auto h-1/4 grid grid-rows-2 gap-4">
            <IonButton
              className=""
              expand="block"
              onClick={handleCreateFromScratch}
              ref={scratchBtnRef}
            >
              <span className="font-bold text-lg block">
                Create from scratch
              </span>
            </IonButton>
            <div className="hidden" ref={scratchDivRef}>
              <IonItem className="my-4 p-2 border rounded" lines="none">
                <IonInput
                  label="Board Name"
                  labelPlacement="stacked"
                  value={name}
                  onIonInput={handleNameChange}
                />
              </IonItem>
              <IonItem className="my-4" lines="none">
                <IonTextarea
                  rows={5}
                  value={wordList.join(", ")}
                  label="Word List"
                  labelPlacement="stacked"
                  placeholder="Enter words separated by commas"
                  onIonChange={(e: any) => {
                    setWordList(e.detail.value!.split(","));
                  }}
                />
              </IonItem>

              <IonButton
                className="my-2"
                type="submit"
                expand="block"
                onClick={handleOnSubmit}
                ref={submitBtnRef}
              >
                Create
              </IonButton>

              <div className="text-sm text-gray-500 my-2 p-2">
                <IonButton
                  fill="outline"
                  onClick={handleGetWords}
                  ref={suggestionBtnRef}
                >
                  Get suggestions
                </IonButton>
              </div>
              <div className="text-sm">
                <p className="text-sm text-gray-500">
                  Enter a name and a list of words separated by commas to create
                  a new board.
                </p>
                <p className="text-sm text-gray-500">
                  You can also get suggestions based on the name you enter.
                </p>
              </div>
              <hr></hr>
              <h1 className="text-lg font-bold">Examples:</h1>

              <div className="text-sm text-gray-500 my-2 p-2">
                <IonItem>
                  <p>Board Name: Animals</p>
                  <p>Word List: cat, dog, fish, bird, elephant</p>
                </IonItem>
                <IonItem>
                  <p>Board Name: Food</p>
                  <p>Word List: apple, banana, orange, pizza, sandwich</p>
                </IonItem>
              </div>
            </div>

            <IonButton
              routerLink="/scenarios/new"
              expand="block"
              ref={scenarioBtnRef}
              color={denyAccess(currentUser) ? "danger" : "primary"}
              disabled={denyAccess(currentUser)}
            >
              <div className="text-md font-md">
                {!denyAccess(currentUser) ? (
                  "Create from scenario"
                ) : (
                  <>
                    <span className="font-bold text-lg block">
                      Free Trial Expired{" "}
                    </span>
                    You need to upgrade to create from scenario
                  </>
                )}
              </div>
            </IonButton>
          </div>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default NewBoard;
