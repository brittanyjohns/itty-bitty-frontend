import React, { useEffect, useState } from 'react';
import { IonItem, IonList, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { get } from 'react-hook-form';
import { addImageToBoard, getBoard, getBoards } from '../data/boards';

interface BoardDropdownProps {
    imageId: string;
}

const BoardDropdown: React.FC<BoardDropdownProps> = ({ imageId }) => {
    const [boards, setBoards] = useState([]);
    const fetchBoards = async () => {
        const allBoards = await getBoards();
        if (!allBoards) {
            console.error('Error fetching boards');
            return;
        }
        const boards = allBoards['boards']
        setBoards(boards);
    }

    const handleSelectChange = (e: CustomEvent) => {
        const boardId = e.detail.value;
        console.log('Board selected: ', boardId);
        async function addSelectedImageToBoard() {
            const response = await addImageToBoard(boardId, imageId);
            console.log('Image added to board', response);
        }
        addSelectedImageToBoard();
    }

    useEffect(() => {
        fetchBoards();
    }, []);
    return (
        <IonList>
            <IonItem>
                <IonSelect placeholder="Select a board" name="boardId" onIonChange={(e) => handleSelectChange(e)}>
                    <div slot="label">
                        Add image to:
                    </div>
                    {boards && boards.map((board: { id: any; name: any; }) => (
                        <IonSelectOption key={board.id} value={board.id}>
                            {board.name}
                        </IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
        </IonList>
    );
}
export default BoardDropdown;