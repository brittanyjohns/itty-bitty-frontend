import {
  IonItem,
  IonLabel,
  IonNote
  } from '@ionic/react';
import { Board } from '../data/boards';
import './BoardListItem.css';

interface BoardListItemProps {
  board: Board;
}

const BoardListItem: React.FC<BoardListItemProps> = ({ board }) => {
  return (
    <IonItem routerLink={`/boards/${board.id}`} detail={true}>
      <div slot="start" className="dot dot-unread"></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {board.name}
          <span className="date">
            <IonNote>{board.id}</IonNote>
          </span>
        </h2>
        <h3>{board.name}</h3>
      </IonLabel>
    </IonItem>
  );
};

export default BoardListItem;
