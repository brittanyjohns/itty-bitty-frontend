import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import MainMenu from "../components/MainMenu";
import Tabs from "../components/Tabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import UserSettingsForm from "../components/UserSettingsForm";
import { User, UserSetting, updateUserSettings } from "../data/users";
import { useState } from "react";
import { set } from "react-hook-form";
import UserForm from "../components/UserForm";
import { useHistory } from "react-router";

const SettingsPage: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const [user, setUser] = useState<User | null>(currentUser || null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [name, setName] = useState<string | null>(currentUser?.name || null);
  const history = useHistory();

  const loadUserSettings = () => {
    async function loadUserSettings() {
      const userSettings = currentUser?.settings;
      if (userSettings) {
        setUser(userSettings);
      }
    }
    console.log("load user settings");
  };

  const handleSubmit = (submittedFormData: FormData) => {
    console.log("handle submit: submittedFormData", submittedFormData);
    setFormData(submittedFormData);

    saveSettings(submittedFormData, `${currentUser?.id}`);
  };

  const saveSettings = async (submittedFormData: FormData, userId?: string) => {
    console.log("save submittedFormData", submittedFormData, userId);
    const result = await updateUserSettings(submittedFormData, userId);
    console.log("result", result);
    if (result) {
      console.log("settings saved");
    } else {
      console.error("error saving settings");
    }
  };

  const handleCancel = () => {
    console.log("cancel");
    history.push("/");
  };

  const handleNameChange = (name: string) => {
    setName(name);
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
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonContent fullscreen className="ion-padding">
            <IonList>
              <IonItem>
                <IonText> Name: {currentUser && currentUser.name}</IonText>
              </IonItem>
              <IonItem>
                <IonText> Email: {currentUser && currentUser.email}</IonText>
              </IonItem>
              <IonItem>
                <IonText> Role: {currentUser && currentUser.role}</IonText>
              </IonItem>
              <IonItem>
                <IonText> Tokens: {currentUser && currentUser.tokens}</IonText>
              </IonItem>
              <IonItem>
                <IonText>
                  {" "}
                  Created At: {currentUser && currentUser.created_at}
                </IonText>
              </IonItem>
              <IonItem>
                <IonText>
                  {" "}
                  Updated At: {currentUser && currentUser.updated_at}
                </IonText>
              </IonItem>
            </IonList>
            <UserSettingsForm
              onCancel={handleCancel}
              onSave={handleSubmit}
              existingUserSetting={currentUser?.settings}
            />
          </IonContent>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default SettingsPage;
