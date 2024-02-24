import React, { useEffect, useState, useRef } from 'react';
import { Board, getBoards } from '../data/boards';
import { IonCol, IonGrid, IonRow, IonImg, IonList } from '@ionic/react';
import '../index.css'
import BoardListItem from './BoardListItem';
const BoardList = () => {
    const gridRef = useRef(null); // Ref for the grid container
    const [boards, setBoards] = useState<Board[]>([]);

    const fetchBoards = async () => {
        console.log('fetchBoards');
        const allBoards = await getBoards();
        console.log('allBoards', allBoards);
        const boards = allBoards['boards']
        console.log('boards', boards);
        setBoards(boards);
    }

    useEffect(() => {
        fetchBoards();
    }, []);

    return (
        <div className="m-2 border-2 p-2">
            <IonList>
                {boards && boards.map((board, i) => (
                    <BoardListItem key={i} board={board} />
                ))}
            </IonList>
        </div>
    );
};

export default BoardList;
