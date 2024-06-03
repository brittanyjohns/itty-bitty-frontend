import { useEffect, useRef, useState } from "react";
import { getBoard, getRemainingImages, updateBoard } from "../../data/boards";
import { Image } from "../../data/images";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Board } from "../../data/boards";
import { arrowBackCircleOutline } from "ionicons/icons";

import { useHistory } from "react-router";
import "./ViewBoard.css";
import React from "react";
import BoardForm from "../../components/boards/BoardForm";

const EditBoardScreen: React.FC<any> = () => {
  const [board, setBoard] = useState<Board>({
    id: "",
    name: "",
    number_of_columns: 0,
    images: [],
  });
  const modal = useRef<HTMLIonModalElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images
  const inputRef = useRef<HTMLIonInputElement>(null);
  const history = useHistory();

  const fetchBoard = async () => {
    const boardId = window.location.pathname.split("/")[2];
    const board = await getBoard(boardId);
    setBoard(board);
    const remainingImgs = await getRemainingImages(board.id, 1, "");
    setRemainingImages(remainingImgs);
  };

  const goToGallery = () => {
    if (!board) {
      console.error("No board found");
      return;
    }
    history.push(`/boards/${board?.id}/gallery`);
  };


  useEffect(() => {
    fetchBoard();
    console.log("fetchBoard", board);
  }, []);

  return (
    <IonPage id="edit-board-page">
      <IonHeader className="bg-inherit shadow-none">
        <IonToolbar>
          <IonButtons slot="start" className="mr-4">
            <IonButton routerLink={`/boards/${board?.id}`}>
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Edit {board?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent id="board-modal">
        <IonButton
          onClick={goToGallery}
          expand="block"
          fill="outline"
          color="primary"
          className="mt-4 w-5/6 mx-auto"
        >
          View Gallery
        </IonButton>

        <BoardForm board={board} setBoard={setBoard} />
      </IonContent>
    </IonPage>
  );
};

export default EditBoardScreen;
