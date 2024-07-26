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
import ChildBoardDropdown from "../../components/boards/ChildBoardDropdown";
import MainMenu from "../../components/main_menu/MainMenu";
import ChildAccountForm from "../../components/childAccounts/ChildAccountForm";
import { User } from "../../data/users";

const ViewChildAccountScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childAccount, setChildAccount] = useState<ChildAccount | undefined>(
    undefined
  );
  const [segmentType, setSegmentType] = useState("childAccountTab");
  const [boards, setBoards] = useState<Board[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { currentUser } = useCurrentUser();

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
    if (currentUser) {
      fetchChildAccount();
      fetchUserBoards();
    }
  }, []);

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
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/child-accounts" />
            </IonButtons>
            <IonTitle>{childAccount?.name || "New Account"}</IonTitle>
          </IonToolbar>
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
        </IonHeader>
        <IonContent className="ion-padding" scrollY={true}>
          {segmentType === "childAccountTab" && (
            <div>
              {childAccount && (
                <div>
                  <IonList>
                    <div>
                      <IonLabel>Child's Name</IonLabel>
                      <IonText>
                        {childAccount.name || childAccount.username}
                      </IonText>
                    </div>
                    <div>
                      <IonLabel>Account Boards</IonLabel>
                      <IonText>
                        {childAccount.boards?.map((board) => (
                          <div key={board.id}>{board.name}</div>
                        ))}
                      </IonText>
                    </div>
                    <div>
                      <IonLabel># of ChildAccount Boards</IonLabel>
                      <IonText>{childAccount.boards?.length}</IonText>
                    </div>
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
      </IonPage>
    </>
  );
};

export default ViewChildAccountScreen;
