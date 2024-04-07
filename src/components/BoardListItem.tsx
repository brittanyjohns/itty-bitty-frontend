import { IonItem, IonLabel, IonText } from "@ionic/react";
import { Board } from "../data/boards";
import "./BoardListItem.css";
import { useEffect, useState } from "react";

interface BoardListItemProps {
  board: Board;
}

const BoardListItem: React.FC<BoardListItemProps> = ({ board }) => {
  const [boardDetails, setBoardDetails] = useState(board);

  useEffect(() => {
    console.log("BoardListItem useEffect", board);
    setBoardDetails(board);
  }, [board]);
  return (
    <IonItem
      className="w-full py-3"
      routerLink={`/boards/${board.id}`}
      detail={false}
      lines="none"
    >
      <IonText className="text-xl w-full font-bold">{board.name}</IonText>
    </IonItem>
  );
};

export default BoardListItem;
