import { useEffect, useRef, useState } from "react";
import {
  Board,
  addToTeam,
  cloneBoard,
  getBoard,
  rearrangeImages,
} from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";

import { useHistory, useParams } from "react-router";
import "./ViewBoard.css";
import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Team } from "../../data/teams";
import Tabs from "../../components/utils/Tabs";
import MainMenu from "../../components/main_menu/MainMenu";
import BoardView from "../../components/boards/BoardView";
import { addCircleOutline } from "ionicons/icons";
import { set } from "d3";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";

const ViewBoard: React.FC<any> = () => {
  const [board, setBoard] = useState<Board>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [currentUserTeams, setCurrentUserTeams] = useState<Team[]>();
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();
  const history = useHistory();

  const fetchBoard = async () => {
    const board = await getBoard(params.id);

    if (!board) {
      console.error("Error fetching board");
      setShowLoading(false);
      alert("Error fetching board");
      return;
    }

    setCurrentUserTeams(board?.current_user_teams);
    const userCanEdit = board.can_edit || currentUser?.role === "admin";
    setShowEdit(userCanEdit);

    // Check if board layout is empty and rearrange images if necessary
    if (!board.layout) {
      console.log("Empty board layout, rearranging images");
      const rearrangedBoard = await rearrangeImages(board.id);
      setBoard(rearrangedBoard);
      window.location.reload();
    } else {
      setBoard(board);
    }

    setNumOfColumns(board.number_of_columns);
    setShowLoading(false);
  };

  useEffect(() => {
    fetchBoard();
  }, [params.id]);

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

  const clearInput = () => {
    inputRef.current!.value = "";
  };

  useIonViewWillEnter(() => {
    fetchBoard();
  }, []);

  const handleClone = async () => {
    try {
      setShowLoading(true);
      const clonedBoard = await cloneBoard(params.id);
      if (clonedBoard && clonedBoard.id) {
        const updatedBoard = await rearrangeImages(clonedBoard.id);
        if (updatedBoard) {
          console.log("Board cloned and images rearranged", updatedBoard);
          setBoard(updatedBoard);
        } else {
          console.error("Error rearranging images");
          setBoard(clonedBoard);
        }
      } else {
        console.error("Error cloning board", clonedBoard);
        alert("Error cloning board");
        setShowLoading(false);
        history.push("/boards");

        // window.location.href = "/boards";
      }
      setShowLoading(false);
      history.push(`/boards/${clonedBoard.id}`);
      // window.location.href = `/boards/${clonedBoard.id}`;
    } catch (error) {
      console.error("Error cloning board: ", error);
      alert("Error cloning board");
      setShowLoading(false);
    }
  };

  return (
    <>
      <MainMenu
        pageTitle="Boards"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Boards"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle={board?.name || "Board"}
          isWideScreen={isWideScreen}
          startLink="/boards"
          endLink="/boards/new"
        />

        <IonContent>
          <IonLoading message="Please wait..." isOpen={showLoading} />
          {isWideScreen && (
            <div className="ml-4 mt-4 pl-4">
              <h1>{board?.name || "View Board"}</h1>
            </div>
          )}
          {board && (
            <BoardView
              board={board}
              showEdit={showEdit}
              showShare={true}
              currentUserTeams={currentUserTeams}
              handleClone={handleClone}
              setShowIcon={setShowIcon}
              inputRef={inputRef}
              numOfColumns={numOfColumns}
              showLoading={showLoading}
            />
          )}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewBoard;
