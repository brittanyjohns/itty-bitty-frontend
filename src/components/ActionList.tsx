// ActionList.tsx
import React from 'react';
import { IonActionSheet } from '@ionic/react';

interface ActionListProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelected: (action: string) => void;
}

const ActionList: React.FC<ActionListProps> = ({ isOpen, onClose, onActionSelected }) => {
  return (
    <IonActionSheet
      isOpen={isOpen}
      onDidDismiss={onClose}
      buttons={[
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => onActionSelected('delete'),
        },
        {
          text: 'Edit',
          handler: () => onActionSelected('edit'),
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ]}
    />
  );
};

export default ActionList;
