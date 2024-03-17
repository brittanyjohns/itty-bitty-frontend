import { useState } from 'react';
import { Board } from '../data/boards';
import { IonList, IonButton, IonItem } from '@ionic/react';
import BoardListItem from './BoardListItem';
import SignInScreen from '../pages/SignUpScreen';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface BoardListProps {
    boards: Board[];
}
const BoardList = ({ boards }: BoardListProps) => {
    const [boardId, setBoardId] = useState<string>('');
    const { currentUser, setCurrentUser } = useCurrentUser();

    const handleBoardClick = (board: Board) => {
        setBoardId(board.id as string);
    }

    return (
        <IonList className="w-full" id="board-list" lines='inset' >
            {boards && boards.map((board, i) => (
                <IonItem key={i} >
                    <div id={board.id} className='rounded-md flex relative w-full hover:cursor-pointer text-center' onClick={() => handleBoardClick(board)} key={board.id}>
                        <BoardListItem board={board} />
                    </div>
                </IonItem>
            ))}
            {currentUser && boards?.length === 0 &&
                <IonItem>
                    <div className="text-center">
                        <p>No boards found</p>
                        <IonButton routerLink="/boards/new" color="primary">Create a new board</IonButton>
                    </div>
                </IonItem>}

            {!currentUser && <SignInScreen />}
        </IonList>
    );
};

export default BoardList;
