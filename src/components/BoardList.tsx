import React, { useEffect, useState, useRef } from 'react';
import { Board, deleteBoard, getBoards } from '../data/boards';
import { IonList, IonButton, IonItem } from '@ionic/react';
// import '../index.css'
import BoardListItem from './BoardListItem';
import { useHistory } from 'react-router';
import ActionList from './ActionList';
// import { User, getCurrentUser, isUserSignedIn } from '../data/users';
import SignInScreen from '../pages/SignUpScreen';
import { useCurrentUser } from '../hooks/useCurrentUser';
const BoardList = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [boardId, setBoardId] = useState<string>('');
    const [leaving, setLeaving] = useState<boolean>(false);
    const { currentUser, setCurrentUser } = useCurrentUser();

    const fetchBoards = async () => {
        const allBoards = await getBoards();
        if (!allBoards) {
            console.error('Error fetching boards');
            return;
        }
        const boards = allBoards['boards']
        setBoards(boards);
    }

    useEffect(() => {
        fetchBoards();
    }, []);

    const history = useHistory();
    const [showActionList, setShowActionList] = useState<boolean>(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handleButtonPress = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        console.log('Buttone Press', (event.target as HTMLDivElement));
        const boardId = (event.target as HTMLDivElement).id;
        setBoardId(boardId);

        longPressTimer.current = setTimeout(() => {
            setShowActionList(true); // Show the action list on long press
            setLeaving(true);
        }, 500); // 500 milliseconds threshold for long press
    };

    const handleButtonRelease = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current); // Cancel the timer if the button is released before the threshold
            longPressTimer.current = null;
        }
    };

    const handleActionSelected = (action: string) => {
        console.log('Action selected: ', action);
        if (action === 'delete') {
            if (!boardId) {
                console.error('Board ID is missing');
                return;
            }
            deleteBoard(boardId);
            window.location.reload();
        } else if (action === 'edit') {
            history.push(`/boards/${boards}/edit`);
        }
        // setShowActionList(false);
    };

    const handleBoardClick = (board: Board) => {
        history.push(`/boards/${board.id}`);
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const boardId = (event.target as HTMLDivElement).id;
        if (!boardId) {
            return;
        }
        setBoardId(boardId);
    }

    return (
        <div className="w-full p-2">
            <IonList className="w-full">
                {boards && boards.map((board, i) => (
                    <IonItem key={i} onClick={() => handleBoardClick(board)}>
                        <div id={board.id} className='rounded-md flex relative w-full hover:cursor-pointer text-center' onClick={() => handleBoardClick(board)} key={board.id}
                            onTouchStart={(e) => handleButtonPress(e)}
                            onPointerDown={(e) => handlePointerDown(e)}
                            onTouchEnd={(e) => handleButtonRelease(e)}
                            onMouseDown={(e) => handleButtonPress(e)} // For desktop
                            onMouseUp={handleButtonRelease} // For desktop
                            onMouseLeave={handleButtonRelease} // Cancel on mouse leave to handle edge cases
                        >
                            <BoardListItem board={board} />
                            <ActionList
                                isOpen={showActionList}
                                onClose={() => setShowActionList(false)}
                                onActionSelected={(action: string) => handleActionSelected(action)}
                            />
                        </div>
                    </IonItem>
                ))}
                {currentUser && boards?.length === 0 &&
                    <div className="text-center">
                        <p>No boards found</p>
                        <IonButton routerLink="/boards/new" color="primary">Create a new board</IonButton>
                    </div>}

                {!currentUser && <SignInScreen />}
            </IonList>
        </div>
    );
};

export default BoardList;
