// ActionList.tsx
import React from "react";
import { IonActionSheet } from "@ionic/react";
import { Image, ImageGalleryProps } from "../data/images";

interface ActionListProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelected: (action: string) => void;
}

const ActionList: React.FC<ActionListProps> = ({
  isOpen,
  onClose,
  onActionSelected,
}) => {
  const handleActionSelected = (action: string) => {
    console.log("Action selected: ", action);
    onActionSelected(action);
  };

  return (
    <IonActionSheet
      isOpen={isOpen}
      onDidDismiss={onClose}
      buttons={[
        {
          text: "Delete",
          role: "destructive",
          handler: () => handleActionSelected("delete"),
        },
        {
          text: "Edit",
          handler: () => handleActionSelected("edit"),
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ]}
    />
  );
};

export default ActionList;

// const [showActionList, setShowActionList] = useState<boolean>(false);
// const longPressTimer = useRef<NodeJS.Timeout | null>(null);

// const handleButtonPress = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
//     const boardId = (event.target as HTMLDivElement).id;
//     setBoardId(boardId);

//     longPressTimer.current = setTimeout(() => {
//         setShowActionList(true); // Show the action list on long press
//         setLeaving(true);
//     }, 500); // 500 milliseconds threshold for long press
// };

// const handleButtonRelease = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
//     if (longPressTimer.current) {
//         clearTimeout(longPressTimer.current); // Cancel the timer if the button is released before the threshold
//         longPressTimer.current = null;
//     }
// };

// const handleActionSelected = (action: string) => {
//     console.log('Action selected: ', action);
//     if (action === 'delete') {
//         if (!boardId) {
//             console.error('Board ID is missing');
//             return;
//         }
//         deleteBoard(boardId);
//         window.location.reload();
//     } else if (action === 'edit') {
//         console.log('Edit board', boardId);
//         history.push(`/boards/${boardId}/edit`);
//     }
//     // setShowActionList(false);
// };
