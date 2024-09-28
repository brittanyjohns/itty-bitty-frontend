import {
  IonButton,
  IonButtons,
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import TeamList from "../../components/teams/TeamList";
import SideMenu from "../../components/main_menu/SideMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getTeams } from "../../data/teams";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
const TeamsScreen: React.FC = () => {
  const { currentUser, setCurrentUser, isWideScreen, currentAccount } =
    useCurrentUser();
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
      <SideMenu
        pageTitle={pageTitle}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle={pageTitle}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle={pageTitle}
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
          endLink="/boards/new"
        />
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <TeamList teams={teams} />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default TeamsScreen;
