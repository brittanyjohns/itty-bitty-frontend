import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonText,
  IonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import {
  appsOutline,
  arrowBackCircleOutline,
  imagesOutline,
} from "ionicons/icons";
import { saveLayout, rearrangeBoards } from "../../data/board_groups";
import { Image } from "../../data/images";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import MainMenu from "../../components/main_menu/MainMenu";
import ImageCropper from "../../components/images/ImageCropper";
import ConfirmDeleteAlert from "../../components/utils/ConfirmDeleteAlert";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import {
  BoardGroup,
  deleteBoardGroup,
  getBoardGroup,
} from "../../data/board_groups";
import DraggableGroupGrid from "../../components/board_groups/DraggableGroupGrid";
import BoardGroupForm from "../../components/board_groups/BoardGroupForm";
interface EditBoardGroupProps {
  existingBoardGroup?: BoardGroup | null;
}
const EditBoardGroupScreen: React.FC<EditBoardGroupProps> = ({
  existingBoardGroup,
}) => {
  const { id } = useParams<{ id: string }>();
  const [boardGroup, setBoardGroup] = useState<BoardGroup | null>(
    existingBoardGroup || null
  );
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("edit");
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const editForm = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading boardGroup");
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  const [gridLayout, setGridLayout] = useState([]);
  const [numberOfColumns, setNumberOfColumns] = useState(4); // Default number of columns
  const [showEdit, setShowEdit] = useState(false);
  const params = useParams<{ id: string }>();
  const addToTeamRef = useRef<HTMLDivElement>(null);
  const [showIcon, setShowIcon] = useState(false);

  const initialImage = {
    id: "",
    src: "",
    label: "",
    image_prompt: "",
    audio: "",
    bg_color: "",
    layout: [],
  };
  const [image, setImage] = useState<Image | null>(initialImage);
  const checkCurrentUserTokens = (numberOfTokens: number = 1) => {
    if (
      currentUser &&
      currentUser.tokens &&
      currentUser.tokens >= numberOfTokens
    ) {
      return true;
    }
    return false;
  };

  const handleRearrangeBoards = async () => {
    setShowLoading(true);
    const updatedBoard = await rearrangeBoards(id);
    setBoardGroup(updatedBoard);
    setShowLoading(false);
    // history.push(`/boards/${boardGroup?.id}`);
    window.location.reload();
  };

  const fetchBoardGroup = async () => {
    const boardGroup = await getBoardGroup(id); // Ensure getBoardGroup is typed to return a Promise<BoardGroupGroup>
    setBoardGroup(boardGroup);
    setNumberOfColumns(boardGroup.number_of_columns || 4);
    return boardGroup;
  };

  const loadPage = async () => {
    setShowLoading(true);
    const boardToSet = await fetchBoardGroup();
    // fetchRemaining(boardToSet.id, 1);
    toggleForms(segmentType);
    const userCanEdit =
      currentUser?.role === "admin" || currentUser?.id === boardToSet.user_id;
    setShowEdit(userCanEdit);
    setShowLoading(false);
  };

  useEffect(() => {
    loadPage();
  }, []);

  const toggleForms = (segmentType: string) => {
    if (segmentType === "edit") {
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      editForm.current?.classList.remove("hidden");
    }
  };

  const handleSaveLayout = async () => {
    if (!boardGroup?.id) {
      console.error("Board Group ID is missing");
      return;
    }
    const updatedBoardGroup = await saveLayout(boardGroup.id, gridLayout);
    const message = "Group layout saved";
    setToastMessage(message);
    setIsOpen(true);
    setBoardGroup(updatedBoardGroup);
    history.push(`/board-groups/${boardGroup?.id}`);
  };

  const handleDelete = async () => {
    if (!boardGroup?.id) {
      console.error("BoardGroup ID is missing");
      return;
    }
    await deleteBoardGroup(boardGroup.id);
    window.location.href = "/board-groups";
  };

  return (
    <>
      <MainMenu
        pageTitle={`Edit ${boardGroup?.name}`}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle={`Edit ${boardGroup?.name}`}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle={`Edit ${boardGroup?.name}`}
          isWideScreen={isWideScreen}
          endIcon={imagesOutline}
          endLink={`/board-groups/${boardGroup?.id}/gallery`}
          startIcon={arrowBackCircleOutline}
          startLink={`/board-groups/${boardGroup?.id}`}
        />
        <IonContent className="ion-padding">
          <div className=" " ref={editForm}>
            <div className="w-11/12 lg:w-1/2 mx-auto">
              <div className=" mt-5 text-center">
                <IonButton
                  size="large"
                  fill="outline"
                  routerLink={`/board-groups/${id}`}
                >
                  {" "}
                  <p className="font-bold my-2">Return to group</p>
                </IonButton>
              </div>
              <h1 className="text-center text-2xl font-bold">
                Editing {boardGroup?.name || "Board Group"}
              </h1>
              {boardGroup && (
                <BoardGroupForm boardGroup={boardGroup} editMode={true} />
              )}
            </div>
            <div className="mt-6 px-4 lg:px-12">
              {boardGroup &&
                boardGroup.boards &&
                boardGroup.boards.length > 0 && (
                  <div className="">
                    <p className="text-center font-bold text-lg">
                      This group currently has {boardGroup.boards.length}{" "}
                      boards.
                    </p>
                    <p className="text-center font-bold text-md">
                      Drag and drop to rearrange the layout.
                    </p>

                    <IonButton
                      className="block my-5 w-5/6 md:w-1/3 lg:w-1/4 mx-auto text-md text-wrap"
                      onClick={handleSaveLayout}
                      size="large"
                    >
                      Save Layout
                    </IonButton>
                    {boardGroup && (
                      <DraggableGroupGrid
                        boards={boardGroup.boards}
                        boardGroup={boardGroup}
                        setShowIcon={setShowIcon}
                        onLayoutChange={setGridLayout}
                        columns={numberOfColumns}
                        disableReorder={false}
                        mute={true}
                        viewOnClick={false}
                      />
                    )}
                  </div>
                )}
              {boardGroup &&
                boardGroup.boards &&
                boardGroup.boards.length < 1 && (
                  <div className="text-center">
                    <p>No boards found</p>
                  </div>
                )}
            </div>
            <div className="flex justify-between items-center px-4 mt-4">
              <IonButton
                className="text-xs md:text-md lg:text-lg font-bold text-center my-2 cursor-pointer mx-auto text-wrap"
                onClick={handleRearrangeBoards}
              >
                <IonIcon icon={appsOutline} className="mx-2" />
                <IonLabel>Reset layout</IonLabel>
              </IonButton>
              {showEdit && (
                <ConfirmDeleteAlert
                  onConfirm={handleDelete}
                  onCanceled={() => {}}
                />
              )}
            </div>
          </div>

          <div className="mt-6 py-3 px-1 hidden text-center" ref={uploadForm}>
            <IonText className="text-lg">Upload your own image</IonText>
            {boardGroup && image && (
              <ImageCropper
                existingId={image.id}
                boardId={boardGroup.id}
                existingLabel={image.label}
              />
            )}
          </div>
          {/* <div className="mt-2 hidden" ref={generateForm}>
            <IonList className="" lines="none">
              <IonItem className="my-2">
                <IonText className="font-bold text-xl mt-2">
                  Generate an boardGroup with AI
                </IonText>
              </IonItem>

              <IonItem className="mt-2 border-2">
                {boardGroup && (
                  <IonInput
                    className=""
                    aria-label="label"
                    value={image?.label}
                    placeholder="Enter label"
                    onIonInput={handleLabelInput}
                  ></IonInput>
                )}
              </IonItem>
              <IonItem className="mt-2 border-2">
                <IonLoading
                  className="loading-icon"
                  cssClass="loading-icon"
                  isOpen={showLoading}
                  message={loadingMessage}
                />
                {boardGroup && (
                  <IonTextarea
                    className=""
                    placeholder="Enter prompt"
                    onIonInput={handleImagePromptInput}
                  ></IonTextarea>
                )}
              </IonItem>
              <IonItem className="mt-2">
                <IonButton className="w-full text-lg" onClick={handleGenerate}>
                  Generate Image
                </IonButton>
              </IonItem>
              <IonItem className="mt-2 font-mono text-center">
                <IonText className="text-md">
                  This will generate an boardGroup based on the prompt you
                  enter.
                </IonText>
              </IonItem>
              <IonItem className="mt-2 font-mono text-center text-red-400">
                <IonText className="ml-6"> It will cost 1 credit.</IonText>
              </IonItem>
            </IonList>
          </div> */}
          <IonToast
            isOpen={isOpen}
            message={toastMessage}
            onDidDismiss={() => setIsOpen(false)}
            duration={2000}
          ></IonToast>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default EditBoardGroupScreen;
