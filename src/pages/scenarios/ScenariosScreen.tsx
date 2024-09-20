import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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
  useIonViewWillLeave,
} from "@ionic/react";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
import { Scenario, getScenarios } from "../../data/scenarios";
import {
  addCircleOutline,
  imagesOutline,
  personOutline,
  toggle,
} from "ionicons/icons";
import ScenarioGrid from "../../components/scenarios/ScenarioGrid";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface ScenariosScreenProps {
  gridType: string;
}
// import "./ViewScenario.css";
import SideMenu from "../../components/main_menu/SideMenu";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";

const ScenariosScreen: React.FC<ScenariosScreenProps> = () => {
  const { currentAccount, currentUser, isWideScreen } = useCurrentUser();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [presetScenarios, setPresetScenarios] = useState<Scenario[]>([]);
  const [userScenarios, setUserScenarios] = useState<Scenario[]>([]);
  const [segmentType, setSegmentType] = useState("user");
  const [pageTitle, setPageTitle] = useState("Your Scenarios");

  const fetchScenarios = async () => {
    const fetchedScenarios = await getScenarios();
    console.log("fetchedScenarios", fetchedScenarios);
    setScenarios(fetchedScenarios);
    setPresetScenarios(fetchedScenarios);
    setUserScenarios(fetchedScenarios);
  };

  useIonViewWillEnter(() => {
    fetchScenarios();
    toggle(segmentType);
  });

  useIonViewWillLeave(() => {
    setSegmentType("user");
    toggle("user");
  });

  useEffect(() => {
    fetchScenarios();
    toggle(segmentType);
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      fetchScenarios();
      e.detail.complete();
    }, 3000);
  };

  const handleSegmentChange = (event: CustomEvent) => {
    const segmentValue = event.detail.value;
    setSegmentType(segmentValue);
    // setPageTitle(segmentValue === "user" ? "Your Scenarios" : "Preset Scenarios");
    toggle(segmentValue);
  };

  const toggle = (segmentType: string) => {
    if (segmentType === "user") {
      setScenarios(userScenarios);
      setPageTitle("Your Scenarios");
    } else if (segmentType === "preset") {
      setScenarios(presetScenarios);
      setPageTitle("Preset Scenarios");
    }
  };

  useEffect(() => {
    toggle(segmentType);
  }, [segmentType, userScenarios, presetScenarios]);

  const renderScenarioGrid = (scenariosToSet: Scenario[]) => {
    return <ScenarioGrid scenarios={scenariosToSet} />;
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
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle={pageTitle}
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
          endLink="/scenarios/new"
        />
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          {renderScenarioGrid(scenarios)}
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default ScenariosScreen;
