import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import TeamList from "../components/TeamList";
import MainMenu, { hideMenu } from "../components/MainMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Tabs from "../components/Tabs";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getTeams } from "../data/teams";
import {
  addCircleOutline,
  albumsOutline,
  earthOutline,
  gridOutline,
  imagesOutline,
  peopleCircleOutline,
  walkOutline,
} from "ionicons/icons";
const TeamsScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const history = useHistory();
  const [teams, setTeams] = useState([]);
  const [segmentType, setSegmentType] = useState("user");
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
      e.detail.complete();
    }, 3000);
  };

  // useIonViewWillEnter(() => {
  //   console.log("ionViewWillEnter event fired", segmentType);
  //   hideMenu();
  // });

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
