import { createRef, useEffect, useState } from "react";
import { Scenario, deleteScenario } from "../../data/scenarios";
import { IonButton } from "@ionic/react";
import ScenarioGridItem from "./ScenarioGridItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface ScenarioGridProps {
  scenarios: Scenario[];
  loadScenarios?: any;
}
const ScenarioGrid = ({ scenarios, loadScenarios }: ScenarioGridProps) => {
  const { currentUser } = useCurrentUser();
  const gridRef = createRef<HTMLDivElement>();
  const [currentScenarios, setCurrentScenarios] =
    useState<Scenario[]>(scenarios);

  const handleRemoveScenario = async (scenario: Scenario) => {
    console.log("remove scenario", scenario);
    if (!scenario?.id) return;
    try {
      await deleteScenario(scenario.id);
      const updatedScenarios = scenarios.filter((b) => b.id !== scenario.id);
      setCurrentScenarios(updatedScenarios);
      console.log("updatedScenarios", updatedScenarios);
    } catch (error) {
      console.error("Error removing scenario: ", error);
      alert("Error removing scenario");
    }
  };

  useEffect(() => {
    if (loadScenarios) {
      loadScenarios();
    }
  }, [currentScenarios]);

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1"
      ref={gridRef}
    >
      {scenarios &&
        scenarios.map((scenario, i) => (
          <div
            id={scenario.id}
            className="rounded-md flex relative p-2"
            key={scenario.id}
          >
            <ScenarioGridItem
              scenario={scenario}
              showRemoveBtn={currentUser?.role === "admin"}
              removeScenario={handleRemoveScenario}
            />
          </div>
        ))}
      {currentUser && scenarios?.length === 0 && (
        <div className="text-center">
          <p className="text-lg">No scenarios found</p>

          <IonButton routerLink="/scenarios/new" color="primary">
            Create a new scenario
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default ScenarioGrid;
