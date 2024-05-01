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
import MainMenu from "../../components/MainMenu";

const NewBoard: React.FC = (props: any) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Board>();
  const onSubmit: SubmitHandler<Board> = (data) => {
    createBoard(data);
    props.history.push("/boards");
    window.location.reload();
  };
  const scenarioBtnRef = useRef<HTMLIonButtonElement>(null);
  const scratchFormRef = useRef<HTMLFormElement>(null);
  const scratchBtnRef = useRef<HTMLIonButtonElement>(null);

  const handleCreateFromScratch = () => {
    scratchBtnRef.current?.classList.toggle("hidden");
    scratchFormRef.current?.classList.toggle("hidden");
    scenarioBtnRef.current?.classList.toggle("hidden");
  };

  useIonViewDidLeave(() => {
    scratchBtnRef.current?.classList.remove("hidden");
    scratchFormRef.current?.classList.add("hidden");
    scenarioBtnRef.current?.classList.remove("hidden");
  });

  useEffect(() => {
    scratchFormRef.current?.classList.add("hidden");
  }, []);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader translucent>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink="/boards">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>New Board</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen scrollY={true}>
          <div className="w-1/2 mx-auto h-1/4 grid grid-rows-2 gap-8 mt-10">
            <IonButton
              className=""
              expand="block"
              onClick={handleCreateFromScratch}
              ref={scratchBtnRef}
            >
              Create from scratch
            </IonButton>
            <form
              className="ion-padding hidden"
              onSubmit={handleSubmit(onSubmit)}
              ref={scratchFormRef}
            >
              <IonInput
                aria-label="Name"
                placeholder="Name"
                defaultValue=""
                {...register("name", { required: true })}
              />
              <IonButton className="" type="submit" expand="block">
                Create
              </IonButton>
            </form>

            <IonButton
              routerLink="/scenarios/new"
              expand="block"
              ref={scenarioBtnRef}
            >
              Create from scenario
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default NewBoard;
