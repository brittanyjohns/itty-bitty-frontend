import { Board, createBoard } from "../../data/boards";
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
    scratchDivRef.current?.classList.add("hidden");
  }, []);

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
              <IonItem>
                <IonInput
                  aria-label="Name"
                  placeholder="Name"
                  value={name}
                  onIonInput={handleNameChange}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  value={wordList.join(", ")}
                  placeholder="Enter words separated by commas"
                  onIonChange={(e) => {
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
              <div className="text-sm">Example: cat, dog, fish, bird</div>
              <div className="text-sm">
                Leave blank to create a blank board <br></br> Words can be added
                later
              </div>
              <hr></hr>
              <div className="text-sm text-gray-500 my-2 p-2">
                <h2 className="text-lg font-bold">Core words</h2>
                <p className="text-sm text-gray-500">
                  I, You, Up, Down, In, Out, On, Off, Stop, Go, Yes, No, More,
                  Like, Don't like, Help, Want, Need, Have,
                </p>
              </div>
              <div className="text-sm text-gray-500 my-2 p-2">
                <h2 className="text-lg font-bold">Common phrases</h2>
                <p className="text-sm text-gray-500">
                  My name is, What is your name?, How are you?, I am fine, thank
                  you, I need help, I am hungry, I am thirsty, I am tired
                </p>
              </div>
              <div className="text-sm text-gray-500 my-2 p-2">
                <h2 className="text-lg font-bold">Routine steps</h2>
                <p className="text-sm text-gray-500">
                  Brush teeth, Wash hands, Wash face, Take a bath, Take a
                  shower, Comb hair, Brush hair, Put on clothes
                </p>
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
