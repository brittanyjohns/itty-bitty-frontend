import { createRef, useState } from "react";
import { BoardGroup } from "../../data/board_groups";
import { IonButton } from "@ionic/react";
import BoardGroupGridItem from "./BoardGroupGridItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface BoardGridProps {
  boardGroups: BoardGroup[];
}
const BoardGroupGrid = ({ boardGroups }: BoardGridProps) => {
  // const [boardGroupId, setBoardGroupId] = useState<string>("");
  const { currentUser } = useCurrentUser();
  const gridRef = createRef<HTMLDivElement>();

  const handleBoardGroupClick = (boardGroup: BoardGroup) => {
    console.log("BoardGroup clicked: ", boardGroup);
    // setBoardGroupId(boardGroup.id as string);
  };

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1"
      ref={gridRef}
    >
      {boardGroups &&
        boardGroups.map((boardGroup, i) => (
          <div
            id={boardGroup.id}
            className="rounded-md flex relative p-2"
            onClick={() => handleBoardGroupClick(boardGroup)}
            key={boardGroup.id}
          >
            <BoardGroupGridItem boardGroup={boardGroup} />
          </div>
        ))}
      {currentUser && boardGroups?.length === 0 && (
        <div className="text-center">
          <p className="text-lg">No boardGroups found</p>

          <IonButton routerLink="/boardGroups/new" color="primary">
            Create a new boardGroup
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default BoardGroupGrid;
