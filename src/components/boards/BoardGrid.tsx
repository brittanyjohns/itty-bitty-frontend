import { createRef, useEffect, useState } from "react";
import { Board } from "../../data/boards";
import { IonButton } from "@ionic/react";
import BoardGridItem from "./BoardGridItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { ChildBoard, deleteChildBoard } from "../../data/child_boards";

interface BoardGridProps {
  boards: Board[] | ChildBoard[];
  gridType?: string;
  loadBoards?: any;
  searchInput?: string;
  noBoardsMsg?: string;
}
const BoardGrid = ({
  boards,
  gridType,
  loadBoards,
  noBoardsMsg = "No boards found",
}: BoardGridProps) => {
  const { currentUser } = useCurrentUser();
  const gridRef = createRef<HTMLDivElement>();
  const [currentBoards, setCurrentBoards] = useState<any>(boards);

  const handleRemoveBoard = async (board: Board) => {
    if (!board) return;
    if (currentUser && gridType === "child") {
      try {
        await deleteChildBoard(board.id);
        const updatedBoards = boards.filter((b) => b.id !== board.id);
        setCurrentBoards(updatedBoards);
      } catch (error) {
        console.error("Error removing board: ", error);
        alert("Error removing board");
      }
    }
  };

  useEffect(() => {
    if (loadBoards) {
      loadBoards();
    }
  }, [currentBoards]);

  return (
    <>
      <div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 mb-3"
        ref={gridRef}
      >
        {boards &&
          boards.map((board, i) => (
            <div
              id={board.id}
              className="rounded-md flex relative p-2"
              key={board.id}
            >
              <BoardGridItem
                board={board}
                gridType={gridType}
                showRemoveBtn={
                  currentUser && gridType === "child" ? true : false
                }
                removeChildBoard={handleRemoveBoard}
              />
            </div>
          ))}
      </div>
      {noBoardsMsg != "" && currentUser && boards?.length === 0 && (
        <div className="w-full mx-auto text-center">
          <p className="text-lg">{noBoardsMsg}</p>
          <p className="text-sm">Create a new board to get started</p>
        </div>
      )}
    </>
  );
};

export default BoardGrid;
