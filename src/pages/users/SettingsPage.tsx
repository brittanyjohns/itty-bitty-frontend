import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
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
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";

const SettingsPage: React.FC = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  const [user, setUser] = useState<User | null>(currentUser || null);
  const [userSetting, setUserSetting] = useState<UserSetting | null>(null);
  const [name, setName] = useState<string | null>(currentUser?.name || null);
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [planType, setPlanType] = useState<string>("free");

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
    const planTypeToSet = currentUser?.plan_type || planType || "free";
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
      <MainMenu
        pageTitle="Pricing"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Pricing"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <MainHeader pageTitle="Pricing" isWideScreen={isWideScreen} />

      <IonPage id="main-content">
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="w-full md:w-4/5 mx-auto">
            <IonCard className="p-4 text-center w-full md:w-4/5 mx-auto">
              <h1 className="text-2xl">User Settings</h1>
              <p className="text-lg mb-3">
                This is where you can view your account information, manage your
                subscriptions, and more.
              </p>

              <UserForm user={currentUser} />
            </IonCard>
            {/* <div className="w-full md:w-2/3 mx-auto border p-4">
              <h2 className="text-2xl">Account Information</h2>
              <IonItem>
                <IonLabel>Name:</IonLabel>
                <IonInput
                  value={name}
                  placeholder="No Name Set"
                  onIonChange={(e) => setName(e.detail.value!)}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel>Email:</IonLabel>
                <IonText>{currentUser && currentUser.email}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel>Plan Type:</IonLabel>
                <IonText>{currentUser && currentUser.plan_type}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel>Trial Days Left:</IonLabel>
                <IonText>{currentUser && currentUser.trial_days_left}</IonText>
              </IonItem>
            </div> */}
            <IonCard className="p-4 w-full md:w-4/5 mx-auto">
              <UserSettingsForm
                onCancel={handleCancel}
                onSave={handleSubmit}
                existingUserSetting={currentUser?.settings}
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
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default SettingsPage;
