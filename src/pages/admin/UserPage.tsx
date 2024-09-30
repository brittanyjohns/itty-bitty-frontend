import {
  IonCard,
  IonContent,
  IonItem,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToast,
} from "@ionic/react";
import SideMenu from "../../components/main_menu/SideMenu";
import Tabs from "../../components/utils/Tabs";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  User,
  UserSetting,
  getUser,
  adminUpdateUserSettings,
} from "../../data/users";
import { useEffect, useState } from "react";
import UserForm from "../../components/users/UserForm";
import { useHistory, useParams } from "react-router";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import AdminUserSettingsForm from "../../components/admin/AdminUserSettingsForm";

const UserPage: React.FC = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  //   const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [planType, setPlanType] = useState<string>("free");

  const loadData = async () => {
    console.log("loadData - UserPage");
    let id = userId;
    console.log("user id", userId);
    if (!userId) {
      console.log("no user id found, checking url");
      const queryString = window.location.pathname;
      const urlParams = queryString.split("/");

      id = urlParams[3];
      if (!id) {
        console.error("No user id found from url");
        return;
      }
    } else {
      console.log("user id found", userId);
      id = userId;
    }
    console.log("loading data for user id", id);
    setUserId(id);
    const user = await getUser(id);
    setUser(user);
  };

  useEffect(() => {
    console.log("useEffect - UserPage - loadData");
    loadData();
  }, []);

  const saveSettings = async (
    submittedUserSetting: UserSetting,
    userId: string
  ) => {
    const result = await adminUpdateUserSettings(submittedUserSetting, userId);
    console.log("result", result);
    if (result) {
      setIsOpen(true);
      setToastMessage("Settings saved");
    } else {
      console.error("error saving settings");
      setIsOpen(true);
      setToastMessage("Error saving settings");
    }
    loadData();
    // window.location.reload();
  };

  useEffect(() => {
    const planTypeToSet = user?.plan_type || planType || "free";
    setPlanType(planTypeToSet);
  }, [user]);

  const handleCancel = () => {
    console.log("cancel");
    history.push("/");
  };

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <SideMenu
        pageTitle="Settings"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Settings"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Settings"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="w-full md:w-4/5 mx-auto">
            <IonCard className="p-4 text-center w-full md:w-4/5 mx-auto">
              <h1 className="text-2xl">
                Admin User Settings for {user?.name || user?.email}
              </h1>

              <UserForm user={user} />
            </IonCard>

            <IonCard className="p-4 w-full md:w-4/5 mx-auto">
              <AdminUserSettingsForm
                onCancel={handleCancel}
                onSave={saveSettings}
                existingUserSetting={user?.settings}
                userId={userId || ""}
              />
            </IonCard>
          </div>

          <div className="flex flex-col items-center">
            <IonCard className="p-4 w-full md:w-4/5 mx-auto">
              <h1 className="text-2xl">User Boards</h1>
              <div className="flex flex-col items-center">
                {user?.boards && (
                  <div className="flex flex-col items-center">
                    {user.boards.map((board) => (
                      <div key={board.id} className="p-2">
                        <IonItem
                          lines="none"
                          button
                          onClick={() => history.push(`/board/${board.id}`)}
                        >
                          {board.name}
                        </IonItem>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </IonCard>
          </div>

          <IonToast
            isOpen={isOpen}
            message={toastMessage}
            onDidDismiss={() => setIsOpen(false)}
            duration={2000}
          ></IonToast>
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default UserPage;
