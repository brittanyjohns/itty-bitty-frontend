import {
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import MainMenu from "../../components/main_menu/MainMenu";
import Tabs from "../../components/utils/Tabs";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import UserSettingsForm from "../../components/users/UserSettingsForm";
import { User, UserSetting, updateUserSettings } from "../../data/users";
import { useEffect, useState } from "react";
import UserForm from "../../components/users/UserForm";
import { useHistory } from "react-router";

const SettingsPage: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const [user, setUser] = useState<User | null>(currentUser || null);
  const [userSetting, setUserSetting] = useState<UserSetting | null>(null);
  const [name, setName] = useState<string | null>(currentUser?.name || null);
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [planType, setPlanType] = useState<string>("Free");

  const handleSubmit = (submittedUserSetting: UserSetting) => {
    console.log("handle submit: submittedUserSetting", submittedUserSetting);

    setUserSetting(submittedUserSetting);

    saveSettings(submittedUserSetting, `${currentUser?.id}`);
  };

  const saveSettings = async (
    submittedUserSetting: UserSetting,
    userId?: string
  ) => {
    console.log("save submittedUserSetting", submittedUserSetting, userId);
    const result = await updateUserSettings(submittedUserSetting, userId);
    console.log("result", result);
    if (result) {
      console.log("settings saved");
      setIsOpen(true);
      setToastMessage("Settings saved");
    } else {
      console.error("error saving settings");
      setIsOpen(true);
      setToastMessage("Error saving settings");
    }
    window.location.reload();
  };

  useEffect(() => {
    const planTypeToSet = currentUser?.plan_type || planType || "Free";
    setPlanType(planTypeToSet);
  }, [currentUser]);

  const handleCancel = () => {
    console.log("cancel");
    history.push("/");
  };

  const handleSetPlanType = (name: string) => {
    setPlanType(name);
  };

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="w-full md:w-4/5 mx-auto p-4 border mt-4">
            <IonCard className="p-4 text-center">
              <h1 className="text-2xl">User Settings</h1>
              <p className="text-lg">
                This is where you can view your account information, manage your
                subscriptions, and more.
              </p>
            </IonCard>
            <div className="w-full md:w-5/6 mx-auto p-4">
              <IonList>
                <IonItem>
                  <IonText> Name: {currentUser && currentUser.name}</IonText>
                  <IonInput
                    value={name}
                    onIonChange={(e) => setName(e.detail.value!)}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonText> Email: {currentUser && currentUser.email}</IonText>
                </IonItem>
                <IonItem>
                  <IonText>
                    {" "}
                    Role: {currentUser && (currentUser.role || "Member")}
                  </IonText>
                </IonItem>
                <IonItem>
                  <IonText>
                    {" "}
                    Tokens: {currentUser && currentUser.tokens}
                  </IonText>
                </IonItem>
                <IonItem>
                  <IonText>
                    {" "}
                    Plan: {currentUser && currentUser.plan_type}
                  </IonText>
                </IonItem>
                <IonItem>
                  <IonText>
                    {" "}
                    Created At: {currentUser && currentUser.created_at}
                  </IonText>
                </IonItem>
              </IonList>
            </div>
            <IonCard className="p-4 w-full md:w-4/5 mx-auto">
              <UserSettingsForm
                onCancel={handleCancel}
                onSave={handleSubmit}
                existingUserSetting={currentUser?.settings}
              />
            </IonCard>

            <IonCard className="p-4">
              <h1 className="text-2xl">Account Info</h1>
              <UserForm
                onCancel={handleCancel}
                onSave={handleSubmit}
                planType={planType}
                setPlanType={handleSetPlanType}
                userId={currentUser?.id}
              />
            </IonCard>
          </div>

          <IonToast
            isOpen={isOpen}
            message={toastMessage}
            onDidDismiss={() => setIsOpen(false)}
            duration={2000}
          ></IonToast>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default SettingsPage;
