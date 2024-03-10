import {
  IonButton,
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
    <>
    <IonItem className='p-4 w-full' routerLink={`/boards/${board.id}`} detail={false} lines="none">
      <IonNote slot="start">
        {board.id}
      </IonNote>
      <IonLabel>
        {board.name}
      </IonLabel>
    </IonItem>
    <IonButton routerLink={`/boards/${board.id}/edit`} fill="clear" slot="end" color="primary">
    Edit  
  </IonButton>
  </>
  );
};

export default BoardListItem;
