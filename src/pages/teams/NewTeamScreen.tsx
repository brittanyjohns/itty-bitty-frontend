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
  IonToast,
  IonToolbar,
} from "@ionic/react";
import MainMenu from "../../components/main_menu/MainMenu";
import Tabs from "../../components/utils/Tabs";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import TeamForm from "../../components/teams/TeamForm";
import { Team, createTeam } from "../../data/teams";
import { useState } from "react";
import { set } from "react-hook-form";
import UserForm from "../../components/users/UserForm";
import { useHistory } from "react-router";

const NewTeamScreen: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [team, setTeam] = useState<Team | null>({ name: "" });

  const handleSubmit = (submittedTeamData: Team) => {
    console.log("handle submit: submittedFormData", submittedTeamData);
    saveTeam(submittedTeamData);
  };

  const saveTeam = async (teamToSet: Team) => {
    const result = await createTeam(teamToSet);
    console.log("result", result);
    if (result) {
      console.log("team saved");
      setIsOpen(true);
      setToastMessage("Team saved");
      history.push("/teams");
    } else {
      console.error("error saving team");
      setIsOpen(true);
      setToastMessage("Error saving team");
    }
  };

  const handleCancel = () => {
    console.log("cancel");
    history.push("/");
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
        <IonContent fullscreen className="ion-padding">
          <div className="w-full md:w-1/2 mx-auto">
            <TeamForm
              onCancel={handleCancel}
              onSave={handleSubmit}
              existingTeam={team}
            />
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

export default NewTeamScreen;
