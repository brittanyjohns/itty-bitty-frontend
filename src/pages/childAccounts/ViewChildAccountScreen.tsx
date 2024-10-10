import React, { useState, useEffect } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonLabel,
  IonItem,
  IonInput,
  IonInputPasswordToggle,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { getChildAccount, ChildAccount } from "../../data/child_accounts"; // Adjust imports based on actual functions
import { Board } from "../../data/boards";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  gridOutline,
  peopleCircleOutline,
  addCircleOutline,
  createOutline,
  barChartOutline,
} from "ionicons/icons";
import BoardGrid from "../../components/boards/BoardGrid";
import ChildBoardDropdown from "../../components/childBoards/ChildBoardDropdown";
import SideMenu from "../../components/main_menu/SideMenu";
import ChildAccountForm from "../../components/childAccounts/ChildAccountForm";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
import Tabs from "../../components/utils/Tabs";
import WordCloudChart from "../../components/utils/WordCloudChart";
import { WordEvent, fetchWordEventsByAccountId } from "../../data/word_event";
import WordNetworkGraph from "../../components/utils/WordNetworkGraph";
import { ChildBoard } from "../../data/child_boards";
import { getCurrentUser } from "../../data/users";
import { set } from "d3";

const ViewChildAccountScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childAccount, setChildAccount] = useState<ChildAccount | undefined>(
    undefined
  );
  const [segmentType, setSegmentType] = useState("childAccountTab");
  const [boards, setBoards] = useState<ChildBoard[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [wordEvents, setWordEvents] = useState<WordEvent[]>([]);
  const { currentUser, currentAccount, isWideScreen, setCurrentUser } =
    useCurrentUser();

  const fetchChildAccount = async () => {
    if (id === "new") {
      setLoading(false);
      setSegmentType("newAccountTab");
      return;
    }

    let childAccountToSet: ChildAccount | undefined = undefined;

    childAccountToSet = await getChildAccount(Number(id), currentUser?.id || 0);

    setChildAccount(childAccountToSet);
    if (childAccountToSet?.boards) {
      setBoards(childAccountToSet.boards);
    }
    const userBoards = currentUser?.boards || [];

    setUserBoards(userBoards);
  };

  const reloadCurrentUserData = async () => {
    setLoading(true);
    const refreshedUser = await getCurrentUser();

    if (refreshedUser) {
      console.log("Refreshed User: ", refreshedUser);
      setCurrentUser(refreshedUser);
      const fetchedBoards = refreshedUser?.boards;
      const remainingBoards = fetchedBoards?.filter((board: Board) => {
        return !boards.some((b) => b.board_id === board.id);
      });
      setUserBoards(remainingBoards || []);
    }
    setLoading(false);
  };

  const fetchUserBoards = async () => {
    const fetchedBoards = currentUser?.boards;
    const remainingBoards = fetchedBoards?.filter((board) => {
      return !boards.some((b) => b.board_id === board.id);
    });
    setUserBoards(remainingBoards || []);
  };

  useEffect(() => {
    setLoading(true);
    fetchUserBoards();
    setLoading(false);
  }, [boards]);

  const loadWordEvents = async () => {
    let events: WordEvent[] = [];

    events = await fetchWordEventsByAccountId(Number(id));
    setWordEvents(events);
  };

  useEffect(() => {
    setLoading(true);
    fetchChildAccount();
    fetchUserBoards();
    loadWordEvents();
    setLoading(false);
  }, []);

  useIonViewWillEnter(() => {
    console.log("View Will Enter");
    fetchChildAccount();
    fetchUserBoards();
    loadWordEvents();
  }, []);

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
  };

  if (loading) {
    return (
      <>
        <SideMenu />
        <IonPage id="main-content">
          <IonHeader className="bg-inherit shadow-none">
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/child-accounts" />
              </IonButtons>
              <IonTitle>Loading...</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding" scrollY={true}>
            <IonSpinner />
          </IonContent>
        </IonPage>
      </>
    );
  }

  return (
    <>
      <SideMenu
        pageTitle="Accounts"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Accounts"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Accounts"
          isWideScreen={isWideScreen}
          startLink="/child-accounts"
        />

        <IonContent>
          {childAccount && (
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit"
            >
              <IonSegmentButton value="gallery">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Stats
                </IonLabel>
                <IonIcon className="mt-2" icon={barChartOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="childAccountTab">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Account
                </IonLabel>
                <IonIcon className="mt-2" icon={peopleCircleOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="boardTab">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Boards
                </IonLabel>
                <IonIcon className="mt-2" icon={gridOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="newAccountTab">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Edit
                </IonLabel>
                <IonIcon
                  className="mt-2"
                  icon={childAccount ? createOutline : addCircleOutline}
                />
              </IonSegmentButton>
            </IonSegment>
          )}
          {segmentType === "childAccountTab" && (
            <div className="pt-4">
              {childAccount && (
                <div className="w-full md:w-2/3 mx-auto p-4 border mt-4">
                  <IonList className="p-4">
                    <IonItem className="flex justify-between">
                      <IonLabel className="text-2xl"> Name</IonLabel>
                      <IonText>{childAccount.name}</IonText>
                    </IonItem>
                    <IonItem className="flex justify-between">
                      <IonLabel className="text-2xl"> Username</IonLabel>
                      <IonText>{childAccount.username}</IonText>
                    </IonItem>

                    <IonItem>
                      <IonInput
                        type="password"
                        label="Passcode"
                        labelPlacement="stacked"
                        value={childAccount.passcode}
                      >
                        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                      </IonInput>
                    </IonItem>
                  </IonList>
                </div>
              )}
            </div>
          )}
          {segmentType === "boardTab" && (
            <div className="mt-4">
              {userBoards.length > 0 && (
                <>
                  <div className="flex justify-center">
                    <h1 className="text-lg md:text-xl text-center">
                      Select which boards this account can access
                    </h1>
                  </div>
                  <div className="w-full md:w-1/2 mx-auto">
                    {childAccount && (
                      <ChildBoardDropdown
                        childAccount={childAccount}
                        boards={userBoards}
                        onSuccess={fetchChildAccount}
                      />
                    )}
                  </div>
                </>
              )}

              {userBoards.length === 0 && (
                <div className="w-full mx-auto text-center">
                  <p className="text-lg">All boards are already assigned</p>
                  <p className="text-sm">
                    Create a new board to assign to this account
                  </p>
                  <IonButton
                    className="mt-4"
                    color={"success"}
                    onClick={() => history.push("/boards/new")}
                  >
                    Create New Board
                  </IonButton>
                </div>
              )}
              <div className="mt-4 w-full p-4 md:w-3/4 mx-auto">
                {boards.length > 0 && (
                  <h1 className="text-2xl text-center mt-4">
                    Currently Assigned Boards
                  </h1>
                )}
                <BoardGrid
                  boards={boards}
                  gridType="child"
                  loadBoards={fetchChildAccount}
                />
              </div>
            </div>
          )}
          {segmentType === "newAccountTab" && (
            <div className="p-4 text-center">
              {childAccount ? (
                <h1 className="text-2xl">Edit child account</h1>
              ) : (
                <>
                  <h1 className="text-2xl">Create a new child account</h1>
                  <p className="text-sm mt-2">
                    Create child accounts to allow your children to use
                    SpeakAnyWay in a way that's safe and secure.
                  </p>
                </>
              )}

              {currentUser && (
                <ChildAccountForm
                  currentUser={currentUser}
                  existingChildAccount={childAccount}
                />
              )}
            </div>
          )}
          {segmentType === "gallery" && (
            <div className="ion-padding border">
              <div className="flex flex-col justify-center items-center text-center">
                <div className="text-2xl text-gray-500">
                  <p className="text-sm">Word Events & Word Relationships</p>
                  🚧{" "}
                  <span className="text-md font-mono">
                    Under Construction
                  </span>{" "}
                  🚧
                </div>
                <div className="text-center mt-4">
                  <p className="text-2xl font-bold">What are Word Events?</p>
                  <p className="text-sm">
                    Word Events are a collection of words that are spoken by
                    users.
                  </p>
                  <p className="text-sm">
                    They're used to generate Word Clouds and Word Relationships.
                  </p>
                </div>
              </div>
              {loading && <IonSpinner />}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="overflow-hidden">
                  <h1 className="text-2xl mt-4">Word Usage Cloud</h1>
                  <WordCloudChart wordEvents={wordEvents} />
                </div>

                <div className="border ion-padding">
                  <h1 className="text-2xl mt-4">Word Relationships </h1>

                  <WordNetworkGraph wordEvents={wordEvents} />
                </div>
              </div>
            </div>
          )}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewChildAccountScreen;
