import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  IonToast,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import {
  getImage,
  Image,
  ImageDoc,
  generateImage,
  deleteImage,
  removeDoc,
  setNextWords,
  create_symbol,
  cloneImage,
  uploadAudioFile,
} from "../../data/images"; // Adjust imports based on actual functions
import { markAsCurrent } from "../../data/docs"; // Adjust imports based on actual functions
import BoardDropdown from "../../components/boards/BoardDropdown";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  cloudUploadOutline,
  gridOutline,
  imagesOutline,
  lockClosed,
  lockClosedOutline,
  micCircleOutline,
  refreshCircleOutline,
  searchOutline,
  trashBinOutline,
} from "ionicons/icons";
import SideMenu from "../../components/main_menu/SideMenu";
import MainHeader from "../MainHeader";
import ImageCropper from "../../components/images/ImageCropper";
import { Board, removeImageFromBoard } from "../../data/boards";
import { generatePlaceholderImage } from "../../data/utils";
import StaticMenu from "../../components/main_menu/StaticMenu";
import Tabs from "../../components/utils/Tabs";
import AudioList from "../../components/images/AudioList";
import InputAlert from "../../components/utils/InputAlert";
import VoiceDropdown from "../../components/utils/VoiceDropdown";
import ConfirmAlert from "../../components/utils/ConfirmAlert";
import ImageSearchComponent from "../../components/admin/ImageSearchComponent";
import { set } from "d3";

const ViewImageScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [image, setImage] = useState<Image | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState<string | null>("");
  const imageGrid = useRef<HTMLDivElement>(null);
  const adminWrapper = useRef<HTMLDivElement>(null);
  const newWordInput = useRef<HTMLIonInputElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("gallery");
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const audioForm = useRef<HTMLDivElement>(null);
  const imageGridWrapper = useRef<HTMLDivElement>(null);
  const searchWrapper = useRef<HTMLDivElement>(null);
  const deleteImageWrapper = useRef<HTMLDivElement>(null);
  const [pageTitle, setPageTitle] = useState("");
  const { currentUser, isWideScreen, currentAccount, smallScreen } =
    useCurrentUser();
  const [boardId, setBoardId] = useState<string | null>(null);
  const [nextImageWords, setNextImageWords] = useState<string[]>([]);
  const [remainingBoards, setRemainingBoards] = useState<Board[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [newImageWord, setNewImageWord] = useState("");
  const [wordsToRemove, setWordsToRemove] = useState<string[]>([]);
  const [creatingSymbol, setCreatingSymbol] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Please wait...");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [shouldTriggerSearch, setShouldTriggerSearch] = useState(false);
  const [newAudioLabel, setNewAudioLabel] = useState("");
  const [newAudioFile, setNewAudioFile] = useState<any>(null);

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
  const [confirmDeleteDocMessage, setConfirmDeleteDocMessage] = useState(
    "Do you want to delete this image?"
  );
  const fetchImage = async () => {
    const img = await getImage(id);
    console.log("Image: ", img);
    setImage(img);
    setNextImageWords(img?.next_words);
    return img;
  };

  const setupData = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const boardId = urlParams.get("boardId");
    setBoardId(boardId);
    await getData();
    if (image && image.src) {
      setCurrentImage(image.src);
    }
  };

  useEffect(() => {
    setupData();
  }, []);

  useEffect(() => {
    setupData();

    if (creatingSymbol) {
      const intervalId = setInterval(() => {
        getData();
        setShowLoading(false);
        setCreatingSymbol(false);
      }, 3000); // Check every 5 seconds
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [creatingSymbol]);

  const getData = async () => {
    const imgToSet = await fetchImage();
    if (!imgToSet) {
      console.error("No image found.");
      return;
    }
    setRemainingBoards(imgToSet["remaining_boards"]);
    setUserBoards(imgToSet["user_boards"]);
    setNextImageWords(imgToSet["next_words"]);
    setImage(imgToSet);
    toggleForms(segmentType, imgToSet);

    if (!imgToSet?.src) {
      console.error("No image found.");
      const imgURl = generatePlaceholderImage(imgToSet?.label);
      setCurrentImage(imgURl);
    } else {
      setCurrentImage(imgToSet.src);
    }
  };

  const handleDeleteImage = async () => {
    if (!image) return;
    const result = await deleteImage(image.id);
    if (result["status"] === "ok") {
      history.push("/images");
    } else {
      alert("Error deleting image..\n" + result["message"]);
    }
  };

  const [showConfirmDeleteDoc, setShowConfirmDeleteDoc] = useState(false);

  const handleRemoveDoc = async () => {
    const doc = docToDelete;
    if (!doc || !image) return;

    const result = await removeDoc(image.id, doc.id);
    if (result["status"] === "ok") {
      getData();

      // return result;
    } else {
      alert("Error removing display image.\n" + result["message"]);
    }
  };

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      setupData();
    }, 3000);
  };

  const toggleForms = (segmentType: string, imgToSet?: Image) => {
    if (!imgToSet) {
      imgToSet = image ?? undefined;
    }
    const label = imgToSet?.label ?? "";
    if (segmentType === "generate") {
      setPageTitle(`Generate an Image`);
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.remove("hidden");
      imageGridWrapper.current?.classList.add("hidden");
      searchWrapper.current?.classList.add("hidden");
      deleteImageWrapper.current?.classList.add("hidden");
      audioForm.current?.classList.add("hidden");
      adminWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "upload") {
      setPageTitle(`Upload an Image`);
      uploadForm.current?.classList.remove("hidden");
      generateForm.current?.classList.add("hidden");
      searchWrapper.current?.classList.add("hidden");
      imageGridWrapper.current?.classList.add("hidden");
      deleteImageWrapper.current?.classList.add("hidden");
      audioForm.current?.classList.add("hidden");
      adminWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "gallery") {
      setPageTitle(`Gallery for ${label}`);
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      searchWrapper.current?.classList.add("hidden");
      imageGridWrapper.current?.classList.remove("hidden");
      deleteImageWrapper.current?.classList.add("hidden");
      audioForm.current?.classList.add("hidden");
      adminWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "delete") {
      setPageTitle(`Delete Image for ${label}`);
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      searchWrapper.current?.classList.add("hidden");
      imageGridWrapper.current?.classList.add("hidden");
      deleteImageWrapper.current?.classList.remove("hidden");
      audioForm.current?.classList.add("hidden");
      adminWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "search") {
      setPageTitle(`Search for Images`);
      setShouldTriggerSearch(true);
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      searchWrapper.current?.classList.remove("hidden");
      imageGridWrapper.current?.classList.add("hidden");
      deleteImageWrapper.current?.classList.add("hidden");
      audioForm.current?.classList.add("hidden");
      adminWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "audio") {
      setPageTitle(`Audio for ${label}`);
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      searchWrapper.current?.classList.add("hidden");
      imageGridWrapper.current?.classList.add("hidden");
      deleteImageWrapper.current?.classList.add("hidden");
      audioForm.current?.classList.remove("hidden");
      adminWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "admin") {
      setPageTitle(`Admin for ${label}`);
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      searchWrapper.current?.classList.add("hidden");
      imageGridWrapper.current?.classList.add("hidden");
      deleteImageWrapper.current?.classList.add("hidden");
      audioForm.current?.classList.add("hidden");
      adminWrapper.current?.classList.remove("hidden");
    }
  };

  const handleDocClick = async (e: React.MouseEvent<HTMLIonImgElement>) => {
    const target = e.target as HTMLImageElement;
    const currentImg = await markAsCurrent(target.id); // Ensure markAsCurrent returns a Promise
    const imgToSet = currentImg;
    setCurrentImage(imgToSet.src);
  };

  const handleGenerate = async () => {
    if (!image) return;
    const hasTokens = checkCurrentUserTokens(1);
    if (!hasTokens) {
      alert(
        "Sorry, you do not have enough tokens to generate an image. Please purchase more tokens to continue."
      );
      console.error("User does not have enough tokens");
      return;
    }
    const formData = new FormData();
    formData.append("id", image.id);
    formData.append("image[image_prompt]", image.image_prompt ?? "");
    setShowLoading(true);
    const updatedImage = await generateImage(formData); // Ensure generateImage returns a Promise<Image>
    if (updatedImage) {
      setTimeout(() => {
        setShowLoading(false);
        window.location.reload();
      }, 15000);
    }
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  };

  const handleNextWords = async () => {
    if (!image) return;
    const result = await setNextWords(image.id);
    if (result["next_words"]) {
      history.push(`/predictive/${image.id}`);
    } else {
      alert("Error setting next words.\n" + result["message"]);
    }
  };

  const clearInput = () => {
    if (newWordInput.current) {
      newWordInput.current.value = "";
    }
    setWordsToRemove([]);
  };

  const [newName, setNewName] = useState(image?.label ?? "");

  const handleInputChange = (str: string) => {
    setNewName(str);
    // handleCloneImage(str);
  };

  const handleCloneImage = async (name: string) => {
    console.log("Cloning image: ", image);
    console.log("New name: ", name);
    if (!image) return;
    setShowLoading(true);
    const result = await cloneImage(image.id, name);
    if (result) {
      history.push(`/images/${result.id}`);
    } else {
      alert("Error cloning image.");
    }
    setShowLoading(false);
  };
  const handleAddNextWords = async () => {
    if (!image) return;
    const newImageWords = [...nextImageWords, newImageWord];
    const result = await setNextWords(image.id, newImageWords);
    if (result["next_words"]) {
      setNewImageWord("");
      clearInput();
      getData();
    } else {
      alert("Error setting next words.\n" + result["message"]);
    }
  };

  const handleAudioDelete = (response: any) => {
    if (!response) {
      console.error("Error deleting audio file.");
      setToastMessage("Error deleting audio file.");
      setShowLoading(false);
      setShowToast(true);
      return;
    }
    setToastMessage("Audio file deleted.");
    getData();
  };

  const createSymbol = async () => {
    if (!image) return;
    setShowLoading(true);
    const result = await create_symbol(image.id);
    if (result["status"] === "ok") {
      setCreatingSymbol(true);
    } else {
      setShowLoading(false);
      alert("Error creating symbol.\n" + result["message"]);
    }
  };

  const toggleAddToRemoveList = (e: React.MouseEvent<HTMLIonTextElement>) => {
    const target = e.target as HTMLIonTextElement;
    const word = target.innerText;
    if (wordsToRemove.includes(word)) {
      const newWords = wordsToRemove.filter((w) => w !== word);
      setWordsToRemove(newWords);
    } else {
      setWordsToRemove([...wordsToRemove, word]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!image) return;
    const wordsToSet = nextImageWords.filter(
      (word) => !wordsToRemove.includes(word)
    );
    const result = await setNextWords(image.id, wordsToSet);
    if (result["next_words"]) {
      getData();
    } else {
      alert("Error setting next words.\n" + result["message"]);
    }
  };

  const renderImageUserInfo = (currentUser: any) => {
    if (currentUser?.admin) {
      return (
        <div className="w-full md:w-1/2 mx-auto">
          {(currentAccount?.id === image?.user_id || currentUser?.admin) && (
            <IonText className="text-md block">
              This image was created by:{" "}
              {image?.user?.name || image?.user?.email || image?.user?.id}
            </IonText>
          )}
          <IonText className="text-md block my-3">
            This image was created on: {image?.created_at}
          </IonText>

          {currentAccount?.id === image?.user_id ? (
            ""
          ) : (
            <IonText className="text-md block my-3">
              This image is owned by: <br></br>
              {image?.user?.name || image?.user?.email || image?.user?.id}{" "}
              {image?.user?.role === "admin" ? "(admin)" : ""}
            </IonText>
          )}
        </div>
      );
    }
  };

  const wordBgColor = (word: string) => {
    if (wordsToRemove.includes(word)) {
      return "bg-red-300";
    }
    return "bg-gray-200";
  };

  const onFileChange = (event: any) => {
    event.preventDefault();
    let file = event.target.files[0];

    console.log("File: ", file);
    setNewAudioFile(file);
  };

  const handleFile = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("audio_file", newAudioFile);
    formData.append("id", image.id);
    if (newAudioLabel !== "") {
      formData.append("file_name", newAudioLabel);
    }
    setShowLoading(true);
    const response = await uploadAudioFile(image.id, formData);
    console.log("Audio upload response: ", response);
    if (response["status"] === "ok") {
      setToastMessage("Audio file uploaded.");
      setShowLoading(false);
      setShowToast(true);
      setNewAudioLabel("");
      setNewAudioFile(null);
      getData();
    } else {
      console.log("Error uploading audio file: ", response);
      setToastMessage("Error uploading audio file.");
      setShowLoading(false);
      setShowToast(true);
    }
  };

  const handleAfterSetCurrentAudio = (response: any) => {
    if (!response) {
      console.error("Error setting current audio - no response");
      setToastMessage("Error setting current audio.");
      setShowLoading(false);
      setShowToast(true);
      return;
    }
    if (response["error"]) {
      const message = `${response["error"]}`;
      setToastMessage(message);
    }
    if (response["status"] === "ok") {
      setToastMessage(`Audio has been updated: ${response["voice"]}`);
    }
    setShowLoading(false);
    setShowToast(true);
    if (fileRef.current) {
      fileRef.current.value = "";
    }

    getData();
  };

  const handleNewAudio = (response: any, voice: string) => {
    if (!response) {
      console.error("Error adding image to voice");
      return;
    }
    if (response["error"]) {
      const message = `${response["error"]}`;
      alert(message);
      setShowLoading(false);
      return;
    }
    if (voice) {
      setShowLoading(false);
      setImage(response);
    }
  };

  const [boardToRemove, setBoardToRemove] = useState<Board | null>(null);
  const [showConfirmDeleteBoard, setShowConfirmDeleteBoard] = useState(false);

  const handleConfirmRemoveFromBoard = (board: Board) => {
    const message = `Are you sure you want to remove this image from the board: ${board.name}?`;
    setConfirmDeleteDocMessage(message);
    setBoardToRemove(board);
    setShowConfirmDeleteBoard(true);
  };

  const [showConfirmDeleteImage, setShowConfirmDeleteImage] = useState(false);

  const [docToDelete, setDocToDelete] = useState<ImageDoc | null>(null);

  const handleConfirmRemoveDoc = (doc: ImageDoc) => {
    if (doc.user_id !== currentUser?.id && !currentUser?.admin) {
      setConfirmDeleteDocMessage(
        `You do not have permission to delete this image.`
      );
      // return;
    } else {
      setConfirmDeleteDocMessage(
        `Are you sure you want to delete this image? This action cannot be undone. ${doc.id}`
      );

      setDocToDelete(doc);
    }
    setShowConfirmDeleteDoc(true);
  };

  const handleRemoveFromBoard = async () => {
    const board = boardToRemove;
    if (!board || !image) return;

    const result = await removeImageFromBoard(board.id, image.id);
    if (result["status"] === "ok") {
      getData();
    } else {
      alert("Error removing image from board");
    }
  };

  useIonViewWillEnter(() => {
    setupData();
  }, []);

  useIonViewDidLeave(() => {
    setShowLoading(false);
    setSegmentType("gallery");
    toggleForms("gallery");
  }, []);

  return (
    <>
      <SideMenu
        pageTitle="Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Images"
          isWideScreen={isWideScreen}
          startLink="/images"
          endLink="/images/add"
        />

        <IonContent className="ion-padding">
          {showToast === true && <p>true</p>}
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={2000}
          />
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent>
              <IonLoading
                className="loading-icon"
                cssClass="loading-icon"
                isOpen={showLoading}
                message={"Refreshing... Please wait."}
              />
            </IonRefresherContent>
          </IonRefresher>
          <IonHeader className="bg-inherit shadow-none">
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit"
            >
              {image?.can_edit && (
                <IonSegmentButton value="audio">
                  {!smallScreen ? (
                    <IonLabel className="text-sm md:text-md lg:text-lg">
                      Audio
                    </IonLabel>
                  ) : (
                    <IonLabel className="text-sm md:text-md lg:text-lg"></IonLabel>
                  )}
                  <IonIcon className="mt-2" icon={micCircleOutline} />
                </IonSegmentButton>
              )}
              {currentUser?.admin && (
                <IonSegmentButton value="admin">
                  {!smallScreen ? (
                    <IonLabel className="text-sm md:text-md lg:text-lg">
                      Admin
                    </IonLabel>
                  ) : (
                    <IonLabel className="text-sm md:text-md lg:text-lg"></IonLabel>
                  )}
                  <IonIcon className="mt-2" icon={lockClosedOutline} />
                </IonSegmentButton>
              )}
              <IonSegmentButton value="upload">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg">
                    Upload
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg"></IonLabel>
                )}

                <IonIcon className="mt-2" icon={cloudUploadOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="gallery">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg">
                    Gallery
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg"></IonLabel>
                )}
                <IonIcon className="mt-2" icon={imagesOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="generate">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg">
                    Generate
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg"></IonLabel>
                )}
                <IonIcon className="mt-2" icon={refreshCircleOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="search">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg">
                    Search
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg"></IonLabel>
                )}
                <IonIcon className="mt-2" icon={searchOutline} />
              </IonSegmentButton>
            </IonSegment>
          </IonHeader>
          <div className="w-full mx-auto mt-6">
            <h1 className="text-xl md:text-2xl lg:text-3xl text-center font-bold">
              {image?.label?.toUpperCase() || "no label"}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2">
            <IonCard className="p-1 border-2">
              {image?.can_edit ? (
                <div className="m-2">
                  <p className="text-md font-bold">
                    This is <i>your</i> image item.
                  </p>
                  <p className="text-sm">
                    You can edit the display image, upload your own audio,
                    change the voice, & more.
                  </p>
                </div>
              ) : (
                <p className="m-2">
                  <span className="text-sm font-bold">
                    This image is read-only. &nbsp;
                  </span>
                  <span className="text-sm">
                    You can only select a new display image but you must clone
                    it to make further changes.
                  </span>
                </p>
              )}
              {currentUser && (
                <IonButtons className="flex justify-center m-2">
                  <IonButton
                    onClick={() => setOpenAlert(true)}
                    className="text-sm"
                    fill="outline"
                    size="small"
                  >
                    Clone Image
                  </IonButton>
                  <InputAlert
                    message="Do you want to clone this image?"
                    onCanceled={() => setOpenAlert(false)}
                    openAlert={openAlert}
                    onInputChange={handleInputChange}
                    onDidDismiss={() => {
                      setOpenAlert(false);
                    }}
                    onConfirm={() => {
                      handleCloneImage(newName);
                    }}
                    initialValue={image?.label}
                  />
                  {currentUser?.id === image?.user_id && (
                    <>
                      <IonButton
                        className="mt-2 "
                        color="danger"
                        fill="outline"
                        onClick={() => setShowConfirmDeleteImage(true)}
                      >
                        Delete Image
                      </IonButton>
                      <ConfirmAlert
                        onConfirm={() => {
                          handleDeleteImage();
                        }}
                        onCanceled={() => {
                          setShowConfirmDeleteImage(false);
                        }}
                        openAlert={showConfirmDeleteImage}
                        onDidDismiss={() => {
                          setShowConfirmDeleteImage(false);
                        }}
                        message={
                          "Do you want to delete this image? This action cannot be undone."
                        }
                      />
                    </>
                  )}
                </IonButtons>
              )}
              <div className="mt-4">
                {image?.user_boards && image?.user_boards?.length > 0 && (
                  <div className="">
                    <IonText className="text-sm font-bold">
                      This image is associated with {image?.user_boards?.length}{" "}
                      of your boards:
                    </IonText>
                    <IonList>
                      {image?.user_boards?.map((board) => (
                        <IonItem
                          key={board.id}
                          lines="none"
                          className="text-sm font-bold mb-1 border rounded-lg"
                        >
                          <IonButton
                            className="text-sm font-md w-full"
                            fill="clear"
                            routerLink={`/boards/${board.id}`}
                          >
                            {" "}
                            {board.name}
                          </IonButton>
                          <IonIcon
                            icon={trashBinOutline}
                            color="danger"
                            className="hover:cursor-pointer"
                            slot="end"
                            onClick={() => handleConfirmRemoveFromBoard(board)}
                          />
                          <p className="text-xs">voice: {board.voice}</p>
                        </IonItem>
                      ))}
                    </IonList>
                  </div>
                )}
              </div>
            </IonCard>
            <div className="mt-4">
              {currentImage && image && (
                <IonImg
                  id={image.id}
                  src={currentImage}
                  alt={image.label}
                  className={`w-5/6 mx-auto ${
                    image.bg_color || "bg-white"
                  } p-1 rounded-lg shadow-md`}
                />
              )}
            </div>
            <div className="mt-10">
              {image && remainingBoards && remainingBoards.length > 0 && (
                <div className="p-2 border-2">
                  <p className="text-sm">Add this image to a board:</p>
                  <BoardDropdown imageId={image.id} boards={remainingBoards} />
                </div>
              )}
            </div>
          </div>
          <div className="w-full mx-auto mt-6">
            <h1 className="text-lg md:text-xl lg:text-2xl text-center">
              {pageTitle}
            </h1>
          </div>
          <div className="mt-2 py-3 px-1 hidden" ref={uploadForm}>
            <div className="w-full md:w-3/4 mx-auto m-2">
              {image && (
                <ImageCropper
                  existingId={image.id}
                  boardId={boardId}
                  existingLabel={image.label}
                />
              )}
            </div>
          </div>
          <div className="mt-2 hidden" ref={generateForm}>
            <IonList className="w-full md:w-3/4 lg:w-1/2 mx-auto" lines="none">
              <IonItem className="mt-2 border-2">
                <IonLoading
                  className="loading-icon"
                  cssClass="loading-icon"
                  isOpen={showLoading}
                  message={loadingMessage}
                />
                {image && (
                  <IonTextarea
                    className=""
                    placeholder="Enter prompt"
                    value={image.image_prompt}
                    onIonInput={(e: any) =>
                      setImage({ ...image, image_prompt: e.detail.value! })
                    }
                  ></IonTextarea>
                )}
              </IonItem>
              <IonItem className="mt-2">
                <IonButton className="w-full text-lg" onClick={handleGenerate}>
                  Generate Image
                </IonButton>
              </IonItem>
              <IonItem className="mt-2 font-md">
                <p className="text-sm">
                  This will generate an image based on the prompt you enter.
                </p>
              </IonItem>
              <IonItem className="mt-2 font-md">
                <p className="text-sm">This will cost you 1 token.</p>
              </IonItem>
            </IonList>
          </div>
          <div className="mt-2 hidden" ref={audioForm}>
            <div className="flex flex-col w-full md:w-3/4 mx-auto p-2 border-2">
              <h1 className="text-xl">Upload Custom Audio</h1>

              <IonInput
                placeholder="Name of audio file"
                value={newAudioLabel}
                onIonChange={(e: any) => setNewAudioLabel(e.detail.value || "")}
              ></IonInput>

              <input
                ref={fileRef}
                className="bg-inherit w-full p-2 rounded-md border border-gray-300"
                type="file"
                id="file_field"
                onChange={(ev) => onFileChange(ev)}
              />
              <IonButton
                className="mt-2"
                onClick={handleFile}
                disabled={!newAudioFile}
              >
                Upload Audio
              </IonButton>
            </div>

            {image && (
              <AudioList
                image={image}
                afterDeleteAudioFile={handleAudioDelete}
                afterSetCurrentAudio={handleAfterSetCurrentAudio}
              />
            )}
          </div>

          <div className="mt-2 hidden" ref={searchWrapper}>
            <div className="w-full md:w-3/4 mx-auto p-2">
              <h2 className="text-center">Search for images</h2>
              {image && (
                <ImageSearchComponent
                  startingQuery={image?.label}
                  imageId={image?.id}
                  triggerSearch={shouldTriggerSearch}
                />
              )}
            </div>
          </div>

          <div className="mt-2 hidden" ref={imageGridWrapper}>
            {image && image.docs && image.docs.length > 0 && (
              <div className="w-full md:w-5/6 mx-auto text-center mt-8 p-1">
                <IonLabel className="font-bold text-sm md:text-md lg:text-lg mt-2">
                  Click an image to display it for the word: "{image.label}"
                </IonLabel>
                <div
                  className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-3 p-2"
                  ref={imageGrid}
                >
                  {image?.docs &&
                    image.docs.map((doc, index) => (
                      <div
                        key={index}
                        className={` ${
                          image.bg_color || "bg-white"
                        } relative p-2 rounded-lg shadow-md`}
                      >
                        {doc.can_edit && (
                          <>
                            <IonIcon
                              icon={trashBinOutline}
                              className="absolute top-0 right-0 hover:cursor-pointer bg-white p-1 text-red-500"
                              onClick={() => handleConfirmRemoveDoc(doc)}
                            />
                          </>
                        )}
                        <IonImg
                          id={doc.id}
                          src={doc.src}
                          alt={doc.label}
                          onClick={handleDocClick}
                          className="object-contain bg-white"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
            <ConfirmAlert
              onConfirm={() => {
                handleRemoveDoc();
              }}
              onCanceled={() => {
                setShowConfirmDeleteDoc(false);
                setDocToDelete(null);
              }}
              openAlert={showConfirmDeleteDoc}
              onDidDismiss={() => {
                setShowConfirmDeleteDoc(false);
              }}
              message={confirmDeleteDocMessage}
            />
            <ConfirmAlert
              onConfirm={() => {
                handleRemoveFromBoard();
              }}
              onCanceled={() => {
                setShowConfirmDeleteBoard(false);
                setBoardToRemove(null);
              }}
              openAlert={showConfirmDeleteBoard}
              onDidDismiss={() => {
                setShowConfirmDeleteBoard(false);
              }}
              message={confirmDeleteDocMessage}
            />
          </div>
          <div className="hidden p-4" ref={adminWrapper}>
            <h1>ADMIN</h1>
            {currentUser?.admin && (
              <div className="mt-10 w-full md:w-3/4 mx-auto">
                <div className="flex justify-between">
                  {!image?.no_next && (
                    <IonButton
                      onClick={handleNextWords}
                      className="text-sm font-md"
                      slot="start"
                      fill="outline"
                    >
                      Set Next Words
                    </IonButton>
                  )}
                  <IonButton
                    routerLink={`/predictive/${image?.id}`}
                    className="text-sm font-md"
                    fill="outline"
                  >
                    View Predictive
                  </IonButton>
                  <IonButton
                    onClick={createSymbol}
                    className="text-sm font-md"
                    fill="outline"
                  >
                    Create Symbol
                  </IonButton>
                </div>
                <div className="text-sm font-md w-full">
                  {image?.image_prompt && (
                    <div className="mt-2">
                      <IonText className="text-md">Prompt:</IonText>
                      <p className="text-md">{image.image_prompt}</p>
                    </div>
                  )}
                </div>
                <div className="text-sm font-md w-full md:w-1/2 mx-auto">
                  {nextImageWords?.length > 0 && (
                    <div className="mt-2">
                      <IonText className="text-md">Next Words:</IonText>
                      <div className="flex flex-wrap">
                        {nextImageWords.map((word, index) => (
                          <div
                            key={index}
                            className={`m-1 p-2 ${wordBgColor(word)}`}
                          >
                            <IonText
                              className="text-sm hover:cursor-pointer"
                              onClick={toggleAddToRemoveList}
                            >
                              {word}
                            </IonText>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 w-full md:w-1/2 mx-auto">
                  <IonInput
                    className=""
                    ref={newWordInput}
                    placeholder="Enter word"
                    onIonInput={(e: any) =>
                      setNewImageWord(e.detail.value ?? "")
                    }
                  ></IonInput>
                  <div className="mt-2">
                    <IonButton
                      className="mt-2 w-full"
                      onClick={handleAddNextWords}
                      fill="outline"
                    >
                      Add Word
                    </IonButton>
                    <IonButton
                      className="mt-2 w-full"
                      color={"danger"}
                      onClick={handleDeleteSelected}
                      fill="outline"
                    >
                      Delete Selected
                    </IonButton>
                  </div>
                </div>
                <div className="mt-2 w-full md:w-1/2 mx-auto">
                  {image && image.display_doc && image.display_doc.src && (
                    <>
                      <IonText className="text-md">
                        This image is currently displayed as the main image.
                      </IonText>
                    </>
                  )}
                </div>
                <div className="mt-2 w-full md:w-1/2 mx-auto">
                  {image && (
                    <VoiceDropdown
                      imageId={image?.id}
                      onSuccess={handleNewAudio}
                    />
                  )}
                </div>
                <div className="mt-2 w-full md:w-1/2 mx-auto">
                  {image && (
                    <AudioList
                      image={image}
                      afterDeleteAudioFile={handleAudioDelete}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewImageScreen;
