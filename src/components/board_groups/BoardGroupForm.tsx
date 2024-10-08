import React, { useState, useEffect } from "react";
import {
  getBoardGroups,
  createBoardGroup,
  BoardGroup,
  updateBoardGroup,
} from "../../data/board_groups";
import { Board, getBoards } from "../../data/boards";
import { useHistory } from "react-router";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
interface BoardGroupFormProps {
  boardGroup?: BoardGroup | null;
  editMode?: boolean;
}
const BoardGroupForm: React.FC<BoardGroupFormProps> = ({
  boardGroup,
  editMode,
}) => {
  const [boards, setBoards] = useState<Board[]>(boardGroup?.boards || []);
  const [name, setName] = useState(boardGroup?.name || "");
  const [selectedBoardIds, setSelectedBoardIds] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState(boardGroup?.number_of_columns);
  const gridSizeOptions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];
  const [predefined, setPredefined] = useState(boardGroup?.predefined || false);
  const [currentBoardGroup, setBoardGroup] = useState<BoardGroup | null>(
    boardGroup || null
  );
  const history = useHistory();
  const { currentUser } = useCurrentUser();

  const handleGridSizeChange = (event: CustomEvent) => {
    setGridSize(event.detail.value);
    handleAfterAction();
  };

  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [scenarioBoards, setScenarioBoards] = useState<Board[]>([]);
  const [presetBoards, setPresetBoards] = useState<Board[]>([]);

  const handleAfterAction = () => {
    if (!boardGroup) {
      console.error("No board found");
      return;
    }
    const updatedBoardGroup = { ...boardGroup, number_of_columns: gridSize };
    setBoardGroup(updatedBoardGroup);
  };

  useEffect(() => {
    fetchBoards();
    if (boardGroup && boardGroup?.boards) {
      const idsToSet = boardGroup.boards.map((board) => board.id);
      setSelectedBoardIds(idsToSet);
    }
  }, []);

  const fetchBoards = async () => {
    try {
      const fetchedBoards = await getBoards("", 1);
      setBoards(fetchedBoards["boards"]);
      setUserBoards(fetchedBoards["boards"]);
      setScenarioBoards(fetchedBoards["scenarios"]);
      setPresetBoards(fetchedBoards["predefined_boards"]);
      setBoards(fetchedBoards["boards"]);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleCreateBoardGroup = async () => {
    if (!name) {
      alert("Please enter a name for the board group");
      return;
    }
    if (selectedBoardIds.length === 0) {
      alert("Please select at least one board");
      return;
    }
    console.log("Creating board group with boards:", selectedBoardIds);
    try {
      if (boardGroup?.id && editMode) {
        // Update board group
        await updateBoardGroup({
          ...boardGroup,
          name,
          boardIds: selectedBoardIds,
          number_of_columns: gridSize,
          predefined,
        });
        history.push(`/board-groups/${boardGroup.id}`);
        return;
      } else {
        const newGroup = await createBoardGroup(name, selectedBoardIds);
        setName("");
        setSelectedBoardIds([]);
        if (newGroup?.id) {
          history.push(`/board-groups/${newGroup.id}`);
        } else {
          console.error("Error creating board group", newGroup);
          history.push("/board-groups");
        }
      }
    } catch (error) {
      console.error("Error creating board group:", error);
      alert(`Error creating board group: ${error}`);
      return;
    }
  };

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoardIds((prev) =>
      prev.includes(boardId)
        ? prev.filter((id) => id !== boardId)
        : [...prev, boardId]
    );
  };

  const handleNameInput = (e: CustomEvent) => {
    const value = e.detail.value;
    setName(value);
  };

  const handleCheckboxChange = (key: string, value: boolean) => {
    if (!boardGroup) {
      console.error("No board group found");
      return;
    }
    if (key === "predefined") {
      setPredefined(value);
    }
    const updatedBoardGroup = { ...boardGroup, [key]: value };
    setBoardGroup(updatedBoardGroup);
  };

  return (
    <div className="p-2 border border-gray-300 rounded-lg w-full md:w-3/4 mx-auto">
      <IonItem lines="none" className="my-2">
        <IonLabel className="text-lg mb-2 mr-2 font-bold">Group Name</IonLabel>
        <IonInput
          className="ml-3"
          aria-label="name"
          fill="outline"
          value={name}
          placeholder="Enter group name"
          onIonInput={handleNameInput}
        ></IonInput>
      </IonItem>
      {currentUser?.admin && (
        <IonItem className="mb-4">
          <IonCheckbox
            checked={predefined}
            value={predefined}
            onIonChange={(e: any) =>
              handleCheckboxChange("predefined", e.detail.checked)
            }
          />
          <label className="ml-2">Predefined</label>
        </IonItem>
      )}
      <IonItem className="mb-4">
        <IonSelect
          label="Number of Columns:"
          placeholder="Select # of columns"
          name="number_of_columns"
          className="mr-2"
          onIonChange={handleGridSizeChange}
          value={gridSize}
        >
          {gridSizeOptions.map((size) => (
            <IonSelectOption key={size} value={size}>
              {size}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <div className="w-full md:w-3/4 mx-auto">
        <h2 className="text-lg font-bold">Select Boards</h2>
        <div className="">
          <div className="">
            <h2 className="text-lg font-bold">Your Boards</h2>

            {userBoards &&
              userBoards.map((board) => (
                <div key={board.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedBoardIds.includes(board.id)}
                    onChange={() => handleBoardSelect(board.id)}
                  />
                  {board.name}
                </div>
              ))}
          </div>
          <div className="">
            <h2 className="text-lg font-bold">Preset Boards</h2>

            {presetBoards &&
              presetBoards.map((board) => (
                <div key={board.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedBoardIds.includes(board.id)}
                    onChange={() => handleBoardSelect(board.id)}
                  />
                  {board.name}
                </div>
              ))}
          </div>
        </div>
        <div className="mt-3">
          <IonButton onClick={handleCreateBoardGroup}>
            Save Board Group
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default BoardGroupForm;
