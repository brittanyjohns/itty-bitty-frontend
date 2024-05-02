import React, { useEffect } from 'react';
import { IonLoading } from '@ionic/react';

import './main.css';
// const ActionList: React.FC<ActionListProps> = ({ isOpen, onClose, onActionSelected }) => {
interface LoadingProps {
    loadingTime: number;
    }
const Loading: React.FC<LoadingProps> = ({ loadingTime }) => {
    useEffect(() => {
        console.log('Loading useEffect', loadingTime);
    }   , []);
  return (
    <>
      <IonLoading className="custom-loading" trigger="open-loading" message="Loading" duration={loadingTime} />
    </>
  );
}

export default Loading;