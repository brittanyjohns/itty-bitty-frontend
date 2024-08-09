import { Board, createBoard } from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
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
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   handleOnSubmit();
  // };
  const handleOnSubmit = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }
    const boardToCreate: NewBoardPayload = {
      name,
    };
    const newBoard = await createBoard(boardToCreate);
    if (!newBoard) {
      console.error("Error creating board");
      return;
    }
    if (newBoard.id) {
      props.history.push(`/boards/${newBoard.id}`);
    }
    setName("");
    return;
  };

  useIonViewDidLeave(() => {
    setName("");
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
              <IonInput
                aria-label="Name"
                placeholder="Name"
                value={name}
                onIonInput={handleNameChange}
              />
              <IonButton
                className=""
                type="submit"
                expand="block"
                onClick={handleOnSubmit}
              >
                Create
              </IonButton>
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
