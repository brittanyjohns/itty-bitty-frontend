import { IonImg, IonText } from "@ionic/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import { generatePlaceholderImage } from "../../data/utils";
import { ChildBoard } from "../../data/child_boards";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface BoardListItemProps {
  child_board: ChildBoard;
  gridType?: string;
  setShowIcon?: (show: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const BoardGridItem: React.FC<BoardListItemProps> = ({
  child_board,
  gridType,
}) => {
  const { currentUser, currentAccount } = useCurrentUser();
  const history = useHistory();
  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(child_board.name),
    [child_board.name]
  );

  const handleBoardClick = (child_board: any) => {
    if (currentAccount) {
      history.push(`/child-boards/${child_board.id}`);
    }
  };

  return (
    <>
      <div
        className="cursor-pointer rounded-md w-full text-center p-1 border hover:bg-slate-200 hover:text-slate-800"
        onClick={() => handleBoardClick(child_board)}
      >
        <IonImg
          src={child_board.display_image_url || placeholderUrl}
          alt={child_board.name}
          className="ion-img-contain mx-auto"
        />
        <IonText className="text-xl">
          {child_board.name.length > 50
            ? `${child_board.name.substring(0, 50)}...`
            : child_board.name}
        </IonText>
      </div>
    </>
  );
};

export default BoardGridItem;
