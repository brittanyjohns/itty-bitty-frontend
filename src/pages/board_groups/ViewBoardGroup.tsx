import { useEffect, useRef, useState } from "react";
import {
  BoardGroup,
  getBoardGroup,
  rearrangeBoards,
} from "../../data/board_groups";
import {
  IonButton,
  IonContent,
  IonLoading,
  IonPage,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";

import { useParams } from "react-router";
import "./ViewBoard.css";
import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Team } from "../../data/teams";
import Tabs from "../../components/utils/Tabs";
import MainMenu from "../../components/main_menu/MainMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import BoardGroupView from "../../components/board_groups/BoardGroupView";
interface ViewBoardGroupProps {
  locked?: boolean;
}
const ViewBoardGroup: React.FC<ViewBoardGroupProps> = ({ locked }) => {
  const [boardGroup, setBoardGroup] = useState<BoardGroup>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(true);
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [currentUserTeams, setCurrentUserTeams] = useState<Team[]>();
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();

  const fetchBoardGroup = async () => {
    const boardGroup = await getBoardGroup(params.id);

    if (!boardGroup) {
      console.error("Error fetching boardGroup");
      setShowLoading(false);
      alert("Error fetching boardGroup");
      return;
    }

    // setCurrentUserTeams(boardGroup?.current_user_teams);
    // const userCanEdit = boardGroup.can_edit || currentUser?.role === "admin";
    // setShowEdit(userCanEdit);

    // Check if boardGroup layout is empty and rearrange images if necessary
    if (!boardGroup.layout) {
      console.log("Empty boardGroup layout, rearranging images");
      const rearrangedBoardGroup = await rearrangeBoards(boardGroup.id);
      setBoardGroup(rearrangedBoardGroup);
      window.location.reload();
    } else {
      setBoardGroup(boardGroup);
    }

    setNumOfColumns(boardGroup.number_of_columns || 6);
    setShowLoading(false);
  };

  useEffect(() => {
    fetchBoardGroup();
    console.log("useEffect -- fetchBoardGroup", locked);
  }, [params.id]);

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

  const clearInput = () => {
    inputRef.current!.value = "";
  };

  useIonViewWillEnter(() => {
    fetchBoardGroup();
  }, []);

  return (
    <>
      <MainMenu
        pageTitle={`${boardGroup?.name || "Board Group"}`}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle={`${boardGroup?.name || "Board Group"}`}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle={boardGroup?.name || "Board Group"}
          isWideScreen={isWideScreen}
          startLink="/board-groups"
          endLink="/board-groups/new"
        />

        <IonContent>
          {isWideScreen && (
            <h1 className="text-center text-2xl font-bold">
              {boardGroup && boardGroup.name}
            </h1>
          )}
          <IonLoading message="Please wait..." isOpen={showLoading} />
          {boardGroup && (
            <BoardGroupView
              boardGroup={boardGroup}
              showEdit={showEdit}
              showShare={true}
              currentUserTeams={currentUserTeams}
              // handleClone={handleClone}
              setShowIcon={setShowIcon}
              inputRef={inputRef}
              numOfColumns={numOfColumns}
              showLoading={showLoading}
              locked={locked}
            />
          )}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewBoardGroup;
