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
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { getChildAccount, ChildAccount } from "../../data/child_accounts"; // Adjust imports based on actual functions
import { Board } from "../../data/boards";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  gridOutline,
  peopleCircleOutline,
  mailOutline,
  addCircleOutline,
  pencilOutline,
} from "ionicons/icons";
import BoardGrid from "../../components/boards/BoardGrid";
import ChildBoardDropdown from "../../components/childBoards/ChildBoardDropdown";
import MainMenu from "../../components/main_menu/MainMenu";
import ChildAccountForm from "../../components/childAccounts/ChildAccountForm";
import { User } from "../../data/users";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
import Tabs from "../../components/utils/Tabs";

const ViewChildAccountScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childAccount, setChildAccount] = useState<ChildAccount | undefined>(
    undefined
  );
  const [segmentType, setSegmentType] = useState("childAccountTab");
  const [boards, setBoards] = useState<Board[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { currentUser, currentAccount, isWideScreen } = useCurrentUser();

  const fetchChildAccount = async () => {
    if (!currentUser?.id) {
      console.error("No current user");
      setLoading(false);
      return;
    }
    if (id === "new") {
      setLoading(false);
      setSegmentType("newAccountTab");
      return;
    }
    const childAccountToSet = await getChildAccount(Number(id), currentUser.id);

    if (!childAccountToSet) {
      console.error("Error fetching childAccount");
      setLoading(false);
      return;
    }
    setChildAccount(childAccountToSet);
    if (childAccountToSet?.boards) {
      setBoards(childAccountToSet.boards);
    }
    const userBoards = currentUser.boards;
    if (!userBoards) {
      console.error("Error fetching boards ");
      return;
    }
    setUserBoards(userBoards);
    setLoading(false);
  };

  const fetchUserBoards = async () => {
    const fetchedBoards = currentUser?.boards;
    setUserBoards(fetchedBoards || []);
    console.log("fetchedUserBoards", fetchedBoards);
    if (!fetchedBoards) {
      console.error("Error fetching boards");
      return;
    }
    setUserBoards(fetchedBoards);
  };

  useEffect(() => {
    fetchChildAccount();
    fetchUserBoards();
  }, []);
  useEffect(() => {
    fetchChildAccount();
    fetchUserBoards();
  }, [currentUser]);

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
  };

  const renderBoardGrid = (
    segmentType: string,
    currentUser?: User | null,
    currentAccount?: ChildAccount
  ) => {
    if (segmentType === "boardTab") {
      let gridType = "";
      let boards: any[] = []; // Replace `any` with the actual type of `boards` if known

      if (currentUser?.role === "admin") {
        gridType = "user";
        boards = currentUser.boards || [];
      } else if (currentAccount) {
        gridType = "child";
        boards = currentAccount.boards || [];
      } else {
        gridType = "user";
        boards = currentUser?.boards || [];
      }

      if (boards && boards.length > 0) {
        return (
          <div>
            <IonLabel>Boards</IonLabel>
            <BoardGrid boards={boards} gridType={gridType} />
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <>
        <MainMenu />
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
      <MainMenu
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

        <IonContent className="ion-padding" scrollY={true}>
          {childAccount && (
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit"
            >
              <IonSegmentButton value="childAccountTab">
                <p className="text-xl">
                  <IonIcon
                    icon={peopleCircleOutline}
                    className="text-2xl mt-3 mb-2"
                  />
                </p>
              </IonSegmentButton>
              <IonSegmentButton value="boardTab">
                <p className="text-xl">
                  <IonIcon icon={gridOutline} />
                </p>
              </IonSegmentButton>
              <IonSegmentButton value="newAccountTab">
                <p className="text-xl">
                  <IonIcon
                    icon={childAccount ? pencilOutline : addCircleOutline}
                    className="text-2xl mt-3 mb-2"
                  />
                </p>
              </IonSegmentButton>
            </IonSegment>
          )}
          {segmentType === "childAccountTab" && (
            <div className="mt-4">
              <h1 className="text-2xl text-center">
                {childAccount?.name || childAccount?.username}'s Account
              </h1>
              {childAccount && (
                <div className="w-full md:w-5/6 mx-auto">
                  <IonList>
                    <IonItem className="flex justify-between">
                      <IonLabel className="text-2xl"> Name</IonLabel>
                      <IonText>{childAccount.name}</IonText>
                    </IonItem>
                    <IonItem className="flex justify-between">
                      <IonLabel className="text-2xl"> Username</IonLabel>
                      <IonText>{childAccount.username}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel># of Boards</IonLabel>
                      <IonText>{childAccount.boards?.length}</IonText>
                    </IonItem>
                    <IonItem lines="none" className="mt-4">
                      <h1 className="text-sm md:text-md text-center">
                        Select which boards this account can access
                      </h1>
                    </IonItem>
                    <ChildBoardDropdown
                      childAccount={childAccount}
                      boards={userBoards}
                      onSuccess={fetchChildAccount}
                    />
                  </IonList>
                </div>
              )}
            </div>
          )}
          {renderBoardGrid(segmentType, currentUser, childAccount)}
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
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewChildAccountScreen;
