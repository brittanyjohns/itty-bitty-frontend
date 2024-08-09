import { createRef, useState } from "react";
import { ChildBoard } from "../../data/child_boards";
import { IonButton } from "@ionic/react";
import ChildBoardGridItem from "./ChildBoardGridItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface ChildBoardGridProps {
  child_boards: ChildBoard[];
  gridType?: string;
}
const ChildBoardGrid = ({ child_boards, gridType }: ChildBoardGridProps) => {
  const [boardId, setChildBoardId] = useState<string>("");
  const { currentUser } = useCurrentUser();
  const gridRef = createRef<HTMLDivElement>();

  const handleChildBoardClick = (board: ChildBoard) => {
    setChildBoardId(board.id as string);
  };

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1"
      ref={gridRef}
    >
      {child_boards &&
        child_boards.map((board, i) => (
          <div
            id={board.id}
            className="rounded-md flex relative p-2"
            onClick={() => handleChildBoardClick(board)}
            key={board.id}
          >
            <ChildBoardGridItem child_board={board} gridType={gridType} />
          </div>
        ))}
      {currentUser && child_boards?.length === 0 && (
        <div className="text-center">
          <p className="text-lg">No child_boards found</p>

          <IonButton routerLink="/child_boards/new" color="primary">
            Create a new board
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default ChildBoardGrid;
