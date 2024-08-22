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
import MainMenu from "../../components/main_menu/MainMenu";
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

  const renderScenarioGrid = (gridType: string, scenariosToSet: Scenario[]) => {
    if (gridType === "preset" && presetScenarios.length === 0) {
      return (
        <>
          <div className="flex flex-col items-center justify-center my-5">
            <p className="text-xl font-semibold">No preset scenarios found.</p>
          </div>
        </>
      );
    }

    if (scenariosToSet && scenariosToSet?.length > 0) {
      return <ScenarioGrid gridType={gridType} scenarios={scenariosToSet} />;
    } else if (scenariosToSet?.length === 0 && gridType === "user") {
      return (
        <>
          <div className="flex flex-col items-center justify-center my-5">
            <p className="text-2xl font-semibold m-4">
              You have no scenarios yet. Create one now!
            </p>
            <p className="text-lg w-3/4 text-center mb-5 md:w-1/2 font-md">
              Scenarios are collections of images with natural language labels
              that can be used to communicate with others.{" "}
            </p>
            <p className="text-xl text-center w-3/4 md:w-1/2 font-semibold my-4">
              They simpliest way to get started is by choosing a{" "}
              <span
                onClick={() => setSegmentType("preset")}
                className="font-bold text-blue-500 cursor-pointer"
              >
                preset scenario
              </span>
              , cloning it, and then editing it to suit your needs.
            </p>
            <p className="text-lg text-center w-3/4 md:w-1/2 font-md my-4">
              You can also create a scenario from scratch by clicking the button
              below.
            </p>
            <IonButton
              routerLink="/scenarios/new"
              className="mt-3"
              fill="solid"
              size="large"
              color="primary"
            >
              <IonIcon icon={addCircleOutline} slot="start" />
              Create Scenario
            </IonButton>
          </div>
        </>
      );
    }
  };
  return (
    <>
      <MainMenu
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
          <div className="bg-inherit shadow-none w-full md:w-2/3 lg:w-1/2 mx-auto ">
            {currentUser && (
              <IonSegment
                value={segmentType}
                onIonChange={handleSegmentChange}
                className="w-full bg-inherit"
              >
                <IonSegmentButton value="preset">
                  <IonLabel className="text-sm lg:text-md mb-2">
                    Preset
                  </IonLabel>
                  <IonIcon icon={imagesOutline} size="small" className="mt-2" />
                </IonSegmentButton>
                <IonSegmentButton value="user">
                  <IonLabel className="text-sm lg:text-md mb-2">
                    Your Scenarios
                  </IonLabel>
                  <IonIcon icon={personOutline} size="small" className="mt-2" />
                </IonSegmentButton>
              </IonSegment>
            )}
          </div>
          {segmentType === "user" && renderScenarioGrid("user", scenarios)}

          {segmentType === "preset" &&
            renderScenarioGrid("preset", presetScenarios)}
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default ScenariosScreen;
