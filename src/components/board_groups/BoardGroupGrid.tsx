import { createRef, useEffect, useState } from "react";
import { BoardGroup } from "../../data/board_groups";
import { IonButton } from "@ionic/react";
import BoardGroupGridItem from "./BoardGroupGridItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface BoardGridProps {
  boardGroups: BoardGroup[];
}
const BoardGroupGrid = ({ boardGroups }: BoardGridProps) => {
  const { currentUser } = useCurrentUser();
  const gridRef = createRef<HTMLDivElement>();

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
            key={boardGroup.id}
          >
            <BoardGroupGridItem boardGroup={boardGroup} />
          </div>
        ))}
      {currentUser && boardGroups?.length === 0 && (
        <div className="text-center">
          <p className="text-lg">No boardGroups found</p>

          <IonButton routerLink="/board-groups/new" color="primary">
            Create a new boardGroup
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default BoardGroupGrid;
