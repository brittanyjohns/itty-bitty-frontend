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
    <IonItem routerLink={`/boards/${board.id}`} detail={true} className='p-4 w-full'>
      <IonLabel>
        {board.name}
      </IonLabel>
    </IonItem>
  );
};

export default BoardListItem;
