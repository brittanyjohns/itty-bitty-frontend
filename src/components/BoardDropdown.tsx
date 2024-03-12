import React, { useEffect, useState } from 'react';
import { IonButton, IonItem, IonList, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { get, set } from 'react-hook-form';
import { addImageToBoard, getBoard, getBoards } from '../data/boards';
import { useHistory } from 'react-router';

interface BoardDropdownProps {
    imageId: string;
}

const BoardDropdown: React.FC<BoardDropdownProps> = ({ imageId }) => {
    const [boards, setBoards] = useState([]);
    const [boardId, setBoardId] = useState(null);
    const history = useHistory();
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
        setBoardId(boardId);
        // async function addSelectedImageToBoard() {
        //     const response = await addImageToBoard(boardId, imageId);
        //     console.log('Image added to board', response);
        // }
        // addSelectedImageToBoard();
    }

    const handleAddImage = () => {
        console.log('Add image to board', boardId);
        if (!boardId || boardId === null) {
            console.error('No board selected');
            return;
        }
        async function addSelectedImageToBoard() {
            let response = null;
            if (boardId !== null) {
                response = await addImageToBoard(boardId, imageId);
            }
            console.log('Image added to board', response);
            history.push(`/boards/${boardId}`);

        }
        addSelectedImageToBoard();
        setBoardId(null);
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
                <IonButton onClick={handleAddImage}>Add</IonButton>
            </IonItem>
        </IonList>
    );
}
export default BoardDropdown;