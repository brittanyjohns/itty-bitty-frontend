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
    <IonItem className='p-4 w-full' routerLink={`/boards/${board.id}`} detail={true}>
      <IonLabel>
        {board.name}
      </IonLabel>
        <IonNote slot="end">
        {board.id}
      </IonNote>
    </IonItem>
    <IonButton routerLink={`/boards/${board.id}/edit`} fill="clear" slot="end" color="primary">
    Edit  
  </IonButton>
  </>
  );
};

export default BoardListItem;
