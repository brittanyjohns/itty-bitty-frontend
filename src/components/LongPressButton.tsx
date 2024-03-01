// LongPressButton.tsx
import React, { useState, useRef } from 'react';
import { IonButton } from '@ionic/react';
import ActionList from './ActionList'; // Assuming this is your action list component
import { useHistory } from 'react-router';
export interface LongPressButtonProps {
  boardId: string;
  imageId?: string;
}
const LongPressButton: React.FC<LongPressButtonProps> = ({ boardId, imageId }) => {
  const history = useHistory();
  const [showActionList, setShowActionList] = useState<boolean>(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleButtonPress = () => {
    longPressTimer.current = setTimeout(() => {
      setShowActionList(true); // Show the action list on long press
    }, 500); // 500 milliseconds threshold for long press
  };

  const handleButtonRelease = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current); // Cancel the timer if the button is released before the threshold
      longPressTimer.current = null;
    }
  };

  const handleActionSelected = (action: string) => {
    console.log(`Action selected: ${action}`);
    if (action === 'delete') {
      // Do something
    } else if (action === 'edit') {
      history.push(`/boards/${boardId}/edit`);
    }
    setShowActionList(false);
  };

  return (
    <>
      <IonButton
        onTouchStart={handleButtonPress}
        onTouchEnd={handleButtonRelease}
        onMouseDown={handleButtonPress} // For desktop
        onMouseUp={handleButtonRelease} // For desktop
        onMouseLeave={handleButtonRelease} // Cancel on mouse leave to handle edge cases
      >
        Long Press Me
      </IonButton>
      <ActionList
        isOpen={showActionList}
        onClose={() => setShowActionList(false)}
        onActionSelected={handleActionSelected}
      />
    </>
  );
};

export default LongPressButton;
