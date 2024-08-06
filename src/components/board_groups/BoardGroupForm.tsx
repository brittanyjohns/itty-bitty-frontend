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
  IonInput,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { image } from "ionicons/icons";
interface BoardGroupFormProps {
  boardGroup?: BoardGroup | null;
  editMode?: boolean;
}
const BoardGroupForm: React.FC<BoardGroupFormProps> = ({ boardGroup }) => {
  const [boards, setBoards] = useState<Board[]>(boardGroup?.boards || []);
  const [name, setName] = useState(boardGroup?.name || "");
  const [selectedBoardIds, setSelectedBoardIds] = useState<string[]>([]);
  const history = useHistory();

  useEffect(() => {
    // fetchBoardGroups();
    fetchBoards();
    console.log("useEffect -- boardGroup: ", boardGroup);
    if (boardGroup && boardGroup?.boards) {
      const idsToSet = boardGroup.boards.map((board) => board.id);
      console.log("idsToSet: ", idsToSet);
      setSelectedBoardIds(idsToSet);
    }
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await getBoards();
      console.log("response: ", response);
      setBoards(response["boards"]);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
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
    try {
      if (boardGroup) {
        // Update board group
        await updateBoardGroup({
          ...boardGroup,
          name,
          boardIds: selectedBoardIds,
        });
        history.push(`/board-groups/${boardGroup.id}`);
        return;
      }
      const newGroup = await createBoardGroup(name, selectedBoardIds);
      setName("");
      setSelectedBoardIds([]);
      history.push(`/board-groups/${newGroup.id}`);
    } catch (error) {
      console.error("Error creating board group:", error);
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

  return (
    <div>
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
      <div className="p-3 border border-gray-300 w-full md:w-3/4 mx-auto">
        <h2 className="text-lg font-bold">Select Boards</h2>
        {boards &&
          boards.map((board) => (
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
