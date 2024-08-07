import {
  IonActionSheet,
  IonImg,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import { BoardGroup, deleteBoardGroup } from "../../data/board_groups";
// import "./BoardListItem.css";
import { useEffect, useMemo, useRef, useState } from "react";
import ActionList from "../utils/ActionList";
import { useHistory } from "react-router";
import { generatePlaceholderImage } from "../../data/utils";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface BoardListItemProps {
  boardGroup: BoardGroup;
}

const BoardGridItem: React.FC<BoardListItemProps> = ({ boardGroup }) => {
  const { currentUser, currentAccount } = useCurrentUser();
  const [boardDetails, setBoardDetails] = useState(boardGroup);
  const [showActionList, setShowActionList] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const history = useHistory();
  const placeholderUrl = useMemo(
    () => generatePlaceholderImage(boardGroup.name),
    [boardGroup.name]
  );

  const removeBoardGroup = async (boardGroupId: string) => {
    try {
      console.log("Removing boardGroupId: ", boardGroupId);
      // Implement delete board logic
      deleteBoardGroup(boardGroupId);
    } catch (error) {
      console.error("Error removing board: ", error);
      alert("Error removing board");
    }
  };

  const handleBoardGroupClick = (boardGroup: any) => {
    console.log("BoardGroup clicked: ", boardGroup);
    if (currentAccount) {
      history.push(`/child-groups/${boardGroup.id}`);
    } else {
      history.push(`/board-groups/${boardGroup.id}`);
    }
  };
  const onClose = () => {
    setShowActionList(false);
  };

  useEffect(() => {
    setBoardDetails(boardGroup);
    if (boardGroup?.predefined) {
      setShowActionList(false);
    }
  }, [boardGroup]);
  return (
    <>
      <div
        className="cursor-pointer rounded-md w-full text-center p-1 border hover:bg-slate-200 hover:text-slate-800"
        onClick={() => handleBoardGroupClick(boardGroup)}
      >
        <IonImg
          src={boardGroup.display_image_url || placeholderUrl}
          alt={boardGroup.name}
          className="ion-img-contain mx-auto"
        />
        <IonText className="text-xl font-bold">
          {boardGroup.name.length > 50
            ? `${boardGroup.name.substring(0, 50)}...`
            : boardGroup.name}
        </IonText>
      </div>
    </>
  );
};

export default BoardGridItem;
