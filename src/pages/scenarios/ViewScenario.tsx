import React, { useEffect, useRef, useState } from "react";
import { Scenario, getScenario } from "../../data/scenarios";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
// import "./ViewScenario.css";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SideMenu from "../../components/main_menu/SideMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";

import MainHeader from "../MainHeader";
import ScenarioView from "../../components/scenarios/ScenarioView";
import Tabs from "../../components/utils/Tabs";
import { rearrangeImages } from "../../data/boards";
import ChatBox from "../../components/scenarios/ChatBox";
import BoardView from "../../components/boards/BoardView";
import {
  chatbubbleEllipsesOutline,
  chatbubblesOutline,
  earth,
  earthOutline,
} from "ionicons/icons";
interface ViewScenarioProps {
  mode: string;
}
const ViewScenario: React.FC<ViewScenarioProps> = ({ mode }) => {
  const [scenario, setScenario] = useState<Scenario>();
  const params = useParams<{ id: string }>();
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [numOfColumns, setNumOfColumns] = useState(4);
  const [showIcon, setShowIcon] = useState(false);
  const [board, setBoard] = useState(scenario?.board);
  const { smallScreen, mediumScreen, largeScreen, currentUser, isWideScreen } =
    useCurrentUser();
  const history = useHistory();

  const fetchScenario = async () => {
    setShowLoading(true);
    const scenario = await getScenario(params.id);
    if (!scenario) {
      console.error("Error fetching scenario");
      alert("Error fetching scenario");
      setShowLoading(false);
      return;
    }
    setScenario(scenario);
    setBoard(scenario.board);
    console.log("board", scenario.board);

    setShowEdit(scenario.can_edit || currentUser?.role === "admin");
    console.log("scenario", scenario);

    if (!board) {
      setShowLoading(false);

      return;
    }

    if (!board.layout) {
      const rearrangedBoard = await rearrangeImages(board.id);
      setBoard(rearrangedBoard);
      window.location.reload();
    } else {
      setBoard(board);
    }
    setShowLoading(false);
  };

  useEffect(() => {
    if (board) {
      if (smallScreen) setNumOfColumns(board.small_screen_columns);
      else if (mediumScreen) setNumOfColumns(board.medium_screen_columns);
      else if (largeScreen) setNumOfColumns(board.large_screen_columns);
    }
  }, [smallScreen, mediumScreen, largeScreen, board]);

  useEffect(() => {
    fetchScenario();
  }, [params.id]);

  useIonViewDidLeave(() => {
    inputRef.current?.value && clearInput();
  });

  const clearInput = () => {
    inputRef.current!.value = "";
  };

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      fetchScenario();
    }, 3000);
  };

  return (
    <>
      <SideMenu pageTitle="Scenarios" currentUser={currentUser} />
      <StaticMenu pageTitle="Scenarios" currentUser={currentUser} />
      <IonPage id="main-content">
        <MainHeader
          pageTitle={scenario?.name || "Scenario"}
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
          endLink={
            mode === "chat"
              ? `/scenarios/${scenario?.id}`
              : `/scenarios/${scenario?.id}/chat`
          }
          endIcon={mode === "chat" ? earthOutline : chatbubbleEllipsesOutline}
        />
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonLoading message="Please wait..." isOpen={showLoading} />
          {mode === "edit" && (
            <IonCard>
              <IonToolbar>
                <IonButton
                  routerLink={`/scenarios/${params.id}/edit`}
                  color="primary"
                >
                  Edit
                </IonButton>
              </IonToolbar>
            </IonCard>
          )}
          {mode === "chat" && (
            <div>
              {scenario && (
                <ChatBox scenario={scenario} setShowLoading={setShowLoading} />
              )}
            </div>
          )}

          {scenario && scenario.board && mode !== "chat" && (
            <BoardView
              board={scenario.board}
              showEdit={showEdit}
              setShowIcon={setShowIcon}
              inputRef={inputRef}
              numOfColumns={numOfColumns}
              showLoading={showLoading}
              setShowLoading={setShowLoading}
            />
          )}
          {scenario && !scenario.board && mode !== "chat" && (
            <ScenarioView
              scenario={scenario}
              showEdit={showEdit}
              showShare={true}
              setShowIcon={setShowIcon}
              inputRef={inputRef}
              numOfColumns={numOfColumns}
              showLoading={showLoading}
              setShowLoading={setShowLoading}
            />
          )}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewScenario;
