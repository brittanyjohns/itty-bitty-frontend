import React, { useEffect, useState } from 'react';
import { IonButton, IonItem, IonList, IonLoading, IonSelect, IonSelectOption, IonText, IonToast } from '@ionic/react';
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
    const [showLoading, setShowLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const selectRef = React.useRef<HTMLIonSelectElement>(null);


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
        setShowLoading(true);
        async function addSelectedImageToBoard() {
            const response = await addImageToBoard(boardId, imageId);
            console.log('Image added to board', response);
            const message = `Image added to board: ${response['name']}`;
            setToastMessage(message);
            setShowLoading(false);
            setIsOpen(true);
            setBoardId(null);
        }
        addSelectedImageToBoard();
    }

    useEffect(() => {
        fetchBoards();
    }, []);

    return (
        <IonList>
            <IonItem lines='none' >
                <IonSelect placeholder="Select a board to add this image to" className='' name="boardId" onIonChange={(e) => handleSelectChange(e)} ref={selectRef}>
                    {boards && boards.map((board: { id: any; name: any; }) => (
                        <IonSelectOption key={board.id} value={board.id}>
                            {board.name}
                        </IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            <IonToast
                isOpen={isOpen}
                message={toastMessage}
                onDidDismiss={() => setIsOpen(false)}
                duration={2000}
            ></IonToast>
        </IonList>
    );
}
export default BoardDropdown;