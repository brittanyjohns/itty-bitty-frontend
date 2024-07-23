import { createRef, useState } from "react";
import { Board } from "../../data/boards";
import { IonButton } from "@ionic/react";
import BoardGridItem from "./BoardGridItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface BoardGridProps {
  boards: Board[];
  gridType?: string;
}
const BoardGrid = ({ boards, gridType }: BoardGridProps) => {
  const [boardId, setBoardId] = useState<string>("");
  const { currentUser } = useCurrentUser();
  const gridRef = createRef<HTMLDivElement>();

  const handleBoardClick = (board: Board) => {
    setBoardId(board.id as string);
  };

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1"
      ref={gridRef}
    >
      {boards &&
        boards.map((board, i) => (
          <div
            id={board.id}
            className="rounded-md flex relative p-2"
            onClick={() => handleBoardClick(board)}
            key={board.id}
          >
            <BoardGridItem board={board} gridType={gridType} />
          </div>
        ))}
      {currentUser && boards?.length === 0 && (
        <div className="text-center">
          <p className="text-lg">No boards found</p>

          <IonButton routerLink="/boards/new" color="primary">
            Create a new board
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default BoardGrid;
