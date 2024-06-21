import { useEffect, useRef, useState } from "react";
import {
    Board,
    addToTeam,
    cloneBoard,
    getBoard,
    rearrangeImages,
} from "../../data/boards";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonLoading,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonToolbar,
    useIonViewDidLeave,
    useIonViewWillEnter,
} from "@ionic/react";
import { shareOutline, documentLockOutline, copyOutline, createOutline } from "ionicons/icons";
import DraggableGrid from "../images/DraggableGrid";
import AddToTeamForm from "../teams/AddToTeamForm";
import { useParams } from "react-router";

interface BoardViewProps {
    board: Board;
    showEdit: boolean;
    currentUserTeams: any;
    inputRef?: any;
    addToTeamRef?: any;
    setShowIcon: any;
    showLoading: boolean;
    imageCount?: number;
    numOfColumns: number;
    handleAddToTeam: any;
    toggleAddToTeam: any;
    handleClone?: any;
}

const BoardView: React.FC<any> = ({
    board,
    showEdit,
    currentUserTeams,
    inputRef,
    addToTeamRef,
    setShowIcon,
    showLoading,
    imageCount,
    numOfColumns,
    handleAddToTeam,
    toggleAddToTeam,
    handleClone,
}) => {

    return (
        <>
            <div className="flex justify-center items-center">
                <div ref={addToTeamRef} className="p-4 hidden">
                    {currentUserTeams && (
                        <AddToTeamForm
                            onSubmit={handleAddToTeam}
                            toggleAddToTeam={toggleAddToTeam}
                            currentUserTeams={currentUserTeams}
                        />
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center px-4">
                <IonButtons slot="end">
                    {showEdit && (
                        <IonButton onClick={toggleAddToTeam} className="mr-4">
                            <IonIcon icon={shareOutline} className="mx-2" />
                            <IonLabel>Share</IonLabel>
                        </IonButton>
                    )}
                    {board && (
                        <IonButton
                        routerLink={`/boards/${board.id}/locked`}
                        className="mr-4"
                    >
                        <IonIcon icon={documentLockOutline} className="mx-2" />
                        <IonLabel>Lock</IonLabel>
                    </IonButton>
                    )}
                    {handleClone && (
                        <IonButton onClick={handleClone} className="mr-4">
                        <IonIcon icon={copyOutline} className="mx-2" />
                        <IonLabel>Clone</IonLabel>
                    </IonButton>
                    )}
                    {board && showEdit && (
                        <IonButton
                            routerLink={`/boards/${board.id}/gallery`}
                            className="mr-4"
                        >
                            <IonIcon icon={createOutline} className="mx-2" />
                            <IonLabel>Edit</IonLabel>
                        </IonButton>
                    )}
                </IonButtons>
            </div>

            {board && (
                <DraggableGrid
                    images={board.images}
                    board={board}
                    setShowIcon={setShowIcon}
                    inputRef={inputRef}
                    columns={numOfColumns}
                    disableReorder={true}
                    mute={true}
                    viewOnClick={true}
                    showRemoveBtn={true}
                />
            )}
            {imageCount < 1 && (
                <div className="text-center pt-32">
                    <p>No images found</p>
                </div>
            )}
            {board?.parent_type === "Menu" && imageCount < 1 && (
                <div className="text-center pt-32">
                    <IonLoading
                        message="Please wait while we load your board..."
                        isOpen={showLoading}
                    />
                </div>
            )}
        </>
    );



};

export default BoardView;