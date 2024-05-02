import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import TeamList from "../../components/teams/TeamList";
import MainMenu from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getTeams } from "../../data/teams";
import { addCircleOutline } from "ionicons/icons";
const TeamsScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const history = useHistory();
  const [teams, setTeams] = useState([]);
  const [pageTitle, setPageTitle] = useState("Your Teams");

  const fetchTeams = async () => {
    const fetchedTeams = await getTeams();
    if (!fetchedTeams) {
      console.error("Error fetching teams");
      return;
    }
    setTeams(fetchedTeams);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      console.log("Async operation has ended");
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
            <IonTitle>Teams</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/teams/new">
                <IonIcon icon={addCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <h2 className="mb-3 text-2xl font-bold">{pageTitle}</h2>
          <TeamList teams={teams} />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default TeamsScreen;
