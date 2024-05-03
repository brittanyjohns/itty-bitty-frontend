import { createRef, useState } from "react";
import { Board } from "../../data/boards";
import { IonGrid, IonButton, IonItem, IonText } from "@ionic/react";
import BoardGridItem from "./BoardGridItem";
import SignInScreen from "../../pages/auth/SignUpScreen";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface BoardGridProps {
  boards: Board[];
}
const BoardGrid = ({ boards }: BoardGridProps) => {
  const [boardId, setBoardId] = useState<string>("");
  const { currentUser } = useCurrentUser();
  const gridRef = createRef<HTMLDivElement>();

  const handleBoardClick = (board: Board) => {
    setBoardId(board.id as string);
  };

  const shouldDisableActionGrid = (board: Board) => {
    const isPredefined = board?.predefined === true;

    return isPredefined;
  };

  return (
    <div className="ion-padding">
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2"
        ref={gridRef}
      >
        {boards &&
          boards.map((board, i) => (
            <div
              id={board.id}
              className="rounded-md flex relative p-1"
              onClick={() => handleBoardClick(board)}
              key={board.id}
            >
              <BoardGridItem board={board} />
            </div>
          ))}
        {currentUser && boards?.length === 0 && (
          <div className="text-center">
            <p>No boards found</p>
            <IonButton routerLink="/boards/new" color="primary">
              Create a new board
            </IonButton>
          </div>
        )}

        {!currentUser && <SignInScreen />}
      </div>
    </div>
  );
};

export default BoardGrid;
